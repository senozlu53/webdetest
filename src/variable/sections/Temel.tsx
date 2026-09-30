import { animate } from 'motion'
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { cx } from '../../shared/cx'
import { useEkranda } from '../components/hooks'
import { GlitchMetin } from '../components/GlitchMetin'
import { KatmanSahne, type KatmanTanim } from '../components/KatmanSahne'
import { PikselMetin } from '../components/PikselMetin'
import { Aralik, Bolum, Buton, Glif, KENAR, Kod, Secim } from '../components/ui'
import { kontrast, oran } from '../lib/contrast'
import { AILELER, BOZULMALAR, GLIFLER, PALET_ACIKLAMA, eksenDizesi, palet, type Aile } from '../lib/data'
import { useVariable, type Palet } from '../lib/store'

/* ───────────────────────── Madde 4 · Renk ───────────────────────── */

const PALETLER: Palet[] = ['ham', 'ters', 'kobalt', 'beton']

export function Renk() {
  const { palet: pl, setPalet, kontrast: kt } = useVariable()
  const p = palet(pl, kt)
  const satirlar: [string, string, string, string, string, number][] = [
    ['Metin', p.metin, p.zemin, 'Zemin', 'Gövde ve dev harf', kontrast(p.metin, p.zemin)],
    ['İkincil metin', p.soluk, p.zemin, 'Zemin', 'Etiket, açıklama', kontrast(p.soluk, p.zemin)],
    ['Denetim çizgisi', p.kontrol, p.zemin, 'Zemin', 'Form ve düğme çerçevesi (≥ 3:1)', kontrast(p.kontrol, p.zemin)],
    ['Patlama (yazı)', p.patlamaYazi, p.zemin, 'Zemin', 'Vurgu yazısı ve odak halkası', kontrast(p.patlamaYazi, p.zemin)],
    ['Patlama üstü yazı', p.patlamaUzeri, p.patlama, 'Patlama', 'Dolu düğme etiketi', kontrast(p.patlamaUzeri, p.patlama)],
    ['Ayraç', p.hat, p.zemin, 'Zemin', 'Yalnız süs: ince çizgi', kontrast(p.hat, p.zemin)],
  ]
  const karar = (k: number, ad: string) => (ad === 'Ayraç' ? 'Yalnız süs' : ad === 'Denetim çizgisi' ? (k >= 3 ? 'Çizgi için yeterli' : 'Yetersiz') : k >= 7 ? 'AAA' : k >= 4.5 ? 'AA' : 'Yetersiz')
  return (
    <Bolum id="renk" no="02" madde="Madde 4 · Renk paleti" baslik="Ham ya da patlama" vurgulu={[2]} lead="İki yol var: ya tamamen ham siyah-beyaz zıtlık, ya da tek renkli bir zemin üstünde patlayan tek bir zıt renk. İkisinin arası yok; üçüncü bir renk hiçbir zaman girmez.">
      <div className={`${KENAR} grid grid-cols-1 gap-x-8 gap-y-14`}>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" data-paletler="">
          {PALETLER.map((id) => {
            const v = palet(id, kt)
            const on = id === pl
            return (
              <li key={id} data-palet-kart={id}>
                <button type="button" aria-pressed={on} onClick={() => setPalet(id)} className="block w-full border-2 border-metin p-0 text-left" data-onizle={id} style={{ background: 'var(--zemin)', color: 'var(--metin)' }} aria-label={`${v.ad} paletini uygula: ${PALET_ACIKLAMA[id]}`}>
                  <span className="vk block px-4 pt-4 text-[clamp(64px,7vw,104px)] leading-[0.95]" style={{ ['--wght' as string]: id === 'ters' ? 200 : 900, ['--wdth' as string]: id === 'kobalt' ? 151 : 60, ['--slnt' as string]: id === 'beton' ? -10 : 0 }} aria-hidden="true">
                    Aa
                  </span>
                  <span className="block px-4 pt-2 pb-3">
                    <span className="etiket block">{v.ad}</span>
                    <span className="rakam mt-1 block text-[12.5px]">
                      {v.zemin} · {v.metin}
                    </span>
                  </span>
                  <span className="patlama-blok block px-4 py-2 text-[12.5px] font-semibold" style={{ background: 'var(--patlama)', color: 'var(--patlama-uzeri)' }}>
                    {on ? 'Seçili' : 'Uygula'} · {v.patlama}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
        <p className="max-w-[62ch] text-[16px] text-soluk" data-palet-not="">
          {PALET_ACIKLAMA[pl]}.
        </p>
        <div className="overflow-x-auto" role="region" aria-label="Renk çiftleri kontrastı" tabIndex={0}>
          <table className="tablo w-full min-w-[640px] border-collapse text-[16px]" data-renk-tablo="">
            <caption className="kicker">Şu anki palet: {p.ad}</caption>
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
              {satirlar.map(([ad, fg, , bgAd, kul, k]) => (
                <tr key={ad} data-oran={k.toFixed(2)}>
                  <th scope="row">
                    <span className="mr-3 inline-block size-4 border border-metin align-[-2px]" style={{ background: fg }} aria-hidden="true" />
                    {ad}
                    <span className="block text-[13px] font-normal text-soluk">{kul}</span>
                  </th>
                  <td>{bgAd}</td>
                  <td className="rakam text-[17px]">{oran(k)}</td>
                  <td>{karar(k, ad)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Bolum>
  )
}

/* ───────────────────────── Madde 5 · Yazı (eksen laboratuvarı) ───────────────────────── */

const ORNEK: Record<Aile, string> = { flex: 'Bükülen harf', rec: 'Ham & sıradan', fra: 'Cıvık serif' }

function varsayilanlar(a: Aile) {
  const d: Record<string, number> = {}
  for (const e of AILELER[a].eksenler) d[e.tag] = e.varsayilan
  // gösterim için büyük optik boyut
  if ('opsz' in d) d.opsz = AILELER[a].eksenler.find((e) => e.tag === 'opsz')!.max
  return d
}

/** açılışta ve aile değişince örnek, sıradan değil garip bir ön ayarla başlar; Sıfırla yazı tipinin kendi varsayılanına döner */
const BASLANGIC: Record<Aile, string> = { flex: 'Şişkin', rec: 'Sıradan', fra: 'Cıvık' }
function baslangic(a: Aile) {
  return { ...varsayilanlar(a), ...AILELER[a].onayarlar.find((o) => o.ad === BASLANGIC[a])!.deger }
}

export function Yazi() {
  const [aile, setAile] = useState<Aile>('flex')
  const [deger, setDeger] = useState<Record<string, number>>(() => baslangic('flex'))
  const [hesap, setHesap] = useState('')
  const orn = useRef<HTMLParagraphElement>(null)
  const a = AILELER[aile]
  const dize = eksenDizesi(deger)
  useEffect(() => {
    if (orn.current) setHesap(getComputedStyle(orn.current).fontVariationSettings)
  }, [dize, aile])
  const sec = (x: Aile) => {
    setAile(x)
    setDeger(baslangic(x))
  }
  const rastgele = () => {
    const d: Record<string, number> = {}
    for (const e of a.eksenler) {
      const v = e.min + Math.random() * (e.max - e.min)
      d[e.tag] = e.adim >= 1 ? Math.round(v) : Math.round(v / e.adim) * e.adim
    }
    setDeger(d)
  }
  return (
    <Bolum
      id="yazi"
      no="03"
      madde="Madde 5 · Tipografi"
      baslik="Sınırsız eksen"
      vurgulu={[1]}
      aile="rec"
      lead="Üç değişken yazı tipi: Roboto Flex (13 eksen), Recursive (5 eksen) ve Fraunces (4 eksen). Her eksen bir kaydırıcı. Ayarları çevirin, rastgele bozun, hazır bir garip biçim seçin; kullandığınız dize altta canlı yazılır. Gövde yazısı ise Inter Light’ta kalır ve hiç bükülmez."
    >
      <div className={`${KENAR} grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-12`}>
        <div className="lg:col-span-12" data-eksen-lab="">
          <div className="overflow-x-clip border-y-2 border-metin py-8" data-ornek-kap="">
            <p
              ref={orn}
              className={cx('vk m-0 leading-[0.95]', a.css)}
              style={{ fontFamily: aile === 'flex' ? 'var(--font-disp)' : aile === 'rec' ? 'var(--font-rec)' : 'var(--font-fra)', fontVariationSettings: dize, fontSize: 'clamp(46px, 10vw, 150px)', overflowWrap: 'anywhere' }}
              data-ornek=""
              data-dize={dize}
            >
              {ORNEK[aile]}
            </p>
          </div>
          <p className="mt-3 font-mono text-[13px] break-words text-soluk" data-hesaplanan={hesap}>
            font-variation-settings: {dize}
          </p>
        </div>
        <div className="grid content-start gap-6 lg:col-span-4">
          <Secim<Aile>
            legend="Yazı tipi"
            name="yazi-aile"
            value={aile}
            onChange={sec}
            options={[
              { id: 'flex', ad: 'Roboto Flex' },
              { id: 'rec', ad: 'Recursive' },
              { id: 'fra', ad: 'Fraunces' },
            ]}
          />
          <p className="text-[15px] text-soluk" data-aile-not="">
            {a.not}.
          </p>
          <div>
            <p className="kicker mb-3">Hazır biçimler</p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Hazır biçimler">
              {a.onayarlar.map((o) => (
                <Buton key={o.ad} onClick={() => setDeger({ ...varsayilanlar(aile), ...o.deger })} data-onayar={o.ad}>
                  {o.ad}
                </Buton>
              ))}
              <Buton ton="patlama" onClick={rastgele} glif="&" data-rastgele="">
                Rastgele
              </Buton>
              <Buton ton="yalin" onClick={() => setDeger(varsayilanlar(aile))} data-sifirla="">
                Sıfırla
              </Buton>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2 lg:col-span-8" data-eksen-kaydiricilar="" data-eksen-say={a.eksenler.length}>
          {a.eksenler.map((e) => (
            <Aralik
              key={aile + e.tag}
              id={`eks-${e.tag}`}
              label={`${e.ad} · ${e.tag}`}
              value={deger[e.tag] ?? e.varsayilan}
              min={e.min}
              max={e.max}
              step={e.adim}
              onChange={(v) => setDeger((d) => ({ ...d, [e.tag]: v }))}
              format={(v) => (Number.isInteger(v) ? String(v) : v.toFixed(2).replace('.', ','))}
            />
          ))}
        </div>
        <p className="max-w-[64ch] text-[16px] text-soluk lg:col-span-12">
          Decovar bu sayfada yok: <span lang="en">Google Fonts</span> ve <span lang="en">Fontsource</span> içinde dağıtılmıyor. Onun yerini Recursive’in <span lang="en">CASL</span> ve <span lang="en">MONO</span> eksenleriyle Fraunces’in <span lang="en">SOFT</span> ve <span lang="en">WONK</span>{' '}
          eksenleri alıyor.
        </p>
      </div>
    </Bolum>
  )
}

/* ───────────────────────── Madde 6 · Şekil ───────────────────────── */

export function Sekil() {
  const [secili, setSecili] = useState(2)
  return (
    <Bolum
      id="sekil"
      no="04"
      madde="Madde 6 · Şekil dili"
      baslik="Uzat, sıkıştır, boz"
      vurgulu={[0, 1]}
      aile="fra"
      lead="Standart harf formunun dışına çıkmak için tek bir eksen yetmez: dokuz bozulma aynı iki harfe uygulanmış. Üzerine gelince ya da odaklanınca her biri kendi karşıt ucuna elastik biçimde geçer; ağırlık, genişlik ve eğim geçişleri kayıtlı özelliklerle ara değer üretir."
    >
      <div className={`${KENAR} grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3`} data-muze="">
        {BOZULMALAR.map((b, i) => {
          const ucAksen = Object.keys(b.deger).every((k) => ['wght', 'wdth', 'slnt'].includes(k))
          const w = b.deger.wght ?? 400
          const d = b.deger.wdth ?? 100
          const s = b.deger.slnt ?? 0
          const stil = ucAksen
            ? ({ ['--w0' as string]: w, ['--d0' as string]: d, ['--s0' as string]: s, ['--wh' as string]: w > 500 ? 100 : 1000, ['--dh' as string]: d > 100 ? 25 : 151, ['--sh' as string]: s < 0 ? 0 : -10 } as CSSProperties)
            : ({ fontVariationSettings: `'opsz' 144, ${eksenDizesi({ wdth: 100, ...b.deger })}` } as CSSProperties)
          return (
            <button key={b.ad} type="button" aria-pressed={i === secili} onClick={() => setSecili(i)} className="muze-kart group border-2 border-metin p-4 text-left" data-bozulma={b.ad} data-uc={ucAksen ? 'evet' : 'hayir'}>
              <span className="kicker flex justify-between gap-3">
                <span>{String(i + 1).padStart(2, '0')}</span>
                <span>{b.ad}</span>
              </span>
              <span className={cx('vk muze-harf block overflow-x-clip py-2 text-[clamp(90px,11vw,150px)] leading-[0.95]', ucAksen && 'muze-gecis')} style={stil} aria-hidden="true">
                Ağ
              </span>
              <span className="rakam block text-[12px] break-words text-soluk">{eksenDizesi(b.deger)}</span>
            </button>
          )
        })}
      </div>
    </Bolum>
  )
}

/* ───────────────────────── Madde 7 · Derinlik ───────────────────────── */

const KATMANLAR: KatmanTanim[] = [
  { metin: 'BÜK', aile: 'flex', eksen: { '--wght': 1000, '--wdth': 151 }, ton: 9 },
  { metin: 'ÜSTÜNE', aile: 'fra', eksen: { '--wght': 300, '--soft': 100, '--wonk': 1, '--opsz': 144 }, ton: 26 },
  { metin: 'binen', aile: 'rec', eksen: { '--wght': 800, '--casl': 1, '--slnt': -12 }, ton: 58 },
  { metin: 'katman', aile: 'flex', eksen: { '--wght': 500, '--wdth': 45 }, ton: 100 },
]

export function Derinlik() {
  const [say, setSay] = useState(4)
  const [oranD, setOranD] = useState(0.62)
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
  const kat = KATMANLAR.slice(KATMANLAR.length - say)
  return (
    <Bolum
      id="derinlik"
      no="05"
      madde="Madde 7 · Z ekseni"
      baslik="Üst üste"
      vurgulu={[1]}
      lead="Gölge yok. Derinliği farklı boyutlardaki metin katmanlarının üst üste binmesi verir: en büyük katman en soluk ve en arkada, en küçük katman en koyu ve en önde. İmleci sahnenin üstünde gezdirin; her katman farklı miktarda kayar."
    >
      <div className={`${KENAR} grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-12`}>
        <div className="border-2 border-metin p-4 lg:col-span-12">
          <KatmanSahne katmanlar={kat} oran={oranD} />
        </div>
        <div className="grid content-start gap-6 lg:col-span-4">
          <Aralik id="katman-say" label="Katman sayısı" value={say} min={2} max={4} onChange={setSay} />
          <Aralik id="katman-oran" label="Boy oranı" value={oranD} min={0.45} max={0.8} step={0.01} onChange={setOranD} format={(v) => v.toFixed(2).replace('.', ',')} />
        </div>
        <div className="lg:col-span-8" data-golge-sayac={golge.n}>
          <p className="kicker">Canlı sayım</p>
          <p className="mt-2 text-[clamp(30px,4vw,56px)] leading-none" style={{ fontFamily: 'var(--font-disp)', fontVariationSettings: "'wght' 800, 'wdth' 100, 'opsz' 60" }}>
            <span className="rakam">{golge.n}</span> öğede gölge
          </p>
          <p className="mt-2 text-[15px] text-soluk">
            Sayfadaki {golge.toplam} öğenin hiçbirinde <span lang="en">box-shadow</span>, <span lang="en">text-shadow</span> ya da <span lang="en">drop-shadow</span> yok.
          </p>
        </div>
      </div>
    </Bolum>
  )
}

/* ───────────────────────── Madde 8 · Yüzey: glitch ve piksel ───────────────────────── */

export function Yuzey() {
  const { hareket, glitch } = useVariable()
  const [tetik, setTetik] = useState(0)
  const [piksel, setPiksel] = useState(28)
  const [agirlik, setAgirlik] = useState(900)
  const [genislik, setGenislik] = useState<'condensed' | 'normal' | 'expanded'>('expanded')
  const kok = useRef<HTMLDivElement>(null)
  const anim = useRef<{ stop: () => void } | null>(null)
  const [, ekrandaRef] = useEkranda(kok)
  const git = (hedef: number) => {
    anim.current?.stop()
    if (!hareket) {
      setPiksel(hedef)
      return
    }
    anim.current = animate(piksel, hedef, { duration: 1.3, ease: [0.2, 0.9, 0.2, 1], onUpdate: (v) => setPiksel(v) })
  }
  // ekrana ilk girişte piksel piksel toplanır
  useEffect(() => {
    if (!hareket) {
      setPiksel(1)
      return
    }
    setPiksel(28)
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting) && ekrandaRef.current) {
          anim.current = animate(28, 2, { duration: 1.6, ease: [0.2, 0.9, 0.2, 1], onUpdate: (v) => setPiksel(v) })
          io.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    if (kok.current) io.observe(kok.current)
    return () => {
      io.disconnect()
      anim.current?.stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hareket])
  return (
    <Bolum
      id="yuzey"
      no="06"
      madde="Madde 8 · Doku ve yüzey"
      baslik="Bozuk ve piksel"
      vurgulu={[0]}
      lead="Yüzey temiz kalır: gölge, doku, görsel yok. Bozulma yalnız metnin içinde ve kısadır. Glitch birkaç yatay dilimi 260 milisaniyeden kısa süre kaydırır; piksel efekti ise metni büyütülmüş bir ızgaraya çevirir ve piksel piksel toplar."
    >
      <div className={`${KENAR} grid grid-cols-1 gap-x-8 gap-y-14 lg:grid-cols-12`}>
        <div className="lg:col-span-12" data-glitch-alan="">
          <div className="overflow-x-clip border-y-2 border-metin py-8">
            <GlitchMetin metin="BOZUK" tetik={tetik} boy="clamp(60px, 19vw, 290px)" uz={5} />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Buton ton="patlama" onClick={() => setTetik((t) => t + 1)} disabled={!hareket || glitch !== 'acik'} glif="×" data-boz="">
              Boz
            </Buton>
            <p className="text-[15px] text-soluk" data-glitch-durum-yazi="">
              {!hareket ? 'Hareket durdu: glitch çalışmaz.' : glitch !== 'acik' ? 'Glitch ayardan kapatıldı.' : 'Kendiliğinden 4–6 sn’de bir patlar; en çok 260 ms sürer.'}
            </p>
          </div>
        </div>
        <div ref={kok} className="lg:col-span-8" data-piksel-alan="">
          <div className="border-2 border-metin p-3" onPointerEnter={() => hareket && git(2)} onPointerLeave={() => hareket && git(14)}>
            <PikselMetin metin="PİKSEL" piksel={piksel} agirlik={agirlik} genislik={genislik} />
          </div>
        </div>
        <div className="grid content-start gap-6 lg:col-span-4">
          <Aralik
            id="piksel-boy"
            label="Piksel boyu"
            value={Math.round(piksel)}
            min={1}
            max={40}
            onChange={(v) => {
              anim.current?.stop()
              setPiksel(v)
            }}
            format={(v) => `${v} px`}
          />
          <Aralik id="piksel-agirlik" label="Kalınlık" value={agirlik} min={100} max={1000} step={50} onChange={setAgirlik} />
          <Secim<'condensed' | 'normal' | 'expanded'>
            legend="Genişlik"
            name="piksel-genislik"
            value={genislik}
            onChange={setGenislik}
            options={[
              { id: 'condensed', ad: 'Dar' },
              { id: 'normal', ad: 'Normal' },
              { id: 'expanded', ad: 'Geniş' },
            ]}
          />
          <div className="flex flex-wrap gap-2">
            <Buton onClick={() => git(40)} data-dagil="">
              Dağıl
            </Buton>
            <Buton ton="patlama" onClick={() => git(1)} data-topla="">
              Topla
            </Buton>
          </div>
        </div>
      </div>
    </Bolum>
  )
}

/* ───────────────────────── Madde 9 · Simgeler ───────────────────────── */

export function Simge() {
  const [sayi, setSayi] = useState(0)
  const [adet, setAdet] = useState(2)
  const [acik, setAcik] = useState(false)
  const say = () => setSayi(document.querySelectorAll('main svg:not([data-cizim]), main img, main picture, main canvas:not(.piksel-tuval)').length)
  useEffect(() => {
    const t = window.setTimeout(say, 600)
    return () => window.clearTimeout(t)
  }, [])
  const yonler = useMemo(
    () => [
      { g: '↑', don: 0, ad: 'Yukarı' },
      { g: '↓', don: 0, ad: 'Aşağı' },
      { g: '↓', don: -90, ad: 'Sağa (↓ −90°)' },
      { g: '↓', don: 90, ad: 'Sola (↓ +90°)' },
    ],
    [],
  )
  return (
    <Bolum
      id="ikon"
      no="07"
      madde="Madde 9 · İkonografi"
      baslik="Harfin kendi simgeleri"
      vurgulu={[1, 2]}
      lead="Çizilmiş ikon yok. Simge gerektiğinde yazı tipinin kendi karakter setine bakılır: yön için ↑ ve ↓, işlem için + − × ÷, işaret için • § ¶ # @ &. Simge bir glif olduğu için üzerine gelince kalınlığı ve genişliği eksenlerle değişir."
    >
      <div className={`${KENAR} grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-12`}>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:col-span-8 lg:grid-cols-4" data-glifler="">
          {GLIFLER.map((g) => (
            <li key={g.ad} className="group border-2 border-metin p-3" data-glif-kart={g.g}>
              <span className="glif block text-[64px] leading-[1.1] transition-none group-hover:[font-variation-settings:'wght'_1000,'wdth'_151,'slnt'_0,'opsz'_14]" aria-hidden="true">
                {g.g}
              </span>
              <span className="etiket mt-2 block">{g.ad}</span>
              <span className="block text-[13.5px] text-soluk">{g.kullanim}</span>
            </li>
          ))}
        </ul>
        <div className="grid content-start gap-8 lg:col-span-4">
          <div data-ikon-say={sayi}>
            <p className="kicker">Sayfadaki çizilmiş ikon, görsel ve tuval</p>
            <p className="text-[clamp(72px,12vw,160px)] leading-[0.9] text-patlama-yazi" style={{ fontFamily: 'var(--font-disp)', fontVariationSettings: "'wght' 900, 'wdth' 100, 'opsz' 144" }}>
              {sayi}
            </p>
            <div className="mt-2">
              <Buton onClick={say}>Yeniden say</Buton>
            </div>
            <p className="mt-3 text-[14px] text-soluk">
              Sayım <span lang="en">svg</span>, <span lang="en">img</span>, <span lang="en">picture</span> ve piksel metni dışındaki <span lang="en">canvas</span> öğelerini kapsar. Hareket bölümündeki yay grafiği bir veri çizimidir, simge değildir; sayılmaz.
            </p>
          </div>
        </div>
        <div className="lg:col-span-12">
          <p className="kicker">Yön: iki ok, dört yön</p>
          <ul className="mt-3 flex flex-wrap gap-4" data-yonler="">
            {yonler.map((y) => (
              <li key={y.ad} className="flex min-h-12 items-center gap-3 border-2 border-metin px-4" data-yon={y.ad}>
                <Glif g={y.g} don={y.don} className="text-[32px]" />
                <span className="etiket">{y.ad}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-12" data-glif-arac="">
          <p className="kicker">Simgeli araç çubuğu · yalnız yazı tipinin glifleri</p>
          <div className="mt-3 flex flex-wrap items-center gap-2" role="toolbar" aria-label="Adet ve menü">
            <Buton aria-label="Azalt" onClick={() => setAdet((a) => Math.max(0, a - 1))} data-eksi="">
              <Glif g="−" />
            </Buton>
            <output className="rakam min-w-10 text-center text-[24px]" data-adet={adet} aria-live="polite">
              {adet}
            </output>
            <Buton aria-label="Artır" onClick={() => setAdet((a) => Math.min(9, a + 1))} data-arti="">
              <Glif g="+" />
            </Buton>
            <Buton aria-label={acik ? 'Menüyü kapat' : 'Menüyü aç'} aria-pressed={acik} onClick={() => setAcik((a) => !a)} data-menu="">
              <Glif g={acik ? '×' : '§'} />
            </Buton>
            <Buton aria-label="Başa dön" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} data-yukari="">
              <Glif g="↑" />
            </Buton>
            {acik ? (
              <p className="rakam ml-2 text-[15px]" data-menu-liste="">
                § Stil · § Renk · § Yazı
              </p>
            ) : null}
          </div>
        </div>
        <div className="lg:col-span-12">
          <Kod
            label="Simge kalıbı CSS"
            dar
          >{`.glif { font-family: var(--font-disp); font-variation-settings: 'wght' 500, 'wdth' 100; transition: font-variation-settings 300ms cubic-bezier(.34, 1.56, .64, 1); }\n.kbtn:hover .glif { font-variation-settings: 'wght' 1000, 'wdth' 151; }   /* simge de bir harftir */`}</Kod>
        </div>
      </div>
    </Bolum>
  )
}
