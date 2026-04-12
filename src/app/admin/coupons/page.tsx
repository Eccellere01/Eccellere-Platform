"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronLeft, Plus, Copy, Tag, Calendar, Percent, IndianRupee } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Coupon = {
  id: string;
  code: string;
  description: string;
  type: "percentage" | "fixed";
  value: number;
  minOrder: number;
  maxUses: number;
  usedCount: number;
  status: "active" | "expired" | "draft";
  validFrom: string;
  validTo: string;
  appliesTo: string;
};

const coupons: Coupon[] = [
  { id: "CP-001", code: "WELCOME20", description: "Welcome discount for new clients", type: "percentage", value: 20, minOrder: 999, maxUses: 500, usedCount: 312, status: "active", validFrom: "Jan 2026", validTo: "Dec 2026", appliesTo: "All Assets" },
  { id: "CP-002", code: "MSME10", description: "MSME Hub special discount", type: "percentage", value: 10, minOrder: 0, maxUses: 1000, usedCount: 487, status: "active", validFrom: "Mar 2026", validTo: "Sep 2026", appliesTo: "MSME Hub" },
  { id: "CP-003", code: "STRATEGY500", description: "₹500 off strategy playbooks", type: "fixed", value: 500, minOrder: 1999, maxUses: 200, usedCount: 142, status: "active", validFrom: "Feb 2026", validTo: "Jun 2026", appliesTo: "Strategy" },
  { id: "CP-004", code: "AIREADY15", description: "AI readiness toolkit discount", type: "percentage", value: 15, minOrder: 1499, maxUses: 100, usedCount: 67, status: "active", validFrom: "Apr 2026", validTo: "Jul 2026", appliesTo: "Agentic AI" },
  { id: "CP-005", code: "BUNDLE1000", description: "₹1000 off when buying 3+ assets", type: "fixed", value: 1000, minOrder: 4999, maxUses: 50, usedCount: 23, status: "active", validFrom: "Apr 2026", validTo: "Jun 2026", appliesTo: "All Assets" },
  { id: "CP-006", code: "DIWALI25", description: "Diwali special offer", type: "percentage", value: 25, minOrder: 0, maxUses: 300, usedCount: 300, status: "expired", validFrom: "Oct 2025", validTo: "Nov 2025", appliesTo: "All Assets" },
  { id: "CP-007", code: "SUMMER2026", description: "Summer sale — upcoming", type: "percentage", value: 20, minOrder: 999, maxUses: 500, usedCount: 0, status: "draft", validFrom: "Jun 2026", validTo: "Aug 2026", appliesTo: "All Assets" },
];

const statusStyles: Record<string, string> = {
  active: "bg-eccellere-teal/10 text-eccellere-teal",
  expired: "bg-eccellere-ink/5 text-ink-light",
  draft: "bg-eccellere-gold/10 text-eccellere-gold",
};

export default function AdminCoupons() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = coupons.filter((c) => {
    const matchesSearch = c.code.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="min-h-screen bg-eccellere-cream">
      <header className="border-b border-eccellere-ink/5 bg-white">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-4 px-6">
          <Link href="/admin" className="text-ink-light hover:text-eccellere-ink">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-medium text-eccellere-ink">Coupons & Discounts</h1>
          <span className="rounded-full bg-eccellere-gold/10 px-2 py-0.5 text-xs text-eccellere-gold">{coupons.filter((c) => c.status === "active").length} active</span>
          <div className="flex-1" />
          <Button size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Create Coupon
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-6 py-8">
        {/* Summary */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Active Coupons", value: coupons.filter((c) => c.status === "active").length, color: "text-eccellere-teal" },
            { label: "Total Redemptions", value: coupons.reduce((s, c) => s + c.usedCount, 0).toLocaleString("en-IN"), color: "text-eccellere-ink" },
            { label: "Avg Discount", value: "18%", color: "text-eccellere-gold" },
            { label: "Est. Revenue Impact", value: "₹4.2L", color: "text-eccellere-purple" },
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
              placeholder="Search coupons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-eccellere-ink/10 bg-white py-2.5 pl-10 pr-4 text-sm placeholder:text-ink-light focus:border-eccellere-gold focus:outline-none focus:ring-1 focus:ring-eccellere-gold"
            />
          </div>
          <div className="flex items-center gap-2">
            {["all", "active", "expired", "draft"].map((s) => (
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

        {/* Coupons Grid */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((coupon) => (
            <div key={coupon.id} className="overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md">
              <div className="border-b border-dashed border-eccellere-ink/10 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <code className="rounded bg-eccellere-ink/5 px-2 py-1 font-mono text-sm font-semibold text-eccellere-ink">{coupon.code}</code>
                      <button
                        onClick={() => copyCode(coupon.code)}
                        className="rounded p-1 text-ink-light hover:bg-eccellere-cream hover:text-eccellere-ink"
                        title="Copy code"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      {copied === coupon.code && (
                        <span className="text-[10px] text-eccellere-teal">Copied!</span>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-ink-mid">{coupon.description}</p>
                  </div>
                  <span className={cn("rounded-sm px-2 py-0.5 text-[9px] uppercase tracking-wider", statusStyles[coupon.status])}>
                    {coupon.status}
                  </span>
                </div>
              </div>

              <div className="space-y-3 p-5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-xs text-ink-light">
                    {coupon.type === "percentage" ? <Percent className="h-3 w-3" /> : <IndianRupee className="h-3 w-3" />}
                    Discount
                  </span>
                  <span className="font-mono text-sm font-semibold text-eccellere-gold">
                    {coupon.type === "percentage" ? `${coupon.value}%` : `₹${coupon.value}`}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-xs text-ink-light">
                    <Tag className="h-3 w-3" />
                    Applies to
                  </span>
                  <span className="text-xs text-ink-mid">{coupon.appliesTo}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-xs text-ink-light">
                    <Calendar className="h-3 w-3" />
                    Valid
                  </span>
                  <span className="text-xs text-ink-mid">{coupon.validFrom} – {coupon.validTo}</span>
                </div>

                {/* Usage bar */}
                <div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-ink-light">Usage</span>
                    <span className="text-ink-mid">{coupon.usedCount}/{coupon.maxUses}</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-eccellere-ink/5">
                    <div
                      className={cn("h-full rounded-full transition-all", coupon.usedCount >= coupon.maxUses ? "bg-eccellere-error" : "bg-eccellere-gold")}
                      style={{ width: `${Math.min((coupon.usedCount / coupon.maxUses) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {coupon.minOrder > 0 && (
                  <p className="text-[10px] text-ink-light">Min. order: ₹{coupon.minOrder.toLocaleString("en-IN")}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="mt-6 rounded-lg bg-white py-12 text-center text-sm text-ink-light shadow-sm">No coupons match your filters.</div>
        )}
      </main>
    </div>
  );
}
