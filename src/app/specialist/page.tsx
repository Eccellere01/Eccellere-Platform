?"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package, PlusCircle, ClipboardList, IndianRupee, User, BarChart3,
  Star, ArrowUpRight, Eye, Download, Clock, CheckCircle, AlertCircle,
  Loader2, Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SpecialistStats {
  name: string;
  kpis: {
    totalEarnings: number;
    publishedAssets: number;
    activeAssignments: number;
    avgRating: number;
  };
  recentAssets: {
    id: string;
    title: string;
    status: string;
    price: number;
    components: string[];
    hasFile: boolean;
    totalPurchases: number;
    totalRevenue: number;
    totalViews: number;
    averageRating: number | null;
  }[];
  activeAssignments: {
    id: string;
    title: string;
    clientName: string;
    dueDate: string | null;
    agreedFee: number | null;
    status: string;
  }[];
}

const STATUS_STYLE: Record<string, string> = {
  PUBLISHED: "bg-eccellere-teal/10 text-eccellere-teal",
  APPROVED: "bg-eccellere-teal/10 text-eccellere-teal",
  SUBMITTED: "bg-eccellere-gold/10 text-eccellere-gold",
  UNDER_REVIEW: "bg-blue-50 text-blue-600",
  REVISIONS_REQUESTED: "bg-eccellere-error/10 text-eccellere-error",
  DRAFT: "bg-ink-light/10 text-ink-light",
  RETIRED: "bg-ink-light/10 text-ink-light",
};
const STATUS_LABEL: Record<string, string> = {
  PUBLISHED: "Published", APPROVED: "Approved", SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review", REVISIONS_REQUESTED: "Revisions Needed",
  DRAFT: "Draft", RETIRED: "Retired",
};

const ASSIGNMENT_STATUS_STYLE: Record<string, string> = {
  IN_PROGRESS: "bg-blue-50 text-blue-600",
  ACCEPTED: "bg-eccellere-teal/10 text-eccellere-teal",
  MATCHED: "bg-eccellere-gold/10 text-eccellere-gold",
};

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}
function fmtDate(s: string) {
  return new Date(s).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

const dashboardSections = [
  { label: "My Assets", href: "/specialist/assets", description: "Manage your published frameworks, toolkits, and templates", icon: Package },
  { label: "Submit New Asset", href: "/specialist/assets/new", description: "Create and submit a new framework or toolkit for review", icon: PlusCircle },
  { label: "Assignments", href: "/specialist/assignments", description: "View and manage your consulting assignments", icon: ClipboardList },
  { label: "Earnings & Payouts", href: "/specialist/payments", description: "Track revenue, view payout history, and manage bank details", icon: IndianRupee },
  { label: "Profile", href: "/specialist/profile", description: "Update your bio, certifications, and expertise areas", icon: User },
  { label: "Analytics", href: "/specialist/analytics", description: "View download stats, ratings, and revenue per asset", icon: BarChart3 },
];

export default function SpecialistDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "assets" | "assignments" | "earnings">("overview");
  const [stats, setStats] = useState<SpecialistStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/specialist/stats")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setStats(data);
      })
      .catch(() => setError("Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  const tabs = [
    { id: "overview" as const, label: "Overview" },
    { id: "assets" as const, label: "My Assets" },
    { id: "assignments" as const, label: "Assignments" },
    { id: "earnings" as const, label: "Earnings" },
  ];

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center gap-2 text-sm text-ink-light">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading dashboard…
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-lg bg-white p-8 text-center shadow-sm">
        <p className="text-sm text-eccellere-error">{error ?? "Unable to load dashboard."}</p>
      </div>
    );
  }

  const { kpis, recentAssets, activeAssignments } = stats;

  const kpiCards = [
    { label: "Total Earnings", value: fmt(kpis.totalEarnings), change: "Lifetime (your share)", icon: IndianRupee },
    { label: "Published Assets", value: String(kpis.publishedAssets), change: `${recentAssets.length} total in system`, icon: Package },
    { label: "Active Assignments", value: String(kpis.activeAssignments), change: kpis.activeAssignments === 0 ? "None active" : "Ongoing", icon: ClipboardList },
    { label: "Avg Rating", value: kpis.avgRating > 0 ? kpis.avgRating.toFixed(1) : "—", change: "Across all assets", icon: Star },
  ];

  return (
    <div className="mx-auto max-w-[1280px]">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-eccellere-gold">Specialist Portal</p>
          <h1 className="mt-2 font-display text-3xl font-light text-eccellere-ink lg:text-4xl">
            Welcome back, {stats.name.split(" ")[0]}
          </h1>
        </div>
        <Button asChild>
          <Link href="/specialist/assets/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Submit New Asset
          </Link>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((kpi) => (
          <div key={kpi.label} className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-ink-light">{kpi.label}</p>
              <kpi.icon className="h-4 w-4 text-ink-light" />
            </div>
            <p className="mt-3 font-mono text-2xl font-medium text-eccellere-ink">{kpi.value}</p>
            <p className="mt-1 text-xs text-ink-light">{kpi.change}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mt-10 flex gap-1 border-b border-eccellere-ink/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "border-b-2 px-4 py-3 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "border-eccellere-gold text-eccellere-gold"
                : "border-transparent text-ink-light hover:text-eccellere-ink"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-8">
        {activeTab === "overview" && (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Quick access modules */}
            <div className="space-y-3 lg:col-span-2">
              <h2 className="text-sm font-medium text-eccellere-ink">Quick Access</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {dashboardSections.map((section) => (
                  <Link
                    key={section.label}
                    href={section.href}
                    className="group rounded-lg border border-eccellere-ink/5 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-eccellere-gold/20 hover:shadow-md"
                  >
                    <section.icon className="h-5 w-5 text-eccellere-gold" />
                    <h3 className="mt-3 text-sm font-medium text-eccellere-ink">{section.label}</h3>
                    <p className="mt-1 text-xs text-ink-light line-clamp-2">{section.description}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Upcoming deadlines */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="text-sm font-medium text-eccellere-ink">Active Assignments</h2>
              <div className="mt-4 space-y-3">
                {activeAssignments.length === 0 ? (
                  <p className="text-sm text-ink-light">No active assignments.</p>
                ) : (
                  activeAssignments.map((a) => (
                    <div key={a.id} className="border-b border-eccellere-ink/5 pb-3 last:border-0 last:pb-0">
                      <p className="text-sm text-eccellere-ink">{a.title}</p>
                      <p className="text-xs text-ink-light">{a.clientName}</p>
                      {a.dueDate && (
                        <div className="mt-1 flex items-center gap-2">
                          <Clock className="h-3 w-3 text-eccellere-gold" />
                          <span className="text-xs font-medium text-eccellere-gold">{fmtDate(a.dueDate)}</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "assets" && (
          <div className="rounded-lg bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-eccellere-ink/5 px-6 py-4">
              <h2 className="text-sm font-medium text-eccellere-ink">
                My Assets ({recentAssets.length} recent)
              </h2>
              <Button asChild variant="ghost" size="sm">
                <Link href="/specialist/assets" className="flex items-center gap-1 text-xs text-eccellere-gold">
                  Manage all <ArrowUpRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
            {recentAssets.length === 0 ? (
              <p className="px-6 py-6 text-sm text-ink-light">No assets yet. <Link href="/specialist/assets/new" className="underline hover:text-eccellere-gold">Submit your first →</Link></p>
            ) : (
              <div className="divide-y divide-eccellere-ink/5">
                {recentAssets.map((asset) => (
                  <div key={asset.id} className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-eccellere-ink">{asset.title}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span className={cn("rounded-sm px-2 py-0.5 text-[10px] uppercase tracking-wider", STATUS_STYLE[asset.status] ?? "bg-ink-light/10 text-ink-light")}>
                          {STATUS_LABEL[asset.status] ?? asset.status}
                        </span>
                        {asset.averageRating != null && asset.averageRating > 0 && (
                          <span className="flex items-center gap-1 text-xs text-eccellere-gold">
                            <Star className="h-3 w-3 fill-current" />
                            {asset.averageRating.toFixed(1)}
                          </span>
                        )}
                        {asset.hasFile ? (
                          <span className="flex items-center gap-1 text-[10px] text-eccellere-teal">
                            <CheckCircle className="h-3 w-3" /> File attached
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] text-eccellere-error">
                            <AlertCircle className="h-3 w-3" /> No file
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-6 text-center">
                      <div>
                        <p className="flex items-center gap-1 text-xs text-ink-light"><Eye className="h-3 w-3" /> Views</p>
                        <p className="font-mono text-sm text-eccellere-ink">{asset.totalViews.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="flex items-center gap-1 text-xs text-ink-light"><Download className="h-3 w-3" /> Sales</p>
                        <p className="font-mono text-sm text-eccellere-ink">{asset.totalPurchases}</p>
                      </div>
                      <div>
                        <p className="text-xs text-ink-light">Revenue</p>
                        <p className="font-mono text-sm text-eccellere-gold">
                          {asset.totalRevenue > 0 ? fmt(asset.totalRevenue) : "—"}
                        </p>
                      </div>
                    </div>
                    {!asset.hasFile && (
                      <Button asChild size="sm" variant="outline" className="border-eccellere-error/30 text-eccellere-error hover:bg-eccellere-error/5">
                        <Link href="/specialist/assets">
                          <Upload className="mr-1.5 h-3.5 w-3.5" />
                          Upload File
                        </Link>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "assignments" && (
          <div className="rounded-lg bg-white shadow-sm">
            <div className="border-b border-eccellere-ink/5 px-6 py-4">
              <h2 className="text-sm font-medium text-eccellere-ink">
                Active Assignments ({activeAssignments.length})
              </h2>
            </div>
            {activeAssignments.length === 0 ? (
              <p className="px-6 py-6 text-sm text-ink-light">No active assignments.</p>
            ) : (
              <div className="divide-y divide-eccellere-ink/5">
                {activeAssignments.map((a) => (
                  <div key={a.id} className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-eccellere-ink">{a.title}</p>
                      <p className="text-xs text-ink-light">{a.clientName}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className={cn("rounded-sm px-2 py-0.5 text-[10px] uppercase tracking-wider", ASSIGNMENT_STATUS_STYLE[a.status] ?? "bg-ink-light/10 text-ink-light")}>
                        {a.status.replace(/_/g, " ")}
                      </span>
                      <div className="text-right">
                        {a.dueDate && <p className="text-xs text-ink-light">Due {fmtDate(a.dueDate)}</p>}
                        {a.agreedFee != null && (
                          <p className="font-mono text-sm text-eccellere-gold">{fmt(a.agreedFee)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "earnings" && (
          <div className="rounded-lg bg-white p-8 shadow-sm">
            <h2 className="text-sm font-medium text-eccellere-ink">Earnings Summary</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              <div className="rounded-lg border border-eccellere-ink/5 p-5">
                <p className="text-xs uppercase tracking-wider text-ink-light">Lifetime Earnings</p>
                <p className="mt-2 font-mono text-2xl text-eccellere-gold">{fmt(kpis.totalEarnings)}</p>
                <p className="mt-1 text-xs text-ink-light">Your net share</p>
              </div>
              <div className="rounded-lg border border-eccellere-ink/5 p-5">
                <p className="text-xs uppercase tracking-wider text-ink-light">Total Asset Sales</p>
                <p className="mt-2 font-mono text-2xl text-eccellere-ink">
                  {recentAssets.reduce((s, a) => s + a.totalPurchases, 0)}
                </p>
                <p className="mt-1 text-xs text-ink-light">Across all assets</p>
              </div>
              <div className="rounded-lg border border-eccellere-ink/5 p-5">
                <p className="text-xs uppercase tracking-wider text-ink-light">Gross Revenue</p>
                <p className="mt-2 font-mono text-2xl text-eccellere-ink">
                  {fmt(recentAssets.reduce((s, a) => s + a.totalRevenue, 0))}
                </p>
                <p className="mt-1 text-xs text-ink-light">Before platform fee</p>
              </div>
            </div>
            <p className="mt-6 text-xs text-ink-light">
              Detailed payout history and bank account settings are available in{" "}
              <Link href="/specialist/payments" className="underline hover:text-eccellere-gold">Earnings &amp; Payouts →</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
