import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { SaleRecord, FieldMapping } from '../types';
import { CURRENCY_FORMAT } from '../constants';

interface SalesChartProps {
  data: SaleRecord[];
  mapping: FieldMapping;
}

interface ChartGroupItem {
  displayDate: string;
  amount: number;
  rawDate: Date;
}

export const SalesChart: React.FC<SalesChartProps> = ({ data, mapping }) => {
  const chartData = useMemo(() => {
    if (!mapping.dateField || !mapping.amountField) return [];

    // Group by day
    const grouped = data.reduce((acc, curr) => {
      const dateVal = curr[mapping.dateField];
      const amountVal = curr[mapping.amountField];

      // Parse Date
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return acc;

      // Parse Amount (handle strings like "100,000")
      let amount = 0;
      if (typeof amountVal === 'number') amount = amountVal;
      else if (typeof amountVal === 'string') amount = parseFloat(amountVal.replace(/,/g, '')) || 0;

      const dateKey = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
      const sortKey = d.toISOString().split('T')[0];
      
      if (!acc[sortKey]) {
        acc[sortKey] = {
            displayDate: dateKey,
            amount: 0,
            rawDate: d
        };
      }
      acc[sortKey].amount += amount;
      return acc;
    }, {} as Record<string, ChartGroupItem>);

    return (Object.values(grouped) as ChartGroupItem[])
      .sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime())
      .map(item => ({
          date: item.displayDate,
          amount: item.amount
      }))
      .slice(-15);
  }, [data, mapping]);

  if (data.length === 0) return null;

  return (
    <div className="glass p-7 rounded-2xl shadow-2xl border border-yellow-400/30 mb-8 h-[380px] glow-yellow-hover animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent">
          Biểu đồ doanh thu
        </h3>
        <span className="text-xs text-blue-300/60 font-medium bg-blue-900/40 px-3 py-1 rounded-lg border border-yellow-400/20">
          {mapping.dateField || 'Ngày'}
        </span>
      </div>
      <div className="w-full h-[280px]">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(251, 191, 36, 0.1)" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#fef3c7', fontSize: 11, fontWeight: 500 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#fef3c7', fontSize: 11, fontWeight: 500 }} 
                tickFormatter={(value) => {
                  if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
                  if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`;
                  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                  return value;
                }}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(251, 191, 36, 0.1)' }}
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: '2px solid rgba(251, 191, 36, 0.4)', 
                  background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
                  backdropFilter: 'blur(20px)',
                  color: '#fef3c7', 
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 20px rgba(251, 191, 36, 0.3)',
                  padding: '12px 16px',
                  fontWeight: 600
                }}
                formatter={(value: number) => [CURRENCY_FORMAT.format(value), 'Doanh thu']}
              />
              <Bar 
                dataKey="amount" 
                fill="url(#colorGradient)"
                radius={[8, 8, 0, 0]} 
                barSize={45}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fcd34d" />
                  <stop offset="50%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-yellow-200/70">
            <div className="text-center">
              <p className="text-sm font-medium">Không thể xác định cột Ngày hoặc Thành tiền để vẽ biểu đồ.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};