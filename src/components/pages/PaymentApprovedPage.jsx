import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

export default function PaymentApprovedPage() {
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
    if (orderId) {
      let purchaseValue = 1.0;
      let serviceId = null;

      // Tenta obter o estado do pedido salvo no localStorage para pegar o valor real
      const saved = localStorage.getItem(`pending_order_${orderId}`);
      if (saved) {
        try {
          const { service } = JSON.parse(saved);
          if (service) {
            if (service.price) purchaseValue = Number(service.price);
            if (service.id) serviceId = service.id;
          }
        } catch (e) {
          console.error('Erro ao ler order do localStorage:', e);
        }
      }

      // Envia evento de conversão do Google Ads
      const key = `gtag_conv_${orderId}`;
      const isDebug = window.location.href.includes('gtm_debug');
      if (!localStorage.getItem(key) || isDebug) {
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'conversion', {
            'send_to': 'AW-18279016188/wrl4CPvf7sYcEPzNjoxE',
            'value': purchaseValue,
            'currency': 'BRL',
            'transaction_id': orderId
          });
          localStorage.setItem(key, 'true');
          console.log(`[Gtag] Conversão enviada: R$ ${purchaseValue} para o pedido ${orderId}`);
        } else {
          console.warn('[Gtag] gtag.js não carregado no escopo global');
        }
      }

      if (serviceId) {
        // Redireciona de volta para o ritual para escolher cartas / iniciar leitura em 1.5s
        const timer = setTimeout(() => {
          navigate(`/ritual/${serviceId}?orderId=${orderId}&approved=true`);
        }, 1500);
        return () => clearTimeout(timer);
      }

      // Caso não tenha localStorage correspondente, redireciona direto para o resultado
      const timer = setTimeout(() => {
        navigate(`/resultado/${orderId}`);
      }, 2000);
      return () => clearTimeout(timer);
    }
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
        <title>Sintonizando o Portal | Magik Tarot</title>
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

        <div className="ai-loading" style={{ margin: '0 auto 1.5rem' }}>
          <div className="ai-orb" style={{ margin: '0 auto 1.5rem', width: '60px', height: '60px' }} />
        </div>

        <h1 style={{ 
          fontSize: '1.6rem', 
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
          Seu pagamento foi verificado com sucesso! Os canais cósmicos estão prontos.
        </p>

        <p style={{ 
          fontSize: '0.9rem', 
          color: 'var(--gold)', 
          marginBottom: '2.5rem',
          lineHeight: '1.5',
          fontWeight: '500'
        }}>
          Você está sendo redirecionado(a) automaticamente para dar início ao seu ritual e ver sua revelação...
        </p>

        {orderId && (
          <div style={{ 
            marginTop: '1rem', 
            fontSize: '0.8rem', 
            color: 'rgba(255,255,255,0.4)',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '1.2rem',
            width: '100%'
          }}>
            O redirecionamento falhou? <br />
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
              Clique aqui para acessar sua revelação manualmente 🔮
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
