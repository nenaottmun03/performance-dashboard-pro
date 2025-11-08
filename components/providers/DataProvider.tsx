'use client';
import React, { createContext, useContext } from 'react';
import { DataPoint } from '@/lib/types';
import { useDataStream } from '@/hooks/useDataStream';
type Ctx = { data: DataPoint[]; maxPoints: number; setMaxPoints: (n:number)=>void };
const DataCtx = createContext<Ctx | null>(null);
export function WithData({ initial, children }: { initial: DataPoint[]; children: React.ReactNode }) {
  const value = useDataStream(initial);
  return <DataCtx.Provider value={value as any}>{children}</DataCtx.Provider>;
}
export function useData() { const ctx = useContext(DataCtx); if(!ctx) throw new Error('useData must be inside provider'); return ctx; }
