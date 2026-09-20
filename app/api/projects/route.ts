import { asc } from "drizzle-orm";
import { getDb } from "../../../db";
import { projects } from "../../../db/schema";
import { errorResponse, optionalText, requiredText, requireWriteUser, safeUrl } from "../_shared";

function serializeProject(row: typeof projects.$inferSelect) {
  let stack: string[] = [];
  try {
    stack = JSON.parse(row.stack) as string[];
  } catch {
    stack = [];
  }

  return { ...row, stack };
}

export async function GET() {
  try {
    const rows = await getDb().select().from(projects).orderBy(asc(projects.sortOrder), asc(projects.id));
    return Response.json({ projects: rows.map(serializeProject) });
  } catch (error) {
    return Response.json({ error: "Os projetos ainda estão sendo preparados.", detail: error instanceof Error ? error.message : "" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const auth = await requireWriteUser();
  if (auth.response) return auth.response;

  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const stack = Array.isArray(payload.stack)
      ? payload.stack.map(String).map((item) => item.trim()).filter(Boolean).slice(0, 10)
      : [];

    const [created] = await getDb()
      .insert(projects)
      .values({
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
      })
      .returning();

    return Response.json({ project: serializeProject(created) }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
