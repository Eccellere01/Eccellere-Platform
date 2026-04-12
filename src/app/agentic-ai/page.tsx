"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bot,
  Brain,
  Workflow,
  Zap,
  BarChart3,
  Shield,
  CheckCircle2,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

const useCases = [
  {
    icon: Workflow,
    title: "Intelligent Process Automation",
    description:
      "Automate complex, decision-heavy workflows — purchase orders, quality inspections, inventory reordering — with AI agents that learn and improve.",
    sectors: ["Manufacturing", "Logistics"],
  },
  {
    icon: BarChart3,
    title: "Predictive Analytics & Forecasting",
    description:
      "Demand forecasting, sales prediction, and anomaly detection built on your own data — no data science team required.",
    sectors: ["Retail", "Consumer Products"],
  },
  {
    icon: Brain,
    title: "AI-Powered Customer Experience",
    description:
      "Conversational AI for customer support, personalised product recommendations, and intelligent lead scoring.",
    sectors: ["Retail", "Consumer Products"],
  },
  {
    icon: Shield,
    title: "Quality & Compliance AI",
    description:
      "Computer vision for defect detection, automated compliance reporting, and predictive maintenance for shop floors.",
    sectors: ["Manufacturing"],
  },
  {
    icon: Zap,
    title: "Supply Chain Intelligence",
    description:
      "Route optimisation, supplier risk scoring, and real-time inventory optimisation powered by agentic AI.",
    sectors: ["Logistics", "Manufacturing"],
  },
  {
    icon: Bot,
    title: "Internal AI Assistants",
    description:
      "Deploy AI agents for HR queries, finance approvals, IT support, and knowledge management across your organisation.",
    sectors: ["All Sectors"],
  },
];

const roadmap = [
  {
    phase: "01",
    title: "Assess",
    duration: "Week 1–2",
    description: "AI Readiness Assessment, data audit, and use case identification tailored to your sector and scale.",
  },
  {
    phase: "02",
    title: "Prioritise",
    duration: "Week 3",
    description: "Score use cases by ROI, feasibility, and strategic fit. Build a 90-day implementation roadmap.",
  },
  {
    phase: "03",
    title: "Build",
    duration: "Week 4–8",
    description: "Implement the top-priority AI solution. Sprint-based delivery with weekly demos and feedback.",
  },
  {
    phase: "04",
    title: "Scale",
    duration: "Ongoing",
    description: "Measure outcomes, train your team, and expand AI across departments. We stay through results.",
  },
];

export default function AgenticAIPage() {
  return (
    <>
      <Header />
      <main className="bg-eccellere-cream pt-[72px]">
        {/* Hero */}
        <section className="relative overflow-hidden bg-eccellere-purple py-24 lg:py-32">
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(184,145,58,0.25) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          <div className="relative z-10 mx-auto max-w-[1280px] px-6">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-sm border border-eccellere-gold/30 bg-eccellere-gold/10 px-3 py-1">
                <Zap className="h-3.5 w-3.5 text-eccellere-gold" />
                <span className="text-xs font-medium text-eccellere-gold">
                  Flagship Service
                </span>
              </div>
              <h1 className="mt-6 font-display text-[clamp(36px,7vw,80px)] font-light leading-[1.05] text-eccellere-cream">
                Agentic AI for{" "}
                <span className="italic text-eccellere-gold">
                  Indian Business
                </span>
              </h1>
              <p className="mt-6 text-lg font-light leading-relaxed text-white/60">
                Not just AI strategy — we build, deploy, and manage AI agents
                that work alongside your team. Purpose-built for the scale,
                budgets, and complexity of India&apos;s MSMEs.
              </p>
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Button asChild size="lg">
                  <Link href="/assessment">Take Free AI Assessment</Link>
                </Button>
                <Button asChild variant="ghostLight" size="lg">
                  <Link href="/contact?type=ai">Talk to AI Specialist</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* What is Agentic AI */}
        <section className="py-20 lg:py-[120px]">
          <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-6 lg:grid-cols-2">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-eccellere-gold">
                What is Agentic AI?
              </p>
              <h2 className="mt-4 font-display text-[clamp(28px,5vw,48px)] font-light leading-tight text-eccellere-ink">
                AI that doesn&apos;t just answer —{" "}
                <span className="italic">it acts</span>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-mid">
                Traditional AI gives you predictions. Agentic AI gives you
                autonomous agents that perceive, reason, plan, and execute
                multi-step tasks — from reordering inventory when stock runs low,
                to negotiating with suppliers, to optimising delivery routes in
                real time.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Autonomous decision-making within defined guardrails",
                  "Multi-step task execution without human intervention",
                  "Continuous learning from your business data",
                  "Seamless integration with your existing tools",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-ink-mid">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-eccellere-gold" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg bg-eccellere-ink p-8 lg:p-10">
              <div className="space-y-6 font-mono text-sm">
                <div className="text-eccellere-gold">
                  {"// Agentic AI Workflow Example"}
                </div>
                <div className="text-white/70">
                  <span className="text-eccellere-gold">agent</span>.observe(
                  <span className="text-eccellere-teal">
                    &quot;inventory_level &lt; reorder_point&quot;
                  </span>
                  )
                </div>
                <div className="text-white/70">
                  <span className="text-eccellere-gold">agent</span>.reason(
                  <span className="text-eccellere-teal">
                    &quot;compare 3 supplier offers&quot;
                  </span>
                  )
                </div>
                <div className="text-white/70">
                  <span className="text-eccellere-gold">agent</span>.decide(
                  <span className="text-eccellere-teal">
                    &quot;select best price + lead time&quot;
                  </span>
                  )
                </div>
                <div className="text-white/70">
                  <span className="text-eccellere-gold">agent</span>.execute(
                  <span className="text-eccellere-teal">
                    &quot;place_purchase_order&quot;
                  </span>
                  )
                </div>
                <div className="text-white/70">
                  <span className="text-eccellere-gold">agent</span>.notify(
                  <span className="text-eccellere-teal">
                    &quot;procurement_manager&quot;
                  </span>
                  )
                </div>
                <div className="mt-4 border-t border-white/10 pt-4 text-xs text-white/40">
                  {"// Zero human intervention. Full audit trail."}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="bg-gold-pale py-20 lg:py-[120px]">
          <div className="mx-auto max-w-[1280px] px-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-eccellere-gold">
              AI Use Cases
            </p>
            <h2 className="mt-4 font-display text-[clamp(28px,5vw,48px)] font-light leading-tight text-eccellere-ink">
              Built for your sector,{" "}
              <span className="italic">not Silicon Valley</span>
            </h2>
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {useCases.map((uc, i) => (
                <motion.div
                  key={uc.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="rounded bg-white p-8 shadow-sm"
                >
                  <uc.icon className="h-8 w-8 text-eccellere-gold" strokeWidth={1.5} />
                  <h3 className="mt-5 text-lg font-medium text-eccellere-ink">
                    {uc.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-mid">
                    {uc.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {uc.sectors.map((s) => (
                      <span
                        key={s}
                        className="rounded-sm bg-eccellere-ink/5 px-2 py-0.5 text-[10px] uppercase tracking-wider text-ink-light"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section className="py-20 lg:py-[120px]">
          <div className="mx-auto max-w-[1280px] px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-eccellere-gold">
                How We Work
              </p>
              <h2 className="mt-4 font-display text-[clamp(28px,5vw,48px)] font-light leading-tight text-eccellere-ink">
                From assessment to impact{" "}
                <span className="italic">in 8 weeks</span>
              </h2>
            </div>
            <div className="mt-16 grid gap-6 md:grid-cols-4">
              {roadmap.map((step, i) => (
                <motion.div
                  key={step.phase}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                  className="relative"
                >
                  {i < roadmap.length - 1 && (
                    <div className="absolute right-0 top-8 hidden h-px w-full translate-x-1/2 bg-eccellere-gold/20 md:block" />
                  )}
                  <div className="relative rounded bg-white p-6 shadow-sm">
                    <span className="font-mono text-3xl text-eccellere-gold/30">
                      {step.phase}
                    </span>
                    <h3 className="mt-3 text-lg font-medium text-eccellere-ink">
                      {step.title}
                    </h3>
                    <p className="mt-1 font-mono text-xs text-eccellere-gold">
                      {step.duration}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-ink-mid">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-eccellere-ink py-20 lg:py-24">
          <div className="mx-auto max-w-[1280px] px-6 text-center">
            <h2 className="font-display text-[clamp(28px,5vw,48px)] font-light text-eccellere-cream">
              Ready to bring{" "}
              <span className="italic text-eccellere-gold">
                Agentic AI
              </span>{" "}
              to your business?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-white/50">
              Start with a free assessment. No commitment, no contracts. Just
              clarity on where AI can drive the most impact for your business.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg">
                <Link href="/assessment">Take Free AI Assessment</Link>
              </Button>
              <Button asChild variant="ghostLight" size="lg">
                <Link href="/marketplace?category=Agentic+AI">
                  Browse AI Toolkits
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
