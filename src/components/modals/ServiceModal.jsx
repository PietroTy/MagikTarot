import { useState, useEffect, useRef } from 'react';
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
    tarot: `O(a) consultante ${form.nome || 'buscador'} abre um portal no Oráculo do Tarot.
Domínio da consulta: ${form.dominio || 'não especificado'}.
Intenção sagrada declarada: "${form.pergunta || 'encontrar clareza'}".
${form.temor ? `O(a) consultante também declarou: "${form.temor}" — como algo que teme descobrir.` : ''}

Método oracular: "${extra.spreadName || 'Tradicional'}".
Estrutura da tiragem com as cartas reveladas:
${(extra.cards || []).map((c, i) => `- Posição ${i+1} (${extra.positions?.[i] || 'Influência'}): Carta "${c.name}"${c.reversed ? ' [INVERTIDA — energia bloqueada, sombra, desafio interno]' : ''}`).join('\n')}

INSTRUÇÃO SAGRADA — FORMA DA RESPOSTA:
Para cada carta listada acima, escreva UM parágrafo completo e profundo que:
1. Nomeie a carta e descreva seu arquétipo e energia essencial
2. Explique O QUE ESSA CARTA REVELA ESPECIFICAMENTE sobre o tema "${form.dominio || form.pergunta || 'da consulta'}" na posição que ocupa (${(extra.positions || []).join(', ') || 'esta tiragem'})
3. Conecte o simbolismo da carta à situação concreta do consultante

Depois das cartas, escreva um parágrafo final de síntese que une as energias das cartas em uma mensagem oracular coesa.
Seja poético, profundo e revelador. Nunca genérico — cada carta tem uma mensagem específica para ESTA situação.`,

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
          <label className="form-label">Intenção sagrada</label>
          <textarea
            className="form-textarea"
            value={form.pergunta}
            onChange={e => updateForm('pergunta', e.target.value)}
            placeholder="Qual véu deseja que os Arcanos levantem? Quanto mais profunda a pergunta, mais profunda a revelação..."
          />
        </div>
        <div className="form-group" style={{ marginTop: '0.5rem' }}>
          <label className="form-label">Há algo que teme descobrir? <span style={{opacity:0.5}}>(opcional)</span></label>
          <textarea
            className="form-textarea"
            style={{minHeight:'60px'}}
            value={form.temor}
            onChange={e => updateForm('temor', e.target.value)}
            placeholder="Os Arcanos revelam tudo. Se houver um véu que prefere manter, declare-o aqui..."
          />
        </div>

        {/* Opções avançadas do baralho */}
        <div className="deck-options">
          <div className="deck-option-row">
            <label className="deck-option-label">
              <input
                type="checkbox"
                className="deck-option-check"
                checked={form.incluirMenores}
                onChange={e => updateForm('incluirMenores', e.target.checked)}
              />
              <span className="deck-option-icon">🔮</span>
              <span>
                <strong>Incluir Arcanos Menores</strong>
                <small>Adiciona os 56 arcanos menores ao baralho (Paus 🔥, Copas 💧, Espadas ⚔️, Ouros 🟡)</small>
              </span>
            </label>
          </div>
          <div className="deck-option-row">
            <label className="deck-option-label">
              <input
                type="checkbox"
                className="deck-option-check"
                checked={form.permitirInvertidas}
                onChange={e => updateForm('permitirInvertidas', e.target.checked)}
              />
              <span className="deck-option-icon">🔄</span>
              <span>
                <strong>Permitir cartas invertidas</strong>
                <small>35% de chance de cada carta aparecer invertida — revela sombras e bloqueios</small>
              </span>
            </label>
          </div>
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
          <label className="form-label">A linha que mais ressoa com sua história</label>
          <select className="form-select" value={form.linha} onChange={e => updateForm('linha', e.target.value)}>
            <option value="">Qual linha você mais nota?</option>
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
  tiragem: 'ppf',
  dominio: '', aspecto: '', vinculo: '', temor: '', atracao: '',
  nome2: '', nascimento2: '', nomeCompleto: '', nomeAtual: '',
  nomeBatismo: '', tradicao: 'Futhark Antigo', mao: 'Direita',
  linha: '', outraTela: '',
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
        <span className="card-fallback-icon">{card?.icon || '🃏'}</span>
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
  const [payStatus,    setPayStatus]   = useState('pending'); // pending | approved | rejected | cancelled
  const pollingRef = useRef(null);

  // Resultado
  const [shuffledDeck,  setShuffledDeck]  = useState([]); // baralho embaralhado na mesa
  const [pickedIndices, setPickedIndices] = useState([]); // índices selecionados pelo usuário
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

  // ── STEP 1 → 2: criar pedido no backend e abrir checkout MP ──
  const handleSubmit = async () => {
    setPayError('');
    handleSetStep('mp_creating');
    try {
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
      const { answer } = await solicitarLeitura({
        orderId:     orderId,
        serviceType: service.type,
        messages,
      });
      setReading(answer);
    } catch (err) {
      setReading('Os véus resistem por ora... Tente novamente em instantes.');
    }

    handleSetStep('result');
    cards.forEach((_, i) => setTimeout(() => setRevealed(prev => [...prev, i]), i * 700 + 500));
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
          prepararMesa(); // Inicia o ritual de embaralhar
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
  if (step === 'result') {
    const currentSpread = SPREADS.find(s => s.id === form.tiragem) || SPREADS[0];
    return (
      <div className="revelation-page">
        {/* Header */}
        <div className="revelation-header">
          <div className="revelation-eyebrow">✦ O Véu foi levantado</div>
          <h1 className="revelation-title">{service.name} — Revelação</h1>
          <p className="revelation-subtitle">
            As forças arquetípicas se manifestaram para <em>{form.nome || 'você'}</em>, buscador(a) da verdade.
          </p>
          <button className="revelation-close" onClick={onClose} title="Fechar">✕</button>
        </div>

        {/* Cards strip */}
        {['tarot', 'runas'].includes(service.type) && (
          <div className="revelation-cards-strip">
            {selectedCards.map((card, i) => (
              <div key={i} className="revelation-card-slot">
                <div className={`revelation-card-wrap ${revealed.includes(i) ? 'rev-revealed' : 'rev-back'}`}>
                  <CardImage card={card} revealed={revealed.includes(i)} />
                </div>
                {revealed.includes(i) && (
                  <div className="revelation-card-info">
                    <div className="revelation-card-name">{card.icon} {card.name}</div>
                    <div className="revelation-card-position">
                      {currentSpread?.positions?.[i] || `Posição ${i + 1}`}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Numerologia */}
        {service.type === 'numerologia' && (
          <div className="num-grid" style={{ maxWidth: '600px', margin: '2rem auto' }}>
            {[
              { l: 'Caminho de Vida',     v: Math.floor(Math.random() * 9) + 1 },
              { l: 'Número de Expressão', v: Math.floor(Math.random() * 9) + 1 },
              { l: 'Ano Pessoal',         v: Math.floor(Math.random() * 9) + 1 },
            ].map((n, i) => (
              <div key={i} className="num-card">
                <div className="num-value">{n.v}</div>
                <div className="num-label">{n.l}</div>
              </div>
            ))}
          </div>
        )}

        {/* Reading */}
        <div className="revelation-reading-wrap">
          <div className="revelation-reading">
            {formatReading(reading)}
            <div className="result-name">
              — Oráculo gerado em {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Footer button */}
        <div className="revelation-footer">
          <button className="btn-primary revelation-btn" onClick={onClose}>
            Que este oráculo seja guardado ✦
          </button>
        </div>
      </div>
    );
  }

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