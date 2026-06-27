import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useData } from '../../context/DataContext';

export default function BlogPage() {
  const { data: { blogPosts } } = useData();

  // Helper para gerar slugs amigáveis de URL a partir do título do post
  const getSlug = (title) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove acentos
      .replace(/[^a-z0-9\s-]/g, '')   // remove caracteres especiais
      .replace(/\s+/g, '-')           // substitui espaços por -
      .trim();
  };

  return (
    <div style={{ minHeight: '100vh', padding: '8rem 2rem 4rem', maxWidth: '1100px', margin: '0 auto' }}>
      <Helmet>
        <title>Blog do Oráculo | Magik Tarot</title>
        <meta name="description" content="Leia artigos profundos sobre tarot, astrologia, rituais, numerologia e autoconhecimento sob a perspectiva hermética." />
      </Helmet>

      {/* Header do Blog */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div style={{ color: 'var(--gold)', letterSpacing: '0.2em', fontSize: '0.8rem', marginBottom: '1rem', textTransform: 'uppercase' }}>
          ✦ Sabedoria Ancestral e Moderna ✦
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1.5rem', color: '#fff' }}>
          Crônicas do Oráculo
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.7' }}>
          Explore artigos escritos para iluminar sua jornada, decifrar mistérios celestes e ensinar rituais práticos de conexão cósmica.
        </p>
      </div>

      {/* Grid de Posts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2.5rem'
      }}>
        {blogPosts.map((post, idx) => {
          const slug = getSlug(post.title);
          return (
            <Link 
              key={idx} 
              to={`/blog/${slug}`} 
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div 
                style={{
                  background: 'rgba(20, 20, 25, 0.85)',
                  border: '1px solid rgba(255, 215, 0, 0.12)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  backdropFilter: 'blur(8px)',
                  transition: 'transform 0.3s ease, border-color 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.12)';
                }}
              >
                {/* Imagem de Topo (Gradiente com Icon) */}
                <div style={{
                  background: post.bg || 'linear-gradient(135deg, #1a0a2e, #2d1257)',
                  height: '180px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '4rem',
                  position: 'relative'
                }}>
                  <div style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 215, 0, 0.25)',
                    boxShadow: '0 0 25px rgba(255, 215, 0, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.2rem',
                    color: 'var(--gold)',
                    animation: 'float 4s ease-in-out infinite'
                  }}>
                    ✦
                  </div>
                  <span style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '16px',
                    fontSize: '0.7rem',
                    color: 'var(--gold)',
                    background: 'rgba(0,0,0,0.4)',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {post.tag}
                  </span>
                </div>

                {/* Conteúdo do Post */}
                <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.5, marginBottom: '0.8rem' }}>{post.date}</div>
                    <h2 style={{ 
                      fontSize: '1.25rem', 
                      fontWeight: '700', 
                      color: '#fff', 
                      lineHeight: '1.4', 
                      marginBottom: '1rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {post.title}
                    </h2>
                    <p style={{ 
                      fontSize: '0.9rem', 
                      opacity: 0.75, 
                      lineHeight: '1.6', 
                      marginBottom: '2rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {post.excerpt}
                    </p>
                  </div>

                  <div style={{ 
                    color: 'var(--gold)', 
                    fontSize: '0.85rem', 
                    fontWeight: '600', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.4rem',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    paddingTop: '1.2rem'
                  }}>
                    Ler Artigo Completo ✦
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
