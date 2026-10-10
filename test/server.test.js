import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

test('serves the app and validates its local AI API', async (t) => {
  const port = 20000 + Math.floor(Math.random() * 20000);
  const base = `http://127.0.0.1:${port}`;
  const child = spawn(process.execPath, ['server.mjs'], { env: { ...process.env, PORT: String(port), OLLAMA_URL: 'http://127.0.0.1:1' }, stdio: 'ignore' });
  t.after(() => child.kill());
  let ready = false;
  for (let i = 0; i < 40; i++) {
    try { if ((await fetch(base)).ok) { ready = true; break; } } catch { await delay(100); }
  }
  assert.equal(ready, true, 'server starts on configured port');
  const html = await fetch(base).then((response) => response.text());
  assert.match(html, /Let the world/);
  assert.match(html, /walkScreen/);
  assert.match(html, /clearNotes/);
  assert.equal((await fetch(`${base}/styles.css`)).status, 200);
  assert.equal((await fetch(`${base}/missing.js`)).status, 404);
  const model = await fetch(`${base}/api/model-status`).then((response) => response.json());
  assert.equal(model.available, false);
  assert.equal(model.model, 'gemma3:4b');
  const invalid = await fetch(`${base}/api/guide`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mood: 'diagnosis', language: 'en', minutes: 10 }) });
  assert.equal(invalid.status, 400);
  const hindi = await fetch(`${base}/api/guide`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mood: 'steady', language: 'hi', minutes: 10 }) });
  assert.equal(hindi.status, 422);
  const offline = await fetch(`${base}/api/guide`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mood: 'steady', language: 'en', minutes: 10 }) });
  assert.equal(offline.status, 503);
  assert.match((await offline.json()).error, /Gemma is not ready/);
});
