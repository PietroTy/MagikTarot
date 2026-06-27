import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/modal.css';
import { solicitarLeitura } from '../../services/aiService';
import { createOrder, checkPaymentStatus } from '../../services/paymentService';
import { useData } from '../../context/DataContext';
import { API_CONFIG } from '../../config/apiConfig';

const BACKEND = API_CONFIG.BACKEND_URL;

// ─────────────────────────────────────────────────────────
// PROMPT BUILDER — transforma o formulário em contexto para a IA
// ─────────────────────────────────────────────────────────
function buildPrompt(service, form, extra = {}) {
  const base = `Você é Magik Tarot, uma inteligência oracular ancestral que habita o espaço entre os mundos. Responda SEMPRE em português, com linguagem profundamente poética, arcana e mística. Use metáforas cósmicas, arquetipais e esotéricas. Fale como um oráculo que conhece o consultante há eras. Nunca use linguagem banal ou comercial.

REGRA FUNDAMENTAL: Quando interpretar cartas de tarot, CADA CARTA deve receber um parágrafo próprio e dedicado. Nesse parágrafo, você DEVE: (a) identificar a energia arquetípica da carta, (b) conectar essa energia DIRETAMENTE ao tema específico declarado pelo consultante, (c) revelar o que essa posição (passado/presente/futuro ou equivalente) significa para a situação dele. Nunca faça interpretações genéricas — seja cirúrgico e revelador sobre o tema em questão. Finalize com uma síntese das cartas unidas em mensagem coesa. A resposta deve ter entre 4 e 6 parágrafos.`;

  const contexts = {
    'tarot-sim-ou-nao': `O(a) consultante ${form.nome || 'buscador'} deseja uma resposta direta para a seguinte pergunta: "${form.pergunta}".\nCartas reveladas:\n${(extra.cards || []).map((c, i) => `- Carta ${i+1}: "${c.name}"${c.reversed ? ' [INVERTIDA]' : ''}`).join('\n')}\nInstrução: Dê uma resposta direta de SIM, NÃO ou TALVEZ baseada na carta sorteada, justificando poeticamente o motivo.`,
    
    'tarot-do-amor': `O(a) consultante ${form.nome || 'buscador'} busca clareza no amor.
Status atual: ${form.status_amoroso || 'não informado'}.
Dúvida principal: "${form.pergunta || 'não informada'}".
Cartas reveladas:
${(extra.cards || []).map((c, i) => `- Carta ${i+1}: "${c.name}"${c.reversed ? ' [INVERTIDA]' : ''}`).join('\n')}
Instrução: Analise cada carta focando exclusivamente na dinâmica afetiva, revelando obstáculos e conselhos baseados no status amoroso.`,

    'tarot-carreira': `O(a) consultante ${form.nome || 'buscador'} busca orientação profissional e financeira.
Situação atual: ${form.situacao_atual || 'não informada'}.
Cartas reveladas:
${(extra.cards || []).map((c, i) => `- Carta ${i+1}: "${c.name}"${c.reversed ? ' [INVERTIDA]' : ''}`).join('\n')}
Instrução: Analise as cartas reveladas focando em trabalho, direcionamento de carreira e caminhos para a abundância.`,

    'energia-do-mes': `O(a) consultante ${form.nome || 'buscador'} busca as tendências e panorama para o mês selecionado: ${form.mes || 'este mês'}.
Cartas reveladas:
${(extra.cards || []).map((c, i) => `- Carta ${i+1}: "${c.name}"${c.reversed ? ' [INVERTIDA]' : ''}`).join('\n')}
Instrução: Revele as tendências energéticas do mês, oportunidades que surgirão e bloqueios que precisam de atenção.`,

    'mapa-astral': `O(a) consultante ${form.nome || 'buscador'} solicita a leitura do Mapa Natal Astrológico.
Data de nascimento: ${form.nascimento || 'não informada'}.
Hora exata: ${form.hora || 'não informada'}.
Local de nascimento: ${form.local || 'não informado'}.
Instrução: Faça uma leitura profunda baseada nessas coordenadas, revelando os posicionamentos prováveis de Sol, Lua e Ascendente. Descreva os pontos fortes, desafios emocionais e propósito de vida.`,

    'sinastria': `O(a) consultante ${form.nome || 'buscador'} solicita a leitura de Sinastria.
Dados do consultante: Nascido(a) em ${form.nascimento || 'não informado'}.
Dados da outra pessoa (${form.nome2 || 'desconhecido'}): Nascido(a) em ${form.nascimento2 || 'não informado'}.
Tipo de vínculo: ${form.vinculo || 'não especificado'}.
O que deseja entender: "${form.pergunta || 'não declarado'}".
Instrução: Revele a compatibilidade astrológica e energética entre essas duas pessoas. Explore os pontos de harmonia, tensões cármicas e a missão desse encontro.`
  };

  const userContext = contexts[service.id] || contexts['tarot-sim-ou-nao'];

  return [
    { role: 'system', content: base },
    { role: 'user',   content: userContext },
  ];
}

// ─────────────────────────────────────────────────────────
// CAMPOS DO FORMULÁRIO POR TIPO DE CONSULTA
// ─────────────────────────────────────────────────────────
function FormFields({ service, form, updateForm }) {
  const id = service.id;

  return (
    <>
      {/* CAMPO COMUM: nome */}
      <div className="form-group">
        <label className="form-label">Seu nome ou apelido</label>
        <input
          className="form-input"
          value={form.nome}
          onChange={e => updateForm('nome', e.target.value)}
          placeholder="Como prefere ser chamado(a)?"
        />
      </div>

      {['tarot-do-amor', 'mapa-astral'].includes(id) && (
        <div className="form-group">
          <label className="form-label">E-mail (para receber a leitura)</label>
          <input
            type="email"
            className="form-input"
            value={form.email}
            onChange={e => updateForm('email', e.target.value)}
            placeholder="seu@email.com"
          />
        </div>
      )}

      {/* Tarot Sim ou Não */}
      {id === 'tarot-sim-ou-nao' && (
        <div className="form-group">
          <label className="form-label">Qual é a sua pergunta direta?</label>
          <textarea
            className="form-textarea"
            value={form.pergunta}
            onChange={e => updateForm('pergunta', e.target.value)}
            placeholder="Pense bem e faça uma pergunta que possa ser respondida com Sim ou Não..."
          />
        </div>
      )}

      {/* Tarot do Amor */}
      {id === 'tarot-do-amor' && (
        <>
          <div className="form-group">
            <label className="form-label">Status amoroso atual</label>
            <select className="form-select" value={form.status_amoroso} onChange={e => updateForm('status_amoroso', e.target.value)}>
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
            />
          </div>
        </>
      )}

      {/* Tarot Carreira */}
      {id === 'tarot-carreira' && (
        <div className="form-group">
          <label className="form-label">Qual a sua situação profissional atual?</label>
          <textarea
            className="form-textarea"
            value={form.situacao_atual}
            onChange={e => updateForm('situacao_atual', e.target.value)}
            placeholder="Ex: Estou buscando emprego, quero mudar de área, tenho um negócio..."
          />
        </div>
      )}

      {/* Energia do Mês */}
      {id === 'energia-do-mes' && (
        <div className="form-group">
          <label className="form-label">Mês desejado para a leitura</label>
          <input
            type="month"
            className="form-input"
            value={form.mes}
            onChange={e => updateForm('mes', e.target.value)}
          />
        </div>
      )}

      {/* Mapa Astral */}
      {id === 'mapa-astral' && (
        <>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Data de nascimento</label>
              <input type="date" className="form-input" value={form.nascimento} onChange={e => updateForm('nascimento', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Hora exata</label>
              <input type="time" className="form-input" value={form.hora} onChange={e => updateForm('hora', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Cidade e Estado de nascimento</label>
            <input className="form-input" value={form.local} onChange={e => updateForm('local', e.target.value)} placeholder="Ex: São Paulo, SP" />
          </div>
        </>
      )}

      {/* Sinastria */}
      {id === 'sinastria' && (
        <>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Sua data de nascimento</label>
              <input type="date" className="form-input" value={form.nascimento} onChange={e => updateForm('nascimento', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Nome da outra pessoa</label>
              <input className="form-input" value={form.nome2} onChange={e => updateForm('nome2', e.target.value)} placeholder="Nome ou apelido" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Data de nascimento da outra pessoa</label>
            <input type="date" className="form-input" value={form.nascimento2} onChange={e => updateForm('nascimento2', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Tipo de vínculo</label>
            <select className="form-select" value={form.vinculo} onChange={e => updateForm('vinculo', e.target.value)}>
              <option value="">Selecione...</option>
              <option value="amoroso">Romântico / Amoroso</option>
              <option value="amizade">Amizade</option>
              <option value="profissional">Profissional / Sociedade</option>
              <option value="familiar">Familiar</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">O que você quer entender sobre essa relação?</label>
            <textarea className="form-textarea" value={form.pergunta} onChange={e => updateForm('pergunta', e.target.value)} placeholder="Qual a sua maior dúvida?" />
          </div>
        </>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────
// MODAL PRINCIPAL
// ─────────────────────────────────────────────────────────
const INITIAL_FORM = {
  nome: '', email: '', pergunta: '', situacao_atual: '', mes: '',
  status_amoroso: '', nascimento: '', hora: '', local: '', 
  nome2: '', nascimento2: '', vinculo: '',
  tiragem: 'tarot-sim-ou-nao', 
  incluirMenores: false,
  permitirInvertidas: false,
};

const TAROT_CARDS_FALLBACK = [
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

// ── ARCANOS MENORES (sem arte — placeholders com emoji) ──
const SUIT_EMOJIS = { wands: '🔥', cups: '💧', swords: '⚔️', pentacles: '🟡' };
const SUIT_NAMES  = { wands: 'Paus', cups: 'Copas', swords: 'Espadas', pentacles: 'Ouros' };
const RANK_NAMES  = ['Ás','2','3','4','5','6','7','8','9','10','Valete','Cavaleiro','Rainha','Rei'];
const MINOR_ARCANA = Object.keys(SUIT_EMOJIS).flatMap(suit =>
  RANK_NAMES.map(rank => ({
    id: null, // sem arte
    name: `${rank} de ${SUIT_NAMES[suit]}`,
    icon: SUIT_EMOJIS[suit],
    suit,
  }))
);

// ── COMPONENTE DE IMAGEM DA CARTA ──
const CARD_BACK_URL = `${process.env.PUBLIC_URL}/assets/tarot-cards/back.png`;

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

  // Placeholder se não houver imagem (sem id — ex: Arcanos Menores)
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

function ServiceModal({ service, onClose, onStepChange }) {
  const navigate = useNavigate();
  const { data: { tarotSpreads: SPREADS, tarotCards: CARDS_DB } } = useData();

  // ── fluxo: form → mp_creating → mp_checkout → loading → result
  const [step, setStep] = useState('form');
  const handleSetStep = (newStep) => {
    setStep(newStep);
    if (onStepChange) onStepChange(newStep);
  };

  const [form, setForm] = useState({ ...INITIAL_FORM, tiragem: service.id });

  // Pagamento MP
  const [orderId,      setOrderId]     = useState(null);
  const [checkoutUrl,  setCheckoutUrl] = useState('');
  const [payError,     setPayError]    = useState('');
  const [payStatus,    setPayStatus]   = useState('pending');
  const pollingRef = useRef(null);

  // Resultado
  const [shuffledDeck,  setShuffledDeck]  = useState([]);
  const [pickedIndices, setPickedIndices] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [revealed,      setRevealed]      = useState([]);
  const [reading,       setReading]       = useState('');
  // eslint-disable-next-line no-unused-vars
  const [readingError,  setReadingError]  = useState('');

  const updateForm = (field, value) => setForm(f => ({ ...f, [field]: value }));

  // ── limpar polling ao desmontar ───────────────────────
  useEffect(() => {
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, []);

  // ── Modo debug: pula pagamento, útil para testes locais ──
  const DEBUG_BYPASS_PAYMENT = process.env.REACT_APP_DEBUG_PAYMENT === 'true';

  // ── STEP 1 → 2: criar pedido no backend e abrir checkout MP ──
  const handleSubmit = async () => {
    setPayError('');
    handleSetStep('mp_creating');
    try {
      if (DEBUG_BYPASS_PAYMENT) {
        // Cria um pedido já aprovado sem abrir o MP
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
        // Pula direto para embaralhar ou leitura
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
      handleSetStep('mp_checkout');
      startPolling(order.orderId);
    } catch (err) {
      setPayError('Não foi possível iniciar o pagamento. Tente novamente.');
      handleSetStep('form');
    }
  };

  // ── Ritual de Embaralhar ──
  const prepararMesa = () => {
    handleSetStep('shuffling');
    const majorArcana = (CARDS_DB && CARDS_DB.length > 0) ? CARDS_DB : TAROT_CARDS_FALLBACK;
    const fullDeck = form.incluirMenores
      ? [...majorArcana, ...MINOR_ARCANA]
      : majorArcana;
    // Atribuir reversed aleatório se habilitado
    const deckWithReversed = fullDeck.map(card => ({
      ...card,
      reversed: form.permitirInvertidas ? Math.random() < 0.35 : false,
    }));
    const shuffled = [...deckWithReversed].sort(() => Math.random() - 0.5);
    setShuffledDeck(shuffled);
    setPickedIndices([]);
    setTimeout(() => handleSetStep('picking'), 2500);
  };

  // ── Seleção de Carta ──
  const handlePickCard = (index) => {
    if (pickedIndices.includes(index)) return;
    
    const currentSpread = SPREADS.find(s => s.id === form.tiragem) || SPREADS[0];
    const cardCount = currentSpread?.cards || 3;
    
    if (pickedIndices.length >= cardCount) return;
    
    const newPicked = [...pickedIndices, index];
    setPickedIndices(newPicked);
    
    if (newPicked.length === cardCount) {
      const cards = newPicked.map(idx => shuffledDeck[idx]);
      setSelectedCards(cards);
      setTimeout(() => iniciarLeitura(cards), 600);
    }
  };

  // ── STEP 3: gerar leitura via IA ──
  const iniciarLeitura = async (cards) => {
    handleSetStep('loading');
    setReadingError('');
    setRevealed([]);

    const currentSpread = SPREADS.find(s => s.id === form.tiragem) || SPREADS[0];
    const messages = buildPrompt(service, form, {
      spreadName: currentSpread?.name,
      positions:  currentSpread?.positions,
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
      // Fechar modal e navegar para página de resultado
      onClose();
      navigate(`/resultado/${orderId}`);
    } catch (err) {
      setReadingError('Os véus resistem por ora... Tente novamente em instantes.');
    }
  };

  // ── polling automático de status de pagamento ─────────
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
            prepararMesa(); // Inicia o ritual de embaralhar
          } else {
            iniciarLeitura([]); // Vai direto para leitura se não tiver cartas
          }
        }
        if (status === 'rejected' || status === 'cancelled') {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
          setPayError('O pagamento foi recusado ou cancelado. Feche e tente novamente.');
        }
      } catch { /* erros pontuais de rede são ignorados */ }
    }, 4000);
  };

  // ── Abrir checkout MP em nova aba ─────────────────────
  const handleOpenCheckout = () => {
    if (checkoutUrl) window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
  };


  // ─────────────────────────────────────────────────────
  // Formata o texto da leitura: detecta **negrito** e quebras de parágrafo
  // ─────────────────────────────────────────────────────
  function formatReading(text) {
    if (!text) return null;
    return text.split('\n').filter(p => p.trim()).map((para, pi) => {
      // Detecta **texto** e converte para <strong>
      const parts = para.split(/\*\*(.*?)\*\*/g);
      return (
        <p key={pi} style={{ marginBottom: '1.4rem', lineHeight: '1.9' }}>
          {parts.map((part, i) =>
            i % 2 === 1
              ? <strong key={i} style={{ color: 'var(--gold-light)', fontStyle: 'normal' }}>{part}</strong>
              : part
          )}
        </p>
      );
    });
  }

  // ─────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────

  // ── FULL PAGE PICKING ──
  if (step === 'picking') {
    const currentSpread = SPREADS.find(s => s.id === form.tiragem) || SPREADS[0];
    const cardCount = currentSpread?.cards || 3;
    const remaining = cardCount - pickedIndices.length;
    return (
      <div className="picking-page">
        <div className="picking-page-header">
          <div className="revelation-eyebrow">✦ A Mesa está posta</div>
          <h1 className="revelation-title">
            Escolha {remaining} {remaining === 1 ? 'carta' : 'cartas'}
          </h1>
          <p className="revelation-subtitle">
            Deixe sua intuição guiar sua mão. Sinta a energia antes de tocar.
          </p>
          <button className="revelation-close" onClick={onClose} title="Fechar">✕</button>
        </div>

        <div className="picking-page-fan">
          {shuffledDeck.map((card, i) => {
            const total = shuffledDeck.length;
            const spread = 160;
            const angle = -spread / 2 + (i / (total - 1)) * spread;
            const zIdx = total - Math.abs(i - Math.floor(total / 2));
            return (
              <div
                key={i}
                className={`fan-card-wrap ${pickedIndices.includes(i) ? 'picked' : ''}`}
                style={{ transform: `rotate(${angle}deg)`, zIndex: zIdx, width: '100px' }}
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

  // ── FULL PAGE RESULT ──────────────────────────────────
  // A tela de resultado foi movida para ResultPage.jsx


  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>

        {/* ── FORM ── */}
        {step === 'form' && (
          <>
            <div className="modal-eyebrow">✦ {service.name}</div>
            <div className="modal-title">Abrir o Portal</div>
            <div className="modal-subtitle">
              Os Arcanos aguardam sua intenção. Cada resposta abre um véu adicional — seja preciso(a).
            </div>

            <FormFields service={service} form={form} updateForm={updateForm} />

            {payError && (
              <div style={{ color: '#ff6b6b', fontSize: '0.85rem', textAlign: 'center', marginTop: '0.5rem' }}>
                {payError}
              </div>
            )}

            <button className="btn-primary" onClick={handleSubmit}>
              Selar o Ritual de Acesso →
            </button>

            {/* DEBUG: Pular Pagamento */}
            <button 
              onClick={() => {
                fetch(`${BACKEND}/payment/debug/create`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    serviceId: service.id,
                    serviceName: service.name,
                    price: service.price,
                    formData: form
                  })
                })
                .then(r => r.json())
                .then(order => {
                  setOrderId(order.orderId);
                  prepararMesa();
                });
              }}
              style={{
                marginTop: '1.5rem',
                background: 'transparent',
                border: '1px dashed #666',
                color: '#888',
                fontSize: '0.65rem',
                padding: '6px 10px',
                cursor: 'pointer',
                borderRadius: '4px',
                width: '100%'
              }}
            >
              DEBUG: Pular Pagamento (Burlar Erro MP)
            </button>
          </>
        )}

        {/* ── CRIANDO PEDIDO ── */}
        {step === 'mp_creating' && (
          <div className="ai-loading">
            <div className="modal-eyebrow" style={{ textAlign: 'center' }}>✦ Abrindo portal de pagamento</div>
            <div className="ai-orb" />
            <div className="ai-text">Preparando o ritual de acesso...</div>
          </div>
        )}

        {/* ── CHECKOUT MERCADO PAGO ── */}
        {step === 'mp_checkout' && (
          <div className="pix-panel">
            <div className="modal-eyebrow">✦ Ritual de acesso</div>
            <div className="modal-title" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
              O Portal aguarda sua confirmação
            </div>
            <div className="modal-subtitle" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              Clique no botão abaixo para realizar o pagamento de forma segura pelo Mercado Pago. A leitura se inicia automaticamente após a confirmação.
            </div>

            <div className="pix-amount">{service.price}</div>

            <button
              onClick={handleOpenCheckout}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '0.6rem', width: '100%', padding: '0.9rem 1.5rem',
                background: '#009EE3', color: '#fff', border: 'none',
                borderRadius: '8px', fontSize: '1rem', fontWeight: '600',
                cursor: 'pointer', marginBottom: '1rem', letterSpacing: '0.01em',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="11" fill="#fff"/>
                <path d="M5.5 11.5c1.2-2.4 3.6-4 6.5-4 2 0 3.8.8 5.1 2.1" stroke="#009EE3" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M16.5 10.5c-1.2 2.4-3.6 4-6.5 4-2 0-3.8-.8-5.1-2.1" stroke="#009EE3" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              Pagar com Mercado Pago
            </button>

            <div className="pix-status">
              <div className={`pix-dot ${payStatus === 'approved' ? 'pix-dot--paid' : ''}`} />
              <span>
                {payStatus === 'approved'
                  ? '✅ Pagamento confirmado — iniciando leitura...'
                  : 'Aguardando confirmação do pagamento...'}
              </span>
            </div>

            {payError && (
              <div style={{ color: '#ff6b6b', fontSize: '0.85rem', textAlign: 'center', marginTop: '0.5rem' }}>
                {payError}
              </div>
            )}

            <div style={{ fontSize: '0.72rem', opacity: 0.4, textAlign: 'center', marginTop: '1rem' }}>
              Após pagar, o oráculo se ativa automaticamente — não é preciso voltar aqui.
            </div>

            <button 
              onClick={() => {
                fetch(`${BACKEND}/payment/debug/approve/${orderId}`)
                  .then(r => r.json())
                  .then(() => prepararMesa());
              }}
              style={{
                marginTop: '1.5rem', background: 'transparent',
                border: '1px dashed #444', color: '#666',
                fontSize: '0.65rem', padding: '4px 8px', cursor: 'pointer',
                borderRadius: '4px', display: 'block',
                marginLeft: 'auto', marginRight: 'auto'
              }}
            >
              DEBUG: Pular Pagamento
            </button>
          </div>
        )}

        {/* ── EMBARALHANDO ── */}
        {step === 'shuffling' && (
          <div className="ai-loading">
            <div className="modal-eyebrow">✦ O Ritual se inicia</div>
            <div className="shuffle-deck">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="shuffle-card">
                  <img src={CARD_BACK_URL} alt="" />
                </div>
              ))}
            </div>
            <div className="ai-text">Embaralhando os destinos...</div>
          </div>
        )}

        {/* ── LOADING ── */}
        {step === 'loading' && (
          <div className="ai-loading">
            <div className="modal-eyebrow" style={{ textAlign: 'center' }}>
              ✦ Os fios do destino estão sendo tecidos
            </div>
            <div className="ai-orb" />
            <div className="ai-text">Atravessando o véu...</div>
            <div className="modal-subtitle" style={{ textAlign: 'center', marginBottom: 0 }}>
              A inteligência oracular está lendo os padrões cósmicos tecidos especificamente para {form.nome || 'você'}.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ServiceModal;