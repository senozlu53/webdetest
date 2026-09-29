import { Cizim, type Parca } from './Rough'

/** Kahraman çizim: buharı tüten fincan, altında tabak. Üç deneme, sürekli titrek (kare kare) */
const FINCAN: Parca[] = [{ d: 'M40 84 H150 V132 Q150 170 112 170 H80 Q40 170 40 132 Z', dolgu: '#1d3557', dolguTip: 'hachure', aralik: 9 }, { d: 'M150 96 Q190 94 190 122 Q190 152 150 148' }, { d: 'M18 186 Q90 194 176 184', sw: 4 }, { d: 'M52 96 Q95 104 140 94', renk: '#e63946', sw: 3 }]
export function KahramanFincan({ className, kare = 3 }: { className?: string; kare?: 1 | 3 }) {
  return (
    <div className={className} data-hero-fincan="">
      <div className="relative mx-auto aspect-[210/210] w-full max-w-[420px]">
        <Cizim w={210} h={210} parcalar={FINCAN} tohum={4} kusur={1.5} sw={3.4} kare={kare} hep className="size-full" etiket="Buharı tüten kahve fincanı, karakalem çizimi" />
        {[36, 78, 118].map((x, i) => (
          <span key={x} className="buhar absolute" style={{ left: `${(x / 210) * 100}%`, top: '2%', width: '13%', animationDelay: `${i * 0.6}s` }}>
            <Cizim w={30} h={80} parcalar={[{ d: 'M15 78 Q2 62 15 46 Q28 30 14 12', renk: 'var(--kirmizi)' }]} tohum={20 + i} sw={4.4} kusur={1.3} />
          </span>
        ))}
      </div>
    </div>
  )
}

/** Sayfa kenarı süsleri: yıldız, kıvrım, ok. Yalnız dekorasyon, ekran okuyucudan gizli */
export function Sus({ tur, className, boyut = 56 }: { tur: 'yildiz' | 'kivrim' | 'ok' | 'nokta'; className?: string; boyut?: number }) {
  const P: Record<string, { w: number; h: number; p: Parca[] }> = {
    yildiz: { w: 48, h: 48, p: [{ d: 'M24 5 L29 18 L43 19 L32 28 L36 42 L24 34 L12 42 L16 28 L5 19 L19 18 Z', renk: '#e63946' }] },
    kivrim: { w: 90, h: 30, p: [{ d: 'M4 20 Q14 2 24 18 Q34 34 44 16 Q54 0 64 16 Q74 32 86 12', renk: '#1d3557' }] },
    ok: {
      w: 90,
      h: 50,
      p: [
        { d: 'M4 38 Q30 4 78 18', renk: '#2b2b2b' },
        { d: 'M64 6 L80 18 L62 30', renk: '#2b2b2b' },
      ],
    },
    nokta: { w: 40, h: 40, p: [{ d: 'M8 20 Q8 8 20 8 Q32 8 32 20 Q32 32 20 32 Q10 33 9 22', renk: '#1d3557', dolgu: '#1d3557', dolguTip: 'zigzag', aralik: 4 }] },
  }
  const { w, h, p } = P[tur]
  return (
    <span className={className ?? 'block'} aria-hidden="true" style={{ width: boyut, height: (boyut * h) / w }}>
      <Cizim w={w} h={h} parcalar={p} tohum={tur.length + 4} sw={3} kusur={1.3} className="size-full" kare={3} hep />
    </span>
  )
}
