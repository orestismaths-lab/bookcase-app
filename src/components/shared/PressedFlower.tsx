import { Icon } from "@/components/ui/Icon";

export function PressedFlower({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute ${className}`}>
      <div className="relative h-10 w-10 rotate-12 text-[#a95d55] opacity-60">
        <Icon name="flower" size={34} />
      </div>
    </div>
  );
}
