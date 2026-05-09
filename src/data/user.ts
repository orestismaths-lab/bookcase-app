import { User } from "@/types";

// Fallback/seed values — live data comes from /api/user
export const MOCK_USER: User = {
  id: "anon",
  name: "Orestis",
  initials: "OF",
  totalBooks: 0,
  yearlyGoal: 58,
  preferences: [
    "reflective fiction",
    "beautiful prose",
    "coffee-shop reads",
    "old library mood",
    "short chapters",
    "character-driven",
  ],
  savedRecIds: [],
  cafeReads: 12,
};
