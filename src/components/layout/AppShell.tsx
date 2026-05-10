"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";
import { AddBookModal } from "@/components/shared/AddBookModal";
import { useBooks } from "@/hooks/useBooks";
import { useSession } from "@/hooks/useSession";
import { Book } from "@/types";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { authenticated } = useSession();
  const [modalOpen, setModalOpen] = useState(false);
  const { addBook } = useBooks();

  const isPublic = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email"].includes(pathname);

  useEffect(() => {
    if (!isPublic && authenticated === false) {
      router.replace("/login");
    }
  }, [authenticated, isPublic, pathname, router]);

  const handleAdd = async (book: Book) => {
    await addBook(book);
  };

  // Public pages: render bare (no shell, no guard chrome)
  if (isPublic) {
    return <>{children}</>;
  }

  // Auth still loading or redirecting to login
  if (authenticated !== true) {
    return (
      <div
        className="min-h-screen bg-[#d7b98f]"
        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
      />
    );
  }

  return (
    <div
      className="min-h-screen bg-[#d7b98f] text-[#321d12]"
      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
    >
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(89,52,32,0.28),transparent_32%),radial-gradient(circle_at_92%_8%,rgba(45,68,56,0.19),transparent_28%),radial-gradient(circle_at_30%_95%,rgba(125,61,47,0.18),transparent_34%),linear-gradient(180deg,rgba(248,229,194,0.72),rgba(155,107,65,0.20))]" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.12] [background-image:linear-gradient(90deg,#6b442b_1px,transparent_1px),linear-gradient(#6b442b_1px,transparent_1px)] [background-size:42px_42px]" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.10] [background-image:radial-gradient(#4f301e_0.7px,transparent_0.7px)] [background-size:7px_7px]" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Header onOpenAddBook={() => setModalOpen(true)} onLogout={() => router.replace("/login")} />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-6 lg:px-6 lg:pb-10">
          {children}
        </main>
        <MobileNav onOpenAddBook={() => setModalOpen(true)} />
      </div>

      {modalOpen && (
        <AddBookModal onClose={() => setModalOpen(false)} onAdd={handleAdd} />
      )}
    </div>
  );
}
