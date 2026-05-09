"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, IconName } from "@/components/ui/Icon";

const LEFT_ITEMS: Array<{ href: string; label: string; icon: IconName }> = [
  { href: "/", label: "Home", icon: "book" },
  { href: "/shelf", label: "Shelf", icon: "library" },
];

const RIGHT_ITEMS: Array<{ href: string; label: string; icon: IconName }> = [
  { href: "/discover", label: "Discover", icon: "sparkles" },
  { href: "/journal", label: "Journal", icon: "user" },
];

interface MobileNavProps {
  onOpenAddBook: () => void;
}

export function MobileNav({ onOpenAddBook }: MobileNavProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const navItemClass = (href: string) =>
    `flex flex-col items-center justify-center gap-1 px-1 py-2 text-[9px] font-bold uppercase tracking-wide transition-colors min-h-[48px] min-w-[44px] ${
      isActive(href)
        ? "bg-[#f1ddbd] text-[#321d12]"
        : "text-[#e9cf9f] hover:bg-[#70472d] hover:text-[#f8e8ca]"
    }`;

  return (
    <nav
      className="fixed bottom-3 left-3 right-3 z-50 border-2 border-[#7b4d2e] bg-[#5a351f] shadow-[0_-4px_24px_rgba(50,29,18,0.30)] lg:hidden"
      aria-label="Main navigation"
    >
      <div className="grid grid-cols-5">
        {LEFT_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={navItemClass(item.href)}
            aria-label={item.label}
            aria-current={isActive(item.href) ? "page" : undefined}
          >
            <Icon name={item.icon} size={18} />
            <span>{item.label}</span>
          </Link>
        ))}

        {/* Centre add button */}
        <button
          onClick={onOpenAddBook}
          className="flex flex-col items-center justify-center gap-1 px-1 py-2 text-[9px] font-bold uppercase tracking-wide transition-colors hover:bg-[#70472d] text-[#e9cf9f] min-h-[48px]"
          aria-label="Add a book to your shelf"
        >
          <div className="flex h-7 w-7 items-center justify-center border border-[#c69a61] bg-[#3d2417]">
            <Icon name="plus" size={14} />
          </div>
          <span>Add</span>
        </button>

        {RIGHT_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={navItemClass(item.href)}
            aria-label={item.label}
            aria-current={isActive(item.href) ? "page" : undefined}
          >
            <Icon name={item.icon} size={18} />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
