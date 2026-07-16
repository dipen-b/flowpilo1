import { notFound } from "next/navigation";
import { getProject } from "@/lib/queries";
import { getSessionUser } from "@/lib/auth";
import { ProjectChat } from "@/components/project-chat";

export const dynamic = "force-dynamic";

export default async function ProjectChatPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionUser();
  if (!session) notFound();
  const { id } = await params;
  const project = await getProject(id, session.orgId);
  if (!project) notFound();
  return (
    <ProjectChat
      projectId={project.id}
      projectName={project.name}
      projectEmoji={project.emoji}
      currentUserId={session.user.id}
    />
  );
}
