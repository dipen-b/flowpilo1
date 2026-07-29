interface StorageUsageProps {
  used: number;
  limit: number;
  plan: "free" | "pro" | "enterprise";
  onUpgrade?: () => void;
}

export function StorageUsage({ used, limit, plan, onUpgrade }: StorageUsageProps) {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const percentage = limit === Infinity ? 0 : (used / limit) * 100;
  const isFull = percentage > 90;
  const isWarning = percentage > 70;

  return (
    <div className="space-y-3 p-4 bg-secondary-bg rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-primary-text">Storage</h3>
        <span className="text-sm text-secondary-text">
          {formatBytes(used)} / {limit === Infinity ? "Unlimited" : formatBytes(limit)}
        </span>
      </div>

      <div className="space-y-2">
        <div className="h-2 rounded-full bg-border overflow-hidden">
          <div
            className={`h-full transition-all ${
              isFull ? "bg-red-600" : isWarning ? "bg-yellow-600" : "bg-blue-600"
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>

        {limit !== Infinity && (
          <p className="text-xs text-secondary-text">
            {Math.round(percentage)}% used
          </p>
        )}
      </div>

      {isFull && (
        <div className="bg-red-600/10 border border-red-600/30 text-red-600 px-3 py-2 rounded text-sm">
          <p className="font-semibold mb-1">Storage full!</p>
          <p className="text-xs">
            Upgrade to Pro for 10GB storage and never worry about space again.
          </p>
          {onUpgrade && (
            <button
              onClick={onUpgrade}
              className="mt-2 text-xs font-semibold underline hover:no-underline"
            >
              Upgrade now
            </button>
          )}
        </div>
      )}

      {isWarning && !isFull && (
        <div className="bg-yellow-600/10 border border-yellow-600/30 text-yellow-600 px-3 py-2 rounded text-sm">
          <p className="text-xs">
            Storage is {Math.round(percentage)}% full. Consider upgrading to Pro.
          </p>
        </div>
      )}

      {plan === "free" && !isFull && !isWarning && (
        <p className="text-xs text-secondary-text">
          Free plan includes 500MB storage.{" "}
          <span
            onClick={onUpgrade}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Upgrade to Pro
          </span>{" "}
          for 10GB.
        </p>
      )}
    </div>
  );
}
