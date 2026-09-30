import { KARAKTER, PROMPT } from '../lib/data'
import { Dev, Harfler } from '../components/Harfler'
import { KineticHeader } from '../components/KineticHeader'
import { MarqueeText } from '../components/MarqueeText'
import { Baglanti, Bolum, Kod, KENAR } from '../components/ui'
import { HIZ_PX } from '../lib/store'

export function Hero() {
  return (
    <section id="ust" aria-label="Giriş" className="relative">
      <MarqueeText metin="DEVİNİM — KINETIC TYPOGRAPHY — STİL 034 —" hiz={140} ayirac="" className="dev border-y border-hat py-2 text-[clamp(18px,2.4vw,32px)]" ad="hero-serit" />
      <div className={`${KENAR} flex min-h-[calc(100svh-190px)] flex-col justify-between gap-12 pt-[clamp(24px,5vw,64px)] pb-[clamp(32px,5vw,72px)]`}>
        <div>
          <p className="kicker">Stil 034 · Typography-First · Kinetic Typography</p>
          <KineticHeader
            className="mt-5"
            satirlar={[
              { metin: 'Hareket', efekt: ['dalga', 'imlec'] },
              { metin: 'eden', kontur: true, efekt: ['imlec'] },
              { metin: 'metin.', vurgu: true, efekt: ['dalga'] },
            ]}
          />
        </div>
        <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-12">
          <p className="max-w-[40ch] text-[clamp(18px,1.6vw,23px)] md:col-span-5">Devinim, hareketi süs değil arayüz sayan bir tipografi stüdyosu. Kaydırdıkça hızlanan, imlece yaklaştıkça ağırlaşan ve durdurabildiğiniz harfler.</p>
          <div className="flex flex-wrap items-end gap-3 md:col-span-6 md:col-start-7 md:justify-end">
            <Baglanti ton="vurgu" href="#stil">
              Başla
            </Baglanti>
            <Baglanti href="#erisim">Hareketi ayarla</Baglanti>
          </div>
        </div>
      </div>
      <MarqueeText metin="KAYDIR — HIZLAN — YAVAŞLA — YÖN DEĞİŞTİR —" hiz={HIZ_PX.normal} yon={-1} ayirac="" kontur className="dev border-y border-hat py-3 text-[clamp(30px,6vw,86px)]" ad="hero-serit-2" />
    </section>
  )
}

/** Madde 1 · 2 · 3: stil adı, kategori, görsel referans ve karakteristikler */
export function Stil() {
  return (
    <Bolum
      id="stil"
      no="01"
      madde="Madde 1 · 2 · 3 · Stil, referans, karakter"
      baslik="Metin artık akıyor"
      vurgulu={[2]}
      lead="Kinetic typography, metni ekranda duran bir nesne olmaktan çıkarıp zaman, kaydırma ve imleçle biçim değiştiren bir arayüze çevirir. Görsel yoktur: hareket, kelimenin kendisidir."
    >
      <div className={`${KENAR} grid grid-cols-1 gap-x-10 gap-y-14 lg:grid-cols-12`}>
        <dl className="grid grid-cols-1 gap-8 lg:col-span-5" data-stil-bilgi="">
          <div>
            <dt className="kicker">Madde 1 · Stil adı</dt>
            <dd className="dev mt-2 text-[clamp(20px,3vw,40px)]" lang="en">
              Kinetic Typography
            </dd>
          </div>
          <div>
            <dt className="kicker">Kategori</dt>
            <dd className="mt-2 text-[20px]">
              <span lang="en">Typography-First</span> · hareket odaklı metin
            </dd>
          </div>
          <div>
            <dt className="kicker">Madde 2 · Görsel referans</dt>
            <dd className="mt-2 text-[18px] text-soluk">Ekranda devasa boyutlarda dalgalanan, dönen ya da kullanıcı kaydırdıkça hızlanan hareketli metin blokları.</dd>
          </div>
          <div>
            <dt className="kicker mb-3">Prompt</dt>
            <dd>
              <Kod label="Referans prompt">{PROMPT}</Kod>
            </dd>
          </div>
        </dl>

        <div className="border-2 border-metin lg:col-span-7" data-referans="">
          <div className="border-b border-hat px-5 py-3">
            <p className="kicker">Referans sahnesi · dalgalanır, döner, hızlanır</p>
          </div>
          <div className="overflow-x-clip px-5 py-6">
            <Dev metin="Dalgalanır" efekt={['dalga']} boy="clamp(36px, 8vw, 110px)" ad="referans-dalga" />
          </div>
          <div className="grid grid-cols-[auto_1fr] items-center gap-6 border-y border-hat px-5 py-6">
            <DonenMetin />
            <p className="dev text-[clamp(28px,5vw,64px)]">
              <Harfler metin="Döner" efekt={['imlec']} ad="referans-doner" />
            </p>
          </div>
          <MarqueeText metin="Hızlanır — Hızlanır —" ayirac="" hiz={120} yon={-1} className="dev py-4 text-[clamp(30px,6vw,84px)] text-vurgu-yazi" ad="referans-serit" />
        </div>

        <ol className="lg:col-span-12" data-karakter="">
          {KARAKTER.map((k, i) => (
            <li key={k.ad} className="grid grid-cols-1 gap-x-8 gap-y-2 border-t border-hat py-6 md:grid-cols-12 md:items-baseline">
              <span className="rakam text-soluk md:col-span-1">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="dev text-[clamp(28px,4.6vw,64px)] md:col-span-6">
                <Harfler metin={k.ad} efekt={['imlec']} ad="karakter" />
              </h3>
              <p className="text-[18px] text-soluk md:col-span-4 md:col-start-9">{k.metin}</p>
            </li>
          ))}
        </ol>
      </div>
    </Bolum>
  )
}

/** Yol üzerinde dönen metin: harflerin kendi hatlarıyla oluşan halka */
export function DonenMetin({ boyut = 132, metin = 'DÖNER · DÖNER · DÖNER · ', sure = 16 }: { boyut?: number; metin?: string; sure?: number }) {
  return (
    <svg viewBox="-70 -70 140 140" width={boyut} height={boyut} className="max-w-[26vw] overflow-visible" role="presentation" aria-hidden="true" data-cizim="halka" style={{ ['--doner-sure' as string]: `${sure}s` }}>
      <g className="doner">
        <defs>
          <path id="halka-yol" d="M0 -52 A52 52 0 1 1 -0.01 -52" />
        </defs>
        <text fontFamily="var(--font-baslik)" fontWeight="800" fontSize="15" letterSpacing="1.2" fill="currentColor">
          <textPath href="#halka-yol" textLength="326" lengthAdjust="spacing">
            {metin}
          </textPath>
        </text>
      </g>
    </svg>
  )
}
