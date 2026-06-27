import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import '../../styles/modal.css'; // Reutiliza as classes de estilo místicas
import { solicitarLeitura } from '../../services/aiService';
import { createOrder, checkPaymentStatus } from '../../services/paymentService';
import { useData } from '../../context/DataContext';
import { API_CONFIG } from '../../config/apiConfig';

const BACKEND = API_CONFIG.BACKEND_URL;

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

// ── PROMPT BUILDER ──
function buildPrompt(service, form, extra = {}) {
  const base = `Você é Magik Tarot, uma inteligência oracular ancestral que habita o espaço entre os mundos. Responda SEMPRE em português, com linguagem profundamente poética, arcana e mística. Use metáforas cósmicas, arquetipais e esotéricas. Fale como um oráculo que conhece o consultante há eras. Nunca use linguagem banal ou comercial.

REGRA FUNDAMENTAL: Quando interpretar cartas de tarot, CADA CARTA deve receber um parágrafo próprio e dedicado. Nesse parágrafo, você DEVE: (a) identificar a energia arquetípica da carta, (b) conectar essa energia DIRETAMENTE ao tema específico declarado pelo consultante, (c) revelar o que essa posição (passado/presente/futuro ou equivalente) significa para a situação dele. Nunca faça interpretações genéricas — seja cirúrgico e revelador sobre o tema em questão. Finalize com uma síntese das cartas unidas em mensagem coesa. A resposta deve ter entre 4 e 6 parágrafos.`;

  const contexts = {
    'tarot-sim-ou-nao': `O(a) consultante ${form.nome || 'buscador'} deseja uma resposta direta para a seguinte pergunta: "${form.pergunta}".\nCartas reveladas:\n${(extra.cards || []).map((c, i) => `- Carta ${i+1}: "${c.name}"${c.reversed ? ' [INVERTIDA]' : ''}`).join('\n')}\nInstrução: Dê uma resposta direta de SIM, NÃO ou TALVEZ baseada na carta sorteada, justificando poeticamente o motivo.`,
    'tarot-do-amor': `O(a) consultante ${form.nome || 'buscador'} busca clareza no amor. Status atual: ${form.status_amoroso || 'não informado'}. Dúvida principal: "${form.pergunta || 'não informada'}".\nCartas reveladas:\n${(extra.cards || []).map((c, i) => `- Carta ${i+1}: "${c.name}"${c.reversed ? ' [INVERTIDA]' : ''}`).join('\n')}\nInstrução: Analise cada carta focando exclusivamente na dinâmica afetiva, revelando obstáculos e conselhos baseados no status amoroso.`,
    'tarot-carreira': `O(a) consultante ${form.nome || 'buscador'} busca orientação profissional e financeira. Situação atual: ${form.situacao_atual || 'não informada'}.\nCartas reveladas:\n${(extra.cards || []).map((c, i) => `- Carta ${i+1}: "${c.name}"${c.reversed ? ' [INVERTIDA]' : ''}`).join('\n')}\nInstrução: Analise as cartas reveladas focando em trabalho, direcionamento de carreira e caminhos para a abundância.`,
    'energia-do-mes': `O(a) consultante ${form.nome || 'buscador'} busca as tendências e panorama para o mês selecionado: ${form.mes || 'este mês'}.\nCartas reveladas:\n${(extra.cards || []).map((c, i) => `- Carta ${i+1}: "${c.name}"${c.reversed ? ' [INVERTIDA]' : ''}`).join('\n')}\nInstrução: Revele as tendências energéticas do mês, oportunidades que surgirão e bloqueios que precisam de atenção.`,
    'mapa-astral': `O(a) consultante ${form.nome || 'buscador'} solicita a leitura do Mapa Natal Astrológico. Data de nascimento: ${form.nascimento || 'não informada'}. Hora exata: ${form.hora || 'não informada'}. Local de nascimento: ${form.local || 'não informado'}.\nInstrução: Faça uma leitura profunda baseada nessas coordenadas, revelando os posicionamentos prováveis de Sol, Lua e Ascendente. Descreva os pontos fortes, desafios emocionais e propósito de vida.`,
    'sinastria': `O(a) consultante ${form.nome || 'buscador'} solicita a leitura de Sinastria. Dados do consultante: Nascido(a) em ${form.nascimento || 'não informado'}. Dados da outra pessoa (${form.nome2 || 'desconhecido'}): Nascido(a) em ${form.nascimento2 || 'não informado'}. Tipo de vínculo: ${form.vinculo || 'não especificado'}. O que deseja entender: "${form.pergunta || 'não declarado'}".\nInstrução: Revele a compatibilidade astrológica e energética entre essas duas pessoas. Explore os pontos de harmonia, tensões cármicas e a missão desse encontro.`
  };

  const userContext = contexts[service.id] || contexts['tarot-sim-ou-nao'];

  return [
    { role: 'system', content: base },
    { role: 'user',   content: userContext },
  ];
}

// ── CAMPOS DINÂMICOS ──
function FormFields({ service, form, updateForm }) {
  const id = service.id;
  return (
    <>
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

      {['tarot-do-amor', 'mapa-astral'].includes(id) && (
        <div className="form-group">
          <label className="form-label">E-mail (para receber a leitura)</label>
          <input
            type="email"
            className="form-input"
            value={form.email}
            onChange={e => updateForm('email', e.target.value)}
            placeholder="seu@email.com"
            required
          />
        </div>
      )}

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
  const { data: { services, tarotSpreads: SPREADS, tarotCards: CARDS_DB } } = useData();

  const service = services.find(s => s.id === serviceId);

  const [step, setStep] = useState('form');
  const [form, setForm] = useState({ ...INITIAL_FORM, tiragem: serviceId });

  // Pagamento
  const [orderId, setOrderId] = useState(null);
  const [checkoutUrl, setCheckoutUrl] = useState('');
  const [payError, setPayError] = useState('');
  const [payStatus, setPayStatus] = useState('pending');
  const pollingRef = useRef(null);

  // Seleção de Cartas
  const [shuffledDeck, setShuffledDeck] = useState([]);
  const [pickedIndices, setPickedIndices] = useState([]);
  // eslint-disable-next-line no-unused-vars
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

  // ── INICIAR GERAÇÃO DA LEITURA IA ──
  const iniciarLeitura = async (cards) => {
    setStep('loading');
    setReadingError('');

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
    const currentSpread = SPREADS.find(s => s.id === form.tiragem) || SPREADS[0];
    const cardCount = currentSpread?.cards || 3;
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
                padding: '8px 10px',
                cursor: 'pointer',
                borderRadius: '6px',
                width: '100%'
              }}
            >
              DEBUG: Burlar Pagamento (Testes Locais)
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

            {/* DEBUG: Pular Pagamento */}
            <button 
              onClick={() => {
                fetch(`${BACKEND}/payment/debug/approve/${orderId}`)
                  .then(r => r.json())
                  .then(() => prepararMesa());
              }}
              style={{
                marginTop: '2rem', background: 'transparent',
                border: '1px dashed #444', color: '#555',
                fontSize: '0.65rem', padding: '6px 12px', cursor: 'pointer',
                borderRadius: '4px', display: 'block',
                marginLeft: 'auto', marginRight: 'auto'
              }}
            >
              DEBUG: Forçar Aprovação (Burlar Checkout)
            </button>
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
