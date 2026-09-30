import { useAnimationFrame, useMotionValue, useMotionValueEvent, useTransform, motion, type MotionValue } from 'motion/react'
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { cx } from '../../shared/cx'
import { Dev } from '../components/Harfler'
import { useEkranda, useKayit, useSaat } from '../components/hooks'
import { KatmanMetin } from '../components/KatmanMetin'
import { Aralik, Bolum, Buton, Kod, KENAR, Secim } from '../components/ui'
import { kontrast, oran } from '../lib/contrast'
import { palet } from '../lib/data'
import { useKayma } from '../lib/kayma'
import { useKinetic } from '../lib/store'
import { DonenMetin } from './Giris'

/* ───────────────────────── Madde 4 · Renk ───────────────────────── */

const SWATCH = [
  { ad: 'Saf Siyah', hex: '#000000', bg: '#000000', fg: '#ffffff', not: 'Zemin. Sayfanın tamamı, dokusuz ve gradyansız.' },
  { ad: 'Saf Beyaz', hex: '#FFFFFF', bg: '#ffffff', fg: '#000000', not: 'Metin. Dev harfler ve gövde yazısı.' },
  { ad: 'Asit Yeşili', hex: '#CCFF00', bg: '#ccff00', fg: '#000000', not: 'Tek neon vurgu (1). Siyah üstünde 17,9:1.' },
  { ad: 'Elektrik Kırmızısı', hex: '#FF3B3B', bg: '#ff3b3b', fg: '#000000', not: 'Tek neon vurgu (2). Siyah üstünde 5,9:1.' },
] as const

export function Renk() {
  const { tema, vurgu, kontrast: kt, setTema, setVurgu } = useKinetic()
  const p = palet(tema, vurgu, kt)
  const satirlar: [string, string, string, string, number][] = [
    ['Metin', p.metin, p.zemin, 'Gövde ve dev harf', kontrast(p.metin, p.zemin)],
    ['İkincil metin', p.soluk, p.zemin, 'Etiket, açıklama', kontrast(p.soluk, p.zemin)],
    ['Denetim çizgisi', p.kontrol, p.zemin, 'Form ve düğme çerçevesi (≥ 3:1)', kontrast(p.kontrol, p.zemin)],
    ['Vurgu (yazı)', p.vurguYazi, p.zemin, 'Neon yazı ve odak halkası', kontrast(p.vurguYazi, p.zemin)],
    ['Vurgu üstü yazı', p.vurguUzeri, p.vurgu, 'Dolu düğme etiketi', kontrast(p.vurguUzeri, p.vurgu)],
    ['Ayraç', p.hat, p.zemin, 'Yalnız süs: ince çizgi', kontrast(p.hat, p.zemin)],
  ]
  const karar = (k: number, ad: string) => (ad === 'Ayraç' ? 'Yalnız süs' : ad === 'Denetim çizgisi' ? (k >= 3 ? 'Çizgi için yeterli' : 'Yetersiz') : k >= 7 ? 'AAA' : k >= 4.5 ? 'AA' : 'Yetersiz')
  return (
    <Bolum id="renk" no="02" madde="Madde 4 · Renk paleti" baslik="Siyah, beyaz, tek neon" vurgulu={[2, 3]} lead="Saf siyah zemin, saf beyaz metin ve yalnız bir neon: asit yeşili ya da elektrik kırmızısı. İkisi aynı sayfada birlikte kullanılmaz; neon, gözün gitmesi gereken tek yeri işaretler.">
      <div className={`${KENAR} grid grid-cols-1 gap-x-8 gap-y-14`}>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" data-paletler="">
          {SWATCH.map((r) => (
            <li key={r.hex} data-renk={r.hex}>
              <div className="flex min-h-[clamp(150px,17vw,230px)] items-start border-2 border-metin p-5" style={{ background: r.bg, color: r.fg }}>
                <p className="rakam text-[clamp(22px,2.4vw,32px)]">{r.hex}</p>
              </div>
              <h3 className="dev mt-4 text-[clamp(18px,1.9vw,28px)] break-words">{r.ad}</h3>
              <p className="mt-2 text-[15px] text-soluk">{r.not}</p>
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="grid grid-cols-1 content-start gap-8 lg:col-span-4">
            <Secim<'asit' | 'kirmizi'>
              legend="Neon vurgu (sayfanın tamamı)"
              name="renk-vurgu"
              value={vurgu}
              onChange={setVurgu}
              options={[
                { id: 'asit', ad: 'Asit yeşili' },
                { id: 'kirmizi', ad: 'Kırmızı' },
              ]}
            />
            <Secim<'kara' | 'ak'>
              legend="Zemin"
              name="renk-tema"
              value={tema}
              onChange={setTema}
              options={[
                { id: 'kara', ad: 'Siyah' },
                { id: 'ak', ad: 'Beyaz' },
              ]}
            />
            <p className="text-[16px] text-soluk">Beyaz zeminde asit yeşili yazı olamaz (1,2:1); orada dolgu olarak kalır, yazı rengi koyu zeytine döner.</p>
          </div>
          <div className="overflow-x-auto lg:col-span-8" role="region" aria-label="Renk çiftleri kontrastı" tabIndex={0}>
            <table className="tablo w-full min-w-[640px] border-collapse text-[16px]" data-renk-tablo="">
              <caption className="kicker">Şu anki kombinasyonun kontrastları</caption>
              <thead>
                <tr>
                  {['Renk', 'Zemin', 'Oran', 'Karar'].map((b) => (
                    <th key={b} scope="col">
                      {b}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {satirlar.map(([ad, fg, bg, kul, k]) => (
                  <tr key={ad} data-oran={k.toFixed(2)}>
                    <th scope="row">
                      <span className="mr-3 inline-block size-4 border border-metin align-[-2px]" style={{ background: fg }} aria-hidden="true" />
                      {ad}
                      <span className="block text-[13px] font-normal text-soluk">{kul}</span>
                    </th>
                    <td>{bg === p.zemin ? 'Zemin' : 'Vurgu'}</td>
                    <td className="rakam text-[17px]">{oran(k)}</td>
                    <td>{karar(k, ad)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Bolum>
  )
}

/* ───────────────────────── Madde 5 · Yazı ───────────────────────── */

export function Yazi() {
  const [agirlik, setAgirlik] = useState(800)
  const [aralik, setAralik] = useState(-0.045)
  const [salin, setSalin] = useState(false)
  const { hareket } = useKinetic()
  const kap = useRef<HTMLDivElement>(null)
  const ornek = useRef<HTMLSpanElement>(null)
  const genislik = useRef<HTMLSpanElement>(null)
  useSaat(kap, 'agirlik-salinim', salin)
  useEffect(() => {
    const el = ornek.current
    if (!el) return
    const oku = () => {
      if (genislik.current) genislik.current.textContent = String(Math.round(el.getBoundingClientRect().width))
      el.dataset.agirlik = getComputedStyle(el).fontWeight
    }
    oku()
    const ro = new ResizeObserver(oku)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const stil: CSSProperties = { fontWeight: salin && hareket ? 'calc(600 + 100 * (1 + sin(var(--t, 0) * 1.4)))' : agirlik, letterSpacing: `${aralik}em` }
  return (
    <Bolum
      id="yazi"
      no="03"
      madde="Madde 5 · Tipografi"
      baslik="Kalın, geniş, değişken"
      vurgulu={[2]}
      lead={<>Başlıkta Syne, gövdede Inter. İkisi de değişken yazı tipidir; Syne’nin dikkat çekici yanı, ağırlık arttıkça harflerin genişlemesidir. 700’den 800’e çıkarken kelime yaklaşık yarı oranında genişler. Aşağıda deneyin.</>}
    >
      <div className={`${KENAR} grid grid-cols-1 gap-x-8 gap-y-14 lg:grid-cols-12`}>
        <div ref={kap} className="lg:col-span-12" data-yazi-ornek="">
          <div className="sigdir border-y-2 border-metin py-8">
            <p className="dev dev-boy" style={{ ['--boy' as string]: 'clamp(40px, 12vw, 190px)', ['--uz' as string]: 7 }}>
              <span ref={ornek} className="inline-block whitespace-nowrap" style={stil} data-ornek="">
                Ağırlık
              </span>
            </p>
          </div>
          <p className="mt-4 flex flex-wrap gap-x-8 gap-y-1 text-[15px] text-soluk">
            <span>
              Ağırlık:{' '}
              <b className="rakam text-metin" data-agirlik-yazi="">
                {salin && hareket ? 'salınıyor' : agirlik}
              </b>
            </span>
            <span>
              Kelime genişliği: <b className="rakam text-metin" ref={genislik} data-genislik="" /> px
            </span>
          </p>
        </div>
        <div className="grid grid-cols-1 content-start gap-8 lg:col-span-5">
          <Aralik
            id="yazi-agirlik"
            label="Ağırlık"
            value={agirlik}
            min={400}
            max={800}
            step={50}
            onChange={(v) => {
              setSalin(false)
              setAgirlik(v)
            }}
            format={(v) => (v === 800 ? '800 · Extra' : String(v))}
          />
          <Aralik id="yazi-aralik" label="Harf aralığı" value={aralik} min={-0.08} max={0.04} step={0.005} onChange={setAralik} format={(v) => `${v.toFixed(3).replace('.', ',')} em`} />
          <div>
            <Buton aria-pressed={salin} onClick={() => setSalin((s) => !s)} disabled={!hareket} data-salin="">
              {salin ? 'Salınımı durdur' : 'Ağırlığı salındır'}
            </Buton>
            {!hareket ? <p className="mt-2 text-[14px] text-soluk">Hareket durdurulduğu için salınım kapalı.</p> : null}
          </div>
        </div>
        <div className="overflow-x-auto lg:col-span-7" role="region" aria-label="Tip ölçeği" tabIndex={0}>
          <table className="tablo w-full min-w-[560px] border-collapse text-[15px]" data-tip-olcegi="">
            <caption className="kicker">Tip ölçeği</caption>
            <thead>
              <tr>
                {['Rol', 'Yazı tipi', 'Boy / satır', 'Ağırlık'].map((b) => (
                  <th key={b} scope="col">
                    {b}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Görüntü (KineticDisplay)', 'Syne', 'clamp(48, 15vw, 260) / 0,88', '800'],
                ['Başlık', 'Syne', 'clamp(38, 9,4vw, 152) / 0,88', '800'],
                ['Alt başlık', 'Syne', '26–64 / 0,88', '800'],
                ['Gövde', 'Inter', '17 / 1,6', '400'],
                ['Etiket', 'Inter', '12 / 1,5, +0,18 em', '500–600'],
                ['Sayı', 'Syne', 'tabular', '700'],
              ].map(([a, b, c, d]) => (
                <tr key={a}>
                  <th scope="row">{a}</th>
                  <td>{b}</td>
                  <td className="rakam text-[14px]">{c}</td>
                  <td className="rakam text-[14px]">{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="max-w-[60ch] text-[16px] text-soluk lg:col-span-12">
          Monument Extended lisanslı bir yazı tipidir; bu sayfa aynı hissi açık kaynaklı, değişken ve OFL lisanslı <span lang="en">Syne</span> ile verir. Gövdede <span lang="en">Inter Variable</span>; ikisinde de ğ, ş, ı, İ, ç, ö, ü vardır, ₺ Inter’den gelir.
        </p>
      </div>
    </Bolum>
  )
}

/* ───────────────────────── Madde 6 · Şekil ───────────────────────── */

type SekilMod = 'dalga' | 'halka' | 'kesik' | 'kontur'

function DalgaYol({ hiz, genlik }: { hiz: number; genlik: number }) {
  const { hareket, hizRef } = useKinetic()
  const tp = useRef<SVGTextPathElement>(null)
  const svg = useRef<SVGSVGElement>(null)
  const ofset = useRef(0)
  const [ekranda, ekrandaRef] = useEkranda(svg)
  useKayit('sekil-dalga', hareket && ekranda)
  const d = useMemo(() => {
    const pts: string[] = []
    for (let i = 0; i <= 80; i++) {
      const x = -100 + (i / 80) * 1200
      const y = 150 + Math.sin((i / 80) * Math.PI * 2 * 1.5) * genlik * 620
      pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`)
    }
    return pts.join(' ')
  }, [genlik])
  useAnimationFrame((_, delta) => {
    const el = tp.current
    if (!el || !hareket || !ekrandaRef.current) return
    const per = el.getComputedTextLength() / 8
    if (!per) return
    ofset.current = (ofset.current - (delta / 1000) * 220 * hiz * hizRef.current) % per
    el.setAttribute('startOffset', String(ofset.current))
  })
  return (
    <svg ref={svg} viewBox="0 0 1000 300" className="block w-full overflow-visible" role="presentation" aria-hidden="true" data-cizim="dalga">
      <path id="sekil-yol" d={d} fill="none" stroke="none" />
      <text fontFamily="var(--font-baslik)" fontWeight="800" fontSize="84" letterSpacing="-3" fill="currentColor" style={{ textTransform: 'uppercase' }}>
        <textPath ref={tp} href="#sekil-yol" startOffset="0">
          {'AKIŞKAN · '.repeat(8)}
        </textPath>
      </text>
    </svg>
  )
}

export function Sekil() {
  const [mod, setMod] = useState<SekilMod>('dalga')
  const [hiz, setHiz] = useState(1)
  const [genlik, setGenlik] = useState(0.12)
  const sahne = useRef<HTMLDivElement>(null)
  useSaat(sahne, 'sekil', mod === 'kesik' || mod === 'kontur')
  const stil = { ['--hiz' as string]: hiz, ['--gen' as string]: genlik } as CSSProperties
  return (
    <Bolum
      id="sekil"
      no="04"
      madde="Madde 6 · Şekil dili"
      baslik="Harfler akışkan form"
      vurgulu={[1, 2]}
      lead="Kutu ve kart yoktur. Şekli harflerin kendi hatları verir: bir yol boyunca akan yazı, dönen halka, dilimlenip kayan kelime ve üzerinde neon şerit gezinen çizgi harf. Keskin olanlar ile kavisli olanlar aynı sahnede yaşar."
    >
      <div className={`${KENAR} grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-12`}>
        <div className="grid content-start gap-8 lg:col-span-4">
          <Secim<SekilMod>
            legend="Biçim"
            name="sekil-mod"
            value={mod}
            onChange={setMod}
            options={[
              { id: 'dalga', ad: 'Dalga (kavisli)' },
              { id: 'halka', ad: 'Halka (kavisli)' },
              { id: 'kesik', ad: 'Kesik (keskin)' },
              { id: 'kontur', ad: 'Çizgi (keskin)' },
            ]}
          />
          <Aralik id="sekil-hiz" label="Hız" value={hiz} min={0.25} max={3} step={0.25} onChange={setHiz} format={(v) => `×${v.toFixed(2).replace('.', ',')}`} />
          <Aralik id="sekil-genlik" label="Genlik" value={genlik} min={0} max={0.3} step={0.02} onChange={setGenlik} format={(v) => v.toFixed(2).replace('.', ',')} />
          <p className="text-[15px] text-soluk">Hız ve genlik hareket açıkken görünür. Durdurulunca her biçim tek bir okunur kareye döner.</p>
        </div>
        <div ref={sahne} className="border-2 border-metin p-6 lg:col-span-8" style={stil} data-sekil-sahne={mod} data-sekil-hiz={hiz}>
          <div className="grid min-h-[clamp(240px,34vw,400px)] place-items-center overflow-x-clip">
            {mod === 'dalga' ? <DalgaYol hiz={hiz} genlik={genlik} /> : null}
            {mod === 'halka' ? <DonenMetin boyut={340} sure={20 / hiz} metin="AKIŞKAN · AKIŞKAN · AKIŞKAN · " /> : null}
            {mod === 'kesik' ? <KesikKelime genlik={genlik} /> : null}
            {mod === 'kontur' ? <KonturKelime /> : null}
          </div>
        </div>
      </div>
    </Bolum>
  )
}

function KesikKelime({ genlik }: { genlik: number }) {
  const N = 9
  return (
    <div className="sigdir" aria-hidden="true" data-cizim="kesik">
      <span className="sr-only">Kesik</span>
      <span className="dev dev-boy grid" style={{ ['--boy' as string]: 'clamp(50px, 16vw, 200px)', ['--uz' as string]: 5 }}>
        {Array.from({ length: N }, (_, k) => (
          <span key={k} className="dilim" style={{ ['--k' as string]: k, clipPath: `inset(${(k / N) * 100}% 0 ${(1 - (k + 1) / N) * 100}% 0)`, ['--gen' as string]: genlik }}>
            Kesik
          </span>
        ))}
      </span>
    </div>
  )
}

function KonturKelime() {
  return (
    <div className="sigdir" aria-hidden="true" data-cizim="kontur">
      <span className="sr-only">Çizgi</span>
      <span className="dev dev-boy grid" style={{ ['--boy' as string]: 'clamp(50px, 16vw, 200px)', ['--uz' as string]: 5 }}>
        <span className="kontur" style={{ gridArea: '1 / 1' }}>
          Çizgi
        </span>
        <span className="tara vurgu" style={{ gridArea: '1 / 1' }}>
          Çizgi
        </span>
      </span>
    </div>
  )
}

/* ───────────────────────── Madde 7 · Derinlik ───────────────────────── */

export function Derinlik() {
  const [katman, setKatman] = useState(8)
  const [aralik, setAralik] = useState(40)
  const [golge, setGolge] = useState({ n: 0, toplam: 0 })
  useEffect(() => {
    const t = window.setTimeout(() => {
      const hepsi = Array.from(document.querySelectorAll<HTMLElement>('body *'))
      setGolge({
        n: hepsi.filter((e) => {
          const s = getComputedStyle(e)
          return s.boxShadow !== 'none' || s.textShadow !== 'none' || s.filter.includes('drop-shadow')
        }).length,
        toplam: hepsi.length,
      })
    }, 500)
    return () => window.clearTimeout(t)
  }, [])
  return (
    <Bolum
      id="derinlik"
      no="05"
      madde="Madde 7 · Z ekseni"
      baslik="Öne, arkaya"
      vurgulu={[1]}
      lead="Gölge yoktur. Derinliği harflerin Z ekseninde öne ve arkaya hareketi verir: aynı kelimenin katmanları perspektif içinde dizilir, imleç ya da parmak sahneyi döndürür. Ön katman doludur, arkadakiler yalnız çizgi olarak görünür."
    >
      <div className={`${KENAR} grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-12`}>
        <div className="border-2 border-metin lg:col-span-12">
          <div className="overflow-x-clip">
            <KatmanMetin metin="DERİN" katman={katman} aralik={aralik} />
          </div>
        </div>
        <div className="grid content-start gap-8 lg:col-span-4">
          <Aralik id="z-katman" label="Katman sayısı" value={katman} min={2} max={14} onChange={setKatman} />
          <Aralik id="z-aralik" label="Katman aralığı" value={aralik} min={8} max={80} step={2} onChange={setAralik} format={(v) => `${v} px`} />
          <p className="text-[15px] text-soluk">Sahnenin üstünde imleci gezdirin ya da parmağınızı sürükleyin. Hareket kapalıyken sahne sabit bir açıda durur; derinlik yine okunur.</p>
        </div>
        <div className="lg:col-span-8">
          <p className="kicker mb-4">Harf başına Z dalgası</p>
          <div className="overflow-x-clip py-6">
            <Dev metin="Öne arkaya" efekt={['z']} boy="clamp(36px, 8vw, 120px)" ad="z-harf" />
          </div>
          <div className="mt-8 border-t border-hat pt-6" data-golge-sayac={golge.n}>
            <p className="kicker">Canlı sayım</p>
            <p className="dev mt-2 text-[clamp(30px,4vw,56px)]">
              <span className="rakam">{golge.n}</span> öğede gölge
            </p>
            <p className="mt-2 text-[15px] text-soluk">
              Sayfadaki {golge.toplam} öğenin hiçbirinde <span lang="en">box-shadow</span>, <span lang="en">text-shadow</span> ya da <span lang="en">drop-shadow</span> yok.
            </p>
          </div>
        </div>
      </div>
    </Bolum>
  )
}

/* ───────────────────────── Madde 8 · Yüzey ve hız ───────────────────────── */

function IzKopya({ i, n, hizMV, kelime }: { i: number; n: number; hizMV: MotionValue<number>; kelime: string }) {
  const { hareket, tam } = useKinetic()
  const x = useTransform(hizMV, (v) => -v * 0.011 * i)
  const on = i === 0
  return (
    <motion.span className={cx('dev', !on && 'kontur', on ? 'z-[9]' : '')} style={{ gridArea: '1 / 1', x: hareket && tam ? x : 0, opacity: on ? 1 : Math.max(0.15, 1 - i / n) }} aria-hidden="true">
      {kelime}
    </motion.span>
  )
}

export function Yuzey() {
  const { yumusak } = useKayma()
  const { hareket, tam } = useKinetic()
  const kaynak = useRef<'gercek' | 'elle'>('gercek')
  const [mod, setMod] = useState<'gercek' | 'elle'>('gercek')
  const [elle, setElle] = useState(0)
  const hizMV = useMotionValue(0)
  const anlik = useRef<HTMLSpanElement>(null)
  const ivme = useRef<HTMLSpanElement>(null)
  const tepe = useRef<HTMLSpanElement>(null)
  const kok = useRef<HTMLDivElement>(null)
  const son = useRef({ v: 0, t: 0 })
  const enYuksek = useRef(0)
  const [sayim, setSayim] = useState({ golge: 0, gradyan: 0, filtre: 0, toplam: 0 })
  kaynak.current = mod
  useMotionValueEvent(yumusak, 'change', (v) => {
    if (kaynak.current === 'gercek') hizMV.set(v)
    const t = performance.now()
    const dt = (t - son.current.t) / 1000
    const a = dt > 0 && dt < 0.5 ? (v - son.current.v) / dt : 0
    son.current = { v, t }
    enYuksek.current = Math.max(enYuksek.current, Math.abs(v))
    if (anlik.current) anlik.current.textContent = String(Math.round(v))
    if (ivme.current) ivme.current.textContent = String(Math.round(a))
    if (tepe.current) tepe.current.textContent = String(Math.round(enYuksek.current))
    if (kok.current) {
      kok.current.dataset.hiz = String(Math.round(v))
      kok.current.dataset.tepe = String(Math.round(enYuksek.current))
    }
  })
  const say = () => {
    const hepsi = Array.from(document.querySelectorAll<HTMLElement>('body *'))
    let golge = 0
    let gradyan = 0
    let filtre = 0
    for (const e of hepsi) {
      const s = getComputedStyle(e)
      if (s.boxShadow !== 'none' || s.textShadow !== 'none') golge++
      if (s.backgroundImage !== 'none' || s.maskImage !== 'none') gradyan++
      if (s.filter !== 'none' || s.backdropFilter !== 'none') filtre++
    }
    setSayim({ golge, gradyan, filtre, toplam: hepsi.length })
  }
  useEffect(() => {
    const t = window.setTimeout(say, 600)
    return () => window.clearTimeout(t)
  }, [])
  const N = 8
  return (
    <Bolum
      id="yuzey"
      no="06"
      madde="Madde 8 · Doku ve yüzey"
      baslik="Doku yok, hız var"
      vurgulu={[2, 3]}
      lead="Yüzey tamamen pürüzsüz bir ekrandır: gölge, gradyan, filtre, görsel ve doku yok. Yüzeyde görünen tek şey ivmedir. Sayfayı kaydırın: kelime hız kadar esner, arkasında iz bırakır. Hızı ve ivmeyi sayı olarak okuyun."
    >
      <div ref={kok} className={`${KENAR} grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-12`} data-yuzey="" data-hiz="0" data-tepe="0">
        <div className="lg:col-span-12">
          <div className="sigdir overflow-x-clip border-y-2 border-metin py-10">
            <span className="dev dev-boy grid" style={{ ['--boy' as string]: 'clamp(48px, 15vw, 240px)', ['--uz' as string]: 5 }} data-iz="">
              <span className="sr-only">İvme</span>
              {Array.from({ length: N }, (_, k) => N - 1 - k).map((i) => (
                <IzKopya key={i} i={i} n={N} hizMV={hizMV} kelime="İvme" />
              ))}
            </span>
          </div>
          <p className="mt-3 text-[15px] text-soluk">{hareket && tam ? 'Arkadaki çizgi kopyalar hızla birlikte geride kalır; durunca üst üste biner.' : 'Hareket kapalı ya da hafif: iz çizilmez, kelime yerinde durur.'}</p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:col-span-12" data-hiz-okuma="">
          <div>
            <p className="kicker">Hız (px/sn)</p>
            <p className="dev mt-2 text-[clamp(30px,4.2vw,64px)] tabular-nums">
              <span ref={anlik}>0</span>
            </p>
          </div>
          <div>
            <p className="kicker">İvme (px/sn²)</p>
            <p className="dev mt-2 text-[clamp(30px,4.2vw,64px)] tabular-nums">
              <span ref={ivme}>0</span>
            </p>
          </div>
          <div>
            <p className="kicker">En yüksek hız</p>
            <p className="dev mt-2 text-[clamp(30px,4.2vw,64px)] tabular-nums text-vurgu-yazi">
              <span ref={tepe}>0</span>
            </p>
          </div>
        </div>
        <div className="grid content-start gap-6 lg:col-span-12 lg:grid-cols-2 lg:items-end">
          <Secim<'gercek' | 'elle'>
            legend="Hız kaynağı"
            name="yuzey-kaynak"
            value={mod}
            onChange={(v) => {
              setMod(v)
              hizMV.set(v === 'elle' ? elle : yumusak.get())
            }}
            options={[
              { id: 'gercek', ad: 'Gerçek kaydırma' },
              { id: 'elle', ad: 'Elle' },
            ]}
          />
          <Aralik
            id="yuzey-elle"
            label="Elle hız"
            value={elle}
            min={-3000}
            max={3000}
            step={100}
            onChange={(v) => {
              setElle(v)
              if (mod === 'elle') hizMV.set(v)
            }}
            format={(v) => `${v} px/sn`}
          />
        </div>

        <div className="lg:col-span-12" data-duzluk="">
          <div className="flex flex-wrap items-end justify-between gap-4 border-t border-hat pt-6">
            <p className="kicker">Yüzey denetimi · {sayim.toplam} öğe</p>
            <Buton onClick={say}>Yeniden say</Buton>
          </div>
          <dl className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {(
              [
                ['Gölge', sayim.golge, 'box-shadow, text-shadow'],
                ['Görsel ya da gradyan', sayim.gradyan, 'background-image, mask-image'],
                ['Filtre', sayim.filtre, 'filter, backdrop-filter'],
              ] as const
            ).map(([a, n, k]) => (
              <div key={a} data-say={a}>
                <dt className="kicker">{a}</dt>
                <dd className="dev mt-2 text-[clamp(40px,5vw,72px)]">{n}</dd>
                <dd className="mt-1 font-mono text-[12.5px] text-soluk">{k}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Bolum>
  )
}

/* ───────────────────────── Madde 9 · İkonografi ───────────────────────── */

const SLAYTLAR = ['Kimlik', 'Poster', 'Jenerik', 'Sergi', 'Kitap'] as const

export function Ikon() {
  const { hareket, duyur } = useKinetic()
  const [i, setI] = useState(0)
  const [calisiyor, setCalisiyor] = useState(true)
  const [sayi, setSayi] = useState(0)
  const [acik, setAcik] = useState(false)
  const [adet, setAdet] = useState(2)
  const say = () => setSayi(document.querySelectorAll('main svg:not([data-cizim]), main img, main picture, main canvas, main [class*="icon"]').length)
  useEffect(() => {
    const t = window.setTimeout(say, 600)
    return () => window.clearTimeout(t)
  }, [])
  const git = (d: number) => {
    const y = (i + d + SLAYTLAR.length) % SLAYTLAR.length
    setI(y)
    duyur(`${SLAYTLAR[y]}, ${y + 1} / ${SLAYTLAR.length}`)
  }
  return (
    <Bolum
      id="ikon"
      no="07"
      madde="Madde 9 · İkonografi"
      baslik="İkon yok, kelime var"
      vurgulu={[2, 3]}
      lead="Ok, çarpı, üç çizgi, oynat düğmesi: hiçbiri yok. Yönlendirme ve eylem doğrudan kelimeyle söylenir. Düğmenin yüzeyi de tipografidir: üzerine gelince etiket aşağı yuvarlanıp yerini aynı kelimeye bırakır."
    >
      <div className={`${KENAR} grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-12`}>
        <div className="lg:col-span-4" data-ikon-say={sayi}>
          <p className="kicker">Sayfadaki ikon, görsel ve tuval</p>
          <p className="dev text-[clamp(96px,16vw,220px)] text-vurgu-yazi">{sayi}</p>
          <div className="mt-2">
            <Buton onClick={say}>Yeniden say</Buton>
          </div>
          <p className="mt-4 text-[14px] text-soluk">
            Sayım <span lang="en">svg</span>, <span lang="en">img</span>, <span lang="en">canvas</span> ve simge sınıflarını kapsar. Yalnız harfleri yola oturtan çizimler (<span lang="en">data-cizim</span>) sayılmaz, çünkü onlar tipografidir.
          </p>
        </div>

        <div className="lg:col-span-8" data-sayfalayici="">
          <p className="kicker">Yön ve sayfalama · ok yerine kelime</p>
          <div className="mt-4 border-2 border-metin">
            <div className="grid min-h-[clamp(160px,22vw,260px)] place-items-center overflow-x-clip px-4 py-8">
              <p key={i} className={cx('dev text-[clamp(48px,11vw,150px)]', hareket && 'vurus')} data-slayt={i}>
                {SLAYTLAR[i]}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-metin p-3">
              <Buton onClick={() => git(-1)} data-geri="">
                Geri
              </Buton>
              <p className="rakam text-[22px]" data-sayac={`${i + 1}/${SLAYTLAR.length}`} aria-live="polite">
                {String(i + 1).padStart(2, '0')} / {String(SLAYTLAR.length).padStart(2, '0')}
              </p>
              <Buton ton="vurgu" onClick={() => git(1)} data-ileri="">
                İleri
              </Buton>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto lg:col-span-12" role="region" aria-label="İkon ve tipografik karşılıkları" tabIndex={0}>
          <table className="tablo w-full min-w-[640px] border-collapse text-[16px]" data-ikon-tablo="">
            <caption className="kicker">Klasik ikon ve tipografik karşılığı</caption>
            <thead>
              <tr>
                {['Klasik ikon', 'Karşılığı', 'Canlı'].map((b) => (
                  <th key={b} scope="col">
                    {b}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Menü (üç çizgi)</th>
                <td>
                  Kelime: <b>Menü</b>
                </td>
                <td>
                  <Buton aria-pressed={acik} onClick={() => setAcik((a) => !a)} data-menu="">
                    {acik ? 'Kapat' : 'Menü'}
                  </Buton>
                  {acik ? (
                    <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1 dev text-[22px]" data-menu-liste="">
                      <li>Stil</li>
                      <li>Renk</li>
                      <li>Yazı</li>
                    </ul>
                  ) : null}
                </td>
              </tr>
              <tr>
                <th scope="row">Oynat / duraklat</th>
                <td>
                  <b>Oynat</b> ve <b>Durdur</b> kelimeleri
                </td>
                <td>
                  <Buton onClick={() => setCalisiyor((c) => !c)} data-oynat="">
                    {calisiyor ? 'Durdur' : 'Oynat'}
                  </Buton>
                  <span className="etiket ml-4 text-soluk">{calisiyor ? 'çalışıyor' : 'durdu'}</span>
                </td>
              </tr>
              <tr>
                <th scope="row">Artı / eksi</th>
                <td>
                  Yazı işareti <b>+</b> ve <b>−</b>
                </td>
                <td>
                  <div className="inline-flex items-center gap-3" role="group" aria-label="Adet">
                    <Buton aria-label="Azalt" onClick={() => setAdet((a) => Math.max(0, a - 1))}>
                      −
                    </Buton>
                    <output className="rakam min-w-8 text-center text-[22px]" data-adet={adet} aria-live="polite">
                      {adet}
                    </output>
                    <Buton aria-label="Artır" onClick={() => setAdet((a) => Math.min(9, a + 1))}>
                      +
                    </Buton>
                  </div>
                </td>
              </tr>
              <tr>
                <th scope="row">Ok (yön)</th>
                <td>
                  <b>Geri</b> · <b>İleri</b> · <b>Yukarı</b> ve <b>02 / 05</b> sayacı
                </td>
                <td>
                  <a href="#ust" className="kbtn" data-ton="yalin">
                    Yukarı
                  </a>
                </td>
              </tr>
              <tr>
                <th scope="row">Büyüteç, çarpı</th>
                <td>
                  <b>Ara</b> ve <b>Kapat</b>
                </td>
                <td className="text-soluk">Aynı kalıp: tek kelime, çerçeveli düğme.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="lg:col-span-12">
          <Kod
            label="Düğme yüzeyi CSS"
            dar
          >{`.kbtn-y   { display: grid; overflow: clip; }\n.kbtn-a, .kbtn-b { grid-area: 1 / 1; transition: transform 300ms cubic-bezier(.7, 0, .2, 1); }\n.kbtn-b   { transform: translateY(115%); }      /* aynı etiketin kopyası, aria-hidden */\n.kbtn:hover .kbtn-a { transform: translateY(-115%); }\n.kbtn:hover .kbtn-b { transform: translateY(0); }`}</Kod>
        </div>
      </div>
    </Bolum>
  )
}
