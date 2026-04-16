// ── CONSULTAS ──────────────────────────────────────────
export const SERVICES = [
  {
    id: 'tarot',
    icon: '🃏',
    name: 'Tarot',
    arcane: 'Oráculo dos Arcanos Maiores',
    hook: 'Está em dúvida sobre uma decisão importante? As cartas revelam o caminho.',
    desc: 'Os Arcanos Maiores e Menores tecem o mapa do seu momento. As cartas não preveem — revelam o que já existe além do véu.',
    price: 'R$ 29,90',
    badge: null,
    type: 'tarot',
  },
  {
    id: 'astral',
    icon: '🌌',
    name: 'Mapa Astral',
    arcane: 'Mapa Natal das Almas',
    hook: 'Por que você age assim? Seu mapa astral revela quem você realmente é.',
    desc: 'No instante em que você chegou, os astros congelaram uma mensagem sobre quem você é. Este mapa a decifra.',
    price: 'R$ 49,90',
    badge: 'Popular',
    type: 'astral',
  },
  {
    id: 'sinastria',
    icon: '❤️‍🔥',
    name: 'Compatibilidade',
    arcane: 'Sinastria das Almas',
    hook: 'Você e essa pessoa têm futuro? O cosmos sabe a resposta.',
    desc: 'Duas almas com histórias cármicas distintas se encontraram. Revelamos por quê — e o que este encontro deve despertar em cada uma.',
    price: 'R$ 59,90',
    badge: null,
    type: 'sinastria',
  },
  {
    id: 'numerologia',
    icon: '✦',
    name: 'Numerologia',
    arcane: 'Códigos Numerológicos do Destino',
    hook: 'Qual é o seu número de vida — e o que ele diz sobre o que vem aí?',
    desc: 'Seu nome e data de chegada carregam uma frequência vibratória única. Decodificamos os números que regem seu destino e missão.',
    price: 'R$ 34,90',
    badge: null,
    type: 'numerologia',
  },
  {
    id: 'runas',
    icon: '𝔉',
    name: 'Runas',
    arcane: 'Oráculo Rúnico do Futhark',
    hook: 'Tem uma pergunta que ninguém consegue responder? As Runas dão uma resposta direta.',
    desc: 'As 24 runas do Futhark Antigo trazem a voz dos deuses nórdicos para responder aquilo que outras práticas não alcançam.',
    price: 'R$ 39,90',
    badge: 'Novo',
    type: 'runas',
  },
  {
    id: 'akasico',
    icon: '📜',
    name: 'Vida Passada',
    arcane: 'Registros Akáshicos da Alma',
    hook: 'Por que esse padrão se repete na sua vida? A resposta pode estar em outra vida.',
    desc: 'Acessamos a memória eterna da sua alma nas dimensões superiores — padrões cármicos, contratos de alma e missões não cumpridas.',
    price: 'R$ 79,90',
    badge: 'Raro',
    type: 'akasico',
  },
  {
    id: 'quiromancia',
    icon: '🖐️',
    name: 'Quiromancia',
    arcane: 'Quiromancia Oracular',
    hook: 'O que as linhas das suas mãos revelam sobre seu futuro e sua missão?',
    desc: 'As linhas gravadas em suas mãos antes do nascimento contam a história que os planetas traçaram. Cada sulco é uma profecia.',
    price: 'R$ 44,90',
    badge: null,
    type: 'quiromancia',
  },
];

// ── ZODIAC ────────────────────────────────────────────
export const ZODIAC = [
  { sign: '♈', name: 'Áries',       dates: '21 Mar – 19 Abr', color: '#c85a5a' },
  { sign: '♉', name: 'Touro',       dates: '20 Abr – 20 Mai', color: '#5a9c5a' },
  { sign: '♊', name: 'Gêmeos',      dates: '21 Mai – 20 Jun', color: '#c9a84c' },
  { sign: '♋', name: 'Câncer',      dates: '21 Jun – 22 Jul', color: '#5a8bc8' },
  { sign: '♌', name: 'Leão',        dates: '23 Jul – 22 Ago', color: '#c8843c' },
  { sign: '♍', name: 'Virgem',      dates: '23 Ago – 22 Set', color: '#7d9c5a' },
  { sign: '♎', name: 'Libra',       dates: '23 Set – 22 Out', color: '#c87da0' },
  { sign: '♏', name: 'Escorpião',   dates: '23 Out – 21 Nov', color: '#8b3a8b' },
  { sign: '♐', name: 'Sagitário',   dates: '22 Nov – 21 Dez', color: '#7a5ac8' },
  { sign: '♑', name: 'Capricórnio', dates: '22 Dez – 19 Jan', color: '#4a7a8b' },
  { sign: '♒', name: 'Aquário',     dates: '20 Jan – 18 Fev', color: '#3a9cbf' },
  { sign: '♓', name: 'Peixes',      dates: '19 Fev – 20 Mar', color: '#6b5ac8' },
];

// ── PRODUCTS ──────────────────────────────────────────
export const PRODUCTS = [
  { id: 1, icon: '🔮', category: 'Cristais',  name: 'Bola de Cristal Selenita', desc: 'Pedra de selenita pura, ideal para meditação e clareza mental.',           price: 'R$ 89,00',  url: '#' },
  { id: 2, icon: '🕯️', category: 'Velas',     name: 'Kit Velas Planetárias',   desc: 'Sete velas consagradas sob os planetas do sistema solar.',                price: 'R$ 65,00',  url: '#' },
  { id: 3, icon: '🌿', category: 'Ervas',     name: 'Ervas Sagradas',           desc: 'Blend de ervas para proteção, amor e prosperidade.',                      price: 'R$ 38,00',  url: '#' },
  { id: 4, icon: '📿', category: 'Cristais',  name: 'Quartzo Rosa Bruto',       desc: 'Cristal natural de quartzo rosa, ativador do chakra cardíaco.',           price: 'R$ 45,00',  url: '#' },
  { id: 5, icon: '🃏', category: 'Baralhos',  name: 'Baralho Cigano Completo',  desc: 'Baralho de 36 cartas com livro de interpretações.',                       price: 'R$ 120,00', url: '#' },
  { id: 6, icon: '🌙', category: 'Velas',     name: 'Incenso Lua Cheia',        desc: 'Blend exclusivo para rituais de lua cheia e intenções.',                  price: 'R$ 29,00',  url: '#' },
  { id: 7, icon: '⚡', category: 'Cristais',  name: 'Obsidiana Negra',          desc: 'Pedra de proteção e escudo contra energias negativas.',                   price: 'R$ 55,00',  url: '#' },
  { id: 8, icon: '✨', category: 'Todos',     name: 'Kit Iniciante Místico',    desc: 'Tudo que você precisa para começar sua jornada espiritual.',             price: 'R$ 180,00', url: '#' },
];

// ── BLOG POSTS ─────────────────────────────────────────
export const BLOG_POSTS = [
  { tag: 'Tarot',       icon: '🃏', bg: 'linear-gradient(135deg,#1a0a2e,#2d1257)', title: 'O Arcano da Torre: quando tudo desmorona para renascer',                    excerpt: 'Entenda como o arcano mais temido do Tarot carrega em si o semente da transformação profunda.',                                          date: '12 Abr 2026' },
  { tag: 'Astrologia',  icon: '🌌', bg: 'linear-gradient(135deg,#0a1a2e,#0d2b4a)', title: 'Júpiter em Gêmeos: expansão pelo conhecimento e comunicação',               excerpt: 'Como o maior planeta do sistema solar está influenciando sua capacidade de aprender e se expressar.',                                    date: '9 Abr 2026'  },
  { tag: 'Numerologia', icon: '🔢', bg: 'linear-gradient(135deg,#1a2e0a,#1a3d0d)', title: 'O Número do Destino: como calculá-lo e o que ele revela',                  excerpt: 'Aprenda a descobrir seu número de destino e compreenda os talentos que você trouxe para esta vida.',                                    date: '5 Abr 2026'  },
  { tag: 'Rituais',     icon: '🕯️', bg: 'linear-gradient(135deg,#2e1a0a,#4a2b0d)', title: 'Ritual de Lua Nova: semear intenções no solo do cosmos',                   excerpt: 'Um guia completo para aproveitar a energia da lua nova para manifestar seus desejos mais profundos.',                                    date: '1 Abr 2026'  },
  { tag: 'Cristais',    icon: '💎', bg: 'linear-gradient(135deg,#0a2e2e,#0d4a4a)', title: 'Ametista: a pedra da transmutação e sabedoria superior',                   excerpt: 'Conheça todas as propriedades desta pedra sagrada e aprenda a ativá-la para potencializar seus efeitos.',                                date: '28 Mar 2026' },
  { tag: 'Horóscopo',  icon: '♈', bg: 'linear-gradient(135deg,#2e0a1a,#4a0d2b)', title: 'Horóscopo de Abril: reorientação e clareza para todos os signos',           excerpt: 'As previsões astrológicas detalhadas para cada signo neste poderoso mês de transformação.',                                             date: '25 Mar 2026' },
];

// ── TESTIMONIALS ───────────────────────────────────────
export const TESTIMONIALS = [
  { stars: '★★★★★', text: 'A leitura do meu mapa astral foi absurdamente precisa. Tocou em pontos que eu nunca tinha compartilhado com ninguém. Simplesmente impressionante.', name: 'Mariana C.', meta: 'Mapa Astral · Mar 2026',  av: '🌙' },
  { stars: '★★★★★', text: 'Fiz a tiragem de tarot antes de uma decisão importante. A interpretação me deu clareza e a coragem de seguir meu caminho. Gratidão eterna.',        name: 'Rafael S.',  meta: 'Tarot · Fev 2026',       av: '⭐' },
  { stars: '★★★★★', text: 'A sinastria que fizeram para mim e meu parceiro revelou dinâmicas que estávamos vivendo sem entender. Mudou completamente nossa relação.',          name: 'Camila P.',  meta: 'Sinastria · Jan 2026',    av: '🔮' },
];

// ── HOROSCOPES ─────────────────────────────────────────
export const HOROSCOPES = {
  '♈': { name: 'Áries',       reading: 'Marte, seu regente, ativa a casa da carreira com força inédita. Aproveite esta janela para liderar projetos que ficaram represados. A energia de impulso está a seu favor, mas cuidado com a impaciência que pode custar relações importantes. Venus em trígono sugere uma surpresa amorosa no final do mês.',                                                                                                                                     lucky: 'Vermelho',      num: '9',  day: 'Terça'   },
  '♉': { name: 'Touro',       reading: 'Vênus ilumina sua casa de valores e recursos com uma luz dourada. Momento propício para negociações financeiras e revisão do que você realmente preza. Uma intuição que vem surgindo merece atenção especial: o cosmos a confirma como verdadeira. Conecte-se com a natureza para ancorar as energias.',                                                                                                                                              lucky: 'Verde',         num: '6',  day: 'Sexta'   },
  '♊': { name: 'Gêmeos',      reading: 'Júpiter expande suas perspectivas de maneira extraordinária. Projetos de aprendizado e comunicação estão abençoados. Um encontro fortuito pode abrir uma porta profissional que você não esperava. Cuide do excesso de estímulos: seu sistema nervoso precisa de momentos de silêncio.',                                                                                                                                                              lucky: 'Amarelo',       num: '5',  day: 'Quarta'  },
  '♋': { name: 'Câncer',      reading: 'A Lua, sua regente, transita por setores de profundidade e transformação. Sonhos reveladores podem trazer mensagens importantes da sua alma. Um ciclo emocional chega ao fim, liberando espaço para algo mais autêntico. Confie na sua intuição — ela está em sincronia perfeita com o cosmos.',                                                                                                                                                       lucky: 'Prata',         num: '2',  day: 'Segunda' },
  '♌': { name: 'Leão',        reading: 'O Sol brilha em seu setor de parcerias, trazendo foco às suas relações. Um amor pode se aprofundar significativamente ou uma parceria profissional pode se tornar algo especial. Sua generosidade natural está em alta, mas lembre-se de também receber sem culpa. Criatividade em pico nesta semana.',                                                                                                                                               lucky: 'Dourado',       num: '1',  day: 'Domingo' },
  '♍': { name: 'Virgem',      reading: 'Mercúrio em harmonia ativa sua capacidade analítica de forma excepcional. Ideal para revisar projetos, organizar finanças e cuidar da saúde. Um detalhe que você perceber e outros ignorarem pode ser a chave de uma grande virada. Confie na sua precisão — ela é um dom.',                                                                                                                                                                          lucky: 'Verde-terra',   num: '5',  day: 'Quarta'  },
  '♎': { name: 'Libra',       reading: 'Vênus ilumina seu sol natal com graça e harmonia. Relacionamentos florescem e a beleza ao redor parece intensificada. Decisões que você adiou pedem resolução: use seu dom inato de equilíbrio. Uma proposta criativa ou amorosa merece ser aceita sem hesitação.',                                                                                                                                                                                   lucky: 'Rosa',          num: '6',  day: 'Sexta'   },
  '♏': { name: 'Escorpião',   reading: 'Plutão ativa transformações profundas que você sente há meses. O que resiste a morrer está atrasando seu renascimento. Mergulhe com coragem no desconhecido — sua força interior é maior do que você imagina. Finanças compartilhadas requerem atenção especial esta semana.',                                                                                                                                                                        lucky: 'Bordo',         num: '8',  day: 'Terça'   },
  '♐': { name: 'Sagitário',   reading: 'Júpiter retorna ao seu signo trazendo uma dose extra de otimismo e expansão. Viagens, estudos e filosofia estão em evidência. Um insight sobre sua missão de vida pode surgir de forma repentina e luminosa. Suas palavras têm poder especial agora — use-as com sabedoria.',                                                                                                                                                                         lucky: 'Roxo',          num: '3',  day: 'Quinta'  },
  '♑': { name: 'Capricórnio', reading: 'Saturno consolida estruturas que você construiu com tanto esforço. Reconhecimento profissional chega de forma discreta mas significativa. Permita-se uma pausa contemplativa: o trabalho árduo merece ser celebrado. Uma conversa com alguém mais velho traz sabedoria que transformará sua perspectiva.',                                                                                                                                             lucky: 'Cinza',         num: '4',  day: 'Sábado'  },
  '♒': { name: 'Aquário',     reading: 'Urano ativa sua originalidade de modo explosivo. Ideias revolucionárias surgem em momentos inesperados — tenha sempre onde anotá-las. Grupos e redes sociais são canais poderosos agora. Uma causa coletiva que você abraçar pode ter impacto muito maior do que você imagina.',                                                                                                                                                                      lucky: 'Azul-elétrico', num: '11', day: 'Sábado'  },
  '♓': { name: 'Peixes',      reading: 'Netuno amplifica sua sensibilidade e intuição mística. Sonhos proféticos são comuns neste período — anote-os ao acordar. A arte e a espiritualidade oferecem refúgio e revelação. Cuidado com ilusões em relações: peça clareza com gentileza antes de tomar decisões baseadas em suposições.',                                                                                                                                                       lucky: 'Aqua',          num: '7',  day: 'Quinta'  },
};

// ── TAROT CARDS ────────────────────────────────────────
export const TAROT_CARDS = [
  { name: 'O Louco',       icon: '🃏' },
  { name: 'A Sacerdotisa', icon: '🌙' },
  { name: 'A Estrela',     icon: '⭐' },
  { name: 'O Mundo',       icon: '🌍' },
  { name: 'O Sol',         icon: '☀️' },
  { name: 'A Lua',         icon: '🌛' },
  { name: 'A Torre',       icon: '⚡' },
  { name: 'A Força',       icon: '🦁' },
  { name: 'O Julgamento',  icon: '🔔' },
  { name: 'O Imperador',   icon: '👑' },
];

// ── HOW IT WORKS ───────────────────────────────────────
export const HOW_IT_WORKS = [
  { n: '01', t: 'Escolha seu portal',      d: 'Selecione a modalidade que ressoa com o que sua alma busca neste ciclo.'          },
  { n: '02', t: 'Declare sua intenção',    d: 'Responda as perguntas sagradas que abrirão os véus correspondentes à sua leitura.' },
  { n: '03', t: 'Sele o acesso via PIX',   d: 'Processo instantâneo e seguro. O ritual começa assim que o cosmos confirma.'       },
  { n: '04', t: 'Receba a revelação',       d: 'Nossa inteligência oracular decifra os padrões cósmicos únicos da sua alma.'     },
];
