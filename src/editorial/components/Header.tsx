import { Popover } from 'radix-ui'
import { useEffect, useRef, useState } from 'react'
import { cx } from '../../shared/cx'
import { SAYI } from '../lib/data'
import { useEditorial, type Aralik, type Boyut, type HareketTercih, type Kontrast, type Tema } from '../lib/store'
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
  const s = useEditorial()
  return (
    <div className="grid grid-cols-1 gap-6">
      <Secim<Tema>
        legend="Kâğıt"
        name={`${onek}tema`}
        value={s.tema}
        onChange={s.setTema}
        options={[
          { id: 'krem', ad: 'Krem' },
          { id: 'beyaz', ad: 'Beyaz' },
          { id: 'gece', ad: 'Gece' },
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
      <Secim<Boyut>
        legend="Yazı boyutu"
        name={`${onek}boyut`}
        value={s.boyut}
        onChange={s.setBoyut}
        options={[
          { id: '100', ad: '%100' },
          { id: '112', ad: '%112' },
          { id: '125', ad: '%125' },
        ]}
      />
      <Secim<Aralik>
        legend="Metin aralığı testi"
        name={`${onek}aralik`}
        value={s.aralik}
        onChange={s.setAralik}
        options={[
          { id: 'normal', ad: 'Normal' },
          { id: 'genis', ad: 'Geniş' },
        ]}
      />
      <Secim<HareketTercih>
        legend={`Geçiş hareketi · şu an ${s.hareket ? 'açık' : 'durdu'}`}
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

export function Header() {
  const { hareket, izgara, setIzgara, duyur } = useEditorial()
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

  // okuma ilerlemesi: konumdur, hareket değildir; hareket kapalıyken de görünür
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

  // Madde 16: bölümler arası geçişte hedef yalnız solar (yer değiştirme yok)
  const gecis = (id: string) => {
    if (!hareket) return
    const hedef = document.getElementById(id)
    hedef?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 240, easing: 'ease-out' })
  }

  return (
    <>
      <a href="#icerik" className="dugme sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[100] !bg-zemin">
        İçeriğe geç
      </a>
      <header className="baslik" data-header="">
        <div className="kap flex items-center justify-between gap-3 py-2">
          <div className="flex min-w-0 items-baseline gap-5">
            <a href="#ust" aria-label="Kolon, başa dön" className="inline-flex min-h-12 items-center no-underline" data-marka="" style={{ fontFamily: 'var(--font-serif)', fontWeight: 800, fontSize: '1.75rem', letterSpacing: '-0.03em', lineHeight: 1 }}>
              KOLON
            </a>
            <span className="t-etiket t-soluk max-[767px]:hidden">
              Sayı <span className="rakam">{SAYI.no}</span> · {SAYI.donem}
            </span>
          </div>
          <div className="flex items-center gap-2 max-[480px]:gap-1.5">
            <Buton
              ikon="izgara"
              aria-pressed={izgara === 'acik'}
              onClick={() => {
                setIzgara(izgara === 'acik' ? 'kapali' : 'acik')
                duyur(izgara === 'acik' ? 'Kolon kılavuzu kapandı' : 'Kolon kılavuzu açıldı')
              }}
              data-izgara-dugme=""
              className="!min-w-0 max-[480px]:!px-3"
              aria-label="Kolon kılavuzunu göster"
            >
              <span className="max-[560px]:sr-only">Izgara</span>
            </Buton>
            <Popover.Root>
              <Popover.Trigger asChild>
                <Buton aria-label="Görünüm ve hareket ayarları" className="!min-w-0 max-[480px]:!px-3" data-ayarlar-dugme="">
                  <span>Ayarlar</span>
                </Buton>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content align="end" sideOffset={8} collisionPadding={12} className="kutu-koyu relative z-[95] max-h-[80vh] w-[min(440px,calc(100vw-24px))] overflow-y-auto bg-zemin p-6" data-ayarlar="">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <p className="t-h3">Ayarlar</p>
                    <Popover.Close asChild>
                      <Buton ikon="kapat">Kapat</Buton>
                    </Popover.Close>
                  </div>
                  <Ayarlar />
                  <p className="sans mt-6 flex gap-6 text-[0.9375rem]">
                    <a href="../../">Tüm stiller</a>
                    <a href="../035/">Stil 035</a>
                  </p>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>
        </div>
        <nav aria-label="Bölümler" className="border-t border-cizgi">
          <ul className="kap flex list-none gap-0 overflow-x-auto [scrollbar-width:none]">
            {NAV.map(([id, ad]) => (
              <li key={id} className="shrink-0">
                <a href={`#${id}`} onClick={() => gecis(id)} aria-current={aktif === id ? 'true' : undefined} className={cx('t-etiket relative flex min-h-12 items-center pr-5 whitespace-nowrap no-underline', aktif === id ? 'text-metin' : 't-soluk')}>
                  <span lang={id === 'figma' || id === 'css' ? 'en' : undefined} className={aktif === id ? 'border-b-2 border-metin pb-0.5' : 'pb-0.5'}>
                    {ad}
                  </span>
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
