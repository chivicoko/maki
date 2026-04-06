// app/api/projects/[id]/route.ts
import { NextResponse } from "next/server";
import { projects } from "../data";

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

  const project = projects.find((p) => p.id === id);

  if (!project) {
    return NextResponse.json(
      { error: "Project not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ project });
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
      { error: "Failed to update project" },
      { status: 500 }
    );
  }

  const index = projects.findIndex((p) => p.id === id);

  if (index === -1) {
    return NextResponse.json(
      { error: "Project not found" },
      { status: 404 }
    );
  }

    projects[index] = {
    ...projects[index],
    ...body,
    id: body.name
        ? body.name.toLowerCase().replace(/\s+/g, "-")
        : projects[index].id,
    updatedAt: new Date().toISOString(),
    };

  return NextResponse.json({
    project: projects[index],
    message: "Project updated successfully",
  });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await delay(randomDelay());

  const index = projects.findIndex((p) => p.id === id);

  if (index === -1) {
    return NextResponse.json(
      { error: "Project not found" },
      { status: 404 }
    );
  }

  const deletedProject = projects[index];
  projects.splice(index, 1);

  return NextResponse.json({
    project: deletedProject,
    message: "Project deleted successfully",
  });
}