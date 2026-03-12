import { NextResponse } from 'next/server';
import { getUserId } from '@/lib/auth-utils';
import { getSummaryAnalytics } from '@/lib/services/trade.service';

export async function GET(request: Request) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const analytics = await getSummaryAnalytics(userId);

    return NextResponse.json(analytics, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch summary analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch summary analytics.' }, { status: 500 });
  }
}
