'use client';
import React, { useLayoutEffect, useEffect, useRef } from 'react';
import { useChartRenderer } from '@/hooks/useChartRenderer';
export default function ScatterPlot({ data }) {
  const ref = useRef(null);
  const { renderScatter } = useChartRenderer();
  useLayoutEffect(()=>{ if(ref.current) renderScatter(ref.current, data); }, [data, renderScatter]);
  useEffect(()=>{ let raf=0; const loop=()=>{ if(ref.current) renderScatter(ref.current, data); raf=requestAnimationFrame(loop); }; raf=requestAnimationFrame(loop); return ()=>cancelAnimationFrame(raf); }, [data, renderScatter]);
  useEffect(()=>{ const el=ref.current; if(!el) return; const ro=new ResizeObserver(()=>{{ if(ref.current) renderScatter(ref.current, data); }}); ro.observe(el); return ()=>ro.disconnect(); }, [data, renderScatter]);
  return <canvas ref={ref} className="canvas" />;
}
