import { DataPoint } from './types';
export function resizeCanvas(canvas: HTMLCanvasElement, dpr = devicePixelRatio) {
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.floor(rect.width));
  const height = Math.max(1, Math.floor(rect.height));
  if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
    canvas.width = width * dpr;
    canvas.height = height * dpr;
  }
  const ctx = canvas.getContext('2d')!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width, height };
}
export function computeViewport(data: DataPoint[], pad = 0.05) {
  const minT = data.length ? data[0].t : Date.now() - 10000;
  const maxT = data.length ? data[data.length - 1].t : Date.now();
  let minV = Infinity, maxV = -Infinity;
  for (const d of data) { if (d.v < minV) minV = d.v; if (d.v > maxV) maxV = d.v; }
  if (!isFinite(minV) || !isFinite(maxV)) { minV = 0; maxV = 1; }
  const padAmt = (maxV - minV) * pad || 1;
  return { minT, maxT, minV: minV - padAmt, maxV: maxV + padAmt };
}
