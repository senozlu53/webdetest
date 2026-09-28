import { useEffect, useState } from 'react'
import { Popover } from 'radix-ui'
import { cx } from '../../shared/cx'
import { useMemphis, type Cvd, type HareketTercih } from '../lib/store'
import { UiIkon } from './Icons'
import { Sekil } from './Shapes'
import { Anahtar, Secim } from './ui'

export const NAV = [
  ['palet', 'Renk'],
  ['sekil', 'Şekil'],
  ['ajans', 'Ajans'],
  ['festival', 'Festival'],
  ['okul', 'Eğitim'],
  ['cark', 'Eğlence'],
  ['bilesenler', 'Bileşenler'],
  ['figma', 'Figma'],
  ['hareket', 'Hareket'],
  ['mobil', 'Mobil'],
  ['erisim', 'Erişim'],
] as const

export const CVD_AD: Record<Cvd, string> = { yok: 'Yok', protan: 'Protan', deutan: 'Döteran', tritan: 'Tritan', akromat: 'Renksiz' }

export function Ayarlar({ onek = '' }: { onek?: string }) {
  const s = useMemphis()
  return (
    <div className="grid grid-cols-1 gap-5">
      <Secim<HareketTercih> legend={`Hareket · şu an ${s.hareket ? 'açık' : 'kapalı'}`} name={`${onek}hareket`} value={s.hareketTercih} onChange={s.setHareketTercih} options={[{ id: 'oto', ad: 'Otomatik' }, { id: 'acik', ad: 'Açık' }, { id: 'kapali', ad: 'Kapalı' }]} />
      <Anahtar label="Yüksek kontrast" hint="Mürekkep ve bütün yazılar saf siyah." checked={s.yuksek} onChange={s.setYuksek} />
      <Anahtar label="Renk yerine desen de" hint="Renk kodlu öğeler nokta, çizgi ya da kafes deseni de taşır." checked={s.desen} onChange={s.setDesen} />
      <Secim<Cvd> legend="Renk körlüğü simülasyonu" name={`${onek}cvd`} value={s.cvd} onChange={s.setCvd} ton="camgobegi" options={(Object.keys(CVD_AD) as Cvd[]).map((k) => ({ id: k, ad: CVD_AD[k] }))} />
    </div>
  )
}

export function Header() {
  const s = useMemphis()
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
  const yuvarlak = 'grid size-11 shrink-0 place-items-center rounded-full border-[3px] border-ink bg-paper shadow-[3px_3px_0_var(--shadow)]'
  return (
    <header className="sticky top-0 z-[80] border-b-[4px] border-ink bg-paper">
      <a href="#icerik" className="pop sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:border-[4px] focus:px-[18px] focus:py-[6px]" data-boy="k">
        İçeriğe geç
      </a>
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5 md:flex-nowrap md:px-8">
        <a href="#ust" className="flex shrink-0 items-center gap-2 no-underline" aria-label="Konfeti Kolektif, başa dön">
          <Sekil tur="ucgen" ton="pembe" boyut={30} />
          <span className="dev text-[22px] tracking-[-0.02em]">Konfeti</span>
        </a>
        <nav aria-label="Bölümler" className="order-last -mx-1 w-full min-w-0 overflow-x-auto pb-1 [scrollbar-width:none] md:order-none md:mx-0 md:w-auto md:flex-1 md:pb-0">
          <ul className="m-0 flex list-none gap-1 p-0 md:justify-center-safe">
            {NAV.map(([id, ad]) => (
              <li key={id}>
                <a href={`#${id}`} aria-current={aktif === id ? 'true' : undefined} className={cx('block rounded-full border-[3px] px-3 py-1.5 text-[15px] font-bold whitespace-nowrap no-underline', aktif === id ? 'border-ink bg-yellow' : 'border-transparent hover:border-ink')}>
                  {ad}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            className={yuvarlak}
            onClick={() => {
              s.karistir()
              s.duyur('Kartların açıları karıştırıldı')
            }}
            aria-label="Açıları karıştır"
            data-karistir=""
          >
            <UiIkon ad="karistir" />
          </button>
          <Popover.Root>
            <Popover.Trigger asChild>
              <button type="button" className={yuvarlak} aria-label="Erişim ayarları">
                <UiIkon ad="ayar" />
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content align="end" sideOffset={12} collisionPadding={12} className="z-[95] w-[min(400px,calc(100vw-24px))] rounded-[22px] border-[4px] border-ink bg-paper p-5 text-ink shadow-[8px_8px_0_var(--shadow)]">
                <div className="mb-4 flex items-center justify-between">
                  <p className="dev text-[26px]">Ayarlar</p>
                  <Popover.Close className={yuvarlak} aria-label="Kapat">
                    <UiIkon ad="kapat" />
                  </Popover.Close>
                </div>
                <Ayarlar />
                <p className="mt-5 flex gap-4 font-bold">
                  <a href="../../">Tüm stiller</a>
                  <a href="../021/">Stil 021</a>
                </p>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>
      </div>
    </header>
  )
}
