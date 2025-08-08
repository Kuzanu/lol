"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { ShieldCheck, Upload, FileCode, ArrowRight, CheckCircle2, XCircle, AlertTriangle, Copy } from 'lucide-react'

type Status = "idle" | "success" | "error"

function safeName(name: string) {
  return name.trim().toLowerCase().replace(/[^\w\-]+/g, "_").slice(0, 128)
}

export default function ProtectionPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [code, setCode] = useState<string>("")
  const [fileName, setFileName] = useState<string>("")
  const [step, setStep] = useState<"edit" | "name">("edit")

  const [name, setName] = useState<string>("")
  const [status, setStatus] = useState<Status>("idle")
  const [message, setMessage] = useState<string>("")
  const [apiToken, setApiToken] = useState<string>("")
  const [loadSnippet, setLoadSnippet] = useState<string>("")

  // Helpers for local storage keys
  const namesKey = useMemo(() => "nebula:names", [])
  const mapKey = useMemo(() => "nebula:name-to-api", [])

  // Initialize storage maps if missing
  useEffect(() => {
    try {
      if (typeof window === "undefined") return
      if (!localStorage.getItem(namesKey)) localStorage.setItem(namesKey, JSON.stringify([]))
      if (!localStorage.getItem(mapKey)) localStorage.setItem(mapKey, JSON.stringify({}))
    } catch {
      // ignore storage errors
    }
  }, [namesKey, mapKey])

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelected = async (file?: File) => {
    if (!file) return
    setFileName(file.name)
    try {
      const text = await file.text()
      setCode(text)
    } catch {
      // If reading fails, keep code as-is
    }
  }

  const handleContinue = () => {
    setStep("name")
    // Reset state when moving forward
    setStatus("idle")
    setMessage("")
    setApiToken("")
    setLoadSnippet("")
  }

  const genApi = () => {
    // Generate a compact, URL-safe token
    const arr = new Uint8Array(16)
    crypto.getRandomValues(arr)
    let num = ""
    for (let i = 0; i < arr.length; i++) {
      num += arr[i].toString(16).padStart(2, "0")
    }
    const suffix = Math.floor(Math.random() * 1e8).toString(36)
    return `${num.slice(0, 24)}-${suffix}`
  }

  const persistCode = async (token: string, scriptName: string, codeText: string) => {
    // Store the code on the server so Roblox can fetch it later
    const res = await fetch("/api/protect", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token, script: scriptName, code: codeText }),
    })
    if (!res.ok) {
      throw new Error("persist-failed")
    }
    return res.json()
  }

  const confirmName = async () => {
    const trimmed = name.trim()
    setStatus("idle")
    setMessage("")
    setApiToken("")
    setLoadSnippet("")
    // Simulate async
    await new Promise((r) => setTimeout(r, 400))

    try {
      if (typeof window === "undefined") return

      const used: string[] = JSON.parse(localStorage.getItem(namesKey) || "[]")
      const usedLower = new Set(used.map((n) => n.toLowerCase()))

      if (trimmed.length === 0) {
        setStatus("error")
        setMessage("Failed — Name already chosen")
        return
      }

      if (usedLower.has(trimmed.toLowerCase())) {
        setStatus("error")
        setMessage("Failed — Name already chosen")
        return
      }

      // Randomly simulate connectivity failure ~15%
      if (Math.random() < 0.15) {
        setStatus("error")
        setMessage("Failed — Bad internet connection")
        return
      }

      // Success path
      const token = genApi()

      // Persist the code to the server (keyed by token + safe script name)
      const normalized = safeName(trimmed)
      await persistCode(token, normalized, code || "-- no content")

      // Persist name mapping locally (for collision checks UX)
      const map = JSON.parse(localStorage.getItem(mapKey) || "{}")
      map[trimmed] = token
      used.push(trimmed)
      localStorage.setItem(mapKey, JSON.stringify(map))
      localStorage.setItem(namesKey, JSON.stringify(used))

      // Build loader URL that hits the same PAGE route with ?format=lua
      const url = `https://nebula-protecter.vercel.app/protected/API-${encodeURIComponent(
        token
      )}/name/${encodeURIComponent(trimmed)}/lua?v=${Date.now()}`
      const snippet = `loadstring(game:HttpGet("${url}"))()`

      setApiToken(token)
      setLoadSnippet(snippet)
      setStatus("success")
      setMessage("Successful")
    } catch (e) {
      setStatus("error")
      setMessage("Failed — Bad internet connection")
    }
  }

  const copySnippet = async () => {
    try {
      await navigator.clipboard.writeText(loadSnippet)
    } catch {
      // no-op
    }
  }

  return (
    <div className="relative min-h-screen bg-black">
      {/* Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(2px 2px at 15% 25%, rgba(255,255,255,0.13) 0, rgba(0,0,0,0) 100%), radial-gradient(2px 2px at 75% 70%, rgba(255,255,255,0.10) 0, rgba(0,0,0,0) 100%), radial-gradient(600px 600px at 20% 0%, rgba(168,85,247,0.18) 0, rgba(0,0,0,0) 60%)',
        }}
      />

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 bg-black/40 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-3 text-white">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-violet-600 to-fuchsia-600">
              <ShieldCheck className="h-5 w-5 text-white" />
            </span>
            <span className="text-base font-semibold">Nebula Protection</span>
          </Link>
          <div className="text-sm text-zinc-400">Protection Page</div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="mb-8 space-y-2">
            <h1 className="text-2xl font-bold text-white md:text-3xl">Protect Your Script</h1>
            <p className="text-zinc-400">Upload or paste your code, then generate a protected loadstring.</p>
          </div>

          <Card className="border-white/10 bg-zinc-900/40 p-6 backdrop-blur">
            {/* Upload and Editor */}
            <div className="grid gap-5">
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-violet-700/30 text-violet-200">
                    <FileCode className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Your Code</div>
                    <div className="text-xs text-zinc-400">
                      Upload a file or paste directly into the editor
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".lua,.txt,.json,.js,.ts,.py,.rb,.php,.cs,.java,.c,.cpp,.md,.yml,.yaml,.toml,.ini,*/*"
                    className="hidden"
                    onChange={(e) => handleFileSelected(e.target.files?.[0])}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleUploadClick}
                    className="gap-2 border-white/10 bg-zinc-900 text-white hover:bg-zinc-800"
                  >
                    <Upload className="h-4 w-4" />
                    Upload File
                  </Button>
                  {fileName ? (
                    <span className="truncate text-xs text-zinc-400 max-w-[200px] sm:max-w-[260px]" title={fileName}>
                      {fileName}
                    </span>
                  ) : null}
                </div>
              </div>

              <div>
                <Label htmlFor="nebula-code" className="mb-2 block text-xs text-zinc-400">
                  Code Editor
                </Label>
                <Textarea
                  id="nebula-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Paste or edit your code here..."
                  className="min-h-[260px] resize-y border-white/10 bg-black/60 font-mono text-sm text-zinc-200 placeholder:text-zinc-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-zinc-500">
                  Tip: You can upload a file to auto-fill the editor.
                </div>
                <Button
                  type="button"
                  onClick={handleContinue}
                  className="gap-2 bg-violet-700 text-white hover:bg-violet-600"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Naming step */}
            {step === "name" && (
              <div className="mt-8 grid gap-4">
                <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end">
                  <div>
                    <Label htmlFor="script-name" className="mb-1.5 block text-xs text-zinc-400">
                      Name
                    </Label>
                    <Input
                      id="script-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter a unique script name"
                      className="border-white/10 bg-black/60 text-zinc-100 placeholder:text-zinc-500"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={confirmName}
                    className="mt-2 gap-2 bg-fuchsia-700 text-white hover:bg-fuchsia-600 sm:mt-0"
                  >
                    Confirm Name
                    <ShieldCheck className="h-4 w-4" />
                  </Button>
                </div>

                {status !== "idle" && (
                  <Alert
                    variant={status === "success" ? "default" : "destructive"}
                    className={
                      status === "success"
                        ? "border-emerald-500/30 bg-emerald-900/20 text-emerald-200"
                        : "border-rose-500/30 bg-rose-900/20 text-rose-200"
                    }
                  >
                    <div className="flex items-start gap-3">
                      {status === "success" ? (
                        <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-300" />
                      ) : message.includes("Bad internet") ? (
                        <AlertTriangle className="mt-0.5 h-5 w-5 text-rose-300" />
                      ) : (
                        <XCircle className="mt-0.5 h-5 w-5 text-rose-300" />
                      )}
                      <div>
                        <AlertTitle className="text-sm font-semibold">
                          {status === "success" ? "Successful" : "Failed"}
                        </AlertTitle>
                        <AlertDescription className="text-sm">
                          {message}
                        </AlertDescription>
                      </div>
                    </div>
                  </Alert>
                )}

                {status === "success" && (
                  <div className="grid gap-2">
                    <Label htmlFor="loadstring" className="text-xs text-zinc-400">
                      Roblox loadstring
                    </Label>
                    <div className="relative">
                      <Textarea
                        id="loadstring"
                        readOnly
                        value={loadSnippet}
                        className="min-h-[110px] resize-none border-white/10 bg-black/60 font-mono text-sm text-zinc-200"
                      />
                      <Button
                        type="button"
                        onClick={copySnippet}
                        className="absolute right-2 top-2 h-8 gap-1 bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
                        variant="secondary"
                        title="Copy to clipboard"
                        aria-label="Copy to clipboard"
                      >
                        <Copy className="h-4 w-4" />
                        Copy
                      </Button>
                    </div>
                    <div className="text-xs text-zinc-500">
                      Generated API: <span className="font-mono text-zinc-300">API-{apiToken}</span>
                    </div>
                    <div className="text-xs text-zinc-500">
                      Open the public page in a browser without the format parameter to see the protected banner.
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  )
}
