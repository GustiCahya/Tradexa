import { NextResponse } from 'next/server';
import { getUserId } from '@/lib/auth-utils';
import { createTrade } from '@/lib/services/trade.service';

export async function POST(request: Request) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const trade = await createTrade(userId, data);

    return NextResponse.json({ success: true, trade }, { status: 201 });
  } catch (error) {
    console.error('Failed to create trade:', error);
    return NextResponse.json({ error: 'Failed to create trade.' }, { status: 500 });
  }
}

import { updateTrade } from '@/lib/services/trade.service';

export async function PUT(request: Request) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    if (!data.id) {
      return NextResponse.json({ error: 'Trade ID is required for update' }, { status: 400 });
    }

    const trade = await updateTrade(userId, data.id, data);

    return NextResponse.json({ success: true, trade }, { status: 200 });
  } catch (error) {
    console.error('Failed to update trade:', error);
    return NextResponse.json({ error: 'Failed to update trade.' }, { status: 500 });
  }
}
