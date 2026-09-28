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
| 011 · Holographic | `/stil/011/` | `src/holo/` | `tokens/holo.tokens.json` |
| 012 · Terminal / Hacker UI | `/stil/012/` | `src/term/` | `tokens/term.tokens.json` |
| 013 · Generative UI | `/stil/013/` | `src/gen/` | `tokens/gen.tokens.json` |
| 014 · Conversational UI | `/stil/014/` | `src/chat/` | `tokens/chat.tokens.json` |
| 015 · Neural Aesthetic | `/stil/015/` | `src/neural/` | `tokens/neural.tokens.json` |
| 016 · Neo-Brutalism | `/stil/016/` | `src/brut/` | `tokens/brut.tokens.json` |
| 017 · Maximalism | `/stil/017/` | `src/maxi/` | `tokens/maxi.tokens.json` |
| 018 · Anti-Design | `/stil/018/` | `src/anti/` | `tokens/anti.tokens.json` |

```bash
npm install
npm run dev        # http://localhost:5173  → katalog, /stil/001/, /stil/002/, /stil/003/, /stil/004/, /stil/005/, /stil/006/, /stil/007/, /stil/008/, /stil/009/, /stil/010/, /stil/011/, /stil/012/, /stil/013/, /stil/014/, /stil/015/, /stil/016/, /stil/017/, /stil/018/
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
stil/011/index.html      Holographic giriş noktası
stil/012/index.html      Terminal / Hacker UI giriş noktası
stil/013/index.html      Generative UI giriş noktası
stil/014/index.html      Conversational UI giriş noktası
stil/015/index.html      Neural Aesthetic giriş noktası
stil/016/index.html      Neo-Brutalism giriş noktası
stil/017/index.html      Maximalism giriş noktası
stil/018/index.html      Anti-Design giriş noktası
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
src/holo/                holo.css (tema) · components/ (CommandCenter, HoloPanel, DataGrid, HoloCanvas) · charts/ · lib/ (3B çizici, veri) · sections/
src/term/                term.css (tema) · components/ (TerminalShell, Kbd, LogStream, AsciiTable, CommandPalette) · lib/ (ascii, veri) · sections/
src/gen/                 gen.css (tema) · components/ (ToolCall, ToolResult, AICitation, AISources, Markdown) · results/ · lib/ (markdown, senaryolar) · sections/
src/chat/                chat.css (tema) · components/ (AIChat, AIPromptBox, AIMessage, AIVoiceInput) · widgets/ (yanıt içi örnekler) · lib/ (konular, dosya analizi) · hooks/ · host/
src/neural/              neural.css (tema) · components/ (AIAgentTimeline, AIModelSelector, NeuralGraph, PanZoom, ProcessorTree) · charts/ · lib/ (ajan planı, modeller, eğitim, veri seti) · sections/
src/brut/                brut.css (tema) · components/ (SolidButton, BrutalistCard, Marquee, Tag) · sections/ · sections/uses/ (mağaza, geliştirici, ajans, Web3) · lib/
src/maxi/                maxi.css (tema) · components/ (Sticker, Shapes, Paper, CursorFollower, FlyingBadges, Scene) · three/ (R3F nesneleri) · hooks/ (useScatter, useMagnetic, useScrollFx) · lib/ (serbest değişkenler, kolaj üreteci, veri) · sections/
src/anti/                anti.css (bilerek bozuk, derleyiciden geçmez) · components/ (Kayan: <marquee>) · lib/ (ayarlar, erişilebilirlik iskeleti, veri) · sections/
scripts/lowpoly-glb.mjs  Stil 009'un GLB modellerini üretir
tokens/                  W3C DTCG token dosyaları (Figma / Tokens Studio)
```

Vite çok sayfalı derlenir (`vite.config.ts` → `build.rollupOptions.input`). Stil 009 ve Stil 017 ayrı TypeScript projeleridir (`tsconfig.lowpoly.json`, `tsconfig.maxi.json`): React Three Fiber JSX'e global three.js öğeleri eklediği için diğer stillerin tiplerinden yalıtılır. Her stilin CSS dosyası `@import 'tailwindcss' source(none)` ve `@source '.'` ile yalnızca kendi klasörünü tarar; böylece temalar birbirine sızmaz. Stil 018 bu kuralın tek istisnası: Tailwind kullanmaz, `anti.css` dosyası `?raw` ile metin olarak alınıp yazıldığı gibi sayfaya eklenir. `base: './'` sayesinde `dist/` herhangi bir alt dizinden servis edilebilir.

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

## Stil 011 · Holographic

Cyberpunk'ın karanlık ve kirli yapısının aksine laboratuvar temizliğinde, ütopik bir bilimkurgu: boşlukta süzülen yarı saydam cam paneller, uçuşan veri parçacıkları, açık mavi parlamalar. Varsayılan tema koyu "Gece" (`#090E17`); açık varyant "Laboratuvar".

- **Renk ve yazı (Madde 4 · 5):** Gece mavisi zemin, camgöbeği `#06B6D4` ve elektrik mavisi `#3B82F6` vurgu. Metin yarı saydam beyaz (%92, ikincil %68). Yazılar: Audiowide (geniş görünür başlık), Exo 2 (ince başlık, gövde, sabit genişlikli rakamlar), Chakra Petch (etiket ve arayüz), IBM Plex Mono (günlük ve kod).
- **Cam ve derinlik (Madde 3 · 6 · 7 · 12):** `HoloPanel` = arka plan bulanıklığı (16px, doygunluk %140) + opak koruyucu gradyan + cam tonu gradyanı + 1px ince kontur + üç iç gölge (üst kenar ışığı, alt kostik, iç parıltı) + geniş, hafif dış parlama. "Katman anatomisi" demosunda her katman ayrı ayrı açılıp kapanır. Yuvarlatılmış köşeler, sol üstte asimetrik bir ışık işareti, havada asılı 250°'lik yay göstergeler.
- **Doku ve ikon (Madde 8 · 9):** Kusursuz cam, akrilik, üzerinden ışık bandı geçen hologram yansıması ve ince nokta ızgara zemin. On iki içi boş, parlayan kontur ikon (1,5px).
- **Bileşenler (Madde 11 · 14):** `CommandCenter` shadcn/ui Command gibi cmdk ve Radix Dialog üzerine kurulu, ekranı kaplayan arama katmanı: Ctrl/⌘ + K ya da "/" ile açılır, Türkçe harfsiz yazımı da bulur ("ag" → "Ağ"), eylemler sayfanın gerçek durumunu değiştirir (model etkinleştir, çıkarımı başlat, aktarımı duraklat, tema, katman, hareket). `DataGrid` shadcn data-table düzeninde TanStack Table: sıralanabilir başlıklar (`aria-sort`), arama, durum filtresi, satır seçimi ve toplu yükle/kaldır; 1024px altında satırlar karta dönüşür. `HoloCanvas` bağımlılıksız 3B tel kafes çizici (ikosfer, yörünge halkaları, tensör kafesi, gömme bulutu).
- **Uygulama (Madde 10):** Yerel LLM çıkarım hattı (tokenleştirici → ön doldurma → kod çözme → detokenleştirici; yanıt token token akar, hız ve ilk token süresi ölçülür), model dizini (VRAM ve disk kullanımı) ve 10GbE aktarım izleyici. Orion 70B'nin indirmesi bitince dizinde "Diskte" olur. Modeller, ölçümler ve ağ değerleri kurgusaldır.
- **Grafikler (Madde 11):** Son 60 saniyenin aktarım hızını gösteren alan grafiği (artı imleç, ipucu, sağ uçta doğrudan etiket) ve iki modeli altı eksende karşılaştıran radar. İkisinin de lejantı ve tablo görünümü var. Seri renkleri dataviz doğrulayıcısından geçti: camgöbeği ile elektrik mavisi normal görüşte yalnızca ΔE 12,3 ayrıştığı için B serisi çivit mavisidir (`#0891B2` / `#6366F1`: renk körlüğünde ΔE 13, normal görüşte 17, iki temada da zeminde ≥ 3:1).
- **Tailwind (Madde 13 · 15):** `Color/HoloBlue`, `Effects/GlassBlur`, `Border/ThinGlow` ve diğerleri `tokens/holo.tokens.json` içinde. Tanımdaki `bg-cyan-900/10 backdrop-blur-md border border-cyan-400/30 text-cyan-50 shadow-[0_0_15px_rgba(6,182,212,0.2)]` satırı sayfada birebir kullanılır; bunun için temaya Tailwind'in kendi `cyan-50/400/900` adımları eklendi.
- **Hareket (Madde 16):** Yavaşça dönen 3B nesneler (0,14–0,22 rad/sn), akarak gelen veri satırları ve tokenlar, tıklamada basılan noktadan yayılan dalgalanma (klavyede ortadan), süzülen göstergeler. Ekran dışındaki kanvaslar çizilmez. "Hareket" ayarı (Oto · Açık · Kapalı) hareketi azalt tercihini izler; kapalıyken nesneler sabit açıda durur, yanıt tek seferde gelir.
- **Mobil (Madde 17):** 768px altında "tekil katman": paneller bulanıklıksız opak yüzeye döner, iç içe cam düzleşir, dekoratif süzülen paneller gizlenir, parçacık sayısı üçte bire iner. Yalnız üst çubuk ve komut katmanı bulanıklık kullanır. Ayar elle de seçilebilir.
- **Erişilebilirlik (Madde 18):** Hologramın önündeki metnin arkasında opak koruyucu gradyan var; panellerde bu gradyan camın kendisi. En kötü noktada (parlamanın önünde) gradyansız mavi metin 3,86:1'e düşer, gradyanla 7,25:1 olur; sayfadaki anahtar iki durumu karşılaştırır. Zeminde metin 16,32:1, ikincil 9,09:1; Laboratuvarda 14,85:1 ve 6,73:1. Durum hiçbir yerde yalnız renkle verilmez; grafiklerin tablo görünümü, 3B görüntüleyicinin metin açıklaması ve klavye kontrolü var; akan yanıt `aria-busy` ile işaretlenir, bitince kısa bir özet duyurulur.

## Stil 012 · Terminal / Hacker UI

Tasarımı aradan çıkarıp doğrudan veriye, koda ve saf performansa odaklanan arayüz: mühendislik araçlarının ve sistem yönetiminin en çıplak hâli. Sıfır dekorasyon, mutlak fonksiyon.

- **Renk ve tema (Madde 4 · 18):** Saf siyah `#000000` zemin; terminal yeşili `#00FF41` (15,38:1), kehribar `#FFB000` (11,46:1), saf beyaz `#FFFFFF` (21:1). Dört tema: yeşil, kehribar, beyaz ve açık terminal Solarized (kirli beyaz `#FDF6E3` zemin, koyu gri `#073642` metin 12,05:1). Sistem açık temadaysa Solarized açılır.
- **Yazı ve ızgara (Madde 5 · 12):** Yalnız monospace: JetBrains Mono, Fira Code, Source Code Pro (sayfadan seçilir), Consolas yedek. Tek boyut, tek satır yüksekliği; başlıklar da 1em, hiyerarşiyi kalınlık, büyük harf ve ters video kurar. Izgara karakter hücresidir: Tailwind aralık birimi `1ch` (`p-4` dört karakter), dikey aralıklar `lh` katları; "ızgarayı çiz" 1ch × 1lh kaplamasını gösterir. Bağlaçlar (ligature) kapatılabilir; ASCII tablo ve çizimlerde her zaman kapalı.
- **Şekil, derinlik, doku, ikon (Madde 6 · 7 · 8 · 9):** Köşe yarıçapı, gölge ve parlama taban katmanda sıfırlanır. Üç yüzey: çerçeveli, ters video, kesik çizgili. CRT efekti isteğe bağlı: tarama çizgileri ve sabit arayüzün soluk ekran yanığı izi. İkon yok; `[>]`, `[x]`, `[+]`, `[!]`, `(*)` gibi ASCII işaretler.
- **Saf ASCII:** Yazı tiplerinin Latin alt kümelerinde kutu çizim ve blok karakterleri (U+2500, U+2588) yok; tablolar `+ - |`, çubuklar `#` ve `=`, ısı haritası ` .:-=+*#%@` rampasıyla çizilir, böylece her karakter kendi hücresine oturur. JetBrains Mono'da `₺` ve `→` olmadığından "TL" ve `->` kullanılır.
- **Bileşenler (Madde 11 · 14):** `<TerminalShell>` (geçmiş, Tab tamamlama, Ctrl+L), `<Kbd>` (`[Ctrl]+[K]`), `<LogStream>` (seviye süzgeci, duraklat, takip et), `AsciiTable` (anlamsal `<table>`, görünüşü ASCII; sütun genişliği karakter olarak hesaplanır, başlıklar sıralar, satırlar ↑/↓ ya da j/k ile gezilir) ve Ctrl/⌘ + K komut paleti (cmdk + Radix Dialog; tema, yazı, CRT, hareket, sunucu yeniden başlatma, kıyaslama, bölüme git).
- **Uygulama (Madde 10):** Donanım kıyaslama aracı (altı test, %5'lik adımlarla dolan çubuklar, `#`/`=` çubuk grafik, referansa göre fark), BIOS/VMD depolama paneli (sekmeler ok tuşlarıyla, disk seçimi, RAID-0/1/5/10 doğrulaması ve kapasite, önyükleme sırası, F10 ile kaydet), sunucu yönetim konsolu (canlı ASCII ızgara, çekirdek ısı haritası, kabuk komutları ızgarayı değiştirir, işlem günlüğü) ve yazılımcı kişisel sitesi. Veriler kurgusaldır.
- **Tailwind (Madde 13 · 15):** `Font/MonoCore`, `Color/ConsoleGreen`, `Color/ConsoleAmber` ve diğerleri `tokens/term.tokens.json` içinde. Tanımdaki `font-mono bg-black text-green-400 p-4 border border-green-800 antialiased` satırı sayfada birebir kullanılır; bunun için temaya Tailwind'in `green-400` ve `green-800` adımları eklendi.
- **Hareket (Madde 16):** Daktilo (38 karakter/sn), kesik kesik dolan çubuklar, `| / - \` döndürücü ve 1 Hz yanıp sönen imleç (blok, alt çizgi, çubuk). Yumuşak geçiş yok. Hareket kapalıyken (ya da hareketi azalt tercihinde) metin hemen yazılır, imleç sabit durur.
- **Mobil (Madde 17):** 640px altında yazı 14px. Metin kırılmaz; geniş her blok kendi yatay kaydırma alanında (`role="region"`, odaklanabilir, adlı).
- **Erişilebilirlik (Madde 18):** Tüm metin AA'yı geçer (en düşük: Solarized ikincil 4,99:1). Durum ve seviye metinle yazılır (`[ HATA ]`, `[UYARI ]`); onay kutuları ve radyolar yerel girişlerle çalışır; ASCII çizimler ekran okuyucudan gizlidir ve verisi metin ya da tablo olarak da vardır; otomatik akan günlük tek tek duyurulmaz, hata ve uyarı sayısı durum satırındadır.

## Stil 013 · Generative UI

Arayüz önceden çizilmiş sabit ekranlardan değil, kullanıcının sorusundan ve yapay zekânın ürettiği sonuçtan o an kurulur. Tablo gerekiyorsa tablo, form gerekiyorsa form belirir; gerekmiyorsa hiçbir bileşen çağrılmaz. Sayfa bir tanıtımdır: model çalışmaz, akış ve araç çağrıları kurgudur.

- **Asistan (Madde 2 · 10):** Dört senaryo, her biri arayüzü farklı kurar. *AI arama* kaynak kartları, tablo ve grafik; *dinamik doküman* dosya okuma ve kod bloğu; *copilot* test çıktısı ve yama; *akıllı asistan* takvim ve yanıtın içinde doldurulabilir bir form (gönderilince yeni bir araç çağrısı başlar). Arama ve doküman yanıtları bu deponun gerçek dosyalarına dayanır ve kaynak kartları GitHub'daki dosyalara bağlanır; kod ve takvim örnektir. Araç gerektirmeyen soruda yalnız metin üretilir. Üretim her an durdurulabilir.
- **Bileşenler (Madde 11 · 14):** `<ToolCall>` (araç adı, durum: sırada, çalışıyor, tamamlandı, hata; süre ve açılır parametreler), `<ToolResult>` (tek yükseltilmiş katman), `<AICitation>` (satır içi `[n]`; üzerine gelince ya da odakta alan adı, başlık ve önizleme; tıklayınca kaynak kartına gider), `<AISources>` (alan adı, başlık, önizleme). AI Streaming Indicator (düşünüyor, yazıyor, token sayısı, üretim imleci) ve AI Generation Progress (adım çipleri, `aria-current="step"`).
- **Markdown (Madde 3 · 18):** Akış dostu küçük bir ayrıştırıcı yarım gelen metni de bozmadan işler (kapanmamış kod bloğu açık kalır, yarım tablo satırı beklenir, eşi gelmemiş `**` kalın gösterilir). Çıktı semantik HTML'dir: yanıttaki `##` sayfa hiyerarşisine oturup h4 olur, listeler `ul/ol`, tablolar `th scope`, kod `figure > pre > code`. "Ekran okuyucunun gördüğü ağaç" kartı aynı AST'yi gösterir; sayfada başlık düzeyi atlanmaz.
- **Renk ve yazı (Madde 4 · 5):** Nötr zinc griler, tek vurgu indigo (`#4F46E5`, koyuda `#818CF8`); indigo yalnız yapay zekânın dokunduğu yerde. Hibrit tipografi: arayüz Inter, okuma bloğu Source Serif 4, kod JetBrains Mono (kodda bağlaçlar kapalı, `>=` iki karakter kalır).
- **Şekil, derinlik, doku, ikon (Madde 6 · 7 · 8 · 9):** 8px köşeli, içeriği saran kapsayıcılar. Üretilen bloklar aynı düzlemde; yalnız araç sonucu hafif gölgeyle öne çıkar. Doku yok. Döngüsel durum ikonları: sıralı nokta (düşünüyor), dönen yay (yükleniyor), dişli (araç çalışıyor), çizilerek beliren onay.
- **Figma (Madde 12 · 13):** Her bileşen "Hug contents"; sabit genişlik yalnız en dış kapsayıcıda. Üst çubuktaki katman düğmesi bütün sayfadaki Auto Layout çerçevelerini adlarıyla gösterir. `Spacing/DynamicGap` içerik yoğunluğuna göre 16px'ten 8px'e iner. Tokenlar: `Spacing/DynamicGap`, `Color/AI-Accent`, `Border/ToolCard` ve diğerleri `tokens/gen.tokens.json` içinde.
- **CSS (Madde 15 · 17):** Paragraf ve liste öğeleri `whitespace-pre-wrap`; tablolar ve kod blokları `overflow-x-auto` alanlarda (odaklanabilir, adlı), mobilde kırılmaz, kendi alanında kayar.
- **Hareket (Madde 16):** Kelime kelime akış (22–60ms), adım ilerlemesi ve `ResizeObserver` ile ölçülen yükseklik geçişi (240ms): yeni araç sonucu geldiğinde kutu zıplamaz, kayarak uzar. Hareket kapalıyken (ya da hareketi azalt tercihinde) yanıt tek seferde gelir, döngüler durur.
- **Erişilebilirlik (Madde 18):** Akan yanıt `aria-busy` ile işaretlenir; kelimeler tek tek duyurulmaz, bitince tek bir durum duyurusu yapılır. Takvim ve grafiklerin metin karşılığı var; durum hiçbir yerde yalnız renkle verilmez. En kötü yüzeyde metin 16,12:1 (koyu 13,55:1), ikincil 7,03:1 (5,81:1), vurgu 5,72:1 (4,99:1).

## Stil 014 · Conversational UI

Gezinme menüsü yok: bütün ekran bir mesaj akışı ve altta sabit duran bir komut kutusu. Sayfanın kendisi bir sohbet; stilin maddeleri sorulunca anlatılır ve her yanıtın altında o maddenin canlı örneği açılır (ekran anatomisi, balon köşeleri, komut kutusu, klavye yönetimi, `aria-live` günlüğü…). Sayfa bir tanıtımdır: model çalışmaz, yanıtlar önceden yazılmıştır ve dosyalar tarayıcıdan çıkmaz.

- **Sohbet (Madde 2 · 10):** Dokuz konu öneri çipi olarak başlar; her yanıttan sonra o yanıta uyan üç yeni çip gelir. Konu dışı bir soruda asistan örneği olmadığını söyler ve konuları önerir. Üç görünüm aynı sohbeti paylaşır: tam ekran yapay zekâ sohbeti, bir sayfanın yanında kenar çubuğu (1024px altında destek balonuna döner) ve sağ altta açılan destek balonu (okunmamış yanıt rozeti, Escape ile kapanır, odak başlatıcıya döner). Görünüm, geçmiş silinmeden değişir.
- **Bileşenler (Madde 11 · 14):** `<AIChat>` (akış, "son mesaja in" düğmesi yeni mesaj sayısıyla, sürükle-bırak katmanı), `<AIPromptBox>` (metin, dosya ve ses; Enter gönderir, Shift+Enter yeni satır, Escape üretimi durdurur; yapıştırılan dosyalar da eklenir; en fazla 5 dosya, dosya başına 10 MB), `<AIMessage>` (`role` ile kullanıcı ve asistan; art arda balonlar gruplanır, sivri köşe yalnız sonuncuda) ve `<AIVoiceInput>` (ses seviyesi, süre, iptal ve "metne çevir"; varsayılan tanıtım kaydıdır, ayarlardan tarayıcının konuşma tanıması açılabilir). AI Prompt Suggestions çipleri ve eklenen dosyanın analizi (görselde ölçü ve oran, CSV'de satır ve sütun, JSON'da yapı, metinde satır ve kelime).
- **Renk ve yazı (Madde 4 · 5):** Beyaz zemin (`Color/ChatBackground`, koyuda `#141517`). Kullanıcı balonu marka rengi (mavi `#2563EB`, mor, yeşil ya da mercan; beyaz metin en az 5,17:1), asistan balonu nötr gri `#F2F3F5`. Inter 16px, satır yüksekliği 1,6.
- **Şekil, derinlik, ikon (Madde 6 · 7 · 9):** 18px köşeli balonlarda konuşmacıya bakan alt köşe 0px (`Radius/BubbleUser` 18 18 0 18, `Radius/BubbleAssistant` 18 18 18 0); ayarlardan kuyruklu ya da tamamen yuvarlak biçime geçilebilir. Balonlar düz; tek yükseltilmiş katman komut kutusu, gölgesi yukarı doğru (`0 -10px 40px rgba(0,0,0,0.05)`). İkonlar: mikrofon, ataç, gönder, ayarlar.
- **Figma (Madde 12 · 13):** Akış ters çevrilmiş dikey Auto Layout (alttan yukarı büyür), komut çubuğu kaydırmada sabit. Tokenlar: `Radius/BubbleUser`, `Radius/BubbleAssistant`, `Color/ChatBackground` ve diğerleri `tokens/chat.tokens.json` içinde.
- **CSS (Madde 15):** Kaydırma alanı `flex flex-col-reverse`: tarayıcı en alttan başlar, yeni mesaj gelince en altta kalır, kullanıcı yukarı kaydırdıysa yeri korunur. Ek JavaScript ile kaydırma yalnız kullanıcı mesaj gönderince yapılır.
- **Hareket (Madde 16):** Yeni balon aşağıdan kayarak gelir (320ms). AI Thinking Indicator adım adım ilerler, yanıt başlayınca "Düşündü · N adım · X sn" satırına katlanır ve yeniden açılabilir; sonra yanıt kelime kelime akar. Akış hızı ayarlanabilir; hareket kapalıyken (ya da hareketi azalt tercihinde) yanıt tek seferde gelir.
- **Mobil (Madde 17):** Görünür alanın yüksekliği `visualViewport` ile `--app-h` değişkenine yazılır ve sohbet bu yükseklikle konumlanır; klavye açılınca komut kutusu klavyenin üstünde kalır (`interactive-widget=resizes-content` ile birlikte). Destek penceresi mobilde tam ekran açılır.
- **Erişilebilirlik (Madde 18):** İki gizli `aria-live` bölgesi: "Asistan düşünüyor", yanıt bitince tamamı tek duyuru (kelimeler tek tek okunmaz, akan balon `aria-busy`), durdurma, eklenen ve kaldırılan dosyalar; hatalar `assertive`. Her balonda ekran okuyucu için "Siz" ya da "Asistan" başlığı, eklenen görsellerde dosya adıyla alt metin. En kötü yüzeyde metin 15,37:1 (koyu 12,92:1), ikincil 5,70:1 (6,05:1), vurgu metni en az 4,78:1 (5,56:1).

## Stil 015 · Neural Aesthetic

Verinin işlenişini, sinir ağlarını ve yapay zekânın "zihnini" derin uzay siyahında parlayan düğümler, Bezier bağlantılar ve zaman çizelgeleriyle gösteren teknik ve mistik bir estetik. Sayfa bir tanıtımdır: modeller, görevler ve eğitim verisi kurgudur, veri tohumlu üreteçle her açılışta aynı çizilir.

- **Ağ ve derinlik (Madde 2 · 3 · 7 · 8):** Kahraman ağı dört Z katmanından oluşur: uzak ve orta katman bulanık soluk ağlar, odak katmanı keskin asıl ağ, yakın katman odak dışı partiküller. İmleç hareketinde katmanlar farklı hızda kayar. Çıktı düğmelerinden biri seçilince ona en güçlü ağırlıklarla ulaşan yol sarı çizgiyle, çizilerek belirir. Arka planda üç derinlikte yavaşça kayan dijital toz (tuval) ve 40 saniyede kayan ızgara.
- **Ajan takibi (Madde 10 · 11 · 14):** `<AIAgentTimeline>` görevi Anla, Ara, Analiz Et, Üret aşamalarında gösterir; her düşünce, araç çağrısı ve bulgu günlüğe düşer, sonuç Üret adımında kelime kelime akar. Duraklatılır, olay olay ilerletilir; Ara adımında zaman aşımı oluşturulup yeniden deneme izlenebilir. `<AIModelSelector>` bulut ve yerel modelleri aranabilir bir listede yetenek rozetleriyle (Akıl yürütme, Araç, Görsel, Kod, Uzun bağlam) sunar; yer ve yetenek süzgeci vardır, bu makinenin 24 GB VRAM'ine sığmayan model nedeniyle birlikte seçilemez. Seçim davranışı değiştirir: yerel model web araması yapmaz, araç çağıramayan model Ara adımını atlar.
- **LLM eğitim paneli (Madde 10):** Canlı akan (duraklatılabilir) adım, kayıp, perpleksite, görülen token ve kalan süre. Kayıp grafiği tek eksenli (eğitim düz mavi, doğrulama kesik pembe ve işaretçili), öğrenme oranı kendi grafiğinde; artı imleçli ipucu fareyle, dokunarak ya da ok tuşlarıyla okunur, tablo görünümü açılır. İşlemci ağacı küme, iki düğüm ve sekiz GPU'yu kullanım halkası ve sıcaklık uyarısıyla gösterir.
- **Veri seti analizi (Madde 10 · 17):** Gömme uzayından 194 örneklik kesit. Analitik katmanlar (benzerlik kenarları, küme sınırları, aykırılar, kopyalar, odak derinliği) açılıp kapanır; noktaya dokununca örnek, kalite, metin ve en yakın komşular açılır. Aykırılar sarı üçgen, kopyalar kırmızı kare: renk tek başına bilgi taşımaz.
- **Renk ve yazı (Madde 4 · 5):** Zemin `#0A0A0A`; Gradient/Brand `#60A5FA` ile `#A78BFA` arası; işlemde sarı `#FACC15`, tamam yeşil `#4ADE80`. Grafik renkleri dataviz doğrulayıcısından geçti (CVD ΔE 14,4). Başlık ve metin Outfit (ince ağırlıklar), veri ve etiket Martian Mono (genişlik ekseniyle etiketlerde %87,5).
- **Şekil, ikon (Madde 6 · 9):** Düğüm daire, bağlantı Bezier eğrisi, kapsayıcı 1px çizgi ve köşe işaretleri. İkonlar: beyin, sinir ağı, kıvılcım, işlemci ağacı.
- **Figma (Madde 12 · 13):** Otomatik bağlayıcı örneği (Arrow Auto gibi): düğümler sürüklenince ya da ok tuşlarıyla taşınınca bağlantı çıkış ve giriş kenarını kendisi seçer. Step bileşeni State (Bekliyor, Çalışıyor, Tamamlandı, Hata, Atlandı) ve Orientation varyantlarıyla, Connector Progress varyantlarıyla. Tokenlar: `Color/NodeActive`, `Color/EdgeLine`, `Effects/NeuralGlow` ve diğerleri `tokens/neural.tokens.json` içinde.
- **CSS ve hareket (Madde 15 · 16):** SVG yolları `pathLength="1"` ile normalleşir; çizerek belirme `stroke-dashoffset` 1'den 0'a, veri akışı `stroke-dasharray: 0.07 0.93` ile yol boyunca ilerleyen parça, zaman çizelgesi bağlantısı `calc(1 - var(--p))` ile dolar. Çalışan düğüm nabız atar ve titrer. Hareket kapalıyken (ya da hareketi azalt tercihinde) çizgiler son hâlinde durur, akış ve toz durur.
- **Mobil (Madde 17):** Veri seti haritası her ekranda, işlemci ağacı 768px altında kaydırılıp yakınlaştırılan bir alan: tek parmak kaydırır, iki parmak ya da Ctrl + tekerlek yakınlaştırır (düz tekerlek sayfayı kaydırmaya devam eder), odaktayken oklar, + − ve 0 çalışır. Ağaç mobilde okunur ölçekte başlar. Zaman çizelgesi dar ekranda dikey.
- **Erişilebilirlik (Madde 18):** Salt koyu mod (`color-scheme: dark`, açık tema yok). Görsel gösterinin arkasındaki veri ölçüldü: metin en kötü yüzeyde 14,15:1, ikincil 6,67:1, en soluk etiket 4,95:1, birincil düğme metni en az 7,27:1; grafik öğeleri en az 3:1. Her görselin okunabilir karşılığı var (tablolar, durum metinleri, `aria-current="step"`, canlı duyurular). Varyantlar: Sade efekt (toz, parıltı ve bulanıklık yok) ve Yüksek kontrast.

## Stil 016 · Neo-Brutalism

Yumuşak gölgeyi ve ince çizgiyi reddeden, saf renk ve kalın siyah çerçeveyle kurulan, kasıtlı olarak ham bir stil. Sayfa bir tanıtımdır: ürünler, anahtarlar ve veriler kurgudur; sepet, form ve dağıtım paneli tarayıcıda gerçekten çalışır.

- **Bileşenler (Madde 11 · 14 · 15):** `<SolidButton>` tanımdaki Tailwind satırını birebir kullanır (`border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)]`); basınca 6px çöker ve gölge kaybolur. "Tam çöküş" varyantında bu, üstüne gelince olur. Koyu tema için `dark:` varyantı sitenin tema sözleşmesine (sistem tercihi + `data-theme`) bağlandı. `<BrutalistCard>` 3px çerçeve, 6/6/0 gölge; etkileşimli kart üstüne gelince 3px seker. `<Marquee>` iki kopyayı linear olarak kaydırır, hız px/sn olarak sabittir (50, 110, 220); üstüne gelince, odakta, kendi düğmesiyle ya da genel "şeritleri durdur" ayarıyla durur (WCAG 2.2.2), metin ekran okuyucuya bir kez okunur. Büyük etiketler, düzenlenebilir etiket alanı, form (hata kutusu, anahtar, onay kutusu, radyo çipleri) ve damga gibi beliren bildirimler.
- **Kullanım alanları (Madde 10):** Dört sekme. Gen-Z mağaza: süzgeç, sepete ekleme, adet, 1.000 TL eşikli kargo, başlıkta seken sepet sayacı. Geliştirici aracı: blok blok dolan dağıtım adımları, günlük, API anahtarlarını göster, kopyala, iptal et. Ajans ve portfolyo: açılır proje listesi ve doğrulamalı teklif formu. Web3: tanıtım cüzdanı ve rozet basma (zincir yok).
- **Renk ve yazı (Madde 4 · 5):** Zemin kirli beyaz `#F4F4F0` ya da sarı `#FFD500` (ayar), metin ve çerçeve saf siyah; vurgu CMYK kırmızı `#FF4D3D`, mavi `#3D7BFF`, yeşil `#00C16A` ve pembe. Renk yalnız düz dolgu, üstündeki metin hep siyah (en düşük 5,48:1). Başlık Archivo 900, genişlik ekseni %125; gövde Space Grotesk; kod JetBrains Mono. `₺` Archivo'nun Latin Genişletilmiş alt kümesinde olduğu için fiyatlar başlık yazısıyla.
- **Şekil, gölge, ikon (Madde 6 · 7 · 8 · 9):** Köşeli (varsayılan) ya da 14px yuvarlak (ayar); çizgi ve gölge aynı kalır. Gölge hep x 6, y 6, blur 0. Doku ve degrade yok. İkonlar 2,5px, kare uç, sivri birleşim.
- **Figma (Madde 12 · 13):** Her bileşende Stroke 3px, Black, Inside (buton Madde 15'e uyarak 4px). Kart iç boşluğu bilerek asimetrik (20, 28, 24, 20), bölüm aralıkları çok geniş. Tokenlar: `Border/ThickBlack`, `Shadow/SolidOffset`, `Typography/Oversized` ve diğerleri `tokens/brut.tokens.json` içinde.
- **Hareket (Madde 16):** Ease yok: basış ve kart sekmesi 80ms linear, damga 240ms `steps(3)`, sepet sayacı 200ms `steps(2)`, ilerleme blok blok. Bölümde ease, linear ve `steps(5)` yan yana karşılaştırılır. Hareket kapalıyken (ya da hareketi azalt tercihinde) şerit, damga ve sekme durur; basınca yer değiştirme anında olur.
- **Mobil (Madde 17):** Ölçek doğrusal değil: mega başlık 1280px'te 141px, 390px'te 52px; gövde 18px'ten 16px'e. 640px altında Archivo'nun genişlik ekseni %125'ten %100'e iner. Bölümdeki çerçeve genişliği seçilebilen canlı örnek, aynı başlığın küçültülmeyen sürümünün taştığını gösterir. Izgara tek sütuna iner, asimetrik kaydırmalar masaüstüne özel, gezinme ikinci satırda yatay kayar, dokunma hedefleri en az 44px. 320px'ten 1920px'e taşma yok.
- **Erişilebilirlik (Madde 18):** Açık temada en düşük metin çifti 5,48:1, koyu temada 5,99:1. Koyu varyant: siyah zemin, kalın beyaz çerçeve, beyaz gölge, neon dolgu (üstünde siyah metin). Odak halkası 3px kesik çizgi. Renk tek başına bilgi taşımaz: hata kutusu ikon ve metinle, durum rozetleri yazılı, seçili çip dolu, gölgesiz ve onay işaretli. İngilizce bileşen adları `lang="en"` taşır; böylece büyük harfe çevrilince "İ" olmaz.

## Stil 017 · Maximalism

Minimalizmin "az çoktur" kuralını reddeden; renk, doku ve bilginin ekranı bilinçli bir kaosla doldurduğu yoğun ve enerjik bir estetik. Sayfa kurgusal bir müzik festivalinin (Horror Vacui) tanıtımıdır: sanatçılar, eserler ve ürünler kurgudur; süzgeç, bilet sepeti, galeri, koleksiyon ve rozet albümü tarayıcıda gerçekten çalışır.

- **Kaos, ama kurgulu (Madde 2 · 3 · 7):** Sınırlarını taşan kahramanda üç aileyle üst üste binen dev başlık, dönen 3D nesneler, kolaj kâğıdı, çıkartmalar ve bir sonraki bölüme taşan kontur kelime. Z sırası rastgele görünür ama sabittir: z-0 doku, z-10 dev yazı, z-20 kolaj, z-30 3D, z-40 okunur içerik, z-50 çıkartma, z-60 uçan rozet, z-80 imleç takipçisi; Palet bölümündeki Z haritası katmanları ayırıp gösterir. Okunur metin her zaman düz bir zeminde ve süslerin üstünde durur.
- **Renk ve yazı (Madde 4 · 5):** Çatışan neonlar (pembe `#FF2E93`, limon `#C8FF00`, elektrik mavi `#2F3CFF`, turuncu, camgöbeği, mor), derin pasteller ve siyah. Metin kuralı: neon ve pastelde koyu mürekkep, mavi ve morda krem (en düşük 5,11:1). Dört değişken aile aynı cümlede: Anybody (genişlik %50–150), Fraunces (opsz, SOFT, WONK), Martian Mono ve Caveat. Değişken yazı laboratuvarı eksenleri kaydırıcıyla, imleçle (x genişlik, y ağırlık) ya da harf harf karıştırarak oynatır.
- **Şekil, doku, ikon (Madde 6 · 8 · 9):** Keskin üçgen, yıldız patlaması, tohumlu organik damla (basınca yeniden şekillenir), oranı korunmayan esnetilmiş vektör. Doku: feTurbulence gren, maskeyle solan halftone, yırtık kenarlı kolaj kâğıdı, imleci izleyen parlamalı holografik folyo. İkon yerine kalın beyaz kesim kenarlı çıkartmalar ve React Three Fiber ile krom düğüm, yıldız, kapsül ve dalgalanan damla; tıklayınca yaylanır, görünmüyorken kare çizmez. WebGL yoksa aynı kompozisyon düz çıkartmalarla kurulur.
- **Kullanım alanları (Madde 10 · 11):** Müzik festivali: geri sayım, gün ve tür süzgeci (süzülenler silinmez, söner ve odak dışı kalır), afiş, seçili sanatçı kartı, bilet sepeti. Sanat galerisi: tohumdan üretilen kolajlarla kendi alanında sonsuz kayan dev galeri (150 esere kadar; "daha fazla yükle" düğmesi ve yükleme duyurusu, ok tuşlu büyük görünüm, koleksiyon). Moda kampanyası: sürüklenen görünüm kartları. Editoryal: serif, sans ve mono'yu aynı paragrafta karıştıran makale. Ekran kenarında Lissajous yolunda uçan, üstüne gelince duran, basınca albüme yapışan rozetler (albüm saklanır).
- **Figma ve kod (Madde 12 · 13 · 14 · 15):** Auto Layout ile Absolute Position arasında geçiş yapan örnek; öğeler `useScatter` kancasının tohumlu x, y, dönme ve z değerleriyle dağılır, hiçbir değerde kutudan taşmaz. Sabit token yok: dönme aralığı, üst üste binme, doygunluk, gren, rozet sayısı, font karışımı ve hareket hızı `:root` üzerindeki serbest değişkenlerdir; kaydırıcılar bütün sayfayı canlı değiştirir, Sakin, Normal ve Tam kaos yalnız hazır ayardır. `useMagnetic` ve `useScrollFx` imlece ve kaydırmaya bağlı konum verir. Tanımdaki `absolute -rotate-12 z-50 mix-blend-difference` sınıfları birebir kullanılır. `tokens/maxi.tokens.json` sabit değer yerine değişkenleri, aralıklarını, hazır ayarları ve kuralları belgeler.
- **Hareket (Madde 16):** İmleci %20 yaklaşmayla izleyen beyaz fark dairesi (düğme üstünde büyür ve `data-cursor` etiketini yazar; asıl imleç gizlenmez), yaklaşınca çekilen manyetik öğeler ve kaydırdıkça biri dönen, biri büyüyen, biri renk değiştiren, biri ters kayan asimetrik paralaks (`--p` −1…1, dönüşüm CSS'te).
- **Mobil (Madde 17):** 768px altında mutlak konum, eğim ve binme kalkar; her parça tam genişlik, kalın çerçeveli, blok renkli dev bir kart olur. Uçan rozetler albümde satıra dizilir, imleç takipçisi, manyetik çekim ve süs yazılar kalkar. Aynı kolaj `@container` sorgusuyla 700px eşiğinde kaostan karta döner (çerçeve genişliği seçilebilen canlı örnek). 320px'ten 1920px'e taşma yok.
- **Erişilebilirlik (Madde 18):** Bilişsel yükü en yüksek stil; kontrast kuralı kasıtlı olarak çiğnenir, ama yalnız aria-hidden süs katmanında (pembe/turuncu 1,21:1, limon/tereyağı 1,05:1). Okunacak her metin ve düğme AA'yı geçer. Canlı sayaç aynı anda hareket eden öğeleri sayar (0 durgun, 22 ve üstü aşırı). Kaçış yolları: sakin mod (dönme, binme ve gren 0; rozet, takipçi ve süs kalabalığı yok; 3D, paralaks ve folyo durur), başlıkta her an hareketi durduran düğme, hareketi azalt tercihine otomatik uyum, iki renkli odak halkası (limon dış, koyu iç), içeriğe geç ve galeriyi atla bağlantıları. Gece teması: siyah zemin, neon ve krem metin.

## Stil 018 · Anti-Design

Web'in ilk yıllarındaki çirkinliği savunan, tasarım standartlarını reddeden, sanat odaklı ve provokatif bir stil. Sayfa kurgusal bir yeraltı ses kolektifinin (SİNYAL KAYBI) 1997'den kalma ana sayfası gibi yazıldı: etkinlik listesi, sipariş formu, ziyaretçi defteri ve sayaç tarayıcıda gerçekten çalışır.

- **Görünüm (Madde 1 · 2 · 3):** Biçimlendirilmemiş HTML: gövde tarayıcının 16 piksel Times'ı, menü numaralı bir liste, düğmeler işletim sisteminin gri kutuları. Başlık `margin-left: -50px` ile sol kenardan taşar, alt başlık üstüne biner; etkinlik tablosu `width="140%"` ile ekranın sağından taşar ve her üçüncü satırı 19 piksel kayar. Üst üste binen satırlar gözle okunmaz ama belgede sırayla durur.
- **Renk ve yazı (Madde 4 · 5):** HTML 4'ün 16 adlı rengi ve 216'lık web güvenli küp: link `#0000FF`, ziyaret edilmiş `#800080`, parlak kırmızı ve siyah; her rengin beyaz ve siyah zemindeki kontrastı tabloda. Kırmızı yazı (4,00:1) yalnız büyük boyda. Yalnız Times New Roman, Arial ve Courier; web yazı tipi yok. Koyu düzende zemini ve yazıyı tarayıcı seçer (`Canvas`, `CanvasText`), linkler `light-dark()` ile `#9999FF` olur.
- **Şekil, derinlik, doku, ikon (Madde 6 · 7 · 8 · 9):** Yalnız native form elemanları: metin, tarih, renk, dosya, radyo, select, datalist, progress, meter, details ve dialog; gönderilen form sunucunun alacağı `x-www-form-urlencoded` satırı olarak gösterilir. Gölge ve yuvarlak köşe sayısı canlı sayılır: 0. Doku yok; ekran yırtığı aynı metnin ekran okuyucudan gizli bir kopyasının kayan şeridi. İkon yerine ASCII (`[X]`, `>>`, `/!\`) ve işletim sisteminin emojisi; süs işaretleri ekran okuyucudan saklanır.
- **Kullanım alanları (Madde 10 · 11):** Yeraltı sahnesi (taşan program tablosu, açılır parça listeli yayınlar, kayan "şimdi çalıyor"), bağımsız moda markası SÖKÜK (native doğrulamalı sipariş formu ve ASCII fiş), web sanatı (form elemanlarıyla yazılan şiir, yüzde 99'da kalan yükleme, basılmaması gereken düğme), ziyaretçi defteri ve sayaç. Kalıplar: stilsiz radyo, varsayılan select, hizasız tablo.
- **Figma ve tokenlar (Madde 12 · 13):** Katman tablosu mutlak konumları gösterir; Auto Layout yok. Bülten kutusu çizilip kullanılmayan 12 sütunlu gridin üstüne, iki sütunun arasına düşer. `tokens/anti.tokens.json` tek satırdır ve yalnız HTML 3.2 `<body>` renk özniteliklerini taşır (`bgcolor`, `text`, `link`, `vlink`, `alink`); aynı değerler sayfanın `<body>` etiketinde de öznitelik olarak durur.
- **React ve CSS (Madde 14 · 15):** Bileşenler yalnız anlamlı HTML döndürür: sayfada `class` ve `style` özniteliği 0, tek `<div>` React'in kökü; sayım canlı. `<marquee>` React tiplerinde olmadığı için `createElement` ile. `anti.css` derleyiciden geçmez; içinde geçersiz satırlar (`colour: red`, `display: flexbox`, `float: centre`), etkisiz `z-index` ve bir `!important` savaşı var, tarayıcı bunları sessizce atlar. Sınıf seçicisi ve medya sorgusu 0. Kaynağın tamamı sayfada.
- **Hareket (Madde 16):** `<marquee>` (yönü, davranışı ve hızı native form elemanlarıyla seçilen kurucu dahil), sarı zeminli ve kalınlaşıp satırı kaydıran kaba hover, düğmelerde artı imleç, saniyede bir yanıp sönen "YENİ!". Hareket tek kutuyla durur, hareketi azalt tercihine uyar; duran marquee düz paragrafa döner (WCAG 2.2.2).
- **Duyarlılık (Madde 17):** Tarayıcının doğal akışı: medya sorgusu yok, satır uzunluğu sınırlanmaz. Metin her genişlikte kırılır; yalnız tablo ve kod satırları sayfayı yana kaydırır (WCAG 1.4.10'un tablo ve kod istisnası).
- **Erişilebilirlik (Madde 18):** Görsel kaosa rağmen belge temiz: her bölüm başlığıyla adlandırılmış, her tablonun açıklaması ve başlık hücreleri, her alanın etiketi var; sayfa ekran okuyucunun gördüğü iskeleti (yer imleri ve başlıklar) ve denetimi (etiketsiz alan, açıklamasız tablo, başlık atlaması) DOM'dan canlı çıkarır. Varyantlar: bozuk CSS kapalı (bütün stil dosyaları devre dışı, sayfa saf HTML olarak akar), hareket kapalı, renk düzeni tarayıcıya bırakılmış, açık ya da koyu. Odak halkası tarayıcının kendisi.

## Yazı tipleri

Hepsi OFL lisanslı, `@fontsource-variable` paketlerinden yalnızca Latin ve Latin Genişletilmiş alt kümeleriyle yüklenir: Inter (Stil 001 ve 003), Lora ve Plus Jakarta Sans (Stil 002), Geist ve Geist Mono (Stil 004; `₺` glifi olmadığı için tutarlar "TL" ile yazılır), Nunito (Stil 005), Sora (Stil 006), Baloo 2 ve Quicksand (Stil 007; Fredoka ğ, ş ve İ içermediği için başlıkta Baloo 2 seçildi), Manrope ve IBM Plex Mono (Stil 008; Space Mono `₺` içermediği için Plex Mono seçildi), Space Grotesk ve Inter (Stil 009), Rajdhani, Orbitron, Space Grotesk ve IBM Plex Mono (Stil 010; Rajdhani ve Plex Mono sabit ağırlıklı `@fontsource` paketlerinden gelir; Orbitron ğ, ş ve İ içermediği için yalnız Latin alt kümesiyle yüklenir ve yalnız rakam, kod ve saatlerde kullanılır, başlıklar Rajdhani), Audiowide, Exo 2, Chakra Petch ve IBM Plex Mono (Stil 011; Audiowide ve Chakra Petch sabit ağırlıklı `@fontsource` paketlerinden), JetBrains Mono, Fira Code ve Source Code Pro (Stil 012), Inter, Source Serif 4 ve JetBrains Mono (Stil 013), Inter ve JetBrains Mono (Stil 014), Outfit ve Martian Mono (Stil 015; ikisinde de `→`, `✓`, `≥` ve `₺` glifi yok, arayüzde kullanılmaz), Archivo (genişlik ve ağırlık eksenli), Space Grotesk ve JetBrains Mono (Stil 016), Fraunces (opsz, SOFT ve WONK eksenleri), Anybody (genişlik ekseni %50–150), Martian Mono ve Caveat (Stil 017). Stil 018 web yazı tipi yüklemez; tarayıcının Times New Roman, Arial ve Courier ailelerini kullanır. Lisanslı Helvetica Now ya da Neue Haas Grotesk kullanmak için `src/swiss/swiss.css` içindeki `@font-face` bloklarını ve `--font-sans` sırasını değiştirin.
