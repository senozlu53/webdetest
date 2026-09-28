import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useY2K } from '../lib/store'
import { PARCALAR, PROJELER, URUNLER, sureYaz, tl, type Urun } from '../lib/data'
import { Synth } from '../lib/synth'
import { Y2KCard } from '../components/Y2KCard'
import { ChromeButton } from '../components/ChromeButton'
import { Badge } from '../components/Badge'
import { CD } from '../components/Shapes'
import { IconCart, IconHeart, IconMinus, IconNext, IconPause, IconPlay, IconPlus, IconPrev, TribalStar } from '../components/Icons'
import { Range, Section } from '../components/ui'
import { cx } from '../../shared/cx'

const v = (o: Record<string, string>) => o as CSSProperties

/** Madde 10: müzik platformu. Parçalar WebAudio ile küçük bir sentezleyicide çalar */
export function Music() {
  const { motion, duyur } = useY2K()
  const synth = useRef<Synth | null>(null)
  const [i, setI] = useState(0)
  const [caliyor, setCaliyor] = useState(false)
  const [t, setT] = useState(0)
  const [ses, setSes] = useState(60)
  const iRef = useRef(i)
  const tRef = useRef(t)
  iRef.current = i
  tRef.current = t
  const p = PARCALAR[i]

  useEffect(() => () => synth.current?.durdur(), [])
  const sec = (n: number, calsin: boolean) => {
    const k = (n + PARCALAR.length) % PARCALAR.length
    setI(k)
    setT(0)
    if (calsin) synth.current?.baslat(PARCALAR[k])
    duyur(`${calsin ? 'Çalıyor' : 'Seçildi'}: ${PARCALAR[k].ad}, ${PARCALAR[k].sanatci}`)
  }
  useEffect(() => {
    if (!caliyor) return
    // Yan etki güncelleyicinin dışında (StrictMode güncelleyiciyi iki kez çağırır)
    const id = window.setInterval(() => {
      const n = tRef.current + 0.25
      if (n < PARCALAR[iRef.current].sure) {
        tRef.current = n
        setT(n)
        return
      }
      const k = (iRef.current + 1) % PARCALAR.length
      iRef.current = k
      tRef.current = 0
      setI(k)
      setT(0)
      synth.current?.baslat(PARCALAR[k])
    }, 250)
    return () => window.clearInterval(id)
  }, [caliyor])
  const oynat = () => {
    if (!synth.current) synth.current = new Synth()
    if (caliyor) {
      synth.current.durdur()
      setCaliyor(false)
      duyur('Duraklatıldı')
    } else {
      synth.current.baslat(p)
      synth.current.setVol(ses / 100)
      setCaliyor(true)
      duyur(`Çalıyor: ${p.ad}, ${p.sanatci}`)
    }
  }
  return (
    <Section id="muzik" kicker="Madde 10 · Müzik platformu" title="Milenyum FM" lead="Buz mavisi LCD, krom düğmeler, dans eden ekolayzır. Çal düğmesi tarayıcının kendi ses motoruyla küçük bir arpej üretir; hiçbir dosya indirilmez.">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <Y2KCard labelledBy="oynatici-b" className="grid grid-cols-1 gap-6 md:grid-cols-[240px_minmax(0,1fr)]">
          <div className="relative grid aspect-square w-full max-w-[240px] place-items-center overflow-hidden rounded-[32px] border border-[#2b3445]/55" style={{ background: `radial-gradient(circle at 30% 25%, #ffffff 0 12%, transparent 46%), radial-gradient(circle at 70% 80%, #ff66cc 0, transparent 55%), ${p.renk}` }} aria-hidden="true">
            <CD size={170} className={cx('spin', !caliyor && '[animation-play-state:paused]')} style={v({ '--spin': '3s' })} />
            <TribalStar size={64} className="absolute top-3 right-3 text-[#2e0854]" />
          </div>
          <div className="min-w-0">
            <h3 id="oynatici-b" className="sr-only">
              Oynatıcı
            </h3>
            <div className="rounded-[22px] border-2 border-[#2b3445]/60 bg-[#a5f2f3] px-4 py-3 text-black shadow-[inset_0_3px_8px_rgb(0_0_0/0.2)]">
              <p className="font-mono text-[11px] tracking-[0.1em] uppercase">
                {caliyor ? 'Çalıyor' : 'Duraklatıldı'} · {String(i + 1).padStart(2, '0')}/{String(PARCALAR.length).padStart(2, '0')}
              </p>
              <p className="display mt-1 truncate text-[24px]" data-parca="">
                {p.ad}
              </p>
              <p className="truncate text-[15px] font-semibold">{p.sanatci}</p>
              <p className="mt-1 font-mono text-[13px]" aria-hidden="true">
                {sureYaz(t)} / {sureYaz(p.sure)}
              </p>
            </div>
            <div className="mt-4">
              <Range label="Konum" value={Math.floor(t)} min={0} max={p.sure} onChange={setT} format={(x) => `${sureYaz(x)} / ${sureYaz(p.sure)}`} />
            </div>
            <div className="mt-4 flex items-center justify-center gap-3">
              <ChromeButton yuvarlak boyut="md" ikon={<IconPrev size={18} />} aria-label="Önceki parça" onClick={() => sec(i - 1, caliyor)} />
              <ChromeButton yuvarlak boyut="lg" ton="candy" ikon={caliyor ? <IconPause size={24} /> : <IconPlay size={24} />} aria-label={caliyor ? 'Duraklat' : 'Çal'} onClick={oynat} />
              <ChromeButton yuvarlak boyut="md" ikon={<IconNext size={18} />} aria-label="Sonraki parça" onClick={() => sec(i + 1, caliyor)} />
            </div>
            <div className="mt-4">
              <Range
                label="Ses"
                value={ses}
                min={0}
                max={100}
                onChange={(x) => {
                  setSes(x)
                  synth.current?.setVol(x / 100)
                }}
                format={(x) => `%${x}`}
              />
            </div>
            <div className="mt-5 flex h-16 items-end gap-1" aria-hidden="true" data-eq={caliyor && motion ? 'on' : 'off'}>
              {Array.from({ length: 18 }, (_, k) => (
                <span
                  key={k}
                  className="eq candy block flex-1 rounded-t-full border border-[#2b3445]/40"
                  style={{ height: `${30 + ((k * 37) % 70)}%`, animationDelay: `${-(k * 0.13).toFixed(2)}s`, animationDuration: `${0.5 + ((k * 7) % 5) / 10}s`, animationPlayState: caliyor ? 'running' : 'paused' }}
                />
              ))}
            </div>
          </div>
        </Y2KCard>
        <Y2KCard as="aside" labelledBy="liste-b">
          <h3 id="liste-b" className="display text-[20px]">
            Çalma listesi
          </h3>
          <ol className="mt-4 space-y-2">
            {PARCALAR.map((x, k) => (
              <li key={x.id}>
                <button
                  type="button"
                  aria-current={k === i ? 'true' : undefined}
                  onClick={() => {
                    if (!synth.current) synth.current = new Synth()
                    sec(k, true)
                    synth.current.setVol(ses / 100)
                    setCaliyor(true)
                  }}
                  className={cx('flex w-full items-center gap-3 rounded-full border border-[#2b3445]/55 px-4 py-2.5 text-left', k === i ? 'icy' : 'chrome')}
                >
                  <span className="font-mono text-[12px]">{String(k + 1).padStart(2, '0')}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{x.ad}</span>
                    <span className="block truncate text-[13px]">{x.sanatci}</span>
                  </span>
                  <span className="font-mono text-[12px]">{sureYaz(x.sure)}</span>
                </button>
              </li>
            ))}
          </ol>
        </Y2KCard>
      </div>
    </Section>
  )
}

/** Ürün çizimleri: basit krom ve şeker vektörler */
function UrunCizim({ tip }: { tip: Urun['cizim'] }) {
  const ortak = { viewBox: '0 0 160 120', className: 'h-auto w-full max-w-[220px]', 'aria-hidden': true as const }
  const gr = (
    <defs>
      <linearGradient id="u-krom" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="0.5" stopColor="#b0c4de" />
        <stop offset="1" stopColor="#778899" />
      </linearGradient>
      <linearGradient id="u-seker" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffc2ea" />
        <stop offset="1" stopColor="#e0309f" />
      </linearGradient>
      <linearGradient id="u-buz" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#f0ffff" />
        <stop offset="0.6" stopColor="#a5f2f3" />
        <stop offset="1" stopColor="#7b4fb5" />
      </linearGradient>
    </defs>
  )
  const k = '#1b2130'
  if (tip === 'kelebek')
    return (
      <svg {...ortak}>
        {gr}
        <ellipse cx="52" cy="46" rx="36" ry="26" fill="url(#u-seker)" stroke={k} strokeWidth="2" transform="rotate(-20 52 46)" />
        <ellipse cx="108" cy="46" rx="36" ry="26" fill="url(#u-seker)" stroke={k} strokeWidth="2" transform="rotate(20 108 46)" />
        <ellipse cx="60" cy="82" rx="22" ry="16" fill="url(#u-buz)" stroke={k} strokeWidth="2" transform="rotate(25 60 82)" />
        <ellipse cx="100" cy="82" rx="22" ry="16" fill="url(#u-buz)" stroke={k} strokeWidth="2" transform="rotate(-25 100 82)" />
        <rect x="75" y="30" width="10" height="68" rx="5" fill="url(#u-krom)" stroke={k} strokeWidth="2" />
        <ellipse cx="44" cy="38" rx="14" ry="5" fill="#fff" opacity="0.7" transform="rotate(-20 44 38)" />
      </svg>
    )
  if (tip === 'gozluk')
    return (
      <svg {...ortak}>
        {gr}
        <path d="M10 52C30 30 130 30 150 52C146 78 120 88 96 76C88 70 72 70 64 76C40 88 14 78 10 52Z" fill="url(#u-buz)" stroke={k} strokeWidth="3" />
        <path d="M10 52C30 30 130 30 150 52" fill="none" stroke="url(#u-krom)" strokeWidth="7" />
        <path d="M22 50C40 40 70 38 88 42" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
      </svg>
    )
  if (tip === 'telefon')
    return (
      <svg {...ortak}>
        {gr}
        <rect x="58" y="8" width="44" height="50" rx="10" fill="url(#u-krom)" stroke={k} strokeWidth="2.5" />
        <rect x="64" y="14" width="32" height="30" rx="5" fill="#a5f2f3" stroke={k} strokeWidth="2" />
        <rect x="58" y="60" width="44" height="54" rx="10" fill="url(#u-seker)" stroke={k} strokeWidth="2.5" />
        <path d="M66 72h28M66 82h28M66 92h28M66 102h28" stroke={k} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M96 8V0" stroke={k} strokeWidth="4" strokeLinecap="round" />
        <path d="M118 70l4 9 10 1-8 6 3 10-9-5-9 5 3-10-8-6 10-1z" fill="#ffe36b" stroke={k} strokeWidth="2" />
        <path d="M102 76c6 0 10 0 14 2" fill="none" stroke={k} strokeWidth="2" />
      </svg>
    )
  return (
    <svg {...ortak}>
      {gr}
      <path d="M44 48C44 18 116 18 116 48" fill="none" stroke="url(#u-krom)" strokeWidth="8" strokeLinecap="round" />
      <path d="M44 48C44 18 116 18 116 48" fill="none" stroke={k} strokeWidth="2" strokeLinecap="round" />
      <rect x="18" y="46" width="124" height="58" rx="29" fill="url(#u-krom)" stroke={k} strokeWidth="3" />
      <rect x="66" y="62" width="28" height="24" rx="8" fill="url(#u-seker)" stroke={k} strokeWidth="2" />
      <rect x="30" y="52" width="80" height="10" rx="5" fill="#fff" opacity="0.7" />
    </svg>
  )
}

/** Madde 10: Z kuşağı moda e-ticareti */
export function Shop() {
  const { sepet, sepeteEkle, sepetAdet, ac, duyur } = useY2K()
  const [beden, setBeden] = useState<Record<string, string>>({})
  const [fav, setFav] = useState<string[]>([])
  const satirlar = Object.entries(sepet).map(([k, n]) => {
    const [id, b] = k.split('|')
    return { k, n, u: URUNLER.find((x) => x.id === id)!, b }
  })
  const toplam = satirlar.reduce((a, s) => a + s.u.fiyat * s.n, 0)
  return (
    <Section id="magaza" kicker="Madde 10 · Moda e-ticareti" title="Sakız mağazası" lead="Z kuşağı için Y2K aksesuarları. Rozetler yüksek kontrastlı, düğmeler parlak kapsül; sepete eklenen her ürün hızlı bir pencereyle haber verir.">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {URUNLER.map((u) => {
            const b = beden[u.id] ?? u.bedenler[0]
            const f = fav.includes(u.id)
            return (
              <Y2KCard as="li" key={u.id} className="flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <Badge ton={u.rozetTon}>{u.rozet}</Badge>
                  <button
                    type="button"
                    aria-pressed={f}
                    aria-label={`Favori: ${u.ad}`}
                    onClick={() => {
                      setFav((l) => (f ? l.filter((x) => x !== u.id) : [...l, u.id]))
                      duyur(f ? `${u.ad} favorilerden çıktı` : `${u.ad} favorilere eklendi`)
                    }}
                    className={cx('grid size-10 place-items-center rounded-full border border-[#2b3445]/55', f ? 'candy' : 'chrome')}
                  >
                    <IconHeart size={18} dolu={f} />
                  </button>
                </div>
                <div className="mt-2 grid place-items-center">
                  <UrunCizim tip={u.cizim} />
                </div>
                <h3 className="display mt-3 text-[19px]">{u.ad}</h3>
                <p className="mt-1 text-[18px] font-bold">
                  {tl(u.fiyat)}{' '}
                  {u.eski ? (
                    <s className="text-[15px] font-medium text-muted">
                      <span className="sr-only">eski fiyat </span>
                      {tl(u.eski)}
                    </s>
                  ) : null}
                </p>
                {u.bedenler.length > 1 ? (
                  <fieldset className="mt-3">
                    <legend className="kicker mb-2 text-muted">Boy</legend>
                    <div className="flex gap-2">
                      {u.bedenler.map((x) => (
                        <label key={x} className={cx('inline-flex min-h-10 cursor-pointer items-center rounded-full border border-[#2b3445]/55 px-4 font-logo text-[11px] uppercase has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-[var(--focus)]', b === x ? 'candy' : 'chrome')}>
                          <input type="radio" className="sr-only" name={`boy-${u.id}`} value={x} checked={b === x} onChange={() => setBeden((s) => ({ ...s, [u.id]: x }))} />
                          {x}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                ) : null}
                <div className="mt-auto pt-4">
                  <ChromeButton
                    ton="candy"
                    ikon={<IconCart size={16} />}
                    className="w-full"
                    aria-label={`Sepete ekle: ${u.ad}`}
                    onClick={() => {
                      sepeteEkle(`${u.id}|${b}`)
                      ac({ baslik: 'Sepete eklendi', metin: `${u.ad}${u.bedenler.length > 1 ? ` (${b})` : ''} · ${tl(u.fiyat)}`, ton: 'candy', omur: 1800 })
                    }}
                  >
                    Sepete ekle
                  </ChromeButton>
                </div>
              </Y2KCard>
            )
          })}
        </ul>
        <Y2KCard as="aside" id="sepet" labelledBy="sepet-b" className="h-fit lg:sticky lg:top-28">
          <h3 id="sepet-b" className="display text-[20px]">
            Sepet
          </h3>
          {satirlar.length ? (
            <ul className="mt-4 space-y-3">
              {satirlar.map((s) => (
                <li key={s.k} className="flex items-center gap-2">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{s.u.ad}</span>
                    <span className="block text-[13px] text-muted">
                      {s.b !== 'Tek' ? `${s.b} · ` : ''}
                      {tl(s.u.fiyat * s.n)}
                    </span>
                  </span>
                  <ChromeButton yuvarlak boyut="sm" ikon={<IconMinus size={14} />} aria-label={`Azalt: ${s.u.ad}`} onClick={() => sepetAdet(s.k, s.n - 1)} />
                  <output className="w-6 text-center font-mono text-[14px]" aria-label={`${s.u.ad}: ${s.n} adet`}>
                    {s.n}
                  </output>
                  <ChromeButton yuvarlak boyut="sm" ikon={<IconPlus size={14} />} aria-label={`Artır: ${s.u.ad}`} onClick={() => sepetAdet(s.k, s.n + 1)} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-muted">Sepet boş. Bir kelebek toka her şeyi değiştirir.</p>
          )}
          <p className="mt-5 flex items-baseline justify-between border-t border-[#2b3445]/30 pt-4">
            <span className="font-logo text-[12px] uppercase">Toplam</span>
            <span className="display text-[24px]" data-toplam="">
              {tl(toplam)}
            </span>
          </p>
          <ChromeButton className="mt-4 w-full" disabled={!satirlar.length} onClick={() => ac({ baslik: 'Ödeme', metin: 'Bu bir tanıtım; ödeme alınmaz, kargo gelmez. Yine de teşekkürler!', ton: 'icy', odak: true })}>
            Ödemeye geç
          </ChromeButton>
        </Y2KCard>
      </div>
    </Section>
  )
}

/** Madde 10: pop kültür portfolyosu. Oval balon projeler, ayrıntı hızlı açılan pencerede */
export function Portfolio() {
  const { ac } = useY2K()
  const kayma = ['md:translate-y-6', 'md:-translate-y-4', 'md:translate-y-10', 'md:translate-y-0']
  return (
    <Section id="portfolyo" kicker="Madde 10 · Pop kültür portfolyosu" title="Elmas: pop arşivi" lead="Kurgusal bir pop yıldızının işleri oval balonlarda. Bir balona basın; ayrıntılar yarım saniyeden kısa sürede açılan bir pencerede.">
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PROJELER.map((j, k) => (
          <li key={j.id} className={kayma[k]}>
            <button
              type="button"
              onClick={() => ac({ baslik: `${j.ad} · ${j.tur}`, metin: `${j.yil}. ${j.not}`, ton: j.ton, odak: true })}
              className={cx(j.ton, 'grid aspect-[5/4] w-full place-items-center rounded-[50%] border border-[#2b3445]/55 px-8 text-center')}
            >
              <span>
                <span className="block font-logo text-[11px] tracking-[0.1em] uppercase">
                  {j.tur} · {j.yil}
                </span>
                <span className="display mt-2 block text-[clamp(20px,2.2vw,26px)]">{j.ad}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </Section>
  )
}
