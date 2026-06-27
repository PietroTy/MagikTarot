import { useState } from 'react';
import '../../styles/shop.css';
import { useData } from '../../context/DataContext';

const SHOP_TABS = ['Todos', 'Cristais', 'Velas', 'Baralhos', 'Ervas'];

function ShopPage() {
  const { data: { products: PRODUCTS } } = useData();
  const [activeTab, setActiveTab] = useState('Todos');

  const filtered = activeTab === 'Todos'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeTab);

  return (
    <div className="section" style={{ paddingTop: '7rem' }}>
      <div className="section-eyebrow">Loja Magik Tarot</div>
      <div className="section-title">Ferramentas Sagradas</div>
      <div className="divider" />
      <div className="section-desc" style={{ marginBottom: '0.5rem' }}>
        Cristais, velas, baralhos e muito mais para sua jornada espiritual.
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
          <div key={p.id} className="shop-card">
            <div className="shop-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                ✦
              </div>
            </div>
            <div className="shop-body">
              <div className="shop-name">{p.name}</div>
              <div className="shop-desc">{p.desc}</div>
              <div className="shop-footer">
                <div className="shop-price">{p.price}</div>
                <a
                  className="shop-link-btn"
                  href={p.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Acessar →
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
