"use client";
import { useEffect, useMemo, useRef, useState } from "react";

type PerfSample = {
  ts: number;
  fps: number;
  frameMs: number;
  heapMB?: number;
};

// lightweight fps/frametime sampler
function usePerfStats(sampleMs = 500): PerfSample {
  const [s, setS] = useState<PerfSample>({ ts: Date.now(), fps: 0, frameMs: 0 });
  const lastMark = useRef<number>(performance.now());
  const frames = useRef<number>(0);

  useEffect(() => {
    let raf = 0;
    let tid: any = 0;

    const loop = () => {
      frames.current += 1;

      if (!tid) {
        tid = setTimeout(() => {
          const now = performance.now();
          const elapsed = now - lastMark.current;
          const fps = (frames.current * 1000) / Math.max(elapsed, 0.0001);
          const frameMs = 1000 / Math.max(fps, 0.0001);
          const heapMB =
            (performance as any).memory?.usedJSHeapSize
              ? Math.round(((performance as any).memory.usedJSHeapSize / 1024 / 1024) * 10) / 10
              : undefined;

          setS({ ts: Date.now(), fps, frameMs, heapMB });
          lastMark.current = now;
          frames.current = 0;
          tid = 0;
        }, sampleMs);
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      if (tid) clearTimeout(tid);
    };
  }, [sampleMs]);

  return s;
}

export default function StressPage() {
  const perf = usePerfStats(500);

  const [running, setRunning] = useState(false);
  const [samples, setSamples] = useState<PerfSample[]>([]);
  const loadTimer = useRef<number | null>(null);
  const endAt = useRef<number | null>(null);

  const [cfg, setCfg] = useState({
    minutes: 1,
    workItems: 20000,
    intervalMs: 50,
    allocKB: 256,
  });

  const start = () => {
    setSamples([]);
    endAt.current = Date.now() + cfg.minutes * 60_000;
    setRunning(true);

    const tick = () => {
      // CPU work
      let acc = 0;
      for (let i = 0; i < cfg.workItems; i++) {
        acc += Math.sin(i) * Math.cos(i / 3);
      }
      // Memory churn
      const buf = new Uint8Array(cfg.allocKB * 1024);
      buf[0] = acc & 255;
      if (endAt.current && Date.now() >= endAt.current) stop();
    };

    loadTimer.current = window.setInterval(tick, Math.max(10, cfg.intervalMs));
  };

  const stop = () => {
    setRunning(false);
    if (loadTimer.current) {
      clearInterval(loadTimer.current);
      loadTimer.current = null;
    }
  };

  useEffect(() => {
    if (running) setSamples((s) => [...s, perf]);
  }, [perf, running]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      if (endAt.current && Date.now() >= endAt.current) stop();
    }, 250);
    return () => clearInterval(id);
  }, [running]);

  const summary = useMemo(() => {
    if (!samples.length) return null;
    const sort = (a: number[]) => a.slice().sort((x, y) => x - y);
    const avg = (a: number[]) => a.reduce((x, y) => x + y, 0) / a.length;
    const p = (a: number[], q: number) => a[Math.min(a.length - 1, Math.floor(q * a.length))];

    const fps = sort(samples.map((s) => s.fps));
    const fm = sort(samples.map((s) => s.frameMs));
    const heap = sort(samples.map((s) => s.heapMB ?? 0).filter(Boolean));

    return {
      n: samples.length,
      fpsAvg: +avg(fps).toFixed(1),
      fpsP95: +p(fps, 0.95).toFixed(1),
      frameAvg: +avg(fm).toFixed(2),
      frameP95: +p(fm, 0.95).toFixed(2),
      heapAvg: heap.length ? +avg(heap).toFixed(1) : undefined,
      heapMax: heap.length ? +heap.at(-1)!.toFixed(1) : undefined,
    };
  }, [samples]);

  const downloadCSV = () => {
    const header = "timestamp,fps,frame_ms,heap_mb\n";
    const rows = samples
      .map(
        (s) =>
          `${new Date(s.ts).toISOString()},${s.fps.toFixed(2)},${s.frameMs.toFixed(2)},${
            s.heapMB ?? ""
          }`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stress-metrics.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-semibold">Stress Test</h1>

      <div className="grid grid-cols-2 gap-3 max-w-3xl">
        <label className="flex flex-col">Minutes
          <input className="bg-slate-800 rounded px-3 py-2" type="number"
                 min={1} value={cfg.minutes}
                 onChange={(e) => setCfg((c) => ({ ...c, minutes: +e.target.value }))} />
        </label>
        <label className="flex flex-col">Work items (points)
          <input className="bg-slate-800 rounded px-3 py-2" type="number"
                 min={1000} value={cfg.workItems}
                 onChange={(e) => setCfg((c) => ({ ...c, workItems: +e.target.value }))} />
        </label>
        <label className="flex flex-col">Interval (ms)
          <input className="bg-slate-800 rounded px-3 py-2" type="number"
                 min={10} value={cfg.intervalMs}
                 onChange={(e) => setCfg((c) => ({ ...c, intervalMs: +e.target.value }))} />
        </label>
        <label className="flex flex-col">Alloc per tick (KB)
          <input className="bg-slate-800 rounded px-3 py-2" type="number"
                 min={0} value={cfg.allocKB}
                 onChange={(e) => setCfg((c) => ({ ...c, allocKB: +e.target.value }))} />
        </label>
      </div>

      <div className="flex gap-3">
        <button className="rounded-2xl px-4 py-2 bg-cyan-500" onClick={start} disabled={running}>Start</button>
        <button className="rounded-2xl px-4 py-2 bg-slate-700" onClick={stop} disabled={!running}>Stop</button>
        <button className="rounded-2xl px-4 py-2 bg-slate-700" onClick={downloadCSV} disabled={!samples.length}>Download CSV</button>
      </div>

      <div className="text-sm opacity-80">
        Live: FPS {perf.fps.toFixed(1)} · Frame {perf.frameMs.toFixed(1)} ms · Heap {perf.heapMB ?? "–"} MB
      </div>

      {summary && (
        <div className="mt-4 space-y-1">
          <div className="text-xl font-medium">Summary</div>
          <div>Samples: {summary.n}</div>
          <div>FPS — avg {summary.fpsAvg}, p95 {summary.fpsP95}</div>
          <div>Frame — avg {summary.frameAvg} ms, p95 {summary.frameP95} ms</div>
          {summary.heapAvg !== undefined && (
            <div>Heap — avg {summary.heapAvg} MB, max {summary.heapMax} MB</div>
          )}
        </div>
      )}
    </div>
  );
}


