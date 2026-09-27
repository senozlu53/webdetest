import { Glass, Origami, SectionHead } from '../components/ui'
import { ORIGAMI } from '../lib/shapes'

// Her renk için ışığa bakan, orta ve gölgedeki yüz; kontrast #101820 zemine göre
const COLORS = [
  { name: 'Derin Gece', hex: '#101820', faces: ['#1d2a36', '#101820', '#080c10'], onBg: '1,00', use: 'Zemin, gökyüzü' },
  { name: 'Denizaltı Mavisi', hex: '#314E52', faces: ['#44686d', '#314e52', '#1f3336'], onBg: '2,00', use: 'Gölgedeki yüzler, kaide' },
  { name: 'Mat Turkuaz', hex: '#7A9E9F', faces: ['#9fbfc0', '#7a9e9f', '#56797a'], onBg: '6,15', use: 'Orta tonlar, ikon' },
  { name: 'Kum', hex: '#E8D8B0', faces: ['#f4ead0', '#e8d8b0', '#c7b68b'], onBg: '12,68', use: 'Işık, vurgu, ana düğme' },
  { name: 'Kırık Beyaz', hex: '#F2F2F2', faces: ['#ffffff', '#f2f2f2', '#cfcfcf'], onBg: '15,98', use: 'Metin, zirveler' },
]

export function Palette() {
  return (
    <section id="renk" className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="04 · 05 · 09"
          label="Renk, yazı, ikon"
          title="Gece mavisinden kuma"
          lede="Beş renk bir yükseklik rampası kurar: vadiler derin gece, yamaçlar denizaltı ve turkuaz, zirveler kum ve beyaz. Her renk ışığa göre üç yüz tonuna ayrılır."
        />
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {COLORS.map((c) => (
            <li key={c.hex}>
              <Glass className="flex h-full flex-col gap-3 p-4">
                <svg viewBox="0 0 120 90" className="w-full" aria-hidden="true">
                  <polygon points="0,0 70,0 38,52" fill={c.faces[0]} />
                  <polygon points="70,0 120,0 120,40 38,52" fill={c.faces[1]} />
                  <polygon points="0,0 38,52 0,90" fill={c.faces[1]} />
                  <polygon points="38,52 120,40 120,90 0,90" fill={c.faces[2]} />
                </svg>
                <div>
                  <p className="font-display font-bold">{c.name}</p>
                  <p className="font-mono text-[13px]">{c.hex}</p>
                  <p className="text-[13px] text-muted">{c.use}</p>
                </div>
                <p className="mt-auto font-mono text-[12px] text-muted">zeminde {c.onBg}:1</p>
              </Glass>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[14px] text-muted">Denizaltı mavisi zeminde 2,0:1 kalır: metin rengi olmaz, yalnızca yüz ve çizgi rengidir.</p>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <Glass className="p-6 md:p-8">
            <h3 className="text-xl font-bold">Tipografi · Madde 5</h3>
            <p className="text-[15px] text-muted">Başlıklar Space Grotesk (Florian Karsten, keskin geometrik, 300–700), gövde Inter. İkisi de Türkçe harfleri ve ₺ içerir.</p>
            <ul className="mt-6 flex flex-col gap-5">
              <li>
                <span className="font-mono text-[12px] text-muted">Display · Space Grotesk 700 · 72</span>
                <p className="font-display text-5xl leading-none font-bold md:text-7xl">Faset 32△</p>
              </li>
              <li>
                <span className="font-mono text-[12px] text-muted">Başlık · Space Grotesk 600 · 28</span>
                <p className="font-display text-[28px] leading-tight font-semibold">Keskin hatlar, düz ışık</p>
              </li>
              <li>
                <span className="font-mono text-[12px] text-muted">Gövde · Inter 400 · 16</span>
                <p>Her yüz tek renktir; gözü yoran geçişler yerine net kenarlar okunur.</p>
              </li>
            </ul>
          </Glass>
          <Glass className="p-6 md:p-8">
            <h3 className="text-xl font-bold">Origami ikonlar · Madde 9</h3>
            <p className="text-[15px] text-muted">Her ikon katlanmış kâğıt gibi üç tonlu üçgenlerden kurulur: aydınlık kat, orta kat, gölgedeki kat.</p>
            <ul className="mt-6 grid grid-cols-3 gap-4">
              {(Object.keys(ORIGAMI) as Array<keyof typeof ORIGAMI>).map((k) => (
                <li key={k} className="flex flex-col items-center gap-2 border border-line p-4">
                  <Origami name={k} size={52} />
                  <span className="text-[14px] font-semibold">{ORIGAMI[k].name}</span>
                </li>
              ))}
            </ul>
          </Glass>
        </div>
      </div>
    </section>
  )
}
