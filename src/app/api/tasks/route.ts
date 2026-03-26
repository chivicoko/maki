import { Task } from "../../../../types"

// src/app/api/tasks/route.ts
declare global { var tasks: Task[] }

if (!globalThis.tasks) globalThis.tasks = []

export async function GET() {
  return Response.json(globalThis.tasks)
}

export async function POST(req: Request) {
  const body = await req.json()
  const newTask: Task = { ...body, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
  globalThis.tasks.push(newTask)
  return Response.json(newTask, { status: 201 })
}