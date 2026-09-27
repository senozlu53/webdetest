# webdetest · Stil kataloğu

Web tasarım stilleri için canlı referans sayfaları. Her stil, anlattığı kurallarla dizilmiş ayrı bir sayfadır ve kendi tokenlarına, bileşenlerine ve Tailwind CSS v4 temasına sahiptir.

| Stil | Sayfa | Kaynak | Tokenlar |
| --- | --- | --- | --- |
| 001 · Swiss Style | `/stil/001/` | `src/swiss/` | `tokens/swiss.tokens.json` |
| 002 · Soft Minimalism | `/stil/002/` | `src/soft/` | `tokens/soft.tokens.json` |
| 003 · Corporate Modern | `/stil/003/` | `src/corporate/` | `tokens/corporate.tokens.json` |
| 004 · Glassmorphism | `/stil/004/` | `src/glass/` | `tokens/glass.tokens.json` |

```bash
npm install
npm run dev        # http://localhost:5173  → katalog, /stil/001/, /stil/002/, /stil/003/, /stil/004/
npm run build      # tip denetimi + dist/
npm run typecheck
```

## Yapı

```
index.html               katalog
stil/001/index.html      Swiss Style giriş noktası
stil/002/index.html      Soft Minimalism giriş noktası
stil/003/index.html      Corporate Modern giriş noktası
stil/004/index.html      Glassmorphism giriş noktası
src/shared/              stiller arası ortak yardımcılar (cx, useTheme)
src/swiss/               swiss.css (tema) · components/ · sections/
src/soft/                soft.css (tema) · components/ · sections/
src/corporate/           corporate.css (tema) · ui/ (shadcn) · views/ · charts/ · data/
src/glass/               glass.css (tema) · components/ · sections/
tokens/                  W3C DTCG token dosyaları (Figma / Tokens Studio)
```

Vite çok sayfalı derlenir (`vite.config.ts` → `build.rollupOptions.input`). Her stilin CSS dosyası `@import 'tailwindcss' source(none)` ve `@source '.'` ile yalnızca kendi klasörünü tarar; böylece temalar birbirine sızmaz. `base: './'` sayesinde `dist/` herhangi bir alt dizinden servis edilebilir.

Yeni stil eklemek için: `stil/00N/index.html`, `src/<ad>/` altında `main.tsx` + tema CSS'i, `tokens/<ad>.tokens.json`, `vite.config.ts` içine yeni giriş ve katalogda bir kart.

---

## Stil 001 · Swiss Style

12 kolonlu grid, 4 renk, tek yazı ailesi (Inter), 0px köşe, sıfır gölge.

| Değişken | Açık | Invert | Tailwind |
| --- | --- | --- | --- |
| `paper` | `#FFFFFF` | `#111111` | `bg-paper` |
| `ink` | `#111111` | `#FFFFFF` | `text-ink`, `border-ink` |
| `accent` | `#FF2A2A` | `#FF2A2A` | `bg-accent` |
| `mute` | `#E5E5E5` | `#2B2B2B` | `bg-mute` |
| `on-accent` | `#111111` | `#111111` | `text-on-accent` |

- **Boşluk:** `xs 8 · s 16 · m 32 · l 64 · xl 128`, çizgi için `rule 2px`.
- **Tip:** `label 12 · body 14 · lead 20 · h3 32 · h2 64 · display 120` ve akışkan `hero`.
- **Silinen tokenlar:** varsayılan renk, gölge, yarıçap, blur ve easing. `shadow-lg` yazılsa bile CSS üretilmez.
- **Bileşenler:** `SwissGrid`/`SwissCol` (`span={[12, 8, 7]}`), `TypographyDisplay`, `ThickDivider`, `UnderlineLink`, `SwissButton`, `GeoIcon`, `Figure`, `GridOverlay` (G tuşu), `useCutReveal`.
- **Hareket:** hover 0ms; reveal `steps(4)`.
- **Türkçe büyük harf:** sayfa `lang="tr"`; İngilizce ifadeler `lang="en"` ile sarılır, aksi halde "SWİSS" oluşur.

## Stil 002 · Soft Minimalism

Japandi sıcaklığı: kirli beyaz zemin, kum yüzeyler, toprak altını, hap formunda düğmeler, dağınık gölgeler, Lora + Plus Jakarta Sans.

| Figma değişkeni | Light | Dark | Tailwind |
| --- | --- | --- | --- |
| `Color/Background` | `#FAF9F6` | `#1A1814` | `bg-canvas` |
| `Color/WarmText` | `#4A4A4A` | `#EDE6DA` | `text-ink` |
| `Color/Surface` | `#F2EDE4` | `#24261D` (zeytin) | `bg-sand` |
| `Color/Accent` | `#C2A878` | `#C2A878` | `bg-gold` |
| `Color/AccentText` | `#7A6333` | `#D4BE93` | `text-gold-deep` |
| `Color/MutedText` | `#6B655C` | `#ADA391` | `text-ink-soft` |
| `Color/FieldBorder` | `#857E6E` | `#8A8270` | `border-field` |
| `Color/OnAccent` | `#2A2520` | `#2A2520` | `text-on-gold` |

- **Erişilebilirlik:** Altın `#C2A878` açık zeminde 2,18:1 verir, metin taşıyamaz. Metin, bağlantı, ikon ve odak halkası türetilmiş `AccentText` ile çizilir (5,45:1). Form kenarları zeminde 3,83:1 (WCAG 1.4.11). Tüm oranlar `tokens/soft.tokens.json` içinde yazılıdır.
- **Gölge:** `Shadow/Soft` = `0 24px 48px rgba(0,0,0,0.03)` (`shadow-soft`), `Shadow/Float` yüzen kartlar için (`shadow-float`).
- **Yarıçap:** `Radius/Soft 16` (`rounded-soft`, `rounded-2xl`), `Radius/Card 24` (`rounded-card`, `rounded-3xl`), `Radius/Pill 999` (`rounded-pill`).
- **Auto Layout:** kart iç boşluğu `P: 32px 48px`, 768px altında `24px 28px`. Sayfa kenarı 24 / 48 / 80px.
- **Bileşenler:** `SoftCard blur="sm"`, `PillButton`, `FadeSection`, `PillInput`, `Switch`, `LineIcon` (1,5px, yuvarlak uç), `SectionIntro`, `useParallax`.
- **Hareket:** 300 / 400 / 500ms, `cubic-bezier(0.45, 0.05, 0.55, 0.95)`; sayfa açılışı 900ms; hero ışığında paralaks. `FadeSection` içeriği hiçbir zaman gizli bekletmez: yalnızca ekranın altından giren bölümler belirir. Hareket azaltma açıksa hepsi kapanır.
- **Doku:** sayfanın tamamında belli belirsiz kağıt gürültüsü (`.soft-grain`), sayfadaki anahtarla kapatılabilir.
- **Tailwind:** tanımdaki `bg-[#FAF9F6] text-[#4A4A4A] rounded-2xl shadow-soft tracking-wide` yerine tokenlı hali `bg-canvas text-ink rounded-2xl shadow-soft tracking-wide` kullanılır; koyu mod böylece kendiliğinden çalışır.

## Stil 003 · Corporate Modern

Sayfa bir referans belgesi değil, çalışan bir B2B tahsilat paneli ("Cari Bulut", kurgusal): genel bakış, faturalar, müşteri ekleme sihirbazı ve tasarım sistemi. Yönlendirme düz `#çapa` ile yapılır (`#genel-bakis`, `#faturalar`, `#musteri-ekle`, `#tasarim-sistemi`).

- **Altyapı:** shadcn/ui kalıbı; `src/corporate/ui/` altında Radix (`radix-ui`), `class-variance-authority`, `tailwind-merge` ve `cn()` ile yazılmış bileşenler: `Button`, `Badge`, `Card`, `Input`, `NativeSelect`, `Checkbox`, `RadioGroup`, `DropdownMenu`, `Dialog`/`Sheet`, `Table`, `DataTable` (TanStack Table v8), `FormItem` ailesi, `Sidebar`.
- **Renk:** Slate, Blue, Green, Amber, Red için 50–950 tam skalalar ve shadcn adlandırmalı semantik tokenlar (`bg-background`, `bg-card`, `text-muted-foreground`, `border-input`, `ring` …). Figma yolları: `Color/Text/Muted`, `Color/Border/Error` vb.
- **WCAG AAA:** `#2563EB` beyazda 5,17:1 verir (AA). Bu yüzden marka rengi metin taşımayan yerlerde (odak halkası, grafik, aktif gösterge, onay kutusu) kalır; birincil düğme ve bağlantılar Blue 800 (8,72:1), ikincil metin Slate 600 (7,58:1) kullanır. Input kenarı Slate 500 (4,76:1). Tüm hedefler en az 44 × 44px (2.5.5), satır aralığı 1,5 (1.4.8), sihirbazda kaydetmeden önce özet ve onay adımı var (3.3.6). Oranlar `tokens/corporate.tokens.json` içinde yazılıdır.
- **Koyu mod:** Slate 950 zemin, Slate 900 yüzey; birincil Blue 400 (koyu metinle 7,93:1), ikincil metin Slate 300. Tema menüsü: Açık, Koyu, Sistem.
- **Gölge:** `shadow-sm` durağan kart, `shadow-md` hover ve açılır menü, `shadow-lg` modal ve çekmece. Doku ve degrade yok.
- **Hareket:** 150ms `ease-out`; açılır katmanlar 100ms'de kapanır. Sayfa açılış animasyonu yok.
- **Grafikler:** tek seri sütun grafik (sütun ≤ 24px, üstü 4px yuvarlak, ipucu fare ve klavyeyle, tablo görünümü), parça-bütün durum çubuğu (2px yüzey boşluğu, ikon + etiketli lejant), 12 noktalı eğilim çizgili KPI kartları. Durum renkleri renk körlüğü doğrulayıcısından açık ve koyu modda geçer.
- **Duyarlı yapı:** 768px altında veri tablosu liste kartlarına, 1024px altında kenar menüsü alt gezinmeye ve çekmeceye dönüşür.
- **Örnek veri:** `src/corporate/data/invoices.ts` tohumlu üretilir (24 ay; panel en çok 12 ay gösterir, önceki 12 ay karşılaştırma içindir). Hatırlatma ve iptal işlemleri yalnızca sayfa belleğinde çalışır.

## Stil 004 · Glassmorphism

Canlı degrade zemin üstünde buzlu cam paneller. İki tema: koyu "derin uzay" (neon ışık lekeleri) ve açık "holografik" (pastel, yanardöner kenar).

- **Cam paneli (`.glass`, `<GlassCard>`):** `backdrop-filter: blur(24px) saturate(160%)`, yarı saydam dolgu, 1px yarı saydam kenar, üstte 1px iç parlama (Figma Inner Shadow) ve yayvan dış gölge. `blur` (sm 8 · md 16 · lg 24 · xl 40), `tone` (subtle · panel · strong), `holo` ve `tilt` seçenekleri.
- **Okunurluk:** Blur ortalama rengi değiştirmez; en kötü durum, en parlak ışık lekesinin metnin tam arkasına geldiği andır. Tanımdaki `bg-white/10` koyu canlı zeminde beyaz metinle 2,75:1 verir (AA geçmez). Metin taşıyan cam koyu temada %55 koyu mürekkep (8,41:1), açık temada %50 beyazdır (12,73:1). Tüm metin renkleri en kötü durumda 4,5:1'in üstünde; değerler `tokens/glass.tokens.json` içinde.
- **Cam laboratuvarı:** Bulanıklık, dolgu rengi ve opaklığı, kenar ve iç parlama canlı ayarlanır; en kötü durum kontrastı, CSS ve Tailwind çıktısı anında güncellenir.
- **Zemin:** Işık lekeleri `radial-gradient` ile çizilir (`filter: blur` yok), kaydırmada farklı hızlarda kayarak camın altından geçer.
- **Bileşenler:** `GlassCard`, `GlassNavbar` (kaydırınca yoğunlaşan şeffaf gezinme), `GlassButton`, `Icon3D` (parlak hacimli ikon), yerel `<dialog>` ile cam modal, `useTilt` (fareyle eğilme ve parlama).
- **Mobil (Madde 17):** 768px altında blur değerleri yaklaşık yarıya iner (24 → 14, 40 → 20), doygunluk %140.
- **Erişilebilirlik (Madde 18):** `prefers-reduced-transparency` ve sayfadaki "Saydamlığı azalt" anahtarı blur'u kaldırıp camı opaklaştırır; `backdrop-filter` desteklemeyen tarayıcılarda cam yoğunlaşır; canlı görsel üstündeki metin için opak degrade katman (`.glass-scrim`); hareket azaltmada eğilme, süzülme ve zemin kayması durur.

## Yazı tipleri

Hepsi OFL lisanslı, `@fontsource-variable` paketlerinden yalnızca Latin ve Latin Genişletilmiş alt kümeleriyle yüklenir: Inter (Stil 001 ve 003), Lora ve Plus Jakarta Sans (Stil 002), Geist ve Geist Mono (Stil 004; `₺` glifi olmadığı için tutarlar "TL" ile yazılır). Lisanslı Helvetica Now ya da Neue Haas Grotesk kullanmak için `src/swiss/swiss.css` içindeki `@font-face` bloklarını ve `--font-sans` sırasını değiştirin.
