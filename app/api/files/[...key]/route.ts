import { env } from "cloudflare:workers";

type RouteContext = { params: Promise<{ key: string[] }> };

export async function GET(request: Request, context: RouteContext) {
  const { key: segments } = await context.params;
  const key = segments.join("/");
  const object = await env.BUCKET.get(key);
  if (!object) return new Response("Arquivo não encontrado.", { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", "public, max-age=3600");
  if (new URL(request.url).searchParams.get("download") === "1") {
    headers.set("content-disposition", "attachment");
  }

  return new Response(object.body, { headers });
}
