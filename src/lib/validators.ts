// src/lib/validators.ts
import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  status: z.enum(["todo", "in-progress", "done"]),
  priority: z.enum(["low", "medium", "high"]),
});