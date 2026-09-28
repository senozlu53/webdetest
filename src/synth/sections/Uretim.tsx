import { useEffect, useRef, useState } from 'react'
import { cx } from '../../shared/cx'
import { WireframeGrid } from '../components/WireframeGrid'
import { NeonButton } from '../components/NeonButton'
import { RetroCard } from '../components/RetroCard'
import { Ikon } from '../components/Icons'
import { Kod, NeonSlider, NeonSwitch, Section, Secim } from '../components/ui'

/** Madde 11 · 14: <WireframeGrid>, <NeonButton>, <RetroCard> ve neon form öğeleri */
export function Bilesenler() {
  const [renk, setRenk] = useState<'pink' | 'cyan'>('pink')
  const [hiz, setHiz] = useState(1.2)
  const [egim, setEgim] = useState(76)
  const [hucre, setHucre] = useState(60)
  const [gunes, setGunes] = useState(true)
  const [akis, setAkis] = useState(true)
  return (
    <Section id="bilesenler" madde="Madde 11 · 14 · React" title="Üç" script="bileşen" lead="<WireframeGrid> ızgarayı CSS 3B ile yatırır ve arka plan konumunu bir hücre kaydırarak sonsuz akış yaratır. <NeonButton> ve <RetroCard> aynı üç katmanlı parlamayı kullanır.">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="min-w-0 overflow-hidden rounded-[10px] border-2 border-line">
          <WireframeGrid className="h-[340px]" renk={renk} hiz={hiz} egim={egim} hucre={hucre} gunes={gunes} akis={akis} palmiye={false} ufuk={48} />
        </div>
        <RetroCard className="grid min-w-0 grid-cols-1 content-start gap-5 p-6" data-grid-kontrol="">
          <Secim legend="Izgara rengi" name="wf-renk" value={renk} onChange={setRenk} options={[{ id: 'pink', ad: 'Pembe' }, { id: 'cyan', ad: 'Cyan' }]} />
          <NeonSlider label="Akış süresi" value={hiz} min={0.4} max={3} step={0.1} onChange={setHiz} format={(v) => `${v.toFixed(1).replace('.', ',')} sn / hücre`} />
          <NeonSlider label="Eğim" value={egim} min={55} max={82} onChange={setEgim} format={(v) => `rotateX ${v}°`} />
          <NeonSlider label="Hücre" value={hucre} min={30} max={100} step={5} onChange={setHucre} format={(v) => `${v}px`} />
          <NeonSwitch label="Akış" checked={akis} onChange={setAkis} />
          <NeonSwitch label="Güneş ve dağlar" checked={gunes} onChange={setGunes} />
        </RetroCard>
      </div>
      <Kod label="WireframeGrid JSX" className="mt-6">{`<WireframeGrid renk="${renk}" hucre={${hucre}} hiz={${hiz.toFixed(1)}} egim={${egim}}${akis ? '' : ' akis={false}'}${gunes ? '' : ' gunes={false} daglar={false}'} />`}</Kod>
      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="min-w-0">
          <h3 className="chrome text-[34px]">{'<NeonButton>'}</h3>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <NeonButton>Pembe</NeonButton>
            <NeonButton renk="cyan" ikon={<Ikon ad="oynat" boyut={18} />}>
              Cyan
            </NeonButton>
            <NeonButton renk="turuncu" boy="k">
              Turuncu
            </NeonButton>
            <NeonButton dolu aria-pressed>
              Dolu
            </NeonButton>
            <NeonButton disabled>Pasif</NeonButton>
          </div>
          <p className="mt-5 max-w-[52ch] text-[15px] text-muted">2px tüp çerçeve, Bold mono büyük harf. Üstüne gelince tüp dolar, yazı gece moruna döner (pembe üstünde 5,92:1). Pasif düğme kesikli ve ışıksız.</p>
        </div>
        <RetroCard className="min-w-0 p-6">
          <p className="kicker text-cyan">{'<RetroCard>'}</p>
          <p className="chrome mt-3 text-[34px]">Gece seansı</p>
          <p className="mt-3 text-[15px] text-muted">Gradyan kenar: dolgu katmanı padding-box, pembe→cyan gradyan border-box. Köşedeki üçgen ufka bakar. İçerik hep düz koyu yüzeyde.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <NeonButton boy="k" renk="cyan">
              Kaydet
            </NeonButton>
            <NeonButton boy="k">Paylaş</NeonButton>
          </div>
        </RetroCard>
      </div>
    </Section>
  )
}

/** Merkezden uzaklık t (−1…1) için Skew açısı: tan(açı) doğrusal büyür, alt uçlar eşit aralıkla açılır */
const aciHesap = (t: number, max: number) => (Math.atan(Math.tan((max * Math.PI) / 180) * t) * 180) / Math.PI

/** Madde 12 · 13: Skew ile perspektif; 2 · 4 · 12 px çok katmanlı Drop Shadow */
export function Figma() {
  const [skew, setSkew] = useState(62)
  const [k, setK] = useState([true, true, true])
  const katman = [2, 4, 12]
  const golge = katman
    .map((b, i) => (k[i] ? `0 0 ${b}px #FF00FF` : ''))
    .filter(Boolean)
    .join(', ')
  const n = 9
  return (
    <Section id="figma" madde="Madde 12 · 13 · Figma" title="Skew ve" script="üç gölge" lead="Figma'da 3B yok: perspektif, düz dikey çizgilerin her birine merkezden uzaklığı kadar Skew verilerek taklit edilir. Neon parlama tek gölge değil, üst üste üç Drop Shadow: 2, 4 ve 12 piksel bulanıklık.">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <RetroCard className="min-w-0 p-5">
          <svg viewBox="-200 0 400 160" className="block h-auto w-full rounded-[6px] bg-[#0d0418]" role="img" aria-label={`Skew ile perspektif ızgarası, en dış çizgi ${skew} derece`}>
            {Array.from({ length: n }, (_, i) => {
              // Üst uç ufukta birbirine yakın; Skew X alt ucu dışa iter: çizgiler ufuktaki bir noktadan açılır
              const t = (i - (n - 1) / 2) / ((n - 1) / 2)
              const aci = aciHesap(t, skew)
              const x = t * 24
              return <rect key={i} x={x - 1} y={10} width={2} height={150} fill="#ff00ff" transform={`translate(${x} 10) skewX(${-aci}) translate(${-x} -10)`} />
            })}
            {[0.06, 0.16, 0.32, 0.56, 0.9].map((y) => (
              <rect key={y} x={-200} y={10 + 150 * y} width={400} height={1.5} fill="#ff00ff" />
            ))}
            <rect x={-200} y={9} width={400} height={2} fill="#00ffff" />
          </svg>
          <div className="mt-5">
            <NeonSlider label="En dış Skew" value={skew} min={0} max={75} onChange={setSkew} format={(v) => `${v}°`} />
          </div>
          <ol className="m-0 mt-5 grid list-none gap-1 p-0 font-mono text-[13px] text-muted">
            {[0, 1, 2, 3, 4].map((i) => {
              const t = (i - (n - 1) / 2) / ((n - 1) / 2)
              return (
                <li key={i} className="flex justify-between border-b border-line py-0.5">
                  <span>Dikey {i + 1}</span>
                  <span className="text-cyan">Skew X {(-aciHesap(t, skew)).toFixed(1).replace('.', ',')}°</span>
                </li>
              )
            })}
          </ol>
        </RetroCard>
        <RetroCard className="grid min-w-0 grid-cols-1 content-start gap-5 p-5">
          <div className="grid min-h-[150px] place-items-center rounded-[6px] bg-[#0d0418] p-6">
            <p className="script text-[64px] text-pink" style={{ textShadow: golge || 'none' }} data-glow-ornek="">
              Neon
            </p>
          </div>
          <ul className="m-0 grid list-none gap-3 p-0" aria-label="Drop Shadow katmanları">
            {katman.map((b, i) => (
              <li key={b}>
                <NeonSwitch label={`Drop Shadow · Blur ${b}`} hint={`0, 0 · ${b}px · #FF00FF %100`} checked={k[i]} onChange={(v) => setK((l) => l.map((x, j) => (j === i ? v : x)))} />
              </li>
            ))}
          </ul>
          <Kod label="Glow CSS">{`text-shadow: ${golge || 'none'};`}</Kod>
        </RetroCard>
      </div>
      <Kod label="Figma tokenları, W3C DTCG" className="mt-8">{`{
  "Color":      { "SynthPurple":   { "$type": "color", "$value": "#1A0B2E" } },
  "Effects":    { "NeonPinkGlow":  { "$type": "shadow", "$value": [
      { "color": "#FF00FF", "offsetX": "0", "offsetY": "0", "blur": "2px",  "spread": "0" },
      { "color": "#FF00FF", "offsetX": "0", "offsetY": "0", "blur": "4px",  "spread": "0" },
      { "color": "#FF00FF", "offsetX": "0", "offsetY": "0", "blur": "12px", "spread": "0" } ] } },
  "Typography": { "ChromeHeader":  { "$type": "typography", "$value": {
      "fontFamily": "Abril Fatface", "fontWeight": 400, "fill": "linear-gradient(180deg, #FFF, #8AA0D8 46%, #2A1650 50%, #FF8C00 72%, #FFE08A)" } } }
}`}</Kod>
    </Section>
  )
}

/** Madde 15: tanımdaki Tailwind satırı, birebir */
export function Css() {
  const ref = useRef<HTMLParagraphElement>(null)
  const [olcum, setOlcum] = useState<[string, string][]>([])
  useEffect(() => {
    const e = ref.current
    if (!e) return
    const c = getComputedStyle(e)
    setOlcum([
      ['color', c.color],
      ['background-clip', c.backgroundClip || c.getPropertyValue('-webkit-background-clip')],
      ['background-image', c.backgroundImage],
      ['filter', c.filter],
    ])
  }, [])
  return (
    <Section id="css" madde="Madde 15 · CSS / Tailwind" title="Tek satır" script="gün batımı" lead="Tanımdaki sınıflar olduğu gibi: şeffaf yazı, arka plan yazıya kırpılır, yukarıdan aşağı turuncu→pembe gradyan, pembe drop-shadow. Tailwind v4 bg-gradient-to-b yazımını hâlâ tanır (yeni adı bg-linear-to-b).">
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
        <div className="grid min-h-[220px] place-items-center rounded-[10px] border-2 border-line bg-[#0d0418] p-6">
          <p ref={ref} className="text-transparent bg-clip-text bg-gradient-to-b from-[#FF8C00] to-[#FF00FF] filter drop-shadow-[0_0_10px_#FF00FF] text-center font-[family-name:var(--font-chrome)] text-[clamp(56px,8vw,96px)] leading-none" data-madde15="">
            Gün Batımı
          </p>
        </div>
        <div className="grid min-w-0 grid-cols-1 gap-5">
          <Kod label="Madde 15 sınıfları">{`<p class="text-transparent bg-clip-text
          bg-gradient-to-b from-[#FF8C00] to-[#FF00FF]
          filter drop-shadow-[0_0_10px_#FF00FF]">
  Gün Batımı
</p>`}</Kod>
          <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 rounded-[8px] border-2 border-line bg-night-2 p-4 font-mono text-[13px]" data-olcum="">
            {olcum.map(([a, b]) => (
              <div key={a} className="contents">
                <dt className={cx('font-bold text-cyan')}>{a}</dt>
                <dd className="m-0 break-all">{b}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  )
}
