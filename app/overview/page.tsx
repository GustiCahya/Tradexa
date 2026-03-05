import { Activity, ArrowUpRight, TrendingUp, DollarSign } from "lucide-react";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "../components/PageAnimate";
import { auth } from "@/auth";
import { getOverviewStats } from "@/lib/services/trade.service";
import TradeTable from "./TradeTable";

export default async function OverviewPage() {
  const session = await auth();

  const data = await getOverviewStats(session?.user?.id || "");

  const stats = [
    { name: "Total PnL", value: data.totalPnl >= 0 ? `+$${data.totalPnl.toFixed(2)}` : `-$${Math.abs(data.totalPnl).toFixed(2)}`, positive: data.totalPnl >= 0, icon: DollarSign },
    { name: "Win Rate", value: `${data.winRate}%`, positive: parseFloat(data.winRate as string) >= 50, icon: TrendingUp },
    { name: "Total Trades", value: data.totalTrades.toString(), positive: true, icon: Activity },
    { name: "Avg RR", value: `${data.avgRr}R`, positive: parseFloat(data.avgRr as string) > 1, icon: ArrowUpRight },
  ];

  const recentTrades = data.recentTrades;
  return (
    <div className="flex-1 max-w-full mx-auto w-full px-6 pt-32 pb-24">
      <FadeIn delay={0.1}>
        <div className="max-w-7xl mx-auto flex items-end justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">Dashboard</h1>
            <p className="text-gray-400">Welcome back. Here is your refined trading performance.</p>
          </div>
          <Link 
            href="/trade-input" 
            className="h-10 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center justify-center transition-colors"
          >
            Log New Trade
          </Link>
        </div>
      </FadeIn>

      {/* Stats Grid */}
      <StaggerContainer className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <StaggerItem key={stat.name}>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-gray-400">{stat.name}</p>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-gray-300" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-2xl font-bold text-white">{stat.value}</h2>
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>

      {/* Extended Trade Table */}
      <FadeIn delay={0.5}>
        <TradeTable trades={recentTrades.map(t => ({...t, day: t.day || '', session: t.session || '', entryTF: t.entryTF || '', rr: t.rr || 0, emotion: t.emotion || 'Neutral', pnl: t.pnl || 0}))} />
      </FadeIn>
    </div>
  );
}
