"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to reset password."); return; }
      setDone(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch {
      setError("Could not connect. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#d7b98f]"
      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(89,52,32,0.28),transparent_32%),linear-gradient(180deg,rgba(248,229,194,0.72),rgba(155,107,65,0.20))]" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.12] [background-image:linear-gradient(90deg,#6b442b_1px,transparent_1px),linear-gradient(#6b442b_1px,transparent_1px)] [background-size:42px_42px]" />

      <div className="relative z-10 w-full max-w-sm px-4">
        <div className="border-2 border-[#7b4d2e] bg-[#f1ddbd] shadow-[0_24px_64px_rgba(50,29,18,0.40)]">
          <div className="border-b border-[#9f7248] bg-[#5a351f] px-6 py-5 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center border border-[#c69a61] bg-[#3d2417] text-[#f8e8ca]">
              <Icon name="book" size={24} />
            </div>
            <div className="font-serif text-2xl font-bold tracking-tight text-[#f8e8ca]">Bookcase</div>
          </div>

          <div className="p-6">
            {done ? (
              <div className="text-center space-y-4 py-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center border border-[#3e6b3a] bg-[#d9ead6] text-[#3e6b3a]">
                  <Icon name="check" size={28} />
                </div>
                <p className="font-serif text-lg font-bold text-[#321d12]">Password changed!</p>
                <p className="text-sm text-[#76563d]">Redirecting you to sign in…</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <p className="font-serif text-lg font-bold text-[#321d12]">New password</p>
                  <p className="text-xs text-[#76563d]">Choose a strong password.</p>
                </div>
                {!token && <p className="text-sm text-[#8a3a2a] italic">Invalid reset link.</p>}
                {error && <p className="text-sm text-[#8a3a2a] italic">{error}</p>}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-[0.12em] text-[#8d5b35] mb-1">New password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters" required disabled={!token}
                      className="h-10 w-full border border-[#9f7248] bg-[#f8e8ca] px-3 text-sm text-[#321d12] outline-none placeholder:text-[#8f6848] focus:ring-2 focus:ring-[#5c3523]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-[0.12em] text-[#8d5b35] mb-1">Confirm password</label>
                    <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
                      placeholder="Repeat password" required disabled={!token}
                      className="h-10 w-full border border-[#9f7248] bg-[#f8e8ca] px-3 text-sm text-[#321d12] outline-none placeholder:text-[#8f6848] focus:ring-2 focus:ring-[#5c3523]" />
                  </div>
                </div>
                <button type="submit" disabled={loading || !token}
                  className="w-full border-2 border-[#3b2317] bg-[#5c3523] px-6 py-3 text-sm font-bold uppercase tracking-[0.15em] text-[#f8e8ca] transition hover:bg-[#482819] disabled:opacity-60">
                  {loading ? "Saving…" : "Save new password"}
                </button>
                <p className="text-center">
                  <Link href="/login" className="text-xs text-[#9b7656] hover:text-[#5c3523] transition">Back to sign in</Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return <Suspense><ResetPasswordForm /></Suspense>;
}
