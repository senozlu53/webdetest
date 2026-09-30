import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { cx } from '../../shared/cx'
import { HealthBar } from '../components/Bar'
import { Bolum } from '../components/Bolum'
import { EsyaKunye, InventoryGrid } from '../components/Envanter'
import { Ikon } from '../components/Ikon'
import { Madalyon, Panel } from '../components/Suslu'
import { Anahtar, Aralik, Buton, Kod } from '../components/ui'
import { CSS_SATIRI, ENV_BOYUT, FIGMA_TOKENLAR, PROPLAR } from '../lib/data'
import { useOyun } from '../lib/oyun'
import { useFantasy } from '../lib/store'

/* ───────────────────────── Madde 11 · 14 · Bileşenler ───────────────────────── */

function ProplarTablosu() {
  return (
    <div className="overflow-x-auto" role="region" aria-label="Bileşen özellikleri, yatay kaydırılabilir" tabIndex={0} data-proplar="">
      <table className="tablo w-full min-w-[760px] border-collapse">
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

const KULLANIM = `<InventoryGrid
  yuvalar={yuvalar}      // (Esya | null)[] · ${ENV_BOYUT} yuva
  secili={secili}
  onSec={setSecili}
  onTasi={(a, b) => takas(a, b)}
/>

<HealthBar deger={84} azami={120} tur="can" />
<HealthBar deger={46} azami={80} tur="mana" />

<FantasyModal acik={acik} onAcikDegisti={setAcik} baslik="Kadim Çağrı" aciklama="Görev parşömeni">
  …
</FantasyModal>`

export function Bilesenler() {
  const { yuvalar, secili, sec, tasi, k, ozet, hasarAl, iyiles, manaHarca, xpEkle, sifirla, setGorevAcik } = useOyun()
  const { duyur } = useFantasy()
  const kap = useRef<HTMLDivElement>(null)
  const [olcu, setOlcu] = useState({ sutun: 0, yuva: 0 })
  useLayoutEffect(() => {
    const el = kap.current?.querySelector<HTMLElement>('.envanter')
    if (!el) return
    const oku = () => {
      const s = el.querySelector<HTMLElement>('.slot')
      setOlcu({ sutun: getComputedStyle(el).gridTemplateColumns.split(' ').length, yuva: Math.round((s?.getBoundingClientRect().width ?? 0) * 10) / 10 })
    }
    oku()
    const ro = new ResizeObserver(oku)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return (
    <Bolum
      id="bilesenler"
      no="09"
      madde="Madde 11 · 14 · Bileşenler"
      baslik="Envanter, çubuk, parşömen"
      lead="Üç bileşen bütün oyun arayüzünü taşır. Envanterde bir eşyayı sürükleyin ya da klavyeyle Enter ile alıp başka yuvada bırakın; iksiri kullanın, çubuğun dolduğunu izleyin; parşömen penceresini açın."
    >
      <div className="grid grid-cols-1 gap-x-10 gap-y-12 lg:grid-cols-12">
        <Panel yuzey="tas" className="p-6 lg:col-span-7" as="section" aria-label="Sırt çantası" data-envanter-panel="">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <h3 className="t-h3">Sırt çantası</h3>
            <p className="rakam t-alt" data-envanter-ozet="">
              {ozet.dolu} / {ENV_BOYUT} yuva · {ozet.agirlik} / {ozet.kapasite} kg
            </p>
          </div>
          <div ref={kap} className="mt-4">
            <InventoryGrid yuvalar={yuvalar} secili={secili} onSec={sec} onTasi={tasi} />
          </div>
          <p className="t-alt mt-3" data-envanter-olcu="">
            <span className="rakam">{olcu.sutun}</span> sütun · yuva <span className="rakam">{olcu.yuva}</span> px. Ok tuşları gezer, Enter eşyayı alır ve bırakır, Esc vazgeçer.
          </p>
        </Panel>
        <div className="lg:col-span-5">
          <EsyaKunye i={secili} esya={secili === null ? null : yuvalar[secili]} />
        </div>

        <Panel yuzey="tas" className="p-6 lg:col-span-6" as="section" aria-label="Can ve mana çubukları" data-cubuk-panel="">
          <h3 className="t-h3">Can, mana, deneyim</h3>
          <div className="mt-5 grid gap-5" data-cubuklar="">
            <HealthBar deger={k.can} azami={k.canAzami} tur="can" />
            <HealthBar deger={k.mana} azami={k.manaAzami} tur="mana" />
            <HealthBar deger={k.xp} azami={k.xpAzami} tur="deneyim" etiket="Deneyim" />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Buton
              ton="kan"
              onClick={() => {
                hasarAl(20)
                duyur(`Can ${Math.max(0, k.can - 20)} / ${k.canAzami}`)
              }}
              data-hasar=""
            >
              Hasar al −20
            </Buton>
            <Buton
              ton="altin"
              onClick={() => {
                iyiles(25)
                duyur(`Can ${Math.min(k.canAzami, k.can + 25)} / ${k.canAzami}`)
              }}
              data-iyiles=""
            >
              İyileş +25
            </Buton>
            <Buton
              onClick={() => {
                manaHarca(15)
                duyur(`Mana ${Math.max(0, k.mana - 15)} / ${k.manaAzami}`)
              }}
              data-mana-harca=""
            >
              Mana harca −15
            </Buton>
            <Buton onClick={() => xpEkle(15)} data-xp="">
              Deneyim +15
            </Buton>
            <Buton ton="yalin" onClick={sifirla} data-sifirla="">
              Sıfırla
            </Buton>
          </div>
          <p className="t-alt mt-4">Sarı iz hasarın geriden geldiğini gösterir: dolgu hemen düşer, iz 1,2 saniyede yetişir.</p>
        </Panel>

        <Panel yuzey="parsomen" className="p-6 lg:col-span-6" as="section" aria-label="Parşömen penceresi" data-modal-panel="">
          <div className="flex items-start gap-4">
            <Ikon ad="parsomen" boy={56} />
            <div className="min-w-0">
              <h3 className="t-h3">Parşömen penceresi</h3>
              <p className="t-etiket t-soluk mt-1">&lt;FantasyModal&gt;</p>
            </div>
          </div>
          <p className="mt-4 text-[1.0625rem]">Pencere iki ruloyla gelir: parşömen ortadan dışarı doğru açılır, kapanırken tersine sarılır. Odak pencerenin içinde kalır; Esc ya da dış tıklama kapatır. Hareket kapalıysa pencere anında belirir.</p>
          <blockquote className="m-0 mt-5 border-l-4 border-[color:#5c1010] pl-4 italic" data-modal-onizleme="">
            <p className="t-etiket not-italic">Önizleme · Kadim Çağrı</p>
            <p className="mt-1">Sınırdaki gözcü kulesinden üç gündür ışık gelmiyor…</p>
            <ul className="m-0 mt-3 flex list-none flex-wrap gap-4 p-0 not-italic" aria-label="Ödüller">
              <li className="flex items-center gap-2">
                <Ikon ad="altin" boy={28} /> <span className="rakam">50 altın</span>
              </li>
              <li className="flex items-center gap-2">
                <Ikon ad="iksir-kan" boy={28} /> <span className="rakam">1 iksir</span>
              </li>
            </ul>
          </blockquote>
          <div className="mt-5 flex flex-wrap gap-3">
            <Buton ton="altin" ikon="parsomen" onClick={() => setGorevAcik(true)} data-modal-ac="">
              Görev parşömenini aç
            </Buton>
          </div>
        </Panel>
      </div>

      <div className="mt-14 grid gap-y-10">
        <ProplarTablosu />
        <div className="min-w-0 max-w-[760px]">
          <p className="t-etiket t-soluk mb-3">Kullanım</p>
          <Kod label="Bileşen kullanım örneği" dar>
            {KULLANIM}
          </Kod>
        </div>
      </div>
    </Bolum>
  )
}

/* ───────────────────────── Madde 12 · 13 · Figma ───────────────────────── */

export function Figma() {
  const [gen, setGen] = useState(360)
  const [dolgu, setDolgu] = useState(24)
  const [aralik, setAralik] = useState(16)
  const [kose, setKose] = useState(true)
  const { k } = useOyun()
  const { sade } = useFantasy()
  const agac = `▾ Frame/FantasyPanel   Auto Layout ↓ · aralık ${aralik} · dolgu ${dolgu} · genişlik ${gen}
${
  kose
    ? `  ▸ Corner/TopLeft      Absolute · x −8 · y −8
  ▸ Corner/TopRight     Absolute · x −8 · y −8 · aynala X
  ▸ Corner/BottomLeft   Absolute · x −8 · y −8 · aynala Y
  ▸ Corner/BottomRight  Absolute · x −8 · y −8 · aynala X, Y
`
    : '  (köşe süsleri gizli)\n'
}  ▾ Content              Auto Layout ↓ · Fill container
      Medallion         Hug
      Title             Fill
      HealthBar         Fill
      Button            Hug`
  return (
    <Bolum
      id="figma"
      no="10"
      madde="Madde 12 · 13 · Figma mimarisi ve belirteçler"
      baslik="Köşeye çivilenen süs"
      lead="Panelin içeriği Auto Layout ile akar; dört köşe süsü ise Absolute Position ile köşelere çivilenir. Genişliği, dolguyu ve aralığı değiştirin: içerik yeniden akar, süsler köşede kalır."
    >
      <div className="grid grid-cols-1 gap-x-10 gap-y-12 lg:grid-cols-12">
        <div className="grid content-start gap-6 lg:col-span-4">
          <Aralik id="figma-gen" label="Genişlik" value={gen} min={240} max={560} step={10} onChange={setGen} format={(v) => `${v} px`} />
          <Aralik id="figma-dolgu" label="Dolgu (padding)" value={dolgu} min={12} max={40} step={2} onChange={setDolgu} format={(v) => `${v} px`} />
          <Aralik id="figma-aralik" label="Aralık (gap)" value={aralik} min={8} max={32} step={2} onChange={setAralik} format={(v) => `${v} px`} />
          <Anahtar label="Köşe süsleri" hint="Absolute Position ile sabitli dört vektör" checked={kose} onChange={setKose} />
          {kose && sade ? (
            <p className="t-alt" data-figma-sade="">
              Süslemeler şu an sade: köşeler gizli. Ayarlar’dan “Tam” seçin.
            </p>
          ) : null}
        </div>
        <div className="figma-tuval min-w-0 lg:col-span-8" data-figma-tuval="">
          <Panel yuzey="tas" suslu={kose} className="figma-cerceve" as="div" style={{ width: gen, maxWidth: '100%', padding: dolgu }} data-figma-cerceve="">
            <div className="flex flex-col" style={{ gap: aralik }} data-figma-icerik="">
              <Madalyon ikon="kalkan" boy={64} />
              <p className="t-h3">{k.ad}</p>
              <HealthBar deger={k.can} azami={k.canAzami} tur="can" />
              <Buton ton="altin" className="self-start" data-sessiz="">
                Seç
              </Buton>
            </div>
          </Panel>
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
            <table className="tablo w-full min-w-[520px] border-collapse">
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
          <p className="t-etiket t-soluk mb-3">DTCG · tokens/fantasy.tokens.json</p>
          <Kod label="Belirteç dosyasından bir kesit" dar>
            {`{
  "Color": {
    "FantasyGold": { "$type": "color", "$value": "#D4AF37" }
  },
  "Texture": {
    "Parchment": { "$type": "string", "$value": "fractalNoise 0,018 · 4 oktav · en çok %42 kahve leke + %24 ince tane" }
  },
  "Effects": {
    "MagicGlow": {
      "$type": "shadow",
      "$value": { "color": "rgba(212, 175, 55, 0.55)", "offsetX": "0px", "offsetY": "0px", "blur": "12px", "spread": "2px" }
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

/** Tailwind gölge yığınındaki saydam (sıfır) katmanları eler, yalnız görünenleri döndürür */
const anlamli = (v: string) => {
  const parcalar: string[] = []
  let d = 0
  let bas = 0
  for (let i = 0; i < v.length; i++) {
    if (v[i] === '(') d++
    else if (v[i] === ')') d--
    else if (v[i] === ',' && d === 0) {
      parcalar.push(v.slice(bas, i).trim())
      bas = i + 1
    }
  }
  parcalar.push(v.slice(bas).trim())
  const g = parcalar.filter((x) => !/^rgba\(0, 0, 0, 0\)/.test(x))
  return g.length ? g.join(', ') : v
}

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
  const { tema, kontrast } = useFantasy()
  const [o, setO] = useState({ genislik: '', kenar: '', zemin: '', golge: '' })
  useEffect(() => {
    const e = kutu.current
    if (!e) return
    const cs = getComputedStyle(e)
    setO({ genislik: cs.borderTopWidth, kenar: RENK(cs.borderTopColor), zemin: RENK(cs.backgroundColor), golge: anlamli(cs.boxShadow) })
  }, [tema, kontrast])
  return (
    <Bolum id="css" no="11" madde="Madde 15 · CSS ve Tailwind yapısı" baslik="Üç yardımcı sınıf, bir pencere" lead="Bir taş pencerenin özü üç sınıftır: dört piksellik altın kenar, zindan zemini ve içe doğru koyu gölge. Tam paneller aynı fikri gradyan kenar, doku ve filigree ile zenginleştirir.">
      <div className="grid grid-cols-1 gap-x-10 gap-y-10 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-6">
          <p className="t-etiket t-soluk mb-3">Sınıflar</p>
          <Kod label="Tailwind sınıfları" dar>
            {`<div className="${CSS_SATIRI}">`}
          </Kod>
          <div ref={kutu} className={cx(CSS_SATIRI, 'tas-yerel mt-6 p-6')} data-tailwind-kutu="">
            <p className="t-etiket t-soluk">Canlı kutu</p>
            <p className="mt-2 text-[1.125rem]">Bu kutu yukarıdaki üç sınıftan başka bir şey taşımaz.</p>
          </div>
          <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2" data-css-olcum="">
            <dt className="t-etiket t-soluk">border-width</dt>
            <dd className="rakam m-0 font-mono text-[0.9375rem]" data-olcu="genislik">
              {o.genislik}
            </dd>
            <dt className="t-etiket t-soluk">border-color</dt>
            <dd className="rakam m-0 font-mono text-[0.9375rem]" data-olcu="kenar">
              {o.kenar}
            </dd>
            <dt className="t-etiket t-soluk">background-color</dt>
            <dd className="rakam m-0 font-mono text-[0.9375rem]" data-olcu="zemin">
              {o.zemin}
            </dd>
            <dt className="t-etiket t-soluk">box-shadow</dt>
            <dd className="m-0 font-mono text-[0.9375rem] break-words" data-olcu="golge">
              {o.golge}
            </dd>
          </dl>
        </div>
        <div className="min-w-0 lg:col-span-6">
          <p className="t-etiket t-soluk mb-3">Tam sürüm · .panel</p>
          <Kod label="Panel CSS özeti" dar>
            {`.panel {
  border: 4px solid transparent;
  background:
    linear-gradient(var(--yz), var(--yz)) padding-box,
    linear-gradient(135deg, #f2dc8b, #d4af37 32%,
      #8f7220 58%, #d4af37 82%, #f2dc8b) border-box;
  box-shadow: inset 0 0 24px var(--ic),
              0 8px 24px rgb(0 0 0 / .45);
}
.panel::before { background-image: var(--doku); }   /* SVG gürültü */
.panel::after  { inset: 6px; border: 1px solid rgb(212 175 55 / .38); }`}
          </Kod>
          <Panel yuzey="tas" className="mt-6 p-6" data-tam-panel="">
            <p className="t-etiket t-soluk">Canlı panel</p>
            <p className="mt-2 text-[1.125rem]">Aynı pencere: gradyan kenar, doku, iç çizgi ve dört filigree köşesiyle.</p>
          </Panel>
          <div className="mt-6 overflow-x-auto" role="region" aria-label="Belirteç eşlemesi, yatay kaydırılabilir" tabIndex={0}>
            <table className="tablo w-full min-w-[420px] border-collapse">
              <caption className="t-alt">Belirteç, CSS değişkeni, Tailwind</caption>
              <thead>
                <tr>
                  <th scope="col">Belirteç</th>
                  <th scope="col">Değişken</th>
                  <th scope="col">Sınıf</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['FantasyGold', '--altin', 'border-[#D4AF37]'],
                  ['DungeonStone', '--tas', 'bg-[#1E1E24]'],
                  ['InnerShadow', '—', 'shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]'],
                  ['Parchment', '--doku-parsomen', '.panel[data-yuzey=parsomen]'],
                ].map(([a, b, c]) => (
                  <tr key={a}>
                    <th scope="row" lang="en" className="!font-mono !text-[0.9375rem]">
                      {a}
                    </th>
                    <td className="font-mono text-[0.875rem]">{b}</td>
                    <td className="font-mono text-[0.875rem] break-all">{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Bolum>
  )
}
