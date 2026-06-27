import '../../styles/services.css';
import '../../styles/testimonials.css';
import { useData } from '../../context/DataContext';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

function ServiceCard({ s }) {
  const navigate = useNavigate();
  return (
    <div className="service-card" onClick={() => navigate(`/consulta/${s.id}`)}>
      {s.badge && <div className="service-badge">{s.badge}</div>}
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '16px',
        border: '1px solid rgba(255, 215, 0, 0.25)',
        overflow: 'hidden',
        margin: '0 auto 1.5rem',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4), 0 0 15px rgba(255, 215, 0, 0.05)',
        background: 'rgba(5, 5, 8, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img 
          src={`${process.env.PUBLIC_URL}/assets/services/${s.image}`} 
          alt={s.name} 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </div>
      <div className="service-name" style={{ minHeight: '3.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: '1.2' }}>{s.name}</div>
      <div className="service-arcane">{s.arcane}</div>
      <div className="service-hook">{s.hook}</div>
      <div className="service-price">
        A partir de <span className="service-price-tag">{s.price}</span>
      </div>
    </div>
  );
}

function HowItWorks() {
  const { data: { howItWorks: HOW_IT_WORKS } } = useData();
  return (
    <div className="section">
      <div className="section-eyebrow">Como funciona</div>
      <div className="section-title">Seu caminho para a clareza</div>
      <div className="divider" />
      <div className="section-desc">Um processo simples, rápido e profundo.</div>
      <div className="steps-row">
        {HOW_IT_WORKS.map((s, i) => (
          <div key={i} className="step">
            <div className="step-num">{s.n}</div>
            <div className="step-title">{s.t}</div>
            <div className="step-desc">{s.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}



function CtaBanner() {
  return (
    <div className="cta-banner">
      <div className="section-eyebrow">Primeiro ritual</div>
      <div className="section-title" style={{ marginBottom: '0.8rem' }}>
        Pronto para cruzar o véu?
      </div>
      <div className="section-desc">Os Arcanos já sabem o que você precisa ouvir. A questão é: você está pronto(a)?</div>
      <Link to="/servicos" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
        Abrir um portal de consulta
      </Link>
    </div>
  );
}

function Home() {
  const { data: { services: SERVICES } } = useData();
  return (
    <>
      <Helmet>
        <title>Magik Tarot | Consultas de Tarot Online e Astrologia Sagrada</title>
        <meta name="description" content="Abra portais de autoconhecimento. Magik Tarot oferece consultas personalizadas de Tarot do Amor, Carreira, Sim ou Não, Mapa Astral e Sinastria com a precisão e profundidade da sabedoria oracular." />
        <link rel="canonical" href="https://pietroty.github.io/MagikTarot/" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Magik Tarot",
            "url": "https://pietroty.github.io/MagikTarot/",
            "logo": "https://pietroty.github.io/MagikTarot/favicon.ico",
            "description": "Portal místico de consultas de Tarot e Astrologia Online com sabedoria ancestral oracular.",
            "founder": {
              "@type": "Person",
              "name": "Pietro Turci"
            }
          })}
        </script>
      </Helmet>

      {/* HOW IT WORKS */}
      <HowItWorks />

      {/* SERVICES PREVIEW */}
      <div className="section">
        <div className="section-eyebrow">Consultas Oraculares</div>
        <div className="section-title">Abra um Portal</div>
        <div className="divider" />
        <div className="section-desc">Cada caminho revela uma face diferente do mesmo mistério eterno.</div>
        <div className="services-grid">
          {SERVICES.slice(0, 3).map(s => (
            <ServiceCard key={s.id} s={s} />
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/servicos" className="btn-secondary" style={{ display: 'inline-block', textDecoration: 'none' }}>
            Ver todos os portais de consulta →
          </Link>
        </div>
      </div>

      {/* CTA */}
      <CtaBanner />
    </>
  );
}

export { ServiceCard };
export default Home;
