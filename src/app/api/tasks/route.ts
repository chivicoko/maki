// src/app/api/tasks/route.ts
import { NextRequest, NextResponse } from "next/server";
import { tasks } from "@/lib/data";

export async function GET() {
  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const newTask = {
    ...body,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);

  return NextResponse.json(newTask, { status: 201 });
}