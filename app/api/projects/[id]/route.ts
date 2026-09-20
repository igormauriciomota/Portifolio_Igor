import { eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { projects } from "../../../../db/schema";
import { errorResponse, optionalText, requiredText, requireWriteUser, safeUrl } from "../../_shared";

type RouteContext = { params: Promise<{ id: string }> };

function serializeProject(row: typeof projects.$inferSelect) {
  let stack: string[] = [];
  try {
    stack = JSON.parse(row.stack) as string[];
  } catch {
    stack = [];
  }
  return { ...row, stack };
}

export async function GET(_: Request, context: RouteContext) {
  try {
    const { id: rawId } = await context.params;
    const id = Number(rawId);
    if (!Number.isInteger(id)) return Response.json({ error: "Projeto inválido." }, { status: 400 });
    const [project] = await getDb().select().from(projects).where(eq(projects.id, id)).limit(1);
    if (!project) return Response.json({ error: "Projeto não encontrado." }, { status: 404 });
    return Response.json({ project: serializeProject(project) });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const auth = await requireWriteUser();
  if (auth.response) return auth.response;

  try {
    const { id: rawId } = await context.params;
    const id = Number(rawId);
    if (!Number.isInteger(id)) throw new Error("Projeto inválido.");

    const payload = (await request.json()) as Record<string, unknown>;
    const stack = Array.isArray(payload.stack)
      ? payload.stack.map(String).map((item) => item.trim()).filter(Boolean).slice(0, 10)
      : [];

    const [updated] = await getDb()
      .update(projects)
      .set({
        title: requiredText(payload.title, "título"),
        eyebrow: requiredText(payload.eyebrow, "categoria"),
        description: requiredText(payload.description, "descrição"),
        stack: JSON.stringify(stack),
        status: optionalText(payload.status) ?? "Planejado",
        accent: optionalText(payload.accent) ?? "#ffd24a",
        githubUrl: safeUrl(payload.githubUrl),
        liveUrl: safeUrl(payload.liveUrl),
        videoUrl: safeUrl(payload.videoUrl),
        imageKey: optionalText(payload.imageKey),
        featured: Boolean(payload.featured),
        sortOrder: Number(payload.sortOrder) || 0,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(projects.id, id))
      .returning();

    if (!updated) return Response.json({ error: "Projeto não encontrado." }, { status: 404 });
    return Response.json({ project: updated });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  const auth = await requireWriteUser();
  if (auth.response) return auth.response;

  try {
    const { id: rawId } = await context.params;
    const id = Number(rawId);
    if (!Number.isInteger(id)) throw new Error("Projeto inválido.");

    const [deleted] = await getDb().delete(projects).where(eq(projects.id, id)).returning();
    if (!deleted) return Response.json({ error: "Projeto não encontrado." }, { status: 404 });
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
