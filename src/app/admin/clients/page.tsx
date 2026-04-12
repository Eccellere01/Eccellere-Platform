"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronLeft, Filter, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const clients = [
  { id: "CLT-001", name: "Arjun Textiles Pvt Ltd", sector: "Manufacturing", status: "active", plan: "Growth", revenue: "₹1,24,500", joined: "Jan 2026" },
  { id: "CLT-002", name: "FreshBasket D2C", sector: "Retail", status: "active", plan: "Enterprise", revenue: "₹3,45,000", joined: "Nov 2025" },
  { id: "CLT-003", name: "SwiftShip Logistics", sector: "Logistics", status: "active", plan: "Growth", revenue: "₹87,000", joined: "Feb 2026" },
  { id: "CLT-004", name: "Precision Auto Components", sector: "Manufacturing", status: "active", plan: "Enterprise", revenue: "₹5,12,000", joined: "Sep 2025" },
  { id: "CLT-005", name: "NatureCraft Organics", sector: "Consumer Products", status: "onboarding", plan: "Starter", revenue: "₹12,500", joined: "Mar 2026" },
  { id: "CLT-006", name: "UrbanEats Cloud Kitchen", sector: "Retail", status: "active", plan: "Growth", revenue: "₹67,800", joined: "Dec 2025" },
  { id: "CLT-007", name: "GreenPack Solutions", sector: "Manufacturing", status: "churned", plan: "Starter", revenue: "₹24,000", joined: "Aug 2025" },
  { id: "CLT-008", name: "QuickComm Delivery", sector: "Logistics", status: "active", plan: "Growth", revenue: "₹1,56,000", joined: "Oct 2025" },
  { id: "CLT-009", name: "Vedic Wellness Co", sector: "Consumer Products", status: "onboarding", plan: "Starter", revenue: "₹0", joined: "Apr 2026" },
  { id: "CLT-010", name: "MetalWorks India", sector: "Manufacturing", status: "active", plan: "Enterprise", revenue: "₹4,87,000", joined: "Jul 2025" },
];

const statusColors: Record<string, string> = {
  active: "bg-eccellere-teal/10 text-eccellere-teal",
  onboarding: "bg-eccellere-gold/10 text-eccellere-gold",
  churned: "bg-eccellere-error/10 text-eccellere-error",
};

export default function AdminClients() {
  const [search, setSearch] = useState("");
  const [filterSector, setFilterSector] = useState("all");

  const filtered = clients.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase());
    const matchesSector = filterSector === "all" || c.sector === filterSector;
    return matchesSearch && matchesSector;
  });

  return (
    <div className="min-h-screen bg-eccellere-cream">
      <header className="border-b border-eccellere-ink/5 bg-white">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-4 px-6">
          <Link href="/admin" className="text-ink-light hover:text-eccellere-ink">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-medium text-eccellere-ink">Clients</h1>
          <span className="rounded-full bg-eccellere-gold/10 px-2 py-0.5 text-xs text-eccellere-gold">
            {clients.length}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-6 py-8">
        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-light" />
            <input
              type="text"
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-eccellere-ink/10 bg-white py-2.5 pl-10 pr-4 text-sm placeholder:text-ink-light focus:border-eccellere-gold focus:outline-none focus:ring-1 focus:ring-eccellere-gold"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-ink-light" />
            {["all", "Manufacturing", "Retail", "Logistics", "Consumer Products"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterSector(s)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  filterSector === s
                    ? "bg-eccellere-gold text-white"
                    : "bg-white text-ink-mid hover:bg-eccellere-cream"
                )}
              >
                {s === "all" ? "All" : s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="mt-6 overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-eccellere-ink/5">
                  <th className="px-6 py-3.5 text-left text-[10px] font-medium uppercase tracking-wider text-ink-light">
                    Client
                  </th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-medium uppercase tracking-wider text-ink-light">
                    Sector
                  </th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-medium uppercase tracking-wider text-ink-light">
                    Status
                  </th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-medium uppercase tracking-wider text-ink-light">
                    Plan
                  </th>
                  <th className="px-6 py-3.5 text-right text-[10px] font-medium uppercase tracking-wider text-ink-light">
                    Revenue
                  </th>
                  <th className="px-6 py-3.5 text-right text-[10px] font-medium uppercase tracking-wider text-ink-light">
                    Joined
                  </th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-eccellere-ink/5">
                {filtered.map((client) => (
                  <tr key={client.id} className="transition-colors hover:bg-eccellere-cream/50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-eccellere-ink">{client.name}</p>
                      <p className="text-xs text-ink-light">{client.id}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-ink-mid">{client.sector}</td>
                    <td className="px-6 py-4">
                      <span className={cn("rounded-sm px-2 py-0.5 text-[10px] uppercase tracking-wider", statusColors[client.status])}>
                        {client.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-ink-mid">{client.plan}</td>
                    <td className="px-6 py-4 text-right font-mono text-sm text-eccellere-ink">{client.revenue}</td>
                    <td className="px-6 py-4 text-right text-xs text-ink-light">{client.joined}</td>
                    <td className="px-4 py-4">
                      <button className="rounded p-1 text-ink-light hover:bg-eccellere-cream hover:text-eccellere-ink">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-ink-light">
              No clients match your search.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
