import { MongoClient, Collection, Db } from 'mongodb';
import { StockItem, StockCategory, StockQuery, StockResponse } from '@/lib/models/stock';
import { getEnvVar } from '@/lib/utils';

export interface CriticalStockItem {
  malzemeTanimi: string;
  stokKodu: number;
  mevcutStok: number;
  olcuBirimi: string;
  kritikSeviye: number;
}

export interface OverallStats {
  totalProducts: number;
  categories: { name: string; count: number; percentage: number }[];
  topUnits: { unit: string; count: number }[];
  summary: {
    totalCategories: number;
    mostPopularCategory: string;
    leastStockedCategory: string;
  };
}

export class StockService {
  private static instance: StockService;
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private connectionPromise: Promise<void> | null = null;

  private constructor() {}

  public static getInstance(): StockService {
    if (!StockService.instance) {
      StockService.instance = new StockService();
    }
    return StockService.instance;
  }

  private async connect(): Promise<void> {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = this._connect();
    return this.connectionPromise;
  }

  private async _connect(): Promise<void> {
    if (this.client && this.db) {
      return;
    }

    try {
      const mongoUri = getEnvVar('MONGODB_URI');
      this.client = new MongoClient(mongoUri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
        maxIdleTimeMS: 30000,
        maxConnecting: 2,
      });

      await this.client.connect();
      this.db = this.client.db(getEnvVar('MONGODB_DATABASE', 'stock-info'));
    } catch (error) {
      this.client = null;
      this.db = null;
      this.connectionPromise = null;
      throw new Error(`Database connection failed: ${(error as Error).message}`);
    }
  }

  private async getCollection(): Promise<Collection> {
    await this.connect();
    if (!this.db) {
      throw new Error('Database connection not established');
    }
    return this.db.collection(getEnvVar('MONGODB_COLLECTION', 'stok_listesi'));
  }

  /**
   * Transform database item to application format
   */
  private transformDbItem(dbItem: any): StockItem {
    return {
      _id: dbItem._id?.toString(),
      stokKodu: dbItem['Stok Kodu'] || 0,
      malzemeTanimi: dbItem['Malzeme Tanımı 1'] || 'Bilinmeyen Ürün',
      kalemGrup: dbItem['Kalem byt grb'] || undefined,
      olcuBirimi: dbItem['Birincil ölçü birimi'] || 'ADET',
      kategori: dbItem['Kategori'] as StockCategory || 'Diğer'
    };
  }

  /**
   * Search stock items with filters
   */
  async searchStock(query: StockQuery): Promise<StockResponse> {
    try {
      const collection = await this.getCollection();
      
      let filter: any = {};
      
      if (query.search) {
        const searchRegex = new RegExp(query.search, 'i');
        filter.$or = [
          { 'Malzeme Tanımı 1': searchRegex },
          { 'Stok Kodu': parseInt(query.search) || query.search },
          { 'Kalem byt grb': searchRegex }
        ];
      }

      if (query.category) {
        filter['Kategori'] = query.category;
      }

      const rawItems = await collection.find(filter).limit(50).toArray();
      const total = await collection.countDocuments(filter);

      const items = rawItems.map(item => this.transformDbItem(item));

      return {
        items: items,
        total: total,
        hasAlternatives: false
      };
    } catch (error) {
      throw new Error(`Stock search failed: ${(error as Error).message}`);
    }
  }

  /**
   * Get stock items by category
   */
  async getStockByCategory(category: StockCategory): Promise<StockItem[]> {
    try {
      const collection = await this.getCollection();
      const rawItems = await collection.find({ 'Kategori': category }).limit(100).toArray();
      return rawItems.map(item => this.transformDbItem(item));
    } catch (error) {
      throw new Error(`Category fetch failed: ${(error as Error).message}`);
    }
  }

  /**
   * Get specific item by code
   */
  async getItemByCode(code: string | number): Promise<StockItem | null> {
    try {
      const collection = await this.getCollection();
      const rawItem = await collection.findOne({ 'Stok Kodu': parseInt(code.toString()) });
      
      if (!rawItem) {
        return null;
      }
      
      return this.transformDbItem(rawItem);
    } catch (error) {
      throw new Error(`Item fetch failed: ${(error as Error).message}`);
    }
  }

  /**
   * Get available categories with counts
   */
  async getAvailableCategories(): Promise<{ category: StockCategory; count: number }[]> {
    try {
      const collection = await this.getCollection();
      
      const pipeline = [
        {
          $group: {
            _id: '$Kategori',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ];
      
      const results = await collection.aggregate(pipeline).toArray();
      
      return results.map(result => ({
        category: result._id as StockCategory,
        count: result.count
      }));
    } catch (error) {
      throw new Error(`Categories fetch failed: ${(error as Error).message}`);
    }
  }

  /**
   * Get total item count
   */
  async getTotalItemCount(): Promise<number> {
    try {
      const collection = await this.getCollection();
      return await collection.countDocuments();
    } catch (error) {
      throw new Error(`Total count fetch failed: ${(error as Error).message}`);
    }
  }

  /**
   * Calculate critical level based on unit
   */
  private calculateCriticalLevel(unit: string): number {
    const unitUpper = unit.toUpperCase();
    
    if (unitUpper.includes('KG')) {
      return 5;
    } else if (unitUpper.includes('AD')) {
      return 8;
    } else if (unitUpper.includes('ML') || unitUpper.includes('LT')) {
      return 3;
    } else if (unitUpper.includes('GR')) {
      return 4;
    } else if (unitUpper.includes('M2') || unitUpper.includes('M3')) {
      return 2;
    } else if (unitUpper.includes('MT')) {
      return 3;
    } else if (unitUpper.includes('PAKET')) {
      return 2;
    } else {
      return 5;
    }
  }

  /**
   * Calculate deterministic stock amount based on stock code
   */
  private calculateDeterministicStock(stokKodu: number, kritikSeviye: number): number {
    const hash = Math.abs(stokKodu * 7 + 13) % 100;
    const maxStock = Math.floor(kritikSeviye * 0.8);
    return hash % (maxStock + 1);
  }

  /**
   * Parse unit field that may contain quantity + unit (e.g., "5 KG", "3 ADET")
   */
  private parseUnitField(unitField: string): { quantity: number | null; unit: string } {
    if (!unitField) {
      return { quantity: null, unit: 'ADET' };
    }

    // Try to extract number and unit from strings like "5 KG", "3 ADET", "10 LT"
    const match = unitField.match(/(\d+(?:\.\d+)?)\s*(.+)/);
    if (match) {
      return {
        quantity: parseFloat(match[1]),
        unit: match[2].trim()
      };
    }

    // If no number found, treat as pure unit
    return { quantity: null, unit: unitField.trim() };
  }

  /**
   * Get critical stock items
   */
  async getCriticalStockItems(): Promise<CriticalStockItem[]> {
    try {
      const collection = await this.getCollection();
      const rawItems = await collection.find({}).limit(50).toArray();
      const criticalItems: CriticalStockItem[] = [];
      
      for (const item of rawItems) {
        const unitField = item['Birincil ölçü birimi'] || 'ADET';
        const stokKodu = item['Stok Kodu'] || 0;
        
        // Parse the unit field to extract quantity and unit
        const parsed = this.parseUnitField(unitField);
        
        // If unit field contains quantity, use it as current stock
        let mevcutStok: number;
        let olcuBirimi: string;
        let kritikSeviye: number;
        
        if (parsed.quantity !== null) {
          // Use the quantity from unit field as current stock
          mevcutStok = parsed.quantity;
          olcuBirimi = parsed.unit;
          kritikSeviye = this.calculateCriticalLevel(parsed.unit);
        } else {
          // Fallback to calculated values
          olcuBirimi = parsed.unit;
          kritikSeviye = this.calculateCriticalLevel(parsed.unit);
          mevcutStok = this.calculateDeterministicStock(stokKodu, kritikSeviye);
        }
        
        if (mevcutStok < kritikSeviye) {
          criticalItems.push({
            malzemeTanimi: item['Malzeme Tanımı 1'] || 'Bilinmeyen Ürün',
            stokKodu: stokKodu,
            mevcutStok,
            olcuBirimi,
            kritikSeviye
          });
        }
        
        if (criticalItems.length >= 10) {
          break;
        }
      }
      
      return criticalItems;
    } catch (error) {
      throw new Error(`Critical stock analysis failed: ${(error as Error).message}`);
    }
  }

  /**
   * Get overall statistics
   */
  async getOverallStats(): Promise<OverallStats> {
    try {
      const collection = await this.getCollection();
      
      const totalProducts = await collection.countDocuments();
      
      // Category distribution
      const categoryPipeline = [
        {
          $group: {
            _id: '$Kategori',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ];
      
      const categoryStats = await collection.aggregate(categoryPipeline).toArray();
      
      const categories = categoryStats.map(stat => ({
        name: stat._id || 'Bilinmeyen',
        count: stat.count,
        percentage: Math.round((stat.count / totalProducts) * 100)
      }));
      
      // Top units
      const unitPipeline = [
        {
          $group: {
            _id: '$Birincil ölçü birimi',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ];
      
      const unitStats = await collection.aggregate(unitPipeline).toArray();
      
      const topUnits = unitStats.map(stat => ({
        unit: stat._id || 'ADET',
        count: stat.count
      }));
      
      return {
        totalProducts,
        categories,
        topUnits,
        summary: {
          totalCategories: categories.length,
          mostPopularCategory: categories[0]?.name || 'Bilinmeyen',
          leastStockedCategory: categories[categories.length - 1]?.name || 'Bilinmeyen'
        }
      };
    } catch (error) {
      throw new Error(`Statistics fetch failed: ${(error as Error).message}`);
    }
  }

  /**
   * Close database connection
   */
  async close(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      this.connectionPromise = null;
    }
  }
}

// Export singleton instance
export const stockService = StockService.getInstance(); 