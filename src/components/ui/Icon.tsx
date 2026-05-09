const PATHS = {
  book: "M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5V5.5ZM4 5.5A2.5 2.5 0 0 1 6.5 3H20M8 7h8M8 11h7M8 15h5",
  library: "M4 19V5a2 2 0 0 1 2-2h2v16H6a2 2 0 0 1-2-2ZM10 3h4v16h-4V3ZM16 3h2a2 2 0 0 1 2 2v14h-4V3Z",
  sparkles:
    "M12 2l1.7 5.1L19 9l-5.3 1.9L12 16l-1.7-5.1L5 9l5.3-1.9L12 2ZM5 15l.8 2.2L8 18l-2.2.8L5 21l-.8-2.2L2 18l2.2-.8L5 15ZM19 14l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Z",
  chart: "M4 19h16M7 16V9M12 16V5M17 16v-7",
  user: "M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z",
  search: "M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z",
  star: "M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.2 6.4 20.2 7.5 14 3 9.6l6.2-.9L12 3Z",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 6v6l4 2",
  heart:
    "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z",
  bookmark: "M6 3h12a1 1 0 0 1 1 1v18l-7-4-7 4V4a1 1 0 0 1 1-1ZM9 8h6M12 5v6",
  trending: "M3 17l6-6 4 4 7-8M14 7h6v6",
  sliders:
    "M4 7h10M18 7h2M4 17h2M10 17h10M7 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM16 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  chevron: "M9 18l6-6-6-6",
  "chevron-left": "M15 18l-6-6 6-6",
  flame:
    "M12 22c4 0 7-3 7-7 0-3-2-5.5-4.5-8 .1 3-1.4 4.5-3 5.5.2-3.2-1.2-6-4-8C8 9 5 11.5 5 15c0 4 3 7 7 7Z",
  calendar:
    "M7 2v4M17 2v4M4 9h16M5 5h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z",
  check: "M20 6L9 17l-5-5",
  plus: "M12 5v14M5 12h14",
  menu: "M4 7h16M4 12h16M4 17h16",
  flower:
    "M12 12c2-4 6-3 6 0s-4 4-6 0Zm0 0c-2-4-6-3-6 0s4 4 6 0Zm0 0c4-2 3-6 0-6s-4 4 0 6Zm0 0c4 2 3 6 0 6s-4-4 0-6Z",
  coffee:
    "M5 8h11v5a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5V8Zm11 2h2a2 2 0 0 1 0 4h-2M4 21h14M7 3c0 1 .8 1.3.8 2.2M11 3c0 1 .8 1.3.8 2.2M15 3c0 1 .8 1.3.8 2.2",
  note: "M6 3h9l3 3v15H6V3Zm8 0v4h4M9 11h6M9 15h6M9 19h4",
  x: "M18 6L6 18M6 6l12 12",
  edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z",
  trash: "M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2",
} as const;

export type IconName = keyof typeof PATHS;

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 20, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
