import { Dialog } from 'radix-ui'
import type { ReactNode, RefObject } from 'react'
import { Dugme } from './Dugme'
import { GothicCard, type YuzeyAd } from './GothicCard'

/**
 * <GothicModal>: gotik çerçeveli modal pencere (Madde 11 · 16).
 * Kemerli kart iki zincirle ekranın üstünden iner; açılış yavaş ve ağırdır (`sure`), kırmızı ışık sızıntısı mum gibi titrer.
 * Radix Dialog: odak kilidi, Esc ile kapanma ve odağın tetikleyiciye dönmesi hazır gelir.
 */
export function GothicModal({
  acik,
  onAcikDegisti,
  tetik,
  baslik,
  aciklama,
  children,
  yuzey = 'tas',
  sure = 900,
  donusRef,
  kapatEtiket = 'Kapat',
}: {
  acik?: boolean
  onAcikDegisti?: (a: boolean) => void
  tetik?: ReactNode
  baslik: string
  aciklama?: ReactNode
  children?: ReactNode
  yuzey?: YuzeyAd
  /** açılış süresi (ms) */
  sure?: number
  donusRef?: RefObject<HTMLElement | null>
  kapatEtiket?: string
}) {
  return (
    <Dialog.Root open={acik} onOpenChange={onAcikDegisti}>
      {tetik ? <Dialog.Trigger asChild>{tetik}</Dialog.Trigger> : null}
      <Dialog.Portal>
        <Dialog.Overlay className="mod-perde" style={{ ['--mod-sure' as string]: `${sure}ms` }} />
        <Dialog.Content
          className="mod"
          style={{ ['--mod-sure' as string]: `${sure}ms` }}
          aria-describedby={aciklama ? undefined : undefined}
          onCloseAutoFocus={(e) => {
            if (donusRef?.current) {
              e.preventDefault()
              donusRef.current.focus()
            }
          }}
        >
          <GothicCard zincir="asili" uzun yuzey={yuzey} kemerH={76} sarmal="mod-w" className="mod-kart">
            <div className="flex items-start justify-between gap-4">
              <Dialog.Title className="t-h3 mod-baslik">{baslik}</Dialog.Title>
              <Dialog.Close asChild>
                <Dugme dar ton="hayalet" aria-label={`${kapatEtiket}: ${baslik}`}>
                  {kapatEtiket}
                </Dugme>
              </Dialog.Close>
            </div>
            {aciklama ? <Dialog.Description className="t-alt mt-2">{aciklama}</Dialog.Description> : <Dialog.Description className="sr-only">{baslik}</Dialog.Description>}
            {children ? <div className="mod-icerik mt-5">{children}</div> : null}
          </GothicCard>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
