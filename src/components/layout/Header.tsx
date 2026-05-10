"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { useUser } from "@/hooks/useUser";
import { useSession } from "@/hooks/useSession";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: "book" as const },
  { href: "/shelf", label: "Shelf", icon: "library" as const },
  { href: "/discover", label: "Discover", icon: "sparkles" as const },
  { href: "/rhythm", label: "Rhythm", icon: "chart" as const },
  { href: "/journal", label: "Journal", icon: "user" as const },
];

interface HeaderProps {
  onOpenAddBook: () => void;
  onLogout: () => void;
}

export function Header({ onOpenAddBook, onLogout }: HeaderProps) {
  const pathname = usePathname();
  const { user } = useUser();
  const { logout } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await fetch("/api/auth/logout", { method: "POST" });
    logout();
    onLogout();
  };

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

        <div className="flex items-center gap-2">
          <Button
            onClick={onOpenAddBook}
            className="hidden sm:flex border-[#3b2317] bg-[#5c3523] text-[#f8e8ca] hover:bg-[#482819]"
          >
            <Icon name="plus" size={16} className="mr-2" /> Add book
          </Button>

          {/* Profile dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex h-10 w-10 items-center justify-center border border-[#c69a61] bg-[#3d2417] font-serif text-sm font-bold text-[#f8e8ca] transition hover:bg-[#5c3523]"
              aria-label="Profile menu"
            >
              {user?.initials ?? "–"}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 border-2 border-[#7b4d2e] bg-[#f1ddbd] shadow-[0_12px_32px_rgba(50,29,18,0.32)] z-50">
                {/* User info */}
                <div className="border-b border-[#b88d5d] bg-[#e5c89f] px-4 py-3">
                  <p className="font-serif font-bold text-[#321d12] leading-tight">
                    {user?.name ?? "Reader"}
                  </p>
                  <p className="text-xs text-[#76563d] mt-0.5">
                    {user?.totalBooks ?? 0} books on the shelf
                  </p>
                </div>

                {/* Links */}
                <div className="py-1">
                  <Link
                    href="/journal"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#321d12] hover:bg-[#e5c89f] transition"
                  >
                    <Icon name="user" size={14} className="text-[#8d5b35]" />
                    My journal
                  </Link>
                  <Link
                    href="/rhythm"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#321d12] hover:bg-[#e5c89f] transition"
                  >
                    <Icon name="chart" size={14} className="text-[#8d5b35]" />
                    Reading rhythm
                  </Link>
                  <Link
                    href="/change-password"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#321d12] hover:bg-[#e5c89f] transition"
                  >
                    <Icon name="edit" size={14} className="text-[#8d5b35]" />
                    Change password
                  </Link>
                </div>

                <div className="border-t border-[#b88d5d] py-1">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-[#8a3a2a] hover:bg-[#e5c89f] transition"
                  >
                    <Icon name="x" size={14} />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
