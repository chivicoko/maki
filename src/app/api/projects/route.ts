// app/api/projects/route.ts
import { NextResponse } from "next/server";
import { projects } from "./data";
import { slugify } from "@/lib/utils";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomDelay() {
  return Math.floor(Math.random() * 1000) + 300;
}

function randomFailure(chance = 0.1) {
  return Math.random() < chance;
}

export async function GET() {
  await delay(randomDelay());

  return NextResponse.json({ projects });
}

export async function POST(req: Request) {
  const body = await req.json();
  const slug = slugify(body.name);

  await delay(randomDelay());

  if (randomFailure()) {
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }

  const newProject = {
    id: slug,
    // id: crypto.randomUUID(),
    ...body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  projects.unshift(newProject);
//   projects.push(newProject);

  return NextResponse.json({
    project: newProject,
    message: "Project created successfully",
  });
}