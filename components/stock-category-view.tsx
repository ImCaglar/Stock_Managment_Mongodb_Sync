"use client";

import { StockItem, StockCategory } from "@/lib/models/stock";

const categoryNames: Record<StockCategory, string> = {
  'Et Ürünleri': '🥩 Et Ürünleri',
  'Beyaz Et': '🐔 Beyaz Et',
  'Deniz Ürünleri': '🐟 Deniz Ürünleri',
  'Meyveler': '🍎 Meyveler',
  'Sebzeler': '🥬 Sebzeler',
  'Bakliyat & Tahıl': '🌾 Bakliyat & Tahıl',
  'Diğer': '📦 Diğer'
};

export const StockCategoryView = ({ 
  category, 
  items
}: { 
  category: StockCategory;
  items: StockItem[];
}) => {

  // Kompakt Inline Styles
  const containerStyle = {
    width: '100%',
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '12px'
  };

  const headerStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    textAlign: 'center' as const
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px'
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '12px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e5e7eb',
    minHeight: '120px',
    transition: 'all 0.2s ease',
    cursor: 'default'
  };

  return (
    <div style={containerStyle}>
      {/* Başlık */}
      <div style={headerStyle}>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          color: '#451a03', 
          marginBottom: '6px' 
        }}>
          {categoryNames[category]}
        </h2>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          {items.length} ürün bulundu
        </p>
      </div>

      {/* Ürün Listesi */}
      {items.length === 0 ? (
        <div style={{
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          padding: '32px',
          textAlign: 'center' as const
        }}>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>
            Bu kategoride ürün bulunamadı.
          </p>
        </div>
      ) : (
        <div style={gridStyle}>
          {items.map((item, index) => (
            <div 
              key={`item-${item.stokKodu}-${index}`} 
              style={cardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.05)';
              }}
            >
              
              {/* KOMPAKT ÜRÜN KODU */}
              <div style={{ 
                textAlign: 'center' as const,
                marginBottom: '8px',
                padding: '6px',
                backgroundColor: '#fef3c7',
                borderRadius: '6px',
                border: '1px solid #f59e0b'
              }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  fontFamily: 'monospace',
                  color: '#92400e',
                  letterSpacing: '0.5px'
                }}>
                  {item.stokKodu}
                </div>
              </div>

              {/* ÜRÜN ADI - KOMPAKT */}
              <h3 style={{ 
                fontSize: '13px',
                fontWeight: '600', 
                color: '#451a03',
                marginBottom: '8px',
                lineHeight: '1.2',
                minHeight: '32px',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textAlign: 'center' as const
              }}>
                {item.malzemeTanimi}
              </h3>
              
              {/* STOK DURUMU */}
              <div style={{ textAlign: 'center' as const }}>
                <span style={{
                  backgroundColor: '#dcfce7',
                  color: '#166534',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  display: 'inline-block',
                  fontWeight: '600'
                }}>
                  Stok: Mevcut
                </span>
              </div>

              {/* ÖLÇÜ BİRİMİ */}
              <div style={{ 
                textAlign: 'center' as const,
                marginTop: '6px'
              }}>
                <span style={{
                  backgroundColor: '#fde68a',
                  color: '#92400e',
                  padding: '2px 6px',
                  borderRadius: '8px',
                  fontSize: '10px',
                  display: 'inline-block',
                  fontWeight: '500'
                }}>
                  {item.olcuBirimi}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Kompakt İstatistikler */}
      {items.length > 0 && (
        <div style={{
          backgroundColor: '#fef3c7',
          borderRadius: '8px',
          padding: '16px',
          marginTop: '16px'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#92400e',
            marginBottom: '12px',
            textAlign: 'center' as const
          }}>
            📊 Özet
          </h3>
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center'
          }}>
            <div style={{ textAlign: 'center' as const }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#92400e' }}>
                {items.length}
              </div>
              <div style={{ fontSize: '12px', color: '#3b82f6' }}>Ürün</div>
            </div>
            <div style={{ textAlign: 'center' as const }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e40af' }}>
                {new Set(items.map(item => item.olcuBirimi)).size}
              </div>
              <div style={{ fontSize: '12px', color: '#3b82f6' }}>Ölçü Tipi</div>
            </div>
            <div style={{ textAlign: 'center' as const }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>
                %100
              </div>
              <div style={{ fontSize: '12px', color: '#16a34a' }}>Mevcut</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 