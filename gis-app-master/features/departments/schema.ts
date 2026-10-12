import { z } from "zod";

const departmentSchema = z.object({
  id: z.number().optional().default(0),
  name: z.string().min(1, { message: "Please add Department Name!" }),
  shortName: z.string().min(1, { message: "Please add Short Name!" }),
  logo: z.string().optional().default("-"),
  address: z.string().min(1, { message: "Please add Address!" }),
  email: z.string().email(),
  phoneNumber: z.string().min(1, { message: "Please add Phone number!" }),
});

const departmentRightSchema = z.object({
  id: z.number().optional().default(0),
  department_Id: z.number().optional().default(0),
  fieldName: z.string().min(1, { message: "Please add Field Name!" }),
  fieldValue: z.string().min(1, { message: "Please add Field Value!" }),
});

export const departmentWithRightsSchema = z.object({
  department: departmentSchema,
  departmentRights: z
    .array(departmentRightSchema)
    .default([])
    // .refine((val) => val.length >= 1, {
    //   message: "Please add at least one department right.",
    // })
    .optional(),
});

export type DepartmentWithRights = z.infer<typeof departmentWithRightsSchema>;
