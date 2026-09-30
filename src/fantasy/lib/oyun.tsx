import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { ENV_BOYUT, ESYALAR, YERLESIM, esyaOlustur, type Esya } from './data'
import { useFantasy } from './store'

export interface Karakter {
  ad: string
  seviye: number
  can: number
  canAzami: number
  mana: number
  manaAzami: number
  xp: number
  xpAzami: number
  altin: number
}

interface Ctx {
  k: Karakter
  yuvalar: (Esya | null)[]
  secili: number | null
  sec: (i: number | null) => void
  tasi: (a: number, b: number) => void
  kullan: (i: number) => string
  birak: (i: number) => void
  sat: (i: number) => void
  ekle: (id: string, adet: number) => boolean
  hasarAl: (n: number) => void
  iyiles: (n: number) => void
  manaHarca: (n: number) => void
  altinEkle: (n: number) => void
  xpEkle: (n: number) => void
  sifirla: () => void
  ozet: { dolu: number; agirlik: number; kapasite: number }
  gorevAcik: boolean
  setGorevAcik: (a: boolean) => void
}

const C = createContext<Ctx | null>(null)

function baslangic(): (Esya | null)[] {
  const y: (Esya | null)[] = Array.from({ length: ENV_BOYUT }, () => null)
  for (const [i, id] of Object.entries(YERLESIM)) y[+i] = esyaOlustur(id)
  return y
}
const K0: Karakter = { ad: 'Aldric, Kül Şövalyesi', seviye: 27, can: 84, canAzami: 120, mana: 46, manaAzami: 80, xp: 62, xpAzami: 100, altin: 1240 }
const KAPASITE = 80

export function OyunProvider({ children }: { children: ReactNode }) {
  const { duyur } = useFantasy()
  const [k, setK] = useState<Karakter>(K0)
  const [yuvalar, setYuvalar] = useState<(Esya | null)[]>(baslangic)
  const [secili, setSecili] = useState<number | null>(0)
  const [gorevAcik, setGorevAcik] = useState(false)

  const tasi = useCallback(
    (a: number, b: number) => {
      if (a === b) return
      setYuvalar((y) => {
        const s = [...y]
        ;[s[a], s[b]] = [s[b], s[a]]
        return s
      })
      setSecili(b)
      duyur(`Eşya yuva ${a + 1}’den yuva ${b + 1}’e taşındı`)
    },
    [duyur],
  )
  const kullan = useCallback(
    (i: number) => {
      const e = yuvalar[i]
      if (!e || !e.etki) return ''
      const can = Math.min(k.canAzami, k.can + (e.etki.can ?? 0))
      const mana = Math.min(k.manaAzami, k.mana + (e.etki.mana ?? 0))
      const msg = `${e.ad} kullanıldı: ${e.etki.can ? `can ${can} / ${k.canAzami}` : `mana ${mana} / ${k.manaAzami}`}`
      setK((c) => ({ ...c, can: Math.min(c.canAzami, c.can + (e.etki?.can ?? 0)), mana: Math.min(c.manaAzami, c.mana + (e.etki?.mana ?? 0)) }))
      setYuvalar((y) => y.map((x, j) => (j === i && x ? (x.adet > 1 ? { ...x, adet: x.adet - 1 } : null) : x)))
      duyur(msg)
      return msg
    },
    [yuvalar, k, duyur],
  )
  const birak = useCallback(
    (i: number) => {
      const e = yuvalar[i]
      if (!e) return
      setYuvalar((y) => y.map((x, j) => (j === i ? null : x)))
      duyur(`${e.ad} bırakıldı`)
    },
    [yuvalar, duyur],
  )
  const sat = useCallback(
    (i: number) => {
      const e = yuvalar[i]
      if (!e) return
      setYuvalar((y) => y.map((x, j) => (j === i ? null : x)))
      setK((c) => ({ ...c, altin: c.altin + e.deger * e.adet }))
      duyur(`${e.ad} satıldı, ${e.deger * e.adet} altın kazanıldı`)
    },
    [yuvalar, duyur],
  )
  const ekle = useCallback((id: string, adet: number) => {
    const sablon = ESYALAR.find((e) => e.id === id)
    if (!sablon) return false
    let basari = true
    setYuvalar((y) => {
      const s = [...y]
      const var_ = s.findIndex((x) => x && x.id === id && (sablon.tip === 'iksir' || sablon.tip === 'malzeme') && sablon.id !== 'yildiz-mucevheri')
      if (var_ >= 0) s[var_] = { ...(s[var_] as Esya), adet: (s[var_] as Esya).adet + adet }
      else {
        const bos = s.findIndex((x) => x === null)
        if (bos < 0) {
          basari = false
          return y
        }
        s[bos] = esyaOlustur(id, adet)
      }
      return s
    })
    return basari
  }, [])
  const hasarAl = useCallback((n: number) => setK((c) => ({ ...c, can: Math.max(0, c.can - n) })), [])
  const iyiles = useCallback((n: number) => setK((c) => ({ ...c, can: Math.min(c.canAzami, c.can + n) })), [])
  const manaHarca = useCallback((n: number) => setK((c) => ({ ...c, mana: Math.max(0, c.mana - n) })), [])
  const altinEkle = useCallback((n: number) => setK((c) => ({ ...c, altin: c.altin + n })), [])
  const xpEkle = useCallback((n: number) => setK((c) => ({ ...c, xp: Math.min(c.xpAzami, c.xp + n) })), [])
  const sifirla = useCallback(() => {
    setK(K0)
    setYuvalar(baslangic())
    setSecili(0)
  }, [])

  const ozet = useMemo(() => {
    const dolu = yuvalar.filter(Boolean).length
    const agirlik = yuvalar.reduce((t, e) => t + (e ? (e.tip === 'iksir' ? e.adet * 0.5 : e.tip === 'malzeme' ? Math.ceil(e.adet / 20) + 1 : e.tip === 'silah' || e.tip === 'zirh' ? 6 : 1) : 0), 0)
    return { dolu, agirlik: Math.round(agirlik * 10) / 10, kapasite: KAPASITE }
  }, [yuvalar])

  const value = useMemo(
    () => ({ k, yuvalar, secili, sec: setSecili, tasi, kullan, birak, sat, ekle, hasarAl, iyiles, manaHarca, altinEkle, xpEkle, sifirla, ozet, gorevAcik, setGorevAcik }),
    [k, yuvalar, secili, tasi, kullan, birak, sat, ekle, hasarAl, iyiles, manaHarca, altinEkle, xpEkle, sifirla, ozet, gorevAcik],
  )
  return <C.Provider value={value}>{children}</C.Provider>
}

export function useOyun() {
  const v = useContext(C)
  if (!v) throw new Error('OyunProvider yok')
  return v
}
