import { notFound } from "next/navigation";
import { getProject } from "@/lib/queries";
import { ProjectDetail } from "@/components/project-detail";

export const dynamic = "force-dynamic";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();
  return <ProjectDetail project={project} />;
}
