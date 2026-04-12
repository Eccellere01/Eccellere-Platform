"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronLeft, Filter, MoreHorizontal, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const orders = [
  { id: "ORD-2847", client: "FreshBasket D2C", asset: "Lean Manufacturing Guide", amount: "₹3,499", status: "completed", date: "Apr 11, 2026", payment: "Razorpay" },
  { id: "ORD-2846", client: "SwiftShip Logistics", asset: "Supply Chain Resilience Framework", amount: "₹2,999", status: "completed", date: "Apr 11, 2026", payment: "UPI" },
  { id: "ORD-2845", client: "Arjun Textiles Pvt Ltd", asset: "MSME Growth Strategy Playbook", amount: "₹2,499", status: "completed", date: "Apr 10, 2026", payment: "Razorpay" },
  { id: "ORD-2844", client: "NatureCraft Organics", asset: "D2C Brand Building Kit", amount: "₹1,999", status: "processing", date: "Apr 10, 2026", payment: "Bank Transfer" },
  { id: "ORD-2843", client: "QuickComm Delivery", asset: "Fleet Management Dashboard Template", amount: "₹4,999", status: "completed", date: "Apr 9, 2026", payment: "UPI" },
  { id: "ORD-2842", client: "MetalWorks India", asset: "AI Implementation Roadmap", amount: "₹3,499", status: "refunded", date: "Apr 8, 2026", payment: "Razorpay" },
  { id: "ORD-2841", client: "UrbanEats Cloud Kitchen", asset: "E-Commerce Launch Checklist", amount: "₹999", status: "completed", date: "Apr 8, 2026", payment: "UPI" },
  { id: "ORD-2840", client: "Precision Auto Components", asset: "Quality Systems Audit Toolkit", amount: "₹5,499", status: "completed", date: "Apr 7, 2026", payment: "Bank Transfer" },
];

const statusColors: Record<string, string> = {
  completed: "bg-eccellere-teal/10 text-eccellere-teal",
  processing: "bg-eccellere-gold/10 text-eccellere-gold",
  refunded: "bg-eccellere-error/10 text-eccellere-error",
  failed: "bg-ink-light/10 text-ink-light",
};

export default function AdminOrders() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.client.toLowerCase().includes(search.toLowerCase()) ||
      o.asset.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || o.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-eccellere-cream">
      <header className="border-b border-eccellere-ink/5 bg-white">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-4 px-6">
          <Link href="/admin" className="text-ink-light hover:text-eccellere-ink">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-medium text-eccellere-ink">Orders</h1>
          <span className="rounded-full bg-eccellere-gold/10 px-2 py-0.5 text-xs text-eccellere-gold">
            {orders.length}
          </span>
          <div className="flex-1" />
          <Button variant="ghost" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-6 py-8">
        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-light" />
            <input
              type="text"
              placeholder="Search orders, clients, assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-eccellere-ink/10 bg-white py-2.5 pl-10 pr-4 text-sm placeholder:text-ink-light focus:border-eccellere-gold focus:outline-none focus:ring-1 focus:ring-eccellere-gold"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-ink-light" />
            {["all", "completed", "processing", "refunded"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  filterStatus === s
                    ? "bg-eccellere-gold text-white"
                    : "bg-white text-ink-mid hover:bg-eccellere-cream"
                )}
              >
                {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
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
                  <th className="px-6 py-3.5 text-left text-[10px] font-medium uppercase tracking-wider text-ink-light">Order</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-medium uppercase tracking-wider text-ink-light">Client</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-medium uppercase tracking-wider text-ink-light">Asset</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-medium uppercase tracking-wider text-ink-light">Status</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-medium uppercase tracking-wider text-ink-light">Payment</th>
                  <th className="px-6 py-3.5 text-right text-[10px] font-medium uppercase tracking-wider text-ink-light">Amount</th>
                  <th className="px-6 py-3.5 text-right text-[10px] font-medium uppercase tracking-wider text-ink-light">Date</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-eccellere-ink/5">
                {filtered.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-eccellere-cream/50">
                    <td className="px-6 py-4 font-mono text-sm text-eccellere-gold">{order.id}</td>
                    <td className="px-6 py-4 text-sm text-eccellere-ink">{order.client}</td>
                    <td className="max-w-[200px] truncate px-6 py-4 text-sm text-ink-mid">{order.asset}</td>
                    <td className="px-6 py-4">
                      <span className={cn("rounded-sm px-2 py-0.5 text-[10px] uppercase tracking-wider", statusColors[order.status])}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-ink-light">{order.payment}</td>
                    <td className="px-6 py-4 text-right font-mono text-sm text-eccellere-ink">{order.amount}</td>
                    <td className="px-6 py-4 text-right text-xs text-ink-light">{order.date}</td>
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
            <div className="py-12 text-center text-sm text-ink-light">No orders match your filters.</div>
          )}
        </div>
      </main>
    </div>
  );
}
