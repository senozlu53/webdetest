import { motion, useTransform } from 'motion/react'
import { useEffect, useState } from 'react'
import { Popover } from 'radix-ui'
import { cx } from '../../shared/cx'
import { useKayma } from '../lib/kayma'
import { useKinetic, type HareketTercih, type HizAd, type Kontrast, type Siddet, type Tema, type Vurgu } from '../lib/store'
import { Harfler } from './Harfler'
import { Buton, Secim } from './ui'

export const NAV = [
  ['stil', 'Stil'],
  ['renk', 'Renk'],
  ['yazi', 'Yazı'],
  ['sekil', 'Şekil'],
  ['derinlik', 'Derinlik'],
  ['yuzey', 'Yüzey'],
  ['ikon', 'İkon'],
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
  const s = useKinetic()
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
      <Secim<Siddet>
        legend="Hareket şiddeti"
        name={`${onek}siddet`}
        value={s.siddet}
        onChange={s.setSiddet}
        options={[
          { id: 'tam', ad: 'Tam' },
          { id: 'hafif', ad: 'Hafif' },
        ]}
      />
      <Secim<HizAd>
        legend="Metin hızı"
        name={`${onek}hiz`}
        value={s.hiz}
        onChange={s.setHiz}
        options={[
          { id: 'yavas', ad: 'Yavaş' },
          { id: 'normal', ad: 'Normal' },
          { id: 'hizli', ad: 'Hızlı' },
        ]}
      />
      <Secim<Tema>
        legend="Zemin"
        name={`${onek}tema`}
        value={s.tema}
        onChange={s.setTema}
        options={[
          { id: 'kara', ad: 'Siyah' },
          { id: 'ak', ad: 'Beyaz' },
        ]}
      />
      <Secim<Vurgu>
        legend="Neon vurgu"
        name={`${onek}vurgu`}
        value={s.vurgu}
        onChange={s.setVurgu}
        options={[
          { id: 'asit', ad: 'Asit yeşili' },
          { id: 'kirmizi', ad: 'Elektrik kırmızısı' },
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
  const { hareket, durdur } = useKinetic()
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
          <a href="#ust" className="dev text-[24px] no-underline max-[480px]:text-[18px] max-[340px]:text-[15px]" aria-label="Devinim, başa dön">
            <Harfler metin="Devinim" efekt={['imlec']} ad="marka" />
          </a>
          <div className="flex items-center gap-2 max-[480px]:gap-1.5">
            <Buton ton="vurgu" aria-pressed={!hareket} onClick={durdur} data-durdur="" className="!min-w-0 max-[480px]:!px-2.5 max-[480px]:!text-[12px]">
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
                    <p className="dev text-[28px]">Ayarlar</p>
                    <Popover.Close asChild>
                      <Buton>Kapat</Buton>
                    </Popover.Close>
                  </div>
                  <Ayarlar />
                  <p className="mt-6 flex gap-6 text-[15px]">
                    <a href="../../">Tüm stiller</a>
                    <a href="../033/">Stil 033</a>
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
                <a href={`#${id}`} aria-current={aktif === id ? 'true' : undefined} className={cx('etiket relative flex min-h-12 items-center px-3 whitespace-nowrap no-underline', aktif === id ? 'text-vurgu-yazi' : 'text-metin')}>
                  <span lang={id === 'figma' || id === 'css' ? 'en' : undefined}>{ad}</span>
                  {aktif === id ? <span className="absolute inset-x-3 bottom-1.5 h-[3px] bg-vurgu" aria-hidden="true" /> : null}
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
