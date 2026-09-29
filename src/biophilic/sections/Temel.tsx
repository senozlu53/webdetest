import { useId, useMemo, useState, type CSSProperties } from 'react'
import { cx } from '../../shared/cx'
import { oran } from '../lib/contrast'
import { ANA_RENK, SEKILLER } from '../lib/data'
import { DOKU_ALFA, useBiophilic, type Doku } from '../lib/store'
import { IKON_GRUPLARI, SIMGE_AD, type SimgeAd } from '../lib/simge'
import { MODLAR, MOD_SIRA, palet as hesapPalet, saatMetni } from '../lib/zaman'
import { ZamanSahnesi } from '../components/Ambient'
import { BiophilicCard } from '../components/Biophilic'
import { MOD_IKON } from '../components/Header'
import { Ikon } from '../components/Ikon'
import { Aralik, Belir, Kod, Secim, Section } from '../components/ui'

/* ───────────────────────── Madde 4 · Palet ───────────────────────── */

export function Palet() {
  const c = useBiophilic()
  const dk = c.doku === 'yok' ? 0 : DOKU_ALFA
  return (
    <Section
      id="palet"
      ikon="gunes"
      madde="Madde 4 · Renk paleti"
      title={
        <>
          Gökyüzü, orman, güneş ve <span className="vurgu">beyaz</span>
        </>
      }
      lead="Dört ana renk saf tanımlarıyla durur. Günün saatine göre Sabah, Öğle, Akşam ve Gece modlarına karışırlar; modlar arası geçiş sürekli yapılır. Metin hiçbir zaman bu ana renklerin üzerine düz yazılmaz: cam panelin altındaki katman okunabilirliği her saat için çözer."
    >
      <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-4" data-ana-renkler="">
        {ANA_RENK.map((r, i) => (
          <Belir key={r.hex} as="li" gecikme={i * 100} className="flex">
            <div className="cam flex w-full flex-col p-6" data-ana-renk={r.hex}>
              <div className="blob grid h-32 place-items-center border border-[var(--kontrol)]" style={{ background: r.hex }} role="img" aria-label={`${r.ad} örneği ${r.hex}`}>
                <span className="cam cam-opak !rounded-full px-4 py-1 font-mono text-[15px] font-medium">{r.hex}</span>
              </div>
              <h3 className="baslik mt-5 text-[24px]">{r.ad}</h3>
              <p className="mt-1.5 text-[15.5px] text-soluk">{r.rol}</p>
              <p className="mt-3 flex items-start gap-2 text-[14.5px]">
                <Ikon ad="tik" boyut={18} className="mt-1 text-vurgu" />
                <span>{r.yazi}</span>
              </p>
            </div>
          </Belir>
        ))}
      </ul>

      <div className="cam cam-opak mt-[var(--aralik)] max-w-[820px] p-6 sm:p-8">
        <h3 className="baslik text-[clamp(26px,2.8vw,36px)]">Dört mod</h3>
        <p className="mt-2 max-w-[62ch] text-soluk">Her kutu kendi saatinin görünümünü çizer. Sayılar, çözücünün o saat için seçtiği cam katmanıdır.</p>
      </div>
      <ul className="m-0 mt-8 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 xl:grid-cols-4" data-modlar="">
        {MOD_SIRA.map((m, i) => {
          const md = MODLAR[m]
          const p = hesapPalet(md.saat, { hedef: c.hedef, doku: dk })
          return (
            <Belir key={m} as="li" gecikme={i * 100} className="flex">
              <ZamanSahnesi saat={md.saat} className="w-full border border-[var(--cam-kenar)]" data-mod-kutu={m} icKlas="relative z-10 p-4 pt-24">
                <div className="cam cam-opak p-5">
                  <p className="kicker font-mono !text-[11.5px] !tracking-[0.06em] normal-case">{md.token}</p>
                  <h4 className="baslik mt-1 flex items-center gap-2 text-[26px]">
                    <Ikon ad={MOD_IKON[m]} boyut={24} />
                    {md.ad}
                  </h4>
                  <div className="mt-3 flex flex-wrap gap-1.5" role="img" aria-label={`${md.ad} renkleri: ${[...md.gok, ...md.yaprak, md.su, md.isik].join(', ')}`}>
                    {[...md.gok, ...md.yaprak, md.su, md.isik].map((h, k) => (
                      <span key={k} className="size-6 rounded-full border border-[var(--kontrol)]" style={{ background: h }} />
                    ))}
                  </div>
                  <p className="mt-3 text-[14.5px] text-soluk" data-mod-cam={m}>
                    cam %{Math.round(p.cam.alfa * 100)} · {p.cam.acik ? 'açık' : 'koyu'} · yazı {oran(p.cam.oran)}
                  </p>
                </div>
              </ZamanSahnesi>
            </Belir>
          )
        })}
      </ul>
    </Section>
  )
}

/* ───────────────────────── Madde 5 · Yazı ───────────────────────── */

export function Yazi() {
  const [agirlik, setAgirlik] = useState(300)
  const [satir, setSatir] = useState(1.72)
  return (
    <Section
      id="yazi"
      ikon="ruzgar"
      madde="Madde 5 · Tipografi"
      title={
        <>
          Temiz, modern ve <span className="vurgu">organik</span> sans-serif
        </>
      }
      lead={
        <>
          Başlıklarda Outfit: geometrik ama yuvarlak, hafif ağırlıkta ferah. Metinde Inter: küçük boylarda bile okunaklı. <span lang="en">Plus Jakarta Sans</span> da aynı ilkeye uyar; bu sayfa yalnız Outfit ve Inter yükler.
        </>
      }
    >
      <div className="grid grid-cols-1 items-start gap-x-10 gap-y-8 lg:grid-cols-12">
        <div className="cam min-w-0 p-7 sm:p-10 lg:col-span-7" data-yazi-ornek="">
          <p className="kicker">Outfit · başlık</p>
          <p className="mt-4 font-baslik text-[clamp(40px,6vw,76px)] leading-[1.04] tracking-[-0.025em]" style={{ fontWeight: agirlik }} data-outfit-ornek={agirlik}>
            Ferah bir sabah, sakin bir nefes.
          </p>
          <p className="mt-6 font-baslik text-[22px] tracking-[0.01em]" style={{ fontWeight: agirlik }}>
            0123456789 · ğüşiöçİı · ₺ 1.250,00
          </p>
          <div className="mt-8 max-w-[420px]">
            <Aralik label="Ağırlık" value={agirlik} min={100} max={900} step={50} onChange={setAgirlik} format={(v) => String(v)} />
          </div>
        </div>
        <div className="cam min-w-0 p-7 sm:p-10 lg:col-span-5" data-metin-ornek="">
          <p className="kicker">Inter · metin</p>
          <p className="mt-4 max-w-[52ch] text-[17px]" style={{ lineHeight: satir }} data-satir={satir}>
            Doğal ışık, gün boyunca yön ve renk değiştirir. Arayüz de aynı yavaşlıkla değişmeli: göz, ani bir sıçrama yerine geçişi fark etmeden izlemeli. Satır aralığı cömert tutulur; her paragraf, nefes alacak kadar boşlukla ayrılır.
          </p>
          <div className="mt-8 max-w-[320px]">
            <Aralik label="Satır aralığı" value={satir} min={1.3} max={2} step={0.02} onChange={setSatir} format={(v) => v.toFixed(2).replace('.', ',')} />
          </div>
        </div>
      </div>
      <div className="cam mt-[var(--aralik)] overflow-x-auto p-6 sm:p-9" role="region" aria-label="Tip ölçeği" tabIndex={0}>
        <table className="tablo w-full min-w-[640px] border-collapse text-[16px]" data-tip-olcegi="">
          <caption>Tip ölçeği</caption>
          <thead>
            <tr>
              {['Rol', 'Yazı tipi', 'Boy / satır', 'Ağırlık', 'Örnek'].map((b) => (
                <th key={b} scope="col" className="etiket">
                  {b}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(
              [
                ['Görüntü', 'Outfit', '84 / 1,02', '300', 'Ferah', 'font-baslik text-[34px] font-light'],
                ['Başlık', 'Outfit', '56 / 1,14', '500', 'Gün doğar', 'font-baslik text-[28px] font-medium'],
                ['Alt başlık', 'Outfit', '28 / 1,12', '500', 'Nefes al', 'font-baslik text-[22px] font-medium'],
                ['Gövde', 'Inter', '17 / 1,72', '400', 'Işık yön değiştirir.', 'text-[17px]'],
                ['Küçük', 'Inter', '15 / 1,6', '400', 'Son sulama 2 gün önce', 'text-[15px]'],
                ['Üst yazı', 'Outfit', '13 / 1,5', '600, +0,16 em', 'Madde 5', 'kicker'],
              ] as const
            ).map(([a, b, c, d, e, k]) => (
              <tr key={a}>
                <th scope="row" className="font-medium">
                  {a}
                </th>
                <td>{b}</td>
                <td className="tabular-nums">{c}</td>
                <td className="tabular-nums">{d}</td>
                <td className={k}>{e}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  )
}

/* ───────────────────────── Madde 6 · Şekil ───────────────────────── */

function hedefRadius(id: (typeof SEKILLER)[number]['id']) {
  const s = SEKILLER.find((x) => x.id === id)!
  const [h, v = h] = s.r.split('/').map((x) =>
    x
      .trim()
      .split(' ')
      .map((n) => parseFloat(n)),
  )
  const dort = (a: number[]) => (a.length === 1 ? [a[0], a[0], a[0], a[0]] : a)
  return { h: dort(h), v: dort(v) }
}

export function Hucre({ className }: { className?: string }) {
  const g = useId()
  return (
    <svg viewBox="0 0 200 200" className={cx('overflow-visible', className)} role="img" aria-label="Hücre çizimi: zar, çekirdek ve koful" data-hucre="">
      <defs>
        <radialGradient id={g} cx="42%" cy="38%" r="70%">
          <stop offset="0" style={{ stopColor: 'var(--isik-renk)' }} stopOpacity=".95" />
          <stop offset=".6" style={{ stopColor: 'var(--su-renk)' }} stopOpacity=".85" />
          <stop offset="1" style={{ stopColor: 'var(--yaprak-1)' }} stopOpacity=".9" />
        </radialGradient>
      </defs>
      <path d="M100 12C150 8 190 42 188 100C186 156 146 192 96 188C46 184 12 146 14 96C16 48 50 16 100 12Z" fill={`url(#${g})`} stroke="rgb(255 255 255 / .9)" strokeWidth="3" />
      <path d="M100 22C146 20 178 50 176 100" fill="none" stroke="rgb(255 255 255 / .7)" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="96" cy="96" rx="30" ry="27" style={{ fill: 'var(--yaprak-2)' }} opacity=".92" />
      <circle cx="90" cy="92" r="9" style={{ fill: 'var(--yaprak-3)' }} />
      <circle cx="140" cy="60" r="12" fill="rgb(255 255 255 / .55)" />
      <circle cx="56" cy="138" r="10" fill="rgb(255 255 255 / .5)" />
      <circle cx="144" cy="140" r="7" fill="rgb(255 255 255 / .5)" />
      <path d="M60 60C72 54 84 56 92 62M120 132C130 138 140 138 150 132" fill="none" style={{ stroke: 'var(--yaprak-3)' }} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}

export function Sekil() {
  const [id, setId] = useState<(typeof SEKILLER)[number]['id']>('hucre')
  const [t, setT] = useState(100)
  const h = hedefRadius(id)
  const k = t / 100
  const lerp = (a: number, b: number) => Math.round(a + (b - a) * k)
  const hv = h.h.map((x) => lerp(50, x))
  const vv = h.v.map((x) => lerp(50, x))
  const radius = `${hv.map((x) => `${x}%`).join(' ')} / ${vv.map((x) => `${x}%`).join(' ')}`
  return (
    <Section
      id="sekil"
      ikon="tohum"
      madde="Madde 6 · Şekil dili"
      title={
        <>
          Hücre ve tohum gibi <span className="vurgu">akışkan</span> formlar
        </>
      }
      lead="Doğada düz kenar ve dik açı nadirdir. Kartlar, düğmeler ve görseller daire ve daireden türeyen formlarla çizilir; köşeler birbirinden farklı yarıçapta olduğu için yüzeyler biraz “yaşar”. Üzerine gelince biçim çok yavaş başka bir hücreye dönüşür."
    >
      <div className="grid grid-cols-1 items-start gap-x-10 gap-y-8 lg:grid-cols-12">
        <div className="cam min-w-0 p-7 sm:p-9 lg:col-span-7" data-sekil-sahne="">
          <div className="grid grid-cols-1 items-center gap-8 sm:grid-cols-2">
            <div className="grid place-items-center">
              <div
                className="grid aspect-square w-full max-w-[280px] place-items-center border border-[rgb(255_255_255/.8)] p-6 text-center transition-[border-radius] duration-[1200ms] ease-in-out"
                style={{ borderRadius: radius, background: 'linear-gradient(150deg, var(--isik-renk), var(--su-renk) 55%, var(--yaprak-1))', boxShadow: 'var(--golge-2)', color: '#0F2E1B' }}
                data-sekil-onizleme={radius}
              >
                <span className="cam cam-opak !rounded-full px-5 py-1.5 font-baslik text-[24px] font-medium">{SEKILLER.find((s) => s.id === id)?.ad}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <Secim<(typeof SEKILLER)[number]['id']> legend="Biçim" name="sk-bicim" value={id} onChange={setId} options={SEKILLER.map((s) => ({ id: s.id, ad: s.ad }))} />
              <Aralik label="Organiklik" value={t} min={0} max={100} step={5} onChange={setT} format={(v) => `%${v}`} />
              <p className="text-[15px] text-soluk">{SEKILLER.find((s) => s.id === id)?.aciklama}. Organiklik 0’da mükemmel daire, 100’de seçilen biçim.</p>
            </div>
          </div>
          <Kod label="border-radius çıktısı" className="mt-7 !text-[13.5px]">{`/* Radius/BiophilicOrganic */\nborder-radius: ${radius};`}</Kod>
        </div>
        <div className="grid min-w-0 grid-cols-1 content-start gap-6 lg:col-span-5">
          <BiophilicCard
            kicker="Hücre"
            baslik="Zar, çekirdek, koful"
            gorsel={
              <div className="grid place-items-center py-5" style={{ background: 'color-mix(in srgb, var(--cam-tint) 30%, transparent)' }}>
                <Hucre className="w-44" />
              </div>
            }
          >
            <p className="text-[16px] text-soluk">Dış zar tek bir akışkan çizgi; içindeki çekirdek ve kofullar aynı dairesel dilde. İkon ve ilüstrasyonlar buradan türer.</p>
          </BiophilicCard>
          <div className="cam p-6" data-hucre-bolunme="">
            <p className="kicker">Hücre bölünmesi</p>
            <svg viewBox="0 0 320 110" className="mt-2 w-full" role="img" aria-label="İki hücrenin yavaşça birleşip ayrılması">
              <defs>
                <filter id="bf-goo" x="-20%" y="-40%" width="140%" height="180%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="b" />
                  <feColorMatrix in="b" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" />
                </filter>
              </defs>
              <g filter="url(#bf-goo)" style={{ fill: 'var(--yaprak-2)' }}>
                <circle className="bol-a" cx="112" cy="55" r="34" />
                <circle className="bol-b" cx="182" cy="55" r="34" />
              </g>
            </svg>
            <p className="mt-2 text-[15px] text-soluk">Motion açıkken 8 saniyelik döngüyle iki hücre birleşir ve ayrılır. Kapalıyken yan yana durur.</p>
          </div>
        </div>
      </div>
    </Section>
  )
}

/* ───────────────────────── Madde 7 · Derinlik ───────────────────────── */

export function Derinlik() {
  const { palet: p, saat } = useBiophilic()
  const [elev, setElev] = useState(60)
  const ust = 90 - elev
  const x = Math.round(p.golgeX * (1 + ust / 40))
  const y = Math.round(10 + ust * 0.28)
  const blur = Math.round(28 + ust * 0.7)
  const yayil = -Math.round(12 + ust * 0.12)
  const alfa = (0.14 + ust * 0.0016).toFixed(2)
  const golge = `${x}px ${y}px ${blur}px ${yayil}px rgb(8 52 40 / ${alfa})`
  const gunesSol = Math.round(p.gunes.x * 100)
  return (
    <Section
      id="derinlik"
      ikon="isik"
      madde="Madde 7 · Z ekseni ve gölge"
      title={
        <>
          Işık yukarıdan vurur, gölge <span className="vurgu">geniş ve hafif</span> düşer
        </>
      }
      lead="Güneş her zaman yukarıdadır; gölge aşağı düşer, kenarları yumuşaktır, yayılımı geniştir. Yatay kayma günün saatinden gelir: sabah gölge sağa, akşam sola düşer. Sert, dar ve koyu gölge kullanılmaz."
    >
      <div className="grid grid-cols-1 items-start gap-x-10 gap-y-8 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-7">
          <ZamanSahnesi className="border border-[var(--cam-kenar)]" icKlas="relative z-10 grid min-h-[380px] place-items-center p-6" data-golge-sahne="">
            <span className="absolute top-5 grid size-11 -translate-x-1/2 place-items-center rounded-full border-2 border-[#0f2e1b] bg-white text-[#0f2e1b]" style={{ left: `${gunesSol}%` }} aria-hidden="true">
              <Ikon ad={p.gunes.gunduz ? 'gunes' : 'ay'} boyut={24} />
            </span>
            <div className="cam cam-opak w-[min(100%,340px)] p-7 text-center" style={{ boxShadow: `${golge}, inset 0 1px 0 var(--cam-parla)` }} data-golge={golge}>
              <p className="kicker">Yüzen panel</p>
              <p className="baslik mt-1 text-[26px]">Güneş {elev}° yukarıda</p>
              <p className="mt-2 text-[15px] text-soluk">
                gölge x {x} px · y {y} px · blur {blur} px
              </p>
            </div>
          </ZamanSahnesi>
        </div>
        <div className="grid min-w-0 grid-cols-1 content-start gap-6 lg:col-span-5">
          <div className="cam p-6 sm:p-8">
            <Aralik label="Güneş yüksekliği" value={elev} min={10} max={90} step={5} onChange={setElev} format={(v) => `${v}°`} />
            <p className="mt-4 text-[15.5px] text-soluk" data-golge-x={p.golgeX}>
              Şu an {saatMetni(saat)}: güneş yatayda %{gunesSol} konumunda; gölge {p.golgeX > 0 ? 'sağa' : p.golgeX < 0 ? 'sola' : 'tam aşağı'} {Math.abs(p.golgeX)} px kayar.
            </p>
          </div>
          <div className="cam p-6 sm:p-8">
            <p className="kicker">Karşılaştırma</p>
            <div className="mt-4 grid grid-cols-2 gap-5">
              <div className="grid gap-2 text-center">
                <div className="grid h-24 place-items-center rounded-2xl bg-white text-[#0f2e1b]" style={{ boxShadow: '0 4px 4px rgb(0 0 0 / .5)' }}>
                  <Ikon ad="kapat" boyut={22} />
                </div>
                <p className="text-[14px]">Sert, dar, koyu</p>
              </div>
              <div className="grid gap-2 text-center">
                <div className="grid h-24 place-items-center rounded-2xl bg-white text-[#0f2e1b]" style={{ boxShadow: golge }}>
                  <Ikon ad="tik" boyut={22} />
                </div>
                <p className="text-[14px]">Geniş, hafif</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="cam mt-[var(--aralik)] overflow-x-auto p-6 sm:p-9" role="region" aria-label="Gölge kademeleri" tabIndex={0}>
        <table className="tablo w-full min-w-[640px] border-collapse text-[16px]" data-golge-tablo="">
          <caption>Gölge kademeleri (Shadow/SunSoft)</caption>
          <thead>
            <tr>
              {['Kademe', 'Kullanım', 'Değer'].map((b) => (
                <th key={b} scope="col" className="etiket">
                  {b}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['--golge-1', 'Düğme, çip, iç yüzey', 'x güneşe göre · y 6 · blur 22 · yayılım −8'],
              ['--golge-2', 'Cam panel, kart', 'x ×1,6 · y 16 · blur 44 · yayılım −14'],
              ['--golge-3', 'Yüzen menü, diyalog', 'x ×2,4 · y 30 · blur 72 · yayılım −20'],
            ].map(([a, b, c]) => (
              <tr key={a}>
                <th scope="row" className="font-mono text-[14px] font-medium">
                  {a}
                </th>
                <td>{b}</td>
                <td className="text-soluk">{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  )
}

/* ───────────────────────── Madde 8 · Doku ───────────────────────── */

const DOKULAR: { id: Doku; ad: string; aciklama: string; ikon: SimgeAd }[] = [
  { id: 'yok', ad: 'Düz', aciklama: 'Doku yok; yalnız cam.', ikon: 'goz' },
  { id: 'su', ad: 'Su dalgalanması', aciklama: 'Suyun dibindeki ışık ağı (caustics).', ikon: 'dalga' },
  { id: 'yaprak', ad: 'Yaprak damarı', aciklama: 'Ana damar ve dallanan ince damarlar.', ikon: 'yaprak' },
  { id: 'ahsap', ad: 'Ahşap', aciklama: 'Yatay lif çizgileri.', ikon: 'ahsap' },
]

export function DokuBolumu() {
  const { doku, setDoku, hedef } = useBiophilic()
  const { saat } = useBiophilic()
  const dokusuz = useMemo(() => hesapPalet(saat, { hedef, doku: 0 }), [saat, hedef])
  const dokulu = useMemo(() => hesapPalet(saat, { hedef, doku: DOKU_ALFA }), [saat, hedef])
  return (
    <Section
      id="doku"
      ikon="dalga"
      madde="Madde 8 · Doku ve yüzey"
      title={
        <>
          Su, yaprak damarı ve <span className="vurgu">ahşap lifi</span>
        </>
      }
      lead="Doku, cam panelin içinde ve metnin altında durur; en fazla %7 alfa ile. Yine de metin okunabilirliği bozulmasın diye çözücü dokuyu en kötü zemin hesabına katar: doku açıkken cam biraz daha opak olur."
    >
      <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-4" data-dokular="">
        {DOKULAR.map((d, i) => (
          <Belir key={d.id} as="li" gecikme={i * 100} className="flex">
            <div data-doku={d.id} className="flex w-full">
              <label className={cx('cam cam-opak flex min-h-[220px] w-full cursor-pointer flex-col p-6 outline-offset-4 focus-within:outline-3 focus-within:outline-[var(--odak)]', doku === d.id && 'ring-2 ring-[var(--kontrol)]')} data-doku-kart={d.id}>
                <input type="radio" name="doku-sec" className="sr-only" checked={doku === d.id} onChange={() => setDoku(d.id)} />
                <span className="flex items-center gap-2 kicker">
                  <Ikon ad={d.ikon} boyut={20} />
                  {doku === d.id ? 'Seçili' : 'Seç'}
                </span>
                <span className="baslik mt-2 text-[24px]">{d.ad}</span>
                <span className="mt-2 text-[15.5px] text-soluk">{d.aciklama}</span>
                {doku === d.id ? <Ikon ad="tik" boyut={22} className="mt-auto self-end text-vurgu" /> : null}
              </label>
            </div>
          </Belir>
        ))}
      </ul>
      <div className="cam mt-[var(--aralik)] p-6 sm:p-9" data-doku-cozucu="">
        <div className="grid grid-cols-1 gap-x-10 gap-y-3 md:grid-cols-2">
          <p className="text-[16.5px]">
            Dokusuz: cam <b>%{Math.round(dokusuz.cam.alfa * 100)}</b> · yazı <b>{oran(dokusuz.cam.oran)}</b>
          </p>
          <p className="text-[16.5px]" data-doku-alfa={dokulu.cam.alfa}>
            Dokulu: cam <b>%{Math.round(dokulu.cam.alfa * 100)}</b> · yazı <b>{oran(dokulu.cam.oran)}</b>
          </p>
        </div>
        <p className="mt-3 text-[15px] text-soluk">
          Saat {saatMetni(saat)} için hesaplandı. Hedef {hedef === 7 ? '7' : '4,5'}:1; ikisi de hedefi karşılar.
        </p>
      </div>
    </Section>
  )
}

/* ───────────────────────── Madde 9 · İkonografi ───────────────────────── */

export function Ikonlar() {
  const [kalin, setKalin] = useState(1.4)
  const [boy, setBoy] = useState(32)
  return (
    <Section
      id="ikonlar"
      ikon="yaprak"
      madde="Madde 9 · İkonografi"
      title={
        <>
          Güneş, yaprak, damla ve <span className="vurgu">nefes</span>
        </>
      }
      lead="İnce konturlu, dolgusuz ikonlar; 32 × 32 ızgarada, uçları ve köşeleri yuvarlak. Çizgi kalınlığı ölçekle değişmez, bu yüzden 20 px’te de 64 px’te de aynı inceliktedir."
    >
      <div className="grid grid-cols-1 items-start gap-x-10 gap-y-8 lg:grid-cols-12">
        <div className="cam min-w-0 p-7 sm:p-9 lg:col-span-8" data-cekirdek="">
          <p className="kicker">Çekirdek dörtlü</p>
          <ul className="m-0 mt-5 grid list-none grid-cols-2 gap-5 p-0 sm:grid-cols-4">
            {(['gunes', 'yaprak', 'damla', 'nefes'] as const).map((a) => (
              <li key={a} className="cam-ic grid place-items-center gap-3 p-5 text-center">
                <Ikon ad={a} boyut={64} kalin={kalin} className="text-vurgu" />
                <span className="font-baslik text-[18px] font-medium">{SIMGE_AD[a]}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="cam grid min-w-0 content-start gap-6 p-7 sm:p-9 lg:col-span-4">
          <Aralik label="Çizgi kalınlığı" value={kalin} min={1} max={2.4} step={0.1} onChange={setKalin} format={(v) => v.toFixed(1).replace('.', ',')} />
          <Secim<string> legend="İkon boyu" name="ik-boy" value={String(boy)} onChange={(v) => setBoy(+v)} options={[24, 32, 40].map((n) => ({ id: String(n), ad: `${n} px` }))} />
        </div>
      </div>
      <div className="mt-[var(--aralik)] grid grid-cols-1 gap-6" data-ikon-gruplari="">
        {IKON_GRUPLARI.map((g) => (
          <div key={g.ad} className="cam p-6 sm:p-8">
            <h3 className="baslik text-[24px]">{g.ad}</h3>
            <ul className="m-0 mt-5 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-[repeat(var(--kol),minmax(0,1fr))]" style={{ ['--kol' as string]: Math.min(g.liste.length, 8) } as CSSProperties}>
              {g.liste.map((a) => (
                <li key={a} className="cam-ic grid min-h-[104px] place-items-center gap-2 p-3 text-center">
                  <Ikon ad={a} boyut={boy} kalin={kalin} />
                  <span className="text-[13.5px] leading-tight">{SIMGE_AD[a]}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
