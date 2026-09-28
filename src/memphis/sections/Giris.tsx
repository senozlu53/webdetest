import { MemphisCard } from '../components/MemphisCard'
import { PopButton } from '../components/PopButton'
import { Konfeti, Sekil } from '../components/Shapes'
import { UiIkon } from '../components/Icons'
import { Hap, Section } from '../components/ui'

const git = (id: string) => document.getElementById(id)?.scrollIntoView()

/** Madde 1 · 2: renk ve şekil patlaması. Izgara 1,618 : 1 (altın oran) */
export function Hero() {
  return (
    <section id="ust" aria-labelledby="baslik" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="halftone absolute -top-10 right-[4%] h-[260px] w-[42%] [--dot-color:var(--teal)] max-md:hidden" />
        <div className="polka absolute -bottom-28 -left-28 size-[180px] rounded-full [--dot-color:var(--yellow)]" />
        <Sekil tur="dalga" ton="pembe" boyut={120} className="suzul absolute top-[16%] left-[50%] max-lg:hidden" />
        <Sekil tur="zikzak" ton="camgobegi" boyut={110} className="suzul absolute right-[2%] bottom-[6%] [animation-delay:-2s]" />
        <Konfeti tur="cubuk" ton="pembe" className="suzul absolute top-[60%] left-[48%] rotate-45" />
        <Konfeti tur="nokta" ton="sari" className="suzul absolute top-[18%] left-[6%] [animation-delay:-3s]" />
        <Konfeti tur="ucgen" ton="camgobegi" className="suzul absolute top-[82%] left-[30%] [animation-delay:-1s]" />
      </div>
      <div className="relative mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-12 px-4 pt-12 pb-16 md:px-8 md:pt-20 lg:grid-cols-[1.618fr_1fr]">
        <div className="relative min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Hap ton="pembe">Stil 022</Hap>
            <Hap ton="beyaz">Colorful / Pop / Playful</Hap>
          </div>
          <h1 id="baslik" className="dev mt-6 text-[clamp(56px,10.5vw,148px)]">
            Kural yok,{' '}
            <span className="inline-block rotate-[-3deg] rounded-[10px] border-[5px] border-ink bg-yellow px-3 pb-2 leading-[0.95] shadow-[8px_8px_0_var(--shadow)]">şekil</span> var.
          </h1>
          <p className="mt-8 max-w-[46ch] text-[20px] leading-relaxed max-sm:text-[18px]">
            <span lang="en" className="font-extrabold">
              Memphis Design
            </span>
            : 1981 Milano'sunun zıt renkleri, kalın siyah konturları ve havada uçuşan geometrisi. Konfeti Kolektif kurgu bir tasarım topluluğu; ajans, festival, ders ve parti oyunu örnekleri çalışır.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <PopButton ton="pembe" boy="b" konfeti onClick={() => git('festival')} ikon={<UiIkon ad="oynat" boyut={18} />}>
              Festivale git
            </PopButton>
            <PopButton ton="beyaz" boy="b" onClick={() => git('ajans')}>
              İşlerimiz
            </PopButton>
          </div>
        </div>
        <div className="relative mx-auto h-[380px] w-full max-w-[420px] sm:h-[420px]" aria-label="Üst üste binmiş kartlar: 1981, 4 piksel kontur, 8 piksel gölge" role="group">
          <MemphisCard kimlik="hero-1" ton="camgobegi" aci={8} className="absolute top-0 left-[4%] w-[62%] rounded-[18px] p-5">
            <p className="kicker">Milano</p>
            <p className="dev mt-1 text-[clamp(40px,12vw,64px)] lg:text-[clamp(40px,4.6vw,64px)]">1981</p>
          </MemphisCard>
          <MemphisCard kimlik="hero-2" ton="sari" aci={6} golgeTon="pembe" className="absolute top-[34%] right-0 w-[58%] rounded-full px-6 py-7 text-center">
            <p className="dev text-[clamp(32px,9vw,44px)]">4px</p>
            <p className="font-bold">kontur</p>
          </MemphisCard>
          <MemphisCard kimlik="hero-3" ton="pembe" aci={7} className="absolute bottom-0 left-0 w-[56%] rounded-[4px] p-5">
            <p className="dev text-[clamp(34px,10vw,48px)]">8px</p>
            <p className="font-bold">katı gölge, 0 bulanıklık</p>
          </MemphisCard>
          <Sekil tur="ucgen" ton="sari" boyut={78} golge className="kipir absolute top-[4%] right-[6%]" />
          <Sekil tur="silindir" ton="pembe" boyut={70} golge className="absolute bottom-[26%] left-[44%]" />
          <Sekil tur="daire" ton="camgobegi" boyut={46} golge className="suzul absolute right-[10%] bottom-[2%]" />
        </div>
      </div>
    </section>
  )
}

/** Madde 3: dört karakteristik, üst üste binen asimetrik kartlar olarak */
export function Karakter() {
  return (
    <Section id="karakter" madde="Madde 3 · Karakteristikler" title="Dört kural," vurgu="dört şekil" ton="camgobegi" sekil="arti" lead="Geometrik primitifler, yüksek enerji, kural tanımayan asimetri ve düz renk blokları. Kartlar bilerek eğik ve birbirinin üstüne taşar; masaüstünde ızgara bozulur, telefonda alt alta dizilir.">
      <ul className="m-0 grid list-none grid-cols-1 gap-8 p-0 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
        <MemphisCard as="li" kimlik="k-1" ton="beyaz" className="relative z-[1] rounded-[18px] p-6 lg:mt-10">
          <div className="flex gap-2" aria-hidden="true">
            <Sekil tur="daire" ton="sari" boyut={40} />
            <Sekil tur="ucgen" ton="pembe" boyut={40} />
            <Sekil tur="kare" ton="camgobegi" boyut={40} />
          </div>
          <h3 className="mt-5 text-[clamp(20px,2.1vw,26px)] max-lg:text-[26px]">Geometrik primitifler</h3>
          <p className="mt-3">Daire, üçgen, kare, zikzak, silindir. Resim yok; her şey bu parçalardan kurulur.</p>
        </MemphisCard>
        <MemphisCard as="li" kimlik="k-2" ton="sari" className="relative z-[2] rounded-[4px] p-6 lg:-ml-3">
          <div className="flex items-center gap-2" aria-hidden="true">
            <Sekil tur="zikzak" ton="pembe" boyut={70} />
            <Konfeti tur="cubuk" ton="camgobegi" />
            <Konfeti tur="nokta" ton="pembe" />
          </div>
          <h3 className="mt-5 text-[clamp(20px,2.1vw,26px)] max-lg:text-[26px]">Yüksek enerji</h3>
          <p className="mt-3">Zıt renkler yan yana, boşlukta konfeti. Göz bir yerde durmaz ama yazının etrafı hep sakin.</p>
        </MemphisCard>
        <MemphisCard as="li" kimlik="k-3" ton="camgobegi" aci={6} className="relative z-[3] rounded-[40px_6px_40px_6px] p-6 lg:mt-16 lg:-ml-3">
          <Sekil tur="yarim" ton="pembe" boyut={60} className="-mt-2" />
          <h3 className="mt-3 text-[clamp(20px,2.1vw,26px)] max-lg:text-[26px]">Kural tanımayan asimetri</h3>
          <p className="mt-3">Köşeler farklı yuvarlanır, açılar eşit değildir. Denge ölçüyle kurulur, simetriyle değil.</p>
        </MemphisCard>
        <MemphisCard as="li" kimlik="k-4" ton="beyaz" className="relative z-[4] rounded-[18px] p-6 lg:-mt-2 lg:-ml-3">
          <div className="grid h-10 grid-cols-4 overflow-hidden rounded-full border-[3px] border-ink" aria-hidden="true">
            <span className="bg-yellow" />
            <span className="bg-teal" />
            <span className="bg-pink" />
            <span className="bg-ink" />
          </div>
          <h3 className="mt-5 text-[clamp(20px,2.1vw,26px)] max-lg:text-[26px]">Düz renk blokları</h3>
          <p className="mt-3">Gradyan yok, gölge katı, dolgu düz. Doku yalnız nokta vuruşlu desenle gelir.</p>
        </MemphisCard>
      </ul>
    </Section>
  )
}
