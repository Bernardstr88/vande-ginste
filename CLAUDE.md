# CLAUDE.md — Vande Ginste landing page

Statische landing page voor **Leander Vande Ginste** — sanitair, warmtepompen, vloerverwarming, zonneboilers in Diksmuide (West-Vlaanderen).

## Productie

- **Live**: https://vande-ginste.vercel.app
- **Repo**: https://github.com/Bernardstr88/vande-ginste
- **Hosting**: Vercel, auto-deploy op push naar `main`
- **Eigen domein**: `vande-ginste.be` — DNS nog niet gekoppeld

## Structuur

Één HTML-bestand, geen framework:

- `index.html` — alles (inline CSS + JS, ~550 regels)
- `Leander/Hero Video.html` — Remotion/React video (iframe), 1920×1080 16:9
- `Leander/assets/` — galerij JPG + WebP varianten (plantroom, whirlpool, rainshower)
- `vercel.json` — cache headers (1 jaar immutable) + security headers
- `sitemap.xml`, `robots.txt` — SEO
- `favicon*`, `apple-touch-icon.png`, `og-image.{jpg,webp}` — iconen en social share

## Design tokens

- Palet: `--bg #efeae0` (paper), `--paper #e4ddcf`, `--ink #1a1814`, `--muted #55504a`, `--accent #8a6a4a`, `--accent-soft #d4a574`
- Fonts: Instrument Serif (display), Inter (ui), JetBrains Mono (labels)

## Mobile responsive breakpoints

- 900px — grids van 3/4 kolommen naar 2
- 700px — hero krijgt `aspect-ratio:16/9` (video vult zonder letterbox)
- 640px — ghost-nav-buttons verborgen, hamburger zichtbaar
- 560px — grids naar 1 kolom
- 400px — primary button compact
- 380px — telefoonnummer wordt "Bel"
- 360px, 300px — brand font shrinkt

## Bekende gotcha's

- **`.cta-inner` horizontale padding**: sectie gebruikt `.wrap .cta-inner`. `.cta-inner` zet `padding:84px 28px` — niet weglaten, anders kleeft contact-blok tegen schermrand op mobiel.
- **Hero iframe is Remotion video**: Playback-controls zijn verborgen via CSS én via `{false && (...)}` wrap in JSX. Niet terugdraaien.
- **WebP bestanden mogen niet groter zijn dan JPG**: whirlpool op quality 72, plantroom op 75.
- **Hamburger menu** werkt met `body.menu-open` class + focus trap.

## Zakelijke info

- Leander Vande Ginste — IJzerlaan 62, 8600 Diksmuide
- BTW BE 0627.762.620
- Tel: +32 468 20 25 74
- Mail: leander@vande-ginste.be
- Facebook: https://www.facebook.com/sanitairvandeginste
- Instagram: https://www.instagram.com/vande.ginste.bv/

## Nog open (optioneel, niet dringend)

- Custom domein `vande-ginste.be` koppelen in Vercel + DNS
- Google Search Console verifiëren, sitemap indienen
- Google Business Profile aanmaken
- Lokale landingspagina's (bv. `/warmtepomp-diksmuide`) indien SEO-push gewenst
