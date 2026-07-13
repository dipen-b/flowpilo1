import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AttendanceDashboardV2 } from "@/components/attendance/attendance-dashboard-v2";
import { MarkAttendanceV2 } from "@/components/attendance/mark-attendance-v2";

export default async function AttendancePage() {
  const session = await getSessionUser();

  if (!session) {
    redirect("/login");
  }

  const isAdmin = ["owner", "admin"].includes(session.user.role);

  return (
    <div className="space-y-8">
      {/* Dashboard */}
      <AttendanceDashboardV2 isAdmin={isAdmin} />

      {/* Mark Attendance (Admin Only) */}
      {isAdmin && (
        <div>
          <MarkAttendanceV2 />
        </div>
      )}
    </div>
  );
}
