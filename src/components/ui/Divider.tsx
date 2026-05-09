export function Divider({ className = "" }: { className?: string }) {
  return (
    <div
      className={`my-4 h-px bg-gradient-to-r from-transparent via-[#9f7248]/70 to-transparent ${className}`}
    />
  );
}
