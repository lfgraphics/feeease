"use server"

import dbConnect from "@/lib/db";
import School from "@/models/School";
import { isAfter } from "date-fns";
import { decrypt } from "@/lib/crypto";

export async function getSchools(searchParams: { [key: string]: string | string[] | undefined }) {
  await dbConnect();

  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const query = typeof searchParams.query === 'string' ? searchParams.query : '';
  const statusFilter = typeof searchParams.status === 'string' ? searchParams.status : 'all';

  const filter: any = {};

  if (query) {
    filter.$or = [
      { name: { $regex: query, $options: 'i' } },
      { adminName: { $regex: query, $options: 'i' } },
      { adminMobile: { $regex: query, $options: 'i' } },
    ];
  }

  if (statusFilter !== 'all') {
    if (statusFilter === 'active') {
        filter['subscription.status'] = 'active';
    } else if (statusFilter === 'expired') {
        filter.$or = [
            { 'subscription.status': 'expired' },
            { 'license.expiresAt': { $lt: new Date() } }
        ];
    } else {
        filter['subscription.status'] = statusFilter;
    }
  }

  const totalSchools = await School.countDocuments(filter);
  const totalPages = Math.ceil(totalSchools / limit);

  const schools = await School.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean(); // Use lean for performance and plain objects

  // Helper to determine license status display - logical part
  const schoolsWithStatus = schools.map((school: any) => {
      const isExpired = school.license?.expiresAt ? isAfter(new Date(), new Date(school.license.expiresAt)) : false;
      let displayStatus = 'secondary';
      
      if (isExpired || school.subscription.status === 'expired') {
          displayStatus = 'destructive';
      } else if (school.subscription.status === 'active') {
          displayStatus = 'default';
      }

      return {
          ...school,
          _id: school._id.toString(), // Convert ObjectId to string
          displayStatus,
          isExpired
      };
  });

  return {
      schools: schoolsWithStatus,
      totalPages,
      currentPage: page,
      totalSchools
  };
}

export async function getSchoolById(id: string) {
    await dbConnect();
    const school = await School.findById(id).lean();
    if (!school) return null;

    // Helper to safely decrypt fields
    const safeDecrypt = (value?: string) => {
        if (!value) return undefined;
        try {
            return decrypt(value);
        } catch (e) {
            console.error("Decryption failed:", e);
            return value; 
        }
    };

    const safeDecryptJSON = (value?: string) => {
        if (!value) return undefined;
        try {
            const decrypted = decrypt(value);
            return JSON.parse(decrypted);
        } catch (e) {
            console.error("Decryption/Parse failed:", e);
            return undefined;
        }
    }

    const decryptedDeployment = {
        ...JSON.parse(JSON.stringify(school.deployment || {})),
        schoolName: school.name,
        schoolShortName: school.shortName,
        schoolAddress: school.address,
        schoolLogo: school.logo,
        features: JSON.parse(JSON.stringify(school.features || {})),
        licensePublicKey: process.env.LICENSE_PUBLIC_KEY || "",
        feeeaseUrl: process.env.NEXT_PUBLIC_APP_URL || "https://feeease.in",
        mongoDbUri: safeDecrypt(school.deployment?.mongoDbUri),
        gmailAccount: safeDecryptJSON(school.deployment?.gmailAccount),
        cloudinaryConfig: safeDecryptJSON(school.deployment?.cloudinaryConfig),
        nextAuth: safeDecryptJSON(school.deployment?.nextAuth),
        encryptionKey: safeDecrypt(school.deployment?.encryptionKey),
        licenseCookieSecret: safeDecrypt(school.deployment?.licenseCookieSecret),
        aiSensy: safeDecryptJSON(school.deployment?.aiSensy),
        triggerDev: safeDecryptJSON(school.deployment?.triggerDev),
        whatsappTemplates: safeDecryptJSON(school.deployment?.whatsappTemplates),
    };

    return {
        ...school,
        _id: school._id.toString(),
        decryptedDeployment
    };
}

export async function getSchoolByEmail(email: string) {
    await dbConnect();
    const school = await School.findOne({ adminEmail: email }).lean();
    if (!school) return null;
    return {
        ...school,
        _id: school._id.toString()
    };
}
