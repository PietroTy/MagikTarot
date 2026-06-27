import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const GENERAL_FAQS = [
  {
    q: 'Como as consultas são interpretadas?',
    a: 'Nosso portal místico utiliza cálculos astrológicos e rituais digitais personalizados para sintonizar a sabedoria oracular ancestral, baseando-se exatamente nos dados de nascimento e nas cartas que você escolhe.'
  },
  {
    q: 'As previsões do oráculo são absolutas?',
    a: 'Não. Na filosofia do Magik Tarot, o futuro não é um trilho de trem inalterável, mas sim um oceano de tendências fluídas. As leituras revelam as correntes de energia do seu momento presente para que você tome decisões conscientes usando seu livre-arbítrio. Nós oferecemos clareza e reflexão, não determinismo fatalista.'
  },
  {
    q: 'Quanto tempo leva para receber o resultado da minha consulta?',
    a: 'A revelação da consulta é quase instantânea. Assim que o pagamento via PIX é processado pelo Mercado Pago (geralmente em menos de 10 segundos), o oráculo é ativado e a sua leitura completa é renderizada na tela em menos de um minuto.'
  },
  {
    q: 'Meus dados pessoais e perguntas são confidenciais?',
    a: 'Absolutamente. Respeitamos integralmente a LGPD. Seus dados de nascimento, nome e perguntas são trafegados de forma criptografada e armazenados de forma ultra-segura. Além disso, todas as páginas de resultado possuem diretivas "noindex" para que o Google nunca exponha suas consultas.'
  },
  {
    q: 'Posso fazer consultas sobre terceiros?',
    a: 'Sim, principalmente em modalidades como a Sinastria Amorosa ou Tarot do Amor, onde é possível informar o nome e status da outra pessoa. No entanto, lembre-se de que a leitura sempre focará na sua energia e na forma como essa relação ressoa no seu campo de aprendizado.'
  },
  {
    q: 'Como funciona a política de reembolso?',
    a: 'Por se tratar de uma revelação personalizada de produto digital gerado sob demanda, as consultas não podem ser devolvidas após o acesso à leitura. No entanto, se você enfrentar qualquer falha técnica de processamento ou queda de conexão durante o pagamento, entre em contato e resolveremos seu caso imediatamente.'
  }
];

export default function FaqPage() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div style={{ minHeight: '100vh', padding: '8rem 2rem 4rem', maxWidth: '800px', margin: '0 auto' }}>
      <Helmet>
        <title>Dúvidas Frequentes | Magik Tarot</title>
        <meta name="description" content="Tire todas as suas dúvidas sobre o funcionamento do Magik Tarot. Entenda sobre tempos de processamento, privacidade e consultas." />
      </Helmet>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div style={{ color: 'var(--gold)', letterSpacing: '0.2em', fontSize: '0.8rem', marginBottom: '1rem', textTransform: 'uppercase' }}>
          ✦ Central de Ajuda ✦
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1.5rem', color: '#fff' }}>
          Dúvidas Frequentes (FAQ)
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.7' }}>
          Tem alguma dúvida sobre como funciona a revelação das cartas ou sobre seu pagamento? Encontre respostas rápidas aqui.
        </p>
      </div>

      {/* FAQ Accordions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '4rem' }}>
        {GENERAL_FAQS.map((faq, idx) => {
          const isOpen = activeIndex === idx;
          return (
            <div 
              key={idx} 
              style={{
                background: 'rgba(20, 20, 25, 0.85)',
                border: isOpen ? '1px solid var(--gold)' : '1px solid rgba(255, 215, 0, 0.12)',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: isOpen ? '0 5px 20px rgba(255, 215, 0, 0.05)' : '0 4px 12px rgba(0,0,0,0.15)',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
              }}
            >
              <button
                onClick={() => toggleAccordion(idx)}
                style={{
                  width: '100%',
                  padding: '1.5rem',
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontSize: '1.05rem',
                  fontWeight: '600',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem'
                }}
              >
                <span>{faq.q}</span>
                <span style={{ 
                  color: 'var(--gold)', 
                  fontSize: '0.8rem',
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease'
                }}>
                  ▼
                </span>
              </button>
              {isOpen && (
                <div style={{
                  padding: '0 1.5rem 1.5rem',
                  color: 'rgba(255,255,255,0.75)',
                  fontSize: '0.95rem',
                  lineHeight: '1.7',
                  borderTop: '1px solid rgba(255,255,255,0.05)',
                  paddingTop: '1.2rem'
                }}>
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Support Callout */}
      <div style={{
        background: 'rgba(20, 20, 25, 0.65)',
        border: '1px solid rgba(255, 215, 0, 0.15)',
        borderRadius: '16px',
        padding: '2.5rem',
        textAlign: 'center',
        backdropFilter: 'blur(8px)'
      }}>
        <h3 style={{ color: 'var(--gold)', fontSize: '1.25rem', marginBottom: '0.8rem', fontWeight: '700' }}>
          Não encontrou sua resposta?
        </h3>
        <p style={{ fontSize: '0.95rem', opacity: 0.8, maxWidth: '500px', margin: '0 auto 2rem', lineHeight: '1.6' }}>
          Nossa equipe de suporte místico e técnico está pronta para ajudar você com qualquer problema em sua jornada.
        </p>
        <Link to="/sobre" className="btn-primary" style={{ textDecoration: 'none', padding: '0.9rem 2.5rem', fontSize: '0.9rem' }}>
          Fale Conosco / Sobre Nós ✦
        </Link>
      </div>
    </div>
  );
}
