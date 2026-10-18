export async function GET() {
  const t0 = Date.now();
  const tf = process.env.TINYFISH_API_KEY
    ? await fetch('https://api.search.tinyfish.ai?query=health+check', { headers: { 'X-API-Key': process.env.TINYFISH_API_KEY } }).then(r => r.ok).catch(() => false) : false;
  const tfMs = Date.now() - t0, t1 = Date.now();
  const gm = process.env.GEMINI_API_KEY
    ? await fetch('https://generativelanguage.googleapis.com/v1beta/models?pageSize=1', { headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY } }).then(r => r.ok).catch(() => false) : false;
  const row = (label: string, ok: boolean, ms: number, set: boolean) => ({ label, status: ok ? 'online' : 'degraded', uptime: set ? (ok ? 'live check OK' : 'check failed') : 'key not set', latency: `${ms}ms` });
  return Response.json([row('TinyFish Web Agent API (Search, Fetch, Agent)', tf, tfMs, !!process.env.TINYFISH_API_KEY), row('Gemini Vision / OCR API', gm, Date.now() - t1, !!process.env.GEMINI_API_KEY)]);
}
