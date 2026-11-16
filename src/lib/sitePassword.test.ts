import { test } from 'node:test';
import assert from 'node:assert/strict';
import { accessToken, safeNextPath, sameToken } from './sitePassword.ts';

test('o token depende da senha e não contém a senha', async () => {
  const a = await accessToken('kunai');
  assert.match(a, /^[0-9a-f]{64}$/);
  assert.equal(a, await accessToken('kunai'));
  assert.notEqual(a, await accessToken('shuriken'));
  assert.ok(!a.includes('kunai'));
});

test('sameToken compara tokens', () => {
  assert.ok(sameToken('abc', 'abc'));
  assert.ok(!sameToken('abc', 'abd'));
  assert.ok(!sameToken('abc', 'abcd'));
});

test('safeNextPath só aceita caminhos internos', () => {
  assert.equal(safeNextPath('/salas/123?x=1'), '/salas/123?x=1');
  assert.equal(safeNextPath(null), '/');
  assert.equal(safeNextPath('https://evil.com'), '/');
  assert.equal(safeNextPath('//evil.com'), '/');
  assert.equal(safeNextPath('/\\evil.com'), '/');
  assert.equal(safeNextPath('/entrar'), '/');
});
