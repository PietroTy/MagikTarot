import { useState } from 'react';
import '../../styles/horoscope.css';
import { useData } from '../../context/DataContext';

function HoroscopePage() {
  const { data: { zodiac: ZODIAC, horoscopes: HOROSCOPES } } = useData();
  const [activeZodiac, setActiveZodiac] = useState(null);

  return (
    <div className="section" style={{ paddingTop: '7rem' }}>
      <div className="section-eyebrow">Atualizado diariamente</div>
      <div className="section-title">Horóscopo do Dia</div>
      <div className="divider" />
      <div className="section-desc" style={{ marginBottom: '2rem' }}>
        Selecione seu signo solar para revelar as influências cósmicas de hoje.
      </div>

      <div className="zodiac-grid">
        {ZODIAC.map(z => (
          <div
            key={z.sign}
            className={`zodiac-btn ${activeZodiac?.sign === z.sign ? 'active' : ''}`}
            onClick={() => setActiveZodiac(prev => prev?.sign === z.sign ? null : z)}
          >
            <span className="zodiac-symbol">{z.sign}</span>
            <span className="zodiac-name">{z.name}</span>
          </div>
        ))}
      </div>

      {activeZodiac && HOROSCOPES[activeZodiac.sign] && (() => {
        const h = HOROSCOPES[activeZodiac.sign];
        return (
          <div className="horoscope-card">
            <div className="horoscope-header">
              <div className="horoscope-sign">{activeZodiac.sign}</div>
              <div>
                <div className="horoscope-title">{activeZodiac.name}</div>
                <div className="horoscope-date">{activeZodiac.dates}</div>
              </div>
            </div>
            <div className="horoscope-text">{h.reading}</div>
            <div className="horoscope-aspects">
              <div className="aspect-item">
                <div className="aspect-label">Cor da sorte</div>
                <div className="aspect-value">{h.lucky}</div>
              </div>
              <div className="aspect-item">
                <div className="aspect-label">Número</div>
                <div className="aspect-value">{h.num}</div>
              </div>
              <div className="aspect-item">
                <div className="aspect-label">Dia favorável</div>
                <div className="aspect-value">{h.day}</div>
              </div>
            </div>
          </div>
        );
      })()}

      {!activeZodiac && (
        <div className="horoscope-empty">
          ✦ Selecione seu signo para revelar as previsões de hoje
        </div>
      )}
    </div>
  );
}

export default HoroscopePage;
