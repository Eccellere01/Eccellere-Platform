"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Star, Filter } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const categories = [
  "All",
  "Strategy",
  "Agentic AI",
  "Process Transformation",
  "Digital",
  "Organisation",
];

const sectors = ["All Sectors", "Manufacturing", "Retail", "Consumer Products", "Logistics"];

const formats = ["All Formats", "PDF", "Excel", "Template", "Toolkit", "Playbook"];

const sortOptions = ["Most Popular", "Newest", "Price: Low to High", "Price: High to Low", "Highest Rated"];

const assets = [
  {
    id: "1",
    category: "Strategy",
    categoryColor: "bg-eccellere-gold/20 text-eccellere-gold",
    title: "MSME Growth Strategy Playbook",
    description: "Complete playbook for market entry, competitive analysis, and growth planning tailored to Indian MSMEs.",
    format: "PDF",
    price: 2499,
    rating: 4.8,
    reviews: 124,
    sectors: ["Manufacturing", "Retail"],
    bestseller: true,
  },
  {
    id: "2",
    category: "Agentic AI",
    categoryColor: "bg-eccellere-purple/20 text-eccellere-purple",
    title: "AI Readiness Assessment Toolkit",
    description: "Self-assessment tool with scoring framework, sector benchmarks, and personalised recommendations.",
    format: "Excel",
    price: 1999,
    rating: 4.9,
    reviews: 89,
    sectors: ["Manufacturing", "Retail", "Logistics"],
    bestseller: true,
  },
  {
    id: "3",
    category: "Process Transformation",
    categoryColor: "bg-eccellere-teal/20 text-eccellere-teal",
    title: "Lean Manufacturing Implementation Guide",
    description: "Step-by-step lean transformation for Indian factories, including 5S, Kaizen, and value stream mapping.",
    format: "PDF + Template",
    price: 3499,
    rating: 4.7,
    reviews: 67,
    sectors: ["Manufacturing"],
    bestseller: false,
  },
  {
    id: "4",
    category: "Digital",
    categoryColor: "bg-eccellere-info/20 text-eccellere-info",
    title: "E‑Commerce Launch Checklist",
    description: "Everything you need to launch a D2C or marketplace presence — from platform choice to first 100 orders.",
    format: "Template",
    price: 999,
    rating: 4.6,
    reviews: 203,
    sectors: ["Retail", "Consumer Products"],
    bestseller: false,
  },
  {
    id: "5",
    category: "Agentic AI",
    categoryColor: "bg-eccellere-purple/20 text-eccellere-purple",
    title: "AI Use Case Prioritisation Matrix",
    description: "Framework to identify, score, and prioritise AI use cases by ROI, feasibility, and strategic impact.",
    format: "Excel",
    price: 1499,
    rating: 4.5,
    reviews: 56,
    sectors: ["Manufacturing", "Logistics"],
    bestseller: false,
  },
  {
    id: "6",
    category: "Strategy",
    categoryColor: "bg-eccellere-gold/20 text-eccellere-gold",
    title: "Competitive Landscape Analyzer",
    description: "Porter's Five Forces, SWOT, and PESTLE analysis templates pre-configured for Indian market context.",
    format: "Toolkit",
    price: 2999,
    rating: 4.8,
    reviews: 91,
    sectors: ["All Sectors"],
    bestseller: true,
  },
  {
    id: "7",
    category: "Organisation",
    categoryColor: "bg-amber-100 text-amber-700",
    title: "Employee Capability Building Roadmap",
    description: "Competency mapping, training needs analysis, and L&D strategy template for scaling teams.",
    format: "Playbook",
    price: 1999,
    rating: 4.4,
    reviews: 43,
    sectors: ["Manufacturing", "Retail"],
    bestseller: false,
  },
  {
    id: "8",
    category: "Process Transformation",
    categoryColor: "bg-eccellere-teal/20 text-eccellere-teal",
    title: "Supply Chain Optimisation Toolkit",
    description: "End-to-end supply chain diagnostic, KPI dashboards, and improvement roadmap for mid-size businesses.",
    format: "Toolkit",
    price: 4499,
    rating: 4.9,
    reviews: 78,
    sectors: ["Manufacturing", "Logistics", "Consumer Products"],
    bestseller: true,
  },
  {
    id: "9",
    category: "Digital",
    categoryColor: "bg-eccellere-info/20 text-eccellere-info",
    title: "Data Analytics Starter Kit for MSMEs",
    description: "BI dashboards, data collection templates, and analytics playbook for businesses with no data team.",
    format: "Excel + PDF",
    price: 1799,
    rating: 4.3,
    reviews: 34,
    sectors: ["All Sectors"],
    bestseller: false,
  },
  {
    id: "10",
    category: "Strategy",
    categoryColor: "bg-eccellere-gold/20 text-eccellere-gold",
    title: "Pricing Strategy Workshop Kit",
    description: "Value-based pricing models, competitor benchmarking, and margin optimisation frameworks.",
    format: "Playbook",
    price: 2499,
    rating: 4.7,
    reviews: 62,
    sectors: ["Retail", "Consumer Products"],
    bestseller: false,
  },
  {
    id: "11",
    category: "Agentic AI",
    categoryColor: "bg-eccellere-purple/20 text-eccellere-purple",
    title: "Prompt Engineering Playbook for Business",
    description: "100+ tested prompts for sales, operations, HR, and finance — tailored for Indian business context.",
    format: "PDF",
    price: 799,
    rating: 4.6,
    reviews: 312,
    sectors: ["All Sectors"],
    bestseller: true,
  },
  {
    id: "12",
    category: "Process Transformation",
    categoryColor: "bg-eccellere-teal/20 text-eccellere-teal",
    title: "Quality Management System (QMS) Template Pack",
    description: "ISO 9001-aligned SOPs, audit checklists, and CAPA templates for manufacturing units.",
    format: "Template",
    price: 3999,
    rating: 4.8,
    reviews: 55,
    sectors: ["Manufacturing"],
    bestseller: false,
  },
];

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSector, setSelectedSector] = useState("All Sectors");
  const [selectedFormat, setSelectedFormat] = useState("All Formats");
  const [sortBy, setSortBy] = useState("Most Popular");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = assets.filter((a) => {
    const matchCategory = selectedCategory === "All" || a.category === selectedCategory;
    const matchSector =
      selectedSector === "All Sectors" ||
      a.sectors.includes(selectedSector) ||
      a.sectors.includes("All Sectors");
    const matchFormat =
      selectedFormat === "All Formats" || a.format.includes(selectedFormat);
    const matchSearch =
      !searchQuery ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSector && matchFormat && matchSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "Newest": return 0;
      case "Price: Low to High": return a.price - b.price;
      case "Price: High to Low": return b.price - a.price;
      case "Highest Rated": return b.rating - a.rating;
      default: return b.reviews - a.reviews;
    }
  });

  return (
    <>
      <Header />
      <main className="bg-eccellere-cream pt-[72px]">
        {/* Hero */}
        <section className="bg-eccellere-ink py-20 lg:py-24">
          <div className="mx-auto max-w-[1280px] px-6 text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-eccellere-gold">
              Marketplace
            </p>
            <h1 className="mt-4 font-display text-[clamp(32px,6vw,64px)] font-light leading-tight text-eccellere-cream">
              200+ Proven Frameworks &{" "}
              <span className="italic text-eccellere-gold">Business Toolkits</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-white/50">
              Strategy playbooks, AI toolkits, process templates, and digital
              transformation guides — built by specialists, tested by businesses.
            </p>

            {/* Search */}
            <div className="mx-auto mt-10 flex max-w-xl items-center gap-2 rounded bg-white/10 px-4">
              <Search className="h-5 w-5 text-white/40" />
              <input
                type="text"
                placeholder="Search frameworks, toolkits, playbooks…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent py-3 text-sm text-white placeholder:text-white/30 focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* Filters + Grid */}
        <section className="mx-auto max-w-[1280px] px-6 py-12">
          {/* Category tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-eccellere-ink/10 pb-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "rounded-sm px-4 py-2 text-sm font-medium transition-colors",
                  selectedCategory === cat
                    ? "bg-eccellere-ink text-white"
                    : "text-ink-mid hover:bg-eccellere-ink/5"
                )}
              >
                {cat}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1.5 text-sm text-ink-mid hover:text-eccellere-gold lg:hidden"
              >
                <Filter className="h-4 w-4" /> Filters
              </button>
              <div className="hidden items-center gap-2 text-sm text-ink-light lg:flex">
                <span>Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border-none bg-transparent text-sm font-medium text-eccellere-ink focus:outline-none"
                >
                  {sortOptions.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-8">
            {/* Sidebar filters — desktop */}
            <aside className={cn(
              "w-60 shrink-0 space-y-6",
              showFilters ? "block" : "hidden lg:block"
            )}>
              <div>
                <h4 className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-ink-light">
                  Sector
                </h4>
                <div className="space-y-2">
                  {sectors.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSector(s)}
                      className={cn(
                        "block w-full rounded-sm px-3 py-2 text-left text-sm transition-colors",
                        selectedSector === s
                          ? "bg-eccellere-gold/10 font-medium text-eccellere-gold"
                          : "text-ink-mid hover:bg-eccellere-ink/5"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-ink-light">
                  Format
                </h4>
                <div className="space-y-2">
                  {formats.map((f) => (
                    <button
                      key={f}
                      onClick={() => setSelectedFormat(f)}
                      className={cn(
                        "block w-full rounded-sm px-3 py-2 text-left text-sm transition-colors",
                        selectedFormat === f
                          ? "bg-eccellere-gold/10 font-medium text-eccellere-gold"
                          : "text-ink-mid hover:bg-eccellere-ink/5"
                      )}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-ink-light">
                  Sort
                </h4>
                <div className="space-y-2 lg:hidden">
                  {sortOptions.map((o) => (
                    <button
                      key={o}
                      onClick={() => setSortBy(o)}
                      className={cn(
                        "block w-full rounded-sm px-3 py-2 text-left text-sm transition-colors",
                        sortBy === o
                          ? "bg-eccellere-gold/10 font-medium text-eccellere-gold"
                          : "text-ink-mid hover:bg-eccellere-ink/5"
                      )}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Asset grid */}
            <div className="flex-1">
              <p className="mb-6 text-sm text-ink-light">
                {sorted.length} asset{sorted.length !== 1 && "s"} found
              </p>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {sorted.map((asset, i) => (
                  <motion.div
                    key={asset.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.4 }}
                  >
                    <Link
                      href={`/marketplace/${asset.id}`}
                      className="group block h-full rounded bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <span
                          className={cn(
                            "inline-block rounded-sm px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                            asset.categoryColor
                          )}
                        >
                          {asset.category}
                        </span>
                        {asset.bestseller && (
                          <span className="rounded-sm bg-eccellere-gold px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white">
                            Bestseller
                          </span>
                        )}
                      </div>
                      <h3 className="mt-4 text-base font-medium leading-snug text-eccellere-ink">
                        {asset.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm text-ink-mid">
                        {asset.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {asset.sectors.map((s) => (
                          <span
                            key={s}
                            className="rounded-sm bg-eccellere-ink/5 px-2 py-0.5 text-[10px] uppercase tracking-wider text-ink-light"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                      <p className="mt-3 text-xs text-ink-light">{asset.format}</p>
                      <div className="mt-4 flex items-center justify-between border-t border-eccellere-ink/5 pt-4">
                        <span className="font-mono text-lg font-medium text-eccellere-ink">
                          ₹{asset.price.toLocaleString("en-IN")}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-eccellere-gold">
                          <Star className="h-3 w-3 fill-current" />
                          {asset.rating}{" "}
                          <span className="text-ink-light">
                            ({asset.reviews})
                          </span>
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {sorted.length === 0 && (
                <div className="py-20 text-center">
                  <p className="text-lg text-ink-mid">No assets match your filters.</p>
                  <button
                    onClick={() => {
                      setSelectedCategory("All");
                      setSelectedSector("All Sectors");
                      setSelectedFormat("All Formats");
                      setSearchQuery("");
                    }}
                    className="mt-4 text-sm text-eccellere-gold hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CTA Band */}
        <section className="bg-eccellere-ink py-16">
          <div className="mx-auto max-w-[1280px] px-6 text-center">
            <h2 className="font-display text-2xl font-light text-eccellere-cream lg:text-3xl">
              Can&apos;t find what you need?{" "}
              <span className="italic text-eccellere-gold">
                Let us build it for you.
              </span>
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-white/50">
              Our network of 50+ specialists can create custom frameworks,
              toolkits, and strategies tailored to your exact business challenge.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button asChild size="lg">
                <Link href="/contact?type=quote">Get a Custom Quote</Link>
              </Button>
              <Button asChild variant="ghostLight">
                <Link href="#chatbot">Talk to AI Advisor</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
