export type TechnologyIconKind =
  | "python"
  | "django"
  | "sql"
  | "power-bi"
  | "analytics"
  | "api";

type TechnologyIconProps = {
  kind: TechnologyIconKind;
  className?: string;
  label?: string;
};

export default function TechnologyIcon({ kind, className = "", label }: TechnologyIconProps) {
  const wrapperClass = `technology-icon technology-icon-${kind} ${className}`.trim();

  if (kind === "django") {
    return (
      <span className={wrapperClass} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
        <img src="/django-logo-positive.png" alt="" />
      </span>
    );
  }

  return (
    <span className={wrapperClass} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      {kind === "python" && (
        <svg viewBox="0 0 48 48" focusable="false">
          <path className="python-blue" d="M23.8 5.2c-10 0-9.4 4.3-9.4 4.3v4.4h9.7v1.4H10.5S5 14.7 5 23.4s4.8 8.4 4.8 8.4h4.1v-5.5s-.2-5.4 5.3-5.4h9.6s5.2.1 5.2-5.1V10s.8-4.8-10.2-4.8Z" />
          <circle cx="19.1" cy="10.1" r="1.5" fill="#fff" />
          <path className="python-yellow" d="M24.2 42.8c10 0 9.4-4.3 9.4-4.3v-4.4h-9.7v-1.4h13.6s5.5.6 5.5-8.1-4.8-8.4-4.8-8.4h-4.1v5.5s.2 5.4-5.3 5.4h-9.6s-5.2-.1-5.2 5.1V38s-.8 4.8 10.2 4.8Z" />
          <circle cx="28.9" cy="37.9" r="1.5" fill="#fff" />
        </svg>
      )}

      {kind === "sql" && (
        <svg viewBox="0 0 48 48" focusable="false">
          <ellipse cx="24" cy="10" rx="15.5" ry="5.5" />
          <path d="M8.5 10v10c0 3 7 5.5 15.5 5.5S39.5 23 39.5 20V10" />
          <path d="M8.5 20v10c0 3 7 5.5 15.5 5.5S39.5 33 39.5 30V20" />
          <path d="M8.5 30v8c0 3 7 5.5 15.5 5.5S39.5 41 39.5 38v-8" />
          <path className="sql-shine" d="M13 15.8v18.6" />
        </svg>
      )}

      {kind === "power-bi" && (
        <svg viewBox="0 0 48 48" focusable="false">
          <rect x="7" y="25" width="7" height="16" rx="2" />
          <rect x="17" y="17" width="7" height="24" rx="2" />
          <rect x="27" y="10" width="7" height="31" rx="2" />
          <rect x="37" y="5" width="5" height="36" rx="2" />
          <path className="bi-spark" d="m8 19 9-6 8 2 12-9" />
        </svg>
      )}

      {kind === "analytics" && (
        <svg viewBox="0 0 48 48" focusable="false">
          <path className="analytics-area" d="m7 38 9-12 8 5 8-16 9 7v16Z" />
          <path className="analytics-line" d="m7 38 9-12 8 5 8-16 9 7" />
          <circle cx="7" cy="38" r="2.5" />
          <circle cx="16" cy="26" r="2.5" />
          <circle cx="24" cy="31" r="2.5" />
          <circle cx="32" cy="15" r="2.5" />
          <circle cx="41" cy="22" r="2.5" />
        </svg>
      )}

      {kind === "api" && (
        <svg viewBox="0 0 48 48" focusable="false">
          <path d="m16 11-9 13 9 13" />
          <path d="m32 11 9 13-9 13" />
          <path className="api-slash" d="m28 7-8 34" />
          <circle cx="24" cy="24" r="4" />
        </svg>
      )}
    </span>
  );
}
