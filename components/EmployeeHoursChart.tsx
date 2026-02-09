import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

interface EmployeeStats {
  name: string;
  totalHours: number;
  daysWorked: number;
}

interface EmployeeHoursChartProps {
  data: EmployeeStats[];
}

export const EmployeeHoursChart: React.FC<EmployeeHoursChartProps> = ({ data }) => {
  if (data.length === 0) return null;

  // Take top 20 employees to avoid overcrowding if list is huge
  const chartData = [...data].sort((a, b) => b.totalHours - a.totalHours).slice(0, 20);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-8">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Biểu đồ tổng giờ công (Top 20)</h3>
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} stroke="#f1f5f9" />
            <XAxis type="number" tick={{ fill: '#64748b', fontSize: 12 }} />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={120} 
              tick={{ fill: '#64748b', fontSize: 11 }}
              interval={0}
            />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              formatter={(value: number) => [`${value.toFixed(1)} giờ`, 'Tổng giờ']}
            />
            <Bar dataKey="totalHours" radius={[0, 4, 4, 0]} barSize={20}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.totalHours >= 160 ? '#10b981' : '#3b82f6'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};