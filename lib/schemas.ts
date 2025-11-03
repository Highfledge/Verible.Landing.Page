import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
})

export const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
  confirmPassword: z.string(),
  role: z.enum(["buyer", "seller"], { message: "Please select a role" }),
  phone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\+?[\d\s\-\(\)]+$/, "Please enter a valid phone number"),
  verificationMethod: z.enum(["email", "sms"], { message: "Please select a verification method" }),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>

export const verifyEmailSchema = z.object({
  code: z.string()
    .length(6, "Verification code must be 6 digits")
    .regex(/^\d+$/, "Verification code must contain only numbers"),
  emailOrPhone: z.string().min(1, "Email or phone is required"),
})

export type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>

export const forgotPasswordSchema = z.object({
  emailOrPhone: z.string().min(1, "Email or phone is required"),
  method: z.enum(["email", "sms"], { message: "Please select a verification method" }),
})

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export const resetPasswordSchema = z.object({
  resetToken: z.string().min(1, "Reset token is required"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
  confirmPassword: z.string(),
  emailOrPhone: z.string().min(1, "Email or phone is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export const businessInformationSchema = z.object({
  businessName: z.string().min(1, "Business/Store Name is required"),
  contactEmail: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\+?[\d\s\-\(\)]+$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  websiteUrl: z.string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  businessDescription: z.string().optional(),
  businessType: z.enum(["Individual Seller", "Small Business", "Corporation", "Non-Profit"], {
    message: "Please select a business type"
  }),
})

export type BusinessInformationFormData = z.infer<typeof businessInformationSchema>
