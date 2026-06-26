import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

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
import BlogPage from './components/pages/BlogPage';
import BlogPostPage from './components/pages/BlogPostPage';
import ArcanaPage from './components/pages/ArcanaPage';
import SignsPage from './components/pages/SignsPage';
import FaqPage from './components/pages/FaqPage';
import AboutPage from './components/pages/AboutPage';
import PrivacyPage from './components/pages/PrivacyPage';
import TermsPage from './components/pages/TermsPage';

// Modal
import ServiceModal  from './components/modals/ServiceModal';

import { useData } from './context/DataContext';

function App() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  const [modalStep,   setModalStep]   = useState('form');
  const { loading } = useData();

  // Detecta retorno do Mercado Pago pela URL e redireciona para resultado
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status') || params.get('collection_status');
    const orderId = params.get('external_reference');
    if (status === 'approved' && orderId) {
      // Limpa os parâmetros da URL e vai para a página de resultado
      window.history.replaceState({}, '', window.location.pathname);
      navigate(`/resultado/${orderId}`);
    }
  }, [navigate]);

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

  const isModalFullScreen = activeModal && (modalStep === 'picking' || modalStep === 'result');

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

        {/* ── Pages ── */}
        <div className="app">
          {!isModalFullScreen && (
            <Routes>
              <Route path="/" element={
                <>
                  <Hero />
                  <Home setActiveModal={setActiveModal} />
                </>
              } />
              <Route path="/servicos" element={<ServicesPage setActiveModal={setActiveModal} />} />
              <Route path="/consultas" element={<ServicesPage setActiveModal={setActiveModal} />} />
              <Route path="/consultas/:category" element={<CategoryPage setActiveModal={setActiveModal} />} />
              <Route path="/consulta/:serviceId" element={<ProductPage setActiveModal={setActiveModal} />} />
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
            </Routes>
          )}

          {/* ── Modal ── */}
          {activeModal && (
            <ServiceModal
              service={activeModal}
              onClose={() => { setActiveModal(null); setModalStep('form'); }}
              onStepChange={setModalStep}
            />
          )}

          {/* ── Footer ── */}
          <Footer />
        </div>
      </div>
    </>
  );
}

export default App;
