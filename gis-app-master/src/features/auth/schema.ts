import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, { message: "Please add Username!" }),
  password: z.string().min(1, { message: "Please add Password!" }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
