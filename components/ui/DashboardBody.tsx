'use client';
import LineChart from '@/components/charts/LineChart';
import BarChart from '@/components/charts/BarChart';
import ScatterPlot from '@/components/charts/ScatterPlot';
import Heatmap from '@/components/charts/Heatmap';
import PerformanceMonitor from '@/components/ui/PerformanceMonitor';
import DataTable from '@/components/ui/DataTable';
import FilterPanel from '@/components/controls/FilterPanel';
import TimeRangeSelector from '@/components/controls/TimeRangeSelector';
import { useData } from '@/components/providers/DataProvider';

export default function DashboardBody(){
  const { data } = useData();
  return (
    <>
      <div className="header" style={{alignItems:'flex-start'}}>
        <div>
          <div className="title">Performance Dashboard Pro</div>
          <div className="underline" />
        </div>
        <div className="controls">
          <FilterPanel />
          <TimeRangeSelector onRange={()=>{}} />
        </div>
      </div>

      <div className="grid grid-cols-2">
        <div className="card"><div style={{fontWeight:700}}>Line</div><LineChart data={data} /></div>
        <div className="card"><div style={{fontWeight:700}}>Bar</div><BarChart data={data} /></div>
      </div>

      <div className="grid grid-cols-2" style={{marginTop:12}}>
        <div className="card"><div style={{fontWeight:700}}>Scatter</div><ScatterPlot data={data} /></div>
        <div className="card"><div style={{fontWeight:700}}>Heatmap</div><Heatmap data={data} /></div>
      </div>

      <div style={{display:'flex',gap:12,marginTop:18,alignItems:'flex-start'}}>
        <div style={{flex:1}}>
          <DataTable />
        </div>
        <div style={{width:300}}>
          <PerformanceMonitor />
        </div>
      </div>
    </>
  );
}
