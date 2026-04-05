// import { Task } from "../../../../types"

// // src/app/api/tasks/route.ts
// declare global { var tasks: Task[] }

// if (!globalThis.tasks) globalThis.tasks = []

// export async function GET() {
//   return Response.json(globalThis.tasks)
// }

// export async function POST(req: Request) {
//   const body = await req.json()
//   const newTask: Task = { ...body, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
//   globalThis.tasks.push(newTask)
//   return Response.json(newTask, { status: 201 })
// }

// New implementation
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

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.title || !body.status) {
    return NextResponse.json(
      { error: "Missing required fields" },
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

  const newTask: Task = {
    ...body,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  tasks.unshift(newTask);

  return NextResponse.json(
    {
      task: newTask,
      message: "Task created successfully",
    },
    { status: 201 }
  );
}