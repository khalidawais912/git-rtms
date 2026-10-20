import { z } from "zod";

export const userSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Please add Name!" })
    .regex(/^\S*$/, { message: "Username should not contain spaces!" }),
  email: z.string().email({ message: "Please enter valid email!" }),
  password: z
    .string()
    .min(8, { message: "Please add Password!" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter!",
    })
    .regex(/\d/, { message: "Password must contain atleast on number!" })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "Password must contain at least on special character!",
    }),
  roleID: z
    .preprocess(
      (val) => (val === "" || val === undefined ? undefined : String(val)),
      z.string({ invalid_type_error: "Please add Role Id!" }),
    )
    .optional()
    .default(""),

  userProfile: z.object({
    id: z.number().optional().default(0),
    department_Id: z.number().optional().default(0),
    user_Id: z.number().optional().default(0),
    firstName: z.string().min(1, { message: "Please add First Name!" }),
    lastName: z.string().min(1, { message: "Please add Last Name!" }),
    profilePicture: z.string().optional().default(""),
    designation: z.string().optional().default(""),
    budget_Code: z.string().optional().default(""),
    vendor_Code: z.string().optional().default(""),
    bps: z.number().optional().default(0),
    status: z.boolean().optional().default(true),
    section: z.string().optional().default(""),
  }),
});

export type UserFormData = z.infer<typeof userSchema>;
