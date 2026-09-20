import type { Metadata } from "next";
import ProjectsGallery from "./ProjectsGallery";

export const metadata: Metadata = {
  title: "Projetos e estudos de caso | Igor Mota",
  description: "Projetos de Igor Mota em Python, Django, Flask, APIs, automação, SQL, Power BI e sistemas empresariais.",
};

export default function ProjectsPage() {
  return <ProjectsGallery />;
}
