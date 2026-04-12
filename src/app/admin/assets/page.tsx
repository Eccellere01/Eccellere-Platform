"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronLeft, Filter, Eye, CheckCircle, Clock, XCircle, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const assets = [
  { id: "AST-218", title: "MSME Growth Strategy Playbook", specialist: "Vikram Patel", category: "Strategy", format: "PDF", price: "₹2,499", status: "published", sales: 187, rating: 4.9, submitted: "Sep 2025" },
  { id: "AST-217", title: "AI Readiness Assessment Toolkit", specialist: "Vikram Patel", category: "Agentic AI", format: "Excel", price: "₹1,999", status: "published", sales: 142, rating: 4.9, submitted: "Oct 2025" },
  { id: "AST-216", title: "Lean Manufacturing Implementation Guide", specialist: "Rohit Kapoor", category: "Process", format: "PDF + Template", price: "₹3,499", status: "published", sales: 98, rating: 4.7, submitted: "Aug 2025" },
  { id: "AST-215", title: "E-Commerce Launch Checklist", specialist: "Meera Rao", category: "Digital", format: "Template", price: "₹999", status: "published", sales: 234, rating: 4.6, submitted: "Nov 2025" },
  { id: "AST-219", title: "Digital Transformation Playbook v2", specialist: "Vikram Patel", category: "Digital", format: "PDF", price: "₹3,499", status: "pending", sales: 0, rating: null, submitted: "Apr 2026" },
  { id: "AST-220", title: "Route Optimisation Framework", specialist: "Arun Nair", category: "Logistics", format: "Excel + PDF", price: "₹2,999", status: "pending", sales: 0, rating: null, submitted: "Apr 2026" },
  { id: "AST-221", title: "MSME Financial Planning Template", specialist: "Ananya Desai", category: "Strategy", format: "Excel", price: "₹1,499", status: "pending", sales: 0, rating: null, submitted: "Apr 2026" },
  { id: "AST-222", title: "Brand Identity Toolkit for D2C", specialist: "Karan Singh", category: "Digital", format: "PDF + Figma", price: "₹2,499", status: "pending", sales: 0, rating: null, submitted: "Apr 2026" },
  { id: "AST-200", title: "Basic HR Policy Template", specialist: "Deepak Verma", category: "Organisation", format: "Word", price: "₹799", status: "rejected", sales: 0, rating: null, submitted: "Mar 2026" },
];

const statusConfig: Record<string, { color: string; icon: typeof CheckCircle }> = {
  published: { color: "bg-eccellere-teal/10 text-eccellere-teal", icon: CheckCircle },
  pending: { color: "bg-eccellere-gold/10 text-eccellere-gold", icon: Clock },
  rejected: { color: "bg-eccellere-error/10 text-eccellere-error", icon: XCircle },
};

export default function AdminAssets() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = assets.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.specialist.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || a.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = assets.filter((a) => a.status === "pending").length;

  return (
    <div className="min-h-screen bg-eccellere-cream">
      <header className="border-b border-eccellere-ink/5 bg-white">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-4 px-6">
          <Link href="/admin" className="text-ink-light hover:text-eccellere-ink">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-medium text-eccellere-ink">Assets</h1>
          <span className="rounded-full bg-eccellere-gold/10 px-2 py-0.5 text-xs text-eccellere-gold">{assets.length}</span>
          {pendingCount > 0 && (
            <span className="rounded-full bg-eccellere-error/10 px-2 py-0.5 text-xs text-eccellere-error">{pendingCount} pending review</span>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-6 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-light" />
            <input
              type="text"
              placeholder="Search assets or specialists..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-eccellere-ink/10 bg-white py-2.5 pl-10 pr-4 text-sm placeholder:text-ink-light focus:border-eccellere-gold focus:outline-none focus:ring-1 focus:ring-eccellere-gold"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-ink-light" />
            {["all", "published", "pending", "rejected"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  filterStatus === s ? "bg-eccellere-gold text-white" : "bg-white text-ink-mid hover:bg-eccellere-cream"
                )}
              >
                {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-eccellere-ink/5">
                  <th className="px-6 py-3.5 text-left text-[10px] font-medium uppercase tracking-wider text-ink-light">Asset</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-medium uppercase tracking-wider text-ink-light">Specialist</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-medium uppercase tracking-wider text-ink-light">Category</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-medium uppercase tracking-wider text-ink-light">Status</th>
                  <th className="px-6 py-3.5 text-right text-[10px] font-medium uppercase tracking-wider text-ink-light">Price</th>
                  <th className="px-6 py-3.5 text-right text-[10px] font-medium uppercase tracking-wider text-ink-light">Sales</th>
                  <th className="w-24" />
                </tr>
              </thead>
              <tbody className="divide-y divide-eccellere-ink/5">
                {filtered.map((asset) => {
                  const StatusIcon = statusConfig[asset.status].icon;
                  return (
                    <tr key={asset.id} className="transition-colors hover:bg-eccellere-cream/50">
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-eccellere-ink">{asset.title}</p>
                        <p className="text-xs text-ink-light">{asset.id} · {asset.format}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-ink-mid">{asset.specialist}</td>
                      <td className="px-6 py-4">
                        <span className="rounded-sm bg-eccellere-gold/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-eccellere-gold">{asset.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn("inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[10px] uppercase tracking-wider", statusConfig[asset.status].color)}>
                          <StatusIcon className="h-3 w-3" />
                          {asset.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-sm text-eccellere-ink">{asset.price}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="font-mono text-sm text-ink-mid">{asset.sales}</span>
                          {asset.rating && (
                            <span className="flex items-center gap-0.5 text-xs text-eccellere-gold">
                              <Star className="h-3 w-3 fill-current" />{asset.rating}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-1">
                          {asset.status === "pending" && (
                            <>
                              <Button size="sm" className="h-7 text-[10px]">Approve</Button>
                              <Button size="sm" variant="ghost" className="h-7 text-[10px]">Reject</Button>
                            </>
                          )}
                          {asset.status !== "pending" && (
                            <button className="rounded p-1 text-ink-light hover:bg-eccellere-cream hover:text-eccellere-ink">
                              <Eye className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-ink-light">No assets match your filters.</div>
          )}
        </div>
      </main>
    </div>
  );
}
