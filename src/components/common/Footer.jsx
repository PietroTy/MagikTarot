import '../../styles/footer.css';
import { useData } from '../../context/DataContext';

function Footer({ setActivePage }) {
  const { data: { services: SERVICES } } = useData();
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <div className="footer-brand">Mística</div>
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
                <span onClick={() => setActivePage('servicos')}>{s.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="footer-heading">Conteúdo</div>
          <ul className="footer-links">
            {['Horóscopo do Dia', 'Loja Sagrada', 'Afiliados'].map(l => (
              <li key={l}><span>{l}</span></li>
            ))}
          </ul>
        </div>

        <div>
          <div className="footer-heading">Institucional</div>
          <ul className="footer-links">
            {['Sobre nós', 'Política de Privacidade', 'Termos de Uso', 'Contato'].map(l => (
              <li key={l}><span>{l}</span></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-copy">© 2026 Mística. Todos os direitos reservados.</div>
        <div className="footer-copy">Desenvolvido com ✨ e muito propósito</div>
      </div>
    </footer>
  );
}

export default Footer;
