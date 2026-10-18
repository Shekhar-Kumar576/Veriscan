const load = (s: string) => new Promise<HTMLImageElement>((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = s; });

export async function shrink(src: string, max = 1600) {
  const i = await load(src), k = Math.min(1, max / Math.max(i.width, i.height));
  const c = document.createElement("canvas"); c.width = Math.round(i.width * k); c.height = Math.round(i.height * k);
  c.getContext("2d")!.drawImage(i, 0, 0, c.width, c.height);
  return c.toDataURL("image/jpeg", 0.85);
}

/** In-browser ELA hotspot ratio + EXIF/editor signature scan. */
export async function computeForensics(file: File, src: string) {
  const i = await load(src), k = Math.min(1, 800 / Math.max(i.width, i.height));
  const w = Math.round(i.width * k), h = Math.round(i.height * k);
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const x = c.getContext("2d", { willReadFrequently: true })!; x.drawImage(i, 0, 0, w, h);
  const a = x.getImageData(0, 0, w, h).data;
  const j = await load(c.toDataURL("image/jpeg", 0.75)); x.drawImage(j, 0, 0, w, h);
  const b = x.getImageData(0, 0, w, h).data;
  const bw = Math.ceil(w / 16), bl = new Float32Array(bw * Math.ceil(h / 16)), cn = new Float32Array(bl.length);
  for (let p = 0; p < a.length; p += 4) {
    const n = p / 4, bi = Math.floor(n / w / 16) * bw + Math.floor((n % w) / 16);
    bl[bi] += (Math.abs(a[p] - b[p]) + Math.abs(a[p + 1] - b[p + 1]) + Math.abs(a[p + 2] - b[p + 2])) / 3; cn[bi]++;
  }
  const means = Array.from(bl, (v, n) => v / (cn[n] || 1)).sort((x, y) => x - y);
  const head = new TextDecoder("latin1").decode(new Uint8Array(await file.slice(0, 262144).arrayBuffer()));
  return {
    hotspot: means[Math.floor(0.98 * (means.length - 1))] / (means[Math.floor(means.length / 2)] + 0.5),
    editor: (head.match(/Adobe Photoshop|GIMP|Canva|Pixlr|Affinity|Snapseed|PicsArt|Lightroom/i) || [""])[0],
    hasExif: head.includes("Exif"),
  };
}
