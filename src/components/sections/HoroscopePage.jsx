import { useState } from 'react';
import '../../styles/horoscope.css';
import { useData } from '../../context/DataContext';
import { Helmet } from 'react-helmet';

// Seeded PRNG para gerar previsões determinísticas por dia
function getSeedRandom(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return function() {
    h = Math.imul(h ^ (h >>> 16), 2246822507) | 0;
    h = Math.imul(h ^ (h >>> 13), 3266489909) | 0;
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  };
}

const TRANSITS = [
  "O trânsito da Lua com seu regente ativa as casas da comunicação e do intelecto,",
  "A conjunção solar desta fase ilumina seus caminhos profissionais e finanças,",
  "Vênus entra em harmonia com seu signo, abrindo portais de afeto e reconexão,",
  "Marte injeta uma dose extra de coragem e dinamismo no seu setor de projetos,",
  "Um trígono planetário sutil favorece a busca por autoconhecimento e quietude,",
  "Júpiter abençoa sua zona de parcerias, trazendo oportunidades por meio de terceiros,",
  "Saturno pede atenção e responsabilidade com suas estruturas e limites pessoais,",
  "Urano ativa sua criatividade, trazendo insights repentinos e quebras de rotina,",
  "A energia de Mercúrio facilita acordos, revisões de contratos e novos estudos,",
  "A quadratura lunar convida você a olhar para feridas antigas para transmutá-las,"
];

const FOCUS_AREAS = [
  " o que traz clareza para negociar pendências e traçar novas metas de carreira.",
  " sugerindo que uma atitude mais receptiva atrairá parcerias e apoios inesperados.",
  " propiciando momentos de grande sensibilidade artística e revelações em sonhos.",
  " ideal para iniciar aquele projeto pessoal que estava engavetado há meses.",
  " mas evite discussões acaloradas com pessoas próximas; guarde sua energia para si.",
  " abrindo espaço para curar velhos ressentimentos na área familiar e amorosa.",
  " favorecendo investimentos de longo prazo e revisões cuidadosas das suas finanças.",
  " o que ajudará você a expressar seu brilho e liderança com naturalidade.",
  " trazendo um convite para desacelerar e repensar sua rotina diária de bem-estar.",
  " o que facilitará expressar suas ideias mais originais com clareza cristalina."
];

const ADVICES = [
  " O conselho do oráculo hoje é: use uma turmalina negra para proteção e evite ruídos externos.",
  " Lembre-se: o tempo do cosmos é perfeito. Não tente apressar o amadurecimento das coisas.",
  " Um banho de alecrim e alfazema ajudará a limpar sua aura e recuperar o foco mental.",
  " Mantenha uma selenita bruta por perto para purificar seus pensamentos e desatar nós.",
  " Confie na sua intuição acima de tudo; ela está em sintonia com os astros hoje.",
  " Vista-se com sua cor da sorte para ancorar a autoconfiança e a clareza nas tomadas de decisão.",
  " Dedique dez minutos para meditar respirando fundo e visualizando uma luz verde de cura.",
  " Uma surpresa agradável no campo afetivo pode mudar o rumo das suas decisões hoje.",
  " O silêncio será seu maior escudo protetor nas próximas horas. Observe mais e fale menos.",
  " Abra-se para o novo; o universo conspira a favor de quem ousa romper velhos padrões."
];

const COLORS = [
  "Vermelho-fogo", "Verde-esmeralda", "Azul-celeste", "Dourado", "Rosa-antigo", 
  "Amarelo-sol", "Prata-lunar", "Bordô", "Roxo-ametista", "Branco-cristal", 
  "Azul-marinho", "Verde-oliva", "Laranja-brilhante", "Lilás", "Cinza-chumbo"
];

const DAYS = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"];

function HoroscopePage() {
  const { data: { zodiac: ZODIAC } } = useData();
  const [activeZodiac, setActiveZodiac] = useState(null);

  // Calcula a data atual local
  const today = new Date();
  const dateStr = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  const formattedToday = today.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });

  const getDailyPrediction = (signSymbol) => {
    const rand = getSeedRandom(dateStr + '-' + signSymbol);
    const idxTransit = Math.floor(rand() * TRANSITS.length);
    const idxFocus = Math.floor(rand() * FOCUS_AREAS.length);
    const idxAdvice = Math.floor(rand() * ADVICES.length);
    const idxColor = Math.floor(rand() * COLORS.length);
    const idxDay = Math.floor(rand() * DAYS.length);
    
    return {
      reading: `${TRANSITS[idxTransit]}${FOCUS_AREAS[idxFocus]}${ADVICES[idxAdvice]}`,
      lucky: COLORS[idxColor],
      num: Math.floor(rand() * 99) + 1,
      day: DAYS[idxDay]
    };
  };

  return (
    <div className="section" style={{ paddingTop: '7rem' }}>
      <Helmet>
        <title>Horóscopo do Dia | Previsões Diárias dos Signos - Magik Tarot</title>
        <meta name="description" content="Confira o horóscopo do dia para todos os signos do zodíaco. Receba orientações diárias sobre amor, trabalho e espiritualidade gratuitas." />
        <link rel="canonical" href="https://pietroty.github.io/MagikTarot/#/horoscopo" />
      </Helmet>
      <div className="section-eyebrow">Atualizado diariamente</div>
      <div className="section-title">Horóscopo do Dia</div>
      <div className="divider" />
      <div className="section-desc" style={{ marginBottom: '2rem' }}>
        Selecione seu signo solar para revelar as influências cósmicas de hoje.
      </div>

      <div className="zodiac-grid">
        {ZODIAC.map(z => (
          <div
            key={z.sign}
            className={`zodiac-btn ${activeZodiac?.sign === z.sign ? 'active' : ''}`}
            onClick={() => setActiveZodiac(prev => prev?.sign === z.sign ? null : z)}
          >
            <span className="zodiac-symbol">{z.sign}&#xFE0E;</span>
            <span className="zodiac-name">{z.name}</span>
          </div>
        ))}
      </div>

      {activeZodiac && (() => {
        const h = getDailyPrediction(activeZodiac.sign);
        return (
          <div className="horoscope-card">
            <div className="horoscope-header">
              <div className="horoscope-sign">{activeZodiac.sign}&#xFE0E;</div>
              <div>
                <div className="horoscope-title">{activeZodiac.name}</div>
                <div className="horoscope-date">{activeZodiac.dates}</div>
              </div>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--gold)', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Previsão para {formattedToday}
            </div>
            <div className="horoscope-text">{h.reading}</div>
            <div className="horoscope-aspects">
              <div className="aspect-item">
                <div className="aspect-label">Cor da sorte</div>
                <div className="aspect-value">{h.lucky}</div>
              </div>
              <div className="aspect-item">
                <div className="aspect-label">Número</div>
                <div className="aspect-value">{h.num}</div>
              </div>
              <div className="aspect-item">
                <div className="aspect-label">Dia favorável</div>
                <div className="aspect-value">{h.day}</div>
              </div>
            </div>
          </div>
        );
      })()}

      {!activeZodiac && (
        <div className="horoscope-empty">
          ✦ Selecione seu signo para revelar as previsões de hoje
        </div>
      )}
    </div>
  );
}

export default HoroscopePage;
