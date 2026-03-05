import { prisma } from "../prisma";
import { CreateTradeInput } from "../../types/schema";

export async function createTrade(userId: string, data: CreateTradeInput) {
  return await prisma.trade.create({
    data: {
      userId,
      pair: data.pair,
      date: new Date(data.date),
      session: data.session,
      entryTF: data.entryTF,
      direction: data.direction,
      pnl: data.pnl ? parseFloat(String(data.pnl)) : 0,
      rr: data.rr ? parseFloat(String(data.rr)) : 0,
      day: data.day,
      emotion: data.emotion,
      notes: data.notes,
    },
  });
}

export async function getOverviewStats(userId: string) {
  const trades = await prisma.trade.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
  });

  const totalTrades = trades.length;

  let totalPnl = 0;
  let winningTrades = 0;
  let totalRr = 0;

  for (const trade of trades) {
    totalPnl += trade.pnl || 0;
    if ((trade.pnl || 0) > 0) {
      winningTrades++;
    }
    totalRr += trade.rr || 0;
  }

  const winRate = totalTrades > 0 ? ((winningTrades / totalTrades) * 100).toFixed(1) : 0;
  const avgRr = totalTrades > 0 ? (totalRr / totalTrades).toFixed(2) : 0;

  return {
    totalPnl,
    winRate,
    totalTrades,
    avgRr,
    // Provide all trades for the client-side table
    recentTrades: trades,
  };
}

export async function getSummaryAnalytics(userId: string) {
  const trades = await prisma.trade.findMany({
    where: { userId },
    orderBy: { date: 'asc' }, // Ascending for cumulative graph
  });

  // Calculate Cumulative PnL Curve
  let currentPnl = 0;
  const pnlCurveMap = new Map<string, number>();

  for (const trade of trades) {
    const dayName = trade.day || new Date(trade.date).toLocaleDateString('en-US', { weekday: 'short' });
    const shortDay = dayName.substring(0, 3);
    currentPnl += trade.pnl || 0;
    // Overwrite the day with the latest cumulative PnL for that day
    pnlCurveMap.set(shortDay, currentPnl);
  }

  const pnlCurve = Array.from(pnlCurveMap).map(([day, pnl]) => ({ day, pnl }));

  // Calculate Avg RR By Session
  const sessionStats: Record<string, { sum: number; count: number }> = {};

  // Calculate Emotion Frequencies
  const emotionStats: Record<string, number> = {};

  for (const trade of trades) {
    // Session stats
    if (trade.session) {
      if (!sessionStats[trade.session]) {
        sessionStats[trade.session] = { sum: 0, count: 0 };
      }
      sessionStats[trade.session].sum += trade.rr || 0;
      sessionStats[trade.session].count += 1;
    }

    // Emotion stats
    if (trade.emotion) {
      emotionStats[trade.emotion] = (emotionStats[trade.emotion] || 0) + 1;
    }
  }

  const totalTrades = trades.length;

  // Format Avg RR by Session
  const rrBySession = Object.entries(sessionStats).map(([name, data]) => ({
    name,
    avgRR: parseFloat((data.sum / data.count).toFixed(2)),
  }));

  // Find most frequent emotion
  let mostFrequentEmotion = "None";
  let maxEmotionCount = 0;

  for (const [emotion, count] of Object.entries(emotionStats)) {
    if (count > maxEmotionCount) {
      maxEmotionCount = count;
      mostFrequentEmotion = emotion;
    }
  }

  const mostFrequentEmotionPercentage = totalTrades > 0 ? Math.round((maxEmotionCount / totalTrades) * 100) : 0;

  // Find worst session by average RR
  let worstSession = "None";
  let lowestAvgRr = Infinity;

  for (const session of rrBySession) {
    if (session.avgRR < lowestAvgRr) {
      lowestAvgRr = session.avgRR;
      worstSession = session.name;
    }
  }

  if (lowestAvgRr === Infinity) lowestAvgRr = 0;

  return {
    pnlCurve,
    rrBySession,
    psychology: {
      mostFrequentEmotion,
      mostFrequentEmotionPercentage,
      worstSession,
      worstSessionAvgRr: lowestAvgRr
    }
  };
}

export async function deleteTrade(userId: string, tradeId: string) {
  // Verify the trade belongs to the user before deleting
  const trade = await prisma.trade.findFirst({ where: { id: tradeId, userId } });
  if (!trade) return null;
  return prisma.trade.delete({ where: { id: tradeId } });
}

export async function getTrade(userId: string, tradeId: string) {
  return await prisma.trade.findFirst({
    where: { id: tradeId, userId }
  });
}

export async function updateTrade(userId: string, tradeId: string, data: CreateTradeInput) {
  return await prisma.trade.update({
    where: { id: tradeId, userId },
    data: {
      pair: data.pair,
      date: new Date(data.date),
      session: data.session,
      entryTF: data.entryTF,
      direction: data.direction,
      pnl: data.pnl ? parseFloat(String(data.pnl)) : 0,
      rr: data.rr ? parseFloat(String(data.rr)) : 0,
      day: data.day,
      emotion: data.emotion,
      notes: data.notes,
    },
  });
}
