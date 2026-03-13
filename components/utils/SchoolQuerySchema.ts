import { z } from "zod";

const SchoolQuerySchema = z.object({
  schoolId: z.string().nonempty(),
  query: z.string().min(5),
  contactPersonName: z.string().optional(),
  contactPersonMobile: z.string().regex(/^\d{10}$/).optional(),
});

export default SchoolQuerySchema;