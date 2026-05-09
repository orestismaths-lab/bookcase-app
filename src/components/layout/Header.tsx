"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: "book" as const },
  { href: "/shelf", label: "Shelf", icon: "library" as const },
  { href: "/discover", label: "Discover", icon: "sparkles" as const },
  { href: "/rhythm", label: "Rhythm", icon: "chart" as const },
  { href: "/journal", label: "Journal", icon: "user" as const },
];

interface HeaderProps {
  onOpenAddBook: () => void;
}

export function Header({ onOpenAddBook }: HeaderProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="relative z-40 border-b-2 border-[#7b4d2e] bg-[#5a351f] text-[#f8e8ca] shadow-[0_8px_24px_rgba(50,29,18,0.26)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 lg:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center border border-[#c69a61] bg-[#3d2417]">
            <Icon name="book" size={21} />
          </div>
          <div>
            <div className="font-serif text-xl font-bold tracking-tight">Bookcase</div>
            <div className="text-xs uppercase tracking-[0.16em] text-[#d9bd8e]">
              private reading ledger
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-0 lg:flex">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`border-l border-[#8d633d] px-4 py-2 text-sm font-bold uppercase tracking-[0.12em] transition last:border-r ${
                  active
                    ? "bg-[#f1ddbd] text-[#321d12]"
                    : "text-[#e9cf9f] hover:bg-[#70472d]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Button
          onClick={onOpenAddBook}
          className="hidden sm:flex border-[#3b2317] bg-[#5c3523] text-[#f8e8ca] hover:bg-[#482819]"
        >
          <Icon name="plus" size={16} className="mr-2" /> Add book
        </Button>
      </div>
    </header>
  );
}
