import { SectionHead } from '../components/SectionHead'
import { cx } from '../../shared/cx'

const SURFACES = [
  { name: 'Kabartma', en: 'Embossed', cls: 'neu-raised', text: 'İki dış gölge: yüzeyden yukarı kabarır. Düğme, kart, kontrol gövdesi.' },
  { name: 'Çökme', en: 'Debossed', cls: 'neu-inset', text: 'İki iç gölge: yüzeye gömülür. Metin alanı, oluk, basılı düğme.' },
  { name: 'Dışbükey', en: 'Convex', cls: 'neu-raised neu-convex', text: 'Kabartma + açıktan koyuya degrade: tümsek düğme başı.' },
  { name: 'İçbükey', en: 'Concave', cls: 'neu-raised neu-concave', text: 'Kabartma + ters degrade: çanak gibi hafif çukur yüzey.' },
] as const

const SHAPES = [
  { name: 'Kusursuz daire', cls: 'aspect-square w-24 rounded-full' },
  { name: 'Hap', cls: 'h-14 w-36 rounded-full' },
  { name: 'Geniş köşeli dikdörtgen', cls: 'h-24 w-36 rounded-neu' },
] as const

export function Surfaces() {
  return (
    <section id="ozellikler" className="px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="03 · 06 · 08"
          label="Karakteristikler ve şekil"
          title="Aynı renk, iki gölge"
          lede="Bileşen zeminle birebir aynı renktedir. Onu yüzeyden ayıran tek şey sol üstteki ışık ve sağ alttaki gölgedir. Keskin köşe yok; yüzey mat, dokusuz."
        />
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {SURFACES.map((s) => (
            <li key={s.name} className="flex flex-col gap-5">
              <div className={cx('neu aspect-square w-full rounded-neu-lg', s.cls)} aria-hidden="true" />
              <div className="flex flex-col gap-1 px-1">
                <h3 className="text-xl font-extrabold">
                  {s.name} <span className="text-sm font-bold text-muted" lang="en">{s.en}</span>
                </h3>
                <p className="text-muted">{s.text}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="neu neu-raised mt-14 flex flex-wrap items-center justify-around gap-10 rounded-neu-lg p-8 md:p-10">
          {SHAPES.map((s) => (
            <figure key={s.name} className="flex flex-col items-center gap-4">
              <span className={cx('neu neu-raised block', s.cls)} aria-hidden="true" />
              <figcaption className="text-sm font-bold text-muted">{s.name}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
