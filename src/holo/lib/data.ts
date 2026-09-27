// Stil 011'in bütün verileri kurgusaldır: model adları, ölçümler ve ağ değerleri örnek amaçlıdır.

export type ModelStatus = 'yuklu' | 'diskte' | 'indiriliyor'
export type ModelKind = 'Sohbet' | 'Kod' | 'Gömme' | 'Görsel'

export type Model = {
  id: string
  name: string
  params: string
  kind: ModelKind
  quant: string
  sizeGB: number
  ctx: number
  status: ModelStatus
  /** Tahmini üretim hızı (token/sn, tek GPU) */
  tps: number
  lastUsed: string
}

export const MODELS: Model[] = [
  { id: 'atlas-14b', name: 'Atlas', params: '14B', kind: 'Sohbet', quant: 'Q5_K_M', sizeGB: 10.5, ctx: 32768, status: 'yuklu', tps: 46, lastUsed: '2 dk önce' },
  { id: 'nova-8b', name: 'Nova', params: '8B', kind: 'Sohbet', quant: 'Q4_K_M', sizeGB: 4.9, ctx: 131072, status: 'yuklu', tps: 88, lastUsed: '14 dk önce' },
  { id: 'kuzgun-7b', name: 'Kuzgun TR', params: '7B', kind: 'Sohbet', quant: 'Q5_K_M', sizeGB: 5.1, ctx: 8192, status: 'diskte', tps: 81, lastUsed: 'dün' },
  { id: 'orion-70b', name: 'Orion', params: '70B', kind: 'Sohbet', quant: 'Q4_K_M', sizeGB: 42.5, ctx: 32768, status: 'indiriliyor', tps: 11, lastUsed: 'hiç' },
  { id: 'vega-32b', name: 'Vega Kod', params: '32B', kind: 'Kod', quant: 'Q6_K', sizeGB: 26.9, ctx: 32768, status: 'diskte', tps: 19, lastUsed: '3 gün önce' },
  { id: 'deneb-22b', name: 'Deneb', params: '22B', kind: 'Kod', quant: 'Q4_K_M', sizeGB: 13.3, ctx: 65536, status: 'diskte', tps: 31, lastUsed: 'geçen hafta' },
  { id: 'lyra-3b', name: 'Lyra', params: '3B', kind: 'Sohbet', quant: 'Q8_0', sizeGB: 3.4, ctx: 8192, status: 'diskte', tps: 142, lastUsed: '2 hafta önce' },
  { id: 'sirius-v', name: 'Sirius Görü', params: '11B', kind: 'Görsel', quant: 'Q4_K_M', sizeGB: 7.8, ctx: 16384, status: 'diskte', tps: 52, lastUsed: 'geçen ay' },
  { id: 'altair-embed', name: 'Altair Gömme', params: '335M', kind: 'Gömme', quant: 'F16', sizeGB: 0.67, ctx: 512, status: 'yuklu', tps: 0, lastUsed: '1 dk önce' },
]

export const VRAM_GB = 24

export const STATUS_LABEL: Record<ModelStatus, string> = {
  yuklu: 'Yüklü',
  diskte: 'Diskte',
  indiriliyor: 'İndiriliyor',
}

export const fmtGB = (n: number) => `${n.toLocaleString('tr-TR', { maximumFractionDigits: 1, minimumFractionDigits: n < 10 ? 1 : 0 })} GB`
export const fmtCtx = (n: number) => (n >= 1024 ? `${Math.round(n / 1024)}K` : String(n))
export const fmtNum = (n: number, d = 1) => n.toLocaleString('tr-TR', { maximumFractionDigits: d, minimumFractionDigits: d })

/* ── Radar: iki model, altı eksen (0–100, kurgusal) ── */
export const RADAR_AXES = ['Akıl yürütme', 'Kod', 'Türkçe', 'Hız', 'Bellek verimi', 'Uzun bağlam'] as const
export const RADAR_SERIES = [
  { id: 'atlas-14b', label: 'Atlas 14B', values: [82, 74, 68, 52, 58, 64] },
  { id: 'nova-8b', label: 'Nova 8B', values: [66, 61, 57, 88, 84, 90] },
] as const

/* ── Yanıtlar: istemdeki anahtar kelimeye göre seçilir, token token akar ── */
export const RESPONSES: { match: RegExp; text: string }[] = [
  {
    match: /10gbe|ağ|aktarım|nas/i,
    text: 'Model dosyasını 10GbE bağlantı üzerinden aktarırken jumbo çerçeve (MTU 9000) açık olmalı. Tek akışta yaklaşık 9,4 Gbit/sn beklenir; 42,5 GB\'lık Orion 70B yaklaşık 37 saniyede iner. Disk yazma hızı 1,2 GB/sn\'nin altındaysa darboğaz ağ değil depolamadır.',
  },
  {
    match: /nicemle|quant|q4|q5|bellek|vram/i,
    text: 'Q5_K_M nicemleme 14B bir modeli yaklaşık 10,5 GB\'a indirir ve 24 GB VRAM\'de 32K bağlamla birlikte sığar. Q4_K_M daha küçüktür ama Türkçe eklerde küçük bir kalite kaybı görülür. Uzun bağlam için KV önbelleğini 8 bit tutmak belleği yaklaşık yarıya indirir.',
  },
  {
    match: /.*/,
    text: 'Holografik arayüz, veriyi saydam katmanlarda düzenler: her panel kendi derinliğinde süzülür, ince bir çerçeve ve yumuşak bir parlama onu zeminden ayırır. Metin ise her zaman opak bir koruyucu gradyanın önünde durur; böylece ışık ne kadar parlarsa parlasın okunabilirlik korunur.',
  },
]

/** Kaba tokenleştirme: kelime, ek ve noktalama parçaları (yalnız görselleştirme için) */
export function tokenize(text: string) {
  return text.match(/[\p{L}\p{N}_]{1,6}|[^\s\p{L}\p{N}]|\s+/gu) ?? []
}
