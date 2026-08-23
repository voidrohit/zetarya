import React from "react";

export type IconName =
  | "bolt"
  | "shield"
  | "devices"
  | "link"
  | "globe"
  | "users"
  | "gauge"
  | "resume"
  | "folder"
  | "audit"
  | "minimize"
  | "check"
  | "minus"
  | "arrow-right"
  | "arrow-left"
  | "arrow-up-right"
  | "chevron-down"
  | "chevron-up"
  | "menu"
  | "close"
  | "lock"
  | "laptop"
  | "phone"
  | "drive"
  | "file"
  | "trend"
  | "mail"
  | "briefcase"
  | "alert"
  | "news"
  | "download";

const P: Record<IconName, React.ReactNode> = {
  bolt: <path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12l1-8.5Z" />,
  shield: (
    <>
      <path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  devices: (
    <>
      <path d="M14 8H3v9h11" />
      <path d="M7 20h5" />
      <rect x="16" y="6" width="6" height="14" rx="1.5" />
    </>
  ),
  link: (
    <>
      <path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1" />
      <path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 3 2.5 15 0 18-2.5-3-2.5-15 0-18Z" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16 5.2a3.5 3.5 0 0 1 0 6.6M17.5 20a6.4 6.4 0 0 0-2-4.6" />
    </>
  ),
  gauge: (
    <>
      <path d="M4 18a9 9 0 1 1 16 0" />
      <path d="m12 14 4-4" />
    </>
  ),
  resume: (
    <>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </>
  ),
  folder: (
    <>
      <path d="M3 7a2 2 0 0 1 2-2h3.6l2 2.4H19a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
    </>
  ),
  audit: (
    <>
      <path d="M6 3h9l5 5v13H6z" />
      <path d="M15 3v5h5M9 13h7M9 17h5" />
    </>
  ),
  minimize: <path d="M4 12h16M8 8l4-4 4 4M8 16l4 4 4-4" />,
  check: <path d="m4 12 5 5L20 6" />,
  minus: <path d="M5 12h14" />,
  "arrow-right": <path d="M4 12h15m-5-6 6 6-6 6" />,
  "arrow-left": <path d="M20 12H5m5-6-6 6 6 6" />,
  "arrow-up-right": <path d="M7 17 17 7m0 0H8m9 0v9" />,
  "chevron-down": <path d="m6 9 6 6 6-6" />,
  "chevron-up": <path d="m6 15 6-6 6 6" />,
  menu: <path d="M3 6h18M3 12h18M3 18h18" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  lock: (
    <>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 1 1 8 0v3" />
    </>
  ),
  laptop: (
    <>
      <rect x="4" y="5" width="16" height="11" rx="1.5" />
      <path d="M2 20h20" />
    </>
  ),
  phone: (
    <>
      <rect x="7" y="2.5" width="10" height="19" rx="2" />
      <path d="M11 18.5h2" />
    </>
  ),
  drive: (
    <>
      <rect x="2.5" y="8" width="19" height="8" rx="2" />
      <path d="M6 12h.01M10 12h4" />
    </>
  ),
  file: (
    <>
      <path d="M6 3h8l5 5v13H6z" />
      <path d="M14 3v5h5M11 12h2M11 16h2" />
    </>
  ),
  trend: <path d="m3 17 6-6 4 4 8-8m0 0h-6m6 0v6" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 12h18" />
    </>
  ),
  alert: (
    <>
      <path d="M12 3 2.5 20h19L12 3Z" />
      <path d="M12 10v4M12 17h.01" />
    </>
  ),
  news: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M7 9h6M7 13h6M17 9v6" />
    </>
  ),
  download: <path d="M12 3v12m0 0 4.5-4.5M12 15l-4.5-4.5M4 20h16" />,
};

export function Icon({
  name,
  className = "h-4 w-4",
  strokeWidth = 1.7,
}: {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {P[name]}
    </svg>
  );
}
