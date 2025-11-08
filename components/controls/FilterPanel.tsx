'use client';
import React, { useState } from 'react';
import { useData } from '@/components/providers/DataProvider';
export default function FilterPanel(){
  const { setMaxPoints, maxPoints } = useData();
  const [v, setV] = useState(maxPoints);
  return (
    <div className="card" style={{display:'flex',gap:8,alignItems:'center'}}>
      <div className="small" style={{fontWeight:700}}>Controls</div>
      <input className="input" type="number" value={v} onChange={(e)=>setV(Number(e.target.value))} />
      <button className="btn" onClick={()=>setMaxPoints(v)}>Apply</button>
    </div>
  );
}
