interface ReadingProgressProps {
  progress: number;
  showLabel?: boolean;
}

export function ReadingProgress({ progress, showLabel = true }: ReadingProgressProps) {
  return (
    <div>
      <div className="h-3 border border-[#9f7248] bg-[#dec099]">
        <div
          className="h-full bg-[#6b442b] transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      {showLabel && (
        <p className="mt-2 text-xs uppercase tracking-[0.14em] text-[#76563d]">
          {progress} percent complete
        </p>
      )}
    </div>
  );
}
