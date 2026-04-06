import { seedProjects } from "@/lib/seed/projects";
import { Project } from "../../../../types";

declare global {
  var projects: Project[] | undefined;
}

if (!globalThis.projects) {
  globalThis.projects = [...seedProjects];
}

export const projects = globalThis.projects;