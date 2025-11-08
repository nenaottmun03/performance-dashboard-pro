'use client';
import { useCallback } from 'react';
import { resizeCanvas, computeViewport } from '@/lib/canvasUtils';
export function useChartRenderer() {
  const renderLine = useCallback((canvas: HTMLCanvasElement, data: any[]) => {
    const { ctx, width, height } = resizeCanvas(canvas);
    ctx.clearRect(0,0,width,height);
    if (!data.length) return;
    const vp = computeViewport(data);
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = 'rgba(0,224,255,0.95)';
    ctx.shadowBlur = 12; ctx.shadowColor = 'rgba(0,200,255,0.35)';
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      const x = ((data[i].t - vp.minT) / (vp.maxT - vp.minT)) * width;
      const y = height - ((data[i].v - vp.minV) / (vp.maxV - vp.minV)) * height;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
  }, []);

  const renderBars = useCallback((canvas: HTMLCanvasElement, data: any[]) => {
    const { ctx, width, height } = resizeCanvas(canvas);
    ctx.clearRect(0,0,width,height);
    if (!data.length) return;
    const vp = computeViewport(data);
    const barW = Math.max(1, width / Math.max(1, data.length));
    const grad = ctx.createLinearGradient(0,0,0,height);
    grad.addColorStop(0,'rgba(0,224,255,0.9)'); grad.addColorStop(1,'rgba(0,120,255,0.5)');
    ctx.fillStyle = grad; ctx.shadowBlur = 8; ctx.shadowColor = 'rgba(0,160,255,0.25)';
    for (let i=0;i<data.length;i++){ const x = Math.floor(((data[i].t - vp.minT)/(vp.maxT-vp.minT))*width); const y = height - ((data[i].v - vp.minV)/(vp.maxV-vp.minV))*height; ctx.fillRect(x, y, barW, height - y); }
    ctx.shadowBlur = 0;
  }, []);

  const renderScatter = useCallback((canvas: HTMLCanvasElement, data: any[]) => {
    const { ctx, width, height } = resizeCanvas(canvas);
    ctx.clearRect(0,0,width,height);
    if (!data.length) return;
    const vp = computeViewport(data);
    ctx.fillStyle = 'rgba(96,165,250,0.95)';
    ctx.shadowBlur = 6; ctx.shadowColor = 'rgba(0,140,255,0.3)';
    for (let i=0;i<data.length;i++){ const x = ((data[i].t - vp.minT)/(vp.maxT-vp.minT))*width; const y = height - ((data[i].v - vp.minV)/(vp.maxV-vp.minV))*height; ctx.fillRect(x-1,y-1,2,2); }
    ctx.shadowBlur = 0;
  }, []);

  const renderHeatmap = useCallback((canvas: HTMLCanvasElement, data: any[]) => {
    const { ctx, width, height } = resizeCanvas(canvas);
    ctx.clearRect(0,0,width,height);
    if (!data.length) return;
    const vp = computeViewport(data);
    const cols = 64, rows = 32, cellW = width/cols, cellH = height/rows;
    const grid = Array.from({length: rows}, ()=>Array(cols).fill(0));
    for (const d of data) {
      const cx = Math.min(cols-1, Math.max(0, Math.floor(((d.t - vp.minT)/(vp.maxT-vp.minT))*width / cellW)));
      const cy = Math.min(rows-1, Math.max(0, Math.floor((height - ((d.v - vp.minV)/(vp.maxV-vp.minV))*height)/cellH)));
      grid[cy][cx] += 1;
    }
    const max = grid.flat().reduce((a,b)=>Math.max(a,b),1);
    for (let r=0;r<rows;r++) for (let c=0;c<cols;c++){
      const alpha = Math.min(1, grid[r][c]/max);
      ctx.fillStyle = `rgba(37,99,235,${alpha})`; ctx.fillRect(c*cellW, r*cellH, Math.ceil(cellW)+1, Math.ceil(cellH)+1);
    }
  }, []);

  return { renderLine, renderBars, renderScatter, renderHeatmap };
}
