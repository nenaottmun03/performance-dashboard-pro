"use client";
import React, { useLayoutEffect, useEffect, useRef } from "react";
import { useChartRenderer } from "@/hooks/useChartRenderer";
import type { DataPoint } from "@/lib/types";

type BarChartProps = {
  data: DataPoint[];              // ✅ type the prop
};

export default function BarChart({ data }: BarChartProps) {
  const ref = useRef<HTMLCanvasElement | null>(null);   // ✅ type the ref
  const { renderBars } = useChartRenderer();

  useLayoutEffect(() => {
    if (ref.current && renderBars) renderBars(ref.current, data);
  }, [data, renderBars]);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      if (ref.current && renderBars) renderBars(ref.current, data);
      raf = window.requestAnimationFrame(loop);
    };
    raf = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(raf);
  }, [data, renderBars]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      if (ref.current && renderBars) renderBars(ref.current, data);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [data, renderBars]);

  return <canvas ref={ref} className="canvas" />;
}
