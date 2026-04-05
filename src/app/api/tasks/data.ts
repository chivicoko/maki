import { Task } from "../../../../types";
import { seedTasks } from "./seed";

declare global {
  var tasks: Task[] | undefined;
}

if (!globalThis.tasks) {
  globalThis.tasks = [...seedTasks];
}

export const tasks = globalThis.tasks;