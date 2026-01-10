import { cn } from "@/lib/utils"

export default function Section({
  id,
  variant = "base",
  showOverlay = false,
  className = "",
  children,
}: {
  id?: string
  variant?:
  | "base"
  | "glow"
  | "tint"
  | "deep"
  | "border"
  | "default"
  | "soft"
  | "muted"
  | "brand"
  showOverlay?: boolean
  className?: string
  children: React.ReactNode
}) {
  const baseClass = "relative"

  const variants: Record<string, string> = {
    base: baseClass,
    glow: baseClass,
    tint: baseClass,
    deep: baseClass,
    border: `${baseClass} border-y border-border/50`,
    default: `${baseClass} bg-transparent`,
    soft: `${baseClass} bg-transparent`,
    muted: `${baseClass} bg-transparent`,
    brand: baseClass,
  }

  const overlays: Record<string, React.ReactNode> = {
    glow: (
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[420px] w-[560px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_top,var(--primary),transparent_70%)] opacity-22 blur-3xl" />
        <div className="absolute bottom-0 left-10 h-[320px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,var(--primary),transparent_70%)] opacity-20 blur-3xl" />
        <div className="absolute right-[-10%] top-[20%] h-[260px] w-[360px] rounded-full bg-[radial-gradient(circle_at_center,var(--primary),transparent_80%)] opacity-10 blur-3xl" />
      </div>
    ),
    tint: (
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-10 h-[360px] w-[480px] rounded-full bg-[radial-gradient(circle_at_top,var(--primary),transparent_72%)] opacity-12 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,var(--foreground),transparent_60%)] opacity-3" />
        <div className="absolute left-[-5%] bottom-[-20%] h-[360px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,var(--primary),transparent_72%)] opacity-9 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,var(--primary)_42%,transparent_70%)] opacity-4" />
      </div>
    ),
    deep: (
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -bottom-32 left-1/2 h-[420px] w-[560px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_bottom,var(--primary),transparent_70%)] opacity-16 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--foreground),transparent_65%)] opacity-3" />
        <div className="absolute right-[-8%] top-[-10%] h-[320px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,var(--primary),transparent_75%)] opacity-10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(200deg,transparent_0%,var(--primary)_48%,transparent_72%)] opacity-4" />
      </div>
    ),
  }

  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24",
        variants[variant],
        className,
      )}
    >
      {showOverlay ? overlays[variant] : null}
      <div className="relative mx-auto max-w-6xl px-4 py-14 md:py-20">
        {children}
      </div>
    </section>
  )
}
