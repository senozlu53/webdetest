// Tanıtım senaryoları. "AI arama" ve "dinamik doküman" yanıtları bu deponun gerçek dosyalarına dayanır;
// copilot kodu ve takvim örnektir. Model yanıtı üretmez: akış, araç çağrıları ve arayüz burada kurgulanır.

export type Source = { n: number; domain: string; title: string; preview: string; href?: string }

export type Result =
  | { kind: 'sources'; ns: number[] }
  | { kind: 'table'; caption: string; columns: { key: string; label: string; align?: 'right' }[]; rows: Record<string, string>[] }
  | { kind: 'chart'; title: string; unit: string; bars: { label: string; value: number; note?: string }[] }
  | { kind: 'file'; path: string; lang: string; code: string }
  | { kind: 'tests'; passed: number; failed: number; ms: number; lines: { ok: boolean; text: string }[] }
  | { kind: 'diff'; path: string; lines: { t: '+' | '-' | ' '; s: string }[] }
  | { kind: 'calendar'; people: string[]; busy: Record<string, [string, string][]>; slots: string[]; sure: number }
  | { kind: 'event'; baslik: string; zaman: string; sure: number; kisiler: string[] }

export type ToolStep = { name: string; label: string; params: Record<string, unknown>; ms: number; summary: string; result: Result }

export type Scenario = {
  id: string
  kullanim: string
  chip: string
  match: RegExp
  plan: string
  steps: ToolStep[]
  answer: string
  sources: Source[]
  form?: 'etkinlik'
}

const REPO = 'github.com/senozlu53/webdetest'
const BLOB = 'https://github.com/senozlu53/webdetest/blob/claude/optimistic-cerf-u644rd/'

export const SCENARIOS: Scenario[] = [
  {
    id: 'ara',
    kullanim: 'AI arama',
    chip: 'Katalogda cam efekti kullanan stiller hangileri?',
    match: /cam|glass|blur|bulan/i,
    plan: 'Katalogda backdrop-filter kullanan stilleri arayacağım, bulanıklık değerlerini tabloya ve grafiğe dökeceğim.',
    steps: [
      {
        name: 'katalog_ara',
        label: 'Ara',
        params: { sorgu: 'backdrop-filter blur', kapsam: 'stil/001–012', limit: 5 },
        ms: 1300,
        summary: '4 eşleşme',
        result: { kind: 'sources', ns: [1, 2, 3, 4] },
      },
      {
        name: 'tablo_olustur',
        label: 'Tablola',
        params: { kaynaklar: [1, 2, 3, 4], sutunlar: ['stil', 'kullanım', 'bulanıklık', 'doygunluk'] },
        ms: 800,
        summary: '4 satır',
        result: {
          kind: 'table',
          caption: 'Cam efekti kullanan stiller',
          columns: [
            { key: 'stil', label: 'Stil' },
            { key: 'yer', label: 'Kullanım' },
            { key: 'blur', label: 'Bulanıklık', align: 'right' },
            { key: 'sat', label: 'Doygunluk', align: 'right' },
          ],
          rows: [
            { stil: '004 · Glassmorphism', yer: 'tüm paneller', blur: '24px (mobil 14px)', sat: '%160' },
            { stil: '011 · Holographic', yer: 'HoloPanel', blur: '16px (mobil 0)', sat: '%140' },
            { stil: '009 · Low Poly', yer: 'metin paneli', blur: '14px', sat: '%115' },
            { stil: '002 · Soft Minimalism', yer: 'yüzen başlık', blur: '12px', sat: '-' },
          ],
        },
      },
      {
        name: 'grafik_ciz',
        label: 'Çiz',
        params: { tur: 'çubuk', x: 'stil', y: 'bulanıklık (px)' },
        ms: 700,
        summary: '1 grafik',
        result: {
          kind: 'chart',
          title: 'Masaüstü panel bulanıklığı',
          unit: 'px',
          bars: [
            { label: '004 Glass', value: 24 },
            { label: '011 Holo', value: 16 },
            { label: '009 Low Poly', value: 14 },
            { label: '002 Soft', value: 12, note: 'yalnız başlık' },
          ],
        },
      },
    ],
    answer: `## Cam efekti kullanan dört stil

Katalogda \`backdrop-filter\` ile arkasını bulanıklaştıran dört stil var. En yoğun cam **Stil 004 · Glassmorphism**'de: panel bulanıklığı 24px, doygunluk %160 [1]. Dar ekranda bu değer 14px'e iner [1].

- **Stil 011 · Holographic** panellerde 16px bulanıklık ve %140 doygunluk kullanır; dar ekranda "tekil katman" moduna geçip panel bulanıklığını kapatır [2].
- **Stil 009 · Low Poly** metni 14px bulanık bir cam panelin üstüne koyar, böylece çokgen zemin okumayı bozmaz [3].
- **Stil 002 · Soft Minimalism** camı yalnız yüzen başlıkta ve etiketlerde kullanır (\`backdrop-blur-md\`, 12px) [4].

> Bulanıklık arttıkça tarayıcı daha çok pikseli işler; Stil 004 ve 011 bu yüzden mobilde camı hafifletir ya da kapatır.

Değerler yukarıdaki tabloda ve grafikte yan yana.`,
    sources: [
      { n: 1, domain: REPO, title: 'src/glass/glass.css', preview: 'Effects/BackdropBlur: --blur-sm 8px, --blur-md 16px, --blur-lg 24px, --blur-xl 40px; --glass-saturate 160%. Madde 17: mobilde blur yarıya iner (lg 14px).', href: `${BLOB}src/glass/glass.css` },
      { n: 2, domain: REPO, title: 'src/holo/holo.css', preview: 'HoloPanel: backdrop-filter blur(16px) saturate(140%). data-layers="tekil": paneller opak yüzeye döner, iç içe cam düzleşir.', href: `${BLOB}src/holo/holo.css` },
      { n: 3, domain: REPO, title: 'src/lowpoly/lowpoly.css', preview: 'Madde 18: metin cam panelde. .glass { backdrop-filter: blur(14px) saturate(115%) }', href: `${BLOB}src/lowpoly/lowpoly.css` },
      { n: 4, domain: REPO, title: 'src/soft/SoftHeader.tsx', preview: 'Yüzen hap başlık: bg-float, shadow-soft, backdrop-blur-md.', href: `${BLOB}src/soft/SoftHeader.tsx` },
    ],
  },
  {
    id: 'dokuman',
    kullanim: 'Dinamik doküman',
    chip: "Stil 012'de karakter ızgarası nasıl kuruldu?",
    match: /ızgara|izgara|grid|1ch|karakter|doküman|dokuman/i,
    plan: 'Depodaki dokümanlarda ızgarayı arayıp ilgili CSS dosyasını okuyacağım.',
    steps: [
      {
        name: 'dokuman_ara',
        label: 'Ara',
        params: { sorgu: 'karakter ızgarası 1ch', depo: 'webdetest' },
        ms: 1100,
        summary: '2 belge',
        result: { kind: 'sources', ns: [1, 2] },
      },
      {
        name: 'dosya_oku',
        label: 'Oku',
        params: { yol: 'src/term/term.css', bolum: '@theme' },
        ms: 800,
        summary: '9 satır',
        result: {
          kind: 'file',
          path: 'src/term/term.css',
          lang: 'css',
          code: `@theme {
  --color-*: initial;
  --font-*: initial;
  --radius-*: initial;
  --shadow-*: initial;
  /* Karakter hücresi: p-4 = 4ch, gap-2 = 2ch */
  --spacing: 1ch;
  …
}`,
        },
      },
    ],
    answer: `## Karakter ızgarası: 1ch × 1lh

Stil 012'de ızgaranın birimi bir karakter hücresidir: yatay adım \`1ch\`, dikey adım \`1lh\` [1].

### Tailwind aralığı

Tailwind v4'te aralık ölçeği tek bir \`--spacing\` değişkeninden türer. Bu değer \`1ch\` yapılınca her \`p-*\`, \`m-*\` ve \`gap-*\` sınıfı bir karakter katı olur [2]:

\`\`\`css
@theme {
  --spacing: 1ch; /* p-4 = 4 karakter */
}
\`\`\`

### Dikey ritim

Dikey boşluklar satır yüksekliğinin katlarıdır (\`mt-[1lh]\`, \`py-[2lh]\`). Böylece bütün metin 16px ve 1,5 satır aralıklı ızgaraya oturur [1].

| Eksen | Birim | Örnek |
| --- | --- | --- |
| Yatay | 1ch | \`px-2\` = 2 karakter |
| Dikey | 1lh | \`mt-[1lh]\` = 1 satır |

Sayfadaki "ızgarayı çiz" seçeneği bu hücreleri görünür yapar [1].`,
    sources: [
      { n: 1, domain: REPO, title: 'README.md · Stil 012', preview: 'Izgara karakter hücresidir: Tailwind aralık birimi 1ch (p-4 dört karakter), dikey aralıklar lh katları; "ızgarayı çiz" 1ch × 1lh kaplamasını gösterir.', href: `${BLOB}README.md` },
      { n: 2, domain: REPO, title: 'src/term/term.css', preview: '@theme { --spacing: 1ch; } Karakter hücresi: p-4 = 4ch, gap-2 = 2ch.', href: `${BLOB}src/term/term.css` },
    ],
  },
  {
    id: 'copilot',
    kullanim: 'Copilot',
    chip: 'formatBytes fonksiyonundaki hatayı bul',
    match: /hata|bug|test|fonksiyon|kod|düzelt|duzelt|format/i,
    plan: 'Dosyayı okuyup testleri çalıştıracağım; başarısız testlerden hatayı bulup yama önereceğim.',
    steps: [
      {
        name: 'dosya_oku',
        label: 'Oku',
        params: { yol: 'src/format.ts' },
        ms: 700,
        summary: '10 satır',
        result: {
          kind: 'file',
          path: 'src/format.ts',
          lang: 'ts',
          code: `const BIRIMLER = ['B', 'KB', 'MB', 'GB', 'TB']

export function formatBytes(n: number): string {
  let i = 0
  while (n > 1024 && i < BIRIMLER.length) {
    n /= 1024
    i++
  }
  return \`\${n.toFixed(1)} \${BIRIMLER[i]}\`
}`,
        },
      },
      {
        name: 'testleri_calistir',
        label: 'Test',
        params: { dosya: 'format.test.ts' },
        ms: 1500,
        summary: '3 geçti · 2 kaldı',
        result: {
          kind: 'tests',
          passed: 3,
          failed: 2,
          ms: 41,
          lines: [
            { ok: true, text: 'formatBytes(512) = "512.0 B"' },
            { ok: true, text: 'formatBytes(1536) = "1.5 KB"' },
            { ok: false, text: 'formatBytes(1024): beklenen "1.0 KB", gelen "1024.0 B"' },
            { ok: true, text: 'formatBytes(5e9) = "4.7 GB"' },
            { ok: false, text: 'formatBytes(2 ** 60): beklenen "1048576.0 TB", gelen "1024.0 undefined"' },
          ],
        },
      },
      {
        name: 'yama_oner',
        label: 'Yama',
        params: { yol: 'src/format.ts', satir: 5 },
        ms: 900,
        summary: '1 satır',
        result: {
          kind: 'diff',
          path: 'src/format.ts',
          lines: [
            { t: ' ', s: '  let i = 0' },
            { t: '-', s: '  while (n > 1024 && i < BIRIMLER.length) {' },
            { t: '+', s: '  while (n >= 1024 && i < BIRIMLER.length - 1) {' },
            { t: ' ', s: '    n /= 1024' },
          ],
        },
      },
    ],
    answer: `## İki sınır hatası

\`formatBytes\` döngüsünde iki koşul birer adım kaçıyor [1]:

1. \`n > 1024\` karşılaştırması tam 1024 baytı üst birime taşımıyor; test \`1.0 KB\` beklerken \`1024.0 B\` alıyor [2].
2. \`i < BIRIMLER.length\` sınırı dizinin dışına çıkmaya izin veriyor; çok büyük değerlerde birim \`undefined\` oluyor [2].

### Önerilen yama

\`\`\`diff
-  while (n > 1024 && i < BIRIMLER.length) {
+  while (n >= 1024 && i < BIRIMLER.length - 1) {
\`\`\`

Yamayla beş testin beşi de geçer. Sınır değerleri için \`1023\`, \`1024\` ve \`1025\` testlerini de eklemenizi öneririm.`,
    sources: [
      { n: 1, domain: 'örnek depo', title: 'src/format.ts', preview: 'while (n > 1024 && i < BIRIMLER.length) { n /= 1024; i++ }' },
      { n: 2, domain: 'örnek depo', title: 'format.test.ts · 2 başarısız', preview: 'formatBytes(1024): beklenen "1.0 KB", gelen "1024.0 B" · formatBytes(2 ** 60): gelen "1024.0 undefined"' },
    ],
  },
  {
    id: 'asistan',
    kullanim: 'Akıllı asistan',
    chip: 'Yarın ekiple 45 dakikalık toplantı ayarla',
    match: /toplantı|toplanti|takvim|randevu|ayarla|yarın|yarin/i,
    plan: 'Üç kişinin yarınki takvimine bakıp 45 dakikalık ortak boşlukları bulacağım.',
    steps: [
      {
        name: 'takvim_bos_zaman',
        label: 'Takvim',
        params: { kisiler: ['Siz', 'Ece', 'Mert'], tarih: 'yarın', sure_dk: 45, aralik: '09:00–18:00' },
        ms: 1400,
        summary: '3 aralık',
        result: {
          kind: 'calendar',
          people: ['Siz', 'Ece', 'Mert'],
          busy: {
            Siz: [
              ['09:00', '09:45'],
              ['11:00', '12:30'],
              ['14:30', '16:00'],
            ],
            Ece: [
              ['09:00', '10:00'],
              ['12:30', '13:30'],
              ['15:00', '16:15'],
            ],
            Mert: [
              ['10:45', '11:15'],
              ['14:15', '14:30'],
              ['17:00', '18:00'],
            ],
          },
          slots: ['10:00', '13:30', '16:15'],
          sure: 45,
        },
      },
    ],
    answer: `## Üç ortak boşluk

Yarın üçünüzün de boş olduğu 45 dakikalık üç aralık var [1]: sabah **10:00**, öğleden sonra **13:30** ve **16:15**. Birini seçin, daveti hazırlayayım.`,
    sources: [{ n: 1, domain: 'takvim (örnek)', title: 'Siz, Ece, Mert · yarın', preview: 'Dolu: Siz 09:00–09:45, 11:00–12:30, 14:30–16:00 · Ece 09:00–10:00, 12:30–13:30, 15:00–16:15 · Mert 10:45–11:15, 14:15–14:30, 17:00–18:00' }],
    form: 'etkinlik',
  },
]

export const GENEL: Scenario = {
  id: 'genel',
  kullanim: 'Sohbet',
  chip: '',
  match: /.*/,
  plan: 'Bu soru için araç çağırmaya gerek yok; doğrudan yanıtlayacağım.',
  steps: [],
  answer: `Bu tanıtım dört senaryoyu bilir; her biri arayüzü farklı kurar:

- **AI arama**: kaynak kartları, tablo ve grafik ("cam efekti" diye sorun).
- **Dinamik doküman**: dosya okuma ve kod bloğu ("ızgara" diye sorun).
- **Copilot**: test çıktısı ve yama ("hata" diye sorun).
- **Akıllı asistan**: takvim ve doldurulabilir form ("toplantı" diye sorun).

Araç gerekmeyen bu yanıtta yalnız metin üretildi; hiçbir bileşen çağrılmadı.`,
  sources: [],
}

export function pick(q: string) {
  return SCENARIOS.find((s) => s.match.test(q)) ?? GENEL
}
