import { NextRequest, NextResponse } from 'next/server';
import { cloudflareDns } from '@/lib/cloudflare';
import School from '@/models/School';
import dbConnect from '@/lib/db';


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const record = await cloudflareDns.getRecord(id);
    return NextResponse.json({ success: true, record });
  } catch (error) {
    console.error('Error getting DNS record:', error);
    return NextResponse.json(
      { error: 'Failed to get DNS record' },
      { status: 404 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const record = await cloudflareDns.updateRecord(id, body);
    return NextResponse.json({ success: true, record });
  } catch (error) {
    console.error('Error updating DNS record:', error);
    return NextResponse.json(
      { error: 'Failed to update DNS record' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await cloudflareDns.deleteRecord(id);

    // Clear from School record if it exists
    await dbConnect();
    await School.findOneAndUpdate(
        { 'deployment.cloudflareRecordId': id },
        { 
            $unset: { 
                'deployment.cloudflareRecordId': 1,
                'deployment.cloudflareRecordName': 1
            } 
        }
    );

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting DNS record:', error);
    return NextResponse.json(
      { error: 'Failed to delete DNS record' },
      { status: 500 }
    );
  }
}
