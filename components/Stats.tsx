import React from 'react';
import { SalesStats } from '../types';
import { CURRENCY_FORMAT } from '../constants';
import { DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';

interface StatsProps {
  stats: SalesStats;
}

export const Stats: React.FC<StatsProps> = ({ stats }) => {
  const cards = [
    {
      title: 'Tổng Doanh Thu',
      value: CURRENCY_FORMAT.format(stats.totalRevenue),
      icon: DollarSign,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/20',
    },
    {
      title: 'Tổng Đơn Hàng',
      value: stats.totalOrders.toLocaleString('vi-VN'),
      icon: ShoppingCart,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/20',
    },
    {
      title: 'Giá Trị TB / Đơn',
      value: CURRENCY_FORMAT.format(stats.averageOrderValue),
      icon: TrendingUp,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => (
        <div 
          key={index} 
          className="group bg-gradient-to-br from-slate-800/80 via-blue-800/60 to-slate-800/80 rounded-2xl shadow-2xl border border-yellow-400/30 p-7 flex items-start justify-between transition-all duration-300 hover:shadow-yellow-400/20 hover:border-yellow-400/50 hover:scale-[1.02] backdrop-blur-xl animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex-1">
            <p className="text-sm font-semibold text-blue-200/80 mb-2 uppercase tracking-wider">{card.title}</p>
            <h3 className="text-3xl font-extrabold bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 bg-clip-text text-transparent leading-tight">
              {card.value}
            </h3>
          </div>
          <div className={`p-4 rounded-xl ${card.bg} border border-yellow-400/40 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
            <card.icon className={`w-7 h-7 ${card.color} group-hover:rotate-12 transition-transform duration-300`} />
          </div>
        </div>
      ))}
    </div>
  );
};