import { useEffect, useState } from 'react';

interface DataPoint {
  index: number;
  revenue: number;
}

interface RevenueChartProps {
  data: DataPoint[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const [animatedData, setAnimatedData] = useState<number[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedData(data.map(d => d.revenue));
    }, 300);
    return () => clearTimeout(timer);
  }, [data]);

  if (data.length === 0) return null;

  const maxRevenue = Math.max(...data.map(d => d.revenue));
  const minRevenue = Math.min(...data.map(d => d.revenue));
  const range = maxRevenue - minRevenue || 1;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-slate-900/40 backdrop-blur-xl p-6 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Revenue Trends</h3>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse" />
            <span className="text-xs text-slate-400">Live Data</span>
          </div>
        </div>

        <div className="relative h-64">
          <div className="absolute inset-0 flex items-end justify-between space-x-2">
            {data.map((point, index) => {
              const height = ((point.revenue - minRevenue) / range) * 100;
              const animatedHeight = animatedData.length > 0 ? height : 0;

              return (
                <div
                  key={index}
                  className="flex-1 group relative"
                >
                  <div
                    className="relative bg-gradient-to-t from-cyan-500 to-cyan-300 rounded-t-lg transition-all duration-1000 ease-out hover:from-pink-500 hover:to-pink-300"
                    style={{
                      height: `${animatedHeight}%`,
                      transitionDelay: `${index * 50}ms`,
                      boxShadow: '0 0 20px rgba(6, 182, 212, 0.5)'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="bg-slate-800/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-cyan-500/30 whitespace-nowrap">
                      <p className="text-xs text-slate-400">Order {point.index}</p>
                      <p className="text-sm font-bold text-cyan-400">{point.revenue.toLocaleString()} PKR</p>
                    </div>
                  </div>

                  <div className="text-center mt-2">
                    <span className="text-xs text-slate-500">{point.index}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center space-x-4 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-gradient-to-t from-cyan-500 to-cyan-300" />
            <span>Revenue per Order</span>
          </div>
        </div>
      </div>
    </div>
  );
}
