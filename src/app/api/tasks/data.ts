import { seedTasks } from "@/lib/seed/tasks";
import { Task } from "../../../../types";

declare global {
  var tasks: Task[] | undefined;
}

if (!globalThis.tasks) {
  globalThis.tasks = [...seedTasks];
}

export const tasks = globalThis.tasks;