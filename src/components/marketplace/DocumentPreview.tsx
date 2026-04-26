"use client";

import { useEffect, useState } from "react";
import { FileText, Lock, Loader2 } from "lucide-react";

interface Props {
  assetId: string;
  assetTitle: string;
}

// Blur intensity per page index (0-based). Pages 0-1 are clear.
const PAGE_BLUR: Record<number, string> = {
  0: "",
  1: "",
  2: "blur-[2px]",
  3: "blur-sm",
  4: "blur",
};

export function DocumentPreview({ assetId, assetTitle }: Props) {
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/marketplace/preview/${assetId}`)
      .then((r) => r.json())
      .then((data) => setPages(Array.isArray(data.pages) ? data.pages : []))
      .catch(() => setPages([]))
      .finally(() => setLoading(false));
  }, [assetId]);

  if (loading) {
    return (
      <div className="mt-4 flex h-40 items-center justify-center rounded-lg border border-eccellere-ink/10 bg-white">
        <Loader2 className="h-5 w-5 animate-spin text-ink-light" />
      </div>
    );
  }

  if (pages.length === 0) return null;

  const visiblePages = pages.slice(0, 5);
  const hasBlurred = visiblePages.length > 2;

  return (
    <div className="mt-4 overflow-hidden rounded-lg border border-eccellere-ink/10 bg-white shadow-sm">
      {/* Document chrome bar */}
      <div className="flex items-center gap-1.5 border-b border-eccellere-ink/[0.08] bg-eccellere-ink/[0.03] px-4 py-2.5">
        <FileText className="h-3.5 w-3.5 text-ink-light" />
        <span className="truncate text-xs text-ink-light">{assetTitle}</span>
        <span className="ml-auto flex-shrink-0 rounded-full bg-eccellere-gold/15 px-2 py-0.5 text-[10px] font-medium text-eccellere-gold">
          Preview · {visiblePages.length} pages
        </span>
      </div>

      {/* Pages */}
      <div className="relative">
        {visiblePages.map((page, i) => (
          <div
            key={i}
            className={`relative border-b border-eccellere-ink/[0.05] px-6 py-5 transition-all ${PAGE_BLUR[i] ?? "blur"} ${i >= 2 ? "select-none pointer-events-none" : ""}`}
          >
            {/* Page header */}
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-eccellere-gold/10 text-[10px] font-semibold text-eccellere-gold">
                {i + 1}
              </div>
              <span className="text-[10px] font-medium uppercase tracking-widest text-ink-light">
                Page {i + 1}
              </span>
              {i >= 2 && <Lock className="ml-auto h-3 w-3 text-ink-light" />}
            </div>

            {/* Page text */}
            <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-ink-mid">
              {page}
            </p>
          </div>
        ))}

        {/* Gradient fade over blurred pages */}
        {hasBlurred && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-white via-white/70 to-transparent" />
        )}
      </div>

      {/* Purchase footer */}
      <div className="border-t border-eccellere-ink/[0.08] bg-eccellere-ink/[0.02] px-6 py-3.5">
        <div className="flex items-center justify-center gap-2">
          <Lock className="h-3.5 w-3.5 text-ink-light" />
          <span className="text-xs text-ink-light">
            Purchase to access the full document
          </span>
        </div>
      </div>
    </div>
  );
}
