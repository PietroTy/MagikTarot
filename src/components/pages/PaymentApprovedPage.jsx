import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function PaymentApprovedPage() {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get('external_reference');

  useEffect(() => {
    // Tenta fechar a aba automaticamente após 4 segundos
    const timer = setTimeout(() => {
      window.close();
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    window.close();
  };

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
        {/* Efeito de brilho de fundo */}
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
          ✦
        </div>

        <h1 style={{ 
          fontSize: '1.8rem', 
          fontWeight: 700, 
          marginBottom: '1rem',
          letterSpacing: '0.1em',
          color: '#fff',
          textTransform: 'uppercase'
        }}>
          Ritual Confirmado
        </h1>

        <div style={{ 
          color: 'var(--gold-light)', 
          fontSize: '0.9rem', 
          letterSpacing: '0.15em', 
          marginBottom: '2rem' 
        }}>
          CONEXÃO ESTABELECIDA
        </div>

        <p style={{ 
          lineHeight: '1.7', 
          marginBottom: '2rem', 
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '1.05rem'
        }}>
          Seu pagamento foi aprovado com sucesso e o portal de leitura já está ativo na sua **aba anterior**!
        </p>

        <p style={{ 
          fontSize: '0.85rem', 
          color: 'rgba(255, 255, 255, 0.5)', 
          marginBottom: '2.5rem',
          lineHeight: '1.5'
        }}>
          Volte para a outra aba para escolher suas cartas e ver sua revelação.<br />
          Esta aba se fechará automaticamente em instantes...
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', alignItems: 'center' }}>
          <button 
            onClick={handleClose} 
            className="btn-primary" 
            style={{ 
              display: 'inline-block', 
              padding: '1rem 2.5rem',
              fontSize: '0.95rem',
              cursor: 'pointer',
              border: 'none',
              width: '100%',
              maxWidth: '280px'
            }}
          >
            Fechar esta aba ✦
          </button>

          {orderId && (
            <div style={{ 
              marginTop: '1rem', 
              fontSize: '0.8rem', 
              color: 'rgba(255,255,255,0.4)',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              paddingTop: '1.2rem',
              width: '100%'
            }}>
              Fechou a aba do oráculo por acidente? <br />
              <Link 
                to={`/resultado/${orderId}`} 
                style={{ 
                  color: 'var(--gold)', 
                  textDecoration: 'none', 
                  fontWeight: '600',
                  display: 'inline-block',
                  marginTop: '0.4rem'
                }}
              >
                Clique aqui para abrir seu resultado nesta aba 🔮
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
