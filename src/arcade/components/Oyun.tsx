import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { cx } from '../../shared/cx'
import { useArcade } from '../lib/store'
import { bip } from '../lib/ses'
import { SPRITE, tuvale, type SpriteAd } from '../lib/sprites'
import { ArcadeText } from './ArcadeText'
import { HealthBar } from './HealthBar'
import { pad } from './Header'
import { PixelButton } from './PixelButton'
import { Ikon, Sprite } from './Sprite'

const W = 160
const H = 144
const ZEMIN = H - 16
type Durum = 'hazir' | 'oyun' | 'duraklat' | 'bitti'
interface Nesne {
  x: number
  y: number
  tur: 'jeton' | 'kafa'
  v: number
}

export const ALFABE = [...'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ']

function sprTuval(ad: SpriteAd, ayna = false) {
  const c = document.createElement('canvas')
  c.width = 16
  c.height = 16
  const ctx = c.getContext('2d')
  if (ctx) tuvale(SPRITE[ad], ctx, 0, 0, ayna)
  return c
}

/**
 * Madde 10 · 17: "Jeton Avcısı". 160×144 mantıksal çözünürlük (el konsolu ekranı).
 * Tuval tam sayı katla büyür: kap genişliğine sığan en büyük k (aygıt pikseli cinsinden). Kesirli kat yok.
 */
export function Oyun({ onBitti }: { onBitti: (puan: number, bolum: number) => void }) {
  const s = useArcade()
  const kap = useRef<HTMLDivElement>(null)
  const cv = useRef<HTMLCanvasElement>(null)
  const [kat, setKat] = useState({ k: 2, css: W * 2 })
  const [durum, setDurum] = useState<Durum>('hazir')
  const [skor, setSkor] = useState(0)
  const [can, setCan] = useState(3)
  const [bolum, setBolum] = useState(1)
  const oyun = useRef({ x: 72, yon: 0, bak: 1, nesneler: [] as Nesne[], sayac: 0, skor: 0, can: 3, bolum: 1, yara: 0, adim: 0 })
  const tus = useRef({ sol: false, sag: false })
  const spr = useRef<Record<string, HTMLCanvasElement>>({})
  const sesAcik = useRef(s.ses)
  const sr = useRef(s)
  useEffect(() => {
    sesAcik.current = s.ses
    sr.current = s
  })

  // Madde 17: tam sayı ölçek. Aygıt pikseli cinsinden en büyük tam kat seçilir, CSS boyu ondan türetilir
  useEffect(() => {
    const el = kap.current
    if (!el) return
    const hesap = () => {
      const dpr = window.devicePixelRatio || 1
      const k = Math.max(1, Math.floor((el.clientWidth * dpr) / W))
      setKat({ k, css: (W * k) / dpr })
    }
    hesap()
    const ro = new ResizeObserver(hesap)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const ciz = useCallback(() => {
    const ctx = cv.current?.getContext('2d')
    if (!ctx) return
    if (!spr.current.a) {
      spr.current = { a: sprTuval('kahramanA'), b: sprTuval('kahramanB'), al: sprTuval('kahramanA', true), bl: sprTuval('kahramanB', true), j1: sprTuval('jeton1'), j2: sprTuval('jeton2'), j3: sprTuval('jeton3'), k: sprTuval('kafatasi'), kalp: sprTuval('kalp') }
    }
    const o = oyun.current
    ctx.imageSmoothingEnabled = false
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, W, H)
    // yıldızlar (sabit, piksel)
    ctx.fillStyle = '#3F3F3F'
    for (let i = 0; i < 24; i++) ctx.fillRect((i * 53) % W, (i * 29) % (ZEMIN - 20), 1, 1)
    // zemin: tuğla deseni
    ctx.fillStyle = '#FF8000'
    ctx.fillRect(0, ZEMIN, W, 16)
    ctx.fillStyle = '#7F0000'
    for (let y = 0; y < 16; y += 4) for (let x = (y / 4) % 2 ? -4 : 0; x < W; x += 8) ctx.fillRect(x + 1, ZEMIN + y + 1, 7, 3)
    for (const n of o.nesneler) {
      const kare = n.tur === 'kafa' ? spr.current.k : [spr.current.j1, spr.current.j2, spr.current.j3, spr.current.j2][Math.floor(o.adim / 8) % 4]
      ctx.drawImage(kare, Math.round(n.x), Math.round(n.y))
    }
    // yaralanınca kahraman her 4 karede bir görünmez (yanıp sönme yerine: hareket kapalıysa sabit)
    const gorunur = !(o.yara > 0 && document.documentElement.dataset.motion === 'on' && Math.floor(o.yara / 4) % 2)
    if (gorunur) {
      const yurur = o.yon !== 0 && Math.floor(o.adim / 8) % 2
      const k = o.bak < 0 ? (yurur ? spr.current.bl : spr.current.al) : yurur ? spr.current.b : spr.current.a
      ctx.drawImage(k, Math.round(o.x), ZEMIN - 16)
    }
  }, [])

  const sifirla = useCallback(() => {
    oyun.current = { x: 72, yon: 0, bak: 1, nesneler: [], sayac: 0, skor: 0, can: 3, bolum: 1, yara: 0, adim: 0 }
    setSkor(0)
    setCan(3)
    setBolum(1)
    s.setBirUp(0)
  }, [s])

  // Oyun döngüsü: sabit 60 adım/sn
  useEffect(() => {
    if (durum !== 'oyun') {
      ciz()
      return
    }
    let raf = 0
    let son = performance.now()
    let biriken = 0
    const adim = () => {
      const o = oyun.current
      o.adim++
      o.yon = (tus.current.sag ? 1 : 0) - (tus.current.sol ? 1 : 0)
      if (o.yon) o.bak = o.yon
      o.x = Math.max(0, Math.min(W - 16, o.x + o.yon * 1.5))
      if (o.yara > 0) o.yara--
      o.sayac++
      const aralik = Math.max(18, 48 - o.bolum * 4)
      if (o.sayac >= aralik) {
        o.sayac = 0
        const kafa = Math.random() < Math.min(0.45, 0.18 + o.bolum * 0.04)
        o.nesneler.push({ x: 4 + Math.floor(Math.random() * (W - 24)), y: -16, tur: kafa ? 'kafa' : 'jeton', v: 0.55 + o.bolum * 0.12 + Math.random() * 0.3 })
      }
      const kalan: Nesne[] = []
      for (const n of o.nesneler) {
        n.y += n.v
        const carp = n.y + 13 > ZEMIN - 14 && n.y < ZEMIN - 4 && n.x + 12 > o.x + 2 && n.x + 4 < o.x + 14
        if (carp) {
          if (n.tur === 'jeton') {
            o.skor += 10 * o.bolum
            setSkor(o.skor)
            sr.current.setBirUp(o.skor)
            if (sesAcik.current) bip('al')
            const yeni = 1 + Math.floor(o.skor / 150)
            if (yeni > o.bolum) {
              o.bolum = yeni
              setBolum(yeni)
              sr.current.duyur(`Bölüm ${yeni}`)
              if (sesAcik.current) bip('seviye')
            }
          } else if (o.yara === 0) {
            o.can--
            o.yara = 60
            setCan(o.can)
            if (sesAcik.current) bip('vur')
            sr.current.duyur(o.can > 0 ? `Kafatası! Kalan can ${o.can}` : 'Oyun bitti')
          }
          continue
        }
        if (n.y < ZEMIN) kalan.push(n)
      }
      o.nesneler = kalan
      return o.can > 0
    }
    const dongu = (t: number) => {
      biriken += Math.min(100, t - son)
      son = t
      let devam = true
      while (biriken >= 1000 / 60 && devam) {
        devam = adim()
        biriken -= 1000 / 60
      }
      ciz()
      if (!devam) {
        setDurum('bitti')
        if (sesAcik.current) bip('bitti')
        onBitti(oyun.current.skor, oyun.current.bolum)
        return
      }
      raf = requestAnimationFrame(dongu)
    }
    raf = requestAnimationFrame(dongu)
    const gizlen = () => document.hidden && setDurum('duraklat')
    document.addEventListener('visibilitychange', gizlen)
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('visibilitychange', gizlen)
    }
  }, [durum, ciz, onBitti])

  useEffect(() => ciz(), [ciz, kat])

  const basla = () => {
    if (durum === 'duraklat') {
      setDurum('oyun')
      kap.current?.focus()
      return
    }
    if (!s.krediHarca()) {
      s.duyur('Kredi yok. Önce jeton at.')
      return
    }
    sifirla()
    setDurum('oyun')
    s.duyur('Oyun başladı. Sol ve sağ ok tuşlarıyla hareket et, P ile duraklat.')
    kap.current?.focus()
  }

  const klavye = (e: KeyboardEvent, basili: boolean) => {
    const k = e.key
    if (k === 'ArrowLeft' || k === 'a' || k === 'A') tus.current.sol = basili
    else if (k === 'ArrowRight' || k === 'd' || k === 'D') tus.current.sag = basili
    else if (basili && (k === 'p' || k === 'P' || k === 'Escape') && durum === 'oyun') {
      setDurum('duraklat')
      s.duyur('Duraklatıldı')
    } else if (basili && (k === 'Enter' || k === ' ') && durum !== 'oyun') basla()
    else return
    e.preventDefault()
  }
  const dokun = (yon: 'sol' | 'sag', v: boolean) => (e: PointerEvent) => {
    e.preventDefault()
    tus.current[yon] = v
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <dl className="m-0 flex flex-wrap items-baseline gap-x-6 text-body-l" aria-label="Oyun durumu">
          <div className="flex gap-2">
            <dt data-ton="kirmizi" className="font-ps text-xs text-tx uppercase">
              Skor
            </dt>
            <dd className="tabnum m-0" data-oyun-skor="">
              {pad(skor)}
            </dd>
          </div>
          <div className="flex gap-2">
            <dt data-ton="yesil" className="font-ps text-xs text-tx uppercase">
              Bölüm
            </dt>
            <dd className="tabnum m-0">{bolum}</dd>
          </div>
        </dl>
        <div className="flex items-center gap-1" role="img" aria-label={`Can: ${can} / 3`} data-can={can}>
          {[0, 1, 2].map((i) => (
            <Sprite key={i} ad={i < can ? 'kalp' : 'kalpBos'} buyukluk={1} />
          ))}
        </div>
      </div>
      <div ref={kap} tabIndex={0} role="application" aria-roledescription="oyun" aria-label="Jeton Avcısı. Sol ve sağ ok ya da A ve D ile yürü, P ile duraklat, Enter ile başla." aria-describedby="oyun-durum" onKeyDown={(e) => klavye(e, true)} onKeyUp={(e) => klavye(e, false)} onBlur={() => (tus.current = { sol: false, sag: false })} className="relative grid min-w-0 justify-items-center bg-[#000] py-2" data-oyun="">
        <canvas ref={cv} width={W} height={H} className="pixelated block" style={{ width: kat.css, height: (kat.css * H) / W }} aria-hidden="true" />
        {durum !== 'oyun' ? (
          <div className="absolute inset-0 grid place-content-center gap-4 bg-[#000] p-4 text-center text-[#fff]" id="oyun-durum">
            <ArcadeText as="p" boyut="m" className={durum === 'bitti' ? 'text-[#ff0000]' : 'text-[#ffea00]'} yanip={durum === 'hazir' && !s.kredi}>
              {durum === 'bitti' ? 'Oyun bitti' : durum === 'duraklat' ? 'Duraklatıldı' : s.kredi ? 'Hazır' : 'Jeton at'}
            </ArcadeText>
            <p className="text-body-l">{durum === 'bitti' ? `Skor ${pad(skor)} · bölüm ${bolum}` : durum === 'duraklat' ? 'Devam için Enter ya da düğme.' : s.kredi ? `Kredi ${s.kredi}. Enter ya da Başla.` : 'Bir oyun 1 kredi.'}</p>
          </div>
        ) : (
          <p id="oyun-durum" className="sr-only">
            Oyun sürüyor
          </p>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <PixelButton ton="sari" onClick={() => s.jetonAt()} ikon={<Ikon ad="jeton" buyukluk={1} />} data-oyun-jeton="">
            Jeton at
          </PixelButton>
          {durum === 'oyun' ? (
            <PixelButton ton="beyaz" onClick={() => setDurum('duraklat')} ikon={<Ikon ad="dur" buyukluk={1} />}>
              Duraklat
            </PixelButton>
          ) : (
            <PixelButton ton="yesil" onClick={basla} disabled={durum !== 'duraklat' && !s.kredi} ikon={<Ikon ad="oynat" buyukluk={1} />} data-oyun-basla="">
              {durum === 'duraklat' ? 'Devam' : 'Başla'}
            </PixelButton>
          )}
        </div>
        <div className={cx('flex gap-3', durum !== 'oyun' && 'invisible')} aria-hidden="true">
          <button type="button" tabIndex={-1} className="pbtn size-[calc(var(--u)*20)] touch-none !p-0" data-ton="beyaz" onPointerDown={dokun('sol', true)} onPointerUp={dokun('sol', false)} onPointerLeave={dokun('sol', false)} onPointerCancel={dokun('sol', false)}>
            <Ikon ad="sol" />
          </button>
          <button type="button" tabIndex={-1} className="pbtn size-[calc(var(--u)*20)] touch-none !p-0" data-ton="beyaz" onPointerDown={dokun('sag', true)} onPointerUp={dokun('sag', false)} onPointerLeave={dokun('sag', false)} onPointerCancel={dokun('sag', false)}>
            <Ikon ad="sag" />
          </button>
        </div>
      </div>
      <HealthBar etiket="Bölüm ilerlemesi" tur="xp" deger={skor % 150} max={150} bolum={15} />
      <p className="text-muted">
        Ölçek {kat.k}x · {W}×{H} piksel · jeton +10 × bölüm, kafatası −1 can. Klavye: ok tuşları ya da A/D, P duraklatır. Dokunmatikte alttaki oklar.
      </p>
    </div>
  )
}
