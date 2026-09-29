import type { Sir, SeramikTur } from './seramik'

/* ── Madde 1 · 3: karakteristik ilkeler ── */
export const ILKELER: { ad: string; japonca: string; metin: string }[] = [
  { ad: 'Kusurluluğun estetiği', japonca: 'Fukinsei', metin: 'Düzgün olmayan, tamamlanmamış ve yıpranmış olan daha canlı sayılır. Çizgi düz değildir; bir elin geçtiği yer belli olur.' },
  { ad: 'Meditasyon hissi', japonca: 'Yūgen', metin: 'Her şeyi göstermez. Bir nesne, geniş bir boşlukta tek başına durduğunda söylemediği şeyi de düşündürür.' },
  { ad: 'Mutlak sadelik', japonca: 'Kanso', metin: 'Bir ekranda bir odak noktası, bir de nefes payı. Süs, ancak işlev taşıyorsa kalır.' },
  { ad: 'Ham materyal vurgusu', japonca: 'Shizen', metin: 'Sıva, beton, kil ve seramik yüzeyin pürüzü gizlenmez. Doku sessizdir ama görünür.' },
  { ad: 'Derin sükunet', japonca: 'Seijaku', metin: 'Hiçbir şey acele etmez. Geçişler saniyeler sürer, hareket neredeyse fark edilmez.' },
]

/* ── Madde 4: renk ── */
export const RENKLER: { id: string; ad: string; hex: string; rol: string; boy: number; kaydir: number }[] = [
  { id: 'wabiStone', ad: 'Ham Kil', hex: '#E8E4DF', rol: 'Sayfa zemini (Color/WabiStone). Yazı bu zeminin üstünde okunur', boy: 168, kaydir: 0 },
  { id: 'ash', ad: 'Kül Grisi', hex: '#B0A8A0', rol: 'Yalnız süs: ince çizgi, seramik sırı, ayraç. Zeminde 1,85:1, bu yüzden yazı ve denetim çizgisi olmaz', boy: 112, kaydir: 46 },
  { id: 'leaf', ad: 'Kurumuş Yaprak', hex: '#8C7B70', rol: 'Denetim çerçevesi ve ince çizgi (3,2:1); büyük yazıda kullanılabilir', boy: 140, kaydir: 14 },
  { id: 'matte', ad: 'Mat Siyah', hex: '#1F1C1A', rol: 'Küçük detaylar: dolu düğme, ensō fırçası, mat seramik', boy: 84, kaydir: 78 },
]

/* ── Madde 10 · Seramik atölyesi ── */
export interface Parca {
  id: string
  no: string
  ad: string
  tur: SeramikTur
  sir: Sir
  boy: number
  olcu: string
  not: string
  fiyat: number
  kaydir: number
  tohum: number
}
export const PARCALAR: Parca[] = [
  { id: 'kul-vazo', no: '07', ad: 'Kül sırlı vazo', tur: 'vazo', sir: 'kul', boy: 210, olcu: '32 cm', not: 'Odun fırını, 1240 °C', fiyat: 4800, kaydir: 0, tohum: 7 },
  { id: 'yaprak-cay', no: '12', ad: 'Kurumuş yaprak çay kasesi', tur: 'cay', sir: 'yaprak', boy: 92, olcu: '8 cm', not: 'Elle çekilmiş, tek sır', fiyat: 1250, kaydir: 38, tohum: 12 },
  { id: 'ham-kase', no: '03', ad: 'Ham çanak', tur: 'kase', sir: 'kil', boy: 108, olcu: '19 cm', not: 'Sırsız, dışı fırça izli', fiyat: 2100, kaydir: 12, tohum: 3 },
  { id: 'mat-testi', no: '19', ad: 'Mat siyah testi', tur: 'testi', sir: 'mat', boy: 190, olcu: '28 cm', not: 'Raku, kapağı yok', fiyat: 3600, kaydir: 62, tohum: 19 },
  { id: 'yassi-tabak', no: '21', ad: 'Yassı tabak', tur: 'tabak', sir: 'kul', boy: 62, olcu: '26 cm', not: 'Kenarı elle bükülmüş', fiyat: 1650, kaydir: 24, tohum: 21 },
  { id: 'nehir-tasi', no: '00', ad: 'Nehir taşı', tur: 'tas', sir: 'kul', boy: 96, olcu: '11 cm', not: 'Işlenmemiş; Kızılırmak', fiyat: 650, kaydir: 50, tohum: 4 },
]
export const KURSLAR = [
  { id: 'cark', ad: 'Çark, ilk gün', sure: '3 saat', fiyat: 1800 },
  { id: 'el', ad: 'Elle şekillendirme', sure: '2 gün', fiyat: 3400 },
  { id: 'raku', ad: 'Raku günü', sure: '1 gün', fiyat: 2600 },
]
export const TARIHLER = ['Cumartesi, 3 Ekim', 'Cumartesi, 10 Ekim', 'Cumartesi, 17 Ekim', 'Cumartesi, 24 Ekim']

/* ── Madde 10 · Zen merkezi ── */
export const PROGRAM = [
  { gun: 'Pazartesi', saat: '07:00', ad: 'Oturuş', sure: 25, yer: 4 },
  { gun: 'Çarşamba', saat: '19:30', ad: 'Yürüyüş meditasyonu', sure: 40, yer: 0 },
  { gun: 'Cuma', saat: '18:00', ad: 'Çay ve sessizlik', sure: 50, yer: 7 },
  { gun: 'Pazar', saat: '09:00', ad: 'Uzun oturuş', sure: 60, yer: 2 },
]
export const CUMLELER = ['Acele eden kil çatlar.', 'Bir parça, bir kez yapılır.', 'Kusur, elin izidir.', 'Boşluk, kabın işe yarayan yanıdır.', 'Dinlenen çamur, ustanın sabrıdır.']

/* ── Madde 10 · Mimarlık ofisi ── */
export interface Plan {
  odalar: [number, number, number, number, string][]
  kapilar: [number, number, number, number][]
}
export interface Proje {
  id: string
  ad: string
  yer: string
  yil: number
  alan: number
  not: string
  plan: Plan
}
export const PROJELER: Proje[] = [
  {
    id: 'kil-ev',
    ad: 'Kil Ev',
    yer: 'Ayvalık',
    yil: 2024,
    alan: 96,
    not: 'Sıvası kireç ve kil karışımı, avluya açılan tek oda ve bir gölge.',
    plan: {
      odalar: [
        [14, 16, 108, 76, 'Oda'],
        [122, 16, 64, 44, 'Mutfak'],
        [122, 60, 64, 32, 'Banyo'],
        [14, 92, 172, 36, 'Avlu'],
      ],
      kapilar: [
        [122, 34, 122, 46],
        [70, 92, 84, 92],
      ],
    },
  },
  {
    id: 'tas-avlu',
    ad: 'Taş Avlu',
    yer: 'Datça',
    yil: 2023,
    alan: 140,
    not: 'İki taş duvar bir avluyu çevreler; çatı yalnız yağmuru kesecek kadar.',
    plan: {
      odalar: [
        [18, 14, 70, 60, 'Yatak'],
        [88, 14, 96, 60, 'Gündüz'],
        [18, 74, 166, 52, 'Avlu'],
      ],
      kapilar: [
        [88, 34, 88, 50],
        [44, 74, 60, 74],
      ],
    },
  },
  {
    id: 'sessiz-oda',
    ad: 'Sessiz Oda',
    yer: 'İstanbul',
    yil: 2025,
    alan: 34,
    not: 'Bir minder, bir pencere. Duvarlar ham beton; ses için tek bir keçe panel.',
    plan: {
      odalar: [
        [40, 22, 120, 84, 'Oda'],
        [40, 106, 46, 22, 'Giriş'],
      ],
      kapilar: [[54, 106, 70, 106]],
    },
  },
]

/* ── Madde 10 · Bağımsız yayın ── */
export const SAYILAR = [
  { no: '01', ad: 'Kil', yil: 2023, konu: 'Elin ilk izi' },
  { no: '02', ad: 'Taş', yil: 2024, konu: 'Yıpranmanın onuru' },
  { no: '03', ad: 'Su', yil: 2025, konu: 'Biçimsizlik üzerine' },
  { no: '04', ad: 'Boşluk', yil: 2026, konu: 'Söylenmeyenin ağırlığı' },
]
export const DENEME = {
  baslik: 'Yarım kalanın bilgeliği',
  yazar: 'Defne Aksoy',
  okuma: '6 dk',
  paragraflar: [
    'Bir çay kasesinin kenarındaki küçük çentik, o kaseyi eksik yapmaz. Elin kile değdiği yeri gösterir. Bakan kişi, kasenin bir kez ve yalnızca bir kez yapıldığını orada anlar.',
    'Kusursuzluk bir sonuçtur; ona ulaşmak için önce başka her şeyi eleriz. Kusurluluk ise bir başlangıç noktasıdır: olduğu gibi bırakılan şey, olabilecek her şeyi açık tutar.',
    'Ekranlar buna karşıdır. Her piksel hizalanmış, her aralık eşit, her köşe aynı yarıçapta. Sonra da neden gözlerimizin dinlenmediğini soruyoruz.',
    'Asimetri bir hata değil, bir karardır. Sayfanın bir yanını boş bırakmak, okura o yanı kendisinin doldurabileceğini söylemektir.',
    'Bu yüzden Kenar’da her yazının sağında ya da solunda bir boşluk kalır. O boşluk yazının en uzun cümlesidir.',
  ],
  dipnot: 'Wabi, yalnızlıktan doğan yalınlığı; sabi, zamanla gelen olgunluğu anlatır. İkisi birlikte anılır, ama ayrı şeylerdir.',
}

/* ── Madde 12 · 13: Figma ── */
export const ASIMETRI_ONAYARLAR = [
  { id: 'sola', ad: 'Sola yaslı', sol: 24, sag: 96, ust: 64, alt: 96 },
  { id: 'saga', ad: 'Sağa yaslı', sol: 96, sag: 24, ust: 64, alt: 96 },
  { id: 'soluk', ad: 'Soluk', sol: 40, sag: 160, ust: 96, alt: 40 },
  { id: 'merkez', ad: 'Merkez (yapma)', sol: 64, sag: 64, ust: 64, alt: 64 },
] as const
export const FIGMA_MODLARI = [
  { id: 'kil', ad: 'Kil' },
  { id: 'kul', ad: 'Kül' },
  { id: 'komur', ad: 'Kömür' },
] as const
export const FIGMA_ETIKETLER = [
  { ad: 'Color/WabiStone', deger: '#E8E4DF · Ham Kil, sayfa zemini' },
  { ad: 'Color/AshGrey', deger: '#B0A8A0 · Kül Grisi, yalnız süs' },
  { ad: 'Color/DriedLeaf', deger: '#8C7B70 · Kurumuş Yaprak, çizgi ve denetim' },
  { ad: 'Color/MatteBlack', deger: '#1F1C1A · Mat Siyah detay' },
  { ad: 'Spacing/MeditativeSpace', deger: '96 px taban · 1 : 2 : 3 : 5 : 8' },
  { ad: 'Font/WeightLight', deger: '300' },
  { ad: 'Font/Tracking', deger: '0,1 em (tracking-widest)' },
  { ad: 'Radius/Handmade', deger: '5px 11px 7px 13px / 12px 6px 11px 5px' },
]

/* ── Madde 14 ── */
export const PROPLAR: { bilesen: string; ad: string; tip: string; varsayilan: string; aciklama: string }[] = [
  { bilesen: '<WabiContainer>', ad: 'yon', tip: '"sol" | "sag"', varsayilan: 'sayfa ayarı', aciklama: 'Yaslanma: "sol" içerik solda, boşluk sağda (varsayılan); "sag" ayna yerleşim' },
  { bilesen: '<WabiContainer>', ad: 'bolum', tip: 'boolean', varsayilan: 'true', aciklama: 'Bölüm boşluğu: üst ve alt 88–200 px' },
  { bilesen: '<Yer>', ad: 'b · s', tip: 'number', varsayilan: '2 · 6', aciklama: '12 kolonda başlangıç ve genişlik; yön çevrilince kolonlar sağdan sayılır (ayna yerleşim)' },
  { bilesen: '<Yer>', ad: 'ind · ust', tip: 'number', varsayilan: '0 · 0', aciklama: 'Dar ekranda yatay asimetrinin dikeye çevrilmiş karşılığı (% girinti, rem üst boşluk)' },
  { bilesen: '<ImperfectCard>', ad: 'tohum', tip: 'number', varsayilan: '1', aciklama: 'Çerçevenin elle çizilmiş sapmalarını belirler' },
  { bilesen: '<ImperfectCard>', ad: 'kaydir', tip: 'number', varsayilan: '0', aciklama: 'Kartı ızgaradan bilerek kaydırır (px, yalnız geniş ekranda)' },
  { bilesen: '<ImperfectCard>', ad: 'mat', tip: 'boolean', varsayilan: 'false', aciklama: 'Mat siyah dolgulu ters kart' },
  { bilesen: '<ZenHero>', ad: 'odak', tip: '"vazo" | "kase" | "cay" | "testi" | "tabak" | "tas"', varsayilan: '"vazo"', aciklama: 'Ekrandaki tek odak noktası' },
  { bilesen: '<ZenHero>', ad: 'dal', tip: 'boolean', varsayilan: 'true', aciklama: 'Ağızda tek bir kuru dal (yalnız vazo ve testi)' },
]

/* ── Madde 15 ── */
export const TAILWIND_SINIF = 'bg-[#E8E4DF] text-[#4A4542] font-light tracking-widest'

/* ── Tema değerleri (CSS ile aynı; kontrast hesabı için) ── */
export const TEMA = {
  kil: { ad: 'Kil', zemin: '#E8E4DF', yuzey: '#EFECE7', metin: '#4A4542', soluk: '#5E5148', kontrol: '#857468', dokRenk: '#4A4542', dokA: 0.08, odak: '#3B2A20' },
  kul: { ad: 'Kül', zemin: '#B0A8A0', yuzey: '#BAB3AC', metin: '#1F1C1A', soluk: '#2A2420', kontrol: '#5A4E46', dokRenk: '#1F1C1A', dokA: 0.08, odak: '#241A12' },
  komur: { ad: 'Kömür', zemin: '#1C1A18', yuzey: '#23201E', metin: '#E8E4DF', soluk: '#B8B0A8', kontrol: '#8C7B70', dokRenk: '#E8E4DF', dokA: 0.06, odak: '#D8C4AC' },
} as const
