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
  const [serviceId, setServiceId] = useState('');

  // 3D Card Reveal delay animation state
  const [revealedCards, setRevealedCards] = useState([]);

  // Form states for end-of-reading review
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!orderId) { setError('ID do pedido não encontrado.'); setLoading(false); return; }
    fetchOrGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  // Flip cards one by one after loading
  useEffect(() => {
    if (answer && cards.length > 0) {
      setRevealedCards([]);
      cards.forEach((_, idx) => {
        setTimeout(() => {
          setRevealedCards(prev => [...prev, idx]);
        }, 500 + idx * 700);
      });
    }
  }, [answer, cards]);

  const trackConversion = (id) => {
    if (!id) return;
    const key = `gtag_conv_${id}`;
    if (!localStorage.getItem(key)) {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'conversion', {
          'send_to': 'AW-18279016188/wrl4CPvf7sYcEPzNjoxE',
          'value': 1.0,
          'currency': 'BRL',
          'transaction_id': id
        });
        localStorage.setItem(key, 'true');
      }
    }
  };

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
        setServiceId(found.serviceId || '');
        setLoading(false);
        trackConversion(orderId);
        localStorage.removeItem(`pending_order_${orderId}`);
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
      setServiceId(data.serviceId || '');
      trackConversion(orderId);
      localStorage.removeItem(`pending_order_${orderId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleReviewSubmit(e) {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) {
      setReviewError('Por favor, preencha todos os campos.');
      return;
    }
    setSubmittingReview(true);
    setReviewError('');
    try {
      const targetId = serviceId || 'tarot-sim-ou-nao';
      const res = await fetch(`${BASE}/reviews/${targetId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newReviewName,
          rating: newReviewRating,
          comment: newReviewComment
        })
      });
      if (res.ok) {
        setReviewSubmitted(true);
      } else {
        setReviewError('Erro ao enviar avaliação. Tente novamente.');
      }
    } catch {
      setReviewError('Erro ao conectar com o servidor.');
    } finally {
      setSubmittingReview(false);
    }
  }

  function formatReading(text) {
    if (!text) return null;

    // Programmatic cleanup of emojis, sparks, crystals, etc.
    let cleaned = text;
    try {
      cleaned = cleaned.replace(/\p{Extended_Pictographic}/gu, '');
    } catch (e) {
      // Fallback if property is not supported
      cleaned = cleaned.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}]/gu, '');
    }
    // Remove specific graphic symbols
    cleaned = cleaned.replace(/[✦✨🔮⭐🌟🌠🌌☄️💫]/g, '');

    const lines = cleaned.split('\n');
    const elements = [];
    let currentList = [];

    const parseInlineStyles = (lineStr, keyIdx) => {
      const parts = lineStr.split(/\*\*(.*?)\*\*/g);
      return parts.map((part, i) =>
        i % 2 === 1
          ? <strong key={`${keyIdx}-${i}`} style={{ color: 'var(--gold-light)' }}>{part}</strong>
          : part
      );
    };

    lines.forEach((line, li) => {
      const trimmed = line.trim();
      if (!trimmed) {
        if (currentList.length > 0) {
          elements.push(
            <ul key={`list-${li}`} style={{ paddingLeft: '1.5rem', marginBottom: '1.4rem', listStyleType: 'disc' }}>
              {[...currentList]}
            </ul>
          );
          currentList = [];
        }
        return;
      }

      // Check for horizontal divider
      if (trimmed === '---' || trimmed === '***') {
        if (currentList.length > 0) {
          elements.push(
            <ul key={`list-${li}`} style={{ paddingLeft: '1.5rem', marginBottom: '1.4rem', listStyleType: 'disc' }}>
              {[...currentList]}
            </ul>
          );
          currentList = [];
        }
        elements.push(<hr key={`hr-${li}`} style={{ border: 'none', borderTop: '1px dashed rgba(255,215,0,0.15)', margin: '1.8rem 0' }} />);
        return;
      }

      // Check for bullet list item
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
        const itemContent = trimmed.substring(2);
        currentList.push(
          <li key={`li-${li}-${currentList.length}`} style={{ marginBottom: '0.6rem', lineHeight: '1.8' }}>
            {parseInlineStyles(itemContent, li)}
          </li>
        );
        return;
      }

      // If it's a regular paragraph but list was open, close it
      if (currentList.length > 0) {
        elements.push(
          <ul key={`list-${li}`} style={{ paddingLeft: '1.5rem', marginBottom: '1.4rem', listStyleType: 'disc' }}>
            {[...currentList]}
          </ul>
        );
        currentList = [];
      }

      // Render paragraph
      elements.push(
        <p key={`p-${li}`} style={{ marginBottom: '1.4rem', lineHeight: '1.9' }}>
          {parseInlineStyles(trimmed, li)}
        </p>
      );
    });

    // Close any trailing lists
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-end`} style={{ paddingLeft: '1.5rem', marginBottom: '1.4rem', listStyleType: 'disc' }}>
          {[...currentList]}
        </ul>
      );
    }

    return elements;
  }

  return (
    <div className="result-page-container">
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
                  const isRevealed = revealedCards.includes(idx);
                  return (
                    <div key={idx} style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      width: '130px',
                      perspective: '1000px'
                    }}>
                      {/* Corpo da Carta com Flip 3D */}
                      <div style={{
                        width: '120px',
                        height: '200px',
                        borderRadius: '12px',
                        position: 'relative',
                        marginBottom: '1rem',
                        transform: isRevealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
                        transformStyle: 'preserve-3d',
                        transition: 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease, border-color 0.3s ease',
                        boxShadow: isRevealed 
                          ? '0 8px 24px rgba(255, 215, 0, 0.25), 0 0 15px rgba(255, 215, 0, 0.05)'
                          : '0 8px 24px rgba(0, 0, 0, 0.5)',
                        border: isRevealed ? '1px solid rgba(255, 215, 0, 0.3)' : '1px solid rgba(255, 215, 0, 0.1)',
                      }}>
                        {/* Verso da carta */}
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          backfaceVisibility: 'hidden',
                          WebkitBackfaceVisibility: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          background: 'var(--deep)',
                          zIndex: isRevealed ? 1 : 2,
                          opacity: isRevealed ? 0 : 1,
                          transition: 'opacity 0.4s ease',
                        }}>
                          <img 
                            src="https://raw.githubusercontent.com/PietroTy/MagikTarot/main/public/assets/tarot-cards/back.png" 
                            alt="Verso" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          />
                        </div>

                        {/* Frente da carta */}
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          backfaceVisibility: 'hidden',
                          WebkitBackfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          background: 'linear-gradient(135deg, rgba(20, 20, 25, 0.95) 0%, rgba(10, 10, 12, 0.95) 100%)',
                          zIndex: isRevealed ? 2 : 1,
                          opacity: isRevealed ? 1 : 0,
                          transition: 'opacity 0.4s ease',
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
                            <span style={{ fontSize: '1.5rem', color: 'var(--gold)', marginBottom: '0.8rem' }}>✦</span>
                            <span style={{ fontSize: '0.75rem', fontWeight: '600', opacity: 0.8 }}>{card.name}</span>
                          </div>
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

          <div className="result-box">
            {formatReading(answer)}
            <div style={{ marginTop: '2rem', opacity: 0.5, fontSize: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
              — Oráculo gerado em {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </div>
          </div>

          {/* Formulário de Depoimento de Fim de Consulta */}
          <div className="feedback-box">
            <h3 style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '1.2rem',
              color: 'var(--gold-light)',
              marginBottom: '0.8rem',
              textAlign: 'center',
              letterSpacing: '0.05em'
            }}>
              Deixe seu Depoimento Oracular
            </h3>
            <p style={{
              textAlign: 'center',
              fontSize: '0.9rem',
              opacity: 0.7,
              marginBottom: '2rem'
            }}>
              Sua avaliação ajuda a guiar outros buscadores em suas jornadas.
            </p>

            {reviewSubmitted ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🙏</div>
                <p style={{ color: 'var(--gold-light)', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Sua avaliação foi registrada nos anais cósmicos!
                </p>
                <p style={{ fontSize: '0.88rem', opacity: 0.6 }}>
                  Que os caminhos da luz iluminem sua jornada.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', maxWidth: '500px', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-grid">
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Seu Nome ou Apelido</label>
                    <input 
                      type="text"
                      value={newReviewName}
                      onChange={e => setNewReviewName(e.target.value)}
                      placeholder="Ex: Pedro O."
                      required
                      style={{
                        width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,215,0,0.2)',
                        borderRadius: '8px', padding: '0.75rem 1rem', color: '#fff', fontSize: '0.95rem', outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avaliação</label>
                    <select 
                      value={newReviewRating}
                      onChange={e => setNewReviewRating(parseInt(e.target.value))}
                      style={{
                        width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,215,0,0.2)',
                        borderRadius: '8px', padding: '0.75rem 1rem', color: '#fff', fontSize: '0.95rem', outline: 'none'
                      }}
                    >
                      <option value="5" style={{ background: '#0a0a0d' }}>★ ★ ★ ★ ★ (5 estrelas)</option>
                      <option value="4" style={{ background: '#0a0a0d' }}>★ ★ ★ ★ ☆ (4 estrelas)</option>
                      <option value="3" style={{ background: '#0a0a0d' }}>★ ★ ★ ☆ ☆ (3 estrelas)</option>
                      <option value="2" style={{ background: '#0a0a0d' }}>★ ★ ☆ ☆ ☆ (2 estrelas)</option>
                      <option value="1" style={{ background: '#0a0a0d' }}>★ ☆ ☆ ☆ ☆ (1 estrela)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Comentário / Relato</label>
                  <textarea 
                    value={newReviewComment}
                    onChange={e => setNewReviewComment(e.target.value)}
                    placeholder="Conte como foi sua leitura..."
                    required
                    rows={4}
                    style={{
                      width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,215,0,0.2)',
                      borderRadius: '8px', padding: '0.75rem 1rem', color: '#fff', fontSize: '0.95rem', outline: 'none', resize: 'none'
                    }}
                  />
                </div>

                {reviewError && (
                  <div style={{ color: '#ff6b6b', fontSize: '0.88rem', textAlign: 'center' }}>{reviewError}</div>
                )}

                <button 
                  type="submit" 
                  disabled={submittingReview} 
                  className="btn-primary" 
                  style={{ width: '100%', padding: '0.85rem', fontSize: '0.9rem', cursor: submittingReview ? 'not-allowed' : 'pointer' }}
                >
                  {submittingReview ? 'Gravando nos astros...' : 'Enviar Avaliação do Oráculo ✦'}
                </button>
              </form>
            )}
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
