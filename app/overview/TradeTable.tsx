"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Brain, ArrowDown, ArrowUp, ArrowUpDown, Filter } from "lucide-react";

interface Trade {
  id: string;
  pair: string;
  date: string | Date;
  day: string;
  session: string;
  entryTF: string;
  direction: string;
  rr: number;
  emotion: string;
  pnl: number;
}

export default function TradeTable({ trades }: { trades: Trade[] }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Trade | '', direction: 'asc' | 'desc' | null }>({ key: 'date', direction: 'desc' });

  const [filters, setFilters] = useState({
    pairs: [] as string[],
    sessions: [] as string[],
    tfs: [] as string[],
    direction: 'Both',
    rrMin: '',
    rrMax: '',
    pnl: 'All', 
    dateFrom: '',
    dateTo: '',
  });

  const uniquePairs = Array.from(new Set(trades.map(t => t.pair)));
  const uniqueSessions = Array.from(new Set(trades.map(t => t.session).filter(Boolean)));
  const uniqueTfs = Array.from(new Set(trades.map(t => t.entryTF).filter(Boolean)));

  const filteredTrades = useMemo(() => {
    return trades.filter(trade => {
       if (filters.pairs.length > 0 && !filters.pairs.includes(trade.pair)) return false;
       if (filters.sessions.length > 0 && !filters.sessions.includes(trade.session)) return false;
       if (filters.tfs.length > 0 && !filters.tfs.includes(trade.entryTF)) return false;
       if (filters.direction !== 'Both' && trade.direction !== filters.direction) return false;
       
       if (filters.rrMin && trade.rr < parseFloat(filters.rrMin)) return false;
       if (filters.rrMax && trade.rr > parseFloat(filters.rrMax)) return false;
       
       if (filters.pnl === 'Winning Trades' && trade.pnl <= 0) return false;
       if (filters.pnl === 'Losing Trades' && trade.pnl >= 0) return false;
       if (filters.pnl === 'Breakeven' && trade.pnl !== 0) return false;
       
       if (filters.dateFrom && new Date(trade.date) < new Date(filters.dateFrom)) return false;
       if (filters.dateTo && new Date(trade.date) > new Date(filters.dateTo + 'T23:59:59')) return false;

       return true;
    });
  }, [trades, filters]);

  const sortedTrades = useMemo(() => {
     const sortableItems = [...filteredTrades];
     if (sortConfig.key && sortConfig.direction !== null) {
        sortableItems.sort((a, b) => {
           let aVal = a[sortConfig.key as keyof Trade];
           let bVal = b[sortConfig.key as keyof Trade];
           
           if (sortConfig.key === 'date') {
              aVal = new Date(aVal as string).getTime();
              bVal = new Date(bVal as string).getTime();
           }

           if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
           if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
           return 0;
        });
     }
     return sortableItems;
  }, [filteredTrades, sortConfig]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100;
  
  const totalPages = Math.ceil(sortedTrades.length / itemsPerPage);
  const paginatedTrades = sortedTrades.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const resetFilters = () => {
     setFilters({ pairs: [], sessions: [], tfs: [], direction: 'Both', rrMin: '', rrMax: '', pnl: 'All', dateFrom: '', dateTo: '' });
     setSortConfig({ key: 'date', direction: 'desc' });
     setCurrentPage(1);
  };
  
  const requestSort = (key: keyof Trade) => {
    let direction: 'asc' | 'desc' | null = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    else if (sortConfig.key === key && sortConfig.direction === 'desc') direction = null;

    if (direction === null) {
       setSortConfig({ key: 'date', direction: 'desc' });
    } else {
       setSortConfig({ key, direction });
    }
  };

  const getSortIcon = (key: keyof Trade) => {
    if (sortConfig.key !== key || sortConfig.direction === null) return <ArrowUpDown className="w-3 h-3 text-gray-500 inline ml-1" />;
    return sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3 text-blue-400 inline ml-1" /> : <ArrowDown className="w-3 h-3 text-blue-400 inline ml-1" />;
  };

  const toggleFilterArray = (key: 'pairs' | 'sessions' | 'tfs', value: string) => {
    setFilters(prev => {
        const arr = prev[key];
        return { ...prev, [key]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] };
    });
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
      <div className="px-6 py-5 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between bg-white/[0.02] gap-4">
        <h3 className="font-medium text-lg text-white">Refined Trade History</h3>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)} 
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isFilterOpen ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
          >
            <Filter className="w-4 h-4" /> Filters {Object.values(filters).some(v => Array.isArray(v) ? v.length > 0 : v !== 'Both' && v !== 'All' && v !== '') && `(Active)`}
          </button>
          <Link href="/summary" className="text-sm text-blue-400 hover:text-blue-300 ml-2">View Analytics</Link>
        </div>
      </div>

      {isFilterOpen && (
        <div className="p-6 border-b border-white/10 bg-white/[0.01] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-xs text-gray-400 font-medium">Pairs</label>
            <div className="flex flex-wrap gap-2">
              {uniquePairs.map(p => (
                 <button key={p} onClick={() => toggleFilterArray('pairs', p)} className={`text-xs px-2 py-1 rounded transition-colors ${filters.pairs.includes(p) ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>{p}</button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs text-gray-400 font-medium">Sessions & TFs</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {uniqueSessions.map(s => (
                 <button key={s} onClick={() => toggleFilterArray('sessions', s)} className={`text-xs px-2 py-1 rounded transition-colors ${filters.sessions.includes(s) ? 'bg-indigo-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>{s}</button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {uniqueTfs.map(t => (
                 <button key={t} onClick={() => toggleFilterArray('tfs', t)} className={`text-xs px-2 py-1 rounded transition-colors ${filters.tfs.includes(t) ? 'bg-teal-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>{t}</button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
               <label className="text-xs text-gray-400 font-medium">Direction</label>
               <select value={filters.direction} onChange={e => setFilters({...filters, direction: e.target.value})} className="w-full h-8 px-2 bg-black/40 border border-white/10 rounded text-sm text-white focus:outline-none">
                 <option value="Both">Both</option>
                 <option value="LONG">Long</option>
                 <option value="SHORT">Short</option>
               </select>
            </div>
            <div className="space-y-2">
               <label className="text-xs text-gray-400 font-medium">PnL State</label>
               <select value={filters.pnl} onChange={e => setFilters({...filters, pnl: e.target.value})} className="w-full h-8 px-2 bg-black/40 border border-white/10 rounded text-sm text-white focus:outline-none">
                 <option value="All">All Trades</option>
                 <option value="Winning Trades">Winning Trades</option>
                 <option value="Losing Trades">Losing Trades</option>
                 <option value="Breakeven">Breakeven</option>
               </select>
            </div>
          </div>

          <div className="space-y-4">
             <div className="space-y-2">
               <label className="text-xs text-gray-400 font-medium">Date Range</label>
               <div className="flex gap-2">
                 <input type="date" value={filters.dateFrom} style={{ colorScheme: 'dark' }} onChange={e => setFilters({...filters, dateFrom: e.target.value})} className="w-full h-8 px-2 bg-black/40 border border-white/10 rounded text-xs text-white focus:outline-none" />
                 <input type="date" value={filters.dateTo} style={{ colorScheme: 'dark' }} onChange={e => setFilters({...filters, dateTo: e.target.value})} className="w-full h-8 px-2 bg-black/40 border border-white/10 rounded text-xs text-white focus:outline-none" />
               </div>
             </div>
             <div className="space-y-2">
               <label className="text-xs text-gray-400 font-medium">RR Range</label>
               <div className="flex gap-2">
                 <input type="number" placeholder="Min RR" value={filters.rrMin} onChange={e => setFilters({...filters, rrMin: e.target.value})} className="w-full h-8 px-2 bg-black/40 border border-white/10 rounded text-xs text-white focus:outline-none placeholder-gray-600" />
                 <input type="number" placeholder="Max RR" value={filters.rrMax} onChange={e => setFilters({...filters, rrMax: e.target.value})} className="w-full h-8 px-2 bg-black/40 border border-white/10 rounded text-xs text-white focus:outline-none placeholder-gray-600" />
               </div>
             </div>
          </div>

          <div className="col-span-full flex justify-end">
             <button onClick={resetFilters} className="text-sm text-gray-400 hover:text-white transition-colors">Reset All Filters</button>
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-400 bg-white/5 uppercase border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-medium cursor-pointer select-none hover:text-white transition-colors" onClick={() => requestSort('date')}>Date / Day {getSortIcon('date')}</th>
              <th className="px-6 py-4 font-medium cursor-pointer select-none hover:text-white transition-colors" onClick={() => requestSort('pair')}>Pair {getSortIcon('pair')}</th>
              <th className="px-6 py-4 font-medium cursor-pointer select-none hover:text-white transition-colors" onClick={() => requestSort('session')}>Session {getSortIcon('session')}</th>
              <th className="px-6 py-4 font-medium cursor-pointer select-none hover:text-white transition-colors" onClick={() => requestSort('entryTF')}>TF {getSortIcon('entryTF')}</th>
              <th className="px-6 py-4 font-medium cursor-pointer select-none hover:text-white transition-colors" onClick={() => requestSort('direction')}>Dir {getSortIcon('direction')}</th>
              <th className="px-6 py-4 font-medium cursor-pointer select-none hover:text-white transition-colors" onClick={() => requestSort('rr')}>RR {getSortIcon('rr')}</th>
              <th className="px-6 py-4 font-medium cursor-pointer select-none hover:text-white transition-colors" onClick={() => requestSort('emotion')}>Mindset {getSortIcon('emotion')}</th>
              <th className="px-6 py-4 font-medium cursor-pointer select-none hover:text-white transition-colors text-right" onClick={() => requestSort('pnl')}>PnL {getSortIcon('pnl')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {paginatedTrades.map((trade) => {
              const isPositive = (trade.pnl || 0) > 0;
              return (
              <tr key={trade.id} className="hover:bg-white/[0.04] transition-all group relative">
                <td className="px-6 py-4">
                  <Link href={`/trade-input?id=${trade.id}`} className="absolute inset-0 z-0" aria-label={`Edit trade ${trade.pair}`}></Link>
                  <div className="text-white font-medium relative z-10 pointer-events-none">{new Date(trade.date).toLocaleDateString()}</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider relative z-10 pointer-events-none">{trade.day}</div>
                </td>
                <td className="px-6 py-4 font-semibold text-blue-400 relative z-10 pointer-events-none">{trade.pair}</td>
                <td className="px-6 py-4 relative z-10 pointer-events-none">
                  <span className="text-gray-300">{trade.session}</span>
                </td>
                <td className="px-6 py-4 relative z-10 pointer-events-none">
                  <span className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-gray-400 border border-white/10">{trade.entryTF}</span>
                </td>
                <td className="px-6 py-4 relative z-10 pointer-events-none">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${trade.direction === 'LONG' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                    {trade.direction}
                  </span>
                </td>
                <td className="px-6 py-4 relative z-10 pointer-events-none">
                  <span className={`font-mono font-bold ${Number(trade.rr) > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {trade.rr}R
                  </span>
                </td>

                <td className="px-6 py-4 relative z-10 pointer-events-none">
                  <div className="flex items-center gap-2">
                     <Brain className="w-3 h-3 text-purple-400" />
                     <span className="text-xs text-gray-400 italic">{trade.emotion}</span>
                  </div>
                </td>
                <td className={`px-6 py-4 text-right font-bold relative z-10 pointer-events-none ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isPositive ? `+$${trade.pnl?.toFixed(2)}` : `-$${Math.abs(trade.pnl || 0).toFixed(2)}`}
                </td>
              </tr>
            )})}
            {paginatedTrades.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                   No trades match the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
         <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between text-sm">
            <span className="text-gray-400">Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedTrades.length)} of {sortedTrades.length} entries</span>
            <div className="flex gap-2">
               <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-3 py-1 bg-white/5 border border-white/10 rounded hover:bg-white/10 disabled:opacity-50 text-white">Previous</button>
               <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1 bg-white/5 border border-white/10 rounded hover:bg-white/10 disabled:opacity-50 text-white">Next</button>
            </div>
         </div>
      )}
    </div>
  );
}
