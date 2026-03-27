import { NextRequest, NextResponse } from 'next/server';
import { cloudflareDns } from '@/lib/cloudflare';
import School from '@/models/School';
import dbConnect from '@/lib/db';



export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientName, target, type = 'CNAME', proxied = true, schoolId } = body;


    if (!clientName || !target) {
      return NextResponse.json(
        { error: 'Missing required fields: clientName, target' },
        { status: 400 }
      );
    }

    // Validate target format based on type
    if (type === 'A' && !/^\d{1,3}(\.\d{1,3}){3}$/.test(target)) {
      return NextResponse.json(
        { error: 'Invalid A record format (IP address required)' },
        { status: 400 }
      );
    }

    if (type === 'CNAME' && !target.includes('.')) {
      return NextResponse.json(
        { error: 'Invalid CNAME target (domain required)' },
        { status: 400 }
      );
    }

    await dbConnect();

    // 1. Determine the full domain to check
    let zoneName = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
    if (!zoneName) {
        // Fallback or fetch from Cloudflare if needed
        const zoneData = await fetch(`https://api.cloudflare.com/client/v4/zones/${process.env.CLOUDFLARE_ZONE_ID}`, {
            headers: { 'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}` }
        }).then(res => res.json());
        zoneName = zoneData.result.name;
    }
    const fullDomain = `${clientName}.${zoneName}`;

    // 2. Check Database for collisions
    const existingSchool = await School.findOne({ 
        'deployment.cloudflareRecordName': fullDomain 
    });

    if (existingSchool) {
        return NextResponse.json(
            { error: `The subdomain "${clientName}" is already assigned to "${existingSchool.name}". Please choose a different subdomain.` },
            { status: 409 }
        );
    }

    // 3. Proceed to Cloudflare (it also performs its own checks)
    const record = await cloudflareDns.createSubdomain(clientName, target, type, proxied);


    // Update school record with Cloudflare info
    if (schoolId) {
        await dbConnect();
        await School.findByIdAndUpdate(schoolId, {
            $set: {
                'deployment.cloudflareRecordId': record.id,
                'deployment.cloudflareRecordName': record.name,
                'deployment.publicAppUrl': `https://${record.name}`
            }
        });
    }

    return NextResponse.json({ success: true, record }, { status: 201 });

  } catch (error) {
    console.error('Error creating subdomain:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create subdomain' },
      { status: 400 }
    );
  }
}
