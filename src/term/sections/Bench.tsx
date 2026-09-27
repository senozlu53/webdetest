import { useEffect, useRef, useState } from 'react'
import { Box, Btn, Pane, Progress } from '../components/ui'
import { AsciiTable } from '../components/AsciiTable'
import { TESTLER, type Test } from '../lib/data'
import { bar, clock, nf, pad } from '../lib/ascii'
import { useTerm } from '../lib/store'

type Faz = 'hazir' | 'calisiyor' | 'bitti'

function rng(seed: number) {
  let s = seed >>> 0 || 1
  return () => {
    s ^= s << 13
    s ^= s >>> 17
    s ^= s << 5
    return (s >>> 0) / 4294967296
  }
}

const fmt = (t: Test, v: number) => nf(v, t.ondalik)

/**
 * Donanım kıyaslama (Madde 10 · 16): testler sırayla koşar, ilerleme çubukları %5'lik adımlarla dolar.
 * Sonuç ASCII çubuk grafik ve tablo; "#" bu çalıştırma, "=" referans.
 */
export function Bench() {
  const s = useTerm()
  const [faz, setFaz] = useState<Faz>('hazir')
  const [ilerleme, setIlerleme] = useState<Record<string, number>>({})
  const [sonuc, setSonuc] = useState<Record<string, number>>({})
  const [gunluk, setGunluk] = useState<string[]>(['[?] hazır'])
  const [kosu, setKosu] = useState(0)
  const timers = useRef<number[]>([])
  const sinyal = useRef(s.kiyasSinyal)

  const temizle = () => {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
  }
  const sonra = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms))

  const baslat = () => {
    temizle()
    const n = kosu + 1
    setKosu(n)
    const r = rng(n * 7919)
    setFaz('calisiyor')
    setIlerleme({})
    setSonuc({})
    setGunluk([`${clock()} [>] kıyaslama #${n} başladı · 6 test`])
    let t0 = 0
    TESTLER.forEach((t, i) => {
      const adim = t.sure / 20
      sonra(() => setGunluk((g) => [...g, `${clock()} [>] ${t.id}: ${t.ad}`]), t0)
      for (let k = 1; k <= 20; k++) sonra(() => setIlerleme((p) => ({ ...p, [t.id]: k * 5 })), t0 + k * adim)
      const deger = t.ref * (0.95 + r() * 0.12)
      sonra(() => {
        setSonuc((p) => ({ ...p, [t.id]: deger }))
        const fark = ((deger - t.ref) / t.ref) * 100
        setGunluk((g) => [...g, `${clock()} [ OK ] ${t.id} ${fmt(t, deger)} ${t.birim} (${fark >= 0 ? '+' : ''}${nf(fark, 1)}%)`])
        if (i === TESTLER.length - 1) {
          setFaz('bitti')
          s.soyle('Kıyaslama tamamlandı')
          s.log('bilgi', 'kiyas', `kıyaslama #${n} tamamlandı`)
        }
      }, t0 + t.sure + 40)
      t0 += t.sure + 180
    })
  }

  useEffect(() => {
    if (s.kiyasSinyal !== sinyal.current) {
      sinyal.current = s.kiyasSinyal
      baslat()
    }
  }, [s.kiyasSinyal])
  useEffect(() => temizle, [])

  const bitenler = TESTLER.filter((t) => sonuc[t.id] !== undefined)
  const W = 24
  const toplam = bitenler.length === TESTLER.length ? Math.round(TESTLER.reduce((a, t) => a + (sonuc[t.id] / t.ref) * 1000, 0) / TESTLER.length) : null

  return (
    <Pane id="kiyas" no="05" title="kıyaslama" lede="Donanım kıyaslama aracı: CPU, bellek, NVMe ve 10GbE. Değerler kurgusaldır; her çalıştırma referansın %95–107'si arasında sonuç verir.">
      <p className="ascii scroll-x mb-[1lh] text-dim" tabIndex={0} aria-label="Sistem özeti">
        sistem: 16 çekirdek @ 5,4 GHz · 64 GB DDR5-6000 · 4x NVMe RAID-10 (VMD) · 10GbE
      </p>
      <div className="grid gap-x-4 gap-y-[2lh] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Box title={`koşu #${kosu || '-'}`} right={faz === 'calisiyor' ? 'çalışıyor' : faz === 'bitti' ? 'bitti' : 'hazır'}>
          <div className="flex flex-wrap gap-2">
            <Btn inv prefix=">" onClick={baslat} disabled={faz === 'calisiyor'}>
              {faz === 'bitti' ? 'yeniden çalıştır' : 'kıyaslamayı başlat'}
            </Btn>
            {faz === 'calisiyor' ? (
              <Btn
                prefix="x"
                onClick={() => {
                  temizle()
                  setFaz('hazir')
                  setGunluk((g) => [...g, `${clock()} [!] kullanıcı durdurdu`])
                }}
              >
                durdur
              </Btn>
            ) : null}
          </div>
          <ul className="mt-[1lh]">
            {TESTLER.map((t) => (
              <li key={t.id} className="ascii scroll-x">
                <span className="text-hi">{pad(t.id, 5)}</span> <Progress className="inline" value={ilerleme[t.id] ?? 0} label={t.ad} width={16} />
                <span className="text-dim"> {t.ad}</span>
              </li>
            ))}
          </ul>
          <div role="log" aria-live="polite" aria-label="Kıyaslama günlüğü" tabIndex={0} className="ascii scroll-y scroll-x mt-[1lh] h-[9lh] border-t border-line pt-[0.5lh] text-dim">
            {gunluk.map((g, i) => (
              <div key={i} className={g.includes('[ OK ]') ? 'text-fg' : g.includes('[!]') ? 'text-em' : undefined}>
                {g}
              </div>
            ))}
          </div>
        </Box>

        <Box title="sonuç" right={toplam ? `toplam ${nf(toplam)} (ref 1 000)` : undefined}>
          <p className="ascii text-dim">
            <span className="text-hi">#</span> bu çalıştırma · <span className="text-hi">=</span> referans (önceki)
          </p>
          <div className="scroll-x mt-[0.5lh]" role="img" tabIndex={0} aria-label={bitenler.length ? `Çubuk grafik: ${bitenler.map((t) => `${t.ad} ${fmt(t, sonuc[t.id])} ${t.birim}, referans ${fmt(t, t.ref)}`).join('; ')}` : 'Henüz sonuç yok'}>
            <pre className="ascii" aria-hidden="true">
              {TESTLER.map((t) => {
                const v = sonuc[t.id]
                const max = Math.max(t.ref, v ?? 0) * 1.1
                const buLine = `${pad(t.id, 5)} bu  [${v === undefined ? ' '.repeat(W) : bar(v, max, W, '#', '.')}] ${v === undefined ? '' : `${fmt(t, v)} ${t.birim}`}`
                const refLine = `${pad('', 5)} ref [${bar(t.ref, max, W, '=', '.')}] ${fmt(t, t.ref)}`
                return `${buLine}\n${refLine}`
              }).join('\n')}
            </pre>
          </div>
          <div className="mt-[1lh]">
            <AsciiTable
              caption="Kıyaslama sonuçları ve referansa göre fark"
              rows={TESTLER}
              getId={(t) => t.id}
              columns={[
                { key: 'id', label: 'test', get: (t) => t.id },
                { key: 'sonuc', label: 'sonuç', get: (t) => (sonuc[t.id] === undefined ? '...' : fmt(t, sonuc[t.id])), align: 'right' },
                { key: 'ref', label: 'ref', get: (t) => fmt(t, t.ref), align: 'right' },
                { key: 'birim', label: 'birim', get: (t) => t.birim },
                {
                  key: 'fark',
                  label: 'fark',
                  align: 'right',
                  get: (t) => {
                    if (sonuc[t.id] === undefined) return '-'
                    const f = ((sonuc[t.id] - t.ref) / t.ref) * 100
                    return `${f >= 0 ? '+' : ''}${nf(f, 1)}%`
                  },
                  cls: (t) => (sonuc[t.id] !== undefined && sonuc[t.id] < t.ref ? 'text-em' : undefined),
                },
              ]}
            />
          </div>
        </Box>
      </div>
    </Pane>
  )
}
