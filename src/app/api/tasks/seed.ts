import { Task } from "../../../../types";

export const seedTasks: Task[] = [
  {
    id: "task-1",
    title: "Setup Next.js project structure",
    description: "Create app router folders and shared components",
    status: "todo",
    priority: "high",
    projectId: "project-alpha",
    labels: ["frontend", "bug"],
    assignees: [
        {
            name: "Victor",
            avatar: "",
        },
        {
            name: "Mark",
            avatar: "",
        },
    ],
    dueDate: "2026-04-12",
    createdAt: new Date("2026-04-01").toISOString(),
  },
  {
    id: "task-2",
    title: "Implement task drawer UI",
    description: "Build shadcn drawer for task updates",
    status: "in-progress",
    priority: "medium",
    projectId: "project-alpha",
    labels: ["ui", "drawer"],
    assignees: [
        {
            name: "Victor",
            avatar: "/avatars/victor.jpg",
        },
        {
            name: "Mark",
            avatar: "",
        },
    ],
    dueDate: "2026-04-13",
    createdAt: new Date("2026-04-02").toISOString(),
  },
  {
    id: "task-3",
    title: "Add drag and drop support",
    description: "Use react-dnd for kanban movement",
    status: "done",
    priority: "high",
    projectId: "project-beta",
    labels: ["frontend", "feature"],
    assignees: [
        {
            name: "Victor",
            avatar: "",
        },
        {
            name: "Mark",
            avatar: "",
        },
    ],
    dueDate: "2026-04-14",
    createdAt: new Date("2026-04-03").toISOString(),
  },
  {
    id: "task-4",
    title: "Setup optimistic updates",
    description: "Use React Query mutation lifecycle",
    status: "todo",
    priority: "high",
    projectId: "project-beta",
    labels: ["react-query", "cache"],
    assignees: [
        {
            name: "Victor",
            avatar: "",
        },
        {
            name: "Mark",
            avatar: "",
        },
    ],
    dueDate: "2026-04-15",
    createdAt: new Date("2026-04-04").toISOString(),
  },
  {
    id: "task-5",
    title: "Handle API failure rollback",
    description: "Rollback cache on mutation error",
    status: "in-progress",
    priority: "low",
    projectId: "project-alpha",
    labels: ["bugfix", "api"],
    assignees: [
        {
            name: "Victor",
            avatar: "",
        },
        {
            name: "Mark",
            avatar: "",
        },
    ],
    dueDate: "2026-04-16",
    createdAt: new Date("2026-04-05").toISOString(),
  },
];