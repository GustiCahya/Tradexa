import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getTrade } from '@/lib/services/trade.service';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const p = await params;

    const trade = await getTrade(session.user.id, p.id);
    if (!trade) {
      return NextResponse.json({ error: 'Trade not found' }, { status: 404 });
    }

    return NextResponse.json(trade);
  } catch (error) {
    console.error('Failed to fetch trade:', error);
    return NextResponse.json({ error: 'Failed to fetch trade.' }, { status: 500 });
  }
}
