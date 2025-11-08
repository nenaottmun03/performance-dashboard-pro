'use client';
import { useEffect, useMemo, useReducer, useRef, useCallback } from 'react';
import { DataPoint } from '@/lib/types';

type State = { data: DataPoint[]; lastT: number; maxPoints: number; interval: number };
type Action =
  | { type: 'append'; pts: DataPoint[] }
  | { type: 'setMaxPoints'; value: number }
  | { type: 'setInterval'; value: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'append': {
      if (!action.pts.length) return state;
      const data = state.data.concat(action.pts);
      const overflow = Math.max(0, data.length - state.maxPoints);
      return {
        data: overflow ? data.slice(overflow) : data,
        lastT: action.pts[action.pts.length - 1].t,
        maxPoints: state.maxPoints,
        interval: state.interval,
      };
    }
    case 'setMaxPoints':
      return { ...state, maxPoints: action.value };
    case 'setInterval':
      return { ...state, interval: action.value };
  }
}

export function useDataStream(initial: DataPoint[], cfg?: { pollMs?: number }) {
  const [{ data, lastT, maxPoints, interval }, dispatch] = useReducer(reducer, {
    data: initial,
    lastT: initial.at(-1)?.t ?? Date.now(),
    maxPoints: Math.max(10000, initial.length),
    interval: cfg?.pollMs ?? 100,
  });

  const batchRef = useRef<DataPoint[]>([]);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      if (batchRef.current.length) {
        dispatch({ type: 'append', pts: batchRef.current });
        batchRef.current = [];
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch(`/api/data?since=${lastT}&count=1`, { cache: 'no-store' });
        if (!res.ok) return;
        const json = await res.json();
        if (Array.isArray(json.points) && json.points.length) {
          batchRef.current.push(...json.points);
        }
      } catch (e) {}
    };
    const id = setInterval(poll, interval);
    return () => clearInterval(id);
  }, [lastT, interval]);

  const setMaxPoints = useCallback((value: number) => {
    dispatch({ type: 'setMaxPoints', value });
  }, []);

  const setConfig = useCallback(
    (cfg: { pointLimit?: number; intervalMs?: number }) => {
      if (cfg.pointLimit) dispatch({ type: 'setMaxPoints', value: cfg.pointLimit });
      if (cfg.intervalMs) dispatch({ type: 'setInterval', value: cfg.intervalMs });
    },
    []
  );

  return useMemo(() => ({ data, maxPoints, setMaxPoints, setConfig }), [data, maxPoints, setMaxPoints, setConfig]);
}
