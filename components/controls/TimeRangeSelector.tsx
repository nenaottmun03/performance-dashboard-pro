'use client';
export default function TimeRangeSelector({ onRange }:{ onRange:(m:number)=>void }){
  return (
    <div className="card" style={{display:'flex',gap:8,alignItems:'center'}}>
      <div className="small" style={{fontWeight:700}}>Time</div>
      {[1,5,15,60].map(m=>(<button key={m} className="btn" onClick={()=>onRange(m)}>{m}m</button>))}
    </div>
  );
}
