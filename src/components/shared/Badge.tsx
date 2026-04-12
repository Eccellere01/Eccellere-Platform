import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "gold" | "purple" | "teal" | "info" | "error" | "neutral";
}

const variantStyles: Record<string, string> = {
  gold: "bg-eccellere-gold/20 text-eccellere-gold",
  purple: "bg-eccellere-purple/20 text-eccellere-purple",
  teal: "bg-eccellere-teal/20 text-eccellere-teal",
  info: "bg-eccellere-info/20 text-eccellere-info",
  error: "bg-eccellere-error/20 text-eccellere-error",
  neutral: "bg-eccellere-ink/10 text-ink-mid",
};

export function Badge({
  variant = "gold",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-block rounded-sm px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
