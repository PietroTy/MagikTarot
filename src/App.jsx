import { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

// Styles
import './styles/global.css';

// Common components
import StarCanvas    from './components/common/StarCanvas';
import Nav           from './components/common/Nav';
import Footer        from './components/common/Footer';

// Section components
import Hero          from './components/sections/Hero';
import Home          from './components/sections/Home';
import ServicesPage  from './components/sections/ServicesPage';
import HoroscopePage from './components/sections/HoroscopePage';
import ShopPage      from './components/sections/ShopPage';

// Pages to create
import ResultPage    from './components/pages/ResultPage';
import PaymentApprovedPage from './components/pages/PaymentApprovedPage';
import CategoryPage from './components/pages/CategoryPage';
import ProductPage from './components/pages/ProductPage';
import RitualPage from './components/pages/RitualPage';
import BlogPage from './components/pages/BlogPage';
import BlogPostPage from './components/pages/BlogPostPage';
import ArcanaPage from './components/pages/ArcanaPage';
import SignsPage from './components/pages/SignsPage';
import FaqPage from './components/pages/FaqPage';
import AboutPage from './components/pages/AboutPage';
import PrivacyPage from './components/pages/PrivacyPage';
import TermsPage from './components/pages/TermsPage';
import PaymentErrorPage from './components/pages/PaymentErrorPage';
import PaymentPendingPage from './components/pages/PaymentPendingPage';

import { useData } from './context/DataContext';
import { API_CONFIG } from './config/apiConfig';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { loading } = useData();
  const [pendingOrders, setPendingOrders] = useState([]);

  // Sempre que mudar de rota, rola a página para o topo
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Monitora pedidos pendentes no localStorage para exibir o banner
  useEffect(() => {
    const checkActiveOrders = async () => {
      const path = location.pathname;
      // Evita exibir banner nas telas de checkout e resultado para evitar duplicidade de UX
      if (
        path.includes('/pendente') || 
        path.includes('/sucesso') || 
        path.includes('/pagamento-confirmado') || 
        path.includes('/resultado')
      ) {
        setPendingOrders([]);
        return;
      }

      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('pending_order_')) {
          keys.push(key);
        }
      }

      if (keys.length === 0) {
        setPendingOrders([]);
        return;
      }

      const activeList = [];
      const BASE = API_CONFIG.BACKEND_URL;

      for (const key of keys) {
        try {
          const raw = localStorage.getItem(key);
          if (!raw) continue;
          const order = JSON.parse(raw);
          const orderId = order.orderId;
          if (!orderId) continue;

          let status = 'pending';
          try {
            const res = await fetch(`${BASE}/payment/${orderId}/status`);
            if (res.ok) {
              const data = await res.json();
              status = data.status;
            }
          } catch (netErr) {
            console.warn('Erro de rede ao verificar status, assumindo pendente:', netErr);
            status = 'pending';
          }

          if (status === 'pending' || status === 'approved') {
            activeList.push({
              orderId,
              serviceName: order.service?.name || 'Consulta de Tarot',
              serviceId: order.service?.id || 'tarot-sim-ou-nao',
              status: status
            });
          } else {
            localStorage.removeItem(key);
          }
        } catch (e) {
          console.error('Erro ao processar pedido pendente:', e);
        }
      }

      setPendingOrders(activeList);
    };

    checkActiveOrders();
    const interval = setInterval(checkActiveOrders, 15000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="noise" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>
        <div className="ai-loading">
          <div className="ai-orb" />
          <div className="ai-text">Conectando ao oráculo...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ── Animated Background ── */}
      <div className="noise">
        <StarCanvas />
        <div className="nebula">
          <div className="nebula-orb" />
          <div className="nebula-orb" />
          <div className="nebula-orb" />
        </div>

        {/* ── Navigation ── */}
        <Nav />

        {/* ── Active Pending Orders Banner ── */}
        {pendingOrders.map(order => (
          <div 
            key={order.orderId}
            style={{
              background: order.status === 'approved' 
                ? 'linear-gradient(90deg, rgba(212, 175, 55, 0.95), rgba(184, 134, 11, 0.95))'
                : 'rgba(20, 20, 25, 0.95)',
              borderBottom: '1px solid rgba(255, 215, 0, 0.3)',
              color: order.status === 'approved' ? '#000' : '#fff',
              padding: '0.8rem 1.5rem',
              fontSize: '0.88rem',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              position: 'relative',
              zIndex: 100,
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
              fontWeight: '500',
              backdropFilter: 'blur(8px)',
              cursor: 'pointer',
              animation: order.status === 'approved' ? 'pulseGold 2s infinite' : 'none'
            }}
            onClick={() => {
              if (order.status === 'approved') {
                const saved = localStorage.getItem(`pending_order_${order.orderId}`);
                if (saved) {
                  try {
                    const { service } = JSON.parse(saved);
                    if (service && service.id) {
                      navigate(`/ritual/${service.id}?orderId=${order.orderId}&approved=true`);
                      return;
                    }
                  } catch {}
                }
                navigate(`/resultado/${order.orderId}`);
              } else {
                navigate(`/pendente?external_reference=${order.orderId}`);
              }
            }}
          >
            {order.status === 'approved' ? (
              <>
                <span style={{ fontSize: '1.1rem' }}>✨</span>
                <span>
                  Sua consulta <strong>{order.serviceName}</strong> está confirmada e pronta! 
                  <span style={{ textDecoration: 'underline', marginLeft: '0.5rem', fontWeight: 'bold' }}>
                    Clique aqui para iniciar sua leitura 🔮
                  </span>
                </span>
              </>
            ) : (
              <>
                <span className="spinner-mini" style={{
                  display: 'inline-block',
                  width: '12px',
                  height: '12px',
                  border: '2px solid rgba(255, 215, 0, 0.3)',
                  borderTopColor: 'var(--gold)',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  marginRight: '0.2rem'
                }} />
                <style>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
                <span>
                  Aguardando confirmação do pagamento para: <strong>{order.serviceName}</strong>. 
                  <span style={{ textDecoration: 'underline', color: 'var(--gold-light)', marginLeft: '0.5rem' }}>
                    Clique aqui para acompanhar ⌛
                  </span>
                </span>
              </>
            )}
          </div>
        ))}

        {/* ── Pages ── */}
        <div className="app">
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <Home />
              </>
            } />
            <Route path="/servicos" element={<ServicesPage />} />
            <Route path="/consultas" element={<ServicesPage />} />
            <Route path="/consultas/:category" element={<CategoryPage />} />
            <Route path="/consulta/:serviceId" element={<ProductPage />} />
            <Route path="/ritual/:serviceId" element={<RitualPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:postSlug" element={<BlogPostPage />} />
            <Route path="/significados/arcanos-maiores" element={<ArcanaPage />} />
            <Route path="/significados/signos" element={<SignsPage />} />
            <Route style={{ cursor: 'pointer' }} path="/duvidas-frequentes" element={<FaqPage />} />
            <Route path="/sobre" element={<AboutPage />} />
            <Route path="/politica-de-privacidade" element={<PrivacyPage />} />
            <Route path="/termos-de-uso" element={<TermsPage />} />
            <Route path="/horoscopo" element={<HoroscopePage />} />
            <Route path="/loja" element={<ShopPage />} />
            <Route path="/resultado/:orderId" element={<ResultPage />} />
            <Route path="/pagamento-confirmado" element={<PaymentApprovedPage />} />
            <Route path="/sucesso" element={<PaymentApprovedPage />} />
            <Route path="/erro" element={<PaymentErrorPage />} />
            <Route path="/pendente" element={<PaymentPendingPage />} />
          </Routes>

          {/* ── Footer ── */}
          <Footer />
        </div>
      </div>
    </>
  );
}

export default App;
