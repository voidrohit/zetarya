import type { MetadataRoute } from "next";
import { CHANGELOG, POSTS } from "@/lib/site-content";

const BASE = "https://zetarya.com";

/* lastModified is only worth sending when it is true. It used to be
   `new Date()` for every static page, so the sitemap claimed all nine were
   edited on whatever second Google fetched it — a signal Google learns to
   ignore outright. Now only the pages whose content carries a real date send
   one, and the rest send none, which is valid and believed. */
const latest = (dates: string[]) =>
  new Date(Math.max(...dates.map((d) => new Date(d).getTime())));

type StaticEntry = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  lastModified?: Date;
};

const STATIC: StaticEntry[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/features", priority: 0.9, changeFrequency: "monthly" },
  { path: "/pricing", priority: 0.9, changeFrequency: "monthly" },
  {
    path: "/blog",
    priority: 0.8,
    changeFrequency: "weekly",
    lastModified: latest(POSTS.map((p) => p.date)),
  },
  {
    path: "/changelog",
    priority: 0.7,
    changeFrequency: "weekly",
    lastModified: latest(CHANGELOG.map((c) => c.date)),
  },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...STATIC.map((s) => ({
      url: `${BASE}${s.path}`,
      ...(s.lastModified ? { lastModified: s.lastModified } : {}),
      changeFrequency: s.changeFrequency,
      priority: s.priority,
    })),
    ...POSTS.map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
