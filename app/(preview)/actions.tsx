import { Message } from "@/components/message";
import { ReactNode } from "react";
import { StockSearchView } from "@/components/stock-search-view";
import { StockItemView } from "@/components/stock-item-view";
import { StockCategoryView } from "@/components/stock-category-view";
import { LowStockView } from "@/components/low-stock-view";

// Generate unique conversation ID
function generateConversationId(): string {
  return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Global conversation ID (in production, use proper session management)
let currentConversationId = generateConversationId();

/**
 * Create error message component
 */
function createErrorMessage(error: string): ReactNode {
  return <Message role="assistant" content={error} />;
}

/**
 * Main HTTP API based message handler (client-side)
 */
const sendMessage = async (message: string) => {
  try {
    // HTTP API'ye istek gönder
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message, 
        conversationId: currentConversationId 
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return createErrorMessage(data.error || 'Bir hata oluştu');
    }

    // Update conversation ID if provided
    if (data.conversationId) {
      currentConversationId = data.conversationId;
    }

    // Özel veri varsa, özel komponent render et
    if (data.specialData) {
      const { specialData } = data;
      
      switch (specialData.type) {
        case 'critical_stock':
          return <Message role="assistant" content={<LowStockView items={specialData.data} />} />;
        
        case 'category':
          return <Message role="assistant" content={<StockCategoryView category={specialData.category} items={specialData.data} />} />;
        
        case 'item_details':
          return <Message role="assistant" content={<StockItemView item={specialData.data} />} />;
        
        case 'overall_stats':
          return <Message role="assistant" content={
            <div className="space-y-8 max-w-5xl mx-auto">
              {/* Header */}
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-amber-900 mb-2">
                  👑 Genel Stok Durumu
                </h3>
                <p className="text-amber-700">Envanter özeti ve analizi</p>
              </div>

              {/* Ana İstatistikler */}
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg border border-amber-200 p-6 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-sm text-amber-700 mb-1">Toplam Ürün</div>
                    <div className="text-3xl font-bold text-amber-900">
                      {specialData.data.totalProducts.toLocaleString('tr-TR')}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm text-amber-700 mb-1">Aktif Kategori</div>
                    <div className="text-3xl font-bold text-amber-900">
                      {specialData.data.categories.length}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm text-amber-700 mb-1">En Büyük Kategori</div>
                    <div className="text-lg font-bold text-amber-900">
                      {specialData.data.summary.mostPopularCategory}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm text-amber-700 mb-1">En Küçük Kategori</div>
                    <div className="text-lg font-bold text-amber-900">
                      {specialData.data.summary.leastStockedCategory}
                    </div>
                  </div>
                </div>
              </div>

              {/* Detaylı Analiz */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Kategori Dağılımı */}
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-5 shadow-lg min-h-[400px]">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">📈</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-amber-900">Kategori Dağılımı</h4>
                      <p className="text-amber-700 text-xs">Ürün sayısına göre</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {specialData.data.categories.map((category: any, index: number) => (
                      <div key={index} className="p-3 bg-white rounded-lg border border-amber-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-amber-900 text-sm truncate">{category.name}</span>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-xs font-semibold text-amber-900">
                              {category.count.toLocaleString('tr-TR')}
                            </span>
                            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                              {category.percentage}%
                            </span>
                          </div>
                        </div>
                        <div className="bg-amber-100 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-amber-500 to-yellow-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(category.percentage, 2)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk Analizi */}
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-5 shadow-lg min-h-[400px]">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 bg-amber-700 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">🎯</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-amber-900">Risk Analizi</h4>
                      <p className="text-amber-700 text-xs">Çeşitlilik riski</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {specialData.data.categories.map((category: any, index: number) => {
                      const riskLevel = category.percentage < 5 ? 'high' : category.percentage < 15 ? 'medium' : 'low';
                      const riskColors = {
                        high: { bg: 'bg-red-600', text: 'text-red-800', bgLight: 'bg-red-50', border: 'border-red-300' },
                        medium: { bg: 'bg-yellow-600', text: 'text-yellow-800', bgLight: 'bg-yellow-50', border: 'border-yellow-300' },
                        low: { bg: 'bg-emerald-600', text: 'text-emerald-800', bgLight: 'bg-emerald-50', border: 'border-emerald-300' }
                      };
                      const riskText = riskLevel === 'high' ? 'Yüksek Risk' : riskLevel === 'medium' ? 'Orta' : 'Güvenli';
                      const colors = riskColors[riskLevel];
                      
                      return (
                        <div key={index} className={`p-3 rounded-lg border ${colors.bgLight} ${colors.border} bg-white`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className={`w-6 h-6 ${colors.bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                                <span className="text-white text-xs font-bold">
                                  {riskLevel === 'high' ? '!' : riskLevel === 'medium' ? '⚠' : '✓'}
                                </span>
                              </div>
                              <div className="min-w-0 flex-1">
                                <span className="font-medium text-amber-900 block text-sm truncate">{category.name}</span>
                                <span className="text-xs text-amber-700">{category.count} ürün</span>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <span className={`font-semibold text-xs ${colors.text}`}>{riskText}</span>
                              <div className="text-xs text-amber-700">{category.percentage}%</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <span className="text-amber-600 text-sm flex-shrink-0">💡</span>
                      <div className="text-xs text-amber-800">
                        <strong>Risk Kriterleri:</strong><br/>
                        • %15+ → Güvenli<br/>
                        • %5-15 → Orta risk<br/>
                        • %5- → Yüksek risk
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Alt Bilgi Paneli */}
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-5 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-amber-700 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">📋</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-900">Özet & Öneriler</h4>
                    <p className="text-amber-700 text-xs">Genel değerlendirme</p>
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-amber-200 min-h-[100px] shadow-sm">
                    <div className="text-center">
                      <div className="text-xl mb-2">👑</div>
                      <div className="text-xs text-amber-700 mb-1">En Dominant</div>
                      <div className="font-semibold text-amber-900 text-sm">{specialData.data.summary.mostPopularCategory}</div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-amber-200 min-h-[100px] shadow-sm">
                    <div className="text-center">
                      <div className="text-xl mb-2">📊</div>
                      <div className="text-xs text-amber-700 mb-1">Çeşitlilik</div>
                      <div className="font-semibold text-amber-900 text-sm">{specialData.data.categories.length} Kategori</div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-amber-200 min-h-[100px] shadow-sm">
                    <div className="text-center">
                      <div className="text-xl mb-2">⭐</div>
                      <div className="text-xs text-amber-700 mb-1">Durumu</div>
                      <div className="font-semibold text-emerald-700 text-sm">Premium</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          } />;
        
        default:
          return <Message role="assistant" content={data.message} />;
      }
    }

    // Normal AI cevabı
    return <Message role="assistant" content={data.message} />;

  } catch (error) {
    console.error('Mesaj gönderme hatası:', error);
    return createErrorMessage('❌ Bağlantı hatası. Lütfen tekrar deneyin.');
  }
};

// Reset conversation (for new sessions)
const resetConversation = () => {
  currentConversationId = generateConversationId();
};

// Simplified AI State and UI State
export type AIState = {
  chatId: string;
  messages: Array<any>;
};

export type UIState = Array<ReactNode>;

// Simplified AI provider (just a passthrough now)
export const AI = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

// Actions
export const actions = {
  sendMessage,
  resetConversation,
};
