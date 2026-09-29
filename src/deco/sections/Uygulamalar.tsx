import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { cx } from '../../shared/cx'
import { useDeco } from '../lib/store'
import { Cerceve } from '../components/Cerceve'
import { GoldBorderButton } from '../components/Dugme'
import { Ikon } from '../components/Ikon'
import { Ayirac, Sunburst } from '../components/Ornament'
import { Anahtar, Onay, Section, Secim } from '../components/ui'
import type { SimgeAd } from '../lib/simge'

const tl = (n: number) => `${Math.round(n).toLocaleString('tr-TR')} TL`

/* ───────────────────────── Konaklama ───────────────────────── */

const ODALAR = [
  { id: 'deluxe', ad: 'Deluxe Oda', m2: 42, fiyat: 8400, not: 'Kadife yatak başı, mermer banyo, şehir manzarası', ikon: 'kapi' as SimgeAd },
  { id: 'suit', ad: 'Art Deco Süit', m2: 78, fiyat: 14500, not: 'Ayrı salon, yelpaze tavan, altın armatürler', ikon: 'avize' as SimgeAd },
  { id: 'penthouse', ad: 'Penthouse', m2: 210, fiyat: 32000, not: 'Teras, özel butler, boğaz manzaralı çatı katı', ikon: 'tac' as SimgeAd },
] as const
type OdaId = (typeof ODALAR)[number]['id']

const gunFarki = (a: string, b: string) => Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000)

/** Madde 10 · 11: lüks otel rezervasyonu */
export function Rezervasyon() {
  const { duyur } = useDeco()
  const [giris, setGiris] = useState('2026-10-16')
  const [cikis, setCikis] = useState('2026-10-19')
  const [misafir, setMisafir] = useState(2)
  const [oda, setOda] = useState<OdaId>('deluxe')
  const [ad, setAd] = useState('')
  const [eposta, setEposta] = useState('')
  const [hata, setHata] = useState<Record<string, string>>({})
  const [sonuc, setSonuc] = useState('')
  const refs = { ad: useRef<HTMLInputElement>(null), eposta: useRef<HTMLInputElement>(null), cikis: useRef<HTMLInputElement>(null), giris: useRef<HTMLInputElement>(null) }
  const secili = ODALAR.find((o) => o.id === oda)!
  const gece = gunFarki(giris, cikis)
  const konaklama = gece > 0 ? gece * secili.fiyat : 0
  const hizmet = konaklama * 0.1
  const toplam = konaklama + hizmet
  const gonder = (e: FormEvent) => {
    e.preventDefault()
    const h: Record<string, string> = {}
    if (!giris) h.giris = 'Varış tarihini seçin.'
    if (!cikis) h.cikis = 'Ayrılış tarihini seçin.'
    else if (giris && gece < 1) h.cikis = 'Ayrılış, varıştan en az bir gün sonra olmalı.'
    if (ad.trim().length < 3) h.ad = ad.trim() ? 'Adınızı ve soyadınızı eksiksiz yazın.' : 'Misafir adı gerekli.'
    if (!/^\S+@\S+\.\S+$/.test(eposta)) h.eposta = eposta ? 'E-posta adresi geçersiz: örnek ad@alanadi.com' : 'E-posta gerekli.'
    setHata(h)
    setSonuc('')
    const ilk = (['giris', 'cikis', 'ad', 'eposta'] as const).find((k) => h[k])
    if (ilk) {
      refs[ilk].current?.focus()
      return
    }
    const m = `Talebiniz alındı, ${ad.trim()}. ${gece} gece, ${secili.ad}, ${misafir} misafir. Toplam ${tl(toplam)}.`
    setSonuc(m)
    duyur(m)
  }
  const alanHata = (k: string) => (hata[k] ? { 'aria-invalid': true as const, 'aria-describedby': `rez-${k}-h` } : {})
  const H = ({ k }: { k: string }) =>
    hata[k] ? (
      <p id={`rez-${k}-h`} role="alert" className="mt-1.5 text-left text-[16px] font-semibold text-altin-parlak">
        {hata[k]}
      </p>
    ) : null
  return (
    <Section
      id="rezervasyon"
      madde="Madde 10 · Lüks otel"
      title={
        <>
          <span lang="en">Aurelia Palas</span>, konaklama
        </>
      }
      lead="Merkezde tek bir eksen: önce oda, sonra tarih, sonra misafir. Fiyat, seçtikçe altın çerçeveli özette güncellenir. Tüm fiyatlar ve oteller kurgudur."
    >
      <ul className="m-0 grid list-none grid-cols-1 gap-8 p-0 md:grid-cols-3" data-odalar="">
        {ODALAR.map((o) => {
          const on = oda === o.id
          return (
            <li key={o.id} className="grid grid-cols-1">
              <button type="button" onClick={() => setOda(o.id)} aria-pressed={on} data-oda={o.id} className="relative isolate flex flex-col items-center bg-yuzey px-6 py-10 text-center">
                <Cerceve kat={on ? 3 : 1} stil="basamak" k={12} aralik={7} />
                <Ikon ad={o.ikon} boyut={48} />
                <span className="mt-4 font-baslik text-[20px] tracking-[0.16em] text-altin-yazi uppercase">{o.ad}</span>
                <span className="mt-1 font-mono text-[13px] text-soluk">{o.m2} m²</span>
                <Ayirac className="my-4 max-w-[140px]" baklava={6} />
                <span className="text-[16px] text-soluk">{o.not}</span>
                <span className="rakam mt-5 text-[30px] text-metin">{tl(o.fiyat)}</span>
                <span className="kicker !text-[11px]">gecelik</span>
                <span className={cx('mt-4 inline-flex items-center gap-2.5 font-baslik text-[12px] font-bold tracking-[0.24em] uppercase', on ? 'text-altin-yazi' : 'text-soluk')}>
                  {on ? <i className="block size-[7px] rotate-45 bg-altin-cizgi" aria-hidden="true" /> : null}
                  {on ? 'SEÇİLİ' : 'SEÇMEK İÇİN DOKUN'}
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      <div className="mx-auto mt-16 grid max-w-[980px] grid-cols-1 items-start gap-10 lg:grid-cols-[1.25fr_1fr]">
        <form onSubmit={gonder} noValidate className="relative isolate grid grid-cols-1 gap-6 bg-yuzey p-6 md:p-10" data-rez-form="" aria-label="Rezervasyon formu">
          <Cerceve kat={2} stil="pah" k={14} aralik={8} />
          <h3 className="text-[clamp(20px,2.4vw,26px)]">Tarih ve misafir</h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="text-left">
              <label htmlFor="rez-giris" className="etiket mb-2 block !text-metin">
                Varış
              </label>
              <input ref={refs.giris} id="rez-giris" type="date" className="alan" value={giris} onChange={(e) => setGiris(e.target.value)} {...alanHata('giris')} />
              <H k="giris" />
            </div>
            <div className="text-left">
              <label htmlFor="rez-cikis" className="etiket mb-2 block !text-metin">
                Ayrılış
              </label>
              <input ref={refs.cikis} id="rez-cikis" type="date" className="alan" value={cikis} min={giris} onChange={(e) => setCikis(e.target.value)} {...alanHata('cikis')} />
              <H k="cikis" />
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-5" role="group" aria-label="Misafir sayısı">
            <span className="etiket !text-metin">Misafir</span>
            <GoldBorderButton boy="k" className="!min-w-12 !px-0 !text-[22px]" aria-label="Misafir azalt" onClick={() => setMisafir((m) => Math.max(1, m - 1))} disabled={misafir <= 1}>
              −
            </GoldBorderButton>
            <span className="rakam min-w-[2ch] text-center text-[34px] text-altin-yazi" data-misafir={misafir} aria-live="polite">
              {misafir}
            </span>
            <GoldBorderButton boy="k" className="!min-w-12 !px-0 !text-[22px]" aria-label="Misafir artır" onClick={() => setMisafir((m) => Math.min(4, m + 1))} disabled={misafir >= 4}>
              +
            </GoldBorderButton>
          </div>
          <Ayirac baklava={7} />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="text-left">
              <label htmlFor="rez-ad" className="etiket mb-2 block !text-metin">
                Ad soyad
              </label>
              <input ref={refs.ad} id="rez-ad" className="alan" value={ad} onChange={(e) => setAd(e.target.value)} autoComplete="name" placeholder="Leyla Aksoy" {...alanHata('ad')} />
              <H k="ad" />
            </div>
            <div className="text-left">
              <label htmlFor="rez-eposta" className="etiket mb-2 block !text-metin">
                E-posta
              </label>
              <input ref={refs.eposta} id="rez-eposta" type="email" className="alan" value={eposta} onChange={(e) => setEposta(e.target.value)} autoComplete="email" placeholder="ad@alanadi.com" {...alanHata('eposta')} />
              <H k="eposta" />
            </div>
          </div>
          <div>
            <GoldBorderButton ana boy="b" type="submit">
              Rezervasyon iste
            </GoldBorderButton>
          </div>
          {sonuc ? (
            <p className="border border-altin-cizgi px-5 py-4 text-[17px] text-metin" data-rez-sonuc="" role="status">
              {sonuc}
            </p>
          ) : null}
        </form>
        <aside className="relative isolate bg-yuzey p-6 text-center md:p-8" aria-label="Rezervasyon özeti" data-rez-ozet="">
          <Cerceve kat={2} stil="basamak" k={12} aralik={8} />
          <p className="kicker">Özet</p>
          <Ayirac className="my-4" baklava={7} />
          <p className="font-baslik text-[20px] tracking-[0.16em] text-altin-yazi uppercase">{secili.ad}</p>
          <dl className="mx-auto mt-5 grid max-w-[280px] grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-left text-[16px]">
            <dt className="text-soluk">Gece</dt>
            <dd className="m-0 text-right tabular-nums" data-gece={gece > 0 ? gece : 0}>
              {gece > 0 ? gece : '—'}
            </dd>
            <dt className="text-soluk">Konaklama</dt>
            <dd className="m-0 text-right tabular-nums">{tl(konaklama)}</dd>
            <dt className="text-soluk">Hizmet %10</dt>
            <dd className="m-0 text-right tabular-nums">{tl(hizmet)}</dd>
          </dl>
          <Ayirac className="my-5" baklava={6} />
          <p className="kicker !text-[11px]">Toplam</p>
          <p className="rakam mt-1 text-[clamp(34px,4vw,44px)] text-altin-yazi" data-toplam={Math.round(toplam)}>
            {tl(toplam)}
          </p>
          <p className="mt-3 text-[15px] text-soluk">Kahvaltı ve karşılama şampanyası dahil.</p>
        </aside>
      </div>
    </Section>
  )
}

/* ───────────────────────── Menü ───────────────────────── */

type MenuTur = 'aksam' | 'sabah'
const MENU: Record<MenuTur, { baslik: string; ikon: SimgeAd; ogeler: { ad: string; not: string; fiyat: number; lang?: string }[] }[]> = {
  aksam: [
    {
      baslik: 'Başlangıç',
      ikon: 'kadeh',
      ogeler: [
        { ad: 'Osetra havyar', not: 'yaban mersinli krep, ekşi krema', fiyat: 3600 },
        { ad: 'Trüf sufle', not: 'karamelize soğan, parmesan köpüğü', fiyat: 980 },
      ],
    },
    {
      baslik: 'Ana yemek',
      ikon: 'klos',
      ogeler: [
        { ad: 'Dana fileto Rossini', lang: 'it', not: 'kaz ciğeri, madeira sosu', fiyat: 2450 },
        { ad: 'Fırın levrek', not: 'safran beurre blanc, kuşkonmaz', fiyat: 1850 },
      ],
    },
    {
      baslik: 'Tatlı',
      ikon: 'elmas',
      ogeler: [
        { ad: 'Altın varaklı çikolata', not: 'Valrhona 70%, fındık pralin', fiyat: 720 },
        { ad: 'Vanilya milföy', not: 'Tahiti vanilyası, taze çilek', fiyat: 640 },
      ],
    },
  ],
  sabah: [
    {
      baslik: 'Fransız',
      ikon: 'sarap',
      ogeler: [
        { ad: 'Kruvasan tabağı', not: 'tereyağı, üç reçel', fiyat: 420 },
        { ad: 'Poşe yumurta', not: 'hollandez, ıspanak', fiyat: 560 },
      ],
    },
    {
      baslik: 'Türk',
      ikon: 'vazo',
      ogeler: [
        { ad: 'Saray kahvaltısı', not: 'kaymak, süzme bal, sucuklu yumurta', fiyat: 780 },
        { ad: 'Menemen', not: 'köy yumurtası, kuru biber', fiyat: 390 },
      ],
    },
    {
      baslik: 'Tatlı',
      ikon: 'inci',
      ogeler: [
        { ad: 'Altın pankek', not: 'akçaağaç, tereyağı', fiyat: 460 },
        { ad: 'Mevsim meyvesi', not: 'nane, limon şerbeti', fiyat: 340 },
      ],
    },
  ],
}

/** Madde 11: dikey çizgilerle ayrılmış lüks menü */
export function Menu() {
  const [tur, setTur] = useState<MenuTur>('aksam')
  const [esles, setEsles] = useState(false)
  return (
    <Section id="menu" madde="Madde 10 · 11 · Restoran" title="Salon Doré, menü" lead="Üç sütun, ikisi dikey altın çizgiyle ayrılır; küçük ekranda çizgiler yatay ayraca döner. Her sütunun başında bir ikon, her yemeğin yanında Bodoni rakamı.">
      <div className="mb-12 flex flex-wrap items-end justify-center gap-x-10 gap-y-6">
        <Secim<MenuTur>
          legend="Menü"
          name="menu-tur"
          value={tur}
          onChange={setTur}
          options={[
            { id: 'aksam', ad: 'Akşam yemeği' },
            { id: 'sabah', ad: 'Kahvaltı' },
          ]}
        />
        <Anahtar label="Şarap eşleştirmesi" checked={esles} onChange={setEsles} />
      </div>
      <div className="relative isolate mx-auto max-w-[1080px] bg-yuzey px-4 py-12 md:px-8" data-menu={tur}>
        <Cerceve kat={2} stil="basamak" k={14} aralik={9} />
        <div className="grid grid-cols-1 md:grid-cols-3">
          {MENU[tur].map((s, i) => (
            <div key={s.baslik} className={cx('px-6 py-8 md:py-4', i > 0 && 'border-t border-altin-soluk md:border-t-0 md:border-l')} data-menu-sutun={s.baslik}>
              <Ikon ad={s.ikon} boyut={40} className="mx-auto" />
              <h3 className="mt-4 text-[clamp(18px,2vw,22px)]">{s.baslik}</h3>
              <Ayirac className="my-5 max-w-[160px]" baklava={6} />
              <ul className="m-0 grid list-none gap-8 p-0">
                {s.ogeler.map((o) => (
                  <li key={o.ad} data-yemek={o.ad}>
                    <p lang={o.lang} className="font-baslik text-[16px] tracking-[0.12em] text-metin uppercase">
                      {o.ad}
                    </p>
                    <p className="mt-1 text-[16px] text-soluk italic">{o.not}</p>
                    <p className="rakam mt-2 text-[24px] text-altin-yazi">{tl(o.fiyat)}</p>
                    {esles ? (
                      <p className="mt-2 text-[15px] text-metin" data-esles="">
                        <span className="etiket !text-[11px]">Eşleşme</span> · {['Champagne Brut', 'Chablis Premier Cru', 'Sauternes'][i]}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-6 text-[15px] text-soluk">Fiyatlar kurgudur.</p>
    </Section>
  )
}

/* ───────────────────────── Mücevher ───────────────────────── */

type Kol = 'hepsi' | 'yuzuk' | 'kolye' | 'kupe'
const MUCEVHER: { id: string; lang: string; ad: string; malzeme: string; fiyat: number; ikon: SimgeAd; kol: Exclude<Kol, 'hepsi'> }[] = [
  { id: 'aurora', lang: 'en', ad: 'Aurora Solitaire', malzeme: '18 ayar sarı altın · 1,2 ct pırlanta', fiyat: 184000, ikon: 'yuzuk', kol: 'yuzuk' },
  { id: 'ziggurat', lang: 'en', ad: 'Ziggurat', malzeme: '18 ayar sarı altın · oniks', fiyat: 58000, ikon: 'elmas', kol: 'yuzuk' },
  { id: 'nuit', lang: 'fr', ad: 'Nuit', malzeme: 'Platin · 42 cm kültür incisi', fiyat: 96500, ikon: 'inci', kol: 'kolye' },
  { id: 'empire', lang: 'en', ad: 'Empire', malzeme: '18 ayar sarı altın · safir', fiyat: 144000, ikon: 'tac', kol: 'kolye' },
  { id: 'sunburst', lang: 'en', ad: 'Sunburst', malzeme: '18 ayar sarı altın · pırlanta', fiyat: 72000, ikon: 'gunes', kol: 'kupe' },
  { id: 'eventail', lang: 'fr', ad: 'Éventail', malzeme: 'Platin · inci', fiyat: 64000, ikon: 'yelpaze', kol: 'kupe' },
]

/** Madde 10: kuyumculuk e-ticareti */
export function Mucevher() {
  const { duyur } = useDeco()
  const [kol, setKol] = useState<Kol>('hepsi')
  const [sepet, setSepet] = useState<Record<string, number>>({ aurora: 1 })
  const liste = MUCEVHER.filter((u) => kol === 'hepsi' || u.kol === kol)
  const satir = MUCEVHER.filter((u) => (sepet[u.id] ?? 0) > 0)
  const toplam = satir.reduce((t, u) => t + sepet[u.id] * u.fiyat, 0)
  const degistir = (u: (typeof MUCEVHER)[number], f: number) => {
    const y = Math.max(0, Math.min(3, (sepet[u.id] ?? 0) + f))
    setSepet((s) => ({ ...s, [u.id]: y }))
    duyur(`${u.ad}: sepette ${y} adet`)
  }
  return (
    <Section id="mucevher" madde="Madde 10 · Kuyumculuk" title={<span lang="fr">Maison Orfèvre</span>} lead="Ürün kartı bir vitrin: üstte ikon, ortada ad ve ayar, altında fiyat. Sepet aynı çerçevede, aynı eksende. Ürünler ve fiyatlar kurgudur.">
      <div className="mb-10 flex flex-wrap items-end justify-center gap-x-10 gap-y-4">
        <Secim<Kol>
          legend="Koleksiyon"
          name="muc-kol"
          value={kol}
          onChange={setKol}
          options={[
            { id: 'hepsi', ad: 'Hepsi' },
            { id: 'yuzuk', ad: 'Yüzük' },
            { id: 'kolye', ad: 'Kolye' },
            { id: 'kupe', ad: 'Küpe' },
          ]}
        />
        <p className="text-[17px] text-soluk" aria-live="polite" data-urun-sayi={liste.length}>
          {liste.length} parça
        </p>
      </div>
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.8fr_1fr]">
        <ul className="m-0 grid min-w-0 list-none grid-cols-1 gap-8 p-0 sm:grid-cols-2 2xl:grid-cols-3">
          {liste.map((u, i) => (
            <li key={u.id} className="grid min-w-0 grid-cols-1" data-urun={u.id}>
              <div className="relative isolate flex flex-col items-center bg-yuzey px-5 py-9 text-center">
                <Cerceve kat={2} stil={i % 2 ? 'pah' : 'basamak'} k={12} aralik={8} />
                <div className="relative grid size-[120px] place-items-center">
                  <Sunburst n={24} halka={2} kisa={0.7} className="absolute inset-x-0 bottom-3 opacity-60" />
                  <Ikon ad={u.ikon} boyut={56} className="relative" />
                </div>
                <h3 lang={u.lang} className="mt-5 text-[clamp(17px,1.8vw,20px)]">
                  {u.ad}
                </h3>
                <p className="mt-2 min-h-[3.4em] text-[15px] text-soluk">{u.malzeme}</p>
                <p className="rakam mt-3 text-[26px] whitespace-nowrap text-altin-yazi">{tl(u.fiyat)}</p>
                <GoldBorderButton boy="k" className="mt-5" onClick={() => degistir(u, 1)} aria-label={`${u.ad} sepete ekle`}>
                  Sepete ekle
                </GoldBorderButton>
              </div>
            </li>
          ))}
        </ul>
        <aside className="relative isolate bg-yuzey p-6 text-center lg:sticky lg:top-20" aria-label="Sepet" data-sepet="">
          <Cerceve kat={2} stil="basamak" k={12} aralik={8} />
          <Ikon ad="aski" boyut={36} className="mx-auto" />
          <h3 className="mt-3 text-[22px]">Sepet</h3>
          <Ayirac className="my-4" baklava={6} />
          {satir.length ? (
            <ul className="m-0 grid list-none gap-4 p-0" aria-live="polite">
              {satir.map((u) => (
                <li key={u.id} className="border-b border-altin-soluk pb-4">
                  <p lang={u.lang} className="font-baslik text-[15px] tracking-[0.12em] uppercase">
                    {u.ad}
                  </p>
                  <p className="font-mono text-[13px] text-soluk tabular-nums">
                    {sepet[u.id]} × {tl(u.fiyat)}
                  </p>
                  <div className="mt-2 flex items-center justify-center gap-4">
                    <GoldBorderButton boy="k" className="!min-w-12 !px-0 !text-[22px]" aria-label={`${u.ad} azalt`} onClick={() => degistir(u, -1)}>
                      −
                    </GoldBorderButton>
                    <GoldBorderButton boy="k" className="!min-w-12 !px-0 !text-[22px]" aria-label={`${u.ad} artır`} onClick={() => degistir(u, 1)}>
                      +
                    </GoldBorderButton>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[17px] text-soluk italic">Sepetiniz boş.</p>
          )}
          <p className="kicker mt-5 !text-[11px]">Toplam</p>
          <p className="rakam text-[30px] text-altin-yazi" data-toplam={toplam}>
            {tl(toplam)}
          </p>
          <p className="mt-3 text-[14px] text-soluk">Sigortalı teslimat ve sertifika dahil.</p>
        </aside>
      </div>
    </Section>
  )
}

/* ───────────────────────── Couture ───────────────────────── */

/** Sol yarı yolları (x = 50 ekseni); sağ yarı ayna görüntü. Boyut 100 × 170 */
const SILUET: { id: string; lang: string; roma: string; ad: string; kumas: string; yol: string; detay: string[] }[] = [
  { id: 'kolon', lang: 'fr', roma: 'I', ad: 'Nuit Dorée', kumas: 'Altın lamé, ipek kadife astar', yol: 'M50 34L43 22L33 27C34 44 37 60 39 74C36 100 33 130 31 160H50', detay: ['M39 74H50', 'M50 34V160'] },
  { id: 'deniz', lang: 'fr', roma: 'II', ad: 'Sirène Noire', kumas: 'Siyah krep, elle işlenmiş boncuk', yol: 'M50 34L43 22L33 27C34 44 37 60 39 74C36 92 36 112 38 130C34 145 26 155 18 160H50', detay: ['M39 74H50', 'M38 130H50', 'M50 34V160'] },
  { id: 'balo', lang: 'fr', roma: 'III', ad: 'Éventail', kumas: 'Fildişi tafta, 40 metre tül', yol: 'M50 34L43 22L33 27C34 44 37 60 39 74C39 92 30 130 8 160H50', detay: ['M39 74H50', 'M50 74L34 160', 'M50 74L22 160', 'M50 74L12 160', 'M50 74V160'] },
  { id: 'pelerin', lang: 'en', roma: 'IV', ad: 'Empire', kumas: 'Lacivert kadife, altın zincir', yol: 'M50 30L44 20L22 30C20 60 20 110 22 160H50', detay: ['M50 30V160', 'M44 20L38 60H50', 'M32 60H50'] },
]

function Elbise({ yol, detay }: { yol: string; detay: string[] }) {
  const g = (
    <>
      <path d={yol} vectorEffect="non-scaling-stroke" fill="var(--yuzey)" />
      {detay.map((d, i) => (
        <path key={i} d={d} vectorEffect="non-scaling-stroke" strokeOpacity={0.55} />
      ))}
    </>
  )
  return (
    <svg viewBox="0 0 100 170" className="h-full w-auto overflow-visible" fill="none" stroke="var(--altin-cizgi)" strokeLinecap="round" strokeLinejoin="round" style={{ strokeWidth: 'var(--kalin)' }} aria-hidden="true" data-elbise="">
      <path d="M50 4L54 12L50 20L46 12Z" vectorEffect="non-scaling-stroke" />
      <g>{g}</g>
      <g transform="translate(100 0) scale(-1 1)">{g}</g>
      <path d="M8 160H92" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

/** Madde 10: haute couture, simetrik koleksiyon sayfası */
export function Koleksiyon() {
  const { hareket, duyur } = useDeco()
  const [i, setI] = useState(0)
  const [n, setN] = useState(0)
  const s = SILUET[i]
  const git = (y: number) => {
    const k = (y + SILUET.length) % SILUET.length
    setI(k)
    setN((x) => x + 1)
    duyur(`Look ${SILUET[k].roma}: ${SILUET[k].ad}`)
  }
  return (
    <Section id="koleksiyon" madde="Madde 10 · Haute couture" title="Automne Doré" lead="Her look tam ortada, yelpaze bir ışığın önünde; ayna simetrik bir siluet, iki yandan aynı çizgiyle çerçevelenir. Look değişirken perde ortadan iki yana açılır. Koleksiyon kurgudur.">
      <div className="mx-auto grid max-w-[900px] grid-cols-1 items-center gap-8 md:grid-cols-[auto_1fr_auto]">
        <GoldBorderButton boy="k" className="order-2 mx-auto !min-w-12 !text-[26px] md:order-1" aria-label="Önceki look" onClick={() => git(i - 1)}>
          ‹
        </GoldBorderButton>
        <div key={n} className="relative isolate order-1 bg-yuzey px-6 pt-8 pb-10 text-center md:order-2" data-look={s.id} data-look-no={i} style={hareket ? { animation: 'ac-yatay 1100ms cubic-bezier(0.65, 0, 0.35, 1) both' } : undefined}>
          <Cerceve kat={3} stil="basamak" k={14} aralik={8} />
          <p className="kicker">Look {s.roma}</p>
          <div className="relative mx-auto mt-4 h-[300px] w-full max-w-[380px]">
            <Sunburst n={30} halka={3} kisa={0.72} className="absolute inset-x-0 bottom-0 h-auto max-h-[300px] opacity-70" />
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2">
              <Elbise yol={s.yol} detay={s.detay} />
            </div>
          </div>
          <h3 lang={s.lang} className="mt-6 text-[clamp(22px,3vw,30px)]">
            {s.ad}
          </h3>
          <Ayirac className="my-4 max-w-[200px]" baklava={7} />
          <p className="mx-auto max-w-[36ch] text-[17px] text-soluk italic">{s.kumas}</p>
        </div>
        <GoldBorderButton boy="k" className="order-3 mx-auto !min-w-12 !text-[26px]" aria-label="Sonraki look" onClick={() => git(i + 1)}>
          ›
        </GoldBorderButton>
      </div>
      <div className="mt-10">
        <Secim<string> legend="Look" name="look" value={String(i)} onChange={(v) => git(+v)} options={SILUET.map((x, k) => ({ id: String(k), ad: x.roma }))} />
      </div>
    </Section>
  )
}

/* ───────────────────────── Kulüp ───────────────────────── */

const UYELIK = [
  { id: 'uye', ad: 'Üye', ozellik: 'Salon, kütüphane, bar', yillik: 96000 },
  { id: 'fahri', ad: 'Fahri', ozellik: '+ Özel yemek odası, sanat gecesi', yillik: 168000 },
  { id: 'kurucu', ad: 'Kurucu', ozellik: '+ Yönetim kurulu, ömür boyu masa', yillik: 340000 },
] as const

/** Madde 10: özel kulüp, üyelik başvurusu */
export function Kulup() {
  const { duyur } = useDeco()
  const [tur, setTur] = useState<(typeof UYELIK)[number]['id']>('uye')
  const [ad, setAd] = useState('')
  const [eposta, setEposta] = useState('')
  const [ref1, setRef1] = useState('')
  const [onay, setOnay] = useState(false)
  const [hata, setHata] = useState<Record<string, string>>({})
  const [sonuc, setSonuc] = useState('')
  const r = { ad: useRef<HTMLInputElement>(null), eposta: useRef<HTMLInputElement>(null), ref: useRef<HTMLInputElement>(null), onay: useRef<HTMLInputElement>(null) }
  const secili = UYELIK.find((u) => u.id === tur)!
  const gonder = (e: FormEvent) => {
    e.preventDefault()
    const h: Record<string, string> = {}
    if (ad.trim().length < 3) h.ad = ad.trim() ? 'Adınızı ve soyadınızı eksiksiz yazın.' : 'Ad soyad gerekli.'
    if (!/^\S+@\S+\.\S+$/.test(eposta)) h.eposta = eposta ? 'E-posta adresi geçersiz.' : 'E-posta gerekli.'
    if (tur !== 'uye' && ref1.trim().length < 3) h.ref = 'Bu üyelik için bir üye referansı gerekli.'
    if (!onay) h.onay = 'Devam etmek için gizlilik koşulunu onaylayın.'
    setHata(h)
    setSonuc('')
    const ilk = (['ad', 'eposta', 'ref', 'onay'] as const).find((k) => h[k])
    if (ilk) {
      r[ilk].current?.focus()
      return
    }
    const m = `Başvurunuz kurula iletildi, ${ad.trim()}. ${secili.ad} üyelik değerlendirmesi 10 iş günü sürer.`
    setSonuc(m)
    duyur(m)
  }
  const ah = (k: string) => (hata[k] ? { 'aria-invalid': true as const, 'aria-describedby': `kl-${k}-h` } : {})
  const H = ({ k }: { k: string }) =>
    hata[k] ? (
      <p id={`kl-${k}-h`} role="alert" className="mt-1.5 text-left text-[16px] font-semibold text-altin-parlak">
        {hata[k]}
      </p>
    ) : null
  const ikonlar: SimgeAd[] = ['klos', 'kadeh', 'tac']
  useEffect(() => {
    setHata((h) => ({ ...h, ref: '' }))
  }, [tur])
  const yillikStr = useMemo(() => tl(secili.yillik), [secili])
  return (
    <Section id="kulup" madde="Madde 10 · Özel kulüp" title="Cercle Doré" lead="Yalnız davetle. Üç üyelik derecesi aynı çerçevede yan yana durur; başvuru formu ortalanmış tek sütundur. Kulüp ve fiyatlar kurgudur.">
      <ul className="m-0 grid list-none grid-cols-1 gap-8 p-0 md:grid-cols-3" data-uyelik="">
        {UYELIK.map((u, k) => (
          <li key={u.id} className="grid grid-cols-1">
            <button type="button" onClick={() => setTur(u.id)} aria-pressed={tur === u.id} data-uyelik-sec={u.id} className="relative isolate flex flex-col items-center bg-yuzey px-6 py-10 text-center">
              <Cerceve kat={tur === u.id ? 3 : 1} stil={k === 1 ? 'pah' : 'basamak'} k={12} aralik={7} />
              <Ikon ad={ikonlar[k]} boyut={44} />
              <span className="mt-4 font-baslik text-[20px] tracking-[0.2em] text-altin-yazi uppercase">{u.ad}</span>
              <Ayirac className="my-4 max-w-[140px]" baklava={6} />
              <span className="text-[16px] text-soluk">{u.ozellik}</span>
              <span className="rakam mt-4 text-[28px]">{tl(u.yillik)}</span>
              <span className="kicker !text-[11px]">yıllık</span>
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={gonder} noValidate className="relative isolate mx-auto mt-14 grid max-w-[640px] grid-cols-1 gap-6 bg-yuzey p-6 md:p-10" aria-label="Üyelik başvurusu" data-kulup-form="">
        <Cerceve kat={2} stil="basamak" k={14} aralik={8} />
        <h3 className="text-[clamp(20px,2.4vw,26px)]">Üyelik başvurusu</h3>
        <p className="text-[17px] text-soluk" data-secili-uyelik={tur}>
          Seçili: <b className="text-altin-yazi">{secili.ad}</b> · {yillikStr} yıllık
        </p>
        <div className="text-left">
          <label htmlFor="kl-ad" className="etiket mb-2 block !text-metin">
            Ad soyad
          </label>
          <input ref={r.ad} id="kl-ad" className="alan" value={ad} onChange={(e) => setAd(e.target.value)} autoComplete="name" {...ah('ad')} />
          <H k="ad" />
        </div>
        <div className="text-left">
          <label htmlFor="kl-eposta" className="etiket mb-2 block !text-metin">
            E-posta
          </label>
          <input ref={r.eposta} id="kl-eposta" type="email" className="alan" value={eposta} onChange={(e) => setEposta(e.target.value)} autoComplete="email" {...ah('eposta')} />
          <H k="eposta" />
        </div>
        <div className="text-left">
          <label htmlFor="kl-ref" className="etiket mb-2 block !text-metin">
            Üye referansı {tur === 'uye' ? '(isteğe bağlı)' : ''}
          </label>
          <input ref={r.ref} id="kl-ref" className="alan" value={ref1} onChange={(e) => setRef1(e.target.value)} {...ah('ref')} />
          <H k="ref" />
        </div>
        <div>
          <Onay id="kl-onay" label="Başvuru bilgilerimin kulüp kurulunca gizlilik içinde değerlendirilmesini onaylıyorum." checked={onay} onChange={setOnay} hata={!!hata.onay} describedBy={hata.onay ? 'kl-onay-h' : undefined} />
          {hata.onay ? (
            <p id="kl-onay-h" role="alert" className="mt-1.5 text-left text-[16px] font-semibold text-altin-parlak">
              {hata.onay}
            </p>
          ) : null}
        </div>
        <div>
          <GoldBorderButton ana boy="b" type="submit">
            Başvuruyu ilet
          </GoldBorderButton>
        </div>
        {sonuc ? (
          <p className="border border-altin-cizgi px-5 py-4 text-[17px]" data-kulup-sonuc="" role="status">
            {sonuc}
          </p>
        ) : null}
      </form>
    </Section>
  )
}
