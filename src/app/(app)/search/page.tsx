import { getSessionUser } from "@/lib/auth";
import { getMembers } from "@/lib/queries";
import { TaskSearch } from "@/components/task-search";

export const dynamic = "force-dynamic";

export default async function SearchPage() {
  const session = await getSessionUser();
  if (!session) return <div>Unauthorized</div>;

  const members = await getMembers(session.orgId);

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div className="float-up">
        <h1 className="text-2xl font-bold tracking-tight">Search & Filter</h1>
        <p className="mt-1 text-sm text-ink-2">Find tasks across all projects using advanced filters</p>
      </div>
      <TaskSearch members={members} />
    </div>
  );
}
