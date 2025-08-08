import { NextRequest } from "next/server"
import { get } from "@vercel/blob"

function safeName(name: string) {
  return name.trim().toLowerCase().replace(/[^\w\-]+/g, "_").slice(0, 128)
}

function makePlaceholderLua(scriptName: string, apiToken: string) {
  const safeScript = scriptName.replace(/\\/g, "\\\\").replace(/"/g, '\\"')
  const safeToken = apiToken.replace(/\\/g, "\\\\").replace(/"/g, '\\"')
  return `-- Nebula Protection
-- Placeholder: code not found for this token/name.
local _name = "${safeScript}"
local _api = "API-${safeToken}"

local ok, StarterGui = pcall(function() return game:GetService("StarterGui") end)
if ok and StarterGui and StarterGui.SetCore then
  pcall(StarterGui.SetCore, StarterGui, "SendNotification", {
    Title = "Nebula Protection",
    Text = "Protected by Nebula Protection",
    Duration = 5
  })
end

print("[Nebula] Protected by Nebula Protection")
print("[Nebula] Missing source for:", _name, _api)
return true
`
}

export async function GET(req: NextRequest, context: { params: { api: string; script: string } }) {
  const { api, script } = context.params
  const format = new URL(req.url).searchParams.get("format")

  // Only serve Lua when explicitly requested with ?format=lua
  if (format !== "lua") {
    // Defer to the page.tsx for HTML rendering by redirecting to the bare URL (no query)
    // Browsers will land on the page, loadstring will always include format=lua.
    const url = new URL(req.url)
    url.search = ""
    return new Response(null, { status: 307, headers: { Location: url.toString() } })
  }

  const token = (api || "").startsWith("API-") ? api.slice(4) : api || ""
  const safe = safeName(decodeURIComponent(script || ""))

  try {
    // Attempt to fetch stored code from the blob at a deterministic key
    const key = `protected/${token}/${safe}.lua`
    const file = await get(key)
    if (file?.body) {
      return new Response(file.body, {
        status: 200,
        headers: {
          "content-type": "text/plain; charset=utf-8",
          "cache-control": "no-store",
        },
      })
    }
  } catch {
    // fall through to placeholder
  }

  // Fallback placeholder if the code was not stored/found
  const lua = makePlaceholderLua(decodeURIComponent(script || ""), token)
  return new Response(lua, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  })
}
