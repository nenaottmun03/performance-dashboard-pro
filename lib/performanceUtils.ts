export function createFpsCounter(){ let last=performance.now(); let frames=0; let fps=0; return ()=>{ const now=performance.now(); frames++; if(now-last>=1000){ fps=frames; frames=0; last=now; } return fps; } }
export function getMemoryMB(){ const p:any=performance as any; if(p?.memory?.usedJSHeapSize) return Math.round((p.memory.usedJSHeapSize/1048576)*10)/10; return undefined; }
