import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Check, Kbd, Pane } from '../components/ui'
import { AsciiTable, type Col } from '../components/AsciiTable'
import { LogStream } from '../components/LogStream'
import { TerminalShell, type Run } from '../components/TerminalShell'
import { DURUM_ETIKET, LOG_SABLON, sure, type Durum, type Sunucu } from '../lib/data'
import { bar, nf, pad, RAMP, shade } from '../lib/ascii'
import { TEMALAR, useTerm, type Tema } from '../lib/store'

const SIRA: Record<Durum, number> = { hata: 0, uyari: 1, ok: 2, kapali: 3 }
const CEKIRDEK = 16
const ORNEK = 40

function tohum(host: string) {
  let h = 2166136261
  for (const c of host) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  let s = h >>> 0 || 1
  return () => {
    s ^= s << 13
    s ^= s >>> 17
    s ^= s << 5
    return (s >>> 0) / 4294967296
  }
}
/** Seçili sunucunun çekirdek başına yük geçmişi (kurgusal, sunucu adından türeyen) */
function gecmis(x: Sunucu) {
  const r = tohum(x.host)
  return Array.from({ length: CEKIRDEK }, (_, c) => {
    const taban = x.durum === 'kapali' ? 0 : Math.min(1, x.cpu / 100 + (r() - 0.5) * 0.5 + (c < 4 ? 0.15 : 0))
    return Array.from({ length: ORNEK }, () => (x.durum === 'kapali' ? 0 : Math.max(0, Math.min(1, taban + (r() - 0.5) * 0.35))))
  })
}

export function Server() {
  const s = useTerm()
  const [sirala, setSirala] = useState<{ key: string; dir: 'asc' | 'desc' }>({ key: 'durum', dir: 'asc' })
  const [sorgu, setSorgu] = useState('')
  const [secili, setSecili] = useState<string>('web-02')
  const [canli, setCanli] = useState(true)
  const [isi, setIsi] = useState<number[][]>([])
  const aramaRef = useRef<HTMLInputElement>(null)
  const { setSunucular, log } = s

  // Canlı veri: CPU rastgele yürür, çalışma süresi artar; günlüğe olay düşer
  useEffect(() => {
    if (!canli) return
    const t = window.setInterval(() => {
      setSunucular((l) =>
        l.map((x) => (x.durum === 'kapali' ? x : { ...x, cpu: Math.max(2, Math.min(99, Math.round(x.cpu + (Math.random() - 0.5) * 14))), calisma: x.calisma + 2 })),
      )
    }, 2000)
    const g = window.setInterval(() => {
      const top = LOG_SABLON.reduce((a, x) => a + x.w, 0)
      let k = Math.random() * top
      const sab = LOG_SABLON.find((x) => (k -= x.w) < 0) ?? LOG_SABLON[0]
      log(sab.seviye, sab.kaynak, sab.mesaj)
    }, 1300)
    return () => {
      window.clearInterval(t)
      window.clearInterval(g)
    }
  }, [canli, setSunucular, log])

  const sec = s.sunucular.find((x) => x.host === secili) ?? s.sunucular[0]
  // Isı haritası: seçim değişince yeniden kurulur, canlıyken sağdan yeni örnek girer
  useEffect(() => {
    setIsi(gecmis(sec))
  }, [sec.host, sec.durum])
  useEffect(() => {
    if (!canli) return
    const t = window.setInterval(() => {
      setIsi((h) => h.map((row, c) => [...row.slice(1), sec.durum === 'kapali' ? 0 : Math.max(0, Math.min(1, sec.cpu / 100 + (Math.random() - 0.5) * 0.4 + (c < 4 ? 0.12 : 0)))]))
    }, 1000)
    return () => window.clearInterval(t)
  }, [canli, sec.cpu, sec.durum])

  // "/" arama kutusuna odaklanır (yazı alanında değilken)
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (e.key !== '/' || t.closest('input, textarea, select, [role="dialog"]')) return
      const r = aramaRef.current?.getBoundingClientRect()
      if (!r || r.bottom < 0 || r.top > innerHeight) return
      e.preventDefault()
      aramaRef.current?.focus()
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [])

  const satirlar = useMemo(() => {
    const q = sorgu.trim().toLocaleLowerCase('tr-TR')
    const f = s.sunucular.filter((x) => !q || `${x.host} ${x.rol} ${x.bolge} ${DURUM_ETIKET[x.durum]}`.toLocaleLowerCase('tr-TR').includes(q))
    const v = (x: Sunucu): number | string =>
      sirala.key === 'host' ? x.host : sirala.key === 'cpu' ? x.cpu : sirala.key === 'bellek' ? x.bellek / x.bellekTop : sirala.key === 'disk' ? x.disk : sirala.key === 'calisma' ? x.calisma : SIRA[x.durum]
    return [...f].sort((a, b) => {
      const A = v(a)
      const B = v(b)
      const c = typeof A === 'number' && typeof B === 'number' ? A - B : String(A).localeCompare(String(B), 'tr')
      return sirala.dir === 'asc' ? c : -c
    })
  }, [s.sunucular, sorgu, sirala])

  const cols: Col<Sunucu>[] = [
    { key: 'host', label: 'host', get: (x) => x.host, sortable: true },
    { key: 'rol', label: 'rol', get: (x) => x.rol },
    { key: 'bolge', label: 'bölge', get: (x) => x.bolge },
    { key: 'cpu', label: 'cpu', get: (x) => (x.durum === 'kapali' ? '-' : `${bar(x.cpu, 100, 10, '#', '.')} ${pad(String(x.cpu), 3, 'right')}%`), sortable: true, cls: (x) => (x.cpu >= 85 ? 'text-em' : undefined) },
    { key: 'bellek', label: 'bellek', get: (x) => `${pad(nf(x.bellek, 1), 4, 'right')}/${x.bellekTop}G`, align: 'right', sortable: true, cls: (x) => (x.bellek / x.bellekTop >= 0.9 ? 'text-em' : undefined) },
    { key: 'disk', label: 'disk', get: (x) => `${x.disk}%`, align: 'right', sortable: true, cls: (x) => (x.disk >= 75 ? 'text-em' : undefined) },
    { key: 'calisma', label: 'çalışma', get: (x) => sure(x.calisma), align: 'right', sortable: true },
    { key: 'durum', label: 'durum', get: (x) => `[${DURUM_ETIKET[x.durum]}]`, sortable: true, cls: (x) => (x.durum === 'hata' ? 'inv' : x.durum === 'uyari' ? 'text-em' : x.durum === 'kapali' ? 'text-dim' : 'text-ok') },
  ]

  const run: Run = (raw) => {
    const [c, ...args] = raw.split(/\s+/)
    const a = args.join(' ')
    switch (c) {
      case 'yardım':
      case 'yardim':
      case 'help':
        return [
          'komutlar:',
          '  ls                 sunucuları listeler',
          '  top                en yüksek cpu kullanan 3 sunucu',
          '  df                 disk doluluğu',
          '  restart|start|stop <host>',
          '  tail               günlüğün son 5 satırı',
          '  tema <yeşil|kehribar|beyaz|solarized>',
          '  whoami · uptime · date · echo <metin> · clear',
        ]
      case 'ls':
        return s.sunucular.map((x) => `${pad(x.host, 10)} ${pad(x.rol, 10)} ${pad(x.bolge, 6)} [${DURUM_ETIKET[x.durum]}]`)
      case 'top':
        return [...s.sunucular]
          .sort((p, q) => q.cpu - p.cpu)
          .slice(0, 3)
          .map((x, i) => `${i + 1}. ${pad(x.host, 10)} ${pad(String(x.cpu), 3, 'right')}% [${bar(x.cpu, 100, 20)}]`)
      case 'df':
        return s.sunucular.map((x) => `${pad(x.host, 10)} [${bar(x.disk, 100, 24)}] ${pad(String(x.disk), 3, 'right')}%${x.disk >= 75 ? '  [!]' : ''}`)
      case 'restart':
      case 'start':
      case 'stop':
        if (!a) return [`[x] kullanım: ${c} <host>`]
        return [s.sunucuKomut(c, a)]
      case 'tail':
        return s.loglar.slice(-5).map((l) => `${l.t} ${l.seviye.toUpperCase().padEnd(6)} ${pad(l.kaynak, 9)} ${l.mesaj}`)
      case 'tema': {
        const t = TEMALAR.find((x) => x.ad === a || x.id === a)
        if (!t) return ['[x] temalar: yeşil, kehribar, beyaz, solarized']
        s.setTema(t.id as Tema)
        return [`[+] tema: ${t.ad}`]
      }
      case 'whoami':
        return ['root']
      case 'uptime': {
        const acik = s.sunucular.filter((x) => x.durum !== 'kapali').length
        return [`${acik}/${s.sunucular.length} sunucu çalışıyor · ortalama cpu %${Math.round(s.sunucular.reduce((p, x) => p + x.cpu, 0) / s.sunucular.length)}`]
      }
      case 'date':
      case 'tarih':
        return [new Date().toLocaleString('tr-TR')]
      case 'echo':
        return [a]
      case 'clear':
      case 'temizle':
        return 'temizle'
      default:
        return [`[x] komut bulunamadı: ${c} · "yardım" yazın`]
    }
  }

  return (
    <Pane id="sunucu" no="07" title="sunucu konsolu" lede="Barındırma yönetimi: canlı sunucu ızgarası, çekirdek ısı haritası, komut kabuğu ve işlem günlüğü. Kabukta restart web-02 yazın ya da Ctrl+K paletinden seçin. Sunucular ve olaylar kurgusaldır.">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-[0.5lh]">
        <label className="flex items-center border border-line px-1 focus-within:border-fg">
          <span className="text-em" aria-hidden="true">
            /
          </span>
          <span className="sr-only">Sunucu süz</span>
          <input ref={aramaRef} type="search" value={sorgu} onChange={(e) => setSorgu(e.target.value)} placeholder="süz: host, rol, bölge, durum" className="w-30 max-w-[60vw] bg-transparent pl-1 text-hi caret-[var(--fg)] outline-none placeholder:text-dim" />
        </label>
        <span className="text-dim">
          <Kbd keys={['/']} /> ara · başlık: sırala · <Kbd keys={['j']} />/<Kbd keys={['k']} /> satır
        </span>
        <span className="flex-1" />
        <Check checked={canli} onChange={setCanli}>
          canlı güncelleme
        </Check>
      </div>
      <div className="mt-[1lh]">
        <AsciiTable
          caption={`Sunucular, ${satirlar.length} kayıt`}
          rows={satirlar}
          getId={(x) => x.host}
          columns={cols}
          sort={sirala}
          onSort={(k) => setSirala((p) => (p.key === k ? { key: k, dir: p.dir === 'asc' ? 'desc' : 'asc' } : { key: k, dir: k === 'host' || k === 'durum' ? 'asc' : 'desc' }))}
          selectedId={secili}
          onSelect={setSecili}
          empty={`"${sorgu}" ile eşleşen sunucu yok`}
          footer={` ${satirlar.length}/${s.sunucular.length} sunucu · seçili: ${sec.host}`}
        />
      </div>

      <div className="mt-[2lh] grid gap-x-4 gap-y-[2lh] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Box title={`${sec.host} · çekirdek yükü`} right={`son ${ORNEK} sn`}>
          <div className="scroll-x" role="img" tabIndex={0} aria-label={`${sec.host} için ${CEKIRDEK} çekirdeğin son ${ORNEK} saniyelik yük ısı haritası. Ortalama yük yüzde ${sec.cpu}.`}>
            <pre className="ascii" aria-hidden="true">
              {isi.map((row, c) => `c${String(c).padStart(2, '0')} |${row.map(shade).join('')}|`).join('\n')}
              {'\n    +' + '-'.repeat(ORNEK) + '+'}
              {'\n     -' + String(ORNEK) + ' sn' + ' '.repeat(ORNEK - 11) + 'şimdi'}
            </pre>
          </div>
          <p className="ascii mt-[0.5lh] text-dim">
            ölçek: [{RAMP}] {'%0 -> %100'}
          </p>
          <dl className="mt-[0.5lh] grid grid-cols-2 gap-x-2">
            {[
              ['rol', `${sec.rol} · ${sec.bolge}`],
              ['cpu', sec.durum === 'kapali' ? '-' : `%${sec.cpu}`],
              ['bellek', `${nf(sec.bellek, 1)} / ${sec.bellekTop} GB`],
              ['durum', `[${DURUM_ETIKET[sec.durum]}]`],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-1">
                <dt className="text-dim">{k}:</dt>
                <dd className="text-hi">{v}</dd>
              </div>
            ))}
          </dl>
        </Box>
        <TerminalShell
          title="root@yonetim: ~"
          prompt="root@yonetim:~#"
          run={run}
          commands={['yardım', 'ls', 'top', 'df', 'restart', 'start', 'stop', 'tail', 'tema', 'whoami', 'uptime', 'date', 'echo', 'clear']}
          intro={[
            { kind: 'out', text: 'webdetest yönetim kabuğu · "yardım" yazın' },
            { kind: 'out', text: 'son giriş: bugün, 10.0.0.12 üzerinden' },
          ]}
        />
      </div>

      <div className="mt-[2lh]">
        <p className="mb-[0.5lh] font-bold text-hi"># işlem günlüğü (activity timeline)</p>
        <LogStream logs={s.loglar} onClear={s.temizle} />
      </div>
    </Pane>
  )
}
