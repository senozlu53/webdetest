import { useMemo, type ReactNode } from 'react'
import { damarAt, kamci, kontur, konturYol, ornekle, petalAt, sarmasikAt, sivri, yaprakAt, yumusak } from '../lib/bitki'
import { Belir, Section } from '../components/ui'
import { BotanikKart, Cerceve, DalgaGorsel, NouveauButton, SadePanel } from '../components/Nouveau'
import { Ikon } from '../components/Ikon'

const git = (id: string) => document.getElementById(id)?.scrollIntoView()

/** Madde 1 · 2 · 11: büyük botanik çerçeve içinde başlık, yanında dalgalı maskeli görsel */
export function Hero() {
  return (
    <section
      id="ust"
      aria-labelledby="baslik"
      className="mx-auto w-full max-w-[1240px] px-3 sm:px-6 lg:px-10"
      style={{
        paddingTop: 'clamp(16px, 3vw, 40px)',
        paddingBottom: 'var(--bolum)',
      }}
    >
      <Belir sure={2000}>
        <Cerceve tohum={7} katman={2} ayrisma={14} genlik={7} dalgaBoyu={180} className="w-full" data-testid="hero-cerceve">
          <div className="grid grid-cols-1 items-center gap-x-10 gap-y-8 md:grid-cols-12">
            <div className="min-w-0 md:col-span-7">
              <p className="kicker">
                Stil 030 · <span lang="en">Art Nouveau</span>
              </p>
              <h1 id="baslik" className="baslik mt-4 text-[clamp(34px,5.4vw,78px)]">
                Doğa düz çizgiyi <em className="font-sus text-zeytin not-italic">hiç sevmedi.</em>
              </h1>
              <p className="mt-6 max-w-[46ch] text-[clamp(17px,1.5vw,21px)]">Yüzyıl dönümünün sarmaşığı, zambağı ve kamçı kıvrımı: her kenarın dalgalandığı, her çerçevenin bir bitki gibi büyüdüğü bir arayüz dili. Müzeler, antikacılar, parfüm evleri ve atölyeler için.</p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <NouveauButton varyant="dolu" boy="b" onClick={() => git('muze')} ikon={<Ikon ad="ok" boyut={22} />}>
                  Koleksiyona bak
                </NouveauButton>
                <NouveauButton varyant="metin" onClick={() => git('sekil')} ikon={<Ikon ad="girdap" boyut={20} />}>
                  Kıvrımı çiz
                </NouveauButton>
              </div>
            </div>
            <div className="relative min-w-0 md:col-span-5">
              <DalgaGorsel sahne="sac" oran="4 / 5" tohum={11} etiket="Akan saçlardan oluşan halka" className="mx-auto w-full max-w-[420px]" />
            </div>
          </div>
        </Cerceve>
      </Belir>
    </section>
  )
}

/* ───────────────────────── Madde 3 · karakteristikler ───────────────────────── */

function Cizim({ ad }: { ad: 'kamci' | 'asimetri' | 'akis' | 'zenginlik' }) {
  const g = useMemo<ReactNode>(() => {
    if (ad === 'kamci') {
      const p1 = kamci(20, 100, 190, -0.5, {
        donus: 1.2,
        dalga: 0.9,
        us: 2.4,
        yon: -1,
        n: 60,
      })
      const p2 = kamci(60, 108, 130, -0.2, {
        donus: 1.0,
        dalga: 0.7,
        us: 2.2,
        yon: 1,
        n: 50,
      })
      return (
        <>
          <path d={sivri(p1, 9, 0.6, 0.85)} fill="var(--nv-gece)" />
          <path d={sivri(p2, 6, 0.5, 0.85)} fill="var(--nv-gold)" />
        </>
      )
    }
    if (ad === 'asimetri') {
      const k = kontur(220, 120, {
        tohum: 6,
        genlik: 6,
        dalgaBoyu: 90,
        asimetri: 1,
        pay: 8,
      })
      return (
        <>
          <path d={konturYol(k)} fill="var(--panel)" stroke="var(--nv-gold)" strokeWidth="2" />
          {[0, 1, 2, 3].map((i) => (
            <path key={i} d={yaprakAt(170 + i * 8, 26 + i * 16, -0.4 - i * 0.5, 36 - i * 3, 11)} fill="var(--nv-sage)" stroke="var(--nv-gece)" strokeWidth=".6" />
          ))}
          <path d={sarmasikAt(30, 92, -1, 34)} fill="var(--nv-gul)" stroke="var(--nv-gul-k)" strokeWidth=".8" />
        </>
      )
    }
    if (ad === 'akis') {
      return (
        <>
          {[0, 1, 2, 3, 4].map((i) => (
            <path
              key={i}
              d={yumusak(
                ornekle(
                  Array.from({ length: 9 }, (_, k) => [10 + k * 25, 26 + i * 17 + Math.sin(k * 1.1 + i * 0.9) * (9 + i * 1.5)] as [number, number]),
                  6,
                ),
              )}
              fill="none"
              stroke={i % 2 ? 'var(--nv-sage)' : 'var(--nv-gold)'}
              strokeWidth={2.2 - i * 0.2}
              strokeLinecap="round"
            />
          ))}
        </>
      )
    }
    return (
      <>
        {petalAt(110, 68, -1.57, 42, 7, 0.32).map((d, i) => (
          <path key={i} d={d} fill={i % 2 ? 'var(--nv-gul)' : 'var(--panel)'} stroke="var(--nv-gul-k)" strokeWidth="1" />
        ))}
        <circle cx="110" cy="68" r="7" fill="var(--nv-gold)" />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <path d={yaprakAt(30 + i * 8, 106 - i * 6, -0.5 - i * 0.25, 40, 11)} fill="var(--nv-sage)" stroke="var(--nv-gece)" strokeWidth=".6" />
            <path d={damarAt(30 + i * 8, 106 - i * 6, -0.5 - i * 0.25, 40)} fill="none" stroke="var(--nv-gece)" strokeWidth=".6" opacity=".5" />
          </g>
        ))}
        <path
          d={sivri(
            kamci(196, 112, 76, -2.2, {
              donus: 1.1,
              dalga: 0.5,
              us: 2.2,
              yon: 1,
              n: 34,
            }),
            4,
            0.5,
            0.9,
          )}
          fill="var(--nv-gold)"
        />
      </>
    )
  }, [ad])
  return (
    <svg viewBox="0 0 220 120" className="mx-auto h-auto w-full max-w-[260px]" aria-hidden="true" data-cizim={ad}>
      {g}
    </svg>
  )
}

const KARAKTERLER: {
  ad: 'kamci' | 'asimetri' | 'akis' | 'zenginlik'
  baslik: string
  metin: string
  span: string
  tohum: number
}[] = [
  {
    ad: 'kamci',
    baslik: 'Kamçı kıvrımı',
    metin: 'Çizgi kalından inceye akar ve ucunda kendine sarılır. Sabit kalınlıklı bir çizgi burada hiç yok; her hat bir sap gibi incelir.',
    span: 'md:col-span-7',
    tohum: 2,
  },
  {
    ad: 'asimetri',
    baslik: 'Simetriden kaçış',
    metin: 'Yapraklar bir köşede toplanır, öteki köşe boş bırakılır. Göz tek bir merkezde durmaz, çerçeve boyunca gezer.',
    span: 'md:col-span-5',
    tohum: 5,
  },
  {
    ad: 'akis',
    baslik: 'Organik akışkanlık',
    metin: 'Kenarlar, ayraçlar, alt çizgiler ve hatta kaydırıcının yolu dalgalıdır. Doğada cetvel yok, arayüzde de olmamalı.',
    span: 'md:col-span-5',
    tohum: 8,
  },
  {
    ad: 'zenginlik',
    baslik: 'Dekoratif zenginlik',
    metin: 'Çiçek, yaprak ve kıvrım birlikte gelir. Zenginlik yalnız çerçevede kalır; okunacak metin daima sade bir panelde durur.',
    span: 'md:col-span-7',
    tohum: 13,
  },
]

/** Madde 3: dört karakteristik, asimetrik yerleşimde */
export function Karakter() {
  return (
    <Section id="ilke" ikon="kavis" madde="Madde 3 · Karakteristikler" title="Dört bitkisel ilke" lead="Art Nouveau düz çizgiyi reddeder; hattı doğadan alır. Aşağıdaki dört ilke bu sayfanın her bileşeninde geçerli. Kartların genişlikleri bilerek eşit değil.">
      <ol className="m-0 grid list-none grid-cols-1 gap-x-8 gap-y-10 p-0 md:grid-cols-12" data-karakterler="">
        {KARAKTERLER.map((k, i) => (
          <Belir as="li" key={k.ad} className={k.span} gecikme={i * 120}>
            <BotanikKart tohum={k.tohum} kicker={`İlke ${String(i + 1).padStart(2, '0')}`} baslik={k.baslik} className="h-full">
              <Cizim ad={k.ad} />
              <p className="mt-4 text-[17.5px]">{k.metin}</p>
            </BotanikKart>
          </Belir>
        ))}
      </ol>
      <SadePanel className="mt-10 max-w-[70ch]" ic="sm:p-7">
        <p className="dropcap text-[19px]">
          Tasarımın kaynağı 1890–1910 arası Avrupa: Paris metro girişleri, Prag afişleri, Viyana vitrayları, Brüksel merdiven korkulukları. Ortak nokta, ilk kez bir çizginin hem işlev hem süs olmasıydı: sap hem taşır hem dallanır, sarmaşık hem çerçeve olur hem yol gösterir.
        </p>
      </SadePanel>
    </Section>
  )
}
