import { Box, Pane } from '../components/ui'
import { AsciiTable } from '../components/AsciiTable'
import { TEMALAR, useTerm } from '../lib/store'

const KONTRAST = [
  { tema: 'yeşil', zemin: '#000000', metin: '#00FF41  15,38', ikincil: '#00B32D   7,49', vurgu: '#FFB000  11,46' },
  { tema: 'kehribar', zemin: '#000000', metin: '#FFB000  11,46', ikincil: '#B37B00   5,75', vurgu: '#FFFFFF  21,00' },
  { tema: 'beyaz', zemin: '#000000', metin: '#FFFFFF  21,00', ikincil: '#A0A0A0   8,03', vurgu: '#FFB000  11,46' },
  { tema: 'solarized', zemin: '#FDF6E3', metin: '#073642  12,05', ikincil: '#586E75   4,99', vurgu: '#7A5000   6,54' },
]

const TOKENLAR = [
  { ad: 'Font/MonoCore', deger: 'JetBrains Mono · Fira Code · Source Code Pro · Consolas' },
  { ad: 'Color/ConsoleGreen', deger: '#00FF41' },
  { ad: 'Color/ConsoleAmber', deger: '#FFB000' },
  { ad: 'Color/ConsoleWhite', deger: '#FFFFFF' },
  { ad: 'Color/ConsoleBlack', deger: '#000000' },
  { ad: 'Grid/Cell', deger: '1ch × 1lh (16px · 1,5)' },
  { ad: 'Radius/None', deger: '0px' },
  { ad: 'Effect/None', deger: 'gölge yok · parlama yok' },
]

const REACT = `<TerminalShell title="root@yonetim: ~"
  prompt="root@yonetim:~#" run={calistir} />

<Kbd keys={['Ctrl', 'K']} />   // [Ctrl]+[K]

<LogStream logs={gunluk} onClear={temizle} />`

/** Madde 13 · 14 · 15 · 18 */
export function Access() {
  const s = useTerm()
  return (
    <Pane id="erisilebilirlik" no="10" title="erişilebilirlik ve kod" lede="Doğası gereği yüksek kontrastlı ve okuması en rahat stillerden biri. Açık terminal isteyenler için Solarized: kirli beyaz zemin, koyu gri metin.">
      <div className="grid gap-x-4 gap-y-[2lh] lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-y-[2lh]">
          <Box title="kontrast" right="WCAG 2.2 · AA 4,5">
            <AsciiTable
              caption="Tema başına kontrast oranları"
              rows={KONTRAST}
              getId={(r) => r.tema}
              selectedId={TEMALAR.find((t) => t.id === s.tema)?.ad}
              columns={[
                { key: 'tema', label: 'tema', get: (r) => r.tema },
                { key: 'zemin', label: 'zemin', get: (r) => r.zemin },
                { key: 'metin', label: 'metin', get: (r) => r.metin },
                { key: 'ikincil', label: 'ikincil', get: (r) => r.ikincil },
                { key: 'vurgu', label: 'vurgu', get: (r) => r.vurgu },
              ]}
            />
            <ul className="mt-[1lh]">
              {[
                'Renk tek başına anlam taşımaz: durum [  OK  ] [UYARI ] [ HATA ], seviye [BİLGİ ] gibi metinle yazılır.',
                'Odak ve seçim ters video; ek olarak 2px kehribar odak çizgisi.',
                'Onay kutuları [x] / [ ], radyolar (*) / ( ): yerel girişler görünmez ama odaklanır ve okunur.',
                'ASCII çizimler ekran okuyucudan gizli; aynı veri tablo ya da metin olarak var.',
                'Otomatik akan günlük tek tek duyurulmaz; hata ve uyarı sayısı durum satırında.',
                'Yanıp sönen imleç 1 Hz; hareket kapatılabilir, sistem tercihi izlenir.',
              ].map((t) => (
                <li key={t} className="flex">
                  <span className="shrink-0 whitespace-pre text-ok" aria-hidden="true">
                    {'[+] '}
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </Box>
          <Box title="figma tokenları" right="madde 13">
            <AsciiTable
              caption="Figma tokenları"
              rows={TOKENLAR}
              getId={(r) => r.ad}
              columns={[
                { key: 'ad', label: 'token', get: (r) => r.ad },
                { key: 'deger', label: 'değer', get: (r) => r.deger },
              ]}
            />
          </Box>
        </div>
        <div className="flex min-w-0 flex-col gap-y-[2lh]">
          <Box title="tailwind" right="madde 15">
            <p className="text-dim">Tanımdaki satır, olduğu gibi. Burada p-4 dört karakterdir (aralık birimi 1ch).</p>
            <div className="mt-[1lh] font-mono bg-black text-green-400 p-4 border border-green-800 antialiased">
              <p>$ uptime</p>
              <p>10:42  up 84 days, load average: 0,42 0,38 0,35</p>
            </div>
            <pre className="ascii scroll-x mt-[1lh] text-dim" tabIndex={0} aria-label="Tailwind sınıfları">
              font-mono bg-black text-green-400 p-4{'\n'}border border-green-800 antialiased
            </pre>
          </Box>
          <Box title="react" right="madde 14">
            <pre className="ascii scroll-x" tabIndex={0} aria-label="React örneği">
              {REACT}
            </pre>
          </Box>
          <Box title="açık terminal" right="solarized">
            <div data-theme="solarized" className="border border-line bg-bg px-1 text-fg">
              <p>
                <span className="text-dim">deniz@lab:~$</span> <span className="text-hi">git status</span>
              </p>
              <p>dalda: main</p>
              <p className="text-ok">[+] değişiklik yok, çalışma ağacı temiz</p>
              <p className="text-em">[!] 2 işleme ileride</p>
            </div>
          </Box>
        </div>
      </div>
    </Pane>
  )
}
