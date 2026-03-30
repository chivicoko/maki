// src/app/api/tasks/[id]/route.ts
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const body = await req.json();
  const { id } = await params;

  globalThis.tasks = globalThis.tasks.map((t: any) =>
    t.id === id ? { ...t, ...body } : t
  );

  const updatedTask = globalThis.tasks.find((t: any) => t.id === id);

  return Response.json(updatedTask);
}