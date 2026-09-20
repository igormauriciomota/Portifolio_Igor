import { eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { profile } from "../../../db/schema";
import { errorResponse, optionalText, requiredText, requireWriteUser, safeUrl } from "../_shared";

export async function GET() {
  try {
    const [row] = await getDb().select().from(profile).where(eq(profile.id, 1)).limit(1);
    return Response.json({ profile: row ?? null });
  } catch (error) {
    return Response.json({ error: "O perfil ainda está sendo preparado.", detail: error instanceof Error ? error.message : "" }, { status: 503 });
  }
}

export async function PUT(request: Request) {
  const auth = await requireWriteUser();
  if (auth.response) return auth.response;

  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const values = {
      name: requiredText(payload.name, "nome"),
      headline: requiredText(payload.headline, "título profissional"),
      location: requiredText(payload.location, "localização"),
      email: optionalText(payload.email),
      linkedinUrl: safeUrl(payload.linkedinUrl),
      githubUrl: safeUrl(payload.githubUrl),
      photoKey: optionalText(payload.photoKey),
      resumeKey: optionalText(payload.resumeKey),
      updatedAt: new Date().toISOString(),
    };

    const [saved] = await getDb()
      .insert(profile)
      .values({ id: 1, ...values })
      .onConflictDoUpdate({ target: profile.id, set: values })
      .returning();

    return Response.json({ profile: saved });
  } catch (error) {
    return errorResponse(error);
  }
}
