# Ghostbreachh

Official site for **Ghostbreachh** — a Pakistani offensive-security collective.
Live at **https://ghostbreachh.github.io/** (GitHub Pages).

## Stack
- Pure **HTML + CSS + vanilla JS**. No build step, no frameworks.
- Deploy = push to `main`. GitHub Pages serves it automatically.

## Structure
```
index.html      # all page content (semantic sections, nav, form)
style.css       # one :root (brand vars), components, mobile @media
script.js       # nav, scroll-reveal, counters, tilt, navbar, mailto form
assets/
  banner.webp   # social/OG preview image (1200x675)
  favicon.ico   # multi-size favicon derived from the logo
robots.txt      # tells crawlers what's allowed
sitemap.xml     # helps search engines index the site
```

## Brand
- Primary: **purple** `#9d00ff`. Accent: **cyan** `#00f0ff`. All colors live in
  the `:root` block at the top of `style.css` — change them there only.
- Tagline: **LEARN • SECURE • DEFEND**.

## How to contribute
1. `git clone https://github.com/ghostbreachh/ghostbreachh.github.io`
2. Edit the files (keep line endings LF, not CRLF).
3. Preview locally: `python3 -m http.server 8000` → open `http://127.0.0.1:8000`.
4. `git add -A && git commit -m "what you changed" && git push`.

## Notes for devs
- The reveal-on-scroll animation is gated behind a `.js` class on `<html>` so the
  page is still fully readable if JS fails to load.
- The contact form opens the visitor's mail client (`mailto:`) — no backend needed.
- Particles were intentionally removed for performance; the grid + grain + glow
  carry the aesthetic at ~0 CPU cost.
