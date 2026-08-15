interface LogoProps {
  className?: string;
  showWordmark?: boolean;
  tone?: "default" | "light";
}

export function Logo({ className = "", showWordmark = true, tone = "default" }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 32 32" className="h-7 w-7 shrink-0" aria-hidden="true">
        <path
          d="M4 22 L16 10 L28 22"
          stroke={tone === "light" ? "#ffffff" : "#132043"}
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M4 28 L16 16 L28 28"
          stroke="#16A34A"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      {showWordmark && (
        <span className="text-lg font-bold tracking-tight">
          <span className={tone === "light" ? "text-white" : "text-brand-navy"}>Rise</span>{" "}
          <span className="text-brand-green">Skill</span>
        </span>
      )}
    </span>
  );
}
