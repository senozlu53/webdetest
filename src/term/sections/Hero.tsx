import { useEffect, useState } from 'react'
import { banner, dots } from '../lib/ascii'
import { hareketKapali, useTerm, YAZILAR_ } from '../lib/store'
import { Btn, Kbd, ScrollX, Typewriter } from '../components/ui'
import { git } from '../components/CommandPalette'

const BOOT = [
  'webdetest bios v0.12 · (c) 2026',
  dots('cpu0: 16 çekirdek @ 5,4 GHz', '[ OK ]', 50),
  dots('bellek: 64 GB DDR5-6000', '[ OK ]', 50),
  dots('vmd: 4 nvme, raid-10 hazır', '[ OK ]', 50),
  dots('ağ: enp5s0 10 Gbit/sn', '[ OK ]', 50),
  dots('stil-012 yükleniyor', '[ OK ]', 50),
]
const ART = banner('TERMİNAL')
const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

export function Hero() {
  const s = useTerm()
  const [n, setN] = useState(0)
  const [yazdi, setYazdi] = useState(false)
  useEffect(() => {
    if (hareketKapali()) {
      setN(BOOT.length)
      return
    }
    const t = window.setInterval(() => setN((k) => (k >= BOOT.length ? k : k + 1)), 170)
    return () => window.clearInterval(t)
  }, [])
  const booted = n >= BOOT.length
  const yazi = YAZILAR_.find((y) => y.id === s.yazi)!.ad

  const info: [string, string][] = [
    ['stil', '012 · futuristic / technology'],
    ['zemin', s.tema === 'solarized' ? '#FDF6E3 (açık terminal)' : '#000000'],
    ['metin', s.tema === 'yesil' ? '#00FF41' : s.tema === 'kehribar' ? '#FFB000' : s.tema === 'beyaz' ? '#FFFFFF' : '#073642'],
    ['yazı', `${yazi} · yalnız monospace`],
    ['köşe', '0px'],
    ['gölge', 'yok'],
    ['ikon', 'ascii: [>] [x] [+]'],
    ['ızgara', '1ch × 1lh'],
  ]

  return (
    <section id="ust" className="mx-auto max-w-[120ch] px-2 pt-[1lh] pb-[2lh] sm:px-4">
      <ScrollX label="Açılış günlüğü">
      <div className="ascii min-h-[6lh] text-dim">
        {BOOT.slice(0, n).map((l, i) => (
          <div key={i}>
            {l.endsWith('[ OK ]') ? (
              <>
                {l.slice(0, -6)}
                <span className="text-ok">[ OK ]</span>
              </>
            ) : (
              l
            )}
          </div>
        ))}
      </div>
      <p className="ascii mt-[1lh]">
        <span className="text-dim">deniz@lab:~$ </span>
        {booted ? <Typewriter text={'./stil --id 012 --ad "terminal / hacker ui"'} cps={38} className="text-hi" onDone={() => setYazdi(true)} /> : <span className="cursor" aria-hidden="true" />}
      </p>
      </ScrollX>

      <div className={yazdi ? undefined : 'invisible'}>
        <div className="mt-[1lh] flex flex-col gap-x-4 gap-y-[1lh] xl:flex-row xl:items-center">
          <pre className="ascii shrink-0 leading-[1.05] font-bold text-fg" style={{ fontSize: 'min(14px, calc((100vw - 40px) / 56))' }} aria-hidden="true">
            {ART.join('\n')}
          </pre>
          <dl className="ascii min-w-0" aria-label="Sistem bilgisi">
            {info.map(([k, v]) => (
              <div key={k} className="flex">
                <dt className="w-8 shrink-0 font-bold text-hi">{k}</dt>
                <dd className="min-w-0 truncate">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <h1 className="mt-[1lh]">
          <span className="inv px-1">STİL 012</span> <span className="text-hi">Terminal / Hacker UI</span> <span className="text-dim">(data visualization)</span>
        </h1>
        <p className="mt-[1lh] max-w-[72ch]">Tasarımı aradan çıkarıp doğrudan veriye, koda ve saf performansa odaklanan arayüz: mühendislik araçlarının ve sistem yönetiminin en çıplak hâli. Süs yok, gölge yok, ikon yok; yalnız hizalı karakterler.</p>
        <div className="mt-[1lh] flex flex-wrap gap-x-2 gap-y-[0.5lh]">
          <Btn inv onClick={() => s.setPalet(true)}>
            {isMac ? '⌘' : 'Ctrl'}+K komut paleti
          </Btn>
          <Btn
            prefix=">"
            onClick={() => {
              git('kiyas')
              s.kiyasla()
            }}
          >
            kıyaslamayı başlat
          </Btn>
          <Btn prefix="#" onClick={() => git('sunucu')}>
            sunucu konsolu
          </Btn>
        </div>
        <p className="mt-[1lh] text-dim">
          ipucu: <Kbd keys={[isMac ? '⌘' : 'Ctrl', 'K']} /> ile her yerden komut çalıştırın; tablolarda <Kbd keys={['↑']} />/<Kbd keys={['↓']} /> ya da <Kbd keys={['j']} />/<Kbd keys={['k']} /> gezinir.
          <span className="cursor ml-1" aria-hidden="true" />
        </p>
      </div>
    </section>
  )
}
