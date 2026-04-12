"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronLeft, Shield, User, FileText, Settings, LogIn, ShoppingCart, Download, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type AuditEntry = {
  id: string;
  timestamp: string;
  user: string;
  role: "admin" | "client" | "specialist" | "system";
  action: string;
  category: "auth" | "content" | "order" | "user" | "system" | "finance";
  resource: string;
  ip: string;
  severity: "info" | "warning" | "critical";
};

const auditLog: AuditEntry[] = [
  { id: "AL-1042", timestamp: "2026-04-12 14:32:18", user: "Admin User", role: "admin", action: "Approved specialist", category: "user", resource: "Karan Singh (U-010)", ip: "103.21.x.x", severity: "info" },
  { id: "AL-1041", timestamp: "2026-04-12 14:15:03", user: "System", role: "system", action: "Auto-generated invoice", category: "finance", resource: "INV-2026-388", ip: "—", severity: "info" },
  { id: "AL-1040", timestamp: "2026-04-12 13:45:22", user: "Vikram Patel", role: "specialist", action: "Uploaded new asset", category: "content", resource: "Digital Transformation Playbook v2 (AST-219)", ip: "49.36.x.x", severity: "info" },
  { id: "AL-1039", timestamp: "2026-04-12 12:08:41", user: "Admin User", role: "admin", action: "Rejected asset submission", category: "content", resource: "Basic HR Policy Template (AST-200)", ip: "103.21.x.x", severity: "warning" },
  { id: "AL-1038", timestamp: "2026-04-12 11:30:15", user: "Rajesh Kumar", role: "client", action: "Completed purchase", category: "order", resource: "ORD-2026-388 (₹4,498)", ip: "122.176.x.x", severity: "info" },
  { id: "AL-1037", timestamp: "2026-04-12 11:12:09", user: "System", role: "system", action: "Failed login attempt (3x)", category: "auth", resource: "unknown@temp.com", ip: "185.220.x.x", severity: "critical" },
  { id: "AL-1036", timestamp: "2026-04-12 10:45:33", user: "Priya Sharma", role: "client", action: "Downloaded asset", category: "order", resource: "E-Commerce Launch Checklist (AST-215)", ip: "59.145.x.x", severity: "info" },
  { id: "AL-1035", timestamp: "2026-04-12 10:20:17", user: "Admin User", role: "admin", action: "Updated coupon", category: "system", resource: "AIREADY15 — extended validity", ip: "103.21.x.x", severity: "info" },
  { id: "AL-1034", timestamp: "2026-04-12 09:55:42", user: "Meera Rao", role: "specialist", action: "Updated profile", category: "user", resource: "Added new certification", ip: "106.51.x.x", severity: "info" },
  { id: "AL-1033", timestamp: "2026-04-12 09:30:08", user: "System", role: "system", action: "Database backup completed", category: "system", resource: "Backup #2026-04-12-AM", ip: "—", severity: "info" },
  { id: "AL-1032", timestamp: "2026-04-11 18:45:20", user: "Admin User", role: "admin", action: "Suspended user", category: "user", resource: "Ankit Joshi (U-009)", ip: "103.21.x.x", severity: "warning" },
  { id: "AL-1031", timestamp: "2026-04-11 17:20:55", user: "System", role: "system", action: "Rate limit exceeded", category: "system", resource: "API /api/auth/login", ip: "185.220.x.x", severity: "critical" },
  { id: "AL-1030", timestamp: "2026-04-11 16:10:32", user: "Amit Desai", role: "client", action: "Registered account", category: "auth", resource: "U-007", ip: "157.48.x.x", severity: "info" },
  { id: "AL-1029", timestamp: "2026-04-11 15:00:18", user: "Admin User", role: "admin", action: "Published article", category: "content", resource: "How MSME Manufacturers Can... (C-112)", ip: "103.21.x.x", severity: "info" },
  { id: "AL-1028", timestamp: "2026-04-11 14:22:09", user: "Rohit Kapoor", role: "specialist", action: "Submitted payout request", category: "finance", resource: "₹45,200 to HDFC ****8842", ip: "223.186.x.x", severity: "info" },
];

const categoryIcons: Record<string, typeof Shield> = {
  auth: LogIn,
  content: FileText,
  order: ShoppingCart,
  user: User,
  system: Settings,
  finance: Download,
};

const roleStyles: Record<string, string> = {
  admin: "bg-eccellere-purple/10 text-eccellere-purple",
  client: "bg-eccellere-gold/10 text-eccellere-gold",
  specialist: "bg-eccellere-teal/10 text-eccellere-teal",
  system: "bg-eccellere-ink/5 text-ink-mid",
};

export default function AdminAuditLog() {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterSeverity, setFilterSeverity] = useState("all");

  const filtered = auditLog.filter((entry) => {
    const matchesSearch = entry.action.toLowerCase().includes(search.toLowerCase()) || entry.user.toLowerCase().includes(search.toLowerCase()) || entry.resource.toLowerCase().includes(search.toLowerCase());
    const matchesCat = filterCategory === "all" || entry.category === filterCategory;
    const matchesSev = filterSeverity === "all" || entry.severity === filterSeverity;
    return matchesSearch && matchesCat && matchesSev;
  });

  const criticalCount = auditLog.filter((e) => e.severity === "critical").length;

  return (
    <div className="min-h-screen bg-eccellere-cream">
      <header className="border-b border-eccellere-ink/5 bg-white">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-4 px-6">
          <Link href="/admin" className="text-ink-light hover:text-eccellere-ink">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-medium text-eccellere-ink">Audit Log</h1>
          <span className="rounded-full bg-eccellere-ink/5 px-2 py-0.5 text-xs text-ink-mid">{auditLog.length} entries</span>
          {criticalCount > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-eccellere-error/10 px-2 py-0.5 text-xs text-eccellere-error">
              <AlertTriangle className="h-3 w-3" />
              {criticalCount} critical
            </span>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-6 py-8">
        {/* Filters */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-light" />
            <input
              type="text"
              placeholder="Search actions, users, resources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-eccellere-ink/10 bg-white py-2.5 pl-10 pr-4 text-sm placeholder:text-ink-light focus:border-eccellere-gold focus:outline-none focus:ring-1 focus:ring-eccellere-gold"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-ink-light">Category:</span>
            {["all", "auth", "content", "order", "user", "system", "finance"].map((c) => (
              <button
                key={c}
                onClick={() => setFilterCategory(c)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-[10px] font-medium transition-colors",
                  filterCategory === c ? "bg-eccellere-gold text-white" : "bg-white text-ink-mid hover:bg-eccellere-cream"
                )}
              >
                {c === "all" ? "All" : c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
            <span className="ml-2 text-[10px] uppercase tracking-wider text-ink-light">Severity:</span>
            {["all", "info", "warning", "critical"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterSeverity(s)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-[10px] font-medium transition-colors",
                  filterSeverity === s ? "bg-eccellere-gold text-white" : "bg-white text-ink-mid hover:bg-eccellere-cream"
                )}
              >
                {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Log Table */}
        <div className="mt-6 overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-eccellere-ink/5">
                  <th className="px-4 py-3.5 text-left text-[10px] font-medium uppercase tracking-wider text-ink-light">Time</th>
                  <th className="px-4 py-3.5 text-left text-[10px] font-medium uppercase tracking-wider text-ink-light">User</th>
                  <th className="px-4 py-3.5 text-left text-[10px] font-medium uppercase tracking-wider text-ink-light">Action</th>
                  <th className="px-4 py-3.5 text-left text-[10px] font-medium uppercase tracking-wider text-ink-light">Resource</th>
                  <th className="px-4 py-3.5 text-left text-[10px] font-medium uppercase tracking-wider text-ink-light">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-eccellere-ink/5">
                {filtered.map((entry) => {
                  const CatIcon = categoryIcons[entry.category] || Settings;
                  return (
                    <tr key={entry.id} className={cn("transition-colors hover:bg-eccellere-cream/50", entry.severity === "critical" && "bg-eccellere-error/[0.02]")}>
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="flex items-center gap-2">
                          {entry.severity === "critical" && <AlertTriangle className="h-3.5 w-3.5 text-eccellere-error" />}
                          {entry.severity === "warning" && <AlertTriangle className="h-3.5 w-3.5 text-eccellere-gold" />}
                          <span className="font-mono text-xs text-ink-mid">{entry.timestamp}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={cn("rounded-sm px-1.5 py-0.5 text-[9px] uppercase tracking-wider", roleStyles[entry.role])}>
                            {entry.role}
                          </span>
                          <span className="text-xs text-eccellere-ink">{entry.user}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1.5 text-xs text-ink-mid">
                          <CatIcon className="h-3.5 w-3.5" />
                          {entry.action}
                        </span>
                      </td>
                      <td className="max-w-[200px] px-4 py-3">
                        <span className="truncate text-xs text-ink-light">{entry.resource}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-[10px] text-ink-light">{entry.ip}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-ink-light">No log entries match your filters.</div>
          )}
        </div>
      </main>
    </div>
  );
}
