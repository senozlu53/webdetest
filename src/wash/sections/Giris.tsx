import { Baykus } from '../components/Baykus'
import { WashButton, FircaCizgi } from '../components/Firca'
import { Ikon } from '../components/Ikon'
import { WatercolorBackground, type LekeTanim } from '../components/Leke'
import { Section } from '../components/ui'
import type { SimgeAd } from '../lib/simge'
import type { Pigment } from '../lib/simge'

const git = (id: string) => document.getElementById(id)?.scrollIntoView()

const HERO_LEKE: LekeTanim[] = [
  { renk: 'ultramarin', x: 56, y: 44, w: 76, h: 76, tohum: 3, op: 1, dalga: 0.14 },
  { renk: 'gul', x: 74, y: 68, w: 46, h: 50, tohum: 8, op: 1, dalga: 0.16, gecikme: 0.9 },
  { renk: 'yesil', x: 30, y: 84, w: 54, h: 36, tohum: 14, op: 1, dalga: 0.18, gecikme: 1.6 },
  { renk: 'ocre', x: 22, y: 22, w: 28, h: 32, tohum: 21, op: 1, dalga: 0.12, gecikme: 2.2 },
]

/** Madde 1 · 2 · 17: hikâye kitabı açılışı. Metin opak sayfada, resim kendi bloğunda; aralarında kesin sınır */
export function Hero() {
  return (
    <section id="ust" aria-labelledby="baslik" className="mx-auto w-full max-w-[1240px] px-4 pt-8 pb-6 md:px-8 md:pt-12">
      <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-[1.05fr_1fr] md:gap-0">
        <div className="sayfa relative z-[1] flex flex-col justify-center px-6 py-10 md:px-12 md:py-16" data-metin="">
          <p className="kicker">Stil 027 · Illustration / Handcraft</p>
          <h1 id="baslik" className="mt-4 text-[clamp(52px,8.6vw,118px)] leading-[0.95] font-medium italic">
            Bir varmış,
            <br />
            bir yokmuş
          </h1>
          <FircaCizgi renk="gul" tohum={9} className="mt-1 max-w-[300px]" />
          <p className="basharf mt-7 max-w-[46ch] text-[20px]">Sayfanın kenarına damlayan bir boya, sonra bir orman, bir nehir, bir baykuş. Sessiz Kitaplık, masalları suluboyayla anlatır; hikâyeyi de, sakin kalmak isteyeni de kâğıdın sıcaklığına çağırır.</p>
          <div className="mt-9 flex flex-wrap gap-6">
            <WashButton renk="ultramarin" boy="b" ikon={<Ikon ad="kitap" boyut={30} />} onClick={() => git('masal')}>
              Masalı aç
            </WashButton>
            <WashButton renk="yesil" boy="b" onClick={() => git('sukunet')}>
              Nefes al
            </WashButton>
          </div>
        </div>
        <div className="relative min-h-[420px] border border-[var(--cizgi)] md:min-h-[560px] md:border-l-0" style={{ borderRadius: '3px 14px 12px 4px / 4px 12px 14px 3px' }} data-hero-resim="">
          <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: 'inherit' }}>
            <WatercolorBackground lekeler={HERO_LEKE} sure={3.6} />
            <div className="absolute right-[8%] bottom-[7%] w-[46%] max-w-[300px]">
              <Baykus className="yuz w-full" />
            </div>
            <p className="absolute top-5 left-6 font-baslik text-[22px] text-soluk italic" aria-hidden="true">
              Şekil 1 · gece yarısı, bilge baykuş
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

const KURALLAR: { simge: SimgeAd; renk: Pigment; baslik: string; metin: string }[] = [
  { simge: 'damla', renk: 'ultramarin', baslik: 'Şiirsel ve duygusal', metin: 'Cümleler kısa, sesler yumuşak. Arayüz bir kitabın sayfasını çevirir gibi konuşur.' },
  { simge: 'nilufer', renk: 'gul', baslik: 'Akışkan', metin: 'Boya kâğıda yayılır, kenarında birikir, sonra kurur. Hiçbir şey ani belirmez.' },
  { simge: 'kitap', renk: 'ocre', baslik: 'Hikâye anlatan', metin: 'Sayfalar sırayla açılır. Her ekranın bir başı, ortası ve sonu var.' },
  { simge: 'yaprak', renk: 'yesil', baslik: 'Leke, hata değil', metin: 'Taşan boya, beklenmedik damla: kusur değil, elin izi. Metin ise hep net.' },
]

/** Madde 3: dört karakteristik */
export function Karakter() {
  return (
    <Section id="karakter" madde="Madde 3 · Karakteristikler" title="Dört sıvı his" renk="ultramarin" lead="Suluboya kontrol edilmez, yönlendirilir. Bu sayfada da öyle: boya çevrede akar, metin sakin bir sayfada durur.">
      <ul className="m-0 grid list-none grid-cols-1 gap-x-8 gap-y-10 p-0 sm:grid-cols-2 xl:grid-cols-4">
        {KURALLAR.map((k) => (
          <li key={k.baslik} className="sayfa p-6">
            <Ikon ad={k.simge} boyut={64} />
            <h3 className="mt-4 text-[32px] font-medium italic [overflow-wrap:anywhere]">{k.baslik}</h3>
            <p className="mt-3 text-[17px] leading-[1.7] text-soluk">{k.metin}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
