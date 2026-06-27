import { useState } from 'react';
import '../../styles/shop.css';
import { useData } from '../../context/DataContext';
import { Helmet } from 'react-helmet';

const SHOP_TABS = ['Todos', 'Cristais'];

function ShopPage() {
  const { data: { products: PRODUCTS } } = useData();
  const [activeTab, setActiveTab] = useState('Todos');

  const filtered = activeTab === 'Todos'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeTab);

  return (
    <div className="section" style={{ paddingTop: '7rem' }}>
      <Helmet>
        <title>Loja Sagrada | Cristais e Ferramentas Místicas - Magik Tarot</title>
        <meta name="description" content="Adquira cristais de alta qualidade selecionados para limpeza energética e proteção: Selenita, Quartzo Verde, Turmalina Negra, Cianita Negra e Sodalita." />
        <link rel="canonical" href="https://pietroty.github.io/MagikTarot/#/loja" />
      </Helmet>
      <div className="section-eyebrow">Loja Magik Tarot</div>
      <div className="section-title">Ferramentas Sagradas</div>
      <div className="divider" />
      <div className="section-desc" style={{ marginBottom: '0.5rem' }}>
        Cristais selecionados e consagrados para potencializar sua jornada espiritual.
      </div>

      <div className="tabs">
        {SHOP_TABS.map(t => (
          <button
            key={t}
            className={`tab-btn ${activeTab === t ? 'active' : ''}`}
            onClick={() => setActiveTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="shop-grid">
        {filtered.map(p => (
          <div key={p.id} className="shop-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
            {p.discount && (
              <div className="shop-badge" style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                background: '#e53e3e',
                color: 'white',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                zIndex: 10,
                fontFamily: 'Cinzel, serif',
                letterSpacing: '0.05em',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
              }}>
                {p.discount}
              </div>
            )}
            <div className="shop-img" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '180px', 
              width: '100%', 
              position: 'relative', 
              overflow: 'hidden',
              background: 'linear-gradient(135deg, var(--deep), var(--surface))'
            }}>
              {p.image ? (
                <img 
                  src={`${process.env.PUBLIC_URL}/${p.image}`} 
                  alt={p.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  className="product-hover-zoom"
                />
              ) : (
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'rgba(255, 215, 0, 0.04)',
                  border: '1px solid rgba(255, 215, 0, 0.22)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  color: 'var(--gold)',
                  boxShadow: '0 0 15px rgba(255, 215, 0, 0.1)',
                  transition: 'all 0.3s ease'
                }}>
                  {p.icon || '✦'}
                </div>
              )}
            </div>
            <div className="shop-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.2rem' }}>
              <div>
                <div className="shop-name" style={{ 
                  fontSize: '0.95rem', 
                  lineHeight: '1.4', 
                  minHeight: '2.8rem', 
                  display: '-webkit-box', 
                  WebkitLineClamp: 2, 
                  WebkitBoxOrient: 'vertical', 
                  overflow: 'hidden',
                  fontFamily: 'Cinzel, serif',
                  marginBottom: '0.3rem',
                  color: 'var(--text)'
                }}>
                  {p.name}
                </div>
                {p.rating && (
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: 'var(--gold-light)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.2rem', 
                    marginBottom: '0.5rem',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}>
                    {p.rating}
                  </div>
                )}
                <div className="shop-desc" style={{ 
                  fontSize: '0.8rem', 
                  color: 'var(--text-muted)',
                  fontStyle: 'italic',
                  minHeight: '2.4rem', 
                  display: '-webkit-box', 
                  WebkitLineClamp: 2, 
                  WebkitBoxOrient: 'vertical', 
                  overflow: 'hidden', 
                  marginBottom: '0.8rem' 
                }}>
                  {p.desc}
                </div>
              </div>
              <div className="shop-footer" style={{ 
                borderTop: '1px solid rgba(255, 215, 0, 0.08)', 
                paddingTop: '0.8rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {p.oldPrice && (
                    <span style={{ fontSize: '0.75rem', textDecoration: 'line-through', opacity: 0.5, color: '#ff6b6b' }}>
                      {p.oldPrice}
                    </span>
                  )}
                  <span className="shop-price" style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--gold-light)', fontFamily: 'Cinzel, serif' }}>
                    {p.price}
                  </span>
                </div>
                <a
                  className="shop-link-btn"
                  href={p.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Comprar
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShopPage;
