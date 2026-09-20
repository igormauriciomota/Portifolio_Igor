import { env } from "cloudflare:workers";
import { requireWriteUser } from "../_shared";

const limits = {
  profile: { max: 5 * 1024 * 1024, types: ["image/jpeg", "image/png", "image/webp"] },
  project: { max: 8 * 1024 * 1024, types: ["image/jpeg", "image/png", "image/webp"] },
  resume: { max: 12 * 1024 * 1024, types: ["application/pdf"] },
} as const;

function safeFilename(filename: string) {
  return filename.normalize("NFKD").replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-").toLowerCase();
}

export async function POST(request: Request) {
  const auth = await requireWriteUser();
  if (auth.response) return auth.response;

  const form = await request.formData();
  const file = form.get("file");
  const kind = form.get("kind");
  if (!(file instanceof File) || typeof kind !== "string" || !(kind in limits)) {
    return Response.json({ error: "Arquivo ou tipo de upload inválido." }, { status: 400 });
  }

  const rule = limits[kind as keyof typeof limits];
  if (file.size > rule.max) return Response.json({ error: "O arquivo ultrapassa o tamanho permitido." }, { status: 400 });
  if (!(rule.types as readonly string[]).includes(file.type)) return Response.json({ error: "Formato de arquivo não permitido." }, { status: 400 });

  const key = `${kind}/${crypto.randomUUID()}-${safeFilename(file.name)}`;
  await env.BUCKET.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type },
    customMetadata: { uploadedBy: auth.user?.email ?? "owner" },
  });

  return Response.json({ key, url: `/api/files/${key}` }, { status: 201 });
}
