import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { cx } from '../../shared/cx'
import { useSketch } from '../lib/store'
import { yol } from '../lib/rough'
import { Ayarlar } from '../components/Header'
import { Ikon } from '../components/Icons'
import { RoughBox, useCizgi } from '../components/Rough'
import { Aralik, Anahtar, KaralamaKutu, RoughButton } from '../components/Controls'
import { Not } from '../components/Not'
import { Kod, Section } from '../components/ui'

/** Kalemle yazılıyormuş gibi çizilen yol: pathLength=1 + stroke-dashoffset, kare kare (steps) */
function CizilenYol({ d, tohum, sure, adim, sw = 4, renk = 'var(--murekkep)', gecikme = 0 }: { d: string; tohum: number; sure: number; adim: number; sw?: number; renk?: string; gecikme?: number }) {
  const { k, kusurCarpan } = useCizgi()
  const izler = useMemo(() => yol(d, { kusur: 1.1 * kusurCarpan, sw: sw * k, stroke: 'currentColor', tohum, cokluCizgi: false }), [d, tohum, k, kusurCarpan, sw])
  return (
    <g style={{ color: renk }}>
      {izler.map((p, j) => (
        <path key={j} d={p.d} stroke="currentColor" strokeWidth={p.sw} fill="none" pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 1, animation: `yaz-ciz ${sure}s steps(${adim}, end) ${gecikme}s forwards` }} />
      ))}
    </g>
  )
}

/** Madde 16: kare kare titreme (stop-motion) */
export function Hareket() {
  const s = useSketch()
  const [fps, setFps] = useState(7)
  const [surekli, setSurekli] = useState(true)
  const [ciz, setCiz] = useState(0)
  const [sure, setSure] = useState(1.6)
  const [onay, setOnay] = useState(false)
  const kareSure = 3 / fps
  return (
    <Section
      id="hareket"
      madde="Madde 16 · Hareket dili"
      title="Kare kare"
      lead="Çizgi sürekli akmaz, kareler arasında atlar: aynı şekil üç ayrı denemeyle çizilir ve sırayla gösterilir (stop-motion). Kalem çizimi de yumuşak değil, adım adım ilerler (steps). Hareket kapalıyken her şey ilk karede durur."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="grid min-w-0 content-start gap-4">
          <RoughBox tohum={801} kare={3} sekil="yuvarlak" r={18} cizgi={2.6} className={cx('grid min-h-[190px] place-items-center p-6', surekli && 'titre-hep')} style={{ ['--kare-sure' as string]: `${kareSure}s` } as CSSProperties} data-titre-ornek="">
            <div className="text-center">
              <Ikon ad="fincan" boyut={64} hep={surekli} kare={3} />
              <p className="mt-2 font-el text-[40px] leading-none font-bold text-murekkep">Titreyen kutu</p>
            </div>
          </RoughBox>
          <div className="grid gap-4">
            <Anahtar label="Sürekli titret" checked={surekli} onChange={setSurekli} />
            <Aralik label="Kare hızı" value={fps} min={2} max={12} onChange={setFps} format={(v) => `${v} kare/sn`} />
          </div>
          <p className="text-[15px] text-soluk">
            3 kare × {kareSure.toFixed(2).replace('.', ',')} sn döngü. Parlaklık değişmez, yalnız çizgi konumu kayar: saniyede 3 parlamayı aşmaz (WCAG 2.3.1). Hareket {s.hareket ? 'açık' : 'kapalı: titreme yok'}.
          </p>
        </div>
        <div className="grid min-w-0 content-start gap-4">
          <RoughBox tohum={810} kare={3} sekil="yuvarlak" r={18} className="p-4">
            <svg viewBox="0 0 220 150" className="block h-auto w-full fill-none [stroke-linecap:round] [stroke-linejoin:round]" role="img" aria-label="Kalemle adım adım çizilen fincan" key={ciz} data-ciz={ciz}>
              <CizilenYol d="M40 60 H140 V104 Q140 136 108 136 H72 Q40 136 40 104 Z" tohum={5} sure={sure} adim={20} sw={5} />
              <CizilenYol d="M140 70 Q176 68 176 92 Q176 116 140 112" tohum={9} sure={sure * 0.5} adim={10} sw={5} gecikme={sure} />
              <CizilenYol d="M18 144 Q100 150 190 142" tohum={13} sure={sure * 0.4} adim={8} sw={5} gecikme={sure * 1.5} />
              <CizilenYol d="M62 44 Q76 30 62 14 M92 44 Q106 28 92 10 M120 44 Q134 30 120 16" tohum={17} sure={sure * 0.6} adim={12} sw={4.5} renk="var(--kirmizi)" gecikme={sure * 1.9} />
            </svg>
          </RoughBox>
          <Aralik label="Süre" value={sure} min={0.6} max={3} step={0.2} onChange={setSure} format={(v) => `${v.toFixed(1).replace('.', ',')} sn`} />
          <RoughButton boy="k" onClick={() => setCiz((c) => c + 1)} ikon={<Ikon ad="kalem" boyut={22} />}>
            Yeniden yaz
          </RoughButton>
          <p className="text-[15px] text-soluk">steps(20): kalem her karede bir parça ilerler; her çizgi sırayla başlar.</p>
        </div>
        <div className="grid min-w-0 content-start gap-4">
          <div className="flex items-center justify-between gap-2" aria-label="Üç kare" role="group">
            {[0, 1, 2].map((i) => (
              <figure key={i} className="m-0 grid justify-items-center gap-1">
                <RoughBox tohum={1 + i * 13} sekil="yuvarlak" r={10} cizgi={2.2} className="size-[84px]" pad={5} />
                <figcaption className="font-daktilo text-[13px] font-bold">kare {i + 1}</figcaption>
              </figure>
            ))}
          </div>
          <p className="text-[15px] text-soluk">Aynı kutu, üç tohum (1 · 14 · 27). Üstüne gelinen her öğe bu üç kareyi döndürür.</p>
          <div className="flex flex-wrap gap-4">
            <RoughButton tur="murekkep">Üstüme gel</RoughButton>
            <RoughButton>Ben de</RoughButton>
          </div>
          <KaralamaKutu label="Karalayarak işaretle" hint="Sekiz karede, adım adım dolar." checked={onay} onChange={setOnay} />
          <Kod label="Kare animasyonu CSS" sar={false}>{`.kare[data-i='0'] { animation: kare-0 ${kareSure.toFixed(2)}s linear infinite }
@keyframes kare-0 { 0%,33.32% {opacity:1}
                    33.33%,100% {opacity:0} }`}</Kod>
        </div>
      </div>
    </Section>
  )
}

/** Madde 17: çizgi kalınlığı ekranla oranını korur; SVG'ler viewBox ile esner */
export function Mobil() {
  const s = useSketch()
  const [vw, setVw] = useState(() => window.innerWidth)
  const [boyut, setBoyut] = useState(48)
  useEffect(() => {
    const f = () => setVw(window.innerWidth)
    window.addEventListener('resize', f)
    return () => window.removeEventListener('resize', f)
  }, [])
  return (
    <Section
      id="mobil"
      madde="Madde 17 · Responsive"
      title="Kalem küçülünce kalınlaşmaz"
      lead="Ekran daralınca kutular küçülür ama kalem aynı kalınlıkta kalırsa çizgi kütleye baskın çıkar. Burada kalınlık ekranla orantılı: 1100 piksel ve üstünde tam, daha dar ekranda %62'ye kadar incelir. İkonlar ise viewBox içinde çizildiği için boyutla birlikte kendiliğinden ölçeklenir."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="grid min-w-0 content-start gap-5">
          <div className="grid grid-cols-2 gap-6">
            {[
              ['Sabit 3px', 3],
              ['Oransal', 3 * s.olcek],
            ].map(([a, w], i) => (
              <figure key={String(a)} className="m-0 grid gap-2">
                <div className="relative grid h-[120px] place-items-center" data-kalinlik={i ? 'oransal' : 'sabit'}>
                  <svg className="absolute inset-0 size-full overflow-visible" fill="none" aria-hidden="true">
                    <rect x="4" y="4" width="calc(100% - 8px)" height="calc(100% - 8px)" rx="14" stroke="var(--komur)" strokeWidth={w as number} />
                  </svg>
                  <span className="font-daktilo text-[13px] font-bold tabular-nums">{(w as number).toFixed(2).replace('.', ',')} px</span>
                </div>
                <figcaption className="text-[15px]">{a}</figcaption>
              </figure>
            ))}
          </div>
          <p className="text-[16px]" data-olcek={s.olcek}>
            Bu ekran <b className="tabular-nums">{vw}</b> px → çizgi ölçeği <b className="tabular-nums">{s.olcek.toFixed(2).replace('.', ',')}</b> (kalem {(2 * s.olcek).toFixed(2).replace('.', ',')} px).
          </p>
          <table className="el-tablo w-full text-[15px]">
            <caption className="kicker pb-2 text-left">Ölçek tablosu</caption>
            <tbody>
              {[
                [320, 0.62],
                [480, 0.62],
                [768, 0.7],
                [1024, 0.93],
                [1100, 1],
              ].map(([w, k]) => (
                <tr key={w} className="border-b-2 border-komur/20">
                  <th scope="row" className="py-1.5 text-left font-bold">
                    {w} px
                  </th>
                  <td className="text-right tabular-nums">× {String(k).replace('.', ',')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid min-w-0 content-start gap-5">
          <Aralik label="İkon boyu" value={boyut} min={16} max={120} onChange={setBoyut} format={(v) => `${v}px`} />
          <div className="flex flex-wrap items-end gap-5" data-viewbox="">
            {[boyut / 2, boyut, boyut * 1.6].map((b, i) => (
              <Ikon key={i} ad="fincan" boyut={Math.round(b)} sw={3} />
            ))}
          </div>
          <p className="text-[15px] text-soluk">viewBox="0 0 48 48": çizgi 3 birim; 24 pikselde ~1,5 px, 96 pikselde ~6 px. Oran hep aynı.</p>
          <Kod label="Ölçek hesabı" sar={false}>{`olcek = clamp(0.62, innerWidth / 1100, 1)
strokeWidth = temel × olcek`}</Kod>
        </div>
      </div>
    </Section>
  )
}

const OKU = 'Bir kahve içmek, bugünün ilk kararıdır: sütlü mü, sütsüz mü, şekerli mi? Karar verirken acele etmemek gerekir; iyi kahve, iyi düşüncenin yavaş kardeşidir.'

/** Madde 18: gövde okunaklı sans, el yazısı yalnız süs */
export function Erisim() {
  const s = useSketch()
  return (
    <Section
      id="erisim"
      madde="Madde 18 · Erişilebilirlik"
      title="El yazısı süs, sans yazı"
      lead="El yazısı fontları disleksili okuyucular için harfleri birbirine karıştırabilir. Bu yüzden okunacak her yer okunaklı sans (Atkinson Hyperlegible Next); el yazısı yalnız başlıkta, notta ve dekorasyonda. Başlık yazısı da ayardan okunaklı sansa çevrilebilir."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="grid min-w-0 content-start gap-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <RoughBox tohum={901} kare={3} sekil="yuvarlak" r={14} className="p-5" cizgi={2.2}>
              <p className="kicker text-kirmiziK">
                <Not tur="crossed-off" sure={500}>
                  Yapma
                </Not>
              </p>
              <p className="mt-3 font-not text-[19px] leading-[1.5]" aria-hidden="true" data-hand-body="">
                {OKU}
              </p>
              <p className="mt-3 text-[14px] text-soluk">Patrick Hand 19px: ince, harfler yakın.</p>
            </RoughBox>
            <RoughBox tohum={902} kare={3} sekil="yuvarlak" r={14} className="p-5" cizgi={2.2}>
              <p className="kicker text-murekkep">Yap</p>
              <p className="mt-3 text-[18px] leading-[1.65]" data-sans-body="">
                {OKU}
              </p>
              <p className="mt-3 text-[14px] text-soluk">Atkinson 18px, satır aralığı 1,65: harf biçimleri ayrık.</p>
            </RoughBox>
          </div>
          <Anahtar label="Denemek için: başlıkları okunaklı yap" hint="Yukarıdaki iki başlık sans olur, sayfa yerleşimi bozulmaz." checked={s.baslik === 'okunur'} onChange={(v) => s.setBaslik(v ? 'okunur' : 'el')} />
          <ul className="m-0 grid list-disc gap-2 pl-5 text-[16px]">
            <li>Gövde 18 px, satır 1,65, harf aralığı +0,005em, yalnız sola dayalı; italik ve alt çizgili uzun metin yok.</li>
            <li>El yazısı 28 pikselin altına inmez; kenar notları (Patrick Hand) 19 pikselden küçük değil.</li>
            <li>Durum hiçbir zaman yalnız renkle verilmez: karalanan kutu, kalem ikonu, "AÇIK / KAPALI" yazısı.</li>
            <li>Odak: 3 piksel kesik mürekkep halkası; kırmızı kalem yalnız çizgi, küçük yazı koyu kırmızı.</li>
            <li>Bütün hareket kapatılabilir; titreme parlaklık değiştirmez.</li>
          </ul>
        </div>
        <div className="grid min-w-0 content-start gap-6">
          <RoughBox tohum={910} kare={3} sekil="yuvarlak" r={18} className="tarama tarama-mavi p-6">
            <p className="font-el text-[44px] leading-none font-bold text-murekkep">Varyantlar</p>
            <div className="mt-5">
              <Ayarlar onek="er-" />
            </div>
          </RoughBox>
          <RoughButton boy="k" onClick={() => document.getElementById('ust')?.scrollIntoView()} ikon={<Ikon ad="ok" boyut={30} className="-rotate-90" />}>
            Başa dön
          </RoughButton>
        </div>
      </div>
    </Section>
  )
}
