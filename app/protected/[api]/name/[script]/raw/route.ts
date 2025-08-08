import { NextRequest } from "next/server"

function escapeForLuaDoubleQuotedString(s: string) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')
}

export async function GET(req: NextRequest, context: { params: { api: string; script: string } }) {
  const { api, script } = context.params
  const apiToken = api?.startsWith("API-") ? api.slice(4) : api || ""
  const scriptName = decodeURIComponent(script || "")
  const url = new URL(req.url)
  // Optional cache-busting param (not used here, but recognized)
  const _ = url.searchParams.get("v")

  const safeScript = escapeForLuaDoubleQuotedString(scriptName)
  const safeToken = escapeForLuaDoubleQuotedString(apiToken)

  const lua = `-- Nebula Protection raw loader
-- This endpoint is intended to be fetched via: loadstring(game:HttpGet("<url>"))()
-- It currently returns a protected placeholder. To serve real code, connect storage.

local _nebulaScriptName = "${safeScript}"
local _nebulaToken = "API-${safeToken}"

-- Try to show a Roblox notification (safe with pcall)
local ok, StarterGui = pcall(function() return game:GetService("StarterGui") end)
if ok and StarterGui and StarterGui.SetCore then
  pcall(StarterGui.SetCore, StarterGui, "SendNotification", {
    Title = "Nebula Protection",
    Text = "Protected script loaded: " .. _nebulaScriptName,
    Duration = 5
  })
end

print("[Nebula] Protected by Nebula Protection")
print("[Nebula] Script:", _nebulaScriptName)
print("[Nebula] API:", _nebulaToken)

-- TODO: Replace this section to fetch and execute real protected code.
-- Example: local source = "<fetched code>"; local fn = loadstring(source); return fn()

return true
`

  return new Response(lua, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      // Avoid caching during development; adjust for production as needed
      "cache-control": "no-store",
    },
  })
}
