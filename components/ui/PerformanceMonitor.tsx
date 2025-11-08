'use client';
import { useEffect, useRef, useState } from 'react';
import { createFpsCounter, getMemoryMB } from '@/lib/performanceUtils';
export default function PerformanceMonitor(){
  const [metrics, setMetrics] = useState({ fps:0, memMB: undefined, lastRenderMs:0 });
  const fpsFn = useRef(createFpsCounter());
  const last = useRef(performance.now());
  useEffect(()=>{ let raf=0; const loop=()=>{ const now=performance.now(); const dt=now-last.current; last.current=now; const fps=fpsFn.current(); const mem=getMemoryMB(); setMetrics({ fps, memMB: mem, lastRenderMs: Math.round(dt) }); raf=requestAnimationFrame(loop); }; raf=requestAnimationFrame(loop); return ()=>cancelAnimationFrame(raf); },[]);
  return (<div className="hud"><div className="card"><div style={{display:'flex',flexDirection:'column'}}><div style={{fontSize:12,color:'rgba(200,240,255,0.9)'}}>FPS</div><div style={{fontWeight:700,fontSize:20}}>{metrics.fps}</div></div><div style={{display:'flex',flexDirection:'column'}}><div className="small">Frame (ms)</div><div style={{fontWeight:700}}>{metrics.lastRenderMs}</div></div><div style={{display:'flex',flexDirection:'column'}}><div className="small">Heap (MB)</div><div style={{fontWeight:700}}>{metrics.memMB ?? 'n/a'}</div></div></div></div>);
}
