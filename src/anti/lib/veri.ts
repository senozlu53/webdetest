/** Kurgusal içerik: kolektif, etkinlikler, yayınlar, SÖKÜK koleksiyonu ve ziyaretçi defteri örnekleri */

export interface Etkinlik {
  id: string
  tarih: string
  gun: string
  mekan: string
  sahne: string
  kapi: string
  giris: string
  not: string
}

export const ETKINLIKLER: Etkinlik[] = [
  { id: 'e1', tarih: '03.10.2026', gun: 'Cumartesi', mekan: 'Bodrum 3, Karaköy', sahne: 'Boş Sinyal + Kötü Ekran + DJ Parazit', kapi: '23.00', giris: '250 TL', not: 'kapıda nakit' },
  { id: 'e2', tarih: '10.10.2026', gun: 'Cumartesi', mekan: 'Eski Matbaa, Kadıköy', sahne: 'Gürültü Kulübü canlı: Mor Link', kapi: '22.30', giris: '300 TL', not: 'kulak tıkacı dağıtılır' },
  { id: 'e3', tarih: '17.10.2026', gun: 'Cumartesi', mekan: 'Tünel altı depo', sahne: '404 Orkestrası + Kırık Tablo', kapi: '00.00', giris: '200 TL', not: 'sabaha kadar' },
  { id: 'e4', tarih: '24.10.2026', gun: 'Cumartesi', mekan: 'Bodrum 3, Karaköy', sahne: 'Kaset takası', kapi: '20.00', giris: 'ücretsiz', not: 'kendi kasetini getir' },
  { id: 'e5', tarih: '31.10.2026', gun: 'Cumartesi', mekan: 'gizli adres', sahne: 'SİNYAL KAYBI 29. yıl gecesi', kapi: '23.59', giris: '350 TL', not: 'adres cuma gecesi e-postayla gelir' },
  { id: 'e6', tarih: '07.11.2026', gun: 'Cumartesi', mekan: 'Eski Matbaa, Kadıköy', sahne: 'Sessizlik Gecesi (hiç ses yok)', kapi: '22.00', giris: '150 TL', not: 'konuşmak yasak' },
]

export interface Yayin {
  kod: string
  sanatci: string
  ad: string
  bicim: string
  yil: number
  parcalar: [string, string][]
}

export const YAYINLAR: Yayin[] = [
  { kod: 'SK-001', sanatci: 'Boş Sinyal', ad: 'Taşıyıcı Yok', bicim: 'kaset', yil: 1997, parcalar: [['Çevirmeli Ağ', '6:12'], ['Meşgul Tonu', '3:48'], ['Bağlantı Koptu', '9:01']] },
  { kod: 'SK-014', sanatci: 'Kötü Ekran', ad: 'Tarama Satırı', bicim: 'CD-R', yil: 2003, parcalar: [['Titreşim 60 Hz', '4:30'], ['Yanmış Piksel', '5:05'], ['Sinyal Yok', '12:00']] },
  { kod: 'SK-042', sanatci: 'Mor Link', ad: 'Ziyaret Edildi', bicim: '12" plak', yil: 2026, parcalar: [['#800080', '3:33'], ['Alt Çizgi', '4:04'], ['Geri Tuşu', '2:22']] },
]

/** HTML 4'ün 16 adlı rengi; web güvenli küpte olup olmadıkları ve bu sayfadaki rolleri */
export const RENKLER: { ad: string; hex: string; rol: string; beyaz: string; siyah: string }[] = [
  { ad: 'blue', hex: '#0000FF', rol: 'link', beyaz: '8,59', siyah: '2,44' },
  { ad: 'purple', hex: '#800080', rol: 'ziyaret edilmiş link', beyaz: '9,42', siyah: '2,23' },
  { ad: 'red', hex: '#FF0000', rol: 'tıklanan link, büyük uyarı yazısı, çizgi', beyaz: '4,00', siyah: '5,25' },
  { ad: 'black', hex: '#000000', rol: 'metin, keskin kenar', beyaz: '21,00', siyah: '1,00' },
  { ad: 'white', hex: '#FFFFFF', rol: 'zemin', beyaz: '1,00', siyah: '21,00' },
  { ad: 'yellow', hex: '#FFFF00', rol: 'başlık zemini, hover (siyah yazıyla)', beyaz: '1,07', siyah: '19,56' },
  { ad: 'lime', hex: '#00FF00', rol: 'kayan yazı (siyah zeminde)', beyaz: '1,37', siyah: '15,30' },
  { ad: 'silver', hex: '#C0C0C0', rol: 'düğme yüzü (işletim sistemi çizer)', beyaz: '1,82', siyah: '11,54' },
  { ad: 'gray', hex: '#808080', rol: '–', beyaz: '3,95', siyah: '5,32' },
  { ad: 'maroon', hex: '#800000', rol: '–', beyaz: '10,95', siyah: '1,92' },
  { ad: 'fuchsia', hex: '#FF00FF', rol: '–', beyaz: '3,14', siyah: '6,70' },
  { ad: 'green', hex: '#008000', rol: '–', beyaz: '5,14', siyah: '4,09' },
  { ad: 'olive', hex: '#808000', rol: '–', beyaz: '4,20', siyah: '5,01' },
  { ad: 'navy', hex: '#000080', rol: '–', beyaz: '16,01', siyah: '1,31' },
  { ad: 'teal', hex: '#008080', rol: '–', beyaz: '4,77', siyah: '4,40' },
  { ad: 'aqua', hex: '#00FFFF', rol: '–', beyaz: '1,25', siyah: '16,75' },
]

/** 00, 33, 66, 99, CC, FF: 6 × 6 × 6 = 216 */
export const GUVENLI = ['00', '33', '66', '99', 'CC', 'FF']
export const kupte = (hex: string) => [1, 3, 5].every((i) => GUVENLI.includes(hex.slice(i, i + 2).toUpperCase()))

export interface Urun {
  id: string
  ad: string
  fiyat: number
}
export const URUNLER: Urun[] = [
  { id: 'tisort', ad: 'Ters dikişli tişört', fiyat: 650 },
  { id: 'ceket', ad: 'Etiketi dışarıda ceket', fiyat: 2400 },
  { id: 'pantolon', ad: 'Tek paçalı pantolon', fiyat: 1150 },
]
export const BEDENLER = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
export const KUMAS_RENKLERI: [string, string][] = [
  ['siyah', 'Siyah (#000000)'],
  ['beyaz', 'Beyaz (#FFFFFF)'],
  ['gumus', 'Gümüş (#C0C0C0)'],
  ['kirmizi', 'Kırmızı (#FF0000)'],
  ['mavi', 'Mavi (#0000FF)'],
  ['mor', 'Mor (#800080)'],
]
export const tl = (n: number) => `${n.toLocaleString('tr-TR')} TL`

export interface Kayit {
  id: string
  ad: string
  sehir: string
  mesaj: string
  tarih: string
  ornek?: boolean
}
export const ORNEK_KAYITLAR: Kayit[] = [
  { id: 'o1', ad: '~*~DeRiN_bAs~*~', sehir: 'İzmir', mesaj: 'sayfa bozuk sandım, bozukmuş. 10/10', tarih: '14.09.2026', ornek: true },
  { id: 'o2', ad: 'kaset_kafa', sehir: 'Ankara', mesaj: 'SK-001 hâlâ çalıyor mu? benimki eridi', tarih: '02.08.2026', ornek: true },
  { id: 'o3', ad: 'webmaster', sehir: 'İstanbul', mesaj: 'deftere yazan herkese teşekkürler. sayaç bozuk değil, öyle', tarih: '12.07.2026', ornek: true },
]
export const SEHIRLER = ['Adana', 'Ankara', 'Antalya', 'Bursa', 'Diyarbakır', 'Eskişehir', 'İstanbul', 'İzmir', 'Trabzon', 'Van', 'başka bir yer']

export const DIZELER = ['sinyal geldi', 'sinyal gitti', 'link maviydi', 'tıklayınca mor oldu', 'tablo ekrandan taştı', 'kimse hizalamadı']
export const FIILLER = ['yırtıldı', 'donup kaldı', 'yeniden yüklendi', 'bulunamadı']

export const IKONLAR: [string, string, string][] = [
  ['Kapat', '[X]', '❌'],
  ['Sonraki', '>>', '⏭️'],
  ['Önceki', '<<', '⏮️'],
  ['Menü', '|||', '🍔'],
  ['Uyarı', '/!\\', '⚠️'],
  ['E-posta', '@', '📧'],
  ['Müzik', '~*~', '🎵'],
  ['Disk', '[=]', '💾'],
  ['Kaset', 'o=o', '📼'],
  ['Yapım aşamasında', '_/!\\_', '🚧'],
  ['Başa dön', '^^', '⬆️'],
  ['Onay', '[v]', '✅'],
]
