import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Bolum } from '../components/Bolum'
import { Ikon } from '../components/Ikon'
import { Madalyon, KalkanSekil, Panel, type Yuzey as YuzeyTip } from '../components/Suslu'
import { Aralik, Kod, Secim, Alan } from '../components/ui'
import { kontrast as kontrastHesap, oran } from '../lib/contrast'
import { IKONLAR, NADIRLIK, palet, type IkonAd, type Nadirlik } from '../lib/data'
import { useFantasy, type Tema } from '../lib/store'
import { useSay } from '../components/hooks'

const TAS = '#1e1e24'

/* ───────────────────────── Madde 4 · Renk ───────────────────────── */

export function Renk() {
  const { tema, setTema, kontrast: kt } = useFantasy()
  const p = palet(tema, kt)
  const satirlar: [string, string, string, string, string, 'metin' | 'buyuk' | 'bilesen'][] = [
    ['Metin · parşömen beyazı', p.metin, TAS, 'Taş', 'Gövde metni', 'metin'],
    ['İkincil metin', p.soluk, TAS, 'Taş', 'Etiket, açıklama', 'metin'],
    ['Altın (yazı tonu)', p.altinYazi, TAS, 'Taş', 'Vurgu, sayı, bağlantı', 'metin'],
    ['Büyülü Altın #D4AF37', p.altin, TAS, 'Taş', 'Çerçeve ve büyük başlık', 'buyuk'],
    ['Kan (açık ton)', p.kanYazi, TAS, 'Taş', 'Hasar, uyarı yazısı', 'metin'],
    ['Mana (açık ton)', p.manaYazi, TAS, 'Taş', 'Mana, büyü yazısı', 'metin'],
    ['Mürekkep', p.murekkep, p.parsomen, 'Parşömen', 'Parşömen üstünde gövde', 'metin'],
    ['İkincil mürekkep', p.parsomenSoluk, p.parsomen, 'Parşömen', 'Parşömen üstünde etiket', 'metin'],
    ['Kan koyu (başlık)', p.baslikParsomen, p.parsomen, 'Parşömen', 'Parşömen üstünde başlık', 'metin'],
    ['Beyaz', '#ffffff', p.kan, 'Kan dolgusu', 'Tehlike düğmesi etiketi', 'metin'],
    ['Zindan grisi', TAS, p.altin, 'Altın dolgu', 'Birincil düğme etiketi', 'metin'],
    ['Mana Mavisi #1E90FF', p.mana, TAS, 'Taş', 'Çubuk kenarı (bileşen, en az 3:1)', 'bilesen'],
  ]
  const karar = (k: number, t: 'metin' | 'buyuk' | 'bilesen') => (t === 'bilesen' ? (k >= 3 ? 'Bileşen için yeterli' : 'Yetersiz') : t === 'buyuk' ? (k >= 4.5 ? 'AAA (büyük)' : k >= 3 ? 'AA (büyük)' : 'Yetersiz') : k >= 7 ? 'AAA' : k >= 4.5 ? 'AA' : 'Yetersiz')
  const gemler: { ad: string; hex: string; rol: string; ikon: IkonAd; yazi: string }[] = [
    { ad: 'Derin Zindan Grisi', hex: '#1E1E24', rol: 'Zemin ve taş', ikon: 'toprak', yazi: 'Parşömen beyazı metin' },
    { ad: 'Büyülü Altın', hex: '#D4AF37', rol: 'Çerçeve, başlık, vurgu', ikon: 'altin', yazi: p.altinYazi.toUpperCase() },
    { ad: 'Kan Kırmızısı', hex: '#8B0000', rol: 'Can çubuğu, tehlike', ikon: 'iksir-kan', yazi: p.kanYazi.toUpperCase() },
    { ad: 'Mana Mavisi', hex: '#1E90FF', rol: 'Mana çubuğu, büyü', ikon: 'iksir-mana', yazi: p.manaYazi.toUpperCase() },
  ]
  return (
    <Bolum id="renk" no="02" madde="Madde 4 · Renk paleti" baslik="Zindan, altın, kan, mana" lead="Dört renk oyunun bütün dünyasını çizer. Metin ise parlak palete değil, onların açık ve okunaklı türevlerine yaslanır: taş üstünde parşömen beyazı ve altın, parşömen üstünde koyu mürekkep.">
      <div className="grid gap-x-8 gap-y-12">
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" data-paletler="">
          {gemler.map((g) => (
            <li key={g.hex} data-renk={g.hex}>
              <Panel yuzey="tas" suslu={false} className="p-5">
                <span className="renk-gem" style={{ background: g.hex }} aria-hidden="true">
                  <Ikon ad={g.ikon} boy={44} />
                </span>
                <p className="t-h3 mt-4 !text-[1.125rem]">{g.ad}</p>
                <p className="rakam mt-1 text-[1.25rem]">{g.hex}</p>
                <p className="t-alt mt-1">{g.rol}</p>
                <p className="t-alt mt-2">
                  Yazıda: <span className="rakam">{g.yazi}</span>
                </p>
              </Panel>
            </li>
          ))}
        </ul>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="grid content-start gap-5 lg:col-span-3">
            <Secim<Tema>
              legend="Sayfa zemini"
              name="renk-tema"
              value={tema}
              onChange={setTema}
              options={[
                { id: 'zindan', ad: 'Zindan' },
                { id: 'parsomen', ad: 'Parşömen' },
              ]}
            />
            <p className="t-alt" data-palet-not="">
              {tema === 'zindan' ? 'Taş zemin: metin parşömen beyazı, başlık altın.' : 'Parşömen zemin: metin koyu mürekkep, başlık koyu kan rengi.'}
            </p>
          </div>
          <div className="overflow-x-auto lg:col-span-9" role="region" aria-label="Renk çiftleri kontrastı" tabIndex={0}>
            <table className="tablo w-full min-w-[720px]" data-renk-tablo="">
              <caption className="t-etiket t-soluk">Renk çiftleri ve okunabilirlik</caption>
              <thead>
                <tr>
                  {['Renk', 'Zemin', 'Oran', 'Karar', 'Kullanım'].map((b) => (
                    <th key={b} scope="col">
                      {b}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {satirlar.map(([ad, fg, bg, bgAd, kul, tur]) => {
                  const k = kontrastHesap(fg, bg)
                  return (
                    <tr key={ad + bgAd} data-oran={k.toFixed(2)} data-tur={tur}>
                      <th scope="row">
                        <span className="mr-3 inline-block size-4 border border-current align-[-2px]" style={{ background: fg }} aria-hidden="true" />
                        {ad}
                      </th>
                      <td>{bgAd}</td>
                      <td className="rakam">{oran(k)}</td>
                      <td>{karar(k, tur)}</td>
                      <td className="t-alt">{kul}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Bolum>
  )
}

/* ───────────────────────── Madde 5 · Yazı ───────────────────────── */

type Efekt = 'duz' | 'kabartma' | 'parlayan'
export function Yazi() {
  const [metin, setMetin] = useState('Kılıç ve Kül')
  const [boy, setBoy] = useState(64)
  const [iz, setIz] = useState(0.04)
  const [efekt, setEfekt] = useState<Efekt>('kabartma')
  const orn = useRef<HTMLParagraphElement>(null)
  const [olc, setOlc] = useState({ fs: '', ls: '', ff: '' })
  useLayoutEffect(() => {
    const el = orn.current
    if (!el) return
    const s = getComputedStyle(el)
    setOlc({ fs: s.fontSize, ls: s.letterSpacing, ff: s.fontFamily.split(',')[0].replace(/["']/g, '').trim() })
  }, [metin, boy, iz, efekt])
  return (
    <Bolum id="yazi" no="03" madde="Madde 5 · Tipografi" baslik="Yontulmuş harf" lead="Başlıkta Cinzel: Trajan sütunundaki yazıtlardan ilham alan, taşa oyulmuş gibi duran bir serif. Gövdede Crimson Pro: kitap sayfası gibi okunaklı, uzun metinlerde yormayan bir Garamond akrabası.">
      <div className="grid grid-cols-1 gap-x-10 gap-y-12 lg:grid-cols-12">
        <Panel yuzey="tas" className="p-7 lg:col-span-6" as="article" data-ornek-cinzel="">
          <p className="t-etiket t-soluk">Cinzel · başlık</p>
          <p className="baslik-altin mt-3 !text-[clamp(3rem,7vw,5rem)]" aria-hidden="true">
            Aa
          </p>
          <p className="t-h3 mt-2">Kül Krallığı’nın Sekiz Kapısı</p>
          <p className="mt-4 break-all font-[family-name:var(--font-baslik)] text-[1.125rem] leading-snug tracking-wider" aria-hidden="true">
            ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ
            <br />
            abcçdefgğhıijklmnoöprsştuüvyz 0123456789
          </p>
        </Panel>
        <Panel yuzey="parsomen" className="p-7 lg:col-span-6" as="article" data-ornek-crimson="">
          <p className="t-etiket t-soluk">Crimson Pro · gövde</p>
          <p className="ilk-harf mt-3 max-w-[58ch]">Vadi, yıllardır ilk kez sessizdi. Aldric kılıcını kınına soktu ve dağların ardındaki kızıl ışığa baktı; ejderhalar uyanıyordu. Eski krallığın bütün çanları aynı anda çaldı. Kimse neden çaldıklarını bilmiyordu, ama herkes ayağa kalktı.</p>
          <p className="mt-4 italic">“Güven, bir kılıçtan daha ağır taşınır.” — Bekçi kadın</p>
          <p className="t-alt mt-4">Türkçenin bütün harfleri ve ₺ işareti var. Gövde metni 19 px, satır yüksekliği 1,65.</p>
        </Panel>

        <div className="grid content-start gap-5 lg:col-span-4" data-yazi-kontrol="">
          <Alan label="Başlık metni">{(p) => <input className="alan" {...p} value={metin} onChange={(e) => setMetin(e.target.value)} maxLength={24} data-yazi-girdi="" />}</Alan>
          <Aralik id="yazi-boy" label="Boyut" value={boy} min={32} max={112} onChange={setBoy} format={(v) => `${v} px`} />
          <Aralik id="yazi-iz" label="Harf aralığı" value={iz} min={0} max={0.16} step={0.01} onChange={setIz} format={(v) => `${v.toFixed(2).replace('.', ',')} em`} />
          <Secim<Efekt>
            legend="Efekt"
            name="yazi-efekt"
            value={efekt}
            onChange={setEfekt}
            options={[
              { id: 'duz', ad: 'Düz altın' },
              { id: 'kabartma', ad: 'Kabartma' },
              { id: 'parlayan', ad: 'Parlayan' },
            ]}
          />
        </div>
        <div className="lg:col-span-8">
          <Panel yuzey="tas" className="overflow-x-clip p-7" as="div">
            <p ref={orn} className="baslik-altin bas-ornek m-0 !leading-[1.05]" data-efekt={efekt} style={{ fontSize: boy, letterSpacing: `${iz}em`, overflowWrap: 'anywhere' } as CSSProperties} data-yazi-ornek="">
              {metin || 'Kadim Diyar'}
            </p>
          </Panel>
          <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4" data-yazi-olcum={`${olc.fs}|${olc.ls}|${olc.ff}`}>
            <div>
              <dt className="t-etiket t-soluk">Yazı tipi</dt>
              <dd className="m-0 mt-1 text-[1.125rem]">{olc.ff}</dd>
            </div>
            <div>
              <dt className="t-etiket t-soluk">Boyut</dt>
              <dd className="rakam m-0 mt-1 text-[1.125rem]">{olc.fs}</dd>
            </div>
            <div>
              <dt className="t-etiket t-soluk">Harf aralığı</dt>
              <dd className="rakam m-0 mt-1 text-[1.125rem]">{olc.ls}</dd>
            </div>
            <div>
              <dt className="t-etiket t-soluk">Efekt</dt>
              <dd className="m-0 mt-1 text-[1.125rem]">{efekt === 'duz' ? 'düz' : efekt === 'kabartma' ? 'kabartma' : 'parlayan'}</dd>
            </div>
          </dl>
        </div>
      </div>
    </Bolum>
  )
}

/* ───────────────────────── Madde 6 · Şekil ───────────────────────── */

export function Sekil() {
  const [kose, setKose] = useState(48)
  const say = useSay('.suslu-kose', [kose])
  const blok = useRef<HTMLDivElement>(null)
  const [r, setR] = useState('')
  useEffect(() => {
    if (blok.current) setR(getComputedStyle(blok.current).borderTopLeftRadius)
  }, [])
  return (
    <Bolum id="sekil" no="04" madde="Madde 6 · Şekil dili" baslik="Filigree, kalkan, madalyon" lead="Simetrik köşe süsleri, kalkan formu, dairesel madalyon ve köşeleri hafif yumuşatılmış taş bloklar. Her köşe süsü tek bir çizimin yatay ve dikey aynasıdır.">
      <div className="grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-12" style={{ ['--kose' as string]: `${kose}px` }}>
        <Panel yuzey="tas" className="p-8 lg:col-span-4" data-sekil-cerceve="" as="article">
          <p className="t-etiket t-soluk">Süslü çerçeve</p>
          <p className="t-h3 mt-2">Filigree köşe</p>
          <p className="mt-3 text-[1.0625rem]">Dört köşede aynı çizim, yatay ve dikey ayna. Çerçevenin kendisi altın gradyan kenar ve iç ince çizgidir.</p>
        </Panel>
        <div className="grid place-items-center lg:col-span-3" data-sekil-kalkan="">
          <KalkanSekil className="w-full max-w-[220px]">
            <div>
              <Ikon ad="kalkan" boy={64} />
              <p className="t-etiket mt-3 yazi-altin">Kalkan</p>
            </div>
          </KalkanSekil>
        </div>
        <div className="grid place-items-center gap-3 lg:col-span-2" data-sekil-madalyon="">
          <Madalyon ikon="altin" boy={120} />
          <p className="t-etiket t-soluk">Madalyon</p>
        </div>
        <div className="grid place-items-center gap-3 lg:col-span-3" data-sekil-blok="">
          <div ref={blok} className="tas-blok">
            <Ikon ad="toprak" boy={56} />
          </div>
          <p className="t-etiket t-soluk">
            Taş blok · köşe <span className="rakam">{r || '—'}</span>
          </p>
        </div>
        <div className="grid content-start gap-4 lg:col-span-4">
          <Aralik id="kose-boy" label="Köşe süsü boyu" value={kose} min={32} max={72} step={2} onChange={setKose} format={(v) => `${v} px`} />
          <p className="t-alt" data-kose-say={say}>
            Sayfadaki filigree köşesi: <span className="rakam">{say}</span> (panel sayısı × 4). Boyut bütün panellerde birlikte değişir.
          </p>
        </div>
        <div className="lg:col-span-8">
          <div className="kose-buyuk" aria-hidden="true">
            <svg viewBox="0 0 48 48" width="200" height="200" focusable="false">
              <path d="M2 47 V12 Q2 2 12 2 H47" fill="none" stroke="url(#g-altin)" strokeWidth="3" strokeLinecap="round" />
              <path d="M8 47 V15 Q8 8 15 8 H47" fill="none" stroke="#8f7220" strokeWidth="1.4" />
              <path d="M14 14 C25 14 28 25 20 26.5 C13.5 27.5 12 20 17 19" fill="none" stroke="url(#g-altin)" strokeWidth="2" strokeLinecap="round" />
              <path d="M2 2 H13 L2 13 Z" fill="url(#g-altin)" stroke="#17110a" strokeWidth="1" strokeLinejoin="round" />
              <circle cx="7.5" cy="7.5" r="3.2" fill="url(#g-kan)" stroke="#17110a" strokeWidth="1" />
              <path d="M32 2 L36 6 L32 10 L28 6 Z M2 32 L6 36 L2 40 L-2 36 Z" fill="url(#g-altin)" stroke="#17110a" strokeWidth="0.8" strokeLinejoin="round" />
            </svg>
            <p className="t-alt max-w-[46ch]">Tek köşe, 200 piksele büyütülmüş. Dış ve iç ayraç, kıvrım, üçgen mücevher, kırmızı taş ve iki elmas: hepsi vektör.</p>
          </div>
        </div>
      </div>
    </Bolum>
  )
}

/* ───────────────────────── Madde 7 · Derinlik ───────────────────────── */

type Glow = 'altin' | 'mana' | 'kan'
const GLOW_RENK: Record<Glow, string> = { altin: '212, 175, 55', mana: '30, 144, 255', kan: '255, 90, 90' }
export function Derinlik() {
  const [yog, setYog] = useState(0.8)
  const [yaricap, setYaricap] = useState(10)
  const [glow, setGlow] = useState<Glow>('altin')
  const [gy, setGy] = useState(12)
  const ic = `inset 0 0 ${yaricap}px rgba(0, 0, 0, ${yog})`
  const dis = `0 0 ${gy}px 2px rgba(${GLOW_RENK[glow]}, 0.55)`
  const [say, setSay] = useState({ ic: 0, dis: 0 })
  useEffect(() => {
    const t = window.setTimeout(() => {
      let a = 0
      let b = 0
      document.querySelectorAll<HTMLElement>('main *').forEach((e) => {
        const s = getComputedStyle(e).boxShadow
        if (s === 'none') return
        if (/inset/.test(s)) a++
        if (/(^|\), )rgba?\([^)]*\) [\d.]+px [\d.]+px [\d.]+px( [\d.]+px)?(?! inset)/.test(s.replace(/inset/g, '')) && s.split('), ').some((x) => !/inset/.test(x))) b++
      })
      setSay({ ic: a, dis: b })
    }, 500)
    return () => window.clearTimeout(t)
  }, [yog, yaricap, glow, gy])
  return (
    <Bolum id="derinlik" no="05" madde="Madde 7 · Z ekseni ve gölge" baslik="Gömülü pencere, parlayan rün" lead="İki gölge dili var: içe doğru yoğun iç gölge, pencereleri taşın içine gömer; dışa doğru parlayan büyü, altını ve büyülü nesneleri zeminden koparır. Yoğunluğu ve rengi elle değiştirin.">
      <div className="grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-12">
        <div className="grid content-start gap-5 lg:col-span-4" data-golge-kontrol="">
          <Aralik id="golge-yog" label="İç gölge yoğunluğu" value={yog} min={0} max={1} step={0.05} onChange={setYog} format={(v) => v.toFixed(2).replace('.', ',')} />
          <Aralik id="golge-yaricap" label="İç gölge yarıçapı" value={yaricap} min={0} max={40} onChange={setYaricap} format={(v) => `${v} px`} />
          <Secim<Glow>
            legend="Parlama rengi"
            name="golge-glow"
            value={glow}
            onChange={setGlow}
            options={[
              { id: 'altin', ad: 'Altın' },
              { id: 'mana', ad: 'Mana' },
              { id: 'kan', ad: 'Kan' },
            ]}
          />
          <Aralik id="golge-gy" label="Parlama yarıçapı" value={gy} min={0} max={40} onChange={setGy} format={(v) => `${v} px`} />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-8">
          <div className="gomulu" style={{ boxShadow: ic }} data-gomulu={ic}>
            <p className="t-etiket t-soluk">Gömülü pencere</p>
            <p className="t-h3 mt-2">Taşın içine oyulmuş</p>
            <p className="mt-2 text-[1.0625rem]">İç gölge yoğunlaştıkça pencere derinleşir.</p>
          </div>
          <div className="parlayan-run" style={{ boxShadow: dis }} data-parlama={dis}>
            <Ikon ad={glow === 'altin' ? 'mucevher' : glow === 'mana' ? 'iksir-mana' : 'iksir-kan'} boy={64} />
            <p className="t-etiket mt-3 t-soluk">Parlayan rün</p>
          </div>
          <div className="sm:col-span-2">
            <Kod label="Üretilen gölge sınıfları" dar>{`shadow-[${ic.replace(/ /g, '_')}]\nshadow-[${dis.replace(/ /g, '_')}]`}</Kod>
          </div>
        </div>
        <div className="lg:col-span-12">
          <p className="t-etiket t-soluk">Z ekseni · üç pencere üst üste</p>
          <div className="z-yigin mt-4" data-z-yigin="">
            {[0, 1, 2].map((i) => (
              <div key={i} className="z-pencere" style={{ ['--z' as string]: i }}>
                <p className="t-etiket t-soluk">Z {i}</p>
                <p className="t-h3 !text-[1.125rem] mt-1">{['Arka pencere', 'Orta pencere', 'Ön pencere'][i]}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-12" data-golge-say={`${say.ic}|${say.dis}`}>
          <p className="t-etiket t-soluk">Canlı sayım</p>
          <p className="mt-2 text-[1.25rem]">
            <span className="rakam text-[2rem]">{say.ic}</span> öğede iç gölge, <span className="rakam text-[2rem]">{say.dis}</span> öğede dış parlama.
          </p>
        </div>
      </div>
    </Bolum>
  )
}

/* ───────────────────────── Madde 8 · Yüzey ───────────────────────── */

const DOKULAR: { id: YuzeyTip; ad: string; not: string; tile: string }[] = [
  { id: 'tas', ad: 'Yontulmuş taş', not: 'Sıra sıra bloklar, harç çizgileri, ince tane', tile: '192 × 128' },
  { id: 'parsomen', ad: 'Eskitilmiş parşömen', not: 'Fraktal leke, kenar kararması, kâğıt lifi', tile: '256 × 256' },
  { id: 'deri', ad: 'Deri', not: 'Çukurlu tane, dikiş çizgisi', tile: '128 × 128' },
  { id: 'ahsap', ad: 'Ahşap', not: 'Yatay damar, tahta araları', tile: '256 × 128' },
  { id: 'metal', ad: 'Fırçalanmış metal', not: 'Yatay ışık çizgileri, çelik degrade', tile: '256 × 128' },
]
export function Yuzey() {
  const [yog, setYog] = useState(1)
  const sayilar = useSay('.panel[data-yuzey]', [yog])
  return (
    <Bolum
      id="yuzey"
      no="06"
      madde="Madde 8 · Doku ve yüzey"
      baslik="Taş, parşömen, deri, metal"
      lead="Yüzeyler görsel dosyası değil, küçük SVG gürültü karolarıdır: fractalNoise ile üretilir, sayfaya gömülü gelir. Yoğunluk kaydırıcısı hepsini birden açar ve kapatır; yüksek kontrast varyantında doku hiç çizilmez."
    >
      <div className="grid gap-x-8 gap-y-10">
        <div className="max-w-md">
          <Aralik id="doku-yog" label="Doku yoğunluğu" value={yog} min={0} max={1} step={0.1} onChange={setYog} format={(v) => `%${Math.round(v * 100)}`} />
        </div>
        <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3" style={{ ['--doku-yogunluk' as string]: yog }} data-dokular="">
          {DOKULAR.map((d) => (
            <li key={d.id}>
              <Panel yuzey={d.id} className="doku-ornek p-6" as="article" data-doku-kart={d.id}>
                <p className="t-etiket t-soluk">Doku · {d.tile}</p>
                <h3 className="t-h3 mt-2 !text-[1.25rem]">{d.ad}</h3>
                <p className="mt-2 text-[1.0625rem]">{d.not}</p>
              </Panel>
            </li>
          ))}
          <li className="grid content-center gap-2 p-4" data-doku-say={sayilar}>
            <p className="t-etiket t-soluk">Canlı sayım</p>
            <p className="rakam text-[2.5rem] leading-none">{sayilar}</p>
            <p className="t-alt">dokulu panel · görsel dosyası 0</p>
          </li>
        </ul>
      </div>
    </Bolum>
  )
}

/* ───────────────────────── Madde 9 · Simgeler ───────────────────────── */

type Grup = 'hepsi' | 'silah' | 'zirh' | 'iksir' | 'esya' | 'element'
export function Simge() {
  const [grup, setGrup] = useState<Grup>('hepsi')
  const [boy, setBoy] = useState(64)
  const [nad, setNad] = useState<Nadirlik | 'yok'>('yok')
  const [say, setSay] = useState({ n: 0, tur: 0 })
  useEffect(() => {
    const t = window.setTimeout(() => {
      const hepsi = Array.from(document.querySelectorAll<SVGElement>('main svg.oyun-ikon'))
      setSay({ n: hepsi.length, tur: new Set(hepsi.map((s) => s.dataset.ikon)).size })
    }, 500)
    return () => window.clearTimeout(t)
  }, [grup, boy])
  const liste = useMemo(() => IKONLAR.filter((i) => grup === 'hepsi' || i.grup === grup), [grup])
  return (
    <Bolum id="ikon" no="07" madde="Madde 9 · İkonografi" baslik="Cephanelik" lead="Kılıç, kalkan, iksir, parşömen, sandık ve dört elementin simgeleri: hepsi çok katmanlı vektör çizim. Metalin, altının, ahşabın ve sıvının kendi degradesi var; hiçbiri rastersiz bir görsel değil.">
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-12">
        <div className="grid content-start gap-5 lg:col-span-3" data-simge-kontrol="">
          <Secim<Grup>
            legend="Grup"
            name="simge-grup"
            value={grup}
            onChange={setGrup}
            options={[
              { id: 'hepsi', ad: 'Hepsi' },
              { id: 'silah', ad: 'Silah' },
              { id: 'zirh', ad: 'Zırh' },
              { id: 'iksir', ad: 'İksir' },
              { id: 'esya', ad: 'Eşya' },
              { id: 'element', ad: 'Element' },
            ]}
          />
          <Aralik id="simge-boy" label="Boyut" value={boy} min={32} max={96} step={4} onChange={setBoy} format={(v) => `${v} px`} />
          <Secim<Nadirlik | 'yok'> legend="Nadirlik çerçevesi" name="simge-nadirlik" value={nad} onChange={setNad} options={[{ id: 'yok', ad: 'Yok' }, ...(Object.keys(NADIRLIK) as Nadirlik[]).map((k) => ({ id: k, ad: NADIRLIK[k].ad }))]} />
          <div data-ikon-say={say.n} data-ikon-tur={say.tur}>
            <p className="t-etiket t-soluk">Sayfadaki simge</p>
            <p className="rakam mt-1 text-[2.5rem] leading-none">{say.n}</p>
            <p className="t-alt mt-1">{say.tur} farklı çizim, hepsi SVG.</p>
          </div>
        </div>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:col-span-9 lg:grid-cols-4" data-glifler="">
          {liste.map((i) => (
            <li key={i.ad} data-glif-kart={i.ad}>
              <div className="ikon-kart" data-nadirlik={nad === 'yok' ? undefined : nad}>
                <Ikon ad={i.ad} boy={boy} />
                <p className="mt-3 leading-tight font-semibold">{i.anlam}</p>
                <p className="t-alt capitalize">{i.grup}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Bolum>
  )
}
