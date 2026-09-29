import { useMemo, useState, type FormEvent } from 'react'
import { Accordion } from 'radix-ui'
import { cx } from '../../shared/cx'
import { AYLAR, CILTLER, EKLER, ICERIK, KATEGORILER, KUTULAR, PARSELLER, ROTALAR, ROZETLER, TAKVIM, URUNLER, ucretsizKargo, CADIR_UCRETI, type CiltId, type KatId, type Rota, type Urun } from '../lib/data'
import { useBotanical } from '../lib/store'
import { BotanicalCard, Dal, EcoButton, KategoriSecici, LeafDivider, MaskeliGorsel } from '../components/Botanical'
import { Ikon } from '../components/Ikon'
import { Adet, Alan, Anahtar, Aralik, Belir, Onay, Secim, Section } from '../components/ui'

const tl = (n: number) => `${new Intl.NumberFormat('tr-TR').format(Math.round(n))} ₺`
const TONLAR = ['toprak', 'zeytin', 'kil', 'orman'] as const

/* ───────────────────────── Organik pazar ───────────────────────── */

type Gorunum = 'izgara' | 'liste'
type Sira = 'oneri' | 'artan' | 'azalan'

function UrunKarti({ u, i, gorunum }: { u: Urun; i: number; gorunum: Gorunum }) {
  const { sepet, adetAyarla, duyur } = useBotanical()
  const adet = sepet[u.id] ?? 0
  const kat = KATEGORILER.find((k) => k.id === u.kat)?.ad ?? ''
  const govde = (
    <div className="flex flex-1 flex-col p-5 sm:p-6">
      <p className="kicker">
        {kat} · {u.birim}
      </p>
      <h3 className="baslik mt-1 text-[clamp(22px,2.2vw,27px)]">{u.ad}</h3>
      <p className="mt-2 flex-1 text-[16.5px] text-soluk">{u.aciklama}</p>
      {u.yerel ? (
        <p className="mt-3 flex items-center gap-2 text-[15px] font-semibold text-zeytin-yazi">
          <Ikon ad="konum" boyut={18} /> Yerel üretici
        </p>
      ) : null}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="rakam text-[26px]" data-fiyat={u.fiyat}>
          {tl(u.fiyat)}
        </p>
        {adet ? (
          <Adet value={adet} onChange={(n) => adetAyarla(u.id, n)} label={`${u.ad} adedi`} />
        ) : (
          <EcoButton
            ton="zeytin"
            boy="k"
            ikon={<Ikon ad="sepet" boyut={20} />}
            onClick={() => {
              adetAyarla(u.id, 1)
              duyur(`${u.ad} sepete eklendi`)
            }}
            data-sepete={u.id}
            aria-label={`${u.ad}, sepete ekle`}
          >
            Ekle
          </EcoButton>
        )}
      </div>
    </div>
  )
  return (
    <Belir as="li" gecikme={(i % 4) * 80} className="kap min-w-0">
      <article className="bcard h-full" data-ton={TONLAR[i % 4] === 'orman' ? undefined : TONLAR[i % 4]} data-katman={i % 3 === 0 ? 1 : undefined} data-urun={u.id} style={{ ['--kart-zemin' as string]: i % 4 === 3 ? 'var(--yuzey)' : undefined }}>
        <div className={cx('bcard-yuz', gorunum === 'liste' ? 'yatay p-4' : 'flex-col')}>
          <div className={cx('relative', gorunum === 'izgara' && 'p-3 pb-0')}>
            <MaskeliGorsel sahne={u.sahne} maske={u.maske} oran={gorunum === 'liste' ? '1 / 1' : '4 / 3.4'} tohum={i + 2} etiket={`${u.ad} illüstrasyonu`} />
            {u.rozet ? <span className="absolute top-4 left-4 rounded-[1rem_0.5rem_1rem_0.5rem] bg-yuzey px-3 py-1 font-[family-name:var(--font-yumusak)] text-[13.5px] font-bold text-kil-yazi">{u.rozet}</span> : null}
          </div>
          {govde}
        </div>
      </article>
    </Belir>
  )
}

function Sepet() {
  const { sepet, adetAyarla, sepetToplam, sepetAdet, sepetTemizle, duyur } = useBotanical()
  const [tamam, setTamam] = useState(false)
  const satirlar = Object.entries(sepet).map(([id, n]) => ({ u: URUNLER.find((x) => x.id === id)!, n }))
  const kalan = Math.max(0, ucretsizKargo - sepetToplam)
  const yuzde = Math.min(100, Math.round((sepetToplam / ucretsizKargo) * 100))
  return (
    <aside id="sepet-panel" aria-label="Sepet" className="yuzey min-w-0 p-6 lg:sticky lg:top-20 lg:self-start" data-sepet-panel="">
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center bg-zeytin text-[#f8f4ea]" style={{ borderRadius: 'var(--r-tas)' }} aria-hidden="true">
          <Ikon ad="sepet" boyut={24} />
        </span>
        <h3 className="baslik text-[26px]">Sepet</h3>
        <span className="rakam ml-auto text-[18px]" data-sepet-adet={sepetAdet}>
          {sepetAdet} ürün
        </span>
      </div>
      {tamam ? (
        <div className="mt-6" role="status">
          <p className="baslik text-[24px]">Siparişiniz alındı</p>
          <p className="mt-2 text-[16.5px] text-soluk">Kraft kutuda, plastiksiz, yerel kargoyla yola çıkıyor.</p>
          <div className="mt-4">
            <EcoButton boy="k" ton="hayalet" onClick={() => setTamam(false)}>
              Alışverişe dön
            </EcoButton>
          </div>
        </div>
      ) : satirlar.length ? (
        <>
          <ul className="m-0 mt-5 grid list-none grid-cols-1 gap-4 p-0" data-sepet-liste="">
            {satirlar.map(({ u, n }) => (
              <li key={u.id} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2">
                <div className="min-w-0">
                  <p className="text-[16.5px] font-semibold [overflow-wrap:anywhere]">{u.ad}</p>
                  <p className="text-[14.5px] text-soluk">
                    {u.birim} · {tl(u.fiyat * n)}
                  </p>
                </div>
                <Adet value={n} onChange={(k) => adetAyarla(u.id, k)} label={`Sepette ${u.ad}`} />
              </li>
            ))}
          </ul>
          <div className="mt-6" data-kargo="">
            <div className="flex items-center justify-between gap-3 text-[15.5px]">
              <span>Ara toplam</span>
              <span className="rakam text-[22px]" data-toplam={sepetToplam}>
                {tl(sepetToplam)}
              </span>
            </div>
            <div className="mt-3 h-3 w-full overflow-hidden bg-yuzey3" style={{ borderRadius: 99 }} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={yuzde} aria-label="Ücretsiz kargo ilerlemesi">
              <div className="h-full bg-zeytin transition-[width] duration-1000" style={{ width: `${yuzde}%`, borderRadius: 99 }} />
            </div>
            <p className="mt-2 text-[15.5px] text-soluk" aria-live="polite">
              {kalan ? `Ücretsiz kargoya ${tl(kalan)} kaldı` : '✓ Kargo ücretsiz'}
            </p>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <EcoButton
              ton="orman"
              onClick={() => {
                sepetTemizle()
                setTamam(true)
                duyur('Siparişiniz alındı')
              }}
              data-siparis=""
            >
              Siparişi tamamla
            </EcoButton>
            <EcoButton ton="metin" boy="k" onClick={sepetTemizle}>
              Boşalt
            </EcoButton>
          </div>
        </>
      ) : (
        <p className="mt-5 text-[16.5px] text-soluk" data-sepet-bos="">
          Sepetiniz boş. Bir ürünün yanındaki “Ekle” düğmesine dokunun.
        </p>
      )}
    </aside>
  )
}

export function Pazar() {
  const [kat, setKat] = useState<KatId>('tumu')
  const [sira, setSira] = useState<Sira>('oneri')
  const [yerel, setYerel] = useState(false)
  const [gorunum, setGorunum] = useState<Gorunum>('izgara')
  const liste = useMemo(() => {
    let l = URUNLER.filter((u) => (kat === 'tumu' || u.kat === kat) && (!yerel || u.yerel))
    if (sira === 'artan') l = [...l].sort((a, b) => a.fiyat - b.fiyat)
    if (sira === 'azalan') l = [...l].sort((a, b) => b.fiyat - a.fiyat)
    return l
  }, [kat, sira, yerel])
  return (
    <Section
      id="pazar"
      ikon="sepet"
      madde="Madde 10 · 11 · Organik gıda e-ticareti"
      title={
        <>
          Fidan <span className="vurgu">Pazarı</span>
        </>
      }
      lead="Yaprak, taş ve damla maskeli ürün kartları, yatay kaydırmalı bitkisel kategori seçici ve hiç sert kenarı olmayan bir sepet. Kategori seçin, sıralayın, yerel üreticiyle süzün; ürünleri sepete ekleyin ve ücretsiz kargoya ne kadar kaldığını izleyin."
    >
      <KategoriSecici liste={KATEGORILER} deger={kat} onChange={setKat} etiket="Kategori" />
      <div className="mt-6 flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
        <div className="w-full max-w-[260px]">
          <Alan label="Sıralama">
            {(p) => (
              <select {...p} className="alan" value={sira} onChange={(e) => setSira(e.target.value as Sira)} data-sira="">
                <option value="oneri">Önerilen</option>
                <option value="artan">Fiyat: artan</option>
                <option value="azalan">Fiyat: azalan</option>
              </select>
            )}
          </Alan>
        </div>
        <Anahtar label="Yalnız yerel üretici" checked={yerel} onChange={setYerel} />
        <Secim<Gorunum>
          legend="Görünüm"
          name="pz-gorunum"
          value={gorunum}
          onChange={setGorunum}
          options={[
            { id: 'izgara', ad: 'Izgara' },
            { id: 'liste', ad: 'Liste' },
          ]}
        />
      </div>
      <p className="mt-6 text-[16.5px] text-soluk" aria-live="polite" data-pazar-sayi={liste.length}>
        {liste.length} ürün
      </p>
      <div className="mt-4 grid grid-cols-1 items-start gap-x-8 gap-y-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <ul className={cx('m-0 grid list-none gap-x-7 gap-y-12 p-0', gorunum === 'izgara' ? 'grid-cols-[repeat(auto-fill,minmax(min(100%,250px),1fr))]' : 'grid-cols-1')} data-urunler={gorunum}>
          {liste.length ? liste.map((u, i) => <UrunKarti key={u.id + gorunum} u={u} i={i} gorunum={gorunum} />) : <li className="yuzey p-8 text-[17px]">Bu süzgeçle eşleşen ürün yok.</li>}
        </ul>
        <Sepet />
      </div>
    </Section>
  )
}

/* ───────────────────────── Kozmetik ───────────────────────── */

const SEGMENT = ['#556B2F', '#8A9E5B', '#B9C68F', '#D2B48C', '#E3A48F', '#C86D51', '#9BB3AF', '#5C7C7A']

export function Kozmetik() {
  const [cilt, setCilt] = useState<CiltId>('kuru')
  const c = CILTLER.find((x) => x.id === cilt)!
  return (
    <Section
      id="kozmetik"
      ikon="kavanoz"
      madde="Madde 10 · Organik kozmetik"
      title={
        <>
          Ne sürdüğünü <span className="vurgu">bil</span>
        </>
      }
      lead="Cilt tipinizi seçin, size uygun ürünü ve içeriğin her kalemini görün: yüzdesiyle, nereden geldiğiyle. Şeffaflık güvenin en sade biçimi."
    >
      <div className="grid grid-cols-1 items-start gap-x-10 gap-y-10 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-5" data-cilt-sonuc={cilt}>
          <div className="mb-6">
            <Secim<CiltId> legend="Cilt tipi" name="kz-cilt" value={cilt} onChange={setCilt} options={CILTLER.map((x) => ({ id: x.id, ad: x.ad }))} />
          </div>
          <BotanicalCard sahne={c.sahne} maske="damla" oran="4 / 3.2" ton="toprak" katman={1} dal tohum={7} kicker={`Size uygun · ${c.oneri}`} baslik={c.urun} className="mt-8">
            <p className="text-[17px]" aria-live="polite">
              {c.not}
            </p>
          </BotanicalCard>
        </div>
        <div className="min-w-0 lg:col-span-7">
          <div className="yuzey p-6 sm:p-9">
            <h3 className="baslik text-[clamp(24px,2.6vw,32px)]">İçerik, yüzde yüzde açık</h3>
            <div className="mt-5 flex h-7 overflow-hidden" style={{ borderRadius: 99 }} role="img" aria-label="İçerik oranları çubuğu" data-icerik-cubugu="">
              {ICERIK.map((x, i) => (
                <span key={x.ad} className="h-full" style={{ width: `${x.yuzde}%`, background: SEGMENT[i], minWidth: 6 }} />
              ))}
            </div>
            <Accordion.Root type="single" collapsible defaultValue="Aloe vera suyu" className="mt-6" data-icerik="">
              {ICERIK.map((x, i) => (
                <Accordion.Item key={x.ad} value={x.ad} className="border-t border-cizgi first:border-t-0">
                  <Accordion.Header className="m-0">
                    <Accordion.Trigger className="group flex min-h-[52px] w-full items-center gap-3 py-2 text-left text-[17px] font-semibold">
                      <span className="size-4 shrink-0" style={{ background: SEGMENT[i], borderRadius: '0 100% 0 100%' }} aria-hidden="true" />
                      <span className="flex-1">{x.ad}</span>
                      <span className="rakam text-[17px]">%{String(x.yuzde).replace('.', ',')}</span>
                      <Ikon ad="ok" boyut={20} className="transition-transform duration-700 group-data-[state=open]:rotate-90" />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="pb-4 pl-7 text-[16.5px] text-soluk">
                    <p>
                      <b className="text-metin">Kaynak:</b> {x.kaynak}
                    </p>
                    <p>
                      <b className="text-metin">Ne işe yarar:</b> {x.ne}
                    </p>
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </div>
        </div>
      </div>
      <ul className="m-0 mt-[var(--aralik)] grid list-none grid-cols-1 gap-x-6 gap-y-6 p-0 sm:grid-cols-2 lg:grid-cols-4" data-rozetler="">
        {ROZETLER.map((r) => (
          <li key={r.ad} className="yuzey flex items-start gap-4 p-5">
            <span className="grid size-12 shrink-0 place-items-center bg-zeytin-ton text-zeytin-yazi" style={{ borderRadius: 'var(--r-tas)' }} aria-hidden="true">
              <Ikon ad={r.ikon} boyut={28} />
            </span>
            <div className="min-w-0">
              <p className="font-[family-name:var(--font-yumusak)] text-[17px] font-bold">{r.ad}</p>
              <p className="text-[15.5px] text-soluk">{r.ac}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  )
}

/* ───────────────────────── Ekolojik tarım ───────────────────────── */

function Parsel({ p, yagis, sulama }: { p: (typeof PARSELLER)[number]; yagis: number; sulama: boolean }) {
  const nem = Math.max(0, Math.min(100, Math.round(p.taban + yagis * 0.9 + (sulama ? 12 : 0))))
  const durum = nem < p.hedef[0] ? { ad: 'Kuru: sulama gerekli', ikon: 'damla' as const } : nem > p.hedef[1] ? { ad: 'Fazla nemli', ikon: 'dalga' as const } : { ad: 'İdeal aralıkta', ikon: 'tik' as const }
  return (
    <li className="yuzey p-5" data-parsel={p.id} data-nem={nem}>
      <div className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center bg-zeytin-ton text-zeytin-yazi" style={{ borderRadius: 'var(--r-tas)' }} aria-hidden="true">
          <Ikon ad={p.ikon} boyut={26} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-[family-name:var(--font-yumusak)] text-[18px] font-bold">{p.ad}</p>
          <p className="flex items-center gap-1.5 text-[15.5px] text-soluk">
            <Ikon ad={durum.ikon} boyut={16} /> {durum.ad}
          </p>
        </div>
        <p className="rakam text-[26px]">%{nem}</p>
      </div>
      <div className="relative mt-4 h-8 overflow-hidden bg-yuzey3" style={{ borderRadius: '1rem 0.6rem 1rem 0.6rem' }} role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={nem} aria-label={`${p.ad} toprak nemi`}>
        <div className="absolute inset-y-0 left-0 transition-[width] duration-1000" style={{ width: `${nem}%` }}>
          <div className="absolute inset-0 bg-zeytin" style={{ opacity: 0.92 }} />
          <div className="su-akis absolute inset-x-0 bottom-1 opacity-40" style={{ ['--su-renk' as string]: '#fff' }} aria-hidden="true" />
        </div>
        <div className="absolute inset-y-0 border-x-2 border-dashed border-metin/50" style={{ left: `${p.hedef[0]}%`, width: `${p.hedef[1] - p.hedef[0]}%` }} aria-hidden="true" />
      </div>
      <p className="mt-2 font-mono text-[12.5px] text-soluk">
        hedef %{p.hedef[0]}–{p.hedef[1]}
      </p>
    </li>
  )
}

export function Tarim() {
  const { duyur } = useBotanical()
  const [yagis, setYagis] = useState(8)
  const [sulama, setSulama] = useState(false)
  const [ay, setAy] = useState(String(new Date().getMonth()))
  const [kutu, setKutu] = useState<(typeof KUTULAR)[number]['id']>('orta')
  const [sik, setSik] = useState<'hafta' | 'iki'>('hafta')
  const [ekler, setEkler] = useState<string[]>(['bal'])
  const k = KUTULAR.find((x) => x.id === kutu)!
  const teslimat = sik === 'hafta' ? 4 : 2
  const ekTop = ekler.reduce((a, id) => a + (EKLER.find((e) => e.id === id)?.fiyat ?? 0), 0)
  const aylik = (k.fiyat + ekTop) * teslimat
  const co2 = Math.round(k.kg * 0.7 * teslimat * 10) / 10
  const m = +ay
  return (
    <Section
      id="tarim"
      ikon="filiz"
      madde="Madde 10 · Ekolojik tarım girişimi"
      title={
        <>
          Tarladan <span className="vurgu">sofraya</span>, açık açık
        </>
      }
      lead="Parsel nemleri, ekim–hasat takvimi ve sepet aboneliği: bir tarım girişiminin güven veren panosu. Yağışı ve damla sulamayı değiştirin, nemin hedef aralığa göre nasıl değiştiğini görün."
    >
      <div className="grid grid-cols-1 gap-x-10 gap-y-8 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-4">
          <div className="yuzey grid grid-cols-1 gap-5 p-6">
            <Aralik label="Son 24 saat yağış" value={yagis} min={0} max={40} step={1} onChange={setYagis} format={(v) => `${v} mm`} />
            <Anahtar label="Damla sulama" hint="Nemi yaklaşık 12 puan artırır" checked={sulama} onChange={setSulama} />
          </div>
        </div>
        <ul className="m-0 grid min-w-0 list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:col-span-8" data-parseller="">
          {PARSELLER.map((p) => (
            <Parsel key={p.id} p={p} yagis={yagis} sulama={sulama} />
          ))}
        </ul>
      </div>

      <div className="yuzey mt-[var(--aralik)] p-6 sm:p-9">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <h3 className="baslik text-[clamp(24px,2.6vw,32px)]">Ekim ve hasat takvimi</h3>
          <div className="w-full max-w-[200px]">
            <Alan label="Ay">
              {(p) => (
                <select {...p} className="alan" value={ay} onChange={(e) => setAy(e.target.value)} data-takvim-ay="">
                  {AYLAR.map((a, i) => (
                    <option key={a} value={i}>
                      {a}
                    </option>
                  ))}
                </select>
              )}
            </Alan>
          </div>
        </div>
        <div className="mt-5 overflow-x-auto" role="region" aria-label="Ekim ve hasat takvimi" tabIndex={0}>
          <table className="w-full min-w-[640px] border-separate border-spacing-1 text-center text-[15px]" data-takvim="">
            <thead>
              <tr>
                <th scope="col" className="w-[130px] text-left">
                  <span className="sr-only">Ürün</span>
                </th>
                {AYLAR.map((a, i) => (
                  <th key={a} scope="col" className={cx('rounded-lg py-1 font-[family-name:var(--font-yumusak)] text-[13.5px]', i === m && 'bg-kil-ton')} aria-current={i === m ? 'true' : undefined}>
                    {a}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TAKVIM.map((t) => (
                <tr key={t.ad}>
                  <th scope="row" className="flex items-center gap-2 py-1 text-left text-[16px] font-semibold">
                    <Ikon ad={t.ikon} boyut={20} /> {t.ad}
                  </th>
                  {t.ay.split('').map((h, i) => (
                    <td
                      key={i}
                      className="h-10 font-[family-name:var(--font-yumusak)] font-bold"
                      style={{
                        borderRadius: h === '.' ? 8 : '0.9rem 0.5rem 0.9rem 0.5rem',
                        background: h === 'H' ? 'var(--zeytin)' : h === 'E' ? 'var(--kil-ton)' : 'var(--yuzey2)',
                        color: h === 'H' ? '#f8f4ea' : 'var(--metin)',
                        outline: i === m ? '2px solid var(--metin)' : undefined,
                        outlineOffset: -2,
                      }}
                      data-hucre={h}
                    >
                      {h === '.' ? <span className="sr-only">boş</span> : <span aria-label={h === 'H' ? 'hasat' : 'ekim'}>{h}</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-[16.5px]" aria-live="polite" data-takvim-ozet="">
          <b>{AYLAR[m]}:</b> hasat{' '}
          {TAKVIM.filter((t) => t.ay[m] === 'H')
            .map((t) => t.ad)
            .join(', ') || '—'}{' '}
          · ekim{' '}
          {TAKVIM.filter((t) => t.ay[m] === 'E')
            .map((t) => t.ad)
            .join(', ') || '—'}
        </p>
        <p className="mt-2 text-[14.5px] text-soluk">E: ekim · H: hasat. Renk yanında harfle de verilir.</p>
      </div>

      <div className="mt-[var(--aralik)] grid grid-cols-1 items-start gap-x-10 gap-y-8 lg:grid-cols-12">
        <div className="yuzey grid min-w-0 grid-cols-1 gap-6 p-6 sm:p-9 lg:col-span-7">
          <h3 className="baslik text-[clamp(24px,2.6vw,32px)]">Sepet aboneliği</h3>
          <Secim<(typeof KUTULAR)[number]['id']> legend="Kutu boyu" name="tr-kutu" value={kutu} onChange={setKutu} options={KUTULAR.map((x) => ({ id: x.id, ad: `${x.ad} · ${x.kg} kg` }))} />
          <Secim<'hafta' | 'iki'>
            legend="Sıklık"
            name="tr-sik"
            value={sik}
            onChange={setSik}
            options={[
              { id: 'hafta', ad: 'Her hafta' },
              { id: 'iki', ad: 'İki haftada bir' },
            ]}
          />
          <fieldset className="min-w-0 border-0 p-0">
            <legend className="kicker mb-1">Eklemek istediğiniz</legend>
            <div className="grid grid-cols-1">
              {EKLER.map((e) => (
                <Onay
                  key={e.id}
                  id={`ek-${e.id}`}
                  checked={ekler.includes(e.id)}
                  onChange={(v) => setEkler((x) => (v ? [...x, e.id] : x.filter((y) => y !== e.id)))}
                  label={
                    <>
                      {e.ad} <span className="text-soluk">+{tl(e.fiyat)}</span>
                    </>
                  }
                />
              ))}
            </div>
          </fieldset>
        </div>
        <div className="min-w-0 lg:col-span-5">
          <BotanicalCard ton="zeytin" katman={1} tohum={5} kicker={`${k.ad} kutu · ${k.kisi}`} baslik="Aylık özet" dal data-abonelik="">
            <dl className="m-0 grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-[17px]" aria-live="polite">
              <dt>Teslimat başına</dt>
              <dd className="rakam m-0 text-right" data-teslimat-basi={k.fiyat + ekTop}>
                {tl(k.fiyat + ekTop)}
              </dd>
              <dt>Ayda teslimat</dt>
              <dd className="rakam m-0 text-right">{teslimat}</dd>
              <dt className="font-bold">Aylık toplam</dt>
              <dd className="rakam m-0 text-right text-[24px]" data-aylik={aylik}>
                {tl(aylik)}
              </dd>
            </dl>
            <p className="mt-4 flex items-start gap-2 text-[16px] text-zeytin-yazi">
              <Ikon ad="dongu" boyut={20} className="mt-1 shrink-0" />
              <span data-co2={co2}>
                Marketle kıyaslandığında tahmini <b>{String(co2).replace('.', ',')} kg</b> daha az CO₂; ambalaj tamamen kraft ve geri dönüşümlü.
              </span>
            </p>
            <div className="mt-5">
              <EcoButton ton="orman" boy="k" onClick={() => duyur(`${k.ad} kutu aboneliği başlatıldı, aylık ${tl(aylik)}`)} ikon={<Ikon ad="tik" boyut={20} />}>
                Aboneliği başlat
              </EcoButton>
            </div>
          </BotanicalCard>
        </div>
      </div>
    </Section>
  )
}

/* ───────────────────────── Doğa turizmi ───────────────────────── */

function Profil({ veri }: { veri: number[] }) {
  const w = 300
  const h = 90
  const pts = veri.map((v, i) => [(i / (veri.length - 1)) * w, h - (v / 100) * (h - 10) - 4] as const)
  let d = `M${pts[0][0]} ${pts[0][1]}`
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1]
    const [x1, y1] = pts[i]
    const cx = (x0 + x1) / 2
    d += `C${cx} ${y0} ${cx} ${y1} ${x1} ${y1}`
  }
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" role="img" aria-label="Yükseklik profili" data-profil="">
      <path d={`${d}L${w} ${h}L0 ${h}Z`} fill="var(--zeytin)" fillOpacity=".18" />
      <path d={d} fill="none" stroke="var(--zeytin)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function ZorlukGosterge({ z }: { z: 1 | 2 | 3 }) {
  return (
    <span className="inline-flex items-center gap-1" role="img" aria-label={`Zorluk ${z}/3: ${['kolay', 'orta', 'zorlu'][z - 1]}`}>
      {[1, 2, 3].map((i) => (
        <Ikon key={i} ad="yaprak" boyut={18} className={i <= z ? 'text-zeytin-yazi' : 'text-kontrol opacity-45'} />
      ))}
      <span className="ml-1.5 text-[15px] font-semibold">{['Kolay', 'Orta', 'Zorlu'][z - 1]}</span>
    </span>
  )
}

interface Rez {
  rota: string
  tarih: string
  kisi: number
  cadir: boolean
  ad: string
  posta: string
}

export function Turizm() {
  const { duyur } = useBotanical()
  const bugun = new Date().toISOString().slice(0, 10)
  const [f, setF] = useState<Rez>({ rota: 'kaz', tarih: '', kisi: 2, cadir: false, ad: '', posta: '' })
  const [h, setH] = useState<Partial<Record<keyof Rez, string>>>({})
  const [bitti, setBitti] = useState(false)
  const set = <K extends keyof Rez>(k: K, v: Rez[K]) => setF((x) => ({ ...x, [k]: v }))
  const rota = ROTALAR.find((r) => r.id === f.rota) as Rota
  const gece = rota.id === 'kamp' ? 1 : 0
  const toplam = rota.fiyat * f.kisi + (f.cadir ? CADIR_UCRETI * Math.max(1, gece) : 0)
  const gonder = (e: FormEvent) => {
    e.preventDefault()
    const y: typeof h = {}
    if (f.ad.trim().length < 3) y.ad = 'Adınızı ve soyadınızı yazın.'
    if (!/^\S+@\S+\.\S+$/.test(f.posta)) y.posta = 'Geçerli bir e-posta adresi yazın (ör. ad@site.com).'
    if (!f.tarih) y.tarih = 'Bir tarih seçin.'
    else if (f.tarih < bugun) y.tarih = 'Geçmiş bir tarih seçilemez.'
    setH(y)
    if (Object.keys(y).length) {
      duyur(`Formda ${Object.keys(y).length} eksik var`)
      const form = e.currentTarget as HTMLFormElement
      window.setTimeout(() => form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(), 60)
      return
    }
    setBitti(true)
    duyur('Rezervasyonunuz alındı')
  }
  return (
    <Section
      id="turizm"
      ikon="cadir"
      madde="Madde 10 · Doğa turizmi"
      title={
        <>
          Yürü, <span className="vurgu">dinlen</span>, geri dön
        </>
      }
      lead="Üç rota, her birinin yükseklik profili, zorluğu ve süresiyle. Rotayı seçin, tarihi ve kişi sayısını girin; toplam anında hesaplanır. Çöp bırakmama ve yerel kooperatif ilkesi her rezervasyona dahil."
    >
      <ul className="m-0 grid list-none grid-cols-1 gap-x-8 gap-y-12 p-0 md:grid-cols-3" data-rotalar="">
        {ROTALAR.map((r, i) => (
          <Belir as="li" key={r.id} gecikme={i * 100} className="min-w-0">
            <BotanicalCard sahne={r.sahne} maske={i === 1 ? 'tas' : 'dalga'} oran="4 / 3.2" tohum={i + 3} ton={i === 2 ? 'orman' : 'toprak'} katman={i === 0 ? 1 : 0} kicker={`${r.bolge} · ${r.sure}`} baslik={r.ad} className="h-full" data-rota={r.id}>
              <p className="text-[16.5px] text-soluk">{r.ozet}</p>
              <div className="mt-4">
                <Profil veri={r.profil} />
              </div>
              <dl className="m-0 mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-[15.5px]">
                <dt className="text-soluk">Mesafe</dt>
                <dd className="m-0 text-right font-semibold">{String(r.km).replace('.', ',')} km</dd>
                <dt className="text-soluk">Tırmanış</dt>
                <dd className="m-0 text-right font-semibold">{r.tirmanis} m</dd>
                <dt className="text-soluk">Zorluk</dt>
                <dd className="m-0 flex justify-end">
                  <ZorlukGosterge z={r.zorluk} />
                </dd>
              </dl>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="rakam text-[24px]">
                  {tl(r.fiyat)}
                  <span className="text-[14px] font-medium text-soluk"> / kişi</span>
                </p>
                <EcoButton
                  ton={f.rota === r.id ? 'zeytin' : 'hayalet'}
                  boy="k"
                  aria-pressed={f.rota === r.id}
                  onClick={() => {
                    set('rota', r.id)
                    setBitti(false)
                    duyur(`${r.ad} seçildi`)
                  }}
                  data-rota-sec={r.id}
                >
                  {f.rota === r.id ? 'Seçildi' : 'Seç'}
                </EcoButton>
              </div>
            </BotanicalCard>
          </Belir>
        ))}
      </ul>

      <div className="mt-[var(--aralik)] grid grid-cols-1 items-start gap-x-10 gap-y-8 lg:grid-cols-12">
        <div className="yuzey min-w-0 p-6 sm:p-9 lg:col-span-7">
          {bitti ? (
            <div role="status" data-rez-tamam="">
              <div className="flex items-center gap-3">
                <span className="grid size-12 place-items-center bg-zeytin text-[#f8f4ea]" style={{ borderRadius: 'var(--r-tas)' }} aria-hidden="true">
                  <Ikon ad="tik" boyut={28} />
                </span>
                <h3 className="baslik text-[clamp(24px,2.8vw,34px)]">Rezervasyonunuz alındı</h3>
              </div>
              <p className="mt-4 text-[18px]">
                {f.ad}, {rota.ad} için {f.tarih} tarihinde {f.kisi} kişilik yeriniz ayrıldı{f.cadir ? ', çadır dahil' : ''}. Toplam <b className="rakam">{tl(toplam)}</b>. Ayrıntılar {f.posta} adresine gidiyor.
              </p>
              <div className="mt-5">
                <EcoButton
                  boy="k"
                  ton="hayalet"
                  onClick={() => {
                    setBitti(false)
                    setF({ rota: 'kaz', tarih: '', kisi: 2, cadir: false, ad: '', posta: '' })
                  }}
                >
                  Yeni rezervasyon
                </EcoButton>
              </div>
            </div>
          ) : (
            <form onSubmit={gonder} noValidate className="grid grid-cols-1 gap-6" data-rez-form="" aria-label="Rota rezervasyonu">
              <h3 className="baslik text-[clamp(24px,2.6vw,32px)]">Rezervasyon</h3>
              {Object.keys(h).length ? (
                <div role="alert" className="rounded-[1.2rem_0.6rem_1.2rem_0.6rem] border-2 border-kil-yazi p-4 text-[16.5px]" data-hata-ozet="">
                  <p className="font-bold text-kil-yazi">✕ Formda düzeltilecek {Object.keys(h).length} yer var:</p>
                  <ul className="m-0 mt-1 list-disc pl-6">
                    {Object.values(h).map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <Alan label="Rota">
                {(p) => (
                  <select {...p} className="alan" value={f.rota} onChange={(e) => set('rota', e.target.value)} data-rez-rota="">
                    {ROTALAR.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.ad}
                      </option>
                    ))}
                  </select>
                )}
              </Alan>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Alan label="Tarih" hata={h.tarih}>
                  {(p) => <input {...p} type="date" className="alan" min={bugun} value={f.tarih} onChange={(e) => set('tarih', e.target.value)} />}
                </Alan>
                <div>
                  <p className="etiket">Kişi sayısı</p>
                  <div className="mt-2">
                    <Adet value={f.kisi} onChange={(n) => set('kisi', n)} min={1} max={8} label="Kişi sayısı" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Alan label="Ad soyad" hata={h.ad}>
                  {(p) => <input {...p} className="alan" autoComplete="name" value={f.ad} onChange={(e) => set('ad', e.target.value)} />}
                </Alan>
                <Alan label="E-posta" hata={h.posta}>
                  {(p) => <input {...p} type="email" className="alan" autoComplete="email" value={f.posta} onChange={(e) => set('posta', e.target.value)} />}
                </Alan>
              </div>
              <Anahtar label="Çadır kirala" hint={`Gecelik ${tl(CADIR_UCRETI)}, temizlik dahil`} checked={f.cadir} onChange={(v) => set('cadir', v)} />
              <div>
                <EcoButton type="submit" ton="kil" boy="b" ikon={<Ikon ad="ok" boyut={24} />}>
                  Yerimi ayır
                </EcoButton>
              </div>
            </form>
          )}
        </div>
        <div className="min-w-0 lg:col-span-5">
          <BotanicalCard ton="zeytin" katman={2} tohum={9} dal kicker="Özet" baslik={rota.ad} data-rez-ozet="">
            <dl className="m-0 grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-[17px]" aria-live="polite">
              <dt>Kişi başı</dt>
              <dd className="rakam m-0 text-right">{tl(rota.fiyat)}</dd>
              <dt>Kişi</dt>
              <dd className="rakam m-0 text-right">{f.kisi}</dd>
              <dt>Çadır</dt>
              <dd className="rakam m-0 text-right">{f.cadir ? tl(CADIR_UCRETI * Math.max(1, gece)) : '—'}</dd>
              <dt className="font-bold">Toplam</dt>
              <dd className="rakam m-0 text-right text-[26px]" data-rez-toplam={toplam}>
                {tl(toplam)}
              </dd>
            </dl>
            <LeafDivider tur="tohum" className="mt-5" />
            <p className="mt-3 text-[15.5px] text-soluk">Her rezervasyondan bir fidan, rota boyunca ormana dikilir.</p>
          </BotanicalCard>
        </div>
      </div>
      <div className="pointer-events-none mt-8 flex justify-end" aria-hidden="true">
        <Dal boy={90} yaprak={6} yon={-1} palet="toprak" />
      </div>
    </Section>
  )
}
