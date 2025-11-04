import { Crown, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ClientData {
  client: string;
  revenue: number;
}

interface ClientLeaderboardProps {
  data: ClientData[];
}

export default function ClientLeaderboard({ data }: ClientLeaderboardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const topClients = data.slice(0, 5);
  const maxRevenue = topClients.length > 0 ? topClients[0].revenue : 1;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-pink-500/30 bg-slate-900/40 backdrop-blur-xl p-6 hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-pink-500/10">
              <Crown className="w-5 h-5 text-pink-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Top Clients</h3>
          </div>
          <TrendingUp className="w-5 h-5 text-pink-400" />
        </div>

        <div className="space-y-4">
          {topClients.map((client, index) => {
            const percentage = (client.revenue / maxRevenue) * 100;
            const delay = index * 100;

            return (
              <div
                key={client.client}
                className={`relative transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                }`}
                style={{ transitionDelay: `${delay}ms` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                      ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-slate-900' :
                        index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-500 text-slate-900' :
                        index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-white' :
                        'bg-slate-700 text-slate-300'}
                    `}>
                      {index + 1}
                    </div>
                    <span className="text-white font-medium capitalize">{client.client}</span>
                  </div>
                  <span className="text-pink-400 font-bold">{client.revenue.toLocaleString()} PKR</span>
                </div>

                <div className="relative h-2 bg-slate-800/50 rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: isVisible ? `${percentage}%` : '0%',
                      transitionDelay: `${delay + 200}ms`,
                      boxShadow: '0 0 10px rgba(236, 72, 153, 0.5)'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {topClients.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            No client data available
          </div>
        )}
      </div>
    </div>
  );
}
