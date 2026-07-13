import { db } from "@/lib/db";

export async function createNotification(
  userId: string,
  type: string,
  title: string,
  message: string,
  actionUrl?: string
) {
  try {
    await db.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        actionUrl,
        read: false,
      },
    });
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
}

export async function notifyTaskAssignment(
  taskId: string,
  assigneeId: string,
  taskTitle: string,
  projectName: string
) {
  await createNotification(
    assigneeId,
    "task_assigned",
    "Task Assigned",
    `You were assigned: ${taskTitle} in ${projectName}`,
    `/projects/${taskTitle}`
  );
}

export async function notifyCommentAdded(
  workItemId: string,
  commentAuthorName: string,
  taskTitle: string,
  mentionedUserIds: string[]
) {
  for (const userId of mentionedUserIds) {
    await createNotification(
      userId,
      "comment",
      "New Comment",
      `${commentAuthorName} commented on: ${taskTitle}`,
      `/tasks/${workItemId}`
    );
  }
}

export async function notifyInviteSent(
  inviteeEmail: string,
  inviterName: string,
  orgName: string
) {
  const existingUser = await db.user.findUnique({
    where: { email: inviteeEmail },
  });

  if (existingUser) {
    await createNotification(
      existingUser.id,
      "invite",
      "Organization Invite",
      `${inviterName} invited you to join ${orgName}`,
      `/invites`
    );
  }
}

export async function notifyInviteAccepted(
  organizationId: string,
  newMemberName: string
) {
  const owners = await db.user.findMany({
    where: {
      orgId: organizationId,
      role: { in: ["owner", "admin"] },
    },
  });

  for (const owner of owners) {
    await createNotification(
      owner.id,
      "success",
      "New Team Member",
      `${newMemberName} joined your organization`,
      `/admin/members`
    );
  }
}

export async function notifySprintStarted(
  sprintName: string,
  sprintId: string,
  organizationId: string
) {
  const members = await db.user.findMany({
    where: { orgId: organizationId },
  });

  for (const member of members) {
    await createNotification(
      member.id,
      "info",
      "Sprint Started",
      `Sprint "${sprintName}" has started`,
      `/sprints`
    );
  }
}
