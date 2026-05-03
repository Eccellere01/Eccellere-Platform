"use client";

import { useEffect, useState } from "react";
import { User, ExternalLink, Mail, Briefcase } from "lucide-react";

type SpecialistProfile = {
  headline: string;
  bio: string;
  linkedinUrl: string;
  currentRole: string;
  organisation: string;
  experienceYears: string;
  availability: string;
  hourlyRateMin: number | null;
  hourlyRateMax: number | null;
  serviceDomains: string[];
  sectorExpertise: string[];
  engagementTypes: string[];
  languages: string[];
  status: string;
  statusLabel: string;
  averageRating: number;
  totalAssignments: number;
};

type ProfileResponse = {
  user: { id: string; name: string | null; email: string; phone: string };
  specialistProfile: SpecialistProfile | null;
  statusLabel: string;
};

export default function SpecialistProfilePage() {
  const [data, setData] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/specialist/profile")
      .then(async (r) => {
        if (!r.ok) {
          const j = await r.json().catch(() => ({}));
          throw new Error(j.error || `Failed to load profile (HTTP ${r.status})`);
        }
        return r.json();
      })
      .then((d: ProfileResponse) => setData(d))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-[900px]">
        <p className="text-sm text-ink-light">Loading profile…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-[900px]">
        <p className="text-sm text-red-600">{error || "Profile not available"}</p>
      </div>
    );
  }

  const { user, specialistProfile: sp } = data;
  const name = user.name ?? "Specialist";
  const email = user.email;

  return (
    <div className="mx-auto max-w-[900px]">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-eccellere-gold">Profile</p>
      <h1 className="mt-2 font-display text-3xl font-light text-eccellere-ink">My Profile</h1>

      <div className="mt-8 space-y-6">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-start gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-eccellere-teal/10">
              <User className="h-8 w-8 text-eccellere-teal" />
            </div>
            <div className="flex-1">
              <h2 className="font-display text-xl text-eccellere-ink">{name}</h2>
              {sp?.headline ? (
                <p className="mt-1 text-sm text-ink-mid">{sp.headline}</p>
              ) : sp?.currentRole ? (
                <p className="mt-1 text-sm text-ink-mid">
                  {sp.currentRole}
                  {sp.organisation ? ` at ${sp.organisation}` : ""}
                </p>
              ) : null}
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-ink-light">
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {email}
                </span>
                {sp?.linkedinUrl && (
                  <a
                    href={sp.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-eccellere-gold"
                  >
                    <ExternalLink className="h-3 w-3" />
                    LinkedIn
                  </a>
                )}
                {sp?.currentRole && (
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3 w-3" />
                    {sp.currentRole}
                  </span>
                )}
              </div>
              <p className="mt-2 text-[11px] uppercase tracking-wider text-eccellere-gold">
                {data.statusLabel}
              </p>
            </div>
            {sp && (
              <div className="text-right">
                <p className="font-mono text-2xl text-eccellere-gold">
                  {sp.averageRating ? sp.averageRating.toFixed(1) : "—"}
                </p>
                <p className="text-xs text-ink-light">
                  {sp.totalAssignments} assignment{sp.totalAssignments === 1 ? "" : "s"}
                </p>
              </div>
            )}
          </div>
        </div>

        {sp?.bio && (
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="text-sm font-medium text-eccellere-ink">About</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-mid">{sp.bio}</p>
          </div>
        )}

        {sp && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="text-sm font-medium text-eccellere-ink">Professional Details</h3>
              <dl className="mt-4 space-y-3">
                {sp.organisation && (
                  <div>
                    <dt className="text-xs text-ink-light">Organisation</dt>
                    <dd className="text-sm text-eccellere-ink">{sp.organisation}</dd>
                  </div>
                )}
                {sp.experienceYears && (
                  <div>
                    <dt className="text-xs text-ink-light">Experience</dt>
                    <dd className="text-sm text-eccellere-ink">{sp.experienceYears} years</dd>
                  </div>
                )}
                {sp.availability && (
                  <div>
                    <dt className="text-xs text-ink-light">Availability</dt>
                    <dd className="text-sm text-eccellere-ink">{sp.availability}</dd>
                  </div>
                )}
                {(sp.hourlyRateMin || sp.hourlyRateMax) && (
                  <div>
                    <dt className="text-xs text-ink-light">Hourly Rate</dt>
                    <dd className="text-sm text-eccellere-ink">
                      ₹{sp.hourlyRateMin ?? "—"} – ₹{sp.hourlyRateMax ?? "—"}
                    </dd>
                  </div>
                )}
                {sp.languages.length > 0 && (
                  <div>
                    <dt className="text-xs text-ink-light">Languages</dt>
                    <dd className="text-sm text-eccellere-ink">{sp.languages.join(", ")}</dd>
                  </div>
                )}
                {sp.engagementTypes.length > 0 && (
                  <div>
                    <dt className="text-xs text-ink-light">Engagement Types</dt>
                    <dd className="text-sm text-eccellere-ink">{sp.engagementTypes.join(", ")}</dd>
                  </div>
                )}
              </dl>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="text-sm font-medium text-eccellere-ink">Expertise</h3>
              {sp.serviceDomains.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-ink-light">Service Domains</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {sp.serviceDomains.map((d) => (
                      <span
                        key={d}
                        className="rounded border border-eccellere-gold/20 bg-eccellere-gold/5 px-2.5 py-1 text-xs text-eccellere-gold"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {sp.sectorExpertise.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-ink-light">Sector Expertise</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {sp.sectorExpertise.map((s) => (
                      <span
                        key={s}
                        className="rounded border border-eccellere-teal/20 bg-eccellere-teal/5 px-2.5 py-1 text-xs text-eccellere-teal"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {sp.serviceDomains.length === 0 && sp.sectorExpertise.length === 0 && (
                <p className="mt-4 text-xs text-ink-light">
                  No expertise tags yet. Update your profile to add them.
                </p>
              )}
            </div>
          </div>
        )}

        {!sp && (
          <div className="rounded-lg border border-eccellere-gold/30 bg-eccellere-gold/5 p-6">
            <p className="text-sm text-eccellere-ink">
              Your specialist profile has not been created yet. Please contact support.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
