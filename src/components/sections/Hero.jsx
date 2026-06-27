import '../../styles/hero.css';
import Sigil from '../common/Sigil';

import { Link } from 'react-router-dom';

function Hero() {
  return (
    <section className="hero">
      <Sigil />
      <div className="hero-eyebrow">Sabedoria ancestral · Clarividência e Ocultismo</div>
      <h1 className="hero-title">Os Mistérios<br />Revelados</h1>
      <p className="hero-sub">
        Oráculo do Tarot, Mapa Natal das Almas, Registros Akáshicos e muito mais —
        desvelados com a profundidade da sabedoria ancestral do Magik Tarot.
      </p>
      <div className="hero-buttons">
        <Link to="/servicos" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
          Cruzar o véu — abrir uma consulta
        </Link>
        <Link to="/horoscopo" className="btn-secondary" style={{ display: 'inline-block', textDecoration: 'none' }}>
          Revelar meu horóscopo
        </Link>
      </div>
      <div className="hero-scroll">
        <span>Rolar</span>↓
      </div>
    </section>
  );
}

export default Hero;
