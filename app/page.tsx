import SiteHeader from "@/components/custom/landing-page/site-header"
import HeroSection from "@/components/custom/landing-page/hero-section"
import ServicesSection from "@/components/custom/landing-page/services-section"
import FinalCTA from "@/components/custom/landing-page/final-cta"
import SiteFooter from "@/components/custom/landing-page/site-footer"

export default function HomePage() {
    return (
        <div className="relative isolate min-h-dvh overflow-hidden text-foreground">
            {/* <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/70 to-background" />
                <div className="absolute -top-40 left-[12%] h-[520px] w-[720px] rounded-full bg-[radial-gradient(circle_at_top,var(--primary),transparent_65%)] opacity-22 blur-3xl animate-glow-breathe" />
                <div
                    className="absolute right-[6%] top-[8%] h-[420px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,var(--primary),transparent_70%)] opacity-18 blur-3xl animate-glow-breathe"
                    style={{ animationDelay: "2s" }}
                />
                <div className="absolute left-[-6%] top-[38%] h-[360px] w-[460px] rounded-full bg-[radial-gradient(circle_at_center,var(--primary),transparent_72%)] opacity-14 blur-3xl" />
                <div className="absolute right-[14%] top-[45%] h-[300px] w-[380px] rounded-full bg-[radial-gradient(circle_at_center,var(--primary),transparent_75%)] opacity-12 blur-3xl" />
                <div className="absolute left-[10%] bottom-[-8%] h-[420px] w-[520px] rounded-full bg-[radial-gradient(circle_at_bottom,var(--primary),transparent_70%)] opacity-16 blur-3xl" />
                <div className="absolute right-[22%] bottom-[-12%] h-[300px] w-[380px] rounded-full bg-[radial-gradient(circle_at_bottom,var(--primary),transparent_78%)] opacity-12 blur-3xl" />
                <div className="absolute left-[-12%] bottom-[-22%] h-[520px] w-[640px] rounded-full bg-[radial-gradient(circle_at_bottom,var(--primary),transparent_75%)] opacity-10 blur-3xl" />
                <div className="absolute right-[-8%] bottom-[-18%] h-[420px] w-[520px] rounded-full bg-[radial-gradient(circle_at_bottom,var(--primary),transparent_80%)] opacity-10 blur-3xl" />
                <div className="absolute inset-0 bg-aurora opacity-55" />
                <div className="absolute inset-0 bg-grid" />
                <div className="absolute inset-0 bg-noise" />
            </div> */}

            <SiteHeader />

            <main>
                <HeroSection />
                <ServicesSection />
                <FinalCTA />
            </main>

            <SiteFooter />
        </div>
    )
}
