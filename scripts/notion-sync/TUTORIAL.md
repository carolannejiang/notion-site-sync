# Publish a Notion database to your website — a tutorial

This walks you through wiring up the same Notion → website sync used on
carolannejiang.com, on **your own** static site. When you're done, anything you
write in Notion appears on your site — styled to match — within the hour, with
no HTML to touch.

It takes about **20 minutes**. You don't need to be a programmer, but you do
need a website that lives in a **GitHub repository** (GitHub Pages is the
easiest; Netlify/Vercel that deploy from a repo work too).

---

## How it works (the 30-second version)

A **GitHub Action** — a small robot that runs on GitHub's servers, not your
computer — wakes up every hour. It reads your Notion writing, converts each
piece to a styled HTML page, writes those pages into your repo, and updates your
writing index. GitHub then publishes them. Your laptop can be closed the whole
time.

You keep **one Notion source** — either a **database (Table view)** where each
row is a piece, or a **plain page** whose sub-pages are the pieces. The sync
figures out which you have.

```
Notion (you write here)  ──hourly──▶  GitHub Action  ──▶  <slug>.html on your site
```

Only files the sync generated are ever overwritten or deleted — your
hand-written pages (`index.html`, `about.html`, …) are never touched.

---

## What you'll need

- A website in a **GitHub repo** you can push to.
- A **Notion** account (free is fine).
- 20 minutes.

---

## Step 1 — Copy the sync into your repo

From this project, copy two things into your own repository, keeping the paths:

- The folder **`scripts/notion-sync/`** (contains `sync.mjs`, `config.mjs`,
  `package.json`, `package-lock.json`, `overrides.json`).
- The workflow **`.github/workflows/notion-sync.yml`**.

That's the entire engine. You'll only edit `config.mjs` (Step 4).

## Step 2 — Add the article stylesheet

The generated pages are plain HTML that relies on a stylesheet for its looks
(class names like `.page-body`, `.table_of_contents`, `.bulleted-list`,
`.footer-nav`). Copy this project's **`css/article.css`** into your repo at the
same path, then restyle it however you like later. (If you put it elsewhere,
update the `<link>` in `config.mjs` — see Step 4.)

## Step 3 — Prepare your writing index page

This is the page that lists all your pieces (here it's `writing.html`). The sync
injects the list into it. Two ways:

- **Already have one?** Make sure it contains a snippet the sync can anchor to.
  By default that's `<div class="writing-title">Writing</div>`. Put that (or set
  `indexAnchor` to whatever your page already has) where the list should appear.
- **Don't have one?** Create a simple `writing.html` containing that anchor. On
  the first run the sync inserts a managed block right after it; after that it
  keeps the block up to date between `<!-- NOTION:START -->` / `<!-- NOTION:END -->`
  markers. Don't hand-edit between those markers.

## Step 4 — Configure `config.mjs`

`scripts/notion-sync/config.mjs` is the **only file you edit**. Open it and set:

| Field | What to put |
| --- | --- |
| `siteName` | Your site's name (used in `og:site_name`). |
| `baseUrl` | Your site's address, no trailing slash, e.g. `https://you.github.io`. |
| `indexFile` | The index page from Step 3 (default `writing.html`). |
| `indexAnchor` | The exact snippet the list is inserted after (Step 3). |
| `headHtml` | The `<head>` block on every piece: your favicon, fonts, and the `<link>` to your `article.css`. Replace the example fonts with your own. |
| `footerNav` | The nav shown at the bottom of every piece — point the links at your own pages. |
| `cusdis.appId` | Leave `""` for no comments, or your Cusdis App ID (see Step 10). |

Mind the indentation inside `headHtml` and `footerNav` — that text is dropped
into the page as-is.

## Step 5 — Create your Notion source

Pick one:

**Option A — a database (Table view).** Create a database, switch to Table view.
Each **row is one piece**: open a row and write the essay in the page body. No
extra columns are required. Optional columns the sync understands:

- **`Order`** (a *Number* column) — type `1`, `2`, `3`… to control the order on
  your site. This is required for ordering a table, because Notion's API can't
  read a table's manual drag-order. Rows with no number sink to the bottom.
- **`Published`** (a *Checkbox*) — if present, unchecked rows are skipped.
- **`Slug`** (*Text*) — a custom URL slug; otherwise the slug comes from the title.
- **`Preview`** (*Text*) — the one-line summary on your index; otherwise the
  first paragraph is used.

**Option B — a plain page with sub-pages.** Create a page called e.g.
**Writing**, and add a **sub-page** for each piece. Here the order on your site
is simply the order you drag the sub-pages into.

Either way: the **title** becomes the piece's title and URL, the **page body**
is the content, the **created date** is the date shown, and any piece titled
**`Draft: …`** is skipped.

## Step 6 — Create a Notion integration and connect it

1. Go to <https://www.notion.so/my-integrations> → **New integration**.
2. Name it (e.g. "Website sync"), choose your workspace, type **Internal**, save.
3. Copy the **Internal Integration Secret** (starts with `ntn_`). This is your
   `NOTION_TOKEN` — keep it private.
4. Open your source (the database or the **Writing** page) in Notion → **•••**
   (top-right) → **Connections** → **Connect to** → your integration. Sub-pages
   and rows inherit access, so you only connect the top-level source.

## Step 7 — Get the source ID

Open your source and copy its link (**•••** → **Copy link**, or the browser URL).
The 32-character chunk near the end (before any `?`) is the ID:

```
https://www.notion.so/Writing-206e858d1bc780a9b7f4f2c5721135ce
                               └──────────────────────────────┘
                                          the ID
```

Dashes in the ID are fine either way.

## Step 8 — Add the GitHub secrets

In your repo: **Settings → Secrets and variables → Actions → New repository
secret**. Add two:

- **`NOTION_TOKEN`** → the `ntn_…` secret from Step 6.
- **`NOTION_PARENT_PAGE_ID`** → the 32-character ID from Step 7.
  (A database ID works here too — the name is historical.)

## Step 9 — Let the Action commit to your repo

**Settings → Actions → General → Workflow permissions** → choose **Read and
write permissions** → Save. Without this, the run can generate pages but can't
push them back.

## Step 10 — Run it and check

- Repo **Actions** tab → **Sync writings from Notion** → **Run workflow**.
- Wait ~1 minute. When it's green, open your index page and your new `<slug>.html`
  pages on the live site.

If nothing appears, see **Troubleshooting** below.

---

## Writing, day to day

- **Publish:** add a row/sub-page in Notion and write. It's live within the hour
  (or instantly via **Run workflow**).
- **Edit:** just edit in Notion; the next run overwrites that page.
- **Reorder (database):** change the numbers in the `Order` column.
- **Reorder (page mode):** drag the sub-pages.
- **Unpublish:** delete the row/sub-page, move it out of the source, uncheck
  `Published`, or rename it to start with `Draft:`. The next run removes its
  page (and only its page).
- **Images:** paste them into Notion normally. The sync downloads each one into
  `images/notion/<slug>/`, optimizes it, and points the page at that local copy —
  so images stay put even though Notion's own image links expire after ~1 hour.
- **Renaming changes the URL** (the slug comes from the title), which breaks old
  links. Rename before sharing, not after — or set a fixed `Slug` column.

## Optional: comments

The pages can render a lightweight comment box using
[Cusdis](https://cusdis.com) (free, hosted or self-hosted). Create a Cusdis
site, copy its **App ID** into `config.mjs` (`cusdis.appId`), and comments appear
under every piece. New comments stay hidden until you approve them in the Cusdis
dashboard. Leave `appId` as `""` and no comment box is rendered.

## Optional: run it on your own machine

Handy for testing before you trust the hourly run:

```bash
cd scripts/notion-sync
npm install
NOTION_TOKEN=ntn_xxx NOTION_PARENT_PAGE_ID=xxxx node sync.mjs
```

It writes the same files locally; commit them yourself, or just eyeball the
output.

---

## Troubleshooting

| Symptom | Likely cause / fix |
| --- | --- |
| Action fails: *"Missing env vars"* | The `NOTION_TOKEN` / `NOTION_PARENT_PAGE_ID` secrets aren't set, or are misnamed. Re-check Step 8. |
| Action fails: *permission / 403 on push* | Workflow permissions aren't "Read and write" (Step 9). |
| Runs green but the site is empty | The integration isn't connected to your source (Step 6, part 4), or every row is a `Draft:` / unchecked `Published`. |
| *"Could not find the anchor … in writing.html"* | Your index page is missing the `indexAnchor` snippet (Step 3), or `indexAnchor` doesn't match what's in the page. |
| Order on a database won't change | Add/adjust a **Number** column named `Order` — dragging table rows has no effect the API can see (Step 5). |
| A piece won't overwrite an existing page | A hand-written file with the same name exists. The sync refuses to clobber files it didn't generate; rename the piece or the file. |
| Images 404 after an hour | The run failed before localizing them — check the Action log; it retries and aborts rather than publish an expiring link. |

## Good to know

- **Safety:** the sync only ever overwrites or deletes files carrying its own
  generated marker. Your existing pages are safe.
- **Speed:** hourly by default. Change the `cron` in `notion-sync.yml` to run
  more or less often, or use **Run workflow** for instant updates.
- **Cost:** GitHub Actions minutes for public repos are free; this run takes ~1
  minute.
- **Where content vs. looks live:** *content* comes from Notion; *appearance*
  comes from `config.mjs` plus your `article.css`. Nothing else needs editing.
