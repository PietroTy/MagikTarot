import '../../styles/nav.css';

const NAV_LINKS = [
  { label: 'Consultas',         page: 'servicos'  },
  { label: 'Horóscopo do Dia',  page: 'horoscopo' },
  { label: 'Loja',              page: 'loja'      },
];

function Nav({ setActivePage }) {
  return (
    <nav className="nav">
      <div className="nav-logo" onClick={() => setActivePage('home')}>
        Mística
      </div>

      <ul className="nav-links">
        {NAV_LINKS.map(l => (
          <li key={l.page}>
            <span className="nav-link-btn" onClick={() => setActivePage(l.page)}>
              {l.label}
            </span>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Nav;
