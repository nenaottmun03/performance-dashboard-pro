"use client";
import React, { useLayoutEffect, useEffect, useRef } from "react";
import { useChartRenderer } from "@/hooks/useChartRenderer";
import type { DataPoint } from "@/lib/types"; // ✅ Import DataPoint type

type LineChartProps = {
  data: DataPoint[]; // ✅ Strongly type the data prop
};

export default function LineChart({ data }: LineChartProps) {
  const ref = useRef<HTMLCanvasElement | null>(null); // ✅ Typed ref
  const { renderLine } = useChartRenderer();

  useLayoutEffect(() => {
    if (ref.current && renderLine) renderLine(ref.current, data);
  }, [data, renderLine]);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      if (ref.current && renderLine) renderLine(ref.current, data);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [data, renderLine]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      if (ref.current && renderLine) renderLine(ref.current, data);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [data, renderLine]);

  return <canvas ref={ref} className="canvas" />;
}

