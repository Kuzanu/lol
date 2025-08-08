"use client"

import Link from "next/link"
import { ShieldCheck, Lock, ExternalLink } from 'lucide-react'
import { Button } from "@/components/ui/button"

type Props = {
  params: {
    api: string
    script: string
  }
}

export default function ProtectedScriptPage({ params }: Props) {
  const apiSegment = params.api // Expected format: "API-<token>"
  const token = apiSegment?.startsWith("API-") ? apiSegment.slice(4) : apiSegment
  const scriptName = decodeURIComponent(params.script || "")

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Starry backdrop with purple glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(1.5px 1.5px at 12% 22%, rgba(255,255,255,0.14) 0, rgba(0,0,0,0) 100%), radial-gradient(1.5px 1.5px at 78% 72%, rgba(255,255,255,0.11) 0, rgba(0,0,0,0) 100%), radial-gradient(600px 600px at 50% 0%, rgba(139,92,246,0.18) 0, rgba(0,0,0,0) 60%)',
        }}
      />

      <header className="relative z-10 border-b border-white/5 bg-black/40 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-3 text-white">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-violet-600 to-fuchsia-600">
              <ShieldCheck className="h-5 w-5 text-white" />
            </span>
            <span className="text-base font-semibold">Nebula Protection</span>
          </Link>
          <div className="text-xs text-zinc-400">Protected Script</div>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto max-w-3xl px-6 py-14 sm:py-20">
          <div className="mb-8 flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-violet-700/30">
              <Lock className="h-5 w-5 text-violet-300" />
            </div>
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">Protected by Nebula Protection</h1>
              <p className="text-sm text-zinc-400">This endpoint is shielded and not directly accessible.</p>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-zinc-900/40 p-5 backdrop-blur">
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-wide text-zinc-500">Script Name</dt>
                <dd className="mt-1 text-sm text-zinc-200 break-all">{scriptName || "unknown"}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-zinc-500">API Token</dt>
                <dd className="mt-1 font-mono text-sm text-zinc-200 break-all">
                  {token ? `API-${token}` : "missing"}
                </dd>
              </div>
            </dl>

            <div className="mt-6 rounded-md border border-violet-700/30 bg-violet-900/10 p-4">
              <p className="text-sm text-violet-200">
                Access denied: This protected script cannot be viewed directly in the browser.
              </p>
              <p className="mt-1 text-xs text-zinc-400">
                If you believe this is an error, contact the script author or use the approved loader.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button asChild variant="secondary" className="bg-zinc-800 text-zinc-100 hover:bg-zinc-700">
                <Link href="/">
                  Home
                </Link>
              </Button>

              <Button asChild className="gap-2 bg-violet-700 hover:bg-violet-600">
                <Link href="/protection">
                  Create Your Own Protection
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
