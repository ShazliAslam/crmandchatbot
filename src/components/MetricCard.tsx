import { LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  delay?: number;
  color: 'cyan' | 'purple' | 'pink' | 'green';
}

const colorClasses = {
  cyan: {
    border: 'border-cyan-500/30',
    glow: 'shadow-cyan-500/20',
    icon: 'bg-cyan-500/10 text-cyan-400',
    gradient: 'from-cyan-500/10 to-transparent'
  },
  purple: {
    border: 'border-purple-500/30',
    glow: 'shadow-purple-500/20',
    icon: 'bg-purple-500/10 text-purple-400',
    gradient: 'from-purple-500/10 to-transparent'
  },
  pink: {
    border: 'border-pink-500/30',
    glow: 'shadow-pink-500/20',
    icon: 'bg-pink-500/10 text-pink-400',
    gradient: 'from-pink-500/10 to-transparent'
  },
  green: {
    border: 'border-green-500/30',
    glow: 'shadow-green-500/20',
    icon: 'bg-green-500/10 text-green-400',
    gradient: 'from-green-500/10 to-transparent'
  }
};

export default function MetricCard({ title, value, icon: Icon, trend, delay = 0, color }: MetricCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const colors = colorClasses[color];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${colors.border} bg-slate-900/40 backdrop-blur-xl p-6
        transition-all duration-700 hover:scale-105 hover:shadow-2xl ${colors.glow}
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-50`} />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${colors.icon} transition-transform duration-300 hover:scale-110`}>
            <Icon className="w-6 h-6" />
          </div>
          {trend && (
            <span className="text-sm text-green-400 font-medium">{trend}</span>
          )}
        </div>

        <h3 className="text-sm font-medium text-slate-400 mb-2">{title}</h3>
        <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
      </div>

      <div className={`absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-tl ${colors.gradient} rounded-full blur-2xl opacity-30`} />
    </div>
  );
}
