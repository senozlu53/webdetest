import type { ReactNode } from 'react'
import { RoughNotation, type types } from 'react-rough-notation'
import { useSketch } from '../lib/store'

export type NotTur = types

/**
 * Madde 14: react-rough-notation. Metnin altını çizer, çevresine daire / kutu çizer, üstünü karalar.
 * Hareket kapalıysa çizim animasyonsuz, doğrudan yerinde görünür. Çizgi kalınlığı ekranla ölçeklenir (Madde 17).
 * Renkler düz hex: kırmızı kalem yalnız çizgi olarak; altı çizilen metin hep okunaklı kömür / mürekkep kalır.
 */
export function Not({
  tur,
  renk = '#e63946',
  goster = true,
  gecikme = 0,
  sure = 700,
  tekrar = 2,
  pad = 4,
  sw = 2.5,
  cokSatir = true,
  children,
}: {
  tur: NotTur
  renk?: string
  goster?: boolean
  gecikme?: number
  sure?: number
  tekrar?: number
  pad?: number
  sw?: number
  cokSatir?: boolean
  children: ReactNode
}) {
  const { hareket, olcek } = useSketch()
  return (
    <RoughNotation type={tur} show={goster} color={renk} strokeWidth={sw * olcek} animate={hareket} animationDelay={gecikme} animationDuration={sure} iterations={tekrar} padding={pad} multiline={cokSatir}>
      {children}
    </RoughNotation>
  )
}
