function g(){let e=new Uint8Array(32);return crypto.getRandomValues(e),Array.from(e,t=>t.toString(16).padStart(2,"0")).join("")}var B="https://github.com/ranjan2829/AskJev/releases/download/v1.7.3/askjev-mcp-1.7.3.tgz";function I(e){let t=(e||"mac").toLowerCase();return t.startsWith("win")?"C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe":t.startsWith("linux")?"/usr/bin/brave-browser":"/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"}function C(e){let t={ASKJEV_TOKEN:e.token,ASKJEV_PORT:String(e.port),ASKJEV_MODE:"cdp",ASKJEV_BROWSER_BIN:(e.browserBin||"").trim()||I(e.platform)},n=(e.apiKey||"").trim();return n&&(t.ASKJEV_API_KEY=n,t.TYPESAFE_API_KEY=n),t}function A(e,t,n="npm"){let o=typeof e=="string"?{token:e,port:t??17373,source:n}:{source:"npm",...e};return{command:"npx",args:["-y",o.source==="github"?B:"askjev-mcp"],env:C(o)}}function p(e,t){return JSON.stringify({mcpServers:{askjev:A(typeof e=="string"?{token:e,port:t??17373}:e)}},null,2)}function E(e){return JSON.stringify(e)}function y(e){let t=C(e);return`import json, os, sys
path = sys.argv[1]
entry = {
  "command": "npx",
  "args": ["-y", "askjev-mcp"],
  "env": {
${Object.entries(t).map(([o,r])=>`  ${E(o)}: ${E(r)},`).join(`
`)}
  },
}
data = {}
if os.path.isfile(path):
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f) or {}
    except Exception:
        data = {}
if not isinstance(data, dict):
    data = {}
servers = data.get("mcpServers") or {}
if not isinstance(servers, dict):
    servers = {}
servers["askjev"] = entry
data["mcpServers"] = servers
parent = os.path.dirname(path)
if parent:
    os.makedirs(parent, exist_ok=True)
with open(path, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)
    f.write("\\n")
print("Wrote askjev into:", path)
key = (entry["env"].get("ASKJEV_API_KEY") or "").strip()
if key:
    askjev_dir = os.path.join(os.path.expanduser("~"), ".askjev")
    os.makedirs(askjev_dir, mode=0o700, exist_ok=True)
    key_path = os.path.join(askjev_dir, "api-key")
    with open(key_path, "w", encoding="utf-8") as f:
        f.write(key + "\\n")
    try:
        os.chmod(key_path, 0o600)
    except Exception:
        pass
    print("Wrote API key to:", key_path)
print("Quit and reopen Claude. Then say: open example.com")
print("No URL to paste. Local ws://127.0.0.1:%s is automatic." % entry["env"].get("ASKJEV_PORT", "17373"))
`}function L(e){return btoa(unescape(encodeURIComponent(e)))}function b(e,t){let n=typeof e=="string"?{token:e,port:t??17373,platform:"mac"}:{platform:"mac",...e};return`#!/bin/bash
# AskJev \u2014 one-click Claude Desktop connect
# Writes Claude mcpServers.askjev (CDP Autopilot) + optional ~/.askjev/api-key.
# Claude starts the bridge for you (npx -y askjev-mcp). No URL to paste.
set -euo pipefail
CFG="$HOME/Library/Application Support/Claude/claude_desktop_config.json"
mkdir -p "$(dirname "$CFG")"
python3 - "$CFG" <<'PY'
${y(n)}PY
echo ""
echo "Done. Quit and reopen Claude. Then say: open example.com"
read -r -p "Press Enter to close\u2026" _
`}function k(e,t){let n=typeof e=="string"?{token:e,port:t??17373,platform:"linux"}:{platform:"linux",...e};return`#!/usr/bin/env bash
# AskJev \u2014 one-click Claude Desktop connect (Linux)
# Writes Claude mcpServers.askjev (CDP Autopilot) + optional ~/.askjev/api-key.
# Claude starts the bridge for you (npx -y askjev-mcp). No URL to paste.
set -euo pipefail
CFG="\${XDG_CONFIG_HOME:-$HOME/.config}/Claude/claude_desktop_config.json"
mkdir -p "$(dirname "$CFG")"
python3 - "$CFG" <<'PY'
${y(n)}PY
echo ""
echo "Done. Quit and reopen Claude. Then say: open example.com"
`}function v(e,t){let n=typeof e=="string"?{token:e,port:t??17373,platform:"win"}:{platform:"win",...e};return`@echo off
REM AskJev \u2014 one-click Claude Desktop connect
REM Writes Claude mcpServers.askjev (CDP Autopilot) + optional %%USERPROFILE%%\\.askjev\\api-key.
REM Claude starts the bridge for you (npx -y askjev-mcp). No URL to paste.
setlocal
set "CFG=%APPDATA%\\Claude\\claude_desktop_config.json"
if not exist "%APPDATA%\\Claude" mkdir "%APPDATA%\\Claude"
where python >nul 2>&1
if errorlevel 1 (
  echo Python is required to merge Claude config. Install Python 3, then re-run.
  echo Or use "More ways to connect" in AskJev Options.
  pause
  exit /b 1
)
python -c "import base64; open('_askjev_merge.py','w',encoding='utf-8').write(base64.b64decode('${L(y(n))}').decode('utf-8'))"
python _askjev_merge.py "%CFG%"
del /q _askjev_merge.py 2>nul
echo.
echo Done. Quit and reopen Claude. Then say: open example.com
pause
`}function h(){let e=typeof navigator<"u"&&navigator.platform||"";return/Win/i.test(e)?"win":/Linux/i.test(e)?"linux":"mac"}function c(e,t){let n=new Blob([t],{type:"application/octet-stream"}),o=URL.createObjectURL(n),r=document.createElement("a");r.href=o,r.download=e,r.rel="noopener",document.body.appendChild(r),r.click(),r.remove(),setTimeout(()=>URL.revokeObjectURL(o),2e3)}function u(e){let t=document.getElementById("bridgeTokenDisplay");t.textContent=e||"(none \u2014 generate one)"}function i(e){document.getElementById("status").textContent=e}function a(e,t=!1){let n=document.getElementById("autoStatusLine");n.textContent=e,document.getElementById("bridgeStatus").classList.toggle("armed",t)}async function w(){return Number(document.getElementById("bridgePort").value)||17373}async function S(){let e=await chrome.storage.sync.get(["bridgeToken","bridgePort"]),t=String(e.bridgeToken||"").trim();t||(t=g());let n=Number(document.getElementById("bridgePort").value)||Number(e.bridgePort)||17373;return document.getElementById("bridgeEnabled").checked=!0,document.getElementById("bridgePort").value=String(n),await chrome.storage.sync.set({bridgeToken:t,bridgeEnabled:!0,bridgePort:n}),u(t),{token:t,port:n}}async function d(){let{token:e,port:t}=await S(),n=document.getElementById("apiKey").value.trim(),o=await chrome.storage.sync.get(["apiKey"]),r=n||String(o.apiKey||"").trim()||void 0;return{token:e,port:t,apiKey:r}}async function l(){let e=document.getElementById("apiKey").value.trim();return e&&await chrome.storage.sync.set({apiKey:e}),e||void 0}function x(e){let t=h();return t==="win"?(c("AskJev-Connect-Claude.bat",v(e)),{filename:"AskJev-Connect-Claude.bat"}):t==="linux"?(c("AskJev-Connect-Claude.sh",k(e)),{filename:"AskJev-Connect-Claude.sh"}):(c("AskJev-Connect-Claude.command",b(e)),{filename:"AskJev-Connect-Claude.command"})}async function s(){let e=document.getElementById("bridgeStatus"),t=await chrome.storage.sync.get(["bridgeEnabled","bridgeToken"]),n=t.bridgeEnabled===!0&&!!String(t.bridgeToken||"").trim();try{let o=await chrome.runtime.sendMessage({type:"askjev.bridge.status"});if(o?.ok&&o.bridge){let r=o.bridge;e.textContent=`${r.state}: ${r.detail}`,r.state==="paired"?a("Paired \u2014 Claude/Cursor launched askjev-mcp; bridge is live.",!0):n?a("Bridge armed \u2014 double-click Connect script, then quit & reopen Claude",!0):a("Bridge off \u2014 click Auto-connect to arm.",!1);return}}catch{}e.textContent=n?"armed (status pending)":"bridge off",a(n?"Bridge armed \u2014 double-click Connect script, then quit & reopen Claude":"Bridge off \u2014 click Auto-connect to arm.",n)}async function f(e,t){try{await navigator.clipboard.writeText(e),i(t)}catch{i("copy failed \u2014 select text manually")}}async function M(){let e=await chrome.storage.sync.get(null);document.getElementById("apiKey").value=e.apiKey||"",document.getElementById("sensitivity").value=e.sensitivity||"balanced",document.getElementById("keywords").value=(e.customKeywords||[]).join(", "),document.getElementById("allowlist").value=(e.allowlist||[]).join(`
`),document.getElementById("enabled").checked=e.enabled!==!1,document.getElementById("confirmAsk").checked=e.requireConfirmOnAsk===!0,document.getElementById("gateForms").checked=e.gateFormSubmits===!0,document.getElementById("bridgeEnabled").checked=e.bridgeEnabled===!0,document.getElementById("bridgePort").value=String(e.bridgePort||17373),u(e.bridgeToken||""),await s()}document.getElementById("save").addEventListener("click",()=>{(async()=>{let e=document.getElementById("apiKey").value.trim(),t=document.getElementById("sensitivity").value,n=document.getElementById("keywords").value.split(",").map(m=>m.trim()).filter(Boolean),o=document.getElementById("allowlist").value.split(/\n+/).map(m=>m.trim().toLowerCase()).filter(Boolean),r=await w()||17373,T=await chrome.storage.sync.get(["bridgeToken"]);await chrome.storage.sync.set({apiKey:e,sensitivity:t,customKeywords:n,allowlist:o,enabled:document.getElementById("enabled").checked,requireConfirmOnAsk:document.getElementById("confirmAsk").checked,gateFormSubmits:document.getElementById("gateForms").checked,model:"jev-latest",bridgeEnabled:document.getElementById("bridgeEnabled").checked,bridgePort:r,bridgeToken:T.bridgeToken||""}),i("saved"),await s()})()});document.getElementById("autoConnect").addEventListener("click",()=>{(async()=>{await l();let e=await d(),{filename:t}=x(e),n=p(e);try{await navigator.clipboard.writeText(n)}catch{}let o="Downloaded Connect script \u2014 double-click it once, then quit & reopen Claude. Then chat normally.";e.apiKey||(o="Save TypeSafe API key above first \u2014 multi-step Autopilot needs it. "+o),i(o),a(`Downloaded ${t} \u2014 double-click once, then quit & reopen Claude`,!0),await s()})()});document.getElementById("copyClaudeConfig").addEventListener("click",()=>{(async()=>{await l();let e=await d();await f(p(e),"Claude Desktop config copied \u2014 paste into claude_desktop_config.json (Advanced)"),a("Bridge armed \u2014 prefer Auto-connect script over paste-JSON",!0),await s()})()});document.getElementById("copyCursorConfig").addEventListener("click",()=>{(async()=>{await l();let e=await d();await f(p(e),"Cursor MCP config copied \u2014 paste into .cursor/mcp.json or Settings \u2192 MCP"),a("Bridge armed \u2014 prefer Auto-connect script over paste-JSON",!0),await s()})()});document.getElementById("dlMac").addEventListener("click",()=>{(async()=>{await l();let e=await d();c("AskJev-Connect-Claude.command",b(e)),i("Downloaded macOS helper \u2014 run once, then restart Claude"),a("Bridge armed \u2014 double-click Connect script, then quit & reopen Claude",!0),await s()})()});document.getElementById("dlWin").addEventListener("click",()=>{(async()=>{await l();let e=await d();c("AskJev-Connect-Claude.bat",v(e)),i("Downloaded Windows helper \u2014 run once, then restart Claude"),a("Bridge armed \u2014 double-click Connect script, then quit & reopen Claude",!0),await s()})()});document.getElementById("dlLinux").addEventListener("click",()=>{(async()=>{await l();let e=await d();c("AskJev-Connect-Claude.sh",k(e)),i("Downloaded Linux helper \u2014 run once, then restart Claude"),a("Bridge armed \u2014 double-click Connect script, then quit & reopen Claude",!0),await s()})()});document.getElementById("genToken").addEventListener("click",()=>{(async()=>{let e=g();await chrome.storage.sync.set({bridgeToken:e}),u(e),i("token generated"),await s()})()});document.getElementById("copyToken").addEventListener("click",()=>{(async()=>{let e=await chrome.storage.sync.get(["bridgeToken"]),t=String(e.bridgeToken||"");if(!t){i("no token to copy");return}await f(t,"token copied")})()});document.getElementById("revokeToken").addEventListener("click",()=>{(async()=>(await chrome.storage.sync.set({bridgeToken:"",bridgeEnabled:!1}),document.getElementById("bridgeEnabled").checked=!1,u(""),i("token revoked"),a("Bridge off \u2014 click Auto-connect to arm.",!1),await s()))()});document.getElementById("savePasteToken").addEventListener("click",()=>{(async()=>{let e=document.getElementById("pasteToken").value.trim();if(!e){i("no token to save");return}document.getElementById("bridgeEnabled").checked=!0;let t=await w();await chrome.storage.sync.set({bridgeToken:e,bridgeEnabled:!0,bridgePort:t||17373}),u(e),document.getElementById("pasteToken").value="",i("token saved"),a("Bridge armed \u2014 double-click Connect script, then quit & reopen Claude",!0),await s()})()});setInterval(()=>{s()},3e3);M();
