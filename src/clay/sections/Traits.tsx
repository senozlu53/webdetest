import { useState } from 'react'
import { CubeIcon, DropHalfBottomIcon, SmileyIcon, SparkleIcon } from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import { SectionHead } from '../components/SectionHead'
import { ClayCard } from '../components/ClayCard'
import { ClayIcon } from '../components/ClayIcon'
import { ClayToggle } from '../components/ClayToggle'
import { Pop } from '../components/Pop'
import type { Tone } from '../components/types'
import { cx } from '../../shared/cx'

const TRAITS: ReadonlyArray<{ icon: Icon; tone: Tone; color: string; title: string; text: string }> = [
  { icon: DropHalfBottomIcon, tone: 'pink', color: 'var(--ic-pink)', title: 'Şişirilmiş yüzey', text: 'Her kap içinden hava üflenmiş gibi kabarır; kenarlar keskin değil, dolgun ve yumuşak.' },
  { icon: SmileyIcon, tone: 'butter', color: 'var(--ic-butter)', title: 'Neşeli kompozisyon', text: 'Parlak pasteller, iri formlar, hafifçe eğik ve süzülen parçalar. Arayüz ciddi değil, dostane.' },
  { icon: SparkleIcon, tone: 'blue', color: 'var(--ic-blue)', title: 'Çifte iç gölge', text: 'Sol üstte açık, sağ altta koyu iç gölge. Işık tek yönden gelir ve yüzey kendi içinde kıvrılır.' },
  { icon: CubeIcon, tone: 'mint', color: 'var(--ic-mint)', title: 'Yüksek hacim', text: 'Dışta yumuşak bir düşen gölge, nesneyi zeminden kaldırır. Neumorphism’in aksine zeminden ayrışır.' },
]

export function Traits() {
  const [grain, setGrain] = useState(true)
  return (
    <section id="ozellikler" className="px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="01 · 03 · 08"
          label="Karakteristikler"
          title="Kil gibi dolgun, oyuncak gibi eğlenceli"
          lede="Hacmi kontrast değil üç gölge üretir; bu yüzden renkler parlak ve metin koyu kalabilir. Yüzey mat: yansıma, cam ya da metal parlaklığı yok."
        />
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {TRAITS.map((t, i) => (
            <Pop as="li" i={i} key={t.title} className="min-w-0">
              <ClayCard tone="base" volume="lg" className={cx('flex h-full flex-col gap-4 p-7', i % 2 ? 'blob-2' : 'blob')}>
                <ClayIcon icon={t.icon} tile={t.tone} color={t.color} size={30} className="self-start" />
                <h3 className="text-2xl leading-tight font-extrabold">{t.title}</h3>
                <p className="text-muted">{t.text}</p>
              </ClayCard>
            </Pop>
          ))}
        </ul>

        {/* Madde 8: parlak ve mat karşılaştırması */}
        <Pop className="mt-14">
          <ClayCard tone="base" volume="xl" className="grid gap-10 p-7 md:grid-cols-[1fr_1fr_1.1fr] md:items-center md:p-10">
            <figure className="flex flex-col items-center gap-5 text-center">
              <div
                className="size-36 rounded-full"
                style={{
                  background: 'radial-gradient(circle at 32% 28%, #ffffff 0 9%, rgb(255 255 255 / 0.55) 14%, transparent 30%), radial-gradient(circle at 50% 60%, #ff9cc5, #e24d8c 80%)',
                  boxShadow: '8px 8px 16px rgb(0 0 0 / 0.18)',
                }}
                aria-hidden="true"
              />
              <figcaption>
                <span className="font-display text-xl font-extrabold">Parlak</span>
                <span className="block text-[15px] text-muted">Keskin yansıma noktası: plastik ya da cam gibi durur. Bu stilde kullanılmaz.</span>
              </figcaption>
            </figure>
            <figure className="flex flex-col items-center gap-5 text-center">
              <div className={cx('clay clay-xl tone-pink size-36 rounded-full', grain && 'clay-grain')} aria-hidden="true" />
              <figcaption>
                <span className="font-display text-xl font-extrabold">Mat kil</span>
                <span className="block text-[15px] text-muted">Işık yüzeye yayılır; ton değişimi yalnızca iç gölgelerden gelir.</span>
              </figcaption>
            </figure>
            <div className="flex flex-col gap-4">
              <h3 className="text-2xl font-extrabold">Doku ve yüzey</h3>
              <p className="text-muted">
                Yansıma yerine hafif bir gren, yüzeye kil ya da kauçuk hissi verir. Gren %9 opaklıkta bir gürültü katmanıdır; metin taşıyan yüzeylerde kontrastı
                değiştirmez.
              </p>
              <ClayCard tone="base" volume="md" className="rounded-soft px-5 py-2">
                <ClayToggle checked={grain} onChange={setGrain} label="Kil dokusu" description="Gürültü katmanı" />
              </ClayCard>
            </div>
          </ClayCard>
        </Pop>
      </div>
    </section>
  )
}
