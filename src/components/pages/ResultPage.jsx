import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { API_CONFIG } from '../../config/apiConfig';

const BASE = API_CONFIG.BACKEND_URL;

export default function ResultPage() {
  const { orderId } = useParams();
  const [answer,  setAnswer]  = useState('');
  const [cards,   setCards]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    if (!orderId) { setError('ID do pedido não encontrado.'); setLoading(false); return; }
    fetchOrGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  async function fetchOrGenerate() {
    setLoading(true);
    setError('');
    try {
      // 1. Verifica se já existe uma leitura
      const listRes = await fetch(`${BASE}/readings`);
      const list = await listRes.json();
      const found = list.find(r => r.orderId === orderId);
      if (found) {
        setAnswer(found.answer);
        setCards(found.cards || []);
        setLoading(false);
        return;
      }

      // 2. Não encontrou → gera automaticamente
      const genRes = await fetch(`${BASE}/readings/auto-generate/${orderId}`, { method: 'POST' });
      if (!genRes.ok) {
        const err = await genRes.json();
        throw new Error(err.error || `Erro ${genRes.status}`);
      }
      const data = await genRes.json();
      setAnswer(data.answer);
      setCards(data.cards || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function formatReading(text) {
    if (!text) return null;
    return text.split('\n').filter(p => p.trim()).map((para, pi) => {
      const parts = para.split(/\*\*(.*?)\*\*/g);
      return (
        <p key={pi} style={{ marginBottom: '1.4rem', lineHeight: '1.9' }}>
          {parts.map((part, i) =>
            i % 2 === 1
              ? <strong key={i} style={{ color: 'var(--gold-light)' }}>{part}</strong>
              : part
          )}
        </p>
      );
    });
  }

  return (
    <div style={{ minHeight: '100vh', padding: '8rem 2rem 4rem', maxWidth: '860px', margin: '0 auto' }}>
      <Helmet>
        <title>Sua Leitura | Magik Tarot</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ color: 'var(--gold)', letterSpacing: '0.2em', fontSize: '0.8rem', marginBottom: '1rem' }}>
          ✦ O VÉU FOI LEVANTADO
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: '1rem' }}>Sua Revelação</h1>
        <p style={{ opacity: 0.6 }}>Pedido: <code style={{ fontSize: '0.75rem' }}>{orderId}</code></p>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div className="ai-orb" style={{ margin: '0 auto 1.5rem' }} />
          <p>O oráculo está consultando os arquivos cósmicos...</p>
        </div>
      )}

      {error && (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(255,100,100,0.1)', borderRadius: '12px', marginBottom: '2rem' }}>
          <p style={{ color: '#ff6b6b', marginBottom: '1.5rem' }}>{error}</p>
          <button className="btn-secondary" onClick={fetchOrGenerate}>Tentar novamente</button>
        </div>
      )}

      {answer && !loading && (
        <>
          {/* SEÇÃO DE CARTAS REVELADAS */}
          {cards && cards.length > 0 && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: '3.5rem',
              width: '100%'
            }}>
              <div style={{ 
                color: 'var(--gold-light)', 
                fontSize: '0.85rem', 
                letterSpacing: '0.15em', 
                textTransform: 'uppercase',
                marginBottom: '1.8rem',
                opacity: 0.8
              }}>
                ✦ As Cartas Reveladas do seu Destino ✦
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '2.2rem',
                width: '100%'
              }}>
                {cards.map((card, idx) => {
                  const isReversed = card.reversed || false;
                  return (
                    <div key={idx} style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      width: '130px'
                    }}>
                      {/* Corpo da Carta */}
                      <div style={{
                        width: '120px',
                        height: '200px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: '1px solid rgba(255, 215, 0, 0.25)',
                        background: 'linear-gradient(135deg, rgba(20, 20, 25, 0.95) 0%, rgba(10, 10, 12, 0.95) 100%)',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5), 0 0 15px rgba(255, 215, 0, 0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        marginBottom: '1rem',
                        transition: 'transform 0.3s ease'
                      }}>
                        {card.id ? (
                          <img 
                            src={`${process.env.PUBLIC_URL}/assets/tarot-cards/${card.id}.png`}
                            alt={card.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              transform: isReversed ? 'rotate(180deg)' : 'none',
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        
                        {/* Fallback caso falte a imagem */}
                        <div style={{
                          display: card.id ? 'none' : 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '1rem',
                          textAlign: 'center',
                          height: '100%',
                          width: '100%',
                          transform: isReversed ? 'rotate(180deg)' : 'none',
                        }}>
                          <span style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>{card.icon || '🃏'}</span>
                          <span style={{ fontSize: '0.75rem', fontWeight: '600', opacity: 0.8 }}>{card.name}</span>
                        </div>
                      </div>

                      {/* Nome e Badge de Invertida */}
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ 
                          fontSize: '0.9rem', 
                          fontWeight: '600', 
                          color: '#fff',
                          marginBottom: '0.25rem'
                        }}>
                          {card.name}
                        </div>
                        {isReversed && (
                          <span style={{
                            fontSize: '0.62rem',
                            color: 'var(--gold)',
                            background: 'rgba(255, 215, 0, 0.08)',
                            border: '1px solid rgba(255, 215, 0, 0.2)',
                            borderRadius: '4px',
                            padding: '2px 6px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}>
                            Invertida
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{
            background: 'rgba(20,20,25,0.8)',
            border: '1px solid rgba(255,215,0,0.15)',
            borderRadius: '16px',
            padding: '2.5rem',
            marginBottom: '3rem',
          }}>
            {formatReading(answer)}
            <div style={{ marginTop: '2rem', opacity: 0.5, fontSize: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
              — Oráculo gerado em {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Link to="/" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
              Guardar e Voltar ✦
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
