import { useState } from 'react';

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

// Modal
import ServiceModal  from './components/modals/ServiceModal';

import { useData } from './context/DataContext';

function App() {
  const [activePage,  setActivePage]  = useState('home');
  const [activeModal, setActiveModal] = useState(null);
  const { loading } = useData();

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
        <Nav setActivePage={setActivePage} />

        {/* ── Pages ── */}
        <div className="app">

          {activePage === 'home'      && (
            <>
              <Hero setActivePage={setActivePage} />
              <Home setActivePage={setActivePage} setActiveModal={setActiveModal} />
            </>
          )}

          {activePage === 'servicos'  && <ServicesPage  setActiveModal={setActiveModal} />}
          {activePage === 'horoscopo' && <HoroscopePage />}
          {activePage === 'loja'      && <ShopPage />}

          {/* ── Footer ── */}
          <Footer setActivePage={setActivePage} />
        </div>

        {/* ── Modal ── */}
        {activeModal && (
          <ServiceModal
            service={activeModal}
            onClose={() => setActiveModal(null)}
          />
        )}
      </div>
    </>
  );
}

export default App;
