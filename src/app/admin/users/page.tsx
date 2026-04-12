"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronLeft, Filter, Shield, User, Mail, Calendar, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

type UserItem = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "client" | "specialist";
  status: "active" | "suspended" | "pending";
  joined: string;
  lastLogin: string;
};

const users: UserItem[] = [
  { id: "U-001", name: "Admin User", email: "admin@eccellere.in", role: "admin", status: "active", joined: "Jan 2025", lastLogin: "Today" },
  { id: "U-002", name: "Rajesh Kumar", email: "rajesh@textilesmsme.in", role: "client", status: "active", joined: "Mar 2025", lastLogin: "Today" },
  { id: "U-003", name: "Vikram Patel", email: "vikram@consultant.in", role: "specialist", status: "active", joined: "Feb 2025", lastLogin: "Yesterday" },
  { id: "U-004", name: "Priya Sharma", email: "priya@retailchain.in", role: "client", status: "active", joined: "Apr 2025", lastLogin: "Apr 10" },
  { id: "U-005", name: "Rohit Kapoor", email: "rohit@leanops.com", role: "specialist", status: "active", joined: "Mar 2025", lastLogin: "Apr 8" },
  { id: "U-006", name: "Meera Rao", email: "meera@digital.co", role: "specialist", status: "active", joined: "May 2025", lastLogin: "Today" },
  { id: "U-007", name: "Amit Desai", email: "amit@autoparts.in", role: "client", status: "active", joined: "Jun 2025", lastLogin: "Apr 9" },
  { id: "U-008", name: "Sneha Patel", email: "sneha@foodco.in", role: "client", status: "pending", joined: "Apr 2026", lastLogin: "Never" },
  { id: "U-009", name: "Ankit Joshi", email: "ankit@logistics.in", role: "client", status: "suspended", joined: "Nov 2025", lastLogin: "Mar 2026" },
  { id: "U-010", name: "Karan Singh", email: "karan@d2cbrand.in", role: "specialist", status: "pending", joined: "Apr 2026", lastLogin: "Never" },
  { id: "U-011", name: "Deepak Verma", email: "deepak@hrconsult.in", role: "specialist", status: "suspended", joined: "Jan 2026", lastLogin: "Feb 2026" },
  { id: "U-012", name: "Neha Gupta", email: "neha@pharma.co.in", role: "client", status: "active", joined: "Sep 2025", lastLogin: "Apr 11" },
];

const roleConfig: Record<string, { color: string; icon: typeof Shield }> = {
  admin: { color: "bg-eccellere-purple/10 text-eccellere-purple", icon: Shield },
  client: { color: "bg-eccellere-gold/10 text-eccellere-gold", icon: User },
  specialist: { color: "bg-eccellere-teal/10 text-eccellere-teal", icon: User },
};

const statusStyles: Record<string, string> = {
  active: "bg-eccellere-teal/10 text-eccellere-teal",
  suspended: "bg-eccellere-error/10 text-eccellere-error",
  pending: "bg-eccellere-gold/10 text-eccellere-gold",
};

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const filtered = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === "all" || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-eccellere-cream">
      <header className="border-b border-eccellere-ink/5 bg-white">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-4 px-6">
          <Link href="/admin" className="text-ink-light hover:text-eccellere-ink">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-medium text-eccellere-ink">Users</h1>
          <span className="rounded-full bg-eccellere-gold/10 px-2 py-0.5 text-xs text-eccellere-gold">{users.length}</span>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-6 py-8">
        {/* Role summary cards */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total Users", value: users.length, color: "text-eccellere-ink" },
            { label: "Admins", value: users.filter((u) => u.role === "admin").length, color: "text-eccellere-purple" },
            { label: "Clients", value: users.filter((u) => u.role === "client").length, color: "text-eccellere-gold" },
            { label: "Specialists", value: users.filter((u) => u.role === "specialist").length, color: "text-eccellere-teal" },
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
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-eccellere-ink/10 bg-white py-2.5 pl-10 pr-4 text-sm placeholder:text-ink-light focus:border-eccellere-gold focus:outline-none focus:ring-1 focus:ring-eccellere-gold"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-ink-light" />
            {["all", "admin", "client", "specialist"].map((r) => (
              <button
                key={r}
                onClick={() => setFilterRole(r)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  filterRole === r ? "bg-eccellere-gold text-white" : "bg-white text-ink-mid hover:bg-eccellere-cream"
                )}
              >
                {r === "all" ? "All" : r.charAt(0).toUpperCase() + r.slice(1) + "s"}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <div className="mt-6 overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-eccellere-ink/5">
                  <th className="px-6 py-3.5 text-left text-[10px] font-medium uppercase tracking-wider text-ink-light">User</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-medium uppercase tracking-wider text-ink-light">Role</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-medium uppercase tracking-wider text-ink-light">Status</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-medium uppercase tracking-wider text-ink-light">Joined</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-medium uppercase tracking-wider text-ink-light">Last Login</th>
                  <th className="w-16" />
                </tr>
              </thead>
              <tbody className="divide-y divide-eccellere-ink/5">
                {filtered.map((user) => {
                  const RoleIcon = roleConfig[user.role].icon;
                  return (
                    <tr key={user.id} className="transition-colors hover:bg-eccellere-cream/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn("flex h-9 w-9 items-center justify-center rounded-full", roleConfig[user.role].color)}>
                            <RoleIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-eccellere-ink">{user.name}</p>
                            <p className="flex items-center gap-1 text-xs text-ink-light">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn("rounded-sm px-2 py-0.5 text-[10px] uppercase tracking-wider", roleConfig[user.role].color)}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn("rounded-sm px-2 py-0.5 text-[10px] uppercase tracking-wider", statusStyles[user.status])}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1 text-xs text-ink-mid">
                          <Calendar className="h-3 w-3" />
                          {user.joined}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-ink-mid">{user.lastLogin}</td>
                      <td className="px-4 py-4">
                        <button className="rounded p-1 text-ink-light hover:bg-eccellere-cream hover:text-eccellere-ink">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-ink-light">No users match your filters.</div>
          )}
        </div>
      </main>
    </div>
  );
}
