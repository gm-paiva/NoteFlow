// Garante que o front-end continua compatível com a CSP e sem links quebrados.
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const PUBLIC_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public');
const pages = readdirSync(PUBLIC_DIR).filter((file) => file.endsWith('.html'));

describe('páginas HTML', () => {
  for (const page of pages) {
    const html = readFileSync(path.join(PUBLIC_DIR, page), 'utf8');

    it(`${page}: não usa handlers (onclick=...) nem style="" inline`, () => {
      assert.doesNotMatch(html, /\son[a-z]+\s*=/i, 'atributo de evento inline encontrado');
      assert.doesNotMatch(html, /\sstyle\s*=/i, 'atributo style inline encontrado');
    });

    it(`${page}: todos os arquivos referenciados em /assets existem`, () => {
      const refs = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((m) => m[1]);
      for (const ref of refs) {
        assert.ok(existsSync(path.join(PUBLIC_DIR, ref)), `arquivo não encontrado: ${ref}`);
      }
    });
  }
});
