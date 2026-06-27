import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useData } from '../../context/DataContext';

// Dados ricos com características e regências de cada signo do zodíaco
const SIGN_DETAILS = {
  'Áries': {
    element: 'Fogo',
    ruler: 'Marte',
    strengths: 'Coragem, liderança, entusiasmo, independência.',
    love: 'Ama com intensidade e paixão avassaladora. Precisa de liberdade e de um parceiro que acompanhe seu ritmo dinâmico.',
    career: 'Líder nato, prefere comandar a ser comandado. Excelente em iniciar projetos pioneiros, vendas e cargos de alta competitividade.'
  },
  'Touro': {
    element: 'Terra',
    ruler: 'Vênus',
    strengths: 'Confiabilidade, paciência, determinação, sensualidade.',
    love: 'Busca estabilidade, fidelidade e conforto físico. Expressa afeto através do toque, de jantares e de segurança de longo prazo.',
    career: 'Excelente com finanças, administração e projetos de longo prazo que demandam paciência e construção meticulosa.'
  },
  'Gêmeos': {
    element: 'Ar',
    ruler: 'Mercúrio',
    strengths: 'Curiosidade, adaptabilidade, inteligência, carisma.',
    love: 'Conecta-se primeiro pela mente e pela conversa. Precisa de estímulo intelectual constante e odeia rotina afetiva sufocante.',
    career: 'Excelente em comunicação, escrita, jornalismo, marketing e qualquer área que exija agilidade mental e multitarefa.'
  },
  'Câncer': {
    element: 'Água',
    ruler: 'Lua',
    strengths: 'Sensibilidade, intuição, empatia, instinto protetor.',
    love: 'Extremamente romântico, fiel e focado na construção de um lar seguro. Nutre o parceiro com carinho, mas pode ser carente.',
    career: 'Destaca-se em áreas de cuidado (psicologia, medicina, recursos humanos) ou negócios familiares e gestão emocional.'
  },
  'Leão': {
    element: 'Fogo',
    ruler: 'Sol',
    strengths: 'Generosidade, criatividade, lealdade, autoconfiança.',
    love: 'Ama de forma dramática, generosa e leal. Precisa se sentir admirado e valorizado constantemente pelo parceiro.',
    career: 'Brilha em palcos, cargos de destaque público, artes e liderança executiva. Atrai sucesso pela força de sua presença vital.'
  },
  'Virgem': {
    element: 'Terra',
    ruler: 'Mercúrio',
    strengths: 'Organização, praticidade, inteligência analítica, prestatividade.',
    love: 'Expressa amor através de atos de serviço práticos e cuidado diário. Busca relações discretas, organizadas e de apoio mútuo.',
    career: 'Excepcional com análise de dados, revisão, controle de qualidade, contabilidade e áreas da saúde que demandam precisão.'
  },
  'Libra': {
    element: 'Ar',
    ruler: 'Vênus',
    strengths: 'Diplomacia, senso de justiça, charme, busca por harmonia.',
    love: 'O signo do relacionamento por excelência. Busca parcerias equilibradas, românticas, esteticamente belas e sem conflitos pesados.',
    career: 'Brilha no direito, relações públicas, mediação de conflitos, artes, design e qualquer área que exija harmonia e estética.'
  },
  'Escorpião': {
    element: 'Água',
    ruler: 'Plutão / Marte',
    strengths: 'Intensidade, magnetismo, intuição profunda, poder de transmutação.',
    love: 'Busca fusão de almas, lealdade absoluta e intimidade sexual e emocional profunda. Extremamente ciumento, mas ultraprotetor.',
    career: 'Excelente em investigação, cirurgia, psicanálise, gestão de crises e investimentos financeiros de alto risco.'
  },
  'Sagitário': {
    element: 'Fogo',
    ruler: 'Júpiter',
    strengths: 'Otimismo, amor pela liberdade, honestidade, sede de conhecimento.',
    love: 'Enxerga o amor como uma grande aventura e busca um companheiro de viagens intelectuais e físicas. Odeia ciúmes.',
    career: 'Destaca-se no ensino superior, filosofia, turismo, comércio internacional e projetos expansivos de grande escala.'
  },
  'Capricórnio': {
    element: 'Terra',
    ruler: 'Saturno',
    strengths: 'Responsabilidade, disciplina, ambição, resiliência.',
    love: 'Demora a se abrir, mas quando assume um compromisso, é para a vida toda. Focado em construir estabilidade material com o parceiro.',
    career: 'O mestre da carreira. Excelente em cargos de alta gerência, administração pública, engenharia e finanças corporativas.'
  },
  'Aquário': {
    element: 'Ar',
    ruler: 'Urano / Saturno',
    strengths: 'Originalidade, humanitarismo, intelecto independente, visão de futuro.',
    love: 'Busca uma parceria baseada na amizade e no respeito ao espaço individual. Valoriza a independência e causas sociais mútuas.',
    career: 'Brilha em tecnologia, ciência, causas humanitárias, planejamento urbano futurista e projetos comunitários inovadores.'
  },
  'Peixes': {
    element: 'Água',
    ruler: 'Netuno / Júpiter',
    strengths: 'Espiritualidade, empatia profunda, criatividade artística, compaixão.',
    love: 'Vive o amor sob uma ótica de romantismo idealizado e fusão espiritual. Doa-se inteiramente ao parceiro, com extrema empatia.',
    career: 'Destaca-se nas artes, música, cinema, psicologia, aconselhamento espiritual, veterinária e trabalho voluntário.'
  }
};

export default function SignsPage() {
  const { data: { zodiac } } = useData();
  const [selectedSign, setSelectedSign] = useState(null);

  const signInfo = (name) => {
    return SIGN_DETAILS[name] || {
      element: 'Cosmos',
      ruler: 'Estrelas',
      strengths: 'Autoconhecimento',
      love: 'Amor universal',
      career: 'Propósito de alma'
    };
  };

  return (
    <div style={{ minHeight: '100vh', padding: '8rem 2rem 4rem', maxWidth: '1000px', margin: '0 auto' }}>
      <Helmet>
        <title>Significados dos Signos do Zodíaco | Magik Tarot</title>
        <meta name="description" content="Explore as características dos 12 signos do zodíaco. Saiba tudo sobre seus elementos, planetas regentes, amor e carreira." />
      </Helmet>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div style={{ color: 'var(--gold)', letterSpacing: '0.2em', fontSize: '0.8rem', marginBottom: '1rem', textTransform: 'uppercase' }}>
          ✦ Sabedoria das Estrelas ✦
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1.5rem', color: '#fff' }}>
          Os Doze Portais do Zodíaco
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', maxWidth: '700px', margin: '0 auto', lineHeight: '1.7' }}>
          Decifre o mapa do seu temperamento cósmico. Clique no seu signo para desvelar a regência planetária, os pontos fortes de sua essência, seu caminho afetivo e profissional.
        </p>
      </div>

      {/* Grid de Signos */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '2rem',
        marginBottom: '4rem'
      }}>
        {zodiac.map(sign => {
          const isSelected = selectedSign?.name === sign.name;
          const info = signInfo(sign.name);
          return (
            <div 
              key={sign.name}
              onClick={() => setSelectedSign(isSelected ? null : sign)}
              style={{
                background: isSelected ? 'rgba(255, 215, 0, 0.05)' : 'rgba(20, 20, 25, 0.85)',
                border: isSelected ? '1px solid var(--gold)' : '1px solid rgba(255, 215, 0, 0.15)',
                borderRadius: '16px',
                padding: '2rem 1rem',
                textAlign: 'center',
                cursor: 'pointer',
                boxShadow: isSelected ? '0 0 25px rgba(255,215,0,0.15)' : '0 8px 24px rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(8px)',
                transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.35)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.15)';
                }
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '0.8rem', color: sign.color || '#fff' }}>
                {sign.sign}&#xFE0E;
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', margin: 0 }}>
                {sign.name}
              </h3>
              <div style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: '0.3rem' }}>
                {sign.dates}
              </div>
              <div style={{ color: 'var(--gold)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.4rem' }}>
                Elemento: {info.element}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detalhes do Signo Selecionado */}
      {selectedSign && (
        <div style={{
          background: 'rgba(20, 20, 25, 0.9)',
          border: '1px solid var(--gold)',
          borderRadius: '24px',
          padding: '3rem 2.5rem',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(12px)',
          animation: 'fadeIn 0.4s ease-in-out',
          position: 'relative'
        }}>
          {/* Botão de Fechar */}
          <button 
            onClick={() => setSelectedSign(null)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'transparent',
              border: 'none',
              color: 'var(--gold)',
              fontSize: '1.5rem',
              cursor: 'pointer'
            }}
          >
            ×
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '4rem', color: selectedSign.color }}>{selectedSign.sign}&#xFE0E;</span>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#fff', margin: 0 }}>
                {selectedSign.name}
              </h2>
              <div style={{ color: 'var(--gold-light)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '0.3rem' }}>
                {selectedSign.dates} · Regido por {signInfo(selectedSign.name).ruler}
              </div>
            </div>
          </div>

          {/* Seções de Significado */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Essência e Força */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', borderLeft: `3px solid ${selectedSign.color || 'var(--gold)'}` }}>
              <h4 style={{ color: 'var(--gold-light)', fontSize: '1.05rem', fontWeight: '700', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                ✦ Pontos Fortes e Virtudes
              </h4>
              <p style={{ margin: 0, lineHeight: '1.7', opacity: 0.9 }}>
                {signInfo(selectedSign.name).strengths}
              </p>
            </div>

            {/* No Amor */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', borderLeft: '3px solid #ff6b6b' }}>
              <h4 style={{ color: '#ff8b8b', fontSize: '1.05rem', fontWeight: '700', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                ✦ Dinâmica de Relacionamento (No Amor)
              </h4>
              <p style={{ margin: 0, lineHeight: '1.7', opacity: 0.9 }}>
                {signInfo(selectedSign.name).love}
              </p>
            </div>

            {/* Carreira */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', borderLeft: '3px solid #4ade80' }}>
              <h4 style={{ color: '#86efac', fontSize: '1.05rem', fontWeight: '700', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                ✦ Alinhamento Profissional (Na Carreira)
              </h4>
              <p style={{ margin: 0, lineHeight: '1.7', opacity: 0.9 }}>
                {signInfo(selectedSign.name).career}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
