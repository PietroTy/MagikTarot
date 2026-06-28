import '../../styles/nav.css';
import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Consultas',         path: '/consultas' },
  { label: 'Horóscopo do Dia',  path: '/horoscopo' },
  { label: 'Loja',              path: '/loja'      },
];

function Nav() {
  const location = useLocation();
  const isBlockedPage = location.pathname.includes('/pendente') || 
                        location.pathname.includes('/sucesso') || 
                        location.pathname.includes('/pagamento-confirmado');

  return (
    <nav className="nav">
      <Link 
        to={isBlockedPage ? "#" : "/"} 
        className="nav-logo" 
        style={{ textDecoration: 'none', cursor: isBlockedPage ? 'default' : 'pointer' }}
        onClick={(e) => isBlockedPage && e.preventDefault()}
      >
        <svg viewBox="0 0 24 24" fill="none" style={{ width: '28px', height: '28px', marginRight: '10px', flexShrink: 0 }}>
          <circle cx="12" cy="12" r="10" stroke="url(#goldGrad)" strokeWidth="1" />
          <circle cx="12" cy="12" r="8.5" stroke="url(#goldGrad)" strokeWidth="0.5" opacity="0.6" />
          <path d="M12 5.5l2 4 4.5.5-3.5 3 1 4.5-4-2.5-4 2.5 1-4.5-3.5-3 4.5-.5z" fill="url(#goldGrad)" />
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--gold-light)" />
              <stop offset="100%" stopColor="var(--gold)" />
            </linearGradient>
          </defs>
        </svg>
        <span className="logo-text">Magik Tarot</span>
      </Link>

      {!isBlockedPage && (
        <ul className="nav-links">
          {NAV_LINKS.map(l => (
            <li key={l.path}>
              <Link to={l.path} className="nav-link-btn" style={{ textDecoration: 'none' }}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}

export default Nav;
