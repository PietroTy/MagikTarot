import { Helmet } from 'react-helmet';

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', padding: '8rem 2rem 4rem', maxWidth: '800px', margin: '0 auto' }}>
      <Helmet>
        <title>Termos de Uso | Magik Tarot</title>
        <meta name="description" content="Leia os Termos de Uso do Magik Tarot. Entenda os limites de responsabilidade, a natureza simbólica do serviço e a política comercial." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div style={{
        background: 'rgba(20, 20, 25, 0.85)',
        border: '1px solid rgba(255, 215, 0, 0.12)',
        borderRadius: '20px',
        padding: '3.5rem 2.5rem',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        backdropFilter: 'blur(10px)',
        lineHeight: '1.8',
        color: 'rgba(255, 255, 255, 0.85)'
      }}>
        <div style={{ color: 'var(--gold)', letterSpacing: '0.15em', fontSize: '0.75rem', marginBottom: '0.8rem', textTransform: 'uppercase' }}>
          ✦ Condições e Limites de Serviço ✦
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem', color: '#fff' }}>
          Termos de Uso do Portal
        </h1>
        
        <p style={{ fontSize: '0.9rem', opacity: 0.6, marginBottom: '2rem' }}>Última atualização: 26 de Junho de 2026</p>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--gold)', fontSize: '1.2rem', marginBottom: '1rem', fontWeight: '600' }}>
            1. Natureza do Serviço
          </h2>
          <p>
            O <strong>Magik Tarot</strong> é uma plataforma digital que disponibiliza consultas automatizadas de autoconhecimento e reflexão simbólica através de inteligência artificial. O serviço consiste na geração sob demanda de interpretações poéticas baseadas nas cartas sorteadas (no caso do tarot) e dados astrológicos fornecidos.
          </p>
          <p>
            Ao utilizar o portal, o usuário declara estar ciente de que as leituras são geradas por algoritmos inteligentes de processamento de linguagem natural (IA) e destinam-se a fins de <strong>entretenimento, introspecção filosófica e desenvolvimento pessoal simbólico</strong>.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--gold)', fontSize: '1.2rem', marginBottom: '1rem', fontWeight: '600' }}>
            2. Limitação de Responsabilidade
          </h2>
          <p>
            As orientações, previsões e conselhos gerados pela inteligência artificial do Magik Tarot <strong>não substituem em hipótese alguma aconselhamento profissional especializado</strong> de ordem médica, psicológica, psiquiátrica, jurídica, financeira ou empresarial.
          </p>
          <p>
            O usuário assume total responsabilidade pelo uso das informações fornecidas nas leituras, declarando ter plena capacidade civil e livre-arbítrio para tomar suas próprias decisões de vida. O Magik Tarot (gerido por Pietro Turci) não se responsabiliza por quaisquer decisões tomadas pelos usuários com base nas interpretações fornecidas.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--gold)', fontSize: '1.2rem', marginBottom: '1rem', fontWeight: '600' }}>
            3. Política Comercial e de Reembolso
          </h2>
          <ul>
            <li style={{ marginBottom: '0.8rem' }}><strong>Pagamentos:</strong> Todas as transações financeiras são processadas de forma segura pela integradora terceirizada Mercado Pago através de PIX ou Cartão de Crédito.</li>
            <li style={{ marginBottom: '0.8rem' }}><strong>Consumo Imediato:</strong> Devido à natureza digital do serviço (geração imediata e customizada do produto sob demanda), <strong>não há direito de desistência ou reembolso após a geração da leitura</strong>, visto que o serviço é integralmente prestado e consumido de forma instantânea.</li>
            <li style={{ marginBottom: '0.8rem' }}><strong>Erros Técnicos:</strong> Caso ocorra um erro de conexão do servidor ou falha no webhook de pagamento que impeça a liberação da consulta, o usuário terá direito ao reprocessamento manual do pedido ou ao estorno integral dos valores, bastando entrar em contato com o suporte.</li>
          </ul>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--gold)', fontSize: '1.2rem', marginBottom: '1rem', fontWeight: '600' }}>
            4. Propriedade Intelectual e Uso Aceitável
          </h2>
          <p>
            Todo o design do site, código de programação, textos do blog e ilustrações são de propriedade intelectual exclusiva do Magik Tarot. O usuário recebe uma licença de uso pessoal, não transferível e não comercial para ler, salvar e baixar suas leituras em PDF. É expressamente proibida a cópia sistemática ou revenda comercial das leituras de IA geradas pela plataforma.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--gold)', fontSize: '1.2rem', marginBottom: '1rem', fontWeight: '600' }}>
            5. Modificação dos Termos
          </h2>
          <p>
            Reservamo-nos o direito de alterar estes Termos de Uso a qualquer momento para refletir melhorias no serviço ou adequações legais. O uso continuado do portal após alterações constitui aceitação dos novos termos.
          </p>
        </section>
      </div>
    </div>
  );
}
