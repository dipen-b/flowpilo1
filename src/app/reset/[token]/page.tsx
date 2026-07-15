import Link from "next/link";
import { db } from "@/lib/db";
import { AuthFrame } from "@/components/auth-frame";
import { ResetPasswordForm } from "@/components/reset-password-form";

export default async function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const reset = await db.passwordReset.findUnique({
    where: { token },
    include: { user: { select: { name: true, email: true } } },
  });

  if (!reset || new Date() > reset.expiresAt) {
    return (
      <AuthFrame title="Link expired" subtitle="This password reset link is invalid or has expired.">
        <p className="text-sm text-ink-2">
          Ask your workspace admin to generate a new reset link from the Team page.
        </p>
        <Link href="/login" className="btn-primary mt-5 inline-flex px-5 py-2.5 text-sm">Back to login</Link>
      </AuthFrame>
    );
  }

  return (
    <AuthFrame
      title="Set a new password"
      subtitle={`Choose a new password for ${reset.user.email}`}
    >
      <ResetPasswordForm token={token} />
    </AuthFrame>
  );
}
