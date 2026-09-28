import { useMemo, useState, type CSSProperties } from 'react'
import { useY2K, type Tone } from '../lib/store'
import { enKotu, karis, oran } from '../lib/contrast'
import { Y2KCard } from '../components/Y2KCard'
import { ChromeButton, type Boyut } from '../components/ChromeButton'
import { Badge } from '../components/Badge'
import { Marquee } from '../components/Marquee'
import { Starburst } from '../components/Shapes'
import { IconPlay, IconSparkle } from '../components/Icons'
import { Chips, Code, Range, Section } from '../components/ui'

const TONLAR: [Tone, string][] = [
  ['chrome', 'Krom'],
  ['candy', 'Sakız'],
  ['icy', 'Buz'],
  ['grape', 'Üzüm'],
]
const BOYUTLAR: Boyut[] = ['sm', 'md', 'lg']

const KOD_BUTON = `<ChromeButton ton="candy" boyut="lg" ikon={<IconPlay />}>
  Dinlemeye başla
</ChromeButton>

// Zemin: parlama + metal (iki gradyan), derinlik: dört iç gölge
.chrome {
  background-image:
    linear-gradient(180deg, #fffc 0%, #fff3 46%, transparent 50%),
    linear-gradient(135deg, #FFF 0%, #B0C4DE 50%, #778899 100%);
  box-shadow: var(--bevel); /* Effects/GlossyBevel */
}`

const KOD_KART = `<Y2KCard as="article">
  <h3>Kelebek toka seti</h3>
  <Badge ton="candy">Yeni</Badge>
</Y2KCard>

/* Krom çerçeve: iki arka plan, biri padding-box biri border-box */
.rim {
  border: var(--cb) solid transparent; /* 5px, mobilde 3px */
  background:
    linear-gradient(var(--surface), var(--surface)) padding-box,
    linear-gradient(135deg, #fff, #b0c4de 30%, #778899 52%,
      #f5f8fc 64%, #8a99ae) border-box;
}`

const KOD_KAYAN = `<Marquee
  label="Duyurular"
  hiz={60}        // px/sn, içerikten bağımsız
  ters={false}
  items={['Milenyum FM 20.00', 'Yeni single: Buz Kalp']}
/>`

/** Madde 11 · 14: <ChromeButton>, <Y2KCard>, <Marquee>, rozetler */
export function Components() {
  const { duyur } = useY2K()
  const [basma, setBasma] = useState(0)
  const [hiz, setHiz] = useState(80)
  const [yon, setYon] = useState<'sola' | 'saga'>('sola')
  const bas = () => {
    setBasma((n) => n + 1)
    duyur(`Basıldı: ${basma + 1}`)
  }
  return (
    <Section id="bilesenler" kicker="Madde 11 · 14 · Bileşenler" title="Kapsül düğme, rozet, kayan şerit" lead="Üç React bileşeni: ChromeButton, Y2KCard ve Marquee. Her birinde metin zeminin tam zıttı; krom, buz ve sakız üstünde siyah, üzüm moru üstünde beyaz.">
      <Y2KCard labelledBy="btn-b">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h3 id="btn-b" className="display text-[22px]">
            &lt;ChromeButton&gt;
          </h3>
          <p className="font-mono text-[13px]" aria-hidden="true">
            basıldı: {basma}
          </p>
        </div>
        <div className="mt-5 space-y-4">
          {TONLAR.map(([t, ad]) => (
            <div key={t} className="flex flex-wrap items-center gap-3">
              <span className="w-16 font-logo text-[11px] uppercase">{ad}</span>
              {BOYUTLAR.map((b) => (
                <ChromeButton key={b} ton={t} boyut={b} onClick={bas}>
                  {ad} {b}
                </ChromeButton>
              ))}
              <ChromeButton ton={t} yuvarlak ikon={<IconPlay size={18} />} aria-label={`${ad}: çal`} onClick={bas} />
              <ChromeButton ton={t} disabled>
                Pasif
              </ChromeButton>
            </div>
          ))}
        </div>
      </Y2KCard>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Y2KCard labelledBy="rozet-b">
          <h3 id="rozet-b" className="display text-[22px]">
            Rozetler
          </h3>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Badge ton="candy">Yeni</Badge>
            <Badge ton="icy">2000 hazır</Badge>
            <Badge ton="chrome">Sınırlı</Badge>
            <Badge ton="grape">%30</Badge>
            <Badge ton="candy">
              <IconSparkle size={12} /> Çok satan
            </Badge>
            <Starburst size={92} ton="chrome">
              Y2K
            </Starburst>
            <Starburst size={92} ton="candy" points={20}>
              Canlı
            </Starburst>
          </div>
          <p className="mt-4 text-[14px] text-muted">Yüksek kontrast: siyah yazı pembe üstünde 8,02:1, buz üstünde 16,59:1; beyaz yazı mor üstünde 16,42:1.</p>
        </Y2KCard>
        <Y2KCard labelledBy="kayan-b">
          <h3 id="kayan-b" className="display text-[22px]">
            &lt;Marquee&gt;
          </h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Range label="Hız" value={hiz} min={20} max={200} step={10} onChange={setHiz} format={(x) => `${x} px/sn`} />
            <Chips
              legend="Yön"
              name="kayan-yon"
              value={yon}
              onChange={setYon}
              options={[
                { id: 'sola', ad: 'Sola' },
                { id: 'saga', ad: 'Sağa' },
              ]}
            />
          </div>
        </Y2KCard>
      </div>
      <Marquee className="mt-6" label="Örnek şerit" hiz={hiz} ters={yon === 'saga'} items={['Parlak şerit', `${hiz} px/sn`, yon === 'sola' ? 'Sola kayar' : 'Sağa kayar', 'Üstüne gelince durur']} />
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <figure className="min-w-0">
          <figcaption className="kicker mb-2 text-muted">ChromeButton</figcaption>
          <Code label="ChromeButton kodu">{KOD_BUTON}</Code>
        </figure>
        <figure className="min-w-0">
          <figcaption className="kicker mb-2 text-muted">Y2KCard</figcaption>
          <Code label="Y2KCard kodu">{KOD_KART}</Code>
        </figure>
        <figure className="min-w-0">
          <figcaption className="kicker mb-2 text-muted">Marquee</figcaption>
          <Code label="Marquee kodu">{KOD_KAYAN}</Code>
        </figure>
      </div>
    </Section>
  )
}

interface Katman {
  id: string
  ad: string
  tur: 'fill' | 'shadow'
  css: string
}
const KATMANLAR: Katman[] = [
  { id: 'parlama', ad: 'Gradient Fill · Parlama (üst yarı)', tur: 'fill', css: 'linear-gradient(180deg, rgb(255 255 255 / 0.75) 0%, rgb(255 255 255 / 0.18) 46%, transparent 50%)' },
  { id: 'metal', ad: 'Gradient Fill · Y2KMetal', tur: 'fill', css: 'linear-gradient(135deg, #FFF 0%, #B0C4DE 50%, #778899 100%)' },
  { id: 'ust', ad: 'Inner Shadow · üst ışık', tur: 'shadow', css: 'inset 0 2px 0 rgb(255 255 255 / 0.95)' },
  { id: 'alt', ad: 'Inner Shadow · alt gölge', tur: 'shadow', css: 'inset 0 -3px 5px rgb(30 40 60 / 0.45)' },
  { id: 'sol', ad: 'Inner Shadow · sol parlama', tur: 'shadow', css: 'inset 3px 0 4px rgb(255 255 255 / 0.55)' },
  { id: 'sag', ad: 'Inner Shadow · sağ kenar', tur: 'shadow', css: 'inset -3px 0 4px rgb(50 60 80 / 0.3)' },
  { id: 'kenar', ad: 'Inner Shadow · iç çizgi', tur: 'shadow', css: 'inset 0 0 0 1px rgb(255 255 255 / 0.45)' },
]
const TOKENLAR: [string, string, string][] = [
  ['Color/ChromeSilver', 'color', '#E0E5EC'],
  ['Color/IceBlue', 'color', '#A5F2F3'],
  ['Color/BubblegumPink', 'color', '#FF66CC'],
  ['Color/DeepPurple', 'color', '#2E0854'],
  ['Gradient/Y2KMetal', 'gradient', 'linear 135°: #FFF 0% · #B0C4DE 50% · #778899 100%'],
  ['Effects/GlossyBevel', 'shadow', '5 iç gölge: üst ışık, alt gölge, sol parlama, sağ kenar, iç çizgi'],
  ['Border/ChromeRim', 'dimension', '5px (masaüstü) · 3px (mobil)'],
]

/** Madde 12 · 13: krom, aynı bileşende üst üste binen gradyan dolgular ve iç gölgelerden kurulur */
export function Figma() {
  const [acik, setAcik] = useState<string[]>(KATMANLAR.map((k) => k.id))
  const secili = KATMANLAR.filter((k) => acik.includes(k.id))
  const fills = secili.filter((k) => k.tur === 'fill').map((k) => k.css)
  const shadows = secili.filter((k) => k.tur === 'shadow').map((k) => k.css)
  const stil: CSSProperties = { backgroundColor: '#E0E5EC', backgroundImage: fills.join(', ') || 'none', boxShadow: shadows.join(', ') || 'none' }
  const kod = `.krom {\n  background-color: #E0E5EC;\n  background-image:${fills.length ? '\n    ' + fills.join(',\n    ') : ' none'};\n  box-shadow:${shadows.length ? '\n    ' + shadows.join(',\n    ') : ' none'};\n}`
  return (
    <Section id="figma" kicker="Madde 12 · 13 · Figma" title="Krom, yedi katmandan" lead="Figma'da krom tek bir dolgu değil: aynı bileşende iki gradyan dolgu ve beş iç gölge üst üste. Katmanları tek tek kapatıp açarak metalin nasıl kurulduğunu görün.">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Y2KCard className="lg:col-span-5" labelledBy="katman-b">
          <h3 id="katman-b" className="display text-[20px]">
            Katman paneli
          </h3>
          <fieldset className="mt-4">
            <legend className="kicker mb-2 text-muted">Üstten alta, {secili.length} / 7 açık</legend>
            <ul className="space-y-2">
              {KATMANLAR.map((k) => (
                <li key={k.id}>
                  <label className="flex cursor-pointer items-center gap-3 rounded-full border border-[#2b3445]/40 px-3 py-2 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-[var(--focus)]">
                    <input type="checkbox" checked={acik.includes(k.id)} onChange={(e) => setAcik((l) => (e.target.checked ? [...l, k.id] : l.filter((x) => x !== k.id)))} className="size-5 accent-[#ff66cc]" />
                    <span className="text-[14px] font-semibold">{k.ad}</span>
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>
        </Y2KCard>
        <div className="grid gap-6 lg:col-span-7">
          <Y2KCard labelledBy="onizleme-b">
            <h3 id="onizleme-b" className="display text-[20px]">
              Önizleme
            </h3>
            <div className="mt-5 grid place-items-center py-6">
              <span className="grid h-24 w-full max-w-[420px] place-items-center rounded-full border border-[#2b3445]/55 font-logo text-[22px] tracking-[0.12em] text-black uppercase" style={stil} data-katman={secili.length}>
                Krom
              </span>
            </div>
          </Y2KCard>
          <Code label="Birleşik CSS">{kod}</Code>
        </div>
      </div>
      <h3 id="tokenlar" className="display mt-12 text-[26px]">
        Madde 13: tokenlar
      </h3>
      <div className="rim mt-5 overflow-x-auto rounded-[28px] p-0" tabIndex={0} role="region" aria-label="Token tablosu, yatay kaydırılabilir">
        <table className="w-full min-w-[560px] text-left">
          <caption className="sr-only">Figma token adları, türleri ve değerleri</caption>
          <thead>
            <tr className="border-b border-[#2b3445]/30">
              {['Token', 'Tür', 'Değer'].map((h) => (
                <th key={h} scope="col" className="kicker px-4 py-3 text-muted">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TOKENLAR.map(([ad, tur, deger]) => (
              <tr key={ad} className="border-b border-[#2b3445]/20 last:border-0">
                <th scope="row" className="px-4 py-3 font-mono text-[13px] font-semibold">
                  {ad}
                </th>
                <td className="px-4 py-3 text-[14px]">{tur}</td>
                <td className="px-4 py-3 text-[14px]">{deger}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  )
}

/** Madde 15: karmaşık çoklu gradyan kurgusu */
export function Gradient() {
  const [aci, setAci] = useState(135)
  const [parlama, setParlama] = useState(true)
  const [tarama, setTarama] = useState(false)
  const [isilti, setIsilti] = useState(true)
  const [gokkusagi, setGokkusagi] = useState(false)
  const katmanlar = useMemo(() => {
    const l: string[] = []
    if (isilti) l.push('radial-gradient(circle at 18% 30%, #fff 0 2px, transparent 3px)', 'radial-gradient(circle at 72% 64%, #fff 0 1.5px, transparent 2.5px)')
    if (tarama) l.push('repeating-linear-gradient(0deg, rgb(0 0 0 / 0.06) 0 1px, transparent 1px 4px)')
    if (parlama) l.push('linear-gradient(180deg, rgb(255 255 255 / 0.7) 0%, rgb(255 255 255 / 0.15) 46%, transparent 50%)')
    if (gokkusagi) l.push('linear-gradient(100deg, transparent 30%, rgb(255 102 204 / 0.25) 45%, rgb(165 242 243 / 0.3) 55%, transparent 70%)')
    l.push(`linear-gradient(${aci}deg, #FFF 0%, #B0C4DE 50%, #778899 100%)`)
    return l
  }, [aci, parlama, tarama, isilti, gokkusagi])
  const kod = `background-image:\n  ${katmanlar.join(',\n  ')};`
  const enKoyu = tarama ? karis('#778899', '#000000', 0.06) : '#778899'
  const en = enKotu('#000000', ['#FFFFFF', '#B0C4DE', enKoyu])
  return (
    <Section id="css" kicker="Madde 15 · CSS" title="Gradyanın üstüne gradyan" lead="Temel katman tanımdaki gradyanın kendisi: linear-gradient(135deg, #FFF 0%, #B0C4DE 50%, #778899 100%). Üstüne parlama, tarama çizgisi, ışıltı ve gökkuşağı yansıması eklenir.">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Y2KCard className="lg:col-span-5" labelledBy="lab-b">
          <h3 id="lab-b" className="display text-[20px]">
            Gradyan laboratuvarı
          </h3>
          <div className="mt-4 space-y-4">
            <Range id="aci" label="Açı" value={aci} min={0} max={360} step={5} onChange={setAci} format={(x) => `${x}°`} />
            {(
              [
                ['Parlama katmanı', parlama, setParlama],
                ['Tarama çizgileri', tarama, setTarama],
                ['Işıltı noktaları', isilti, setIsilti],
                ['Gökkuşağı yansıması', gokkusagi, setGokkusagi],
              ] as const
            ).map(([ad, val, set]) => (
              <label key={ad} className="flex cursor-pointer items-center gap-3 font-semibold">
                <input type="checkbox" checked={val} onChange={(e) => set(e.target.checked)} className="size-5 accent-[#ff66cc]" /> {ad}
              </label>
            ))}
          </div>
          <p className="mt-5 text-[14px]">
            Katman sayısı: <strong>{katmanlar.length}</strong>. Siyah metin en koyu noktada: <strong data-en-kotu="">{oran(en)}</strong>
          </p>
        </Y2KCard>
        <div className="grid gap-6 lg:col-span-7">
          <div className="grid h-56 place-items-center rounded-[36px] border border-[#2b3445]/55 shadow-[var(--bevel)]" style={{ backgroundImage: katmanlar.join(', ') }} data-gradyan="">
            <span className="font-logo text-[clamp(26px,5vw,48px)] tracking-[0.1em] text-black uppercase">Krom 2000</span>
          </div>
          <Code label="Gradyan CSS">{kod}</Code>
        </div>
      </div>
    </Section>
  )
}

