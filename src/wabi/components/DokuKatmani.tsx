/** Madde 8: sayfa dokusu (sıva, beton, kil, seramik) ve çok yavaş gezinen soluk ışık. Maske CSS'te; renk temadan gelir */
export function DokuKatmani() {
  return (
    <>
      <div className="doku-katman" aria-hidden="true" data-doku-katman="" />
      <div className="isik-katman" aria-hidden="true" />
    </>
  )
}
