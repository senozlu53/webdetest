import { useState } from 'react'
import { useDeco } from '../lib/store'
import { kontrast, oran } from '../lib/contrast'
import { ArtDecoCard } from '../components/Cerceve'
import { Aralik, Anahtar, Kod, Section, Secim } from '../components/ui'

const RENKLER = [
  { ad: 'Gece Siyahı', hex: '#0B0B0B', token: 'Color/ArtDecoBlack', rol: 'Ana zemin: lüks otel gecesi', renk: 'text-metin' },
  { ad: 'Derin Lacivert', hex: '#0A192F', token: 'Color/ArtDecoNavy', rol: 'Alternatif zemin: kulüp, mücevher', renk: 'text-metin' },
  { ad: 'Derin Zümrüt', hex: '#062A22', token: 'Color/ArtDecoEmerald', rol: 'Alternatif zemin: restoran', renk: 'text-metin' },
  { ad: 'Parlak Altın', hex: '#D4AF37', token: 'Color/ArtDecoGold', rol: 'Çizgi, çerçeve, başlık', renk: 'text-on-altin' },
  { ad: 'Saf Fildişi', hex: '#FFFFF0', token: 'Color/ArtDecoIvory', rol: 'Gövde metni', renk: 'text-[#0B0B0B]' },
] as const

export const TEMA_RENK = {
  siyah: { ad: 'Gece siyahı', zemin: '#0B0B0B', yuzey: '#151310', metin: '#FFFFF0', soluk: '#C2C2B7', altinYazi: '#D4AF37', cizgi: '#D4AF37' },
  lacivert: { ad: 'Lacivert', zemin: '#0A192F', yuzey: '#102640', metin: '#FFFFF0', soluk: '#C2C6C0', altinYazi: '#D4AF37', cizgi: '#D4AF37' },
  zumrut: { ad: 'Zümrüt', zemin: '#062A22', yuzey: '#0C382E', metin: '#FFFFF0', soluk: '#C1CABC', altinYazi: '#D4AF37', cizgi: '#D4AF37' },
  fildisi: { ad: 'Fildişi', zemin: '#FFFFF0', yuzey: '#F6F1DA', metin: '#1B1709', soluk: '#545143', altinYazi: '#6B4F08', cizgi: '#A0801F' },
} as const

const seviye = (k: number, cizgi = false) => (k >= 7 ? 'AAA' : k >= 4.5 ? 'AA' : k >= 3 ? (cizgi ? 'Çizgi ve büyük yazı' : 'Yalnız büyük yazı') : 'Yetmez')

/** Madde 4: gece siyahı, lacivert, altın ve fildişi */
export function Palet() {
  const { duyur } = useDeco()
  const kopyala = (hex: string) => {
    navigator.clipboard?.writeText(hex).then(
      () => duyur(`${hex} kopyalandı`),
      () => duyur(`Kopyalanamadı, değer: ${hex}`),
    )
  }
  const CIFT: [string, string, string, boolean][] = []
  ;(Object.keys(TEMA_RENK) as (keyof typeof TEMA_RENK)[]).forEach((t) => {
    const v = TEMA_RENK[t]
    CIFT.push([`${v.ad} · fildişi metin / zemin`, v.metin, v.zemin, false], [`${v.ad} · ikincil metin / yüzey`, v.soluk, v.yuzey, false], [`${v.ad} · altın metin / yüzey`, v.altinYazi, v.yuzey, false], [`${v.ad} · altın çizgi / zemin`, v.cizgi, v.zemin, true])
  })
  CIFT.push(['Altın dolgu üstünde siyah yazı (düğme)', '#0B0B0B', '#D4AF37', false], ['Ham altın #D4AF37 fildişi zeminde (kullanılmaz)', '#D4AF37', '#FFFFF0', false])
  return (
    <Section
      id="palet"
      madde="Madde 4 · Renk paleti"
      title="Siyah, lacivert, altın"
      lead="Gece siyahı ve derin lacivert zemin; parlak altın yalnız çizgide, çerçevede ve başlıkta; gövde metni saf fildişi. Altın koyu zeminde 7:1'in üzerinde kontrast verir. Aydınlık Fildişi varyantında metin altını koyu altına döner."
    >
      <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-5" data-renkler="">
        {RENKLER.map((r) => (
          <li key={r.hex} className="grid min-w-0 grid-cols-1 content-start gap-4">
            <div className="relative grid h-[150px] place-items-center border border-altin-soluk" style={{ background: r.hex }} data-renk-ornek={r.hex}>
              <span className={`kicker !text-[12px] ${r.renk}`} style={{ color: r.hex === '#D4AF37' ? '#0B0B0B' : r.hex === '#FFFFF0' ? '#0B0B0B' : undefined }}>
                {r.hex}
              </span>
              <span className="absolute inset-[6px] border border-altin-soluk" aria-hidden="true" />
            </div>
            <div>
              <p className="font-baslik text-[19px] tracking-[0.12em] text-altin-yazi uppercase">{r.ad}</p>
              <p className="mt-1 font-mono text-[12px] break-all text-soluk">{r.token}</p>
              <p className="mt-2 text-[16px] text-metin">{r.rol}</p>
              <button type="button" onClick={() => kopyala(r.hex)} className="mt-3 inline-flex min-h-12 items-center border border-altin-soluk px-4 font-mono text-[13px] text-altin-yazi hover:border-altin-cizgi" aria-label={`${r.ad} ${r.hex}, kopyala`}>
                {r.hex} · kopyala
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mx-auto mt-16 max-w-[820px]" data-altin-grad="">
        <h3 className="text-[clamp(20px,2.4vw,26px)]">Border / ThinGold</h3>
        <div className="mt-6 h-[14px] w-full" style={{ background: 'var(--altin-grad)' }} aria-hidden="true" />
        <p className="mt-4 font-mono text-[13px] leading-[1.9] text-soluk">#8C6D1F 0% · #F3DC82 22% · #D4AF37 46% · #8C6D1F 64% · #F3DC82 84% · #B8942A 100%</p>
        <p className="mx-auto mt-3 max-w-[56ch] text-[17px] text-soluk">İnce altın gradyan yalnız çerçeve çizgisinde (stroke) kullanılır; gradyanlı metin yoktur, yazı düz altın ya da fildişi kalır.</p>
      </div>

      <div className="mt-16 overflow-x-auto" role="region" aria-label="Kontrast tablosu" tabIndex={0}>
        <div className="kart-duz p-5">
          <table className="tablo w-full min-w-[560px] border-collapse text-[16px]" data-kontrast-tablo="">
            <caption>Kontrast · WCAG 2.2</caption>
            <tbody>
              {CIFT.map(([a, y, z, cz]) => {
                const k = kontrast(y, z)
                return (
                  <tr key={a}>
                    <th scope="row" className="font-normal">
                      <span className="mr-3 inline-grid size-9 place-items-center border align-middle font-baslik text-[15px] leading-none" style={{ background: z, color: y, borderColor: '#8C6D1F66' }} aria-hidden="true">
                        A
                      </span>
                      {a}
                    </th>
                    <td className="text-right tabular-nums">{oran(k)}</td>
                    <td className="text-right font-semibold whitespace-nowrap">{seviye(k, cz)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  )
}

type Aile = 'cinzel' | 'playfair' | 'bodoni'
const AILE: Record<Aile, { ad: string; css: string; not: string; agirlik: [number, number]; italik: boolean }> = {
  cinzel: { ad: 'Cinzel', css: 'var(--font-baslik)', not: 'Roma yazıtlarından; başlık, düğme, üst yazı. Küçük harf küçük büyük harf gibi çizildiği için hep büyük harfle kullanılır', agirlik: [400, 900], italik: false },
  playfair: { ad: 'Playfair Display', css: 'var(--font-metin)', not: 'Yüksek kontrastlı geçiş serifi; gövde metni ve alıntı', agirlik: [400, 900], italik: true },
  bodoni: { ad: 'Bodoni Moda', css: 'var(--font-gosteris)', not: 'Optik boyut eksenli Bodoni; büyük rakam, fiyat ve gösteriş başlığı', agirlik: [400, 900], italik: true },
}

/** Madde 5: geniş aralıklı lüks serifler */
export function Yazi() {
  const [aile, setAile] = useState<Aile>('cinzel')
  const [metin, setMetin] = useState('Altın salon')
  const [boy, setBoy] = useState(64)
  const [iz, setIz] = useState(0.14)
  const [agirlik, setAgirlik] = useState(500)
  const [italik, setItalik] = useState(false)
  const a = AILE[aile]
  const buyuk = aile === 'cinzel'
  return (
    <Section
      id="yazi"
      madde="Madde 5 · Tipografi"
      title="Geniş aralıklı serifler"
      lead="Başlıklar Cinzel: Roma yazıtı oranları, geniş harf aralığı. Gösteriş rakamları Bodoni Moda, gövde metni Playfair Display. Üçünde de ğ, ş, ı, İ, ç, ö, ü var. Cinzel'de küçük harfler büyük harfe benzediği için hep büyük harfle yazılır; böylece İ ile I ayrımı kaybolmaz."
    >
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div className="relative isolate flex min-h-[300px] min-w-0 flex-col items-center justify-center bg-yuzey px-6 py-12 text-center" data-yazi-alan="">
          <div className="pointer-events-none absolute inset-2 border border-altin-soluk" aria-hidden="true" />
          <p className="kicker">
            {a.ad} · {agirlik} · {italik && a.italik ? 'italik' : 'düz'}
          </p>
          <p
            className="mt-5 max-w-full text-altin-yazi [overflow-wrap:anywhere]"
            data-yazi-ornek=""
            style={{ fontFamily: a.css, fontSize: `min(${boy}px, 11vw)`, fontWeight: agirlik, fontStyle: italik && a.italik ? 'italic' : 'normal', letterSpacing: `${iz}em`, textTransform: buyuk ? 'uppercase' : 'none', lineHeight: 1.1 }}
          >
            {metin || ' '}
          </p>
          <p className="mt-6 max-w-[46ch] text-[16px] text-soluk">{a.not}</p>
        </div>
        <div className="grid min-w-0 grid-cols-1 content-start gap-7">
          <Secim<Aile>
            legend="Aile"
            name="yazi-aile"
            value={aile}
            onChange={(v) => {
              setAile(v)
              if (!AILE[v].italik) setItalik(false)
            }}
            options={[
              { id: 'cinzel', ad: 'Cinzel' },
              { id: 'playfair', ad: 'Playfair' },
              { id: 'bodoni', ad: 'Bodoni Moda' },
            ]}
          />
          <div className="text-left">
            <label htmlFor="yazi-girdi" className="etiket mb-2 block !text-metin">
              Kendi başlığın
            </label>
            <input id="yazi-girdi" className="alan" value={metin} onChange={(e) => setMetin(e.target.value)} maxLength={28} />
          </div>
          <Aralik label="Boy" value={boy} min={24} max={120} onChange={setBoy} format={(v) => `${v}px`} />
          <Aralik label="Harf aralığı" value={iz} min={0} max={0.5} step={0.01} onChange={setIz} format={(v) => `${v.toFixed(2).replace('.', ',')}em`} />
          <Aralik label="Kalınlık" value={agirlik} min={400} max={900} step={50} onChange={setAgirlik} format={(v) => String(v)} />
          {a.italik ? <Anahtar label="İtalik" checked={italik} onChange={setItalik} /> : <p className="text-left text-[16px] text-soluk">Cinzel'in italiği yoktur.</p>}
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <ArtDecoCard ustyazi="Cinzel · 500" baslik="Başlık" kat={2} stil="basamak">
          <p className="font-baslik text-[clamp(28px,3vw,36px)] tracking-[0.18em] text-metin uppercase">Salon Doré</p>
          <p className="mt-4 text-[16px] text-soluk">Geniş aralık, hep büyük harf. İ ve ı ayrımı korunur: KIRMIZI, İSTANBUL.</p>
        </ArtDecoCard>
        <ArtDecoCard ustyazi="Bodoni Moda" baslik="Gösteriş" kat={2} stil="pah">
          <p className="rakam text-[clamp(44px,5vw,64px)] leading-none text-altin-yazi">1928</p>
          <p className="mt-4 text-[16px] text-soluk">Optik boyut ekseni: büyüdükçe ince çizgiler incelir, küçük boyda kalınlaşır.</p>
        </ArtDecoCard>
        <ArtDecoCard ustyazi="Playfair Display" baslik="Gövde" kat={2} stil="basamak">
          <p className="text-[19px] leading-[1.8] text-metin">Akşamın altın saatinde avizeler yanar; salonun her köşesi aynı ölçüde aydınlanır.</p>
          <p className="mt-4 text-[16px] text-soluk">18–19 piksel, satır 1,8, fildişi. Altın yalnız vurguda.</p>
        </ArtDecoCard>
      </div>

      <div className="mt-16 overflow-x-auto" role="region" aria-label="Yazı ölçeği" tabIndex={0}>
        <div className="kart-duz p-5">
          <table className="tablo w-full min-w-[560px] border-collapse text-[16px]" data-yazi-tablo="">
            <caption>Yazı ölçeği</caption>
            <tbody>
              {[
                ['Başlık 1', 'Cinzel 500, büyük harf, 0,16em', '38–104px'],
                ['Başlık 2', 'Cinzel 500, büyük harf, 0,14em', '26–56px'],
                ['Başlık 3', 'Cinzel 500, büyük harf, 0,14em', '20–26px'],
                ['Üst yazı', 'Cinzel 600, büyük harf, 0,32em', '14px'],
                ['Gösteriş rakamı', 'Bodoni Moda 500, tabular', '44–64px'],
                ['Gövde', 'Playfair Display 400, satır 1,8', '18–19px'],
              ].map(([a, b, c]) => (
                <tr key={a}>
                  <th scope="row" className="font-semibold">
                    {a}
                  </th>
                  <td>{b}</td>
                  <td className="text-right tabular-nums">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Kod label="Yazı yığını" className="mt-8" sar={false}>{`--font-baslik:    'Cinzel Variable', 'Trajan Pro', serif;
--font-metin:     'Playfair Display Variable', 'Didot', serif;
--font-gosteris:  'Bodoni Moda Variable', 'Didot', serif;`}</Kod>
    </Section>
  )
}
