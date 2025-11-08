'use client';
import React, { useMemo } from 'react';
import { useData } from '@/components/providers/DataProvider';
export default function DataTable(){
  const { data } = useData();
  const rows = useMemo(()=>data.slice(-50).reverse(),[data]);
  return (
    <div className="card">
      <div style={{fontWeight:700}}>Recent points <span className="small">({data.length.toLocaleString()})</span></div>
      <table className="table">
        <thead><tr><th>Time</th><th>Value</th></tr></thead>
        <tbody>
          {rows.map((d,i)=>(
            <tr key={d.t+i}><td>{new Date(d.t).toLocaleTimeString([], { hour12:false })}</td><td>{d.v.toFixed(2)}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
