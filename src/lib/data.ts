// src/lib/data.ts
import { v4 as uuid } from "uuid";
import { Project, Task, User } from "../../types";

export const users: User[] = [
  { id: "u1", name: "Victor", avatar: "/avatars/a1.png" },
  { id: "u2", name: "John", avatar: "/avatars/a2.png" },
  { id: "u3", name: "Sarah", avatar: "/avatars/a3.png" },
];

export const activities = [
  "Victor created a task",
  "John moved task to Done",
  "Sarah commented on task",
];