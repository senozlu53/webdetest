import { useEffect, useState } from 'react'
import { Popover } from 'radix-ui'
import { cx } from '../../shared/cx'
import { useWash, type Doku, type HareketTercih, type Kontrast, type TemaTercih } from '../lib/store'
import { WashButton } from './Firca'
import { Ikon } from './Ikon'
import { FircaAralik, Secim } from './ui'

export const NAV = [
  ['palet', 'Renk'],
  ['boya', 'Boya'],
  ['yazi', 'Yazı'],
  ['sekil', 'Şekil'],
  ['golge', 'Gölge'],
  ['doku', 'Doku'],
  ['ikonlar', 'İkon'],
  ['masal', 'Masal'],
  ['sukunet', 'Sükûnet'],
  ['sofra', 'Sofra'],
  ['dergi', 'Dergi'],
  ['bilesenler', 'Bileşenler'],
  ['figma', 'Figma'],
  ['css', 'CSS'],
  ['hareket', 'Hareket'],
  ['mobil', 'Mobil'],
  ['erisim', 'Erişim'],
] as const

export function Ayarlar({ onek = '' }: { onek?: string }) {
  const s = useWash()
  return (
    <div className="grid grid-cols-1 gap-5">
      <Secim<TemaTercih>
        legend={`Tema · şu an ${s.tema === 'gece' ? 'gece masalı' : s.tema === 'parsomen' ? 'parşömen' : 'gündüz'}`}
        name={`${onek}tema`}
        value={s.temaTercih}
        onChange={s.setTemaTercih}
        options={[
          { id: 'oto', ad: 'Oto' },
          { id: 'gunduz', ad: 'Gündüz' },
          { id: 'parsomen', ad: 'Parşömen', renk: 'var(--ocre)' },
          { id: 'gece', ad: 'Gece masalı', renk: 'var(--ultramarin)' },
        ]}
      />
      <Secim<Doku>
        legend="Doku"
        name={`${onek}doku`}
        value={s.doku}
        onChange={s.setDoku}
        options={[
          { id: 'sulu', ad: 'Suluboya kâğıdı' },
          { id: 'kanvas', ad: 'Kanvas' },
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
          { id: 'yuksek', ad: 'Yüksek', renk: 'var(--gul)' },
        ]}
      />
      <FircaAralik label="Su miktarı" value={s.su} min={0.4} max={1.4} step={0.1} onChange={s.setSu} format={(v) => `%${Math.round(v * 100)}`} renk="var(--ultramarin)" />
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
    <header className="relative z-[80] border-b border-[var(--cizgi)] bg-kagit md:sticky md:top-0" style={{ backgroundImage: 'var(--dok)', backgroundBlendMode: 'multiply' }}>
      <a href="#icerik" className="wbtn sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-sayfa" data-boy="k">
        İçeriğe geç
      </a>
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 md:flex-nowrap md:px-8">
        <a href="#ust" className="flex shrink-0 items-center gap-2 no-underline" aria-label="Sessiz Kitaplık, başa dön">
          <Ikon ad="kitap" boyut={38} />
          <span className="font-baslik text-[27px] leading-none font-semibold whitespace-nowrap text-murekkep italic">Sessiz Kitaplık</span>
        </a>
        <nav aria-label="Bölümler" className="order-last -mx-1 w-full min-w-0 overflow-x-auto px-1 pb-1 [scrollbar-width:none] md:order-none md:mx-0 md:w-auto md:flex-1 md:pb-0">
          <ul className="m-0 flex list-none gap-0.5 p-0 md:justify-center-safe">
            {NAV.map(([id, ad]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={aktif === id ? 'true' : undefined}
                  className={cx('flex min-h-12 items-center px-3 font-baslik text-[19px] font-medium whitespace-nowrap italic no-underline', aktif === id ? 'text-murekkep underline decoration-gul decoration-[3px] underline-offset-[7px]' : 'text-soluk hover:text-murekkep')}
                >
                  {ad}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <Popover.Root>
          <Popover.Trigger asChild>
            <WashButton renk="ocre" boy="k" className="ml-auto shrink-0 !min-h-12 !px-4 md:ml-3" aria-label="Görünüm ayarları" tohum={4}>
              <Ikon ad="damla" boyut={28} />
            </WashButton>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content align="end" sideOffset={12} collisionPadding={12} className="sayfa z-[95] max-h-[80vh] w-[min(400px,calc(100vw-24px))] overflow-y-auto p-6" data-ayarlar="">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="font-baslik text-[34px] leading-none font-medium italic">Ayarlar</p>
                <Popover.Close asChild>
                  <WashButton renk="gul" boy="k" className="!min-h-12 !px-4" aria-label="Kapat" tohum={6}>
                    <span aria-hidden="true" className="text-[26px] leading-none not-italic">
                      ×
                    </span>
                  </WashButton>
                </Popover.Close>
              </div>
              <Ayarlar />
              <p className="mt-5 flex gap-4 text-[17px]">
                <a href="../../">Tüm stiller</a>
                <a href="../026/">Stil 026</a>
              </p>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    </header>
  )
}
