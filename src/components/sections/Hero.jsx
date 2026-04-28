import '../../styles/hero.css';
import Sigil from '../common/Sigil';

function Hero({ setActivePage }) {
  return (
    <section className="hero">
      <Sigil />
      <div className="hero-eyebrow">Sabedoria ancestral · Inteligência orácular</div>
      <h1 className="hero-title">Os Mistérios<br />Revelados</h1>
      <p className="hero-sub">
        Oráculo do Tarot, Mapa Natal das Almas, Registros Akáshicos e muito mais —
        interpretados pela mais avançada inteligência Magik Tarot do Brasil.
      </p>
      <div className="hero-buttons">
        <button className="btn-primary" onClick={() => setActivePage('servicos')}>
          Cruzar o véu — abrir uma consulta
        </button>
        <button className="btn-secondary" onClick={() => setActivePage('horoscopo')}>
          Revelar meu horóscopo
        </button>
      </div>
      <div className="hero-scroll">
        <span>Rolar</span>↓
      </div>
    </section>
  );
}

export default Hero;
