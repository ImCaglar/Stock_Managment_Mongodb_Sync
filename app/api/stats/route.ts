import { NextResponse } from 'next/server';
import { stockService } from '@/lib/services/stockService';

// Force dynamic runtime to prevent static generation
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('📊 Stats API çağrıldı');

    // Check environment
    if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('your_mongodb_connection_string_here')) {
      console.error('❌ MongoDB URI eksik');
      return NextResponse.json({ 
        success: false, 
        error: 'MongoDB bağlantısı eksik' 
      }, { status: 500 });
    }

    // Load data with timeout
    const timeout = 10000; // 10 second timeout
    const data = await Promise.race([
      Promise.all([
        stockService.getCriticalStockItems(),
        stockService.getOverallStats()
      ]),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), timeout)
      )
    ]) as [any[], any];

    const [criticalItems, overallStats] = data;

    return NextResponse.json({
      success: true,
      data: {
        criticalItems,
        overallStats
      }
    });

  } catch (error) {
    console.error('❌ Stats API hatası:', error);
    
    // Return fallback data
    return NextResponse.json({
      success: true,
      data: {
        criticalItems: [],
        overallStats: {
          totalProducts: 0,
          categories: [],
          topUnits: [],
          summary: { 
            totalCategories: 0, 
            mostPopularCategory: 'Bilinmeyen', 
            leastStockedCategory: 'Bilinmeyen' 
          }
        }
      }
    });
  }
} 