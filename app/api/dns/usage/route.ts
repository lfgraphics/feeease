import { NextResponse } from 'next/server';
import { cloudflareDns } from '@/lib/cloudflare';

export async function GET() {
  try {
    const usage = await cloudflareDns.getUsage();
    return NextResponse.json({ success: true, usage });
  } catch (error) {
    console.error('Error getting DNS usage:', error);
    return NextResponse.json(
      { error: 'Failed to get DNS usage' },
      { status: 500 }
    );
  }
}
