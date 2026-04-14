## Learned User Preferences

- Prefer `chmod 600` on Cloudflare credential files kept in the home directory.
- When using Wrangler with the global API key, avoid exporting `CLOUDFLARE_API_TOKEN` so a token does not override key-based auth.
- In Cursor, use `editor.accessibilitySupport`: `auto` rather than `on` so the Vim extension reliably receives Escape to leave insert mode, unless a screen reader requires full accessibility mode.
- If Escape does not leave Vim insert mode in standalone Terminal or iTerm as well as Cursor, treat it as a system- or terminal-level keyboard input issue, not only an editor setting.
- After switching Wrangler to global API key auth, removed the prior `~/.zshrc` block that auto-exported `CLOUDFLARE_API_TOKEN` from a file.

## Learned Workspace Facts

- This repo (`my-website`, path `~/Documents/my-website`) is the jakobtfaber.com personal site: static `index.html`, `styles.css`, and `app.js` at the root with `wrangler.toml` configured for Cloudflare Pages.
- Deploy from the repo root with `npx wrangler pages deploy . --project-name=jakobtfaber-com`; the project name must match the Cloudflare dashboard.
- A Cloudflare API token can satisfy `wrangler whoami` yet fail `wrangler pages deploy` with permission errors; global API key plus account email can work when token scopes are insufficient.
- Cloudflare API token files used with Wrangler should be a single line; stripping newlines from a multi-line file concatenates segments into an invalid token.
- Cloudflare Origin CA keys are for TLS certificates on an origin server, not for Wrangler or the Cloudflare HTTP API.
- For Figma automation from Cursor, load the `figma-use` skill before any `use_figma` calls; the Figma MCP plan may rate-limit repeated plugin executions.
- The site is oriented around an academic profile; keep on-page education, positions, and honors consistent with the checked-in `cv.pdf`, and link out to canonical scholarly profiles (for example ADS or Google Scholar) instead of placeholder copy.
- Source for this site is tracked with a private GitHub repository as `origin` in addition to Cloudflare Pages deploys.
