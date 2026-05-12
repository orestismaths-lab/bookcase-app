"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Registration failed."); return; }
      router.replace("/login?registered=1");
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

          <div className="p-6">
            {(
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <p className="font-serif text-lg font-bold text-[#321d12]">Create account</p>
                  <p className="text-xs text-[#76563d]">Start your reading ledger.</p>
                </div>

                {error && <p className="text-sm text-[#8a3a2a] italic">{error}</p>}

                <div className="space-y-3">
                  {[
                    { label: "Full name", value: name, setter: setName, type: "text", placeholder: "Orestis" },
                    { label: "Email", value: email, setter: setEmail, type: "email", placeholder: "your@email.com" },
                    { label: "Password", value: password, setter: setPassword, type: "password", placeholder: "At least 6 characters" },
                    { label: "Confirm password", value: confirm, setter: setConfirm, type: "password", placeholder: "Repeat password" },
                  ].map(({ label, value, setter, type, placeholder }) => (
                    <div key={label}>
                      <label className="block text-xs font-bold uppercase tracking-[0.12em] text-[#8d5b35] mb-1">{label}</label>
                      <input type={type} value={value} onChange={(e) => setter(e.target.value)}
                        placeholder={placeholder} required
                        className="h-10 w-full border border-[#9f7248] bg-[#f8e8ca] px-3 text-sm text-[#321d12] outline-none placeholder:text-[#8f6848] focus:ring-2 focus:ring-[#5c3523]" />
                    </div>
                  ))}
                </div>

                <button type="submit" disabled={loading}
                  className="w-full border-2 border-[#3b2317] bg-[#5c3523] px-6 py-3 text-sm font-bold uppercase tracking-[0.15em] text-[#f8e8ca] transition hover:bg-[#482819] disabled:opacity-60">
                  {loading ? "Creating account…" : "Create account"}
                </button>

                <p className="text-center text-xs text-[#9b7656]">
                  Already have an account?{" "}
                  <Link href="/login" className="font-bold text-[#5c3523] hover:underline">Sign in</Link>
                </p>
              </form>
          </div>
        </div>
      </div>
    </div>
  );
}
