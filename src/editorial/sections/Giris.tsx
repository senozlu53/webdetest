import { useState } from 'react'
import { EditorialContainer, MultiColumnLayout, Bolum } from '../components/Editorial'
import { Buton, Kod, OkBaglanti } from '../components/ui'
import { ALINTI, ICINDEKILER, METIN, SAYI } from '../lib/data'

const PROMPT = 'Editorial typography web layout, strict grid system, Swiss style, massive clean headings, multi-column text, professional publishing aesthetic.'

export function Hero() {
  return (
    <section id="ust" aria-label="Kapak" className="pt-6">
      <EditorialContainer izgara={false}>
        <div className="t-etiket t-soluk flex flex-wrap justify-between gap-x-6 gap-y-1 border-b border-cizgi pb-3">
          <span>Mimarlık ve yayıncılık dergisi</span>
          <span>
            Sayı <span className="rakam">{SAYI.no}</span> · {SAYI.donem}
          </span>
          <span className="rakam">{SAYI.tarih}</span>
          <span>Çevrimiçi baskı</span>
        </div>
        <div className="masthead-sig mt-6 mb-3 pt-3">
          <p className="masthead" data-masthead="" aria-label="Kolon">
            Kolon
          </p>
        </div>
        <div className="kural-cift" aria-hidden="true" />
      </EditorialContainer>

      <EditorialContainer className="mt-10 gap-y-10">
        <div className="col-span-4 md:col-span-3" data-kol="1">
          <p className="t-etiket border-b border-metin pb-3">Bu sayıda</p>
          <ol data-icindekiler="">
            {ICINDEKILER.map((i) => (
              <li key={i.no} className="border-b border-cizgi">
                <a href="#stil" className="grid min-h-12 grid-cols-[2rem_1fr_auto] items-baseline gap-x-2 py-3 no-underline">
                  <span className="rakam t-alt">{i.no}</span>
                  <span className="text-[1.0625rem] leading-snug">{i.baslik}</span>
                  <span className="rakam t-alt">{i.sayfa}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
        <div className="col-span-4 md:col-span-9">
          <p className="t-etiket t-soluk mb-5" data-kol="4">
            Kapak yazısı · Tasarım
          </p>
          <h1 className="t-display" data-kol="4">
            Izgara bir kafes değildir
          </h1>
        </div>
        <div className="col-span-4 md:col-span-6 md:col-start-4" data-kol="4">
          <p className="t-dek max-w-[38ch]">Bir grid, öğeleri hapseden bir kafes değil, aralarındaki mesafeyi ölçen bir cetveldir. Bu sayı, metnin dekor değil mimari olduğu bir sayfanın nasıl kurulduğunu on iki kolonda anlatıyor.</p>
          <p className="t-alt mt-6 flex flex-wrap gap-x-6 gap-y-1">
            <span>Kaan Ünal</span>
            <span className="rakam">11 dk okuma</span>
          </p>
          <OkBaglanti href="#stil" className="mt-4">
            Devamını oku
          </OkBaglanti>
        </div>
        <aside className="col-span-4 border-t border-metin pt-4 md:col-span-3 md:col-start-10" data-kol="10" aria-label="Kısa not">
          <p className="t-etiket t-soluk">Editörden</p>
          <p className="t-govde mt-3 text-[1rem]">Yüz yirmi sayfalık bu sayıda yalnız iki rengi ve iki yazı tipini kullandık. Geri kalanı boşluk.</p>
        </aside>
      </EditorialContainer>
    </section>
  )
}

/* ───────────── Madde 1 · 2 · 3 ───────────── */

interface Hizalama {
  n: number
  maks: number
  kolon: number
}
/** Etiketli (data-kol) öğelerin sol kenarı en yakın kolon çizgisine ne kadar uzak? Ölçülür, tahmin edilmez. */
export function hizalamaOlc(): Hizalama {
  const izgara = document.querySelector<HTMLElement>('[data-bolum] .g')
  if (!izgara) return { n: 0, maks: 0, kolon: 0 }
  const s = getComputedStyle(izgara)
  const kutu = izgara.getBoundingClientRect()
  const sol = kutu.left + parseFloat(s.paddingLeft)
  const genis = kutu.width - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight)
  const kolon = s.gridTemplateColumns.split(' ').length
  const bosluk = parseFloat(s.columnGap) || 0
  const kw = (genis - bosluk * (kolon - 1)) / kolon
  let maks = 0
  const els = document.querySelectorAll<HTMLElement>('[data-kol]')
  els.forEach((e) => {
    const l = e.getBoundingClientRect().left
    const idx = Math.max(0, Math.min(kolon - 1, Math.round((l - sol) / (kw + bosluk))))
    maks = Math.max(maks, Math.abs(l - (sol + idx * (kw + bosluk))))
  })
  return { n: els.length, maks: Math.round(maks * 100) / 100, kolon }
}

const KARAKTER = [
  ['Kusursuz grid hizalaması', 'Her başlık, giriş ve not bir kolon çizgisinde başlar. Sayfa sağa sola kaymaz.'],
  ['Devasa negatif boşluklar', 'Bölümler arası 96 ile 200 piksel; boşluk süs değil, ayraçtır.'],
  ['Editoryal okunabilirlik', 'Gövde metni satır başına en çok 70 karakter, satır yüksekliği 1,625.'],
  ['Klasik ve zamansız yapı', 'İki yazı ailesi, iki çizgi kalınlığı, sıfır gölge.'],
] as const

export function Stil() {
  const [h, setH] = useState<Hizalama | null>(null)
  return (
    <Bolum
      id="stil"
      no="01"
      madde="Madde 1 · 2 · 3"
      baslik="Metin bir grid elemanıdır"
      lead="Metin burada okunacak bir araç olmanın ötesinde, sayfanın taşıyıcı elemanıdır: başlık kolon çizgisine oturur, gövde ölçüye, boşluk ritme."
      not="* Bu sayfanın kendisi de bir dergi sayısıdır. Kolon adlı kurgusal yayının otuz altıncı sayısı, stilin kurallarını kendi düzeniyle gösterir."
    >
      <EditorialContainer className="gap-y-16">
        <dl className="col-span-4 md:col-span-3" data-stil-bilgi="" data-kol="1">
          <div className="border-t border-metin pt-3">
            <dt className="t-etiket t-soluk">Madde 1 · Stil adı</dt>
            <dd className="t-h3 mt-2 mb-6" lang="en">
              Editorial &amp; Swiss Typography
            </dd>
          </div>
          <div className="border-t border-cizgi pt-3">
            <dt className="t-etiket t-soluk">Kategori</dt>
            <dd className="mt-2 mb-6 text-[1.0625rem] leading-snug" lang="en">
              Typography-First – Editorial &amp; Swiss Typography
            </dd>
          </div>
          <div className="border-t border-cizgi pt-3">
            <dt className="t-etiket t-soluk">Madde 3 · Karakter</dt>
            <dd className="mt-2">
              <ol className="grid gap-4">
                {KARAKTER.map(([a, b], i) => (
                  <li key={a} className="grid grid-cols-[1.5rem_1fr] gap-x-2">
                    <span className="rakam t-alt">{i + 1}</span>
                    <span>
                      <span className="block font-semibold leading-snug">{a}</span>
                      <span className="t-alt mt-1 block">{b}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </dd>
          </div>
        </dl>

        <div className="col-span-4 md:col-span-9" data-kol="4" data-karakter="">
          <MultiColumnLayout sutun={3} ilkHarf>
            <p>{METIN[0]}</p>
            <p>{METIN[1]}</p>
            <p>{METIN[2]}</p>
            <blockquote className="alinti">{ALINTI}</blockquote>
            <p>{METIN[3]}</p>
            <p>{METIN[4]}</p>
            <p>{METIN[5]}</p>
          </MultiColumnLayout>
        </div>

        <div className="col-span-4 md:col-span-6 md:col-start-4" data-kol="4">
          <p className="t-etiket t-soluk border-t border-metin pt-3">Madde 2 · Görsel referans</p>
          <p className="t-dek mt-3">Kusursuz dikey ve yatay çizgilerle bölünmüş sayfa, büyük siyah başlıklar, soluk gri alt metinler ve mükemmel hizalanmış sütunlar.</p>
          <p className="t-etiket t-soluk mt-8">Prompt</p>
          <Kod label="Referans prompt" className="mt-2">
            {PROMPT}
          </Kod>
        </div>

        <div className="col-span-4 border-t border-metin pt-3 md:col-span-3 md:col-start-10" data-kol="10" data-hizalama-kutu="">
          <p className="t-etiket t-soluk">Hizalama denetimi</p>
          <p className="rakam mt-3 text-[2.5rem] leading-none" data-hizalama={h ? `${h.n}|${h.maks}|${h.kolon}` : ''}>
            {h ? `${h.maks.toFixed(2).replace('.', ',')} px` : '—'}
          </p>
          <p className="t-alt mt-2" aria-live="polite">
            {h ? `${h.n} öğenin sol kenarı, ${h.kolon} kolonluk ızgaranın en yakın çizgisinden en çok bu kadar sapıyor.` : 'Etiketli öğelerin sol kenarı kolon çizgisinden ne kadar uzak?'}
          </p>
          <Buton ton="dolu" ikon="ok-sag" className="mt-4" onClick={() => setH(hizalamaOlc())} data-hizala="">
            Hizalamayı ölç
          </Buton>
        </div>
      </EditorialContainer>
    </Bolum>
  )
}
