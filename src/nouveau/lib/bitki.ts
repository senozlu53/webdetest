/**
 * Organik geometri araç seti (Madde 3 · 6 · 9).
 * Kamçı eğrileri, sivri uçlu yapraklar, çiçekler, dalgalı konturlar ve sarmaşık süsü.
 * Hepsi saf fonksiyondur; aynı tohum her zaman aynı çizimi verir.
 */

export type Nk = readonly [number, number]

/** mulberry32: küçük, hızlı, tohumlu rastgele sayı üretici */
export function rastgele(tohum: number) {
  let a = tohum >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const r1 = (n: number) => String(Math.round(n * 10) / 10 || 0)
export const mp = (p: Nk) => `${r1(p[0])} ${r1(p[1])}`
const RAD = Math.PI / 180
export const derece = (r: number) => r / RAD

function don(px: number, py: number, x: number, y: number, a: number): Nk {
  const c = Math.cos(a)
  const s = Math.sin(a)
  return [x + px * c - py * s, y + px * s + py * c]
}

/** Catmull-Rom eğrisini kübik Bezier yoluna çevirir (k: gerilim çarpanı, hane: ondalık basamak) */
export function yumusak(p: readonly Nk[], kapali = false, k = 1, hane = 1): string {
  const n = p.length
  if (n < 2) return ''
  const o = 10 ** hane
  const mp = (q: Nk) => `${String(Math.round(q[0] * o) / o || 0)} ${String(Math.round(q[1] * o) / o || 0)}`
  const g = (i: number): Nk => (kapali ? p[((i % n) + n) % n] : p[Math.max(0, Math.min(n - 1, i))])
  let d = `M${mp(p[0])}`
  const son = kapali ? n : n - 1
  for (let i = 0; i < son; i++) {
    const p0 = g(i - 1)
    const p1 = g(i)
    const p2 = g(i + 1)
    const p3 = g(i + 2)
    const c1: Nk = [p1[0] + ((p2[0] - p0[0]) / 6) * k, p1[1] + ((p2[1] - p0[1]) / 6) * k]
    const c2: Nk = [p2[0] - ((p3[0] - p1[0]) / 6) * k, p2[1] - ((p3[1] - p1[1]) / 6) * k]
    d += `C${mp(c1)} ${mp(c2)} ${mp(p2)}`
  }
  return kapali ? d + 'Z' : d
}

/** Aynı eğriyi sık noktalarla örnekler (ölçüm ve şerit çizimi için) */
export function ornekle(p: readonly Nk[], adim = 6, kapali = false): Nk[] {
  const n = p.length
  const g = (i: number): Nk => (kapali ? p[((i % n) + n) % n] : p[Math.max(0, Math.min(n - 1, i))])
  const out: Nk[] = []
  const son = kapali ? n : n - 1
  for (let i = 0; i < son; i++) {
    const p0 = g(i - 1)
    const p1 = g(i)
    const p2 = g(i + 1)
    const p3 = g(i + 2)
    for (let s = 0; s < adim; s++) {
      const t = s / adim
      const t2 = t * t
      const t3 = t2 * t
      const f = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3)
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])])
    }
  }
  if (!kapali) out.push(p[n - 1])
  return out
}

/* ───────────────────────── Kamçı (whiplash) ───────────────────────── */

export interface KamciSecenek {
  /** ucundaki sarmalın tur sayısı */
  donus?: number
  /** baştaki S dalgasının genliği (radyan) */
  dalga?: number
  /** eğriliğin uca doğru artış üssü: büyük = sıkı ve geç kıvrım */
  us?: number
  /** +1 saat yönü, −1 ters */
  yon?: 1 | -1
  n?: number
}

/**
 * Kamçı eğrisi: hafif S ile başlar, ucuna doğru giderek daralan bir sarmala dönüşür.
 * Yön açısı, yay uzunluğunun bir fonksiyonudur; eğrilik uca doğru artar.
 */
export function kamci(x0: number, y0: number, boy: number, aci0: number, o: KamciSecenek = {}): Nk[] {
  const { donus = 1.3, dalga = 0.6, us = 2.4, yon = 1, n = 64 } = o
  const pts: Nk[] = [[x0, y0]]
  let x = x0
  let y = y0
  const adim = boy / n
  for (let i = 1; i <= n; i++) {
    const s = i / n
    const phi = aci0 + yon * (dalga * Math.sin(Math.PI * 1.5 * s) + donus * 2 * Math.PI * Math.pow(s, us))
    x += Math.cos(phi) * adim
    y += Math.sin(phi) * adim
    pts.push([x, y])
  }
  return pts
}

/** Yola dik, değişken kalınlıklı şerit: kalınlıktan inceye giden gerçek bir kamçı çizgisi */
export function serit(pts: readonly Nk[], kalinlik: (t: number) => number): string {
  const n = pts.length
  const sol: Nk[] = []
  const sag: Nk[] = []
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)]
    const b = pts[Math.min(n - 1, i + 1)]
    let tx = b[0] - a[0]
    let ty = b[1] - a[1]
    const l = Math.hypot(tx, ty) || 1
    tx /= l
    ty /= l
    const w = Math.max(0.15, kalinlik(i / (n - 1))) / 2
    sol.push([pts[i][0] - ty * w, pts[i][1] + tx * w])
    sag.push([pts[i][0] + ty * w, pts[i][1] - tx * w])
  }
  const halka = [...sol, ...sag.reverse()]
  return 'M' + halka.map(mp).join('L') + 'Z'
}

/** Kalından inceye tek yönlü daralan şerit */
export const sivri = (pts: readonly Nk[], w0: number, w1 = 0.4, us = 1) => serit(pts, (t) => w1 + (w0 - w1) * Math.pow(1 - t, us))

/* ───────────────────────── Yaprak ve çiçek ───────────────────────── */

/** (x,y) kökten `aci` yönünde uzanan sivri uçlu yaprak. asim: alt/üst kambur farkı */
export function yaprakAt(x: number, y: number, aci: number, boy: number, en: number, asim = 0.18): string {
  const u = en * (1 + asim)
  const a = en * (1 - asim)
  const T = (px: number, py: number) => mp(don(px, py, x, y, aci))
  return `M${T(0, 0)}C${T(boy * 0.22, -u * 1.05)} ${T(boy * 0.72, -u * 0.85)} ${T(boy, 0)}C${T(boy * 0.7, a * 0.9)} ${T(boy * 0.24, a * 1.05)} ${T(0, 0)}Z`
}
/** Yaprağın orta damarı */
export function damarAt(x: number, y: number, aci: number, boy: number): string {
  const T = (px: number, py: number) => mp(don(px, py, x, y, aci))
  return `M${T(0, 0)}Q${T(boy * 0.5, boy * 0.035)} ${T(boy * 0.9, 0)}`
}

/** Sarmaşık yaprağı: beş loblu, kalp tabanlı */
export function sarmasikAt(x: number, y: number, aci: number, boy: number): string {
  const P: Nk[] = [
    [0, 0],
    [0.04, -0.2],
    [0.2, -0.4],
    [0.46, -0.5],
    [0.42, -0.27],
    [0.66, -0.19],
    [1, 0],
    [0.66, 0.2],
    [0.4, 0.27],
    [0.44, 0.47],
    [0.2, 0.38],
    [0.04, 0.19],
  ]
  return yumusak(
    P.map(([px, py]) => don(px * boy, py * boy, x, y, aci)),
    true,
  )
}

/** Yapraklı çiçeğin taç yaprakları: n adet, merkezden dışa; `sivriOran` yaprağın inceliği */
export function petalAt(x: number, y: number, aci: number, r: number, n: number, sivriOran = 0.34): string[] {
  return Array.from({ length: n }, (_, i) => yaprakAt(x, y, aci + (i / n) * Math.PI * 2, r, r * sivriOran, 0.06))
}

/** Bir elipsi yay komutlarıyla çizer (arc, döndürülmüş) */
export function elips(cx: number, cy: number, rx: number, ry: number, aci = 0): string {
  const a = don(-rx, 0, cx, cy, aci)
  const b = don(rx, 0, cx, cy, aci)
  const deg = derece(aci)
  return `M${mp(a)}A${r1(rx)} ${r1(ry)} ${r1(deg)} 1 0 ${mp(b)}A${r1(rx)} ${r1(ry)} ${r1(deg)} 1 0 ${mp(a)}Z`
}

/* ───────────────────────── Dalgalı kontur (Madde 6) ───────────────────────── */

export interface KonturSecenek {
  tohum?: number
  /** ana dalganın piksel genliği */
  genlik?: number
  /** dalga boyu (px); küçük = daha çok kıvrım */
  dalgaBoyu?: number
  /** düşük frekanslı, simetriyi bozan kabarma (0–1) */
  asimetri?: number
  /** süper elips üssü: 2 elips, büyüdükçe kareye yaklaşır ama köşe hiç oluşmaz */
  us?: number
  /** kutu kenarından boşluk */
  pay?: number
  adet?: number
}

/**
 * Kapalı, dalgalı kontur: yuvarlatılmış karenin çevresine, çevre uzunluğu boyunca uygulanan
 * dalgalar eklenir. Hiçbir yerde düz kenar ya da dik köşe yoktur.
 */
export function kontur(w: number, h: number, o: KonturSecenek = {}): Nk[] {
  const { tohum = 1, genlik = 7, dalgaBoyu = 150, asimetri = 0.6, us = 4.2, pay = 4, adet = 88 } = o
  const rnd = rastgele(tohum)
  const A1 = genlik
  const A2 = genlik * 0.45
  const A3 = Math.min(w, h) * 0.05 * asimetri
  const tot = A1 + A2 + A3
  const rx = Math.max(12, w / 2 - pay - tot)
  const ry = Math.max(12, h / 2 - pay - tot)
  const N = 420
  const taban: Nk[] = []
  for (let i = 0; i < N; i++) {
    const t = (i / N) * Math.PI * 2
    const c = Math.cos(t)
    const s = Math.sin(t)
    taban.push([w / 2 + Math.sign(c) * Math.abs(c) ** (2 / us) * rx, h / 2 + Math.sign(s) * Math.abs(s) ** (2 / us) * ry])
  }
  const cum = [0]
  for (let i = 1; i <= N; i++) cum.push(cum[i - 1] + Math.hypot(taban[i % N][0] - taban[i - 1][0], taban[i % N][1] - taban[i - 1][1]))
  const L = cum[N]
  const k1 = Math.max(3, Math.round(L / dalgaBoyu))
  const k2 = Math.max(2, Math.round(k1 * 0.38))
  const k3 = 2
  const f1 = rnd() * 6.283
  const f2 = rnd() * 6.283
  const f3 = rnd() * 6.283
  const out: Nk[] = []
  let idx = 0
  for (let j = 0; j < adet; j++) {
    const hedef = (j / adet) * L
    while (idx < N - 1 && cum[idx + 1] < hedef) idx++
    const u = hedef / L
    const a = taban[idx]
    const b = taban[(idx + 1) % N]
    const kesir = (hedef - cum[idx]) / (cum[idx + 1] - cum[idx] || 1)
    const bx = a[0] + (b[0] - a[0]) * kesir
    const by = a[1] + (b[1] - a[1]) * kesir
    const p = taban[(idx - 1 + N) % N]
    const q = taban[(idx + 2) % N]
    let tx = q[0] - p[0]
    let ty = q[1] - p[1]
    const l = Math.hypot(tx, ty) || 1
    tx /= l
    ty /= l
    const ofs = A1 * Math.sin(Math.PI * 2 * k1 * u + f1) + A2 * Math.sin(Math.PI * 2 * k2 * u + f2) + A3 * Math.sin(Math.PI * 2 * k3 * u + f3)
    out.push([bx + ty * ofs, by - tx * ofs])
  }
  return out
}

export const konturYol = (p: readonly Nk[]) => yumusak(p, true)

/** Kapalı konturun yatay ve dikey olarak kutu içinde kaldığını doğrular */
export function sinirlar(p: readonly Nk[]) {
  const xs = p.map((q) => q[0])
  const ys = p.map((q) => q[1])
  return {
    x0: Math.min(...xs),
    x1: Math.max(...xs),
    y0: Math.min(...ys),
    y1: Math.max(...ys),
  }
}

/** Madde 6 denetimi: en sıkı eğrilik yarıçapı ve en uzun (neredeyse) düz parça */
export function egrilik(p: readonly Nk[], kapali = true) {
  const s = ornekle(p, 5, kapali)
  const n = s.length
  let minR = Infinity
  let duzMax = 0
  let duz = 0
  for (let i = 0; i < (kapali ? n : n - 2); i++) {
    const a = s[i]
    const b = s[(i + 1) % n]
    const c = s[(i + 2) % n]
    const ab = Math.hypot(b[0] - a[0], b[1] - a[1])
    const bc = Math.hypot(c[0] - b[0], c[1] - b[1])
    const ca = Math.hypot(a[0] - c[0], a[1] - c[1])
    const alan = Math.abs((b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1])) / 2
    if (alan > 1e-6) minR = Math.min(minR, (ab * bc * ca) / (4 * alan))
    const donus = Math.abs(Math.atan2((b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]), (b[0] - a[0]) * (c[0] - b[0]) + (b[1] - a[1]) * (c[1] - b[1])))
    if (donus < 0.5 * RAD) {
      duz += ab
      duzMax = Math.max(duzMax, duz)
    } else duz = 0
  }
  return { minYaricap: minR === Infinity ? 0 : minR, duzParca: duzMax }
}

/* ───────────────────────── Sarmaşık süsü (Madde 2 · 7 · 17) ───────────────────────── */

export type SusSeviye = 'tam' | 'sade' | 'yalin'

export interface SusYaprak {
  d: string
  damar: string
  x: number
  y: number
  gecikme: number
  ton: 0 | 1 | 2
  sarmasik: boolean
}
export interface Sus {
  govde: string
  yapraklar: SusYaprak[]
  kivrimlar: { d: string; x: number; y: number; gecikme: number }[]
  cicekler: {
    petal: string[]
    x: number
    y: number
    r: number
    gecikme: number
  }[]
  toplam: number
}

interface SusSecenek {
  tohum?: number
  seviye?: SusSeviye
  /** ölçek çarpanı; mobilde 0,8 */
  olcek?: number
  /** kontur boyunca kaplanan oran */
  kapsam?: number
  /** verilirse [genişlik, yükseklik] dışına taşan yaprak, kıvrım ve çiçekler elenir */
  kutu?: readonly [number, number]
}

export const SUS_AYAR: Record<
  SusSeviye,
  {
    aralik: number
    kivrim: number
    cicek: number
    yaprak: number
    genlik: number
  }
> = {
  tam: { aralik: 30, kivrim: 9, cicek: 2, yaprak: 1, genlik: 10 },
  sade: { aralik: 50, kivrim: 3, cicek: 1, yaprak: 0.82, genlik: 8 },
  yalin: { aralik: 0, kivrim: 0, cicek: 0, yaprak: 0.7, genlik: 0 },
}

/**
 * Konturun etrafına, onu iç ve dış yönde çaprazlayan tek bir sarmaşık dalı örer.
 * Yapraklar bir kümede yoğunlaşır (simetri yok); ucundaki kıvrımlar kamçı eğrisidir.
 */
export function sus(kon: readonly Nk[], o: SusSecenek = {}): Sus {
  const { tohum = 1, seviye = 'tam', olcek = 1, kapsam = 0.78, kutu } = o
  const cfg = SUS_AYAR[seviye]
  const bos: Sus = {
    govde: '',
    yapraklar: [],
    kivrimlar: [],
    cicekler: [],
    toplam: 0,
  }
  if (seviye === 'yalin') return bos
  const rnd = rastgele(tohum * 7919 + 13)
  const yogun = ornekle(kon, 5, true)
  const n = yogun.length
  const cum = [0]
  for (let i = 1; i <= n; i++) cum.push(cum[i - 1] + Math.hypot(yogun[i % n][0] - yogun[i - 1][0], yogun[i % n][1] - yogun[i - 1][1]))
  const L = cum[n]
  const at = (s: number) => {
    let d = ((s % L) + L) % L
    let i = 0
    let lo = 0
    let hi = n
    while (lo < hi - 1) {
      const mid = (lo + hi) >> 1
      if (cum[mid] <= d) lo = mid
      else hi = mid
    }
    i = lo
    d -= cum[i]
    const a = yogun[i]
    const b = yogun[(i + 1) % n]
    const seg = cum[i + 1] - cum[i] || 1
    const f = d / seg
    const p = yogun[(i - 1 + n) % n]
    const q = yogun[(i + 2) % n]
    let tx = q[0] - p[0]
    let ty = q[1] - p[1]
    const l = Math.hypot(tx, ty) || 1
    tx /= l
    ty /= l
    return {
      x: a[0] + (b[0] - a[0]) * f,
      y: a[1] + (b[1] - a[1]) * f,
      tx,
      ty,
      nx: ty,
      ny: -tx,
    }
  }
  const baslangic = rnd() * L
  const uzun = L * kapsam
  const Av = cfg.genlik * olcek
  const dalgaSayisi = Math.max(3, Math.round(uzun / (95 * olcek)))
  const faz = rnd() * 6.283
  const yolPts: Nk[] = []
  const adimPx = 9
  const say = Math.max(8, Math.round(uzun / adimPx))
  // kümeler: yapraklar iki yerde yoğunlaşır
  const k1 = rnd()
  const k2 = (k1 + 0.4 + rnd() * 0.25) % 1
  const yogunluk = (t: number) => {
    const g = (c: number) => {
      const d = Math.min(Math.abs(t - c), 1 - Math.abs(t - c))
      return Math.exp(-((d / 0.14) ** 2))
    }
    return 0.28 + 0.72 * Math.max(g(k1), 0.8 * g(k2))
  }
  const konum = (s: number) => {
    const t = (s - baslangic) / uzun
    const c = at(s)
    const zarf = Math.sin(Math.PI * Math.min(1, Math.max(0, t))) ** 0.5
    const ofs = Av * zarf * Math.sin(Math.PI * 2 * dalgaSayisi * t + faz)
    return { ...c, x: c.x + c.nx * ofs, y: c.y + c.ny * ofs, t }
  }
  for (let i = 0; i <= say; i++) {
    const p = konum(baslangic + (i / say) * uzun)
    yolPts.push([p.x, p.y])
  }
  const govde = yumusak(yolPts)
  const icinde = (x0: number, y0: number, x1: number, y1: number) => !kutu || (x0 >= 1 && y0 >= 1 && x1 <= kutu[0] - 1 && y1 <= kutu[1] - 1)
  const yapraklar: SusYaprak[] = []
  const kivrimlar: Sus['kivrimlar'] = []
  const cicekler: Sus['cicekler'] = []
  let s = 14 * olcek
  let yon = 1
  let sira = 0
  while (s < uzun - 8 * olcek) {
    const p = konum(baslangic + s)
    const dens = yogunluk(s / uzun)
    const aciT = Math.atan2(p.ty, p.tx)
    const boy = (13 + rnd() * 15 + dens * 8) * olcek * cfg.yaprak
    const aci = aciT + yon * (0.75 + rnd() * 0.55)
    const sarm = rnd() < 0.42
    const yr = boy * 1.3
    if (!icinde(p.x - yr, p.y - yr, p.x + yr, p.y + yr)) {
      yon = -yon
      s += 14 * olcek
      continue
    }
    yapraklar.push({
      d: sarm ? sarmasikAt(p.x, p.y, aci, boy * 1.25) : yaprakAt(p.x, p.y, aci, boy, boy * 0.36),
      damar: damarAt(p.x, p.y, aci, boy * (sarm ? 1.1 : 1)),
      x: p.x,
      y: p.y,
      gecikme: 0.4 + (s / uzun) * 2.6 + rnd() * 0.3,
      ton: (sira % 3) as 0 | 1 | 2,
      sarmasik: sarm,
    })
    yon = -yon
    sira++
    s += ((cfg.aralik * olcek) / (0.45 + dens * 0.9)) * (0.75 + rnd() * 0.5)
  }
  // kıvrımlar (tendril): yoğun bölgelerden dışa doğru
  const adayKiv = 40
  const skorlu = Array.from({ length: adayKiv }, (_, i) => {
    const t = 0.06 + (i / adayKiv) * 0.88
    return { t, puan: yogunluk(t) * (0.6 + rnd() * 0.8) }
  }).sort((a, b) => b.puan - a.puan)
  const secilen: number[] = []
  for (const c of skorlu) {
    if (secilen.length >= cfg.kivrim) break
    if (secilen.every((q) => Math.abs(q - c.t) > 0.5 / Math.max(3, cfg.kivrim))) secilen.push(c.t)
  }
  secilen.forEach((t, i) => {
    const p = konum(baslangic + t * uzun)
    const dis = Math.atan2(p.ny, p.nx)
    for (let deneme = 0; deneme < 4; deneme++) {
      const yonK = (rnd() < 0.5 ? 1 : -1) * (deneme % 2 ? -1 : 1)
      const aci0 = dis + yonK * (0.25 + rnd() * 0.5)
      const boy = (46 + rnd() * 52) * olcek * (1 - deneme * 0.16)
      const pts = kamci(p.x, p.y, boy, aci0, {
        donus: 0.95 + rnd() * 0.75,
        dalga: 0.5 + rnd() * 0.5,
        us: 2.1 + rnd() * 0.7,
        yon: yonK === 1 ? -1 : 1,
        n: 44,
      })
      const xs = pts.map((q) => q[0])
      const ys = pts.map((q) => q[1])
      if (!icinde(Math.min(...xs) - 3, Math.min(...ys) - 3, Math.max(...xs) + 3, Math.max(...ys) + 3)) continue
      kivrimlar.push({
        d: sivri(pts, 2.6 * olcek, 0.5, 0.9),
        x: p.x,
        y: p.y,
        gecikme: 0.9 + t * 2.4 + i * 0.05,
      })
      break
    }
  })
  // çiçekler: en yoğun yerde
  const cicekT = [k1, k2].slice(0, cfg.cicek)
  cicekT.forEach((t, i) => {
    const tt = Math.min(0.9, Math.max(0.1, t))
    const p = konum(baslangic + tt * uzun)
    const r = (i === 0 ? 20 : 15) * olcek
    const ox = p.x + p.nx * r * 0.9
    const oy = p.y + p.ny * r * 0.9
    if (!icinde(ox - r - 1, oy - r - 1, ox + r + 1, oy + r + 1)) return
    cicekler.push({
      petal: petalAt(ox, oy, rnd() * 6.28, r, i === 0 ? 7 : 6, 0.3),
      x: ox,
      y: oy,
      r,
      gecikme: 1.6 + tt * 2,
    })
  })
  return { govde, yapraklar, kivrimlar, cicekler, toplam: uzun }
}
