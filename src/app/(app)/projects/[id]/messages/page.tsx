import { notFound } from "next/navigation";
import { getProject } from "@/lib/queries";
import { getSessionUser } from "@/lib/auth";
import { ProjectMessages } from "@/components/project-messages";

export const dynamic = "force-dynamic";

export default async function ProjectMessagesPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionUser();
  if (!session) notFound();
  const { id } = await params;
  const project = await getProject(id, session.orgId);
  if (!project) notFound();
  return (
    <ProjectMessages projectId={project.id} projectName={project.name} projectEmoji={project.emoji} />
  );
}
