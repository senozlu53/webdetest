import { useState } from 'react'
import { HoloPanel, PanelHead, SectionHead } from '../components/ui'
import { HoloIcon } from '../components/Icons'
import { useHolo } from '../lib/store'
import { cx } from '../../shared/cx'

// En kötü durum: %35 camgöbeği parlamanın önünde cyan-900/10 cam. Koruyucu gradyan: zemin rengi %88 (laboratuvarda %85).
const DEMO = {
  dark: {
    off: { ink: '8,60', muted: '5,46', blue: '3,86' },
    on: { ink: '15,59', muted: '8,83', blue: '7,25' },
  },
  light: {
    off: { ink: '12,18', muted: '6,06', blue: '4,88' },
    on: { ink: '14,56', muted: '6,66', blue: '5,87' },
  },
}

const ROWS: ReadonlyArray<[string, string, string]> = [
  ['Metin (yarı saydam)', '16,32', '14,85'],
  ['İkincil metin', '9,09', '6,73'],
  ['Camgöbeği metin', '10,69', '6,56'],
  ['Mavi metin', '7,60', '6,05'],
  ['Cam panelde metin (en kötü)', '12,83', '14,33'],
  ['Cam panelde mavi metin (en kötü)', '5,88', '5,82'],
  ['Ana düğme metni (gradyanın koyu ucu)', '5,19', '5,36'],
  ['Grafik serisi A · B (zeminde)', '5,25 · 4,33', '3,32 · 4,03'],
]

const TOKENS: ReadonlyArray<[string, string, string?]> = [
  ['Color/HoloBlue/Cyan', '#06B6D4', '#06B6D4'],
  ['Color/HoloBlue/Electric', '#3B82F6', '#3B82F6'],
  ['Color/HoloBlue/Night', '#090E17', '#090E17'],
  ['Color/Text/Primary', 'white %92'],
  ['Effects/GlassBlur/md', 'backdrop-blur 12px'],
  ['Effects/GlassBlur/panel', 'blur 16px · saturate 140%'],
  ['Effects/AmbientGlow', '0 0 15px cyan %20'],
  ['Border/ThinGlow', '1px cyan-400 %30'],
]

const REACT = `// Ctrl/⌘ + K: cmdk + Radix Dialog
<CommandCenter />

<HoloPanel tick>
  <PanelHead title="Model dizini" />
  <DataGrid
    columns={kolonlar}
    data={modeller}
    globalFilter={arama}
    rowSelection={secim}
    mobileRow={ModelKarti}
  />
</HoloPanel>`

export function Access() {
  const s = useHolo()
  const [scrim, setScrim] = useState(true)
  const v = DEMO[s.theme === 'dark' ? 'dark' : 'light'][scrim ? 'on' : 'off']
  const fails = !scrim && s.theme === 'dark'

  return (
    <section id="erisilebilirlik" className="px-4 py-20 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="13 · 14 · 15 · 18"
          label="Erişilebilirlik ve tokenlar"
          title="Parlak, ama okunur"
          lede="Holografik efektler kontrastı düşürebilir: cam arkasındaki parlama metnin zeminini açar. Bu yüzden metnin arkasına opak bir koruyucu gradyan girer; panellerde bu gradyan camın kendisidir."
        />
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <HoloPanel tick className="p-5 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <PanelHead title="Koruyucu gradyan" />
              <button
                type="button"
                role="switch"
                aria-checked={scrim}
                onClick={() => setScrim((x) => !x)}
                className="flex min-h-11 items-center gap-3 rounded-full px-2 font-tech text-[14px] font-semibold"
              >
                <span className={cx('relative h-6 w-11 rounded-full border transition-colors', scrim ? 'border-cyan-text bg-[var(--tint)] shadow-[0_0_12px_var(--glow)]' : 'border-line-soft')} aria-hidden="true">
                  <span className={cx('absolute top-0.5 size-4.5 rounded-full transition-all', scrim ? 'left-[22px] bg-cyan-text' : 'left-0.5 bg-[var(--muted)]')} />
                </span>
                {scrim ? 'Açık' : 'Kapalı'}
              </button>
            </div>
            <div className="relative mt-4 overflow-hidden rounded-2xl border border-line-soft bg-bg px-6 py-10">
              <span className="absolute top-1/2 left-1/3 size-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,#06b6d4_42%,transparent),transparent)]" aria-hidden="true" />
              <span className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgb(34_211_238/0.08)_0_1px,transparent_1px_4px)]" aria-hidden="true" />
              <div className={cx('scrim relative max-w-[42ch] rounded-xl bg-cyan-900/10', !scrim && 'scrim-off')}>
                <p className="font-tech text-[12px] font-semibold tracking-[0.14em] text-cyan-text uppercase">Düğüm durumu</p>
                <p className="mt-1 text-[20px] font-[400]">gpu-0 · %71 yük · 64 °C</p>
                <p className="mt-1 text-[15px] text-muted">Son 60 saniyede 2 792 token üretildi.</p>
                <p className="mt-1 text-[15px] text-blue-text">Ayrıntılar için komut merkezini açın.</p>
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-3 gap-3 text-[14px]" aria-live="polite">
              {[
                ['Metin', v.ink],
                ['İkincil', v.muted],
                ['Mavi metin', v.blue],
              ].map(([k, x]) => {
                const bad = parseFloat(x.replace(',', '.')) < 4.5
                return (
                  <div key={k} className={cx('rounded-xl border px-3 py-2', bad ? 'border-blue-text' : 'border-line-soft')}>
                    <dt className="font-tech text-[12px] tracking-[0.1em] text-muted uppercase">{k}</dt>
                    <dd className="flex items-center gap-1.5 text-[17px] tabular-nums">
                      <HoloIcon name={bad ? 'uyari' : 'onay'} size={15} className={bad ? 'text-blue-text' : 'text-cyan-text'} glow={false} />
                      {x}:1<span className="sr-only">{bad ? ', AA geçmez' : ', AA geçer'}</span>
                    </dd>
                  </div>
                )
              })}
            </dl>
            <p className="mt-3 text-[14px] text-muted">
              {fails
                ? 'Gradyan kapalıyken mavi metin parlamanın önünde 3,86:1’e düşer ve AA’yı geçemez.'
                : 'Opak gradyan metnin arkasındaki parlamayı bastırır; ışık kenarlarda görünmeye devam eder.'}{' '}
              Değerler bu temanın en kötü noktası içindir.
            </p>
          </HoloPanel>

          <HoloPanel className="p-5 md:p-6">
            <PanelHead title="Kontrast" meta="WCAG 2.2" />
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-[14px]">
                <caption className="sr-only">Kontrast oranları, Gece ve Laboratuvar temaları</caption>
                <thead className="font-tech text-[12px] tracking-[0.12em] text-muted uppercase">
                  <tr>
                    <th className="py-2 pr-3 font-semibold">Çift</th>
                    <th className="py-2 pr-3 text-right font-semibold">Gece</th>
                    <th className="py-2 text-right font-semibold">Laboratuvar</th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map(([k, d, l]) => (
                    <tr key={k} className="border-t border-line-soft">
                      <th scope="row" className="py-2 pr-3 font-normal">
                        {k}
                      </th>
                      <td className="py-2 pr-3 text-right whitespace-nowrap tabular-nums">{d}</td>
                      <td className="py-2 text-right whitespace-nowrap tabular-nums">{l}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="mt-4 flex flex-col gap-2 text-[14px] text-muted">
              <li>Durum rengi hiçbir yerde tek başına değil: nokta + etiket, ikon + metin.</li>
              <li>Odak halkası 2px camgöbeği, 3px boşluklu; ince konturla karışmaz.</li>
              <li>Komut merkezi Radix Dialog: odak içeride kalır, Escape kapatır, odak açan düğmeye döner.</li>
              <li>Her grafiğin tablo görünümü, 3B görüntüleyicinin metin açıklaması var.</li>
            </ul>
          </HoloPanel>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <HoloPanel className="p-5 md:p-6">
            <PanelHead title="Figma tokenları" meta="Madde 13" />
            <ul className="mt-3 flex flex-col">
              {TOKENS.map(([k, val, sw]) => (
                <li key={k} className="flex flex-wrap items-baseline justify-between gap-x-3 border-t border-line-soft py-2 first:border-t-0">
                  <span className="font-mono text-[13px]">{k}</span>
                  <span className="flex items-center gap-2 font-mono text-[12px] text-muted">
                    {sw ? <span className="size-3 rounded-sm border border-line-soft" style={{ background: sw, boxShadow: sw === '#090E17' ? undefined : `0 0 8px ${sw}` }} aria-hidden="true" /> : null}
                    {val}
                  </span>
                </li>
              ))}
            </ul>
          </HoloPanel>
          <HoloPanel className="p-5 md:p-6">
            <PanelHead title="Tailwind" meta="Madde 15" />
            <p className="mt-2 text-[14px] text-muted">Tanımdaki satır, olduğu gibi. Gece zemini sabittir; Laboratuvar temasında da koyu kalır.</p>
            <div className="mt-4 rounded-2xl bg-[#090E17] p-4">
              <div className="rounded-2xl bg-cyan-900/10 p-4 text-cyan-50 shadow-[0_0_15px_rgba(6,182,212,0.2)] backdrop-blur-md border border-cyan-400/30">
                <p className="font-tech text-[12px] tracking-[0.14em] uppercase opacity-80">10GbE</p>
                <p className="mt-1 text-[22px] font-[300] tabular-nums">9,41 Gbit/sn</p>
              </div>
            </div>
            <code className="mt-4 block rounded-xl border border-line-soft p-3 font-mono text-[12px] leading-relaxed break-words text-muted">
              bg-cyan-900/10 backdrop-blur-md border border-cyan-400/30 text-cyan-50 shadow-[0_0_15px_rgba(6,182,212,0.2)]
            </code>
          </HoloPanel>
          <HoloPanel className="p-5 md:p-6">
            <PanelHead title="React" meta="Madde 14" />
            <p className="mt-2 text-[14px] text-muted">shadcn/ui varyasyonları: Command → CommandCenter, Card → HoloPanel, data-table → DataGrid.</p>
            <pre className="thin-scroll mt-4 overflow-x-auto rounded-xl border border-line-soft p-3 font-mono text-[12px] leading-relaxed">
              <code>{REACT}</code>
            </pre>
          </HoloPanel>
        </div>
      </div>
    </section>
  )
}
