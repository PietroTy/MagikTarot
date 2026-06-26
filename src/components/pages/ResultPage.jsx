import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

export default function ResultPage() {
  const { orderId } = useParams();
  const [reading, setReading] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchReading() {
      try {
        const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3003';
        // We actually need to fetch all readings and find the one with this orderId, 
        // or create an endpoint /readings/order/:orderId
        const res = await fetch(`${baseUrl}/readings`);
        if (!res.ok) throw new Error('Falha ao buscar leitura');
        const data = await res.json();
        const found = data.find(r => r.orderId === orderId);
        
        if (found) {
          setReading(found);
        } else {
          setError('Leitura não encontrada para este pedido.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchReading();
  }, [orderId]);

  function formatReading(text) {
    if (!text) return null;
    return text.split('\n').filter(p => p.trim()).map((para, pi) => {
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

  if (loading) {
    return (
      <div className="container" style={{ padding: '8rem 2rem', textAlign: 'center' }}>
        <h2>Consultando os Registros...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '8rem 2rem', textAlign: 'center' }}>
        <h2>Erro</h2>
        <p>{error}</p>
        <Link to="/" className="btn-primary">Voltar ao Início</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '8rem 2rem' }}>
      <Helmet>
        <title>Sua Leitura | Magik Tarot</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="revelation-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div className="revelation-eyebrow">✦ O Véu foi levantado</div>
        <h1 className="revelation-title">Sua Revelação</h1>
        <p className="revelation-subtitle">
          As forças arquetípicas se manifestaram para você.
        </p>
      </div>

      <div className="revelation-reading-wrap" style={{ maxWidth: '800px', margin: '0 auto', background: 'rgba(20, 20, 25, 0.8)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255, 215, 0, 0.1)' }}>
        <div className="revelation-reading">
          {formatReading(reading.answer)}
          <div className="result-name" style={{ marginTop: '2rem', opacity: 0.6 }}>
            — Oráculo gerado em {new Date(reading.createdAt).toLocaleDateString('pt-BR')}
          </div>
        </div>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <Link to="/" className="btn-primary">Guardar e Voltar</Link>
      </div>
    </div>
  );
}
