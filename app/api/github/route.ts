import { eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { profile } from "../../../db/schema";

type GitHubEvent = { created_at?: string };

function githubUsername(url: string | null) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.endsWith("github.com")) return null;
    return parsed.pathname.split("/").filter(Boolean)[0] ?? null;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const [owner] = await getDb().select({ githubUrl: profile.githubUrl }).from(profile).where(eq(profile.id, 1)).limit(1);
    const username = githubUsername(owner?.githubUrl ?? "https://github.com/igormauriciomota");
    if (!username) return Response.json({ username: null, total: 0, days: [] });

    const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/events/public?per_page=100`, {
      headers: { accept: "application/vnd.github+json", "user-agent": "igor-mota-portfolio" },
      cf: { cacheTtl: 3600, cacheEverything: true },
    } as RequestInit);
    if (!response.ok) throw new Error("GitHub indisponível");
    const events = (await response.json()) as GitHubEvent[];

    const counts = new Map<string, number>();
    for (const event of events) {
      const date = event.created_at?.slice(0, 10);
      if (date) counts.set(date, (counts.get(date) ?? 0) + 1);
    }

    const days = Array.from({ length: 49 }, (_, index) => {
      const date = new Date();
      date.setUTCDate(date.getUTCDate() - (48 - index));
      const key = date.toISOString().slice(0, 10);
      return { date: key, count: counts.get(key) ?? 0 };
    });
    return Response.json({ username, total: events.length, days }, { headers: { "cache-control": "public, max-age=3600" } });
  } catch {
    return Response.json({ username: null, total: 0, days: [] });
  }
}
