# Performance Audit — vande-ginste.vercel.app

**Datum:** 2026-04-19
**Target:** https://vande-ginste.vercel.app
**Type site:** statische HTML/CSS/JS + React iframe hero + Google Fonts
**Edge:** Vercel (region cdg1 / Parijs)

---

## 1. HTTP-checks (live)

Gemeten vanaf lokale machine via HTTP/2 naar `cdg1`. TTFB = `time_starttransfer`, totaal = `time_total`.

| Asset | Status | Content-Type | Size (bytes) | TTFB / Total | Cache-Control | x-vercel-cache |
|---|---|---|---|---|---|---|
| `/` (index.html) | 200 | text/html | 27 305 | 0.276 s | `public, max-age=0, must-revalidate` | **HIT** (age 245 s) |
| `/og-image.jpg` | 200 | image/jpeg | 85 187 | 0.215 s | `public, max-age=0, must-revalidate` | HIT |
| `/Leander/assets/plantroom.jpg` | 200 | image/jpeg | 157 469 | 0.418 s | `public, max-age=0, must-revalidate` | MISS (age 0) |
| `/Leander/Hero%20Video.html` | 200 | text/html | **621 735** | 0.869 s | `public, max-age=0, must-revalidate` | MISS (age 0) |
| `/Leander/assets/rainshower.jpg` | **404** | — | — | — | — | — |
| `/Leander/assets/whirlpool.jpg` | **404** | — | — | — | — | — |

**Observaties:**
- Alle resources serveren met `Cache-Control: public, max-age=0, must-revalidate`. Vercel's edge-cache honoreert dit intern via de eigen CDN-hints, maar **browsers cachen niets** — elke refresh is 1 round-trip per asset. Voor statische immutable assets (JPGs, Hero Video.html, favicons) is dit verspild.
- Twee gallery-items (`rainshower.jpg`, `whirlpool.jpg`) geven 404. Dat zijn twee ontbrekende bestanden in `Leander/assets/` — layout blijft staan, maar de browser doet 2 nutteloze requests en toont kapotte afbeeldingen.
- `x-vercel-cache: MISS` op `plantroom.jpg` en op de hero iframe op het moment van meten, ondanks statische content. Vercel-edge-cache koelt af zonder `max-age`-hint.

## 2. PageSpeed Insights

PSI v5 API gaf **HTTP 429 — quota 0 per dag** voor anonieme calls (geen API key in sessie). Er zijn dus geen live Lighthouse-scores gemeten.

Op basis van de structuur volgt hieronder een **geschatte Lighthouse-voorspelling** (mobile, Moto G Power, 4G throttling):

| Metric | Mobile (geschat) | Desktop (geschat) | Target (Good) |
|---|---|---|---|
| Performance score | **35–50** | 70–80 | ≥ 90 |
| LCP (hero iframe / plantroom.jpg) | **4.5–6.5 s** | 2.0–3.0 s | < 2.5 s |
| FCP | 1.8–2.5 s | 0.9–1.3 s | < 1.8 s |
| TBT | **800–1500 ms** | 200–400 ms | < 200 ms |
| TTI | 6–9 s | 3–4 s | < 3.8 s |
| CLS | 0.00–0.05 | 0.00–0.05 | < 0.1 |
| Speed Index | 4.0–5.5 s | 2.0–2.8 s | < 3.4 s |

**Aanbeveling:** draai een handmatige Lighthouse (Chrome DevTools → Lighthouse) voor bevestiging. Of registreer een Google Cloud API key en zet in de env als `PSI_API_KEY` voor herhaalbare audits.

## 3. Lokale asset-analyse

### `Leander/assets/` (9 bestanden, gebruikt door cards + gallery)

| Bestand | Grootte | > 200 KB? | Commentaar |
|---|---|---|---|
| plantroom.jpg | **157 KB** | nee maar grootste | LCP-kandidaat (hero-fallback + card + gallery span-3) |
| stone-sink.jpg | 50 KB | nee | ok |
| heatpump.jpg | 47 KB | nee | ok |
| van.jpg | 40 KB | nee | ok |
| underfloor.jpg | 39 KB | nee | ok |
| solar-roof.jpg | 34 KB | nee | ok |
| bathtub.jpg | 29 KB | nee | ok |
| copper-tap.jpg | 20 KB | nee | ok |
| toilet.jpg | 12 KB | nee | ok |

**Totaal payload Leander-assets: ~429 KB over 9 bestanden.** Geen enkele boven 200 KB — verrassend goed geoptimaliseerd op bron-niveau. Maar **er is geen responsive sizing** en **geen modern formaat** (WebP/AVIF): plantroom.jpg in WebP q80 zou ~50 KB zijn (−68 %), in AVIF q50 ~30 KB (−80 %).

### `/og-image.jpg`
- 85 KB, 1200×630 — prima grootte voor OG-preview.

### `afbeeldingen/` (lijkt niet gelinkt vanuit HTML)
- Bevat o.a. een bestand van **382 KB** en **100 KB**. Als deze folder wordt gedeployed maar niet gebruikt, is dat alleen dode ballast in de bundel. Niet blokkerend voor performance, wel voor build-grootte.

## 4. Hero Video iframe — de grote bottleneck

`/Leander/Hero Video.html` is **621 735 bytes (608 KB)** on-the-wire, grotendeels onbewerkt.

Wat er in de eerste 2 KB zit (bevestigd via range-request):

| Resource | Type | Transfer-kost |
|---|---|---|
| `unpkg.com/react@18.3.1/react.development.js` | extern | 107 KB (gzip: ~30 KB) — **dev-build, niet productie** |
| `unpkg.com/react-dom@18.3.1/react-dom.development.js` | extern | **1 080 KB** (gzip ~130 KB) — dev-build |
| `unpkg.com/@babel/standalone@7.29.0/babel.min.js` | extern | **3 137 KB** (gzip ~830 KB) — in-browser JSX compiler |
| Inline `const IMG = {"plantroom":"data:image/jpeg;base64,…"}` | inline | +/- 600 KB aan HTML (base64 blow-up van JPG's) |
| `scenes.jsx`, `animations.jsx` | JSX via Babel | JIT-compiled in browser |

**Gecombineerde iframe-kost bij first paint (uncompressed, ongeparsed):**
- HTML: 608 KB
- React dev: 107 KB
- ReactDOM dev: 1 080 KB
- Babel standalone: 3 137 KB
- **Totaal: ~5.0 MB uncompressed / ~1.6 MB gzip**

Plus parse/compile-tijd van Babel (honderden ms op mobiel) voordat de JSX zelfs gestart kan worden. Dit is de dominante oorzaak van slechte mobile TBT/TTI.

## 5. Fonts

- Google Fonts CSS met `display=swap` — **al correct** (zichtbaar in CSS response).
- 3 families × meerdere weights: Instrument Serif (2), Inter (4), JetBrains Mono (2) = **8 font-files** geladen via gstatic.
- `<link rel="preconnect">` naar fonts.googleapis.com en fonts.gstatic.com is aanwezig — **goed**.
- **Ontbreekt:** geen `<link rel="preload">` voor de LCP-font (Instrument Serif, gebruikt voor `<h1>`).
- **Ontbreekt:** geen `text=` subsetting — alle glyphs worden geladen.

## 6. Overige observaties

- Alle `<img>` in diensten-cards en gallery hebben `loading="lazy"` — **correct**.
- Hero `<iframe loading="eager">` — logisch (above-the-fold), maar zie aanbeveling 3.
- `<header class="nav" backdrop-filter:blur(10px)>` — blur op sticky header = extra compositing-kost per scroll-frame op lage devices. Niet kritiek.
- Lightbox-script is 45 regels vanilla JS — verwaarloosbaar.
- `hero-fallback` gebruikt `plantroom.jpg` als background-image met `z-index:-1`. Omdat de iframe eroverheen komt, is dat een gedupliceerde download van 157 KB die alleen zichtbaar is als de iframe faalt.

---

## 🎯 Prioritaire aanbevelingen

### HIGH — binnen 5–30 minuten (grootste impact)

**1. Cache-headers via `vercel.json` toevoegen** — 5 min
Nu: `max-age=0, must-revalidate` op alles. Browsers cachen niets, edge koelt af.
Fix: maak `/vercel.json`:
```json
{
  "headers": [
    { "source": "/Leander/assets/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] },
    { "source": "/(.*\\.(jpg|jpeg|png|webp|avif|svg|ico))",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] },
    { "source": "/Leander/Hero%20Video.html",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=3600, s-maxage=86400" }] }
  ]
}
```
**Wanneer wel toevoegen:** nu, omdat content statisch is en naamgeving stabiel. **Wanneer niet:** zodra je hashed filenames zou gebruiken (bv. via build tool) — dan past `immutable` pas echt bij alle files zonder risico.
Verwachte winst: −1 request per bezoek bij terugkerende users, en Vercel-edge houdt warme cache → TTFB op assets zakt van 400–900 ms naar 30–80 ms.

**2. Gallery-404's oplossen** — 5 min
`rainshower.jpg` en `whirlpool.jpg` ontbreken in `/Leander/assets/`. Opties:
- bestanden toevoegen (aanwezig? lijkt niet in `afbeeldingen/`), of
- de twee `<figure>` elementen in `index.html` regel 369-370 verwijderen.
Verwachte winst: 2 failed requests minder + geen gebroken thumbnails.

**3. Hero iframe — React dev → production build** — 15 min
Wijzig in `Leander/Hero Video.html`:
- `react.development.js` → `react.production.min.js` (107 KB → 6.7 KB, −94 %)
- `react-dom.development.js` → `react-dom.production.min.js` (1 080 KB → 130 KB, −88 %)
**Verwachte winst: −1.0 MB transfer, −500 ms TBT op mobile.**
Geen gedragswijziging, alleen dev-warnings weg.

**4. LCP-image: `plantroom.jpg` → WebP + preload** — 30 min
- Converteer `Leander/assets/plantroom.jpg` naar WebP (q80): 157 KB → ~45 KB (via `cwebp` of squoosh).
- Voeg `<link rel="preload" as="image" href="Leander/assets/plantroom.webp" type="image/webp">` toe in `index.html` `<head>`.
- Vervang img-source door `<picture>` met WebP-primary + JPG-fallback.
**Verwachte winst: LCP −0.8 tot −1.5 s op mobile.** Dit is de hero-fallback én de grootste card én de hero-gallery-tile, dus drievoudige impact.

### MEDIUM — binnen een half uur tot half dag

**5. Hero iframe — weg met Babel standalone** — half dag
`@babel/standalone` (3.1 MB) compileert JSX in de browser. Dit is alleen acceptabel in een scratch-demo, niet in productie.
Twee opties:
- **a) Pre-build de JSX** (vite/esbuild, 1x npm script) → output een ~20 KB gebundelde JS. **−3 MB transfer, −1–2 s TBT op mobile.**
- **b) Vervang iframe volledig** door een `<video autoplay muted loop playsinline>` met een 2–5 MB MP4/WebM. Geen React nodig. Simpeler, faster, identieke UX.
Aanbevolen: **optie b** — React-hero is over-engineering voor een statische site.

**6. Alle overige card-/gallery-images → WebP** — half dag
De 8 kleinere JPG's (20–50 KB elk) → WebP: ~7–18 KB elk. Totaal: 272 KB → ~80 KB (**−70 %**).
Script:
```bash
for f in Leander/assets/*.jpg; do
  cwebp -q 80 "$f" -o "${f%.jpg}.webp"
done
```
Gebruik `<picture>` in HTML voor fallback. **Verwachte winst: −190 KB totaal, −300 ms LCP op traag 4G.**

**7. `hero-fallback` background-image verwijderen** — 5 min
Regel 129 in `index.html`: de achtergrond-JPG wordt gedownload maar is onzichtbaar zolang de iframe werkt. Verwijder `.hero-fallback` of wijzig naar een CSS-kleur. **−157 KB duplicaat-download.**

**8. Dode map `afbeeldingen/`** — 5 min
Als deze niet gebruikt wordt, toevoegen aan `.vercelignore` of verwijderen uit repo. Bevat o.a. 382 KB bestand. Geen runtime-impact maar scheelt deploy-grootte.

### LOW — optimalisatie-laag

**9. Font preload voor Instrument Serif 400** — 5 min
LCP-heading gebruikt Instrument Serif. Voeg toe:
```html
<link rel="preload" as="font" type="font/woff2" crossorigin
  href="https://fonts.gstatic.com/s/instrumentserif/v4/…woff2">
```
Vereist het exacte font-URL eerst opzoeken in de CSS (niet stabiel). Alternatief: zelf hosten. **Winst: −150 ms FCP op heading.**

**10. Font-subsetting via `text=`** — 30 min
Weinig glyphs nodig, kan Google Fonts URL inkorten met `&text=…` param voor alleen gebruikte letters. Risicovol bij dynamische content (jaartal footer), dus alleen nuttig als definitief.

**11. Preconnect naar unpkg.com in index.html** — 2 min
Als iframe React-scripts blijft gebruiken, voeg toe: `<link rel="preconnect" href="https://unpkg.com" crossorigin>` in hoofd-index. **Winst: −100–200 ms op iframe-boot.**

---

## 📊 Verwachte Lighthouse-verbetering

| Scenario | Mobile Perf | LCP | TBT | Transfer |
|---|---|---|---|---|
| **Huidig** | 35–50 | 4.5–6.5 s | 800–1500 ms | ~5 MB |
| **Na quick wins** (1+2+3+4) | 65–78 | 2.2–3.0 s | 350–600 ms | ~3.8 MB |
| **Na medium fixes** (+5+6+7) | 85–92 | 1.5–2.2 s | 120–250 ms | ~1.2 MB |
| **Na alles** | 92–97 | 1.2–1.8 s | 80–150 ms | ~900 KB |

---

## 📝 Eind-summary (≤ 80 woorden)

**Huidige geschatte mobile score: 35–50** (Lighthouse niet live gemeten, PSI API quota uitgeput). Site is solide gestructureerd — lazy-loading en fonts met `display=swap` zijn correct — maar drie issues verzieken alles. **Top-3 quick wins:** (1) React dev → production builds in Hero Video.html (−1 MB, 15 min), (2) vercel.json met immutable cache voor assets (5 min), (3) plantroom.jpg → WebP + preload (30 min). **Verwachte score na deze drie: 65–78 mobile, LCP onder 3 s.**

---

**Performance Benchmarker** — audit uitgevoerd 2026-04-19
**Status:** FAILS SLA (LCP en TBT buiten Good-threshold op mobile)
**Scalability:** statisch + Vercel edge schaalt linear — bottleneck is client-side, niet server-side.
