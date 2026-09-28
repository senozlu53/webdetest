import { useMemo, useState } from 'react'
import { useArcade } from '../lib/store'
import { kontrast, oran } from '../lib/contrast'
import { PALET, PALET_AD, type PaletKod } from '../lib/sprites'
import type { Ton } from '../lib/data'
import { ArcadeText, type Boyut } from '../components/ArcadeText'
import { PixelContainer } from '../components/PixelContainer'
import { Aralik, Section } from '../components/ui'

const ANA: { ton: Ton; ad: string; hex: string; metin: string; rol: string }[] = [
  { ton: 'kirmizi', ad: 'Kırmızı', hex: '#FF0000', metin: '#C00000', rol: 'Tehlike, can azaldı, oyun bitti, 1UP' },
  { ton: 'sari', ad: 'Atari Sarısı', hex: '#FFEA00', metin: '#6B6100', rol: 'Başlıklar, jeton, ana düğme, yüksek skor' },
  { ton: 'yesil', ad: 'Saf Yeşil', hex: '#00FF00', metin: '#006E00', rol: 'Can dolu, kazanan, hazır, başarı' },
]
const DESTEK: { ton: Ton; ad: string; hex: string; metin: string; rol: string }[] = [
  { ton: 'beyaz', ad: 'Beyaz', hex: '#FFFFFF', metin: '#000000', rol: 'Gövde metni, kenar' },
  { ton: 'camgobegi', ad: 'Camgöbeği', hex: '#00FFFF', metin: '#006B6B', rol: 'Bağlantı, mana, odak' },
  { ton: 'eflatun', ad: 'Eflatun', hex: '#FF00FF', metin: '#A000A0', rol: 'Deneyim, destansı eşya' },
]

/** Madde 4: saf siyah zemin üstünde üç doygun arcade rengi */
export function Palet() {
  const { theme } = useArcade()
  const kart = (r: (typeof ANA)[number], buyuk: boolean) => {
    const zemin = theme === 'light' ? '#FFFFFF' : '#000000'
    const yazi = theme === 'light' ? r.metin : r.hex
    return (
      <PixelContainer as="li" key={r.ton} ton={r.ton} className="flex min-w-0 flex-col" data-renk={r.hex}>
        <div className={buyuk ? 'h-[calc(var(--u)*40)] shadow-[inset_0_calc(var(--u)*-1)_0_0_var(--edge)]' : 'h-[calc(var(--u)*20)] shadow-[inset_0_calc(var(--u)*-1)_0_0_var(--edge)]'} style={{ background: r.hex }} aria-hidden="true" />
        <div className="grid gap-2 p-4">
          <ArcadeText as="h3" boyut={buyuk ? 'm' : 's'} ton={r.ton}>
            {r.ad}
          </ArcadeText>
          <p className="tabnum text-body-l">{r.hex}</p>
          <p className="text-muted">{r.rol}</p>
          <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-3 tabnum">
            <dt>Zeminde yazı</dt>
            <dd className="m-0 text-right">
              {oran(kontrast(yazi, zemin))}
              {theme === 'light' ? ` (${r.metin})` : ''}
            </dd>
            <dt>Üstünde siyah</dt>
            <dd className="m-0 text-right">{oran(kontrast('#000000', r.hex))}</dd>
          </dl>
        </div>
      </PixelContainer>
    )
  }
  const kod = Object.keys(PALET) as PaletKod[]
  return (
    <Section id="temel" madde="Madde 4 · Renk paleti" title="Siyahın üstünde üç renk" ton="kirmizi" lead="Zemin saf siyah (#000000); ekran kapalıyken tüp de siyahtır. Üstünde çok doygun üç renk. Renkli dolgunun üstündeki yazı hep siyah; kırmızı üstünde beyaz 4,00:1 kalır, siyah 5,25:1 verir.">
      <ul className="m-0 grid list-none grid-cols-1 gap-8 p-0 md:grid-cols-3">{ANA.map((r) => kart(r, true))}</ul>
      <ArcadeText as="h3" boyut="s" className="mt-12">
        Yardımcı renkler
      </ArcadeText>
      <ul className="m-0 mt-6 grid list-none grid-cols-1 gap-8 p-0 sm:grid-cols-3">{DESTEK.map((r) => kart(r, false))}</ul>
      <p className="mt-6 max-w-[64ch] text-muted">Kılavuz temasında zemin beyaz kâğıt olur; renkler dolgu olarak aynen kalır, yazı olarak kullanıldıklarında koyulaşır (sarı yazı beyazda 1,23:1 verirdi, koyu zeytin 6,30:1).</p>

      <ArcadeText as="h3" boyut="s" className="mt-12">
        Sprite paleti · 16 renk
      </ArcadeText>
      <p className="mt-3 max-w-[64ch] text-muted">Bütün ikon ve karakterler yalnız bu tablodan boyanır. 16-bit konsolun ekranında aynı anda gösterebildiği sınırlı palet gibi: yeni renk gerekiyorsa biri çıkar.</p>
      <ul className="m-0 mt-6 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-4 lg:grid-cols-8">
        {kod.map((k) => (
          <li key={k} className="flex min-w-0 items-center gap-3">
            <span className="block size-[calc(var(--u)*12)] shrink-0 shadow-[0_0_0_var(--u)_var(--edge)]" style={{ background: PALET[k] }} aria-hidden="true" />
            <span className="min-w-0 leading-[1]">
              <span className="block truncate">{PALET_AD[k]}</span>
              <span className="tabnum block text-muted">{PALET[k]}</span>
            </span>
          </li>
        ))}
      </ul>
    </Section>
  )
}

const BOYLAR: { b: Boyut; ad: string }[] = [
  { b: 'xs', ad: 'Etiket' },
  { b: 's', ad: 'Düğme' },
  { b: 'm', ad: 'Ara başlık' },
  { b: 'l', ad: 'Bölüm' },
  { b: 'xl', ad: 'Ekran' },
]

/** Madde 5: yalnız monospace piksel yazılar */
export function Tipografi() {
  const { olcek } = useArcade()
  const [ornek, setOrnek] = useState('Pijamalı hasta yağız şoföre çabucak güvendi.')
  const px = (b: Boyut) => ({ xs: [16, 16, 16], s: [16, 16, 24], m: [16, 24, 32], l: [24, 32, 40], xl: [32, 48, 64] })[b][olcek.k - 2]
  return (
    <Section id="yazi" madde="Madde 5 · Tipografi" title="Üç piksel yazı" ton="yesil" lead="Hepsi eş aralıklı, hepsi pikselden. Press Start 2P başlık ve düğmede, VT323 gövdede, Silkscreen yalnız İngilizce HUD etiketlerinde.">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <PixelContainer ton="sari" className="min-w-0 p-5">
          <p className="kicker text-muted">Başlık · Typography/PixelDisplay</p>
          <p className="mt-3 font-ps text-l leading-[1.5] [overflow-wrap:anywhere]">Press Start 2P</p>
          <p className="mt-4 font-ps text-s leading-[1.75] break-words">{ornek}</p>
          <p className="mt-4 text-muted">8×8 ızgarada çizilmiş. Boyut hep 8'in katı: 16, 24, 32 px. Böylece bir yazı pikseli tam 2, 3, 4 ekran pikseline oturur. Sekiz satıra nokta sığmadığı için Ö, Ü, İ büyük harfleri küçük çizilir: 8-bit ekranların gerçek kısıtı.</p>
        </PixelContainer>
        <PixelContainer ton="yesil" className="min-w-0 p-5">
          <p className="kicker text-muted">Gövde · Typography/PixelBody</p>
          <p className="mt-3 font-vt text-[calc(var(--body)*1.6)] leading-[1]">VT323</p>
          <p className="mt-4 text-body-l break-words">{ornek}</p>
          <p className="mt-4 text-muted">DEC VT320 terminalinin yazısı. Dar olduğu için uzun metinde okunur; satır aralığı 1,2. Şu an {olcek.k}x ölçekte gövde boyu {[20, 24, 28][olcek.k - 2]} px.</p>
        </PixelContainer>
        <PixelContainer ton="kirmizi" className="min-w-0 p-5">
          <p className="kicker text-muted">HUD · yalnız Latin</p>
          <p className="mt-3 font-hud text-[calc(var(--body)*1.4)] leading-[1.1] [overflow-wrap:anywhere]" lang="en">
            Silkscreen
          </p>
          <p className="mt-4 font-hud text-body-l uppercase" lang="en">
            1UP · Hi-Score · Credit
          </p>
          <p className="mt-4 text-muted">
            Türkçe ğ, ş, ı, İ yok. Bu yüzden yalnız İngilizce etiketlerde kullanılır:{' '}
            <span className="font-hud" aria-label="Silkscreen ile yazılmış ğ ş ı İ; eksik harfler başka yazı tipiyle çıkar">
              ğ ş ı İ
            </span>{' '}
            harfleri başka yazıyla çıkıyor.
          </p>
        </PixelContainer>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <PixelContainer className="min-w-0 p-5">
          <ArcadeText as="h3" boyut="s">
            Boy ölçeği · şu an {olcek.k}x
          </ArcadeText>
          <ol className="m-0 mt-5 grid list-none gap-4 p-0">
            {BOYLAR.map(({ b, ad }) => (
              <li key={b} className="grid min-w-0 grid-cols-1 items-baseline gap-2 sm:grid-cols-[calc(var(--u)*40)_minmax(0,1fr)]">
                <span className="tabnum text-muted">
                  {ad} · {px(b)}px
                </span>
                <ArcadeText boyut={b} className="min-w-0 break-words">
                  Oyun
                </ArcadeText>
              </li>
            ))}
          </ol>
        </PixelContainer>
        <PixelContainer className="min-w-0 p-5">
          <label htmlFor="yazi-ornek" className="kicker block text-muted">
            Örnek metin
          </label>
          <textarea id="yazi-ornek" value={ornek} onChange={(e) => setOrnek(e.target.value)} rows={4} className="px mt-3 block w-[calc(100%-var(--u)*2)] resize-y bg-bg p-3 text-body text-ink" data-golge="0" />
          <p className="mt-4 text-muted">Türkçe büyük harf: CSS text-transform, sayfa dili tr olduğu için i → İ, ı → I yapar. Başlıklardaki "İKSİR" böyle oluşur.</p>
        </PixelContainer>
      </div>
    </Section>
  )
}

/** Bresenham cizgi algoritması: eğik çizgi merdiven basamağıdır */
function bresenham(x0: number, y0: number, x1: number, y1: number) {
  const n: [number, number][] = []
  const dx = Math.abs(x1 - x0)
  const dy = -Math.abs(y1 - y0)
  const sx = x0 < x1 ? 1 : -1
  const sy = y0 < y1 ? 1 : -1
  let e = dx + dy
  for (;;) {
    n.push([x0, y0])
    if (x0 === x1 && y0 === y1) break
    const e2 = 2 * e
    if (e2 >= dy) {
      e += dy
      x0 += sx
    }
    if (e2 <= dx) {
      e += dx
      y0 += sy
    }
  }
  return n
}
/** Orta nokta çember algoritması */
function cember(r: number, cx: number, cy: number) {
  const n: [number, number][] = []
  let x = r
  let y = 0
  let e = 1 - r
  while (x >= y) {
    for (const [a, b] of [
      [x, y],
      [y, x],
      [-y, x],
      [-x, y],
      [-x, -y],
      [-y, -x],
      [y, -x],
      [x, -y],
    ])
      n.push([cx + a, cy + b])
    y++
    if (e < 0) e += 2 * y + 1
    else {
      x--
      e += 2 * (y - x) + 1
    }
  }
  return n
}

/** Madde 6: çapraz kavis değil, basamak */
export function Sekil() {
  const [aci, setAci] = useState(27)
  const [r, setR] = useState(9)
  const W = 32
  const H = 20
  const cizgi = useMemo(() => {
    const rad = (aci * Math.PI) / 180
    const L = 30
    return bresenham(1, H - 2, Math.round(1 + L * Math.cos(rad)), Math.round(H - 2 - L * Math.sin(rad) * 0.6))
  }, [aci])
  const cem = useMemo(() => cember(r, 16, 10), [r])
  const yol = (l: [number, number][]) =>
    l
      .filter(([x, y]) => x >= 0 && y >= 0 && x < W && y < H)
      .map(([x, y]) => `M${x} ${y}h1v1h-1z`)
      .join('')
  const rad = (aci * Math.PI) / 180
  return (
    <Section id="sekil" madde="Madde 6 · Şekil dili" title="Eğri yok, basamak var" ton="camgobegi" lead="Çapraz çizgi ve daire piksel ızgarasına oturtulur: kenar merdiven basamağı gibi tırtıklı kalır, yumuşatılmaz. Köşeler border-radius ile değil, bir piksellik çentikle döner.">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <PixelContainer ton="camgobegi" className="min-w-0 p-5">
          <ArcadeText as="h3" boyut="s" ton="camgobegi">
            Çapraz çizgi
          </ArcadeText>
          <div className="mt-5 grid grid-cols-2 gap-4">
            <figure className="m-0 min-w-0">
              <svg viewBox={`0 0 ${W} ${H}`} className="dama block w-full" shapeRendering="crispEdges" role="img" aria-label={`Bresenham ile ${aci} derecelik basamaklı çizgi, ${cizgi.length} piksel`}>
                <path d={yol(cizgi)} fill="var(--t-cyan)" />
              </svg>
              <figcaption className="mt-2">Basamak · {cizgi.length} piksel</figcaption>
            </figure>
            <figure className="m-0 min-w-0">
              <svg viewBox={`0 0 ${W} ${H}`} className="dama block w-full" shapeRendering="geometricPrecision" role="img" aria-label="Aynı çizgi kenar yumuşatmalı: kullanılmaz">
                <line x1={1.5} y1={H - 1.5} x2={1.5 + 30 * Math.cos(rad)} y2={H - 1.5 - 30 * Math.sin(rad) * 0.6} stroke="var(--t-cyan)" strokeWidth={1} />
              </svg>
              <figcaption className="mt-2">
                <span data-ton="kirmizi" className="text-tx">
                  Yasak:
                </span>{' '}
                yumuşak
              </figcaption>
            </figure>
          </div>
          <div className="mt-5">
            <Aralik label="Açı" value={aci} min={0} max={90} onChange={setAci} format={(v) => `${v}°`} />
          </div>
        </PixelContainer>
        <PixelContainer ton="eflatun" className="min-w-0 p-5">
          <ArcadeText as="h3" boyut="s" ton="eflatun">
            Daire
          </ArcadeText>
          <div className="mt-5 grid grid-cols-2 gap-4">
            <figure className="m-0 min-w-0">
              <svg viewBox={`0 0 ${W} ${H}`} className="dama block w-full" shapeRendering="crispEdges" role="img" aria-label={`Orta nokta algoritmasıyla ${r} piksel yarıçaplı basamaklı daire`}>
                <path d={yol(cem)} fill="var(--t-magenta)" />
              </svg>
              <figcaption className="mt-2">Orta nokta · r {r}</figcaption>
            </figure>
            <figure className="m-0 min-w-0">
              <svg viewBox={`0 0 ${W} ${H}`} className="dama block w-full" shapeRendering="geometricPrecision" role="img" aria-label="Aynı daire kenar yumuşatmalı: kullanılmaz">
                <circle cx={16.5} cy={10.5} r={r} stroke="var(--t-magenta)" strokeWidth={1} fill="none" />
              </svg>
              <figcaption className="mt-2">
                <span data-ton="kirmizi" className="text-tx">
                  Yasak:
                </span>{' '}
                yumuşak
              </figcaption>
            </figure>
          </div>
          <div className="mt-5">
            <Aralik label="Yarıçap" value={r} min={2} max={9} onChange={setR} format={(v) => `${v} piksel`} />
          </div>
        </PixelContainer>
      </div>
      <ul className="m-0 mt-10 grid list-none grid-cols-1 gap-10 p-0 sm:grid-cols-3">
        <PixelContainer as="li" ton="beyaz" golge={0} className="p-5">
          <ArcadeText boyut="s">1 basamak</ArcadeText>
          <p className="mt-3">NES penceresi. Düğme, çip, küçük kutu. Köşe pikseli boş.</p>
        </PixelContainer>
        <PixelContainer as="li" ton="beyaz" golge={0} basamak={2} className="p-5">
          <ArcadeText boyut="s">2 basamak</ArcadeText>
          <p className="mt-3">Büyük panel ve ekran çerçevesi. Kenar iki piksel, köşe iki basamak.</p>
        </PixelContainer>
        <li className="border-[length:var(--u)] border-dashed border-[var(--t-red)] p-5">
          <ArcadeText boyut="s" ton="kirmizi">
            Yasak
          </ArcadeText>
          <p className="mt-3">
            <code>border-radius</code> her yerde 0. Tailwind temasında <code>--radius-*</code> sıfırlandı; <code>rounded-lg</code> diye bir sınıf yok.
          </p>
        </li>
      </ul>
    </Section>
  )
}

/** Madde 7: blok gölge. Bulanıklık ve saydamlık yok */
export function Golge() {
  const [g, setG] = useState(2)
  return (
    <Section id="golge" madde="Madde 7 · Z-ekseni ve gölge" title="Katı blok gölge" lead="Gölge, nesnenin silüetinin sağ alta kaydırılmış tek renkli kopyası. Blur 0, saydamlık yok. Siyah zeminde gölge rengin koyu yarısıdır (#FFEA00 → #7F7500); kâğıtta düz siyah.">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          <ul className="m-0 flex list-none flex-wrap items-start gap-10 p-0">
            {([0, 1, 2, 3, 4] as const).map((n) => (
              <PixelContainer as="li" key={n} ton="sari" dolu golge={n} className="grid size-[calc(var(--u)*28)] place-items-center font-ps text-s">
                {n}
              </PixelContainer>
            ))}
          </ul>
          <p className="mt-8 text-muted">Sayılar gölgenin kaç piksel kaydığını gösterir. Düğmeye basınca gölge 2'den 1'e iner ve düğme bir piksel sağ alta kayar: basma hissi animasyonsuz.</p>
        </div>
        <PixelContainer className="min-w-0 p-5">
          <div className="flex flex-wrap items-center gap-10">
            <PixelContainer ton="yesil" golge={g as 0 | 1 | 2 | 3 | 4} className="px-5 py-4 font-ps text-s uppercase">
              Hazır
            </PixelContainer>
            <div className="bg-[var(--t-green)] px-5 py-4 font-ps text-s text-[var(--bg)] uppercase shadow-[0_8px_24px_rgb(0_255_0/0.45)]" aria-describedby="yasak-golge">
              Yasak
            </div>
          </div>
          <p id="yasak-golge" className="mt-5 text-muted">
            Sağdaki kutu bulanık ve yarı saydam gölgeli: <span className="text-ink">bu stilde kullanılmaz</span>.
          </p>
          <div className="mt-5">
            <Aralik label="Gölge kayması" value={g} min={0} max={4} onChange={setG} format={(v) => `${v} piksel`} />
          </div>
          <pre className="kod mt-5 p-0 text-muted">{`box-shadow: …, ${g}u ${g}u 0 0 var(--lo);\n/* bulanıklık 0, yayılma 0, renk opak */`}</pre>
        </PixelContainer>
      </div>
    </Section>
  )
}
