"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronLeft, Filter, Plus, Eye, Edit2, Globe, FileText, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type ContentItem = {
  id: string;
  title: string;
  type: "article" | "case-study" | "guide" | "video";
  author: string;
  status: "published" | "draft" | "scheduled";
  category: string;
  views: number;
  publishDate: string | null;
};

const contentItems: ContentItem[] = [
  { id: "C-112", title: "How MSME Manufacturers Can Unlock 30% Efficiency Gains with AI", type: "article", author: "Eccellere Team", status: "published", category: "Manufacturing", views: 3420, publishDate: "Mar 2026" },
  { id: "C-111", title: "Digital Transformation Roadmap for Indian Retail", type: "guide", author: "Vikram Patel", status: "published", category: "Retail", views: 2180, publishDate: "Feb 2026" },
  { id: "C-110", title: "Case Study: 40% Waste Reduction at Textile MSME", type: "case-study", author: "Rohit Kapoor", status: "published", category: "Manufacturing", views: 1850, publishDate: "Jan 2026" },
  { id: "C-109", title: "Agentic AI for Supply Chain: A Beginner's Guide", type: "article", author: "Eccellere Team", status: "published", category: "Logistics", views: 4210, publishDate: "Dec 2025" },
  { id: "C-108", title: "Building a D2C Brand: From Offline to Online", type: "video", author: "Meera Rao", status: "published", category: "Consumer Products", views: 1420, publishDate: "Nov 2025" },
  { id: "C-113", title: "Sustainability Reporting for MSMEs — A Practical Template", type: "guide", author: "Ananya Desai", status: "draft", category: "Strategy", views: 0, publishDate: null },
  { id: "C-114", title: "Warehouse Automation ROI Calculator Walkthrough", type: "video", author: "Arun Nair", status: "draft", category: "Logistics", views: 0, publishDate: null },
  { id: "C-115", title: "Q2 2026 Industry Outlook: Manufacturing Sector", type: "article", author: "Eccellere Team", status: "scheduled", category: "Manufacturing", views: 0, publishDate: "May 2026" },
  { id: "C-116", title: "The Specialist Advantage: Building Your Consulting Practice", type: "article", author: "Eccellere Team", status: "scheduled", category: "General", views: 0, publishDate: "May 2026" },
];

const typeIcons: Record<string, typeof FileText> = {
  article: FileText,
  "case-study": Tag,
  guide: FileText,
  video: Globe,
};

const statusStyles: Record<string, string> = {
  published: "bg-eccellere-teal/10 text-eccellere-teal",
  draft: "bg-eccellere-ink/5 text-ink-mid",
  scheduled: "bg-eccellere-gold/10 text-eccellere-gold",
};

export default function AdminContent() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filtered = contentItems.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.author.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "all" || c.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-eccellere-cream">
      <header className="border-b border-eccellere-ink/5 bg-white">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-4 px-6">
          <Link href="/admin" className="text-ink-light hover:text-eccellere-ink">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-medium text-eccellere-ink">Content Management</h1>
          <span className="rounded-full bg-eccellere-gold/10 px-2 py-0.5 text-xs text-eccellere-gold">{contentItems.length} items</span>
          <div className="flex-1" />
          <Button size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            New Article
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-6 py-8">
        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Published", value: contentItems.filter((c) => c.status === "published").length, color: "text-eccellere-teal" },
            { label: "Drafts", value: contentItems.filter((c) => c.status === "draft").length, color: "text-ink-mid" },
            { label: "Scheduled", value: contentItems.filter((c) => c.status === "scheduled").length, color: "text-eccellere-gold" },
            { label: "Total Views", value: contentItems.reduce((s, c) => s + c.views, 0).toLocaleString("en-IN"), color: "text-eccellere-ink" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg bg-white p-4 shadow-sm">
              <p className="text-[10px] uppercase tracking-wider text-ink-light">{stat.label}</p>
              <p className={cn("mt-1 text-2xl font-light", stat.color)}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-light" />
            <input
              type="text"
              placeholder="Search content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-eccellere-ink/10 bg-white py-2.5 pl-10 pr-4 text-sm placeholder:text-ink-light focus:border-eccellere-gold focus:outline-none focus:ring-1 focus:ring-eccellere-gold"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-ink-light" />
            {["all", "article", "case-study", "guide", "video"].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  filterType === t ? "bg-eccellere-gold text-white" : "bg-white text-ink-mid hover:bg-eccellere-cream"
                )}
              >
                {t === "all" ? "All" : t === "case-study" ? "Case Study" : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content Table */}
        <div className="mt-6 overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-eccellere-ink/5">
                  <th className="px-6 py-3.5 text-left text-[10px] font-medium uppercase tracking-wider text-ink-light">Content</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-medium uppercase tracking-wider text-ink-light">Type</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-medium uppercase tracking-wider text-ink-light">Category</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-medium uppercase tracking-wider text-ink-light">Status</th>
                  <th className="px-6 py-3.5 text-right text-[10px] font-medium uppercase tracking-wider text-ink-light">Views</th>
                  <th className="w-24" />
                </tr>
              </thead>
              <tbody className="divide-y divide-eccellere-ink/5">
                {filtered.map((item) => {
                  const TypeIcon = typeIcons[item.type] || FileText;
                  return (
                    <tr key={item.id} className="transition-colors hover:bg-eccellere-cream/50">
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-eccellere-ink">{item.title}</p>
                        <p className="text-xs text-ink-light">by {item.author} · {item.publishDate ?? "Unpublished"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-xs text-ink-mid">
                          <TypeIcon className="h-3.5 w-3.5" />
                          {item.type === "case-study" ? "Case Study" : item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-sm bg-eccellere-gold/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-eccellere-gold">{item.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn("rounded-sm px-2 py-0.5 text-[10px] uppercase tracking-wider", statusStyles[item.status])}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-sm text-ink-mid">{item.views > 0 ? item.views.toLocaleString("en-IN") : "—"}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button className="rounded p-1 text-ink-light hover:bg-eccellere-cream hover:text-eccellere-ink">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="rounded p-1 text-ink-light hover:bg-eccellere-cream hover:text-eccellere-ink">
                            <Edit2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-ink-light">No content matches your filters.</div>
          )}
        </div>
      </main>
    </div>
  );
}
