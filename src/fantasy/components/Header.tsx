import { Popover } from 'radix-ui'
import { useEffect, useRef, useState } from 'react'
import { cx } from '../../shared/cx'
import { useOyun } from '../lib/oyun'
import { useFantasy, type HareketTercih, type Kontrast, type Parcacik, type Suslenme, type Tema } from '../lib/store'
import { HealthBar } from './Bar'
import { Ikon } from './Ikon'
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
  const s = useFantasy()
  return (
    <div className="grid grid-cols-1 gap-6">
      <Secim<Tema>
        legend="Sayfa zemini"
        name={`${onek}tema`}
        value={s.tema}
        onChange={s.setTema}
        options={[
          { id: 'zindan', ad: 'Zindan' },
          { id: 'parsomen', ad: 'Parşömen' },
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
      <Secim<Suslenme>
        legend={`Süslemeler · şu an ${s.sade ? 'sade' : 'tam'}`}
        name={`${onek}suslenme`}
        value={s.suslenme}
        onChange={s.setSuslenme}
        options={[
          { id: 'oto', ad: 'Dar ekranda sade' },
          { id: 'tam', ad: 'Tam' },
          { id: 'sade', ad: 'Sade' },
          { id: 'yok', ad: 'Yok' },
        ]}
      />
      <Secim<Parcacik>
        legend="Altın yaldız"
        name={`${onek}parcacik`}
        value={s.parcacik}
        onChange={s.setParcacik}
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

export function Header() {
  const { k } = useOyun()
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
      <a href="#icerik" className="dugme sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[300]">
        İçeriğe geç
      </a>
      <header className="baslik" data-header="">
        <div className="kap flex items-center justify-between gap-3 py-2">
          <a href="#ust" aria-label="Kadim Diyar, başa dön" className="marka" data-marka="">
            <span className="marka-arma" aria-hidden="true">
              <Ikon ad="kalkan" boy={36} />
            </span>
            <span className="marka-yazi">Kadim Diyar</span>
          </a>
          <div className="flex items-center gap-3">
            <div className="durum max-[900px]:hidden" aria-label="Kahraman durumu" data-durum="">
              <span className="t-etiket t-soluk">Sv. {k.seviye}</span>
              <HealthBar deger={k.can} azami={k.canAzami} tur="can" kisa className="w-24" />
              <HealthBar deger={k.mana} azami={k.manaAzami} tur="mana" kisa className="w-24" />
            </div>
            <p className="altin-sayac rakam max-[480px]:hidden" data-altin={k.altin} aria-label={`${k.altin} altın`}>
              <Ikon ad="altin" boy={22} /> {k.altin.toLocaleString('tr-TR')}
            </p>
            <Popover.Root>
              <Popover.Trigger asChild>
                <Buton aria-label="Görünüm ve hareket ayarları" className="!min-w-0 max-[480px]:!px-3" data-ayarlar-dugme="">
                  <span>Ayarlar</span>
                </Buton>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content align="end" sideOffset={8} collisionPadding={12} className="panel z-[95] max-h-[80vh] w-[min(440px,calc(100vw-24px))] overflow-y-auto p-6" data-yuzey="tas" data-ayarlar="" data-sessiz="">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <p className="t-h3">Ayarlar</p>
                    <Popover.Close asChild>
                      <Buton>Kapat</Buton>
                    </Popover.Close>
                  </div>
                  <Ayarlar />
                  <p className="mt-6 flex gap-6 text-[1rem]">
                    <a href="../../">Tüm stiller</a>
                    <a href="../036/">Stil 036</a>
                  </p>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>
        </div>
        <nav aria-label="Bölümler" className="baslik-nav">
          <ul className="kap flex list-none gap-0 overflow-x-auto [scrollbar-width:none]">
            {NAV.map(([id, ad]) => (
              <li key={id} className="shrink-0">
                <a href={`#${id}`} aria-current={aktif === id ? 'true' : undefined} className={cx('t-etiket relative flex min-h-12 items-center px-3 whitespace-nowrap no-underline', aktif === id ? 'nav-aktif' : 't-soluk')}>
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
