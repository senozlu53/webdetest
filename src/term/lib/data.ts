// Stil 012'nin bütün verileri kurgusaldır: sunucular, kıyaslama sonuçları, diskler ve günlükler örnektir.

export type Durum = 'ok' | 'uyari' | 'hata' | 'kapali'
export const DURUM_ETIKET: Record<Durum, string> = { ok: '  OK  ', uyari: 'UYARI ', hata: ' HATA ', kapali: 'KAPALI' }

export type Sunucu = {
  host: string
  rol: string
  bolge: string
  cpu: number
  bellek: number
  bellekTop: number
  disk: number
  calisma: number
  durum: Durum
}

export const SUNUCULAR: Sunucu[] = [
  { host: 'web-01', rol: 'nginx', bolge: 'ist-1', cpu: 34, bellek: 6.1, bellekTop: 16, disk: 41, calisma: 3_628_800, durum: 'ok' },
  { host: 'web-02', rol: 'nginx', bolge: 'ist-1', cpu: 71, bellek: 12.4, bellekTop: 16, disk: 44, calisma: 3_628_800, durum: 'uyari' },
  { host: 'web-03', rol: 'nginx', bolge: 'fra-1', cpu: 29, bellek: 5.8, bellekTop: 16, disk: 39, calisma: 1_209_600, durum: 'ok' },
  { host: 'api-01', rol: 'node', bolge: 'ist-1', cpu: 48, bellek: 9.2, bellekTop: 32, disk: 27, calisma: 864_000, durum: 'ok' },
  { host: 'api-02', rol: 'node', bolge: 'fra-1', cpu: 52, bellek: 10.1, bellekTop: 32, disk: 29, calisma: 864_000, durum: 'ok' },
  { host: 'db-01', rol: 'postgres', bolge: 'ist-1', cpu: 63, bellek: 54.3, bellekTop: 64, disk: 78, calisma: 7_257_600, durum: 'ok' },
  { host: 'db-02', rol: 'postgres*', bolge: 'fra-1', cpu: 21, bellek: 48.9, bellekTop: 64, disk: 77, calisma: 7_257_600, durum: 'ok' },
  { host: 'cache-01', rol: 'redis', bolge: 'ist-1', cpu: 12, bellek: 7.4, bellekTop: 8, disk: 8, calisma: 2_419_200, durum: 'uyari' },
  { host: 'kuyruk-01', rol: 'nats', bolge: 'ist-1', cpu: 9, bellek: 1.2, bellekTop: 4, disk: 12, calisma: 2_419_200, durum: 'ok' },
  { host: 'is-01', rol: 'worker', bolge: 'ist-1', cpu: 0, bellek: 0, bellekTop: 16, disk: 22, calisma: 0, durum: 'kapali' },
]

export function sure(sn: number) {
  if (sn <= 0) return '-'
  const g = Math.floor(sn / 86400)
  const s = Math.floor((sn % 86400) / 3600)
  const d = Math.floor((sn % 3600) / 60)
  return g ? `${g}g ${String(s).padStart(2, '0')}s` : `${String(s).padStart(2, '0')}s ${String(d).padStart(2, '0')}d`
}

/* ── Kıyaslama ── */
export type Test = { id: string; ad: string; birim: string; ref: number; ondalik: number; sure: number }
export const TESTLER: Test[] = [
  { id: 'cpu1', ad: 'CPU tek çekirdek', birim: 'puan', ref: 2184, ondalik: 0, sure: 1400 },
  { id: 'cpuN', ad: 'CPU çok çekirdek', birim: 'puan', ref: 28410, ondalik: 0, sure: 2200 },
  { id: 'mem', ad: 'Bellek bant genişliği', birim: 'GB/sn', ref: 78.4, ondalik: 1, sure: 1300 },
  { id: 'seq', ad: 'NVMe sıralı okuma', birim: 'GB/sn', ref: 13.1, ondalik: 1, sure: 1600 },
  { id: 'rnd', ad: 'NVMe 4K rastgele', birim: 'K IOPS', ref: 1480, ondalik: 0, sure: 1600 },
  { id: 'net', ad: '10GbE iperf3', birim: 'Gbit/sn', ref: 9.38, ondalik: 2, sure: 1200 },
]

/* ── BIOS / VMD ── */
export type Disk = { id: string; model: string; tb: number; port: string }
export const DISKLER: Disk[] = [
  { id: 'nvme0', model: 'NVX-4000', tb: 2, port: 'CPU kök portu 1 · PCIe 4.0 x4' },
  { id: 'nvme1', model: 'NVX-4000', tb: 2, port: 'CPU kök portu 2 · PCIe 4.0 x4' },
  { id: 'nvme2', model: 'NVX-4000', tb: 2, port: 'CPU kök portu 3 · PCIe 4.0 x4' },
  { id: 'nvme3', model: 'KRN-P41', tb: 1, port: 'PCH portu 1 · PCIe 4.0 x4' },
]
export type Raid = 'RAID-0' | 'RAID-1' | 'RAID-5' | 'RAID-10'
export const RAID: ReadonlyArray<{ id: Raid; min: number; cift?: boolean; aciklama: string }> = [
  { id: 'RAID-0', min: 2, aciklama: 'Şerit: tüm kapasite, hata toleransı yok.' },
  { id: 'RAID-1', min: 2, aciklama: 'Ayna: tek disk kapasitesi, bir disk kaybı tolere edilir.' },
  { id: 'RAID-5', min: 3, aciklama: 'Eşlikli şerit: bir disk eşliğe gider, bir disk kaybı tolere edilir.' },
  { id: 'RAID-10', min: 4, cift: true, aciklama: 'Aynalanmış şerit: yarı kapasite, her aynadan bir disk kaybı tolere edilir.' },
]
export function kapasite(raid: Raid, tbs: number[]) {
  if (!tbs.length) return 0
  const min = Math.min(...tbs)
  switch (raid) {
    case 'RAID-0':
      return min * tbs.length
    case 'RAID-1':
      return min
    case 'RAID-5':
      return min * (tbs.length - 1)
    case 'RAID-10':
      return (min * tbs.length) / 2
  }
}

/* ── Günlük akışı ── */
export type Seviye = 'bilgi' | 'uyari' | 'hata' | 'ayikla'
export const SEVIYE_ETIKET: Record<Seviye, string> = { bilgi: 'BİLGİ ', uyari: 'UYARI ', hata: 'HATA  ', ayikla: 'AYIKLA' }
export type Log = { id: number; t: string; seviye: Seviye; kaynak: string; mesaj: string }

export const LOG_SABLON: ReadonlyArray<{ seviye: Seviye; kaynak: string; mesaj: string; w: number }> = [
  { seviye: 'bilgi', kaynak: 'web-01', mesaj: 'GET /api/durum 200 12ms', w: 8 },
  { seviye: 'bilgi', kaynak: 'web-03', mesaj: 'GET /stil/012/ 200 4ms', w: 7 },
  { seviye: 'bilgi', kaynak: 'api-02', mesaj: 'POST /v1/is 202 kuyruğa alındı', w: 5 },
  { seviye: 'ayikla', kaynak: 'cache-01', mesaj: 'anahtar süresi doldu: oturum:7f3a', w: 4 },
  { seviye: 'bilgi', kaynak: 'db-01', mesaj: 'denetim noktası tamam, 1 842 sayfa yazıldı', w: 3 },
  { seviye: 'uyari', kaynak: 'web-02', mesaj: 'yavaş yanıt: GET /arama 1 204ms', w: 3 },
  { seviye: 'uyari', kaynak: 'cache-01', mesaj: 'bellek %92: tahliye politikası allkeys-lru', w: 2 },
  { seviye: 'bilgi', kaynak: 'db-02', mesaj: 'çoğaltma gecikmesi 0,04 sn', w: 3 },
  { seviye: 'hata', kaynak: 'api-01', mesaj: 'yukarı akış zaman aşımı: ödeme-servisi 5 000ms', w: 1 },
  { seviye: 'bilgi', kaynak: 'kuyruk-01', mesaj: 'tüketici bağlandı: is-grubu/3', w: 2 },
]

/* ── Kişisel site ── */
export const PROJELER = [
  { izin: 'drwxr-xr-x', boyut: '4,0K', tarih: '2026-09-12', ad: 'holo-panel/', aciklama: 'Cam panel bileşen kiti' },
  { izin: 'drwxr-xr-x', boyut: '4,0K', tarih: '2026-08-02', ad: 'ascii-grid/', aciklama: 'Metin tabanlı veri ızgarası' },
  { izin: '-rwxr-xr-x', boyut: '18K', tarih: '2026-07-21', ad: 'kiyas.sh', aciklama: 'Donanım kıyaslama betiği' },
  { izin: '-rw-r--r--', boyut: '12K', tarih: '2026-06-30', ad: 'vmd-raid10.md', aciklama: 'VMD ile RAID-10 notları' },
  { izin: '-rw-r--r--', boyut: '2,1K', tarih: '2026-05-11', ad: 'dotfiles.tar', aciklama: 'Kabuk ve editör ayarları' },
]
export const YAZILAR = [
  { tarih: '2026-09-14', baslik: "VMD açıkken Linux'a RAID-10 kurmak", sure: '6 dk' },
  { tarih: '2026-08-27', baslik: '10GbE: jumbo çerçeve gerçekten fark eder mi?', sure: '9 dk' },
  { tarih: '2026-07-03', baslik: 'ASCII tablolarla veri yoğun arayüz', sure: '5 dk' },
  { tarih: '2026-05-19', baslik: 'Monospace ızgara: 1ch × 1lh', sure: '4 dk' },
]
