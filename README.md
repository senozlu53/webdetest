# webdetest · Stil 001: Swiss Style

International Typographic Style'ın React + Tailwind CSS v4 ile kurulmuş tasarım sistemi ve canlı referans sayfası. Sayfa, anlattığı stilin kendisiyle dizilir: 12 kolonlu grid, 4 renk, tek yazı ailesi, 0px köşe, sıfır gölge.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tip denetimi + dist/
npm run typecheck
```

`vite.config.ts` içinde `base: './'` tanımlı olduğu için `dist/` klasörü herhangi bir alt dizinden (örneğin GitHub Pages) servis edilebilir.

## Tokenlar

Tek kaynak `tokens/swiss.tokens.json` (W3C DTCG formatı, Tokens Studio ile Figma Variables'a aktarılabilir). Aynı değerler `src/index.css` içinde CSS değişkeni ve Tailwind teması olarak tanımlıdır.

| Değişken    | Açık      | Invert    | Tailwind                        |
| ----------- | --------- | --------- | ------------------------------- |
| `paper`     | `#FFFFFF` | `#111111` | `bg-paper`, `text-paper`        |
| `ink`       | `#111111` | `#FFFFFF` | `bg-ink`, `text-ink`, `border-ink` |
| `accent`    | `#FF2A2A` | `#FF2A2A` | `bg-accent`, `border-accent`    |
| `mute`      | `#E5E5E5` | `#2B2B2B` | `bg-mute`                       |
| `on-accent` | `#111111` | `#111111` | `text-on-accent`                |

- **Boşluk:** `xs 8 · s 16 · m 32 · l 64 · xl 128` (`p-s`, `gap-m`, `mt-xl`). Çizgi olarak kullanılan `rule 2px` (`gap-rule`).
- **Yazı boyutu:** `label 12 · body 14 · lead 20 · h3 32 · h2 64 · display 120` ve akışkan `hero`.
- **Grid:** 12 kolon. Oluk 8 / 16 / 32px, kenar boşluğu 16 / 32 / 64px (sm / md / lg).
- **Silinen tokenlar:** Tailwind'in varsayılan renkleri, gölgeleri, yarıçapları, blur ve easing eğrileri temadan kaldırıldı. `shadow-lg` ya da `rounded-lg` yazılsa bile CSS üretilmez.

Invert modu `<html data-theme="dark">` ile açılır. Seçim yapılmamışsa sistemin `prefers-color-scheme` tercihi izlenir. `.swiss-invert` sınıfı bir bandı yerel olarak ters çevirir.

## Bileşenler

`src/swiss/index.ts` üzerinden dışa aktarılır.

```tsx
import { SwissGrid, SwissCol, TypographyDisplay, ThickDivider } from './swiss'

<SwissGrid>
  <SwissCol span={[12, 8, 7]}>
    <TypographyDisplay as="h1" size="display">Raster</TypographyDisplay>
  </SwissCol>
  <SwissCol span={[10, 4, 4]} start={[3, 9, 9]}>
    <p>Metin sola hizalı, sağ kenarı serbest.</p>
  </SwissCol>
</SwissGrid>
<ThickDivider thickness="2px" />
```

| Bileşen | Görev |
| --- | --- |
| `SwissGrid` / `SwissCol` | 12 kolonlu grid. `span` ve `start` tek sayı ya da `[temel, md, lg]` alır. |
| `TypographyDisplay` | `font-black uppercase tracking-tighter` başlık; `hero`, `display`, `h2`, `h3` boyutları. |
| `ThickDivider` | 1px ya da 2px düz çizgi. |
| `UnderlineLink` | Altı çizili bağlantı; hover'da çizgi anında kırmızı ve 3px. |
| `SwissButton` | `solid`, `outline`, `accent`; keskin köşe, geçişsiz hover. |
| `GeoIcon` | 12 geometrik ikon, 24px ızgara, 3px çizgi. |
| `Figure` | Filtresiz görsel çerçevesi ve numaralı altyazı. |
| `Section` / `SectionHeader` | Bölüm kabı ve madde numaralı başlık. |
| `GridOverlay` | Sayfaya 12 kolon çizgilerini yerleştirir (G tuşu). |
| `useCutReveal` | Scroll reveal: mürekkep bloğu `steps(4)` ile 240ms'de çekilir. |
| `useTheme` | Açık / Invert modu. |

## Hareket

Yumuşak easing yoktur. Hover ve durum değişimleri 0ms'dir; reveal ve sayfa açılışı `steps(4)` ile sert adımlarla oynar. `prefers-reduced-motion` açıkken tüm animasyonlar kapanır.

## Türkçe büyük harf

Sayfa `lang="tr"` ile işaretlidir, böylece `uppercase` "i" harfini "İ" yapar. İngilizce ifadeler (`Swiss Style`, `Tailwind`, token adları) `lang="en"` ile sarılır; aksi halde "SWİSS" gibi yanlış biçimler oluşur.

## Yazı tipi

Inter Variable (OFL, `@fontsource-variable/inter`) yalnızca Latin ve Latin Genişletilmiş alt kümeleriyle, optik boyut ekseni açık olarak yüklenir. Lisanslı Helvetica Now ya da Neue Haas Grotesk kullanmak için `src/index.css` içindeki `@font-face` bloklarını ve `--font-sans` sırasını değiştirin.
