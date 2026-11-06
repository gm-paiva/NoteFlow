import { createApp } from './app.js';
import { config } from './config.js';

const app = createApp();

const server = app.listen(config.port, config.host, () => {
  console.log(`NoteFlow rodando em http://${config.host}:${config.port} (${config.env})`);
});

// Encerramento gracioso: finaliza as conexões em andamento antes de sair.
// Necessário para o `docker stop` não precisar forçar o encerramento do processo.
function shutdown(signal) {
  console.log(`${signal} recebido, encerrando...`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
