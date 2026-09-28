import { oku, yaz } from './depo'

/** Doksanların ziyaretçi sayacı: bu tarayıcıdaki açılışları sayar, 1.337'den başlar. Modül bir kez çalışır. */
const onceki = Number(oku('anti-sayac')) || 0
yaz('anti-sayac', String(onceki + 1))
export const ZIYARET = String(1337 + onceki + 1).padStart(6, '0')
