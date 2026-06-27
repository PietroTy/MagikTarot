import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import '../../styles/modal.css'; // Reutiliza as classes de estilo místicas
import { solicitarLeitura } from '../../services/aiService';
import { createOrder, checkPaymentStatus } from '../../services/paymentService';
import { useData } from '../../context/DataContext';


// ── RITUAL DE EMBARALHAR E FALLBACKS DE CARTAS ──
const CARD_BACK_URL = `${process.env.PUBLIC_URL}/assets/tarot-cards/back.png`;

const TAROT_CARDS_FALLBACK = [
  { name: 'O Louco',       id: '0_louco' },
  { name: 'A Sacerdotisa', id: 'ii_sacerdotisa' },
  { name: 'A Estrela',     id: 'xvii_estrela' },
  { name: 'O Mundo',       id: 'xxi_mundo' },
  { name: 'O Sol',         id: 'xix_sol' },
  { name: 'A Lua',         id: 'xviii_lua' },
  { name: 'A Torre',       id: 'xvi_torre' },
  { name: 'A Força',       id: 'xi_forca' },
  { name: 'O Julgamento',  id: 'xx_julgamento' },
  { name: 'O Imperador',   id: 'iv_imperador' },
];

const SUIT_NAMES  = { wands: 'Paus', cups: 'Copas', swords: 'Espadas', pentacles: 'Ouros' };
const RANK_NAMES  = ['Ás','2','3','4','5','6','7','8','9','10','Valete','Cavaleiro','Rainha','Rei'];
const MINOR_ARCANA = Object.keys(SUIT_NAMES).flatMap(suit =>
  RANK_NAMES.map(rank => ({
    id: null,
    name: `${rank} de ${SUIT_NAMES[suit]}`,
    suit,
  }))
);

function CardImage({ card, revealed = true }) {
  const [error, setError] = useState(false);
  const isReversed = card?.reversed || false;
  const reverseStyle = isReversed && revealed ? { transform: 'rotate(180deg)' } : {};

  if (!revealed) {
    return (
      <div className="tarot-card back">
        <img src={CARD_BACK_URL} alt="Verso" onError={(e) => {
          e.target.style.display = 'none';
        }} />
      </div>
    );
  }

  if (error || !card?.id) {
    return (
      <div className="tarot-card revealed" style={reverseStyle}>
        <span className="card-fallback-icon">✦</span>
        <span className="card-fallback-name">
          {card?.name}{isReversed ? ' ↑↓' : ''}
        </span>
      </div>
    );
  }

  return (
    <div className="tarot-card revealed" style={reverseStyle}>
      <img 
        src={`${process.env.PUBLIC_URL}/assets/tarot-cards/${card.id}.png`} 
        alt={card.name} 
        onError={() => setError(true)}
      />
    </div>
  );
}

// ── MAPEAMENTO DE TIRAGENS POR SERVIÇO ──
const SPREADS_MAP = {
  'tarot-sim-ou-nao': [
    {
      id: 'sim-nao-1',
      name: 'Decisão Direta (1 Carta)',
      cards: 1,
      positions: ['Veredito / Resposta de Sim ou Não'],
      desc: 'Resposta direta e objetiva para sua dúvida.'
    },
    {
      id: 'sim-nao-3',
      name: 'Tríade de Decisão (3 Cartas)',
      cards: 3,
      positions: ['O que ajuda (Prós)', 'O que bloqueia (Contras)', 'Veredito / Caminho Ideal'],
      desc: 'Análise detalhada de prós, contras e a resposta definitiva.'
    }
  ],
  'tarot-do-amor': [
    {
      id: 'amor-3',
      name: 'Tríade Amorosa (3 Cartas)',
      cards: 3,
      positions: ['Sua energia na relação', 'A energia do parceiro', 'O futuro do relacionamento'],
      desc: 'Entenda os sentimentos mútuos e a evolução do casal.'
    },
    {
      id: 'amor-5',
      name: 'Templo de Afrodite (5 Cartas)',
      cards: 5,
      positions: ['Sua mente na relação', 'A mente do parceiro', 'Seu coração na relação', 'O coração do parceiro', 'O destino da relação'],
      desc: 'Consulta profunda sobre os pensamentos, sentimentos e futuro do casal.'
    }
  ],
  'tarot-carreira': [
    {
      id: 'carreira-3',
      name: 'Decisão Profissional (3 Cartas)',
      cards: 3,
      positions: ['Caminho A (Manter a situação)', 'Caminho B (Mudança de direção)', 'Conselho do Oráculo'],
      desc: 'Ideal para quando você está dividido entre duas opções.'
    },
    {
      id: 'carreira-4',
      name: 'Caminho do Sucesso (4 Cartas)',
      cards: 4,
      positions: ['Situação Atual', 'O Desafio / Bloqueio', 'A Oportunidade Oculta', 'Resultado / Conselho Prático'],
      desc: 'Descubra bloqueios de prosperidade e como superá-los.'
    }
  ],
  'energia-do-mes': [
    {
      id: 'mes-3',
      name: 'Tríade Mensal (3 Cartas)',
      cards: 3,
      positions: ['Energia Geral do Mês', 'O Desafio', 'A Oportunidade'],
      desc: 'Panorama de tendências, obstáculos e bênçãos do mês.'
    },
    {
      id: 'mes-4',
      name: 'Previsão Semanal (4 Cartas)',
      cards: 4,
      positions: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
      desc: 'Uma carta guia para cada semana do seu mês.'
    }
  ]
};

// ── PROMPT BUILDER ──
function buildPrompt(service, form, extra = {}) {
  const systemPrompt = `Você é Magik Tarot, um(a) mestre oracular empático, assertivo(a) e misterioso(a).
Siga RIGOROSAMENTE estas diretrizes em sua resposta:
1. Você NUNCA deve utilizar emojis ou emoticons em sua resposta.
2. Sempre inicie a resposta cumprimentando calorosamente o consultante pelo nome "${form.nome || 'Buscador(a)'}", desejando-lhe boas-vindas e clareza para a consulta.
3. A formatação deve ser muito limpa, organizada e fácil de ler, dividida em parágrafos curtos, tópicos objetivos (bullet points) para conselhos práticos de ação, e com subtítulos em negrito ou destaque para cada seção.
4. Evite floreios cósmicos excessivos e palavras excessivamente abstratas ou "viajadas". Foque nas reais dores humanas (medos, desejos, incertezas de relacionamento ou carreira) e dê respostas e direcionamentos práticos que tragam valor imediato.
5. CADA CARTA deve receber um parágrafo próprio e dedicado. Nesse parágrafo, identifique o arcano e conecte sua energia diretamente ao tema, explicando o significado da posição da tiragem ("${extra.spreadName || 'posição da carta'}").`;

  const cardPositions = extra.positions || [];
  const cardsPromptStr = `\n\nCartas sorteadas para a tiragem "${extra.spreadName || 'Tarot'}":\n` + 
    (extra.cards || []).map((c, i) => {
      const posName = cardPositions[i] || `Posição ${i+1}`;
      return `- Posição "${posName}": Carta "${c.name}"${c.reversed ? ' [INVERTIDA]' : ''}`;
    }).join('\n') +
    `\nPor favor, faça a leitura incorporando de forma integrada a energia de cada uma dessas cartas sorteadas em suas respectivas posições.`;

  const contexts = {
    'tarot-sim-ou-nao': `O(a) consultante ${form.nome || 'buscador'} deseja uma resposta direta para a seguinte pergunta: "${form.pergunta}".${cardsPromptStr}\nInstrução: Dê uma resposta direta de SIM, NÃO ou TALVEZ baseada nas cartas sorteadas, justificando-a e dando direcionamentos claros de ação.`,
    'tarot-do-amor': `O(a) consultante ${form.nome || 'buscador'} busca clareza no amor. Status atual: ${form.status_amoroso || 'não informado'}. Dúvida principal: "${form.pergunta || 'não informada'}".${cardsPromptStr}\nInstrução: Analise as cartas focando exclusivamente na dinâmica afetiva e sentimentos ocultos, dando conselhos práticos e diretos.`,
    'tarot-carreira': `O(a) consultante ${form.nome || 'buscador'} busca orientação profissional e financeira. Situação atual: ${form.situacao_atual || 'não informada'}.${cardsPromptStr}\nInstrução: Analise as cartas focando em trabalho, direcionamento de carreira e caminhos para a abundância com conselhos de ação.`,
    'energia-do-mes': `O(a) consultante ${form.nome || 'buscador'} busca as tendências e panorama para o mês selecionado: ${form.mes || 'este mês'}.${cardsPromptStr}\nInstrução: Revele as tendências energéticas do mês, oportunidades que surgirão e bloqueios que precisam de atenção, dando conselhos práticos.`,
    'mapa-astral': `O(a) consultante ${form.nome || 'buscador'} solicita a leitura do Mapa Natal Astrológico. Data de nascimento: ${form.nascimento || 'não informada'}. Hora exata: ${form.hora || 'não informada'}. Local de nascimento: ${form.local || 'não informado'}.\nInstrução: Faça uma leitura profunda baseada nessas coordenadas, revelando os posicionamentos prováveis de Sol, Lua e Ascendente. Descreva os pontos fortes, desafios emocionais e propósito de vida com conselhos práticos de ação.`,
    'sinastria': `O(a) consultante ${form.nome || 'buscador'} solicita a leitura de Sinastria. Dados do consultante: Nascido(a) em ${form.nascimento || 'não informado'}. Dados da outra pessoa (${form.nome2 || 'desconhecido'}): Nascido(a) em ${form.nascimento2 || 'não informado'}. Tipo de vínculo: ${form.vinculo || 'não especificado'}. O que deseja entender: "${form.pergunta || 'não declarado'}".\nInstrução: Revele a compatibilidade astrológica e energética entre essas duas pessoas. Explore os pontos de harmonia, tensões cármicas e conselhos práticos para a relação.`
  };

  const userContext = contexts[service.id] || contexts['tarot-sim-ou-nao'];

  return [
    { role: 'system', content: systemPrompt },
    { role: 'user',   content: userContext },
  ];
}

// ── CAMPOS DINÂMICOS ──
function FormFields({ service, form, updateForm }) {
  const id = service.id;
  return (
    <>
      {service.type === 'tarot' && SPREADS_MAP[id] && (
        <div className="form-group">
          <label className="form-label">Tipo de Tiragem / Método</label>
          <select 
            className="form-select" 
            value={form.tiragem} 
            onChange={e => updateForm('tiragem', e.target.value)} 
            required
            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,215,0,0.2)', background: '#141419', color: '#fff' }}
          >
            {SPREADS_MAP[id].map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.cards} {s.cards === 1 ? 'carta' : 'cartas'})
              </option>
            ))}
          </select>
          <div style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '0.4rem', color: 'var(--gold-light)' }}>
            {SPREADS_MAP[id].find(s => s.id === form.tiragem)?.desc}
          </div>
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Seu nome ou apelido</label>
        <input
          className="form-input"
          value={form.nome}
          onChange={e => updateForm('nome', e.target.value)}
          placeholder="Como prefere ser chamado(a)?"
          required
        />
      </div>


      {id === 'tarot-sim-ou-nao' && (
        <div className="form-group">
          <label className="form-label">Qual é a sua pergunta direta?</label>
          <textarea
            className="form-textarea"
            value={form.pergunta}
            onChange={e => updateForm('pergunta', e.target.value)}
            placeholder="Pense bem e faça uma pergunta que possa ser respondida com Sim ou Não..."
            required
          />
        </div>
      )}

      {id === 'tarot-do-amor' && (
        <>
          <div className="form-group">
            <label className="form-label">Status amoroso atual</label>
            <select className="form-select" value={form.status_amoroso} onChange={e => updateForm('status_amoroso', e.target.value)} required>
              <option value="">Selecione...</option>
              <option value="solteiro">Solteiro(a)</option>
              <option value="ficando">Ficando / Conhecendo alguém</option>
              <option value="relacionamento">Em um relacionamento sério</option>
              <option value="termino">Término recente</option>
              <option value="reconexao">Buscando reconexão</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Qual a sua principal dúvida?</label>
            <textarea
              className="form-textarea"
              value={form.pergunta}
              onChange={e => updateForm('pergunta', e.target.value)}
              placeholder="Descreva brevemente o que você quer saber sobre sua vida amorosa..."
              required
            />
          </div>
        </>
      )}

      {id === 'tarot-carreira' && (
        <div className="form-group">
          <label className="form-label">Qual a sua situação profissional atual?</label>
          <textarea
            className="form-textarea"
            value={form.situacao_atual}
            onChange={e => updateForm('situacao_atual', e.target.value)}
            placeholder="Ex: Estou buscando emprego, quero mudar de área, tenho um negócio..."
            required
          />
        </div>
      )}

      {id === 'energia-do-mes' && (
        <div className="form-group">
          <label className="form-label">Mês desejado para a leitura</label>
          <input
            type="month"
            className="form-input"
            value={form.mes}
            onChange={e => updateForm('mes', e.target.value)}
            required
          />
        </div>
      )}

      {id === 'mapa-astral' && (
        <>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Data de nascimento</label>
              <input type="date" className="form-input" value={form.nascimento} onChange={e => updateForm('nascimento', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Hora exata</label>
              <input type="time" className="form-input" value={form.hora} onChange={e => updateForm('hora', e.target.value)} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Cidade e Estado de nascimento</label>
            <input className="form-input" value={form.local} onChange={e => updateForm('local', e.target.value)} placeholder="Ex: São Paulo, SP" required />
          </div>
        </>
      )}

      {id === 'sinastria' && (
        <>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Sua data de nascimento</label>
              <input type="date" className="form-input" value={form.nascimento} onChange={e => updateForm('nascimento', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Nome da outra pessoa</label>
              <input className="form-input" value={form.nome2} onChange={e => updateForm('nome2', e.target.value)} placeholder="Nome ou apelido" required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Data de nascimento da outra pessoa</label>
            <input type="date" className="form-input" value={form.nascimento2} onChange={e => updateForm('nascimento2', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Tipo de vínculo</label>
            <select className="form-select" value={form.vinculo} onChange={e => updateForm('vinculo', e.target.value)} required>
              <option value="">Selecione...</option>
              <option value="amoroso">Romântico / Amoroso</option>
              <option value="amizade">Amizade</option>
              <option value="profissional">Profissional / Sociedade</option>
              <option value="familiar">Familiar</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">O que você quer entender sobre essa relação?</label>
            <textarea className="form-textarea" value={form.pergunta} onChange={e => updateForm('pergunta', e.target.value)} placeholder="Qual a sua maior dúvida?" required />
          </div>
        </>
      )}
    </>
  );
}

const INITIAL_FORM = {
  nome: '', email: '', pergunta: '', situacao_atual: '', mes: '',
  status_amoroso: '', nascimento: '', hora: '', local: '', 
  nome2: '', nascimento2: '', vinculo: '',
  tiragem: '', 
  incluirMenores: false,
  permitirInvertidas: false,
};

// ── COMPONENTE PRINCIPAL DA PÁGINA ──
export default function RitualPage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { data: { services, tarotCards: CARDS_DB } } = useData();

  const service = services.find(s => s.id === serviceId);

  const [step, setStep] = useState('form');
  const [form, setForm] = useState(() => {
    const defaultTiragem = SPREADS_MAP[serviceId]?.[0]?.id || '';
    return { ...INITIAL_FORM, tiragem: defaultTiragem };
  });

  // Atualiza a tiragem padrão quando muda de serviço
  useEffect(() => {
    if (serviceId) {
      const defaultTiragem = SPREADS_MAP[serviceId]?.[0]?.id || '';
      setForm(f => ({ ...f, tiragem: defaultTiragem }));
    }
  }, [serviceId]);

  // Pagamento
  const [orderId, setOrderId] = useState(null);
  const [checkoutUrl, setCheckoutUrl] = useState('');
  const [payError, setPayError] = useState('');
  const [payStatus, setPayStatus] = useState('pending');
  const pollingRef = useRef(null);

  // Seleção de Cartas
  const [shuffledDeck, setShuffledDeck] = useState([]);
  const [pickedIndices, setPickedIndices] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [readingError, setReadingError] = useState('');

  const updateForm = (field, value) => setForm(f => ({ ...f, [field]: value }));

  // Limpa polling ao desmontar
  useEffect(() => {
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, []);

  const DEBUG_BYPASS_PAYMENT = process.env.REACT_APP_DEBUG_PAYMENT === 'true';

  if (!service) {
    return (
      <div style={{ minHeight: '100vh', padding: '10rem 2rem', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--gold)', marginBottom: '1.5rem' }}>Ritual Não Encontrado</h2>
        <p style={{ opacity: 0.8, marginBottom: '2rem' }}>O ritual que você está tentando iniciar não existe ou foi modificado.</p>
        <Link to="/consultas" className="btn-primary" style={{ textDecoration: 'none', padding: '1rem 2rem' }}>
          Ver Consultas Disponíveis
        </Link>
      </div>
    );
  }

  // ── SUBMIT DO FORMULÁRIO ──
  const handleSubmit = async () => {
    if (!form.nome.trim()) {
      setPayError('Por favor, informe seu nome para sintonizar a consulta.');
      return;
    }
    setPayError('');
    setStep('mp_creating');

    try {
      if (DEBUG_BYPASS_PAYMENT) {
        const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3003';
        const res = await fetch(`${baseUrl}/payment/debug/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            serviceId:   service.id,
            serviceName: service.name,
            price:       service.price,
            formData:    form,
          }),
        });
        const order = await res.json();
        setOrderId(order.orderId);
        setPayStatus('approved');

        if (service.type === 'tarot') {
          prepararMesa();
        } else {
          iniciarLeitura([]);
        }
        return;
      }

      const order = await createOrder({
        serviceId:   service.id,
        serviceName: service.name,
        price:       service.price,
        formData:    form,
      });
      setOrderId(order.orderId);
      setCheckoutUrl(order.checkoutUrl);
      setPayStatus('pending');
      setStep('mp_checkout');
      startPolling(order.orderId);
    } catch (err) {
      setPayError('Não foi possível iniciar o pagamento. Tente novamente.');
      setStep('form');
    }
  };

  // ── PREPARAR DECK E EMBARALHAR ──
  const prepararMesa = () => {
    setStep('shuffling');
    const majorArcana = (CARDS_DB && CARDS_DB.length > 0) ? CARDS_DB : TAROT_CARDS_FALLBACK;
    const fullDeck = form.incluirMenores ? [...majorArcana, ...MINOR_ARCANA] : majorArcana;

    const deckWithReversed = fullDeck.map(card => ({
      ...card,
      reversed: form.permitirInvertidas ? Math.random() < 0.35 : false,
    }));

    const shuffled = [...deckWithReversed].sort(() => Math.random() - 0.5);
    setShuffledDeck(shuffled);
    setPickedIndices([]);
    setTimeout(() => setStep('picking'), 2500);
  };

  // ── CLIQUE NA CARTA ──
  const handlePickCard = (index) => {
    if (pickedIndices.includes(index)) return;
    
    const serviceSpreads = SPREADS_MAP[service.id] || [];
    const currentSpread = serviceSpreads.find(s => s.id === form.tiragem) || serviceSpreads[0] || { cards: 3 };
    const cardCount = currentSpread.cards;
    
    if (pickedIndices.length >= cardCount) return;
    
    const newPicked = [...pickedIndices, index];
    setPickedIndices(newPicked);
    
    if (newPicked.length === cardCount) {
      const cards = newPicked.map(idx => shuffledDeck[idx]);
      setSelectedCards(cards);
      setTimeout(() => iniciarLeitura(cards), 600);
    }
  };

  // ── INICIAR GERAÇÃO DA LEITURA IA ──
  const iniciarLeitura = async (cards) => {
    setStep('loading');
    setReadingError('');

    const serviceSpreads = SPREADS_MAP[service.id] || [];
    const currentSpread = serviceSpreads.find(s => s.id === form.tiragem) || serviceSpreads[0] || { cards: 3, name: 'Tarot', positions: [] };
    const messages = buildPrompt(service, form, {
      spreadName: currentSpread.name,
      positions:  currentSpread.positions,
      cards,
      allowReversed: form.permitirInvertidas,
    });

    try {
      await solicitarLeitura({
        orderId:     orderId,
        serviceType: service.type,
        messages,
        cards,
      });
      navigate(`/resultado/${orderId}`);
    } catch (err) {
      setReadingError('Os véus espirituais resistem por ora... Tente novamente.');
      setStep('loading_error');
    }
  };

  // ── POLLING DO PAGAMENTO ──
  const startPolling = (id) => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = setInterval(async () => {
      try {
        const { status } = await checkPaymentStatus(id);
        setPayStatus(status);
        if (status === 'approved') {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
          if (service.type === 'tarot') {
            prepararMesa();
          } else {
            iniciarLeitura([]);
          }
        }
        if (status === 'rejected' || status === 'cancelled') {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
          setPayError('O pagamento foi recusado ou cancelado. Tente gerar novamente.');
          setStep('form');
        }
      } catch { /* erros de rede isolados ignorados */ }
    }, 4000);
  };

  const handleOpenCheckout = () => {
    if (checkoutUrl) window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
  };

  // ── PASSO DE ESCOLHA DE CARTAS (PICKING - TELA CHEIA) ──
  if (step === 'picking') {
    const serviceSpreads = SPREADS_MAP[service.id] || [];
    const currentSpread = serviceSpreads.find(s => s.id === form.tiragem) || serviceSpreads[0] || { cards: 3 };
    const cardCount = currentSpread.cards;
    const remaining = cardCount - pickedIndices.length;
    return (
      <div className="picking-page" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999, background: '#0a0a0d' }}>
        <div className="picking-page-header">
          <div className="revelation-eyebrow">✦ O Oráculo Falante</div>
          <h1 className="revelation-title">
            Escolha {remaining} {remaining === 1 ? 'carta' : 'cartas'}
          </h1>
          <p className="revelation-subtitle" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Deixe sua intuição guiar seu coração. Sinta a vibração antes do toque sagrado.
          </p>
        </div>

        <div className="picking-page-fan">
          {shuffledDeck.map((card, i) => {
            const total = shuffledDeck.length;
            const spread = 150;
            const angle = -spread / 2 + (i / (total - 1)) * spread;
            const zIdx = total - Math.abs(i - Math.floor(total / 2));
            return (
              <div
                key={i}
                className={`fan-card-wrap ${pickedIndices.includes(i) ? 'picked' : ''}`}
                style={{ transform: `rotate(${angle}deg)`, zIndex: zIdx, width: '90px' }}
                onClick={() => handlePickCard(i)}
              >
                <div className="fan-card-body">
                  <CardImage card={card} revealed={false} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '8rem 2rem 4rem', maxWidth: '650px', margin: '0 auto' }}>
      <Helmet>
        <title>{`Ritual do ${service.name} | Magik Tarot`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Voltar para página de vendas */}
      <Link 
        to={`/consulta/${service.id}`} 
        style={{ 
          color: 'var(--gold)', 
          textDecoration: 'none', 
          fontSize: '0.9rem', 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          marginBottom: '2rem',
          fontWeight: '600'
        }}
      >
        ← Voltar para {service.name}
      </Link>

      <div style={{
        background: 'rgba(20, 20, 25, 0.85)',
        border: '1px solid rgba(255, 215, 0, 0.15)',
        borderRadius: '24px',
        padding: '3rem 2.5rem',
        boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
        backdropFilter: 'blur(12px)',
        position: 'relative'
      }}>
        
        {/* ── PASSO 1: FORMULÁRIO DE INTENÇÃO ── */}
        {step === 'form' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '2.5rem' }}>
              <div style={{
                width: '65px',
                height: '65px',
                borderRadius: '14px',
                border: '1px solid rgba(255, 215, 0, 0.25)',
                overflow: 'hidden',
                background: 'rgba(5, 5, 8, 0.6)',
                boxShadow: '0 6px 18px rgba(0, 0, 0, 0.4), 0 0 12px rgba(255, 215, 0, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <img 
                  src={`${process.env.PUBLIC_URL}/assets/services/${service.image}`}
                  alt={service.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
              <div>
                <div style={{ color: 'var(--gold)', letterSpacing: '0.15em', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  ✦ Portal do Ritual ✦
                </div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff', margin: '0.1rem 0 0', lineHeight: '1.2' }}>
                  {service.name}
                </h1>
              </div>
            </div>
            <p style={{ opacity: 0.7, fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>
              Os canais cósmicos aguardam sua intenção. Preencha seus dados com foco e presença. Cada resposta abre um elo do seu destino.
            </p>

            <FormFields service={service} form={form} updateForm={updateForm} />

            {payError && (
              <div style={{ color: '#ff6b6b', fontSize: '0.85rem', textAlign: 'center', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                {payError}
              </div>
            )}

            <button 
              className="btn-primary" 
              onClick={handleSubmit}
              style={{ width: '100%', padding: '1rem', fontSize: '1rem', marginTop: '2rem', border: 'none', cursor: 'pointer' }}
            >
              Selar o Ritual e Seguir →
            </button>
          </>
        )}

        {/* ── PASSO 2: CRIANDO PEDIDO NO BACKEND ── */}
        {step === 'mp_creating' && (
          <div className="ai-loading" style={{ padding: '2rem 0' }}>
            <div style={{ color: 'var(--gold)', letterSpacing: '0.15em', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '1.5rem', textAlign: 'center' }}>
              ✦ Abertura de Acesso ✦
            </div>
            <div className="ai-orb" />
            <div className="ai-text" style={{ marginTop: '2rem' }}>Sintonizando o portal de pagamento...</div>
          </div>
        )}

        {/* ── PASSO 3: CHECKOUT SEGURO COM MERCADO PAGO ── */}
        {step === 'mp_checkout' && (
          <div className="pix-panel" style={{ padding: 0 }}>
            <div style={{ color: 'var(--gold)', letterSpacing: '0.15em', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '1rem', textAlign: 'center' }}>
              ✦ Confirmação do Ritual ✦
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: '0.8rem' }}>
              O Oráculo Aguarda Seu Acesso
            </h2>
            <p style={{ fontSize: '0.9rem', opacity: 0.7, textAlign: 'center', lineHeight: '1.6', marginBottom: '2rem' }}>
              Clique no botão oficial do Mercado Pago abaixo para concluir sua contribuição de forma totalmente segura. Assim que o pagamento for aprovado, o ritual de leitura iniciará imediatamente.
            </p>

            <div className="pix-amount" style={{ margin: '1.5rem 0 2rem', fontSize: '2.5rem', color: 'var(--gold)' }}>
              {service.price}
            </div>

            <button
              onClick={handleOpenCheckout}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '0.8rem', width: '100%', padding: '1.1rem 1.5rem',
                background: '#009EE3', color: '#fff', border: 'none',
                borderRadius: '12px', fontSize: '1.05rem', fontWeight: '700',
                cursor: 'pointer', marginBottom: '1.5rem', letterSpacing: '0.01em',
                boxShadow: '0 5px 20px rgba(0, 158, 227, 0.2)'
              }}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="11" fill="#fff"/>
                <path d="M5.5 11.5c1.2-2.4 3.6-4 6.5-4 2 0 3.8.8 5.1 2.1" stroke="#009EE3" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M16.5 10.5c-1.2 2.4-3.6 4-6.5 4-2 0-3.8-.8-5.1-2.1" stroke="#009EE3" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              Pagar com Mercado Pago
            </button>

            <div className="pix-status" style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className={`pix-dot ${payStatus === 'approved' ? 'pix-dot--paid' : ''}`} />
              <span style={{ fontSize: '0.88rem', fontWeight: '500' }}>
                {payStatus === 'approved'
                  ? '✅ Pagamento confirmado — Iniciando o ritual...'
                  : 'Aguardando confirmação do PIX...'}
              </span>
            </div>

            {payError && (
              <div style={{ color: '#ff6b6b', fontSize: '0.85rem', textAlign: 'center', marginTop: '1rem' }}>
                {payError}
              </div>
            )}

            <div style={{ fontSize: '0.78rem', opacity: 0.5, textAlign: 'center', marginTop: '1.5rem', lineHeight: '1.5' }}>
              Após o pagamento, esta tela se atualizará automaticamente para o início do seu ritual. Não feche esta página.
            </div>
          </div>
        )}

        {/* ── PASSO 4: EMBARALHANDO ── */}
        {step === 'shuffling' && (
          <div className="ai-loading" style={{ padding: '2rem 0' }}>
            <div style={{ color: 'var(--gold)', letterSpacing: '0.15em', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '1.5rem', textAlign: 'center' }}>
              ✦ Início da Jornada ✦
            </div>
            <div className="shuffle-deck" style={{ margin: '2rem auto' }}>
              {[1,2,3,4,5].map(i => (
                <div key={i} className="shuffle-card">
                  <img src={CARD_BACK_URL} alt="" />
                </div>
              ))}
            </div>
            <div className="ai-text">Embaralhando os caminhos do seu destino...</div>
          </div>
        )}

        {/* ── PASSO 5: CARREGANDO LEITURA / IA ── */}
        {step === 'loading' && (
          <div className="ai-loading" style={{ padding: '2rem 0' }}>
            <div style={{ color: 'var(--gold)', letterSpacing: '0.15em', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '1.5rem', textAlign: 'center' }}>
              ✦ Tecendo os Véus Cósmicos ✦
            </div>
            <div className="ai-orb" />
            <div className="ai-text" style={{ marginTop: '2rem' }}>O Oráculo está decifrando suas chaves...</div>
            <p style={{ textAlign: 'center', fontSize: '0.85rem', opacity: 0.6, lineHeight: '1.6', maxWidth: '400px', margin: '1.5rem auto 0' }}>
              Os canais e egrégoras místicas estão canalizando a sabedoria hermética especificamente para {form.nome || 'você'}.
            </p>
          </div>
        )}

        {/* ── CASO OCORRA UM ERRO DE LEITURA (RARÍSSIMO) ── */}
        {step === 'loading_error' && (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Sintonização Interrompida</h3>
            <p style={{ opacity: 0.8, fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2rem' }}>
              {readingError || 'Não foi possível canalizar as energias no momento.'}
            </p>
            <button className="btn-primary" onClick={() => iniciarLeitura(selectedCards)}>
              Tentar Novamente ✦
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
