"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { useSession } from "@/hooks/useSession";

export default function LoginPage() {
  const { authenticated, login } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (authenticated === true) router.replace("/");
  }, [authenticated, router]);

  const handleEnter = () => {
    login();
    router.replace("/");
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center bg-[#d7b98f]"
      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
    >
      {/* Background textures */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(89,52,32,0.28),transparent_32%),radial-gradient(circle_at_92%_8%,rgba(45,68,56,0.19),transparent_28%),radial-gradient(circle_at_30%_95%,rgba(125,61,47,0.18),transparent_34%),linear-gradient(180deg,rgba(248,229,194,0.72),rgba(155,107,65,0.20))]" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.12] [background-image:linear-gradient(90deg,#6b442b_1px,transparent_1px),linear-gradient(#6b442b_1px,transparent_1px)] [background-size:42px_42px]" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.10] [background-image:radial-gradient(#4f301e_0.7px,transparent_0.7px)] [background-size:7px_7px]" />

      <div className="relative z-10 w-full max-w-sm px-4">
        <div className="border-2 border-[#7b4d2e] bg-[#f1ddbd] shadow-[0_24px_64px_rgba(50,29,18,0.40)]">
          {/* Header bar */}
          <div className="border-b border-[#9f7248] bg-[#5a351f] px-6 py-4 text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center border border-[#c69a61] bg-[#3d2417] text-[#f8e8ca]">
              <Icon name="book" size={24} />
            </div>
            <div className="font-serif text-2xl font-bold tracking-tight text-[#f8e8ca]">
              Bookcase
            </div>
            <div className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-[#d9bd8e]">
              private reading ledger
            </div>
          </div>

          {/* Body */}
          <div className="p-8 text-center">
            <p className="font-serif text-xl font-bold text-[#321d12]">
              Welcome back, Orestis.
            </p>
            <p className="mt-2 text-sm leading-6 text-[#76563d]">
              Your shelf, your notes, your reading rhythm — all waiting.
            </p>

            <button
              onClick={handleEnter}
              className="mt-8 w-full border-2 border-[#3b2317] bg-[#5c3523] px-6 py-3 text-sm font-bold uppercase tracking-[0.15em] text-[#f8e8ca] transition hover:bg-[#482819] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5c3523]"
            >
              Enter your reading space
            </button>

            <p className="mt-6 text-[10px] uppercase tracking-[0.15em] text-[#9b7656]">
              Personal · Private · Yours only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
