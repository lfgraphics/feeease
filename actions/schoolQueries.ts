"use server"

import dbConnect from "@/lib/db";
import mongoose from "mongoose";
import School from "@/models/School";
import SchoolQuery, { SchoolQueryStatus } from "@/models/SchoolQuery";
import AdminUser from "@/models/AdminUser";

function isObjectIdLike(value: any) {
  return (
    value instanceof mongoose.Types.ObjectId ||
    (value &&
      typeof value === "object" &&
      (value._bsontype === "ObjectId" || typeof value.toHexString === "function"))
  );
}

function toSerializable(value: any): any {
  if (value === null || value === undefined) return value;
  if (isObjectIdLike(value)) return value.toString();
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(toSerializable);
  if (typeof value === "object") {
    const out: any = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = toSerializable(v);
    }
    return out;
  }
  return value;
}

function serializeDocument(doc: any): any {
  return toSerializable(doc);
}

/**
 * Search schools by name (case-insensitive) returning minimal info.
 */
export async function searchSchoolsMinimal(query: string) {
  await dbConnect();
  if (!query || query.trim().length === 0) {
    return [];
  }
  const regex = new RegExp(query, "i");
  const docs = await School.find({ name: regex })
    .limit(10)
    .select("name logo address")
    .lean();
  return docs.map((s: any) => ({
    _id: s._id.toString(),
    name: s.name,
    logo: s.logo,
    address: s.address,
  }));
}

interface CreateQueryParams {
  schoolId: string;
  query: string;
  contactPersonName?: string;
  contactPersonMobile?: string;
  adminName?: string;
  adminMobile?: string;
  adminEmail?: string;
}

export async function createSchoolQuery(params: CreateQueryParams) {
  await dbConnect();

  const school = await School.findById(params.schoolId).lean();
  if (!school) {
    throw new Error("School not found");
  }

  let referrerEmail: string | undefined;
  if (school.referral?.referredBy) {
    const user = await AdminUser.findById(school.referral.referredBy).lean();
    if (user) referrerEmail = user.email;
  }

  // Prepare data for Google Apps Script
  const googleScriptPayload = {
    schoolId: params.schoolId,
    schoolName: school.name,
    query: params.query,
    adminName: params.adminName || school.adminName,
    adminMobile: params.adminMobile || school.adminMobile,
    adminEmail: params.adminEmail || school.adminEmail || "",
    contactPersonName: params.contactPersonName || "",
    contactPersonMobile: params.contactPersonMobile || "",
    referrerEmail: referrerEmail || "",
  };

  // call external script if configured
  const scriptUrl = process.env.SCHOLLS_CONTACT_APPS_SCRIPT_URL;
  if (scriptUrl) {
    try {
      const response = await fetch(scriptUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(googleScriptPayload),
      });

      if (!response.ok) {
        console.warn("Google Apps Script returned non-ok status:", response.status);
      }
    } catch (e) {
      console.error("Failed to notify Google Apps Script:", e);
      // Don't throw error - failing to send to script shouldn't fail the form submission
    }
  }

  const created = await SchoolQuery.create({
    school: school._id,
    schoolName: school.name,
    query: params.query,
    adminName: params.adminName || school.adminName,
    adminMobile: params.adminMobile || school.adminMobile,
    referrerEmail,
    contactPersonName: params.contactPersonName,
    contactPersonMobile: params.contactPersonMobile,
    status: 'initiated',
    logTrail: [{ action: 'created' }],
  });

  return serializeDocument(created.toObject());
}

interface ListParams {
  page?: number;
  limit?: number;
  query?: string;
  status?: SchoolQueryStatus | 'all';
  from?: string; // ISO date
  to?: string;
  referrerEmail?: string; // for marketing users
}

export async function getSchoolQueries(params: ListParams = {}) {
  await dbConnect();
  const page = params.page && params.page > 0 ? params.page : 1;
  const limit = params.limit && params.limit > 0 ? params.limit : 10;
  const skip = (page - 1) * limit;

  const filter: any = {};

  if (params.query) {
    const regex = new RegExp(params.query, 'i');
    filter.$or = [
      { schoolName: regex },
      { query: regex },
      { adminName: regex },
    ];
  }

  if (params.status && params.status !== 'all') {
    filter.status = params.status;
  }

  if (params.from || params.to) {
    filter.createdAt = {};
    if (params.from) filter.createdAt.$gte = new Date(params.from);
    if (params.to) filter.createdAt.$lte = new Date(params.to);
  }

  if (params.referrerEmail) {
    filter.referrerEmail = params.referrerEmail;
  }

  const total = await SchoolQuery.countDocuments(filter);
  const docs = await SchoolQuery.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("school", "logo")
    .lean();

  const queries = docs.map((q: any) => {
    const schoolLogo =
      q.school && typeof q.school === "object" && "logo" in q.school ? (q.school as any).logo : undefined;
    const { school, ...rest } = q;
    return serializeDocument({ ...rest, schoolLogo });
  });

  const totalPages = Math.ceil(total / limit);

  return {
    queries,
    total,
    totalPages,
    currentPage: page,
  };
}

export async function getSchoolQueriesStats(params: { from?: string; to?: string; referrerEmail?: string; } = {}) {
  await dbConnect();
  const filter: any = {};
  if (params.from || params.to) {
    filter.createdAt = {};
    if (params.from) filter.createdAt.$gte = new Date(params.from);
    if (params.to) filter.createdAt.$lte = new Date(params.to);
  }
  if (params.referrerEmail) {
    filter.referrerEmail = params.referrerEmail;
  }

  const docs = await SchoolQuery.aggregate([
    { $match: filter },
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);

  const byStatus: Record<SchoolQueryStatus, number> = {
    initiated: 0,
    assigned: 0,
    pending: 0,
    resolved: 0,
    rejected: 0,
  };
  let total = 0;
  docs.forEach((d: any) => {
    const st = d._id as SchoolQueryStatus;
    if (byStatus[st] !== undefined) {
      byStatus[st] = d.count;
    }
    total += d.count;
  });

  return { total, byStatus };
}

interface UpdateParams {
  id: string;
  status?: SchoolQueryStatus;
  note?: string;
  assigned?: { _id: string; name: string; email: string };
}

export async function updateSchoolQuery(params: UpdateParams, user: { id: string; name: string; email: string; role: string; }) {
  await dbConnect();

  const q = await SchoolQuery.findById(params.id);
  if (!q) {
    throw new Error("Query not found");
  }

  // status update rules
  if (params.status) {
    // if already resolved/rejected, only super_admin can change
    if ((q.status === 'resolved' || q.status === 'rejected') && user.role !== 'super_admin') {
      throw new Error('Only super_admin can change status after final state');
    }
    if (params.status === "initiated" && q.status !== "initiated") {
      throw new Error("Cannot move back to initiated after progress");
    }
    if (["pending", "resolved", "rejected"].includes(params.status)) {
      const note = (params.note || "").trim();
      if (!note) {
        throw new Error("Note is required for this status");
      }
      q.note = note;
    }
    q.status = params.status;
  }

  if (
    params.note !== undefined &&
    !(params.status && ["pending", "resolved", "rejected"].includes(params.status))
  ) {
    q.note = params.note;
  }

  if (params.assigned) {
    q.assigned = {
      _id: new mongoose.Types.ObjectId(params.assigned._id),
      name: params.assigned.name,
      email: params.assigned.email,
    };
    // when assigning, change status to assigned if not already
    if (q.status === 'initiated') {
      q.status = 'assigned';
    }
  }

  q.logTrail.push({
    at: new Date(),
    by: { _id: new mongoose.Types.ObjectId(user.id), name: user.name, email: user.email },
    action: 'updated',
    details: `status=${q.status} note=${q.note || ''}`,
  });

  await q.save();
  return serializeDocument(q.toObject());
}

// helper to retrieve list of users (for assigning)
export async function getAssignableUsers() {
  await dbConnect();
  const users = await AdminUser.find({}).select("_id fullName email role").lean();
  return users.map(u => ({ _id: u._id.toString(), fullName: u.fullName, email: u.email, role: u.role }));
}
