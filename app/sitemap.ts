import type { MetadataRoute } from "next";
import { portfolioProjects } from "./project-catalog";

const baseUrl = "https://igor-mota-portfolio.igormotacontabil.chatgpt.site";

export default function sitemap(): MetadataRoute.Sitemap {
  const fixedRoutes = [
    "",
    "/projetos",
    "/tecnologias/python",
    "/tecnologias/django",
    "/tecnologias/sql",
    "/tecnologias/power-bi",
    "/tecnologias/analise-de-dados",
  ];

  return [
    ...fixedRoutes.map((route, index) => ({
      url: `${baseUrl}${route}`,
      changeFrequency: index < 2 ? "weekly" as const : "monthly" as const,
      priority: index === 0 ? 1 : index === 1 ? 0.9 : 0.8,
    })),
    ...portfolioProjects.map((project) => ({
      url: `${baseUrl}/projetos/${project.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
