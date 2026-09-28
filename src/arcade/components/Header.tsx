import { useEffect, useState } from 'react'
import { Popover } from 'radix-ui'
import { cx } from '../../shared/cx'
import { useArcade, type HareketTercih, type OlcekTercih } from '../lib/store'
import { ArcadeText } from './ArcadeText'
import { Ikon } from './Sprite'
import { Anahtar, Secim } from './ui'

export const NAV = [
  ['temel', 'Temel'],
  ['turnuva', 'Turnuva'],
  ['oyun', 'Oyun'],
  ['rpg', 'RPG'],
  ['envanter', 'Envanter'],
  ['bilesenler', 'Bileşenler'],
  ['figma', 'Figma'],
  ['css', 'CSS'],
  ['hareket', 'Hareket'],
  ['olcek', 'Ölçek'],
  ['erisim', 'Erişim'],
] as const

export const pad = (n: number, l = 6) => String(Math.max(0, Math.floor(n))).padStart(l, '0')

export function Ayarlar({ onek = '' }: { onek?: string }) {
  const s = useArcade()
  return (
    <div className="grid grid-cols-1 gap-6">
      <Secim legend="Tema" name={`${onek}tema`} value={s.theme} onChange={s.setTheme} options={[{ id: 'dark', ad: 'Salon' }, { id: 'light', ad: 'Kılavuz' }]} />
      <Secim<HareketTercih> legend={`Yanıp sönme ve hareket · şu an ${s.hareket ? 'açık' : 'kapalı'}`} name={`${onek}hareket`} value={s.hareketTercih} onChange={s.setHareketTercih} options={[{ id: 'oto', ad: 'Oto' }, { id: 'acik', ad: 'Açık' }, { id: 'kapali', ad: 'Kapalı' }]} />
      <Secim<OlcekTercih> legend={`Ölçek · şu an ${s.olcek.k}x${s.olcekTercih !== 'oto' && +s.olcekTercih > s.olcek.k ? ` (ekran dar: en çok ${s.olcek.tavan}x)` : ''}`} name={`${onek}olcek`} value={s.olcekTercih} onChange={s.setOlcekTercih} options={[{ id: 'oto', ad: 'Oto' }, { id: '2', ad: '2x' }, { id: '3', ad: '3x' }, { id: '4', ad: '4x' }]} />
      <Anahtar label="CRT efektleri" hint="Tarama çizgisi, gren ve renk sapması." checked={s.crt} onChange={s.setCrt} />
      <Anahtar label="8-bit ses" hint="Jeton, vuruş ve oyun sonu sesleri. Kapalı başlar." checked={s.ses} onChange={s.setSes} />
    </div>
  )
}

/** Üst HUD: skorlar, jeton, tema, ayarlar ve bölüm gezintisi */
export function Header() {
  const s = useArcade()
  const [aktif, setAktif] = useState('')
  const hi = Math.max(s.birUp, ...s.skorlar.map((x) => x.puan))
  useEffect(() => {
    const els = NAV.map(([id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (es) => {
        const v = es.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (v) setAktif(v.target.id)
      },
      { rootMargin: '-25% 0px -65% 0px' },
    )
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [])
  const kare = 'pbtn size-[calc(var(--u)*16)] shrink-0 !p-0'
  return (
    <header className="relative z-[80] bg-bg shadow-[0_var(--u)_0_0_var(--edge)] md:sticky md:top-0">
      <a href="#icerik" className="pbtn sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50" data-ton="sari">
        İçeriğe geç
      </a>
      <div className="mx-auto flex max-w-[calc(var(--u)*400)] flex-wrap items-center gap-x-4 gap-y-2 px-4 pt-3 pb-2 md:px-8">
        <a href="#ust" className="shrink-0 no-underline" aria-label="Jeton Salonu, başa dön">
          <ArcadeText boyut="s" ton="sari" className="whitespace-nowrap">
            Jeton<span data-ton="kirmizi" className="text-tx">·</span>Salonu
          </ArcadeText>
        </a>
        <dl className="hud order-last flex w-full flex-wrap gap-x-6 gap-y-1 text-body md:order-none md:w-auto md:flex-1 md:justify-center" aria-label="Skor göstergesi">
          <div className="flex gap-2">
            <dt data-ton="kirmizi" className="text-tx">
              <span lang="en" aria-hidden="true">1UP</span>
              <span className="sr-only">Oyuncu 1 skoru</span>
            </dt>
            <dd className="tabnum m-0" data-birup="">{pad(s.birUp)}</dd>
          </div>
          <div className="flex gap-2">
            <dt data-ton="sari" className="text-tx">
              <span lang="en" aria-hidden="true">Hi-Score</span>
              <span className="sr-only">En yüksek skor</span>
            </dt>
            <dd className="tabnum m-0">{pad(hi)}</dd>
          </div>
          <div className="flex gap-2">
            <dt data-ton="yesil" className="text-tx">
              <span lang="en" aria-hidden="true">Credit</span>
              <span className="sr-only">Kredi</span>
            </dt>
            <dd className="tabnum m-0" data-kredi="">
              {s.kredi}
            </dd>
          </div>
        </dl>
        <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            className="pbtn"
            data-ton="sari"
            data-boy="k"
            onClick={() => {
              s.jetonAt()
              s.duyur(`Jeton atıldı. Kredi ${Math.min(9, s.kredi + 1)}`)
            }}
            data-jeton-at=""
          >
            <Ikon ad="jeton" buyukluk={1} />
            Jeton at
          </button>
          <button type="button" className={kare} data-ton="beyaz" onClick={() => s.setTheme(s.theme === 'dark' ? 'light' : 'dark')} aria-label={s.theme === 'dark' ? 'Kılavuz temasına geç (açık)' : 'Salon temasına geç (siyah)'}>
            <Ikon ad={s.theme === 'dark' ? 'gunes' : 'ay'} />
          </button>
          <Popover.Root>
            <Popover.Trigger asChild>
              <button type="button" className={kare} data-ton="beyaz" aria-label="Ayarlar">
                <Ikon ad="menu" />
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content align="end" sideOffset={12} collisionPadding={12} className="px z-[95] w-[min(calc(var(--u)*170),calc(100vw-24px))] p-5 text-ink" data-ton="sari">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <ArcadeText as="p" boyut="s" ton="sari">
                    Ayarlar
                  </ArcadeText>
                  <Popover.Close className={kare} data-ton="beyaz" aria-label="Kapat">
                    <Ikon ad="kapat" />
                  </Popover.Close>
                </div>
                <Ayarlar />
                <p className="mt-6">
                  <a href="../../">Tüm stiller</a> · <a href="../020/">Stil 020</a>
                </p>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>
      </div>
      <nav aria-label="Bölümler" className="mx-auto max-w-[calc(var(--u)*400)] overflow-x-auto px-4 pb-2 [scrollbar-width:thin] md:px-8">
        <ul className="m-0 flex list-none gap-1 p-0">
          {NAV.map(([id, ad]) => (
            <li key={id}>
              <a href={`#${id}`} aria-current={aktif === id ? 'true' : undefined} className={cx('block px-2 py-2 font-ps text-xs whitespace-nowrap uppercase no-underline', aktif === id ? 'text-[var(--t-yellow)]' : 'text-ink')}>
                <Ikon ad="sag" buyukluk={1} className={aktif === id ? 'mr-1' : 'invisible mr-1'} />
                {ad}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
