import { useEffect, useState } from 'react'
import { Popover } from 'radix-ui'
import { cx } from '../../shared/cx'
import { useBotanical, type Doku, type HareketTercih, type Kontrast, type Ruzgar, type TemaTercih } from '../lib/store'
import { EcoButton } from './Botanical'
import { Ikon } from './Ikon'
import { Secim } from './ui'

export const NAV = [
  ['palet', 'Renk'],
  ['yazi', 'Yazı'],
  ['sekil', 'Şekil'],
  ['derinlik', 'Derinlik'],
  ['doku', 'Doku'],
  ['ikonlar', 'İkon'],
  ['pazar', 'Pazar'],
  ['kozmetik', 'Kozmetik'],
  ['tarim', 'Tarım'],
  ['turizm', 'Turizm'],
  ['bilesenler', 'Bileşenler'],
  ['figma', 'Figma'],
  ['css', 'CSS'],
  ['hareket', 'Hareket'],
  ['mobil', 'Mobil'],
  ['erisim', 'Erişim'],
] as const

export function Ayarlar({ onek = '' }: { onek?: string }) {
  const s = useBotanical()
  const temaAd = { keten: 'keten', toprak: 'toprak', orman: 'orman' }[s.tema]
  return (
    <div className="grid grid-cols-1 gap-6">
      <Secim<TemaTercih>
        legend={`Tema · şu an ${temaAd}`}
        name={`${onek}tema`}
        value={s.temaTercih}
        onChange={s.setTemaTercih}
        options={[
          { id: 'oto', ad: 'Oto' },
          { id: 'keten', ad: 'Keten' },
          { id: 'toprak', ad: 'Toprak' },
          { id: 'orman', ad: 'Orman' },
        ]}
      />
      <Secim<Doku>
        legend="Doku"
        name={`${onek}doku`}
        value={s.doku}
        onChange={s.setDoku}
        options={[
          { id: 'keten', ad: 'Keten' },
          { id: 'kraft', ad: 'Kraft kâğıt' },
          { id: 'toprak', ad: 'Toprak tanesi' },
          { id: 'duz', ad: 'Düz' },
        ]}
      />
      <Secim<Ruzgar>
        legend="Rüzgâr"
        name={`${onek}ruzgar`}
        value={s.ruzgar}
        onChange={s.setRuzgar}
        options={[
          { id: 'sakin', ad: 'Sakin' },
          { id: 'orta', ad: 'Orta' },
          { id: 'guclu', ad: 'Güçlü' },
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
    </div>
  )
}

export function Header() {
  const [aktif, setAktif] = useState('')
  const { sepetAdet } = useBotanical()
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
      <a href="#icerik" className="ebtn sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[100]" data-boy="k">
        <span className="ebtn-ic">İçeriğe geç</span>
      </a>
      <header className="mx-auto flex w-full max-w-[1240px] items-center justify-between gap-4 px-5 pt-6 pb-4 sm:px-8 lg:px-12">
        <a href="#ust" className="flex items-center gap-3 no-underline" aria-label="Fidan, başa dön">
          <span className="grid size-12 place-items-center bg-zeytin text-[#f8f4ea]" style={{ borderRadius: 'var(--r-tas)' }} aria-hidden="true">
            <Ikon ad="filiz" boyut={28} />
          </span>
          <span>
            <span className="block font-baslik text-[26px] leading-none font-semibold text-metin">Fidan</span>
            <span className="kicker block !text-[11px] !tracking-[0.12em] max-[380px]:hidden">Organik pazar · Tarım · Doğa</span>
          </span>
        </a>
        <div className="flex items-center gap-2">
          <EcoButton ton="hayalet" boy="k" aria-label={`Sepet, ${sepetAdet} ürün`} onClick={() => document.getElementById('sepet-panel')?.scrollIntoView({ behavior: 'instant' })} ikon={<Ikon ad="sepet" boyut={22} />} data-sepet-dugme={sepetAdet}>
            <span className="rakam" aria-hidden="true">
              {sepetAdet}
            </span>
          </EcoButton>
          <Popover.Root>
            <Popover.Trigger asChild>
              <EcoButton ton="metin" boy="k" aria-label="Görünüm ayarları" ikon={<Ikon ad="menu" boyut={20} />}>
                <span className="max-[420px]:sr-only">Görünüm</span>
              </EcoButton>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content align="end" sideOffset={12} collisionPadding={12} className="yuzey relative z-[95] max-h-[80vh] w-[min(440px,calc(100vw-24px))] overflow-y-auto p-7" data-ayarlar="" style={{ boxShadow: 'var(--golge-3)' }}>
                <div className="mb-5 flex items-center justify-between gap-3">
                  <p className="font-baslik text-[28px] leading-none font-semibold">Görünüm</p>
                  <Popover.Close asChild>
                    <EcoButton ton="metin" boy="k" aria-label="Kapat" ikon={<Ikon ad="kapat" boyut={18} />}>
                      Kapat
                    </EcoButton>
                  </Popover.Close>
                </div>
                <Ayarlar />
                <p className="mt-6 flex gap-7 text-[17px]">
                  <a href="../../">Tüm stiller</a>
                  <a href="../030/">Stil 030</a>
                </p>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>
      </header>
      <nav aria-label="Bölümler" className="sticky top-0 z-[80]" style={{ backgroundColor: 'var(--zemin)' }}>
        <ul className="m-0 mx-auto flex max-w-[1240px] list-none gap-1 overflow-x-auto p-0 px-3 [scrollbar-width:none] sm:px-6 lg:px-10">
          {NAV.map(([id, ad]) => (
            <li key={id} className="shrink-0">
              <a href={`#${id}`} aria-current={aktif === id ? 'true' : undefined} className={cx('relative flex min-h-12 items-center px-3.5 font-[family-name:var(--font-yumusak)] text-[15.5px] font-bold whitespace-nowrap no-underline', aktif === id ? 'text-metin' : 'text-soluk hover:text-metin')}>
                <span lang={id === 'figma' || id === 'css' ? 'en' : undefined}>{ad}</span>
                {aktif === id ? <span className="absolute inset-x-3 bottom-1.5 h-[5px] bg-kil" style={{ borderRadius: '99px 60px 99px 70px' }} aria-hidden="true" /> : null}
              </a>
            </li>
          ))}
        </ul>
        <div className="su-akis !h-[14px] opacity-70" aria-hidden="true" style={{ ['--k' as string]: 1.4 }} />
      </nav>
    </>
  )
}
