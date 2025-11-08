# Performance Metrics Report

**Live Demo:** https://performance-dashboard-pro-vrnb.vercel.app  
**Stress Test:** https://performance-dashboard-pro-vrnb.vercel.app/stress

## Environment
- Device: i5 12th Gen, 16GB RAM (Windows)
- Browser: Chrome (latest)
- Framework: Next.js 14.2.5 (Canvas rendering)
- Deployment: Vercel

## Test Procedure
1. Open `/stress`
2. Default config: points=12000, interval=100ms, duration=1 min
3. Click **Start**, wait until it stops
4. Note summary metrics and/or **Download CSV**

## Results (example – replace with yours)
| Test | Points | Interval | Duration | Avg FPS | p95 FPS | Avg Frame (ms) | p95 Frame (ms) | Heap Max (MB) |
|------|--------|----------|----------|---------|---------|----------------|----------------|---------------|
| Default | 12,000 | 100 ms | 1 min | 59.8 | 52.1 | 17.4 | 22.9 | 46.8 |
| Heavy   | 20,000 | 50 ms  | 1 min | 35.2 | 29.7 | 28.5 | 34.4 | 82.1 |

## Observations
- Stable ~60 FPS under default load
- Predictable memory growth under heavy load
- Frame-time recovers after bursts; no leaks seen

## How to Reproduce
- Run locally or use `/stress` on production
- CSV export attached (if submitting as artifact)
