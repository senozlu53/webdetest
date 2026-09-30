import { useEffect, useId, useRef, useState } from 'react'
import { BloodProgressBar } from '../components/BloodProgressBar'
import { Bolum } from '../components/Bolum'
import { ChainBorder } from '../components/ChainBorder'
import { Dugme } from '../components/Dugme'
import { GothicCard, type YuzeyAd } from '../components/GothicCard'
import { GothicModal } from '../components/GothicModal'
import { useOlc } from '../components/hooks'
import { Muhur } from '../components/Muhur'
import { Anahtar, Aralik, Isaret, Kod, Secim } from '../components/ui'
import { useGothic } from '../lib/store'

/* ───────── Madde 11 · 14: bileşenler ───────── */

export function Bilesenler() {
  const { duyur } = useGothic()
  const [zb, setZb] = useState(84)
  const [sallan, setSallan] = useState(true)
  const [deger, setDeger] = useState(62)
  const [belirsiz, setBelirsiz] = useState(false)
  const [damla, setDamla] = useState(true)
  const [yukleniyor, setYukleniyor] = useState(false)
  const [yuzey, setYuzey] = useState<YuzeyAd>('tas')
  const [modal, setModal] = useState(false)
  const modalDugme = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!yukleniyor) return
    const t = window.setInterval(() => {
      setDeger((v) => {
        const n = Math.min(100, v + 3 + Math.round(Math.random() * 5))
        if (n >= 100) {
          window.clearInterval(t)
          setYukleniyor(false)
          duyur('Yükleme tamamlandı')
        }
        return n
      })
    }, 130)
    return () => window.clearInterval(t)
  }, [yukleniyor, duyur])
  return (
    <Bolum id="bilesenler" no="09" madde="Madde 11 · 14 · Bileşen kalıpları ve React" baslik="Zincir, kan, kemer" lead="Paslı zincirlerle asılmış gibi duran kartlar, kan damlası animasyonlu yükleme çubukları ve gotik çerçeveli modal pencereler: üç bileşen, üçü de sayfada gerçek çalışır.">
      <div className="grid grid-cols-1 gap-x-12 gap-y-24">
        {/* zincirle asılı kartlar */}
        <div className="grid grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-12" data-bilesen="zincirli-kart">
          <div className="grid content-start gap-7 lg:col-span-4">
            <div>
              <h3 className="t-h3">&lt;GothicCard&gt; · asılı</h3>
              <p className="t-alt mt-2">Kart iki zincirle tavana asılır; sarkaç gibi hafifçe salınır. Zincir boyu ayarlanabilir.</p>
            </div>
            <Aralik label="Zincir boyu" value={zb} min={40} max={140} step={4} onChange={setZb} format={(v) => `${v} px`} />
            <Anahtar label="Sarkaç salınımı" hint="Sekiz saniyelik yavaş sallanma." checked={sallan} onChange={setSallan} />
          </div>
          <div className="grid grid-cols-1 gap-x-12 gap-y-14 md:grid-cols-2 lg:col-span-8">
            {[
              { ad: 'Kayıt 01', alt: 'Avlu', y: 'tas' as const, sag: 91 },
              { ad: 'Kayıt 02', alt: 'Mahzen', y: 'demir' as const, sag: 62 },
            ].map((k) => (
              <GothicCard key={k.ad} zincir="asili" sallan={sallan} yuzey={k.y} as="article" aria-label={k.ad} style={{ ['--zb' as string]: `${zb}px` }} data-asili-kart="">
                <p className="t-etiket t-soluk">{k.ad}</p>
                <h4 className="t-h3 mt-1">{k.alt}</h4>
                <div className="mt-5">
                  <BloodProgressBar etiket="Sağlık" deger={k.sag} />
                </div>
              </GothicCard>
            ))}
          </div>
        </div>

        {/* kan damlalı yükleme barı */}
        <div className="grid grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-12" data-bilesen="kan-bari">
          <div className="grid content-start gap-7 lg:col-span-4">
            <div>
              <h3 className="t-h3">&lt;BloodProgressBar&gt;</h3>
              <p className="t-alt mt-2">Demir kanalda akan kan; alt kenardan damlalar sızar. Damlalar süstür, değer metinle de okunur.</p>
            </div>
            <Aralik
              label="Değer"
              value={deger}
              min={0}
              max={100}
              onChange={(v) => {
                setYukleniyor(false)
                setDeger(v)
              }}
              format={(v) => `%${v}`}
            />
            <Anahtar label="Belirsiz kip" hint="Süre bilinmiyorsa kan kanal boyunca gezinir." checked={belirsiz} onChange={setBelirsiz} />
            <Anahtar label="Damla animasyonu" checked={damla} onChange={setDamla} />
            <div>
              <Dugme
                dar
                disabled={yukleniyor}
                onClick={() => {
                  setBelirsiz(false)
                  setDeger(0)
                  setYukleniyor(true)
                }}
                data-yukle=""
              >
                {yukleniyor ? 'Yükleniyor…' : 'Yükle'}
              </Dugme>
            </div>
          </div>
          <div className="grid content-start gap-10 lg:col-span-8">
            <GothicCard kemer="duz" yuzey="demir" as="section" aria-label="Yükleme çubuğu oyun alanı" data-kan-oyun="">
              <BloodProgressBar etiket={yukleniyor ? 'Kayıt yükleniyor' : 'Kayıt'} deger={deger} belirsiz={belirsiz} damla={damla} />
            </GothicCard>
            <div className="grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-3">
              <BloodProgressBar etiket="Akıl" deger={25} />
              <BloodProgressBar etiket="Dayanıklılık" deger={70} />
              <BloodProgressBar etiket="Yükleniyor" belirsiz />
            </div>
          </div>
        </div>

        {/* gotik modal */}
        <div className="grid grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-12" data-bilesen="modal">
          <div className="grid content-start gap-7 lg:col-span-4">
            <div>
              <h3 className="t-h3">&lt;GothicModal&gt;</h3>
              <p className="t-alt mt-2">Kemerli pencere ekranın üstünden zincirlerle iner. Odak pencerede kilitlenir; Esc ya da Kapat düğmesi kapatır.</p>
            </div>
            <Secim<YuzeyAd>
              legend="Yüzey"
              name="modal-yuzey"
              value={yuzey}
              onChange={setYuzey}
              options={[
                { id: 'tas', ad: 'Taş' },
                { id: 'demir', ad: 'Demir' },
                { id: 'deri', ad: 'Deri' },
                { id: 'kadife', ad: 'Kadife' },
              ]}
            />
            <div>
              <Dugme ref={modalDugme} onClick={() => setModal(true)} data-modal-ac="">
                Kapıyı aç
              </Dugme>
            </div>
          </div>
          <div className="lg:col-span-8">
            <ChainBorder mod="cerceve" kemer={false}>
              <div className="flex flex-wrap items-center gap-6 border border-[#a0a0a0]/40 bg-[#0d0d10] p-6">
                <Muhur ikon="kilit" boy={84} baslik="Kilit mührü" />
                <div className="min-w-0 flex-1">
                  <p className="t-h3">Kilit açıldı</p>
                  <p className="t-alt mt-1">Önizleme: pencere bu içerikle açılır. Düğmeler, mühür ve metin aynı bileşen ailesinden gelir.</p>
                </div>
              </div>
            </ChainBorder>
          </div>
        </div>
        <GothicModal acik={modal} onAcikDegisti={setModal} baslik="Kilit açıldı" aciklama="Bu kapı yüz yıldır açılmadı; içeride bir şey nefes alıyor." yuzey={yuzey} donusRef={modalDugme}>
          <div className="flex items-center gap-6">
            <Muhur ikon="kilit" boy={92} baslik="Kilit mührü" />
            <p className="t-alt">Zincirler gevşedi. Devam edersen mühür kırılır ve geri dönüş yoktur.</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-4">
            <Dugme onClick={() => setModal(false)}>Devam et</Dugme>
            <Dugme ton="hayalet" onClick={() => setModal(false)}>
              Vazgeç
            </Dugme>
          </div>
        </GothicModal>

        {/* React API */}
        <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-12" data-bilesen="api">
          <div className="min-w-0 lg:col-span-7">
            <h3 className="t-h3">React arayüzü</h3>
            <div className="mt-4 overflow-x-auto" tabIndex={0} role="region" aria-label="Bileşen özellikleri">
              <table className="tablo w-full min-w-[620px]">
                <thead>
                  <tr>
                    <th scope="col">Bileşen</th>
                    <th scope="col">Özellik</th>
                    <th scope="col">Değerler</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['GothicCard', 'kemer', "'sivri' | 'duz'"],
                    ['', 'yuzey', "'demir' | 'tas' | 'deri' | 'kadife'"],
                    ['', 'zincir', "'yok' | 'cerceve' | 'asili'"],
                    ['', 'sizinti · sallan · yirtik', 'boolean'],
                    ['BloodProgressBar', 'etiket · deger', 'string · 0–100'],
                    ['', 'belirsiz · damla', 'boolean'],
                    ['ChainBorder', 'mod', "'cerceve' | 'asili'"],
                    ['GothicModal', 'acik · baslik · sure', 'boolean · string · ms'],
                  ].map(([a, b, c], i) => (
                    <tr key={i}>
                      <th scope="row" className="rakam">
                        {a}
                      </th>
                      <td className="rakam">{b}</td>
                      <td className="t-alt">{c}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="min-w-0 lg:col-span-5">
            <h3 className="t-h3">Kullanım</h3>
            <Kod label="React kullanım örneği" className="mt-4" dar>
              {`<GothicCard zincir="asili" sallan yuzey="tas">
  <h3>Kayıt 02</h3>
  <BloodProgressBar etiket="Sağlık" deger={62} />
</GothicCard>

<GothicModal baslik="Kilit açıldı" sure={900}>
  <Muhur ikon="kilit" />
</GothicModal>`}
            </Kod>
          </div>
        </div>
      </div>
    </Bolum>
  )
}

/* ───────── Madde 12 · 13: Figma ───────── */

const KATMAN_AGACI: {
  ad: string
  tur: string
  alt?: { ad: string; tur: string }[]
}[] = [
  { ad: 'Işık sızıntısı', tur: 'Effect · blur 22 · kan %60' },
  { ad: 'Zincir', tur: 'İç bileşen · ChainBorder' },
  {
    ad: 'Çerçeve',
    tur: 'Frame · kemer yoluyla kırpılmış',
    alt: [
      { ad: 'Yüzey', tur: 'Fill · Texture/RustMetal' },
      { ad: 'Pas maskesi', tur: 'SVG mask · alfa' },
      { ad: 'Demir ayrıntı', tur: 'Vector · perçin, çizgi' },
      { ad: 'İç gölge', tur: 'Effect · Effects/GothicShadow' },
      { ad: 'İçerik', tur: 'Auto layout · slot' },
    ],
  },
]

function PasMaskesi() {
  const id = useId().replace(/:/g, '')
  const [maske, setMaske] = useState(true)
  const [esik, setEsik] = useState(52)
  const [gor, setGor] = useState(false)
  const [percin, setPercin] = useState(true)
  const k = 7
  const m = `0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 ${k} 0 0 0 ${(-k * esik) / 100}`
  const kose = [
    [22, 22],
    [298, 22],
    [22, 178],
    [298, 178],
  ]
  return (
    <div data-figma-maske="">
      <svg viewBox="0 0 320 200" className="w-full" role="img" aria-label={gor ? 'Pas maskesinin kendisi: beyaz alanlar pasın göründüğü yerlerdir' : `Demir levha${maske ? ', pas maskesiyle lekeli' : ', maskesiz düz'}`} data-maske-gorunum={gor ? 'maske' : maske ? 'pas' : 'duz'}>
        <defs>
          <filter id={`n${id}`} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.014 0.022" numOctaves="4" seed="7" />
            <feColorMatrix values={m} />
          </filter>
          <mask id={`m${id}`}>
            <rect width="320" height="200" fill="#fff" filter={`url(#n${id})`} />
          </mask>
          <linearGradient id={`d${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3a3a40" />
            <stop offset="0.5" stopColor="#222226" />
            <stop offset="1" stopColor="#141417" />
          </linearGradient>
        </defs>
        {gor ? (
          <>
            <rect width="320" height="200" fill="#000" />
            <rect width="320" height="200" fill="#fff" filter={`url(#n${id})`} />
          </>
        ) : (
          <>
            <rect width="320" height="200" fill={`url(#d${id})`} data-kat="demir" />
            {maske ? <rect width="320" height="200" fill="#8b4513" opacity="0.8" mask={`url(#m${id})`} data-kat="pas" /> : null}
            <rect x="6" y="6" width="308" height="188" fill="none" stroke="#a0a0a0" strokeOpacity="0.55" strokeWidth="1.500" data-kat="cerceve" />
            {percin
              ? kose.map(([x, y]) => (
                  <g key={`${x}${y}`} data-kat="percin">
                    <circle cx={x} cy={y} r="6.500" fill="#1c1c20" />
                    <circle cx={x} cy={y} r="5" fill="#77777d" />
                    <circle cx={x - 1.5} cy={y - 1.5} r="2" fill="#d4d4d8" />
                  </g>
                ))
              : null}
          </>
        )}
      </svg>
      <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2">
        <Anahtar label="Pas maskesi" hint="Pas katmanı yalnız maskenin beyaz yerinde görünür." checked={maske} onChange={setMaske} />
        <Anahtar label="Maskeyi göster" hint="Maske tek başına: beyaz görünür, siyah gizler." checked={gor} onChange={setGor} />
        <Anahtar label="Perçin katmanı" checked={percin} onChange={setPercin} />
        <Aralik label="Maske eşiği" value={esik} min={36} max={66} onChange={setEsik} format={(v) => `%${v}`} />
      </div>
    </div>
  )
}

const TOKENLER: {
  ad: string
  tip: 'color' | 'texture' | 'effect' | 'shape'
  deger: string
  degisken?: string
  hex?: string
  not: string
}[] = [
  {
    ad: 'Color/NightBlack',
    tip: 'color',
    deger: '#0A0A0C',
    degisken: '--gece',
    hex: '#0a0a0c',
    not: 'Zemin',
  },
  {
    ad: 'Color/BloodRed',
    tip: 'color',
    deger: '#5C0606',
    degisken: '--kan',
    hex: '#5c0606',
    not: 'Kenarlık, mühür, dolgu',
  },
  {
    ad: 'Color/Rust',
    tip: 'color',
    deger: '#8B4513',
    degisken: '--pas',
    hex: '#8b4513',
    not: 'Süs çizgisi, ikincil vurgu',
  },
  {
    ad: 'Color/Silver',
    tip: 'color',
    deger: '#A0A0A0',
    degisken: '--gumus',
    hex: '#a0a0a0',
    not: 'Metal, denetim sınırı',
  },
  {
    ad: 'Color/TextSilver',
    tip: 'color',
    deger: '#D1D5DB',
    degisken: '--m',
    hex: '#d1d5db',
    not: 'Madde 18 metin rengi',
  },
  {
    ad: 'Texture/RustMetal',
    tip: 'texture',
    deger: 'SVG karo 256 px',
    degisken: '--doku-pas',
    not: 'Paslı demir',
  },
  {
    ad: 'Texture/StoneWall',
    tip: 'texture',
    deger: 'SVG karo 224×160 px',
    degisken: '--doku-tas',
    not: 'Taş duvar',
  },
  {
    ad: 'Effects/GothicShadow',
    tip: 'effect',
    deger: '0 0 20px rgba(92,6,6,.5) · iç 0 0 46px rgba(0,0,0,.82)',
    not: 'Kart gölgesi ve iç gölge',
  },
  {
    ad: 'Effects/RedBleed',
    tip: 'effect',
    deger: 'radyal kan, bulanıklık 22 px, döngü 4,3 sn',
    not: 'Arkadan sızan ışık',
  },
  {
    ad: 'Shape/PointedArch',
    tip: 'shape',
    deger: 'çokgen, 31 nokta, r = 0,85 · genişlik',
    not: 'Kemer profili',
  },
]

export function Figma() {
  const okunan = useOlc(
    () => {
      const cs = getComputedStyle(document.documentElement)
      const o: Record<string, string> = {}
      TOKENLER.forEach((t) => {
        if (t.degisken && t.hex) o[t.ad] = cs.getPropertyValue(t.degisken).trim().toLowerCase()
      })
      return o
    },
    [],
    {} as Record<string, string>,
  )
  return (
    <Bolum id="figma" no="10" madde="Madde 12 · 13 · Figma mimarisi ve tokenlar" baslik="Katmanlar ve tokenlar" lead="Pas ve demir ayrıntıları, bileşen katmanlarına SVG maskeler olarak girer; renk, doku ve gölge ise adlandırılmış tokenlardır. İkisini de burada elle çevirebilirsin.">
      <div className="grid grid-cols-1 gap-x-12 gap-y-16 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-5">
          <h3 className="t-h3" lang="en">
            GothicCard
          </h3>
          <p className="t-alt mt-2" lang="en">
            Component set · Kemer × Yüzey × Zincir
          </p>
          <ul className="agac mt-6" data-katmanlar="">
            {KATMAN_AGACI.map((k) => (
              <li key={k.ad}>
                <span className="agac-dugum">
                  <span className="agac-ad">{k.ad}</span>
                  <span className="agac-tur t-alt">{k.tur}</span>
                </span>
                {k.alt ? (
                  <ul>
                    {k.alt.map((a) => (
                      <li key={a.ad}>
                        <span className="agac-dugum">
                          <span className="agac-ad">{a.ad}</span>
                          <span className="agac-tur t-alt">{a.tur}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
        <GothicCard kemer="duz" yuzey="tas" as="section" aria-label="SVG pas maskesi" sarmal="lg:col-span-7" data-figma-kart="">
          <h3 className="t-h3">SVG pas maskesi</h3>
          <p className="t-alt mt-2 mb-5">Demir levha, üstünde maskeyle kırpılmış bir pas katmanı. Eşiği oynat: pas yayılır ya da çekilir.</p>
          <PasMaskesi />
        </GothicCard>
      </div>

      <div className="mt-20">
        <h3 className="t-h3">Tokenlar</h3>
        <p className="t-alt mt-2 max-w-[70ch]">
          <span lang="en">Color/BloodRed</span>, <span lang="en">Texture/RustMetal</span> ve <span lang="en">Effects/GothicShadow</span> asıl üç tokendır; kalanı onları tamamlar. Renk tokenlarının kodla eşleşmesi canlı doğrulanır.
        </p>
        <div className="mt-6 overflow-x-auto" tabIndex={0} role="region" aria-label="Token tablosu">
          <table className="tablo w-full min-w-[820px]" data-token-tablo="">
            <thead>
              <tr>
                <th scope="col">Token</th>
                <th scope="col">Önizleme</th>
                <th scope="col">Değer</th>
                <th scope="col">Kullanım</th>
              </tr>
            </thead>
            <tbody>
              {TOKENLER.map((t) => (
                <tr key={t.ad}>
                  <th scope="row" className="rakam" lang="en">
                    {t.ad}
                  </th>
                  <td>
                    {t.tip === 'color' ? <span className="token-onizle" style={{ background: t.hex }} /> : null}
                    {t.tip === 'texture' ? (
                      <span
                        className="token-onizle"
                        style={{
                          backgroundColor: '#181310',
                          backgroundImage: `var(${t.degisken})`,
                        }}
                      />
                    ) : null}
                    {t.tip === 'effect' ? (
                      <span
                        className="token-onizle"
                        style={{
                          background: '#0a0a0c',
                          boxShadow: t.ad.endsWith('GothicShadow') ? '0 0 20px rgba(92,6,6,0.5), inset 0 0 20px rgba(0,0,0,0.82)' : '0 0 22px rgba(178,16,20,0.7)',
                        }}
                      />
                    ) : null}
                    {t.tip === 'shape' ? (
                      <span
                        className="token-onizle"
                        style={{
                          background: '#5c0606',
                          clipPath: 'polygon(0 100%, 0 45%, 50% 0, 100% 45%, 100% 100%)',
                        }}
                      />
                    ) : null}
                  </td>
                  <td className="rakam">
                    {t.deger}
                    {t.hex && okunan[t.ad] !== undefined ? (
                      <span className="t-alt block">
                        <Isaret gecti={okunan[t.ad].replace(/\s/g, '') === t.hex || okunan[t.ad] === ''} />
                        kod ↔ token eşleşti
                      </span>
                    ) : null}
                  </td>
                  <td className="t-alt">{t.not}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Bolum>
  )
}

/* ───────── Madde 15: CSS / Tailwind ───────── */

const SINIFLAR = 'bg-[#0A0A0C] border border-[#5C0606] shadow-[0_0_20px_rgba(92,6,6,0.5)] text-gray-300'

export function Css() {
  const onizle = useRef<HTMLDivElement>(null)
  const [r, setR] = useState(20)
  const [a, setA] = useState(50)
  const [kopya, setKopya] = useState('')
  const zaman = useRef(0)
  useEffect(() => () => window.clearTimeout(zaman.current), [])
  const olc = useOlc(
    () => {
      const e = onizle.current
      if (!e) return { bg: '', kenar: '', golge: '', renk: '' }
      const s = getComputedStyle(e)
      return {
        bg: s.backgroundColor,
        kenar: s.borderTopColor,
        golge: s.boxShadow,
        renk: s.color,
      }
    },
    [],
    { bg: '', kenar: '', golge: '', renk: '' },
    300,
  )
  const uretilen = `bg-[#0A0A0C] border border-[#5C0606] shadow-[0_0_${r}px_rgba(92,6,6,${(a / 100).toString().replace(/^0/, '0')})] text-gray-300`
  return (
    <Bolum id="css" no="11" madde="Madde 15 · CSS ve Tailwind yapısı" baslik="Tek satırlık karanlık" lead="Kartın çekirdeği dört Tailwind sınıfıdır; kemer, zincir ve doku ise bunun üstüne eklenen tokenlardır. Aşağıdaki kutu tam bu sınıflarla çizilir.">
      <div className="grid grid-cols-1 gap-x-12 gap-y-14 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-6">
          <h3 className="t-h3">Sınıf dizgisi</h3>
          <Kod label="Tailwind sınıfları" className="mt-4">
            {SINIFLAR}
          </Kod>
          <div className="mt-8">
            <div ref={onizle} className="bg-[#0A0A0C] border border-[#5C0606] shadow-[0_0_20px_rgba(92,6,6,0.5)] text-gray-300 p-6" data-css-onizleme="">
              <p className="t-etiket">Kayıt 03 · Mahzen</p>
              <p className="mt-2 text-[1.1875rem]">Bu kutu yalnızca yukarıdaki dört sınıfla çizilir: gece siyahı zemin, kuru kan kenarlık, kızıl gölge, soluk gümüş metin.</p>
            </div>
          </div>
        </div>
        <div className="min-w-0 lg:col-span-6">
          <h3 className="t-h3">Hesaplanan CSS</h3>
          <div className="mt-4 overflow-x-auto" tabIndex={0} role="region" aria-label="Hesaplanan CSS tablosu">
            <table className="tablo w-full min-w-[520px]" data-css-tablo="">
              <thead>
                <tr>
                  <th scope="col">Sınıf</th>
                  <th scope="col">Özellik</th>
                  <th scope="col">Ölçülen</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['bg-[#0A0A0C]', 'background-color', olc.bg],
                  ['border-[#5C0606]', 'border-color', olc.kenar],
                  ['shadow-[…]', 'box-shadow', olc.golge],
                  ['text-gray-300', 'color', olc.renk],
                ].map(([s, o, v]) => (
                  <tr key={s}>
                    <th scope="row" className="rakam whitespace-nowrap">
                      {s}
                    </th>
                    <td className="rakam t-alt">{o}</td>
                    <td className="rakam break-words">{v || '…'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="min-w-0 lg:col-span-6">
          <h3 className="t-h3">Gölgeyi ayarla</h3>
          <div className="mt-4 grid gap-6">
            <Aralik label="Yayılma" value={r} min={0} max={60} onChange={setR} format={(v) => `${v} px`} />
            <Aralik label="Kan opaklığı" value={a} min={0} max={100} step={5} onChange={setA} format={(v) => `%${v}`} />
          </div>
          <div className="mt-6 border border-[#5C0606] bg-[#0A0A0C] p-6 text-gray-300" style={{ boxShadow: `0 0 ${r}px rgba(92,6,6,${a / 100})` }} data-golge-onizleme="">
            <p className="rakam text-[1.0625rem]">
              0 0 {r}px rgba(92,6,6,{(a / 100).toFixed(2)})
            </p>
          </div>
          <Kod label="Üretilen sınıf dizgisi" className="mt-4">
            {uretilen}
          </Kod>
          <div className="mt-4">
            <Dugme
              dar
              ton="demir"
              onClick={() => {
                navigator.clipboard?.writeText(uretilen).catch(() => {})
                setKopya('Kopyalandı')
                window.clearTimeout(zaman.current)
                zaman.current = window.setTimeout(() => setKopya(''), 1800)
              }}
            >
              Sınıfı kopyala
            </Dugme>
            <span className="t-alt ml-3" role="status">
              {kopya}
            </span>
          </div>
        </div>
        <div className="min-w-0 lg:col-span-6">
          <h3 className="t-h3">Tema ve kemer</h3>
          <Kod label="Tailwind tema ve kemer tokenları" className="mt-4" dar>
            {`@theme inline {
  --color-*: initial;
  --color-gray-300: #d1d5db;   /* text-gray-300 */
  --font-kara: 'Pirata One', serif;
  --font-baslik: 'Grenze Gotisch Variable', serif;
  --font-govde: 'Spectral', Georgia, serif;
}

.gk {
  --k: 56px;                 /* kemer yüksekliği */
  clip-path: var(--kemer-dis);   /* polygon(… 31 nokta) */
  background: #5c0606;       /* 2,5 px kenarlık */
}
.gk::before {
  inset: 0 2px 2px 2px;
  clip-path: var(--kemer-ic);
  background: var(--doku-pas), #181310;
}`}
          </Kod>
        </div>
      </div>
    </Bolum>
  )
}
