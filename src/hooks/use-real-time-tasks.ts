import { useEffect, useState } from "react";

type Task = {
  id: string;
  key: string;
  title: string;
  status: string;
  priority: string;
  labels: string[];
  estimate: number;
  spent: number;
  due: string;
  aiFlag?: string;
  assignee: { id: string; name: string; initials: string; color: string } | null;
};

/**
 * Hook for real-time task updates.
 * Polls the server every 2 seconds for task changes and notifies via callback.
 */
export function useRealtimeTasks(projectId: string, onTasksUpdate?: (tasks: Task[]) => void) {
  const [lastChecksum, setLastChecksum] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}/tasks?timestamp=${Date.now()}`);
        if (!res.ok) return;

        const data = await res.json();
        const tasks: Task[] = data.tasks || [];

        // Simple checksum to detect changes
        const checksum = JSON.stringify(tasks.map((t) => ({ id: t.id, status: t.status, spent: t.spent }))).slice(0, 50);

        if (checksum !== lastChecksum) {
          setLastChecksum(checksum);
          onTasksUpdate?.(tasks);
        }
      } catch (error) {
        console.error("Real-time update error:", error);
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  }, [projectId, lastChecksum, onTasksUpdate]);
}
