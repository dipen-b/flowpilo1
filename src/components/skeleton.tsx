export function SkeletonLine({ width = "100%", height = "16px" }: { width?: string; height?: string }) {
  return (
    <div
      className="skeleton rounded-md"
      style={{ width, height }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="card space-y-3 p-4">
      <SkeletonLine width="60%" height="20px" />
      <SkeletonLine height="14px" />
      <SkeletonLine width="80%" height="14px" />
    </div>
  );
}

export function SkeletonTaskRow() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-line p-3">
      <SkeletonLine width="40px" height="40px" />
      <div className="flex-1 space-y-1.5">
        <SkeletonLine width="40%" height="16px" />
        <SkeletonLine width="60%" height="12px" />
      </div>
      <SkeletonLine width="60px" height="20px" />
    </div>
  );
}
