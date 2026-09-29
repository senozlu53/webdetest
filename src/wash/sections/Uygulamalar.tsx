import { useEffect, useMemo, useState } from 'react'
import { cx } from '../../shared/cx'
import { useWash } from '../lib/store'
import { MAKALE, RUHLAR, URUNLER, type Ruh } from '../lib/data'
import { leke } from '../lib/firca'
import { Sahne } from '../components/Baykus'
import { FircaCizgi, WashButton } from '../components/Firca'
import { Ikon } from '../components/Ikon'
import { PIGMENT, WatercolorBackground } from '../components/Leke'
import { GorununceAc, MaskeliResim } from '../components/Reveal'
import { FircaAralik, Secim, Section } from '../components/ui'

/** Boyalı damla: seçim düğmesi. Seçili olan büyür ve kalın altı çizgi alır; ad yazıyla da verilir */
function RuhDamla({ r, secili, onSec }: { r: Ruh; secili: boolean; onSec: () => void }) {
  const yol = useMemo(() => leke(48, 48, r.id.length * 7 + 3, { dalga: 0.16, n: 8 }), [r.id])
  return (
    <label className="cip !gap-2.5 !py-2 !pr-5 !pl-2" data-on={secili ? '' : undefined} style={{ ['--c' as string]: PIGMENT[r.renk] } as React.CSSProperties}>
      <input type="radio" className="sr-only" name="ruh" value={r.id} checked={secili} onChange={onSec} />
      <svg viewBox="0 0 48 48" width="40" height="40" aria-hidden="true" className="overflow-visible">
        <g filter="url(#wc-ikon)">
          <path d={yol} fill={PIGMENT[r.renk]} fillOpacity={r.renk === 'murekkep' ? 0.55 : 0.8} style={{ mixBlendMode: 'var(--blend)' as never }} />
        </g>
      </svg>
      {r.ad}
    </label>
  )
}

const ADIMLAR = [
  { ad: 'Nefes al', sn: 4 },
  { ad: 'Tut', sn: 2 },
  { ad: 'Nefes ver', sn: 6 },
] as const

/** Madde 10 · 11: psikoloji ve zihin sağlığı uygulaması */
export function Sukunet() {
  const { hareket, duyur } = useWash()
  const [ruh, setRuh] = useState<Ruh | null>(null)
  const [calis, setCalis] = useState(false)
  const [adim, setAdim] = useState(0)
  const [kalan, setKalan] = useState<number>(ADIMLAR[0].sn)
  const [dongu, setDongu] = useState(0)
  const [yazi, setYazi] = useState('')
  const [hata, setHata] = useState('')
  const [notlar, setNotlar] = useState<{ ruh: Ruh | null; metin: string }[]>([])
  useEffect(() => {
    if (!calis) return
    const t = window.setInterval(() => {
      setKalan((k) => {
        if (k > 1) return k - 1
        setAdim((a) => {
          const n = (a + 1) % ADIMLAR.length
          if (n === 0) setDongu((d) => d + 1)
          setKalan(ADIMLAR[n].sn)
          return n
        })
        return 0
      })
    }, 1000)
    return () => window.clearInterval(t)
  }, [calis])
  const kaydet = () => {
    const m = yazi.trim()
    if (m.length < 3) {
      setHata(m ? 'Biraz daha yaz: en az birkaç harf. Acele yok.' : 'Kâğıt henüz boş. Aklından geçen tek bir sözcük bile yeter.')
      document.getElementById('gunluk-alan')?.focus()
      return
    }
    setHata('')
    setNotlar((l) => [{ ruh, metin: m }, ...l].slice(0, 3))
    setYazi('')
    duyur('Günlüğe eklendi')
  }
  const olcek = !hareket ? (adim === 1 ? 1 : adim === 0 ? 1 : 0.6) : undefined
  const durdur = () => {
    setCalis(false)
    setAdim(0)
    setKalan(ADIMLAR[0].sn)
  }
  return (
    <Section id="sukunet" madde="Madde 10 · Zihin sağlığı uygulaması" title="Sükûnet" renk="ultramarin" lead="Sessiz Kitaplık'ın kurgu wellness uygulaması. Bugün nasıl olduğunu bir renkle söyle, birlikte nefes al, iki cümle yaz. Hiçbir ekran acele ettirmez; kırmızı uyarı, sayaç baskısı, puan yok.">
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
        <div className="min-w-0">
          <h3 className="text-[38px] font-medium italic">Bugün nasılsın?</h3>
          <fieldset className="mt-5 border-0 p-0">
            <legend className="sr-only">Bugünkü ruh hâlin</legend>
            <div className="flex flex-wrap gap-3" data-ruhlar="">
              {RUHLAR.map((r) => (
                <RuhDamla
                  key={r.id}
                  r={r}
                  secili={ruh?.id === r.id}
                  onSec={() => {
                    setRuh(r)
                    duyur(`${r.ad}. ${r.mesaj}`)
                  }}
                />
              ))}
            </div>
          </fieldset>
          <div className="relative mt-6 min-h-[270px]" data-ruh-alan={ruh?.id ?? ''}>
            <WatercolorBackground
              key={ruh?.id ?? 'bos'}
              lekeler={
                ruh
                  ? [
                      { renk: ruh.renk, x: 50, y: 46, w: 100, h: 92, tohum: ruh.id.length * 5, dalga: 0.16, gecikme: 0 },
                      { renk: ruh.renk, x: 62, y: 60, w: 62, h: 60, tohum: ruh.id.length * 5 + 3, dalga: 0.2, gecikme: 0.6, op: 0.7 },
                    ]
                  : []
              }
              vb={[560, 300]}
              sure={2.4}
            />
            <div className="sayfa relative z-[1] mx-auto mt-16 w-[88%] max-w-[480px] px-5 py-5 md:mt-20" role="status" data-ruh-mesaj="">
              {ruh ? (
                <>
                  <p className="font-baslik text-[28px] leading-tight font-medium italic">{ruh.ad}</p>
                  <p className="mt-1 text-[17px] text-soluk">{ruh.mesaj}</p>
                </>
              ) : (
                <p className="text-[17px] text-soluk italic">Bir damla seç; kâğıda yayılsın.</p>
              )}
            </div>
          </div>
        </div>
        <div className="min-w-0">
          <h3 className="text-[38px] font-medium italic">Birlikte nefes al</h3>
          <div className="mt-5 grid justify-items-center gap-4" data-nefes={calis ? ADIMLAR[adim].ad : 'durdu'}>
            <div className="relative grid size-[280px] place-items-center">
              <div
                className="absolute inset-0"
                style={{ animation: calis && hareket ? 'nefes 12s ease-in-out infinite' : undefined, scale: olcek !== undefined ? String(calis ? olcek : 0.85) : calis ? undefined : '0.85', transformOrigin: '50% 50%', transition: 'scale 800ms ease' }}
                data-nefes-daire=""
              >
                <WatercolorBackground
                  key={dongu === 0 ? 'ilk' : 'sabit'}
                  lekeler={[
                    { renk: 'ultramarin', x: 50, y: 50, w: 96, h: 96, tohum: 6, dalga: 0.1, gecikme: 0 },
                    { renk: 'yesil', x: 54, y: 56, w: 66, h: 66, tohum: 11, dalga: 0.14, gecikme: 0 },
                  ]}
                  vb={[280, 280]}
                  sure={1.6}
                />
              </div>
              <div className="sayfa relative z-[1] grid size-[132px] place-items-center rounded-full text-center" role="timer" aria-live="off">
                <div>
                  <p className="font-baslik text-[26px] leading-none font-medium italic">{calis ? ADIMLAR[adim].ad : 'Hazır'}</p>
                  <p className="mt-1 font-mono text-[20px] tabular-nums text-soluk" data-nefes-sn="">
                    {calis ? kalan : ADIMLAR[0].sn}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-5">
              <WashButton renk={calis ? 'gul' : 'ultramarin'} boy="k" aria-pressed={calis} onClick={() => (calis ? durdur() : setCalis(true))}>
                {calis ? 'Durdur' : 'Başla'}
              </WashButton>
              <p className="text-[16px] text-soluk" data-nefes-dongu={dongu}>
                4 al · 2 tut · 6 ver · {dongu} döngü
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-14 grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div className="min-w-0">
          <h3 className="text-[38px] font-medium italic">İki cümlelik günlük</h3>
          <div className="mt-5">
            <label htmlFor="gunluk-alan" className="mb-2 block font-semibold">
              Aklından ne geçiyor?
            </label>
            <textarea id="gunluk-alan" className="alan" value={yazi} onChange={(e) => setYazi(e.target.value.slice(0, 240))} aria-invalid={hata ? true : undefined} aria-describedby="gunluk-not" placeholder="Bugün pencereden bir kuş gördüm…" />
            <p id="gunluk-not" className={cx('mt-2 text-[16px]', hata ? 'font-semibold text-gulY' : 'text-soluk')} role={hata ? 'alert' : undefined} data-gunluk-not="">
              {hata || `${yazi.length} / 240 · kimseyle paylaşılmaz`}
            </p>
          </div>
          <WashButton renk="yesil" boy="k" className="mt-4" onClick={kaydet}>
            Deftere kaydet
          </WashButton>
        </div>
        <ul className="m-0 grid min-w-0 list-none gap-4 p-0" aria-label="Günlük kayıtları" data-notlar={notlar.length}>
          {notlar.length === 0 ? (
            <li className="sayfa p-5 text-[17px] text-soluk italic">Henüz kayıt yok. İlk sayfa seni bekliyor.</li>
          ) : (
            notlar.map((n, i) => (
              <li key={`${i}${n.metin}`} className="sayfa flex items-start gap-3 p-4">
                <Ikon ad="damla" boyut={30} className="mt-1" />
                <div className="min-w-0">
                  <p className="kicker">{n.ruh ? n.ruh.ad : 'Ruh hâli seçilmedi'}</p>
                  <p className="mt-1 text-[17px] [overflow-wrap:anywhere]">{n.metin}</p>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </Section>
  )
}

/** Madde 10: organik gıda markası */
export function Sofra() {
  const { duyur } = useWash()
  const [mevsim, setMevsim] = useState<'hepsi' | 'yaz' | 'kis'>('hepsi')
  const [sepet, setSepet] = useState<Record<string, number>>({ ekmek: 1 })
  const liste = URUNLER.filter((u) => mevsim === 'hepsi' || u.mevsim === mevsim || u.mevsim === 'her')
  const satir = URUNLER.filter((u) => (sepet[u.id] ?? 0) > 0)
  const toplam = satir.reduce((t, u) => t + sepet[u.id] * u.fiyat, 0)
  const degistir = (id: string, ad: string, f: number) =>
    setSepet((s) => {
      const y = Math.max(0, Math.min(9, (s[id] ?? 0) + f))
      duyur(`${ad}: sepette ${y} adet`)
      return { ...s, [id]: y }
    })
  const tl = (n: number) => `${n} TL`
  return (
    <Section id="sofra" madde="Madde 10 · Organik gıda markası" title="Kır Sofrası" renk="yesil" lead="Mevsiminde, ilaçsız, elde toplanan. Ürünler yağlı boya gibi parlak değil; suluboyayla, tarlada göründükleri kadar yumuşak çizildi. Ürünler ve fiyatlar kurgudur.">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
        <Secim<'hepsi' | 'yaz' | 'kis'>
          legend="Mevsim"
          name="sofra-mevsim"
          value={mevsim}
          onChange={setMevsim}
          options={[
            { id: 'hepsi', ad: 'Hepsi' },
            { id: 'yaz', ad: 'Yaz', renk: 'var(--ocre)' },
            { id: 'kis', ad: 'Kış', renk: 'var(--ultramarin)' },
          ]}
        />
        <p className="text-[17px] text-soluk" aria-live="polite" data-urun-sayi={liste.length}>
          {liste.length} ürün
        </p>
      </div>
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.7fr_1fr]">
        <ul className="m-0 grid min-w-0 list-none grid-cols-1 gap-x-8 gap-y-10 p-0 sm:grid-cols-2 2xl:grid-cols-3">
          {liste.map((u, i) => (
            <li key={u.id} className="grid min-w-0 grid-cols-1 grid-rows-[170px_1fr] gap-3" data-urun={u.id}>
              <div className="relative h-[170px]">
                <WatercolorBackground lekeler={[{ renk: u.renk, x: 50, y: 50, w: 88, h: 84, tohum: 4 + i * 3, dalga: 0.18, gecikme: i * 0.2 }]} vb={[320, 200]} sure={2} />
                <div className="absolute inset-0 grid place-items-center">
                  <Ikon ad={u.simge} boyut={96} />
                </div>
              </div>
              <div className="sayfa flex flex-col p-4">
                <h3 className="text-[30px] font-medium italic">{u.ad}</h3>
                <p className="mt-1 text-[16px] text-soluk">{u.not}</p>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-3 pt-4">
                  <span className="font-baslik text-[28px] font-semibold whitespace-nowrap tabular-nums">{tl(u.fiyat)}</span>
                  <WashButton renk={u.renk} boy="k" onClick={() => degistir(u.id, u.ad, 1)} aria-label={`${u.ad} sepete ekle`}>
                    Sepete
                  </WashButton>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <aside className="sayfa grid gap-4 p-6 lg:sticky lg:top-24" aria-label="Sepet" data-sepet="">
          <div className="flex items-center gap-3">
            <Ikon ad="yaprak" boyut={44} />
            <h3 className="text-[34px] font-medium italic">Sepet</h3>
          </div>
          {satir.length ? (
            <ul className="m-0 grid list-none gap-2 p-0" aria-live="polite">
              {satir.map((u) => (
                <li key={u.id} className="flex items-center justify-between gap-2 border-b border-[var(--cizgi)] pb-2">
                  <div className="min-w-0">
                    <p className="font-semibold">{u.ad}</p>
                    <p className="font-mono text-[14px] tabular-nums text-soluk">
                      {sepet[u.id]} × {tl(u.fiyat)}
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <WashButton renk="ocre" boy="k" className="!min-h-12 !min-w-12 !px-0" aria-label={`${u.ad} azalt`} onClick={() => degistir(u.id, u.ad, -1)}>
                      <span aria-hidden="true" className="text-[26px] leading-none not-italic">
                        −
                      </span>
                    </WashButton>
                    <WashButton renk="yesil" boy="k" className="!min-h-12 !min-w-12 !px-0" aria-label={`${u.ad} artır`} onClick={() => degistir(u.id, u.ad, 1)}>
                      <span aria-hidden="true" className="text-[26px] leading-none not-italic">
                        +
                      </span>
                    </WashButton>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[17px] text-soluk italic">Sepetin boş. Sofraya bir şey ekle.</p>
          )}
          <p className="flex items-baseline justify-between gap-3 border-t border-[var(--murekkep)] pt-3">
            <span className="font-baslik text-[26px] font-medium italic">Toplam</span>
            <span className="font-baslik text-[28px] font-semibold tabular-nums" data-toplam={toplam}>
              {tl(toplam)}
            </span>
          </p>
          <p className="flex items-center gap-2 text-[16px] text-soluk">
            <Ikon ad="zeytin" boyut={28} /> %100 organik sertifikalı, 40 km içinden
          </p>
        </aside>
      </div>
    </Section>
  )
}

/** Madde 10: editoryal yayın */
export function Dergi() {
  const [boy, setBoy] = useState(20)
  return (
    <Section id="dergi" madde="Madde 10 · Editoryal" title="Dergi sayfası" renk="gul" lead="Uzun okuma için: görsel fırça kenarlı bir maskeyle kesilir, metin dokusuz sayfada sabit sınırlarla durur. Yazı boyu okuyucunun.">
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.25fr_1fr]">
        <div className="sayfa min-w-0 px-6 py-8 md:px-12 md:py-12" data-makale="">
          <p className="kicker">{MAKALE.ustyazi}</p>
          <h3 className="mt-3 text-[clamp(44px,6vw,78px)] font-medium italic">{MAKALE.baslik}</h3>
          <p className="mt-3 text-[16px] text-soluk">
            {MAKALE.yazar} · {MAKALE.tarih} · {MAKALE.sure}
          </p>
          <FircaCizgi renk="ultramarin" tohum={17} className="mt-2 max-w-[260px]" />
          <div className="mt-8 grid max-w-[60ch] gap-6 leading-[1.85]" style={{ fontSize: boy }} data-makale-metin="">
            {MAKALE.paragraflar.map((p, i) => (
              <p key={i} className={i === 0 ? 'basharf' : ''}>
                {p}
                {i === 0 ? <sup className="text-gulY">1</sup> : null}
              </p>
            ))}
          </div>
          <blockquote className="relative m-0 my-10 max-w-[44ch] border-l-0 pl-0">
            <p className="font-baslik text-[clamp(30px,4vw,44px)] leading-[1.15] font-medium italic">“{MAKALE.alinti}”</p>
            <FircaCizgi renk="gul" tohum={23} className="mt-2 max-w-[200px]" />
          </blockquote>
          <p className="max-w-[60ch] border-t border-[var(--cizgi)] pt-4 text-[15px] leading-[1.7] text-soluk">
            <sup className="text-gulY">1</sup> {MAKALE.dipnot}
          </p>
        </div>
        <div className="grid min-w-0 content-start gap-6">
          <figure className="m-0" data-dergi-resim="">
            <GorununceAc>
              <MaskeliResim tohum={9} dalga={0.09} className="aspect-[4/3] w-full" etiket="Nehir kıyısı, suluboya">
                <div className="absolute inset-0 bg-transparent">
                  <Sahne ad="nehir" className="absolute inset-0" />
                </div>
              </MaskeliResim>
            </GorununceAc>
            <figcaption className="mt-3 font-baslik text-[20px] text-soluk italic">Şekil 2 · Nehir kıyısı, ıslak üstüne ıslak.</figcaption>
          </figure>
          <FircaAralik label="Yazı boyu" value={boy} min={16} max={26} onChange={setBoy} format={(v) => `${v}px`} renk="var(--gul)" />
          <p className="text-[16px] text-soluk">Görsel, organik bir leke biçiminde maskelenir; kenarı fırçanın nemli sınırı gibi dalgalı. Metin ise kesin bir dikdörtgende, dokusuz.</p>
        </div>
      </div>
    </Section>
  )
}
