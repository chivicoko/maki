// src/lib/validators.ts
import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),

  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .optional(),

  status: z.enum(["todo", "in-progress", "done"]),

  priority: z.enum(["low", "medium", "high"]),

  projectId: z.string().min(1, "Project is required"),

  labels: z.array(z.string()).catch([]),

  assignees: z.array(z.string()).catch([]),

  dueDate: z.string().optional(),

  createdAt: z.string().optional(),

  id: z.string().optional(),
});