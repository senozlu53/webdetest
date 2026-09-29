import { useMemo, useState, type CSSProperties } from 'react'
import { Dialog } from 'radix-ui'
import { cx } from '../../shared/cx'
import { AKSAM_RUTINI, BIOFILIK_DESENLER, BITKILER, nemDurum, ODA_AD, PROJELER, PROJE_TUR_AD, UYKU_SAATLERI, type Bitki as BitkiVeri, type Oda, type Proje, type ProjeTur } from '../lib/data'
import { useBiophilic } from '../lib/store'
import { gunes, saatMetni } from '../lib/zaman'
import { ZamanSahnesi } from '../components/Ambient'
import { BiophilicCard, BioButton, BreathProgress, BreatheTimer, NEFES_DESENLERI } from '../components/Biophilic'
import { Bitki, Mekan } from '../components/Bitki'
import { Ikon } from '../components/Ikon'
import { Anahtar, Belir, Secim, Section } from '../components/ui'

/* ───────────────────────── Uygulama 1 · Nefes ve uyku ───────────────────────── */

export function Nefes() {
  const { duyur } = useBiophilic()
  const [desenId, setDesenId] = useState('sakin')
  const [dk, setDk] = useState('3')
  const [sesli, setSesli] = useState(false)
  const [tamam, setTamam] = useState(0)
  const [rutin, setRutin] = useState<Record<string, boolean>>({ isik: true, oda: false, nefes: false })
  const desen = NEFES_DESENLERI.find((d) => d.id === desenId) ?? NEFES_DESENLERI[0]
  const yapilan = Object.values(rutin).filter(Boolean).length
  const toplamDerin = UYKU_SAATLERI.reduce((a, s) => a + s.derin, 0)
  return (
    <Section
      id="nefes"
      ikon="nefes"
      madde="Madde 10 · Kullanım alanı · Meditasyon ve uyku"
      title={
        <>
          Nefes ver, <span className="vurgu">yavaşla</span>, uyu
        </>
      }
      lead="Sağlık, meditasyon ve uyku uygulamalarında ekran, kullanıcıyı uyarmak yerine sakinleştirmelidir. Halkalar nefesle birlikte genişler ve daralır; akşam olunca panel koyulaşır ve ışık azalır."
    >
      <div className="grid grid-cols-1 items-start gap-x-10 gap-y-8 lg:grid-cols-12">
        <div className="cam min-w-0 p-6 sm:p-10 lg:col-span-7" data-nefes-uygulama="">
          <div className="grid grid-cols-1 gap-6">
            <Secim<string> legend="Nefes deseni" name="nf-desen" value={desenId} onChange={setDesenId} options={NEFES_DESENLERI.map((d) => ({ id: d.id, ad: d.ad }))} />
            <p className="text-[16px] text-soluk" data-desen-aciklama="">
              {desen.aciklama}
            </p>
            <Secim<string> legend="Süre" name="nf-sure" value={dk} onChange={setDk} options={['1', '2', '3', '5'].map((n) => ({ id: n, ad: `${n} dk` }))} />
          </div>
          <div className="mt-8">
            <BreatheTimer
              desen={desen}
              sureDk={+dk}
              duyurAdim={sesli}
              onBitir={() => {
                setTamam((n) => n + 1)
                setRutin((r) => ({ ...r, nefes: true }))
              }}
            />
          </div>
          <div className="mt-8">
            <Anahtar label="Sesli rehber" hint="Her adımı ekran okuyucuya duyurur (nefes al, tut, ver)." checked={sesli} onChange={setSesli} />
          </div>
          <p className="mt-6 text-[15px] text-soluk" data-nefes-tamam={tamam}>
            Bugün tamamlanan oturum: <b className="text-metin">{tamam}</b>
          </p>
        </div>
        <div className="grid min-w-0 grid-cols-1 content-start gap-6 lg:col-span-5">
          <BiophilicCard ikon="uyku" kicker="Bu gece" baslik="7 sa 24 dk uyku" dinamik data-uyku-karti="">
            <div className="mt-3 flex items-end gap-1.5" style={{ height: 120 }} role="img" aria-label={`Saatlik uyku evreleri: toplam derin uyku ${toplamDerin} dakika`}>
              {UYKU_SAATLERI.map((s) => (
                <div key={s.saat} className="flex h-full flex-1 flex-col-reverse gap-0.5" title={`${s.saat}:00`}>
                  <span className="rounded-md bg-btn" style={{ height: `${(s.derin / 60) * 100}%` }} />
                  <span className="rounded-md border border-[var(--kontrol)]" style={{ height: `${(s.hafif / 60) * 100}%`, backgroundImage: 'repeating-linear-gradient(135deg, transparent 0 4px, var(--kontrol) 4px 5px)' }} />
                </div>
              ))}
            </div>
            <div className="mt-1 flex gap-1.5 font-mono text-[11px] text-soluk" aria-hidden="true">
              {UYKU_SAATLERI.map((s) => (
                <span key={s.saat} className="flex-1 text-center">
                  {s.saat}
                </span>
              ))}
            </div>
            <ul className="m-0 mt-4 flex list-none flex-wrap gap-x-5 gap-y-1 p-0 text-[14.5px]">
              <li className="flex items-center gap-2">
                <span className="inline-block h-3 w-5 rounded-sm bg-btn" aria-hidden="true" /> Derin uyku
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block h-3 w-5 rounded-sm border border-[var(--kontrol)]" style={{ backgroundImage: 'repeating-linear-gradient(135deg, transparent 0 3px, var(--kontrol) 3px 4px)' }} aria-hidden="true" /> Hafif uyku
              </li>
            </ul>
            <table className="sr-only">
              <caption>Saatlik uyku evreleri (dakika)</caption>
              <thead>
                <tr>
                  <th scope="col">Saat</th>
                  <th scope="col">Derin</th>
                  <th scope="col">Hafif</th>
                </tr>
              </thead>
              <tbody>
                {UYKU_SAATLERI.map((s) => (
                  <tr key={s.saat}>
                    <th scope="row">{s.saat}:00</th>
                    <td>{s.derin}</td>
                    <td>{s.hafif}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 flex items-center gap-3 text-[16px]" data-nabiz="56">
              <span className="kalp-atar" style={{ ['--kalp-sure' as string]: `${(60 / 56).toFixed(2)}s` } as CSSProperties}>
                <Ikon ad="kalp" boyut={26} className="text-vurgu" />
              </span>
              <span>
                Ortalama nabız <b className="rakam">56</b> bpm
              </span>
            </p>
          </BiophilicCard>
          <BiophilicCard ikon="ay" kicker="Akşam rutini" baslik={`${yapilan} / ${AKSAM_RUTINI.length} tamam`}>
            <div className="grid grid-cols-1 gap-4" data-rutin="">
              {AKSAM_RUTINI.map((r) => (
                <Anahtar
                  key={r.id}
                  label={r.ad}
                  hint={r.ipucu}
                  checked={rutin[r.id]}
                  onChange={(v) => {
                    setRutin((x) => ({ ...x, [r.id]: v }))
                    duyur(`${r.ad}: ${v ? 'tamamlandı' : 'geri alındı'}`)
                  }}
                />
              ))}
            </div>
            <BreathProgress className="mt-6" deger={yapilan} toplam={AKSAM_RUTINI.length} etiket="Rutin ilerlemesi" format={(n) => String(n)} />
          </BiophilicCard>
        </div>
      </div>
    </Section>
  )
}

/* ───────────────────────── Uygulama 2 · Akıllı ev bitki yönetimi ───────────────────────── */

function NemOlcer({ b }: { b: BitkiVeri }) {
  const d = nemDurum(b)
  return (
    <div>
      <div
        className="relative h-4 rounded-full border border-[var(--kontrol)] bg-[color-mix(in_srgb,var(--cam-tint)_55%,transparent)]"
        role="meter"
        aria-label={`${b.ad} toprak nemi`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={b.nem}
        aria-valuetext={`%${b.nem}, ${d.ad}, hedef %${b.hedef[0]}–%${b.hedef[1]}`}
        data-nem-olcer={b.nem}
      >
        <span className="absolute inset-y-0 rounded-full bg-[color-mix(in_srgb,var(--btn)_32%,transparent)]" style={{ left: `${b.hedef[0]}%`, width: `${b.hedef[1] - b.hedef[0]}%` }} />
        <i className="absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--kontrol)] bg-[#ffe27a] transition-[left] duration-1000 ease-in-out" style={{ left: `${Math.min(97, Math.max(3, b.nem))}%` }} />
      </div>
      <p className="mt-1.5 flex flex-wrap items-center justify-between gap-x-3 text-[14px] text-soluk">
        <span>
          Hedef %{b.hedef[0]}–%{b.hedef[1]}
        </span>
        <span className="flex items-center gap-1 font-medium text-metin" data-nem-durum={d.kod}>
          <Ikon ad={d.kod === 'iyi' ? 'tik' : d.kod === 'susamis' ? 'damla' : 'nem'} boyut={16} />
          {d.ad}
        </span>
      </p>
    </div>
  )
}

const dogalLux = (saat: number) => {
  const g = gunes(saat)
  if (!g.gunduz) return 0
  const t = (saat - 5.5) / 14
  return Math.round(12000 * Math.sin(Math.PI * Math.min(1, Math.max(0, t))))
}

export function BitkiYonetimi() {
  const { duyur, saat } = useBiophilic()
  const [liste, setListe] = useState(BITKILER)
  const [oda, setOda] = useState<'tum' | Oda>('tum')
  const [izle, setIzle] = useState(true)
  const gorunen = liste.filter((b) => oda === 'tum' || b.oda === oda)
  const ort = Math.round(liste.reduce((a, b) => a + b.nem, 0) / liste.length)
  const susamis = liste.filter((b) => nemDurum(b).kod === 'susamis').length
  const sula = (id: string) => {
    setListe((l) => l.map((b) => (b.id === id ? { ...b, nem: Math.round((b.hedef[0] + b.hedef[1]) / 2), sulama: 'Az önce' } : b)))
    const b = liste.find((x) => x.id === id)!
    duyur(`${b.ad} sulandı, nem yüzde ${Math.round((b.hedef[0] + b.hedef[1]) / 2)}`)
  }
  const hepsi = () => {
    setListe((l) => l.map((b) => (nemDurum(b).kod === 'susamis' ? { ...b, nem: Math.round((b.hedef[0] + b.hedef[1]) / 2), sulama: 'Az önce' } : b)))
    duyur(`${susamis} bitki sulandı`)
  }
  // ek ışık: 06:00–20:00 arası, doğal ışık hedefin altındaysa tamamlar
  const lux = dogalLux(saat)
  const hedefLux = 6000
  const foto = saat >= 6 && saat <= 20
  const ek = izle && foto ? Math.round(Math.max(0, (hedefLux - lux) / hedefLux) * 100) : 0
  return (
    <Section
      id="bitki"
      ikon="saksi"
      madde="Madde 10 · Kullanım alanı · Akıllı ev"
      title={
        <>
          Bitkiler susayınca <span className="vurgu">sessizce</span> söyler
        </>
      }
      lead="Akıllı ev bitki yönetiminde panel, evin gerçek ışığını taklit eder: bitki çizimleri günün saatine göre renk değiştirir, ek aydınlatma doğal ışığın eksik kaldığı kadar devreye girer. Durumlar renkle birlikte ikon ve yazıyla da verilir."
    >
      <div className="cam p-6 sm:p-9" data-bitki-ozet="">
        <dl className="m-0 grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-4">
          {[
            ['Bitki', String(liste.length), 'saksi'],
            ['Ortalama nem', `%${ort}`, 'nem'],
            ['Sulama bekleyen', String(susamis), 'damla'],
            ['Güneş', `${saatMetni(5.5)}–${saatMetni(19.5)}`, 'gunes'],
          ].map(([a, b, ik]) => (
            <div key={a}>
              <dt className="kicker flex items-center gap-2">
                <Ikon ad={ik as 'saksi'} boyut={18} />
                {a}
              </dt>
              <dd className="rakam m-0 mt-1 text-[clamp(26px,3vw,38px)] leading-none">{b}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="cam mt-[var(--aralik)] flex flex-wrap items-end justify-between gap-6 p-5 sm:p-7">
        <Secim<'tum' | Oda> legend="Oda" name="bt-oda" value={oda} onChange={setOda} options={[{ id: 'tum', ad: 'Tümü' }, ...(Object.keys(ODA_AD) as Oda[]).map((o) => ({ id: o, ad: ODA_AD[o] }))]} />
        <BioButton onClick={hepsi} disabled={susamis === 0} ikon={<Ikon ad="sulama" boyut={22} />} data-hepsini-sula="">
          Susamışları sula ({susamis})
        </BioButton>
      </div>
      <ul className="m-0 mt-8 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 xl:grid-cols-4" data-bitkiler="">
        {gorunen.map((b, i) => (
          <Belir key={b.id} as="li" gecikme={i * 90} className="flex">
            <BiophilicCard
              className="w-full"
              data-bitki-karti={b.id}
              gorsel={
                <div className="relative grid h-[220px] place-items-end justify-center overflow-hidden" style={{ background: 'linear-gradient(180deg, var(--zg-1), var(--zg-2) 60%, var(--zg-3))' }}>
                  <span className="absolute top-4 size-9 rounded-full" style={{ left: 'calc(var(--gunes-x) * 82% + 4%)', background: 'var(--isik-renk)', boxShadow: '0 0 28px 8px color-mix(in srgb, var(--isik-renk) 60%, transparent)' }} aria-hidden="true" />
                  <Bitki tur={b.tur} className="h-[96%]" etiket={`${b.ad} çizimi`} />
                </div>
              }
              kicker={ODA_AD[b.oda]}
              baslik={b.ad}
            >
              <p className="text-[14.5px] text-soluk italic">{b.latince}</p>
              <div className="mt-4">
                <NemOlcer b={b} />
              </div>
              <dl className="m-0 mt-4 grid grid-cols-2 gap-3 text-[14.5px]">
                <div>
                  <dt className="flex items-center gap-1.5 text-soluk">
                    <Ikon ad="isik" boyut={16} /> Işık
                  </dt>
                  <dd className="m-0 font-medium tabular-nums">{b.isik.toLocaleString('tr-TR')} lx</dd>
                </div>
                <div>
                  <dt className="flex items-center gap-1.5 text-soluk">
                    <Ikon ad="sicaklik" boyut={16} /> Sıcaklık
                  </dt>
                  <dd className="m-0 font-medium tabular-nums">{String(b.sicaklik).replace('.', ',')} °C</dd>
                </div>
              </dl>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <BioButton boy="k" ton="cam" onClick={() => sula(b.id)} ikon={<Ikon ad="sulama" boyut={18} />} aria-label={`${b.ad} sula`}>
                  Sula
                </BioButton>
                <span className="text-[13.5px] text-soluk" data-son-sulama={b.sulama}>
                  Son: {b.sulama}
                </span>
              </div>
            </BiophilicCard>
          </Belir>
        ))}
      </ul>
      <div className="cam mt-[var(--aralik)] p-6 sm:p-9" data-isik-programi="">
        <div className="grid grid-cols-1 items-center gap-x-12 gap-y-6 md:grid-cols-2">
          <div>
            <h3 className="baslik text-[26px]">Işık programı</h3>
            <div className="mt-4">
              <Anahtar label="Güneşi izle" hint="Doğal ışık hedefin altındaysa ek aydınlatma tamamlar; 06:00–20:00 arası." checked={izle} onChange={setIzle} />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5">
            <BreathProgress deger={lux} toplam={12000} etiket="Doğal ışık" format={(n) => `${Math.round(n).toLocaleString('tr-TR')} lx`} />
            <BreathProgress deger={ek} toplam={100} etiket="Ek aydınlatma" format={(n) => `%${Math.round(n)}`} />
            <p className="text-[15px] text-soluk" data-ek-isik={ek}>
              {saatMetni(saat)} · hedef {hedefLux.toLocaleString('tr-TR')} lx · {foto ? (izle ? `ek ışık %${ek}` : 'program kapalı') : 'gece: bitkiler dinleniyor'}
            </p>
          </div>
        </div>
      </div>
    </Section>
  )
}

/* ───────────────────────── Uygulama 3 · Biofilik mimari portfolyosu ───────────────────────── */

function ProjeDetay({ p, onKapat }: { p: Proje; onKapat: () => void }) {
  return (
    <Dialog.Root open onOpenChange={(o) => !o && onKapat()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[110] bg-[rgb(6_24_18/.55)]" />
        <Dialog.Content
          onCloseAutoFocus={(e) => {
            e.preventDefault()
            document.querySelector<HTMLElement>(`[data-proje-ac="${p.id}"]`)?.focus()
          }}
          className="cam cam-opak fixed top-1/2 left-1/2 z-[120] max-h-[90vh] w-[min(820px,calc(100vw-24px))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto p-5 sm:p-8"
          data-proje-dialog={p.id}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="kicker">
                {PROJE_TUR_AD[p.tur]} · {p.yer} · {p.yil}
              </p>
              <Dialog.Title className="baslik mt-1 text-[clamp(28px,3.4vw,40px)]">{p.ad}</Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <BioButton ton="cam" boy="k" aria-label="Kapat" ikon={<Ikon ad="kapat" boyut={18} />}>
                Kapat
              </BioButton>
            </Dialog.Close>
          </div>
          <ZamanSahnesi saat={p.saat} ambient={false} className="mt-5 aspect-[4/3] max-h-[380px] w-full" icKlas="h-full w-full" data-dialog-sahne="">
            <Mekan tur={p.mekan} etiket={`${p.ad} mekân çizimi, saat ${saatMetni(p.saat)}`} />
          </ZamanSahnesi>
          <Dialog.Description className="mt-5 max-w-[62ch] text-[17px] text-soluk">{p.aciklama}</Dialog.Description>
          <dl className="m-0 mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              ['Yeşil yüzey', `%${p.yesil}`],
              ['Gün ışığı yeterliliği', `%${p.gunisigi}`],
              ['Bitki türü', String(p.bitki)],
              ['Enerji tasarrufu', `%${p.enerji}`],
            ].map(([a, b]) => (
              <div key={a} className="cam-ic p-4">
                <dt className="text-[13.5px] text-soluk">{a}</dt>
                <dd className="rakam m-0 mt-1 text-[26px] leading-none">{b}</dd>
              </div>
            ))}
          </dl>
          <h4 className="baslik mt-7 text-[22px]">14 biofilik desenden {p.desenler.length} tanesi uygulandı</h4>
          <ul className="m-0 mt-4 grid list-none grid-cols-1 gap-2 p-0 sm:grid-cols-2" data-desenler="">
            {BIOFILIK_DESENLER.map((d, i) => {
              const var_ = p.desenler.includes(i + 1)
              return (
                <li key={d} className={cx('flex items-center gap-2.5 rounded-full px-4 py-2 text-[15px]', var_ ? 'bg-btn font-medium text-btn-yazi' : 'border border-dashed border-[var(--kontrol)] text-soluk')} data-desen={var_ ? 'var' : 'yok'}>
                  <Ikon ad={var_ ? 'tik' : 'eksi'} boyut={16} />
                  <span>
                    {i + 1}. {d}
                    <span className="sr-only">{var_ ? ' (uygulandı)' : ' (uygulanmadı)'}</span>
                  </span>
                </li>
              )
            })}
          </ul>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export function Portfolyo() {
  const [tur, setTur] = useState<'tum' | ProjeTur>('tum')
  const [acik, setAcik] = useState<string | null>(null)
  const liste = useMemo(() => PROJELER.filter((p) => tur === 'tum' || p.tur === tur), [tur])
  const secili = PROJELER.find((p) => p.id === acik)
  return (
    <Section
      id="portfolyo"
      ikon="ofis"
      madde="Madde 10 · Kullanım alanı · Mimari portfolyo"
      title={
        <>
          Biofilik ofis, <span className="vurgu">gün boyu</span> başka bir oda
        </>
      }
      lead="Bir mimarlık portfolyosunda mekân görselleri de günün saatine uyar: aynı atrium sabah serin, akşam sıcaktır. Her proje, 14 biofilik desenin hangilerini uyguladığıyla birlikte sunulur."
    >
      <div className="cam max-w-fit p-5 sm:p-7">
        <Secim<'tum' | ProjeTur> legend="Tür" name="pf-tur" value={tur} onChange={setTur} options={[{ id: 'tum', ad: 'Tümü' }, ...(Object.keys(PROJE_TUR_AD) as ProjeTur[]).map((t) => ({ id: t, ad: PROJE_TUR_AD[t] }))]} />
      </div>
      <ul className="m-0 mt-8 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 xl:grid-cols-3" data-projeler="">
        {liste.map((p, i) => (
          <Belir key={p.id} as="li" gecikme={i * 90} className="flex">
            <BiophilicCard
              className="w-full"
              data-proje={p.id}
              gorsel={
                <ZamanSahnesi saat={p.saat} ambient={false} className="aspect-[4/3] w-full !rounded-none" icKlas="h-full w-full">
                  <Mekan tur={p.mekan} etiket={`${p.ad} mekân çizimi`} />
                </ZamanSahnesi>
              }
              kicker={`${PROJE_TUR_AD[p.tur]} · ${p.yil}`}
              baslik={p.ad}
            >
              <p className="text-[15px] text-soluk">
                {p.yer} · {p.alan}
              </p>
              <dl className="m-0 mt-4 grid grid-cols-2 gap-3 text-[14.5px]">
                <div>
                  <dt className="text-soluk">Yeşil yüzey</dt>
                  <dd className="rakam m-0 text-[22px] leading-tight">%{p.yesil}</dd>
                </div>
                <div>
                  <dt className="text-soluk">Desen</dt>
                  <dd className="rakam m-0 text-[22px] leading-tight">{p.desenler.length} / 14</dd>
                </div>
              </dl>
              <div className="mt-5">
                <BioButton ton="cam" boy="k" onClick={() => setAcik(p.id)} ikon={<Ikon ad="ok" boyut={18} />} aria-label={`${p.ad} ayrıntıları`} data-proje-ac={p.id}>
                  Ayrıntı
                </BioButton>
              </div>
            </BiophilicCard>
          </Belir>
        ))}
      </ul>
      {secili ? <ProjeDetay p={secili} onKapat={() => setAcik(null)} /> : null}
    </Section>
  )
}
