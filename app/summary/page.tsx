"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Cell } from 'recharts';
import { ArrowLeft, Target, TrendingUp, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { FadeIn, StaggerContainer, StaggerItem } from '../components/PageAnimate';

import { useEffect, useState } from 'react';

// Define the shape of the analytics data returned by the API
interface AnalyticsData {
  pnlCurve: { day: string; pnl: number }[];
  rrBySession: { name: string; avgRR: number }[];
  psychology: {
    mostFrequentEmotion: string;
    mostFrequentEmotionPercentage: number;
    worstSession: string;
    worstSessionAvgRr: number;
  };
}

export default function SummaryPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch('/api/trades/summary');
        if (response.ok) {
          const json = await response.json();
          setData(json);
        }
      } catch (error) {
        console.error("Failed to load analytics", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchAnalytics();
  }, []);

  if (isLoading) {
     return (
        <div className="flex-1 max-w-7xl mx-auto w-full px-6 pt-32 pb-24 flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        </div>
     );
  }

  // Fallback defaults if no data exists yet
  const analytics = data || {
    pnlCurve: [],
    rrBySession: [],
    psychology: {
        mostFrequentEmotion: "N/A",
        mostFrequentEmotionPercentage: 0,
        worstSession: "N/A",
        worstSessionAvgRr: 0
    }
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-6 pt-32 pb-24">
      <FadeIn delay={0.1}>
        <Link href="/overview" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
      </FadeIn>
      
      <FadeIn delay={0.2}>
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">Analytics</h1>
          <p className="text-gray-400">Trading is 10% strategy and 90% psychology. Analyze your edge.</p>
        </div>
      </FadeIn>

      <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Cumulative PnL Curve */}
        <StaggerItem>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold text-lg text-white">Cumulative Performance</h3>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.pnlCurve} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <Line type="monotone" dataKey="pnl" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                  <CartesianGrid stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="day" stroke="#4b5563" axisLine={false} tickLine={false} />
                  <YAxis stroke="#4b5563" axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff10', borderRadius: '12px' }}
                    itemStyle={{ color: '#3b82f6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </StaggerItem>

        {/* Average RR by Session Bar Chart */}
        <StaggerItem>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl">
             <div className="flex items-center gap-3 mb-6">
              <Target className="w-5 h-5 text-emerald-400" />
              <h3 className="font-semibold text-lg text-white">Average RR by Session</h3>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.rrBySession} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="name" stroke="#4b5563" axisLine={false} tickLine={false} />
                  <YAxis stroke="#4b5563" axisLine={false} tickLine={false} tickFormatter={(value) => `${value}R`} />
                  <Tooltip 
                    cursor={{ fill: '#ffffff05' }}
                    contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  />
                  <Bar dataKey="avgRR" radius={[6, 6, 0, 0]}>
                    {analytics.rrBySession.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.avgRR > 2 ? '#10b981' : '#3b82f6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </StaggerItem>
      </StaggerContainer>
      
      {/* Psychological Section */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StaggerItem>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <p className="text-sm text-gray-400 mb-2">Most Frequent Emotion</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">{analytics.psychology.mostFrequentEmotion}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">{analytics.psychology.mostFrequentEmotionPercentage}% of trades</span>
            </div>
          </div>
        </StaggerItem>
        
        <StaggerItem>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <p className="text-sm text-gray-400 mb-2">Worst Session (by RR)</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">{analytics.psychology.worstSession}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">{analytics.psychology.worstSessionAvgRr}R Avg</span>
            </div>
          </div>
        </StaggerItem>

        <StaggerItem>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
               <AlertTriangle className="w-6 h-6 text-blue-400" />
             </div>
             <div>
               <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Insight</p>
               <p className="text-sm text-gray-300">Stick to London/NY for higher RR setups.</p>
             </div>
          </div>
        </StaggerItem>
      </StaggerContainer>
    </div>
  );
}
