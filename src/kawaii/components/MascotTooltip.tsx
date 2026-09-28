import type { ReactNode } from 'react'
import { Tooltip } from 'radix-ui'
import { LottieMascot } from './LottieMascot'
import type { MaskotRenk, Ruh } from '../lib/maskot'

/**
 * Madde 14: <MascotTooltip>. İpucunu bir baloncukta maskot söyler; maskot Lottie ile zıplar.
 * Radix Tooltip: üstüne gelince ve klavye odağında açılır, Esc kapatır, metin aria-describedby ile tetikleyiciye bağlanır.
 * İpucu yalnız yardımcıdır: aynı bilgi sayfada başka yerde de yazılıdır (dokunmatik ekranda hover yok).
 */
export function MascotTooltip({ icerik, ruh = 'mutlu', renk = 'mint', taraf = 'top', children, acik, onAcik }: { icerik: ReactNode; ruh?: Ruh; renk?: MaskotRenk; taraf?: 'top' | 'bottom' | 'left' | 'right'; children: ReactNode; acik?: boolean; onAcik?: (v: boolean) => void }) {
  return (
    <Tooltip.Root delayDuration={150} open={acik} onOpenChange={onAcik}>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content side={taraf} sideOffset={12} collisionPadding={12} className="kipucu z-[95]" data-maskot-ipucu="">
          <LottieMascot ruh={ruh} renk={renk} boyut={56} />
          <span className="min-w-0">{icerik}</span>
          <Tooltip.Arrow width={22} height={11} className="fill-paper" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
}
