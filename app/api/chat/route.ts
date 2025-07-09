import { NextRequest, NextResponse } from 'next/server';
import { stockService } from '@/lib/services/stockService';
import { StockCategory } from '@/lib/models/stock';

// Force dynamic runtime to prevent static generation
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// In-memory conversation storage (in production, use Redis or database)
const conversationContext = new Map<string, {
  messages: Array<{role: 'user' | 'assistant', content: string}>;
  criticalStockData?: any[];
  categoryData?: any;
  lastDataFetch?: number;
}>();

export async function POST(request: NextRequest) {
  try {
    const { message, conversationId = 'default', messages = [] } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Mesaj gerekli' }, { status: 400 });
    }

    // OpenAI API anahtarını kontrol et
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        error: '❌ OpenAI API anahtarı eksik! Lütfen .env.local dosyasına OPENAI_API_KEY ekleyin.' 
      }, { status: 500 });
    }

    // MongoDB bağlantısını kontrol et
    if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('your_mongodb_connection_string_here')) {
      return NextResponse.json({ 
        error: '❌ MongoDB bağlantısı eksik! Lütfen .env.local dosyasında MONGODB_URI ayarlayın.' 
      }, { status: 500 });
    }

    // Get or create conversation context
    let context = conversationContext.get(conversationId);
    if (!context) {
      context = {
        messages: [],
        lastDataFetch: 0
      };
      conversationContext.set(conversationId, context);
    }

    // Add user message to context
    context.messages.push({ role: 'user', content: message });

    // Check if we need to refresh data (refresh every 5 minutes)
    const shouldRefreshData = !context.lastDataFetch || 
                             (Date.now() - context.lastDataFetch) > 300000;

    // Özel komutları kontrol et ve context'e kaydet
    let specialResponse = null;
    let contextualData = '';
    
    // Kritik stok sorgusu
    if (message.toLowerCase().includes('kritik stok') || 
        message.toLowerCase().includes('azalan ürün') ||
        message.toLowerCase().includes('kritik seviye')) {
      try {
        const criticalItems = await stockService.getCriticalStockItems();
        context.criticalStockData = criticalItems;
        context.lastDataFetch = Date.now();
        
        specialResponse = {
          type: 'critical_stock',
          data: criticalItems,
          message: `🚨 ${criticalItems.length} ürün kritik stok seviyesinde!`
        };
        
        contextualData = `GÜNCEL KRİTİK STOK VERİLERİ:\n${criticalItems.map(item => 
          `- ${item.malzemeTanimi} (${item.stokKodu}): ${item.mevcutStok}/${item.kritikSeviye} ${item.olcuBirimi}`
        ).join('\n')}\n\n`;
      } catch (error) {
        console.error('Kritik stok hatası:', error);
      }
    }
    
    // Kategori sorgusu
    const categories = ["Et Ürünleri", "Beyaz Et", "Deniz Ürünleri", "Meyveler", "Sebzeler", "Bakliyat & Tahıl", "Diğer"];
    for (const category of categories) {
      if (message.toLowerCase().includes(category.toLowerCase())) {
        try {
          const categoryItems = await stockService.getStockByCategory(category as StockCategory);
          context.categoryData = { category, items: categoryItems };
          context.lastDataFetch = Date.now();
          
          specialResponse = {
            type: 'category',
            data: categoryItems,
            category: category,
            message: `📦 ${category} kategorisinde ${categoryItems.length} ürün bulundu.`
          };
          
          contextualData = `GÜNCEL ${category.toUpperCase()} KATEGORİ VERİLERİ:\n${categoryItems.slice(0, 10).map(item => 
            `- ${item.malzemeTanimi} (${item.stokKodu})`
          ).join('\n')}\n\n`;
        } catch (error) {
          console.error('Kategori hatası:', error);
        }
      }
    }
    
    // Genel durum sorgusu
    if (message.toLowerCase().includes('genel durum') || 
        message.toLowerCase().includes('stok durumu') ||
        message.toLowerCase().includes('toplam ürün')) {
      try {
        const stats = await stockService.getOverallStats();
        context.lastDataFetch = Date.now();
        
        specialResponse = {
          type: 'overall_stats',
          data: stats,
          message: `📊 Toplam ${stats.totalProducts} ürün, ${stats.summary.totalCategories} kategori`
        };
      } catch (error) {
        console.error('Genel durum hatası:', error);
      }
    }

    // Ürün kodu sorgusu (sadece sayı)
    const numberMatch = message.match(/^\d+$/);
    if (numberMatch) {
      try {
        const item = await stockService.getItemByCode(numberMatch[0]);
        specialResponse = {
          type: 'item_details',
          data: item,
          message: item ? `✅ ${item.malzemeTanimi} ürünü bulundu.` : `❌ ${numberMatch[0]} ürün kodu bulunamadı.`
        };
      } catch (error) {
        console.error('Ürün kodu hatası:', error);
      }
    }

    // Analiz sorguları - önceki verilerle analiz yap
    const analysisKeywords = [
      'acil', 'öncelik', 'sipariş', 'önemli', 'kritik', 'analiz', 'öneri',
      'hangi ürün', 'ne sipariş', 'hangi stok', 'acil sipariş'
    ];
    
    const isAnalysisQuery = analysisKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );

    if (isAnalysisQuery && context.criticalStockData) {
      contextualData = `MEVCUT KRİTİK STOK VERİLERİ (Analiz için kullan):\n${context.criticalStockData.map(item => 
        `- ${item.malzemeTanimi} (Kod: ${item.stokKodu}): Mevcut ${item.mevcutStok} ${item.olcuBirimi}, Kritik seviye: ${item.kritikSeviye} ${item.olcuBirimi}, Durum: ${item.mevcutStok === 0 ? 'STOK YOK' : 'KRİTİK SEVIYE'}`
      ).join('\n')}\n\n`;
    }

    // Build conversation history for OpenAI
    const conversationMessages = [
      {
        role: 'system' as const,
        content: `Sen bir otel stok yönetim sistemi asistanısın. 
Türkçe konuşan otel çalışanlarına yardım ediyorsun.
Stok öğeleri, envanter durumu ve alternatif ürünler hakkında bilgi veriyorsun.
Her zaman dostça ve yardımsever ol.
Yanıtlarını Türkçe ver.

MEVCUT KATEGORİLER:
- Et Ürünleri (dana, kuzu, kırmızı et)
- Beyaz Et (tavuk, hindi, kanatlı) 
- Deniz Ürünleri (balık, deniz ürünleri)
- Meyveler (taze meyveler)
- Sebzeler (taze sebzeler)
- Bakliyat & Tahıl (tahıllar, bakliyat)
- Diğer (diğer ürünler)

ÖNEMLI: Eğer kullanıcı analiz, öncelik, sipariş konularında sorular soruyorsa, daha önce sağlanan kritik stok verilerini kullanarak detaylı analiz yap.

Kritik stok analizinde şu faktörleri göz önünde bulundur:
1. Stok seviyesi (0 = acil, kritik seviye altı = önemli)
2. Ürün türü (temel gıda maddeleri öncelikli)
3. Kategori önem sırası (Et > Sebze > Diğer)
4. Stok kritik seviyesine göre aciliyet

${contextualData}

Kullanıcının sorusuna kısa ve yararlı bir yanıt ver. Eğer özel stok verisi varsa, onu kullan.`
      },
      // Add conversation history (last 10 messages to avoid token limit)
      ...context.messages.slice(-10).map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }))
    ];

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: conversationMessages,
        max_tokens: 600,
        temperature: 0.7,
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error('OpenAI API hatası:', errorData);
      return NextResponse.json({ 
        error: '❌ AI servisi şu anda kullanılamıyor. Lütfen tekrar deneyin.' 
      }, { status: 500 });
    }

    const aiData = await openaiResponse.json();
    const aiMessage = aiData.choices[0]?.message?.content || 'Üzgünüm, cevap üretemiyorum.';

    // Add assistant response to context
    context.messages.push({ role: 'assistant', content: aiMessage });

    // Keep only last 20 messages to prevent memory overflow
    if (context.messages.length > 20) {
      context.messages = context.messages.slice(-20);
    }

    return NextResponse.json({
      message: aiMessage,
      specialData: specialResponse,
      conversationId: conversationId
    });

  } catch (error) {
    console.error('Chat API hatası:', error);
    return NextResponse.json({ 
      error: '❌ Bir hata oluştu. Lütfen tekrar deneyin.' 
    }, { status: 500 });
  }
} 