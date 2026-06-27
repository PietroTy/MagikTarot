import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useData } from '../../context/DataContext';

// Mapeamento de apelidos de URL para IDs reais do catálogo
const ALIAS_MAP = {
  'tarot-do-amor': 'tarot-do-amor',
  'tarot-carreira-dinheiro': 'tarot-carreira',
  'tarot-carreira': 'tarot-carreira',
  'mapa-astral-ia': 'mapa-astral',
  'mapa-astral': 'mapa-astral',
  'sinastria-amorosa': 'sinastria',
  'sinastria': 'sinastria',
  'tarot-sim-ou-nao': 'tarot-sim-ou-nao',
  'energia-do-mes': 'energia-do-mes'
};

// Dados ricos adicionais para enriquecer a página de vendas de cada serviço
const RICH_PRODUCT_DATA = {
  'tarot-sim-ou-nao': {
    whoIsItFor: [
      'Pessoas com dúvidas diretas que exigem resposta imediata.',
      'Quem quer uma tomada de decisão rápida e prática.',
      'Buscadores que desejam um conselho oracular objetivo sobre um tema específico.'
    ],
    whatItDelivers: [
      'Direcionamento objetivo: Resposta clara de SIM, NÃO ou TALVEZ.',
      'Interpretação da carta: Análise simbólica da carta de tarot sorteada associada à sua pergunta.',
      'Conselho rápido: Uma frase de sabedoria prática para agir após a resposta.',
      'Integração oracular: Uma leitura profunda conectando a carta ao seu momento.'
    ],
    faqs: [
      { q: 'O Tarot Sim ou Não pode falhar?', a: 'O tarot reflete tendências energéticas do momento presente. Ele funciona como uma bússola de tendências, não como um destino inalterável.' },
      { q: 'Que tipo de pergunta posso fazer?', a: 'Perguntas claras e objetivas funcionam melhor. Exemplo: "Devo aceitar a proposta de parceria de trabalho esta semana?" ou "É um bom momento para iniciar meu projeto?"' }
    ]
  },
  'tarot-do-amor': {
    whoIsItFor: [
      'Solteiros buscando entender o que está bloqueando a chegada de um novo amor.',
      'Casais que desejam clareza sobre desafios latentes ou melhoria da conexão afetiva.',
      'Quem está passando por términos, triângulos amorosos ou momentos de reconexão.'
    ],
    whatItDelivers: [
      'Energia da Relação: Análise da vibração afetiva atual que envolve você e a pessoa de interesse.',
      'Pontos Fortes: O que nutre, harmoniza e fortalece o elo entre vocês.',
      'Pontos de Atenção/Bloqueios: Medos ocultos, interferências externas ou padrões cármicos a serem superados.',
      'Conselho Prático do Oráculo: Orientações claras e responsáveis para você tomar a melhor atitude afetiva.'
    ],
    faqs: [
      { q: 'Posso fazer a consulta se estiver solteiro(a)?', a: 'Com certeza! A leitura se adaptará perfeitamente ao seu status de solteiro, mapeando suas tendências e o que atrai ou repele conexões amorosas no momento.' },
      { q: 'É preciso saber os dados da outra pessoa?', a: 'Você pode informar o nome e o status da relação para personalizar ao máximo, mas a leitura foca primariamente na sua energia e na forma como você se conecta.' }
    ]
  },
  'tarot-carreira': {
    whoIsItFor: [
      'Profissionais em momento de transição de carreira ou descontentamento.',
      'Empreendedores buscando direcionamento estratégico para seus negócios.',
      'Quem deseja identificar novos caminhos de prosperidade e abundância financeira.'
    ],
    whatItDelivers: [
      'Momento Profissional: Leitura da sua energia de trabalho atual e posicionamento corporativo.',
      'Desafios e Bloqueios: Fatores que estão limitando o seu crescimento financeiro ou reconhecimento.',
      'Oportunidades de Ouro: Portas que podem se abrir ou talentos subutilizados a serem explorados.',
      'Conselho de Abundância: Direcionamento prático sobre atitudes financeiras e escolhas de carreira.'
    ],
    faqs: [
      { q: 'A leitura vai me dizer se serei promovido?', a: 'Ela revelará as tendências para o seu momento e os bloqueios ou facilidades que você enfrentará. O tarot orienta suas ações para que você se alinhe com a energia da promoção e do sucesso.' },
      { q: 'Serve para quem está desempregado?', a: 'Sim! Ela ajuda a mapear quais áreas estão mais favoráveis para busca, atitudes internas que aceleram a recolocação e conselhos práticos.' }
    ]
  },
  'energia-do-mes': {
    whoIsItFor: [
      'Quem gosta de planejamento energético e espiritual mensal.',
      'Pessoas com aniversários próximos buscando entender o ciclo que se inicia no mês.',
      'Qualquer buscador que deseja sintonizar suas ações diárias com as marés cósmicas.'
    ],
    whatItDelivers: [
      'Visão Geral do Mês: A tônica energética que regerá os próximos 30 dias.',
      'Ciclos de Fluidez: Em quais áreas você terá mais facilidade, criatividade e sorte.',
      'Obstáculos do Caminho: Quais dias ou situações demandarão mais paciência, introspecção ou resiliência.',
      'Roteiro de Conselhos: Ações práticas recomendadas para aproveitar ao máximo a energia do mês.'
    ],
    faqs: [
      { q: 'Devo fazer a leitura apenas no dia 1º de cada mês?', a: 'Não necessariamente. Você pode fazer a leitura em qualquer dia. O oráculo interpretará as energias para as próximas quatro semanas a partir da data de realização da sua consulta.' },
      { q: 'Posso escolher um mês específico?', a: 'Sim! No formulário da consulta você informa o mês de interesse para o qual deseja as previsões cósmicas.' }
    ]
  },
  'mapa-astral': {
    whoIsItFor: [
      'Qualquer pessoa no caminho do autoconhecimento profundo.',
      'Quem quer entender suas reações emocionais (Lua) e propósito de vida (Sol e Ascendente).',
      'Pessoas curiosas sobre astrologia que querem uma análise integradora de sua identidade.'
    ],
    whatItDelivers: [
      'Essência Vital (Sol): Seu propósito profundo, vitalidade e a expressão central da sua personalidade.',
      'Nutrição Emocional (Lua): Como você reage emocionalmente, seus sentimentos profundos e mecanismos de segurança.',
      'Máscara Social (Ascendente): A forma como você se apresenta ao mundo, seu corpo físico e primeiras impressões.',
      'Casas Astrológicas Principais: Uma varredura de como os planetas influenciam sua carreira, amor e comunicação.'
    ],
    faqs: [
      { q: 'E se eu não souber a hora exata do meu nascimento?', a: 'A hora exata é muito importante para o cálculo preciso do Ascendente e das Casas Astrológicas. Se não souber, tente colocar uma hora aproximada ou consulte sua certidão de nascimento de inteiro teor.' },
      { q: 'Como o portal faz o cálculo do mapa?', a: 'Nosso algoritmo calcula as posições astronômicas exatas dos planetas com base nos dados de nascimento fornecidos e o oráculo interpreta esse padrão de forma rica e poética.' }
    ]
  },
  'sinastria': {
    whoIsItFor: [
      'Casais em qualquer estágio que queiram aprofundar sua cumplicidade.',
      'Sócios ou amigos próximos que queiram compreender a dinâmica da sua parceria.',
      'Quem deseja desvendar afinidades cósmicas profundas e aprender a lidar com conflitos recorrentes.'
    ],
    whatItDelivers: [
      'Química Espiritual: O nível de compatibilidade profunda e atração entre as duas almas.',
      'Comunicação e Intelecto: Como as mentes de vocês interagem, onde há entendimento e onde há ruído.',
      'Desafios de Convivência: Atritos astrológicos típicos e o que costuma engatilhar desentendimentos.',
      'Caminho de Evolução: O propósito espiritual por trás do encontro de vocês e conselhos para fortalecer o vínculo.'
    ],
    faqs: [
      { q: 'A Sinastria serve para relações que não são amorosas?', a: 'Sim! Embora o foco comercial seja amoroso, você pode informar o tipo de vínculo (ex: sociedade, amizade, família) e a interpretação se ajustará perfeitamente.' },
      { q: 'O resultado pode dizer se devemos terminar?', a: 'Nunca. O oráculo mostra compatibilidades, pontos de atrito e aprendizados. A decisão de manter ou não um relacionamento cabe unicamente ao livre-arbítrio dos envolvidos.' }
    ]
  }
};

export default function ProductPage() {
  const { serviceId } = useParams();
  const { data: { services } } = useData();
  const [activeFaq, setActiveFaq] = useState(null);

  // Resolve o ID real a partir do apelido (alias)
  const resolvedId = ALIAS_MAP[serviceId] || serviceId;
  const service = services.find(s => s.id === resolvedId);
  const richData = RICH_PRODUCT_DATA[resolvedId];

  if (!service) {
    return (
      <div style={{ minHeight: '100vh', padding: '10rem 2rem', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--gold)', marginBottom: '1.5rem' }}>Portal Não Encontrado</h2>
        <p style={{ opacity: 0.8, marginBottom: '2rem' }}>O portal oracular que você tentou acessar não existe ou mudou de plano.</p>
        <Link to="/consultas" className="btn-primary" style={{ textDecoration: 'none', padding: '1rem 2rem' }}>
          Ver Consultas Disponíveis
        </Link>
      </div>
    );
  }

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div style={{ minHeight: '100vh', padding: '8rem 2rem 4rem', maxWidth: '1000px', margin: '0 auto' }}>
      <Helmet>
        <title>{`${service.name} Online | Magik Tarot`}</title>
        <meta name="description" content={`Consulte o ${service.name} online. ${service.hook} Leitura personalizada, confidencial e profunda.`} />
      </Helmet>

      {/* breadcrumbs */}
      <div style={{ fontSize: '0.8rem', opacity: 0.5, marginBottom: '2rem' }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Início</Link> &gt;{' '}
        <Link to={`/consultas/${service.type}`} style={{ color: '#fff', textDecoration: 'none', textTransform: 'capitalize' }}>{service.type}</Link> &gt;{' '}
        <span style={{ color: 'var(--gold)' }}>{service.name}</span>
      </div>

      {/* Top Hero Product */}
      <div style={{
        background: 'rgba(20, 20, 25, 0.85)',
        border: '1px solid rgba(255, 215, 0, 0.15)',
        borderRadius: '24px',
        padding: '3.5rem 2.5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '3rem',
        alignItems: 'center',
        boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
        backdropFilter: 'blur(10px)',
        marginBottom: '4rem'
      }}>
        {/* Lado Esquerdo - Info de Venda */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '20px',
              border: '1px solid rgba(255, 215, 0, 0.25)',
              overflow: 'hidden',
              background: 'rgba(5, 5, 8, 0.6)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.08)',
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
              <div style={{ color: 'var(--gold-light)', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                {service.arcane}
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#fff', margin: '0.2rem 0 0' }}>
                {service.name}
              </h1>
            </div>
          </div>

          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)', lineHeight: '1.7', marginBottom: '2rem' }}>
            {service.desc}
          </p>

          <div style={{ 
            background: 'rgba(255,255,255,0.03)', 
            borderLeft: '3px solid var(--gold)', 
            padding: '1.2rem', 
            borderRadius: '0 8px 8px 0',
            marginBottom: '2.5rem'
          }}>
            <div style={{ fontSize: '0.8rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>
              Promessa do Oráculo
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: '500', color: 'var(--gold-light)' }}>
              Leitura interpretativa profunda em minutos, sintonizada especificamente para você.
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>Valor da consulta:</div>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--gold)' }}>{service.price}</div>
            </div>
            <Link 
              to={`/ritual/${service.id}`} 
              className="btn-primary" 
              style={{ 
                padding: '1.1rem 3rem', 
                fontSize: '1rem', 
                fontWeight: '700', 
                textDecoration: 'none',
                textAlign: 'center',
                boxShadow: '0 0 20px rgba(255,215,0,0.2)'
              }}
            >
              Iniciar Minha Leitura ✦
            </Link>
          </div>
        </div>

        {/* Lado Direito - Ilustração Mística ou Visual Mockup */}
        <div style={{
          background: 'radial-gradient(circle, rgba(255,215,0,0.05) 0%, transparent 70%)',
          border: '1px solid rgba(255,215,0,0.08)',
          borderRadius: '16px',
          padding: '2.5rem',
          textAlign: 'center',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '280px'
        }}>
          <div style={{ position: 'absolute', top: '10px', right: '15px', color: 'var(--gold)', fontSize: '1.2rem' }}>✦</div>
          <div style={{ position: 'absolute', bottom: '15px', left: '15px', color: 'var(--gold)', fontSize: '0.8rem' }}>✦</div>
          
          <div className="ai-orb" style={{ width: '80px', height: '80px', marginBottom: '1.5rem' }} />
          
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.8rem', letterSpacing: '0.05em' }}>
            Ritual 100% Digital e Seguro
          </h3>
          <p style={{ fontSize: '0.85rem', opacity: 0.7, lineHeight: '1.6', maxWidth: '260px', margin: '0 auto' }}>
            Preencha seus dados, faça a tiragem das cartas se for tarot, pague com PIX e receba sua revelação imediata em uma página privada e segura protegida contra o Google.
          </p>
        </div>
      </div>

      {/* Rich Details Section */}
      {richData && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
          {/* Para quem é */}
          <div style={{
            background: 'rgba(20, 20, 25, 0.65)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '16px',
            padding: '2.2rem',
            backdropFilter: 'blur(5px)'
          }}>
            <h3 style={{ color: 'var(--gold)', fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span>✦</span> Para quem é indicado?
            </h3>
            <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
              {richData.whoIsItFor.map((item, idx) => (
                <li key={idx} style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '1rem', lineHeight: '1.6', fontSize: '0.95rem' }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* O que entrega */}
          <div style={{
            background: 'rgba(20, 20, 25, 0.65)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '16px',
            padding: '2.2rem',
            backdropFilter: 'blur(5px)'
          }}>
            <h3 style={{ color: 'var(--gold)', fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span>✦</span> O que a leitura entrega?
            </h3>
            <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
              {richData.whatItDelivers.map((item, idx) => (
                <li key={idx} style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '1rem', lineHeight: '1.6', fontSize: '0.95rem' }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Como funciona */}
      <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '2.5rem', letterSpacing: '0.05em' }}>
          Como funciona o ritual de consulta?
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '2rem'
        }}>
          {[
            { step: '01', title: 'Preencha os Dados', desc: 'Informe seu nome, e-mail e intenção para sintonizar a consulta.' },
            { step: '02', title: 'Faça a Tiragem', desc: 'Misture as cartas digitais e escolha as que chamam a sua alma (apenas no Tarot).' },
            { step: '03', title: 'Pagamento Seguro', desc: 'Realize o pagamento por PIX através do Mercado Pago.' },
            { step: '04', title: 'Receba a Revelação', desc: 'O oráculo revela sua leitura detalhada e poética imediatamente na tela.' }
          ].map((item, idx) => (
            <div key={idx} style={{
              padding: '1.5rem',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <div style={{ color: 'var(--gold)', fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.8rem' }}>{item.step}</div>
              <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '0.5rem', fontWeight: '600' }}>{item.title}</h4>
              <p style={{ fontSize: '0.8rem', opacity: 0.6, lineHeight: '1.5', margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ do Produto */}
      {richData && richData.faqs.length > 0 && (
        <div style={{ marginBottom: '5rem' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#fff', textAlign: 'center', marginBottom: '2.5rem', letterSpacing: '0.05em' }}>
            Dúvidas Frequentes sobre esta Consulta
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '800px', margin: '0 auto' }}>
            {richData.faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div 
                  key={idx} 
                  style={{
                    background: 'rgba(20, 20, 25, 0.75)',
                    border: '1px solid rgba(255, 215, 0, 0.12)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    style={{
                      width: '100%',
                      padding: '1.2rem 1.5rem',
                      background: 'transparent',
                      border: 'none',
                      color: '#fff',
                      fontSize: '1rem',
                      fontWeight: '600',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span>{faq.q}</span>
                    <span style={{ color: 'var(--gold)' }}>{isOpen ? '▲' : '▼'}</span>
                  </button>
                  {isOpen && (
                    <div style={{
                      padding: '0 1.5rem 1.5rem',
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '0.9rem',
                      lineHeight: '1.6',
                      borderTop: '1px solid rgba(255,255,255,0.05)',
                      paddingTop: '1rem'
                    }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Disclaimer Responsável */}
      <div style={{
        background: 'rgba(255, 100, 100, 0.03)',
        border: '1px solid rgba(255, 100, 100, 0.1)',
        borderRadius: '12px',
        padding: '1.5rem 2rem',
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '0.8rem',
        lineHeight: '1.6',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <strong>Aviso de Responsabilidade Espiritual:</strong> As consultas e previsões disponibilizadas no Magik Tarot são leituras interpretativas e simbólicas voltadas ao autoconhecimento, entretenimento e reflexão filosófica. Elas não constituem aconselhamento médico, psicológico, psiquiátrico, jurídico ou financeiro. Se você está passando por desafios de ordem de saúde ou legal, busque sempre ajuda de profissionais habilitados nas respectivas áreas.
      </div>
    </div>
  );
}
