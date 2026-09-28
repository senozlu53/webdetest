import { useEffect, useMemo, useRef, useState } from 'react'
import { Dialog } from 'radix-ui'
import { cx } from '../../shared/cx'
import { useSynth } from '../lib/store'
import { NOTA_AD, NOTA_HZ, Synth, type SynthAyar } from '../lib/ses'
import { manzara, svgUrl } from '../lib/sanat'
import { ESERLER, KASETLER, OYUNLAR } from '../lib/data'
import { RetroCard } from '../components/RetroCard'
import { NeonButton } from '../components/NeonButton'
import { Ikon } from '../components/Icons'
import { NeonSlider, NeonSwitch, Section, Secim } from '../components/ui'

const RENK_HEX = { pink: '#ff00ff', cyan: '#00ffff', orange: '#ff8c00' } as const

/** Madde 10: müzik prodüksiyon yazılımı. NEON-84 synth: arpej sıralayıcı, filtre, yankı, osiloskop */
export function Studyo() {
  const s = useSynth()
  const [caliyor, setCaliyor] = useState(false)
  const [adim, setAdim] = useState(-1)
  const [ayar, setAyar] = useState<SynthAyar>({ tempo: 108, kesim: 1800, rezonans: 6, detune: 12, yanki: true, dalga: 'sawtooth', adimlar: [true, true, true, false, true, true, false, true], notalar: NOTA_HZ })
  const synth = useRef<Synth | null>(null)
  const cv = useRef<HTMLCanvasElement>(null)
  const set = <K extends keyof SynthAyar>(k: K, v: SynthAyar[K]) => setAyar((a) => ({ ...a, [k]: v }))
  useEffect(() => synth.current?.guncelle(ayar), [ayar])
  useEffect(() => () => synth.current?.kapat(), [])

  // Osiloskop: çalarken dalga biçimi, dururken düz bir sinüs
  useEffect(() => {
    const c = cv.current
    const ctx = c?.getContext('2d')
    if (!c || !ctx) return
    let raf = 0
    const veri = new Uint8Array(1024)
    const ciz = (t: number) => {
      const w = c.width
      const h = c.height
      ctx.clearRect(0, 0, w, h)
      ctx.strokeStyle = 'rgba(91,58,140,0.6)'
      ctx.lineWidth = 1
      for (let x = 0; x <= w; x += w / 10) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
        ctx.stroke()
      }
      ctx.beginPath()
      ctx.moveTo(0, h / 2)
      ctx.lineTo(w, h / 2)
      ctx.stroke()
      ctx.strokeStyle = '#ff00ff'
      ctx.lineWidth = 3
      ctx.shadowColor = '#ff00ff'
      ctx.shadowBlur = document.documentElement.dataset.parlama === 'az' ? 0 : 12
      ctx.beginPath()
      const a = synth.current?.analiz
      if (caliyor && a) {
        a.getByteTimeDomainData(veri)
        for (let i = 0; i < veri.length; i++) {
          const x = (i / veri.length) * w
          const y = (veri[i] / 255) * h
          if (i) ctx.lineTo(x, y)
          else ctx.moveTo(x, y)
        }
      } else {
        for (let x = 0; x <= w; x += 4) {
          const y = h / 2 + Math.sin(x / 26 + t / 700) * h * 0.18
          if (x) ctx.lineTo(x, y)
          else ctx.moveTo(x, y)
        }
      }
      ctx.stroke()
      ctx.shadowBlur = 0
      if (caliyor || s.hareket) raf = requestAnimationFrame(ciz)
    }
    raf = requestAnimationFrame(ciz)
    return () => cancelAnimationFrame(raf)
  }, [caliyor, s.hareket])

  const cal = () => {
    if (caliyor) {
      synth.current?.durdur()
      setCaliyor(false)
      s.duyur('Durdu')
      return
    }
    try {
      synth.current ??= new Synth(ayar)
      synth.current.onAdim = setAdim
      synth.current.guncelle(ayar)
      synth.current.baslat()
      setCaliyor(true)
      s.duyur(`Çalıyor, ${ayar.tempo} BPM`)
    } catch {
      s.duyur('Bu tarayıcıda ses çalınamıyor')
    }
  }

  return (
    <Section id="studyo" madde="Madde 10 · 11 · Müzik prodüksiyonu" title="NEON-84" script="synth" lead="Tarayıcıda çalışan küçük bir synth: iki testere dişi osilatör, alçak geçiren filtre, yankı ve sekiz adımlı arpej. Kaydırıcılar ve anahtarlar neon çerçeveli (Madde 11). Ses yalnız Çal'a basınca başlar.">
      <RetroCard className="p-5 md:p-8" data-studyo="">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="chrome text-[40px]">NEON-84</p>
          <NeonButton boy="b" dolu={caliyor} aria-pressed={caliyor} onClick={cal} ikon={<Ikon ad={caliyor ? 'durdur' : 'oynat'} boyut={20} />} data-cal="">
            {caliyor ? 'Durdur' : 'Çal'}
          </NeonButton>
        </div>
        <canvas ref={cv} width={900} height={160} className="mt-6 block h-[120px] w-full rounded-[8px] border-2 border-cyan bg-[#0d0418] shadow-[var(--glow-cyan)] md:h-[160px]" role="img" aria-label={caliyor ? 'Osiloskop: çalan sesin dalga biçimi' : 'Osiloskop: bekliyor'} />
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <NeonSlider label="Tempo" value={ayar.tempo} min={70} max={160} onChange={(v) => set('tempo', v)} format={(v) => `${v} BPM`} />
            <NeonSlider label="Filtre" value={ayar.kesim} min={200} max={6000} step={50} onChange={(v) => set('kesim', v)} format={(v) => `${v} Hz`} />
            <NeonSlider label="Rezonans" value={ayar.rezonans} min={0} max={20} onChange={(v) => set('rezonans', v)} format={(v) => `Q ${v}`} />
            <NeonSlider label="Detune" value={ayar.detune} min={0} max={40} onChange={(v) => set('detune', v)} format={(v) => `±${v} sent`} />
          </div>
          <div className="grid grid-cols-1 content-start gap-5">
            <Secim<OscillatorType> legend="Dalga" name="syn-dalga" value={ayar.dalga} onChange={(v) => set('dalga', v)} options={[{ id: 'sawtooth', ad: 'Testere' }, { id: 'square', ad: 'Kare' }, { id: 'triangle', ad: 'Üçgen' }]} />
            <NeonSwitch label="Yankı" hint="Noktalı sekizlik gecikme, %38 geri besleme." checked={ayar.yanki} onChange={(v) => set('yanki', v)} />
          </div>
        </div>
        <fieldset className="mt-8 min-w-0 border-0 p-0">
          <legend className="kicker mb-3 text-muted">Arpej adımları · La minör</legend>
          <ol className="m-0 grid list-none grid-cols-4 gap-2 p-0 sm:grid-cols-8">
            {NOTA_AD.map((n, i) => (
              <li key={i}>
                <button
                  type="button"
                  aria-pressed={ayar.adimlar[i]}
                  aria-label={`Adım ${i + 1}, ${n}`}
                  onClick={() => set('adimlar', ayar.adimlar.map((v, j) => (j === i ? !v : v)))}
                  className={cx('grid h-16 w-full place-items-center rounded-[6px] border-2 text-[14px] font-bold', ayar.adimlar[i] ? 'border-pink bg-pink text-night' : 'border-line text-text', adim === i && 'outline-3 outline-offset-2 outline-cyan shadow-[var(--glow-cyan)]')}
                  data-adim={i}
                >
                  <span>{i + 1}</span>
                  <span className="text-[12px]">{n}</span>
                </button>
              </li>
            ))}
          </ol>
        </fieldset>
      </RetroCard>
    </Section>
  )
}

/** Madde 10: retro oyun platformu. Kartuş kapakları tohumdan üretilir */
export function Salon() {
  const s = useSynth()
  const [tur, setTur] = useState('Hepsi')
  const [oynanan, setOynanan] = useState<string | null>(null)
  const [fav, setFav] = useState<string[]>(['tetris'])
  const kapak = useMemo(() => Object.fromEntries(OYUNLAR.map((o) => [o.id, svgUrl(manzara(o.tohum, 320, 180))])), [])
  const turler = ['Hepsi', ...new Set(OYUNLAR.map((o) => o.tur))]
  const liste = OYUNLAR.filter((o) => tur === 'Hepsi' || o.tur === tur)
  return (
    <Section id="salon" madde="Madde 10 · Retro oyun platformu" title="Gece" script="Salonu" lead="Arcade platformu: kartuş kapakları, çevrimiçi oyuncu sayısı ve puan. Kapaklar her oyunun tohumundan üretilen manzaralar; tür süzgeci ve favoriler çalışır.">
      <Secim legend="Tür" name="salon-tur" value={tur} onChange={setTur} options={turler.map((t) => ({ id: t, ad: t }))} />
      <ul className="m-0 mt-8 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3" data-salon="">
        {liste.map((o) => {
          const f = fav.includes(o.id)
          return (
            <RetroCard as="li" key={o.id} kose={false} className="flex flex-col overflow-hidden">
              <img src={kapak[o.id]} alt="" className="block aspect-[16/9] w-full" />
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="chrome text-[28px]">{o.ad}</h3>
                  <button type="button" aria-pressed={f} aria-label={`${o.ad} favorilere ${f ? 'eklendi' : 'ekle'}`} onClick={() => setFav((l) => (f ? l.filter((x) => x !== o.id) : [...l, o.id]))} className="grid size-11 shrink-0 place-items-center rounded-full border-2 border-line">
                    <Ikon ad="kalp" renk={f ? 'pink' : 'metin'} parla={f} boyut={22} />
                  </button>
                </div>
                <p className="flex flex-wrap gap-x-4 gap-y-1 text-[14px] text-muted">
                  <span>{o.tur}</span>
                  <span>{o.yil}</span>
                  <span className="text-cyan">{o.oyuncu.toLocaleString('tr-TR')} çevrimiçi</span>
                  <span>
                    Puan <span className="font-bold text-text">{o.puan.toFixed(1).replace('.', ',')}</span>
                  </span>
                </p>
                <div className="mt-auto pt-2">
                  <NeonButton
                    renk={o.renk === 'orange' ? 'turuncu' : o.renk}
                    dolu={oynanan === o.id}
                    aria-pressed={oynanan === o.id}
                    onClick={() => {
                      setOynanan(oynanan === o.id ? null : o.id)
                      s.duyur(oynanan === o.id ? `${o.ad} kapatıldı` : `${o.ad} yükleniyor`)
                    }}
                    ikon={<Ikon ad="kol" boyut={20} />}
                  >
                    {oynanan === o.id ? 'Oynanıyor' : 'Oyna'}
                  </NeonButton>
                </div>
              </div>
            </RetroCard>
          )
        })}
      </ul>
    </Section>
  )
}

/** Madde 10: Web3 sanat galerisi. Eser büyük görünümde; "bas" yeni tohumdan eser üretir */
export function Galeri() {
  const s = useSynth()
  const [eserler, setEserler] = useState(ESERLER)
  const [acik, setAcik] = useState<number | null>(null)
  // Pencere durumla açıldığı için Radix açan düğmeyi bilmez: kapanınca odak ona elle döner
  const acan = useRef<HTMLButtonElement | null>(null)
  const e = eserler.find((x) => x.id === acik)
  const url = (t: number, w = 320, h = 200) => svgUrl(manzara(t, w, h))
  return (
    <Section id="galeri" madde="Madde 10 · Web3 sanat galerisi" title="Kaset" script="Galeri" lead="Tek kopya dijital eserler. Her eser bir tohumdan üretilen synthwave manzarası: aynı tohum hep aynı güneşi, dağları ve palmiyeyi verir. Fiyatlar kurgu Neon Kredi; cüzdan ve zincir yok.">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-muted">
          <span className="font-bold text-text">{eserler.length}</span> eser
        </p>
        <NeonButton
          renk="cyan"
          onClick={() => {
            const t = 1000 + Math.floor(Math.random() * 90000)
            setEserler((l) => [{ id: Date.now(), ad: `Tohum ${t}`, sanatci: 'Sen', tohum: t, fiyat: 12 }, ...l])
            s.duyur(`Yeni eser basıldı: tohum ${t}`)
          }}
          ikon={<Ikon ad="simsek" boyut={20} />}
          data-bas=""
        >
          Yeni eser bas
        </NeonButton>
      </div>
      <ul className="m-0 mt-8 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3" data-galeri="">
        {eserler.map((x) => (
          <li key={x.id}>
            <button
              type="button"
              onClick={(ev) => {
                acan.current = ev.currentTarget
                setAcik(x.id)
              }}
              className="group block w-full rounded-[10px] border-2 border-line bg-night-2 p-3 text-left hover:border-pink hover:shadow-[var(--glow-pink)]" aria-haspopup="dialog">
              <img src={url(x.tohum)} alt="" className="block aspect-[16/10] w-full rounded-[6px]" />
              <span className="mt-3 flex items-baseline justify-between gap-3">
                <span className="chrome text-[24px]">{x.ad}</span>
                <span className="font-bold text-cyan tabular-nums">{x.fiyat} NK</span>
              </span>
              <span className="block text-[14px] text-muted">{x.sanatci}</span>
            </button>
          </li>
        ))}
      </ul>
      <Dialog.Root open={acik !== null} onOpenChange={(o) => !o && setAcik(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[96] bg-[#0d0418]/90" />
          <Dialog.Content className="rcard fixed top-1/2 left-1/2 z-[97] max-h-[92vh] w-[min(820px,calc(100vw-24px))] -translate-1/2 overflow-y-auto p-5 md:p-6"
            aria-describedby={undefined}
            onCloseAutoFocus={(ev) => {
              ev.preventDefault()
              acan.current?.focus()
            }}
          >
            {e ? (
              <>
                <div className="flex items-start justify-between gap-4">
                  <Dialog.Title className="chrome text-[clamp(34px,5vw,52px)]">{e.ad}</Dialog.Title>
                  <Dialog.Close asChild>
                    <NeonButton boy="k" aria-label="Kapat">
                      <Ikon ad="kapat" boyut={18} />
                    </NeonButton>
                  </Dialog.Close>
                </div>
                <img src={url(e.tohum, 640, 400)} alt={`${e.ad}: tohum ${e.tohum} ile üretilmiş synthwave manzarası`} className="mt-4 block w-full rounded-[8px]" />
                <dl className="m-0 mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {[
                    ['Sanatçı', e.sanatci],
                    ['Tohum', String(e.tohum)],
                    ['Baskı', '1 / 1'],
                    ['Fiyat', `${e.fiyat} NK`],
                  ].map(([a, b]) => (
                    <div key={a}>
                      <dt className="kicker text-muted">{a}</dt>
                      <dd className="m-0 text-[18px] font-bold">{b}</dd>
                    </div>
                  ))}
                </dl>
              </>
            ) : null}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </Section>
  )
}

/** Madde 10: yaratıcı portfolyo. İşler VHS kasetleri; seçilen kaset tüplü ekranda oynar */
export function Portfolyo() {
  const [sec, setSec] = useState(KASETLER[0].id)
  const k = KASETLER.find((x) => x.id === sec)!
  return (
    <Section id="portfolyo" madde="Madde 10 · Yaratıcı portfolyo" title="Deniz" script="Neon" lead="Tasarımcı Deniz Neon'un (kurgu) işleri video kaseti gibi rafta durur. Kaset seçilince ekranda oynar: VHS sayacı, başlık ve açıklama.">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.4fr]">
        <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0" aria-label="Kasetler">
          {KASETLER.map((x) => (
            <li key={x.id}>
              <button type="button" aria-pressed={sec === x.id} onClick={() => setSec(x.id)} className={cx('flex w-full items-center gap-4 rounded-[6px] border-2 bg-[#0d0418] p-3 text-left', sec === x.id ? 'border-cyan shadow-[var(--glow-cyan)]' : 'border-line')}>
                <span className="h-12 w-3 shrink-0 rounded-[2px]" style={{ background: RENK_HEX[x.renk], boxShadow: `0 0 var(--g2) ${RENK_HEX[x.renk]}` }} aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[17px] font-bold">{x.ad}</span>
                  <span className="block text-[13px] text-muted">
                    {x.tur} · {x.yil}
                  </span>
                </span>
                <span className="font-bold text-cyan tabular-nums">{x.sure}</span>
              </button>
            </li>
          ))}
        </ul>
        <RetroCard className="min-w-0 p-3" aria-live="polite">
          <div className="relative overflow-hidden rounded-[18px] border-2 border-line bg-[#0d0418] p-6 md:p-8" style={{ boxShadow: 'inset 0 0 60px rgb(0 0 0 / 0.8)' }}>
            <p className="kicker sapma flex items-center gap-2 text-white">
              <Ikon ad="oynat" boyut={16} /> <span lang="en">Play</span> <span className="tabular-nums">{k.sure}</span>
            </p>
            <p className="chrome mt-6 text-[clamp(40px,6vw,72px)]">{k.ad}</p>
            <p className="script -mt-1 ml-4 inline-block -rotate-3 text-[36px]">{k.tur}</p>
            <p className="mt-5 max-w-[48ch] text-[16px] text-muted">{k.aciklama}</p>
          </div>
        </RetroCard>
      </div>
    </Section>
  )
}
