import { useBotanical } from '../lib/store'

/** Madde 8: sayfa dokusu (keten, kraft kâğıt, toprak tanesi). Maske CSS'te; renk temadan gelir */
export function DokuKatmani() {
  const { doku } = useBotanical()
  return <div className="doku-katman" data-doku={doku} aria-hidden="true" />
}
