"use client";

import Link from "next/link";
import { ChevronLeft, IndianRupee, TrendingUp, ArrowUpRight, Download, CreditCard, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";

const revenueKpis = [
  { label: "Total Revenue", value: "₹24,85,000", change: "+12.4%", icon: IndianRupee },
  { label: "This Month", value: "₹3,42,000", change: "+18.2%", icon: TrendingUp },
  { label: "Pending Payouts", value: "₹1,28,500", change: "12 specialists", icon: CreditCard },
  { label: "Refunds", value: "₹24,000", change: "3 this month", icon: Receipt },
];

const recentTransactions = [
  { id: "TXN-4821", type: "sale", description: "MSME Growth Strategy Playbook", amount: "+₹2,499", date: "Apr 11" },
  { id: "TXN-4820", type: "sale", description: "Supply Chain Resilience Framework", amount: "+₹2,999", date: "Apr 11" },
  { id: "TXN-4819", type: "payout", description: "Payout to Specialist SP-042", amount: "-₹18,500", date: "Apr 10" },
  { id: "TXN-4818", type: "sale", description: "Lean Manufacturing Guide", amount: "+₹3,499", date: "Apr 10" },
  { id: "TXN-4817", type: "refund", description: "Refund ORD-2842 — AI Roadmap", amount: "-₹3,499", date: "Apr 8" },
  { id: "TXN-4816", type: "sale", description: "E-Commerce Launch Checklist", amount: "+₹999", date: "Apr 8" },
  { id: "TXN-4815", type: "payout", description: "Payout to Specialist SP-018", amount: "-₹32,400", date: "Apr 7" },
  { id: "TXN-4814", type: "sale", description: "Quality Systems Audit Toolkit", amount: "+₹5,499", date: "Apr 7" },
];

const typeColors: Record<string, string> = {
  sale: "text-eccellere-teal",
  payout: "text-eccellere-purple",
  refund: "text-eccellere-error",
};

const typeBg: Record<string, string> = {
  sale: "bg-eccellere-teal/10",
  payout: "bg-eccellere-purple/10",
  refund: "bg-eccellere-error/10",
};

const monthlyRevenue = [
  { month: "Jul", assets: 12, consulting: 8 },
  { month: "Aug", assets: 15, consulting: 7 },
  { month: "Sep", assets: 13, consulting: 6 },
  { month: "Oct", assets: 20, consulting: 8 },
  { month: "Nov", assets: 22, consulting: 10 },
  { month: "Dec", assets: 18, consulting: 8 },
  { month: "Jan", assets: 25, consulting: 10 },
  { month: "Feb", assets: 20, consulting: 10 },
  { month: "Mar", assets: 28, consulting: 14 },
  { month: "Apr", assets: 24, consulting: 10 },
];

export default function AdminFinance() {
  const maxTotal = Math.max(...monthlyRevenue.map((d) => d.assets + d.consulting));

  return (
    <div className="min-h-screen bg-eccellere-cream">
      <header className="border-b border-eccellere-ink/5 bg-white">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-4 px-6">
          <Link href="/admin" className="text-ink-light hover:text-eccellere-ink">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-medium text-eccellere-ink">Finance</h1>
          <div className="flex-1" />
          <Button variant="ghost" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-6 py-8">
        {/* KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {revenueKpis.map((kpi) => (
            <div key={kpi.label} className="rounded-lg bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-wider text-ink-light">{kpi.label}</p>
                <kpi.icon className="h-4 w-4 text-ink-light" />
              </div>
              <p className="mt-3 font-mono text-2xl font-medium text-eccellere-ink">{kpi.value}</p>
              <div className="mt-1 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3 text-eccellere-teal" />
                <span className="text-xs text-ink-light">{kpi.change}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Revenue Chart */}
          <div className="rounded-lg bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="text-sm font-medium text-eccellere-ink">
              Revenue Breakdown (₹ Lakhs)
            </h2>
            <div className="mt-2 flex items-center gap-4 text-xs text-ink-light">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-eccellere-gold" /> Asset Sales
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-eccellere-purple" /> Consulting
              </span>
            </div>
            <div className="mt-6 flex items-end gap-2" style={{ height: 200 }}>
              {monthlyRevenue.map((d) => (
                <div key={d.month} className="flex flex-1 flex-col items-center gap-1">
                  <span className="font-mono text-[9px] text-ink-light">
                    {d.assets + d.consulting}
                  </span>
                  <div className="flex w-full flex-col">
                    <div
                      className="w-full bg-eccellere-purple/60"
                      style={{ height: `${(d.consulting / maxTotal) * 160}px` }}
                    />
                    <div
                      className="w-full rounded-t bg-eccellere-gold/70"
                      style={{ height: `${(d.assets / maxTotal) * 160}px` }}
                    />
                  </div>
                  <span className="text-[10px] text-ink-light">{d.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Split */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-sm font-medium text-eccellere-ink">Revenue Split</h2>
            <div className="mt-6 space-y-5">
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-mid">Marketplace Assets</span>
                  <span className="font-mono text-eccellere-gold">₹16,20,000</span>
                </div>
                <div className="mt-2 h-3 rounded-full bg-eccellere-cream">
                  <div className="h-full w-[65%] rounded-full bg-eccellere-gold" />
                </div>
                <p className="mt-1 text-[10px] text-ink-light">65% of total</p>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-mid">Consulting Engagements</span>
                  <span className="font-mono text-eccellere-purple">₹7,47,000</span>
                </div>
                <div className="mt-2 h-3 rounded-full bg-eccellere-cream">
                  <div className="h-full w-[30%] rounded-full bg-eccellere-purple" />
                </div>
                <p className="mt-1 text-[10px] text-ink-light">30% of total</p>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-mid">Subscriptions</span>
                  <span className="font-mono text-eccellere-teal">₹1,18,000</span>
                </div>
                <div className="mt-2 h-3 rounded-full bg-eccellere-cream">
                  <div className="h-full w-[5%] rounded-full bg-eccellere-teal" />
                </div>
                <p className="mt-1 text-[10px] text-ink-light">5% of total</p>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="mt-8 rounded-lg bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-eccellere-ink/5 px-6 py-4">
            <h2 className="text-sm font-medium text-eccellere-ink">Recent Transactions</h2>
            <span className="text-xs text-ink-light">Last 7 days</span>
          </div>
          <div className="divide-y divide-eccellere-ink/5">
            {recentTransactions.map((txn) => (
              <div key={txn.id} className="flex items-center gap-4 px-6 py-3.5">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${typeBg[txn.type]}`}>
                  {txn.type === "sale" && <TrendingUp className={`h-4 w-4 ${typeColors[txn.type]}`} />}
                  {txn.type === "payout" && <CreditCard className={`h-4 w-4 ${typeColors[txn.type]}`} />}
                  {txn.type === "refund" && <Receipt className={`h-4 w-4 ${typeColors[txn.type]}`} />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-eccellere-ink">{txn.description}</p>
                  <p className="text-xs text-ink-light">{txn.id}</p>
                </div>
                <div className="text-right">
                  <p className={`font-mono text-sm ${typeColors[txn.type]}`}>{txn.amount}</p>
                  <p className="text-[10px] text-ink-light">{txn.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
