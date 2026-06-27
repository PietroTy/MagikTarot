import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', padding: '8rem 2rem 4rem', maxWidth: '800px', margin: '0 auto' }}>
      <Helmet>
        <title>Sobre o Templo | Magik Tarot</title>
        <meta name="description" content="Conheça a história do Magik Tarot, um portal de autoconhecimento digital que une a antiga sabedoria hermética à precisão dos cálculos astronômicos e oraculares." />
      </Helmet>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div style={{ color: 'var(--gold)', letterSpacing: '0.2em', fontSize: '0.8rem', marginBottom: '1rem', textTransform: 'uppercase' }}>
          ✦ A Origem do Portal ✦
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1.5rem', color: '#fff' }}>
          Sobre o Magik Tarot
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.7' }}>
          Conheça a fusão sagrada entre a antiga tradição oracular e a precisão do nosso portal místico digital.
        </p>
      </div>

      {/* Story Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', marginBottom: '4rem' }}>
        <div style={{
          background: 'rgba(20, 20, 25, 0.85)',
          border: '1px solid rgba(255, 215, 0, 0.12)',
          borderRadius: '20px',
          padding: '3rem 2.5rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          backdropFilter: 'blur(10px)',
          lineHeight: '1.8',
          color: 'rgba(255,255,255,0.9)'
        }}>
          <h2 style={{ color: 'var(--gold)', fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: '700' }}>
            ✦ Quando a Tradição encontra a Inovação
          </h2>
          <p style={{ marginBottom: '1.2rem' }}>
            O <strong>Magik Tarot</strong> nasceu do desejo de democratizar e modernizar a jornada de autoconhecimento. Historicamente, os oráculos eram procurados em momentos de encruzilhada. Hoje, no turbilhão da vida digital, precisamos de respostas rápidas, profundas e, acima de tudo, privadas.
          </p>
          <p style={{ marginBottom: '1.2rem' }}>
            Acreditamos que o Tarot, a Astrologia e a Numerologia não são ferramentas de "previsão absoluta do destino", mas sim espelhos arqueológicos do nosso inconsciente. Eles revelam os padrões ocultos, bloqueios e energias que estão moldando nosso presente.
          </p>
          <p>
            Ao aliar a sabedoria hermética acumulada por milênios à precisão matemática do posicionamento dos astros e das cartas, criamos um portal de respostas personalizado e de profunda sensibilidade poética.
          </p>
        </div>

        {/* Autoridade do Criador */}
        <div style={{
          background: 'rgba(20, 20, 25, 0.85)',
          border: '1px solid rgba(255, 215, 0, 0.12)',
          borderRadius: '20px',
          padding: '3rem 2.5rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          backdropFilter: 'blur(10px)',
          lineHeight: '1.8',
          color: 'rgba(255,255,255,0.9)',
          display: 'flex',
          gap: '2rem',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(255,215,0,0.1) 0%, rgba(20,20,25,0.9) 100%)',
            border: '1px solid var(--gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'var(--gold)',
            boxShadow: '0 5px 25px rgba(255,215,0,0.15)',
            flexShrink: 0,
            margin: '0 auto',
            fontFamily: 'serif',
            letterSpacing: '0.05em'
          }}>
            PT
          </div>
          <div style={{ flex: 1, minWidth: '250px' }}>
            <h2 style={{ color: 'var(--gold)', fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: '700', textAlign: 'left' }}>
              Pietro Turci
            </h2>
            <div style={{ color: 'var(--gold-light)', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Fundador & Guardião do Portal
            </div>
            <p style={{ fontSize: '0.95rem', margin: 0 }}>
              Desenvolvedor de software apaixonado por ocultismo e filosofia esotérica hermética. Pietro projetou o ecossistema do Magik Tarot para ser um espaço seguro, esteticamente impecável e de extrema fidelidade oracular, unindo algoritmos precisos de cálculo astrológico com rituais digitais minuciosamente calibrados.
            </p>
          </div>
        </div>

        {/* Nossos Princípios */}
        <div style={{
          background: 'rgba(20, 20, 25, 0.85)',
          border: '1px solid rgba(255, 215, 0, 0.12)',
          borderRadius: '20px',
          padding: '3rem 2.5rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          backdropFilter: 'blur(10px)',
          lineHeight: '1.8',
          color: 'rgba(255,255,255,0.9)'
        }}>
          <h2 style={{ color: 'var(--gold)', fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: '700' }}>
            ✦ Nossos Compromissos Cósmicos
          </h2>
          <ul>
            <li style={{ marginBottom: '1rem' }}>
              <strong>Ética e Responsabilidade:</strong> Nossos oráculos nunca induzirão medo, dependência espiritual ou ditarão decisões médicas e jurídicas. Orientamos para a liberdade e a soberania do buscador.
            </li>
            <li style={{ marginBottom: '1rem' }}>
              <strong>Privacidade Absoluta:</strong> Suas consultas são privadas e protegidas por lei (LGPD). Suas dúvidas e leituras pertencem apenas a você e ao cosmos.
            </li>
            <li style={{ marginBottom: '1rem' }}>
              <strong>Excelência Técnica:</strong> Garantimos um sistema ágil, integrado com Mercado Pago para segurança financeira e utilizando as mais confiáveis e seguras tecnologias de processamento do mercado.
            </li>
          </ul>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <Link to="/consultas" className="btn-primary" style={{ textDecoration: 'none', padding: '1.1rem 3.5rem', fontSize: '1rem' }}>
          Consultar o Oráculo Agora ✦
        </Link>
      </div>
    </div>
  );
}
