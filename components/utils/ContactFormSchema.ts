import { z } from "zod";

const ContactFormSchema = z.object({
  name: z.string().nonempty(),
  school: z.string().nonempty(),
  phoneNumber: z.string().regex(/^\d{10}$/),
  email: z.string().email(),
  studentsCount: z.number().int().positive(),
  locality: z.string().nonempty(),
  comment: z.string().optional(),
});

export default ContactFormSchema;
