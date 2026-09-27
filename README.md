# webdetest · Stil kataloğu

Web tasarım stilleri için canlı referans sayfaları. Her stil, anlattığı kurallarla dizilmiş ayrı bir sayfadır ve kendi tokenlarına, bileşenlerine ve Tailwind CSS v4 temasına sahiptir.

| Stil | Sayfa | Kaynak | Tokenlar |
| --- | --- | --- | --- |
| 001 · Swiss Style | `/stil/001/` | `src/swiss/` | `tokens/swiss.tokens.json` |
| 002 · Soft Minimalism | `/stil/002/` | `src/soft/` | `tokens/soft.tokens.json` |
| 003 · Corporate Modern | `/stil/003/` | `src/corporate/` | `tokens/corporate.tokens.json` |
| 004 · Glassmorphism | `/stil/004/` | `src/glass/` | `tokens/glass.tokens.json` |
| 005 · Neumorphism | `/stil/005/` | `src/neu/` | `tokens/neu.tokens.json` |
| 006 · Ambient UI | `/stil/006/` | `src/ambient/` | `tokens/ambient.tokens.json` |

```bash
npm install
npm run dev        # http://localhost:5173  → katalog, /stil/001/, /stil/002/, /stil/003/, /stil/004/, /stil/005/, /stil/006/
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
stil/005/index.html      Neumorphism giriş noktası
stil/006/index.html      Ambient UI giriş noktası
src/shared/              stiller arası ortak yardımcılar (cx, useTheme)
src/swiss/               swiss.css (tema) · components/ · sections/
src/soft/                soft.css (tema) · components/ · sections/
src/corporate/           corporate.css (tema) · ui/ (shadcn) · views/ · charts/ · data/
src/glass/               glass.css (tema) · components/ · sections/
src/neu/                 neu.css (tema) · components/ · sections/
src/ambient/             ambient.css (tema) · components/ · hooks/ · sections/
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

## Stil 005 · Neumorphism

Zeminle aynı renkte bileşenler; biçimi yalnızca iki gölge verir: sol üstte açık yansıma, sağ altta koyu gölge. Tanımdaki değerler (`9px 9px 16px rgb(163 177 198 / .5)`, `-9px -9px 16px rgb(255 255 255 / .5)`) gri tabanın varsayılanıdır.

- **Yüzeyler:** `.neu-raised` (kabartma, iki dış gölge), `.neu-inset` (çökme, iki iç gölge), `.neu-convex` / `.neu-concave` (yönlü degrade), `.neu-press` (Default → Pressed: 80ms çökme, bırakınca 500ms yay).
- **Color/MonochromeBase:** gri `#E0E5EC`, mavi `#DCE4F2`, bej `#EBE5DC`; koyu modda grafit `#2B2F36`. Taban değişince iki gölge de değişir.
- **Bileşenler:** `NeumorphButton` (daire, hap, köşeli; açma/kapama durumunda vurgu rengi + ışık noktası + `aria-pressed`), `SoftSlider` (dairesel; sürükleme ve klavye: oklar, PageUp/PageDown, Home/End), doğrusal kaydırıcı (yerel `input[type=range]`), anahtar, segment seçici, gömülü metin alanı.
- **Gölge laboratuvarı:** Mesafe, yayılma, güç ve yarıçap canlı ayarlanır; CSS, Tailwind çıktısı ve sınır kontrastı anında güncellenir.
- **Uygulama:** akıllı ev termostatı (hero), müzik çalar, çalışan hesap makinesi (klavye destekli).
- **Hareket:** Yay eğrisi CSS `linear()` ile üretildi (k=300, c=20, m=1; %10,8 aşma, 500ms) ve `--spring` tokenında durur.
- **Mobil (Madde 17):** Gölge taşması mesafe + yayılma kadardır (9 + 16 = 25px); bu yüzden kabarık bileşenler arası en az 24px. 640px altında gölgeler 6/12px'e, aralık 16px'e iner.
- **Erişilebilirlik (Madde 18):** Metin her tabanda AA'yı geçer (ana 9,63:1, ikincil 5,13:1, vurgu 4,97:1). Bileşeni yalnızca gölge tanımladığı için sınır kontrastı 1,29:1 kalır (WCAG 1.4.11 için 3:1 gerekir). Erişilebilir mod her bileşene 1px kenar ekler (`#737D91`, 3,27:1); işletim sisteminde yüksek kontrast açıksa kendiliğinden devreye girer. Odakta 2px vurgu renkli çerçeve.

## Stil 006 · Ambient UI

Sınırları eriyen, sürekli akan atmosferik arayüz. Varsayılan tema koyu "Gece" (neon aurora); açık varyant "Şafak" (doygun pastel).

- **Zemin (`<AmbientBackground>`):** Beş radyal leke, 38–60 sn'lik sonsuz ve yön değiştiren döngülerle yalnızca `transform` ile kayar; tarayıcı katmanı bir kez çizip GPU'da taşır.
- **Mesh (`<GradientMesh>`, Madde 15):** Dört `radial-gradient`; merkezleri `@property` ile kayıtlı değişkenlerdir ve `@keyframes mesh-flow` ile yer değiştirir. `palette="aurora1" | "aurora2"` (Figma: `Gradient/Aurora1`, `Gradient/Aurora2`). Figma karşılığı, Layer Blur uygulanmış dört asimetrik vektör; sayfada blur açılıp kapatılabilir ve katmanlar ayrılabilir.
- **Gölge yerine parıltı (`Effects/GlowBorder`):** `.glow-border` dönen konik degradeyi maskeyle 1,5px halkaya indirir, bulanık kopyası arkada parlar. `<GlowCard>` kenar ışığı imleci izler.
- **Sıvı bileşenler:** `LiquidSpinner` (SVG gooey filtresi: bulanıklık + alfa eşiği), `MorphOrb` (bekliyor / dinliyor / düşünüyor durumlarına göre hızlanan `border-radius` döngüsü), holografik ikonlar (dolgu sayfadaki animasyonlu degradeden) ve zemine uyan ikonlar (`mix-blend-mode`).
- **Uygulama:** Akış hâlinde yanıt yazan örnek asistan sohbeti ve istemden tohum türetip aurora kompozisyonu dizen üretici. İkisi de kurgusaldır; model çağrılmaz.
- **Hareket ve pil (Madde 16·17):** `<html data-motion>` üç düzey alır: canlı (5 leke), sade (3 leke, yarı hız, dış parıltı sabit), durdur (kare donar, yükleme göstergesi döner). Otomatik seçim: hareketi azalt → durdur; veri tasarrufu, pil ≤ %20 ve şarjda değil (Battery API varsa) ya da 768px altı ekran → sade. Ekrandan çıkan mesh ve küreler `IntersectionObserver` ile durur, çünkü `@property` animasyonu her kare yeniden boyanır. Başlıktaki düğme hareketi tek dokunuşla durdurur (WCAG 2.2.2).
- **Okunurluk (Madde 18):** En kötü durum, en parlak aurora renginin metnin tam arkasına geldiği andır. Koyu temada koruyucusuz beyaz metin 1,81:1'e düşer; metnin arkasına kenarları 40px'te eriyen %62 koyu katman (`.scrim-fade`, `<Scrim>`) konur: ana metin 8,49:1, ikincil 5,57:1. Açık temada mürekkep katmansız 9,94:1, %30 beyaz katmanla ikincil metin 5,8:1. Sayfadaki kaydırıcı katman gücünü değiştirip kontrastı canlı hesaplar. İnce yazı yalnızca büyük boyutta; gövde 300, küçük etiketler 400 ağırlıkta.

## Yazı tipleri

Hepsi OFL lisanslı, `@fontsource-variable` paketlerinden yalnızca Latin ve Latin Genişletilmiş alt kümeleriyle yüklenir: Inter (Stil 001 ve 003), Lora ve Plus Jakarta Sans (Stil 002), Geist ve Geist Mono (Stil 004; `₺` glifi olmadığı için tutarlar "TL" ile yazılır), Nunito (Stil 005), Sora (Stil 006). Lisanslı Helvetica Now ya da Neue Haas Grotesk kullanmak için `src/swiss/swiss.css` içindeki `@font-face` bloklarını ve `--font-sans` sırasını değiştirin.
