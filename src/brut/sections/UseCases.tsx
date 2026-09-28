import { useState } from 'react'
import { Tabs } from 'radix-ui'
import { Section } from '../components/ui'
import { IconCart, IconGrid, IconStar, IconTerminal } from '../components/Icons'
import { Shop } from './uses/Shop'
import { Dev } from './uses/Dev'
import { Agency } from './uses/Agency'
import { Web3 } from './uses/Web3'
import { cx } from '../../shared/cx'

const TABS = [
  { id: 'magaza', ad: 'Gen-Z mağaza', icon: IconCart, fill: 'fill-yellow' },
  { id: 'gelistirici', ad: 'Geliştirici aracı', icon: IconTerminal, fill: 'fill-green' },
  { id: 'ajans', ad: 'Ajans ve portfolyo', icon: IconGrid, fill: 'fill-pink' },
  { id: 'web3', ad: 'Web3', icon: IconStar, fill: 'fill-blue' },
] as const

export function UseCases() {
  const [tab, setTab] = useState<string>('magaza')
  return (
    <Section id="kullanim" n="10" kicker="Madde 10 · Kullanım alanları" title="Dört yerde, aynı sertlik" lead="Aynı üç kural dört farklı üründe: gerçek bir sepet, bir dağıtım paneli, bir ajans portfolyosu ve bir rozet basma kartı. Ürünler ve veriler kurgudur.">
      <Tabs.Root value={tab} onValueChange={setTab} activationMode="automatic">
        <Tabs.List aria-label="Kullanım alanı" className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pt-1 pb-4 md:mx-0 md:flex-wrap md:px-0">
          {TABS.map((t) => {
            const on = tab === t.id
            const Icon = t.icon
            return (
              <Tabs.Trigger
                key={t.id}
                value={t.id}
                className={cx(
                  'snap inline-flex min-h-12 shrink-0 items-center gap-2 rounded-brut border-[3px] border-line px-4 font-display text-[16px] font-black whitespace-nowrap uppercase [font-stretch:110%]',
                  on ? `${t.fill} translate-x-[4px] translate-y-[4px]` : 'bg-surface text-ink brut-shadow hover:translate-x-[2px] hover:translate-y-[2px]',
                )}
              >
                <Icon size={20} />
                {t.ad}
              </Tabs.Trigger>
            )
          })}
        </Tabs.List>
        <Tabs.Content value="magaza" className="mt-8 outline-offset-8">
          <Shop />
        </Tabs.Content>
        <Tabs.Content value="gelistirici" className="mt-8 outline-offset-8">
          <Dev />
        </Tabs.Content>
        <Tabs.Content value="ajans" className="mt-8 outline-offset-8">
          <Agency />
        </Tabs.Content>
        <Tabs.Content value="web3" className="mt-8 outline-offset-8">
          <Web3 />
        </Tabs.Content>
      </Tabs.Root>
    </Section>
  )
}
