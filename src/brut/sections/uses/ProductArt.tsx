import type { Shape } from '../../lib/data'

/** Ürün görseli: düz renk zemin üstünde kalın konturlu basit şekil (fotoğraf yok, Madde 8: doku yok) */
export function ProductArt({ shape }: { shape: Shape }) {
  const p = { fill: '#ffffff', stroke: '#000', strokeWidth: 4, strokeLinejoin: 'miter' as const, strokeLinecap: 'square' as const }
  return (
    <svg viewBox="0 0 160 120" className="h-full w-full" aria-hidden="true">
      {shape === 'kapsonlu' ? (
        <>
          <path d="M55 22h50l24 22-14 14-8-8v56H53V50l-8 8-14-14z" {...p} />
          <path d="M62 22c0 14 8 22 18 22s18-8 18-22" {...p} fill="none" />
          <path d="M64 86h32v18H64z" {...p} fill="#000" />
        </>
      ) : shape === 'corap' ? (
        <>
          <path d="M44 14h30v52l22 18a14 14 0 0 1-16 22l-38-26V14z" {...p} />
          <path d="M44 28h30M44 40h30" {...p} />
          <path d="M92 18h26v48l18 14a12 12 0 0 1-14 20l-30-20z" {...p} fill="#000" />
        </>
      ) : shape === 'sapka' ? (
        <>
          <path d="M34 78a46 46 0 0 1 92 0z" {...p} />
          <path d="M26 78h108v14H26z" {...p} fill="#000" />
          <path d="M80 32v46" {...p} />
        </>
      ) : shape === 'tisort' ? (
        <>
          <path d="M56 18h48l30 20-12 20-14-8v58H52V50l-14 8-12-20z" {...p} />
          <path d="M68 18a12 12 0 0 0 24 0" {...p} fill="none" />
          <path d="M66 62h28v22H66z" {...p} fill="#000" />
        </>
      ) : shape === 'canta' ? (
        <>
          <path d="M34 46h92l-8 62H42z" {...p} />
          <path d="M58 46V32a22 22 0 0 1 44 0v14" {...p} fill="none" />
          <path d="M70 64h20v20H70z" {...p} fill="#000" />
        </>
      ) : (
        <>
          <path d="M20 48h52v30H20zM88 48h52v30H88z" {...p} fill="#000" />
          <path d="M72 58h16" {...p} />
          <path d="M28 54h14" stroke="#fff" strokeWidth={4} />
        </>
      )}
    </svg>
  )
}
