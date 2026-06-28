const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.join(__dirname, 'build');

const routes = [
  'servicos',
  'consultas',
  'consultas/tarot',
  'consultas/astrologia',
  'consultas/numerologia',
  'consulta/tarot-sim-ou-nao',
  'consulta/tarot-do-amor',
  'consulta/tarot-carreira',
  'consulta/energia-do-mes',
  'consulta/mapa-astral',
  'consulta/sinastria',
  'blog',
  'blog/o-arcano-da-torre-quando-tudo-desmorona-para-renascer',
  'blog/jupiter-em-gemeos-expansao-pelo-conhecimento-e-comunicacao',
  'blog/o-numero-do-destino-como-calcula-lo-e-o-que-ele-revela',
  'blog/ritual-de-lua-nova-semear-intencoes-no-solo-do-cosmos',
  'blog/ametista-a-pedra-da-transmutacao-e-sabedoria-superior',
  'blog/horoscopo-de-abril-reorientacao-e-clareza-para-todos-os-signos',
  'significados/arcanos-maiores',
  'significados/signos',
  'duvidas-frequentes',
  'sobre',
  'politica-de-privacidade',
  'termos-de-uso',
  'horoscopo',
  'loja',
  'pagamento-confirmado',
  'sucesso',
  'erro',
  'pendente'
];

function main() {
  const indexHtmlPath = path.join(BUILD_DIR, 'index.html');
  
  if (!fs.existsSync(indexHtmlPath)) {
    console.error('Erro: build/index.html não encontrado. Execute o build primeiro.');
    process.exit(1);
  }

  const indexContent = fs.readFileSync(indexHtmlPath, 'utf8');

  // 1. Cria 404.html para fallbacks
  const fallbackPath = path.join(BUILD_DIR, '404.html');
  fs.writeFileSync(fallbackPath, indexContent);
  console.log('✓ Gerado: build/404.html');

  // 2. Cria as pastas estáticas e index.html para SEO
  for (const route of routes) {
    const routeDir = path.join(BUILD_DIR, route);
    fs.mkdirSync(routeDir, { recursive: true });
    
    const targetHtmlPath = path.join(routeDir, 'index.html');
    fs.writeFileSync(targetHtmlPath, indexContent);
    console.log(`✓ Gerado: build/${route}/index.html`);
  }

  console.log('\nTodas as rotas estáticas para SEO foram geradas com sucesso!');
}

main();
