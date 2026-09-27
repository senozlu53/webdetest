import { canAgent, type Model } from './models'

/** Madde 11: AI Agent Timeline — Anla, Ara, Analiz Et, Üret */
export type StepId = 'anla' | 'ara' | 'analiz' | 'uret'
export type StepStatus = 'bekliyor' | 'calisiyor' | 'tamam' | 'hata' | 'atlandi'
export type LogKind = 'dusunce' | 'arac' | 'sonuc' | 'uyari' | 'hata'

export const STEPS: { id: StepId; ad: string; ne: string }[] = [
  { id: 'anla', ad: 'Anla', ne: 'Görevi alt hedeflere ayırır, ölçüt belirler' },
  { id: 'ara', ad: 'Ara', ne: 'Araç çağırır, veri ve kaynak toplar' },
  { id: 'analiz', ad: 'Analiz Et', ne: 'Bulguları ölçer ve karşılaştırır' },
  { id: 'uret', ad: 'Üret', ne: 'Sonucu yazar' },
]

export const STATUS: Record<StepStatus, string> = {
  bekliyor: 'Bekliyor',
  calisiyor: 'Çalışıyor',
  tamam: 'Tamamlandı',
  hata: 'Hata',
  atlandi: 'Atlandı',
}

export interface Log {
  kind: LogKind
  text: string
  detail?: string
  /** Bu satırın harcadığı token */
  tok: number
  /** Temel süre (ms); modelin hızına göre ölçeklenir */
  ms: number
  web?: boolean
}

export interface Task {
  id: string
  baslik: string
  istem: string
  steps: Record<Exclude<StepId, 'uret'>, Log[]>
  cikti: string
}

export const TASKS: Task[] = [
  {
    id: 'kopya',
    baslik: 'Kopyaları temizle',
    istem: 'nöral-veri/v3 eğitim bölümündeki yinelenen örnekleri bul, etkisini ölç ve temizlik raporu yaz.',
    steps: {
      anla: [
        { kind: 'dusunce', text: 'İstem 3 alt hedefe ayrıldı: bul, ölç, raporla', tok: 180, ms: 700 },
        { kind: 'dusunce', text: 'Kapsam: nöral-veri/v3 · eğitim bölümü · 48.200 örnek', tok: 120, ms: 600 },
        { kind: 'sonuc', text: 'Ölçüt: kosinüs benzerliği en az 0,95 olan çiftler yakın kopya sayılır', tok: 140, ms: 700 },
      ],
      ara: [
        { kind: 'arac', text: 'dataset.scan(split="train")', detail: '48.200 örnek · 212 MB', tok: 60, ms: 900 },
        { kind: 'arac', text: 'embed.search(k=8, esik=0.95)', detail: '1.312 aday çift', tok: 80, ms: 1100 },
        { kind: 'arac', text: 'web.search("near-duplicate MinHash")', detail: '4 kaynak', tok: 90, ms: 900, web: true },
      ],
      analiz: [
        { kind: 'sonuc', text: 'Kesin kopya 412 · yakın kopya 900', tok: 160, ms: 800 },
        { kind: 'sonuc', text: 'En yoğun küme Kod (%61); çoğu aynı lisans başlığı', tok: 190, ms: 900 },
        { kind: 'uyari', text: '7 çiftin etiketi farklı: silmeden önce elle incelenmeli', tok: 110, ms: 700 },
      ],
    },
    cikti:
      'Temizlik raporu · nöral-veri/v3\n1.312 yinelenen örnek bulundu (%2,7). 412 tanesi birebir kopya, 900 tanesi yakın kopya.\n- Kod kümesi kopyaların %61’ini taşıyor; çoğu aynı lisans başlığı.\n- Etiketi farklı 7 çift silinmeden önce elle incelenmeli.\n- Öneri: kesin kopyaları sil, yakın kopyalarda en kaliteli örneği tut. Epoch süresi yaklaşık %2,7 kısalır.',
  },
  {
    id: 'kayip',
    baslik: 'Kayıp sıçramasını açıkla',
    istem: 'Eğitimin 14.000. adımındaki kayıp sıçramasının nedenini bul ve öneri sun.',
    steps: {
      anla: [
        { kind: 'dusunce', text: 'İstem 2 alt hedefe ayrıldı: nedeni bul, öner', tok: 150, ms: 700 },
        { kind: 'dusunce', text: 'Bağlam: nöral-7b ön eğitimi · adım 13.800–14.400', tok: 110, ms: 600 },
        { kind: 'sonuc', text: 'Ölçüt: sıçramadan önceki ve sonraki metrikler karşılaştırılacak', tok: 130, ms: 700 },
      ],
      ara: [
        { kind: 'arac', text: 'metrics.query(run="noral-7b", adim=13800..14400)', detail: '600 adım · 5 metrik', tok: 70, ms: 1000 },
        { kind: 'arac', text: 'logs.grep("grad_norm")', detail: '3 uyarı satırı', tok: 60, ms: 800 },
        { kind: 'arac', text: 'web.search("loss spike large batch Adam")', detail: '6 kaynak', tok: 90, ms: 900, web: true },
      ],
      analiz: [
        { kind: 'sonuc', text: 'Kayıp 2,29’dan 3,41’e çıktı, 280 adımda geri döndü', tok: 150, ms: 800 },
        { kind: 'sonuc', text: 'Aynı adımda gradyan normu 1,0’dan 38’e fırladı', tok: 140, ms: 800 },
        { kind: 'uyari', text: 'Sıçrama parça 0412 ile çakışıyor (web taraması, düşük kalite)', tok: 130, ms: 800 },
      ],
    },
    cikti:
      'Kayıp sıçraması · adım 14.000\nSıçrama geçiciydi ve kendiliğinden toparlandı; model zarar görmedi.\n- Neden: parça 0412’deki düşük kaliteli web metni ve gradyan normundaki ani artış.\n- Öneri: parça 0412’yi karantinaya al, gradyan kırpma eşiğini 1,0’da tut.\n- İzleme: gradyan normu 8’i geçerse eğitim kendiliğinden duraklasın.',
  },
  {
    id: 'bellek',
    baslik: 'Yerel çalışma planı',
    istem: 'Akson 32B’yi 24 GB VRAM’e sığdıracak bir yerel çalışma planı çıkar.',
    steps: {
      anla: [
        { kind: 'dusunce', text: 'İstem 2 alt hedefe ayrıldı: bellek hesabı, plan', tok: 140, ms: 700 },
        { kind: 'dusunce', text: 'Donanım: 24 GB VRAM · 64 GB RAM', tok: 90, ms: 500 },
        { kind: 'sonuc', text: 'Ölçüt: 32K bağlamda saniyede en az 20 token', tok: 120, ms: 700 },
      ],
      ara: [
        { kind: 'arac', text: 'models.info("akson-32b")', detail: '32,8 milyar parametre · Q4 19,8 GB', tok: 60, ms: 800 },
        { kind: 'arac', text: 'hw.probe()', detail: '24 GB VRAM, 22,6 GB boş', tok: 50, ms: 700 },
        { kind: 'arac', text: 'web.search("KV cache size 32K context")', detail: '3 kaynak', tok: 80, ms: 900, web: true },
      ],
      analiz: [
        { kind: 'sonuc', text: 'Ağırlıklar 19,8 GB + 32K KV önbelleği 2,6 GB = 22,4 GB', tok: 170, ms: 900 },
        { kind: 'uyari', text: 'Pay yalnız 0,2 GB: uzun bağlamda bellek taşabilir', tok: 100, ms: 700 },
        { kind: 'sonuc', text: 'KV önbelleği 8 bit olursa toplam 21,1 GB', tok: 130, ms: 800 },
      ],
    },
    cikti:
      'Yerel çalışma planı · Akson 32B\nModel 24 GB’a sığar ama pay dar; KV önbelleğini sıkıştırmak gerekiyor.\n- Nicemleme: Q4 ağırlık, 8 bit KV önbelleği (toplam 21,1 GB).\n- Bağlam: 32K; daha uzun işleri 16K parçalara böl.\n- Beklenen hız: saniyede 22–26 token.',
  },
]

export const task = (id: string) => TASKS.find((t) => t.id === id) ?? TASKS[0]

/** Zaman çizelgesinin oynattığı olaylar */
export type Event =
  | { type: 'start'; step: StepId; ms: number }
  | { type: 'log'; step: StepId; log: Log; ms: number; fail?: boolean }
  | { type: 'end'; step: StepId; ms: number; status: 'tamam' | 'atlandi' }
  | { type: 'word'; step: 'uret'; text: string; ms: number; tok: number }

/** Model hızına göre süre katsayısı: hızlı model kısa, yavaş model uzun */
export const speedFactor = (m: Model) => Math.min(2.4, Math.max(0.4, 80 / m.hiz))

/**
 * Plan: görev + model + hata ayarı → olay listesi.
 * Yerel modelde web araması atlanır; araç çağıramayan modelde Ara adımı atlanır.
 * Hata açıksa Ara adımının ikinci araç çağrısı önce zaman aşımına düşer, sonra yeniden denenir.
 */
export function plan(t: Task, m: Model, fail: boolean): Event[] {
  const f = speedFactor(m)
  const ms = (x: number) => Math.round(x * f)
  const ev: Event[] = []
  const tools = canAgent(m)
  for (const s of ['anla', 'ara', 'analiz'] as const) {
    ev.push({ type: 'start', step: s, ms: ms(250) })
    if (s === 'ara' && !tools) {
      ev.push({ type: 'log', step: s, log: { kind: 'uyari', text: `${m.ad} araç çağıramıyor; Ara adımı atlandı, yalnız istemdeki bilgi kullanılacak`, tok: 40, ms: 600 }, ms: ms(600) })
      ev.push({ type: 'end', step: s, ms: ms(200), status: 'atlandi' })
      continue
    }
    t.steps[s].forEach((log, i) => {
      if (s === 'ara' && log.web && m.yer === 'yerel') {
        ev.push({ type: 'log', step: s, log: { kind: 'uyari', text: 'Web araması atlandı: yerel model çevrimdışı çalışıyor', detail: 'veri cihazda kaldı', tok: 20, ms: 500 }, ms: ms(500) })
        return
      }
      if (s === 'ara' && fail && i === 1) {
        const name = log.text.split('(')[0]
        ev.push({ type: 'log', step: s, log: { kind: 'hata', text: `Zaman aşımı: ${name} 30 sn içinde yanıt vermedi`, tok: 30, ms: 1200 }, ms: ms(1200), fail: true })
        ev.push({ type: 'log', step: s, log: { kind: 'uyari', text: 'Yeniden deneniyor · 2/3', tok: 20, ms: 700 }, ms: ms(700) })
      }
      ev.push({ type: 'log', step: s, log, ms: ms(log.ms) })
    })
    ev.push({ type: 'end', step: s, ms: ms(250), status: 'tamam' })
  }
  ev.push({ type: 'start', step: 'uret', ms: ms(300) })
  const words = t.cikti.split(/(?<=\s)/)
  for (const w of words) ev.push({ type: 'word', step: 'uret', text: w, ms: ms(55), tok: 1.4 })
  ev.push({ type: 'end', step: 'uret', ms: ms(200), status: 'tamam' })
  return ev
}
