import { NextRequest, NextResponse } from 'next/server';
import { cloudflareDns, type CreateDnsRecordInput } from '@/lib/cloudflare';

export async function POST(request: NextRequest) {
  try {
    const body: CreateDnsRecordInput = await request.json();

    // Validate required fields
    if (!body.type || !body.name || !body.content) {
      return NextResponse.json(
        { error: 'Missing required fields: type, name, content' },
        { status: 400 }
      );
    }

    // Validate record type
    const validTypes = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SRV', 'CAA'];
    if (!validTypes.includes(body.type)) {
      return NextResponse.json(
        { error: `Invalid record type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Create record
    const record = await cloudflareDns.createRecord(body);

    return NextResponse.json({ success: true, record }, { status: 201 });
  } catch (error) {
    console.error('Error creating DNS record:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create DNS record' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const type = searchParams.get('type');
    const content = searchParams.get('content');
    const proxied = searchParams.get('proxied');


    const records = await cloudflareDns.listRecords({
      name: name || undefined,
      type: type || undefined,
      content: content || undefined,
      proxied: proxied ? JSON.parse(proxied) : undefined,
    });

    return NextResponse.json({ success: true, records });
  } catch (error) {
    console.error('Error listing DNS records:', error);
    return NextResponse.json(
      { error: 'Failed to list DNS records' },
      { status: 500 }
    );
  }
}
