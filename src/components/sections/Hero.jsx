import '../../styles/hero.css';
import Sigil from '../common/Sigil';

import { Link } from 'react-router-dom';

function Hero() {
  return (
    <section className="hero">
      <Sigil />
      <div className="hero-eyebrow">Consultas de Tarot Online & Previsões Astrológicas</div>
      <h1 className="hero-title">O Tarot Revela<br />Seu Caminho</h1>
      <p className="hero-sub">
        Respostas diretas e profundas para amor, trabalho, finanças e destino. 
        Desvele o que o cosmos reservou para sua jornada com a sabedoria do Magik Tarot.
      </p>
      <div className="hero-buttons">
        <Link to="/servicos" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
          Iniciar Consulta de Tarot ✦
        </Link>
        <Link to="/horoscopo" className="btn-secondary" style={{ display: 'inline-block', textDecoration: 'none' }}>
          Ver Meu Horóscopo do Dia
        </Link>
      </div>
      <div className="hero-scroll">
        <span>Rolar para explorar</span>↓
      </div>
    </section>
  );
}

export default Hero;
