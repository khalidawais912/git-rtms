import { z } from "zod";

export const projectDocumentNameSchema = z.object({
  id: z.number().optional().default(0),
  documentName: z.string().min(1, { message: "Please add Document Name!" }),
  isActive: z.boolean().default(true),
  createdAt: z.string().optional().default(new Date().toISOString()),
  updateAt: z.string().optional().default(new Date().toISOString()),
});

export type ProjectDocumentName = z.infer<typeof projectDocumentNameSchema>;
