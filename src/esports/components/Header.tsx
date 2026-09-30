import { Popover } from 'radix-ui'
import { useEffect, useRef, useState } from 'react'
import { cx } from '../../shared/cx'
import { useEsports, type Aci, type Doku, type HareketTercih, type Kontrast, type Vurgu } from '../lib/store'
import { SlantedButton } from './Dugme'
import { Secim } from './ui'

export const NAV = [
  ['stil', 'Stil'],
  ['renk', 'Renk'],
  ['yazi', 'Yazı'],
  ['sekil', 'Şekil'],
  ['derinlik', 'Derinlik'],
  ['yuzey', 'Yüzey'],
  ['ikon', 'Simge'],
  ['alanlar', 'Alanlar'],
  ['bilesenler', 'Bileşenler'],
  ['figma', 'Figma'],
  ['css', 'CSS'],
  ['hareket', 'Hareket'],
  ['mobil', 'Mobil'],
  ['erisim', 'Erişim'],
] as const

/** Görünüm ayarları: başlıkta açılır pencerede ve Erişim bölümünde aynı bileşen */
export function Ayarlar({ onek = '' }: { onek?: string }) {
  const s = useEsports()
  return (
    <div className="grid grid-cols-1 gap-6">
      <Secim<Vurgu>
        legend="Vurgu rengi"
        name={`${onek}vurgu`}
        value={s.vurgu}
        onChange={s.setVurgu}
        options={[
          { id: 'mavi', ad: 'Mavi' },
          { id: 'lime', ad: 'Lime' },
          { id: 'turuncu', ad: 'Turuncu' },
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
      <Secim<Aci>
        legend={`Açılar · şu an ${s.sade ? 'yumuşak' : 'keskin'}`}
        name={`${onek}aci`}
        value={s.aci}
        onChange={s.setAci}
        options={[
          { id: 'oto', ad: 'Dar ekranda yumuşat' },
          { id: 'tam', ad: 'Keskin' },
          { id: 'duz', ad: 'Düz' },
        ]}
      />
      <Secim<Doku>
        legend="Karbon fiber doku"
        name={`${onek}doku`}
        value={s.doku}
        onChange={s.setDoku}
        options={[
          { id: 'acik', ad: 'Açık' },
          { id: 'kapali', ad: 'Kapalı' },
        ]}
      />
      <Secim<HareketTercih>
        legend={`Hareket · şu an ${s.hareket ? 'açık' : 'durdu'}`}
        name={`${onek}hareket`}
        value={s.hareketTercih}
        onChange={s.setHareketTercih}
        options={[
          { id: 'oto', ad: 'Sisteme uy' },
          { id: 'acik', ad: 'Açık' },
          { id: 'kapali', ad: 'Durdur' },
        ]}
      />
    </div>
  )
}

function Logo() {
  return (
    <svg viewBox="0 0 40 40" width="38" height="38" aria-hidden="true" focusable="false">
      <path d="M4 4H28L36 12V36H12L4 28Z" fill="var(--vurgu)" />
      <path d="M9 9H26L31 14V31H14L9 26Z" fill="#0d0e12" />
      <path d="M14 27L21 12H26L19 27Z" fill="var(--vurgu-2)" />
    </svg>
  )
}

export function Header() {
  const [aktif, setAktif] = useState('')
  const dolu = useRef<HTMLSpanElement>(null)
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
  useEffect(() => {
    let kare = 0
    const guncelle = () => {
      kare = 0
      const h = document.documentElement
      const oran = h.scrollHeight - h.clientHeight > 0 ? h.scrollTop / (h.scrollHeight - h.clientHeight) : 0
      dolu.current?.style.setProperty('--ilerleme', Math.max(0, Math.min(1, oran)).toFixed(4))
    }
    const dinle = () => {
      if (!kare) kare = requestAnimationFrame(guncelle)
    }
    guncelle()
    window.addEventListener('scroll', dinle, { passive: true })
    window.addEventListener('resize', dinle)
    return () => {
      window.removeEventListener('scroll', dinle)
      window.removeEventListener('resize', dinle)
      if (kare) cancelAnimationFrame(kare)
    }
  }, [])
  return (
    <>
      <a href="#icerik" className="bt bt-dar sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[300]" data-ton="birincil">
        <span className="bt-yazi">İçeriğe geç</span>
      </a>
      <header className="ust" data-header="">
        <div className="kap relative flex items-center justify-between gap-3 py-2">
          <a href="#ust" aria-label="Vektör-9, başa dön" className="marka" data-marka="">
            <Logo />
            <span className="marka-yazi">
              Vektör<b>-9</b>
            </span>
          </a>
          <div className="flex items-center gap-4">
            <p className="flex items-center gap-3 max-[900px]:hidden" data-durum="">
              <span className="canli-rozet">
                <span className="canli-nokta" aria-hidden="true" />
                Canlı
              </span>
              <span className="rakam text-[1.0625rem] font-bold">V9 1–1 GH</span>
            </p>
            <Popover.Root>
              <Popover.Trigger asChild>
                <SlantedButton dar aria-label="Görünüm ve hareket ayarları" data-ayarlar-dugme="">
                  Ayarlar
                </SlantedButton>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content align="end" sideOffset={10} collisionPadding={12} className="pop z-[95] max-h-[80vh] w-[min(440px,calc(100vw-24px))] overflow-y-auto p-6" data-ayarlar="">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <p className="t-h3">Ayarlar</p>
                    <Popover.Close asChild>
                      <SlantedButton dar ton="hayalet">
                        Kapat
                      </SlantedButton>
                    </Popover.Close>
                  </div>
                  <Ayarlar />
                  <p className="mt-6 flex gap-6 text-[1.0625rem]">
                    <a href="../../">Tüm stiller</a>
                    <a href="../037/">Stil 037</a>
                  </p>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>
        </div>
        <nav aria-label="Bölümler" className="border-t border-[color:rgb(242_246_250/0.14)]">
          <ul className="kap flex list-none gap-0 overflow-x-auto [scrollbar-width:none]">
            {NAV.map(([id, ad]) => (
              <li key={id} className="shrink-0">
                <a href={`#${id}`} aria-current={aktif === id ? 'true' : undefined} className={cx('nav-a')}>
                  <span lang={id === 'figma' || id === 'css' ? 'en' : undefined}>{ad}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ilerleme-iz" aria-hidden="true">
          <span className="ilerleme-dolu" ref={dolu} />
        </div>
      </header>
    </>
  )
}
