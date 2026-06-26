import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';

// Conteúdo rico em texto para cada post do Blog
const POSTS_CONTENT = {
  'o-arcano-da-torre-quando-tudo-desmorona-para-renascer': {
    title: 'O Arcano da Torre: quando tudo desmorona para renascer',
    tag: 'Tarot',
    date: '12 Abr 2026',
    icon: '⚡',
    bg: 'linear-gradient(135deg,#1a0a2e,#2d1257)',
    content: (
      <>
        <p>No Tarot, poucas cartas evocam tanta apreensão imediata quanto a de número XVI: <strong>A Torre</strong>. A imagem clássica de uma estrutura alta sendo atingida por um raio celestial, com coroas caindo e figuras despencando no abismo, costuma assustar à primeira vista. No entanto, na filosofia arcana, a Torre é um dos portais mais sagrados de libertação e renascimento.</p>
        
        <div className="mystic-quote" style={{
          background: 'rgba(255, 215, 0, 0.03)',
          borderLeft: '4px solid var(--gold)',
          padding: '1.5rem',
          margin: '2rem 0',
          borderRadius: '0 8px 8px 0',
          fontStyle: 'italic',
          color: 'var(--gold-light)'
        }}>
          "A Torre não destrói o que é real; ela apenas reduz a cinzas as ilusões que construímos para nos proteger do nosso próprio poder."
        </div>

        <h3>A Natureza do Raio Celestial</h3>
        <p>O raio que atinge a Torre não é uma punição divina irada; é a luz da verdade absoluta que rompe o véu da negação. Muitas vezes, passamos anos construindo estruturas rígidas — casamentos falidos, carreiras insatisfatórias ou crenças limitantes sobre quem somos. Nós nos trancamos nessas fortalezas de ego e as chamamos de "segurança".</p>
        <p>Quando a vida bate à nossa porta com a força da Torre, ela está simplesmente derrubando as paredes que se tornaram prisões. A dor da Torre não vem da destruição em si, mas da nossa resistência em soltar os tijolos antigos.</p>

        <h3>Como Navegar por uma Fase "Torre" na sua Vida?</h3>
        <p>Se você sente que sua vida está passando por um colapso estrutural, aqui estão alguns conselhos do oráculo para acalmar sua alma:</p>
        <ul>
          <li style={{ marginBottom: '0.8rem' }}><strong>Não tente segurar os escombros:</strong> Deixe cair o que precisa cair. Forçar a permanência de uma estrutura rachada só prolongará a dor.</li>
          <li style={{ marginBottom: '0.8rem' }}><strong>Olhe para o solo:</strong> Remova as pedras caídas e veja as fundações. O que sobrou? O que é indestrutível em você? É a partir dessa verdade que você reconstruirá.</li>
          <li style={{ marginBottom: '0.8rem' }}><strong>Agradeça ao raio:</strong> A tempestade limpa o ar abafado. Sob o céu limpo pós-Torre, você finalmente terá espaço para erguer algo alinhado com seu propósito superior.</li>
        </ul>

        <p>Lembre-se: o arcano seguinte à Torre é <strong>A Estrela</strong> — a carta da esperança, da cura e da inspiração cósmica. O colapso da Torre é apenas a preparação necessária para que você possa ver o brilho das estrelas novamente.</p>
      </>
    )
  },
  'jupiter-em-gemeos-expansao-pelo-conhecimento-e-comunicacao': {
    title: 'Júpiter em Gêmeos: expansão pelo conhecimento e comunicação',
    tag: 'Astrologia',
    date: '9 Abr 2026',
    icon: '🌌',
    bg: 'linear-gradient(135deg,#0a1a2e,#0d2b4a)',
    content: (
      <>
        <p>O grande benfeitor do zodíaco, <strong>Júpiter</strong>, mudou-se para as águas intelectuais e dinâmicas de <strong>Gêmeos</strong>. Este trânsito planetário marca um período extraordinário de curiosidade insaciável, conexões sociais intensas e fluxo acelerado de informações. É hora de expandir sua mente através das palavras.</p>

        <div className="mystic-quote" style={{
          background: 'rgba(255, 215, 0, 0.03)',
          borderLeft: '4px solid var(--gold)',
          padding: '1.5rem',
          margin: '2rem 0',
          borderRadius: '0 8px 8px 0',
          fontStyle: 'italic',
          color: 'var(--gold-light)'
        }}>
          "Quando o planeta da sabedoria encontra o signo do intelecto, o cosmos nos convida a fazer perguntas, e não a buscar respostas definitivas."
        </div>

        <h3>A Mente em Estado de Vento</h3>
        <p>Júpiter representa sorte, crescimento, filosofia e abundância. Gêmeos é um signo de ar, regido por Mercúrio, que lida com a dualidade, o aprendizado, a escrita e as trocas diárias. Sob essa influência, o aprendizado se torna a nossa maior fonte de sorte.</p>
        <p>Você sentirá um desejo ardente de iniciar novos cursos, ler vários livros ao mesmo tempo, aprender novos idiomas e se conectar com pessoas de diferentes esferas. A sorte sorri para quem se comunica, escreve, ensina e se permite ser um eterno aprendiz.</p>

        <h3>Oportunidades deste Trânsito</h3>
        <p>Para aproveitar ao máximo esta poderosa janela cósmica, foque nas seguintes direções:</p>
        <ul>
          <li style={{ marginBottom: '0.8rem' }}><strong>Escreva e Compartilhe:</strong> Coloque suas ideias no mundo. Se você tem um blog, um podcast ou um projeto de livro engavetado, a hora de lançar é agora.</li>
          <li style={{ marginBottom: '0.8rem' }}><strong>Diversifique seus contatos:</strong> Fale com pessoas fora do seu círculo habitual. Gêmeos ama pontes; uma conversa informal pode trazer uma grande oportunidade profissional.</li>
          <li style={{ marginBottom: '0.8rem' }}><strong>Pratique a leveza mental:</strong> Não se leve tão a sério. Brinque com os conceitos, faça experimentos e encare a vida sob uma ótica de pura curiosidade científica e mística.</li>
        </ul>
      </>
    )
  },
  'o-numero-do-destino-como-calcula-lo-e-o-que-ele-revela': {
    title: 'O Número do Destino: como calculá-lo e o que ele revela',
    tag: 'Numerologia',
    date: '5 Abr 2026',
    icon: '🔢',
    bg: 'linear-gradient(135deg,#1a2e0a,#1a3d0d)',
    content: (
      <>
        <p>A numerologia hermética ensina que o universo é construído sobre a harmonia geométrica dos números. Entre todas as vibrações numéricas do seu mapa pessoal, o <strong>Número do Destino</strong> (também conhecido como Caminho de Vida) é o mais crucial: ele revela a lição central que sua alma veio aprender e a energia que rege seus talentos inatos.</p>

        <h3>Como calcular seu Número de Destino?</h3>
        <p>O cálculo é extremamente simples e baseia-se na soma redutiva de todos os algarismos da sua data de nascimento. Vamos a um exemplo prático:</p>
        <p>Suponha que você nasceu em <strong>14 de Maio de 1992</strong> (14/05/1992):</p>
        <ol>
          <li style={{ marginBottom: '0.5rem' }}>Some o dia: 1 + 4 = <strong>5</strong></li>
          <li style={{ marginBottom: '0.5rem' }}>Some o mês: 0 + 5 = <strong>5</strong></li>
          <li style={{ marginBottom: '0.5rem' }}>Some o ano: 1 + 9 + 9 + 2 = 21 → 2 + 1 = <strong>3</strong></li>
          <li style={{ marginBottom: '0.5rem' }}>Some os três totais: 5 + 5 + 3 = 13 → reduza a um único dígito: 1 + 3 = <strong>4</strong></li>
        </ol>
        <p>Neste caso, o Número do Destino é o <strong>4</strong>. (Nota: Se a soma final der 11 or 22, não reduza; esses são chamados de <em>Números Mestres</em> e carregam uma vibração espiritual elevada).</p>

        <h3>Os Significados Rápidos dos Números</h3>
        <p>Veja a tônica essencial de cada vibração numérica:</p>
        <ul>
          <li style={{ marginBottom: '0.8rem' }}><strong>Destino 1 (O Líder):</strong> Veio desenvolver independência, originalidade e coragem pioneira.</li>
          <li style={{ marginBottom: '0.8rem' }}><strong>Destino 2 (O Diplomata):</strong> Veio aprender sobre cooperação, parceria, paciência e harmonia nas relações.</li>
          <li style={{ marginBottom: '0.8rem' }}><strong>Destino 3 (O Comunicador):</strong> Sua missão é a autoexpressão criativa, a alegria e a comunicação inspiradora.</li>
          <li style={{ marginBottom: '0.8rem' }}><strong>Destino 4 (O Construtor):</strong> Veio estabelecer estabilidade, organização, trabalho sólido e segurança prática.</li>
          <li style={{ marginBottom: '0.8rem' }}><strong>Destino 5 (O Viajante):</strong> Focado na liberdade pessoal, adaptabilidade, aventura e transformações constantes.</li>
          <li style={{ marginBottom: '0.8rem' }}><strong>Destino 6 (O Protetor):</strong> Sua jornada envolve responsabilidade familiar, amor incondicional, cura e serviço à comunidade.</li>
          <li style={{ marginBottom: '0.8rem' }}><strong>Destino 7 (O Filósofo):</strong> Busca profunda pela verdade, espiritualidade, introspecção, ciência e sabedoria oculta.</li>
          <li style={{ marginBottom: '0.8rem' }}><strong>Destino 8 (O Realizador):</strong> Caminho focado no poder material, finanças, justiça, autoridade e equilíbrio espiritual.</li>
          <li style={{ marginBottom: '0.8rem' }}><strong>Destino 9 (O Humanitário):</strong> Missão de desapego, compaixão universal, amor fraternal e encerramento de ciclos cármicos.</li>
        </ul>
      </>
    )
  },
  'ritual-de-lua-nova-semear-intencoes-no-solo-do-cosmos': {
    title: 'Ritual de Lua Nova: semear intenções no solo do cosmos',
    tag: 'Rituais',
    date: '1 Abr 2026',
    icon: '🕯️',
    bg: 'linear-gradient(135deg,#2e1a0a,#4a2b0d)',
    content: (
      <>
        <p>A <strong>Lua Nova</strong> marca o início do ciclo lunar. Astronomicamente, a lua está posicionada entre a Terra e o Sol, mostrando-nos sua face oculta e escura. Espiritualmente, a Lua Nova representa o útero cósmico: o momento do vazio sagrado, da escuridão fértil de onde toda a criação nasce. É o momento perfeito para semear intenções.</p>

        <h3>Preparando seu Espaço Sagrado</h3>
        <p>Para realizar este ritual simples mas extremamente potente de manifestação, você precisará de:</p>
        <ul>
          <li style={{ marginBottom: '0.5rem' }}>Uma vela branca ou dourada.</li>
          <li style={{ marginBottom: '0.5rem' }}>Um pedaço de papel em branco e uma caneta.</li>
          <li style={{ marginBottom: '0.5rem' }}>Um cristal de sua escolha (Quartzo Transparente ou Ametista são ideais).</li>
          <li style={{ marginBottom: '0.5rem' }}>Incenso de sândalo ou mirra para limpar o ambiente.</li>
        </ul>

        <h3>O Passo a Passo do Ritual</h3>
        <p>Siga os passos com reverência e entrega mental:</p>
        <ol>
          <li style={{ marginBottom: '0.8rem' }}><strong>Limpeza:</strong> Acenda o incenso e passe a fumaça ao seu redor e sobre os itens do ritual, mentalizando a dissipação de energias estagnadas.</li>
          <li style={{ marginBottom: '0.8rem' }}><strong>Foco:</strong> Acenda a vela. Olhe para a chama por alguns instantes, respirando profundamente até que sua mente se acalme e se sintonize com o momento presente.</li>
          <li style={{ marginBottom: '0.8rem' }}><strong>Escrita das Intenções:</strong> No papel, escreva seus desejos para as próximas 4 semanas. Escreva no <strong>tempo presente</strong>, como se já estivesse vivendo aquilo. Exemplo: <em>"Agradeço pela facilidade com que novos clientes chegam ao meu trabalho neste mês."</em></li>
          <li style={{ marginBottom: '0.8rem' }}><strong>Consagração:</strong> Segure o cristal nas mãos, posicione-o sobre o papel e feche os olhos. Mentalize a energia da Lua Nova descendo como uma luz prateada e carregando suas intenções com força de manifestação.</li>
          <li style={{ marginBottom: '0.8rem' }}><strong>Encerramento:</strong> Dobre o papel, guarde-o em uma gaveta ou sob o cristal até a Lua Cheia, e deixe a vela queimar até o final em local seguro.</li>
        </ol>
      </>
    )
  },
  'ametista-a-pedra-da-transmutacao-e-sabedoria-superior': {
    title: 'Ametista: a pedra da transmutação e sabedoria superior',
    tag: 'Cristais',
    date: '28 Mar 2026',
    icon: '💎',
    bg: 'linear-gradient(135deg,#0a2e2e,#0d4a4a)',
    content: (
      <>
        <p>Conhecida por sua deslumbrante tonalidade violeta, a <strong>Ametista</strong> é um dos cristais mais reverenciados na história da magia e da cura holística. Associada desde a antiguidade à sobriedade, à intuição e à conexão espiritual elevada, ela é a grande pedra de transmutação energética do reino mineral.</p>

        <div className="mystic-quote" style={{
          background: 'rgba(255, 215, 0, 0.03)',
          borderLeft: '4px solid var(--gold)',
          padding: '1.5rem',
          margin: '2rem 0',
          borderRadius: '0 8px 8px 0',
          fontStyle: 'italic',
          color: 'var(--gold-light)'
        }}>
          "A Ametista atua como um filtro cósmico: ela atrai as vibrações densas de raiva, medo e ansiedade, purificando-as na chama violeta da sabedoria espiritual."
        </div>

        <h3>Propriedades Metafísicas e Espirituais</h3>
        <p>A ametista vibra na frequência do <strong>Chakra Coronário</strong> (Sahasrara) e do <strong>Terceiro Olho</strong> (Ajna). Suas principais funções energéticas incluem:</p>
        <ul>
          <li style={{ marginBottom: '0.8rem' }}><strong>Transmutação de energia:</strong> Ideal para ambientes carregados ou de grande circulação. Ela limpa o campo áurico de influências externas densas.</li>
          <li style={{ marginBottom: '0.8rem' }}><strong>Calma mental profunda:</strong> Excelente para pessoas que sofrem de insônia, mentes aceleradas e estresse crônico. Colocar uma ametista sob o travesseiro induz a sono reparador e sonhos lúcidos.</li>
          <li style={{ marginBottom: '0.8rem' }}><strong>Amplificação da Intuição:</strong> Abre os canais receptivos para meditação profunda, ajudando a sintonizar a sabedoria dos guias espirituais e do Eu Superior.</li>
        </ul>

        <h3>Como limpar e energizar sua Ametista?</h3>
        <p>Como acumuladora e transmutadora de energia, sua ametista precisa ser cuidada. Lave-a em água corrente com sal grosso por alguns segundos. Para energizá-la, coloque-a sob a luz da <strong>Lua Cheia</strong> por uma noite. Evite deixá-la sob sol forte por muitas horas, pois o calor solar excessivo pode fazer o cristal perder sua bela cor violeta característica.</p>
      </>
    )
  },
  'horoscopo-de-abril-reorientacao-e-clareza-para-todos-os-signos': {
    title: 'Horóscopo de Abril: reorientação e clareza para todos os signos',
    tag: 'Horóscopo',
    date: '25 Mar 2026',
    icon: '♈',
    bg: 'linear-gradient(135deg,#2e0a1a,#4a0d2b)',
    content: (
      <>
        <p>O mês de <strong>Abril</strong> chega sob a forte influência solar de <strong>Áries</strong>, o pioneiro do zodíaco, trazendo uma carga imensa de iniciativa, recomeços e coragem vital. No entanto, com o trânsito de Mercúrio retrógrado acontecendo em paralelo, o cosmos nos dá um recado muito claro: corra para frente, mas certifique-se de olhar para trás para ajustar a rota.</p>

        <h3>O Grande Encontro de Forças</h3>
        <p>Este mês reserva momentos de intensa reavaliação. Enquanto o Sol ariano incita ação imediata e quebra de barreiras, a retrogradação nos força a revisar contratos, palavras ditas e decisões precipitadas tomadas no mês anterior. O segredo do sucesso em Abril é agir com a coragem do guerreiro, mas com a cautela do estrategista.</p>
        <p>As relações afetivas passam por um momento de redefinição de limites, pedindo mais transparência e menos orgulho ferido. No setor profissional, projetos antigos que pareciam travados podem ressurgir com uma nova roupagem muito mais próspera.</p>

        <h3>Conselho Geral para o Mês</h3>
        <p>Seja qual for o seu signo do zodíaco, a energia de Abril pede:</p>
        <ul>
          <li style={{ marginBottom: '0.8rem' }}><strong>Paciência com atrasos:</strong> Mal-entendidos na comunicação e atrasos tecnológicos são normais neste período. Respire fundo e revise duas vezes e-mails e contratos.</li>
          <li style={{ marginBottom: '0.8rem' }}><strong>Reconexão com o corpo:</strong> Gaste a energia ariana praticando exercícios físicos ou caminhando ao ar livre para descarregar tensões mentais.</li>
          <li style={{ marginBottom: '0.8rem' }}><strong>Corte de excessos:</strong> Limpe gavetas, armários e livre-se de pendências emocionais antigas para abrir espaço para o fluxo abundante do outono/primavera cósmica.</li>
        </ul>
      </>
    )
  }
};

export default function BlogPostPage() {
  const { postSlug } = useParams();

  const post = POSTS_CONTENT[postSlug];

  if (!post) {
    return (
      <div style={{ minHeight: '100vh', padding: '10rem 2rem', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--gold)', marginBottom: '1.5rem' }}>Artigo Não Encontrado</h2>
        <p style={{ opacity: 0.8, marginBottom: '2rem' }}>O artigo cósmico que você tentou acessar já foi arquivado ou mudou de constelação.</p>
        <Link to="/blog" className="btn-primary" style={{ textDecoration: 'none', padding: '1rem 2rem' }}>
          Voltar ao Blog
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '8rem 2rem 4rem', maxWidth: '800px', margin: '0 auto' }}>
      <Helmet>
        <title>{`${post.title} | Blog Magik Tarot`}</title>
        <meta name="description" content={`Leia o artigo completo: ${post.title}. Sabedoria ancestral, interpretações e conselhos práticos para sua vida.`} />
      </Helmet>

      {/* Breadcrumbs */}
      <div style={{ fontSize: '0.8rem', opacity: 0.5, marginBottom: '2rem' }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Início</Link> &gt;{' '}
        <Link to="/blog" style={{ color: '#fff', textDecoration: 'none' }}>Blog</Link> &gt;{' '}
        <span style={{ color: 'var(--gold)' }}>{post.title}</span>
      </div>

      {/* Post Hero Section */}
      <div style={{
        background: post.bg || 'linear-gradient(135deg,#1a0a2e,#2d1257)',
        borderRadius: '24px',
        padding: '4rem 2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
        marginBottom: '3rem'
      }}>
        <span style={{ fontSize: '5rem', display: 'block', marginBottom: '1.5rem', animation: 'float 3s ease-in-out infinite' }}>
          {post.icon}
        </span>
        <span style={{
          fontSize: '0.75rem',
          color: 'var(--gold)',
          background: 'rgba(0,0,0,0.4)',
          padding: '4px 12px',
          borderRadius: '20px',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          display: 'inline-block',
          marginBottom: '1.5rem',
          border: '1px solid rgba(255,215,0,0.2)'
        }}>
          {post.tag}
        </span>
        <h1 style={{ 
          fontSize: '2.2rem', 
          fontWeight: '800', 
          color: '#fff', 
          lineHeight: '1.3', 
          maxWidth: '700px', 
          margin: '0 auto 1.5rem' 
        }}>
          {post.title}
        </h1>
        <div style={{ fontSize: '0.85rem', opacity: 0.6 }}>Publicado em {post.date} por Magik Tarot</div>
      </div>

      {/* Article Body */}
      <article style={{
        background: 'rgba(20, 20, 25, 0.75)',
        border: '1px solid rgba(255, 215, 0, 0.1)',
        borderRadius: '16px',
        padding: '3rem 2.5rem',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        backdropFilter: 'blur(10px)',
        color: 'rgba(255, 255, 255, 0.88)',
        fontSize: '1.05rem',
        lineHeight: '1.8',
        marginBottom: '4rem'
      }}>
        {post.content}
      </article>

      {/* Contextual CTA (Upsell) */}
      <div style={{
        background: 'rgba(255, 215, 0, 0.03)',
        border: '1px solid rgba(255, 215, 0, 0.18)',
        borderRadius: '20px',
        padding: '3rem 2rem',
        textAlign: 'center',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
        marginBottom: '4rem'
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔮</div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fff', marginBottom: '0.8rem' }}>
          Quer aprofundar suas revelações?
        </h3>
        <p style={{ fontSize: '0.95rem', opacity: 0.8, maxWidth: '500px', margin: '0 auto 2rem', lineHeight: '1.6' }}>
          Deixe que os arcanos do destino tragam respostas exatas e personalizadas para as suas dúvidas mais profundas de amor, carreira ou caminho de vida.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/consultas" className="btn-primary" style={{ textDecoration: 'none', padding: '1rem 2.5rem' }}>
            Fazer Consulta Personalizada ✦
          </Link>
          <Link to="/blog" className="btn-secondary" style={{ textDecoration: 'none', padding: '1rem 2.5rem' }}>
            Ver Outros Artigos
          </Link>
        </div>
      </div>
    </div>
  );
}
