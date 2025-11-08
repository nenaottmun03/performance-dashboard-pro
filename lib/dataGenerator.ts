import { DataPoint } from './types';
export function generateInitialDataset(points = 12000, start = Date.now() - 60_000): DataPoint[] {
  const arr: DataPoint[] = [];
  let v = 60;
  for (let i = 0; i < points; i++) {
    const t = start + i * 6;
    v += Math.sin(i / 200) * 5 + (Math.random() - 0.5) * 2;
    arr.push({ t, v });
  }
  return arr;
}
export function generateNextPoints(lastT: number, count = 1): DataPoint[] {
  const out: DataPoint[] = [];
  let v = 60 + (Math.random() - 0.5) * 10;
  for (let i = 1; i <= count; i++) {
    const t = lastT + i * 100;
    v += Math.sin(t / 1000) * 5 + (Math.random() - 0.5) * 3;
    out.push({ t, v });
  }
  return out;
}
