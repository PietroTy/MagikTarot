import '../../styles/footer.css';
import { useData } from '../../context/DataContext';

import { Link } from 'react-router-dom';

function Footer() {
  const { data: { services: SERVICES } } = useData();
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <div className="footer-brand">Magik Tarot</div>
          <div className="footer-desc">
            Sabedoria ancestral e tecnologia moderna unidos para iluminar seu caminho.
            Mais de 12.000 consultas realizadas com profundidade e precisão.
          </div>
        </div>

        <div>
          <div className="footer-heading">Consultas</div>
          <ul className="footer-links">
            {SERVICES.map(s => (
              <li key={s.id}>
                <Link to={`/consulta/${s.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="footer-heading">Místicos & Conteúdo</div>
          <ul className="footer-links">
            <li>
              <Link to="/horoscopo" style={{ textDecoration: 'none', color: 'inherit' }}>Horóscopo do Dia</Link>
            </li>
            <li>
              <Link to="/loja" style={{ textDecoration: 'none', color: 'inherit' }}>Loja Sagrada</Link>
            </li>
            <li>
              <Link to="/blog" style={{ textDecoration: 'none', color: 'inherit' }}>Blog do Oráculo</Link>
            </li>
            <li>
              <Link to="/significados/arcanos-maiores" style={{ textDecoration: 'none', color: 'inherit' }}>Arcanos Maiores</Link>
            </li>
            <li>
              <Link to="/significados/signos" style={{ textDecoration: 'none', color: 'inherit' }}>Signos do Zodíaco</Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="footer-heading">Institucional</div>
          <ul className="footer-links">
            <li>
              <Link to="/sobre" style={{ textDecoration: 'none', color: 'inherit' }}>Sobre Nós</Link>
            </li>
            <li>
              <Link to="/duvidas-frequentes" style={{ textDecoration: 'none', color: 'inherit' }}>Dúvidas Frequentes</Link>
            </li>
            <li>
              <Link to="/politica-de-privacidade" style={{ textDecoration: 'none', color: 'inherit' }}>Política de Privacidade</Link>
            </li>
            <li>
              <Link to="/termos-de-uso" style={{ textDecoration: 'none', color: 'inherit' }}>Termos de Uso</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-copy">© 2026 Magik Tarot. Todos os direitos reservados.</div>
        <div className="footer-copy">Desenvolvido com ✨ e muito propósito</div>
      </div>
    </footer>
  );
}

export default Footer;
