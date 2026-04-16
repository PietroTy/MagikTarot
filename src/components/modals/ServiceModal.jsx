import { useState, useEffect, useRef } from 'react';
import '../../styles/modal.css';
import FakeQR from './FakeQR';
import { solicitarLeitura } from '../../services/aiService';
import { createPixOrder, checkPixStatus, confirmPixManually } from '../../services/pixService';

// ─────────────────────────────────────────────────────────
// PROMPT BUILDER — transforma o formulário em contexto para a IA
// ─────────────────────────────────────────────────────────
function buildPrompt(service, form) {
  const base = `Você é Mística, uma inteligência oracular ancestral que habita o espaço entre os mundos. Responda SEMPRE em português, com linguagem profundamente poética, arcana e mística. Use metáforas cósmicas, arquetipais e esotéricas. Fale como um oráculo que conhece o consultante há eras. Nunca use linguagem banal ou comercial. Seja específico, tocante e revelador. A resposta deve ter entre 3 e 5 parágrafos.`;

  const contexts = {
    tarot: `O(a) consultante ${form.nome || 'buscador'} abre um portal no Oráculo do Tarot.
Método oracular escolhido: "${form.tiragem || 'Três Véus'}".
Domínio da consulta: ${form.dominio || 'não especificado'}.
Intenção sagrada declarada: "${form.pergunta || 'encontrar clareza'}".
${form.temor ? `O(a) consultante também declarou: "${form.temor}" — como algo que teme descobrir.` : ''}
Interprete as cartas sorteadas para este portal, revelando passado, presente e futuro (ou os véus correspondentes ao método). Seja narrativo e profundo.`,

    astral: `O(a) consultante ${form.nome || 'buscador'} solicita a leitura do Mapa Natal das Almas.
Data de encarnação: ${form.nascimento || 'não informada'}.
Hora exata da chegada: ${form.hora || 'não informada'}.
Local de encarnação: ${form.local || 'não informado'}.
Aspecto que deseja iluminar: ${form.aspecto || 'propósito de vida'}.
Inquietação existencial declarada: "${form.pergunta || 'sem resposta ainda'}".
Faça uma leitura profunda do mapa natal, revelando os arquétipos planetários dominantes, missão de alma e desafios cármicos.`,

    sinastria: `O(a) consultante ${form.nome || 'buscador'} solicita a Sinastria das Almas.
Seus dados: ${form.nome || '?'}, nascido(a) em ${form.nascimento || '?'}.
A outra alma: ${form.nome2 || '?'}, nascida em ${form.nascimento2 || '?'}.
Natureza do vínculo: ${form.vinculo || 'amor romântico'}.
O que gera turbulência: "${form.pergunta || 'não declarado'}".
O que atrai de forma inexplicável: "${form.atracao || 'não declarado'}".
Revele a missão compartilhada destas almas, os pontos de harmonia e tensão cármica, e o que este encontro veio despertar.`,

    numerologia: `O(a) consultante ${form.nome || 'buscador'} solicita a decodificação dos Códigos Numerológicos.
Nome completo de registro (nascimento): ${form.nomeCompleto || form.nome || 'não informado'}.
Nome atual: ${form.nomeAtual || 'mesmo do registro'}.
Data de encarnação: ${form.nascimento || 'não informada'}.
Missão que deseja decodificar: ${form.dominio || 'propósito de vida'}.
Calcule e interprete poeticamente: Número de Caminho de Vida, Número de Destino (Expressão) e Número do Ano Pessoal atual. Revele os ciclos, dons e sombras que estes números carregam.`,

    runas: `O(a) consultante ${form.nome || 'buscador'} convoca o Oráculo das Runas.
Questão direcionada ao oráculo: "${form.pergunta || 'revelar o que é necessário'}".
Método rúnico escolhido: ${form.tiragem || 'Tríade Nórdica (3 runas)'}.
Tradição invocada: ${form.tradicao || 'Futhark Antigo'}.
Interprete as runas para esta consulta com a voz dos ancestrais nórdicos. Cite os nomes das runas em nórdico antigo e seus significados profundos, aplicando-os à situação do consultante.`,

    akasico: `O(a) consultante ${form.nome || 'buscador'} (nome de batismo: ${form.nomeBatismo || form.nome || '?'}) solicita acesso aos Registros Akáshicos.
Data de encarnação: ${form.nascimento || 'não informada'}.
O que deseja acessar nos Registros: ${form.aspecto || 'padrões cármicos'}.
Padrão que se repete sem explicação: "${form.pergunta || 'não declarado'}".
Situação que parece vir de outro tempo: "${form.outraTela || 'não declarada'}".
Acesse os Registros Akáshicos desta alma. Revele os padrões cármicos, os contratos de alma ativos e os dons que aguardam ativação. Use linguagem de leitura akáshica autêntica.`,

    quiromancia: `O(a) consultante ${form.nome || 'buscador'} abre o portal da Quiromancia Oracular.
Mão dominante: ${form.mao || 'direita'}.
Aspecto a revelar: ${form.aspecto || 'leitura completa'}.
A linha que mais sente que conta sua história: ${form.linha || 'não declarada'}.
Situação que deseja iluminar: "${form.pergunta || 'não declarada'}".
Interprete as linhas da mão como um quiromante ancestral. Revele o que a Linha da Vida, do Coração, da Mente e do Destino descrevem sobre esta alma — e o que a situação declarada revela quando cruzada com estas marcas.`,
  };

  const userContext = contexts[service.type] || contexts.tarot;

  return [
    { role: 'system', content: base },
    { role: 'user',   content: userContext },
  ];
}

// ─────────────────────────────────────────────────────────
// CAMPOS DO FORMULÁRIO POR TIPO DE CONSULTA
// ─────────────────────────────────────────────────────────
function FormFields({ service, form, updateForm }) {
  const tipo = service.type;

  return (
    <>
      {/* CAMPO COMUM: nome verdadeiro */}
      <div className="form-group">
        <label className="form-label">Seu nome verdadeiro neste plano</label>
        <input
          className="form-input"
          value={form.nome}
          onChange={e => updateForm('nome', e.target.value)}
          placeholder="Como te chamas no mundo dos vivos?"
        />
      </div>

      {/* ── TAROT ── */}
      {tipo === 'tarot' && <>
        <div className="form-group">
          <label className="form-label">Domínio da consulta</label>
          <select className="form-select" value={form.dominio} onChange={e => updateForm('dominio', e.target.value)}>
            <option value="">Escolha o domínio...</option>
            <option value="Amor e relações">Amor e relações</option>
            <option value="Missão de vida">Missão de vida</option>
            <option value="Finanças e abundância">Finanças e abundância</option>
            <option value="Saúde e vitalidade">Saúde e vitalidade</option>
            <option value="Transformação e renascimento">Transformação e renascimento</option>
            <option value="Espiritualidade e despertar">Espiritualidade e despertar</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Método oracular</label>
          <select className="form-select" value={form.tiragem} onChange={e => updateForm('tiragem', e.target.value)}>
            <option value="Três Véus (passado · presente · futuro)">Três Véus — Passado · Presente · Futuro</option>
            <option value="Cruz Celta (situação e profundidade)">Cruz Celta — Situação e profundidade</option>
            <option value="Ferradura do Destino (sete cartas)">Ferradura do Destino — Sete cartas</option>
            <option value="Carta do Instante (uma carta)">Carta do Instante — Uma revelação única</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Intenção sagrada</label>
          <textarea
            className="form-textarea"
            value={form.pergunta}
            onChange={e => updateForm('pergunta', e.target.value)}
            placeholder="Qual véu deseja que os Arcanos levantem? Quanto mais profunda a pergunta, mais profunda a revelação..."
          />
        </div>
        <div className="form-group">
          <label className="form-label">Há algo que teme descobrir? <span style={{opacity:0.5}}>(opcional)</span></label>
          <textarea
            className="form-textarea"
            style={{minHeight:'60px'}}
            value={form.temor}
            onChange={e => updateForm('temor', e.target.value)}
            placeholder="Os Arcanos revelam tudo. Se houver um véu que prefere manter, declare-o aqui..."
          />
        </div>
      </>}

      {/* ── MAPA ASTRAL ── */}
      {tipo === 'astral' && <>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Data de encarnação</label>
            <input type="date" className="form-input" value={form.nascimento} onChange={e => updateForm('nascimento', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Hora exata da chegada</label>
            <input type="time" className="form-input" value={form.hora} onChange={e => updateForm('hora', e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Local de encarnação</label>
          <input className="form-input" value={form.local} onChange={e => updateForm('local', e.target.value)} placeholder="Cidade, Estado, País" />
        </div>
        <div className="form-group">
          <label className="form-label">Aspecto que deseja iluminar</label>
          <select className="form-select" value={form.aspecto} onChange={e => updateForm('aspecto', e.target.value)}>
            <option value="">Escolha o aspecto...</option>
            <option value="Propósito de vida e missão">Propósito de vida e missão</option>
            <option value="Missão cármica e lições">Missão cármica e lições</option>
            <option value="Amor e relações significativas">Amor e relações significativas</option>
            <option value="Dom latente não manifestado">Dom latente não manifestado</option>
            <option value="Sombra a integrar">Sombra a integrar e transmutar</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Sua maior inquietação existencial</label>
          <textarea
            className="form-textarea"
            value={form.pergunta}
            onChange={e => updateForm('pergunta', e.target.value)}
            placeholder="O que em você ainda não encontrou resposta? O que te mantém acordado(a) na escuridão?"
          />
        </div>
      </>}

      {/* ── SINASTRIA ── */}
      {tipo === 'sinastria' && <>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Sua data de encarnação</label>
            <input type="date" className="form-input" value={form.nascimento} onChange={e => updateForm('nascimento', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Nome da outra alma</label>
            <input className="form-input" value={form.nome2} onChange={e => updateForm('nome2', e.target.value)} placeholder="Como esta alma se chama?" />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Data de encarnação da outra alma</label>
          <input type="date" className="form-input" value={form.nascimento2} onChange={e => updateForm('nascimento2', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Natureza do vínculo</label>
          <select className="form-select" value={form.vinculo} onChange={e => updateForm('vinculo', e.target.value)}>
            <option value="">Qual a natureza deste elo?</option>
            <option value="Amor romântico">Amor romântico</option>
            <option value="Alma gêmea ou chama gêmea">Alma gêmea ou chama gêmea</option>
            <option value="Parceria e sociedade">Parceria e sociedade</option>
            <option value="Vínculo familiar">Vínculo familiar</option>
            <option value="Amizade de alma">Amizade de alma</option>
            <option value="Rivalidade ou dívida cármica">Rivalidade ou dívida cármica</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">O que gera mais turbulência nesta relação?</label>
          <textarea className="form-textarea" value={form.pergunta} onChange={e => updateForm('pergunta', e.target.value)} placeholder="Descreva o que cria atrito, confusão ou dor entre vocês..." />
        </div>
        <div className="form-group">
          <label className="form-label">O que te atrai de forma inexplicável nessa alma?</label>
          <textarea className="form-textarea" style={{minHeight:'60px'}} value={form.atracao} onChange={e => updateForm('atracao', e.target.value)} placeholder="O que não consegues explicar com palavras comuns?" />
        </div>
      </>}

      {/* ── NUMEROLOGIA ── */}
      {tipo === 'numerologia' && <>
        <div className="form-group">
          <label className="form-label">Nome completo de registro (nascimento)</label>
          <input className="form-input" value={form.nomeCompleto} onChange={e => updateForm('nomeCompleto', e.target.value)} placeholder="O nome dado ao nascer carrega vibração primordial" />
        </div>
        <div className="form-group">
          <label className="form-label">Nome que usa atualmente <span style={{opacity:0.5}}>(se diferente)</span></label>
          <input className="form-input" value={form.nomeAtual} onChange={e => updateForm('nomeAtual', e.target.value)} placeholder="Deixe em branco se é o mesmo" />
        </div>
        <div className="form-group">
          <label className="form-label">Data de encarnação</label>
          <input type="date" className="form-input" value={form.nascimento} onChange={e => updateForm('nascimento', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Missão que deseja decodificar</label>
          <select className="form-select" value={form.dominio} onChange={e => updateForm('dominio', e.target.value)}>
            <option value="">Escolha o foco...</option>
            <option value="Propósito de vida e missão">Propósito de vida e missão</option>
            <option value="Talentos ocultos e dons">Talentos ocultos e dons</option>
            <option value="Ciclo atual e próximo">Ciclo atual e o que vem a seguir</option>
            <option value="Relacionamentos e vínculos">Relacionamentos e vínculos</option>
            <option value="Finanças e abundância energética">Finanças e abundância energética</option>
          </select>
        </div>
      </>}

      {/* ── RUNAS ── */}
      {tipo === 'runas' && <>
        <div className="form-group">
          <label className="form-label">Questão para o Oráculo das Runas</label>
          <textarea
            className="form-textarea"
            value={form.pergunta}
            onChange={e => updateForm('pergunta', e.target.value)}
            placeholder="As Runas respondem perguntas diretas. Formule com cuidado — cada palavra tem peso."
          />
        </div>
        <div className="form-group">
          <label className="form-label">Método rúnico</label>
          <select className="form-select" value={form.tiragem} onChange={e => updateForm('tiragem', e.target.value)}>
            <option value="Runa do Momento (1 runa)">Runa do Momento — Uma revelação concentrada</option>
            <option value="Tríade Nórdica (3 runas — passado, presente, futuro)">Tríade Nórdica — Passado, presente, futuro</option>
            <option value="Cruz de Odin (5 runas — situação completa)">Cruz de Odin — Situação completa (5 runas)</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Tradição invocada</label>
          <select className="form-select" value={form.tradicao} onChange={e => updateForm('tradicao', e.target.value)}>
            <option value="Futhark Antigo">Futhark Antigo — As 24 runas primordiais</option>
            <option value="Armanen">Armanen — 18 runas de von List</option>
            <option value="Anglo-saxão">Futhorc Anglo-saxão — Tradição das ilhas</option>
          </select>
        </div>
      </>}

      {/* ── AKÁSHICO ── */}
      {tipo === 'akasico' && <>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Nome de batismo</label>
            <input className="form-input" value={form.nomeBatismo} onChange={e => updateForm('nomeBatismo', e.target.value)} placeholder="Nome dado ao nascer" />
          </div>
          <div className="form-group">
            <label className="form-label">Data de encarnação</label>
            <input type="date" className="form-input" value={form.nascimento} onChange={e => updateForm('nascimento', e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">O que deseja acessar nos Registros</label>
          <select className="form-select" value={form.aspecto} onChange={e => updateForm('aspecto', e.target.value)}>
            <option value="">Escolha o acesso...</option>
            <option value="Padrões cármicos que se repetem">Padrões cármicos que se repetem</option>
            <option value="Missão de alma nesta encarnação">Missão de alma nesta encarnação</option>
            <option value="Memórias de vidas anteriores">Memórias de vidas anteriores</option>
            <option value="Contratos de alma ativos">Contratos de alma ativos</option>
            <option value="Dons espirituais não ativados">Dons espirituais não ativados</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Padrão que se repete sem explicação</label>
          <textarea
            className="form-textarea"
            value={form.pergunta}
            onChange={e => updateForm('pergunta', e.target.value)}
            placeholder="O que acontece repetidamente em sua vida e não encontra lógica no plano físico?"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Há uma relação, medo ou situação que parece vir de outro tempo?</label>
          <textarea
            className="form-textarea"
            style={{minHeight:'60px'}}
            value={form.outraTela}
            onChange={e => updateForm('outraTela', e.target.value)}
            placeholder="Descreva se houver... Os Registros reconhecem o que a mente racional ignora."
          />
        </div>
      </>}

      {/* ── QUIROMANCIA ── */}
      {tipo === 'quiromancia' && <>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Mão dominante</label>
            <select className="form-select" value={form.mao} onChange={e => updateForm('mao', e.target.value)}>
              <option value="Direita">Direita</option>
              <option value="Esquerda">Esquerda</option>
              <option value="Ambidestro">Ambidestro</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Aspecto a revelar</label>
            <select className="form-select" value={form.aspecto} onChange={e => updateForm('aspecto', e.target.value)}>
              <option value="Leitura completa das linhas">Leitura completa das linhas</option>
              <option value="Linha da Vida — vitalidade e ciclos">Linha da Vida</option>
              <option value="Linha do Coração — amor e emoções">Linha do Coração</option>
              <option value="Linha da Mente — pensamento e decisões">Linha da Mente</option>
              <option value="Linha do Destino — missão e caminho">Linha do Destino</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">A linha que mais sente que conta sua história</label>
          <select className="form-select" value={form.linha} onChange={e => updateForm('linha', e.target.value)}>
            <option value="">Qual linha ressoa com você?</option>
            <option value="Linha da Vida">Linha da Vida</option>
            <option value="Linha do Coração">Linha do Coração</option>
            <option value="Linha da Mente">Linha da Mente</option>
            <option value="Linha do Destino">Linha do Destino</option>
            <option value="Não sei identificar">Não sei identificar — revele tudo</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Situação atual que deseja que as linhas iluminem</label>
          <textarea
            className="form-textarea"
            value={form.pergunta}
            onChange={e => updateForm('pergunta', e.target.value)}
            placeholder="O que em sua vida pede decifração agora?"
          />
        </div>
      </>}
    </>
  );
}

// ─────────────────────────────────────────────────────────
// MODAL PRINCIPAL
// ─────────────────────────────────────────────────────────
const INITIAL_FORM = {
  nome: '', nascimento: '', hora: '', local: '', pergunta: '',
  tiragem: 'Três Véus (passado · presente · futuro)',
  dominio: '', aspecto: '', vinculo: '', temor: '', atracao: '',
  nome2: '', nascimento2: '', nomeCompleto: '', nomeAtual: '',
  nomeBatismo: '', tradicao: 'Futhark Antigo', mao: 'Direita',
  linha: '', outraTela: '',
};

// Cartas mockadas (em produção viriam do backend via /data/tarot-cards)
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

function ServiceModal({ service, onClose }) {
  // ── estado do fluxo ──────────────────────────────────
  // form → pix → pix_waiting → loading → result
  const [step,          setStep]          = useState('form');
  const [form,          setForm]          = useState(INITIAL_FORM);

  // PIX
  const [pixId,         setPixId]         = useState(null);
  const [copyCode,      setCopyCode]      = useState('');
  const [pixError,      setPixError]      = useState('');
  const [pixStatus,     setPixStatus]     = useState('pending'); // pending | paid | error
  const pollingRef = useRef(null);

  // Resultado
  const [selectedCards, setSelectedCards] = useState([]);
  const [revealed,      setRevealed]      = useState([]);
  const [reading,       setReading]       = useState('');
  const [readingError,  setReadingError]  = useState('');

  const updateForm = (field, value) => setForm(f => ({ ...f, [field]: value }));

  // ── limpar polling ao desmontar ───────────────────────
  useEffect(() => {
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, []);

  // ── STEP 1 → 2: criar pedido PIX no backend ──────────
  const handleSubmit = async () => {
    setPixError('');
    setStep('pix_creating');
    try {
      const order = await createPixOrder({
        serviceId:   service.id,
        serviceName: service.name,
        price:       service.price,
        formData:    form,
      });
      setPixId(order.pixId);
      setCopyCode(order.copyPasteCode || '');
      setPixStatus('pending');
      setStep('pix');
      startPolling(order.pixId);
    } catch (err) {
      setPixError('Não foi possível iniciar o pagamento. Tente novamente.');
      setStep('form');
    }
  };

  // ── polling automático de status PIX ─────────────────
  const startPolling = (id) => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = setInterval(async () => {
      try {
        const { status } = await checkPixStatus(id);
        setPixStatus(status);
        if (status === 'paid') {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
          iniciarLeitura(id);
        }
        if (status === 'expired') {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
          setPixError('O tempo do pagamento expirou. Feche e tente novamente.');
        }
      } catch { /* erros de rede pontuais são ignorados */ }
    }, 4000);
  };

  // ── confirmação manual (botão no step PIX, para testes) ──
  const handleManualConfirm = async () => {
    if (!pixId) return;
    setPixError('');
    try {
      await confirmPixManually(pixId);
      setPixStatus('paid');
      if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null; }
      iniciarLeitura(pixId);
    } catch (err) {
      setPixError('Erro ao confirmar pagamento: ' + err.message);
    }
  };

  // ── STEP 3: gerar leitura via IA (exige pixId pago) ──
  const iniciarLeitura = async (id) => {
    setStep('loading');
    setReadingError('');

    const picked = [...TAROT_CARDS_FALLBACK]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    setSelectedCards(picked);
    setRevealed([]);

    const messages = buildPrompt(service, form);

    try {
      const { answer } = await solicitarLeitura({
        pixId:       id || pixId,
        serviceType: service.type,
        messages,
      });
      setReading(answer);
    } catch (err) {
      if (err.message === 'pagamento_pendente') {
        setReadingError('Pagamento ainda não confirmado. Aguarde ou contate o suporte.');
      } else {
        setReading('Os véus resistem por ora... Os Arcanos recolhem suas forças. Tente novamente em instantes.');
      }
    }

    setStep('result');
    picked.forEach((_, i) => setTimeout(() => setRevealed(prev => [...prev, i]), i * 700 + 500));
  };

  // ── copiar código PIX ─────────────────────────────────
  const handleCopyCode = () => {
    if (copyCode) navigator.clipboard.writeText(copyCode).catch(() => {});
  };

  // ─────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>

        {/* ── FORM ── */}
        {step === 'form' && (
          <>
            <div className="modal-eyebrow">{service.icon} {service.name}</div>
            <div className="modal-title">Abrir o Portal</div>
            <div className="modal-subtitle">
              Os Arcanos aguardam sua intenção. Cada resposta abre um véu adicional — seja preciso(a).
            </div>

            <FormFields service={service} form={form} updateForm={updateForm} />

            <button
              className="btn-primary"
              style={{ width: '100%', marginTop: '1rem' }}
              onClick={handleSubmit}
            >
              Selar o ritual de acesso →
            </button>
          </>
        )}

        {/* ── CRIANDO PEDIDO PIX ── */}
        {step === 'pix_creating' && (
          <div className="ai-loading">
            <div className="modal-eyebrow" style={{ textAlign: 'center' }}>✦ Abrindo portal de pagamento</div>
            <div className="ai-orb" />
            <div className="ai-text">Preparando seu sigilo bancário...</div>
          </div>
        )}

        {/* ── PIX ── */}
        {step === 'pix' && (
          <div className="pix-panel">
            <div className="modal-eyebrow">✦ Ritual de acesso via PIX</div>
            <div className="modal-title" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              O Portal está se abrindo
            </div>

            <div className="pix-qr"><FakeQR /></div>
            <div className="pix-amount">{service.price}</div>
            <div className="pix-label">Escaneie o Sigilo Bancário para selar o acesso</div>

            <button className="pix-copy-btn" onClick={handleCopyCode}>
              📋 Copiar código de acesso PIX
            </button>

            {/* Status do pagamento */}
            <div className="pix-status">
              <div className={`pix-dot ${pixStatus === 'paid' ? 'pix-dot--paid' : ''}`} />
              <span>
                {pixStatus === 'paid'
                  ? '✅ Pagamento confirmado!'
                  : 'Aguardando a confirmação do ritual...'}
              </span>
            </div>

            {pixError && (
              <div style={{ color: '#ff6b6b', fontSize: '0.85rem', textAlign: 'center', marginTop: '0.5rem' }}>
                {pixError}
              </div>
            )}

            <div className="pix-confirm">
              {/* Botão de confirmação manual — remover quando webhook estiver ativo */}
              <button
                className="btn-primary"
                style={{ width: '100%' }}
                onClick={handleManualConfirm}
                disabled={pixStatus === 'paid'}
              >
                ✦ {pixStatus === 'paid' ? 'Pagamento confirmado — iniciando...' : 'Confirmar pagamento → iniciar leitura'}
              </button>
              <div style={{ fontSize: '0.72rem', opacity: 0.45, textAlign: 'center', marginTop: '0.6rem' }}>
                A leitura só será gerada após confirmação do pagamento
              </div>
            </div>
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

        {/* ── RESULT ── */}
        {step === 'result' && (
          <div className="result-panel">
            <div className="modal-eyebrow">✦ O Véu foi levantado</div>
            <div className="modal-title" style={{ marginBottom: '0.3rem' }}>
              {service.name} — Revelação
            </div>
            <div className="modal-subtitle" style={{ marginBottom: '1.5rem' }}>
              As forças arquetípicas se manifestaram para {form.nome || 'você'}, buscador(a) da verdade.
            </div>

            {/* Cartas — tarot e runas */}
            {['tarot', 'runas'].includes(service.type) && (
              <div className="result-cards">
                {selectedCards.map((card, i) => (
                  <div key={i} className={`tarot-card ${revealed.includes(i) ? 'revealed' : ''}`}>
                    {revealed.includes(i) ? card.icon : '🌑'}
                  </div>
                ))}
              </div>
            )}

            {/* Números — numerologia */}
            {service.type === 'numerologia' && (
              <div className="num-grid">
                {[
                  { l: 'Caminho de Vida',      v: Math.floor(Math.random() * 9) + 1 },
                  { l: 'Número de Expressão',  v: Math.floor(Math.random() * 9) + 1 },
                  { l: 'Ano Pessoal',          v: Math.floor(Math.random() * 9) + 1 },
                ].map((n, i) => (
                  <div key={i} className="num-card">
                    <div className="num-value">{n.v}</div>
                    <div className="num-label">{n.l}</div>
                  </div>
                ))}
              </div>
            )}

            {readingError && (
              <div style={{ color: '#ff6b6b', textAlign: 'center', marginBottom: '1rem', fontSize: '0.9rem' }}>
                {readingError}
              </div>
            )}

            <div className="result-reading">
              <p>{reading}</p>
              <div className="result-name">
                — Oráculo gerado em {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </div>
            </div>

            <button
              className="btn-primary"
              style={{ width: '100%', marginTop: '1.5rem' }}
              onClick={onClose}
            >
              Que este oráculo seja guardado ✦
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ServiceModal;
