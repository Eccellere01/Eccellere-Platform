"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  BarChart3,
  Brain,
  Cpu,
  Database,
  Users,
  Workflow,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  category: string;
  categoryIcon: React.ElementType;
  question: string;
  options: { label: string; value: number }[];
}

const questions: Question[] = [
  {
    id: "strategy",
    category: "AI Strategy",
    categoryIcon: Brain,
    question:
      "Does your organisation have a documented AI strategy or roadmap?",
    options: [
      { label: "No, AI hasn't been discussed at leadership level", value: 1 },
      { label: "There's interest but no formal plan", value: 2 },
      { label: "We have a basic roadmap with some priorities identified", value: 3 },
      { label: "We have a detailed AI strategy aligned to business goals", value: 4 },
      { label: "AI is a core part of our business strategy, reviewed quarterly", value: 5 },
    ],
  },
  {
    id: "data",
    category: "Data Readiness",
    categoryIcon: Database,
    question:
      "How would you describe your organisation's data infrastructure?",
    options: [
      { label: "Data is mostly in spreadsheets or paper records", value: 1 },
      { label: "Some digital records but scattered across systems", value: 2 },
      { label: "Centralised database but limited analytics capability", value: 3 },
      { label: "Structured data warehouse with regular reporting", value: 4 },
      { label: "Advanced data platform with real-time analytics & APIs", value: 5 },
    ],
  },
  {
    id: "processes",
    category: "Process Automation",
    categoryIcon: Workflow,
    question:
      "What level of process automation exists in your core operations?",
    options: [
      { label: "Almost all processes are manual", value: 1 },
      { label: "Basic automation in 1–2 areas (e.g. invoicing, email)", value: 2 },
      { label: "Multiple processes automated with some integration", value: 3 },
      { label: "End-to-end automation in key workflows", value: 4 },
      { label: "Intelligent automation with AI-driven decision-making", value: 5 },
    ],
  },
  {
    id: "talent",
    category: "Talent & Culture",
    categoryIcon: Users,
    question:
      "How ready is your team to adopt and work with AI tools?",
    options: [
      { label: "Low awareness — team is unfamiliar with AI concepts", value: 1 },
      { label: "Some curiosity but no training or exposure", value: 2 },
      { label: "Basic digital literacy; open to learning AI tools", value: 3 },
      { label: "Team actively uses AI tools; some members have training", value: 4 },
      { label: "Strong AI literacy across teams; dedicated AI/data roles", value: 5 },
    ],
  },
  {
    id: "technology",
    category: "Technology Stack",
    categoryIcon: Cpu,
    question:
      "How modern is your current technology infrastructure?",
    options: [
      { label: "Legacy systems only; no cloud or modern tools", value: 1 },
      { label: "Mix of legacy and some cloud-based tools", value: 2 },
      { label: "Mostly cloud-based with standard SaaS tools", value: 3 },
      { label: "Modern cloud-native stack with API integrations", value: 4 },
      { label: "Cutting-edge stack: cloud, microservices, AI-ready infra", value: 5 },
    ],
  },
];

const sectorBenchmarks: Record<string, number> = {
  Manufacturing: 2.3,
  Retail: 2.7,
  "Consumer Products": 2.5,
  Logistics: 2.4,
};

function getReadinessLevel(score: number) {
  if (score <= 1.5) return { level: "Exploring", color: "text-eccellere-error", band: "w-[20%]" };
  if (score <= 2.5) return { level: "Aware", color: "text-amber-500", band: "w-[40%]" };
  if (score <= 3.5) return { level: "Ready", color: "text-eccellere-gold", band: "w-[60%]" };
  if (score <= 4.5) return { level: "Advanced", color: "text-eccellere-teal", band: "w-[80%]" };
  return { level: "Leading", color: "text-eccellere-teal", band: "w-full" };
}

export default function AssessmentPage() {
  const [step, setStep] = useState<"intro" | "quiz" | "sector" | "results">("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [sector, setSector] = useState("");

  const progress = (Object.keys(answers).length / questions.length) * 100;
  const avgScore =
    Object.values(answers).length > 0
      ? Object.values(answers).reduce((a, b) => a + b, 0) /
        Object.values(answers).length
      : 0;
  const readiness = getReadinessLevel(avgScore);
  const benchmark = sectorBenchmarks[sector] || 2.5;

  function handleAnswer(questionId: string, value: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    if (currentQ < questions.length - 1) {
      setTimeout(() => setCurrentQ((c) => c + 1), 300);
    }
  }

  function handleComplete() {
    setStep("sector");
  }

  return (
    <>
      <Header />
      <main className="bg-eccellere-cream pt-[72px]">
        <AnimatePresence mode="wait">
          {/* INTRO */}
          {step === "intro" && (
            <motion.section
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative overflow-hidden bg-eccellere-ink py-24 lg:py-32"
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-15"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(184,145,58,0.3) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />
              <div className="relative z-10 mx-auto max-w-[1280px] px-6 text-center">
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-eccellere-gold">
                  AI Readiness Assessment
                </p>
                <h1 className="mt-4 font-display text-[clamp(32px,6vw,72px)] font-light leading-[1.1] text-eccellere-cream">
                  Where does your organisation stand on the{" "}
                  <span className="italic text-eccellere-gold">
                    Agentic AI readiness curve?
                  </span>
                </h1>
                <p className="mx-auto mt-6 max-w-xl text-lg font-light text-white/50">
                  5 questions. 2 minutes. Get a personalised report with sector
                  benchmarks and actionable recommendations.
                </p>
                <Button
                  size="lg"
                  className="mt-10"
                  onClick={() => setStep("quiz")}
                >
                  Start Assessment →
                </Button>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  {[
                    "No signup required",
                    "Results in 2 mins",
                    "Sector benchmarks",
                    "Personalised recommendations",
                    "Free",
                  ].map((pill) => (
                    <span
                      key={pill}
                      className="rounded-sm border border-white/10 px-3 py-1.5 text-xs text-white/50"
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.section>
          )}

          {/* QUIZ */}
          {step === "quiz" && (
            <motion.section
              key="quiz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-[calc(100vh-72px)] py-12"
            >
              <div className="mx-auto max-w-2xl px-6">
                {/* Progress */}
                <div className="mb-8">
                  <div className="flex items-center justify-between text-sm text-ink-light">
                    <span>
                      Question {currentQ + 1} of {questions.length}
                    </span>
                    <span>{Math.round(progress)}% complete</span>
                  </div>
                  <div className="mt-2 h-1 rounded-full bg-eccellere-ink/10">
                    <div
                      className="h-full rounded-full bg-eccellere-gold transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQ}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                  >
                    {(() => {
                      const q = questions[currentQ];
                      const Icon = q.categoryIcon;
                      return (
                        <div>
                          <div className="flex items-center gap-2">
                            <Icon className="h-5 w-5 text-eccellere-gold" />
                            <span className="text-xs font-medium uppercase tracking-[0.15em] text-eccellere-gold">
                              {q.category}
                            </span>
                          </div>
                          <h2 className="mt-4 font-display text-2xl font-light text-eccellere-ink lg:text-3xl">
                            {q.question}
                          </h2>
                          <div className="mt-8 space-y-3">
                            {q.options.map((opt) => (
                              <button
                                key={opt.value}
                                onClick={() => handleAnswer(q.id, opt.value)}
                                className={cn(
                                  "block w-full rounded border p-4 text-left text-sm transition-all duration-200",
                                  answers[q.id] === opt.value
                                    ? "border-eccellere-gold bg-eccellere-gold/5 text-eccellere-ink"
                                    : "border-eccellere-ink/10 bg-white text-ink-mid hover:border-eccellere-gold/50"
                                )}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </motion.div>
                </AnimatePresence>

                {/* Nav buttons */}
                <div className="mt-8 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentQ((c) => Math.max(0, c - 1))}
                    disabled={currentQ === 0}
                    className="flex items-center gap-1 text-sm text-ink-light transition-colors hover:text-eccellere-gold disabled:opacity-30"
                  >
                    <ArrowLeft className="h-4 w-4" /> Previous
                  </button>
                  {Object.keys(answers).length === questions.length ? (
                    <Button onClick={handleComplete}>
                      See Results <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <button
                      onClick={() =>
                        setCurrentQ((c) =>
                          Math.min(questions.length - 1, c + 1)
                        )
                      }
                      disabled={!answers[questions[currentQ].id]}
                      className="flex items-center gap-1 text-sm text-ink-light transition-colors hover:text-eccellere-gold disabled:opacity-30"
                    >
                      Next <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.section>
          )}

          {/* SECTOR SELECT */}
          {step === "sector" && (
            <motion.section
              key="sector"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex min-h-[calc(100vh-72px)] items-center py-12"
            >
              <div className="mx-auto max-w-xl px-6 text-center">
                <BarChart3 className="mx-auto h-10 w-10 text-eccellere-gold" />
                <h2 className="mt-6 font-display text-3xl font-light text-eccellere-ink">
                  One more thing — what&apos;s your{" "}
                  <span className="italic">primary sector?</span>
                </h2>
                <p className="mt-3 text-sm text-ink-mid">
                  This helps us benchmark your score against industry peers.
                </p>
                <div className="mt-8 grid grid-cols-2 gap-3">
                  {Object.keys(sectorBenchmarks).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSector(s)}
                      className={cn(
                        "rounded border p-4 text-sm font-medium transition-all",
                        sector === s
                          ? "border-eccellere-gold bg-eccellere-gold/5 text-eccellere-ink"
                          : "border-eccellere-ink/10 bg-white text-ink-mid hover:border-eccellere-gold/50"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <Button
                  className="mt-8"
                  disabled={!sector}
                  onClick={() => setStep("results")}
                >
                  Show My Results
                </Button>
              </div>
            </motion.section>
          )}

          {/* RESULTS */}
          {step === "results" && (
            <motion.section
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-16 lg:py-24"
            >
              <div className="mx-auto max-w-3xl px-6">
                <div className="text-center">
                  <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-eccellere-gold">
                    Your AI Readiness Report
                  </p>
                  <h1 className="mt-4 font-display text-[clamp(28px,5vw,52px)] font-light text-eccellere-ink">
                    You&apos;re at the{" "}
                    <span className={cn("italic", readiness.color)}>
                      {readiness.level}
                    </span>{" "}
                    stage
                  </h1>
                </div>

                {/* Score card */}
                <div className="mt-12 rounded bg-white p-8 shadow-sm lg:p-10">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-sm text-ink-light">Overall Score</p>
                      <p className="font-mono text-5xl text-eccellere-ink">
                        {avgScore.toFixed(1)}
                        <span className="text-lg text-ink-light">/5.0</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-ink-light">
                        {sector} Benchmark
                      </p>
                      <p className="font-mono text-2xl text-ink-mid">
                        {benchmark.toFixed(1)}
                      </p>
                    </div>
                  </div>

                  {/* Bar */}
                  <div className="mt-6 h-3 rounded-full bg-eccellere-ink/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(avgScore / 5) * 100}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="h-full rounded-full bg-eccellere-gold"
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-[10px] uppercase tracking-wider text-ink-light">
                    <span>Exploring</span>
                    <span>Aware</span>
                    <span>Ready</span>
                    <span>Advanced</span>
                    <span>Leading</span>
                  </div>

                  {/* Category breakdown */}
                  <div className="mt-10 space-y-4">
                    <h3 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-light">
                      Category Breakdown
                    </h3>
                    {questions.map((q) => {
                      const score = answers[q.id] || 0;
                      const Icon = q.categoryIcon;
                      return (
                        <div key={q.id} className="flex items-center gap-4">
                          <Icon className="h-4 w-4 shrink-0 text-eccellere-gold" />
                          <span className="w-40 shrink-0 text-sm text-ink-mid">
                            {q.category}
                          </span>
                          <div className="flex-1">
                            <div className="h-2 rounded-full bg-eccellere-ink/10">
                              <div
                                className="h-full rounded-full bg-eccellere-gold transition-all"
                                style={{ width: `${(score / 5) * 100}%` }}
                              />
                            </div>
                          </div>
                          <span className="font-mono text-sm text-eccellere-ink">
                            {score}/5
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="mt-10 rounded bg-white p-8 shadow-sm lg:p-10">
                  <h3 className="text-xs font-medium uppercase tracking-[0.15em] text-eccellere-gold">
                    Recommended Next Steps
                  </h3>
                  <div className="mt-6 space-y-4">
                    {avgScore <= 2 && (
                      <>
                        <Recommendation
                          title="Start with AI Literacy"
                          desc="Get your team familiar with AI basics. Our Prompt Engineering Playbook (₹799) is the fastest way to start."
                          href="/marketplace/11"
                        />
                        <Recommendation
                          title="Map Your Data Landscape"
                          desc="You need structured data before AI can help. Try our Data Analytics Starter Kit."
                          href="/marketplace/9"
                        />
                        <Recommendation
                          title="Talk to an AI Specialist"
                          desc="A 2-hour consultation can save months of trial-and-error. Book a free intro call."
                          href="/contact?type=call"
                        />
                      </>
                    )}
                    {avgScore > 2 && avgScore <= 3.5 && (
                      <>
                        <Recommendation
                          title="Prioritise Your AI Use Cases"
                          desc="You're ready to identify high-ROI AI applications. Use our AI Use Case Prioritisation Matrix."
                          href="/marketplace/5"
                        />
                        <Recommendation
                          title="Build Your AI Roadmap"
                          desc="Transform your awareness into a structured plan. Our Growth Package includes 1:1 specialist guidance."
                          href="/msme-hub"
                        />
                        <Recommendation
                          title="Automate One Process End-to-End"
                          desc="Pick your highest-volume manual process and implement targeted automation."
                          href="/agentic-ai"
                        />
                      </>
                    )}
                    {avgScore > 3.5 && (
                      <>
                        <Recommendation
                          title="Scale Your AI Operations"
                          desc="You're ahead of most MSMEs. Time to scale AI across departments and build internal capabilities."
                          href="/agentic-ai"
                        />
                        <Recommendation
                          title="Consider Custom AI Development"
                          desc="Off-the-shelf tools may not be enough. Our Enterprise Package includes custom framework development."
                          href="/contact?type=enterprise"
                        />
                        <Recommendation
                          title="Become an Eccellere Case Study"
                          desc="Your AI journey could inspire others. Let's tell your story."
                          href="/contact?type=partner"
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* CTAs */}
                <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                  <Button asChild size="lg">
                    <Link href="/marketplace">Browse Recommended Assets</Link>
                  </Button>
                  <Button asChild variant="ghost" size="lg">
                    <Link href="/contact">Talk to a Specialist</Link>
                  </Button>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
}

function Recommendation({
  title,
  desc,
  href,
}: {
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 rounded border border-eccellere-ink/5 p-4 transition-colors hover:border-eccellere-gold/30 hover:bg-eccellere-gold/5"
    >
      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-eccellere-gold" />
      <div>
        <p className="text-sm font-medium text-eccellere-ink">{title}</p>
        <p className="mt-1 text-sm text-ink-mid">{desc}</p>
      </div>
      <ArrowRight className="ml-auto mt-0.5 h-4 w-4 shrink-0 text-ink-light opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  );
}
