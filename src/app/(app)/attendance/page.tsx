import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AttendanceDashboard } from "@/components/attendance/attendance-dashboard";
import { MarkAttendance } from "@/components/attendance/mark-attendance";

export default async function AttendancePage() {
  const session = await getSessionUser();

  if (!session) {
    redirect("/login");
  }

  const isAdmin = ["owner", "admin"].includes(session.user.role);

  return (
    <div className="space-y-8">
      {/* Dashboard */}
      <AttendanceDashboard isAdmin={isAdmin} />

      {/* Mark Attendance (Admin Only) */}
      {isAdmin && (
        <div>
          <MarkAttendance />
        </div>
      )}
    </div>
  );
}
