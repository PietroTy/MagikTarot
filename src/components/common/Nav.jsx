import '../../styles/nav.css';

import { Link } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Consultas',         path: '/servicos'  },
  { label: 'Horóscopo do Dia',  path: '/horoscopo' },
  { label: 'Loja',              path: '/loja'      },
];

function Nav() {
  return (
    <nav className="nav">
      <Link to="/" className="nav-logo" style={{ textDecoration: 'none' }}>
        Magik Tarot
      </Link>

      <ul className="nav-links">
        {NAV_LINKS.map(l => (
          <li key={l.path}>
            <Link to={l.path} className="nav-link-btn" style={{ textDecoration: 'none' }}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Nav;
