import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || '127.0.0.1';
const ollamaUrl = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';
const model = process.env.OLLAMA_MODEL || 'gemma3:4b';
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json' };

function json(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  res.end(JSON.stringify(payload));
}

async function ollama(pathname, options = {}) {
  const response = await fetch(`${ollamaUrl}${pathname}`, { ...options, signal: AbortSignal.timeout(90000) });
  if (!response.ok) throw new Error(`Local model service returned ${response.status}`);
  return response.json();
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    if (url.pathname === '/api/model-status') {
      try {
        const data = await ollama('/api/tags');
        const models = (data.models || []).map((entry) => entry.name);
        json(res, 200, { available: models.includes(model), model, installed: models });
      } catch {
        json(res, 200, { available: false, model, installed: [] });
      }
      return;
    }
    if (url.pathname === '/api/guide' && req.method === 'POST') {
      let raw = '';
      for await (const chunk of req) {
        raw += chunk;
        if (raw.length > 4000) return json(res, 413, { error: 'Request too large' });
      }
      const input = JSON.parse(raw || '{}');
      const moods = ['frazzled', 'low', 'restless', 'steady'];
      const languages = ['en', 'hi'];
      if (!moods.includes(input.mood) || !languages.includes(input.language) || ![5, 10, 15, 20].includes(Number(input.minutes))) return json(res, 400, { error: 'Choose a supported mood, language and walk length.' });
      if (input.language === 'hi') return json(res, 422, { error: 'Hindi guides use locally authored text to preserve natural language quality.' });
      const lang = input.language === 'hi' ? 'Hindi' : 'English';
      const prompt = `Write a gentle, non-clinical audio guide for a ${input.minutes}-minute mindful walk in India. The guide must be spoken in ${lang}. The walker feels ${input.mood}. Write exactly 5 short, natural spoken lines (under 70 words total); each line should stand alone. Include one gentle breathing cue and one sensory cue about ordinary nature. Keep the walker aware of traffic and surroundings. Never diagnose, promise treatment, mention a screen, ask the walker to close their eyes, or suggest unsafe actions. If the language is Hindi, write natural Hindi in Devanagari script only; never use Roman transliteration. Do not introduce yourself, explain your task, add stage directions, or include headings. Return the 5 spoken lines in the required JSON format.`;
      try {
        const format = { type: 'object', properties: { lines: { type: 'array', items: { type: 'string' }, minItems: 5, maxItems: 5 } }, required: ['lines'], additionalProperties: false };
        const result = await ollama('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ model, prompt, format, stream: false, keep_alive: '5m', options: { temperature: 0.45, num_predict: 180 } }) });
        const parsed = JSON.parse(result.response || '{}');
        const lines = parsed.lines?.filter((line) => typeof line === 'string' && line.trim()).map((line) => line.trim());
        if (lines?.length !== 5) throw new Error('The local model did not return five spoken lines.');
        const guide = lines.map((line) => line.replace(/^\d+[.)]\s*/, '')).join('\n');
        json(res, 200, { guide, source: 'gemma', model });
      } catch (error) {
        json(res, 503, { error: 'Gemma is not ready. Start Ollama and install the model to personalize this guide.', detail: error.message });
      }
      return;
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') return json(res, 405, { error: 'Method not allowed' });
    const requested = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
    const filePath = path.resolve(root, `.${requested}`);
    if (!filePath.startsWith(`${root}${path.sep}`)) return json(res, 403, { error: 'Forbidden' });
    const info = await stat(filePath);
    if (!info.isFile()) return json(res, 404, { error: 'Not found' });
    const headers = { 'Content-Type': mime[path.extname(filePath)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-cache' };
    if (path.basename(filePath) === 'sw.js') headers['Service-Worker-Allowed'] = '/';
    res.writeHead(200, headers);
    if (req.method === 'HEAD') return res.end();
    res.end(await readFile(filePath));
  } catch (error) {
    json(res, error.code === 'ENOENT' ? 404 : 500, { error: error.code === 'ENOENT' ? 'Not found' : 'Server error' });
  }
});

server.listen(port, host, () => console.log(`Mind Music Walks is ready at http://${host}:${port}`));

export { server };
