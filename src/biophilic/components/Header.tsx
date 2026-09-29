import { useEffect, useMemo, useState } from 'react'
import { Popover } from 'radix-ui'
import { cx } from '../../shared/cx'
import { useBiophilic, type Doku, type DogaTercih, type HareketTercih, type Kontrast } from '../lib/store'
import { gunes, karisim, MODLAR, MOD_SIRA, saatMetni, type ModAd } from '../lib/zaman'
import { BioButton } from './Biophilic'
import { Ikon } from './Ikon'
import { Aralik, Secim } from './ui'

export const NAV = [
  ['karakter', 'Karakter'],
  ['palet', 'Renk'],
  ['yazi', 'Yazı'],
  ['sekil', 'Şekil'],
  ['derinlik', 'Işık'],
  ['doku', 'Doku'],
  ['ikonlar', 'İkon'],
  ['nefes', 'Nefes'],
  ['bitki', 'Bitki'],
  ['portfolyo', 'Portfolyo'],
  ['bilesenler', 'Bileşenler'],
  ['figma', 'Figma'],
  ['css', 'CSS'],
  ['hareket', 'Hareket'],
  ['mobil', 'Mobil'],
  ['erisim', 'Erişim'],
] as const

export const MOD_IKON = { sabah: 'dogus', ogle: 'gunes', aksam: 'batis', gece: 'ay' } as const

/** 24 saatlik gökyüzü şeridi: her saatin orta gökyüzü rengi, güneş / ay göstergesi. Süs; erişilebilir kontrol kaydırıcıdır */
export function GunSeridi({ saat, className }: { saat: number; className?: string }) {
  const stops = useMemo(() => Array.from({ length: 25 }, (_, h) => karisim(h).gok[1]), [])
  const g = gunes(saat)
  return (
    <div className={cx('relative', className)} aria-hidden="true" data-gun-seridi="">
      <div className="h-11 w-full rounded-full border border-[var(--cam-kenar)]" style={{ background: `linear-gradient(90deg, ${stops.map((c, i) => `${c} ${((i / 24) * 100).toFixed(1)}%`).join(', ')})` }} />
      <span className="absolute top-1/2 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-[#0f2e1b] bg-white text-[#0f2e1b]" style={{ left: `${((((saat % 24) + 24) % 24) / 24) * 100}%`, boxShadow: 'var(--golge-2)' }}>
        <Ikon ad={g.gunduz ? 'gunes' : 'ay'} boyut={20} />
      </span>
      <div className="mt-1 flex justify-between font-mono text-[11px] text-soluk">
        {['00', '06', '12', '18', '24'].map((s) => (
          <span key={s}>{s}</span>
        ))}
      </div>
    </div>
  )
}

/** Günün saatini seçer: kaydırıcı ve mod kısayolları. "Şimdi" gerçek saati izler */
export function ZamanKontrol({ onek = '' }: { onek?: string }) {
  const { saat, saatTercih, saatAyarla, mod } = useBiophilic()
  const modId = saatTercih === 'oto' ? 'oto' : (MOD_SIRA.find((m) => MODLAR[m].saat % 24 === saatTercih) ?? '')
  return (
    <div className="grid grid-cols-1 gap-5" data-zaman-kontrol="">
      <GunSeridi saat={saat} />
      <Aralik id={`${onek}saat`} label="Günün saati" value={Math.floor(saat * 4) / 4} min={0} max={23.75} step={0.25} onChange={(v) => saatAyarla(v, true)} format={saatMetni} />
      <Secim<string>
        legend={`Gün ışığı · şu an ${MODLAR[mod].ad}${saatTercih === 'oto' ? ' (gerçek saat)' : ''}`}
        name={`${onek}mod`}
        value={modId}
        onChange={(v) => (v === 'oto' ? saatAyarla('oto') : saatAyarla(MODLAR[v as ModAd].saat % 24))}
        options={[{ id: 'oto', ad: 'Şimdi' }, ...MOD_SIRA.map((m) => ({ id: m as string, ad: MODLAR[m].ad }))]}
      />
    </div>
  )
}

export function Ayarlar({ onek = '' }: { onek?: string }) {
  const s = useBiophilic()
  return (
    <div className="grid grid-cols-1 gap-6">
      <Secim<Doku>
        legend="Doku"
        name={`${onek}doku`}
        value={s.doku}
        onChange={s.setDoku}
        options={[
          { id: 'yok', ad: 'Yok' },
          { id: 'su', ad: 'Su' },
          { id: 'yaprak', ad: 'Yaprak' },
          { id: 'ahsap', ad: 'Ahşap' },
        ]}
      />
      <Secim<DogaTercih>
        legend={`Doğa katmanı · şu an ${s.dogaSeviye === 'tam' ? 'tam' : 'hafif'}`}
        name={`${onek}doga`}
        value={s.dogaTercih}
        onChange={s.setDogaTercih}
        options={[
          { id: 'oto', ad: 'Oto' },
          { id: 'tam', ad: 'Tam' },
          { id: 'hafif', ad: 'Hafif' },
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
        legend={`Kontrast · hedef ${s.hedef === 7 ? '7' : '4,5'}:1`}
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
  const { saat, mod } = useBiophilic()
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
      <a href="#icerik" className="dugme sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[100]" data-boy="k">
        İçeriğe geç
      </a>
      <header className="mx-auto flex w-full max-w-[1240px] items-center justify-between gap-4 px-5 pt-5 pb-3 sm:px-8 lg:px-12">
        <a href="#ust" className="cam cam-opak flex items-center gap-3 !rounded-full py-2 pr-6 pl-2 no-underline max-[400px]:pr-2" aria-label="Ferah, başa dön">
          <span className="grid size-11 place-items-center rounded-full bg-btn text-btn-yazi" aria-hidden="true">
            <Ikon ad="gunes" boyut={26} />
          </span>
          <span className="max-[400px]:hidden">
            <span className="block font-baslik text-[24px] leading-none font-medium text-metin">Ferah</span>
            <span className="kicker block !text-[10.5px] !tracking-[0.14em] max-[420px]:hidden">Canlı arayüz · Biophilic</span>
          </span>
        </a>
        <div className="flex items-center gap-2">
          <Popover.Root>
            <Popover.Trigger asChild>
              <BioButton ton="cam" boy="k" aria-label={`Gün ışığı: ${saatMetni(saat)}, ${MODLAR[mod].ad}`} ikon={<Ikon ad={MOD_IKON[mod]} boyut={20} />} data-zaman-dugme={mod} className="cam-opak">
                <span className="rakam" aria-hidden="true">
                  {saatMetni(saat)}
                </span>
                <span className="max-[560px]:sr-only" aria-hidden="true">
                  {MODLAR[mod].ad}
                </span>
              </BioButton>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content align="end" sideOffset={12} collisionPadding={12} className="cam cam-opak relative z-[95] max-h-[80vh] w-[min(460px,calc(100vw-24px))] overflow-y-auto p-7" data-zaman-panel="">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <p className="font-baslik text-[26px] leading-none font-medium">Gün ışığı</p>
                  <Popover.Close asChild>
                    <BioButton ton="metin" boy="k" aria-label="Kapat" ikon={<Ikon ad="kapat" boyut={18} />}>
                      Kapat
                    </BioButton>
                  </Popover.Close>
                </div>
                <ZamanKontrol onek="hz-" />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
          <Popover.Root>
            <Popover.Trigger asChild>
              <BioButton ton="cam" boy="k" aria-label="Görünüm ayarları" ikon={<Ikon ad="ayar" boyut={20} />} className="cam-opak">
                <span className="max-[560px]:sr-only">Görünüm</span>
              </BioButton>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content align="end" sideOffset={12} collisionPadding={12} className="cam cam-opak relative z-[95] max-h-[80vh] w-[min(440px,calc(100vw-24px))] overflow-y-auto p-7" data-ayarlar="">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <p className="font-baslik text-[26px] leading-none font-medium">Görünüm</p>
                  <Popover.Close asChild>
                    <BioButton ton="metin" boy="k" aria-label="Kapat" ikon={<Ikon ad="kapat" boyut={18} />}>
                      Kapat
                    </BioButton>
                  </Popover.Close>
                </div>
                <Ayarlar />
                <p className="mt-6 flex gap-7 text-[17px]">
                  <a href="../../">Tüm stiller</a>
                  <a href="../031/">Stil 031</a>
                </p>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>
      </header>
      <nav aria-label="Bölümler" className="sticky top-2 z-[80] mx-auto w-full max-w-[1240px] px-3 sm:px-6 lg:px-10">
        <ul className="cam cam-opak m-0 flex list-none gap-1 overflow-x-auto !rounded-full p-1.5 [scrollbar-width:none]">
          {NAV.map(([id, ad]) => (
            <li key={id} className="shrink-0">
              <a
                href={`#${id}`}
                aria-current={aktif === id ? 'true' : undefined}
                className={cx(
                  'relative flex min-h-11 items-center rounded-full px-4 font-baslik text-[15.5px] font-medium whitespace-nowrap no-underline transition-colors duration-500',
                  aktif === id ? 'bg-btn text-btn-yazi' : 'text-metin hover:bg-[color-mix(in_srgb,var(--cam-tint)_70%,transparent)]',
                )}
              >
                <span lang={id === 'figma' || id === 'css' ? 'en' : undefined}>{ad}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
