import { NextRequest } from "next/server"
import { get } from "@vercel/blob"

function safeName(name: string) {
  return name.trim().toLowerCase().replace(/[^\w\-]+/g, "_").slice(0, 128)
}

function makePlaceholderLua(scriptName: string, apiToken: string) {
  const safeScript = scriptName.replace(/\\/g, "\\\\").replace(/"/g, '\\"')
  const safeToken = apiToken.replace(/\\/g, "\\\\").replace(/"/g, '\\"')
  return `-- Nebula Protection
-- Placeholder: source not found for this token/name.
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
  const token = (api || "").startsWith("API-") ? api.slice(4) : api || ""
  const normalized = safeName(decodeURIComponent(script || ""))

  try {
    const key = `protected/${token}/${normalized}.lua`
    const file = await get(key)
    // @vercel/blob get() provides a body (ReadableStream) on Node runtime
    // Serve Lua as text/plain for Roblox loadstring
    // If body is missing, fall back to placeholder
    // @ts-ignore - type compatibility depending on SDK minor versions
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
    // continue to placeholder
  }

  const lua = makePlaceholderLua(decodeURIComponent(script || ""), token)
  return new Response(lua, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  })
}
