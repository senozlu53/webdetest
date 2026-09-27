import { useId, useMemo, useState } from 'react'
import { CheckIcon, XIcon } from '@phosphor-icons/react'
import { FacetField, SectionHead } from '../components/ui'
import { buildMesh, lightDir, shade } from '../lib/facets'

const rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
const lin = (c: number) => {
  const s = c / 255
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}
const lum = (c: number[]) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2])
const ratio = (a: number[], b: number[]) => {
  const [x, y] = [lum(a), lum(b)]
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
}
const fmt = (n: number) => n.toFixed(2).replace('.', ',')

const SEED = 4
const COLS = 12
const ROWS = 6

export function Access({ dark }: { dark: boolean }) {
  const [alpha, setAlpha] = useState(78)
  const id = useId()
  // Arkadaki gerçek yüz renkleri: aynı tohum ve ışıkla hesaplanır
  const faces = useMemo(() => {
    const mesh = buildMesh({ width: 1600, height: 900, cols: COLS, rows: ROWS, seed: SEED })
    return [...new Set(shade(mesh, lightDir(135, 42), { zScale: 120, ambient: 0.34 }).map((f) => f.fill))].map(rgb)
  }, [])
  const ink = dark ? rgb('#f2f2f2') : rgb('#101820')
  const panel = dark ? rgb('#101820') : rgb('#f2f2f2')
  const bare = Math.min(...faces.map((f) => ratio(ink, f)))
  const a = alpha / 100
  const onGlass = Math.min(...faces.map((f) => ratio(ink, f.map((v, i) => panel[i] * a + v * (1 - a)))))
  const token = dark ? 78 : 82
  const ok = onGlass >= 4.5

  return (
    <section id="erisilebilirlik" className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="18"
          label="Erişilebilirlik ve varyantlar"
          title="Metin asla çokgenin üstünde değil"
          lede="Yüz yüz değişen tonlar metnin arkasında en koyudan en açığa kadar her rengi toplar. Bu yüzden metin düz renkli, yarı saydam ve bulanık bir cam panele oturur. Sağdaki kaydırıcı panelin opaklığını değiştirir; en kötü durum kontrastı gerçek yüz renkleriyle hesaplanır."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <figure className="relative isolate min-h-72 overflow-hidden">
            <div className="absolute inset-0 -z-10">
              <FacetField seed={SEED} cols={COLS} rows={ROWS} />
            </div>
            <div className="flex h-full min-h-72 flex-col justify-end p-6">
              <p className="font-display text-3xl font-bold text-ink">Doğrudan zeminde metin</p>
              <p className="text-ink">Bazı yüzlerde okunur, bazılarında kaybolur.</p>
            </div>
            <figcaption className="absolute top-4 left-4 flex items-center gap-2 bg-bg px-3 py-1.5 text-[14px] font-semibold">
              <XIcon size={16} weight="bold" aria-hidden="true" /> Yapmayın · en kötü {fmt(bare)}:1
            </figcaption>
          </figure>

          <figure className="relative isolate min-h-72 overflow-hidden">
            <div className="absolute inset-0 -z-10">
              <FacetField seed={SEED} cols={COLS} rows={ROWS} />
            </div>
            <div className="flex h-full min-h-72 flex-col justify-end p-6">
              <div
                className="border p-5"
                style={{
                  background: `rgb(${panel.join(' ')} / ${a})`,
                  borderColor: 'var(--glass-line)',
                  backdropFilter: 'blur(14px) saturate(115%)',
                  WebkitBackdropFilter: 'blur(14px) saturate(115%)',
                }}
              >
                <p className="font-display text-3xl font-bold text-ink">Cam panelde metin</p>
                <p className="text-ink">Her yüzün önünde aynı kontrast.</p>
              </div>
            </div>
            <figcaption className="absolute top-4 left-4 flex items-center gap-2 bg-bg px-3 py-1.5 text-[14px] font-semibold">
              {ok ? <CheckIcon size={16} weight="bold" aria-hidden="true" /> : <XIcon size={16} weight="bold" aria-hidden="true" />}
              {ok ? 'Yapın' : 'Yetersiz'} · en kötü {fmt(onGlass)}:1
            </figcaption>
          </figure>
        </div>

        <div className="glass mt-6 grid gap-6 p-6 md:grid-cols-[1fr_1.2fr] md:p-8">
          <div>
            <div className="flex items-baseline justify-between text-[14px] font-semibold">
              <label htmlFor={id}>Cam panel opaklığı</label>
              <output htmlFor={id} className="font-mono">
                %{alpha}
              </output>
            </div>
            <input id={id} type="range" min={0} max={95} value={alpha} onChange={(e) => setAlpha(Number(e.target.value))} className="mt-2 w-full accent-[var(--accent)]" />
            <p className="mt-3 text-[14px] text-muted" aria-live="polite">
              En kötü durum {fmt(onGlass)}:1 · {ok ? 'AA (4,5:1) karşılanıyor.' : 'AA için 4,5:1 gerekir.'} Tema değeri %{token}.
            </p>
            <button type="button" onClick={() => setAlpha(token)} className="mt-3 min-h-11 cursor-pointer text-[14px] font-semibold text-accent underline underline-offset-4">
              Token değerine getir (%{token})
            </button>
          </div>
          <ul className="flex flex-col gap-3 text-[15px]">
            <li>
              <strong className="font-semibold">Bulanıklık yetmez:</strong> <span className="text-muted">blur ortalama rengi değiştirmez; kontrastı opaklık belirler.</span>
            </li>
            <li>
              <strong className="font-semibold">3B sahne süs:</strong>{' '}
              <span className="text-muted">canvas ekran okuyucudan gizli; vitrinin kısa bir açıklaması var, her etkileşimin (parçala, döndür) düğmesi var.</span>
            </li>
            <li>
              <strong className="font-semibold">Durdurulabilir hareket:</strong>{' '}
              <span className="text-muted">sahne düğmeyle durur (WCAG 2.2.2); hareketi azalt açıksa model dönmez ve imleci izlemez.</span>
            </li>
            <li>
              <strong className="font-semibold">Kesik şekil, tam odak:</strong>{' '}
              <span className="text-muted">clip-path yalnız arka katmandadır; odak halkası kırpılmaz.</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
