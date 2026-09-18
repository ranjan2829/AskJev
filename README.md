# AskJev

**Talk to Claude in plain English. AskJev drives Brave/Chrome. TypeSafe Jev decides on-page. Guard freezes irreversible clicks.**

No shell. No CDP flags. No paste-JSON rituals. Install the extension, Auto-connect once, reopen Claude, and chat.

Built with [TypeSafe System One](https://typesafe.ai) — page decisions use Jev (Noul / Choice / Score), **not** Claude as the planner.

---

## Setup

1. **Download `askjev-1.7.3.mcpb`** from [Releases](https://github.com/ranjan2829/AskJev/releases) and **double-click it**. Claude Desktop opens its install dialog.
2. **Paste your TypeSafe API key** in that dialog → **Install**.
3. **Chat:** `open example.com and click More information`

No terminal. No scripts. No ports to paste. Claude stores the key encrypted and
starts AskJev for you; AskJev opens Brave (or Chrome) itself when it is needed.

Get a key: [typesafe.ai](https://typesafe.ai)

### Optional — Guard on your own browsing

The steps above are all Claude needs. The browser extension is a separate,
optional add-on that applies the same irreversible-click Guard to pages **you**
click yourself: Brave or Chrome → Extensions → **Load unpacked** → `extension/`,
then Options → paste the same key. Claude does not need it.

AskJev opens Brave, falling back to Chrome, Chromium, then Edge — Brave first on
macOS, Windows and Linux alike. Your API key goes only to `api.typesafe.ai`.

**Without a key**, multi-step goals fail loudly with `missing_api_key` rather
than silently navigating and scrolling. Single actions (`askjev_navigate`,
`askjev_click`, `askjev_read_page`, …) still work without one.

Get a key: [typesafe.ai](https://typesafe.ai) · Docs: [docs.typesafe.ai](https://docs.typesafe.ai/introduction)

---

## Demo (video / wow moment)

After setup, paste this into Claude:

```
Open https://news.ycombinator.com, open the top story, then go to https://www.wikipedia.org,
search for "TypeSafe AI", open the first relevant result, scroll down twice, then open
https://example.com and click More information. When you're done, tell me the page title
on example.com and a one-line summary of what you saw on HN and Wikipedia. If anything
looks irreversible (pay, delete, send, publish), stop and ask me first.
```

Same text lives in [docs/DEMO-PROMPT.md](docs/DEMO-PROMPT.md).

Warm-up: `open example.com and click More information`

---

## How it works

| Piece | Role |
|-------|------|
| **You ↔ Claude** | Natural language. Claude is the MCP *client* — it calls AskJev tools, it does **not** plan each click. |
| **askjev-mcp** | MCP stdio server. Auto-launches Brave/Chrome over CDP and runs the Autopilot loop. |
| **Brave / Chrome** | The browser you see. AskJev drives it. |
| **TypeSafe Jev (System One)** | On-page decisions: next action, target, irreversible score, goal-done. |
| **AskJev Guard** | Freezes pay / delete / send / publish / deploy-class steps at `irreversible ≥ 0.65`. MCP Autopilot stops the run and tells you to narrow the goal; in-page clicks in your own browser get a proceed/block/ask overlay. |

```
You → Claude (MCP client) → askjev-mcp (CDP) → Brave/Chrome
                                    ↓
                         TypeSafe Jev System One
```

---

## What you get

| Mode | What happens |
|------|----------------|
| **Autopilot** | Multi-step goals via Claude chat or the extension side panel. Snapshot → Jev next step → act → repeat. |
| **Guard** | In **your** browser: risky clicks held on every page (`<all_urls>`, top frame — not iframes). Overlay: proceed / block / ask. In the window askjev-mcp drives: the Autopilot loop stops at `irreversible ≥ 0.65` (that window runs a clean profile without the extension, so the overlay is not there). |
| **Connect** | The Connect script from Auto-connect writes Claude’s `mcpServers.askjev` (`ASKJEV_MODE=cdp`, Brave bin, token/port, key) and — only when a key was saved — `~/.askjev/api-key`. No daily terminal. |

---

## Advanced

Prefer the `.mcpb`. These are fallbacks only:

- **Cursor, or Claude Desktop by hand** — Options → copy the MCP JSON, or
  download a Connect script. On macOS a downloaded `.command` is quarantined by
  Gatekeeper **and** arrives without an execute bit, so double-clicking it fails;
  run it as `bash ~/Downloads/AskJev-Connect-Claude.command` instead. The `.mcpb`
  exists to avoid exactly this.
- **Extension-only (no Claude)** — Options → paste key → use the side panel.
- **Legacy WebSocket bridge** — [docs/AGENT-BRIDGE.md](docs/AGENT-BRIDGE.md).
  Only opens with `ASKJEV_MODE=bridge`; the default `cdp` path never binds a port.
- **Dev build:** `npm install && npm run build` · `npm test` · `npm run pack:chrome` · `npm run pack:mcpb`

The JSON and scripts write `npx -y askjev-mcp` (public npm). Note that Claude
Desktop starts one MCP process per session pool (Chat, Cowork, Code), and
concurrent `npx` invocations can collide on the shared npx cache
(`ENOTEMPTY` on `~/.npm/_npx/<hash>`); the `.mcpb` ships its own `node_modules`
and does not use `npx` at runtime. A Release tarball URL exists in
`src/connect-helpers.ts` (`ASKJEV_MCP_TGZ`) as a no-registry fallback, but no
Options button selects it today — swap the `args` by hand if you need it.

---

## Privacy

- TypeSafe API key: Chrome `storage.sync`, Claude MCP env, and optionally `~/.askjev/api-key` (mode `600`) — never logged, never sent over the agent bridge.
- Pairing token: legacy WebSocket bridge only, localhost (`ws://127.0.0.1`). The default CDP path never opens that socket.
- Network: `https://api.typesafe.ai/v1/systemone` — called by the extension (Guard, side-panel Autopilot) and by `askjev-mcp` (CDP Autopilot) — plus pages you browse.
- No AskJev servers. No analytics backend.

---

## Version

**1.7.3** — Never open the user's real browser profile (Playwright persistent-context cookie wipe); refuse ASKJEV_PROFILE_DIR when it resolves to a real profile; Guard treats sign-out as irreversible. Ships #42 on top of 1.7.2.

MIT · [ranjan2829/AskJev](https://github.com/ranjan2829/AskJev)
