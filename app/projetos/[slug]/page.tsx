import type { Metadata } from "next";
import { findCatalogProject } from "../../project-catalog";
import ProjectDetail from "./ProjectDetail";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = findCatalogProject(slug);
  return {
    title: `${project?.title ?? "Projeto"} | Igor Mota`,
    description: project?.description ?? "Estudo de caso de desenvolvimento, dados e sistemas empresariais de Igor Mota.",
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  return <ProjectDetail slug={(await params).slug} />;
}
