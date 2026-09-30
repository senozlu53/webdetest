import { Bolum } from '../components/Bolum'
import { useOlc, useSay } from '../components/hooks'
import { SlantedLink } from '../components/Dugme'
import { Ikon } from '../components/Ikon'
import { EsportsCard } from '../components/Kart'
import { Kod } from '../components/ui'
import type { IkonAd } from '../lib/data'

const PROMPT = 'Esports gaming website UI, aggressive angled panels, carbon fiber texture, electric neon blue and lime green, futuristic competitive HUD, dark dynamic layout.'

export function Hero() {
  return (
    <section id="ust" aria-label="Kapak" className="hero" data-hero="">
      <div className="kap pt-[clamp(40px,6vw,88px)] pb-[clamp(56px,7vw,110px)]">
        <p className="t-etiket">
          Vektör Kupası · <span className="rakam">21–23 Kasım 2026</span>
        </p>
        <h1 className="baslik-hiz mt-5">
          Rekabet
          <br />
          <span className="egim-blok">
            <span>hızlanıyor</span>
          </span>
        </h1>
        <p className="hero-alt mt-6">Sekiz takım · üç gün · tek kupa</p>
        <div className="mt-10 grid grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="lead mt-6 max-w-[52ch]">Kesik köşeli paneller, karbon fiber zemin ve neon şeritler: maçı canlı izle, skor tablosunu kovala, takvimi kaçırma. Sıra, hızın kendisinde.</p>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-5">
              <SlantedLink href="#bilesenler" ton="birincil" ok data-maci-izle="">
                Maçı izle
              </SlantedLink>
              <SlantedLink href="#alanlar" ton="ikincil">
                Kadroyu gör
              </SlantedLink>
            </div>
          </div>
          <EsportsCard vurgu="turuncu" as="aside" aria-label="Canlı maç kartı" className="p-6" sarmal="lg:col-span-5 lg:self-start" data-canli-kart="">
            <div className="flex items-center justify-between gap-3">
              <span className="canli-rozet">
                <span className="canli-nokta" aria-hidden="true" />
                Canlı
              </span>
              <p className="t-etiket t-soluk">Grup · Bo3</p>
            </div>
            <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
              <div className="min-w-0">
                <p className="t-h3 break-words !text-[1.125rem]">Vektör-9</p>
                <p className="t-etiket t-soluk mt-1">İstanbul</p>
              </div>
              <p className="rakam bg-[#f2f6fa] px-4 py-1 text-[2rem] font-black text-[#0d0e12]" aria-label="Skor 1–1">
                1–1
              </p>
              <div className="min-w-0">
                <p className="t-h3 break-words !text-[1.125rem]">Gölge Hattı</p>
                <p className="t-etiket t-soluk mt-1">Adana</p>
              </div>
            </div>
            <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
              {[
                ['Raunt', '9 / 16'],
                ['Harita', 'Sektör 7'],
                ['İzleyici', '18,4B'],
              ].map(([a, b]) => (
                <div key={a}>
                  <dt className="t-etiket t-soluk">{a}</dt>
                  <dd className="rakam m-0 mt-1 text-[1.0625rem] font-bold">{b}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <SlantedLink href="#bilesenler" dar ton="turuncu" ok>
                Yayına git
              </SlantedLink>
              <span className="t-alt">İkinci harita başladı</span>
            </div>
          </EsportsCard>
        </div>
      </div>
    </section>
  )
}

/* ───────── Madde 1 · 2 · 3 ───────── */

export function Stil() {
  const kesik = useOlc(() => [...document.querySelectorAll('main *')].filter((e) => getComputedStyle(e).clipPath !== 'none').length, [], 0)
  const karbon = useSay('.kart[data-yuzey=karbon]')
  const sure = useOlc(
    () =>
      getComputedStyle(document.querySelector('.bt') ?? document.body)
        .getPropertyValue('--bt-sure')
        .trim() || '260ms',
    [],
    '260ms',
  )
  const ozellik: { ikon: IkonAd; baslik: string; metin: string; kanit: string }[] = [
    { ikon: 'nisangah', baslik: 'Keskin asimetrik açılar', metin: 'Paneller 45 derece kesik ya da eğik kenarlıdır; düğmeler ve sekmeler paralelkenardır.', kanit: `${kesik} kesik öğe` },
    { ikon: 'islemci', baslik: 'Karbon fiber dokular', metin: 'Çapraz örgü tek bir SVG karosudur; zemin, kart ve başlıkta tekrar eder.', kanit: `${karbon} karbon yüzey` },
    { ikon: 'simsek', baslik: 'Yüksek hız hissi', metin: 'Kayan skor şeridi, sağa akan neon dilim ve hızlı geçişler; hepsi durdurulabilir.', kanit: `${sure} kayan dilim` },
    { ikon: 'fuze', baslik: 'Agresif renk çiftleri', metin: 'Karbon siyahı üstünde elektrik mavisi, neon lime ve turuncu; her seferinde biri vurgudur.', kanit: '3 vurgu · 1 zemin' },
  ]
  return (
    <Bolum id="stil" no="01" madde="Madde 1 · 2 · 3 · Stil, referans, karakter" baslik="Turnuva künyesi" lead="Asimetrik kesimli keskin paneller, karbon fiber zeminler, elektrik mavisi ve zehir yeşili neon şeritler, agresif tipografi: modern oyuncu estetiği ve rekabetçi turnuva hissi.">
      <div className="grid grid-cols-1 gap-x-10 gap-y-12 lg:grid-cols-12">
        <EsportsCard as="article" className="p-7" sarmal="lg:col-span-6" data-stil-bilgi="">
          <p className="t-etiket t-soluk">Künye</p>
          <dl className="mt-4 grid gap-5">
            <div>
              <dt className="t-etiket t-soluk">Madde 1 · Stil adı</dt>
              <dd className="t-h3 m-0 mt-1" lang="en">
                Esports &amp; Sci-Fi Gaming
              </dd>
            </div>
            <div>
              <dt className="t-etiket t-soluk">Kategori</dt>
              <dd className="m-0 mt-1 text-[1.1875rem]" lang="en">
                Gaming / Fantasy – Esports / Sci-Fi Gaming
              </dd>
            </div>
            <div>
              <dt className="t-etiket t-soluk">Madde 2 · Görsel referans</dt>
              <dd className="m-0 mt-1 text-[1.1875rem]">Asimetrik kesimli keskin paneller, karbon fiber zeminler, elektrik mavisi ve zehir yeşili neon şeritler, agresif tipografi.</dd>
            </div>
            <div>
              <dt className="t-etiket t-soluk">Prompt</dt>
              <dd className="m-0 mt-2">
                <Kod label="Referans prompt">{PROMPT}</Kod>
              </dd>
            </div>
          </dl>
        </EsportsCard>
        <div className="grid grid-cols-1 content-start gap-6 lg:col-span-6" data-ozellikler="">
          {ozellik.map((o, i) => (
            <EsportsCard key={o.baslik} kesim="egik" vurgu={i % 2 ? 'lime' : 'mavi'} as="section" aria-label={o.baslik} className="p-5">
              <div className="flex items-start gap-4">
                <span className="mt-1 text-[color:var(--vurgu-yazi)]">
                  <Ikon ad={o.ikon} boy={44} />
                </span>
                <div className="min-w-0">
                  <p className="t-etiket t-soluk">Madde 3 · Karakter</p>
                  <h3 className="t-h3 mt-1 !text-[1.25rem]">{o.baslik}</h3>
                  <p className="mt-2 text-[1.125rem]">{o.metin}</p>
                  <p className="rakam t-etiket yazi-vurgu mt-3" data-kanit="">
                    Kanıt: {o.kanit}
                  </p>
                </div>
              </div>
            </EsportsCard>
          ))}
        </div>
      </div>
    </Bolum>
  )
}
