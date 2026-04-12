"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

const steps = [
  { number: 1, label: "Account" },
  { number: 2, label: "Business" },
  { number: 3, label: "Priorities" },
  { number: 4, label: "Done" },
];

const businessTypes = [
  "Proprietorship",
  "Pvt Ltd",
  "LLP",
  "Partnership",
  "Startup",
  "Other",
];

const sectorOptions = [
  "Manufacturing",
  "Retail",
  "Consumer Products",
  "Logistics",
  "Other",
];

const revenueRanges = [
  "< ₹50 Lakhs",
  "₹50L – ₹1 Crore",
  "₹1Cr – ₹5 Crore",
  "₹5Cr – ₹25 Crore",
  "₹25Cr – ₹100 Crore",
  "> ₹100 Crore",
];

const employeeRanges = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "500+",
];

const challengeOptions = [
  "Revenue growth",
  "Operational efficiency",
  "Digital transformation",
  "AI adoption",
  "Talent & retention",
  "Quality management",
  "Supply chain",
  "Market expansion",
  "Compliance & governance",
  "Cost reduction",
];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    companyName: "",
    businessType: "",
    sector: "",
    revenueRange: "",
    employeeRange: "",
    city: "",
    state: "",
    challenges: [] as string[],
    referralSource: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function update(field: string, value: string | string[]) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function toggleChallenge(c: string) {
    setFormData((prev) => ({
      ...prev,
      challenges: prev.challenges.includes(c)
        ? prev.challenges.filter((x) => x !== c)
        : prev.challenges.length < 3
        ? [...prev.challenges, c]
        : prev.challenges,
    }));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          role: "CLIENT",
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Registration failed");
      }

      setStep(4);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full border border-eccellere-ink/10 bg-transparent px-4 py-2.5 text-sm text-eccellere-ink focus:border-eccellere-gold focus:outline-none focus:ring-1 focus:ring-eccellere-gold";
  const labelClass =
    "mb-1.5 block text-xs font-medium uppercase tracking-wider text-ink-light";

  return (
    <>
      <Header />
      <main className="bg-eccellere-cream pt-[72px]">
        <div className="mx-auto max-w-2xl px-6 py-20 lg:py-[120px]">
          <p className="text-center text-[11px] font-medium uppercase tracking-[0.2em] text-eccellere-gold">
            Client Registration
          </p>
          <h1 className="mt-4 text-center font-display text-[clamp(28px,5vw,42px)] font-light text-eccellere-ink">
            Get started with <span className="italic">Eccellere</span>
          </h1>

          {/* Step indicator */}
          <div className="mt-10 flex items-center justify-center gap-2">
            {steps.map((s) => (
              <div key={s.number} className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${
                    step >= s.number
                      ? "bg-eccellere-gold text-white"
                      : "border border-eccellere-ink/10 text-ink-light"
                  }`}
                >
                  {step > s.number ? "✓" : s.number}
                </div>
                <span className="hidden text-xs text-ink-light sm:block">
                  {s.label}
                </span>
                {s.number < steps.length && (
                  <div className="mx-2 h-px w-8 bg-eccellere-ink/10" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 rounded bg-white p-8 shadow-sm">
            {/* Step 1: Account */}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="font-display text-xl text-eccellere-ink">
                  Create your account
                </h2>
                <div>
                  <label className={labelClass}>Full Name *</label>
                  <input
                    value={formData.name}
                    onChange={(e) => update("name", e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => update("email", e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Password *</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => update("password", e.target.value)}
                    className={inputClass}
                    minLength={8}
                    required
                  />
                  <p className="mt-1 text-xs text-ink-light">
                    Minimum 8 characters
                  </p>
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <Button
                  onClick={() => setStep(2)}
                  disabled={!formData.name || !formData.email || formData.password.length < 8}
                  className="w-full"
                >
                  Continue
                </Button>
                <p className="text-center text-xs text-ink-light">
                  Already have an account?{" "}
                  <Link href="/login" className="text-eccellere-gold hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            )}

            {/* Step 2: Business */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="font-display text-xl text-eccellere-ink">
                  Tell us about your business
                </h2>
                <div>
                  <label className={labelClass}>Company Name *</label>
                  <input
                    value={formData.companyName}
                    onChange={(e) => update("companyName", e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Business Type *</label>
                    <select
                      value={formData.businessType}
                      onChange={(e) => update("businessType", e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Select</option>
                      {businessTypes.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Sector *</label>
                    <select
                      value={formData.sector}
                      onChange={(e) => update("sector", e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Select</option>
                      {sectorOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Annual Revenue *</label>
                    <select
                      value={formData.revenueRange}
                      onChange={(e) => update("revenueRange", e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Select</option>
                      {revenueRanges.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Employees *</label>
                    <select
                      value={formData.employeeRange}
                      onChange={(e) => update("employeeRange", e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Select</option>
                      {employeeRanges.map((e) => (
                        <option key={e} value={e}>{e}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>City *</label>
                    <input
                      value={formData.city}
                      onChange={(e) => update("city", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>State *</label>
                    <input
                      value={formData.state}
                      onChange={(e) => update("state", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => setStep(1)} className="flex-1">
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    disabled={!formData.companyName || !formData.sector}
                    className="flex-1"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Priorities */}
            {step === 3 && (
              <div className="space-y-5">
                <h2 className="font-display text-xl text-eccellere-ink">
                  Your top challenges
                </h2>
                <p className="text-sm text-ink-mid">
                  Select up to 3 challenges (helps us personalise your
                  experience)
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {challengeOptions.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleChallenge(c)}
                      className={`rounded border px-4 py-2.5 text-left text-sm transition-colors ${
                        formData.challenges.includes(c)
                          ? "border-eccellere-gold bg-eccellere-gold/5 text-eccellere-gold"
                          : "border-eccellere-ink/10 text-ink-mid hover:border-eccellere-gold/30"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <div>
                  <label className={labelClass}>How did you hear about us?</label>
                  <input
                    value={formData.referralSource}
                    onChange={(e) => update("referralSource", e.target.value)}
                    className={inputClass}
                    placeholder="Google, LinkedIn, referral..."
                  />
                </div>

                {error && (
                  <p className="text-sm text-eccellere-error">{error}</p>
                )}

                <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => setStep(2)} className="flex-1">
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex-1"
                  >
                    {submitting ? "Creating account..." : "Create Account"}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Success */}
            {step === 4 && (
              <div className="flex flex-col items-center py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-eccellere-teal/10">
                  <span className="text-3xl">✓</span>
                </div>
                <h2 className="mt-6 font-display text-2xl text-eccellere-ink">
                  Welcome to Eccellere!
                </h2>
                <p className="mt-2 text-sm text-ink-mid">
                  Your account has been created. Sign in to explore frameworks,
                  take the AI assessment, and more.
                </p>
                <Button asChild className="mt-8">
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
