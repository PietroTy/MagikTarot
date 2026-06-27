import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

export default function PaymentPendingPage() {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get('external_reference');

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      maxWidth: '600px',
      margin: '0 auto',
      textAlign: 'center'
    }}>
      <Helmet>
        <title>Pagamento Pendente | Magik Tarot</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div style={{
        background: 'rgba(20, 20, 25, 0.85)',
        border: '1px solid rgba(255, 215, 0, 0.15)',
        borderRadius: '24px',
        padding: '3.5rem 2.5rem',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(12px)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(255,215,0,0.05) 0%, transparent 60%)',
          pointerEvents: 'none'
        }} />

        <div style={{ color: 'var(--gold)', fontSize: '2.5rem', marginBottom: '1.5rem' }}>
          ⌛
        </div>

        <h1 style={{ 
          fontSize: '1.8rem', 
          fontWeight: 700, 
          marginBottom: '1rem',
          letterSpacing: '0.1em',
          color: '#fff',
          textTransform: 'uppercase'
        }}>
          Processando Sintonização
        </h1>

        <div style={{ 
          color: 'var(--gold-light)', 
          fontSize: '0.8rem', 
          letterSpacing: '0.15em', 
          marginBottom: '2rem',
          fontWeight: '600'
        }}>
          AGUARDANDO CONFIRMAÇÃO
        </div>

        <p style={{ 
          lineHeight: '1.7', 
          marginBottom: '2rem', 
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '1.05rem'
        }}>
          O Mercado Pago está processando a transação. O PIX costuma ser aprovado em poucos segundos, mas outros métodos podem demorar um pouco mais.
        </p>

        <p style={{ 
          fontSize: '0.85rem', 
          color: 'rgba(255, 255, 255, 0.5)', 
          marginBottom: '2.5rem',
          lineHeight: '1.5'
        }}>
          Assim que for confirmado, sua leitura será gerada automaticamente. Você pode acompanhar pelo botão abaixo ou verificar seu e-mail cadastrado.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', alignItems: 'center' }}>
          {orderId ? (
            <Link 
              to={`/resultado/${orderId}`} 
              className="btn-primary" 
              style={{ 
                display: 'inline-block', 
                padding: '1rem 2.5rem',
                fontSize: '0.95rem',
                width: '100%',
                maxWidth: '280px',
                textDecoration: 'none'
              }}
            >
              Verificar Leitura ✦
            </Link>
          ) : (
            <Link 
              to="/consultas" 
              className="btn-primary" 
              style={{ 
                display: 'inline-block', 
                padding: '1rem 2.5rem',
                fontSize: '0.95rem',
                width: '100%',
                maxWidth: '280px',
                textDecoration: 'none'
              }}
            >
              Voltar ao Início ✦
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
