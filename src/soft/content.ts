import type { LineIconName } from './components/LineIcon'

export const NAV = [
  { href: '#ilkeler', label: 'İlkeler' },
  { href: '#renk', label: 'Renk' },
  { href: '#tipografi', label: 'Tipografi' },
  { href: '#bilesenler', label: 'Bileşenler' },
  { href: '#uygulama', label: 'Uygulama' },
] as const

export const HERO_META = [
  { label: 'Stil', value: '002' },
  { label: 'Kategori', value: 'Modern / Minimal / Clean' },
  { label: 'Diğer adı', value: 'Japandi · Warm Minimal' },
] as const

export const PRINCIPLES: ReadonlyArray<{ icon: LineIconName; name: string; text: string }> = [
  {
    icon: 'wind',
    name: 'Nefes alan boşluk',
    text: 'Bölümler arasında 128px, kart içinde 32px ve 48px. Boşluk içeriği bekletmez, ona yer açar.',
  },
  {
    icon: 'sun',
    name: 'Sıcak tonlar',
    text: 'Saf beyaz ve saf siyah yok. Zemin kirli beyaz, metin sıcak gri, vurgu toprak altını.',
  },
  {
    icon: 'leaf',
    name: 'Duygusal dinginlik',
    text: 'Aynı anda tek bir çağrı. Geçişler yavaş, bildirimler sessiz, dil yumuşak.',
  },
  {
    icon: 'drop',
    name: 'Yumuşatılmış köşeler',
    text: 'Kartlar 24px, alanlar 16px, düğmeler hap formunda. Keskin köşe kullanılmaz.',
  },
]

export const SWATCHES = [
  { token: 'canvas', name: 'Kirli Beyaz', role: 'Background', light: '#FAF9F6', dark: '#1A1814', className: 'bg-canvas' },
  { token: 'ink', name: 'Sıcak Koyu Gri', role: 'Text · Color/WarmText', light: '#4A4A4A', dark: '#EDE6DA', className: 'bg-ink' },
  { token: 'sand', name: 'Bej / Kum', role: 'Surface', light: '#F2EDE4', dark: '#24261D', className: 'bg-sand' },
  { token: 'gold', name: 'Soft Altın', role: 'Accent', light: '#C2A878', dark: '#C2A878', className: 'bg-gold' },
] as const

export const DERIVED = [
  { token: 'gold-deep', name: 'Derin Altın', use: 'Metin, bağlantı, ikon, odak halkası', light: '#7A6333', dark: '#D4BE93' },
  { token: 'ink-soft', name: 'Yumuşak Gri', use: 'İkincil metin', light: '#6B655C', dark: '#ADA391' },
  { token: 'field', name: 'Alan Kenarı', use: 'Input ve seçim kenarları', light: '#857E6E', dark: '#8A8270' },
  { token: 'on-gold', name: 'Toprak', use: 'Altın zemin üstündeki metin', light: '#2A2520', dark: '#2A2520' },
] as const

export const CONTRAST = [
  { fg: '#4A4A4A', bg: '#FAF9F6', ratio: '8,42', pass: 'AA · AAA', note: 'Gövde metni' },
  { fg: '#4A4A4A', bg: '#F2EDE4', ratio: '7,60', pass: 'AA · AAA', note: 'Kum yüzeyde metin' },
  { fg: '#7A6333', bg: '#FAF9F6', ratio: '5,45', pass: 'AA', note: 'Bağlantı ve vurgu metni' },
  { fg: '#2A2520', bg: '#C2A878', ratio: '6,62', pass: 'AA', note: 'Altın düğme etiketi' },
  { fg: '#C2A878', bg: '#FAF9F6', ratio: '2,18', pass: 'Metin değil', note: 'Altın yalnızca yüzey ve süsleme' },
  { fg: '#EDE6DA', bg: '#1A1814', ratio: '14,29', pass: 'AA · AAA', note: 'Koyu mod gövde metni' },
  { fg: '#C2A878', bg: '#1A1814', ratio: '7,74', pass: 'AA · AAA', note: 'Koyu modda altın metin' },
] as const

export const TYPE_SCALE = [
  { size: '112', token: 'display', face: 'Lora 400', sample: 'Sakin bir sabah', className: 'font-serif text-display' },
  { size: '60', token: 'h2', face: 'Lora 400', sample: 'Yavaş ve sıcak', className: 'font-serif text-h2' },
  { size: '28', token: 'h3', face: 'Lora 400', sample: 'Akşam rutini', className: 'font-serif text-h3' },
  { size: '20', token: 'lead', face: 'Jakarta 400', sample: 'Giriş metni geniş satır aralığıyla okunur.', className: 'text-lead' },
  {
    size: '16',
    token: 'body',
    face: 'Jakarta 400',
    sample: 'Gövde metni 16px, satır aralığı 1,8, harf aralığı +%1. Satır 60 karakter civarında kalır.',
    className: 'text-body',
  },
  { size: '13', token: 'caption', face: 'Jakarta 500', sample: 'Etiket ve dipnot · %4 harf aralığı', className: 'text-caption font-medium tracking-wide' },
] as const

export const ICONS: ReadonlyArray<{ name: LineIconName; label: string }> = [
  { name: 'leaf', label: 'Yaprak' },
  { name: 'sun', label: 'Güneş' },
  { name: 'moon', label: 'Ay' },
  { name: 'wind', label: 'Nefes' },
  { name: 'drop', label: 'Damla' },
  { name: 'heart', label: 'Kalp' },
  { name: 'home', label: 'Ev' },
  { name: 'search', label: 'Ara' },
  { name: 'bag', label: 'Çanta' },
  { name: 'user', label: 'Profil' },
  { name: 'calendar', label: 'Takvim' },
  { name: 'sparkle', label: 'Işıltı' },
]

export const RADII = [
  { token: 'Radius/Soft', value: '16px', className: 'rounded-soft', use: 'Alan içi, küçük kart' },
  { token: 'Radius/Card', value: '24px', className: 'rounded-card', use: 'Kart ve panel' },
  { token: 'Radius/Pill', value: '999px', className: 'rounded-pill', use: 'Düğme, input, etiket' },
  { token: 'Organik', value: 'oval', className: 'rounded-[58%_42%_52%_48%/48%_56%_44%_52%]', use: 'Görsel ve süsleme' },
] as const

export const SHADOWS = [
  { token: 'Yok', value: 'none', className: 'shadow-none', use: 'Zemine gömülü yüzey' },
  { token: 'Shadow/Soft', value: '0 24px 48px rgba(0,0,0,.03)', className: 'shadow-soft', use: 'Durağan kart' },
  { token: 'Shadow/Float', value: '0 32px 64px −24px', className: 'shadow-float', use: 'Yüzen kart, açılır katman' },
] as const

export const ROUTINE = [
  { icon: 'sun' as const, title: 'Sabah esnemesi', meta: '8 dakika · Beden' },
  { icon: 'wind' as const, title: '4-7-8 nefes', meta: '5 dakika · Nefes' },
  { icon: 'leaf' as const, title: 'Yürüyüş meditasyonu', meta: '12 dakika · Farkındalık' },
  { icon: 'moon' as const, title: 'Uyku öncesi beden taraması', meta: '15 dakika · Uyku' },
]

export const MOODS = ['Uyku', 'Odak', 'Kaygı', 'Sabah', 'Şükran'] as const

export const MOTION = [
  { token: 'Motion/Quick', ms: 300, use: 'Hover, anahtar, odak' },
  { token: 'Motion/Calm', ms: 400, use: 'Düğme, kart, renk geçişi' },
  { token: 'Motion/Slow', ms: 500, use: 'Bölüm belirmesi, açılır katman' },
] as const

export const ROOTS = [
  { term: 'Wabi-sabi', origin: 'Japonya', text: 'Kusurlu, eksik ve geçici olanın güzelliği. Doğal doku, el izi, eskime.' },
  { term: 'Ma', origin: 'Japonya', text: 'Şeyler arasındaki anlamlı boşluk. Sessizlik de kompozisyonun parçasıdır.' },
  { term: 'Hygge', origin: 'Danimarka', text: 'Sıcaklık ve rahatlık hissi. Yumuşak ışık, sade ve kullanışlı eşya.' },
  { term: 'Lagom', origin: 'İsveç', text: 'Ne az ne çok, tam kararında. Her öğe yerini hak eder.' },
] as const
