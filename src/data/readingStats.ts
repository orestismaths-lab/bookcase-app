// MOCK_STATS is kept as a fallback reference; live data comes from /api/stats
export const MOCK_STATS = {
  booksThisYear: 42,
  pagesRead: 12800,
  dayStreak: 8,
  cafeReads: 12,
  currentlyReading: 2,
  wantToRead: 8,
  totalBooks: 12,
  monthlyPages: [42, 58, 35, 72, 64, 88, 54, 76, 92, 67, 80, 96],
  moodBreakdown: [
    { label: "Reflective", value: 82 },
    { label: "Practical", value: 74 },
    { label: "Atmospheric", value: 63 },
    { label: "Historical", value: 48 },
    { label: "Creative", value: 36 },
  ],
};

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
