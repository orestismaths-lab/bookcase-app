"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";

const MOODS = ["Relaxing", "Café read", "Melancholy", "Vintage", "Adventure", "Cozy", "Philosophical", "Playful"];

export function MoodSelector() {
  const [activeMoods, setActiveMoods] = useLocalStorage<string[]>("bookcase_moods", []);

  const toggle = (mood: string) => {
    setActiveMoods((prev) =>
      prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]
    );
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {MOODS.map((mood) => {
        const active = activeMoods.includes(mood);
        return (
          <button
            key={mood}
            onClick={() => toggle(mood)}
            className={`border px-3 py-3 text-sm font-bold transition ${
              active
                ? "border-[#3b2317] bg-[#5c3523] text-[#f8e8ca]"
                : "border-[#a87b50] bg-[#e5c89f] text-[#5c3523] hover:bg-[#d9b982]"
            }`}
          >
            {mood}
          </button>
        );
      })}
    </div>
  );
}
