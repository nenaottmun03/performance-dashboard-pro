'use client';
import React, { useLayoutEffect, useEffect, useRef } from 'react';
import { useChartRenderer } from '@/hooks/useChartRenderer';
export default function Heatmap({ data }) {
  const ref = useRef(null);
  const { renderHeatmap } = useChartRenderer();
  useLayoutEffect(()=>{ if(ref.current) renderHeatmap(ref.current, data); }, [data, renderHeatmap]);
  useEffect(()=>{ let raf=0; const loop=()=>{ if(ref.current) renderHeatmap(ref.current, data); raf=requestAnimationFrame(loop); }; raf=requestAnimationFrame(loop); return ()=>cancelAnimationFrame(raf); }, [data, renderHeatmap]);
  useEffect(()=>{ const el=ref.current; if(!el) return; const ro=new ResizeObserver(()=>{{ if(ref.current) renderHeatmap(ref.current, data); }}); ro.observe(el); return ()=>ro.disconnect(); }, [data, renderHeatmap]);
  return <canvas ref={ref} className="canvas" />;
}
