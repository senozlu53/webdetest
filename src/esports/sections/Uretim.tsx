import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { cx } from '../../shared/cx'
import { Bolum } from '../components/Bolum'
import { SlantedButton } from '../components/Dugme'
import { EsportsCard, type Kesim, type Yuzey } from '../components/Kart'
import { LeaderboardTable } from '../components/Liderlik'
import { MacTakvimi } from '../components/Takvim'
import { Anahtar, Aralik, Kod, Secim } from '../components/ui'
import { LivePanel } from '../components/Yayin'
import { CSS_KURALI, CSS_SATIRI, FIGMA_TOKENLAR, MACLAR, PROPLAR, type MacDurum } from '../lib/data'
import type { Vurgu } from '../lib/store'

/* ───────────────────────── Madde 11 · 14 · Bileşenler ───────────────────────── */

function ProplarTablosu() {
  return (
    <div className="overflow-x-auto" role="region" aria-label="Bileşen özellikleri, yatay kaydırılabilir" tabIndex={0} data-proplar="">
      <table className="tablo w-full min-w-[820px]">
        <caption className="t-alt">Bileşen özellikleri</caption>
        <thead>
          <tr>
            <th scope="col">Bileşen</th>
            <th scope="col">Özellik</th>
            <th scope="col">Tip</th>
            <th scope="col">Varsayılan</th>
            <th scope="col">Açıklama</th>
          </tr>
        </thead>
        <tbody>
          {PROPLAR.map((p) => (
            <tr key={p.bilesen + p.ad}>
              <th scope="row" lang="en" className="!font-mono !text-[0.9375rem]">
                {p.bilesen}
              </th>
              <td className="font-mono text-[0.9375rem]" lang="en">
                {p.ad}
              </td>
              <td className="font-mono text-[0.875rem]" lang="en">
                {p.tip}
              </td>
              <td className="font-mono text-[0.875rem]">{p.varsayilan}</td>
              <td>{p.aciklama}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Bilesenler() {
  const [kesim, setKesim] = useState<Kesim>('kose')
  const [yuzey, setYuzey] = useState<Yuzey>('karbon')
  const [kv, setKv] = useState<Vurgu | 'sayfa'>('sayfa')
  const [parlama, setParlama] = useState(true)
  const [egim, setEgim] = useState(12)
  const [sure, setSure] = useState(260)
  const [canli, setCanli] = useState(false)
  const [durum, setDurum] = useState<'hepsi' | MacDurum>('hepsi')
  const maclar = MACLAR.filter((m) => durum === 'hepsi' || m.durum === durum)
  const jsx = `<EsportsCard kesim="${kesim}" yuzey="${yuzey}"${kv === 'sayfa' ? '' : ` vurgu="${kv}"`}${parlama ? '' : ' parlama={false}'}>\n  …\n</EsportsCard>`
  return (
    <Bolum
      id="bilesenler"
      no="09"
      madde="Madde 11 · 14 · Bileşenler"
      baslik="Kart, düğme, skor, yayın"
      lead="Üç bileşen bütün arayüzü taşır: kesik köşeli kart, kayan dilimli düğme, açılı skor tablosu. Yanlarında maç zaman çizelgesi ve canlı yayın paneli. Hepsini elle deneyin: kartın kesimini ve yüzeyini değiştirin, düğmenin üstüne gelin, tabloyu sıralayın, yayını duraklatın."
    >
      <div className="grid grid-cols-1 gap-x-10 gap-y-14 lg:grid-cols-12">
        <div className="grid grid-cols-1 content-start gap-5 lg:col-span-4" data-kart-kontrol="">
          <Secim<Kesim>
            legend="Kesim"
            name="kart-kesim"
            value={kesim}
            onChange={setKesim}
            options={[
              { id: 'kose', ad: 'Köşe' },
              { id: 'egik', ad: 'Eğik' },
              { id: 'duz', ad: 'Düz' },
            ]}
          />
          <Secim<Yuzey>
            legend="Yüzey"
            name="kart-yuzey"
            value={yuzey}
            onChange={setYuzey}
            options={[
              { id: 'karbon', ad: 'Karbon' },
              { id: 'celik', ad: 'Çelik' },
              { id: 'plastik', ad: 'Plastik' },
            ]}
          />
          <Secim<Vurgu | 'sayfa'>
            legend="Vurgu"
            name="kart-vurgu"
            value={kv}
            onChange={setKv}
            options={[
              { id: 'sayfa', ad: 'Sayfa' },
              { id: 'mavi', ad: 'Mavi' },
              { id: 'lime', ad: 'Lime' },
              { id: 'turuncu', ad: 'Turuncu' },
            ]}
          />
          <Anahtar label="Parlama ve gölge" checked={parlama} onChange={setParlama} />
        </div>
        <div className="grid grid-cols-1 content-start gap-6 lg:col-span-8">
          <EsportsCard kesim={kesim} yuzey={yuzey} vurgu={kv === 'sayfa' ? undefined : kv} parlama={parlama} className="p-7" data-kart-onizleme="">
            <p className="t-etiket t-soluk">&lt;EsportsCard&gt;</p>
            <h3 className="t-h3 mt-2">Kesik kenarı izleyen parlama</h3>
            <p className="mt-3 max-w-[54ch] text-[1.1875rem]">Kart iki katmandır: dışta kesik çokgen ve neon kenar, içte doku. Parlama ve sert gölge kesik kenarı izler.</p>
          </EsportsCard>
          <Kod label="Bileşen kullanım örneği" dar>
            {jsx}
          </Kod>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:col-span-12" data-dugme-lab="">
          <div className="grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2 lg:max-w-3xl">
            <Aralik id="bt-egim" label="Düğme eğimi" value={egim} min={0} max={24} onChange={setEgim} format={(v) => `${v}°`} />
            <Aralik id="bt-sure" label="Dilim süresi" value={sure} min={80} max={600} step={20} onChange={setSure} format={(v) => `${v} ms`} />
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-6 pt-2">
            <SlantedButton ton="birincil" ok egim={egim} sure={sure}>
              Kayıt ol
            </SlantedButton>
            <SlantedButton ton="ikincil" ok egim={egim} sure={sure}>
              Maçları gör
            </SlantedButton>
            <SlantedButton ton="turuncu" egim={egim} sure={sure}>
              Canlı izle
            </SlantedButton>
            <SlantedButton ton="hayalet" egim={egim} sure={sure}>
              Kadro
            </SlantedButton>
            <SlantedButton ton="ikincil" disabled egim={egim} sure={sure}>
              Kapalı
            </SlantedButton>
          </div>
          <p className="t-alt">Üzerine gelince ya da klavyeyle odaklanınca neon dilim soldan sağa kayar; yazı düz kalır.</p>
        </div>

        <div className="lg:col-span-12">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <h3 className="t-h3">Skor tablosu</h3>
            <Anahtar label="Canlı güncelle" hint="Puanlar 2,6 saniyede bir değişir" checked={canli} onChange={setCanli} />
          </div>
          <LeaderboardTable canli={canli} />
        </div>

        <div className="grid grid-cols-1 gap-x-10 gap-y-10 lg:col-span-12 lg:grid-cols-12">
          <div className="grid grid-cols-1 content-start gap-6 lg:col-span-4">
            <h3 className="t-h3">Maç takvimi</h3>
            <Secim<'hepsi' | MacDurum>
              legend="Durum"
              name="takvim-durum"
              value={durum}
              onChange={setDurum}
              options={[
                { id: 'hepsi', ad: 'Hepsi' },
                { id: 'bitti', ad: 'Bitti' },
                { id: 'canli', ad: 'Canlı' },
                { id: 'yakinda', ad: 'Yakında' },
              ]}
            />
            <MacTakvimi maclar={maclar} />
          </div>
          <div className="grid grid-cols-1 content-start gap-6 lg:col-span-8">
            <h3 className="t-h3">Canlı yayın paneli</h3>
            <LivePanel />
          </div>
        </div>

        <div className="min-w-0 lg:col-span-12">
          <ProplarTablosu />
        </div>
      </div>
    </Bolum>
  )
}

/* ───────────────────────── Madde 12 · 13 · Figma ───────────────────────── */

export function Figma() {
  const [skew, setSkew] = useState(-12)
  const [kes, setKes] = useState(22)
  const [dolgu, setDolgu] = useState(24)
  const [gen, setGen] = useState(380)
  const [maske, setMaske] = useState(true)
  const agac = `▾ Frame/SlantedCard   Auto Layout ↓ · skew ${skew}° · genişlik ${gen}
  ▾ Mask/SlantMask      ${maske ? `clip-path · kesim ${kes}` : 'maske kapalı'}
    ▾ Content           Auto Layout ↓ · ters skew ${-skew}° · dolgu ${dolgu}
        Title           Fill
        Score           Hug
        Button          Hug`
  return (
    <Bolum
      id="figma"
      no="10"
      madde="Madde 12 · 13 · Figma mimarisi ve belirteçler"
      baslik="Skew ve maske"
      lead="Çerçeveye Skew uygulanır; içerik ters açıyla eğilerek düz okunur. Şekli veren şey Auto Layout ile uyumlu bir maskedir: maske kapanınca kart dikdörtgene döner. Değerleri kaydırın: katman ağacı canlı yazılır."
    >
      <div className="grid grid-cols-1 gap-x-10 gap-y-12 lg:grid-cols-12">
        <div className="grid grid-cols-1 content-start gap-6 lg:col-span-4">
          <Aralik id="figma-skew" label="Skew (yatay eğim)" value={skew} min={-30} max={30} onChange={setSkew} format={(v) => `${v}°`} />
          <Aralik id="figma-kes" label="Maske kesimi" value={kes} min={0} max={60} onChange={setKes} format={(v) => `${v} px`} />
          <Aralik id="figma-dolgu" label="Dolgu (padding)" value={dolgu} min={12} max={40} step={2} onChange={setDolgu} format={(v) => `${v} px`} />
          <Aralik id="figma-gen" label="Genişlik" value={gen} min={240} max={520} step={10} onChange={setGen} format={(v) => `${v} px`} />
          <Anahtar label="Maske" hint="Köşeleri kesen clip-path" checked={maske} onChange={setMaske} />
        </div>
        <div className="figma-tuval min-w-0 lg:col-span-8" data-figma-tuval="">
          <div className="figma-cerceve" style={{ width: gen, maxWidth: '100%', transform: `skewX(${skew}deg)` }} data-figma-cerceve="">
            <EsportsCard kesim={maske ? 'kose' : 'duz'} style={{ ['--kes' as string]: `${kes}px` } as CSSProperties}>
              <div className="flex flex-col gap-4" style={{ padding: dolgu, transform: `skewX(${-skew}deg)` }} data-figma-icerik="">
                <p className="t-etiket t-soluk">Maç · Bo3</p>
                <p className="t-h3">Vektör-9 – Gölge Hattı</p>
                <p className="rakam bg-[#f2f6fa] px-4 py-1 text-[1.5rem] font-black text-[#0d0e12] self-start">1–1</p>
                <SlantedButton dar ton="birincil" className="self-start" data-sessiz="">
                  İzle
                </SlantedButton>
              </div>
            </EsportsCard>
            {!maske ? <span className="figma-maske" aria-hidden="true" /> : null}
          </div>
        </div>
        <div className="min-w-0 lg:col-span-12">
          <p className="t-etiket t-soluk mb-3">Katman ağacı · canlı</p>
          <Kod label="Figma katman ağacı" dar>
            {agac}
          </Kod>
        </div>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-7" data-figma-tokenlar="">
          <div className="overflow-x-auto" role="region" aria-label="Figma belirteçleri, yatay kaydırılabilir" tabIndex={0}>
            <table className="tablo w-full min-w-[560px]">
              <caption className="t-alt">Figma değişkenleri ve stilleri</caption>
              <thead>
                <tr>
                  <th scope="col">Belirteç</th>
                  <th scope="col">Değer</th>
                  <th scope="col">Önizleme</th>
                </tr>
              </thead>
              <tbody>
                {FIGMA_TOKENLAR.map((t) => (
                  <tr key={t.ad} data-token={t.ad}>
                    <th scope="row" lang="en" className="!font-mono !text-[0.9375rem]">
                      {t.ad}
                    </th>
                    <td className="font-mono text-[0.875rem]">{t.deger}</td>
                    <td>
                      <span className="token-onizleme" data-tip={t.tip} data-ad={t.ad} style={t.tip === 'color' ? { background: t.deger } : undefined} aria-hidden="true" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="min-w-0 lg:col-span-5">
          <p className="t-etiket t-soluk mb-3">DTCG · tokens/esports.tokens.json</p>
          <Kod label="Belirteç dosyasından bir kesit" dar>
            {`{
  "Color": {
    "EsportsNeonGreen": { "$type": "color", "$value": "#39FF14" }
  },
  "Texture": {
    "CarbonFiber": { "$type": "string", "$value": "SVG 12×12 çapraz örgü · #0D0E12 zemin, #141720 kare, #1B1F27 parlak iplik, #08090C gölge iplik" }
  },
  "Shape": {
    "SlantedCard": {
      "$type": "string",
      "$value": "polygon(0 0, 100% 0, calc(100% − 16px) 100%, 0 100%)"
    }
  }
}`}
          </Kod>
        </div>
      </div>
    </Bolum>
  )
}

/* ───────────────────────── Madde 15 · CSS ───────────────────────── */

const RENK = (v: string) => {
  const m = v.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  return m
    ? '#' +
        [m[1], m[2], m[3]]
          .map((x) => (+x).toString(16).padStart(2, '0'))
          .join('')
          .toUpperCase()
    : v
}

export function Css() {
  const kutu = useRef<HTMLDivElement>(null)
  const px = useRef<HTMLDivElement>(null)
  const [gen, setGen] = useState(420)
  const [o, setO] = useState({ clip: '', kenar: '', kenarRenk: '', zemin: '', aci: '', aciPx: '' })
  useLayoutEffect(() => {
    const hesapla = () => {
      const e = kutu.current!
      const cs = getComputedStyle(e)
      const r = e.getBoundingClientRect()
      const rp = px.current!.getBoundingClientRect()
      const dx = 0.05 * r.width
      const egimPx = parseFloat(getComputedStyle(px.current!).getPropertyValue('--egim')) || 16
      setO({
        clip: cs.clipPath,
        kenar: cs.borderLeftWidth,
        kenarRenk: RENK(cs.borderLeftColor),
        zemin: RENK(cs.backgroundColor),
        aci: ((Math.atan2(dx, r.height) * 180) / Math.PI).toFixed(1).replace('.', ','),
        aciPx: ((Math.atan2(egimPx, rp.height) * 180) / Math.PI).toFixed(1).replace('.', ','),
      })
    }
    hesapla()
    const ro = new ResizeObserver(hesapla)
    ro.observe(kutu.current!)
    ro.observe(px.current!)
    return () => ro.disconnect()
  }, [gen])
  return (
    <Bolum
      id="css"
      no="11"
      madde="Madde 15 · CSS ve Tailwind yapısı"
      baslik="Tek çokgen, bir şerit"
      lead="Kesik kartın özü üç şeydir: sağ kenarı eğen çokgen, karbon zemin ve sol kenarda dört piksellik neon şerit. Yüzde ile verilen eğim genişlikle değişir; bu yüzden tasarım sistemi eğimi piksel olarak tutar."
    >
      <div className="grid grid-cols-1 gap-x-10 gap-y-10 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-7">
          <p className="t-etiket t-soluk mb-3">CSS</p>
          <Kod label="clip-path kuralı" dar>
            {`${CSS_KURALI}\n/* Tailwind */\n${CSS_SATIRI}`}
          </Kod>
          <div className="mt-6 max-w-[640px]">
            <Aralik id="css-gen" label="Kutu genişliği" value={gen} min={240} max={640} step={10} onChange={setGen} format={(v) => `${v} px`} />
          </div>
          <div ref={kutu} className={cx(CSS_SATIRI, 'mt-6 max-w-full p-6 pr-[8%] text-[#f2f6fa]')} style={{ width: gen }} data-tailwind-kutu="">
            <p className="t-etiket t-soluk">Canlı kutu</p>
            <p className="mt-2 text-[1.1875rem]">Bu kutu yukarıdaki sınıflardan başka bir şey taşımaz. Genişliği değiştirin: yüzde ile eğilen kenarın açısı da değişir.</p>
          </div>
        </div>
        <div className="min-w-0 lg:col-span-5">
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3" data-css-olcum="">
            <dt className="t-etiket t-soluk">clip-path</dt>
            <dd className="rakam m-0 font-mono text-[0.9375rem] break-words" data-olcu="clip">
              {o.clip}
            </dd>
            <dt className="t-etiket t-soluk">border-left</dt>
            <dd className="rakam m-0 font-mono text-[0.9375rem]" data-olcu="kenar">
              {o.kenar}
            </dd>
            <dt className="t-etiket t-soluk">border-color</dt>
            <dd className="rakam m-0 font-mono text-[0.9375rem]" data-olcu="kenarRenk">
              {o.kenarRenk}
            </dd>
            <dt className="t-etiket t-soluk">background</dt>
            <dd className="rakam m-0 font-mono text-[0.9375rem]" data-olcu="zemin">
              {o.zemin}
            </dd>
            <dt className="t-etiket t-soluk">Eğik kenar açısı (%)</dt>
            <dd className="rakam m-0 font-bold" data-olcu="aci">
              {o.aci}°
            </dd>
            <dt className="t-etiket t-soluk">Eğik kenar açısı (px)</dt>
            <dd className="rakam m-0 font-bold" data-olcu="aciPx">
              {o.aciPx}°
            </dd>
          </dl>
          <div className="mt-6" ref={px} data-px-kart="">
            <EsportsCard kesim="egik" className="p-5">
              <p className="t-etiket t-soluk">Sabit açı</p>
              <p className="mt-2 text-[1.1875rem]">
                Aynı eğim <code className="font-mono">--egim: 16px</code> olarak tutulur; genişlik ne olursa olsun açı yalnız yüksekliğe bağlıdır.
              </p>
            </EsportsCard>
          </div>
        </div>
      </div>
    </Bolum>
  )
}
