import { useEffect, useId, useState } from 'react'
import { SunIcon, WarningCircleIcon } from '@phosphor-icons/react'
import { SectionHead } from '../components/SectionHead'
import { NeuSegmented } from '../components/Controls'

type Kind = 'Kabartma' | 'Çökme' | 'Dışbükey' | 'İçbükey'
const KINDS: readonly Kind[] = ['Kabartma', 'Çökme', 'Dışbükey', 'İçbükey']

type RGBA = [number, number, number, number]

/** "#e0e5ec" ya da "rgb(163 177 198 / 0.5)" → [r, g, b, a] */
function parseColor(v: string): RGBA {
  const s = v.trim()
  if (s.startsWith('#')) return [0, 2, 4].map((i) => parseInt(s.slice(1 + i, 3 + i), 16)).concat(1) as RGBA
  const n = s.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0, 1]
  return [n[0], n[1], n[2], n[3] ?? 1]
}

function lum([r, g, b]: number[]) {
  const f = (c: number) => {
    const x = c / 255
    return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}
const ratio = (a: number[], b: number[]) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

/** Tema ya da zemin rengi değişince CSS değişkenlerini yeniden okur */
function useThemeColors() {
  const [colors, setColors] = useState({ base: '#e0e5ec', dark: 'rgb(163 177 198 / 0.5)', light: 'rgb(255 255 255 / 0.5)', border: '#737d91' })
  useEffect(() => {
    const read = () => {
      const cs = getComputedStyle(document.documentElement)
      setColors({
        base: cs.getPropertyValue('--base').trim(),
        dark: cs.getPropertyValue('--neu-dark').trim(),
        light: cs.getPropertyValue('--neu-light').trim(),
        border: cs.getPropertyValue('--a11y-border').trim(),
      })
    }
    read()
    const mo = new MutationObserver(read)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-base'] })
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', read)
    return () => {
      mo.disconnect()
      mq.removeEventListener('change', read)
    }
  }, [])
  return colors
}

function Range({ label, value, min, max, step = 1, unit, onChange }: { label: string; value: number; min: number; max: number; step?: number; unit: string; onChange: (v: number) => void }) {
  const id = useId()
  const fill = ((value - min) / (max - min)) * 100
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between gap-3 px-1">
        <label htmlFor={id} className="text-sm font-bold">
          {label}
        </label>
        <output htmlFor={id} className="text-sm font-extrabold tabular-nums">
          {value}
          {unit}
        </output>
      </div>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="neu-range" style={{ ['--fill' as string]: `${fill}%` }} />
    </div>
  )
}

export function ShadowLab() {
  const [kind, setKind] = useState<Kind>('Kabartma')
  const [dist, setDist] = useState(9)
  const [blur, setBlur] = useState(16)
  const [strength, setStrength] = useState(50)
  const [radius, setRadius] = useState(36)
  const c = useThemeColors()

  const dark = parseColor(c.dark)
  const light = parseColor(c.light)
  const base = parseColor(c.base)
  const a = strength / 100
  const darkC = `rgb(${dark[0]} ${dark[1]} ${dark[2]} / ${a.toFixed(2)})`
  const lightC = `rgb(${light[0]} ${light[1]} ${light[2]} / ${Math.min(1, (light[3] / dark[3]) * a).toFixed(2)})`
  const inset = kind === 'Çökme' ? 'inset ' : ''
  const shadow = `${inset}${dist}px ${dist}px ${blur}px ${darkC}, ${inset}-${dist}px -${dist}px ${blur}px ${lightC}`
  const gradient =
    kind === 'Dışbükey' ? 'linear-gradient(145deg, var(--neu-hi), var(--neu-lo))' : kind === 'İçbükey' ? 'linear-gradient(145deg, var(--neu-lo), var(--neu-hi))' : 'none'

  // Gölgenin en koyu noktası: gölge rengi, kendi opaklığıyla zeminin üstünde
  const edge = [0, 1, 2].map((i) => dark[i] * a + base[i] * (1 - a))
  const edgeRatio = ratio(edge, base)
  const borderRatio = ratio(parseColor(c.border), base)
  const fmt = (v: number) => v.toFixed(2).replace('.', ',')

  const tw = `bg-[${c.base}] rounded-[${radius}px] shadow-[${inset ? 'inset_' : ''}${dist}px_${dist}px_${blur}px_rgb(${dark[0]},${dark[1]},${dark[2]},${a.toFixed(2)}),${inset ? 'inset_' : ''}-${dist}px_-${dist}px_${blur}px_rgba(${light[0]},${light[1]},${light[2]},${Math.min(1, (light[3] / dark[3]) * a).toFixed(2)})]`

  return (
    <section id="golge" className="px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="07 · 12 · 13"
          label="Z-ekseni ve gölge"
          title="Çift gölge laboratuvarı"
          lede="Işık sol üstten gelir. Her bileşende iki gölge vardır: sol üstte açık, sağ altta koyu. Değerleri değiştirin; CSS ve Tailwind çıktısı ile sınır kontrastı anında güncellenir."
        />
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="neu neu-inset relative grid min-h-[420px] place-items-center overflow-hidden rounded-neu-lg p-10">
            <span className="absolute top-5 left-5 flex items-center gap-2 text-sm font-bold text-muted">
              <SunIcon size={22} weight="bold" className="text-accent" aria-hidden="true" />
              Işık kaynağı
            </span>
            <div
              className="grid size-48 place-items-center text-center"
              style={{ background: `${gradient === 'none' ? '' : gradient + ', '}var(--base)`, boxShadow: shadow, borderRadius: radius }}
              role="img"
              aria-label={`${kind} yüzey önizlemesi`}
            >
              <span className="text-sm font-bold text-muted">{kind}</span>
            </div>
            <span className="absolute right-5 bottom-5 text-sm font-bold text-muted tabular-nums">
              {dist}px · {blur}px
            </span>
          </div>

          <div className="flex min-w-0 flex-col gap-6">
            <NeuSegmented label="Yüzey türü" options={KINDS} value={kind} onChange={setKind} />
            <div className="grid gap-5 sm:grid-cols-2">
              <Range label="Mesafe" value={dist} min={2} max={24} unit="px" onChange={setDist} />
              <Range label="Yayılma (blur)" value={blur} min={2} max={48} unit="px" onChange={setBlur} />
              <Range label="Gölge gücü" value={strength} min={10} max={100} unit="%" onChange={setStrength} />
              <Range label="Köşe yarıçapı" value={radius} min={0} max={96} unit="px" onChange={setRadius} />
            </div>

            <div role="status" className="neu neu-raised-sm flex gap-3 rounded-neu p-4">
              <WarningCircleIcon size={24} weight="fill" className="shrink-0 text-accent" aria-hidden="true" />
              <div className="flex flex-col gap-1 text-sm">
                <p className="font-extrabold">Sınır kontrastı: {fmt(edgeRatio)}:1 · gerekli 3:1</p>
                <p className="text-muted">
                  Gölge gücü %100 olsa bile yetmez; bileşeni yalnızca gölge tanımlar. Erişilebilir modda eklenen 1px kenar{' '}
                  {fmt(borderRatio)}:1 verir.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="px-1 text-sm font-bold">CSS</p>
              <pre className="neu neu-inset overflow-x-auto rounded-neu p-4 font-mono text-xs leading-relaxed">
                <code>{`background: ${gradient === 'none' ? c.base : gradient + ', ' + c.base};\nborder-radius: ${radius}px;\nbox-shadow: ${shadow.replace(', ', ',\n            ')};`}</code>
              </pre>
              <p className="px-1 text-sm font-bold" lang="en">
                Tailwind
              </p>
              <pre className="neu neu-inset overflow-x-auto rounded-neu p-4 font-mono text-xs leading-relaxed">
                <code>{tw}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
