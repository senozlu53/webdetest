import { useEffect, useState } from 'react'
import { Popover } from 'radix-ui'
import { cx } from '../../shared/cx'
import { useSketch, type Baslik, type HareketTercih, type Kagit, type Kontrast, type Kusur, type Titreme } from '../lib/store'
import { Ikon } from './Icons'
import { CizgiAyrac } from './Rough'
import { RoughButton, Secim } from './Controls'

export const NAV = [
  ['palet', 'Renk'],
  ['yazi', 'Yazı'],
  ['sekil', 'Şekil'],
  ['golge', 'Gölge'],
  ['doku', 'Doku'],
  ['ikonlar', 'İkon'],
  ['menu', 'Menü'],
  ['portfolyo', 'Portfolyo'],
  ['blog', 'Blog'],
  ['form', 'Form'],
  ['bilesenler', 'Bileşenler'],
  ['figma', 'Figma'],
  ['hareket', 'Hareket'],
  ['erisim', 'Erişim'],
] as const

export function Ayarlar({ onek = '' }: { onek?: string }) {
  const s = useSketch()
  return (
    <div className="grid grid-cols-1 gap-5">
      <Secim<HareketTercih>
        legend={`Hareket · şu an ${s.hareket ? 'açık' : 'kapalı'}`}
        name={`${onek}hareket`}
        value={s.hareketTercih}
        onChange={s.setHareketTercih}
        options={[
          { id: 'oto', ad: 'Oto' },
          { id: 'acik', ad: 'Açık' },
          { id: 'kapali', ad: 'Kapalı' },
        ]}
      />
      <Secim<Titreme>
        legend="Titreme"
        name={`${onek}titreme`}
        value={s.titreme}
        onChange={s.setTitreme}
        options={[
          { id: 'etkilesim', ad: 'Dokununca' },
          { id: 'surekli', ad: 'Sürekli' },
        ]}
      />
      <Secim<Kusur>
        legend="Çizgi kusuru"
        name={`${onek}kusur`}
        value={s.kusur}
        onChange={s.setKusur}
        options={[
          { id: 'az', ad: 'Az' },
          { id: 'orta', ad: 'Orta' },
          { id: 'cok', ad: 'Çok' },
        ]}
      />
      <Secim<Kagit>
        legend="Kâğıt"
        name={`${onek}kagit`}
        value={s.kagit}
        onChange={s.setKagit}
        options={[
          { id: 'ekskiz', ad: 'Eskiz' },
          { id: 'geri', ad: 'Geri dönüşüm' },
          { id: 'yok', ad: 'Düz' },
        ]}
      />
      <Secim<Baslik>
        legend="Başlık yazısı"
        name={`${onek}baslik`}
        value={s.baslik}
        onChange={s.setBaslik}
        options={[
          { id: 'el', ad: 'El yazısı' },
          { id: 'okunur', ad: 'Okunaklı' },
        ]}
      />
      <Secim<Kontrast>
        legend="Kontrast"
        name={`${onek}kontrast`}
        value={s.kontrast}
        onChange={s.setKontrast}
        options={[
          { id: 'normal', ad: 'Normal' },
          { id: 'yuksek', ad: 'Yüksek' },
        ]}
      />
    </div>
  )
}

export function Header() {
  const [aktif, setAktif] = useState('')
  useEffect(() => {
    const els = NAV.map(([id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (es) => {
        const v = es.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (v) setAktif(v.target.id)
      },
      { rootMargin: '-30% 0px -60% 0px' },
    )
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [])
  return (
    <header className="relative z-[80] bg-kagit [background-image:var(--grain)] md:sticky md:top-0">
      <a href="#icerik" className="rbtn sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-kagit" data-boy="k">
        İçeriğe geç
      </a>
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2 md:flex-nowrap md:px-8">
        <a href="#ust" className="flex shrink-0 items-center gap-2 no-underline" aria-label="Kırık Fincan, başa dön">
          <Ikon ad="fincan" boyut={40} />
          <span className="font-el text-[34px] leading-none font-bold text-murekkep">Kırık Fincan</span>
        </a>
        <nav aria-label="Bölümler" className="order-last -mx-1 w-full min-w-0 overflow-x-auto px-1 pb-1 [scrollbar-width:none] md:order-none md:mx-0 md:w-auto md:flex-1 md:pb-0">
          <ul className="m-0 flex list-none gap-1 p-0 md:justify-center-safe">
            {NAV.map(([id, ad]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={aktif === id ? 'true' : undefined}
                  className={cx('flex min-h-12 items-center px-2.5 font-not text-[19px] font-normal whitespace-nowrap no-underline', aktif === id ? 'text-murekkep underline decoration-kirmizi decoration-wavy decoration-2 underline-offset-[6px]' : 'text-komur hover:text-murekkep')}
                >
                  {ad}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <Popover.Root>
          <Popover.Trigger asChild>
            <button type="button" className="ml-auto grid size-12 place-items-center rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2 border-komur bg-transparent" aria-label="Görünüm ayarları">
              <Ikon ad="ayar" boyut={28} />
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content align="end" sideOffset={10} collisionPadding={12} className="z-[95] max-h-[80vh] w-[min(400px,calc(100vw-24px))] overflow-y-auto rounded-[15px_225px_15px_255px/255px_15px_225px_15px] border-2 border-komur bg-kagit p-6 text-komur">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="font-el text-[40px] leading-none font-bold text-murekkep">Ayarlar</p>
                <Popover.Close asChild>
                  <RoughButton boy="k" className="!size-12 !min-h-12 !p-0" aria-label="Kapat">
                    <Ikon ad="kapat" boyut={22} />
                  </RoughButton>
                </Popover.Close>
              </div>
              <Ayarlar />
              <p className="mt-5 flex gap-4">
                <a href="../../">Tüm stiller</a>
                <a href="../024/">Stil 024</a>
              </p>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
      <CizgiAyrac tohum={5} className="mx-auto max-w-[1240px] px-4 md:px-8" cizgi={2} />
    </header>
  )
}
