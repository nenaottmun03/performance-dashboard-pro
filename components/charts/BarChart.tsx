'use client';
import React, { useLayoutEffect, useEffect, useRef } from 'react';
import { useChartRenderer } from '@/hooks/useChartRenderer';
export default function BarChart({ data }) {
  const ref = useRef(null);
  const { renderBars } = useChartRenderer();
  useLayoutEffect(()=>{ if(ref.current) renderBars(ref.current, data); }, [data, renderBars]);
  useEffect(()=>{ let raf=0; const loop=()=>{ if(ref.current) renderBars(ref.current, data); raf=requestAnimationFrame(loop); }; raf=requestAnimationFrame(loop); return ()=>cancelAnimationFrame(raf); }, [data, renderBars]);
  useEffect(()=>{ const el=ref.current; if(!el) return; const ro=new ResizeObserver(()=>{{ if(ref.current) renderBars(ref.current, data); }}); ro.observe(el); return ()=>ro.disconnect(); }, [data, renderBars]);
  return <canvas ref={ref} className="canvas" />;
}
