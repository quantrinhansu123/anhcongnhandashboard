import React, { useState, useMemo } from 'react';
import { SaleRecord } from '../types';
import { Search, Filter, Download, ArrowUpDown, X } from 'lucide-react';

interface SalesTableProps {
  data: SaleRecord[];
  isLoading: boolean;
  dateField?: string; // Optional: Only for generic use, not filtering anymore
  hiddenColumns?: string[]; // Fields to hide
  filterColumns?: string[]; // Fields to show dropdown filters for
}

export const SalesTable: React.FC<SalesTableProps> = ({ 
  data, 
  isLoading, 
  hiddenColumns = [], 
  filterColumns = [] 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  const itemsPerPage = 10;

  // Base hidden columns that are always hidden
  const baseHiddenColumns = ['_id'];
  
  // Combine base and prop-provided hidden columns
  const effectiveHiddenColumns = useMemo(() => {
    return [...baseHiddenColumns, ...hiddenColumns];
  }, [hiddenColumns]);

  // Dynamically determine columns from the first row of data
  const columns = useMemo(() => {
    if (data.length === 0) return [];
    // Exclude hidden columns
    return Object.keys(data[0]).filter(k => !effectiveHiddenColumns.includes(k));
  }, [data, effectiveHiddenColumns]);

  // Generate options for filter columns
  const filterOptions = useMemo(() => {
    const options: Record<string, string[]> = {};
    filterColumns.forEach(col => {
      // Fix: Explicitly filter strings to avoid TS inferring unknown[] from filter(Boolean)
      const values = data.map(item => String(item[col] || ''));
      const unique = new Set<string>(values.filter((val) => val !== ''));
      options[col] = Array.from(unique).sort();
    });
    return options;
  }, [data, filterColumns]);

  // Filter Logic (Search & Column Drops Only - Date filtering is now done by Parent)
  const filteredData = data.filter(item => {
    // 1. Text Search
    let matchesSearch = true;
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      matchesSearch = columns.some(col => String(item[col] || '').toLowerCase().includes(lowerTerm));
    }

    // 2. Column Filters (Dropdowns)
    let matchesFilters = true;
    for (const [key, value] of Object.entries(activeFilters)) {
      if (value && String(item[key] || '') !== value) {
        matchesFilters = false;
        break;
      }
    }

    return matchesSearch && matchesFilters;
  });

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilters]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const clearFilters = () => {
    setSearchTerm('');
    setActiveFilters({});
  };

  const hasFilters = searchTerm || Object.keys(activeFilters).length > 0;

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-blue-800/70 to-teal-800/70 rounded-xl shadow-xl border border-yellow-400/40 p-8 flex flex-col items-center justify-center h-64 backdrop-blur-sm">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-400 mb-4"></div>
        <p className="text-yellow-200">Đang tải dữ liệu thực tế...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-gradient-to-br from-blue-800/70 to-teal-800/70 rounded-xl shadow-xl border border-yellow-400/40 p-8 text-center text-yellow-200 backdrop-blur-sm">
        Không có dữ liệu nào được tìm thấy.
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl shadow-2xl border border-yellow-400/30 flex flex-col glow-yellow-hover animate-fade-in overflow-hidden">
      {/* Table Header / Toolbar */}
      <div className="p-6 border-b border-yellow-400/20 bg-gradient-to-r from-slate-800/50 to-blue-800/50 flex flex-col gap-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-400/20 rounded-lg border border-yellow-400/30">
              <TableIcon className="w-5 h-5 text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent">
              Dữ liệu chi tiết
            </h3>
          </div>
          
          <div className="flex gap-2">
            <button className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-yellow-400/20 to-yellow-500/10 text-yellow-300 border border-yellow-400/40 rounded-xl text-sm font-semibold hover:from-yellow-400/30 hover:to-yellow-500/20 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
              <Download className="w-4 h-4 group-hover:animate-bounce" />
              <span className="hidden sm:inline">Xuất Excel</span>
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center bg-slate-800/40 p-4 rounded-xl border border-yellow-400/20 flex-wrap backdrop-blur-sm">
          {/* Text Search */}
          <div className="relative flex-1 min-w-[200px] w-full lg:w-auto">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400/70 pointer-events-none" />
            <input 
              type="text" 
              placeholder="Tìm kiếm từ khóa..." 
              className="pl-11 pr-4 py-2.5 bg-slate-800/70 border border-yellow-400/30 text-blue-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 w-full backdrop-blur-sm shadow-lg hover:border-yellow-400/50 transition-all placeholder:text-blue-300/40"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Dynamic Column Filters */}
          {filterColumns.map((col) => (
             <div key={col} className="w-full sm:w-auto min-w-[150px]">
               <select
                 className="w-full px-4 py-2.5 bg-slate-800/70 border border-yellow-400/30 text-blue-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 backdrop-blur-sm shadow-lg hover:border-yellow-400/50 transition-all cursor-pointer"
                 value={activeFilters[col] || ''}
                 onChange={(e) => setActiveFilters(prev => ({ ...prev, [col]: e.target.value }))}
               >
                 <option value="" className="bg-slate-800">-- {col} --</option>
                 {filterOptions[col]?.map(opt => (
                   <option key={opt} value={opt} className="bg-slate-800">{opt}</option>
                 ))}
               </select>
             </div>
          ))}

          {/* Clear Filter Button */}
          {hasFilters && (
            <button 
              onClick={clearFilters}
              className="group flex items-center gap-2 px-4 py-2.5 text-yellow-300 hover:bg-yellow-400/20 border border-yellow-400/40 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105"
            >
              <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              <span>Xóa lọc</span>
            </button>
          )}
        </div>
      </div>

      {/* Dynamic Data Table */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-gradient-to-r from-slate-800/80 to-blue-800/60 text-yellow-300 text-xs uppercase font-bold tracking-wider border-b border-yellow-400/30 backdrop-blur-sm">
              {columns.map((col) => (
                <th key={col} className="px-6 py-4 border-b border-yellow-400/30 min-w-[150px] sticky top-0 z-10">
                  <div className="flex items-center gap-2">
                    <span>{col}</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-yellow-400/60 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-yellow-400/5 text-sm">
            {currentData.length > 0 ? (
              currentData.map((record, idx) => (
                <tr 
                  key={record._id} 
                  className="group hover:bg-gradient-to-r hover:from-blue-800/30 hover:to-slate-800/30 transition-all duration-200 border-b border-yellow-400/5"
                  style={{ animationDelay: `${idx * 0.02}s` }}
                >
                  {columns.map((col) => (
                    <td key={`${record._id}-${col}`} className="px-6 py-4 text-blue-100/90 font-medium group-hover:text-yellow-200 transition-colors">
                      {String(record[col] !== undefined && record[col] !== null ? record[col] : '')}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="p-4 bg-yellow-400/10 rounded-full border border-yellow-400/20">
                      <Filter className="w-10 h-10 text-yellow-400/60" />
                    </div>
                    <p className="text-yellow-200/80 font-medium">Không tìm thấy dữ liệu phù hợp với bộ lọc.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-5 border-t border-yellow-400/20 bg-gradient-to-r from-slate-800/50 to-blue-800/50 flex items-center justify-between backdrop-blur-sm">
        <p className="text-sm text-blue-200/80 font-medium">
          Hiển thị <span className="font-bold text-yellow-300">{filteredData.length > 0 ? startIndex + 1 : 0}</span> đến <span className="font-bold text-yellow-300">{Math.min(startIndex + itemsPerPage, filteredData.length)}</span> trong tổng số <span className="font-bold text-yellow-300">{filteredData.length}</span>
        </p>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-yellow-400/40 rounded-xl hover:bg-yellow-400/20 disabled:opacity-30 disabled:cursor-not-allowed text-sm font-semibold text-yellow-300 transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
          >
            Trước
          </button>
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-4 py-2 border border-yellow-400/40 rounded-xl hover:bg-yellow-400/20 disabled:opacity-30 disabled:cursor-not-allowed text-sm font-semibold text-yellow-300 transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
};