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

const SIGN_ELEMENTS = {
  '♈': 'fogo', '♌': 'fogo', '♐': 'fogo',
  '♉': 'terra', '♍': 'terra', '♑': 'terra',
  '♊': 'ar', '♎': 'ar', '♒': 'ar',
  '♋': 'agua', '♏': 'agua', '♓': 'agua'
};

const ELEMENT_DATA = {
  fogo: {
    transits: [
      "O trânsito solar em conjunção com seu regente injeta uma poderosa carga de vitalidade na sua zona de autoexpressão,",
      "Marte ativa seu setor de projetos e ambições, acendendo o desejo de liderar e desbravar novos caminhos,",
      "Um trígono de fogo entre a Lua e o Sol traz uma clareza renovadora sobre quem você é e o que quer construir,",
      "O trânsito de Júpiter na sua casa da criatividade expande seus horizontes e impulsiona a tomada de riscos calculados,",
      "A passagem de Urano pelo seu Meio do Céu sacode antiga estruturas e exige uma postura ousada e inovadora,",
      "O alinhamento de Marte com o Sol desperta uma urgência criativa e uma necessidade profunda de quebrar velhas barreiras,",
      "A Lua Crescente no seu signo coirmão de fogo impulsiona sua coragem pessoal para tomar decisões rápidas,",
      "A influência de Quíron na sua zona de identidade ativa lembranças antigas que agora podem ser convertidas em força,",
      "A quadratura de Plutão com o seu regente tensiona sua necessidade de controle, convidando você a se desapegar,",
      "Um sextil planetário dinâmico acelera sua energia física, propiciando ações ousadas e iniciadas sob impulso consciente,"
    ],
    focusAreas: [
      " sugerindo que este é o momento perfeito para tomar a frente de negociações difíceis e mostrar seu valor profissional.",
      " o que favorece decisões corajosas na carreira, embora exija cautela para não atropelar o ritmo dos outros.",
      " abrindo as portas para novas ideias de negócios e parcerias dinâmicas com pessoas de grande influência.",
      " propiciando uma fase de forte poder de atração pessoal, ideal para resolver pendências em relacionamentos afetivos.",
      " trazendo à tona um insight brilhante para resolver aquele obstáculo financeiro que parecia intransponível.",
      " facilitando a liderança de novos projetos e inspirando as pessoas ao seu redor a agirem com entusiasmo.",
      " o que ajudará você a expressar seu brilho e autoridade natural com grande desenvoltura em público.",
      " trazendo a necessidade de canalizar sua paixão interna para evitar conflitos desnecessários com figuras de autoridade.",
      " favorecendo a superação rápida de desafios que antes pareciam travar suas ambições mais altas.",
      " abrindo portas para aventuras, novos começos profissionais e tomadas de decisão ousadas."
    ],
    advices: [
      " O conselho do oráculo é canalizar esse fogo interno em atividade física ou esportes para evitar a ansiedade.",
      " Evite discussões de ego hoje; use essa energia para projetar suas metas de longo prazo com foco e determinação.",
      " Vista algo em tons de vermelho ou laranja para sintonizar com a força realizadora do seu elemento.",
      " Uma pedra de jaspe vermelho ou pirita na sua mesa de trabalho ajudará a ancorar seu poder de realização.",
      " Reserve um tempo para respirar fundo e praticar o silêncio, permitindo que a intuição guie seus impulsos naturais.",
      " O oráculo sugere moderar a pressa; as melhores oportunidades nascem da ação guiada pela sabedoria, não pela impulsividade.",
      " Guarde seus planos mais valiosos a sete chaves hoje. O excesso de exposição pode dispersar o seu poder realizador.",
      " Pratique a generosidade com quem tem menos vitalidade que você, exercitando a nobreza nata do seu signo.",
      " Use um cristal de quartzo transparente para purificar sua mente e equilibrar a intensidade das suas emoções.",
      " Antes de falar, respire e conte até três; a palavra de fogo tem poder de criar, mas também de queimar pontes."
    ]
  },
  terra: {
    transits: [
      "Saturno estabelece um aspecto harmônico com a Lua, fortalecendo sua base estrutural e foco no plano material,",
      "O trânsito de Mercúrio na sua casa dos recursos financeiros traz excelente discernimento para acordos e análises,",
      "A influência de Vênus no seu setor prático favorece a organização da rotina e o cuidado meticuloso com o corpo,",
      "Um trígono de terra estimula a paciência e a estabilidade emocional, permitindo que você planeje a longo prazo,",
      "A energia de Plutão ativa seu setor de regeneração, convidando você a reorganizar hábitos nocivos de trabalho,",
      "O trânsito solar pela sua casa do trabalho prático ilumina suas responsabilidades diárias e atrai reconhecimento,",
      "O alinhamento de Urano com seu regente sacode a estabilidade material, trazendo oportunidades financeiras não planejadas,",
      "A Lua Minguante em signo de terra facilita o descarte de tarefas supérfluas e a otimização do seu tempo,",
      "A quadratura de Júpiter com seu planeta regente pede atenção para não exagerar nas promessas profissionais,",
      "Um sextil planetário estável conecta sua sabedoria ancestral com a necessidade de realizar coisas duradouras,"
    ],
    focusAreas: [
      " o que facilita o fechamento de contratos vantajosos e a estruturação lógica das suas metas profissionais.",
      " trazendo clareza para planejar investimentos, cortar gastos supérfluos e organizar sua vida material.",
      " sugerindo que a dedicação aos detalhes e a paciência com processos complexos trarão grandes recompensas hoje.",
      " propiciando um dia altamente produtivo para limpar pendências acumuladas e trazer ordem para a sua rotina diária.",
      " o que fortalece sua autoridade natural no trabalho, gerando admiração e respeito de colegas e superiores.",
      " facilitando a consolidação de ideias abstratas em resultados comerciais concretos e práticos.",
      " trazendo a oportunidade de negociar prazos, reorganizar orçamentos e otimizar processos de equipe.",
      " sugerindo que o foco no aperfeiçoamento técnico e na disciplina abrirá portas duradouras para sua carreira.",
      " o que ajudará a trazer estabilidade e segurança para as dinâmicas afetivas e familiares pendentes.",
      " propiciando o fechamento de ciclos desgastantes de trabalho para que novas fontes de renda surjam."
    ],
    advices: [
      " O conselho do oráculo hoje é manter os pés no chão, focando no que é prático e mensurável.",
      " Faça um banho de arruda ou sal grosso para descarregar tensões e restabelecer sua conexão com a terra.",
      " Use tons de verde-oliva ou marrom para atrair estabilidade e centramento ao longo do dia.",
      " Tenha um quartzo verde ou olho de tigre por perto para atrair prosperidade e proteger suas finanças.",
      " Lembre-se de que a pressa é inimiga da perfeição; respeite o tempo de maturação de seus projetos mais importantes.",
      " O oráculo sugere fazer contato com a natureza hoje, mesmo que seja pisando descalço na grama ou cuidando de plantas.",
      " Não carregue o peso do mundo nas costas; aprenda a delegar tarefas e proteger seu tempo de descanso.",
      " Use uma pedra de hematita para aterrar suas preocupações mentais e fortalecer sua resiliência física.",
      " Dedique um tempo para saborear sua alimentação sem telas por perto, honrando o ritmo natural do seu corpo.",
      " A estabilidade é sua força, mas não confunda estabilidade com estagnação; esteja aberto a pequenas melhorias práticas."
    ]
  },
  ar: {
    transits: [
      "A movimentação de Mercúrio no seu setor de comunicação estimula conexões mentais brilhantes e trocas de ideias,",
      "Um trígono de ar envolvendo a Lua abre novos canais de expressão social e favorece o diálogo esclarecedor,",
      "O trânsito de Urano na sua casa do intelecto traz insights revolucionários e soluções fora da caixa,",
      "Vênus ativa sua zona de contatos e redes sociais, facilitando a diplomacia e novos encontros significativos,",
      "O trânsito de Júpiter na sua casa das viagens e estudos expande sua curiosidade e sede de novos aprendizados,",
      "O alinhamento do Sol com Mercúrio clareia sua visão intelectual e facilita a escrita e a comunicação verbal,",
      "A Lua Nova em signo de ar ativa sua vida social, trazendo contatos inesperados de pessoas distantes,",
      "A passagem de Saturno pela sua zona de conexões intelectuais exige rigor e responsabilidade com o que você fala,",
      "A quadratura de Marte com seu regente acelera demais seus pensamentos, podendo gerar ansiedade ou dispersão,",
      "Um sextil planetário leve estimula sua adaptabilidade mental para lidar com imprevistos com excelente humor,"
    ],
    focusAreas: [
      " facilitando a articulação de projetos coletivos e ajudando a convencer pessoas com seus argumentos.",
      " o que propicia reuniões altamente proveitosas, parcerias intelectuais e o esclarecimento de mal-entendidos.",
      " sugerindo que uma abordagem leve e objetiva ajudará a resolver conflitos complexos no ambiente pessoal ou profissional.",
      " abrindo caminhos para divulgar seu trabalho, escrever, estudar e fechar parcerias que estimulem sua mente.",
      " o que trará novas perspectivas sobre sua filosofia de vida e ajudará a desatar nós burocráticos antigos.",
      " favorecendo a criação de conceitos inovadores e a estruturação de novos caminhos no ambiente de trabalho.",
      " facilitando negociações de parcerias e acordos informais onde a palavra é o principal elemento de confiança.",
      " o que permitirá expor suas ideias mais originais e revolucionárias com excelente aceitação do público.",
      " trazendo a necessidade de organizar seus focos diários para evitar que a dispersão sabote seus prazos.",
      " propiciando conversas leves e restauradoras com amigos que ajudam a aliviar a carga emocional recente."
    ],
    advices: [
      " O conselho do oráculo é evitar a dispersão mental: anote suas ideias em um papel para não se perder em pensamentos.",
      " Pratique meditação focada na respiração para acalmar o fluxo intenso de pensamentos que este trânsito traz." ,
      " Vista cores claras ou azul-celeste para sintonizar com a leveza e a clareza mental do seu elemento.",
      " Uma pedra de sodalita ou fluorita será sua grande aliada hoje para manter a concentração e a intuição afiadas.",
      " Esteja aberto a ouvir pontos de vista diferentes; a sabedoria pode vir de onde você menos espera hoje.",
      " O oráculo aconselha silenciar as redes sociais por algumas horas para restabelecer a clareza mental.",
      " Evite assumir compromissos que você não conseguirá cumprir; sua energia mental é alta, mas seu tempo é finito.",
      " Use um difusor com óleo essencial de alecrim ou menta para estimular o foco intelectual nos momentos de trabalho.",
      " Lembre-se de que a comunicação não verbal também importa: expresse seus limites com sutileza e elegância.",
      " Dê atenção a novas tecnologias ou métodos de trabalho que facilitem e otimizem as tarefas do seu cotidiano."
    ]
  },
  agua: {
    transits: [
      "Netuno em aspecto fluido com a Lua expande imensamente sua sensibilidade psíquica e intuição natural,",
      "O trânsito de Vênus na sua zona dos afetos profundos traz uma onda de acolhimento e cura para o coração,",
      "A quadratura de Marte com Plutão no seu setor interno pede cuidado com reações emocionais impulsivas,",
      "A Lua transitando pela sua casa da introspecção convida você a se recolher e escutar as respostas do subconsciente,",
      "Um trígono de água facilita a expressão artística e a liberação de bloqueios sentimentais antigos,",
      "A influência solar na sua zona de intimidade clareia questões ocultas e segredos familiares guardados,",
      "O alinhamento de Saturno com o seu regente traz maturidade e responsabilidade para gerenciar suas marés emocionais,",
      "A Lua Cheia em seu elemento aumenta sua sensibilidade psíquica, sugerindo que preste atenção aos seus pressentimentos,",
      "A quadratura de Mercúrio com seu planeta regente indica ruídos em conversas íntimas, pedindo mais empatia,",
      "Um trígono fluido de água reconecta sua alma com a egrégora de cura física e espiritual cósmica,"
    ],
    focusAreas: [
      " o que favorece a escuta da sua voz interior para tomar decisões importantes que a lógica racional não explica.",
      " propiciando uma atmosfera de profunda conexão nos relacionamentos mais íntimos e cura de antigas mágoas.",
      " sugerindo que o recolhimento e a meditação silenciosa serão cruciais para restaurar suas defesas energéticas.",
      " o que facilitará expressar seus sentimentos com arte e poesia, atraindo pessoas que vibram na mesma sintonia.",
      " trazendo revelações importantes através de sonhos ou sincronicidades que merecem ser anotadas.",
      " favorecendo reconciliações afetivas importantes e a resolução pacífica de pendências no lar.",
      " o que ajudará você a identificar e cortar vampirismos energéticos no trabalho ou círculo social.",
      " permitindo acessar memórias do passado sem dor, usando-as como chaves de autoconhecimento profundo.",
      " propiciando momentos de grande intuição para investimentos ou decisões profissionais de longo prazo.",
      " trazendo um forte apelo para cuidar de si e do bem-estar emocional daqueles que você ama."
    ],
    advices: [
      " O conselho do oráculo é blindar seu campo energético hoje: use uma turmalina negra e evite ambientes carregados.",
      " Um banho morno com pétalas de rosa branca e alfazema ajudará a restaurar seu equilíbrio emocional.",
      " Vista-se com tons de azul-marinho, violeta ou prata para vibrar em harmonia com sua sensibilidade oracular.",
      " Mantenha uma ametista ou selenita por perto para transmutar energias densas e clarear seu canal intuitivo.",
      " Não absorva as dores do mundo; lembre-se de estabelecer limites saudáveis entre o que é seu e o que é do outro.",
      " O oráculo aconselha tirar momentos de silêncio absoluto para ouvir o que seu corpo e suas emoções estão tentando dizer.",
      " Evite tomar decisões importantes sob forte estado emocional; espere a maré baixar para enxergar o fundo cristalino.",
      " Escreva seus sentimentos em um diário hoje; externalizar a água interna trará grande alívio e lucidez.",
      " Use um cristal de quartzo rosa para ativar a compaixão e o amor próprio nas suas relações afetivas.",
      " Beba bastante água e mantenha-se hidratado para facilitar o fluxo de eliminação de toxinas físicas e sutis."
    ]
  }
};

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
    const element = SIGN_ELEMENTS[signSymbol] || 'fogo';
    const transits = ELEMENT_DATA[element].transits;
    const focusAreas = ELEMENT_DATA[element].focusAreas;
    const advices = ELEMENT_DATA[element].advices;

    const idxTransit = Math.floor(rand() * transits.length);
    const idxFocus = Math.floor(rand() * focusAreas.length);
    const idxAdvice = Math.floor(rand() * advices.length);
    const idxColor = Math.floor(rand() * COLORS.length);
    const idxDay = Math.floor(rand() * DAYS.length);
    
    return {
      reading: `${transits[idxTransit]}${focusAreas[idxFocus]}${advices[idxAdvice]}`,
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
        <link rel="canonical" href="https://magiktarot.com.br/horoscopo" />
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
