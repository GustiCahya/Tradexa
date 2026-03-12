import { NextResponse } from 'next/server';
import { getUserId } from '@/lib/auth-utils';
import { getTrade, deleteTrade } from '@/lib/services/trade.service';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const p = await params;

    const trade = await getTrade(userId, p.id);
    if (!trade) {
      return NextResponse.json({ error: 'Trade not found' }, { status: 404 });
    }

    return NextResponse.json(trade);
  } catch (error) {
    console.error('Failed to fetch trade:', error);
    return NextResponse.json({ error: 'Failed to fetch trade.' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const p = await params;
    const deleted = await deleteTrade(userId, p.id);
    if (!deleted) {
      return NextResponse.json({ error: 'Trade not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete trade:', error);
    return NextResponse.json({ error: 'Failed to delete trade.' }, { status: 500 });
  }
}
