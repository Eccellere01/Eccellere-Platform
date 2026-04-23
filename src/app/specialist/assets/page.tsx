"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Eye, Download, Star, PlusCircle, Upload,
  CheckCircle2, AlertCircle, Loader2, Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DbAsset {
  id: string;
  title: string;
  status: string;
  price: number;
  components: string[];
  fileUrls: string[];
  totalPurchases: number;
  totalRevenue: number;
  totalViews: number;
  averageRating: number;
  createdAt: string;
}

const STATUS_STYLE: Record<string, string> = {
  PUBLISHED:           "bg-eccellere-teal/10 text-eccellere-teal",
  APPROVED:            "bg-eccellere-teal/10 text-eccellere-teal",
  SUBMITTED:           "bg-eccellere-gold/10 text-eccellere-gold",
  UNDER_REVIEW:        "bg-blue-50 text-blue-600",
  REVISIONS_REQUESTED: "bg-eccellere-error/10 text-eccellere-error",
  DRAFT:               "bg-ink-light/10 text-ink-light",
  RETIRED:             "bg-ink-light/10 text-ink-light",
};
const STATUS_LABEL: Record<string, string> = {
  PUBLISHED: "Published", APPROVED: "Approved", SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review", REVISIONS_REQUESTED: "Revisions Needed",
  DRAFT: "Draft", RETIRED: "Retired",
};

export default function SpecialistAssetsPage() {
  const [assets, setAssets] = useState<DbAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [uploadMsg, setUploadMsg] = useState<{ id: string; ok: boolean; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingAssetId = useRef<string | null>(null);

  async function fetchAssets() {
    setLoading(true);
    try {
      const res = await fetch("/api/specialist/assets");
      const data = await res.json();
      setAssets(data.assets ?? []);
    } catch {
      setAssets([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchAssets(); }, []);

  function triggerFileUpload(assetId: string) {
    pendingAssetId.current = assetId;
    fileInputRef.current?.click();
  }

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const assetId = pendingAssetId.current;
    if (!file || !assetId) return;
    e.target.value = "";

    setUploadingId(assetId);
    setUploadMsg(null);
    try {
      const fd = new FormData();
      fd.set("assetId", assetId);
      fd.set("file", file);
      const res = await fetch("/api/specialist/assets", { method: "PATCH", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setUploadMsg({ id: assetId, ok: true, text: "File uploaded successfully." });
      await fetchAssets();
    } catch (err) {
      setUploadMsg({ id: assetId, ok: false, text: err instanceof Error ? err.message : "Upload failed" });
    } finally {
      setUploadingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-[1280px]">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.xlsx,.xls,.docx,.doc,.pptx,.ppt,.zip"
        onChange={handleFileSelected}
      />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-eccellere-gold">Assets</p>
          <h1 className="mt-2 font-display text-3xl font-light text-eccellere-ink">My Assets</h1>
        </div>
        <Button asChild>
          <Link href="/specialist/assets/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Submit New
          </Link>
        </Button>
      </div>

      <div className="mt-8 rounded-lg bg-white shadow-sm">
        <div className="border-b border-eccellere-ink/5 px-6 py-4">
          <p className="text-sm font-medium text-eccellere-ink">
            {loading ? "Loading…" : `${assets.length} asset${assets.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-ink-light">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading your assets…
          </div>
        ) : assets.length === 0 ? (
          <div className="py-12 text-center text-sm text-ink-light">
            No assets yet.{" "}
            <Link href="/specialist/assets/new" className="underline hover:text-eccellere-gold">
              Submit your first asset →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-eccellere-ink/5">
            {assets.map((asset) => {
              const hasFile = Array.isArray(asset.fileUrls) && asset.fileUrls.length > 0;
              const isUploading = uploadingId === asset.id;
              const msg = uploadMsg?.id === asset.id ? uploadMsg : null;
              const format = Array.isArray(asset.components) && asset.components.length > 0
                ? asset.components[0] : "—";

              return (
                <div key={asset.id} className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-eccellere-ink">{asset.title}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className={cn(
                        "rounded-sm px-2 py-0.5 text-[10px] uppercase tracking-wider",
                        STATUS_STYLE[asset.status] ?? "bg-ink-light/10 text-ink-light"
                      )}>
                        {STATUS_LABEL[asset.status] ?? asset.status}
                      </span>
                      <span className="text-xs text-ink-light">{format}</span>
                      {asset.averageRating > 0 && (
                        <span className="flex items-center gap-1 text-xs text-ink-light">
                          <Star className="h-3 w-3 fill-eccellere-gold text-eccellere-gold" />
                          {asset.averageRating.toFixed(1)}
                        </span>
                      )}
                      {/* File status indicator */}
                      {hasFile ? (
                        <span className="flex items-center gap-1 text-[10px] text-eccellere-teal">
                          <CheckCircle2 className="h-3 w-3" />
                          File attached
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] text-eccellere-error">
                          <AlertCircle className="h-3 w-3" />
                          No file — clients cannot download
                        </span>
                      )}
                    </div>
                    {msg && (
                      <p className={cn("mt-1 text-xs", msg.ok ? "text-eccellere-teal" : "text-eccellere-error")}>
                        {msg.text}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-4 text-xs text-ink-light">
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{asset.totalViews}</span>
                      <span className="flex items-center gap-1"><Download className="h-3 w-3" />{asset.totalPurchases}</span>
                      <span className="font-mono text-sm text-eccellere-gold">
                        {asset.totalRevenue > 0 ? `₹${asset.totalRevenue.toLocaleString("en-IN")}` : "—"}
                      </span>
                    </div>

                    {/* Edit listing button */}
                    <Link
                      href={`/specialist/assets/${asset.id}/edit`}
                      title="Edit listing details, description and pricing"
                      className="flex items-center gap-1.5 rounded border border-eccellere-ink/15 px-3 py-1.5 text-xs font-medium text-ink-mid transition-colors hover:border-eccellere-gold hover:text-eccellere-gold"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Link>

                    {/* Upload / Replace file button */}
                    <button
                      disabled={isUploading}
                      onClick={() => triggerFileUpload(asset.id)}
                      title={hasFile ? "Replace file" : "Upload file so clients can download"}
                      className={cn(
                        "flex items-center gap-1.5 rounded border px-3 py-1.5 text-xs font-medium transition-colors",
                        hasFile
                          ? "border-eccellere-ink/15 text-ink-mid hover:border-eccellere-gold hover:text-eccellere-gold"
                          : "border-eccellere-error/30 bg-eccellere-error/5 text-eccellere-error hover:bg-eccellere-error/10"
                      )}
                    >
                      {isUploading
                        ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading…</>
                        : <><Upload className="h-3.5 w-3.5" />{hasFile ? "Replace File" : "Upload File"}</>
                      }
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

