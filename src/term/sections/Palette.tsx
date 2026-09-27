import { Box, Check, Pane, Radios } from '../components/ui'
import { AsciiTable } from '../components/AsciiTable'
import { TEMALAR, YAZILAR_, useTerm } from '../lib/store'
import { nf, pad } from '../lib/ascii'

const RENKLER = [
  { ad: 'saf siyah', hex: '#000000', rol: 'zemin', k: '-' },
  { ad: 'terminal yeşili', hex: '#00FF41', rol: 'metin', k: '15,38' },
  { ad: 'kehribar', hex: '#FFB000', rol: 'vurgu', k: '11,46' },
  { ad: 'saf beyaz', hex: '#FFFFFF', rol: 'güçlü', k: '21,00' },
  { ad: 'soluk yeşil', hex: '#00B32D', rol: 'ikincil', k: '7,49' },
  { ad: 'çizgi yeşili', hex: '#1F7A34', rol: 'çerçeve', k: '3,89' },
]

const SAYILAR = [
  ['nvme0', 7421.5, 12.4],
  ['nvme1', 7398.2, 12.6],
  ['nvme2', 983.4, 3.1],
  ['raid10', 13104.9, 11.8],
] as const

/** Madde 4 · 5 · 13 */
export function Palette() {
  const s = useTerm()
  return (
    <Pane id="renk" no="04" title="renk ve yazı" lede="Saf siyah üzerine tek renk metin. Yazı tek aile ve tek boyut; hizalama kusursuz olsun diye yalnız monospace.">
      <div className="grid gap-x-4 gap-y-[2lh] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-y-[2lh]">
          <Box title="palet" right="Color/Console*">
            <ul className="mb-[1lh] flex flex-wrap gap-x-2 gap-y-[0.5lh]" aria-hidden="true">
              {RENKLER.slice(0, 4).map((r) => (
                <li key={r.hex} className="flex items-center gap-1">
                  <span className="inline-block h-[1lh] w-6 border border-line" style={{ background: r.hex }} />
                  <span className="text-dim">{r.hex}</span>
                </li>
              ))}
            </ul>
            <AsciiTable
              caption="Palet ve siyah zemindeki kontrast"
              rows={RENKLER}
              getId={(r) => r.hex}
              columns={[
                { key: 'ad', label: 'ad', get: (r) => r.ad },
                { key: 'hex', label: 'hex', get: (r) => r.hex },
                { key: 'rol', label: 'rol', get: (r) => r.rol },
                { key: 'k', label: 'kontrast', get: (r) => r.k, align: 'right' },
              ]}
            />
          </Box>
          <Box title="tema" right="4 varyant">
            <Radios legend="Tema" hideLegend name="tema" row value={s.tema} options={TEMALAR} onChange={s.setTema} />
            <div className="mt-[1lh] grid grid-cols-2 gap-2 sm:grid-cols-4">
              {TEMALAR.map((t) => (
                <button key={t.id} type="button" data-theme={t.id} onClick={() => s.setTema(t.id)} aria-pressed={s.tema === t.id} aria-label={`${t.ad} temasını uygula`} className="cursor-pointer border border-line bg-bg px-1 text-left text-fg focus-visible:outline-2">
                  <span className="block truncate text-dim">$ ls</span>
                  <span className="block truncate">
                    <span className="text-hi">bin/</span> <span className="text-em">log</span>
                  </span>
                  <span className="block truncate">
                    {s.tema === t.id ? '[*] ' : '[ ] '}
                    {t.ad}
                  </span>
                </button>
              ))}
            </div>
          </Box>
        </div>

        <div className="flex min-w-0 flex-col gap-y-[2lh]">
          <Box title="yazı: Font/MonoCore" right="madde 5">
            <Radios legend="Yazı tipi" hideLegend name="yazi" value={s.yazi} options={YAZILAR_} onChange={s.setYazi} row />
            <p className="mt-[1lh] text-hi">Pijamalı hasta yağız şoföre çabucak güvendi.</p>
            <p>PİJAMALI HASTA YAĞIZ ŞOFÖRE ÇABUCAK GÜVENDİ.</p>
            <p className="text-dim">0O 1lI| {'{}[]()'} ~^ @#$%&amp;*</p>
            <p className="mt-[0.5lh]">
              bağlaç: <span className="text-em">{'=> != >= <= === -> ::'}</span>
            </p>
            <p className="mt-[0.5lh]">
              <Check checked={s.bag} onChange={s.setBag}>
                bağlaçlar (ligature) açık · tablolar ve ASCII çizimler her zaman bağlaçsız
              </Check>
            </p>
            <p className="mt-[0.5lh] text-dim">Consolas yedek olarak listede; lisanslı olduğu için yüklenmez.</p>
          </Box>
          <Box title="hizalama" right="tabular-nums">
            <pre className="ascii scroll-x" tabIndex={0} aria-label="Sağa hizalı sayılar">
              <span className="text-hi">{`${pad('aygıt', 8)} ${pad('MB/sn', 10, 'right')} ${pad('gecikme', 9, 'right')}`}</span>
              {'\n'}
              {SAYILAR.map(([a, b, c]) => `${pad(a, 8)} ${pad(nf(b, 1), 10, 'right')} ${pad(`${nf(c, 1)} µs`, 9, 'right')}`).join('\n')}
            </pre>
            <p className="mt-[0.5lh] text-dim">Her rakam aynı genişlikte; ondalık virgüller alt alta gelir.</p>
          </Box>
        </div>
      </div>
    </Pane>
  )
}
