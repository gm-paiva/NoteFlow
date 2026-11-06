import dotenv from 'dotenv';

// Carrega o .env (se existir). Variáveis já definidas no ambiente têm prioridade.
dotenv.config({ quiet: true });

function parsePort(value, fallback) {
  const port = Number.parseInt(value ?? '', 10);
  return Number.isInteger(port) && port > 0 && port < 65536 ? port : fallback;
}

const env = process.env.NODE_ENV ?? 'development';

export const config = Object.freeze({
  env,
  isProduction: env === 'production',
  // 127.0.0.1 por padrão: em desenvolvimento a aplicação não fica exposta na rede local.
  // No Docker, o HOST é definido como 0.0.0.0 (veja Dockerfile e docker-compose.yml).
  host: process.env.HOST ?? '127.0.0.1',
  port: parsePort(process.env.PORT, 3000),
});
