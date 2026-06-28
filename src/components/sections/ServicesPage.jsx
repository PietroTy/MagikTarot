import '../../styles/services.css';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

function ServicesPage() {
  const { data: { services: SERVICES } } = useData();
  const navigate = useNavigate();

  return (
    <div className="section" style={{ paddingTop: '7.5rem', paddingBottom: '5rem' }}>
      <Helmet>
        <title>Consultas Oraculares e Leituras Online | Magik Tarot</title>
        <meta name="description" content="Explore nossos portais de autoconhecimento. Escolha entre Tarot do Amor, Tarot de Carreira, Sim ou Não, Mapa Astral Completo e Sinastria Amorosa com revelações profundas imediatas." />
        <link rel="canonical" href="https://magiktarot.com.br/#/consultas" />
      </Helmet>
      <div className="section-eyebrow">Portais do Conhecimento Oculto</div>
      <div className="section-title">Consultas Oraculares</div>
      <div className="divider" />
      <div className="section-desc" style={{ marginBottom: '1.5rem' }}>
        Escolha o portal que ressoa com sua necessidade. Cada consulta é tecida de forma única e profunda para a sua alma.
      </div>
      
      <div className="services-zigzag-container">
        {SERVICES.map((s, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div 
              key={s.id} 
              className={`zigzag-card ${isEven ? 'even' : 'odd'}`}
              onClick={() => navigate(`/consulta/${s.id}`)}
            >
              {/* Custom High-Fidelity Icon / Mystical Image Container */}
              <div className="zigzag-icon-container">
                <div className="zigzag-icon-glow" />
                <img 
                  src={`${process.env.PUBLIC_URL}/assets/services/${s.image}`} 
                  alt={s.name} 
                  className="zigzag-icon-img"
                />
              </div>

              {/* Card Content block */}
              <div className="zigzag-content">
                {s.badge && <div className="zigzag-badge">{s.badge}</div>}
                <h2 className="zigzag-title">{s.name}</h2>
                <div className="zigzag-arcane">{s.arcane}</div>
                <p className="zigzag-desc">{s.desc || s.hook}</p>
                
                <div className="zigzag-footer">
                  <div className="zigzag-price">
                    Acesso ao Portal: 
                    <span className="zigzag-price-val">{s.price}</span>
                  </div>
                  <button 
                    className="zigzag-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/consulta/${s.id}`);
                    }}
                  >
                    Iniciar Ritual ✦
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ServicesPage;
