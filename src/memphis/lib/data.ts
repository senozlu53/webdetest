export type Ton = 'sari' | 'camgobegi' | 'pembe' | 'beyaz' | 'lacivert'
export type Sekil = 'daire' | 'ucgen' | 'kare' | 'zikzak' | 'dalga' | 'silindir' | 'yarim' | 'arti'

/** Madde 10: yaratıcı ajans. Konfeti Kolektif ve işleri kurgudur */
export const ISLER: { id: string; ad: string; musteri: string; tur: string; yil: number; ton: Ton; sekil: Sekil }[] = [
  { id: 'seker', ad: 'Şeker Palas', musteri: 'Pastane kimliği', tur: 'Marka', yil: 2025, ton: 'pembe', sekil: 'daire' },
  { id: 'kitap', ad: 'Kitap Günleri', musteri: 'Festival afişleri', tur: 'Afiş', yil: 2025, ton: 'sari', sekil: 'ucgen' },
  { id: 'muze', ad: 'Minik Müze', musteri: 'Çocuk müzesi yön bulma', tur: 'Mekân', yil: 2024, ton: 'camgobegi', sekil: 'zikzak' },
  { id: 'podcast', ad: 'Kulak Misafiri', musteri: 'Podcast kapakları', tur: 'Dijital', yil: 2024, ton: 'beyaz', sekil: 'dalga' },
  { id: 'dondurma', ad: 'Buz Kamyonu', musteri: 'Dondurma arabası giydirme', tur: 'Ambalaj', yil: 2023, ton: 'sari', sekil: 'silindir' },
]

/** Madde 10: festival. Zikzak Festivali, sanatçılar ve saatler kurgudur */
export const SAHNELER = [
  { id: 'sari', ad: 'Sarı Sahne', ton: 'sari' as Ton },
  { id: 'camgobegi', ad: 'Camgöbeği Sahne', ton: 'camgobegi' as Ton },
  { id: 'pembe', ad: 'Pembe Çadır', ton: 'pembe' as Ton },
]
export const PROGRAM: { gun: 'cuma' | 'cumartesi' | 'pazar'; saat: string; sanatci: string; sahne: string; tur: string }[] = [
  { gun: 'cuma', saat: '18:00', sanatci: 'Kare Kafalar', sahne: 'sari', tur: 'Garaj rock' },
  { gun: 'cuma', saat: '19:30', sanatci: 'Deniz Dalgası', sahne: 'camgobegi', tur: 'Synth-pop' },
  { gun: 'cuma', saat: '21:00', sanatci: 'Üçgen Kuş', sahne: 'pembe', tur: 'Elektronik' },
  { gun: 'cuma', saat: '22:30', sanatci: 'Neon Babaanne', sahne: 'sari', tur: 'Disko' },
  { gun: 'cumartesi', saat: '17:00', sanatci: 'Puantiye', sahne: 'camgobegi', tur: 'Akustik' },
  { gun: 'cumartesi', saat: '19:00', sanatci: 'Zikzak Kardeşler', sahne: 'sari', tur: 'Funk' },
  { gun: 'cumartesi', saat: '20:30', sanatci: 'Milano 81', sahne: 'pembe', tur: 'İtalo disko' },
  { gun: 'cumartesi', saat: '22:00', sanatci: 'Hap Butonlar', sahne: 'camgobegi', tur: 'Indie' },
  { gun: 'pazar', saat: '16:00', sanatci: 'Konfeti Korosu', sahne: 'pembe', tur: 'Çocuk korosu' },
  { gun: 'pazar', saat: '18:00', sanatci: 'Silindir Şapka', sahne: 'sari', tur: 'Swing' },
  { gun: 'pazar', saat: '20:00', sanatci: 'Kalın Kontur', sahne: 'camgobegi', tur: 'Post-punk' },
]
export const BILETLER = [
  { id: 'gun', ad: 'Günlük', fiyat: 650, not: 'Tek gün, bütün sahneler' },
  { id: 'hafta', ad: 'Üç gün', fiyat: 1450, not: 'Cuma–pazar, bileklik' },
  { id: 'kamp', ad: 'Kamp', fiyat: 2100, not: 'Üç gün + çadır alanı' },
]

/** Madde 10: eğitim teknolojisi. Şekil Okulu soruları */
export const SORULAR: { soru: string; secenek: string[]; dogru: number; aciklama: string }[] = [
  { soru: 'Bir üçgenin iç açıları toplamı kaç derecedir?', secenek: ['90°', '180°', '270°', '360°'], dogru: 1, aciklama: 'Her üçgende üç iç açının toplamı 180°.' },
  { soru: 'Altın oran yaklaşık kaçtır?', secenek: ['1,414', '1,618', '2,718', '3,142'], dogru: 1, aciklama: '(1 + kök 5) / 2, yaklaşık 1,618. Bu sayfadaki boyutlar ona göre dizilir.' },
  { soru: 'Bir silindirin yan yüzü açılınca hangi şekil çıkar?', secenek: ['Kare', 'Dikdörtgen', 'Daire', 'Üçgen'], dogru: 1, aciklama: 'Yan yüz, taban çevresi uzunluğunda bir dikdörtgendir.' },
  { soru: 'Memphis Grubu hangi şehirde kuruldu?', secenek: ['Paris', 'Berlin', 'Milano', 'Londra'], dogru: 2, aciklama: '1981, Milano: Ettore Sottsass ve arkadaşları.' },
  { soru: 'Altın açı yaklaşık kaç derecedir?', secenek: ['90°', '120°', '137,5°', '150°'], dogru: 2, aciklama: '360° × (1 − 1 / 1,618), yaklaşık 137,5°. Ayçiçeği tohumları bu açıyla dizilir.' },
]

/** Madde 10: eğlence platformu. Konfeti Kutusu parti çarkı */
export const CARK: { metin: string; ton: Ton }[] = [
  { metin: 'Bir şarkı mırıldan', ton: 'sari' },
  { metin: '10 saniye dans', ton: 'pembe' },
  { metin: 'Birini taklit et', ton: 'camgobegi' },
  { metin: 'Pas!', ton: 'beyaz' },
  { metin: 'Fıkra anlat', ton: 'sari' },
  { metin: 'Soruyu sen sor', ton: 'pembe' },
  { metin: 'Tekerleme söyle', ton: 'camgobegi' },
  { metin: 'Joker', ton: 'beyaz' },
]
