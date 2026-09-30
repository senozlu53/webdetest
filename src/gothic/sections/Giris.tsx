import { Ayrac, Bolum } from '../components/Bolum'
import { BloodProgressBar } from '../components/BloodProgressBar'
import { DugmeLink } from '../components/Dugme'
import { GothicCard } from '../components/GothicCard'
import { useOlc, useSay } from '../components/hooks'
import { Ikon } from '../components/Ikon'
import { Muhur } from '../components/Muhur'
import { Kod } from '../components/ui'
import type { IkonAd } from '../lib/data'

const PROMPT = 'Dark fantasy gothic UI, eerie atmosphere, rusted iron chains, blood red glowing accents, gothic cathedral arches, medieval dark aesthetic.'

/** Kapı arkasından sızan kırmızı ışık: sivri kemerli üç dar pencere (yalnız süs) */
function Pencereler() {
  const pen = (cx: number, w: number, ust: number, alt: number) => {
    const y1 = ust + (alt - ust) * 0.34
    return `M${cx - w} ${alt} V${y1} Q${cx - w} ${ust + (alt - ust) * 0.12} ${cx} ${ust} Q${cx + w} ${ust + (alt - ust) * 0.12} ${cx + w} ${y1} V${alt} Z`
  }
  const dizi: [number, number, number, number][] = [
    [790, 84, 40, 640],
    [980, 100, 10, 640],
    [1160, 76, 44, 640],
  ]
  return (
    <div className="hero-pencere" aria-hidden="true">
      <svg viewBox="0 0 1240 640" preserveAspectRatio="xMaxYMax slice" focusable="false">
        <defs>
          <linearGradient id="hp-k" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" style={{ stopColor: 'var(--pen-1)' }} />
            <stop offset="0.55" style={{ stopColor: 'var(--pen-2)' }} />
            <stop offset="1" style={{ stopColor: 'var(--pen-3)' }} />
          </linearGradient>
        </defs>
        {dizi.map(([cx, w, ust, alt]) => (
          <g key={cx}>
            <path d={pen(cx, w + 14, ust - 12, alt)} fill="#050506" stroke="#24242a" strokeWidth="4" />
            <path d={pen(cx, w, ust, alt)} fill="url(#hp-k)" />
            <path d={`M${cx} ${ust + 20}V${alt} M${cx - w} ${ust + 210}H${cx + w} M${cx - w} ${ust + 380}H${cx + w}`} stroke="#050506" strokeWidth="7" fill="none" />
            <path d={`M${cx - w * 0.5} ${ust + 210}Q${cx - w * 0.5} ${ust + 120} ${cx} ${ust + 100}Q${cx + w * 0.5} ${ust + 120} ${cx + w * 0.5} ${ust + 210}`} stroke="#050506" strokeWidth="5" fill="none" />
          </g>
        ))}
      </svg>
    </div>
  )
}

export function Hero() {
  return (
    <section id="ust" aria-label="Kapak" className="hero" data-hero="">
      <Pencereler />
      <div className="hero-sis" aria-hidden="true" />
      <div className="kap relative pt-[clamp(40px,6vw,88px)] pb-[clamp(56px,7vw,110px)]">
        <div className="grid grid-cols-1 items-start gap-x-14 gap-y-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="t-etiket">
              Hayatta kalma korku oyunu · <span className="rakam">2026 sonbaharı</span>
            </p>
            <h1 className="baslik-kara mt-5">
              Ağıt
              <br />
              Manastırı
            </h1>
            <p className="alinti mt-7 max-w-[34ch]">“Çanlar çalmıyor artık; yalnız zincirler ağlıyor.”</p>
            <Ayrac className="mt-6" />
            <p className="lead mt-6 max-w-[52ch]">Sivri kemerler, paslı zincirler ve kuru kan kırmızısı: mumun titrediği bir manastırda ışığı sen taşırsın, karanlık ise seni bekler.</p>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-5">
              <DugmeLink href="#bilesenler" ton="kan" data-kapiyi-ac="">
                Kapıyı aç
              </DugmeLink>
              <DugmeLink href="#alanlar" ton="demir">
                Günlüğü oku
              </DugmeLink>
            </div>
          </div>
          <GothicCard zincir="asili" sallan as="aside" aria-label="Kayıt kartı" sarmal="lg:col-span-5 lg:self-start" data-hero-kart="">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="t-etiket t-soluk">Kayıt 02 · Mahzen</p>
                <h2 className="t-h3 mt-1">Kilise mahzeni</h2>
              </div>
              <Muhur ikon="hac" boy={76} />
            </div>
            <p className="t-alt mt-3">Bir mum kaldı. Zincirin ucundaki kapı yarı açık.</p>
            <div className="mt-6 grid gap-5">
              <BloodProgressBar etiket="Sağlık" deger={62} />
              <BloodProgressBar etiket="Akıl sağlığı" deger={38} />
            </div>
            <dl className="mt-8 grid grid-cols-3 gap-3 text-center">
              {[
                ['Mum', '3'],
                ['Anahtar', '1'],
                ['Gün', '11'],
              ].map(([a, b]) => (
                <div key={a} className="border-t border-[#8b4513]/60 pt-2">
                  <dt className="t-etiket t-soluk">{a}</dt>
                  <dd className="rakam m-0 mt-1 text-[1.5rem] font-semibold">{b}</dd>
                </div>
              ))}
            </dl>
          </GothicCard>
        </div>
      </div>
    </section>
  )
}

/* ───────── Madde 1 · 2 · 3 ───────── */

export function Stil() {
  const kemer = useSay('.gk[data-kemer=sivri]')
  const zincir = useSay('.zc-asili, .zc-serit')
  const isik = useOlc(() => getComputedStyle(document.documentElement).getPropertyValue('--isik-rgb').trim() || '178 16 20', [], '178 16 20')
  const titre = useOlc(
    () => {
      const e = document.querySelector('.gk-w')
      return e ? getComputedStyle(e, '::before').animationDuration : '4.3s'
    },
    [],
    '4.3s',
  )
  const ozellik: {
    ikon: IkonAd
    baslik: string
    metin: string
    kanit: string
  }[] = [
    {
      ikon: 'kemer',
      baslik: 'Ağır ve gotik atmosfer',
      metin: 'Kartların üstü sivri kemerdir; içerik kemerin altında, kalın bir karanlığın içinde durur.',
      kanit: `${kemer} kemerli yüzey`,
    },
    {
      ikon: 'zincir',
      baslik: 'Paslı metal detaylar',
      metin: 'Zincir şeritleri, perçinli levhalar ve pas lekeli demir; kartlar tavana asılı gibi sallanır.',
      kanit: `${zincir} zincir öğesi`,
    },
    {
      ikon: 'damla',
      baslik: 'Kan kırmızısı vurgular',
      metin: 'Kenarlık #5C0606, ışık sızıntısı ve ilerleme çubuğu aynı kuru kan tonundan gelir.',
      kanit: `ışık ${isik.replace(/\s+/g, ', ')}`,
    },
    {
      ikon: 'kuzgun',
      baslik: 'Gizemli, ürpertici kompozisyon',
      metin: 'Simetriyi kemer kurar, bozan şey ışığın düzensiz titreşimidir: hiçbir kare bir öncekine benzemez.',
      kanit: `${titre} titreme döngüsü`,
    },
  ]
  return (
    <Bolum id="stil" no="01" madde="Madde 1 · 2 · 3 · Stil, referans, karakter" baslik="Manastırın künyesi" lead="Karanlık, gotik mimariden, kabuslardan ve gizemli orta çağ hikayelerinden beslenen bir arayüz: kan kırmızısı vurgular, demir zincirler ve ağır atmosferik tonlar.">
      <div className="grid grid-cols-1 gap-x-12 gap-y-16 lg:grid-cols-12">
        <GothicCard as="article" yuzey="tas" sarmal="lg:col-span-6" data-stil-bilgi="">
          <p className="t-etiket t-soluk">Künye</p>
          <dl className="mt-4 grid gap-5">
            <div>
              <dt className="t-etiket t-soluk">Madde 1 · Stil adı</dt>
              <dd className="t-h3 m-0 mt-1" lang="en">
                Dark Fantasy (Gothic UI)
              </dd>
            </div>
            <div>
              <dt className="t-etiket t-soluk">Kategori</dt>
              <dd className="m-0 mt-1 text-[1.1875rem]" lang="en">
                Gaming / Fantasy – Dark Fantasy / Gothic
              </dd>
            </div>
            <div>
              <dt className="t-etiket t-soluk">Madde 2 · Görsel referans</dt>
              <dd className="m-0 mt-1 text-[1.1875rem]">Kiliseleri andıran gotik kemerler, paslı demir zincirler, karanlık kadife zeminler ve kan kırmızısı mühürler.</dd>
            </div>
            <div>
              <dt className="t-etiket t-soluk">Prompt</dt>
              <dd className="m-0 mt-2">
                <Kod label="Referans prompt">{PROMPT}</Kod>
              </dd>
            </div>
          </dl>
        </GothicCard>
        <div className="grid grid-cols-1 content-start gap-14 lg:col-span-6" data-ozellikler="">
          {ozellik.map((o, i) => (
            <GothicCard key={o.baslik} kemer="duz" yuzey={i % 2 ? 'kadife' : 'demir'} as="section" aria-label={o.baslik} data-v={i === 1 ? 'pas' : undefined}>
              <div className="flex items-start gap-4">
                <span className="mt-1 text-[color:var(--gumus)]">
                  <Ikon ad={o.ikon} boy={46} />
                </span>
                <div className="min-w-0">
                  <p className="t-etiket t-soluk">Madde 3 · Karakter</p>
                  <h3 className="t-h3 mt-1 !text-[1.5rem]">{o.baslik}</h3>
                  <p className="mt-2 text-[1.125rem]">{o.metin}</p>
                  <p className="rakam t-etiket yazi-vurgu mt-3" data-kanit="">
                    Kanıt: {o.kanit}
                  </p>
                </div>
              </div>
            </GothicCard>
          ))}
        </div>
      </div>
    </Bolum>
  )
}
