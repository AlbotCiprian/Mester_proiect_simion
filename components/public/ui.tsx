import Link from "next/link";
import type { ReactNode } from "react";

type Tone = "canvas" | "surface" | "ink";

const toneClass: Record<Tone, string> = {
  canvas: "bg-canvas text-ink-soft",
  surface: "bg-surface text-ink-soft",
  ink: "bg-ink text-canvas",
};

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[78rem] px-5 sm:px-8 lg:px-10 ${className}`}>
      {children}
    </div>
  );
}

export function Section({
  children,
  id,
  tone = "canvas",
  className = "",
  divide = false,
}: {
  children: ReactNode;
  id?: string;
  tone?: Tone;
  className?: string;
  divide?: boolean;
}) {
  return (
    <section
      id={id}
      className={`${toneClass[tone]} ${divide ? "joint-rule" : ""} py-20 sm:py-28 ${className}`}
    >
      {children}
    </section>
  );
}

export function Kicker({ children }: { children: ReactNode }) {
  return <span className="kicker">{children}</span>;
}

export function SectionHeading({
  kicker,
  title,
  intro,
  align = "left",
  tone = "dark",
}: {
  kicker?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
}) {
  const titleColor = tone === "light" ? "text-canvas" : "text-ink";
  const introColor = tone === "light" ? "text-canvas/75" : "text-muted";
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {kicker ? <Kicker>{kicker}</Kicker> : null}
      <h2 className={`mt-5 text-3xl sm:text-4xl lg:text-[2.75rem] ${titleColor}`}>{title}</h2>
      {intro ? <p className={`mt-5 text-base sm:text-lg leading-relaxed ${introColor}`}>{intro}</p> : null}
    </div>
  );
}

type ButtonVariant = "primary" | "secondary" | "bronze" | "ghost-light";

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-ink text-canvas hover:bg-ink-soft border border-ink",
  secondary:
    "bg-transparent text-ink border border-line-strong hover:border-ink hover:bg-canvas-raised",
  bronze:
    "bg-bronze text-canvas-raised hover:bg-bronze-deep border border-bronze",
  "ghost-light":
    "bg-transparent text-canvas border border-canvas/35 hover:border-canvas hover:bg-canvas/10",
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-xs px-6 py-3 text-sm font-semibold tracking-wide transition-colors duration-200 ${variantClass[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}

export function Arrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M4 10h12M11 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
