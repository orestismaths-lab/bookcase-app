// Deterministic spine gradient picker — same title always gets the same spine.
// All gradients match the warm leather/parchment palette of the app.
const PALETTES = [
  "from-[#2d4438] via-[#617a61] to-[#c8ad7b]",
  "from-[#5b2524] via-[#9a4e38] to-[#d0a86b]",
  "from-[#213238] via-[#435d5e] to-[#ad9b70]",
  "from-[#6d392a] via-[#af6747] to-[#d5aa78]",
  "from-[#38291e] via-[#7e5a32] to-[#c9a86e]",
  "from-[#2b211d] via-[#653428] to-[#b77254]",
  "from-[#1f332e] via-[#5c4d34] to-[#c9ad77]",
  "from-[#2e3a5c] via-[#5b6fa8] to-[#c9b97a]",
  "from-[#4a3528] via-[#8b6142] to-[#d4a96a]",
  "from-[#3b2d1e] via-[#6b4c2a] to-[#c7a567]",
  "from-[#4d2f22] via-[#9d603a] to-[#d7b270]",
  "from-[#31402a] via-[#687344] to-[#c4a96b]",
  "from-[#3a2b1e] via-[#7a5038] to-[#c9a870]",
  "from-[#4a3020] via-[#8a5c34] to-[#d0a860]",
  "from-[#2f403e] via-[#637b6b] to-[#c9b27d]",
  "from-[#5a2d3a] via-[#9e5060] to-[#d4a070]",
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(31, h) + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function spineForTitle(title: string): string {
  return PALETTES[hash(title) % PALETTES.length];
}
