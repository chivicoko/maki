// // src/app/api/tasks/route.ts
import { NextResponse } from "next/server";
import { tasks } from "./data";
import { Task } from "../../../../types";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomDelay() {
  return Math.floor(Math.random() * 1000) + 300;
}

function randomFailure(chance = 0.1) {
  return Math.random() < chance;
}

// ✅ GET TASKS (with project filtering)
export async function GET(request: Request) {
  const url = new URL(request.url);
  const projectId = url.searchParams.get("projectId");

  await delay(randomDelay());

  if (randomFailure()) {
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }

  const result = projectId
    ? tasks.filter((task) => task.projectId === projectId)
    : tasks;

  return NextResponse.json({
    tasks: result,
    total: result.length,
  });
}


// ✅ CREATE TASK
export async function POST(request: Request) {
  const body = await request.json();

  // ✅ Required fields validation
  if (!body.title || !body.status || !body.projectId) {
    return NextResponse.json(
      { error: "Missing required fields (title, status, projectId)" },
      { status: 400 }
    );
  }

  await delay(randomDelay());

  if (randomFailure()) {
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }

  // ✅ Normalize assignees (NEW STRUCTURE)
  const normalizedAssignees =
    body.assignees?.map((a: any) => ({
      name: a.name?.trim(),
      avatar: a.avatar || "",
    })) || [];

  // ✅ Normalize labels
  const normalizedLabels =
    body.labels?.map((l: string) => l.trim()) || [];

  const newTask: Task = {
    id: crypto.randomUUID(),
    title: body.title,
    description: body.description || "",
    status: body.status,
    priority: body.priority || "medium",
    projectId: body.projectId,

    // ✅ updated fields
    labels: normalizedLabels,
    assignees: normalizedAssignees,
    dueDate: body.dueDate || "",

    createdAt: new Date().toISOString(),
    // updatedAt: new Date().toISOString(),
  };

  // ✅ add to top (like real apps)
  tasks.unshift(newTask);

  return NextResponse.json(
    {
      task: newTask,
      message: "Task created successfully",
    },
    { status: 201 }
  );
}