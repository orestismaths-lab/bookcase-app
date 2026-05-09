import { Icon, IconName } from "@/components/ui/Icon";

interface MiniEntryProps {
  icon: IconName;
  value: string | number;
  label: string;
}

export function MiniEntry({ icon, value, label }: MiniEntryProps) {
  return (
    <div className="border-b border-[#aa7d50]/50 pb-2 last:border-0 last:pb-0">
      <div className="flex items-center gap-2">
        <Icon name={icon} size={15} className="text-[#70472d]" />
        <span className="font-serif text-xl font-bold text-[#321d12]">{value}</span>
      </div>
      <div className="pl-6 text-xs uppercase tracking-[0.12em] text-[#7c5a3e]">{label}</div>
    </div>
  );
}
