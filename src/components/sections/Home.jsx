import '../../styles/services.css';
import '../../styles/testimonials.css';
import { useData } from '../../context/DataContext';

function ServiceCard({ s, onOpen }) {
  return (
    <div className="service-card" onClick={() => onOpen(s)}>
      {s.badge && <div className="service-badge">{s.badge}</div>}
      <span className="service-icon">{s.icon}</span>
      <div className="service-name">{s.name}</div>
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

function Testimonials() {
  const { data: { testimonials: TESTIMONIALS } } = useData();
  return (
    <div className="section">
      <div className="section-eyebrow">Depoimentos</div>
      <div className="section-title">O que nossos consulentes dizem</div>
      <div className="divider" />
      <div className="section-desc" style={{ marginBottom: '2.5rem' }}>
        Mais de 12.000 leituras realizadas.
      </div>
      <div className="testimonials-grid">
        {TESTIMONIALS.map((t, i) => (
          <div key={i} className="testimonial-card">
            <div className="testimonial-stars">{t.stars}</div>
            <div className="testimonial-text">"{t.text}"</div>
            <div className="testimonial-author">
              <div className="testimonial-avatar">{t.av}</div>
              <div>
                <div className="testimonial-name">{t.name}</div>
                <div className="testimonial-meta">{t.meta}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CtaBanner({ setActivePage }) {
  return (
    <div className="cta-banner">
      <div className="section-eyebrow">Primeiro ritual</div>
      <div className="section-title" style={{ marginBottom: '0.8rem' }}>
        Pronto para cruzar o véu?
      </div>
      <div className="section-desc">Os Arcanos já sabem o que você precisa ouvir. A questão é: você está pronto(a)?</div>
      <button className="btn-primary" onClick={() => setActivePage('servicos')}>
        Abrir um portal de consulta
      </button>
    </div>
  );
}

function Home({ setActivePage, setActiveModal }) {
  const { data: { services: SERVICES } } = useData();
  return (
    <>
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
            <ServiceCard key={s.id} s={s} onOpen={setActiveModal} />
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button className="btn-secondary" onClick={() => setActivePage('servicos')}>
            Ver todos os portais de consulta →
          </button>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <Testimonials />

      {/* CTA */}
      <CtaBanner setActivePage={setActivePage} />
    </>
  );
}

export { ServiceCard };
export default Home;
