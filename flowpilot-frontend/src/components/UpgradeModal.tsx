import { X } from "lucide-react";
import { useRouter } from "next/navigation";

interface UpgradeModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  currentValue?: number;
  limit?: number;
  feature?: string;
  onClose: () => void;
}

export function UpgradeModal({
  isOpen,
  title,
  message,
  currentValue,
  limit,
  feature,
  onClose,
}: UpgradeModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleUpgrade = () => {
    router.push("/pricing");
    onClose();
  };

  const pros = [
    "Unlimited projects & team members",
    "10GB storage (vs 500MB)",
    "Gantt charts & advanced reports",
    "Slack & custom integrations",
    "Custom workflows & automation",
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card-bg rounded-lg p-8 max-w-md w-full mx-4 space-y-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary-text">{title}</h2>
            <p className="text-secondary-text mt-1">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-secondary-bg rounded-lg transition-colors"
          >
            <X size={20} className="text-secondary-text" />
          </button>
        </div>

        {currentValue !== undefined && limit !== undefined && (
          <div className="bg-secondary-bg p-4 rounded-lg">
            <p className="text-sm text-secondary-text mb-2">Current Usage</p>
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-primary-text">
                {currentValue} / {limit}
              </p>
            </div>
            <div className="h-2 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full"
                style={{ width: `${(currentValue / limit) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <p className="text-sm font-semibold text-primary-text">
            Upgrade to Pro for:
          </p>
          <ul className="space-y-2">
            {pros.map((pro, index) => (
              <li key={index} className="flex items-center gap-3 text-sm text-secondary-text">
                <span className="w-5 h-5 rounded-full bg-green-600/20 flex items-center justify-center text-green-600 text-xs">
                  ✓
                </span>
                {pro}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-blue-600/10 p-4 rounded-lg border border-blue-600/20">
          <p className="text-sm text-primary-text mb-1">
            <span className="font-semibold">$29/month</span> or{" "}
            <span className="font-semibold">$290/year</span> (save $58)
          </p>
          <p className="text-xs text-secondary-text">
            14-day free trial. No credit card required.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border border-border text-primary-text hover:bg-secondary-bg transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleUpgrade}
            className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
          >
            Upgrade to Pro
          </button>
        </div>

        <p className="text-xs text-center text-secondary-text">
          Free users always available. Upgrade anytime.
        </p>
      </div>
    </div>
  );
}
