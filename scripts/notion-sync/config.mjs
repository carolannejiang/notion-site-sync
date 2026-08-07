// Site-specific settings for the Notion → website sync.
//
// This is the ONLY file you edit to point the sync at your site. Change the
// values below to match your site's name, URLs, fonts, stylesheet, and nav —
// the generic logic in sync.mjs stays untouched.
//
// The HTML fields (headHtml, footerNav) are inserted verbatim — mind the
// leading indentation so the generated pages stay tidy.

export const config = {
  // Your site's public name and origin (no trailing slash). Used in the
  // <meta> / Open Graph tags and canonical URLs on each essay.
  siteName: "My Site",
  baseUrl: "https://your-username.github.io",

  // The existing index page the essay list is injected into (relative to the
  // repo root), and the exact snippet in it the generated block is placed
  // after. The anchor is only used the first time — once the NOTION:START /
  // NOTION:END markers exist, the block is updated in place.
  indexFile: "writing.html",
  indexAnchor: '<div class="writing-title">Writing</div>',

  // Everything that goes in each essay's <head> after the Open Graph tags:
  // your fonts and the article stylesheet. Restyle generated pages by editing
  // the CSS this links to; swap the font, add favicons, etc.
  headHtml: `  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/article.css">`,

  // The nav rendered at the bottom of every essay. Point it at your own pages.
  footerNav: `  <nav class="footer-nav" aria-label="Site links"><a href="index.html">← back to home</a></nav>`,

  // Cusdis comments (https://cusdis.com). Set appId to your Cusdis "App ID" to
  // show a comment box under every essay; leave it "" to render no comments.
  // Self-hosting Cusdis? Point host at your instance.
  cusdis: {
    appId: "",
    host: "https://cusdis.com",
  },
};
