import '../../styles/services.css';
import { useData } from '../../context/DataContext';
import { ServiceCard } from './Home';

function ServicesPage({ setActiveModal }) {
  const { data: { services: SERVICES } } = useData();

  return (
    <div className="section" style={{ paddingTop: '7rem' }}>
      <div className="section-eyebrow">Portais do Conhecimento Oculto</div>
      <div className="section-title">Consultas Oraculares</div>
      <div className="divider" />
      <div className="section-desc">
        Escolha o portal que ressoa com sua necessidade. Cada consulta é tecida especificamente para a sua alma.
      </div>
      <div className="services-grid">
        {SERVICES.map(s => (
          <ServiceCard key={s.id} s={s} onOpen={setActiveModal} />
        ))}
      </div>
    </div>
  );
}

export default ServicesPage;
