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
| 007 · Claymorphism | `/stil/007/` | `src/clay/` | `tokens/clay.tokens.json` |
| 008 · Isometric 3D | `/stil/008/` | `src/iso/` | `tokens/iso.tokens.json` |
| 009 · Low Poly | `/stil/009/` | `src/lowpoly/` | `tokens/lowpoly.tokens.json` |
| 010 · Cyberpunk | `/stil/010/` | `src/cyber/` | `tokens/cyber.tokens.json` |

```bash
npm install
npm run dev        # http://localhost:5173  → katalog, /stil/001/, /stil/002/, /stil/003/, /stil/004/, /stil/005/, /stil/006/, /stil/007/, /stil/008/, /stil/009/, /stil/010/
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
stil/007/index.html      Claymorphism giriş noktası
stil/008/index.html      Isometric 3D giriş noktası
stil/009/index.html      Low Poly giriş noktası
stil/010/index.html      Cyberpunk giriş noktası
src/shared/              stiller arası ortak yardımcılar (cx, useTheme)
src/swiss/               swiss.css (tema) · components/ · sections/
src/soft/                soft.css (tema) · components/ · sections/
src/corporate/           corporate.css (tema) · ui/ (shadcn) · views/ · charts/ · data/
src/glass/               glass.css (tema) · components/ · sections/
src/neu/                 neu.css (tema) · components/ · sections/
src/ambient/             ambient.css (tema) · components/ · hooks/ · sections/
src/clay/                clay.css (tema) · components/ · hooks/ · sections/
src/iso/                 iso.css (tema) · lib/ (projeksiyon) · components/ · sections/
src/lowpoly/             lowpoly.css (tema) · three/ (R3F sahneleri) · assets/ (GLB, .webp) · lib/ · sections/
src/cyber/               cyber.css (tema) · components/ (CyberCard, CyberButton, CyberNav, CyberHUD) · hooks/ · sections/
scripts/lowpoly-glb.mjs  Stil 009'un GLB modellerini üretir
tokens/                  W3C DTCG token dosyaları (Figma / Tokens Studio)
```

Vite çok sayfalı derlenir (`vite.config.ts` → `build.rollupOptions.input`). Stil 009 ayrı bir TypeScript projesidir (`tsconfig.lowpoly.json`): React Three Fiber JSX'e global three.js öğeleri eklediği için diğer stillerin tiplerinden yalıtılır. Her stilin CSS dosyası `@import 'tailwindcss' source(none)` ve `@source '.'` ile yalnızca kendi klasörünü tarar; böylece temalar birbirine sızmaz. `base: './'` sayesinde `dist/` herhangi bir alt dizinden servis edilebilir.

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

## Stil 007 · Claymorphism

Parlak pastel renkler ve oyun hamuru gibi şişirilmiş, mat kil bileşenler. Neumorphism'in aksine hacmi kontrast değil gölge üretir; metin her dolguda koyu mor mürekkeptir.

- **Effects/ClayVolume (Madde 7 · 12 · 15):** Üç gölge tek bir hacim biriminden (d) türer: drop `(2d, 2d, 4d)`, iç koyu `(−d, −d, 2d)`, iç açık `(d, d, 2d)`. d = 4px tanımdaki satırı birebir verir (`8px 8px 16px rgba(0,0,0,.1), inset -4px -4px 8px rgba(0,0,0,.1), inset 4px 4px 8px rgba(255,255,255,.8)`); bu satır Tailwind'de `shadow-clay` olarak da durur. `.clay-sm/md/lg/xl` d = 2/4/6/8. `--d` `@property` ile kayıtlı olduğu için basılma ve geri şişme gölgede de yumuşak geçer.
- **Hacim laboratuvarı:** d, köşe yarıçapı, ton ve basılı durum canlı ayarlanır; Figma efekt tablosu (X, Y, Blur, renk), CSS ve Tailwind çıktısı tarayıcının çözdüğü renklerle anında güncellenir.
- **Bileşenler (Madde 11 · 14):** `ClayCard` (`tone`, `volume`, `float`), `ClayButton` (hap; basınca d %35'e iner ve yassılaşır, Enter da aynı tepkiyi verir), `ClayToggle` (gömülü iz, şişkin topuz, onay/çarpı işareti), `ClayIcon` (Phosphor dolu ikon + aynı üç gölgeyi ikonun biçimine uygulayan SVG filtresi), gömülü kuyu (`.clay-well`), kil kaydırıcı. Havada süzülen kurs kartları basınca söner, seçilen kart sönük kalır.
- **Uygulama (Madde 10):** Çalışan bir kelime dersi (5 soru, 3 can, XP, odak yönetimi) ve hedefe para biriktiren kumbara (hedef seçimi, hızlı ekleme, geri al). İkisi de kurgusaldır.
- **Hareket (Madde 16):** Giriş animasyonu ezilir, uzar ve yerine oturur (820ms, 90ms kademe). Yay eğrisi CSS `linear()` ile (k=300, c=16, m=1; %19,4 aşma, 600ms). Süzülme ve giriş yalnızca `transform` kullanır.
- **Mobil (Madde 17):** 640px altında d %60'a iner (xl ≈ md, md ≈ sm): gölge taşması 48px'ten 29px'e düşer, boyanan bulanık alan yaklaşık üçte bire iner.
- **Erişilebilirlik ve Dark Cyber-Clay (Madde 18):** Ana metin zeminde 13,84:1, en koyu pastelde (pembe) 6,19:1; mor düğmede beyaz 5,8:1. Koyu varyantta açık iç gölge neon ışığa döner (pembe, mor ya da camgöbeği seçilebilir); metin 14,75–17,11:1, neon vurgu kilde en az 6,65:1. Kil kenarının zeminle farkı yalnızca 1,06–2,24:1 olduğundan "Kenarlı mod" (ve `prefers-contrast: more`) her kile 2px mürekkep kenar ekler; zorunlu renk modunda da kenar çizilir. Hedefler en az 44px, gövde 17px/500. Hareket azaltmada giriş, süzülme ve zıplama kapanır.

## Stil 008 · Isometric 3D

Ortografik projeksiyon: kaçış noktası yok, çizgiler paralel, nesneler 30° izometrik ızgaraya oturur. Her nesnenin üç tonu var: üst aydınlık, sol orta, sağ karanlık. Arayüz düzdür; izometri yalnızca illüstrasyon ve veri görselindedir.

- **Projeksiyon (Madde 3 · 12 · 15):** CSS'te `rotateX(θ) rotateZ(-45deg)` ve `transform-style: preserve-3d`; SVG çizimlerde aynı matrisin izdüşümü (`src/iso/lib/iso.ts`): x' = (x + y)·√½, y' = (y − x)·√½·cos θ − z·sin θ. Varsayılan θ = 54,7356° (arctan √2) gerçek izometridir: çizgiler 30°, üç eksen 0,816 oranında kısalır. Tanımdaki `rotateX(60deg)` satırı 2:1 oyun izometrisini verir (çizgiler 26,57°); sayfadaki seçiciyle bütün sahneler, sayfa arka planındaki ızgara ve CSS 3D kaplar birlikte değişir.
- **Figma (Madde 12 · 13):** 30° ızgara şeması, Auto Layout'u bozmadan düzlemi yatıran CSS dönüşümü (kaydırıcıyla) ve Skew yöntemi: üst `rotate(-30deg) skewX(30deg) scaleY(0.86603)`, sol `skewY(30deg) scaleX(0.86603)`, sağ `skewY(-30deg) scaleX(0.86603)`; yüzlerin içindeki grafik, tablo ve kartlar düz yerleşimde kalır. Tokenlar: `Grid/Isometric`, `Color/SurfaceTop`, `Color/SurfaceLeft`, `Color/SurfaceRight`, `Shadow/Directional`.
- **Renk (Madde 4):** Beş renk × üç ton (mavi `#60A5FA / #3B82F6 / #1D4ED8` tanımdaki gibi) ve nötr arduvaz plakalar. Etiket kuralı: üst yüzde koyu mürekkep (en az 6,56:1), sağ yüzde beyaz (en az 5,02:1), sol yüzde yazı yok.
- **Gölge ve doku (Madde 7 · 8):** Sert, bulanıksız, tek yönlü uzun gölgeler: ışık (−x, −y) yönünden gelir, gölge taban ile kaydırılmış tavanın dışbükey zarfıdır ve üzerinde durduğu plakaya kırpılır. Z ekseninde süzülen saydam cam katmanlar. Doku yalnızca 1px izometrik ızgara.
- **Bileşenler (Madde 11 · 14):** `IsometricContainer` (CSS 3D düzlem; izdüşümün kapladığı s·√2 × s·√2·cos θ alanı yerleşimde ayırır), `LayeredCard` (translateZ ile süzülen katman ve zemine düşen sert gölge), SVG tarafında `IsoScene`, `IsoBlock`, `IsoShadow`, `IsoGround`. Parçalara ayrılmış (exploded) mimari görünümü ayrışma kaydırıcısıyla; izometrik sütun grafiği ve tablo görünümü; projeksiyonla çizilmiş ikonlar (sunucu, veritabanı, paket, kripto, lojistik, analitik).
- **Uygulama (Madde 10):** Veri merkezi paneli: bölge ve ölçüt filtreleri, izometrik dolap haritası (yükseklik yük, renk durum), KPI kartları ve düz tablo. Veriler kurgusaldır.
- **Hareket (Madde 16):** Sıralı inşa: bloklar alttan üste, aynı katta uzaktan yakına, 90ms arayla düşer ya da yükselir (640ms); sütunlar sırayla yükselir.
- **Mobil (Madde 17):** 768px altında izometrik sahneler ve CSS 3D katmanlar gizlenir, aynı katmanlar düz liste ya da dikey yığın olarak gösterilir.
- **Erişilebilirlik (Madde 18):** Form öğeleri hiçbir zaman dönüşüm almaz; izometrik form yalnızca "yapmayın" örneğidir (`inert`, `aria-hidden`). Düz form izometrik sahneyi yönetir. Her veri sahnesinin kısa açıklaması ve düz tablosu var; durum renkleri ikon ve etiketle birlikte. Metin 17,06:1 (açık) · 17,19:1 (koyu), form kenarı 4,76:1 · 3,73:1.

## Stil 009 · Low Poly

Yüzey detayı en aza indirilmiş, düz gölgeli üçgenlerle kurulan nesneler: dijital origami. Varsayılan tema koyu "Derin Gece" (`#101820`); açık varyant "Gündüz".

- **3B (Madde 14 · 16):** three.js ve React Three Fiber. Hero'da düşük poligon arazi (seyrek düzlem, `toNonIndexed` ile yüz başına normal, yüksekliğe göre köşe rengi) ve imleci izleyen GLB kristal; kamera imlece göre paralaks yapar. Vitrinde dört GLB model (kristal, kağıt uçak, kaya, ağaç), renk varyantı, sürükleyerek ve düğmelerle döndürme. Tıklamada modeller parçalanır: her üçgen normali boyunca savrulur ve kendi merkezinde döner, normali de döndüğü için düz ışık korunur.
- **GLB modeller:** `node scripts/lowpoly-glb.mjs` bağımlılıksız ve sabit tohumla üretir: paylaşımsız köşeler, yüz başına normal, `COLOR_0` köşe rengi, mat malzeme (metalik 0, pürüzlülük 1). Kristal 32, uçak 5, kaya 80, ağaç 54 üçgen; toplam 22 KB.
- **Yüz gölgelendirme (Madde 7 · 11):** 2B çokgen zeminler SVG'dir; her üçgenin normali 3B noktalardan hesaplanır, tonu `taban × (0,34 + 0,66 × max(0, n·L))`. Işık yönü ve yüksekliği canlı ayarlanır. Az yüzlü küre örneği poligon sayısını ve düz/yumuşak gölgelendirme farkını gösterir.
- **Maskeler (Madde 12 · 13 · 15):** `Shape/PolygonMask` varyantları (kristal, kalkan, kırık, ok, bayrak); noktaları %5'lik ızgaraya kilitli düzenleyici (sürükleme ve ok tuşları) CSS `clip-path` üretir. Düğmelerde şekil `::before` katmanındadır; düğme kırpılmadığı için odak halkası görünür kalır. Maskeli görseller üzerine gelince aynı nokta sayısındaki poligona geçiş yapar.
- **İkonlar (Madde 9):** üç tonlu üçgenlerden kurulu origami ikonlar (kağıt uçak, kristal, dağ, tilki, yaprak, kalp).
- **Mobil ve performans (Madde 17):** 768px altında, veri tasarrufunda ya da WebGL yoksa sahne yüklenmez; yerine sahneden alınmış `.webp` kare gelir (hero 13 KB). three.js parçası (960 KB, gzip 256 KB) tembel yüklenir: bu durumda hiç indirilmez; kullanıcı "3B sahneyi yükle" ile açabilir. Ekran dışındaki sahne çizilmez (`frameloop="never"`).
- **Erişilebilirlik (Madde 18):** Metin çokgen zeminin doğrudan üstünde durmaz; cam panelde (koyu %78, açık %82 opaklık, 14px bulanıklık). Doğrudan zeminde en kötü durum 2,43:1, cam panelde 11,05:1; sayfadaki kaydırıcı panel opaklığıyla en kötü durum kontrastını gerçek yüz renkleri üzerinden hesaplar. Canvas ekran okuyucudan gizlidir, vitrinin açıklaması ve her etkileşimin düğmesi vardır; sahne durdurulabilir (WCAG 2.2.2), hareketi azaltta model dönmez ve imleci izlemez.

## Stil 010 · Cyberpunk

Yüksek teknolojinin distopik, asi sokak kültürüyle birleştiği tasarım dili: karanlık zemin, agresif neon vurgular, tarama çizgileri, HUD panelleri ve glitch. Varsayılan tema koyu "Gece" (`#050509`); nadir açık varyant "Gündüz".

- **Renk (Madde 4):** `#050509` zemin (saf siyah değil), camgöbeği `#00F0FF` ana vurgu, macenta `#FF00A8` uyarı ve ikincil eylem, mor `#7A00FF` yalnız parlama ve ızgara (zeminde 3,17:1, metin değil), neon yeşil `#B6FF00` çevrimiçi/başarı.
- **Şekil ve derinlik (Madde 6 · 7):** Kesik köşeler `clip-path` ile `::before` (çerçeve) ve `::after` (dolgu) katmanlarında; öğenin kendisi kırpılmaz, odak halkası tam görünür. Geleneksel gölge yok: derinlik `drop-shadow` neon parlaması ve zemine düşen yansımadır.
- **Doku (Madde 8):** CRT tarama çizgileri, SVG gürültü ve çizik deseniyle metal aşınması; üçü de metnin arkasında ve sayfada tek tek kapatılabilir. Ekrandan yavaşça süzülen tarama çizgisi (9 sn).
- **Bileşenler (Madde 11 · 12 · 14):** `CyberCard` (etiket Auto Layout'un dışında, çerçevenin üstünde sekme), `CyberButton` (primary · magenta · ghost × Default · Glitch · Hover), `CyberInput` (hata anında macenta çerçeve ve kısa sarsıntı, odak kaybolmaz), `NeonProgress` (24 bölümlü neon çubuk), `CyberNav`, `CyberHUD` (köşe parantezli panel, canlı saat), `Radar` ve sekiz HUD ikonu (1,25px çizgi, köşe işaretli).
- **Uygulama (Madde 10):** Komut alan terminal (`yardım`, `tara`, `durum`, `kilitle T-0x`, `temizle`; ok tuşlarıyla geçmiş) ve ona bağlı radar ile hedef listesi; erişim kodu formu (`NEON-2077`). Veriler kurgusaldır.
- **Figma ve Tailwind (Madde 13 · 15):** `Style/Cyberpunk/Colors/{Base, Cyan, Magenta, Purple, Green}`, `Effects/NeonGlow/{sm, md, lg}`. Tanımdaki `bg-[#050509] text-[#00F0FF] border-[#FF00A8] drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]` satırı sayfada birebir kullanılır; tema uyumlu bileşenler değişkenlerle çalışır.
- **Hareket (Madde 16):** Glitch (900 ms, üzerine gelince ya da odakta bir kez), tarama, arızalı neon titreşimi (4 sn'de iki kısa sönme), nabız (2,6 sn), radar taraması ve akan perspektif ızgara. Efekt düzeyi: Otomatik · Tam · Sade · Kapalı (`data-fx`, `localStorage`).
- **Mobil (Madde 17):** 768px altında efekt düzeyi kendiliğinden "Sade"ye iner: glitch ve kayan tarama durur, ızgara yavaşlar. HUD köşe parantezleri ve cetvel tek 2px neon çizgiye döner; kart köşe kesimi 26px'ten 16px'e iner; varyant tablosu satır başına bir gruba dönüşür.
- **Erişilebilirlik (Madde 18):** En kötü yüzeyde metin 17,54:1, ikincil 8,29:1, camgöbeği 13,29:1, macenta 5,19:1. Gündüz varyantı beyaz zemine koyu mor neon: metin 17,84:1, birincil mor 11,10:1, macenta 6,35:1, yeşil 6,28:1; parlama %30–35'e iner, aşınma kapanır. Saniyede 3'ten az yanıp sönme (WCAG 2.3.1), titreşimde en düşük opaklık %55; hareketi azalt tercihinde hiçbir animasyon oynamaz; FX seçicisi süzülen taramayı her an durdurur (WCAG 2.2.2). Terminal çıktısı `role="log"`, form hataları alana bağlı ve `role="alert"`.

## Yazı tipleri

Hepsi OFL lisanslı, `@fontsource-variable` paketlerinden yalnızca Latin ve Latin Genişletilmiş alt kümeleriyle yüklenir: Inter (Stil 001 ve 003), Lora ve Plus Jakarta Sans (Stil 002), Geist ve Geist Mono (Stil 004; `₺` glifi olmadığı için tutarlar "TL" ile yazılır), Nunito (Stil 005), Sora (Stil 006), Baloo 2 ve Quicksand (Stil 007; Fredoka ğ, ş ve İ içermediği için başlıkta Baloo 2 seçildi), Manrope ve IBM Plex Mono (Stil 008; Space Mono `₺` içermediği için Plex Mono seçildi), Space Grotesk ve Inter (Stil 009), Rajdhani, Orbitron, Space Grotesk ve IBM Plex Mono (Stil 010; Rajdhani ve Plex Mono sabit ağırlıklı `@fontsource` paketlerinden gelir; Orbitron ğ, ş ve İ içermediği için yalnız Latin alt kümesiyle yüklenir ve yalnız rakam, kod ve saatlerde kullanılır, başlıklar Rajdhani). Lisanslı Helvetica Now ya da Neue Haas Grotesk kullanmak için `src/swiss/swiss.css` içindeki `@font-face` bloklarını ve `--font-sans` sırasını değiştirin.
