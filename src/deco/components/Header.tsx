import { useEffect, useState } from 'react'
import { Popover } from 'radix-ui'
import { cx } from '../../shared/cx'
import { useDeco, type Doku, type HareketTercih, type Iz, type Kontrast, type TemaTercih } from '../lib/store'
import { GoldBorderButton } from './Dugme'
import { Ikon } from './Ikon'
import { Ayirac } from './Ornament'
import { Secim } from './ui'

export const NAV = [
  ['palet', 'Renk'],
  ['yazi', 'Yazı'],
  ['sekil', 'Şekil'],
  ['derinlik', 'Derinlik'],
  ['doku', 'Doku'],
  ['ikonlar', 'İkon'],
  ['rezervasyon', 'Konaklama'],
  ['menu', 'Menü'],
  ['mucevher', 'Mücevher'],
  ['koleksiyon', 'Couture'],
  ['kulup', 'Kulüp'],
  ['bilesenler', 'Bileşenler'],
  ['figma', 'Figma'],
  ['css', 'CSS'],
  ['hareket', 'Hareket'],
  ['mobil', 'Mobil'],
  ['erisim', 'Erişim'],
] as const

export function Ayarlar({ onek = '' }: { onek?: string }) {
  const s = useDeco()
  const temaAd = { siyah: 'gece siyahı', lacivert: 'derin lacivert', zumrut: 'zümrüt', fildisi: 'fildişi' }[s.tema]
  return (
    <div className="grid grid-cols-1 gap-6">
      <Secim<TemaTercih>
        legend={`Tema · şu an ${temaAd}`}
        name={`${onek}tema`}
        value={s.temaTercih}
        onChange={s.setTemaTercih}
        options={[
          { id: 'oto', ad: 'Oto' },
          { id: 'siyah', ad: 'Gece siyahı' },
          { id: 'lacivert', ad: 'Lacivert' },
          { id: 'zumrut', ad: 'Zümrüt' },
          { id: 'fildisi', ad: 'Fildişi' },
        ]}
      />
      <Secim<Doku>
        legend="Doku"
        name={`${onek}doku`}
        value={s.doku}
        onChange={s.setDoku}
        options={[
          { id: 'kadife', ad: 'Kadife' },
          { id: 'mermer', ad: 'Mermer' },
          { id: 'firca', ad: 'Fırçalanmış altın' },
          { id: 'duz', ad: 'Düz' },
        ]}
      />
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
      <Secim<Iz>
        legend="Harf aralığı"
        name={`${onek}iz`}
        value={s.iz}
        onChange={s.setIz}
        options={[
          { id: 'genis', ad: 'Geniş' },
          { id: 'dar', ad: 'Dar (okunaklı)' },
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
    <>
      <a href="#icerik" className="gbtn sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[100] focus:bg-zemin" data-boy="k">
        İçeriğe geç
      </a>
      <header className="relative mx-auto flex max-w-[1240px] flex-col items-center px-4 pt-6 pb-3 md:px-8">
        <a href="#ust" className="flex flex-col items-center gap-1 no-underline" aria-label="Aurelia Palas, başa dön">
          <Ikon ad="yelpaze" boyut={40} />
          <span lang="en" className="font-baslik text-[clamp(20px,3vw,28px)] font-medium tracking-[0.34em] whitespace-nowrap text-altin-yazi uppercase" style={{ letterSpacing: 'calc(0.34em * var(--iz))' }}>
            Aurelia Palas
          </span>
          <span className="kicker !text-[11px] !text-soluk">İstanbul · MCMXXVIII</span>
        </a>
        <div className="absolute top-4 right-4 md:right-8">
          <Popover.Root>
            <Popover.Trigger asChild>
              <GoldBorderButton boy="k" className="!min-h-12 !min-w-12 !px-0" aria-label="Görünüm ayarları">
                <Ikon ad="rozet" boyut={26} className="text-inherit" />
              </GoldBorderButton>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content align="end" sideOffset={10} collisionPadding={12} className="relative z-[95] max-h-[80vh] w-[min(420px,calc(100vw-24px))] overflow-y-auto border border-altin-cizgi bg-yuzey p-6 text-center" data-ayarlar="">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="font-baslik text-[20px] tracking-[0.2em] text-altin-yazi uppercase">Ayarlar</p>
                  <Popover.Close asChild>
                    <GoldBorderButton boy="k" className="!min-h-12 !min-w-12 !px-0" aria-label="Kapat">
                      <span aria-hidden="true" className="text-[22px] leading-none">
                        ×
                      </span>
                    </GoldBorderButton>
                  </Popover.Close>
                </div>
                <Ayirac className="mb-5" baklava={7} />
                <Ayarlar />
                <p className="mt-6 flex justify-center gap-6 text-[16px]">
                  <a href="../../">Tüm stiller</a>
                  <a href="../027/">Stil 027</a>
                </p>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>
      </header>
      <nav aria-label="Bölümler" className="sticky top-0 z-[80] border-y border-altin-soluk bg-zemin/95 backdrop-blur-none" style={{ backgroundColor: 'var(--zemin)' }}>
        <ul className="m-0 mx-auto flex max-w-[1240px] list-none justify-center-safe overflow-x-auto p-0 px-2 [scrollbar-width:none]">
          {NAV.map(([id, ad]) => (
            <li key={id} className="shrink-0">
              <a
                href={`#${id}`}
                aria-current={aktif === id ? 'true' : undefined}
                className={cx('relative flex min-h-12 items-center px-3.5 font-baslik text-[12px] font-semibold tracking-[0.2em] whitespace-nowrap uppercase no-underline', aktif === id ? 'text-altin-yazi' : 'text-soluk hover:text-metin')}
                style={{ letterSpacing: 'calc(0.2em * var(--iz))' }}
              >
                {ad}
                {aktif === id ? <span className="absolute inset-x-3.5 bottom-2 h-px bg-altin-cizgi" aria-hidden="true" /> : null}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
