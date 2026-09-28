import { BrutalistCard } from '../components/BrutalistCard'
import { Code, Section } from '../components/ui'

const TOKENS: [string, string, string][] = [
  ['Border/ThickBlack', '3px solid #000000', 'Koyuda #FFFFFF. Buton 4px (Madde 15).'],
  ['Shadow/SolidOffset', 'x 6 · y 6 · blur 0 · #000', 'Hover 4px, basılı 0. Koyuda beyaz.'],
  ['Typography/Oversized', 'Archivo 900 · %125', 'clamp(40px, 11vw, 148px)'],
  ['Color/Paper', '#F4F4F0', 'Kirli beyaz zemin'],
  ['Color/Yellow', '#FFD500', 'Sarı zemin ya da dolgu'],
  ['Color/CMYK', '#FF4D3D · #3D7BFF · #00C16A', 'Kırmızı, mavi, yeşil'],
  ['Radius/Sharp · Soft', '0 · 14px', 'Ayarlardan değişir'],
]

const REACT = `<BrutalistCard fill="yellow" interactive>
  <Tag fill="ink" tilt={-4}>Yeni</Tag>
  <h3>Sert Kapşonlu</h3>
  <SolidButton fill="yellow" icon={<IconCart />}>
    Sepete ekle
  </SolidButton>
</BrutalistCard>

<Marquee items={['Ham', 'Sert', 'Düz']} speed="normal" />`

const TW = `border-4 border-black
shadow-[6px_6px_0px_rgba(0,0,0,1)]
hover:translate-x-[2px] hover:translate-y-[2px]
hover:shadow-[4px_4px_0px_rgba(0,0,0,1)]

/* koyu varyant */
dark:border-white
dark:shadow-[6px_6px_0px_rgba(255,255,255,1)]`

const CSS = `.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee var(--mq-dur) linear infinite;
}
@keyframes marquee {
  to { transform: translateX(-50%); }
}
/* süre = kopya genişliği / hız (px/sn) */`

export function Build() {
  return (
    <Section id="yapi" n="12" kicker="Madde 12 · 13 · 14 · 15 · Figma ve kod" title="3px, siyah, her yerde" lead="Figma’da her bileşenin çizgisi aynı: Stroke 3px, Black, Inside. Auto Layout boşlukları bilerek asimetrik ya da çok geniş.">
      <div className="grid gap-8 lg:grid-cols-12">
        <BrutalistCard className="lg:col-span-5">
          <h3 className="headline">Katman özellikleri</h3>
          <dl className="mt-5 divide-y-[3px] divide-line rounded-brut border-[3px] border-line font-mono text-[14px] font-bold">
            {[
              ['Stroke', '3 · Inside · #000000 · %100'],
              ['Effect', 'Drop shadow'],
              ['X · Y', '6 · 6'],
              ['Blur · Spread', '0 · 0'],
              ['Fill', 'Solid · düz renk'],
              ['Corner', '0 ya da 14'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 px-3 py-2">
                <dt>{k}</dt>
                <dd className="text-right">{v}</dd>
              </div>
            ))}
          </dl>
        </BrutalistCard>
        <BrutalistCard fill="pink" className="lg:col-span-7 lg:mt-12">
          <h3 className="headline">Asimetrik Auto Layout</h3>
          <div className="relative mt-6 w-fit max-w-full" aria-hidden="true">
            <div className="relative rounded-brut border-[3px] border-black bg-white pt-5 pr-7 pb-6 pl-5 text-black">
              <span className="absolute inset-x-0 top-0 h-5 bg-[repeating-linear-gradient(45deg,#3d7bff55_0_4px,transparent_4px_8px)]" />
              <span className="absolute inset-y-0 right-0 w-7 bg-[repeating-linear-gradient(45deg,#ff4d3d55_0_4px,transparent_4px_8px)]" />
              <span className="absolute inset-x-0 bottom-0 h-6 bg-[repeating-linear-gradient(45deg,#00c16a55_0_4px,transparent_4px_8px)]" />
              <span className="absolute inset-y-0 left-0 w-5 bg-[repeating-linear-gradient(45deg,#ffd50099_0_4px,transparent_4px_8px)]" />
              <p className="relative font-display text-[24px] font-black uppercase">Kart</p>
              <p className="relative mt-3 font-bold">İçerik</p>
            </div>
          </div>
          <ul className="mt-5 grid grid-cols-2 gap-2 font-mono text-[14px] font-bold sm:grid-cols-4">
            <li className="border-[3px] border-black bg-[#3d7bff] px-2 py-1 text-black">üst 20</li>
            <li className="border-[3px] border-black bg-[#ff4d3d] px-2 py-1 text-black">sağ 28</li>
            <li className="border-[3px] border-black bg-[#00c16a] px-2 py-1 text-black">alt 24</li>
            <li className="border-[3px] border-black bg-[#ffd500] px-2 py-1 text-black">sol 20</li>
          </ul>
          <p className="mt-4 font-medium">Bölümler arası 112–128px, ızgara aralığı 32–40px; bazı kartlar bilerek 16–48px kaydırılır.</p>
        </BrutalistCard>
        <BrutalistCard fill="yellow" className="lg:col-span-12">
          <h3 className="headline">Figma tokenları</h3>
          <div className="scroll-x mt-5 rounded-brut border-[3px] border-black bg-white text-black" tabIndex={0} role="region" aria-label="Token tablosu, yatay kaydırılabilir">
            <table className="w-full min-w-[640px] text-left">
              <caption className="sr-only">Figma değişkenleri</caption>
              <thead>
                <tr className="border-b-[3px] border-black">
                  {['Token', 'Değer', 'Not'].map((h) => (
                    <th key={h} scope="col" className="px-3 py-2 text-[13px] font-bold uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TOKENS.map(([k, v, n]) => (
                  <tr key={k} className="border-b-[3px] border-black last:border-0">
                    <th scope="row" className="px-3 py-2 font-mono text-[14px] font-bold">
                      {k}
                    </th>
                    <td className="px-3 py-2 font-mono text-[14px]">{v}</td>
                    <td className="px-3 py-2 font-medium">{n}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 font-bold">Tamamı tokens/brut.tokens.json dosyasında.</p>
        </BrutalistCard>
        <div className="grid gap-6 lg:col-span-12 lg:grid-cols-3">
          <Code label="React">{REACT}</Code>
          <Code label="Tailwind · Madde 15" labelLang="en">
            {TW}
          </Code>
          <Code label="CSS · Marquee">{CSS}</Code>
        </div>
      </div>
    </Section>
  )
}
