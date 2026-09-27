import { useState, type CSSProperties } from 'react'
import { BookOpenIcon, FireIcon, HeartIcon, PiggyBankIcon, StarIcon } from '@phosphor-icons/react'
import { ClayCard } from '../components/ClayCard'
import { ClayIcon } from '../components/ClayIcon'
import { ClayToggle } from '../components/ClayToggle'
import { Pop } from '../components/Pop'

export function Hero() {
  const [reminder, setReminder] = useState(true)
  return (
    <section id="ust" className="px-4 pt-12 pb-20 md:px-8 md:pt-20 md:pb-28">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <Pop>
            <p className="clay clay-sm tone-base inline-flex items-center gap-2 rounded-max px-4 py-1.5 text-[15px] font-bold">
              <span className="font-mono text-accent">007</span>
              <span className="text-muted">·</span>
              <span lang="en">3D / Spatial</span>
            </p>
          </Pop>
          <Pop i={1}>
            <h1 className="mt-6 text-[52px] leading-[0.98] font-extrabold tracking-tight md:text-[84px]">
              Oyun hamuru gibi <span className="text-accent">yumuşak</span> arayüz
            </h1>
          </Pop>
          <Pop i={2}>
            <p className="mt-6 max-w-[48ch] text-lg text-muted md:text-xl">
              Neumorphism'in düşük kontrastının aksine parlak renkler ve kil gibi kabarık formlarla arayüze hacim ve eğlence katan stil.
            </p>
          </Pop>
          <Pop i={3} className="mt-9 flex flex-wrap gap-4">
            <a href="#uygulama" className="clay clay-md tone-primary clay-press inline-flex min-h-13 items-center gap-2.5 rounded-max px-7 font-display text-[17px] font-bold no-underline">
              <BookOpenIcon size={22} weight="fill" aria-hidden="true" />
              Derse başla
            </a>
            <a href="#hacim" className="clay clay-md tone-pink clay-press inline-flex min-h-13 items-center rounded-max px-7 font-display text-[17px] font-bold no-underline">
              Üç gölgeyi incele
            </a>
          </Pop>
        </div>

        {/* Kompozisyon: şişkin asimetrik kart, çevresinde süzülen kil parçalar */}
        <div className="relative mx-auto w-full max-w-[520px] px-2 pt-8 pb-14 sm:px-8">
          <Pop i={2}>
            <ClayCard tone="lilac" volume="xl" className="blob relative p-7 sm:p-9">
              <div className="flex items-center gap-4">
                <ClayIcon icon={BookOpenIcon} tile="base" size={30} color="var(--accent)" />
                <div>
                  <p className="text-[15px] font-bold opacity-80">Bugünkü ders</p>
                  <p className="font-display text-2xl leading-tight font-extrabold">İngilizce · Meyveler</p>
                </div>
              </div>
              <div className="mt-7 flex items-baseline justify-between text-[15px] font-bold">
                <span>İlerleme</span>
                <span className="tabular-nums">4 / 5</span>
              </div>
              <div className="clay-well clay-sm mt-2 h-6 rounded-max p-1" role="progressbar" aria-label="Ders ilerlemesi" aria-valuemin={0} aria-valuemax={5} aria-valuenow={4}>
                <div className="clay clay-sm tone-pink h-full w-4/5 rounded-max" />
              </div>
              <div className="mt-7">
                <ClayCard tone="base" volume="md" className="rounded-soft px-5 py-2">
                  <ClayToggle checked={reminder} onChange={setReminder} label="Günlük hatırlatma" description="Her akşam 20.00" />
                </ClayCard>
              </div>
            </ClayCard>
          </Pop>

          <div className="absolute -top-2 -left-1 sm:left-0">
            <ClayCard tone="butter" volume="lg" float tilt={-6} className="flex items-center gap-2 rounded-max px-4 py-2.5 font-display text-lg font-extrabold">
              <ClayIcon icon={FireIcon} size={26} color="var(--ic-fire)" />
              <span>12 gün seri</span>
            </ClayCard>
          </div>
          <div className="absolute top-2 right-0" style={{ '--float-delay': '-2s' } as CSSProperties}>
            <ClayCard tone="pink" volume="lg" float tilt={8} className="grid size-20 place-items-center rounded-[40%]">
              <ClayIcon icon={HeartIcon} size={40} color="var(--ic-pink)" />
            </ClayCard>
          </div>
          <div className="absolute -bottom-2 left-6 sm:left-10" style={{ '--float-delay': '-4s' } as CSSProperties}>
            <ClayCard tone="mint" volume="lg" float tilt={4} className="flex items-center gap-3 rounded-max py-2.5 pr-5 pl-3">
              <ClayIcon icon={PiggyBankIcon} size={30} color="var(--ic-mint)" tile="base" />
              <span className="font-display text-lg font-extrabold tabular-nums">+₺250</span>
            </ClayCard>
          </div>
          <div className="absolute right-4 -bottom-6 sm:right-8" style={{ '--float-delay': '-1s' } as CSSProperties}>
            <ClayCard tone="blue" volume="lg" float tilt={-10} className="grid size-16 place-items-center rounded-max">
              <ClayIcon icon={StarIcon} size={32} color="var(--ic-star)" />
            </ClayCard>
          </div>
        </div>
      </div>
    </section>
  )
}
