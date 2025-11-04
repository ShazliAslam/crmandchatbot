import { Camera } from 'lucide-react';
import { useEffect, useState } from 'react';

interface DistributionData {
  count: number;
  clients: number;
}

interface HeadshotDistributionProps {
  data: DistributionData[];
}

export default function HeadshotDistribution({ data }: HeadshotDistributionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const maxClients = data.length > 0 ? Math.max(...data.map(d => d.clients)) : 1;
  const totalClients = data.reduce((sum, d) => sum + d.clients, 0);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-purple-500/30 bg-slate-900/40 backdrop-blur-xl p-6 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent" />

      <div className="relative z-10">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 rounded-lg bg-purple-500/10">
            <Camera className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-lg font-bold text-white">Headshot Distribution</h3>
        </div>

        <div className="space-y-6">
          {data.map((item, index) => {
            const percentage = (item.clients / maxClients) * 100;
            const clientPercentage = totalClients > 0 ? (item.clients / totalClients) * 100 : 0;
            const delay = index * 100;

            return (
              <div
                key={item.count}
                className={`transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${delay}ms` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-slate-800/50 rounded-lg px-3 py-1 border border-purple-500/20">
                      <span className="text-purple-400 font-bold">{item.count}</span>
                      <span className="text-slate-400 text-sm ml-1">shots</span>
                    </div>
                    <span className="text-slate-300">{item.clients} client{item.clients !== 1 ? 's' : ''}</span>
                  </div>
                  <span className="text-purple-400 font-medium text-sm">{clientPercentage.toFixed(0)}%</span>
                </div>

                <div className="relative">
                  <div className="h-3 bg-slate-800/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full transition-all duration-1000 ease-out relative"
                      style={{
                        width: isVisible ? `${percentage}%` : '0%',
                        transitionDelay: `${delay + 200}ms`,
                        boxShadow: '0 0 15px rgba(168, 85, 247, 0.5)'
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                    </div>
                  </div>

                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-purple-500/0 blur-xl" />
                </div>
              </div>
            );
          })}
        </div>

        {data.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            No distribution data available
          </div>
        )}
      </div>
    </div>
  );
}
