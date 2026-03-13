"use server";

import { createSchoolQuery } from "@/actions/schoolQueries";
import SchoolQuerySchema from "./utils/SchoolQuerySchema";

export async function submitSchoolQuery(formData: FormData) {
  const schoolId = formData.get("schoolId")?.toString();
  const query = formData.get("query")?.toString();
  const contactPersonName = formData.get("contactPersonName")?.toString() || undefined;
  const contactPersonMobile = formData.get("contactPersonMobile")?.toString() || undefined;
  const adminName = formData.get("adminName")?.toString() || undefined;
  const adminMobile = formData.get("adminMobile")?.toString() || undefined;
  const adminEmail = formData.get("adminEmail")?.toString() || undefined;

  // basic validation using zod
  const validation = SchoolQuerySchema.safeParse({
    schoolId: schoolId || "",
    query: query || "",
    contactPersonName,
    contactPersonMobile,
  });
  if (!validation.success) {
    console.error("validation errors", validation.error);
    return { success: false, error: "Validation failed" };
  }

  try {
    const { schoolId: validSchoolId, query: validQuery, contactPersonName: validContactName, contactPersonMobile: validContactMobile } = validation.data;
    const doc = await createSchoolQuery({
      schoolId: validSchoolId,
      query: validQuery,
      contactPersonName: validContactName,
      contactPersonMobile: validContactMobile,
      adminName,
      adminMobile,
      adminEmail,
    });

    return { success: true, doc };
  } catch (e: any) {
    console.error("submitSchoolQuery error", e);
    return { success: false, error: e.message || "Server error" };
  }
}