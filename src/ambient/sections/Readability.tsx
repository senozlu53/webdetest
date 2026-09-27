import { useId, useState } from 'react'
import { CheckCircleIcon, WarningCircleIcon } from '@phosphor-icons/react'
import { SectionHead } from '../components/SectionHead'
import { GlowCard } from '../components/GlowCard'
import { GradientMesh } from '../components/GradientMesh'
import { cx } from '../../shared/cx'

type RGB = [number, number, number]
const hex = (h: string): RGB => [0, 2, 4].map((i) => parseInt(h.slice(1 + i, 3 + i), 16)) as RGB
const mix = (a: RGB, b: RGB, t: number): RGB => a.map((v, i) => v * t + b[i] * (1 - t)) as RGB
const lum = (c: RGB) =>
  c
    .map((v) => v / 255)
    .map((x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4))
    .reduce((acc, v, i) => acc + v * [0.2126, 0.7152, 0.0722][i], 0)
const ratio = (a: RGB, b: RGB) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

const THEMES = {
  dark: {
    scrim: hex('#07060F'),
    text: hex('#FFFFFF'),
    muted: hex('#CDD0E6'),
    // Aurora1 + Aurora2 lekelerinin tam merkezi ve zemin
    bgs: ['#7C3AED', '#22D3EE', '#F472B6', '#34D399', '#6366F1', '#EC4899', '#F59E0B', '#10B981', '#05040D'].map(hex),
    token: 62,
    css: '7 6 15',
  },
  light: {
    scrim: hex('#FFFFFF'),
    text: hex('#14112B'),
    muted: hex('#4A4766'),
    bgs: ['#C4B5FD', '#A5F3FC', '#FBCFE8', '#A7F3D0', '#C7D2FE', '#F9A8D4', '#FDE68A', '#6EE7B7', '#F7F5FF'].map(hex),
    token: 30,
    css: '255 255 255',
  },
} as const

export function Readability({ dark }: { dark: boolean }) {
  const t = dark ? THEMES.dark : THEMES.light
  const [strength, setStrength] = useState(0)
  const id = useId()
  const a = strength / 100
  const main = Math.min(...t.bgs.map((b) => ratio(t.text, mix(t.scrim, b, a))))
  const muted = Math.min(...t.bgs.map((b) => ratio(t.muted, mix(t.scrim, b, a))))
  const pass = main >= 4.5 && muted >= 4.5
  const fmt = (v: number) => v.toFixed(2).replace('.', ',')

  return (
    <section id="okunurluk" className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="18"
          label="Okunurluk"
          title="Akan zeminde okunur yazı"
          lede="Zemin sürekli değiştiği için metin er geç en parlak lekenin üstüne denk gelir. Koruyucu gradyan bu anı garanti altına alır. Sıfırdan başlayın ve kaydırıcıyı artırın."
        />
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <GradientMesh palette="aurora2" className="relative grid min-h-[340px] place-items-center overflow-hidden rounded-[28px] p-6">
            <div className="max-w-md rounded-[24px] p-6" style={{ background: `rgb(${t.css} / ${a})` }}>
              <p className="text-2xl font-light">Bugünün özeti hazır</p>
              <p className="mt-2 text-muted">Üç toplantı, iki onay bekleyen belge ve yarın için hava durumu. Ayrıntılar için sorun.</p>
            </div>
          </GradientMesh>
          <GlowCard className="flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between">
                <label htmlFor={id} className="font-normal">
                  Koruyucu gradyan
                </label>
                <output htmlFor={id} className="font-mono text-sm tabular-nums">
                  %{strength}
                </output>
              </div>
              <input
                id={id}
                type="range"
                min={0}
                max={80}
                value={strength}
                onChange={(e) => setStrength(Number(e.target.value))}
                className="h-11 w-full cursor-pointer accent-(--ring)"
              />
              <button type="button" onClick={() => setStrength(t.token)} className="w-fit cursor-pointer text-sm text-accent underline underline-offset-4">
                Token değerine getir (%{t.token})
              </button>
            </div>
            <div role="status" className={cx('flex gap-3 rounded-2xl border p-4', pass ? 'border-line' : 'border-(--a1-3)')}>
              {pass ? (
                <CheckCircleIcon size={24} weight="fill" className="shrink-0 text-accent" aria-hidden="true" />
              ) : (
                <WarningCircleIcon size={24} weight="fill" className="shrink-0 text-accent" aria-hidden="true" />
              )}
              <div className="text-sm">
                <p className="font-normal">
                  En kötü durum: ana metin {fmt(main)}:1 · ikincil {fmt(muted)}:1
                </p>
                <p className="mt-1 text-muted">{pass ? 'İkisi de AA (4,5:1) üstünde.' : 'AA için 4,5:1 gerekir: katmanı güçlendirin.'}</p>
              </div>
            </div>
            <p className="text-sm text-muted">
              Hesap, sekiz aurora renginin her birinin tam merkezde metnin arkasına geldiği anı esas alır. İnce yazı ağırlığı okumayı
              zorlaştırdığı için gövde metni 300, küçük etiketler 400 ağırlıktadır.
            </p>
          </GlowCard>
        </div>
      </div>
    </section>
  )
}
