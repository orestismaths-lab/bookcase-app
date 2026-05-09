export type ReadingStatus = "Read" | "Currently Reading" | "Want to Read";

export interface Book {
  id: string;
  userId: string;
  title: string;
  author: string;
  genre: string;
  status: ReadingStatus;
  rating: number | null;
  progress: number;
  spine: string;
  tag: string;
  notes: string;
  addedAt: string;
  finishedAt: string | null;
}

export interface Recommendation {
  id: string;
  title: string;
  author: string;
  reason: string;
  match: string;
  spine: string;
}

export interface User {
  id: string;
  name: string;
  initials: string;
  totalBooks: number;
  yearlyGoal: number;
  preferences: string[];
  savedRecIds: string[];
  cafeReads: number;
}

export interface ReadingStats {
  // Computed from real book data
  booksThisYear: number;
  currentlyReading: number;
  wantToRead: number;
  totalBooks: number;
  // User-tracked (on User model)
  cafeReads: number;
  // Placeholders until session/page tracking exists
  dayStreak: number;
  monthlyPages: number[];
  moodBreakdown: { label: string; value: number }[];
}
