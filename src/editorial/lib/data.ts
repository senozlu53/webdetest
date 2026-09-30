import type { Kontrast, Tema } from './store'

/* ── Madde 4: palet (CSS ile birebir aynı; kontrast hesabı için) ── */
export interface PaletDeger {
  ad: string
  zemin: string
  metin: string
  soluk: string
  kontrol: string
  cizgi: string
  yuzey: string
}
export function palet(t: Tema, k: Kontrast): PaletDeger {
  const y = k === 'yuksek'
  if (t === 'gece') return { ad: 'Gece', zemin: '#111111', metin: '#fdfbf7', soluk: y ? '#d6d6d6' : '#b8b8b8', kontrol: y ? '#b0b0b0' : '#8a8a8a', cizgi: y ? '#7a7a7a' : '#333333', yuzey: '#1b1b1b' }
  if (t === 'beyaz') return { ad: 'Beyaz', zemin: '#ffffff', metin: '#111111', soluk: y ? '#333333' : '#4d4d4d', kontrol: y ? '#595959' : '#8a8a8a', cizgi: y ? '#767676' : '#e0e0e0', yuzey: '#f5f5f5' }
  return { ad: 'Kâğıt', zemin: '#fdfbf7', metin: '#111111', soluk: y ? '#333333' : '#4d4d4d', kontrol: y ? '#595959' : '#8a8a8a', cizgi: y ? '#767676' : '#e0e0e0', yuzey: '#f5f2ea' }
}

/* ── Yayın: KOLON, mimarlık ve yayıncılık dergisi ── */
export const SAYI = { no: 36, donem: 'Güz 2026', tarih: '30 Eylül 2026' }

export const ICINDEKILER = [
  { no: '01', baslik: 'Izgara bir kafes değildir', sayfa: 12 },
  { no: '02', baslik: 'Beyaz alanın mimarisi', sayfa: 24 },
  { no: '03', baslik: 'Satır uzunluğu üzerine', sayfa: 38 },
  { no: '04', baslik: 'Mürekkep ve ekran', sayfa: 52 },
  { no: '05', baslik: 'Gazetenin son sayfası', sayfa: 66 },
  { no: '06', baslik: 'Okur mektupları', sayfa: 80 },
] as const

/** Madde 1 · 2 · 3: karakter denemesi, iki paragraflık sütunlar */
export const METIN = [
  'Bir sayfayı iyi yapan şey, üstündeki şeylerin çokluğu değil, aralarındaki ilişkilerin açıklığıdır. Grid bu ilişkileri görünür kılan sessiz iskelettir: sütunlar, oluklar, kenar boşlukları ve bir satırdan ötekine geçen ölçü. Okur onu görmez; ama her şeyin yerli yerinde olduğunu hisseder.',
  'İsviçreli tipograflar bu iskeleti elli yıl önce bir zanaattan bir yönteme çevirdi. Metin bir süs değil, sayfanın yapı malzemesiydi: başlık taşıyıcı, gövde dolgu, dipnot ayrıntı. Bugün ekranda da aynı ilke geçerli; yalnız sayfa akışkan olduğu için iskeletin de akışkan olması gerekiyor.',
  'Beyaz alan bu düzenin en pahalı malzemesidir. Kimse onu sipariş etmez, herkes eksikliğini fark eder. Sütunlar arasındaki boşluk okuru bir sonraki satıra taşır, başlıkların üstündeki boşluk bir bölümün bittiğini söyler. Boşluğu doldurmak kolaydır; onu korumak disiplin ister.',
  'Ölçü üzerine eski bir kural vardır: satır başına kırk beş ile yetmiş beş karakter. Bunun altında göz çok sık satır atlar, üstünde satırın başını kaybeder. Çok sütunlu bir düzen bu yüzden bir estetik tercih değil, geniş ekranda ölçüyü koruma yöntemidir.',
  'Hiyerarşi boyutla kurulur, renkle değil. Yetmiş iki punto bir başlık ile on dört punto bir alt yazı arasındaki fark, bir gölgenin ya da bir çerçevenin veremeyeceği derinliği verir. Mat kömür metin, kâğıt beyazı zemin ve bir iki hafif gri çizgi yeter; gerisi oran meselesidir.',
  'Ekran küçüldüğünde iskelet çökmez, sadeleşir. On iki sütun dörde, dört sütun bire iner; okuma sırası aynı kalır, ölçü aynı kalır. Kusursuz hizalama bir büyüklüğe bağlı değildir; sayfanın her genişlikte aynı ilkeyi ödünsüz uygulamasıdır.',
] as const

export const ALINTI = 'Hiyerarşi boyutla kurulur, renkle değil.'

export const MAKALELER = [
  {
    no: '01',
    baslik: 'Izgara bir kafes değildir',
    yazar: 'Kaan Ünal',
    dk: 11,
    kategori: 'Tasarım',
    dek: 'Bir grid, öğeleri hapseden bir kafes değil, aralarındaki mesafeyi ölçen bir cetveldir.',
    metin: ['On iki sütunun sırrı sayısında değil, bölünebilirliğindedir: ikiye, üçe, dörde ve altıya ayrılır. Bir sayfada dört ayrı düzen aynı iskelete oturabilir.', 'Kafes öğeyi tutar; cetvel ise öğeye yerini gösterir. İyi bir editör, hangi kuralın ne zaman esneyeceğini de bilir.'],
  },
  {
    no: '02',
    baslik: 'Beyaz alanın mimarisi',
    yazar: 'Deniz Arı',
    dk: 8,
    kategori: 'Mimarlık',
    dek: 'Boşluk, yapının olmayan kısmı değil; yapının kendisini taşıyan kısmıdır.',
    metin: ['Bir odanın boşluğu duvarlarından önce gelir. Sayfada da böyle: iki sütunun arasındaki boşluk, sütunlardan daha çok şey söyler.', 'Beyaz alanı doldurmak istemek, sessizlikten rahatsız olmaya benzer. Oysa okur nefes almak için ona muhtaçtır.'],
  },
  {
    no: '03',
    baslik: 'Satır uzunluğu üzerine',
    yazar: 'Melis Tan',
    dk: 6,
    kategori: 'Yazı',
    dek: 'Kırk beş ile yetmiş beş karakter arası: okurun gözü için bir konfor bandı.',
    metin: ['Satır çok kısaysa göz sürekli aşağı iner, çok uzunsa satırın başını arar. Ekran genişledikçe ölçüyü korumak için ya yazı büyür ya da sütun çoğalır.', 'Bu sayfada gövde metni satır başına en çok yetmiş karakterlik bir sütunda durur; geniş ekranda yanına ikinci bir sütun gelir.'],
  },
  {
    no: '04',
    baslik: 'Mürekkep ve ekran',
    yazar: 'Ozan Kılıç',
    dk: 9,
    kategori: 'Baskı',
    dek: 'Kâğıdın mat yüzeyi ekranda bir renk değil, bir vazgeçiştir: parlaklık, gölge, doku yok.',
    metin: ['Baskıda kâğıt ışığı geri verir; ekranda ışık kendisi kaynaktır. Bu fark yüzünden tam beyaz çoğu zaman yorucudur ve krem bir zemin gözü rahatlatır.', 'Kontrast ise pazarlık konusu değildir: kömür rengi metin kâğıt zemin üstünde on sekiz katın üzerinde bir oran verir.'],
  },
  {
    no: '05',
    baslik: 'Gazetenin son sayfası',
    yazar: 'Ada Sönmez',
    dk: 7,
    kategori: 'Kültür',
    dek: 'Son sayfa, bir gazetenin en özgür sayfasıdır; çünkü kimse orada bir şey aramaz.',
    metin: ['Ön sayfa satar, iç sayfa bilgilendirir, son sayfa ise anımsatır. Ölüm ilanlarının, bulmacanın ve hava durumunun yan yana durabildiği tek yer orasıdır.', 'Web portallarında son sayfa yok; sonsuz akış var. Bir sayfalama sisteminin tanıdık huzuru bu yüzden yeniden değerli.'],
  },
] as const

export const KATEGORILER = ['Hepsi', 'Gündem', 'Kültür', 'Mimarlık', 'Yazı'] as const
export const HABERLER = [
  { id: 'h1', kat: 'Mimarlık', saat: '09:40', baslik: 'Kıyıdaki eski antrepo bir kitap evine dönüşüyor', ozet: 'Betonarme taşıyıcılar korunacak, iç boşluk yedi metre yüksekliğinde tek bir okuma salonu olacak.' },
  { id: 'h2', kat: 'Yazı', saat: '10:15', baslik: 'Yeni bir serif ailesi yalnız ekran için çizildi', ozet: 'Küçük boylarda açık, büyük boylarda ince ayrıntılı; on iki ağırlığı tek dosyada.' },
  { id: 'h3', kat: 'Gündem', saat: '11:05', baslik: 'Belediye, kent rehberini tek sütuna indirdi', ozet: 'Uzun cümlelerin yerini kısa paragraflar aldı; ilk haftada okuma süresi yüzde otuz kısaldı.' },
  { id: 'h4', kat: 'Kültür', saat: '12:30', baslik: 'Cumartesi akşamı matbaa müzesi geç saate kadar açık', ozet: 'Kurşun harf dizme atölyesi, yirmi kişilik gruplarla saat yedide başlıyor.' },
  { id: 'h5', kat: 'Mimarlık', saat: '13:20', baslik: 'Bienalin ana salonu bir ızgara üzerine kuruldu', ozet: 'Altı metrelik modül, sergilenecek her yapıtın yerini önceden belirliyor.' },
  { id: 'h6', kat: 'Yazı', saat: '14:45', baslik: 'Sözlük yayıncıları yazım kılavuzunu güncelledi', ozet: 'Kesme işareti ve büyük harf kuralları için yüzü aşkın örnek eklendi.' },
  { id: 'h7', kat: 'Gündem', saat: '15:10', baslik: 'Kütüphanelerde akşam saatleri uzatıldı', ozet: 'Sınav dönemi boyunca on iki merkez gece yarısına kadar açık kalacak.' },
  { id: 'h8', kat: 'Kültür', saat: '16:00', baslik: 'Bağımsız dergi fuarı bu yıl on dördüncü kez açılıyor', ozet: 'Kırk yayıncı, elle katlanmış sayılarını tek bir uzun masada sergileyecek.' },
] as const

export const KITAP_KATEGORILERI = ['Hepsi', 'Tipografi', 'Mimarlık', 'Edebiyat', 'Tasarım'] as const
export const KITAPLAR = [
  { id: 'k01', ad: 'Sayfanın Geometrisi', yazar: 'Emre Dalkıran', yil: 2024, sayfa: 248, fiyat: 420, kat: 'Tipografi' },
  { id: 'k02', ad: 'Sessiz Cepheler', yazar: 'Leyla Ergün', yil: 2023, sayfa: 312, fiyat: 540, kat: 'Mimarlık' },
  { id: 'k03', ad: 'Kurşun Harfler', yazar: 'Halil Sezer', yil: 2022, sayfa: 176, fiyat: 360, kat: 'Tipografi' },
  { id: 'k04', ad: 'Boşluk Üzerine Denemeler', yazar: 'Sena Yıldız', yil: 2025, sayfa: 204, fiyat: 390, kat: 'Edebiyat' },
  { id: 'k05', ad: 'Modül ve Ölçü', yazar: 'Barış Öner', yil: 2021, sayfa: 288, fiyat: 470, kat: 'Tasarım' },
  { id: 'k06', ad: 'Beton ve Kâğıt', yazar: 'Ayşe Nur Çelik', yil: 2024, sayfa: 336, fiyat: 620, kat: 'Mimarlık' },
  { id: 'k07', ad: 'Okunabilirliğin Tarihi', yazar: 'Tolga Aksoy', yil: 2020, sayfa: 264, fiyat: 410, kat: 'Tipografi' },
  { id: 'k08', ad: 'Son Sayfa', yazar: 'Nehir Kaya', yil: 2025, sayfa: 152, fiyat: 310, kat: 'Edebiyat' },
  { id: 'k09', ad: 'Şehir Tipleri', yazar: 'Orhan Bilgin', yil: 2023, sayfa: 220, fiyat: 450, kat: 'Tasarım' },
  { id: 'k10', ad: 'Yapı ve Yazı', yazar: 'Zeynep Aral', yil: 2022, sayfa: 300, fiyat: 580, kat: 'Mimarlık' },
  { id: 'k11', ad: 'Dipnotların Onuru', yazar: 'Kerem Uslu', yil: 2021, sayfa: 128, fiyat: 280, kat: 'Edebiyat' },
  { id: 'k12', ad: 'Baskı Öncesi', yazar: 'Melike Tuna', yil: 2024, sayfa: 232, fiyat: 430, kat: 'Tasarım' },
  { id: 'k13', ad: 'Serif ve Sans', yazar: 'Cem Doğan', yil: 2025, sayfa: 196, fiyat: 380, kat: 'Tipografi' },
  { id: 'k14', ad: 'Kat Planı', yazar: 'İpek Gündüz', yil: 2023, sayfa: 272, fiyat: 510, kat: 'Mimarlık' },
] as const

export const PROJELER = [
  { id: 'p1', ad: 'Kâğıt Müzesi', tur: 'Kültür', yil: 2026, yer: 'Eskişehir', alan: 4200, ekip: 'Arı, Tan, Ünal' },
  { id: 'p2', ad: 'Sütunlu Avlu', tur: 'Konut', yil: 2025, yer: 'İzmir', alan: 6800, ekip: 'Kılıç, Sönmez' },
  { id: 'p3', ad: 'Okuma Salonu', tur: 'Eğitim', yil: 2025, yer: 'Ankara', alan: 3100, ekip: 'Tan, Arı' },
  { id: 'p4', ad: 'Sekiz Metrelik Cephe', tur: 'Ofis', yil: 2024, yer: 'İstanbul', alan: 9400, ekip: 'Ünal, Kılıç, Aksoy' },
  { id: 'p5', ad: 'Ara Sokak Evi', tur: 'Konut', yil: 2023, yer: 'Bursa', alan: 420, ekip: 'Sönmez' },
  { id: 'p6', ad: 'Matbaa Yenileme', tur: 'Kültür', yil: 2022, yer: 'İstanbul', alan: 2600, ekip: 'Arı, Aksoy' },
  { id: 'p7', ad: 'Liman Kütüphanesi', tur: 'Eğitim', yil: 2021, yer: 'Mersin', alan: 5300, ekip: 'Tan, Ünal' },
  { id: 'p8', ad: 'Üç Katlı Pasaj', tur: 'Ofis', yil: 2020, yer: 'Adana', alan: 7100, ekip: 'Kılıç, Sönmez, Arı' },
] as const

export const BULTEN = [
  { baslik: 'Çeyrek sonuçları: okur sayısı yüzde on iki arttı', ozet: 'Çevrimiçi baskıya geçen üç yayın, ilk çeyrekte sayfa görüntülemesinde en büyük artışı kaydetti.' },
  { baslik: 'Yeni ofis planı: tek sütunlu çalışma masaları', ozet: 'İkinci katta paylaşılan masalar, kolonlara göre gruplandı; toplantı odaları ortak aksa taşındı.' },
  { baslik: 'Ekim takvimi: üç atölye, bir söyleşi', ozet: 'Tipografi atölyesi ilk hafta, ızgara atölyesi ikinci hafta; söyleşi ay sonunda.' },
] as const

/* ── Madde 5 · 7: tip ölçeği ── */
export const OLCEK = [
  { ad: 'Display', boyut: 96, lh: 0.92, aile: 'serif', agirlik: 700, kullanim: 'Manşet' },
  { ad: 'Başlık 1', boyut: 72, lh: 0.95, aile: 'serif', agirlik: 700, kullanim: 'Bölüm başlığı' },
  { ad: 'Başlık 2', boyut: 48, lh: 1.05, aile: 'serif', agirlik: 600, kullanim: 'Makale başlığı' },
  { ad: 'Başlık 3', boyut: 32, lh: 1.15, aile: 'serif', agirlik: 600, kullanim: 'Alt başlık' },
  { ad: 'Dek', boyut: 22, lh: 1.36, aile: 'serif', agirlik: 400, kullanim: 'Giriş cümlesi' },
  { ad: 'Gövde', boyut: 18, lh: 1.625, aile: 'serif', agirlik: 400, kullanim: 'Makale metni' },
  { ad: 'Alt yazı', boyut: 14, lh: 1.5, aile: 'sans', agirlik: 400, kullanim: 'Not, künye' },
  { ad: 'Etiket', boyut: 12, lh: 1.5, aile: 'sans', agirlik: 600, kullanim: 'Üst yazı, sayfa numarası' },
] as const

export const SATIR_YUKSEKLIKLERI = [
  { ad: 'Tight', deger: 1.1, kullanim: 'Manşet ve büyük başlık' },
  { ad: 'Snug', deger: 1.25, kullanim: 'Alt başlık, dek' },
  { ad: 'Normal', deger: 1.5, kullanim: 'Alt yazı, etiket, tablo' },
  { ad: 'Relaxed', deger: 1.625, kullanim: 'Gövde metni (leading-relaxed)' },
  { ad: 'Loose', deger: 2, kullanim: 'Erişilebilirlik testi, çok geniş aralık' },
] as const

/* ── Madde 9: ince çizgili simgeler ── */
export type IkonAd = 'ok-sag' | 'ok-sol' | 'ok-yukari' | 'ok-asagi' | 'ok-capraz' | 'arti' | 'eksi' | 'kapat' | 'ayrac' | 'yildiz' | 'dis' | 'izgara' | 'sayfa' | 'kolon'
export const IKONLAR: { ad: IkonAd; anlam: string; kullanim: string }[] = [
  { ad: 'ok-sag', anlam: 'Sağ ok', kullanim: 'Devamını oku, ileri' },
  { ad: 'ok-sol', anlam: 'Sol ok', kullanim: 'Geri, önceki sayfa' },
  { ad: 'ok-yukari', anlam: 'Yukarı ok', kullanim: 'Başa dön' },
  { ad: 'ok-asagi', anlam: 'Aşağı ok', kullanim: 'Aşağı in' },
  { ad: 'ok-capraz', anlam: 'Çapraz ok', kullanim: 'Yeni sekmede aç' },
  { ad: 'arti', anlam: 'Artı', kullanim: 'Makaleyi aç' },
  { ad: 'eksi', anlam: 'Eksi', kullanim: 'Makaleyi kapat' },
  { ad: 'kapat', anlam: 'Çarpı', kullanim: 'Pencereyi kapat' },
  { ad: 'ayrac', anlam: 'V işareti', kullanim: 'Açılır liste' },
  { ad: 'yildiz', anlam: 'Yıldız', kullanim: 'Dipnot çağrısı' },
  { ad: 'dis', anlam: 'Dış bağlantı', kullanim: 'Başka siteye git' },
  { ad: 'izgara', anlam: 'Izgara', kullanim: 'Kolon kılavuzu' },
  { ad: 'sayfa', anlam: 'Sayfa', kullanim: 'Sayfa numarası' },
  { ad: 'kolon', anlam: 'Sütunlar', kullanim: 'Çok sütunlu düzen' },
]

/* ── Madde 11 · 14: bileşen özellikleri ── */
export const PROPLAR: { bilesen: string; ad: string; tip: string; varsayilan: string; aciklama: string }[] = [
  { bilesen: '<EditorialContainer>', ad: 'as', tip: 'ElementType', varsayilan: '"div"', aciklama: 'Kapsayıcı öğe; section, article, header olabilir' },
  { bilesen: '<EditorialContainer>', ad: 'kolon', tip: '4 | 12', varsayilan: '12', aciklama: 'Grid izi sayısı; dar ekranda 4, geniş ekranda 12' },
  { bilesen: '<EditorialContainer>', ad: 'genis', tip: 'boolean', varsayilan: 'false', aciklama: 'Kenar boşluğunu sıfırlayıp tam genişliğe çıkar' },
  { bilesen: '<MultiColumnLayout>', ad: 'sutun', tip: '1 | 2 | 3 | 4', varsayilan: '3', aciklama: 'Geniş kapsayıcıda sütun sayısı; dar kapsayıcıda kendiliğinden tek sütun' },
  { bilesen: '<MultiColumnLayout>', ad: 'kural', tip: 'boolean', varsayilan: 'true', aciklama: 'Sütunlar arası 1 piksellik dikey çizgi' },
  { bilesen: '<MultiColumnLayout>', ad: 'ilkHarf', tip: 'boolean', varsayilan: 'false', aciklama: 'İlk paragraf için üç satırlık büyük ilk harf' },
  { bilesen: '<ArticleHeader>', ad: 'kicker · baslik · dek', tip: 'string', varsayilan: '—', aciklama: 'Üst yazı, manşet ve giriş cümlesi' },
  { bilesen: '<ArticleHeader>', ad: 'imza · dk', tip: 'string · number', varsayilan: '—', aciklama: 'Yazar satırı ve okuma süresi' },
  { bilesen: '<Pagination>', ad: 'toplam · sayfa · onChange', tip: 'number · fn', varsayilan: '—', aciklama: 'Sayfa numaraları, önceki ve sonraki; aria-current="page"' },
]

/* ── Madde 12 · 13: Figma ── */
export const FIGMA_TOKENLAR = [
  { ad: 'Grid/Editorial12', deger: '12 kolon · oluk 32 · kenar 64 · en çok 1440', tip: 'grid' },
  { ad: 'Typography/LineHeightRelaxed', deger: '1,625', tip: 'number' },
  { ad: 'Typography/LineHeightTight', deger: '1,1', tip: 'number' },
  { ad: 'Color/EditorialCharcoal', deger: '#111111', tip: 'color' },
  { ad: 'Color/PaperWhite', deger: '#FDFBF7', tip: 'color' },
  { ad: 'Color/HairlineGrey', deger: '#E0E0E0', tip: 'color' },
] as const

export const CSS_SATIRI = 'grid grid-cols-12 gap-8 font-sans leading-relaxed text-neutral-900'
