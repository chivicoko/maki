// src/lib/validators.ts
import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(3),
  status: z.enum(["todo", "in-progress", "done"]),
  priority: z.enum(["low", "medium", "high"]),
});