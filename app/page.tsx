"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Rocket, Sparkles } from 'lucide-react'
import { cn } from "@/lib/utils"

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Background: subtle stars and purple glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(2px 2px at 10% 20%, rgba(255,255,255,0.15) 0, rgba(0,0,0,0) 100%), radial-gradient(2px 2px at 30% 80%, rgba(255,255,255,0.10) 0, rgba(0,0,0,0) 100%), radial-gradient(2px 2px at 70% 30%, rgba(255,255,255,0.12) 0, rgba(0,0,0,0) 100%), radial-gradient(600px 600px at 70% 10%, rgba(139,92,246,0.15) 0, rgba(0,0,0,0) 60%)',
        }}
      />
      {/* Header */}
      <header className="relative z-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-fuchsia-900/30">
              <Shield className="h-5 w-5" />
            </span>
            <span className="text-lg font-semibold text-white">Nebula Protection</span>
          </div>
          <Link
            href="/protection"
            className={cn(
              "text-sm text-muted-foreground hover:text-white transition-colors"
            )}
          >
            Protection Page
          </Link>
        </div>
      </header>

      {/* Main Hero */}
      <main className="relative z-10">
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-2 md:gap-16 md:py-28">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-700/40 bg-violet-900/20 px-3 py-1 text-xs text-violet-200 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-violet-300" />
              <span>Space‑grade protection</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
              The Protector of the Galaxies
            </h1>
            <p className="max-w-prose text-base leading-relaxed text-zinc-300 md:text-lg">
              Always the best to use. Harden your scripts with a system forged in the stars.
              Elegant, reliable, and ready for every mission.
            </p>
            <div className="pt-2">
              <Button asChild size="lg" className="group w-full gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-500 hover:to-fuchsia-500 md:w-auto">
                <Link href="/protection">
                  <Rocket className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                  Proceed to Protection
                </Link>
              </Button>
            </div>
          </div>

          {/* Decorative Orb */}
          <div className="relative mx-auto h-[320px] w-[320px] md:h-[420px] md:w-[420px]">
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(168,85,247,0.35),transparent_60%),radial-gradient(circle_at_70%_70%,rgba(217,70,239,0.25),transparent_55%)] blur-[1px]" />
            <div className="absolute inset-[8%] rounded-full border border-violet-600/30" />
            <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-400 shadow-[0_0_40px_10px_rgba(217,70,239,0.6)]" />
            <div className="absolute inset-0 animate-[spin_20s_linear_infinite] rounded-full ring-1 ring-inset ring-white/10" />
          </div>
        </section>
      </main>

      {/* Bottom CTA */}
      <div className="relative z-10 border-t border-white/5 bg-gradient-to-t from-black/60 to-transparent">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
          <p className="text-sm text-zinc-400">
            Ready to shield your code?
          </p>
          <Button asChild size="lg" className="gap-2 bg-violet-700 hover:bg-violet-600">
            <Link href="/protection">
              <Rocket className="h-5 w-5" />
              Protection Page
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
