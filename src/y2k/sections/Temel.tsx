import type { CSSProperties } from 'react'
import { useY2K } from '../lib/store'
import { enKotu, kontrast, oran } from '../lib/contrast'
import { ChromeLogo } from '../components/ChromeLogo'
import { ChromeButton } from '../components/ChromeButton'
import { Y2KCard } from '../components/Y2KCard'
import { Badge } from '../components/Badge'
import { Marquee } from '../components/Marquee'
import { Bubble, CD, Ellipse, Starburst } from '../components/Shapes'
import { IconPlay, IconSparkle, IconWindow, TribalStar } from '../components/Icons'
import { Section } from '../components/ui'

const v = (o: Record<string, string>) => o as CSSProperties
const git = (id: string) => document.getElementById(id)?.scrollIntoView()

/** Madde 1 · 2: buz mavisi zeminde krom logo ve uçuşan CD-ROM'lar */
export function Hero() {
  const { ac } = useY2K()
  return (
    <section id="ust" aria-labelledby="baslik" className="relative overflow-x-clip">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <Ellipse w={520} h={260} rot={-14} fill="var(--pink)" className="absolute -top-24 -left-40 opacity-30" />
        <Ellipse w={420} h={220} rot={21} fill="var(--ice)" className="absolute top-[38%] -right-32 opacity-60" />
        <IconSparkle size={28} className="sparkle twinkle absolute top-[14%] left-[46%] text-white" />
        <IconSparkle size={18} className="sparkle twinkle absolute top-[62%] left-[8%] text-[#ff66cc]" style={v({ animationDelay: '-0.6s' })} />
        <IconSparkle size={22} className="sparkle twinkle absolute top-[30%] right-[6%] text-white" style={v({ animationDelay: '-1.1s' })} />
      </div>
      <div className="relative mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-6 px-4 pt-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] md:gap-10 md:px-8 md:pt-14">
        <div className="relative z-10 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge ton="grape">Stil 019</Badge>
            <Badge ton="chrome">Retro / Nostalgia · Y2K</Badge>
          </div>
          <h1 id="baslik" className="mt-5">
            <span className="sr-only">Milenyum FM</span>
            <ChromeLogo text="MİLENYUM" className="block h-auto w-full" />
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-3">
            <span className="candy inline-flex items-center rounded-full border border-[#2b3445]/55 px-5 py-2 font-logo text-[22px] tracking-[0.12em] md:text-[28px]" aria-hidden="true">
              FM 20.00
            </span>
            <p className="brat text-[clamp(38px,5.4vw,70px)] text-ink">
              gelecek parlak.
              <br />
              her şey krom.
            </p>
          </div>
          <p className="mt-6 max-w-[54ch] text-[18px] leading-snug text-muted max-sm:text-[16px]">
            2000'lerin başındaki teknolojik iyimserlik: krom logolar, buz mavisi zeminde uçan CD'ler, sakız pembesi kapsül düğmeler. MİLENYUM FM bir tanıtım; radyo, mağaza ve portfolyo kurgu, düğmeler çalışır.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <ChromeButton ton="candy" boyut="lg" ikon={<IconPlay size={18} />} onClick={() => git('muzik')}>
              Dinlemeye başla
            </ChromeButton>
            <ChromeButton boyut="lg" onClick={() => git('magaza')}>
              Mağaza
            </ChromeButton>
            <ChromeButton
              ton="icy"
              boyut="lg"
              ikon={<IconWindow size={18} />}
              onClick={() => ac({ baslik: 'Tebrikler!', metin: 'Bu sayfanın 1.000.000. ziyaretçisisiniz. Değilsiniz; 2000 yılında herkes öyleydi.', ton: 'icy', odak: true })}
            >
              Sürpriz
            </ChromeButton>
          </div>
        </div>
        <div className="relative h-[340px] md:h-[520px]" aria-hidden="true">
          <div className="float absolute top-[4%] left-[6%]" style={v({ '--float': '5.5s' })}>
            <CD size={230} className="spin max-md:!size-[180px]" style={v({ '--spin': '9s' })} />
          </div>
          <div className="float absolute top-[46%] right-[2%]" style={v({ '--float': '4.2s', animationDelay: '-1.5s' })}>
            <CD size={150} className="spin max-md:!size-[118px]" style={v({ '--spin': '6s', animationDirection: 'reverse' })} />
          </div>
          <div className="float absolute bottom-[2%] left-[30%]" style={v({ '--float': '6.5s', animationDelay: '-3s' })}>
            <CD size={96} className="spin" style={v({ '--spin': '4s' })} />
          </div>
          <Starburst size={126} ton="candy" points={18} className="spin absolute top-[2%] right-[6%]" style={v({ '--spin': '24s' })}>
            Y2K uyumlu!
          </Starburst>
          <TribalStar size={88} className="spin absolute bottom-[26%] left-[2%] text-[#2e0854] dark:text-[#a5f2f3]" />
          <Bubble size={70} className="float absolute top-[36%] left-[48%]" />
          <Bubble size={44} className="float absolute top-[70%] right-[30%]" style={v({ animationDelay: '-2s' })} />
        </div>
      </div>
      <Marquee className="mt-10 md:mt-14" label="Duyurular" items={['Milenyum FM 20.00', 'Yeni single: Buz Kalp', 'Sakız mağazası açıldı', '2000\'e geri sayım bitti, dünya hâlâ dönüyor', 'Bu sayfa Y2K uyumludur']} />
    </section>
  )
}

/** Madde 3: karakteristikler */
export function Traits() {
  return (
    <Section id="karakter" kicker="Madde 3 · Karakteristikler" title="Krom, parlak ve fazlasıyla umutlu" lead="Yeni binyıl her şeyi çözecekti: internet, uzay, moda. Arayüz de bu iyimserliği taşıdı: yüzeyler metal, düğmeler şeker, yazı genişletilmiş.">
      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Y2KCard as="li">
          <p className="kicker text-muted">01</p>
          <h3 className="display mt-2 text-[24px]">Krom yüzeyler</h3>
          <p className="mt-2">Düğme, çerçeve ve logo gümüş metalden yapılmış gibi: ufuk çizgili gradyan, sert ışık.</p>
          <ChromeButton className="mt-4">Krom düğme</ChromeButton>
        </Y2KCard>
        <Y2KCard as="li">
          <p className="kicker text-muted">02</p>
          <h3 className="display mt-2 text-[24px]">Aşırı parlaklık</h3>
          <p className="mt-2">Her yüzeyin üst yarısında beyaz bir parlama; plastik, cam ve jöle hissi.</p>
          <ChromeButton ton="candy" className="mt-4">
            Jöle düğme
          </ChromeButton>
        </Y2KCard>
        <Y2KCard as="li">
          <p className="kicker text-muted">03</p>
          <h3 className="display mt-2 text-[24px]">Teknolojik iyimserlik</h3>
          <p className="mt-2">Gelecek parlak ve yakın. Rozetler hep olumlu: “yeni”, “2000 hazır”, “çok hızlı”.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge ton="icy">2000 hazır</Badge>
            <Badge ton="candy">Yeni</Badge>
            <Badge ton="chrome">56k hız</Badge>
          </div>
        </Y2KCard>
        <Y2KCard as="li">
          <p className="kicker text-muted">04</p>
          <h3 className="display mt-2 text-[24px]">Metalik yansımalar</h3>
          <p className="mt-2">Işık kaynağı yazının üstünde gezer; yansıma imleci izler.</p>
          <ChromeLogo text="KROM" genislik={420} boy={120} derinlik={7} className="mt-3 block h-auto w-[220px]" />
        </Y2KCard>
        <Y2KCard as="li" className="lg:col-span-2">
          <p className="kicker text-muted">05</p>
          <h3 className="display mt-2 text-[24px]">“Brat” tipografi</h3>
          <p className="mt-2">Dar, küçük harf, hafifçe bulanık; genişletilmiş krom başlıkların yanında kasıtlı bir tezat. Yalnız büyük boyda kullanılır, bulanıklık okumayı bozmaz.</p>
          <p className="brat mt-3 text-[clamp(44px,7vw,84px)]">brat ama krom</p>
        </Y2KCard>
      </ul>
    </Section>
  )
}

const ANA: { ad: string; hex: string; token: string; metin: string }[] = [
  { ad: 'Buz Mavisi', hex: '#A5F2F3', token: 'Color/IceBlue', metin: '#000000' },
  { ad: 'Krom Gümüşü', hex: '#E0E5EC', token: 'Color/ChromeSilver', metin: '#000000' },
  { ad: 'Sakız Pembesi', hex: '#FF66CC', token: 'Color/BubblegumPink', metin: '#000000' },
  { ad: 'Koyu Mor', hex: '#2E0854', token: 'Color/DeepPurple', metin: '#FFFFFF' },
]
const GRADYANLAR: { ad: string; css: string; duraklar: string[]; sinif: string }[] = [
  { ad: 'Gradient/Y2KMetal', css: 'linear-gradient(135deg, #FFF 0%, #B0C4DE 50%, #778899 100%)', duraklar: ['#FFFFFF', '#B0C4DE', '#778899'], sinif: 'chrome' },
  { ad: 'Gradient/Candy', css: 'linear-gradient(180deg, #FFC2EA, #FF66CC 55%, #E0309F)', duraklar: ['#FFC2EA', '#FF66CC', '#E0309F'], sinif: 'candy' },
  { ad: 'Gradient/Ice', css: 'linear-gradient(180deg, #F0FFFF, #A5F2F3 55%, #5FCFD2)', duraklar: ['#F0FFFF', '#A5F2F3', '#5FCFD2'], sinif: 'icy' },
  { ad: 'Gradient/Grape', css: 'linear-gradient(180deg, #7B4FB5, #2E0854 60%, #1A0433)', duraklar: ['#7B4FB5', '#2E0854', '#1A0433'], sinif: 'grape' },
]

/** Madde 4: renk paleti */
export function Palette() {
  return (
    <Section id="palet" kicker="Madde 4 · Renk paleti" title="Buz, krom, sakız ve gece moru" lead="Dört renk yeter. Parlak olanların üstünde metin saf siyah, koyu morun üstünde saf beyaz; ara ton yok.">
      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {ANA.map((r) => (
          <li key={r.hex} className="rim shine overflow-hidden rounded-[40px] p-0">
            <div className="grid h-36 place-items-center rounded-t-[34px]" style={{ background: `radial-gradient(circle at 30% 25%, rgb(255 255 255 / 0.7), transparent 45%), ${r.hex}` }}>
              <span className="font-logo text-[26px]" style={{ color: r.metin }} aria-hidden="true">
                Aa
              </span>
            </div>
            <div className="p-5">
              <h3 className="display text-[19px]">{r.ad}</h3>
              <p className="mt-1 font-mono text-[13px]">
                {r.hex} · {r.token}
              </p>
              <p className="mt-2 text-[14px] text-muted">
                Üstünde {r.metin === '#000000' ? 'siyah' : 'beyaz'} metin: {oran(kontrast(r.metin, r.hex))}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <h3 className="display mt-12 text-[26px]">Gradyanlar</h3>
      <p className="mt-2 max-w-[60ch] text-muted">Metin her gradyanın en kötü durağına göre seçilir. Krom gradyanın en koyu noktası #778899 bile siyah metinle AA'yı geçer.</p>
      <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {GRADYANLAR.map((g) => {
          const metin = g.sinif === 'grape' ? '#FFFFFF' : '#000000'
          return (
            <li key={g.ad} className={`${g.sinif} rounded-[30px] border border-[#2b3445]/55 p-5`}>
              <p className="font-logo text-[13px] tracking-[0.08em] uppercase">{g.ad}</p>
              <p className="mt-2 font-mono text-[12px]">{g.css}</p>
              <p className="mt-2 text-[14px] font-semibold">
                {metin === '#000000' ? 'Siyah' : 'Beyaz'} metin, en kötü durakta {oran(enKotu(metin, g.duraklar))}
              </p>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}

/** Madde 5: genişletilmiş fütüristik yazı */
export function Type() {
  const ornek = 'MİLENYUM FM · ĞÜŞİÖÇ 2000'
  return (
    <Section id="yazi" kicker="Madde 5 · Tipografi" title="Genişletilmiş, fütüristik, geniş nefesli" lead="Eurostile ve Microgramma'nın açık kaynak akrabaları: logo ve etiketlerde Michroma, başlıklarda Unbounded, gövde ve “brat” yazıda Archivo.">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Y2KCard>
          <p className="kicker text-muted">Logo ve etiket</p>
          <p className="mt-3 font-logo text-[26px] leading-tight break-words">{ornek}</p>
          <p className="mt-3 text-[14px] text-muted">Michroma · tek ağırlık · harf aralığı geniş, hep büyük harf. ₺ yok; fiyatlar başlık yazısıyla.</p>
        </Y2KCard>
        <Y2KCard>
          <p className="kicker text-muted">Başlık</p>
          <p className="display mt-3 text-[30px] break-words">{ornek}</p>
          <p className="mt-3 text-[14px] text-muted">Unbounded · 200–900 ağırlık · yuvarlak ve geniş.</p>
        </Y2KCard>
        <Y2KCard>
          <p className="kicker text-muted">Gövde ve brat</p>
          <p className="mt-3 text-[19px]">Gövde metni Archivo, normal genişlik: uzun okumaya dayanır.</p>
          <p className="brat mt-2 text-[44px]">brat · %62 dar</p>
          <p className="mt-3 text-[14px] text-muted">Archivo · genişlik ekseni %62–125.</p>
        </Y2KCard>
      </div>
      <p className="mt-6 max-w-[62ch] text-[15px] text-muted">
        Lisanslı Eurostile Extended ya da Microgramma kullanmak için <code>src/y2k/y2k.css</code> içindeki <code>--font-logo</code> sırasından Michroma'yı çıkarın; ardından Eurostile ve Microgramma geliyor.
      </p>
    </Section>
  )
}

