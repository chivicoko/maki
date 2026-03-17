// src/lib/data.ts
import { v4 as uuid } from "uuid";
import { Project, Task, User } from "../../types";

export const users: User[] = [
  { id: "u1", name: "Victor", avatar: "/avatars/a1.png" },
  { id: "u2", name: "John", avatar: "/avatars/a2.png" },
  { id: "u3", name: "Sarah", avatar: "/avatars/a3.png" },
];

export const projects: Project[] = [
  {
    id: "p1",
    name: "Dashboard App",
    description: "Internal team dashboard",
    members: ["u1", "u2"],
    createdAt: new Date().toISOString(),
  },
];

export let tasks: Task[] = [
  {
    id: uuid(),
    title: "Design dashboard UI",
    status: "todo",
    priority: "high",
    projectId: "p1",
    createdAt: new Date().toISOString(),
  },
  {
    id: uuid(),
    title: "Setup Zustand store",
    status: "in-progress",
    priority: "medium",
    projectId: "p1",
    createdAt: new Date().toISOString(),
  },
];