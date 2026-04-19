// scenes.jsx — Scene composition for HVAC installer landing hero video
// Neutral stone palette. Editorial pacing. Real photography + typographic overlays.

const PALETTE = {
  bg: '#efeae0',       // warm off-white
  ink: '#1a1814',      // near-black warm
  muted: '#6b6458',    // stone
  line: 'rgba(26,24,20,0.18)',
  accent: '#8a6a4a',   // warm copper-ish (muted, not saturated)
  paper: '#e4ddcf',
};

const SERIF = '"Instrument Serif", "Cormorant Garamond", Georgia, serif';
const SANS = '"Inter", system-ui, sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace';

// ── Utility: crossfade between scenes ────────────────────────────────────────
// Each scene has its own [start,end]; overlapping creates smooth cuts.

// ── Scene 1: Opener — the brand line appears over the copper plant-room ─────
function SceneOpener() {
  const { localTime, duration, progress } = useSprite();

  // Ken burns on background image
  const imgScale = 1.0 + 0.06 * progress;
  const imgX = -20 * progress;

  // Mask darkens in
  const maskOp = interpolate([0, 0.2, 0.85, 1], [0.55, 0.55, 0.55, 0.7])(progress);

  // Vertical line grow
  const lineH = animate({ from: 0, to: 380, start: 0.4, end: 1.5, ease: Easing.easeInOutCubic })(localTime);

  return (
    <>
      {/* Background image */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${IMG["plantroom"]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transform: `scale(${imgScale}) translateX(${imgX}px)`,
        transformOrigin: 'center',
      }} />
      {/* Warm tint + darken */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(180deg, rgba(20,18,14,${maskOp*0.6}) 0%, rgba(20,18,14,${maskOp}) 100%)`,
        mixBlendMode: 'multiply',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(30, 22, 12, 0.18)',
        mixBlendMode: 'overlay',
      }}/>

      {/* Top metadata bar */}
      <TopBar time={localTime} />

      {/* Main text block */}
      <Sprite start={0.0} end={duration}>
        <div style={{
          position: 'absolute',
          left: 80, bottom: 120,
          color: '#f5f1e8',
          maxWidth: 1100,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 18,
            fontFamily: MONO, fontSize: 13, letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(245,241,232,0.72)',
            opacity: animate({from:0,to:1,start:0.2,end:0.8})(localTime),
            transform: `translateY(${(1-animate({from:0,to:1,start:0.2,end:0.8, ease: Easing.easeOutCubic})(localTime))*8}px)`,
            marginBottom: 28,
          }}>
            <span style={{width: 8, height: 8, borderRadius: 8, background: '#d4a574', display: 'inline-block'}}/>
            <span>Hoofdstuk 01 — Uitzonderlijke installaties</span>
          </div>

          <HeadlineReveal localTime={localTime} />

          <div style={{
            fontFamily: SANS, fontSize: 20, lineHeight: 1.55,
            color: 'rgba(245,241,232,0.78)', maxWidth: 620, marginTop: 36,
            fontWeight: 300,
            opacity: animate({from:0,to:1,start:1.6,end:2.4})(localTime),
            transform: `translateY(${(1-animate({from:0,to:1,start:1.6,end:2.4, ease: Easing.easeOutCubic})(localTime))*12}px)`,
          }}>
            Warmtepompen, vloerverwarming, zonneboilers en sanitair op maat —
            geïnstalleerd door een klein team dat elke koppeling behandelt alsof
            er een foto van gemaakt wordt.
          </div>
        </div>
      </Sprite>

      {/* Growing vertical rule */}
      <div style={{
        position: 'absolute',
        left: 80, bottom: 520,
        width: 1, height: lineH,
        background: 'rgba(245,241,232,0.35)',
      }}/>

      {/* Bottom right location tag */}
      <div style={{
        position: 'absolute',
        right: 80, bottom: 80,
        color: '#f5f1e8',
        fontFamily: MONO, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
        textAlign: 'right', lineHeight: 1.7,
        opacity: animate({from:0,to:1,start:1.8,end:2.6})(localTime),
      }}>
        <div style={{color:'rgba(245,241,232,0.55)'}}>Sanitair · Verwarming · Ventilatie</div>
        <div>West-Vlaanderen</div>
      </div>
    </>
  );
}

function HeadlineReveal({ localTime }) {
  // Three-line serif headline, each line slides up independently
  const lines = [
    { text: 'Warme kamers.', start: 0.45 },
    { text: 'Stille systemen.', start: 0.85 },
    { text: 'Zichtbaar vakwerk.', start: 1.25 },
  ];
  return (
    <div style={{
      fontFamily: SERIF, fontSize: 112, lineHeight: 0.98,
      letterSpacing: '-0.02em', fontWeight: 400,
      color: '#f5f1e8',
    }}>
      {lines.map((l, i) => {
        const t = animate({from:0,to:1,start:l.start,end:l.start+0.7, ease: Easing.easeOutCubic})(localTime);
        return (
          <div key={i} style={{overflow:'hidden', paddingBottom: 4}}>
            <div style={{
              transform: `translateY(${(1-t)*100}%)`,
              opacity: t,
              fontStyle: i === 2 ? 'italic' : 'normal',
            }}>
              {l.text}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Scene 2: Services grid ──────────────────────────────────────────────────
// Reveals 4 service tiles one-by-one with ken burns, then lingers
function SceneServices() {
  const { localTime, duration } = useSprite();

  const tiles = [
    { img: IMG["heatpump"],    cat: '01 · Warmtepompen',       title: 'Lucht-water systemen',     meta: 'Vaillant · Mitsubishi · Daikin' },
    { img: IMG["underfloor"],  cat: '02 · Vloerverwarming',    title: 'Aanleg verdeelkring',      meta: 'Nieuwbouw & renovatie' },
    { img: IMG["solar-roof"],  cat: '03 · Zonneboilers',       title: 'Vacuümbuiscollectoren',    meta: 'Gekoppeld & autonoom' },
    { img: IMG["plantroom"],   cat: '04 · Stookplaatsen',      title: 'Koper- & messingwerk',     meta: 'Ingeregeld & gelabeld' },
  ];

  return (
    <>
      {/* Paper bg */}
      <div style={{position:'absolute', inset:0, background: PALETTE.bg}}/>
      {/* Subtle grain */}
      <div style={{position:'absolute', inset:0, opacity: 0.4,
        backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(138,106,74,0.05), transparent 50%), radial-gradient(circle at 80% 70%, rgba(107,100,88,0.04), transparent 50%)'
      }}/>

      {/* Heading strip */}
      <div style={{
        position: 'absolute', left: 80, top: 80,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        width: 'calc(100% - 160px)',
      }}>
        <div>
          <div style={{
            fontFamily: MONO, fontSize: 12, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: PALETTE.muted,
            opacity: animate({from:0,to:1,start:0.1,end:0.5})(localTime),
          }}>
            § Wat wij installeren
          </div>
          <div style={{
            fontFamily: SERIF, fontSize: 80, lineHeight: 1.0,
            letterSpacing: '-0.02em', color: PALETTE.ink,
            marginTop: 14,
            opacity: animate({from:0,to:1,start:0.25,end:0.9})(localTime),
            transform: `translateY(${(1-animate({from:0,to:1,start:0.25,end:0.9, ease: Easing.easeOutCubic})(localTime))*16}px)`,
          }}>
            Vier vakgebieden. <span style={{fontStyle: 'italic', color: PALETTE.accent}}>Eén team.</span>
          </div>
        </div>
        <div style={{
          fontFamily: MONO, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
          color: PALETTE.muted, textAlign: 'right', lineHeight: 1.7,
          opacity: animate({from:0,to:1,start:0.6,end:1.2})(localTime),
        }}>
          Sinds 2011<br/>
          West-Vlaanderen · BE
        </div>
      </div>

      {/* Grid */}
      <div style={{
        position: 'absolute',
        left: 80, top: 340,
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 20,
        width: 'calc(100% - 160px)',
      }}>
        {tiles.map((tile, i) => {
          const start = 0.8 + i * 0.35;
          const rev = animate({from:0,to:1,start:start,end:start+0.8, ease: Easing.easeOutCubic})(localTime);
          const kb = 1 + 0.05 * Math.max(0, (localTime - start - 0.5));
          return (
            <div key={i} style={{
              transform: `translateY(${(1-rev)*60}px)`,
              opacity: rev,
            }}>
              <div style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '3/4',
                overflow: 'hidden',
                background: PALETTE.paper,
                marginBottom: 20,
              }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: `url(${tile.img})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transform: `scale(${kb})`,
                  transformOrigin: 'center',
                  filter: 'saturate(0.9)',
                }}/>
              </div>
              <div style={{fontFamily: MONO, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: PALETTE.muted, marginBottom: 8}}>
                {tile.cat}
              </div>
              <div style={{fontFamily: SERIF, fontSize: 28, lineHeight: 1.1, color: PALETTE.ink, marginBottom: 6, letterSpacing:'-0.01em'}}>
                {tile.title}
              </div>
              <div style={{fontFamily: SANS, fontSize: 13, color: PALETTE.muted, fontWeight: 400}}>
                {tile.meta}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer mono strip */}
      <div style={{
        position: 'absolute', left: 80, bottom: 60,
        fontFamily: MONO, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase',
        color: PALETTE.muted,
        display: 'flex', gap: 32,
        opacity: animate({from:0,to:1,start:2.6,end:3.2})(localTime),
      }}>
        <span>→ Ontwerp</span>
        <span>→ Installatie</span>
        <span>→ Inregeling</span>
        <span>→ Onderhoud</span>
      </div>
    </>
  );
}

// ── Scene 3: Detail — the copper tap ────────────────────────────────────────
// Full-bleed beauty shot with a pull-quote
function SceneDetail() {
  const { localTime, duration, progress } = useSprite();
  const imgScale = 1.02 + 0.06 * progress;

  return (
    <>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${IMG["stone-sink"]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transform: `scale(${imgScale})`,
      }}/>
      <div style={{position:'absolute', inset:0, background:'linear-gradient(90deg, rgba(20,16,12,0.55) 0%, rgba(20,16,12,0.0) 55%)'}}/>

      {/* Pull quote left */}
      <div style={{position:'absolute', left: 80, top: 180, maxWidth: 560, color:'#f5f1e8'}}>
        <div style={{fontFamily: MONO, fontSize: 12, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(245,241,232,0.7)',
          opacity: animate({from:0,to:1,start:0.1,end:0.6})(localTime)}}>
          § Over afwerking
        </div>

        <div style={{fontFamily: SERIF, fontStyle:'italic', fontSize: 64, lineHeight: 1.1, letterSpacing:'-0.015em', marginTop: 28}}>
          {['"Het stuk dat','je nooit ziet,','is het stuk dat','wij goed doen."'].map((line, i) => {
            const t = animate({from:0,to:1,start:0.4+i*0.22,end:0.4+i*0.22+0.7, ease: Easing.easeOutCubic})(localTime);
            return (
              <div key={i} style={{overflow:'hidden'}}>
                <div style={{transform:`translateY(${(1-t)*100}%)`, opacity: t}}>{line}</div>
              </div>
            );
          })}
        </div>

        <div style={{
          fontFamily: SANS, fontSize: 14, color: 'rgba(245,241,232,0.7)',
          marginTop: 32, display:'flex', alignItems:'center', gap: 14,
          opacity: animate({from:0,to:1,start:1.8,end:2.4})(localTime),
        }}>
          <div style={{width:28, height:1, background:'rgba(245,241,232,0.5)'}}/>
          Leander Vande Ginste, zaakvoerder
        </div>
      </div>

      {/* Right-side specimen card */}
      <SpecCard localTime={localTime} />
    </>
  );
}

function SpecCard({ localTime }) {
  const rev = animate({from:0,to:1,start:1.0,end:1.8, ease: Easing.easeOutCubic})(localTime);
  return (
    <div style={{
      position: 'absolute', right: 80, top: 160,
      width: 340,
      background: 'rgba(245,241,232,0.08)',
      border: '1px solid rgba(245,241,232,0.18)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      padding: '28px 28px 24px',
      color: '#f5f1e8',
      opacity: rev,
      transform: `translateY(${(1-rev)*20}px)`,
    }}>
      <div style={{fontFamily: MONO, fontSize: 10, letterSpacing: '0.2em', textTransform:'uppercase', color:'rgba(245,241,232,0.6)', marginBottom: 18}}>
        Exemplaar · Plaat 07
      </div>
      <div style={{fontFamily: SERIF, fontSize: 32, lineHeight: 1.1, marginBottom: 20, letterSpacing:'-0.01em'}}>
        Wandkraan,<br/>geborsteld nikkel
      </div>
      {[
        ['Materiaal', 'Massief messing, PVD'],
        ['Montage', 'Op maat'],
        ['Afwerking', 'Geborsteld nikkel'],
        ['Garantie', 'Volgens fabrikant'],
      ].map(([k,v], i) => (
        <div key={i} style={{
          display:'flex', justifyContent:'space-between',
          padding: '10px 0',
          borderTop: '1px solid rgba(245,241,232,0.14)',
          fontFamily: MONO, fontSize: 12, letterSpacing: '0.04em',
        }}>
          <span style={{color:'rgba(245,241,232,0.55)'}}>{k}</span>
          <span>{v}</span>
        </div>
      ))}
    </div>
  );
}

// ── Scene 4: Process — numbered steps ───────────────────────────────────────
function SceneProcess() {
  const { localTime, duration } = useSprite();

  const steps = [
    { n: '01', img: IMG["van"],       title: 'Plaatsbezoek',  body: 'We meten, luisteren en maken de scope op. Geen verkoopspraat — wel een eerlijk bestek zo snel mogelijk.' },
    { n: '02', img: IMG["underfloor"],title: 'Ontwerp',       body: 'CAD-schema van elke lus, verdeler en kraan. U ziet precies wat waar komt voordat we een muur aanraken.' },
    { n: '03', img: IMG["plantroom"], title: 'Installatie',   body: '            Meestal binnen enkele werkdagen. Koper en messing worden ter plaatse gesneden; elke koppeling wordt nauwkeurig afgeperst.' },
    { n: '04', img: IMG["heatpump"],  title: 'Inregeling',    body: 'Gebalanceerd, gelabeld, uitgelegd. U krijgt een duidelijke oplevering en een nummer dat opgenomen wordt.' },
  ];

  return (
    <>
      <div style={{position:'absolute', inset:0, background: PALETTE.ink}}/>
      {/* Title */}
      <div style={{position:'absolute', left: 80, top: 80}}>
        <div style={{fontFamily: MONO, fontSize: 12, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(245,241,232,0.55)',
          opacity: animate({from:0,to:1,start:0.1,end:0.5})(localTime)}}>
          § Hoe wij werken
        </div>
        <div style={{fontFamily: SERIF, fontSize: 80, lineHeight: 1, letterSpacing:'-0.02em', color:'#f5f1e8', marginTop: 14,
          opacity: animate({from:0,to:1,start:0.2,end:0.8})(localTime),
          transform: `translateY(${(1-animate({from:0,to:1,start:0.2,end:0.8, ease: Easing.easeOutCubic})(localTime))*16}px)`,
        }}>
          Vier stappen, <span style={{fontStyle:'italic'}}>geen verrassingen.</span>
        </div>
      </div>

      {/* Steps row */}
      <div style={{
        position:'absolute', left: 80, top: 340,
        display:'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 40,
        width: 'calc(100% - 160px)',
      }}>
        {steps.map((s, i) => {
          const start = 0.7 + i * 0.3;
          const rev = animate({from:0,to:1,start:start,end:start+0.7, ease:Easing.easeOutCubic})(localTime);
          return (
            <div key={i} style={{opacity: rev, transform:`translateY(${(1-rev)*40}px)`}}>
              <div style={{
                display:'flex', alignItems:'baseline', gap: 14, marginBottom: 24,
              }}>
                <div style={{fontFamily: SERIF, fontSize: 72, color:PALETTE.accent, lineHeight:1, fontStyle:'italic'}}>{s.n}</div>
                <div style={{flex:1, height: 1, background:'rgba(245,241,232,0.2)'}}/>
              </div>
              <div style={{
                width:'100%', aspectRatio:'4/3',
                backgroundImage:`url(${s.img})`, backgroundSize:'cover', backgroundPosition:'center',
                marginBottom: 24, filter:'saturate(0.85) brightness(0.95)',
              }}/>
              <div style={{fontFamily: SERIF, fontSize: 32, color:'#f5f1e8', marginBottom: 12, letterSpacing:'-0.01em'}}>
                {s.title}
              </div>
              <div style={{fontFamily: SANS, fontSize: 14, lineHeight: 1.55, color: 'rgba(245,241,232,0.6)', fontWeight: 300}}>
                {s.body}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ── Scene 5: CTA / closer ───────────────────────────────────────────────────
function SceneCTA() {
  const { localTime, duration, progress } = useSprite();

  return (
    <>
      <div style={{position:'absolute', inset:0, background: PALETTE.bg}}/>
      {/* Big image on right, full-bleed from 40% */}
      <div style={{
        position:'absolute', right: 0, top: 0, bottom: 0,
        width: '46%',
        backgroundImage: `url(${IMG["bathtub"]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transform: `scale(${1+0.03*progress})`,
        transformOrigin: 'center',
        clipPath: `inset(0 0 ${(1-animate({from:0,to:1,start:0.1,end:1.2, ease:Easing.easeInOutCubic})(localTime))*100}% 0)`,
      }}/>

      {/* Top meta */}
      <TopBar time={localTime} dark/>

      {/* Big number bottom left */}
      <div style={{
        position:'absolute', left: 80, bottom: 80,
        maxWidth: 800,
      }}>
        <div style={{fontFamily: MONO, fontSize: 12, letterSpacing:'0.18em', textTransform:'uppercase', color: PALETTE.muted,
          opacity: animate({from:0,to:1,start:0.3,end:0.8})(localTime)}}>
          § Neem contact op
        </div>
        <div style={{
          fontFamily: SERIF, fontSize: 128, lineHeight: 0.95, letterSpacing:'-0.025em',
          color: PALETTE.ink, marginTop: 28, marginBottom: 36,
        }}>
          {[
            {t:'Plan een', it:false, s:0.5},
            {t:'plaatsbezoek.', it:true, s:0.9},
          ].map((l, i) => {
            const t = animate({from:0,to:1,start:l.s,end:l.s+0.7, ease:Easing.easeOutCubic})(localTime);
            return (
              <div key={i} style={{overflow:'hidden'}}>
                <div style={{transform:`translateY(${(1-t)*100}%)`, opacity:t, fontStyle: l.it ? 'italic' : 'normal', color: l.it ? PALETTE.accent : PALETTE.ink}}>
                  {l.t}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{display:'flex', gap: 20, alignItems:'center',
          opacity: animate({from:0,to:1,start:1.8,end:2.3})(localTime),
          transform:`translateY(${(1-animate({from:0,to:1,start:1.8,end:2.3, ease:Easing.easeOutCubic})(localTime))*12}px)`,
        }}>
          <button onClick={() => { window.location.href = 'mailto:leander@vande-ginste.be?subject=Offerteaanvraag&body=Dag%20Leander%2C%0A%0AIk%20zou%20graag%20een%20offerte%20aanvragen%20voor%3A%0A%0A'; }} style={{
            background: PALETTE.ink, color: PALETTE.bg, border:'none',
            padding: '20px 32px', fontFamily: SANS, fontSize: 15,
            letterSpacing: '0.02em', cursor:'pointer',
            display:'flex', alignItems:'center', gap: 12,
          }}>
            Vraag een offerte aan
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div style={{fontFamily: MONO, fontSize: 13, color: PALETTE.muted}}>
            of · leander@vande-ginste.be
          </div>
        </div>

        <div style={{
          display:'flex', gap: 40, marginTop: 48,
          opacity: animate({from:0,to:1,start:2.2,end:2.8})(localTime),
        }}>
          {[
            ['Sanitair', 'op maat'],
            ['Verwarming', 'gas · warmtepomp'],
            ['Ventilatie', 'D-systemen'],
          ].map(([n, l], i) => (
            <div key={i}>
              <div style={{fontFamily: SERIF, fontSize: 30, color: PALETTE.ink, letterSpacing:'-0.01em'}}>{n}</div>
              <div style={{fontFamily: MONO, fontSize: 11, letterSpacing:'0.14em', textTransform:'uppercase', color: PALETTE.muted, marginTop: 4}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating caption over image */}
      <div style={{
        position:'absolute', right: 40, top: 280,
        width: 240, color: '#f5f1e8',
        fontFamily: MONO, fontSize: 11, letterSpacing:'0.14em', textTransform:'uppercase',
        lineHeight: 1.7,
        opacity: animate({from:0,to:1,start:1.3,end:1.9})(localTime),
      }}>
        <div style={{width:40, height:1, background:'rgba(245,241,232,0.6)', marginBottom:14}}/>
        Privéwoning<br/>
        West-Vlaanderen<br/>
        Renovatie sanitair
      </div>
    </>
  );
}

// ── Top bar: small metadata strip shared across scenes ──────────────────────
function TopBar({ time, dark }) {
  const color = dark ? PALETTE.muted : 'rgba(245,241,232,0.7)';
  const accent = dark ? PALETTE.ink : '#f5f1e8';
  const rev = animate({from:0,to:1,start:0,end:0.4})(time);
  return (
    <div style={{
      position: 'absolute', left: 80, right: 80, top: 44,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      opacity: rev,
      fontFamily: MONO, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
      color,
    }}>
      <div style={{display:'flex', alignItems:'center', gap: 14, color: accent}}>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <rect x="2" y="2" width="18" height="18" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M6 11h10M11 6v10" stroke="currentColor" strokeWidth="1.2"/>
        </svg>
        <span style={{fontFamily: SERIF, fontSize: 22, letterSpacing:'-0.01em', textTransform: 'none', color: accent}}>Vande Ginste</span>
        <span style={{color}}>Installatie &amp; Sanitair</span>
      </div>
      <div style={{display:'flex', gap: 32}}>
        <span>Werk</span>
        <span>Proces</span>
        <span>Merken</span>
        <span>Contact</span>
      </div>
    </div>
  );
}

// ── Main composition ────────────────────────────────────────────────────────
function HeroVideo() {
  // Scenes, each 6s, with 0.4s crossfade via overlap
  const DUR = 50;
  return (
    <Stage width={1920} height={1080} duration={DUR} background={PALETTE.bg} persistKey="hvac-hero">
      <Sprite start={0} end={10.5}><SceneOpener /></Sprite>
      <Sprite start={10} end={20.5}><SceneServices /></Sprite>
      <Sprite start={20} end={30.5}><SceneDetail /></Sprite>
      <Sprite start={30} end={40.5}><SceneProcess /></Sprite>
      <Sprite start={40} end={50}><SceneCTA /></Sprite>

      {/* Persistent scene marker in corner */}
      <SceneMarker />
    </Stage>
  );
}

function SceneMarker() {
  const t = useTime();
  const scenes = ['Intro', 'Diensten', 'Detail', 'Proces', 'Contact'];
  const i = t < 10 ? 0 : t < 20 ? 1 : t < 30 ? 2 : t < 40 ? 3 : 4;
  const darkScenes = [true, false, true, true, false];
  const color = darkScenes[i] ? 'rgba(245,241,232,0.5)' : 'rgba(26,24,20,0.5)';
  return (
    <div style={{
      position:'absolute', right: 80, bottom: 44,
      fontFamily: MONO, fontSize: 11, letterSpacing:'0.18em', textTransform:'uppercase',
      color, display:'flex', gap: 18, alignItems:'center',
    }}>
      <span>{String(i+1).padStart(2,'0')} / 05</span>
      <span style={{width: 22, height: 1, background: 'currentColor', opacity: 0.5}}/>
      <span>{scenes[i]}</span>
    </div>
  );
}

Object.assign(window, { HeroVideo, PALETTE, SERIF, SANS, MONO });

// Render once this file finishes executing — ensures animations.jsx globals exist
const __root = ReactDOM.createRoot(document.getElementById('root'));
__root.render(<HeroVideo />);
