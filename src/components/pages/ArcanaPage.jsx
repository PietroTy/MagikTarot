import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useData } from '../../context/DataContext';

// Dicionário rico contendo significados detalhados para cada um dos 22 Arcanos Maiores
const ARCANA_DETAILS = {
  '0_louco': {
    keyword: 'Novos Começos, Espontaneidade, Fé no Salto',
    general: 'O Louco convida você a dar o "salto da fé" rumo ao desconhecido. É o início de uma nova jornada espiritual onde a pureza do coração e a ausência de preconceitos são suas maiores forças.',
    love: 'Indica novos amores inesperados, relacionamentos livres de amarras ou a necessidade de trazer mais leveza e aventura para a relação atual.',
    career: 'Momento de iniciar novos projetos ousados ou mudar de área profissional. Oportunidades financeiras virão se você se abrir para abordagens não convencionais.'
  },
  'i_mago': {
    keyword: 'Poder de Manifestação, Habilidade, Foco',
    general: 'O Mago sinaliza que você possui todas as ferramentas, talentos e recursos necessários para manifestar seus desejos no plano físico. Use sua força de vontade focada.',
    love: 'Representa atração magnética, iniciativa amorosa e poder de sedução. Um relacionamento com excelente comunicação e inteligência mútua.',
    career: 'Alta produtividade, capacidade de liderança e habilidade de resolver problemas difíceis. Excelente período para vendas, negociações e promoção profissional.'
  },
  'ii_sacerdotisa': {
    keyword: 'Intuição, Mistério, Sabedoria Interior',
    general: 'A Sacerdotisa pede que você se volte para dentro e confie nos sussurros da sua intuição. Nem tudo está revelado na superfície; aguarde o momento certo para agir.',
    love: 'Representa amores secretos, sentimentos profundos mantidos em silêncio ou um vínculo de alma que ultrapassa a barreira física.',
    career: 'Momento de agir nos bastidores. Observe o cenário corporativo com atenção. Negócios relacionados à intuição, psicologia e mentoria estão altamente favorecidos.'
  },
  'iii_imperatriz': {
    keyword: 'Abundância, Fertilidade, Criatividade, Cuidado',
    general: 'A Imperatriz celebra a energia da criação, da beleza e do florescimento da natureza. Ela indica que você está entrando em um período de grande fertilidade física, mental e espiritual.',
    love: 'Representa casamento, gestação, sexualidade sagrada e amor abundante. Um momento de nutrição emocional mútua profunda.',
    career: 'Projetos criativos florescendo com imenso sucesso. Abundância financeira a caminho e ótima capacidade de liderança humanizada e acolhedora.'
  },
  'iv_imperador': {
    keyword: 'Estrutura, Autoridade, Estabilidade, Controle',
    general: 'O Imperador convida você a trazer ordem, disciplina e estrutura para sua vida. É o momento de assumir a autoridade sobre seu próprio caminho e estabelecer bases sólidas.',
    love: 'Amor sólido e protetor, focado na segurança de longo prazo. Pode indicar a necessidade de flexibilizar o controle ou o autoritarismo na relação.',
    career: 'Promoção para cargos de liderança ou consolidação de negócios próprios. Sucesso obtido através de organização meticulosa, planejamento estratégico e disciplina.'
  },
  'v_hierofante': {
    keyword: 'Tradição, Espiritualidade, Aprendizado, Aliança',
    general: 'O Hierofante representa o aprendizado de verdades universais, o respeito a valores éticos e a busca por mentores espirituais. Sugere alinhamento com ritos de passagem sagrados.',
    love: 'Casamento tradicional, bênção espiritual nas relações ou um amor baseado no respeito mútuo e em valores e crenças compartilhados.',
    career: 'Favorece o trabalho em instituições consolidadas, estudos acadêmicos e parcerias baseadas em contratos rigorosos e ética inabalável.'
  },
  'vi_enamorados': {
    keyword: 'Escolhas do Coração, Alinhamento de Valores, Paixão',
    general: 'Os Enamorados trazem a energia da harmonia, das conexões profundas e da necessidade de fazer escolhas importantes baseadas na verdade do seu coração, e não em pressões externas.',
    love: 'Representa união amorosa perfeita, paixão correspondida e afinidade magnética. Decisões importantes sobre o futuro de uma parceria.',
    career: 'Parcerias societárias benéficas e contratos vantajosos. Momento de decidir entre dois caminhos profissionais com base nos seus valores éticos.'
  },
  'vii_carro': {
    keyword: 'Vitória, Determinação, Direção, Autocontrole',
    general: 'O Carro anuncia a vitória alcançada através do foco absoluto, da força de vontade e da superação de forças opostas. Mantenha as rédeas firmes rumo às suas metas.',
    love: 'Indica a superação de obstáculos no amor ou uma relação que avança rapidamente rumo ao compromisso. Conquista amorosa triunfante.',
    career: 'Sucesso rápido em novos empreendimentos, viagens de negócios produtivas e reconhecimento público de seus esforços profissionais.'
  },
  'viii_justica': {
    keyword: 'Equilíbrio, Verdade, Causa e Efeito, Imparcialidade',
    general: 'A Justiça lembra que toda ação gera uma reação equivalente no tecido cósmico. Ela pede honestidade consigo mesmo, equilíbrio racional e a tomada de decisões justas.',
    love: 'Relacionamento baseado na igualdade e na reciprocidade. Acordos de convivência harmoniosos ou a necessidade de avaliar a relação com racionalidade.',
    career: 'Resolução favorável de disputas legais, contratos assinados com transparência e colheita justa do trabalho desempenhado com integridade.'
  },
  'ix_eremita': {
    keyword: 'Autoconhecimento, Introspecção, Lanterna da Alma',
    general: 'O Eremita convida você a se afastar do barulho do mundo externo para buscar as respostas no silêncio da sua própria alma. É um período sagrado de reflexão e maturidade.',
    love: 'Momento de solitude curativa para solteiros ou a necessidade de introspecção e espaço individual dentro do relacionamento para amadurecer a união.',
    career: 'Foco nos estudos, pesquisas profundas e planejamento estratégico silencioso. Não é hora de pressa financeira, mas de consolidar sua sabedoria técnica.'
  },
  'x_roda_da_fortuna': {
    keyword: 'Mudança de Ciclo, Destino, Oportunidade, Sorte',
    general: 'A Roda da Fortuna sinaliza que a roda do cosmos está girando. Situações antigas estão se encerrando para dar lugar a novos começos inevitáveis. Adapte-se com desapego.',
    love: 'Mudanças drásticas e inesperadas nas relações amorosas ou o surgimento de um amor predestinado (encontro cármico) que muda sua rota.',
    career: 'Mudança repentina de cargo, novas oportunidades de negócios que surgem do nada e fluxo de dinheiro que começa a circular com mais rapidez.'
  },
  'xi_forca': {
    keyword: 'Coragem Gentil, Autodomínio, Compaixão, Resiliência',
    general: 'A Força ensina que o verdadeiro poder reside na suavidade, no autodomínio emocional e na compaixão, e não na agressividade física. Dome suas feras internas com amor.',
    love: 'Vínculo amoroso intenso e magnético, onde a paciência e a empatia curam feridas passadas. Capacidade de superar crises afetivas juntos.',
    career: 'Resiliência extraordinária para enfrentar pressões no trabalho. Sucesso em negociações delicadas através de diplomacia firme e persuasão sutil.'
  },
  'xii_pendurado': {
    keyword: 'Nova Perspectiva, Pausa Sagrada, Sacrifício Voluntário',
    general: 'O Pendurado pede que você pare de lutar contra a correnteza e aceite a pausa. Ao olhar o mundo de cabeça para baixo, você encontrará uma perspectiva iluminada e libertadora.',
    love: 'Indica a necessidade de suspender julgamentos no amor, fazer concessões saudáveis ou aceitar que a relação precisa de tempo para amadurecer.',
    career: 'Período de transição ou aparente estagnação profissional. Use este tempo de espera para revisar seus objetivos e recalibrar suas estratégias de carreira.'
  },
  'xiii_morte': {
    keyword: 'Transformação Profunda, Encerramento de Ciclos, Renascimento',
    general: 'A Morte representa a transição espiritual inevitável: a poda do que já secou para que novos brotos verdes possam emergir. Liberte o passado para permitir o nascimento do futuro.',
    love: 'Fim de padrões desgastados nas relações, rompimentos necessários que liberam a alma ou uma transformação radical na dinâmica da união atual.',
    career: 'Encerramento definitivo de um ciclo profissional (demissão ou saída voluntária) abrindo espaço imediato para uma nova carreira muito mais gratificante.'
  },
  'xiv_temperanca': {
    keyword: 'Alquimia, Paciência, Equilíbrio Emocional, Cura',
    general: 'A Temperança traz as bênçãos da cura e da moderação. Ela convida você a misturar os opostos da sua vida com paciência e suavidade, gerando uma alquimia de paz interior.',
    love: 'Relacionamento calmo, harmonioso e curativo. Comunicação pacífica e resolução suave de antigos atritos emocionais. Amor duradouro.',
    career: 'Fluxo financeiro estável e sem sobressaltos. Ambiente de trabalho pacífico e excelente capacidade de mediação de conflitos entre colegas.'
  },
  'xv_diabo': {
    keyword: 'Apegos, Desejos Ocultos, Ilusão da Prisão, Magnetismo',
    general: 'O Diabo aponta para nossos apegos materiais, vícios emocionais e medos que criam a ilusão de estarmos aprisionados. Encare suas sombras para recuperar sua liberdade.',
    love: 'Paixão obsessiva e magnética de grande voltagem sexual. Cuidado com dependência emocional, ciúmes possessivos ou dinâmicas tóxicas de controle.',
    career: 'Foco intenso na ambição material e no ganho de dinheiro rápido. Alerta para não comprometer sua integridade ética em busca de poder corporativo.'
  },
  'xvi_torre': {
    keyword: 'Libertação Abrupta, Ruína das Ilusões, Reconstrução',
    general: 'A Torre derruba estruturas rígidas baseadas em mentiras ou falsas seguranças. O raio da verdade destrói a ilusão para que você possa reconstruir sobre a rocha sólida.',
    love: 'Revelações repentinas que abalam as bases da relação, rupturas inesperadas mas necessárias que quebram casulos emocionais obsoletos.',
    career: 'Mudanças corporativas drásticas, fechamento de projetos ineficazes ou reestruturação completa de negócios. O início de um novo caminho profissional.'
  },
  'xvii_estrela': {
    keyword: 'Esperança, Inspiração, Cura Espiritual, Renovações',
    general: 'A Estrela é o bálsamo pós-tempestade. Ela traz esperança renovada, cura para feridas da alma e a certeza de que você está sendo guiado e protegido pelas forças cósmicas.',
    love: 'Renovação da fé no amor, cura de mágoas passadas e surgimento de conexões afetivas puras, sinceras e cheias de otimismo e romantismo.',
    career: 'Reconhecimento de talentos, inspiração criativa em alta e novos caminhos profissionais repletos de boas perspectivas de longo prazo.'
  },
  'xviii_lua': {
    keyword: 'Subconsciente, Ilusões, Medos Ocultos, Intuição Aguda',
    general: 'A Lua brilha sobre o terreno das nossas emoções profundas, sonhos e ilusões. Ela avisa que as coisas podem não ser o que parecem; navegue com cautela e confie nos instintos.',
    love: 'Alerta para ciúmes infundados, projeções irreais sobre o parceiro ou segredos ocultos. Confie na intuição, mas evite tomar decisões baseadas em fantasias.',
    career: 'Cuidado com enganos, fofocas nos bastidores do trabalho ou contratos ambíguos. Excelente período para artistas, psicólogos e terapeutas.'
  },
  'xix_sol': {
    keyword: 'Clareza, Vitalidade, Sucesso Absoluto, Alegria',
    general: 'O Sol irradia luz, verdade e vitalidade sobre todos os seus caminhos. É a carta do sucesso absoluto, da clareza mental e da celebração da vida com pureza e alegria.',
    love: 'Amor radiante, feliz e exposto à luz do dia. Casamento, nascimento de filhos e momentos de cumplicidade absoluta e romance fervoroso.',
    career: 'Brilho profissional inigualável. Sucesso em projetos, lucratividade financeira elevada e facilidade para atrair reconhecimento e novos investidores.'
  },
  'xx_julgamento': {
    keyword: 'Despertar Espiritual, Chamado, Redenção, Renascimento',
    general: 'O Julgamento soa a trombeta do despertar. É o momento de deixar o passado na sepultura definitiva e atender ao chamado superior da sua alma para uma vida nova e mais consciente.',
    love: 'Segunda chance para um amor do passado ou um renascimento completo da relação atual através do perdão mútuo e da cura de velhas mágoas.',
    career: 'Descoberta da sua verdadeira vocação profissional. Mudanças importantes que trazem um sentido de missão de vida e propósito ao seu trabalho diário.'
  },
  'xxi_mundo': {
    keyword: 'Integração, Sucesso Completo, Encerramento de Ciclo, Glória',
    general: 'O Mundo coroa sua jornada com o sucesso completo, a realização de seus desejos e o encerramento triunfante de um longo ciclo de aprendizados. Celebre a sua vitória.',
    love: 'Realização amorosa plena, estabilidade afetiva perfeita e a sensação de ter encontrado o seu porto seguro emocional. União feliz e duradoura.',
    career: 'Conclusão vitoriosa de grandes projetos profissionais, reconhecimento internacional ou expansão de negócios para novas fronteiras geográficas.'
  }
};

export default function ArcanaPage() {
  const { data: { tarotCards } } = useData();
  const [selectedCard, setSelectedCard] = useState(null);

  const cardDetails = (cardId) => {
    return ARCANA_DETAILS[cardId] || {
      keyword: 'Sabedoria Arcana',
      general: 'Interpretação mística geral em desenvolvimento por nosso oráculo.',
      love: 'Interpretação amorosa em desenvolvimento.',
      career: 'Interpretação de carreira em desenvolvimento.'
    };
  };

  return (
    <div style={{ minHeight: '100vh', padding: '8rem 2rem 4rem', maxWidth: '1000px', margin: '0 auto' }}>
      <Helmet>
        <title>Significado dos Arcanos Maiores | Magik Tarot</title>
        <meta name="description" content="Explore o significado dos 22 Arcanos Maiores do Tarot. Entenda o conselho geral, amor e trabalho de cada carta para guiar sua jornada." />
      </Helmet>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div style={{ color: 'var(--gold)', letterSpacing: '0.2em', fontSize: '0.8rem', marginBottom: '1rem', textTransform: 'uppercase' }}>
          ✦ Enciclopédia Mística ✦
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1.5rem', color: '#fff' }}>
          Significados dos Arcanos Maiores
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', maxWidth: '700px', margin: '0 auto', lineHeight: '1.7' }}>
          As 22 chaves da sabedoria ancestral. Clique em qualquer arcano para abrir os mistérios do seu significado no Amor, na Carreira e em seu Conselho Espiritual.
        </p>
      </div>

      {/* Grid de Cartas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '2rem',
        marginBottom: '4rem'
      }}>
        {tarotCards.map(card => {
          const isSelected = selectedCard?.id === card.id;
          return (
            <div 
              key={card.id}
              onClick={() => setSelectedCard(isSelected ? null : card)}
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
              <div style={{
                width: '90px',
                height: '150px',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 215, 0, 0.25)',
                background: 'linear-gradient(135deg, rgba(20, 20, 25, 0.95) 0%, rgba(10, 10, 12, 0.95) 100%)',
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.2rem',
                position: 'relative'
              }}>
                <img 
                  src={`${process.env.PUBLIC_URL}/assets/tarot-cards/${card.id}.png`}
                  alt={card.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', margin: 0 }}>
                {card.name}
              </h3>
              <div style={{ color: 'var(--gold-light)', fontSize: '0.75rem', marginTop: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Arcano {card.id.split('_')[0].toUpperCase()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detalhes da Carta Selecionada */}
      {selectedCard && (
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
            onClick={() => setSelectedCard(null)}
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <div style={{
              width: '80px',
              height: '133px',
              borderRadius: '6px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              background: 'linear-gradient(135deg, rgba(20, 20, 25, 0.95) 0%, rgba(10, 10, 12, 0.95) 100%)',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.5)',
              flexShrink: 0
            }}>
              <img 
                src={`${process.env.PUBLIC_URL}/assets/tarot-cards/${selectedCard.id}.png`}
                alt={selectedCard.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#fff', margin: 0 }}>
                {selectedCard.name}
              </h2>
              <div style={{ color: 'var(--gold)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.3rem' }}>
                {cardDetails(selectedCard.id).keyword}
              </div>
            </div>
          </div>

          {/* Abas ou Seções de Significado */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Conselho Geral */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', borderLeft: '3px solid var(--gold)' }}>
              <h4 style={{ color: 'var(--gold-light)', fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                ✦ Conselho do Oráculo (Geral)
              </h4>
              <p style={{ margin: 0, lineHeight: '1.7', opacity: 0.9 }}>
                {cardDetails(selectedCard.id).general}
              </p>
            </div>

            {/* No Amor */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', borderLeft: '3px solid #ff6b6b' }}>
              <h4 style={{ color: '#ff8b8b', fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                ✦ Caminho das Relações (Amor)
              </h4>
              <p style={{ margin: 0, lineHeight: '1.7', opacity: 0.9 }}>
                {cardDetails(selectedCard.id).love}
              </p>
            </div>

            {/* Carreira */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', borderLeft: '3px solid #4ade80' }}>
              <h4 style={{ color: '#86efac', fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                ✦ Caminho da Prosperidade (Carreira e Finanças)
              </h4>
              <p style={{ margin: 0, lineHeight: '1.7', opacity: 0.9 }}>
                {cardDetails(selectedCard.id).career}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
