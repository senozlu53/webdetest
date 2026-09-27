import { Section } from '../components/ui'
import { IconBrain, IconNetwork, IconProcessorTree, IconSparkles } from '../components/Icons'
import { bez } from '../components/NeuralGraph'

const SW: { ad: string; token: string; hex: string; bg: string; not: string; k?: string }[] = [
  { ad: 'Derin uzay', token: 'Color/SpaceBlack', hex: '#0A0A0A', bg: '#0a0a0a', not: 'Zemin; açık tema yok' },
  { ad: 'Gradient/Brand', token: 'Mavi – mor', hex: '#60A5FA – #A78BFA', bg: 'linear-gradient(120deg,#60a5fa,#a78bfa)', not: 'Yapay zekâ: bağlantı, vurgu, birincil düğme', k: 'en az 6,91' },
  { ad: 'NodeActive', token: 'Color/NodeActive', hex: '#FACC15', bg: '#facc15', not: 'İşlemde: sarı parlama', k: '12,27' },
  { ad: 'NodeDone', token: 'Color/NodeDone', hex: '#4ADE80', bg: '#4ade80', not: 'Tamamlandı: yeşil parlama', k: '10,79' },
  { ad: 'Hata', token: 'Color/Error', hex: '#F87171', bg: '#f87171', not: 'Yalnız ikon ve metinle', k: '6,80' },
  { ad: 'EdgeLine', token: 'Color/EdgeLine', hex: '#8B5CF6 · %35', bg: 'rgb(139 92 246 / 0.35)', not: 'Bağlantı çizgisi; bilgi taşımaz' },
]

export function Palette() {
  return (
    <Section id="palet" eyebrow="Madde 4 – 9 · Görsel dil" title="Palet, yazı, şekil ve derinlik">
      <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
        <div className="panel ticks p-4 md:p-5">
          <h3 className="text-[16px] font-medium">Renk</h3>
          <p className="mt-1 text-[14px] text-muted">Kontrast değerleri panel yüzeyinde (#111118) ölçüldü.</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {SW.map((s) => (
              <li key={s.ad} className="flex min-w-0 gap-3">
                <span className="size-12 shrink-0 rounded-full border border-line-strong" style={{ background: s.bg }} />
                <span className="min-w-0">
                  <span className="block text-[15px] font-medium">{s.ad}</span>
                  <span className="block font-mono text-[11px] text-muted mono-tight">{s.hex}</span>
                  <span className="block text-[13px] text-muted">
                    {s.not}
                    {s.k ? ` · ${s.k}:1` : ''}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-5 grid grid-cols-3 gap-2 text-[13px]">
            <p className="rounded-lg border border-line p-2.5">
              <span className="block text-ink">Metin #EDEDF3</span>
              <span className="font-mono text-[11px] text-muted mono-tight">16,12:1</span>
            </p>
            <p className="rounded-lg border border-line p-2.5">
              <span className="block text-muted">İkincil #A3A3B8</span>
              <span className="font-mono text-[11px] text-muted mono-tight">7,60:1</span>
            </p>
            <p className="rounded-lg border border-line p-2.5">
              <span className="block text-faint">Soluk #8B8BA1</span>
              <span className="font-mono text-[11px] text-muted mono-tight">5,64:1</span>
            </p>
          </div>
        </div>

        <div className="panel ticks p-4 md:p-5">
          <h3 className="text-[16px] font-medium">Yazı</h3>
          <p className="mt-3 text-[44px] leading-none font-[250] tracking-tight">Outfit 250</p>
          <p className="mt-1 text-[15px] text-muted">Başlık ve metin: geometrik, sade, fütüristik. Gövde 16px / 1,6, ağırlık 350.</p>
          <p className="mt-5 font-mono text-[20px] leading-tight" style={{ fontStretch: '112.5%' }}>
            Martian Mono
          </p>
          <p className="mt-1 font-mono text-[13px] text-muted mono-tight">loss=2,28 · lr=1,1e-4 · adım 14.600</p>
          <p className="mt-2 text-[15px] text-muted">Veri, etiket ve kod: değişken genişlik ekseniyle etiketlerde %87,5 dar, başlıkta %112,5 geniş.</p>
          <p className="label mt-4">Etiket · 11px · büyük harf · %87,5</p>
          <ul className="mt-4 space-y-1.5 border-t border-line pt-3 text-[14px]">
            {[
              ['Kahraman', '68 / 250', 'text-[22px] font-[250]'],
              ['Bölüm', '40 / 300', 'text-[19px] font-[300]'],
              ['Panel başlığı', '16 / 500', 'text-[16px] font-medium'],
              ['Gövde', '16 / 350', 'text-[16px]'],
              ['Veri', 'Martian 12', 'font-mono text-[12px] mono-tight'],
            ].map(([a, b, c]) => (
              <li key={a} className="flex items-baseline justify-between gap-3">
                <span className={c}>{a}</span>
                <span className="font-mono text-[11px] text-muted mono-tight">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel ticks p-4 md:p-5">
          <h3 className="text-[16px] font-medium">Şekil ve derinlik</h3>
          <svg viewBox="0 0 320 120" className="mt-3 w-full" aria-hidden="true" fill="none">
            <defs>
              <linearGradient id="pg" x1="0" x2="1">
                <stop offset="0" stopColor="#60a5fa" />
                <stop offset="1" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
            <rect x="4" y="4" width="312" height="112" rx="12" stroke="var(--line-strong)" />
            <path d={bez(40, 84, 160, 36)} stroke="url(#pg)" strokeWidth={2} />
            <path d={bez(160, 36, 280, 84)} stroke="url(#pg)" strokeWidth={2} />
            <circle cx="40" cy="84" r="10" fill="#0a0a0a" stroke="url(#pg)" strokeWidth={1.5} />
            <circle cx="160" cy="36" r="12" fill="#0a0a0a" stroke="url(#pg)" strokeWidth={1.5} className="glow" />
            <circle cx="160" cy="36" r="4" fill="#a78bfa" className="glow" />
            <circle cx="280" cy="84" r="10" fill="#0a0a0a" stroke="url(#pg)" strokeWidth={1.5} />
          </svg>
          <p className="mt-2 text-[14px] text-muted">Düğüm daire, bağlantı Bezier eğrisi, kapsayıcı 1px çizgi ve köşe işaretleri. Parıltı: Effects/NeuralGlow.</p>
          <div className="mt-4 flex items-end justify-around gap-2" aria-hidden="true">
            {[
              ['Uzak', 3, 0.35, 10],
              ['Orta', 1.2, 0.6, 16],
              ['Odak', 0, 1, 22],
              ['Yakın', 5, 0.4, 34],
            ].map(([ad, b, o, s]) => (
              <span key={ad as string} className="flex flex-col items-center gap-2">
                <span className="dof rounded-full bg-[linear-gradient(120deg,#60a5fa,#a78bfa)]" style={{ width: s as number, height: s as number, opacity: o as number, filter: b ? `blur(${b}px)` : undefined }} />
                <span className="font-mono text-[11px] text-muted mono-tight">{ad}</span>
              </span>
            ))}
          </div>
          <p className="mt-3 text-[14px] text-muted">Madde 7: dört Z katmanı. Odak düzlemi keskin, önü ve arkası bulanık.</p>
        </div>

        <div className="panel ticks p-4 md:p-5">
          <h3 className="text-[16px] font-medium">İkonlar</h3>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {[
              [IconBrain, 'Beyin'],
              [IconNetwork, 'Sinir ağı'],
              [IconSparkles, 'Kıvılcım'],
              [IconProcessorTree, 'İşlemci ağacı'],
            ].map(([I, ad]) => {
              const Icon = I as typeof IconBrain
              return (
                <li key={ad as string} className="flex flex-col items-center gap-2 rounded-xl border border-line py-4">
                  <span className="glow grid size-12 place-items-center rounded-full border border-[rgb(167_139_250/0.5)] text-violet">
                    <Icon size={24} />
                  </span>
                  <span className="text-[13px] text-muted">{ad as string}</span>
                </li>
              )
            })}
          </ul>
          <p className="mt-3 text-[14px] text-muted">1,5px çizgi, yuvarlak uç; düğüm gibi daire içinde durur.</p>
          <div className="mt-4 flex items-end gap-5 border-t border-line pt-4 text-violet" aria-hidden="true">
            {[16, 20, 24, 32].map((s) => (
              <span key={s} className="flex flex-col items-center gap-1.5">
                <IconNetwork size={s} />
                <span className="font-mono text-[11px] text-muted mono-tight">{s}</span>
              </span>
            ))}
            <span className="ml-auto flex flex-col items-center gap-1.5">
              <span className="relative grid size-9 place-items-center rounded-full border-[1.5px] border-active text-active glow-active">
                <IconSparkles size={18} />
              </span>
              <span className="font-mono text-[11px] text-muted mono-tight">işlemde</span>
            </span>
          </div>
        </div>
      </div>
    </Section>
  )
}
