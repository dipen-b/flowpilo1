import { notFound } from "next/navigation";
import { projects } from "@/lib/data";
import { ProjectDetail } from "@/components/project-detail";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!projects.some((p) => p.id === id)) notFound();
  return <ProjectDetail id={id} />;
}
