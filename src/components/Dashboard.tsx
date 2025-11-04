import { useEffect, useState } from 'react';
import { DollarSign, Users, Camera, TrendingUp, RefreshCw, Activity } from 'lucide-react';
import MetricCard from './MetricCard';
import RevenueChart from './RevenueChart';
import ClientLeaderboard from './ClientLeaderboard';
import HeadshotDistribution from './HeadshotDistribution';
import Chatbot from './Chatbot';
import { fetchGoogleSheetsData, calculateMetrics, DashboardMetrics } from '../utils/dataFetcher';

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const data = await fetchGoogleSheetsData();
      const calculatedMetrics = calculateMetrics(data);
      setMetrics(calculatedMetrics);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleChatbotDataUpdate = (data: any) => {
    if (data && typeof data === 'object') {
      setRefreshing(true);
      setTimeout(() => {
        loadData();
      }, 500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-cyan-400 text-lg font-medium">Loading Analytics...</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400">No data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/20 via-slate-950 to-pink-950/20" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzFmMmQzZCIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />

      <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 text-transparent bg-clip-text mb-2">
              Business Analytics Dashboard
            </h1>
            <p className="text-slate-400 flex items-center space-x-2">
              <Activity className="w-4 h-4 text-green-400 animate-pulse" />
              <span>Real-time data from Google Sheets</span>
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="group relative px-6 py-3 bg-slate-900/50 backdrop-blur-xl rounded-xl border border-cyan-500/30 hover:border-cyan-500/50 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center space-x-2">
              <RefreshCw className={`w-5 h-5 text-cyan-400 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="text-white font-medium">Refresh Data</span>
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Revenue"
            value={`${metrics.totalRevenue.toLocaleString()} PKR`}
            icon={DollarSign}
            color="cyan"
            delay={0}
          />
          <MetricCard
            title="Total Clients"
            value={metrics.totalClients}
            icon={Users}
            color="purple"
            delay={100}
          />
          <MetricCard
            title="Total Headshots"
            value={metrics.totalHeadshots}
            icon={Camera}
            color="pink"
            delay={200}
          />
          <MetricCard
            title="Avg Order Value"
            value={`${Math.round(metrics.averageOrderValue).toLocaleString()} PKR`}
            icon={TrendingUp}
            color="green"
            delay={300}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RevenueChart data={metrics.revenueTimeline} />
          <ClientLeaderboard data={metrics.revenueByClient} />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <HeadshotDistribution data={metrics.headshotDistribution} />
        </div>
      </div>

      <Chatbot onDataUpdate={handleChatbotDataUpdate} />
    </div>
  );
}
