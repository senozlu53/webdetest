import { animate } from 'motion'
import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react'
import { cx } from '../../shared/cx'
import { Dev } from '../components/Harfler'
import { ImlecBaslik } from '../components/ImlecBaslik'
import { MarqueeText } from '../components/MarqueeText'
import { Alan, Aralik, Bolum, Buton, KENAR } from '../components/ui'
import { BUTCELER, HIZMETLER, PARCALAR, POSTER_SATIRLAR, PROJELER, RAKAMLAR, SOZ } from '../lib/data'
import { useKinetic } from '../lib/store'

const EPOSTA = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const sure = (sn: number) => `${Math.floor(sn / 60)}:${String(Math.floor(sn % 60)).padStart(2, '0')}`

function AltBaslik({ no, id, children, alt }: { no: string; id: string; children: ReactNode; alt?: string }) {
  return (
    <div className="border-t-2 border-metin pt-6" id={id}>
      <p className="kicker">
        <span className="rakam text-[15px] text-metin">{no}</span> — {alt}
      </p>
      <h3 className="dev mt-3 text-[clamp(30px,4.6vw,64px)]">{children}</h3>
    </div>
  )
}

/* ───────────────────────── Portfolyo ───────────────────────── */

function Portfolyo() {
  const [secili, setSecili] = useState<string>(PROJELER[0].id)
  const [uzerinde, setUzerinde] = useState<string | null>(null)
  const goster = PROJELER.find((p) => p.id === (uzerinde ?? secili))!
  const secilen = PROJELER.find((p) => p.id === secili)!
  return (
    <div data-portfolyo="">
      <AltBaslik no="A" id="portfolyo" alt="Dijital sanatçı portfolyosu">
        Proje dizini
      </AltBaslik>
      <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-12">
        <div className="border-2 border-metin lg:col-span-12" data-portfolyo-sahne={goster.id}>
          <ImlecBaslik key={goster.id} metin={goster.ad} alt={`${goster.rol} · ${goster.yil}`} boy="clamp(44px, 14vw, 230px)" yukseklik="clamp(280px, 38vw, 460px)" />
        </div>
        <ol className="grid grid-cols-1 gap-x-10 sm:grid-cols-2 lg:col-span-12" role="list">
          {PROJELER.map((p, i) => {
            const on = p.id === secili
            return (
              <li key={p.id} className="border-t border-hat">
                <button
                  type="button"
                  aria-pressed={on}
                  data-proje={p.id}
                  onClick={() => setSecili(p.id)}
                  onPointerEnter={() => setUzerinde(p.id)}
                  onPointerLeave={() => setUzerinde(null)}
                  onFocus={() => setUzerinde(p.id)}
                  onBlur={() => setUzerinde(null)}
                  className={cx('grid min-h-[68px] w-full grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-3 border-0 bg-transparent py-3 text-left', on ? 'text-vurgu-yazi' : 'text-metin hover:text-vurgu-yazi')}
                  style={{ transition: 'color 300ms' }}
                >
                  <span className="rakam text-[15px] text-soluk">{String(i + 1).padStart(2, '0')}</span>
                  <span className="dev min-w-0 text-[clamp(22px,3.4vw,46px)]">{p.ad}</span>
                  <span className="rakam text-[15px] text-soluk">{p.yil}</span>
                </button>
              </li>
            )
          })}
        </ol>
        <div className="lg:col-span-12">
          <p className="kicker">Seçili proje</p>
          <p className="mt-2 max-w-[62ch] text-[clamp(18px,1.6vw,22px)]" data-proje-not="">
            <span className="dev mr-3 text-[1.3em]">{secilen.ad}.</span>
            {secilen.not}
          </p>
        </div>
      </div>
    </div>
  )
}

/* ───────────────────────── Albüm ───────────────────────── */

function Album() {
  const { hareket, duyur } = useKinetic()
  const [parca, setParca] = useState(0)
  const [calan, setCalan] = useState(false)
  const [gecen, setGecen] = useState(0)
  const [bpm, setBpm] = useState<number>(PARCALAR[0].bpm)
  const p = PARCALAR[parca]
  const zaman = useRef(0)
  useEffect(() => {
    if (!calan) return
    zaman.current = performance.now()
    const t = window.setInterval(() => {
      const simdi = performance.now()
      const dt = (simdi - zaman.current) / 1000
      zaman.current = simdi
      setGecen((g) => {
        const y = g + dt
        if (y >= p.sure) {
          setCalan(false)
          duyur('Parça bitti')
          return p.sure
        }
        return y
      })
    }, 100)
    return () => window.clearInterval(t)
  }, [calan, p.sure, duyur])
  const vurus = (gecen * bpm) / 60
  const kelimeSira = Math.floor(vurus / 2) % SOZ.length
  const beat = Math.floor(vurus) % 2 === 0
  const sec = (i: number) => {
    setParca(i)
    setGecen(0)
    setCalan(false)
    setBpm(PARCALAR[i].bpm)
    duyur(`${PARCALAR[i].ad} seçildi`)
  }
  return (
    <div data-album="">
      <AltBaslik no="B" id="album" alt="Müzik albümü tanıtımı">
        Sinyal / Gürültü
      </AltBaslik>
      <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="grid min-h-[clamp(260px,36vw,420px)] place-items-center overflow-x-clip border-2 border-metin p-4" data-sahne-durum={calan ? 'calan' : 'duran'}>
            <div className="sigdir">
              {calan || gecen > 0 ? (
                <p key={kelimeSira} className={cx('dev dev-boy text-center', hareket && calan && 'vurus', kelimeSira % 3 === 2 && 'vurgu')} style={{ ['--boy' as string]: 'clamp(44px, 12vw, 170px)', ['--uz' as string]: 7 }} data-soz={SOZ[kelimeSira]} aria-live="off">
                  {SOZ[kelimeSira]}
                </p>
              ) : (
                <p className="dev dev-boy text-center text-soluk" style={{ ['--boy' as string]: 'clamp(44px, 12vw, 170px)', ['--uz' as string]: 7 }} data-soz="">
                  Hazır
                </p>
              )}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Buton
              ton="vurgu"
              aria-pressed={calan}
              onClick={() => {
                if (gecen >= p.sure) setGecen(0)
                setCalan((c) => !c)
              }}
              data-cal=""
            >
              {calan ? 'Durdur' : gecen > 0 && gecen < p.sure ? 'Devam' : 'Çal'}
            </Buton>
            <Buton
              onClick={() => {
                setGecen(0)
                setCalan(false)
              }}
              disabled={gecen === 0}
            >
              Baştan
            </Buton>
            <p className="rakam ml-auto text-[20px]" data-zaman={Math.floor(gecen)}>
              {sure(gecen)} / {sure(p.sure)}
            </p>
            <span className={cx('inline-block size-6 border-2 border-metin', beat && calan && 'bg-vurgu border-vurgu')} aria-hidden="true" data-vurus={calan && beat ? 'evet' : 'hayir'} />
          </div>
          <div className="mt-2 h-[2px] bg-hat" role="progressbar" aria-label="Parça ilerlemesi" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round((gecen / p.sure) * 100)}>
            <div className="h-[2px] bg-vurgu" style={{ width: `${(gecen / p.sure) * 100}%` }} />
          </div>
          <div className="mt-6 max-w-[420px]">
            <Aralik id="album-bpm" label="Tempo" value={bpm} min={60} max={180} step={2} onChange={setBpm} format={(v) => `${v} bpm`} />
          </div>
          <p className="mt-2 text-[14px] text-soluk">Ses çalmaz; yalnız söz, tempoya göre iki vuruşta bir kelime değiştirir. Saniyede üç değişimin çok altında: en hızlı tempoda bile 0,67 sn.</p>
        </div>
        <div className="lg:col-span-5">
          <p className="kicker">Parçalar</p>
          <ol className="mt-3" role="list">
            {PARCALAR.map((x, i) => (
              <li key={x.ad} className="border-t border-hat">
                <button
                  type="button"
                  aria-pressed={i === parca}
                  onClick={() => sec(i)}
                  data-parca={x.ad}
                  className={cx('grid min-h-[60px] w-full grid-cols-[2rem_1fr_auto] items-baseline gap-x-3 sm:grid-cols-[2rem_1fr_auto_auto] border-0 bg-transparent py-3 text-left', i === parca ? 'text-vurgu-yazi' : 'text-metin hover:text-vurgu-yazi')}
                >
                  <span className="rakam text-[14px] text-soluk">{i + 1}</span>
                  <span className="dev min-w-0 text-[clamp(20px,2vw,32px)]">{x.ad}</span>
                  <span className="rakam hidden text-[14px] text-soluk sm:inline">{x.bpm} bpm</span>
                  <span className="rakam text-[14px]">{sure(x.sure)}</span>
                </button>
              </li>
            ))}
          </ol>
          <div className="mt-6 flex flex-wrap gap-x-1 gap-y-1 dev text-[clamp(20px,2vw,28px)] text-soluk" aria-label="Sözler">
            {SOZ.map((k, i) => (
              <span key={i} className={cx((calan || gecen > 0) && i === kelimeSira && 'text-vurgu-yazi')}>
                {k}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ───────────────────────── Ajans ───────────────────────── */

function Rakam({ deger, ad }: { deger: number; ad: string }) {
  const { hareket } = useKinetic()
  const ref = useRef<HTMLSpanElement>(null)
  const kok = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    const k = kok.current
    if (!el || !k) return
    if (!hareket) {
      el.textContent = String(deger)
      return
    }
    let kontrol: { stop: () => void } | null = null
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          kontrol = animate(0, deger, { duration: 1.6, ease: [0.2, 0.9, 0.2, 1], onUpdate: (v) => (el.textContent = String(Math.round(v))) })
          io.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    io.observe(k)
    return () => {
      io.disconnect()
      kontrol?.stop()
      el.textContent = String(deger)
    }
  }, [deger, hareket])
  return (
    <div ref={kok} data-rakam={ad}>
      <p className="dev text-[clamp(40px,5.6vw,84px)] tabular-nums" data-deger={deger}>
        <span ref={ref}>{deger}</span>
      </p>
      <p className="kicker mt-2">{ad}</p>
    </div>
  )
}

function Ajans() {
  const { duyur } = useKinetic()
  const [ad, setAd] = useState('')
  const [eposta, setEposta] = useState('')
  const [butce, setButce] = useState(BUTCELER[1])
  const [hata, setHata] = useState<{ ad?: string; eposta?: string }>({})
  const [tamam, setTamam] = useState('')
  const gonder = (e: FormEvent) => {
    e.preventDefault()
    const h: typeof hata = {}
    if (ad.trim().length < 3) h.ad = 'Adınızı yazın (en az 3 harf).'
    if (!EPOSTA.test(eposta)) h.eposta = 'Geçerli bir e-posta adresi yazın.'
    setHata(h)
    setTamam('')
    if (h.ad || h.eposta) {
      duyur('Form eksik: ' + [h.ad, h.eposta].filter(Boolean).join(' '))
      requestAnimationFrame(() => document.querySelector<HTMLElement>('[data-brief] [aria-invalid="true"]')?.focus())
      return
    }
    setTamam(`${ad.trim()}, kısa notunuz alındı. ${butce} bütçe aralığıyla iki iş günü içinde dönüyoruz.`)
    duyur('Not alındı')
  }
  return (
    <div data-ajans="">
      <AltBaslik no="C" id="ajans" alt="Yenilikçi teknoloji ajansı">
        Şeritler ve rakamlar
      </AltBaslik>
      <div className="-mx-[var(--kenar)] mt-8 border-y border-hat" data-hizmetler="">
        {HIZMETLER.map((h, i) => (
          <MarqueeText key={h.ad} metin={h.ad.toUpperCase()} hiz={h.hiz} yon={h.yon} ayirac="—" kontur={i === 1} className={cx('dev py-3 text-[clamp(38px,8vw,120px)]', i < HIZMETLER.length - 1 && 'border-b border-hat', i === 2 && 'text-vurgu-yazi')} ad={`ajans-${i}`} />
        ))}
      </div>
      <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4" data-rakamlar="">
        {RAKAMLAR.map((r) => (
          <Rakam key={r.ad} ad={r.ad} deger={r.deger} />
        ))}
      </dl>
      <form className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2" onSubmit={gonder} noValidate data-brief="">
        <p className="kicker md:col-span-2">Kısa not bırakın</p>
        <Alan label="Ad soyad" hata={hata.ad}>
          {(p) => <input className="alan" {...p} value={ad} onChange={(e) => setAd(e.target.value)} autoComplete="name" />}
        </Alan>
        <Alan label="E-posta" hata={hata.eposta}>
          {(p) => <input className="alan" type="email" {...p} value={eposta} onChange={(e) => setEposta(e.target.value)} autoComplete="email" />}
        </Alan>
        <Alan label="Bütçe">
          {(p) => (
            <select className="alan" {...p} value={butce} onChange={(e) => setButce(e.target.value)}>
              {BUTCELER.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          )}
        </Alan>
        <div className="flex items-end">
          <Buton type="submit" ton="vurgu">
            Gönder
          </Buton>
        </div>
      </form>
      {tamam ? (
        <div className="mt-8" role="status" data-brief-tamam="">
          <Dev metin="Tamam." efekt={['dalga']} boy="clamp(48px, 10vw, 140px)" className="vurgu" ad="tamam" />
          <p className="mt-3 max-w-[56ch] text-[18px]">{tamam}</p>
        </div>
      ) : null}
    </div>
  )
}

/* ───────────────────────── Poster ───────────────────────── */

const POSTER_RENK = [
  { ad: 'Siyah', bg: '#000000', fg: '#ffffff', vy: '#ccff00' },
  { ad: 'Neon', bg: '#ccff00', fg: '#000000', vy: '#000000' },
  { ad: 'Beyaz', bg: '#ffffff', fg: '#000000', vy: '#3d5a00' },
  { ad: 'Kırmızı', bg: '#ff3b3b', fg: '#000000', vy: '#000000' },
] as const

function Poster() {
  const [renk, setRenk] = useState(0)
  const [tohum, setTohum] = useState(0)
  const r = POSTER_RENK[renk]
  const satirlar = useMemo(() => {
    const dizi = POSTER_SATIRLAR.map((s, i) => ({ metin: s.join(' '), i }))
    // tohuma göre döngüsel kaydırma: her karıştırmada başka satır üste çıkar
    return dizi.map((_, k) => dizi[(k + tohum) % dizi.length])
  }, [tohum])
  const stil = { background: r.bg, color: r.fg, ['--zemin' as string]: r.bg, ['--metin' as string]: r.fg, ['--vurgu-yazi' as string]: r.vy } as CSSProperties
  return (
    <div data-poster-alan="">
      <AltBaslik no="D" id="poster" alt="İnteraktif dijital poster">
        Sesi aç
      </AltBaslik>
      <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="sigdir border-2 border-metin p-[clamp(14px,3vw,28px)]" style={stil} data-poster={r.ad} data-poster-tohum={tohum}>
            {satirlar.map((s, k) => (
              <div key={s.i} className="border-b border-current/30 py-2 first:pt-0 last:border-b-0 last:pb-0" data-poster-satir={s.metin}>
                <Dev metin={s.metin} boy="clamp(28px, 12vw, 200px)" efekt={k === 2 ? ['dalga', 'imlec'] : ['imlec']} className={cx(k === 1 && 'kontur', k === 3 && 'vurgu')} uz={s.metin.length} ad="poster" />
              </div>
            ))}
          </div>
        </div>
        <div className="grid content-start gap-6 lg:col-span-6 lg:col-start-7">
          <p className="max-w-[46ch] text-[18px] text-soluk">Poster tek bir cümledir. İmleci satırların üzerinde gezdirin: yaklaşan harfler gevşer ve incelir. Renk ve düzen değiştirilebilir; her satır genişliği doldurmak için kendi boyunu bulur.</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Poster rengi">
            {POSTER_RENK.map((x, i) => (
              <Buton key={x.ad} aria-pressed={i === renk} onClick={() => setRenk(i)} data-poster-renk={x.ad}>
                {x.ad}
              </Buton>
            ))}
          </div>
          <div>
            <Buton ton="vurgu" onClick={() => setTohum((t) => (t + 1) % POSTER_SATIRLAR.length)} data-poster-karistir="">
              Düzeni karıştır
            </Buton>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Alanlar() {
  return (
    <Bolum
      id="alanlar"
      no="08"
      madde="Madde 10 · Kullanım alanları"
      baslik="Dört sahne"
      vurgulu={[1]}
      lead="Dijital sanatçı portfolyosu, müzik albümü tanıtımı, teknoloji ajansı ve interaktif poster: hepsinde arayüzün kendisi tipografidir. Portfolyoda başlık imleci izler, albümde söz tempoya göre vurur, ajansta şeritler kaydırmayla hızlanır, posterde harfler imleçle gevşer."
    >
      <div className={`${KENAR} grid grid-cols-1 gap-y-[clamp(72px,9vw,140px)]`}>
        <Portfolyo />
        <Album />
        <Ajans />
        <Poster />
      </div>
    </Bolum>
  )
}
