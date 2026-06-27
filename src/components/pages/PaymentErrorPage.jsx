import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

export default function PaymentErrorPage() {
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
        <title>Falha no Pagamento | Magik Tarot</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div style={{
        background: 'rgba(20, 20, 25, 0.85)',
        border: '1px solid rgba(220, 53, 69, 0.3)',
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
          background: 'radial-gradient(circle, rgba(220,53,69,0.05) 0%, transparent 60%)',
          pointerEvents: 'none'
        }} />

        <div style={{ color: '#dc3545', fontSize: '2.5rem', marginBottom: '1.5rem' }}>
          ⚠️
        </div>

        <h1 style={{ 
          fontSize: '1.8rem', 
          fontWeight: 700, 
          marginBottom: '1rem',
          letterSpacing: '0.1em',
          color: '#fff',
          textTransform: 'uppercase'
        }}>
          Sintonização Interrompida
        </h1>

        <div style={{ 
          color: '#dc3545', 
          fontSize: '0.8rem', 
          letterSpacing: '0.15em', 
          marginBottom: '2rem',
          fontWeight: '600'
        }}>
          PAGAMENTO NÃO CONCLUÍDO
        </div>

        <p style={{ 
          lineHeight: '1.7', 
          marginBottom: '2rem', 
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '1.05rem'
        }}>
          Não conseguimos confirmar a transação do seu ritual. Pode ter ocorrido uma oscilação na conexão com o banco ou o pagamento foi cancelado.
        </p>

        <p style={{ 
          fontSize: '0.85rem', 
          color: 'rgba(255, 255, 255, 0.5)', 
          marginBottom: '2.5rem',
          lineHeight: '1.5'
        }}>
          Nenhum valor foi cobrado da sua conta. Você pode tentar realizar o ritual novamente escolhendo outra consulta ou método.
        </p>

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
            Tentar Novamente ✦
          </Link>
        </div>
      </div>
    </div>
  );
}
