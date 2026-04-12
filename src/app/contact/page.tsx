"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

const inquiryTypes = [
  { value: "book-call", label: "Book a Call" },
  { value: "get-quote", label: "Get a Quote" },
  { value: "partner", label: "Partner with Us" },
  { value: "general", label: "General Inquiry" },
];

const sectors = [
  "Manufacturing",
  "Retail",
  "Consumer Products",
  "Logistics",
  "Other",
];

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const data = {
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      company: form.get("company"),
      sector: form.get("sector"),
      inquiryType: form.get("inquiryType"),
      message: form.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Something went wrong");
      }
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Header />
      <main className="bg-eccellere-cream pt-[72px]">
        <div className="mx-auto max-w-[1280px] px-6 py-20 lg:py-[120px]">
          <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr]">
            {/* Left: copy */}
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-eccellere-gold">
                Get in Touch
              </p>
              <h1 className="mt-4 font-display text-[clamp(36px,5vw,52px)] font-light leading-tight text-eccellere-ink">
                Let&apos;s talk about{" "}
                <span className="italic">your growth</span>
              </h1>
              <p className="mt-4 text-base leading-relaxed text-ink-mid">
                Whether you need a strategy framework, an AI readiness
                assessment, or a dedicated specialist — we&apos;re here to help.
              </p>

              <div className="mt-12 space-y-6 border-t border-eccellere-ink/5 pt-8">
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-ink-light">
                    Email
                  </p>
                  <p className="mt-1 text-sm text-eccellere-ink">
                    hello@eccellere.in
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-ink-light">
                    Phone
                  </p>
                  <p className="mt-1 text-sm text-eccellere-ink">
                    +91 98000 00000
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-ink-light">
                    Location
                  </p>
                  <p className="mt-1 text-sm text-eccellere-ink">
                    Bengaluru, India
                  </p>
                </div>
              </div>
            </div>

            {/* Right: form */}
            <div className="rounded bg-white p-8 shadow-sm lg:p-10">
              {submitted ? (
                <div className="flex flex-col items-center py-16 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-eccellere-teal/10">
                    <span className="text-3xl">✓</span>
                  </div>
                  <h2 className="mt-6 font-display text-2xl text-eccellere-ink">
                    Thank you!
                  </h2>
                  <p className="mt-2 text-sm text-ink-mid">
                    We&apos;ll be in touch within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-ink-light">
                        Full Name *
                      </label>
                      <input
                        name="name"
                        required
                        className="w-full border border-eccellere-ink/10 bg-transparent px-4 py-2.5 text-sm text-eccellere-ink focus:border-eccellere-gold focus:outline-none focus:ring-1 focus:ring-eccellere-gold"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-ink-light">
                        Email *
                      </label>
                      <input
                        name="email"
                        type="email"
                        required
                        className="w-full border border-eccellere-ink/10 bg-transparent px-4 py-2.5 text-sm text-eccellere-ink focus:border-eccellere-gold focus:outline-none focus:ring-1 focus:ring-eccellere-gold"
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-ink-light">
                        Phone
                      </label>
                      <input
                        name="phone"
                        type="tel"
                        className="w-full border border-eccellere-ink/10 bg-transparent px-4 py-2.5 text-sm text-eccellere-ink focus:border-eccellere-gold focus:outline-none focus:ring-1 focus:ring-eccellere-gold"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-ink-light">
                        Company
                      </label>
                      <input
                        name="company"
                        className="w-full border border-eccellere-ink/10 bg-transparent px-4 py-2.5 text-sm text-eccellere-ink focus:border-eccellere-gold focus:outline-none focus:ring-1 focus:ring-eccellere-gold"
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-ink-light">
                        Sector
                      </label>
                      <select
                        name="sector"
                        className="w-full border border-eccellere-ink/10 bg-transparent px-4 py-2.5 text-sm text-eccellere-ink focus:border-eccellere-gold focus:outline-none focus:ring-1 focus:ring-eccellere-gold"
                      >
                        <option value="">Select sector</option>
                        {sectors.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-ink-light">
                        I&apos;d like to *
                      </label>
                      <select
                        name="inquiryType"
                        required
                        className="w-full border border-eccellere-ink/10 bg-transparent px-4 py-2.5 text-sm text-eccellere-ink focus:border-eccellere-gold focus:outline-none focus:ring-1 focus:ring-eccellere-gold"
                      >
                        <option value="">Select type</option>
                        {inquiryTypes.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-ink-light">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      className="w-full border border-eccellere-ink/10 bg-transparent px-4 py-2.5 text-sm text-eccellere-ink focus:border-eccellere-gold focus:outline-none focus:ring-1 focus:ring-eccellere-gold"
                      placeholder="Tell us about your business and how we can help..."
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-eccellere-error">{error}</p>
                  )}

                  <Button type="submit" disabled={submitting} className="w-full">
                    {submitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
