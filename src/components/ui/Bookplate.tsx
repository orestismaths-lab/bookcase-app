import { ReactNode } from "react";

interface BookplateProps {
  children: ReactNode;
  className?: string;
  soft?: boolean;
}

export function Bookplate({ children, className = "", soft = false }: BookplateProps) {
  const style = soft
    ? "border border-[#b88d5d] bg-[#efd8b5] shadow-[0_7px_22px_rgba(50,29,18,0.12)]"
    : "border border-[#9f7248] bg-[#f1ddbd] shadow-[0_8px_0_rgba(91,54,31,0.16),0_22px_42px_rgba(50,29,18,0.18)]";
  return (
    <div className={`relative ${style} ${className}`}>{children}</div>
  );
}
