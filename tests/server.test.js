import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';

import { createApp } from '../server/app.js';

let server;
let baseUrl;

before(async () => {
  await new Promise((resolve) => {
    server = createApp().listen(0, '127.0.0.1', resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => new Promise((resolve) => server.close(resolve)));

describe('rotas', () => {
  it('GET /health responde 200 com status ok', async () => {
    const res = await fetch(`${baseUrl}/health`);
    assert.equal(res.status, 200);
    assert.equal((await res.json()).status, 'ok');
  });

  it('GET / redireciona para /login', async () => {
    const res = await fetch(`${baseUrl}/`, { redirect: 'manual' });
    assert.equal(res.status, 302);
    assert.equal(res.headers.get('location'), '/login');
  });

  for (const route of ['/login', '/register', '/notes']) {
    it(`GET ${route} serve a página HTML`, async () => {
      const res = await fetch(`${baseUrl}${route}`);
      assert.equal(res.status, 200);
      assert.match(res.headers.get('content-type'), /text\/html/);
    });
  }

  it('serve arquivos estáticos com o content-type correto', async () => {
    const css = await fetch(`${baseUrl}/assets/css/base.css`);
    assert.equal(css.status, 200);
    assert.match(css.headers.get('content-type'), /text\/css/);

    const js = await fetch(`${baseUrl}/assets/js/theme.js`);
    assert.equal(js.status, 200);
    assert.match(js.headers.get('content-type'), /javascript/);
  });

  it('rota inexistente responde 404 com a página de erro', async () => {
    const res = await fetch(`${baseUrl}/nao-existe`);
    assert.equal(res.status, 404);
    assert.match(await res.text(), /Página não encontrada/);
  });
});

describe('segurança', () => {
  it('envia a Content-Security-Policy restritiva', async () => {
    const res = await fetch(`${baseUrl}/login`);
    const csp = res.headers.get('content-security-policy');
    assert.ok(csp, 'cabeçalho CSP ausente');
    assert.match(csp, /script-src 'self'/);
    assert.match(csp, /object-src 'none'/);
    assert.match(csp, /frame-ancestors 'none'/);
  });

  it('não expõe o cabeçalho X-Powered-By', async () => {
    const res = await fetch(`${baseUrl}/login`);
    assert.equal(res.headers.get('x-powered-by'), null);
  });
});
