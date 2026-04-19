# UI Design Report — Vande Ginste Leander

**Auditor:** UI Designer agent
**Datum:** 2026-04-19
**Bestand:** `/Users/bstruelens/APPS/Claude_temp/vandeginste/index.html`
**Live:** https://vande-ginste.vercel.app
**Scope:** Analyse + concrete voorstellen. Geen wijzigingen aan `index.html` in deze sessie.

---

## 1. Samenvatting

De pagina oogt rustig, editoriaal en past bij een vakman-positionering: papieren palet, serif-display, mono-labels. De typografische stem en het copy-ritme zijn bovengemiddeld. Zwakke plekken: de hero is vooral een iframe zonder ankertekst (geen H1 in beeld, geen CTA), de diensten-cards missen een duidelijke "klik-affordance", en accessibility-details (focus, reduced-motion, skip-link, muted-contrast) zijn nog niet geland. Top-3 sterktes: palet, typografie, proces-sectie. Top-3 zwaktes: hero-copy/CTA-ankers, muted-contrast, mobile nav.

---

## 2. Visuele hiërarchie & ritme

### 2.1 Hero
**Probleem.** De hero is 92vh aan iframe zonder tekstlaag. Een gebruiker landt op een video, scrolt, en ziet pas in de intro de bedrijfsnaam + claim. Voor SEO-snippet preview is dat ok (H1 staat er), maar voor *perceived value* mist de bovenkant alles: naam, claim, CTA, regio. Er is ook geen duidelijke scroll-hint.

**Voorstel.** Overlay met vignet + minimaal tekstblok linksonder en scroll-cue rechtsonder. Blijft terughoudend, voegt verankering toe.

```css
/* NU */
.hero{position:relative;height:min(92vh,820px);min-height:560px;overflow:hidden;border-bottom:1px solid var(--line)}
.hero iframe{position:absolute;inset:0;width:100%;height:100%;border:0;display:block}

/* VOORSTEL */
.hero{position:relative;height:min(88vh,780px);min-height:560px;overflow:hidden;border-bottom:1px solid var(--line)}
.hero iframe{position:absolute;inset:0;width:100%;height:100%;border:0;display:block}
.hero::after{
  content:"";
  position:absolute;inset:0;pointer-events:none;
  background:linear-gradient(180deg,rgba(26,24,20,0) 55%,rgba(26,24,20,.35) 100%);
}
.hero-overlay{
  position:absolute;left:28px;right:28px;bottom:28px;z-index:2;
  display:flex;align-items:flex-end;justify-content:space-between;gap:24px;
  color:#f5f1e8;
  pointer-events:none; /* laat iframe-interactie door */
}
.hero-overlay .tag{
  pointer-events:auto;
  font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:.14em;
  text-transform:uppercase;color:rgba(245,241,232,.8);
  padding:6px 10px;border:1px solid rgba(245,241,232,.25);border-radius:999px;
  backdrop-filter:blur(6px);background:rgba(10,8,6,.25);
}
.hero-scroll{
  pointer-events:auto;
  font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.2em;
  text-transform:uppercase;color:rgba(245,241,232,.8);
  display:inline-flex;align-items:center;gap:10px;
}
.hero-scroll::after{
  content:"";width:28px;height:1px;background:rgba(245,241,232,.8);
  animation:scrollCue 2.4s ease-in-out infinite;transform-origin:left;
}
@keyframes scrollCue{
  0%,100%{transform:scaleX(.4);opacity:.5}
  50%{transform:scaleX(1);opacity:1}
}
```
Markup-patch (conceptueel):
```html
<section class="hero" aria-label="Hero video">
  <div class="hero-fallback"></div>
  <iframe ...></iframe>
  <div class="hero-overlay">
    <span class="tag">Diksmuide · West-Vlaanderen</span>
    <span class="hero-scroll">Scroll</span>
  </div>
</section>
```

### 2.2 Intro → Diensten overgang
**Probleem.** `padding:96px 0 40px` bij intro, dan `padding:72px 0` bij `<section>`. De intro is al "stil" (alleen H1 + p) en krijgt asymmetrische lucht. Tussen intro en diensten-section head (met eigen 72px-top) ontstaat visuele stilte die té lang kan aanvoelen.

**Voorstel.** Breng intro naar 72px 0 56px en laat de section-head `padding-top:28px` (al aanwezig) die visuele scheiding dragen. Of: verwijder de border-top van de eerste section-head en gebruik een horizontale lijn onder de intro als ankerpunt.

```css
/* NU */
.intro{padding:96px 0 40px}

/* VOORSTEL */
.intro{padding:80px 0 56px;border-bottom:1px solid var(--line)}
/* + eerste .section-head mag dan border-top:0 krijgen */
section:first-of-type .section-head{border-top:0;padding-top:0}
```

### 2.3 Ritme tussen secties
Nu alles `72px 0` krijgt hetzelfde blokgewicht. De **Proces**-sectie (donker) is visueel het zwaarste moment en zou iets meer ademruimte mogen krijgen; de gallery juist iets minder omdat de beelden zelf al ademen.

```css
/* VOORSTEL — contextuele padding */
section{padding:72px 0}
.proces{padding:96px 0}
section[aria-labelledby="realisaties-title"]{padding:56px 0 72px}
```

---

## 3. Typografische verfijning

### 3.1 Line-height & tracking
- Body: `line-height:1.55` is ok voor 17px. Voor de `p` in `.intro` (17px, max 52ch) is 1.5 krapper en editorialer.
- Muted paragraphs in cards (`font-size:14.5px`) mogen 1.5 — nu erven ze 1.55, voelt los bij 2-regels.
- `.card h3` (22px, Instrument Serif) erft 1.55 — serif op 1.55 bij 22px is té open. Zet 1.15–1.2.

```css
/* NU */
.intro p{font-size:17px;color:var(--muted);max-width:52ch;margin:0}
.card h3{font-family:'Instrument Serif',serif;font-weight:400;font-size:22px;margin:6px 0 6px}
.card p{margin:0;color:var(--muted);font-size:14.5px}

/* VOORSTEL */
.intro p{font-size:17.5px;line-height:1.5;color:var(--muted);max-width:52ch;margin:0}
.card h3{font-family:'Instrument Serif',serif;font-weight:400;font-size:22px;line-height:1.15;letter-spacing:-.005em;margin:6px 0 8px}
.card p{margin:0;color:var(--muted);font-size:14.5px;line-height:1.5}
```

### 3.2 H1 vs H2 verhouding
H1 `clamp(38px,5.4vw,72px)`, H2 `clamp(30px,3.4vw,44px)`. Op desktop: 72 vs 44 = ratio 1.64 (≈ perfecte kwint). Op mobile (320px-breed): H1 = max(38, 5.4vw→17.3) → 38; H2 = max(30, 10.9) → 30. Ratio 1.27 — te dichtbij, H1 voelt niet "display" genoeg op klein scherm.

```css
/* VOORSTEL */
.intro h1{font-size:clamp(42px,6vw,76px);line-height:1.02;letter-spacing:-.015em}
.section-head h2{font-size:clamp(28px,3.2vw,44px);line-height:1.05;letter-spacing:-.01em}
```
Let op negatieve tracking: Instrument Serif op grote grootte wil -.015em à -.02em; op H2-grootte is -.01em genoeg.

### 3.3 Mono-labels
`.mono{font-size:12px;letter-spacing:.14em}` — prima. Maar binnen `.card .body` staat "Warmtepompen" mono **boven** de H3. Dat is een eyebrow. Geef hem een fractie meer kleur-contrast en vaster afstand:

```css
.card .body .mono{color:var(--accent);margin-bottom:2px;display:block}
```
(koper = categorie, niet meer grijs) — zie ook §4.

### 3.4 Paragraaf-lengte
`.intro p` krijgt `max-width:52ch`. Kaart-p en proces-p zijn niet begrensd → op 1240px kan een card-p (1 kolom op mobile) tot de hele breedte lopen. Card-kolommen zijn klein genoeg, dus ok. Maar in `.proces .step p` op 4-koloms layout is 60-72 karakters per regel mogelijk = prima. Geen change nodig.

---

## 4. Kleur & contrast

### 4.1 WCAG AA check (4.5:1 normaal, 3:1 large text ≥18px of ≥14px bold)

| combinatie | ratio | status |
|---|---|---|
| `--ink #1a1814` op `--bg #efeae0` | ~13.5 : 1 | AAA |
| `--ink` op `--paper #e4ddcf` | ~12.0 : 1 | AAA |
| `--muted #6b6458` op `--bg` | ~4.6 : 1 | AA (krap) |
| `--muted` op `--paper` | ~4.2 : 1 | **faalt** voor body-tekst |
| `--accent #8a6a4a` op `--bg` | ~4.2 : 1 | **faalt** voor body-tekst, ok voor large |
| `--accent-soft #d4a574` op `--bg` | ~1.8 : 1 | decoratief only |
| `#f5f1e8` op `--ink` (proces) | ~13.2 : 1 | AAA |
| `rgba(245,241,232,.72)` op `--ink` (proces p) | ~9.5 : 1 | AAA |
| `rgba(245,241,232,.55)` op `--ink` (proces mono) | ~6.8 : 1 | AA |

(ratio's zijn berekend tegen de effectieve blendkleur; `--muted` op `--paper` is de zwakste en komt terug in de card-beschrijvingen.)

**Probleem.** Cards staan op `--paper` en p-tekst is `--muted` — dat is precies de combinatie die faalt. Dat is tegelijk de meest-gelezen tekst van de pagina (dienstbeschrijvingen).

**Voorstel.** Donker de muted-variant één stap op óf lift de paper-achtergrond één tik op.

```css
/* NU */
--muted:#6b6458;

/* VOORSTEL — optie A (donkerdere muted, behoudt palet) */
--muted:#5c5649; /* ratio ~5.3:1 op paper, ~5.8:1 op bg */

/* optie B — zachtere paper (minder impact op bestaande beelden) */
--paper:#eae3d4;
```
Optie A is het minst-invasief en lost beide achtergronden tegelijk op.

### 4.2 Gebruik van accent copper
Op dit moment verschijnt `--accent` op 3 plekken:
- H1 `em` (cursief "en warmte")
- `.btn-primary:hover` achtergrond
- `.contact-row a:hover` kleur

Dat is **té subtiel** voor een kernbrand-kleur. Koper is de visuele signatuur van het vak; de pagina kan hem 2–3 plekken extra tonen zonder "gekleurd" te worden:

1. Eyebrow-mono binnen cards (zie §3.3) — categorisering in koper.
2. Step-nummer `.step .n` al op `--accent-soft`; overweeg `--accent` voor betere leesbaarheid op donkere achtergrond (4.8:1 vs 8.7:1 voor soft — soft is eigenlijk ok; laat staan).
3. Een dunne koperen lijn onder H1 of boven de section-head als "pull-quote" accent:

```css
.section-head{position:relative}
.section-head::before{
  content:"";position:absolute;left:0;top:-1px;width:48px;height:1px;
  background:var(--accent);
}
```
Dat geeft elke sectie een kleine koperen markering op de horizontale lijn — zichtbaar maar terughoudend.

### 4.3 Extra accent?
Ik zou **geen extra kleur** toevoegen. Het palet werkt door zijn beperking. Wél: **expliciete focus-ring-kleur** op basis van accent:

```css
:root{ --focus: color-mix(in oklab, var(--accent) 70%, white); }
*:focus-visible{
  outline:2px solid var(--focus);
  outline-offset:3px;
  border-radius:4px;
}
```

---

## 5. Componenten

### 5.1 Diensten-cards
**Analyse.**
- Beeld 4:3 — correcte keuze, past bij product-shots.
- Hover lift + scale op img — subtiel en ok.
- **Probleem.** Geen CTA, geen link. De hele card voelt klikbaar (pointer verschijnt niet, hover-animatie suggereert anders). Óf hem écht klikbaar maken (naar een detail of anker), óf hover-lift wegnemen zodat hij eerlijk een informatiekaart blijft.

**Voorstel (lichte variant — kaart als info, met subtiele arrow):**
```css
.card{cursor:default}
.card .body{padding:20px 22px 24px;display:flex;flex-direction:column;gap:8px}
.card .body .mono{color:var(--accent)}
.card .body h3{display:flex;align-items:center;justify-content:space-between;gap:12px}
.card .body h3::after{
  content:"→";
  font-family:'Inter',sans-serif;font-size:16px;color:var(--muted);
  transition:transform .25s ease,color .25s ease;
  opacity:0;
}
.card:hover .body h3::after{opacity:1;transform:translateX(4px);color:var(--accent)}
```
**Voorstel (sterke variant — klikbare card):**
Wrap `<article>` inhoud in `<a href="#contact">`, geef focus/hover/active states. Maar dan moet de bestemming zinvol zijn (detail-modal, FAQ-anker, of op zijn minst #contact-spring). Zonder bestemming: gebruik de lichte variant.

**Beeld/tekst-verhouding.** Thumb 4:3 is ok; body-padding 20/22/24 is asymmetrisch voor geen reden:
```css
.card .body{padding:22px 22px 24px} /* consistent */
```

### 5.2 Gallery mozaïek
**Analyse.** 6-koloms raster met `span-3 row-2` (hero), `span-2`, defaults. Het werkt, maar:
- 11 figuren in één dicht mozaïek is veel. Op desktop oogt het **repetitief** omdat 8 van de 11 figuren `span-2` zijn. De hiërarchie stroomt niet.
- Op tablet (900px) valt alles terug naar 4 kolommen met mix van span-2/span-2, wat een saai 2×N raster wordt.
- Op mobile (560px) is het een simpele 2-koloms stack — prima.

**Voorstel A — breek het ritme.**
Gebruik `row-2` bewust op 2 figuren (niet alleen de eerste) en maak 3 figuren `span-3` op desktop voor rust tussen dichte rijen.

**Voorstel B — grid-auto-flow:dense.**
```css
.gallery{
  display:grid;
  grid-template-columns:repeat(6,1fr);
  grid-auto-rows:180px;
  grid-auto-flow:dense; /* laat kleinere tegels gaten opvullen */
  gap:12px;
}
```
Dit zorgt dat het patroon er minder gestapeld uitziet.

**Voorstel C — gallery categoriseren.**
Splits in 2 subrijen met een `.mono` tussenkop ("Stookplaatsen", "Badkamers"). Voegt scanbaarheid toe en legt de expertise-breedte uit.

**Mobile caption/hover.** Op mobile is er geen hover — de afbeeldingen staan naakt. Voeg een korte caption onder elke figure op ≤560px:
```css
.gallery figcaption{display:none}
@media(max-width:560px){
  .gallery figcaption{
    display:block;margin-top:6px;
    font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.12em;
    text-transform:uppercase;color:var(--muted);
  }
  .gallery figure{border-radius:10px 10px 0 0}
}
```

### 5.3 Contactkaart
**Analyse.** Goed gedaan: 5 rijen met icon + label + waarde, border-between. Wél:
- Labels zijn mono-uppercase, waardes zijn 17px — label wordt té prominent relatief tot de kleine link. Zet label iets kleiner of waardes iets kleiner.
- De BTW-rij heeft géén link; de Facebook-rij heeft wel een link. Consistentie: `aria-hidden` icons, consistent interactiepatroon.
- Geen hover-state op de hele rij — alleen op de tekst. Hele rij klikbaar zou beter zijn.

```css
.contact-row{align-items:flex-start;padding:16px 0;gap:14px}
.contact-row small{font-size:11px;letter-spacing:.14em;margin-bottom:4px}
.contact-row a, .contact-row span{font-size:16px;line-height:1.35}
.contact-row:hover .ico{background:color-mix(in oklab,var(--accent) 18%,var(--paper))}
.contact-row .ico svg{color:var(--accent)}
```

### 5.4 Navigatie
**Analyse.** Sticky + backdrop-blur werkt goed. Maar:
- Op mobile wordt de ghost-knop ("Diensten") verstopt en blijft alleen telefoon-knop. Gevolg: **geen navigatie** naar andere secties op mobile. Er zijn 3 inhoudelijke secties (Diensten, Werkwijze, Realisaties, Contact) — zonder anker-navigatie scrolt de gebruiker blind.
- Geen visuele verankering op welke sectie je zit.

**Voorstel.** Echte mobile-menu (hamburger → fullscreen sheet). Voor deze landing (4 ankers) is dat prima klein te houden:

```css
/* NU */
@media(max-width:640px){.nav-cta .btn-ghost{display:none}}

/* VOORSTEL */
.nav-toggle{display:none;background:none;border:0;padding:8px;cursor:pointer;color:var(--ink)}
@media(max-width:640px){
  .nav-cta .btn-ghost{display:none}
  .nav-toggle{display:inline-flex}
}
.mobile-sheet{
  position:fixed;inset:64px 0 0 0;z-index:49;
  background:rgba(239,234,224,.98);backdrop-filter:blur(20px);
  display:none;flex-direction:column;padding:32px 28px;gap:4px;
}
.mobile-sheet.open{display:flex}
.mobile-sheet a{
  padding:16px 0;font-family:'Instrument Serif',serif;font-size:28px;
  border-bottom:1px solid var(--line);text-decoration:none;
}
```
Minimale JS voor toggle + body-scroll-lock.

---

## 6. Microinteractions & motion

### 6.1 Waar is animatie waardevol?
1. **Scroll-reveal op .card en .step** — fade+translateY van 12px op entry. Niet op alle items, maar gestaggerd per rij (delay 60ms per card).
2. **H1 in intro** — word-splitting niet nodig; een simpele opacity+blur-release op load verkoopt het editorial-gevoel.
3. **Koperen lijn-accent** (§4.2) — laat hem groeien van 0 → 48px op viewport-entry.

### 6.2 Minder is meer
- Schakel **alle** animaties uit bij `prefers-reduced-motion`.
- Verwijder de 0.6s image-scale op card-hover als je toch scroll-reveal toevoegt; te veel beweging = goedkoop.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .001ms !important;
    scroll-behavior: auto !important;
  }
}

/* Reveal */
.reveal{opacity:0;transform:translateY(12px);transition:opacity .6s ease,transform .6s ease}
.reveal.in{opacity:1;transform:none}
```
JS (IntersectionObserver, ~15 regels):
```js
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }});
},{rootMargin:'-10% 0px'});
document.querySelectorAll('.card,.step,.gallery figure').forEach((el,i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${(i%3)*60}ms`;
  io.observe(el);
});
```

### 6.3 Lightbox-polish
- **Entry-animation.** Nu toggle je `display:flex` + `opacity` — de opacity-transition werkt niet omdat display-change instant is. Gebruik visibility + opacity:
```css
.lb{
  position:fixed;inset:0;z-index:100;
  background:rgba(10,8,6,.92);backdrop-filter:blur(6px);
  display:flex;align-items:center;justify-content:center;padding:24px;
  opacity:0;visibility:hidden;pointer-events:none;
  transition:opacity .25s ease,visibility 0s linear .25s;
}
.lb.open{opacity:1;visibility:visible;pointer-events:auto;transition:opacity .25s ease,visibility 0s}
.lb img{transform:scale(.98);transition:transform .3s ease}
.lb.open img{transform:scale(1)}
```
- **Focus-trap.** Nu kun je Tab uit de lightbox. Focus de close-button bij openen, focus de trigger terug bij sluiten.
- **Touch-swipe** (prev/next) voor mobile.

---

## 7. Detail-polish checklist (prioriteit: P1 kritiek, P2 belangrijk, P3 nice-to-have)

1. **P1** — `prefers-reduced-motion` block toevoegen (accessibility).
2. **P1** — Skip-to-content link bovenin (screenreaders, keyboard).
3. **P1** — `*:focus-visible` outline (nu: browserdefault, verdwijnt soms op knoppen).
4. **P1** — `--muted` op `--paper` contrast oplossen (zie §4.1).
5. **P1** — Mobile navigation sheet (nu geen sectie-nav op mobile).
6. **P2** — `loading="lazy"` staat al op img's; voeg `decoding="async"` toe op alle gallery-afbeeldingen.
7. **P2** — iframe `loading="eager"` + fallback is ok, maar geef iframe `title` en toon een `poster`-achtige fallback zichtbaar tot iframe-load (nu staat hero-fallback op z-index -1 en is dus **nooit** zichtbaar).
8. **P2** — Lightbox focus-trap + terugkeer van focus naar origineel thumbnail.
9. **P2** — Cards: of klikbaar maken, of hover-lift verwijderen (§5.1).
10. **P2** — Alt-text is prima; overweeg `figcaption` voor gallery op mobile (§5.2).
11. **P2** — `scroll-behavior:smooth` op html + `scroll-margin-top:80px` op sections met id (sticky nav overlap).
12. **P2** — Buttons: geef `.btn-primary` een `:active` state (nu alleen hover + transform).
13. **P3** — Favicon is aanwezig; voeg `<link rel="mask-icon">` voor Safari pinned tabs.
14. **P3** — JetBrains Mono wordt op 1 plek groot gebruikt (step .n 12px); evalueer of je hem echt nodig hebt voor file-size.
15. **P3** — Footer: "© 2026 Vande Ginste Leander — IJzerlaan 62, 8600 Diksmuide · BTW BE…" — te lang voor mobile, stack op ≤560px.
16. **P3** — Contactkaart: voeg `<time>` of openingsuren-rij toe (je LocalBusiness-schema heeft ze, UI toont ze niet).
17. **P3** — Hero overlay tag "Diksmuide · West-Vlaanderen" (zie §2.1) — ook SEO-signaal.
18. **P3** — Intro-H1 `em`: cursief+koper is elegant, maar overweeg ook de periode (".") in koper voor ritme.
19. **P3** — `gap:20px` in `.grid` en `gap:24px` in `.steps` — standaardiseer op `24px` of design-token (`--space-6`).
20. **P3** — Introduceer CSS custom-properties voor spacing (`--space-3/4/6/8/12`) — nu zijn alle waarden hardcoded.

---

## 8. Experimentele voorstellen

### 8.1 "Materialen-loupe" bij koperwerk-card
Een hover/tap op de koperwerk-card opent een mini-overlay met 3 materiaal-swatches (koper, messing, chroom) en een regel uitleg per materiaal. Versterkt de vakman-signatuur.

Implementatie: `<details>` of een kleine reveal-panel onder de card die op klik verschijnt (geen modal). Tokens: 3 kleurvlakken + mono-labels + 1-regel uitleg.

### 8.2 "Traject-kostenindicatie" strip onder Werkwijze
Een dunne horizontale strip met 3 typische projecten en hun prijsvork:
- "Badkamer-renovatie — vanaf € X"
- "Warmtepomp-installatie — vanaf € Y"
- "Vloerverwarming nieuwbouw — vanaf € Z per m²"

Geeft bezoekers houvast zonder een volledige prijslijst. Eén zin disclaimer: "indicatief, altijd plaatsbezoek". Conversie-significant zonder de editoriale toon te breken.

### 8.3 "Voor / na"-slider in realisaties
Eén highlight-realisatie (bv. renovatie stookplaats) als before/after slider bovenaan de gallery. Twee afbeeldingen gelijk aligned, drag-handle op koperen lijn. Sterke visuele hook die het vakmanschap bewijst. Aparte subsectie, niet binnen de mozaïek.

```html
<div class="ba">
  <img class="ba-before" src="...before.jpg" alt="Stookplaats vooraf">
  <img class="ba-after"  src="...after.jpg"  alt="Stookplaats na renovatie">
  <input type="range" min="0" max="100" value="50" class="ba-slider" aria-label="Voor/na">
</div>
```
CSS via clip-path op de "after"-image, JS ~10 regels.

---

## 9. Priority matrix

| Voorstel | Impact | Effort | Score |
|---|:---:|:---:|:---:|
| Muted-contrast fix (§4.1) | Hoog | Klein | **DO FIRST** |
| `prefers-reduced-motion` block (§6.2) | Hoog | Klein | **DO FIRST** |
| Focus-visible outline (§4.2, §7.3) | Hoog | Klein | **DO FIRST** |
| Skip-to-content link (§7.2) | Middel | Klein | do |
| Mobile nav sheet (§5.4) | Hoog | Middel | do |
| Hero overlay + scroll-cue (§2.1) | Middel | Klein | do |
| Card eyebrow in koper (§3.3, §4.2) | Middel | Klein | do |
| Card hover-affordance fix (§5.1) | Middel | Klein | do |
| H1/H2 tracking + clamp-tweak (§3.2) | Middel | Klein | do |
| Lightbox entry-anim + focus-trap (§6.3) | Middel | Middel | do |
| Section `scroll-margin-top` (§7.11) | Middel | Klein | do |
| Spacing-tokens introduceren (§7.20) | Laag | Middel | later |
| Gallery: dense flow + figcaptions (§5.2) | Middel | Middel | later |
| Contactkaart polish (§5.3) | Laag | Klein | later |
| Openingsuren toevoegen (§7.16) | Middel | Klein | later |
| Scroll-reveal animatie (§6.1) | Laag | Middel | later |
| Voor/na slider (§8.3) | Hoog | Groot | plan |
| Prijsindicatie-strip (§8.2) | Hoog | Middel | plan |
| Materialen-loupe (§8.1) | Laag | Middel | plan |
| Card klikbaar → detail-route (§5.1) | Hoog | Groot | plan |

---

## Eerste 3 wijzigingen die ik morgen zou maken

1. `--muted:#5c5649` + `*:focus-visible` outline + `prefers-reduced-motion` block. Drie CSS-snippets, 10 minuten, meteen AA-compliant en toetsenbord-vriendelijk.
2. Hero-overlay met plaats-tag en scroll-cue — geeft de pagina bovenaan verankering zonder de iframe-video te verstoren.
3. Echte mobile-nav sheet. Zonder dit zit mobile-bezoek vast in eindeloos scrollen. Kleine toggle, paar regels CSS, 15 regels JS.

---

**Rapport:** `/Users/bstruelens/APPS/Claude_temp/vandeginste/UI-DESIGN-REPORT.md`
**Geen wijzigingen doorgevoerd aan:** `/Users/bstruelens/APPS/Claude_temp/vandeginste/index.html`
