import { HRMSClock } from '@/components/hrms-clock';
import { getSessionUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function TimeTrackingPage() {
  const session = await getSessionUser();
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-2xl">
        <HRMSClock />
      </div>
    </div>
  );
}
