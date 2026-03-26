// src/app/api/tasks/[id]/route.ts
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();

  globalThis.tasks = globalThis.tasks.map((t: any) =>
    t.id === params.id ? { ...t, ...body } : t
  );

  return Response.json(body);
}