import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "default" | "ghost" | "outline";
type Size = "default" | "sm" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children?: ReactNode;
}

const base =
  "inline-flex items-center justify-center border font-semibold tracking-wide transition disabled:pointer-events-none disabled:opacity-50 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5c3523]";

const sizes: Record<Size, string> = {
  icon: "h-10 w-10",
  sm: "h-8 px-3 text-xs",
  default: "h-10 px-4 text-sm",
};

const variants: Record<Variant, string> = {
  default:
    "border-[#3b2317] bg-[#5c3523] text-[#f8e8ca] hover:bg-[#482819]",
  ghost:
    "border-transparent bg-transparent text-[#6b442b] underline-offset-4 hover:underline",
  outline:
    "border-[#9b704a] bg-[#ead8bc]/45 text-[#54341f] hover:bg-[#e0c49a]",
};

export function Button({
  variant = "default",
  size = "default",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
