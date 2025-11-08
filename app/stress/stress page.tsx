"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import usePerfStats, { PerfSample } from "@/hooks/usePerfStats";
import { useDataStream } from "@/hooks/useDataStream";

export default function StressPage() {
  const perf = usePerfStats(500);
  const stream = useDataStream([], { pollMs: 100 }); // ✅ fixed args

  const [running, setRunning] = useState(false);
  const [samples, setSamples] = useState<PerfSample[]>([]);
  const endAt = useRef<number | null>(null);
  const [cfg, setCfg] = useState({
    minutes: 1,
    points: 20000,
    intervalMs: 50,
  });

  const start = () => {
    // ✅ Fixed: removed unsupported 'burst' property
    if (stream.setConfig) {
      stream.setConfig({
        pointLimit: cfg.points,
        intervalMs: cfg.intervalMs,
      });
    }
    setSamples([]);
    endAt.current = Date.now() + cfg.minutes * 60_000;
    setRunning(true);
  };

  useEffect(() => {
    if (running) setSamples((s) => [...s, perf]);
  }, [perf, running]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      if (endAt.current && Date.now() >= endAt.current) setRunning(false);
    }, 250);
    return () => clearInterval(id);
  }, [running]);

  const summary = useMemo(() => {
    if (!samples.length) return null;
    const srt = (a: number[]) => a.slice().sort((x, y) => x - y);
    const avg = (a: number[]) => a.reduce((x, y) => x + y, 0) / a.length;
    const p = (a: number[], q: number) =>
      a[Math.min(a.length - 1, Math.floor(q * a.length))];
    const fps = srt(samples.map((s) => s.fps));
    const fm = srt(samples.map((s) => s.frameMs));
    const heap = srt(samples.map((s) => s.heapMB ?? 0).filter(Boolean));
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
          `${new Date(s.ts).toISOString()},${s.fps.toFixed(2)},${s.frameMs.toFixed(
            2
          )},${s.heapMB ?? ""}`
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
        <label className="flex flex-col">
          Minutes
          <input
            className="bg-slate-800 rounded px-3 py-2"
            type="number"
            value={cfg.minutes}
            onChange={(e) => setCfg((c) => ({ ...c, minutes: +e.target.value }))}
          />
        </label>
        <label className="flex flex-col">
          Target points
          <input
            className="bg-slate-800 rounded px-3 py-2"
            type="number"
            value={cfg.points}
            onChange={(e) => setCfg((c) => ({ ...c, points: +e.target.value }))}
          />
        </label>
        <label className="flex flex-col">
          Interval (ms)
          <input
            className="bg-slate-800 rounded px-3 py-2"
            type="number"
            value={cfg.intervalMs}
            onChange={(e) =>
              setCfg((c) => ({ ...c, intervalMs: +e.target.value }))
            }
          />
        </label>
      </div>

      <div className="flex gap-3">
        <button
          className="rounded-2xl px-4 py-2 bg-cyan-500"
          onClick={start}
          disabled={running}
        >
          Start
        </button>
        <button
          className="rounded-2xl px-4 py-2 bg-slate-700"
          onClick={() => setRunning(false)}
          disabled={!running}
        >
          Stop
        </button>
        <button
          className="rounded-2xl px-4 py-2 bg-slate-700"
          onClick={downloadCSV}
          disabled={!samples.length}
        >
          Download CSV
        </button>
      </div>

      <div className="text-sm opacity-80">
        Live: FPS {perf.fps.toFixed(1)} · Frame {perf.frameMs.toFixed(1)} ms ·
        Heap {perf.heapMB ?? "–"} MB
      </div>

      {summary && (
        <div className="mt-4 space-y-1">
          <div className="text-xl font-medium">Summary</div>
          <div>Samples: {summary.n}</div>
          <div>
            FPS — avg {summary.fpsAvg}, p95 {summary.fpsP95}
          </div>
          <div>
            Frame — avg {summary.frameAvg} ms, p95 {summary.frameP95} ms
          </div>
          {summary.heapAvg !== undefined && (
            <div>
              Heap — avg {summary.heapAvg} MB, max {summary.heapMax} MB
            </div>
          )}
        </div>
      )}
    </div>
  );
}

