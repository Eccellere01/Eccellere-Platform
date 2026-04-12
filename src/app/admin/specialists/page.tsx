"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronLeft, Filter, CheckCircle, Clock, XCircle, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const specialists = [
  { id: "SP-042", name: "Vikram Patel", expertise: "Agentic AI, Digital Transformation", sectors: ["Manufacturing", "Retail"], status: "active", assets: 12, rating: 4.9, earnings: "₹3,42,500" },
  { id: "SP-018", name: "Ananya Desai", expertise: "Strategy, Process Transformation", sectors: ["Manufacturing", "Logistics"], status: "active", assets: 8, rating: 4.7, earnings: "₹2,18,000" },
  { id: "SP-035", name: "Rohit Kapoor", expertise: "Lean Manufacturing, Quality Systems", sectors: ["Manufacturing"], status: "active", assets: 15, rating: 4.8, earnings: "₹4,56,000" },
  { id: "SP-051", name: "Meera Rao", expertise: "Retail Strategy, Omnichannel", sectors: ["Retail", "Consumer Products"], status: "active", assets: 6, rating: 4.6, earnings: "₹1,87,000" },
  { id: "SP-058", name: "Arun Nair", expertise: "Supply Chain, Logistics Optimization", sectors: ["Logistics"], status: "pending", assets: 0, rating: null, earnings: "₹0" },
  { id: "SP-059", name: "Priyanka Joshi", expertise: "Organisation Transformation, HR", sectors: ["All Sectors"], status: "pending", assets: 0, rating: null, earnings: "₹0" },
  { id: "SP-060", name: "Karan Singh", expertise: "Digital Marketing, D2C Strategy", sectors: ["Retail", "Consumer Products"], status: "pending", assets: 0, rating: null, earnings: "₹0" },
  { id: "SP-023", name: "Deepak Verma", expertise: "ERP Implementation, Process", sectors: ["Manufacturing"], status: "inactive", assets: 3, rating: 4.2, earnings: "₹67,500" },
];

const statusConfig: Record<string, { color: string; icon: typeof CheckCircle }> = {
  active: { color: "bg-eccellere-teal/10 text-eccellere-teal", icon: CheckCircle },
  pending: { color: "bg-eccellere-gold/10 text-eccellere-gold", icon: Clock },
  inactive: { color: "bg-ink-light/10 text-ink-light", icon: XCircle },
};

export default function AdminSpecialists() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = specialists.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.expertise.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || s.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = specialists.filter((s) => s.status === "pending").length;

  return (
    <div className="min-h-screen bg-eccellere-cream">
      <header className="border-b border-eccellere-ink/5 bg-white">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-4 px-6">
          <Link href="/admin" className="text-ink-light hover:text-eccellere-ink">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-medium text-eccellere-ink">Specialists</h1>
          <span className="rounded-full bg-eccellere-gold/10 px-2 py-0.5 text-xs text-eccellere-gold">
            {specialists.length}
          </span>
          {pendingCount > 0 && (
            <span className="rounded-full bg-eccellere-error/10 px-2 py-0.5 text-xs text-eccellere-error">
              {pendingCount} pending
            </span>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-6 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-light" />
            <input
              type="text"
              placeholder="Search specialists..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-eccellere-ink/10 bg-white py-2.5 pl-10 pr-4 text-sm placeholder:text-ink-light focus:border-eccellere-gold focus:outline-none focus:ring-1 focus:ring-eccellere-gold"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-ink-light" />
            {["all", "active", "pending", "inactive"].map((s) => (
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

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((spec) => {
            const StatusIcon = statusConfig[spec.status].icon;
            return (
              <div key={spec.id} className="rounded-lg bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-eccellere-gold/10 font-mono text-sm text-eccellere-gold">
                      {spec.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <h3 className="mt-3 text-base font-medium text-eccellere-ink">{spec.name}</h3>
                    <p className="text-xs text-ink-light">{spec.id}</p>
                  </div>
                  <span className={cn("inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[10px] uppercase tracking-wider", statusConfig[spec.status].color)}>
                    <StatusIcon className="h-3 w-3" />
                    {spec.status}
                  </span>
                </div>

                <p className="mt-3 text-sm text-ink-mid">{spec.expertise}</p>

                <div className="mt-3 flex flex-wrap gap-1">
                  {spec.sectors.map((s) => (
                    <span key={s} className="rounded-sm bg-eccellere-cream px-2 py-0.5 text-[10px] uppercase tracking-wider text-ink-light">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-4 border-t border-eccellere-ink/5 pt-4 text-xs">
                  <span className="text-ink-light">{spec.assets} assets</span>
                  {spec.rating && (
                    <span className="flex items-center gap-1 text-eccellere-gold">
                      <Star className="h-3 w-3 fill-current" /> {spec.rating}
                    </span>
                  )}
                  <span className="ml-auto font-mono text-eccellere-gold">{spec.earnings}</span>
                </div>

                {spec.status === "pending" && (
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" className="flex-1 text-xs">Approve</Button>
                    <Button size="sm" variant="ghost" className="flex-1 text-xs">Reject</Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="mt-12 text-center text-sm text-ink-light">No specialists match your search.</div>
        )}
      </main>
    </div>
  );
}
