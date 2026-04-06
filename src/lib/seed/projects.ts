// src/lib/seed/projects.ts

import { Project } from "../../../types";

export const seedProjects: Project[] = [
  {
    id: "project-dashboard",
    name: "Dashboard App",
    members: ["VeeCee", "Makki"],
    color: "#3b82f6",
    description: "Admin analytics dashboard",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "project-mobile",
    name: "Mobile App",
    members: ["Luke", "Malik"],
    color: "#3b82f6",
    description: "Customer mobile platform",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "project-analytics",
    name: "Dashboard Analytics System",
    description: "Main analytics dashboard",
    members: ["Luke", "Malik"], 
    color: "#3b82f6",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "project-crm",
    name: "CRM System",
    description: "Customer management platform",
    members: ["Luke", "Malik"],
    color: "#3b82f6",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];