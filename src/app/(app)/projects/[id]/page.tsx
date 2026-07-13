import { notFound } from "next/navigation";
import { getProject } from "@/lib/queries";
import { getSessionUser } from "@/lib/auth";
import { ProjectDetail } from "@/components/project-detail";

export const dynamic = "force-dynamic";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionUser();
  if (!session) {
    notFound();
  }
  const { id } = await params;
  const project = await getProject(id, session.orgId);
  if (!project) notFound();
  return <ProjectDetail project={project} />;
}
