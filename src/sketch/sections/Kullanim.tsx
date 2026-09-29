import { useState } from 'react'
import { cx } from '../../shared/cx'
import { useSketch } from '../lib/store'
import { BOY, EKSTRA, MAKALE, MENU, PROJELER, type Proje } from '../lib/data'
import { Sus } from '../components/Doodles'
import { Ikon } from '../components/Icons'
import { Not } from '../components/Not'
import { RoughBox } from '../components/Rough'
import { Anahtar, KaralamaKutu, KaralamaSecenek, RoughButton, Secim } from '../components/Controls'
import { Section } from '../components/ui'

const tl = (n: number) => `${n} TL`

/** Madde 10: butik kahveci. Menü, adet, ekstra, boy ve deftere yazılan sipariş */
export function Menu() {
  const { duyur } = useSketch()
  const [adet, setAdet] = useState<Record<string, number>>({ filtre: 1, kurabiye: 1 })
  const [shot, setShot] = useState(false)
  const [yulaf, setYulaf] = useState(true)
  const [boy, setBoy] = useState('o')
  const [no, setNo] = useState(0)
  const satirlar = MENU.filter((u) => (adet[u.id] ?? 0) > 0)
  const birim = (u: (typeof MENU)[number]) => u.fiyat + (u.icecek ? BOY[boy].ek + (shot ? EKSTRA.shot : 0) + (yulaf ? EKSTRA.yulaf : 0) : 0)
  const toplam = satirlar.reduce((t, u) => t + adet[u.id] * birim(u), 0)
  const sayi = satirlar.reduce((t, u) => t + adet[u.id], 0)
  const degistir = (id: string, ad: string, f: number) => {
    setNo(0)
    setAdet((a) => {
      const yeni = Math.max(0, Math.min(9, (a[id] ?? 0) + f))
      duyur(`${ad}: ${yeni} adet`)
      return { ...a, [id]: yeni }
    })
  }
  return (
    <Section id="menu" madde="Madde 10 · Butik kahveci" title="Menü tahtası" lead="Kırık Fincan'ın menüsü kara tahtada değil, defterde. Adetleri artır, ekstraları işaretle; sipariş deftere elle yazılıyormuş gibi görünür. Kahveci ve fiyatlar kurgudur.">
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.25fr_1fr]">
        <ul className="m-0 grid min-w-0 list-none grid-cols-1 gap-5 p-0" data-menu="">
          {MENU.map((u, i) => (
            <RoughBox as="li" key={u.id} tohum={200 + i * 3} kare={3} sekil="yuvarlak" r={14} cizgi={2} className="grid grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-2 p-4" data-urun={u.id}>
              <Ikon ad={u.ikon} boyut={48} />
              <div className="min-w-0">
                <p className="font-el text-[34px] leading-none font-bold text-murekkep">{u.ad}</p>
                <p className="mt-1 text-[16px] text-soluk">{u.not}</p>
              </div>
              <p className="font-daktilo text-[18px] font-bold tabular-nums">{tl(u.fiyat)}</p>
              <div className="col-span-3 flex items-center justify-end gap-3">
                <RoughButton boy="k" className="!size-12 !min-h-12 !p-0" aria-label={`${u.ad} azalt`} disabled={(adet[u.id] ?? 0) === 0} onClick={() => degistir(u.id, u.ad, -1)}>
                  <Ikon ad="eksi" boyut={24} />
                </RoughButton>
                <span className="w-8 text-center font-daktilo text-[22px] font-bold tabular-nums" aria-live="polite" data-adet={u.id}>
                  {adet[u.id] ?? 0}
                </span>
                <RoughButton boy="k" className="!size-12 !min-h-12 !p-0" aria-label={`${u.ad} artır`} onClick={() => degistir(u.id, u.ad, 1)}>
                  <Ikon ad="arti" boyut={24} />
                </RoughButton>
              </div>
            </RoughBox>
          ))}
        </ul>
        <RoughBox tohum={230} kare={3} sekil="yuvarlak" r={18} cizgi={2.4} className="tarama tarama-kirmizi grid min-w-0 grid-cols-1 gap-5 p-6 md:p-7" data-siparis="">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-[46px]">Sipariş defteri</h3>
            <p className="font-daktilo text-[14px] font-bold tracking-widest text-soluk">NO. {String(427 + no).padStart(4, '0')}</p>
          </div>
          {satirlar.length ? (
            <ul className="m-0 grid list-none gap-1 p-0 text-[17px]" aria-label="Sipariş satırları">
              {satirlar.map((u) => (
                <li key={u.id} className="flex items-baseline gap-2 border-b-2 border-dotted border-komur/40 py-1">
                  <span className="font-daktilo font-bold tabular-nums">{adet[u.id]}×</span>
                  <span className="min-w-0 flex-1">{u.ad}</span>
                  <span className="font-daktilo tabular-nums">{tl(adet[u.id] * birim(u))}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-not text-[22px] text-soluk">Defter boş. Soldan bir şey seç.</p>
          )}
          <fieldset className="grid gap-0 border-0 p-0">
            <legend className="kicker mb-1">İçecekler için</legend>
            <KaralamaKutu label="Ekstra shot" hint={`+${tl(EKSTRA.shot)}`} checked={shot} onChange={setShot} />
            <KaralamaKutu label="Yulaf sütü" hint={`+${tl(EKSTRA.yulaf)}`} checked={yulaf} onChange={setYulaf} />
          </fieldset>
          <fieldset className="grid gap-0 border-0 p-0">
            <legend className="kicker mb-1">Boy</legend>
            <div className="flex flex-wrap gap-x-6">
              {Object.entries(BOY).map(([k, v]) => (
                <KaralamaSecenek key={k} name="menu-boy" value={k} label={v.ad} hint={v.ek ? `+${tl(v.ek)}` : 'ek ücret yok'} checked={boy === k} onChange={() => setBoy(k)} />
              ))}
            </div>
          </fieldset>
          <p className="flex items-baseline justify-between gap-3 border-t-2 border-komur pt-3">
            <span className="font-el text-[36px] leading-none font-bold text-murekkep">Toplam</span>
            <span className="font-daktilo text-[26px] font-bold tabular-nums" data-toplam={toplam}>
              {tl(toplam)}
            </span>
          </p>
          <RoughButton
            tur="murekkep"
            boy="b"
            disabled={sayi === 0}
            onClick={() => {
              setNo(1)
              duyur(`Sipariş deftere yazıldı: ${sayi} kalem, ${tl(toplam)}`)
            }}
            ikon={<Ikon ad="kalem" boyut={28} renk="#f9f6f0" />}
          >
            Deftere yaz
          </RoughButton>
          {no ? (
            <p className="flex items-center gap-3 font-not text-[24px] text-murekkep" role="status" data-yazildi="">
              <Not tur="circle" pad={8}>
                yazıldı
              </Not>
              <span>Sıran 6 dakika sonra!</span>
            </p>
          ) : null}
        </RoughBox>
      </div>
    </Section>
  )
}

const TURLER: { id: 'hepsi' | Proje['tur']; ad: string }[] = [
  { id: 'hepsi', ad: 'Hepsi' },
  { id: 'uygulama', ad: 'Uygulama' },
  { id: 'web', ad: 'Web' },
  { id: 'tasarim', ad: 'Tasarım' },
]

/** Madde 10: indie geliştirici portfolyosu */
export function Portfolyo() {
  const [tur, setTur] = useState<'hepsi' | Proje['tur']>('hepsi')
  const liste = PROJELER.filter((p) => tur === 'hepsi' || p.tur === tur)
  return (
    <Section id="portfolyo" madde="Madde 10 · Bağımsız geliştirici" title="Ece'nin çekmecesi" lead="Ece Kaya tek başına çalışan bir geliştirici: küçük, sakin uygulamalar yapıyor. Portfolyosu ajans vitrini gibi değil, çekmece gibi: karışık, sıcak, hepsi el yapımı. Projeler kurgudur.">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <Secim<'hepsi' | Proje['tur']> legend="Tür" name="portfolyo-tur" value={tur} onChange={setTur} options={TURLER.map((t) => ({ id: t.id, ad: t.ad }))} />
        <p className="font-not text-[22px]" aria-live="polite" data-proje-sayi={liste.length}>
          {liste.length} proje
        </p>
      </div>
      <ul className="m-0 grid list-none grid-cols-1 gap-x-8 gap-y-10 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {liste.map((p, i) => (
          <RoughBox as="li" key={p.id} tohum={300 + i * 7} kare={3} sekil="yuvarlak" r={16} cizgi={2.2} className={cx('grid content-start gap-3 p-5', i % 2 === 0 ? 'tarama tarama-mavi' : 'tarama tarama-kirmizi')} data-proje={p.id}>
            <div className="flex items-start justify-between gap-3">
              <span className="grid size-20 place-items-center el-kose bg-transparent" aria-hidden="true">
                <Ikon ad={p.ikon} boyut={52} />
              </span>
              <span className="font-daktilo text-[14px] font-bold text-soluk">{p.yil}</span>
            </div>
            <h3 className="text-[42px]">{p.ad}</h3>
            <p className="text-[16px]">{p.ozet}</p>
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
              {p.etiket.map((e) => (
                <li key={e} className="el-kose-2 px-2.5 py-0.5 font-daktilo text-[13px] font-bold">
                  {e}
                </li>
              ))}
            </ul>
            <a href={`#${p.id}`} onClick={(e) => e.preventDefault()} className="inline-flex min-h-12 items-center gap-2 text-[17px]" aria-label={`${p.ad} projesine bak`}>
              Bak <Ikon ad="ok" boyut={30} />
            </a>
          </RoughBox>
        ))}
      </ul>
    </Section>
  )
}

/** Madde 10 · 14: kişisel blog, react-rough-notation ile kenar notları */
export function Blog() {
  const [notlar, setNotlar] = useState(true)
  const [begen, setBegen] = useState(false)
  const { duyur } = useSketch()
  return (
    <Section id="blog" madde="Madde 10 · 14 · Kişisel blog" title="Sabah notları" lead="Bir blog yazısı: altı çizilen, daire içine alınan, üstü karalanan sözcükler react-rough-notation ile işaretlenir. Metin işaretsiz de aynen okunur; işaret yalnız dikkat çeker.">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_260px]">
        <RoughBox as="article" tohum={400} kare={3} sekil="yuvarlak" r={18} cizgi={2.2} className="min-w-0 p-6 md:p-10" aria-labelledby="blog-baslik">
          <p className="kicker">
            {MAKALE.yazar} · {MAKALE.tarih} · {MAKALE.sure}
          </p>
          <h3 id="blog-baslik" className="mt-3 text-[clamp(44px,6vw,72px)]">
            {MAKALE.baslik}
          </h3>
          <div className="mt-8 grid max-w-[64ch] gap-6 text-[19px] leading-[1.75]" data-makale="">
            <p>
              Beş yıl önce her şeyi düzgün çizgilerle kuruyordum. Her köşe tam dikti, her boşluk sekizin katıydı. Sonuç{' '}
              <Not tur="underline" goster={notlar} gecikme={200}>
                kusursuzdu
              </Not>{' '}
              ve kimsenin umurunda değildi.
            </p>
            <p>
              Bir gün müşteriye kalemle çizdiğim ilk taslağı gösterdim.{' '}
              <Not tur="highlight" goster={notlar} renk="#f6c9cc" sure={900} gecikme={600}>
                Toplantıda ilk kez birileri güldü
              </Not>
              . Çünkü kusurlu bir çizgi "henüz bitmedi, birlikte düzeltebiliriz" der.
            </p>
            <p>
              Bu sayfadaki her kutuyu{' '}
              <Not tur="circle" goster={notlar} gecikme={1000} pad={7}>
                rough.js
              </Not>{' '}
              çiziyor. Ama gövde metnini bilerek düz bıraktım:{' '}
              <Not tur="crossed-off" goster={notlar} gecikme={1400}>
                mükemmel
              </Not>{' '}
              değil, okunaklı olsun istedim.
            </p>
            <p>
              Kural basit:{' '}
              <Not tur="bracket" goster={notlar} gecikme={1800} pad={8} renk="#1d3557">
                el çizimi başlıkta ve süste, okunacak yerde düz sans
              </Not>
              . Gerisini kalem halleder.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <RoughButton
              tur={begen ? 'kirmizi' : 'cizgi'}
              aria-pressed={begen}
              ikon={<Ikon ad="kalp" boyut={28} renk={begen ? '#ffffff' : undefined} />}
              onClick={() => {
                setBegen(!begen)
                duyur(begen ? 'Beğeni geri alındı' : 'Yazıyı beğendin')
              }}
            >
              {begen ? 'Beğendin' : 'Beğen'} · {begen ? 13 : 12}
            </RoughButton>
          </div>
        </RoughBox>
        <aside className="grid min-w-0 content-start gap-6" aria-label="Kenar notları">
          <Anahtar label="Kenar notları" hint="Altı çizme, daire ve karalamaları aç ya da kapat." checked={notlar} onChange={setNotlar} />
          <div className="flex items-start gap-2" aria-hidden="true">
            <Sus tur="ok" boyut={64} className="block -rotate-12" />
            <p className="not -rotate-2">çizgiler kaybolsa da yazı aynen okunur.</p>
          </div>
          <p className="rotate-1 font-not text-[22px] leading-tight text-kirmiziK">Not: sekizin katı kuralı hâlâ iyi bir kural.</p>
        </aside>
      </div>
    </Section>
  )
}
