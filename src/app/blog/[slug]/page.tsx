import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import SiteShell from "@/components/site/site-shell";
import { Icon } from "@/components/site/icons";
import { CtaBanner } from "@/components/site/primitives";
import { POSTS } from "@/lib/site-content";
import JsonLd from "@/components/site/json-ld";
import { blogPosting, breadcrumbs, graph, isoDate, webPage } from "@/lib/schema";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) return { title: "Post not found - Zetarya" };
  return {
    title: `${post.title} - Zetarya`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      publishedTime: isoDate(post.date),
      authors: [post.author],
      section: post.category,
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <SiteShell>
      <JsonLd
        data={graph(
          breadcrumbs(`https://zetarya.com/blog/${post.slug}`, [
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
          webPage({
            path: `/blog/${post.slug}`,
            name: post.title,
            description: post.excerpt,
            trail: [],
            datePublished: isoDate(post.date),
            dateModified: isoDate(post.date),
          }),
          blogPosting(post),
        )}
      />
      <article className="measure py-14 sm:py-16">
        <div className="mx-auto max-w-prose">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[13.5px] font-medium text-muted transition-colors hover:text-ink"
          >
            <Icon name="arrow-left" className="h-3.5 w-3.5" />
            All posts
          </Link>

          <div className="mt-8 flex items-center gap-3">
            <span className="rounded-md bg-accent-soft px-2.5 py-1 text-[11px] font-semibold text-accent">
              {post.category}
            </span>
            <span className="text-[12.5px] text-faint">
              {post.date} · {post.read}
            </span>
          </div>

          <h1 className="h-display mt-4 text-[32px] sm:text-[40px] lg:text-[44px]">{post.title}</h1>

          <div className="mt-7 flex items-center gap-2.5 border-b border-line pb-7">
            <span className="grid h-[30px] w-[30px] place-items-center rounded-full bg-surface2 text-[11px] font-semibold text-muted">
              {post.initials}
            </span>
            <span className="text-[13.5px] font-semibold">{post.author}</span>
            <span className="text-[13px] text-muted">{post.role}</span>
          </div>

          <div className="mt-9 space-y-6 text-[17px] leading-[1.75] sm:text-[17.5px]">
            {post.body.map((block, i) =>
              block.startsWith("## ") ? (
                <h2
                  key={i}
                  className="!mt-12 text-[24px] font-semibold tracking-[-0.02em] sm:text-[26px]"
                >
                  {block.slice(3)}
                </h2>
              ) : (
                <p key={i}>{block}</p>
              ),
            )}
          </div>

          <div className="mt-12 flex items-start gap-4 rounded bg-surface p-6">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line bg-card text-sm font-semibold text-muted">
              {post.initials}
            </span>
            <div>
              <p className="text-[14.5px] font-semibold">{post.author}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{post.bio}</p>
            </div>
          </div>
        </div>
      </article>

      <CtaBanner
        title="Move something big."
        sub="The fastest way to understand the protocol is to watch it saturate your link."
      />
    </SiteShell>
  );
}
