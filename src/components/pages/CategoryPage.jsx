import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useData } from '../../context/DataContext';

export default function CategoryPage({ setActiveModal }) {
  const { category } = useParams();
  const { data: { services } } = useData();

  const categoryTitles = {
    tarot: {
      title: 'Portal do Tarot Online',
      subtitle: 'Consulte os arcanos sagrados para obter clareza, direção e sabedoria imediata.',
      desc: 'O Tarot é um espelho da alma. Nossas consultas utilizam inteligência artificial treinada na sabedoria dos arcanos maiores para interpretar os caminhos do seu destino.',
      metaDesc: 'Consulte o Tarot Online. Leituras personalizadas sobre amor, carreira e decisões com interpretação profunda dos arcanos.'
    },
    astrologia: {
      title: 'Estudos Astrológicos e Mapas',
      subtitle: 'Decifre a posição dos astros no momento exato do seu nascimento.',
      desc: 'A astrologia estuda a harmonia entre o macrocosmo e o microcosmo. Encontre clareza através do seu Mapa Astral de Nascimento ou calcule a compatibilidade com a Sinastria.',
      metaDesc: 'Descubra a influência dos astros na sua vida. Mapa Astral por IA e Sinastria Amorosa para entender suas conexões.'
    },
    numerologia: {
      title: 'Portal da Numerologia Hermética',
      subtitle: 'A vibração matemática do seu nome e da sua data de nascimento.',
      desc: 'Os números governam o universo. Em breve, você poderá calcular o seu Ano Pessoal, Número de Destino e decifrar as energias numéricas que guiam seus passos.',
      metaDesc: 'Calcule sua numerologia do nome e ano pessoal. Em breve, o portal de leituras numerológicas automáticas.'
    }
  };

  const currentCat = categoryTitles[category] || {
    title: 'Nossas Consultas Cómicas',
    subtitle: 'Escolha seu portal de entrada para o autoconhecimento.',
    desc: 'Explore oráculos sagrados interpretados por inteligência artificial.',
    metaDesc: 'Explore consultas online de tarot, astrologia e numerologia.'
  };

  const filteredServices = services.filter(s => s.type === category);

  return (
    <div style={{ minHeight: '100vh', padding: '8rem 2rem 4rem', maxWidth: '1100px', margin: '0 auto' }}>
      <Helmet>
        <title>{`${currentCat.title} | Magik Tarot`}</title>
        <meta name="description" content={currentCat.metaDesc} />
      </Helmet>

      {/* Header da Categoria */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div style={{ color: 'var(--gold)', letterSpacing: '0.2em', fontSize: '0.8rem', marginBottom: '1rem', textTransform: 'uppercase' }}>
          ✦ Portal de {category} ✦
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1.5rem', color: '#fff' }}>
          {currentCat.title}
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--gold-light)', marginBottom: '1.5rem', maxWidth: '700px', margin: '0 auto 1.5rem' }}>
          {currentCat.subtitle}
        </p>
        <p style={{ opacity: 0.7, maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
          {currentCat.desc}
        </p>
      </div>

      {/* Grid de Serviços */}
      {filteredServices.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          marginTop: '3rem'
        }}>
          {filteredServices.map(service => (
            <div 
              key={service.id} 
              style={{
                background: 'rgba(20, 20, 25, 0.85)',
                border: '1px solid rgba(255, 215, 0, 0.15)',
                borderRadius: '16px',
                padding: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                backdropFilter: 'blur(8px)',
                transition: 'transform 0.3s ease, border-color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.15)';
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '2.5rem' }}>{service.icon}</span>
                  {service.badge && (
                    <span style={{
                      fontSize: '0.7rem',
                      color: 'var(--gold)',
                      background: 'rgba(255,215,0,0.1)',
                      border: '1px solid rgba(255,215,0,0.2)',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      {service.badge}
                    </span>
                  )}
                </div>

                <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.5rem', color: '#fff' }}>
                  {service.name}
                </h2>
                <div style={{ color: 'var(--gold-light)', fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: '1.2rem', textTransform: 'uppercase' }}>
                  {service.arcane}
                </div>
                <p style={{ opacity: 0.8, fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                  {service.desc}
                </p>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.2rem' }}>
                  <span style={{ opacity: 0.6, fontSize: '0.9rem' }}>Contribuição:</span>
                  <span style={{ color: 'var(--gold)', fontSize: '1.4rem', fontWeight: '700' }}>{service.price}</span>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <Link 
                    to={`/consulta/${service.id}`} 
                    className="btn-secondary" 
                    style={{ flex: 1, textDecoration: 'none', textAlign: 'center', fontSize: '0.9rem', padding: '0.8rem 0' }}
                  >
                    Detalhes ✦
                  </Link>
                  <button 
                    onClick={() => setActiveModal(service.id)} 
                    className="btn-primary" 
                    style={{ flex: 1.5, fontSize: '0.9rem', padding: '0.8rem 0', border: 'none', cursor: 'pointer' }}
                  >
                    Consultar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Caso da Numerologia ou Categoria vazia */
        <div style={{
          background: 'rgba(20, 20, 25, 0.85)',
          border: '1px solid rgba(255, 215, 0, 0.15)',
          borderRadius: '20px',
          padding: '4rem 2rem',
          textAlign: 'center',
          maxWidth: '700px',
          margin: '3rem auto 0',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.4)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem', animation: 'float 3s ease-in-out infinite' }}>🔢</div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--gold)', marginBottom: '1rem' }}>Em Breve no Oráculo</h2>
          <p style={{ lineHeight: '1.7', opacity: 0.8, marginBottom: '2rem' }}>
            Estamos sintonizando os canais cósmicos para trazer leituras completas de Numerologia Pitagórica e Cabalística. Em breve você poderá decifrar os segredos contidos nos números do seu destino!
          </p>
          <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
            <Link to="/consultas" className="btn-primary" style={{ textDecoration: 'none', padding: '1rem 2.5rem' }}>
              Ver consultas disponíveis ✦
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
