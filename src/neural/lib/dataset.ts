import { clamp, gauss, rng } from './rand'

/**
 * Makine öğrenmesi veri seti analizi: nöral-veri/v3'ün gömme uzayından 180 örneklik bir kesit.
 * x, y iki boyuta indirgenmiş gömme; z üçüncü bileşen (Madde 7: odak derinliği bu değerden gelir).
 */
export const W = 1000
export const H = 700
export const TOTAL_ROWS = 48_200

export type ClusterId = 'kod' | 'matematik' | 'bilim' | 'diyalog' | 'turkce' | 'web'
export interface Cluster {
  id: ClusterId
  ad: string
  x: number
  y: number
  sd: number
  n: number
  pay: number
  kalite: number
}
export const CLUSTERS: Cluster[] = [
  { id: 'kod', ad: 'Kod', x: 250, y: 210, sd: 46, n: 36, pay: 0.21, kalite: 0.78 },
  { id: 'matematik', ad: 'Matematik', x: 530, y: 140, sd: 38, n: 26, pay: 0.12, kalite: 0.84 },
  { id: 'bilim', ad: 'Bilim', x: 790, y: 240, sd: 42, n: 28, pay: 0.15, kalite: 0.8 },
  { id: 'diyalog', ad: 'Diyalog', x: 270, y: 510, sd: 48, n: 32, pay: 0.18, kalite: 0.72 },
  { id: 'turkce', ad: 'Türkçe metin', x: 570, y: 450, sd: 44, n: 30, pay: 0.17, kalite: 0.76 },
  { id: 'web', ad: 'Web taraması', x: 820, y: 560, sd: 62, n: 28, pay: 0.17, kalite: 0.44 },
]
export const cluster = (id: ClusterId) => CLUSTERS.find((c) => c.id === id)!

const ORNEK: Record<ClusterId, string[]> = {
  kod: [
    'def normalize(x): return (x - x.mean()) / x.std()',
    '# MIT Lisansı · Telif hakkı (c) 2021 · Tüm hakları saklıdır',
    'for i in range(n): toplam += a[i] * b[i]',
    'SELECT kume, COUNT(*) FROM ornekler GROUP BY kume;',
    'const ortalama = liste.reduce((a, b) => a + b, 0) / liste.length',
  ],
  matematik: [
    'x² + 5x + 6 = 0 denkleminin kökleri −2 ve −3’tür.',
    'Bir üçgenin iç açılarının toplamı 180 derecedir.',
    'f(x) = 3x² ise türevi f\'(x) = 6x olur.',
    '12 ile 18’in en büyük ortak böleni 6’dır.',
  ],
  bilim: [
    'Fotosentez ışık enerjisini kimyasal enerjiye dönüştürür.',
    'Suyun kaynama noktası deniz seviyesinde 100 °C’dir.',
    'DNA iki iplikli, sarmal bir yapıdadır.',
    'Işık boşlukta saniyede yaklaşık 300.000 km yol alır.',
  ],
  diyalog: [
    'Kullanıcı: Yarın hava nasıl? · Asistan: Parçalı bulutlu, 18 °C.',
    'Kullanıcı: Şifremi unuttum. · Asistan: Sıfırlama bağlantısını gönderdim.',
    'Kullanıcı: Toplantı kaçta? · Asistan: 14.30’da, 2. kat salonunda.',
    'Kullanıcı: Teşekkürler! · Asistan: Rica ederim, başka bir şey var mı?',
  ],
  turkce: [
    'Ağaç yaşken eğilir.',
    'İstanbul’un tarihi yarımadası UNESCO Dünya Mirası listesindedir.',
    'Kış geldi, yollar bir gecede karla kaplandı.',
    'Kitabı bitirince kütüphaneye geri götürdü.',
  ],
  web: [
    'Hemen tıkla!!! En ucuz fiyatlar burada, kaçırma',
    'Çerezleri kabul et · Gizlilik · Künye · Site haritası',
    '404 sayfa bulunamadı · ana sayfaya dön',
    'lorem ipsum dolor sit amet consectetur',
  ],
}
const AYKIRI = ['ÇÇÇÇÇÇÇÇ ######## ÇÇÇÇ', 'base64: iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB', '<div><div><div><div></div></div></div></div>', '0 0 0 0 0 0 0 0 0 0 0 0 0 0', 'Kullanıcı: def f(x) · Asistan: Fotosentez', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaa', '§§§ ¶¶¶ ||| ~~~ ^^^', '\\x00\\x00\\xff\\xfe\\x00']

export interface Point {
  i: number
  id: string
  c: ClusterId
  x: number
  y: number
  z: number
  q: number
  tok: number
  metin: string
  aykiri: boolean
  kopyaOf: number | null
}

const r = rng(2015)
export const POINTS: Point[] = []
for (const c of CLUSTERS) {
  for (let k = 0; k < c.n; k++) {
    const i = POINTS.length
    const x = clamp(c.x + gauss(r) * c.sd, 30, W - 30)
    const y = clamp(c.y + gauss(r) * c.sd * 0.8, 30, H - 30)
    POINTS.push({
      i,
      id: `ör-${String(1000 + i * 37).padStart(5, '0')}`,
      c: c.id,
      x,
      y,
      z: r(),
      q: clamp(c.kalite + gauss(r) * 0.13, 0.05, 0.99),
      tok: Math.round(80 + r() * 900),
      metin: ORNEK[c.id][Math.floor(r() * ORNEK[c.id].length)],
      aykiri: false,
      kopyaOf: null,
    })
  }
}
// Aykırılar: kümeler arasına düşen ya da bozuk örnekler
const OUT: [number, number, ClusterId][] = [
  [400, 330, 'kod'],
  [680, 320, 'bilim'],
  [110, 360, 'diyalog'],
  [950, 400, 'web'],
  [420, 620, 'turkce'],
  [660, 60, 'matematik'],
  [120, 90, 'kod'],
  [960, 110, 'web'],
]
OUT.forEach(([x, y, c], k) => {
  const i = POINTS.length
  POINTS.push({ i, id: `ör-${String(1000 + i * 37).padStart(5, '0')}`, c, x, y, z: r(), q: 0.08 + r() * 0.2, tok: Math.round(20 + r() * 3000), metin: AYKIRI[k], aykiri: true, kopyaOf: null })
})
// Kopyalar: aynı içeriğin neredeyse aynı gömmesi
const KOPYA_KAYNAK = [2, 5, 9, 14, 170, 175]
for (const src of KOPYA_KAYNAK) {
  const p = POINTS[src]
  const i = POINTS.length
  POINTS.push({ ...p, i, id: `ör-${String(1000 + i * 37).padStart(5, '0')}`, x: p.x + 7, y: p.y - 5, z: p.z, kopyaOf: src, aykiri: false })
}
export const pairOf = (p: Point) => (p.kopyaOf !== null ? POINTS[p.kopyaOf] : POINTS.find((o) => o.kopyaOf === p.i) ?? null)
export const isDup = (p: Point) => p.kopyaOf !== null || POINTS.some((o) => o.kopyaOf === p.i)

/** k en yakın komşu (aynı küme içinde) → benzerlik kenarları */
export function neighbors(p: Point, k = 3) {
  return POINTS.filter((o) => o.i !== p.i && o.c === p.c && !o.aykiri)
    .map((o) => ({ o, d: Math.hypot(o.x - p.x, o.y - p.y) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, k)
    .map((x) => x.o)
}
const seen = new Set<string>()
export const EDGES: [number, number][] = []
for (const p of POINTS) {
  if (p.aykiri || p.kopyaOf !== null) continue
  for (const o of neighbors(p, 2)) {
    if (o.kopyaOf !== null) continue
    const key = p.i < o.i ? `${p.i}-${o.i}` : `${o.i}-${p.i}`
    if (!seen.has(key)) {
      seen.add(key)
      EDGES.push([p.i, o.i])
    }
  }
}

/** Kümenin kapsayıcı çemberi */
export function hull(c: Cluster) {
  const ps = POINTS.filter((p) => p.c === c.id && !p.aykiri)
  const cx = ps.reduce((a, p) => a + p.x, 0) / ps.length
  const cy = ps.reduce((a, p) => a + p.y, 0) / ps.length
  const rr = Math.max(...ps.map((p) => Math.hypot(p.x - cx, p.y - cy))) + 14
  return { cx, cy, r: rr }
}

/** Madde 4 / dataviz: kalite için tek tonlu 4 adımlı sıra (#6366F1 → #C7D2FE; en koyusu yüzeyde 4,21:1) */
export const Q_RAMP = ['#6366F1', '#818CF8', '#A5B4FC', '#C7D2FE']
export const Q_STOPS = [0.4, 0.6, 0.8]
export const qBucket = (q: number) => (q < 0.4 ? 0 : q < 0.6 ? 1 : q < 0.8 ? 2 : 3)
export const Q_LABEL = ['0,40 altı', '0,40–0,60', '0,60–0,80', '0,80 ve üstü']

export const STATS = (() => {
  const dup = POINTS.filter(isDup).length
  const out = POINTS.filter((p) => p.aykiri).length
  const q = POINTS.reduce((a, p) => a + p.q, 0) / POINTS.length
  return { n: POINTS.length, dup, out, q }
})()
