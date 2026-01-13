// zod/contactAuth.js
import { z } from "zod";

const contactAuth = z.object({
  subject: z
    .string({ required_error: "Subject is required" })
    .min(2, { message: "Subject must be at least 2 characters long" })
    .max(50, { message: "Subject must be at most 50 characters long" }),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email address" }),

  message: z
    .string({ required_error: "Message is required" })
    .min(5, { message: "Message must be at least 5 characters long" })
    .max(1000, { message: "Message must be at most 1000 characters long" }),
});

export default contactAuth;
