import * as z from "zod";

export const loginSchema = z.object({
  email: z.string("Email is required").trim().email("Invalid email format"),
  password: z
    .string("Password is required")
    .trim()
    .min(8, "Password must be at least 8 characters long"),
});

export const registerSchema = z
  .object({
    avatar: z
      .any()
      .optional()
      .refine(
        (value) =>
          value === undefined ||
          value instanceof File ||
          typeof value === "string",
        "Avatar must be a file or existing avatar path"
      ),
    name: z
      .string("Name is required")
      .trim()
      .min(3, "Name must be at least 3 characters long"),
    email: z.string("Email is required").email("Invalid email format").trim(),
    password: z
      .string("Password is required")
      .trim()
      .min(8, "Password must be at least 8 characters long"),
    confirmPassword: z
      .string("Password is required")
      .trim()
      .min(8, "Password must be at least 8 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const credentialsSchema = z
  .object({
    name: z
      .string()
      .trim()
      .nonempty("Name is required")
      .min(3, "Name must be at least 3 characters long"),
    email: z
      .string()
      .trim()
      .nonempty("Email is required")
      .email("Invalid email format"),
    currentPassword: z.string().trim().optional(),
    newPassword: z.string().trim().optional(),
    avatar: z
      .any()
      .optional()
      .refine(
        (value) =>
          value === undefined ||
          value instanceof File ||
          typeof value === "string",
        "Avatar must be a file or existing avatar path"
      ),
  })
  .refine(
    (data) => {
      if (data.newPassword && !data.currentPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Current password is required when setting a new password",
      path: ["currentPassword"],
    }
  );
