"use client";

import { useState } from "react";
import Link from "next/link";
import { Bookplate } from "@/components/ui/Bookplate";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SectionTitle } from "@/components/shared/SectionTitle";

export default function ChangePasswordPage() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (next !== confirm) { setError("New passwords do not match."); return; }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to change password."); return; }
      setSuccess(true);
      setCurrent(""); setNext(""); setConfirm("");
    } catch {
      setError("Could not connect. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <Bookplate className="p-5">
        <SectionTitle eyebrow="account" title="Change password" />

        {success && (
          <div className="mb-4 flex items-center gap-2 border border-[#3e6b3a]/40 bg-[#d9ead6] px-4 py-3">
            <Icon name="check" size={16} className="text-[#3e6b3a] shrink-0" />
            <p className="text-sm text-[#3e6b3a]">Password changed successfully.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Current password", value: current, setter: setCurrent },
            { label: "New password", value: next, setter: setNext },
            { label: "Confirm new password", value: confirm, setter: setConfirm },
          ].map(({ label, value, setter }) => (
            <div key={label}>
              <label className="block text-xs font-bold uppercase tracking-[0.12em] text-[#8d5b35] mb-1">{label}</label>
              <input type="password" value={value} onChange={(e) => setter(e.target.value)}
                placeholder="••••••••" required minLength={label === "Current password" ? 1 : 6}
                className="h-10 w-full border border-[#9f7248] bg-[#f8e8ca] px-3 text-sm text-[#321d12] outline-none placeholder:text-[#8f6848] focus:ring-2 focus:ring-[#5c3523]" />
            </div>
          ))}

          {error && <p className="text-sm text-[#8a3a2a] italic">{error}</p>}

          <div className="flex gap-2 pt-1">
            <Button type="submit" disabled={loading}
              className="border-[#3b2317] bg-[#5c3523] text-[#f8e8ca] hover:bg-[#482819]">
              {loading ? "Saving…" : "Save new password"}
            </Button>
            <Link href="/journal">
              <Button variant="outline">Cancel</Button>
            </Link>
          </div>
        </form>
      </Bookplate>
    </div>
  );
}
