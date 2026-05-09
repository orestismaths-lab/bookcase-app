// Single anonymous user ID for the MVP.
// When auth is added, swap this for the real session user ID.
export const ANON_USER_ID = "anon"

export const DEFAULT_USER = {
  id: ANON_USER_ID,
  name: "Orestis",
  initials: "OF",
  yearlyGoal: 58,
  preferences: ["cozy fiction", "literary", "old library", "café read"],
  savedRecIds: [] as string[],
  cafeReads: 12,
}
