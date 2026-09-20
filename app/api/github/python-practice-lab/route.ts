const repository = "igormauriciomota/python-practice-lab";
const repositoryUrl = `https://github.com/${repository}`;

export async function GET() {
  return Response.json(
    {
      repository,
      repositoryUrl,
      defaultBranch: "main",
      moduleCount: 20,
      commitCount: 41,
      commitHistoryComplete: true,
      latestCommitAt: "2026-09-19T15:00:00.000Z",
      days: [],
      recentCommits: [],
      updatedAt: "2026-09-19T15:00:00.000Z",
      source: "snapshot",
      error: "A leitura ao vivo não respondeu agora",
    },
    { headers: { "cache-control": "public, max-age=300, stale-while-revalidate=86400" } },
  );
}
