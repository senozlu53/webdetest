/** Kurgusal içerik: Piksel Kulübe (bağımsız oyun stüdyosu), FaturaKuşu 95 (SaaS) ve Disket Günleri (kampanya) */

export const IPUCLARI: [string, string][] = [
  ['Madde 1', 'Stilin adı 90s Old Web, kategorisi Retro / Nostalgia. Grafik arayüzlerin ilk yılları.'],
  ['Madde 2', 'Klasik gri pencereler, kalın kabartmalı düğmeler, saf mavi altı çizili linkler ve piksel ikonlar.'],
  ['Madde 3', 'Sistem grisi zemin, 2 piksellik kabartma çerçeve, varsayılan mavi link ve Times New Roman.'],
  ['Madde 4', 'Dört renk: Windows grisi #C0C0C0, deniz mavisi #000080, turkuaz #008080, saf beyaz.'],
  ['Madde 5', 'Arayüz yazısı Tahoma ya da MS Sans Serif; belgeler Times New Roman; eğlencede Comic Sans.'],
  ['Madde 6', 'Köşeler hep 0 piksel. Kare ve dikdörtgenden başka şekil yok.'],
  ['Madde 7', 'Gölge yok. Üst ve sol kenar beyaz, alt ve sağ kenar #808080: çıkıntı böyle çizilir.'],
  ['Madde 8', 'Masaüstünde 16 renkli duvar kağıdı ya da dither: iki rengi serpiştirip üçüncüyü taklit etmek.'],
  ['Madde 9', 'İkonlar 16×16 piksel; büyük hâli aynı çizimin iki katı. Yumuşatma yok.'],
  ['Madde 10', 'Bağımsız oyun stüdyoları, eğlenceli SaaS sayfaları ve nostaljik kampanyalar.'],
  ['Madde 11', 'X düğmeli diyaloglar, altta görev çubuğu, klasik sekmeler.'],
  ['Madde 12', 'Figma\'da kabartma iç gölgeyle değil, iç çizgiyle (Inner Stroke) kurulur.'],
  ['Madde 13', 'Tokenlar: Color/Win95Grey, Border/ClassicOutset, Border/ClassicInset.'],
  ['Madde 14', 'React bileşenleri: <Win95Window>, <StartButton>, <DialogBox>.'],
  ['Madde 15', 'border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-600 bg-gray-300. Ama dikkat: bu satırda bir tuzak var.'],
  ['Madde 16', 'Animasyon yok. Her şey tıklayınca anında olur; yalnız yüklenirken kum saati çıkar.'],
  ['Madde 17', 'Telefonda form aynı kalır; pencereler tam ekran açılır.'],
  ['Madde 18', 'Bütün ölçüler rem: tarayıcıda yazıyı büyütünce arayüz de büyür.'],
]

export interface Oyun {
  id: string
  ad: string
  dosya: string
  tur: string
  yil: number
  boyut: string
  durum: 'Çıktı' | 'Geliştiriliyor' | 'Prototip'
  aciklama: string
  platform: string
}
export const OYUNLAR: Oyun[] = [
  { id: 'o1', ad: 'Disket Avcısı', dosya: 'DISKET.EXE', tur: 'Platform', yil: 2025, boyut: '1,38 MB', durum: 'Çıktı', aciklama: 'Kayıp disketleri toplayan küçük bir robot. 24 bölüm, 3 patron, 1 kötü son.', platform: 'Tarayıcı, masaüstü' },
  { id: 'o2', ad: 'Kum Saati', dosya: 'KUMSAAT.EXE', tur: 'Bulmaca', yil: 2026, boyut: '640 KB', durum: 'Geliştiriliyor', aciklama: 'Zaman yalnız sen hamle yapınca akar. 60 bulmaca, hepsi tek ekran.', platform: 'Tarayıcı' },
  { id: 'o3', ad: 'Gri Pencere', dosya: 'GRIPENC.EXE', tur: 'Macera', yil: 2026, boyut: '2,1 MB', durum: 'Prototip', aciklama: 'Bir masaüstünün içinde geçen hikâye. Klasörleri açtıkça sır çözülür.', platform: 'Masaüstü' },
]

export interface Plan {
  ad: string
  fiyat: string
  fatura: string
  kullanici: string
  destek: string
  one?: boolean
}
export const PLANLAR: Plan[] = [
  { ad: 'Disket', fiyat: '0 TL', fatura: '10 / ay', kullanici: '1', destek: 'Yardım dosyası' },
  { ad: 'CD-ROM', fiyat: '149 TL', fatura: 'Sınırsız', kullanici: '5', destek: 'E-posta', one: true },
  { ad: 'Sabit Disk', fiyat: '399 TL', fatura: 'Sınırsız', kullanici: 'Sınırsız', destek: 'Telefon, 7/24' },
]

export const BELGELER: { ad: string; tur: string; boyut: string; tarih: string; ikon: 'belge' | 'oyun' | 'klasor' | 'disket' }[] = [
  { ad: 'Oyunlar', tur: 'Klasör', boyut: '', tarih: '12.09.2026', ikon: 'klasor' },
  { ad: 'DISKET.EXE', tur: 'Uygulama', boyut: '1.413 KB', tarih: '03.05.2025', ikon: 'oyun' },
  { ad: 'OZGECMIS.DOC', tur: 'Belge', boyut: '24 KB', tarih: '21.08.2026', ikon: 'belge' },
  { ad: 'BASIN.TXT', tur: 'Metin belgesi', boyut: '3 KB', tarih: '14.09.2026', ikon: 'belge' },
  { ad: 'YEDEK.DSK', tur: 'Disket kalıbı', boyut: '1.440 KB', tarih: '01.01.1999', ikon: 'disket' },
]

export const COP_BASLANGIC = [
  { id: 'c1', ad: 'eski_logo.bmp', yer: 'C:\\Belgelerim', boyut: '301 KB' },
  { id: 'c2', ad: 'fatura_taslak.doc', yer: 'C:\\Belgelerim', boyut: '18 KB' },
  { id: 'c3', ad: 'oyun_v0.1.exe', yer: 'C:\\Oyunlar', boyut: '512 KB' },
]
