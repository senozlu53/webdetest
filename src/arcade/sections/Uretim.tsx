import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { cx } from '../../shared/cx'
import { useArcade } from '../lib/store'
import { PALET, PALET_AD, SPRITE, png, type PaletKod } from '../lib/sprites'
import type { Ton } from '../lib/data'
import { ArcadeText, type Boyut } from '../components/ArcadeText'
import { HealthBar, type BarTur } from '../components/HealthBar'
import { PixelContainer } from '../components/PixelContainer'
import { Sprite } from '../components/Sprite'
import { Aralik, Anahtar, Kod, Section, Secim } from '../components/ui'

const TONLAR: { id: Ton; ad: string }[] = [
  { id: 'sari', ad: 'Sarı' },
  { id: 'kirmizi', ad: 'Kırmızı' },
  { id: 'yesil', ad: 'Yeşil' },
  { id: 'camgobegi', ad: 'Camgöbeği' },
]

/** Madde 14: üç bileşen, canlı ayarlarla ve üretilen JSX ile */
export function Bilesenler() {
  const [hp, setHp] = useState(64)
  const [bolum, setBolum] = useState<'10' | '20' | '40'>('20')
  const [tur, setTur] = useState<BarTur>('can')
  const [metin, setMetin] = useState('Insert coin')
  const [boy, setBoy] = useState<Boyut>('m')
  const [ton, setTon] = useState<Ton>('sari')
  const [neon, setNeon] = useState(true)
  const [sapma, setSapma] = useState(false)
  const [yanip, setYanip] = useState(true)
  const [kTon, setKTon] = useState<Ton>('yesil')
  const [golge, setGolge] = useState(2)
  const [basamak, setBasamak] = useState<'1' | '2'>('1')
  const [dolu, setDolu] = useState(false)
  const bool = (ad: string, v: boolean) => (v ? ` ${ad}` : '')
  return (
    <Section id="bilesenler" madde="Madde 14 · React" title="Üç bileşen" lead="<PixelContainer>, <ArcadeText> ve <HealthBar>. Hepsi --u birimiyle çizer; ölçek değişince birlikte büyür. Ayarları değiştirin, JSX altta güncellenir.">
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <PixelContainer ton="yesil" className="grid min-w-0 content-start gap-5 p-5">
          <ArcadeText as="h3" boyut="s" ton="yesil">
            {'<HealthBar>'}
          </ArcadeText>
          <HealthBar etiket={tur === 'yukleme' ? 'Yükleniyor' : tur === 'mana' ? 'Mana' : tur === 'xp' ? 'Deneyim' : 'Can'} deger={hp} max={100} bolum={+bolum} tur={tur} />
          <Aralik label="Değer" value={hp} min={0} max={100} onChange={setHp} />
          <Secim<BarTur> legend="Tür" name="hb-tur" value={tur} onChange={setTur} ton="yesil" options={[{ id: 'can', ad: 'Can' }, { id: 'mana', ad: 'Mana' }, { id: 'xp', ad: 'XP' }, { id: 'yukleme', ad: 'Yükle' }]} />
          <Secim legend="Segment" name="hb-bolum" value={bolum} onChange={setBolum} ton="yesil" options={[{ id: '10', ad: '10' }, { id: '20', ad: '20' }, { id: '40', ad: '40' }]} />
          <Kod label="HealthBar JSX">{`<HealthBar\n  etiket="Can"\n  deger={${hp}} max={100}\n  bolum={${bolum}} tur="${tur}"\n/>`}</Kod>
        </PixelContainer>
        <PixelContainer ton="sari" className="grid min-w-0 content-start gap-5 p-5">
          <ArcadeText as="h3" boyut="s" ton="sari">
            {'<ArcadeText>'}
          </ArcadeText>
          <div className="grid min-h-[calc(var(--u)*30)] place-items-center overflow-hidden bg-bg p-3 text-center shadow-[0_0_0_var(--u)_var(--lo-white)]">
            <ArcadeText boyut={boy} ton={ton} neon={neon} sapma={sapma} yanip={yanip} className="max-w-full break-words" lang="en">
              {metin || ' '}
            </ArcadeText>
          </div>
          <label className="grid gap-2">
            <span className="kicker text-muted">Metin</span>
            <input value={metin} onChange={(e) => setMetin(e.target.value.slice(0, 24))} className="px m-1 bg-bg px-3 py-2 text-body text-ink" data-golge="0" />
          </label>
          <Secim<Boyut> legend="Boyut" name="at-boy" value={boy} onChange={setBoy} options={[{ id: 's', ad: 'S' }, { id: 'm', ad: 'M' }, { id: 'l', ad: 'L' }]} />
          <Secim<Ton> legend="Ton" name="at-ton" value={ton} onChange={setTon} options={TONLAR} />
          <div className="grid gap-4">
            <Anahtar label="Neon (basamaklı hale)" checked={neon} onChange={setNeon} />
            <Anahtar label="Renk sapması" checked={sapma} onChange={setSapma} />
            <Anahtar label="Yanıp sönme (1 Hz)" checked={yanip} onChange={setYanip} />
          </div>
          <Kod label="ArcadeText JSX">{`<ArcadeText boyut="${boy}" ton="${ton}"${bool('neon', neon)}${bool('sapma', sapma)}${bool('yanip', yanip)}>\n  ${metin}\n</ArcadeText>`}</Kod>
        </PixelContainer>
        <PixelContainer ton="camgobegi" className="grid min-w-0 content-start gap-5 p-5">
          <ArcadeText as="h3" boyut="s" ton="camgobegi">
            {'<PixelContainer>'}
          </ArcadeText>
          <div className="grid min-h-[calc(var(--u)*30)] place-items-center p-3">
            <PixelContainer ton={kTon} golge={golge as 0 | 1 | 2 | 3 | 4} basamak={+basamak as 1 | 2} dolu={dolu} className="px-5 py-3 font-ps text-s uppercase">
              Oyuncu 1
            </PixelContainer>
          </div>
          <Secim<Ton> legend="Ton" name="pc-ton" value={kTon} onChange={setKTon} ton="camgobegi" options={TONLAR} />
          <Aralik label="Gölge" value={golge} min={0} max={4} onChange={setGolge} format={(v) => `${v} piksel`} />
          <Secim legend="Köşe basamağı" name="pc-bas" value={basamak} onChange={setBasamak} ton="camgobegi" options={[{ id: '1', ad: '1' }, { id: '2', ad: '2' }]} />
          <Anahtar label="Dolu zemin" checked={dolu} onChange={setDolu} />
          <Kod label="PixelContainer JSX">{`<PixelContainer ton="${kTon}"\n  golge={${golge}} basamak={${basamak}}${bool('dolu', dolu)}>\n  Oyuncu 1\n</PixelContainer>`}</Kod>
        </PixelContainer>
      </div>
    </Section>
  )
}

const N = 16
const PKODLAR = Object.keys(PALET) as PaletKod[]

/**
 * Madde 12 · 13: 1×1 piksel ızgarası. İmleç koordinatı tam sayıya yuvarlanır (Snap to Pixel):
 * boyama hiçbir zaman iki hücrenin arasına düşmez. Önizlemeler 1x çizimin tam sayı katları.
 */
export function Figma() {
  const [izgara, setIzgara] = useState<string[]>(() => SPRITE.kupa.flatMap((r) => [...r]))
  const [renk, setRenk] = useState<PaletKod | '.'>('r')
  const [imlec, setImlec] = useState({ x: 7, y: 7 })
  const [url, setUrl] = useState('')
  const cv = useRef<HTMLCanvasElement>(null)
  const basili = useRef(false)
  useEffect(() => {
    const ctx = cv.current?.getContext('2d')
    if (!ctx || !cv.current) return
    ctx.clearRect(0, 0, N, N)
    izgara.forEach((ch, i) => {
      if (ch === '.') return
      ctx.fillStyle = PALET[ch as PaletKod]
      ctx.fillRect(i % N, Math.floor(i / N), 1, 1)
    })
    setUrl(cv.current.toDataURL('image/png'))
  }, [izgara])
  const boya = (x: number, y: number) => setIzgara((g) => (g[y * N + x] === renk ? g : g.map((v, i) => (i === y * N + x ? renk : v))))
  const konum = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    // Snap to pixel: tam sayıya yuvarla
    const x = Math.min(N - 1, Math.max(0, Math.floor(((e.clientX - r.left) / r.width) * N)))
    const y = Math.min(N - 1, Math.max(0, Math.floor(((e.clientY - r.top) / r.height) * N)))
    return { x, y }
  }
  const tus = (e: KeyboardEvent) => {
    const d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key]
    if (d) {
      e.preventDefault()
      const adim = e.shiftKey ? 8 : 1
      setImlec((m) => ({ x: Math.min(N - 1, Math.max(0, m.x + d[0] * adim)), y: Math.min(N - 1, Math.max(0, m.y + d[1] * adim)) }))
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      boya(imlec.x, imlec.y)
    }
  }
  const renkAd = renk === '.' ? 'Silgi' : PALET_AD[renk]
  return (
    <Section id="figma" madde="Madde 12 · 13 · Figma" title="1×1 piksel ızgarası" ton="kirmizi" lead="Figma'da Pixel grid ve Snap to pixel grid açık, nudge 1 piksel, büyük nudge 8. Aşağıdaki editör aynı kuralla çalışır: fare nereye gelirse gelsin koordinat tam sayıya oturur.">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <PixelContainer ton="kirmizi" className="min-w-0 p-5">
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Renk">
            {[...PKODLAR, '.' as const].map((k) => (
              <button key={k} type="button" role="radio" aria-checked={renk === k} aria-label={k === '.' ? 'Silgi (saydam)' : `${PALET_AD[k]} ${PALET[k]}`} onClick={() => setRenk(k)} className={cx('size-[calc(var(--u)*10)] shrink-0', k === '.' && 'dama', renk === k ? 'shadow-[0_0_0_var(--u)_var(--bg),0_0_0_calc(var(--u)*2)_var(--edge)]' : 'shadow-[0_0_0_1px_var(--lo-white)]')} style={k === '.' ? undefined : { background: PALET[k] }} />
            ))}
          </div>
          <div
            className="dama relative mt-5 aspect-square w-full max-w-[calc(var(--u)*160)] cursor-crosshair touch-none"
            tabIndex={0}
            role="application"
            aria-roledescription="piksel editörü"
            aria-label={`16×16 piksel editörü. Oklar imleci 1 piksel taşır, Shift ile 8. Boşluk boyar. İmleç ${imlec.x}, ${imlec.y}. Renk ${renkAd}.`}
            onKeyDown={tus}
            onPointerDown={(e) => {
              basili.current = true
              e.currentTarget.setPointerCapture(e.pointerId)
              const k = konum(e)
              setImlec(k)
              boya(k.x, k.y)
            }}
            onPointerMove={(e) => {
              const k = konum(e)
              setImlec(k)
              if (basili.current) boya(k.x, k.y)
            }}
            onPointerUp={() => (basili.current = false)}
            onPointerCancel={() => (basili.current = false)}
            data-editor=""
          >
            <img src={url || png('kupa')} alt="" className="pixelated absolute inset-0 size-full" draggable={false} />
            <span className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right, var(--lo-white) 1px, transparent 1px), linear-gradient(to bottom, var(--lo-white) 1px, transparent 1px)', backgroundSize: `${100 / N}% ${100 / N}%` }} aria-hidden="true" />
            <span className="pointer-events-none absolute shadow-[inset_0_0_0_var(--u)_var(--focus)]" style={{ left: `${(imlec.x * 100) / N}%`, top: `${(imlec.y * 100) / N}%`, width: `${100 / N}%`, height: `${100 / N}%` }} aria-hidden="true" />
          </div>
          <p className="mt-4 tabnum" aria-live="polite">
            X {imlec.x} · Y {imlec.y} · {renkAd}
          </p>
          <canvas ref={cv} width={N} height={N} className="hidden" />
        </PixelContainer>
        <div className="grid min-w-0 content-start gap-8">
          <PixelContainer className="min-w-0 p-5">
            <ArcadeText as="h3" boyut="s">
              Önizleme
            </ArcadeText>
            <div className="mt-5 flex flex-wrap items-end gap-6">
              {[1, 2, 4].map((k) => (
                <figure key={k} className="m-0 grid justify-items-center gap-2">
                  <img src={url || png('kupa')} alt={`Çizim ${k}x`} className="pixelated dama" style={{ width: `calc(var(--u) * ${16 * k})`, height: `calc(var(--u) * ${16 * k})` }} />
                  <figcaption className="tabnum">{k}x</figcaption>
                </figure>
              ))}
            </div>
            <p className="mt-4 text-muted">Dışa aktarım 1x PNG. Büyütme kodda: image-rendering: pixelated. Büyütülmüş PNG saklanmaz, çünkü tasarım aracı ölçeklerken yumuşatabilir.</p>
          </PixelContainer>
          <PixelContainer className="min-w-0 p-5">
            <ArcadeText as="h3" boyut="s">
              Figma ayarları
            </ArcadeText>
            <ul className="m-0 mt-4 grid list-none gap-2 p-0">
              {[
                ['View › Pixel grid', 'Açık'],
                ['View › Snap to pixel grid', 'Açık'],
                ['Layout grid', '1 × 1 px'],
                ['Nudge / Big nudge', '1 / 8 px'],
                ['Çerçeve', '1x çizim, 160 × 144'],
                ['Görsel', 'Anti-aliasing kapalı, 1x'],
              ].map(([a, b]) => (
                <li key={a} className="flex flex-wrap justify-between gap-x-4">
                  <span lang="en">{a}</span>
                  <span className="text-[var(--t-green)]">{b}</span>
                </li>
              ))}
            </ul>
          </PixelContainer>
        </div>
      </div>
      <div className="mt-8">
        <Kod label="Figma tokenları, W3C DTCG">{`{
  "Effects": {
    "CRTScanline": {
      "$type": "string",
      "$value": "repeating-linear-gradient(to bottom, transparent 0 calc(1u - 1px), rgb(0 0 0 / .34) 0 1u)",
      "period": "1u", "line": "1px", "opacity": 0.34
    }
  },
  "Typography": {
    "PixelBody": {
      "$type": "typography",
      "$value": { "fontFamily": "VT323", "fontSize": "20 / 24 / 28px", "lineHeight": 1.2 }
    }
  }
}`}</Kod>
      </div>
    </Section>
  )
}

/** Madde 15: image-rendering. Aynı 16×16 sprite üç kuralla ve seçilen katla */
export function Css() {
  const { olcek } = useArcade()
  const [kat, setKat] = useState(6)
  // Bir sprite pikseli = kat × --u = kat × aygit aygıt pikseli. Tam sayı değilse sütunlar eşit çıkmaz
  const aygit = Math.round(kat * olcek.aygit * 100) / 100
  const tam = Number.isInteger(aygit)
  const kurallar = [
    ['auto', 'Tarayıcı varsayılanı: çift doğrusal süzme. Kenarlar bulanık, renkler karışır.', 'kirmizi'],
    ['pixelated', 'En yakın komşu. Her piksel kare kalır. Bu stilin kuralı.', 'yesil'],
    ['crisp-edges', 'Kenarı koruyan algoritma; tarayıcıya bırakılır (Firefox destekler, Chrome pixelated gibi davranır).', 'sari'],
  ] as const
  return (
    <Section id="css" madde="Madde 15 · CSS / Tailwind" title="Bulanık piksel yok" ton="yesil" lead="Küçük bir görsel büyütülünce tarayıcı araya renk üretir. image-rendering: pixelated bunu kapatır. Kural görsele, tuvale ve arka plan görseline uygulanır.">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {kurallar.map(([k, a, t]) => (
          <PixelContainer key={k} ton={t} className="grid min-w-0 content-start gap-4 p-5">
            <p className="font-vt text-body-l">
              image-rendering: <span data-ton={t} className="text-tx">{k}</span>
            </p>
            <div className="dama grid h-[calc(var(--u)*110)] place-items-center overflow-hidden">
              <img src={png('kalp')} alt={`Kalp, ${kat}x, ${k}`} style={{ imageRendering: k, width: `calc(var(--u) * ${16 * kat})`, height: `calc(var(--u) * ${16 * kat})` }} />
            </div>
            <p className="text-muted">{a}</p>
          </PixelContainer>
        ))}
      </div>
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <PixelContainer className="min-w-0 p-5">
          <Aralik label="Büyütme" value={kat} min={1} max={6} step={0.1} onChange={setKat} format={(v) => `${v.toFixed(1).replace('.', ',')}x · ${String(Math.round(v * olcek.aygit * 100) / 100).replace('.', ',')} aygıt px`} />
          <p className={cx('mt-4', !tam && 'text-[var(--t-red)]')} aria-live="polite" data-kesir={tam ? undefined : ''}>
            {tam ? 'Tam sayı: her sprite pikseli aynı sayıda aygıt pikseli kaplar. pixelated ile kusursuz.' : 'Kesirli: pixelated bile olsa bazı sütunlar bir piksel ince, bazıları kalın kalır; kalbin iki yarısı farklı görünür. Bu yüzden Madde 17 tam sayı ölçek ister.'}
          </p>
          <div className="mt-5 flex items-end gap-4">
            <Sprite ad="kalp" buyukluk={1} alt="Kalp 1x" />
            <Sprite ad="kalp" buyukluk={2} alt="Kalp 2x" />
          </div>
        </PixelContainer>
        <Kod label="CSS ve Tailwind">{`/* Tailwind v4: kendi yardımcı sınıfı */
@utility pixelated { image-rendering: pixelated; }
@utility crisp     { image-rendering: crisp-edges; }

<img class="pixelated w-16 h-16" src="kalp-16.png">
<div class="[image-rendering:pixelated] bg-[url(serit.png)]">

/* Tuval */
ctx.imageSmoothingEnabled = false

/* Yazı: kenar yumuşatma kapalı (macOS) */
-webkit-font-smoothing: none;`}</Kod>
      </div>
    </Section>
  )
}
