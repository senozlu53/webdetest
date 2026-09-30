import { Degisken } from '../components/Degisken'
import { Baglanti, Bolum, Kod, KENAR } from '../components/ui'
import { useVariable } from '../lib/store'

const PROMPT = 'Experimental variable typography, interactive font weight shifting on hover, avant-garde web design, chaotic letterforms, high contrast editorial layout.'

export function Hero() {
  const { kilitli } = useVariable()
  return (
    <section id="ust" aria-label="Giriş" className="relative">
      <div className={`${KENAR} pt-[clamp(24px,5vw,64px)] pb-[clamp(40px,6vw,88px)]`}>
        <p className="kicker">Sayı 35 · Değişken yazı dergisi · Typography-First</p>
        <div className="relative mt-4 grid" data-hero-katman="">
          <h1 className="m-0" style={{ gridArea: '1 / 1' }}>
            <Degisken metin="Büküm" boy="clamp(96px, 40vw, 600px)" k={0.66} ad="hero" />
          </h1>
          <p
            className="patlama-blok vk f-fra z-10 self-end justify-self-start px-[0.4em] py-[0.15em] text-[clamp(20px,3.6vw,52px)] leading-none max-[639px]:translate-y-[45%]"
            style={{ gridArea: '1 / 1', ['--wght' as string]: 300, ['--soft' as string]: 100, ['--wonk' as string]: 1, ['--opsz' as string]: 72 }}
            data-hero-etiket="1"
          >
            değişken yazı dergisi
          </p>
          <p
            className="z-10 self-start justify-self-end px-[0.5em] py-[0.25em] text-[clamp(13px,1.4vw,18px)] leading-none uppercase"
            style={{ gridArea: '1 / 1', background: 'var(--metin)', color: 'var(--zemin)', fontFamily: 'var(--font-rec)', fontVariationSettings: "'wght' 600, 'MONO' 1, 'CASL' 0", letterSpacing: '0.04em' }}
            data-hero-etiket="2"
          >
            {kilitli ? 'eksenler kilitli' : 'eksenler serbest'}
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 items-end gap-8 md:grid-cols-12">
          <p className="max-w-[40ch] text-[clamp(18px,1.6vw,23px)] md:col-span-5">Büküm, yazı tipini sabit bir biçim değil bir uzay sayan bağımsız bir tasarım dergisi. Harfler fareye yaklaştıkça şişer, uzaklaştıkça incelir; kalınlık, genişlik ve eğim tek tek büküm konusu.</p>
          <p className="kicker md:col-span-3 md:col-start-6">
            İmleci harflerin üstüne getirin{' '}
            <span className="glif" aria-hidden="true">
              ↑
            </span>
          </p>
          <div className="flex flex-wrap gap-3 md:col-span-4 md:justify-end">
            <Baglanti ton="patlama" href="#yazi" glif="↓">
              Eksenleri dene
            </Baglanti>
            <Baglanti href="#erisim">Hareketi ayarla</Baglanti>
          </div>
        </div>
      </div>
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
      baslik="Kuralsız hiyerarşi"
      vurgulu={[1]}
      lead="Deneysel tipografi, yazı tipini bir hazır şablon değil bir eksenler uzayı olarak kullanır. Başlık gövdeden büyük olmak zorunda değildir; biri ince ve dar, öbürü şişkin ve geniş olabilir. Tek kural: bükülen yalnız büyük başlıktır."
    >
      <div className={`${KENAR} grid grid-cols-1 gap-x-10 gap-y-16 lg:grid-cols-12`}>
        <dl className="grid grid-cols-1 gap-8 lg:col-span-5" data-stil-bilgi="">
          <div>
            <dt className="kicker">Madde 1 · Stil adı</dt>
            <dd className="mt-2 text-[clamp(22px,2.6vw,34px)]" style={{ fontFamily: 'var(--font-disp)', fontVariationSettings: "'wght' 800, 'wdth' 100, 'opsz' 40" }} lang="en">
              Experimental &amp; Variable Typography
            </dd>
          </div>
          <div>
            <dt className="kicker">Kategori</dt>
            <dd className="mt-2 text-[20px]">
              <span lang="en">Typography-First – Experimental Typography</span>
            </dd>
          </div>
          <div>
            <dt className="kicker">Madde 2 · Görsel referans</dt>
            <dd className="mt-2 text-[18px] text-soluk">Fare imlecine yaklaştıkça uzayan, şişen, incelen ya da garip formlar alan akışkan harf karakterleri.</dd>
          </div>
          <div>
            <dt className="kicker mb-3">Prompt</dt>
            <dd>
              <Kod label="Referans prompt">{PROMPT}</Kod>
            </dd>
          </div>
        </dl>

        <div className="grid grid-cols-12 content-start gap-x-4 gap-y-10 lg:col-span-7" data-karakter="">
          <div className="col-span-12 min-w-0">
            <Degisken metin="Sonuna kadar" boy="clamp(40px, 8vw, 118px)" ad="karakter-1" />
            <p className="mt-2 max-w-[44ch] text-[16px] text-soluk">Variable font teknolojisinin sonuna kadar kullanımı: on üç eksene kadar.</p>
          </div>
          <div className="col-span-7 min-w-0 sm:col-span-5 sm:col-start-2">
            <Degisken metin="kuralsız" aile="fra" boy="clamp(34px, 6vw, 88px)" ad="karakter-2" />
            <p className="mt-2 text-[16px] text-soluk">Kuralsız hiyerarşi: boy, ağırlık, aile.</p>
          </div>
          <div className="col-span-12 min-w-0 sm:col-span-6 sm:col-start-7">
            <Degisken metin="Deforme" aile="rec" boy="clamp(38px, 7vw, 100px)" ad="karakter-3" />
            <p className="mt-2 text-[16px] text-soluk">Deforme edilmiş harfler: uzatılmış, sıkıştırılmış, eğik.</p>
          </div>
          <div className="col-span-10 min-w-0 sm:col-span-6">
            <Degisken metin="deneysel" boy="clamp(36px, 6.4vw, 92px)" ad="karakter-4" />
            <p className="mt-2 text-[16px] text-soluk">Deneysel estetik: yüksek zıtlıkta editoryal yerleşim.</p>
          </div>
        </div>
      </div>
    </Bolum>
  )
}
