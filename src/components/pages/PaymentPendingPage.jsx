import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { API_CONFIG } from '../../config/apiConfig';

const BASE = API_CONFIG.BACKEND_URL;

export default function PaymentPendingPage() {
  const navigate = useNavigate();

  // Helper para obter parâmetros da URL de forma robusta com HashRouter
  const getQueryParam = (name) => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has(name)) return searchParams.get(name);
    
    const hash = window.location.hash;
    const hashSearchIndex = hash.indexOf('?');
    if (hashSearchIndex !== -1) {
      const hashSearchParams = new URLSearchParams(hash.slice(hashSearchIndex));
      if (hashSearchParams.has(name)) return hashSearchParams.get(name);
    }
    return null;
  };

  const orderId = getQueryParam('external_reference');

  useEffect(() => {
    if (!orderId) return;

    let intervalId;

    const checkStatus = async () => {
      try {
        const res = await fetch(`${BASE}/payment/${orderId}/status`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'approved') {
            clearInterval(intervalId);
            // Tenta obter o estado do pedido salvo no localStorage para ir para o ritual ou resultado direto
            const saved = localStorage.getItem(`pending_order_${orderId}`);
            if (saved) {
              try {
                const { service } = JSON.parse(saved);
                if (service && service.id) {
                  navigate(`/ritual/${service.id}?orderId=${orderId}&approved=true`);
                  return;
                }
              } catch (e) {
                console.error('Erro ao ler order do localStorage:', e);
              }
            }
            navigate(`/resultado/${orderId}`);
          }
        }
      } catch (err) {
        console.error('Erro ao verificar status do pagamento:', err);
      }
    };

    checkStatus();
    intervalId = setInterval(checkStatus, 3000);

    return () => clearInterval(intervalId);
  }, [orderId, navigate]);

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

        <div className="ai-loading" style={{ margin: '0 auto 2rem' }}>
          <div className="ai-orb" style={{ margin: '0 auto', width: '60px', height: '60px' }} />
        </div>

        <h1 style={{ 
          fontSize: '1.6rem', 
          fontWeight: 700, 
          marginBottom: '1rem',
          letterSpacing: '0.1em',
          color: '#fff',
          textTransform: 'uppercase'
        }}>
          Processando Transação
        </h1>

        <div style={{ 
          color: 'var(--gold-light)', 
          fontSize: '0.8rem', 
          letterSpacing: '0.15em', 
          marginBottom: '2rem',
          fontWeight: '600'
        }}>
          AGUARDANDO CONFIRMAÇÃO DO PIX
        </div>

        <p style={{ 
          lineHeight: '1.7', 
          marginBottom: '1.5rem', 
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '1.05rem'
        }}>
          Estamos conectados ao Mercado Pago aguardando a confirmação do seu pagamento. 
          O PIX costuma ser aprovado em poucos segundos.
        </p>

        <p style={{ 
          fontSize: '0.9rem', 
          color: 'var(--gold)', 
          marginBottom: '2.5rem',
          lineHeight: '1.6',
          fontWeight: '500'
        }}>
          Por favor, <strong>mantenha esta tela aberta</strong>. Assim que o pagamento for detectado, iniciaremos a sua leitura automaticamente.
        </p>

        {orderId ? (
          <div style={{ 
            marginTop: '2rem', 
            fontSize: '0.8rem', 
            color: 'rgba(255,255,255,0.4)',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '1.2rem',
            width: '100%'
          }}>
            Identificador do Pedido: <code style={{ color: '#fff', fontSize: '0.8rem' }}>{orderId}</code>
            <br />
            <span style={{ display: 'inline-block', marginTop: '1rem' }}>
              Se você já realizou o PIX e o redirecionamento demorar mais de 1 minuto, <br />
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
                Clique aqui para verificar manualmente 🔮
              </Link>
            </span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', alignItems: 'center' }}>
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
          </div>
        )}
      </div>
    </div>
  );
}
