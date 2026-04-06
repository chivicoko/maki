// src/types/index.ts

export type Status = "todo" | "in-progress" | "done";
export type Priority = "low" | "medium" | "high";

export interface User {
  id: string;
  name: string;
  avatar: string;
}

// export interface Task {
//   id: string;
//   title: string;
//   description?: string;
//   status: Status;
//   priority: Priority;
//   dueDate?: string;
//   assigneeId?: string;
//   projectId: string;
//   createdAt: string;
// }
type Assignee = {
  name: string;
  avatar?: string;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  projectId: string;
  labels: string[];
  assignees: Assignee[];
  dueDate: string;
  createdAt: string;
};

// types/project.ts
export type Project = {
  id: string;
  name: string;
  description?: string;
  color?: string;
  members: Assignee[];
  createdAt: string;
  updatedAt: string;
};

export interface Activity {
  id: string;
  message: string;
  createdAt: string;
}