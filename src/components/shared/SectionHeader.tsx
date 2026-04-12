import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  label: string;
  title: string;
  titleAccent?: string;
  description?: string;
  centered?: boolean;
  dark?: boolean;
}

export function SectionHeader({
  label,
  title,
  titleAccent,
  description,
  centered = false,
  dark = false,
}: SectionHeaderProps) {
  return (
    <div className={cn(centered && "text-center")}>
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-eccellere-gold">
        {label}
      </p>
      <h2
        className={cn(
          "mt-4 font-display text-[clamp(28px,5vw,52px)] font-light leading-tight",
          dark ? "text-eccellere-cream" : "text-eccellere-ink"
        )}
      >
        {title}{" "}
        {titleAccent && (
          <span className={cn("italic", dark && "text-eccellere-gold")}>
            {titleAccent}
          </span>
        )}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 max-w-2xl text-base",
            centered && "mx-auto",
            dark ? "text-white/50" : "text-ink-mid"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
