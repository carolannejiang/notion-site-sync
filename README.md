# notion-site-sync

Write in **Notion**, publish to your **static website** — automatically.

A small GitHub Action reads your Notion writing once an hour, converts each
piece to a styled HTML page, commits it to your repo, and updates your writing
index. Your laptop can be closed the whole time. You never touch HTML.

- **Source:** one Notion **database (Table view)** or **plain page with
  sub-pages** — auto-detected.
- **Output:** one `<slug>.html` per piece at your repo root, plus a maintained
  list in `writing.html`.
- **Safe:** only files it generated are ever overwritten or deleted — your
  hand-written pages are left alone.
- **Batteries included:** images are downloaded and optimized (Notion's own
  image links expire), a table of contents is built from your headings, bare
  links get their real titles, and optional [Cusdis](https://cusdis.com)
  comments render natively.

This repo is a **ready-to-use template**: a minimal demo site (`index.html`,
`writing.html`, `css/article.css`) with the sync already wired in.

## Quick start

1. Click **Use this template** → create your own repo (or fork it).
2. Turn on GitHub Pages: **Settings → Pages** → deploy from your branch.
3. Follow **[scripts/notion-sync/TUTORIAL.md](scripts/notion-sync/TUTORIAL.md)** —
   a ~20-minute, non-technical walkthrough. In short:
   - Edit **`scripts/notion-sync/config.mjs`** with your site's name, URL, fonts,
     and nav.
   - Create a Notion integration, connect it to your writing source.
   - Add the `NOTION_TOKEN` and `NOTION_PARENT_PAGE_ID` repo secrets.
   - Give the Action write permission and run it.

That's it — new writing shows up on your site within the hour.

## What's in here

```
index.html                     demo homepage (replace with your own)
writing.html                   demo index; the piece list is injected here
css/article.css                the theme for generated pages (restyle freely)
.github/workflows/
  notion-sync.yml              the hourly GitHub Action
scripts/notion-sync/
  sync.mjs                     the sync engine (generic — you don't edit this)
  config.mjs                   ← the only file you edit
  overrides.json               optional durable text tweaks (starts empty)
  package.json / -lock.json    dependencies
  TUTORIAL.md                  full step-by-step setup guide
```

## Configuring

Everything site-specific lives in `scripts/notion-sync/config.mjs`:

| Field | What it is |
| --- | --- |
| `siteName` | Your site's name (Open Graph `og:site_name`). |
| `baseUrl` | Your site's origin, no trailing slash. |
| `indexFile` | The page the piece list is written into (default `writing.html`). |
| `indexAnchor` | The exact snippet in that page the list is placed after. |
| `headHtml` | The `<head>` block per piece: fonts + the stylesheet `<link>`. |
| `footerNav` | The nav rendered at the bottom of every piece. |
| `cusdis.appId` | Cusdis App ID for comments — leave `""` for none. |

## Run it locally (optional)

```bash
cd scripts/notion-sync
npm install
NOTION_TOKEN=ntn_xxx NOTION_PARENT_PAGE_ID=xxxx node sync.mjs
```

## Credit

Extracted from the publishing pipeline behind
[carolannejiang.com](https://www.carolannejiang.com).

## License

MIT — see [LICENSE](LICENSE).
