// // src/app/api/tasks/[id]/route.ts
// export async function PUT(
//   req: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   const body = await req.json();
//   const { id } = await params;

//   globalThis.tasks = globalThis.tasks.map((t: any) =>
//     t.id === id ? { ...t, ...body } : t
//   );

//   const updatedTask = globalThis.tasks.find((t: any) => t.id === id);

//   return Response.json(updatedTask);
// }



// New implementation
import { NextResponse } from "next/server";
import { tasks } from "../data";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomDelay() {
  return Math.floor(Math.random() * 1000) + 300;
}

function randomFailure(chance = 0.1) {
  return Math.random() < chance;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await delay(randomDelay());

  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return NextResponse.json(
      { error: "Task not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ task });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const body = await req.json();
  const { id } = await params;

  await delay(randomDelay());

  if (randomFailure()) {
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }

  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return NextResponse.json(
      { error: "Task not found" },
      { status: 404 }
    );
  }

  tasks[index] = {
    ...tasks[index],
    ...body,
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json({
    task: tasks[index],
    message: "Task updated successfully",
  });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await delay(randomDelay());

  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return NextResponse.json(
      { error: "Task not found" },
      { status: 404 }
    );
  }

  const deletedTask = tasks[index];
  tasks.splice(index, 1);

  return NextResponse.json({
    task: deletedTask,
    message: "Task deleted successfully",
  });
}