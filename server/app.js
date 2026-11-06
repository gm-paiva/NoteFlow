import path from 'node:path';
import { fileURLToPath } from 'node:url';

import compression from 'compression';
import express from 'express';
import helmet from 'helmet';

import { config } from './config.js';

const PUBLIC_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public');

export function createApp() {
  const app = express();

  // Política de segurança de conteúdo: só carrega recursos do próprio domínio,
  // exceto as fontes do Google Fonts. O front-end não usa scripts/estilos inline.
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          'default-src': ["'self'"],
          'script-src': ["'self'"],
          'style-src': ["'self'", 'https://fonts.googleapis.com'],
          'font-src': ['https://fonts.gstatic.com'],
          'img-src': ["'self'", 'data:'],
          'object-src': ["'none'"],
          'base-uri': ["'self'"],
          'form-action': ["'self'"],
          'frame-ancestors': ["'none'"],
          // Desativado: sem HTTPS (ex.: http://localhost) o Safari quebraria a página.
          // Ative se publicar atrás de HTTPS.
          'upgrade-insecure-requests': null,
        },
      },
    }),
  );
  app.use(compression());

  // Usado pelo healthcheck do Docker e por monitoramento.
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', uptime: Math.round(process.uptime()) });
  });

  app.get('/', (_req, res) => res.redirect(302, '/login'));

  // Arquivos estáticos. `extensions: ['html']` permite URLs limpas: /login -> login.html
  app.use(
    express.static(PUBLIC_DIR, {
      extensions: ['html'],
      maxAge: config.isProduction ? '1h' : 0,
      setHeaders(res, filePath) {
        // HTML sempre revalidado, para que uma nova versão apareça logo após o deploy.
        if (filePath.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache');
      },
    }),
  );

  app.use((_req, res) => {
    res.status(404).sendFile(path.join(PUBLIC_DIR, '404.html'));
  });

  // Tratamento de erros (precisa dos 4 parâmetros para o Express reconhecê-lo).
  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  });

  return app;
}
