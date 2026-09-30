import { motion, useTransform } from 'motion/react'
import { useEffect, useState } from 'react'
import { Popover } from 'radix-ui'
import { cx } from '../../shared/cx'
import { useVariable, type Esneklik, type Glitch, type HareketTercih, type Kontrast, type Palet } from '../lib/store'
import { useKayma } from '../lib/kayma'
import { Buton, Secim } from './ui'

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
  const s = useVariable()
  return (
    <div className="grid grid-cols-1 gap-6">
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
      <Secim<Esneklik>
        legend={`Eksenler · şu an ${s.kilitli ? 'kilitli (wght 400)' : 'serbest'}`}
        name={`${onek}esneklik`}
        value={s.esneklik}
        onChange={s.setEsneklik}
        options={[
          { id: 'oto', ad: 'Dar ekranda kilitle' },
          { id: 'kilitli', ad: 'Hep kilitli' },
        ]}
      />
      <Secim<Palet>
        legend="Palet"
        name={`${onek}palet`}
        value={s.palet}
        onChange={s.setPalet}
        options={[
          { id: 'ham', ad: 'Ham' },
          { id: 'ters', ad: 'Ters' },
          { id: 'kobalt', ad: 'Kobalt' },
          { id: 'beton', ad: 'Beton' },
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
      <Secim<Glitch>
        legend="Glitch ve piksel"
        name={`${onek}glitch`}
        value={s.glitch}
        onChange={s.setGlitch}
        options={[
          { id: 'acik', ad: 'Açık' },
          { id: 'kapali', ad: 'Kapalı' },
        ]}
      />
    </div>
  )
}

export function Header() {
  const { hareket, durdur } = useVariable()
  const { ilerleme } = useKayma()
  const [aktif, setAktif] = useState('')
  const [yuzde, setYuzde] = useState(0)
  const olcek = useTransform(ilerleme, (v) => Math.max(0, Math.min(1, v)))
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
    const oku = () => setYuzde(Math.round(Math.max(0, Math.min(1, ilerleme.get())) * 100))
    oku()
    return ilerleme.on('change', oku)
  }, [ilerleme])
  return (
    <>
      <a href="#icerik" className="kbtn sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[100] !bg-zemin">
        İçeriğe geç
      </a>
      <header className="sticky top-0 z-[90] bg-zemin" data-header="">
        <div className="mx-auto flex w-full max-w-[calc(1440px+2*var(--kenar))] items-center justify-between gap-3 px-[var(--kenar)] py-3">
          <a href="#ust" className="inline-flex min-h-12 items-center text-[24px] no-underline max-[480px]:text-[19px]" aria-label="Büküm, başa dön" style={{ fontFamily: 'var(--font-disp)', fontVariationSettings: "'wght' 800, 'wdth' 100, 'opsz' 24", letterSpacing: '-0.01em' }} data-marka="">
            BÜKÜM
          </a>
          <div className="flex items-center gap-2 max-[480px]:gap-1.5">
            <Buton ton="patlama" aria-pressed={!hareket} onClick={durdur} data-durdur="" className="!min-w-0 max-[480px]:!px-2.5 max-[480px]:!text-[12px]">
              {hareket ? 'Durdur' : 'Oynat'}
            </Buton>
            <Popover.Root>
              <Popover.Trigger asChild>
                <Buton aria-label="Görünüm ve hareket ayarları" className="!min-w-0 max-[480px]:!px-2.5 max-[480px]:!text-[12px]">
                  <span className="max-[340px]:hidden">Ayarlar</span>
                  <span className="hidden max-[340px]:inline">Ayar</span>
                </Buton>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content align="end" sideOffset={8} collisionPadding={12} className="relative z-[95] max-h-[80vh] w-[min(460px,calc(100vw-24px))] overflow-y-auto border-2 border-metin bg-zemin p-6" data-ayarlar="">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <p className="text-[24px]" style={{ fontFamily: 'var(--font-disp)', fontVariationSettings: "'wght' 800, 'wdth' 100, 'opsz' 24" }}>
                      AYARLAR
                    </p>
                    <Popover.Close asChild>
                      <Buton glif="×">Kapat</Buton>
                    </Popover.Close>
                  </div>
                  <Ayarlar />
                  <p className="mt-6 flex gap-6 text-[15px]">
                    <a href="../../">Tüm stiller</a>
                    <a href="../034/">Stil 034</a>
                  </p>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>
        </div>
        <nav aria-label="Bölümler" className="border-y border-hat">
          <ul className="m-0 mx-auto flex max-w-[calc(1440px+2*var(--kenar))] list-none gap-0 overflow-x-auto p-0 px-[calc(var(--kenar)-12px)] [scrollbar-width:none]">
            {NAV.map(([id, ad]) => (
              <li key={id} className="shrink-0">
                <a href={`#${id}`} aria-current={aktif === id ? 'true' : undefined} className={cx('etiket relative flex min-h-12 items-center px-3 whitespace-nowrap no-underline', aktif === id ? 'text-patlama-yazi' : 'text-metin')}>
                  <span lang={id === 'figma' || id === 'css' ? 'en' : undefined}>{ad}</span>
                  {aktif === id ? <span className="absolute inset-x-3 bottom-1.5 h-[3px] bg-patlama" aria-hidden="true" /> : null}
                </a>
              </li>
            ))}
            <li className="ml-auto flex shrink-0 items-center pr-3 pl-6" aria-hidden="true">
              <span className="rakam text-[14px] text-soluk" data-yuzde={yuzde}>
                %{yuzde}
              </span>
            </li>
          </ul>
          <div className="ilerleme-iz" aria-hidden="true">
            <motion.div className="ilerleme-dolu" style={{ scaleX: olcek }} />
          </div>
        </nav>
      </header>
    </>
  )
}
