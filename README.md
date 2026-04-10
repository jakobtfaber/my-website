# my-website

Personal site for [jakobtfaber.com](https://jakobtfaber.com): static HTML/CSS/JS hosted on **Cloudflare Pages**.

## Contents

| File           | Role                                      |
| -------------- | ----------------------------------------- |
| `index.html`   | Page structure and copy                     |
| `styles.css`   | Layout, typography, light/dark theme      |
| `app.js`       | Theme toggle and footer year              |
| `wrangler.toml`| Cloudflare Pages / Wrangler metadata      |

## Deploy (CLI)

From this directory, with Cloudflare credentials in the environment (`CLOUDFLARE_EMAIL` + `CLOUDFLARE_API_KEY` for global key auth):

```bash
npx wrangler pages deploy . --project-name=jakobtfaber-com
```

The `--project-name` value must match the **Pages project** name in the [Cloudflare dashboard](https://dash.cloudflare.com).

## Deploy (Git)

The repo can be connected to the same Cloudflare Pages project for automatic builds on push to `main`; custom domains stay tied to that project, not to whether you use CLI or Git.

## Local preview

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## License

Private personal site; all rights reserved unless noted otherwise.
