import { NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"

function safeName(name: string) {
  // Normalize script names to safe blob keys
  return name.trim().toLowerCase().replace(/[^\w\-]+/g, "_").slice(0, 128)
}

export async function POST(req: NextRequest) {
  try {
    const { token, script, code } = await req.json()

    if (!token || !script || typeof code !== "string") {
      return NextResponse.json({ ok: false, error: "missing-fields" }, { status: 400 })
    }

    const safe = safeName(script)
    const key = `protected/${token}/${safe}.lua`

    // Store the code as a public blob so it can be served later
    const { url } = await put(key, code, {
      access: "public",
      addRandomSuffix: false,
      contentType: "text/plain; charset=utf-8",
    })

    return NextResponse.json({ ok: true, url })
  } catch (err) {
    return NextResponse.json({ ok: false, error: "server-error" }, { status: 500 })
  }
}
