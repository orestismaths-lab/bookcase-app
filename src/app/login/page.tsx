"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { useSession } from "@/hooks/useSession";
import { Suspense } from "react";

function LoginForm() {
  const { authenticated, login } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const registered = searchParams.get("registered") === "1";
  const verified = searchParams.get("verified") === "1";
  const tokenError = searchParams.get("error");
  const [error, setError] = useState<string | null>(
    tokenError === "expired-token" ? "Verification link has expired. Please register again."
    : tokenError === "invalid-token" ? "Invalid verification link."
    : null
  );
  const [info] = useState<string | null>(
    registered ? "Account created! You can now sign in."
    : verified ? "Email verified! You can now sign in."
    : null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authenticated === true) router.replace("/");
  }, [authenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Sign in failed."); return; }
      login();
      router.replace("/");
    } catch {
      setError("Could not connect. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#d7b98f]"
      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(89,52,32,0.28),transparent_32%),radial-gradient(circle_at_92%_8%,rgba(45,68,56,0.19),transparent_28%),linear-gradient(180deg,rgba(248,229,194,0.72),rgba(155,107,65,0.20))]" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.12] [background-image:linear-gradient(90deg,#6b442b_1px,transparent_1px),linear-gradient(#6b442b_1px,transparent_1px)] [background-size:42px_42px]" />

      <div className="relative z-10 w-full max-w-sm px-4">
        <div className="border-2 border-[#7b4d2e] bg-[#f1ddbd] shadow-[0_24px_64px_rgba(50,29,18,0.40)]">
          <div className="border-b border-[#9f7248] bg-[#5a351f] px-6 py-5 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center border border-[#c69a61] bg-[#3d2417] text-[#f8e8ca]">
              <Icon name="book" size={24} />
            </div>
            <div className="font-serif text-2xl font-bold tracking-tight text-[#f8e8ca]">Bookcase</div>
            <div className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-[#d9bd8e]">private reading ledger</div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <p className="font-serif text-lg font-bold text-[#321d12]">Sign in</p>
              <p className="text-xs text-[#76563d]">Your shelf is waiting.</p>
            </div>

            {info && <p className="text-sm text-[#3e6b3a] bg-[#d9ead6] px-3 py-2 border border-[#3e6b3a]/30">{info}</p>}
            {error && <p className="text-sm text-[#8a3a2a] italic">{error}</p>}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-[0.12em] text-[#8d5b35] mb-1">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com" required autoFocus
                  className="h-10 w-full border border-[#9f7248] bg-[#f8e8ca] px-3 text-sm text-[#321d12] outline-none placeholder:text-[#8f6848] focus:ring-2 focus:ring-[#5c3523]" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-[0.12em] text-[#8d5b35] mb-1">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  className="h-10 w-full border border-[#9f7248] bg-[#f8e8ca] px-3 text-sm text-[#321d12] outline-none placeholder:text-[#8f6848] focus:ring-2 focus:ring-[#5c3523]" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full border-2 border-[#3b2317] bg-[#5c3523] px-6 py-3 text-sm font-bold uppercase tracking-[0.15em] text-[#f8e8ca] transition hover:bg-[#482819] disabled:opacity-60">
              {loading ? "Signing in…" : "Sign in"}
            </button>

            <div className="flex items-center justify-between text-xs text-[#9b7656]">
              <Link href="/forgot-password" className="hover:text-[#5c3523] transition">Forgot password?</Link>
              <Link href="/register" className="hover:text-[#5c3523] transition">Create account</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}
