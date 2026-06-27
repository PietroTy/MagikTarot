import { Helmet } from 'react-helmet';

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', padding: '8rem 2rem 4rem', maxWidth: '800px', margin: '0 auto' }}>
      <Helmet>
        <title>Política de Privacidade | Magik Tarot</title>
        <meta name="description" content="Leia nossa Política de Privacidade. Saiba como o Magik Tarot protege seus dados pessoais de acordo com a LGPD." />
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
          ✦ Proteção de Dados (LGPD) ✦
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem', color: '#fff' }}>
          Política de Privacidade
        </h1>
        
        <p style={{ fontSize: '0.9rem', opacity: 0.6, marginBottom: '2rem' }}>Última atualização: 26 de Junho de 2026</p>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--gold)', fontSize: '1.2rem', marginBottom: '1rem', fontWeight: '600' }}>
            1. Introdução e Compromisso
          </h2>
          <p>
            O <strong>Magik Tarot</strong> (gerido por Pietro Turci) tem como compromisso fundamental a transparência e a segurança no tratamento dos dados pessoais de seus buscadores. Esta política explica como coletamos, usamos e protegemos suas informações de acordo com a <strong>Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD)</strong>.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--gold)', fontSize: '1.2rem', marginBottom: '1rem', fontWeight: '600' }}>
            2. Quais Dados Coletamos?
          </h2>
          <p>Para a realização das consultas personalizadas e processamento de pagamentos, coletamos apenas os dados estritamente necessários:</p>
          <ul>
            <li style={{ marginBottom: '0.5rem' }}><strong>Identificação:</strong> Nome ou apelido fornecido voluntariamente por você.</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Contato:</strong> Endereço de e-mail (usado para enviar a notificação da consulta e controle do pedido).</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Dados Oraculares:</strong> Data, hora e local de nascimento (apenas no caso de Mapa Astral e Sinastria) e as perguntas ou temas informados no formulário.</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Dados de Transação:</strong> Informações de pagamento gerenciadas de forma criptografada e segura pela plataforma integradora **Mercado Pago**. O Magik Tarot não armazena dados de cartões de crédito ou chaves PIX em seus servidores locais.</li>
          </ul>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--gold)', fontSize: '1.2rem', marginBottom: '1rem', fontWeight: '600' }}>
            3. Finalidade do Tratamento dos Dados
          </h2>
          <p>Os seus dados pessoais são coletados com as seguintes finalidades legítimas:</p>
          <ul>
            <li style={{ marginBottom: '0.5rem' }}>Alimentar o prompt de inteligência artificial (Sabia-3) para gerar uma leitura oracular 100% personalizada.</li>
            <li style={{ marginBottom: '0.5rem' }}>Processar a transação financeira segura do pedido junto ao Mercado Pago.</li>
            <li style={{ marginBottom: '0.5rem' }}>Entregar o link privado da sua leitura no e-mail cadastrado.</li>
            <li style={{ marginBottom: '0.5rem' }}>Cumprimento de obrigações legais de faturamento e segurança cibernética.</li>
          </ul>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--gold)', fontSize: '1.2rem', marginBottom: '1rem', fontWeight: '600' }}>
            4. Sigilo e Confidencialidade
          </h2>
          <p>
            O teor das suas perguntas e a leitura resultante gerada pela IA são mantidos em <strong>sigilo absoluto</strong>. As leituras salvas em nosso banco de dados em memória são protegidas contra acessos não autorizados. Além disso, aplicamos a diretiva de metadados <code>noindex, nofollow</code> em todas as páginas de resultado para garantir que buscadores como o Google nunca indexem ou exibam o teor da sua revelação.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--gold)', fontSize: '1.2rem', marginBottom: '1rem', fontWeight: '600' }}>
            5. Direitos do Titular dos Dados
          </h2>
          <p>Sob a LGPD, você possui plenos direitos sobre seus dados. A qualquer momento, você pode solicitar:</p>
          <ul>
            <li style={{ marginBottom: '0.5rem' }}>A confirmação da existência de tratamento de seus dados.</li>
            <li style={{ marginBottom: '0.5rem' }}>O acesso imediato aos seus dados guardados no sistema.</li>
            <li style={{ marginBottom: '0.5rem' }}>A correção de dados incompletos ou inexatos.</li>
            <li style={{ marginBottom: '0.5rem' }}>A <strong>exclusão definitiva</strong> de seus dados pessoais e leituras de nosso histórico (direito ao esquecimento). Para solicitar isso, entre em contato conosco através do e-mail de suporte.</li>
          </ul>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--gold)', fontSize: '1.2rem', marginBottom: '1rem', fontWeight: '600' }}>
            6. Contato de Suporte e Encarregado de Dados
          </h2>
          <p>
            Se você tiver dúvidas sobre esta Política de Privacidade ou quiser exercer seus direitos de exclusão ou acesso aos dados, envie um e-mail para o desenvolvedor e responsável legal Pietro Turci. Responderemos sua solicitação com a máxima celeridade.
          </p>
        </section>
      </div>
    </div>
  );
}
