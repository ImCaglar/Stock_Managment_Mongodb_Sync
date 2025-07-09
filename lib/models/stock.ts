// Database'deki gerçek field'lara göre interface
export interface StockItem {
  _id?: string;
  stokKodu: number;           // "Stok Kodu" field'ı
  malzemeTanimi: string;      // "Malzeme Tanımı 1" field'ı  
  kalemGrup?: string;         // "Kalem byt grb" field'ı (49.5% dolu)
  olcuBirimi: string;         // "Birincil ölçü birimi" field'ı
  kategori: StockCategory;    // "Kategori" field'ı
}

// Database'deki gerçek kategoriler
export type StockCategory = 
  | 'Et Ürünleri'        // 2659 ürün
  | 'Beyaz Et'           // 30 ürün  
  | 'Deniz Ürünleri'     // 59 ürün
  | 'Diğer'              // 29654 ürün
  | 'Meyveler'           // 513 ürün
  | 'Sebzeler'           // 98 ürün
  | 'Bakliyat & Tahıl';  // 1600 ürün

export interface StockQuery {
  search?: string;
  category?: StockCategory;
  inStock?: boolean;
  lowStock?: boolean;
}

export interface StockResponse {
  items: StockItem[];
  total: number;
  hasAlternatives?: boolean;
} 