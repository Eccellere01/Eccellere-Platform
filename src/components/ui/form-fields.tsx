import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({
  label,
  error,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-eccellere-ink"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={cn(
          "w-full rounded-none border border-eccellere-ink/20 bg-white px-4 py-2.5 text-sm text-eccellere-ink placeholder:text-ink-light focus:border-eccellere-gold focus:outline-none focus:ring-1 focus:ring-eccellere-gold",
          error && "border-eccellere-error focus:border-eccellere-error focus:ring-eccellere-error",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-eccellere-error">{error}</p>
      )}
    </div>
  );
}

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function Textarea({
  label,
  error,
  className,
  id,
  ...props
}: TextareaProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-eccellere-ink"
      >
        {label}
      </label>
      <textarea
        id={inputId}
        className={cn(
          "w-full rounded-none border border-eccellere-ink/20 bg-white px-4 py-2.5 text-sm text-eccellere-ink placeholder:text-ink-light focus:border-eccellere-gold focus:outline-none focus:ring-1 focus:ring-eccellere-gold",
          error && "border-eccellere-error focus:border-eccellere-error focus:ring-eccellere-error",
          className
        )}
        rows={4}
        {...props}
      />
      {error && (
        <p className="text-xs text-eccellere-error">{error}</p>
      )}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { label: string; value: string }[];
  error?: string;
}

export function Select({
  label,
  options,
  error,
  className,
  id,
  ...props
}: SelectProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-eccellere-ink"
      >
        {label}
      </label>
      <select
        id={inputId}
        className={cn(
          "w-full rounded-none border border-eccellere-ink/20 bg-white px-4 py-2.5 text-sm text-eccellere-ink focus:border-eccellere-gold focus:outline-none focus:ring-1 focus:ring-eccellere-gold",
          error && "border-eccellere-error focus:border-eccellere-error focus:ring-eccellere-error",
          className
        )}
        {...props}
      >
        <option value="">Select…</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-eccellere-error">{error}</p>
      )}
    </div>
  );
}
