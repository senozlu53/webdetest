import type { ComponentType } from 'react'
import { Section } from '../components/ui'
import { BrutalistCard } from '../components/BrutalistCard'
import * as I from '../components/Icons'
import { cx } from '../../shared/cx'

const LIGHT: [string, string, string, string][] = [
  ['Kirli beyaz', '#F4F4F0', 'Zemin', '19,05'],
  ['Sarı', '#FFD500', 'Zemin ya da vurgu', '14,77'],
  ['Saf siyah', '#000000', 'Çerçeve, metin, gölge', '–'],
  ['CMYK kırmızı', '#FF4D3D', 'Vurgu, hata', '6,38'],
  ['CMYK mavi', '#3D7BFF', 'Vurgu, bilgi', '5,48'],
  ['CMYK yeşil', '#00C16A', 'Vurgu, başarı', '8,84'],
  ['Pembe', '#FF90E8', 'Çıkartma, ikincil', '10,41'],
]
const DARK: [string, string, string][] = [
  ['Zemin', '#000000', 'beyaz metin 21:1'],
  ['Neon sarı', '#FFF000', '17,72'],
  ['Neon kırmızı', '#FF3860', '5,99'],
  ['Neon mavi', '#4D9DFF', '7,58'],
  ['Neon yeşil', '#39FF14', '15,49'],
  ['Neon pembe', '#FF3EA5', '6,48'],
]
const ICONS: [keyof typeof I, string][] = [
  ['IconArrow', 'Ok'],
  ['IconCart', 'Sepet'],
  ['IconHeart', 'Beğeni'],
  ['IconStar', 'Yıldız'],
  ['IconBolt', 'Şimşek'],
  ['IconTerminal', 'Uçbirim'],
  ['IconRocket', 'Roket'],
  ['IconCopy', 'Kopyala'],
  ['IconEye', 'Göster'],
  ['IconWarning', 'Uyarı'],
  ['IconSmile', 'Gülen yüz'],
  ['IconGrid', 'Izgara'],
]

export function Palette() {
  return (
    <Section id="palet" n="04" kicker="Madde 4 – 9 · Görsel dil" title="Palet, yazı, şekil" lead="Metin ve çerçeve her zaman saf siyah; renk yalnız düz dolgu. Oranlar vurgunun üstündeki siyah metin içindir.">
      <div className="grid gap-8 lg:grid-cols-12">
        <BrutalistCard className="lg:col-span-7">
          <h3 className="headline">Açık</h3>
          <ul className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {LIGHT.map(([ad, hex, rol, k]) => (
              <li key={hex} className="min-w-0">
                <span className="block h-20 rounded-brut border-[3px] border-black" style={{ background: hex }} />
                <p className="mt-2 font-bold">{ad}</p>
                <p className="font-mono text-[13px] font-bold">{hex}</p>
                <p className="text-[14px] text-muted">
                  {rol}
                  {k !== '–' ? ` · siyah ${k}:1` : ''}
                </p>
              </li>
            ))}
          </ul>
        </BrutalistCard>
        <div className="rounded-brut border-[3px] border-white bg-black p-5 pr-7 text-white shadow-[6px_6px_0_#fff] ring-[3px] ring-black lg:col-span-5 lg:mt-16">
          <h3 className="headline">Koyu varyant</h3>
          <p className="mt-2 font-medium text-[#c8c8c8]">Siyah zemin, kalın beyaz çerçeve, beyaz gölge, neon dolgu.</p>
          <ul className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {DARK.map(([ad, hex, k]) => (
              <li key={hex}>
                <span className="block h-16 rounded-brut border-[3px] border-white" style={{ background: hex }} />
                <p className="mt-2 font-bold">{ad}</p>
                <p className="font-mono text-[13px] font-bold">{hex}</p>
                <p className="text-[13px] text-[#c8c8c8]">{k.includes(':') ? k : `siyah ${k}:1`}</p>
              </li>
            ))}
          </ul>
        </div>

        <BrutalistCard fill="yellow" className="lg:col-span-12">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div className="min-w-0">
              <h3 className="headline">Yazı</h3>
              <p className="mt-4 font-display text-[clamp(64px,11vw,168px)] leading-[0.85] font-black uppercase [font-stretch:var(--wd,125%)]" aria-hidden="true">
                Ağır ₺
              </p>
              <p className="mt-3 font-bold">Archivo · 900 · genişlik %125 (mobilde %100). Başlık, fiyat, etiket.</p>
            </div>
            <div className="min-w-0 space-y-5">
              <div>
                <p className="font-sans text-[30px] leading-tight font-bold">Space Grotesk</p>
                <p className="font-medium">Gövde: 18px / 1,55 (mobilde 16px). Ğ ğ Ş ş İ ı Ç ç Ö ö Ü ü.</p>
              </div>
              <div>
                <p className="font-mono text-[22px] font-bold">JetBrains Mono</p>
                <p className="font-medium">Kod, anahtar, kısa etiket.</p>
              </div>
              <table className="w-full text-left text-[15px]">
                <caption className="sr-only">Yazı ölçeği: masaüstü ve mobil</caption>
                <thead>
                  <tr className="border-b-[3px] border-black">
                    <th scope="col" className="py-1 font-bold">
                      Düzey
                    </th>
                    <th scope="col" className="py-1 font-bold">
                      1280px
                    </th>
                    <th scope="col" className="py-1 font-bold">
                      390px
                    </th>
                  </tr>
                </thead>
                <tbody className="font-mono text-[14px] font-bold">
                  {[
                    ['Mega', '141px', '52px'],
                    ['Display', '92px', '34px'],
                    ['Başlık', '33px', '22px'],
                    ['Gövde', '18px', '16px'],
                  ].map((r) => (
                    <tr key={r[0]} className="border-b-[3px] border-black last:border-0">
                      <th scope="row" className="py-1 font-bold">
                        {r[0]}
                      </th>
                      <td>{r[1]}</td>
                      <td>{r[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </BrutalistCard>

        <BrutalistCard className="lg:col-span-5">
          <h3 className="headline">Şekil ve gölge</h3>
          <div className="mt-6 grid grid-cols-3 items-end gap-5" aria-hidden="true">
            <span className="aspect-square border-[3px] border-line fill-red brut-shadow" />
            <span className="aspect-square rounded-[18px] border-[3px] border-line fill-blue brut-shadow" />
            <span className="aspect-square rounded-full border-[3px] border-line fill-green brut-shadow" />
          </div>
          <div className="mt-10" aria-hidden="true">
            <span className="block h-20 w-[70%] border-[3px] border-line bg-surface brut-shadow" />
            <span className="mt-4 block font-mono text-[13px] font-bold">x 6 · y 6 · blur 0</span>
          </div>
          <p className="font-medium">Köşeli, 18px yuvarlak ya da tam daire; çizgi ve gölge hep aynı.</p>
        </BrutalistCard>

        <BrutalistCard fill="green" className="lg:col-span-7 lg:mt-10 lg:self-start">
          <h3 className="headline">İkonlar</h3>
          <ul className="mt-5 grid grid-cols-4 gap-3 sm:grid-cols-6">
            {ICONS.map(([k, ad]) => {
              const Icon = I[k] as ComponentType<{ size?: number }>
              return (
                <li key={k} className={cx('flex flex-col items-center gap-1.5 rounded-brut border-[3px] border-black bg-white py-3 text-black')}>
                  <Icon size={28} />
                  <span className="text-[12px] font-bold">{ad}</span>
                </li>
              )
            })}
          </ul>
          <p className="mt-4 font-medium">2,5px çizgi, kare uç, sivri birleşim. Dolgusuz ya da düz dolgulu.</p>
        </BrutalistCard>
      </div>
    </Section>
  )
}
