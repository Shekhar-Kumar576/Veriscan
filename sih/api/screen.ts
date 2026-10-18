// Vercel serverless function: full document-screening pipeline.
// Gemini = vision OCR/tamper/face. TinyFish = Search + Fetch + Agent (live web verification & watchlist screening).
const TF = () => ({ 'X-API-Key': process.env.TINYFISH_API_KEY || '' });
const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const LABEL: Record<string, string> = { passport: 'Passport', visa: 'Visa', national_id: 'National ID Card', driving_license: 'Driving License', border_permit: 'Border Permit', student_id: 'Student ID Card', other: 'Other Document' };
const inl = (p: any) => ({ inline_data: { mime_type: p.mime, data: p.data } });

async function gemini(parts: any[]): Promise<any> {
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: 'POST', headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY || '', 'content-type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts }], generationConfig: { responseMimeType: 'application/json', temperature: 0.1 } }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error('Gemini: ' + (j.error?.message || r.status));
  const t = (j.candidates?.[0]?.content?.parts || []).map((p: any) => p.text || '').join('');
  const m = t.match(/\{[\s\S]*\}/); if (!m) throw new Error('Gemini returned no JSON');
  return JSON.parse(m[0]);
}

// ICAO 9303 check digits (TD3 passports, line 2 = 44 chars)
const W = [7, 3, 1];
const cv = (c: string) => (c === '<' ? 0 : /\d/.test(c) ? +c : c.charCodeAt(0) - 55);
const chk = (s: string) => [...s].reduce((a, c, i) => a + cv(c) * W[i % 3], 0) % 10;
function mrzCheck(l2: string) {
  l2 = (l2 || '').replace(/\s/g, '').toUpperCase();
  if (l2.length !== 44) return null;
  const d = (i: number) => (l2[i] === '<' ? 0 : +l2[i]);
  const parts = [
    ['passport number', chk(l2.slice(0, 9)) === d(9)], ['date of birth', chk(l2.slice(13, 19)) === d(19)],
    ['expiry date', chk(l2.slice(21, 27)) === d(27)], ['personal number', chk(l2.slice(28, 42)) === d(42)],
    ['composite', chk(l2.slice(0, 10) + l2.slice(13, 20) + l2.slice(21, 43)) === d(43)],
  ] as [string, boolean][];
  return parts.filter(p => !p[1]).map(p => p[0]);
}

// Rule-based field validation (works for any document type, no MRZ needed)
function fieldChecks(fields: any[]) {
  const out: { msg: string; hard: boolean }[] = [];
  const get = (re: RegExp) => fields.find(f => re.test(String(f.label || '').toLowerCase()));
  const dob = get(/birth|dob/);
  if (dob) {
    const m = String(dob.value).match(/(\d{1,4})[-\/.](\d{1,2})[-\/.](\d{1,4})/);
    if (!m) out.push({ msg: `Date of birth "${dob.value}" is not a readable date.`, hard: false });
    else { const [a, b, c] = [+m[1], +m[2], +m[3]]; const [y, mo, d] = a > 31 ? [a, b, c] : [c, b, a]; const dt = new Date(y, mo - 1, d);
      const age = (Date.now() - dt.getTime()) / 3.15576e10;
      if (dt.getMonth() !== mo - 1 || dt.getDate() !== d) out.push({ msg: `Date of birth "${dob.value}" is not a valid calendar date.`, hard: true });
      else if (age < 5 || age > 110) out.push({ msg: `Date of birth implies an implausible age (${Math.round(age)}).`, hard: true }); }
  }
  const mob = get(/mobile|phone|contact/);
  if (mob && /mobile/.test(String(mob.label).toLowerCase())) { const d = String(mob.value).replace(/\D/g, '').replace(/^91(?=\d{10}$)/, ''); if (!/^[6-9]\d{9}$/.test(d)) out.push({ msg: `Mobile number "${mob.value}" is not a valid 10-digit Indian number.`, hard: true }); }
  const em = get(/e-?mail/);
  if (em) { const v = String(em.value).trim().toLowerCase(); const dom = v.split('@')[1] || '';
    if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/.test(v)) out.push({ msg: `E-mail "${em.value}" is malformed.`, hard: true });
    else if (/^(gmall|gmaill|gmial|gnail|gamil|yaho|yahooo|hotmial|outlok)\./.test(dom)) out.push({ msg: `E-mail domain "${dom}" looks like a typo of a common provider.`, hard: true }); }
  const roll = get(/roll|enrol|reg/), ses = get(/session|year|batch/);
  if (roll && ses) { const ry = String(roll.value).match(/(20\d{2})/), sy = String(ses.value).match(/(20\d{2})/);
    if (ry && sy && +ry[1] > +sy[1]) out.push({ msg: `Roll number year ${ry[1]} is later than the session ${ses.value}.`, hard: true }); }
  return out;
}

export async function POST(req: Request) {
  const body = await req.json();
  const enc = new TextEncoder();
  return new Response(new ReadableStream({
    async start(ctl) {
      const send = (o: any) => ctl.enqueue(enc.encode(JSON.stringify(o) + '\n'));
      const stage = (i: number) => send({ t: 'stage', i });
      try {
        if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is not set on the server.');
        if (!process.env.TINYFISH_API_KEY) throw new Error('TINYFISH_API_KEY is not set on the server.');
        const f = body.forensics, docLabel = LABEL[body.docType] || 'Document';

        stage(0);
        const ex = await gemini([inl(body.doc), ...(body.selfie ? [inl(body.selfie)] : []), { text:
`You are a strict, skeptical border-security document examiner. Image 1 is a document the officer selected as "${docLabel}"${body.selfie ? '; image 2 is a live selfie of the person presenting it' : ''}. Report ONLY text actually printed on it; never infer (leave nationality empty unless printed). Look hard for pasted or edited text, mismatched fonts or baselines, photo-edge artifacts, cloned areas, impossible or inconsistent values. Return ONLY JSON:
{"isDocument":true|false,"detectedType":"passport|visa|national_id|driving_license|border_permit|student_id|other","documentNumber":"","subjectName":"","nationality":"","dateOfBirth":"YYYY-MM-DD or empty","issuingAuthority":"","mrzLine2":"exact 44-char MRZ line 2 if visible else empty",
"fields":[{"label":"","value":"exact printed value","confidence":0-100,"flagged":false,"reason":"only if flagged"}],
"checks":[{"checkName":"Photo Substitution","status":"pass|warning|fail","confidence":0-100,"detail":""},{"checkName":"Font Consistency",...},{"checkName":"Watermark & Security Features",...},{"checkName":"Layout & Template Match",...},{"checkName":"Screen / Print Recapture",...}],
"face":{"similarity":${body.selfie ? '0-100 similarity of ID photo to selfie' : 'null'},"livenessScore":${body.selfie ? '0-100 chance the selfie is a real live person, not a photo of a photo' : 'null'},"detail":""}}
Rules: Screen / Print Recapture = FAIL only if the image is a photo of a monitor or phone screen (moire, pixel grid, bezel, window or app interface, cursor) or of a printout/photocopy; a physical plastic card photographed directly, even held in a hand, is normal and PASSES. For ID types that normally carry few security features (student IDs), say so and use pass or warning for Watermark, not fail.` }]);
        if (ex.isDocument === false) throw new Error('This image does not look like an identity document. Please retake it.');
        const KNOWN = ['passport', 'visa', 'national_id', 'driving_license', 'border_permit', 'student_id', 'other'];
        const det = String(ex.detectedType || '').toLowerCase();
        const docType = KNOWN.includes(det) ? det : body.docType;
        const dLabel = LABEL[docType] || 'Document';

        stage(1);
        const bad = docType === 'passport' ? mrzCheck(ex.mrzLine2) : null;
        const checks: any[] = [...(ex.checks || [])];
        if (KNOWN.includes(det) && det !== body.docType) checks.push({ checkName: 'Document Type Match', status: 'fail', confidence: 90, detail: `Officer selected "${docLabel}" but the document reads as "${dLabel}".` });
        const fv = fieldChecks(ex.fields || []);
        checks.push(fv.length ? { checkName: 'Field Format Validation', status: fv.some(x => x.hard) ? 'fail' : 'warning', confidence: 88, detail: fv.map(x => x.msg).join(' ') } : { checkName: 'Field Format Validation', status: 'pass', confidence: 80, detail: 'Dates, phone numbers, e-mail and ID-year consistency passed rule checks.' });
        if (docType === 'passport' || ex.mrzLine2) checks.push(bad === null
          ? { checkName: 'MRZ Checksum Validation', status: 'warning', confidence: 50, detail: 'No complete 44-character MRZ line was readable, so checksums could not be computed.' }
          : bad.length === 0 ? { checkName: 'MRZ Checksum Validation', status: 'pass', confidence: 97, detail: 'All ICAO 9303 check digits match the computed values.' }
          : { checkName: 'MRZ Checksum Validation', status: bad.length > 1 ? 'fail' : 'warning', confidence: bad.length > 1 ? 96 : 70, detail: `Check digit mismatch for: ${bad.join(', ')}.${bad.length === 1 ? ' A single mismatch can also be an OCR misread; verify manually.' : ''}` });

        stage(2);
        if (f) {
          checks.push({ checkName: 'Pixel Forensics (ELA)', status: f.hotspot >= 5 ? 'fail' : f.hotspot >= 3.5 ? 'warning' : 'pass', confidence: 68, detail: `Error-level hotspot ratio ${Number(f.hotspot).toFixed(2)}. High local spikes can indicate pasted or re-compressed regions.` });
          const ed = !!f.editor;
          checks.push({ checkName: 'Metadata Integrity', status: ed ? 'fail' : (!f.hasExif && body.source !== 'camera') ? 'warning' : 'pass', confidence: ed ? 93 : 62,
            detail: ed ? `File carries an image-editor signature (${f.editor}).` : body.source === 'camera' ? 'Live camera capture; no file history expected.' : f.hasExif ? 'Camera metadata present and no editor signature found.' : 'Metadata is stripped, which is common in re-saved or edited files.' });
        }

        stage(3);
        const sim = ex.face?.similarity, live = ex.face?.livenessScore;
        const faceVerification = body.selfie && typeof sim === 'number'
          ? { similarity: clamp(sim), liveness: (live ?? 0) >= 60, livenessScore: clamp(live ?? 0), status: sim >= 70 ? 'match' : sim < 50 ? 'mismatch' : 'inconclusive', detail: ex.face?.detail || `Face similarity ${clamp(sim)}% against the 70% threshold.` }
          : { similarity: 0, liveness: false, livenessScore: 0, status: 'inconclusive', detail: 'No live selfie was captured, so face verification was skipped. Capture a selfie to add this signal.' };

        stage(4);
        const ev: any[] = []; const urls: string[] = [];
        const name = ex.subjectName || '', auth = ex.issuingAuthority || '';
        const cardText = (ex.fields || []).map((x: any) => `${x.label}: ${x.value}`).join('; ').slice(0, 1500);
        const qs: string[] = [];
        if (auth) qs.push(`${auth} official website contact phone address`, `${auth} ${dLabel} format security features`);
        if (name) qs.push(`"${name}" INTERPOL red notice wanted`);
        const searches = await Promise.all(qs.map(q => fetch('https://api.search.tinyfish.ai?query=' + encodeURIComponent(q), { headers: TF() }).then(r => r.json()).catch(() => ({}))));
        searches.forEach(sr => (sr.results || []).slice(0, 2).forEach((r: any) => { if (r.url && !urls.includes(r.url)) urls.push(r.url); }));
        let text = '';
        if (urls.length) {
          const p = await fetch('https://api.fetch.tinyfish.ai', { method: 'POST', headers: { ...TF(), 'content-type': 'application/json' }, body: JSON.stringify({ urls: urls.slice(0, 6), format: 'markdown' }) }).then(r => r.json()).catch(() => ({}));
          text = (p.results || []).map((r: any) => `SOURCE ${r.url}\n${r.text ?? r.markdown ?? r.content ?? ''}`).join('\n\n').slice(0, 16000);
        }
        let web: any = {};
        if (text) web = await gemini([{ text: `Public web pages:\n${text}\n\nPrinted card data: ${cardText}\nIssuer: ${auth}. Subject: ${JSON.stringify({ name, dob: ex.dateOfBirth })}.
Tasks: (1) Does the issuer exist according to the pages? (2) Do contact details printed on the card (phone, address, website, e-mail domain) match the official ones on the pages? Report every mismatch. (3) Does the card's ID format or wording contradict what the pages say? (4) Is the subject on a public wanted listing? Be conservative: a name-only match without agreeing DOB is NOT a confirmed match. Use only the pages.
Return ONLY JSON {"issuerExists":true|false|null,"contactMatches":true|false|null,"contradictions":["..."],"watchlist":{"matched":bool,"confidence":0-100,"listName":"","matchType":"","detail":""},"format":{"valid":true|false|null,"detail":""},"summary":"one line","evidence":[{"source":"site name","url":"","finding":"one line"}]}` }]).catch(() => ({}));
        (web.evidence || []).slice(0, 4).forEach((e: any) => ev.push(e));
        const contra: string[] = web.contradictions || [];
        checks.push(!text
          ? { checkName: 'Issuer Web Verification (TinyFish)', status: 'warning', confidence: 45, detail: 'TinyFish found no usable public pages for this issuer, so printed details could not be cross-checked.' }
          : { checkName: 'Issuer Web Verification (TinyFish)', status: web.issuerExists === false || web.contactMatches === false ? 'fail' : (contra.length || web.format?.valid === false || web.issuerExists !== true) ? 'warning' : 'pass', confidence: 78,
              detail: [web.summary, ...contra].filter(Boolean).join(' ') || 'Issuer and printed contact details are consistent with public sources.' });
        let agentRisk: number | null = null;
        if (body.portalUrl) {
          const res = await fetch('https://agent.tinyfish.ai/v1/automation/run-sse', { method: 'POST', headers: { ...TF(), 'content-type': 'application/json' },
            body: JSON.stringify({ url: body.portalUrl, goal: `Verify this record on the page: name "${name}", document number "${ex.documentNumber}". Do not submit payments or create accounts. Return JSON {"found":true|false,"nameMatches":true|false,"details":"short"}` }) });
          const rd = res.body!.getReader(); const dec = new TextDecoder(); let buf = '', out: any = null;
          for (;;) { const { done, value } = await rd.read(); if (done) break; buf += dec.decode(value, { stream: true }); const ls = buf.split('\n'); buf = ls.pop() || '';
            for (const l of ls) if (l.startsWith('data:')) { try { const e = JSON.parse(l.slice(5)); out = e.resultJson ?? e.result ?? out; } catch {} } }
          if (typeof out === 'string') { try { out = JSON.parse(out); } catch {} }
          agentRisk = out && out.found !== undefined ? (out.found && out.nameMatches !== false ? 0 : 90) : 50;
          ev.push({ source: 'TinyFish Agent (portal check)', url: body.portalUrl, finding: out?.details || 'Agent finished without a clear match result.' });
        }
        const wl = web.watchlist || {};
        const matched = !!wl.matched;
        const watchlistHit = matched ? { matched: true, listName: wl.listName || 'Public wanted-person listing', matchType: wl.matchType || 'Name match (needs confirmation)', severity: (wl.confidence ?? 0) >= 80 ? 'critical' : 'high', detail: (wl.detail || '') + ' Found via TinyFish public-web screening; confirm identity manually before action.' }
          : { matched: false, detail: text ? 'No credible public watchlist match found by TinyFish Search + Fetch.' : 'TinyFish found no usable public pages for this subject.' };

        stage(5);
        const tamper = checks.length ? checks.reduce((a, c) => a + (c.status === 'fail' ? 100 : c.status === 'warning' ? 40 : 0), 0) / checks.length : 40;
        const flagged = (ex.fields || []).length ? (ex.fields as any[]).filter(x => x.flagged).length / ex.fields.length * 100 : 30;
        const sig: [number, number][] = [[tamper, 0.35], [flagged, 0.15], [matched ? ((wl.confidence ?? 0) >= 80 ? 100 : 70) : 0, 0.2], [web.format?.valid === false ? 70 : web.format?.valid === true ? 0 : 20, 0.1]];
        if (body.selfie && typeof sim === 'number') sig.push([100 - sim, 0.2]);
        if (agentRisk !== null) sig.push([agentRisk, 0.2]);
        let risk = sig.reduce((a, s) => a + s[0] * s[1], 0) / sig.reduce((a, s) => a + s[1], 0);
        const fails = checks.filter(c => c.status === 'fail'), warns = checks.filter(c => c.status === 'warning');
        if (fails.length) risk = Math.max(risk, fails.some(c => c.confidence >= 80) ? 65 : 55);
        if (fails.length >= 2) risk = Math.max(risk, 75);
        if (warns.length >= 3) risk = Math.max(risk, 40);
        if (matched) risk = Math.max(risk, 60);
        if (checks.some(c => c.checkName === 'MRZ Checksum Validation' && c.status === 'fail')) risk = Math.max(risk, 55);
        risk = clamp(risk);
        const riskLevel = risk < 15 ? 'clear' : risk < 35 ? 'low' : risk < 55 ? 'medium' : risk < 75 ? 'high' : 'critical';
        const action = { clear: 'Clear to proceed. Standard entry processing.', low: 'Proceed with routine officer discretion; note minor observations.', medium: 'Refer to secondary screening and verify the flagged items manually.', high: 'Hold subject and escalate to supervisor for manual document examination.', critical: 'Detain for supervisor review. Do not rely on this tool alone; confirm identity through official channels.' }[riskLevel];
        const issues = [...checks.filter(c => c.status !== 'pass').map(c => `${c.checkName}: ${c.detail}`), ...(matched ? [watchlistHit.detail!] : [])];
        const now = new Date().toISOString();
        send({ t: 'result', result: {
          id: '', submittedAt: now, completedAt: now, documentType: docType, documentNumber: ex.documentNumber || 'UNREADABLE', subjectName: name || 'Unknown', nationality: ex.nationality || '', dateOfBirth: ex.dateOfBirth || '',
          checkpoint: '', officerId: '', officerName: '', riskLevel, status: riskLevel === 'clear' || riskLevel === 'low' ? 'verified' : 'flagged', overallScore: 100 - risk,
          ocrFields: ex.fields || [], tamperingChecks: checks, faceVerification, watchlistHit,
          aiNarrative: `${dLabel} for ${name || 'unknown subject'} scored ${100 - risk}/100 trust. ` + (issues.length ? 'Findings: ' + issues.slice(0, 4).join(' ') : 'No anomalies were detected.') + (web.format?.detail ? ` Web check: ${web.format.detail}` : ''),
          recommendedAction: action, webEvidence: ev, engine: { vision: 'gemini', web: 'tinyfish', sourcesChecked: urls.length },
        } });
      } catch (e: any) { send({ t: 'error', m: String(e?.message || e) }); }
      ctl.close();
    },
  }), { headers: { 'content-type': 'application/x-ndjson' } });
}
