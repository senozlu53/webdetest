import type { ComponentType } from 'react'
import { DropIcon, SunHorizonIcon, WaveSineIcon, CircleDashedIcon, type IconProps } from '@phosphor-icons/react'
import { SectionHead } from '../components/SectionHead'
import { GlowCard } from '../components/GlowCard'

const ITEMS: ReadonlyArray<{ Icon: ComponentType<IconProps>; name: string; text: string }> = [
  { Icon: DropIcon, name: 'Akışkan arayüz', text: 'Kapsayıcılar sıvı gibi biçim değiştirir; köşe yarıçapları sabit değil, zamana bağlıdır.' },
  { Icon: WaveSineIcon, name: 'Organik hareket', text: 'Hiçbir şey tam durmaz. Zemin 36–60 saniyelik döngülerle yavaşça akar.' },
  { Icon: CircleDashedIcon, name: 'Eriyen sınırlar', text: 'Kenar çizgisi yerine ışık; kutular zemine karışarak biter.' },
  { Icon: SunHorizonIcon, name: 'Ortam ışığı', text: 'Gölge yok, parlama var. Işık bileşenin kenarından ve imleçten yayılır.' },
]

export function Principles() {
  return (
    <section id="ozellikler" className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead item="03" label="Karakteristikler" title="Işık, sıvı ve süreklilik" lede="Dört özellik birlikte çalışır. Kartların üstünde imleci gezdirin: kenar ışığı imleci izler." />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(({ Icon, name, text }) => (
            <GlowCard as="li" key={name} className="flex flex-col gap-4 p-6">
              <Icon size={32} weight="thin" className="holo-icon" aria-hidden="true" />
              <h3 className="text-xl font-light">{name}</h3>
              <p className="text-muted">{text}</p>
            </GlowCard>
          ))}
        </ul>
      </div>
    </section>
  )
}
