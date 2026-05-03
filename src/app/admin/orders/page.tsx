"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Search,
  ChevronLeft,
  Filter,
  MoreHorizontal,
  Download,
  RefreshCw,
  Pencil,
  Trash2,
  FileText,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Order = {
  id: string;
  orderNumber: string;
  client: string;
  email: string;
  asset: string;
  amount: string;
  status: string;
  payment: string;
  date: string;
};

const ALL_STATUSES = ["PENDING", "PAID", "FAILED", "REFUND_REQUESTED", "REFUNDED", "PARTIALLY_REFUNDED", "CANCELLED"];

const statusColors: Record<string, string> = {
  paid: "bg-eccellere-teal/10 text-eccellere-teal",
  pending: "bg-eccellere-gold/10 text-eccellere-gold",
  refunded: "bg-eccellere-error/10 text-eccellere-error",
  refund_requested: "bg-eccellere-error/10 text-eccellere-error",
  partially_refunded: "bg-eccellere-error/10 text-eccellere-error",
  failed: "bg-ink-light/10 text-ink-light",
  cancelled: "bg-ink-light/10 text-ink-light",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // dropdown / inline-edit state
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editStatusId, setEditStatusId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/orders");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setOrders(data.orders ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleStatusSave = async (orderId: string, newStatus: string) => {
    setSavingId(orderId);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus.toLowerCase() } : o))
      );
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to update status");
    } finally {
      setSavingId(null);
      setEditStatusId(null);
    }
  };

  const handleDelete = async (order: Order) => {
    if (!window.confirm(`Delete order ${order.orderNumber} for ${order.client}?\n\nThis cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/orders?id=${order.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to delete order");
    }
    setOpenMenuId(null);
  };

  const handleSendInvoice = async (order: Order) => {
    setOpenMenuId(null);
    try {
      const res = await fetch("/api/admin/orders/send-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      alert(`Invoice sent to ${order.email}`);
    } catch {
      alert("Invoice sending not yet configured.");
    }
  };

  const allStatusFilters = ["all", ...Array.from(new Set(orders.map((o) => o.status)))];

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
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
          {!loading && !error && (
            <span className="rounded-full bg-eccellere-gold/10 px-2 py-0.5 text-xs text-eccellere-gold">
              {orders.length}
            </span>
          )}
          <div className="flex-1" />
          <Button variant="ghost" size="sm" onClick={fetchOrders} disabled={loading}>
            <RefreshCw className={cn("mr-2 h-4 w-4", loading && "animate-spin")} />
            Refresh
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-6 py-8">
        {/* Error banner */}
        {error && (
          <div className="mb-4 rounded-md border border-eccellere-error/20 bg-eccellere-error/5 px-4 py-3 text-sm text-eccellere-error">
            {error} —{" "}
            <button className="underline" onClick={fetchOrders}>
              retry
            </button>
          </div>
        )}

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
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-ink-light" />
            {allStatusFilters.map((s) => (
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
                {s === "all" ? "All" : s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </button>
            ))}
          </div>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="mt-6 space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-lg bg-white" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && orders.length === 0 && (
          <div className="mt-16 text-center">
            <CheckCircle className="mx-auto mb-3 h-10 w-10 text-ink-light/30" />
            <p className="text-sm text-ink-light">No orders yet. They will appear here once customers purchase assets.</p>
          </div>
        )}

        {/* Table */}
        {!loading && orders.length > 0 && (
          <div className="mt-6 overflow-hidden rounded-lg bg-white shadow-sm" ref={menuRef}>
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
                      <td className="px-6 py-4 font-mono text-sm text-eccellere-gold">{order.orderNumber}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-eccellere-ink">{order.client}</div>
                        <div className="text-xs text-ink-light">{order.email}</div>
                      </td>
                      <td className="max-w-[200px] truncate px-6 py-4 text-sm text-ink-mid">{order.asset}</td>
                      <td className="px-6 py-4">
                        {editStatusId === order.id ? (
                          <select
                            autoFocus
                            defaultValue={order.status.toUpperCase()}
                            disabled={savingId === order.id}
                            onChange={(e) => handleStatusSave(order.id, e.target.value)}
                            onBlur={() => setEditStatusId(null)}
                            className="rounded border border-eccellere-ink/10 bg-white px-2 py-1 text-xs focus:border-eccellere-gold focus:outline-none"
                          >
                            {ALL_STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s.replace(/_/g, " ")}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span
                            className={cn(
                              "rounded-sm px-2 py-0.5 text-[10px] uppercase tracking-wider",
                              statusColors[order.status] ?? "bg-ink-light/10 text-ink-light"
                            )}
                          >
                            {order.status.replace(/_/g, " ")}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-ink-light">{order.payment}</td>
                      <td className="px-6 py-4 text-right font-mono text-sm text-eccellere-ink">{order.amount}</td>
                      <td className="px-6 py-4 text-right text-xs text-ink-light">{order.date}</td>
                      <td className="relative px-4 py-4">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === order.id ? null : order.id)}
                          className="rounded p-1 text-ink-light hover:bg-eccellere-cream hover:text-eccellere-ink"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                        {openMenuId === order.id && (
                          <div className="absolute right-4 top-full z-20 mt-1 w-44 overflow-hidden rounded-lg border border-eccellere-ink/10 bg-white shadow-lg">
                            <button
                              onClick={() => {
                                setEditStatusId(order.id);
                                setOpenMenuId(null);
                              }}
                              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-eccellere-ink hover:bg-eccellere-cream"
                            >
                              <Pencil className="h-3.5 w-3.5 text-ink-light" />
                              Edit Status
                            </button>
                            <button
                              onClick={() => handleSendInvoice(order)}
                              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-eccellere-ink hover:bg-eccellere-cream"
                            >
                              <FileText className="h-3.5 w-3.5 text-ink-light" />
                              Send Invoice
                            </button>
                            <div className="my-1 border-t border-eccellere-ink/5" />
                            <button
                              onClick={() => handleDelete(order)}
                              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-eccellere-error hover:bg-eccellere-error/5"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </button>
                          </div>
                        )}
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
        )}
      </main>
    </div>
  );
}

type Order = {
  id: string;
  orderNumber: string;
  client: string;
  email: string;
  asset: string;
  amount: string;
  status: string;
  payment: string;
  date: string;
};

const statusColors: Record<string, string> = {
  paid: "bg-eccellere-teal/10 text-eccellere-teal",
  pending: "bg-eccellere-gold/10 text-eccellere-gold",
  refunded: "bg-eccellere-error/10 text-eccellere-error",
  refund_requested: "bg-eccellere-error/10 text-eccellere-error",
  partially_refunded: "bg-eccellere-error/10 text-eccellere-error",
  failed: "bg-ink-light/10 text-ink-light",
  cancelled: "bg-ink-light/10 text-ink-light",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/orders");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setOrders(data.orders ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Use real orders, fall back to the single sample if none exist
  const displayOrders = orders.length > 0 ? orders : [SAMPLE_ORDER];
  const isSample = orders.length === 0 && !loading && !error;

  const allStatuses = ["all", ...Array.from(new Set(displayOrders.map((o) => o.status)))];

  const filtered = displayOrders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
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
          {!loading && !error && (
            <span className="rounded-full bg-eccellere-gold/10 px-2 py-0.5 text-xs text-eccellere-gold">
              {orders.length}
            </span>
          )}
          <div className="flex-1" />
          <Button variant="ghost" size="sm" onClick={fetchOrders} disabled={loading}>
            <RefreshCw className={cn("mr-2 h-4 w-4", loading && "animate-spin")} />
            Refresh
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-6 py-8">
        {/* Error banner */}
        {error && (
          <div className="mb-4 rounded-md border border-eccellere-error/20 bg-eccellere-error/5 px-4 py-3 text-sm text-eccellere-error">
            {error} —{" "}
            <button className="underline" onClick={fetchOrders}>
              retry
            </button>
          </div>
        )}

        {/* Sample notice */}
        {isSample && (
          <div className="mb-4 rounded-md border border-eccellere-gold/20 bg-eccellere-gold/5 px-4 py-3 text-sm text-eccellere-gold">
            No orders placed yet. Showing a sample row for reference.
          </div>
        )}

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
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-ink-light" />
            {allStatuses.map((s) => (
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
                {s === "all" ? "All" : s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </button>
            ))}
          </div>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="mt-6 space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-lg bg-white" />
            ))}
          </div>
        )}

        {/* Table */}
        {!loading && (
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
                    <tr
                      key={order.id}
                      className={cn(
                        "transition-colors hover:bg-eccellere-cream/50",
                        order.id === "sample" && "opacity-60"
                      )}
                    >
                      <td className="px-6 py-4 font-mono text-sm text-eccellere-gold">{order.orderNumber}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-eccellere-ink">{order.client}</div>
                        <div className="text-xs text-ink-light">{order.email}</div>
                      </td>
                      <td className="max-w-[200px] truncate px-6 py-4 text-sm text-ink-mid">{order.asset}</td>
                      <td className="px-6 py-4">
                        <span className={cn("rounded-sm px-2 py-0.5 text-[10px] uppercase tracking-wider", statusColors[order.status] ?? "bg-ink-light/10 text-ink-light")}>
                          {order.status.replace(/_/g, " ")}
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
        )}
      </main>
    </div>
  );
}
