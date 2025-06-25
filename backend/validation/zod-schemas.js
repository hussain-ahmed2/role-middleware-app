import * as z from "zod";

export const loginSchema = z.object({
  email: z.string("Email is required").trim().email("Invalid email format"),
  password: z
    .string("Password is required")
    .trim()
    .min(8, "Password must be at least 8 characters long"),
});

export const registerSchema = z.object({
  name: z
    .string("Name is required")
    .trim()
    .min(3, "Name must be at least 3 characters long"),
  email: z.string("Email is required").email("Invalid email format").trim(),
  password: z
    .string("Password is required")
    .trim()
    .min(8, "Password must be at least 8 characters long"),
});
