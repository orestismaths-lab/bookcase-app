import { ReactNode } from "react";

interface SectionTitleProps {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
}

export function SectionTitle({ title, eyebrow, action }: SectionTitleProps) {
  return (
    <div className="mb-3 flex items-start justify-between gap-3">
      <div>
        {eyebrow && (
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.24em] text-[#8d5b35]">
            {eyebrow}
          </p>
        )}
        <h2 className="font-serif text-2xl font-bold leading-tight text-[#321d12]">{title}</h2>
      </div>
      {action}
    </div>
  );
}
