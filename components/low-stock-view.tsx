"use client";

export const LowStockView = ({ 
  items 
}: { 
  items: { 
    malzemeTanimi: string; 
    stokKodu: number; 
    mevcutStok: number; 
    olcuBirimi: string;
    kritikSeviye: number;
  }[];
}) => {
  const criticalItems = items.filter(item => item.mevcutStok === 0);
  const veryLowItems = items.filter(item => item.mevcutStok > 0 && item.mevcutStok <= item.kritikSeviye);
  const warningItems = items.filter(item => item.mevcutStok > item.kritikSeviye && item.mevcutStok <= item.kritikSeviye * 1.5);

  return (
    <div style={{
      maxWidth: '600px',
      width: '100%',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* ⚡ BASIT HEADER */}
      <div style={{
        background: '#b45309',
        color: 'white',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          margin: '0 0 12px 0'
        }}>
          🚨 Kritik Stok Durumu
        </h2>
        
        {/* Basit İstatistikler */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          flexWrap: 'wrap'
        }}>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{criticalItems.length}</div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>TÜKENDİ</div>
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{veryLowItems.length}</div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>KRİTİK</div>
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{warningItems.length}</div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>UYARI</div>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div style={{
          background: '#f0fdf4',
          border: '2px solid #22c55e',
          borderRadius: '12px',
          padding: '32px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            color: '#15803d',
            margin: '0 0 8px 0'
          }}>
            Harika Haber!
          </h3>
          <p style={{ 
            fontSize: '16px', 
            color: '#166534',
            margin: 0
          }}>
            Kritik stok seviyesinde ürün yok!
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          
          {/* STOK TÜKENENLERİ */}
          {criticalItems.length > 0 && (
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#dc2626',
                margin: '0 0 12px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                🔴 Stok Tükenenler ({criticalItems.length})
              </h3>
              
              <div style={{ display: 'grid', gap: '8px' }}>
                {criticalItems.map((item) => (
                  <div key={item.stokKodu} style={{
                    background: 'white',
                    border: '2px solid #fecaca',
                    borderRadius: '8px',
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#451a03',
                        marginBottom: '4px'
                      }}>
                        {item.malzemeTanimi}
                      </div>
                      <div style={{
                        fontSize: '18px',
                        color: '#92400e',
                        fontFamily: 'monospace',
                        fontWeight: 'bold',
                        background: '#fef3c7',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        display: 'inline-block'
                      }}>
                        #{item.stokKodu}
                      </div>
                    </div>
                    <div style={{
                      background: '#dc2626',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      STOK YOK
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* KRİTİK SEVİYE */}
          {veryLowItems.length > 0 && (
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#d97706',
                margin: '0 0 12px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                🟠 Kritik Seviye ({veryLowItems.length})
              </h3>
              
              <div style={{ display: 'grid', gap: '8px' }}>
                {veryLowItems.map((item) => (
                  <div key={item.stokKodu} style={{
                    background: 'white',
                    border: '2px solid #fed7aa',
                    borderRadius: '8px',
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#1f2937',
                        marginBottom: '4px'
                      }}>
                        {item.malzemeTanimi}
                      </div>
                      <div style={{
                        fontSize: '18px',
                        color: '#1e40af',
                        fontFamily: 'monospace',
                        fontWeight: 'bold',
                        background: '#f1f5f9',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        display: 'inline-block'
                      }}>
                        #{item.stokKodu}
                      </div>
                    </div>
                    <div>
                      <div style={{
                        background: '#ea580c',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        marginBottom: '4px'
                      }}>
                        {item.mevcutStok} {item.olcuBirimi}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        textAlign: 'center'
                      }}>
                        Kritik: {item.kritikSeviye}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* UYARI SEVİYESİ */}
          {warningItems.length > 0 && (
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#d97706',
                margin: '0 0 12px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                🟡 Uyarı Seviyesi ({warningItems.length})
              </h3>
              
              <div style={{ display: 'grid', gap: '8px' }}>
                {warningItems.map((item) => (
                  <div key={item.stokKodu} style={{
                    background: 'white',
                    border: '2px solid #fef3c7',
                    borderRadius: '8px',
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#1f2937',
                        marginBottom: '4px'
                      }}>
                        {item.malzemeTanimi}
                      </div>
                      <div style={{
                        fontSize: '18px',
                        color: '#1e40af',
                        fontFamily: 'monospace',
                        fontWeight: 'bold',
                        background: '#f1f5f9',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        display: 'inline-block'
                      }}>
                        #{item.stokKodu}
                      </div>
                    </div>
                    <div>
                      <div style={{
                        background: '#d97706',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        marginBottom: '4px'
                      }}>
                        {item.mevcutStok} {item.olcuBirimi}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        textAlign: 'center'
                      }}>
                        Kritik: {item.kritikSeviye}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* HIZLI AKSİYONLAR */}
          <div style={{
            background: '#dbeafe',
            border: '2px solid #3b82f6',
            borderRadius: '12px',
            padding: '20px',
            marginTop: '8px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#1e40af',
              margin: '0 0 12px 0'
            }}>
              💼 Önerilen Aksiyonlar
            </h3>
            
            <div style={{ display: 'grid', gap: '8px' }}>
              {criticalItems.length > 0 && (
                <div style={{
                  background: '#fee2e2',
                  padding: '12px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#7f1d1d'
                }}>
                  🔴 ACİL: {criticalItems.length} ürün için hemen tedarik başlatın!
                </div>
              )}
              {veryLowItems.length > 0 && (
                <div style={{
                  background: '#fed7aa',
                  padding: '12px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#9a3412'
                }}>
                  🟡 Bu hafta: {veryLowItems.length} ürün için sipariş verin
                </div>
              )}
              {warningItems.length > 0 && (
                <div style={{
                  background: '#fef3c7',
                  padding: '12px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#92400e'
                }}>
                  🟢 Planlama: {warningItems.length} ürün için tedarik planlaması yapın
                </div>
              )}
              <div style={{
                background: 'white',
                padding: '12px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1e40af'
              }}>
                📞 Tedarikçilerle iletişime geçin
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}; 