import { Bolum } from '../components/Bolum'
import { HealthBar } from '../components/Bar'
import { useSay } from '../components/hooks'
import { Ikon } from '../components/Ikon'
import { Ayrac, Madalyon, Panel } from '../components/Suslu'
import { Baglanti, Buton, Kod } from '../components/ui'
import { useOyun } from '../lib/oyun'
import type { IkonAd } from '../lib/data'

const PROMPT = 'MMORPG fantasy game UI, ornate gold borders, dark stone background, parchment texture, magic health bars, inventory grid panel, epic RPG aesthetic.'

export function Hero() {
  const { k, setGorevAcik } = useOyun()
  return (
    <section id="ust" aria-label="Kapak" className="hero" data-hero="">
      <div className="kap grid grid-cols-1 gap-x-12 gap-y-12 pt-[clamp(40px,6vw,88px)] pb-[clamp(56px,7vw,110px)] lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="t-etiket t-soluk">
            Külbaşı Stüdyo sunar · MMORPG · <span className="rakam">21 Kasım 2026</span>
          </p>
          <h1 className="baslik-altin hero-baslik mt-5">Kadim Diyar</h1>
          <p className="hero-alt mt-3">Ejderha Çağı başlıyor</p>
          <Ayrac className="mt-6" />
          <p className="lead mt-6 max-w-[52ch]">Yüz oyunculuk baskınlar, lonca savaşları ve dört elementin dengesi. Parşömenleri aç, sandıkları kır, envanterini doldur; krallığın kaderi senin yükünde.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Buton ton="altin" ikon="kilic" onClick={() => setGorevAcik(true)} data-maceraya-basla="">
              Maceraya başla
            </Buton>
            <Baglanti href="#alanlar" ikon="kalkan">
              Sınıfını seç
            </Baglanti>
          </div>
        </div>
        <Panel yuzey="tas" className="p-6 lg:col-span-5 lg:self-start" data-karakter-karti="" aria-label="Kahraman kartı" as="aside">
          <div className="flex items-center gap-5">
            <Madalyon ikon="migfer" boy={88} />
            <div className="min-w-0">
              <p className="t-etiket t-soluk">Kahraman</p>
              <p className="t-h3 mt-1 break-words">{k.ad}</p>
              <p className="rakam t-alt mt-1">Seviye {k.seviye} · Şövalye</p>
            </div>
          </div>
          <div className="mt-6 grid gap-4">
            <HealthBar deger={k.can} azami={k.canAzami} tur="can" />
            <HealthBar deger={k.mana} azami={k.manaAzami} tur="mana" />
            <HealthBar deger={k.xp} azami={k.xpAzami} tur="deneyim" etiket="Deneyim" />
          </div>
          <ul className="mt-6 flex items-center gap-3" aria-label="Element hakimiyeti">
            {(
              [
                ['ates', 'Ateş'],
                ['su', 'Su'],
                ['toprak', 'Toprak'],
                ['yildirim', 'Yıldırım'],
              ] as [IkonAd, string][]
            ).map(([a, ad]) => (
              <li key={a} title={ad} className="element-cip">
                <Ikon ad={a} boy={36} baslik={ad} />
              </li>
            ))}
            <li className="rakam t-alt ml-auto">
              <Ikon ad="altin" boy={20} className="mr-1 inline align-[-4px]" />
              {k.altin.toLocaleString('tr-TR')}
            </li>
          </ul>
        </Panel>
      </div>
    </section>
  )
}

/* ───────── Madde 1 · 2 · 3 ───────── */

export function Stil() {
  const kose = useSay('.suslu-kose')
  const panel = useSay('.panel')
  const slot = useSay('[data-yuva]')
  const doku = 5
  const basarim: { ikon: IkonAd; baslik: string; metin: string; kanit: string }[] = [
    { ikon: 'kalkan', baslik: 'Dekoratif altın işlemeler', metin: 'Her panel altın gradyan kenar, iç ince çizgi ve dört köşede filigree taşır.', kanit: `${kose} filigree köşesi` },
    { ikon: 'toprak', baslik: 'Dokusal derinlik', metin: 'Taş, parşömen, deri, ahşap ve fırçalanmış metal; hepsi SVG gürültüsüyle, görsel dosyası olmadan.', kanit: `${doku} doku, ${panel} panel` },
    { ikon: 'sandik', baslik: 'Envanter sistemleri', metin: 'Izgara yuvalar, nadirlik renkleri, sürükle-bırak ve klavyeyle taşıma.', kanit: `${slot} envanter yuvası` },
    { ikon: 'ates', baslik: 'Epik ve masalsı hava', metin: 'Altın parlama, kıvılcım parçacıkları, parşömen açılışı ve sandık ışığı.', kanit: 'canlı efektler' },
  ]
  return (
    <Bolum id="stil" no="01" madde="Madde 1 · 2 · 3 · Stil, referans, karakter" baslik="Görev günlüğü" lead="Büyü, orta çağ, zindanlar ve epik maceralardan ilham alan bir arayüz: parşömenler, altın işlemeler, taş dokular ve envanter panelleriyle örülü.">
      <div className="grid grid-cols-1 gap-x-10 gap-y-12 lg:grid-cols-12">
        <Panel yuzey="parsomen" className="p-7 lg:col-span-6" data-stil-bilgi="" as="article">
          <p className="t-etiket t-soluk">Görev · Stil künyesi</p>
          <dl className="mt-4 grid gap-5">
            <div>
              <dt className="t-etiket t-soluk">Madde 1 · Stil adı</dt>
              <dd className="t-h3 mt-1 m-0" lang="en">
                MMORPG / Fantasy UI
              </dd>
            </div>
            <div>
              <dt className="t-etiket t-soluk">Kategori</dt>
              <dd className="mt-1 m-0 text-[1.125rem]" lang="en">
                Gaming / Fantasy – MMORPG / Fantasy
              </dd>
            </div>
            <div>
              <dt className="t-etiket t-soluk">Madde 2 · Görsel referans</dt>
              <dd className="mt-1 m-0 text-[1.125rem]">İşlemeli altın çerçeveler, koyu taş zeminler, parşömen dokuları, iksir şişelerini andıran sağlık ve mana çubukları ve büyülü parlamalar.</dd>
            </div>
            <div>
              <dt className="t-etiket t-soluk">Prompt</dt>
              <dd className="mt-2 m-0">
                <Kod label="Referans prompt">{PROMPT}</Kod>
              </dd>
            </div>
          </dl>
        </Panel>
        <div className="grid content-start gap-6 lg:col-span-6" data-basarimlar="">
          {basarim.map((b) => (
            <Panel key={b.baslik} yuzey="tas" suslu={false} className="p-5" as="section" aria-label={b.baslik}>
              <div className="flex items-start gap-4">
                <Ikon ad={b.ikon} boy={48} />
                <div className="min-w-0">
                  <p className="t-etiket t-soluk">Madde 3 · Karakter</p>
                  <h3 className="t-h3 mt-1 !text-[1.25rem]">{b.baslik}</h3>
                  <p className="mt-2 text-[1.0625rem]">{b.metin}</p>
                  <p className="rakam t-etiket yazi-altin mt-3" data-kanit="">
                    Kanıt: {b.kanit}
                  </p>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      </div>
    </Bolum>
  )
}
