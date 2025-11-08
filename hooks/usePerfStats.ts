"use client";
import { useEffect, useRef, useState } from "react";

export type PerfSample = { ts: number; fps: number; frameMs: number; heapMB?: number };

export default function usePerfStats(sampleEveryMs = 500) {
  const raf = useRef<number | null>(null);
  const last = useRef(performance.now());
  const frames = useRef(0);
  const [s, setS] = useState<PerfSample>({ ts: Date.now(), fps: 0, frameMs: 0, heapMB: undefined });

  useEffect(() => {
    let run = true;
    const loop = (now: number) => {
      frames.current++;
      const dt = now - last.current;
      if (dt >= sampleEveryMs) {
        const fps = (frames.current * 1000) / dt;
        const frameMs = dt / frames.current;
        const mem = (performance as any).memory?.usedJSHeapSize;
        setS({
          ts: Date.now(),
          fps,
          frameMs,
          heapMB: mem ? Math.round((mem / 1048576) * 10) / 10 : undefined,
        });
        frames.current = 0;
        last.current = now;
      }
      if (run) raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => { run = false; if (raf.current) cancelAnimationFrame(raf.current); };
  }, [sampleEveryMs]);

  return s;
}
