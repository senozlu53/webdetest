import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent } from 'react'
import { cx } from '../../shared/cx'
import { elCerceve, elCizgisi, elDairesi } from '../lib/cizim'
import { CUMLELER, DENEME, KURSLAR, PARCALAR, PROGRAM, PROJELER, SAYILAR, TARIHLER } from '../lib/data'
import { useWabi } from '../lib/store'
import { Belir } from '../components/Belir'
import { Ikon } from '../components/Ikon'
import { Seramik } from '../components/Seramik'
import { Adet, Alan, Secim, Section } from '../components/ui'
import { Bolucu, Enso, ImperfectCard, WabiButton, WabiContainer, Yer } from '../components/Wabi'

const tl = (n: number) => `₺${n.toLocaleString('tr-TR')}`
const EPOSTA = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/* ───────────────────────── Uygulama 1 · Seramik atölyesi ───────────────────────── */

export function Atolye() {
  const { duyur } = useWabi()
  const [secili, setSecili] = useState<string[]>([])
  const [ad, setAd] = useState('')
  const [eposta, setEposta] = useState('')
  const [hata, setHata] = useState<{ ad?: string; eposta?: string }>({})
  const [verildi, setVerildi] = useState('')
  const toplam = secili.reduce((a, id) => a + (PARCALAR.find((p) => p.id === id)?.fiyat ?? 0), 0)
  const degistir = (id: string) => {
    const p = PARCALAR.find((x) => x.id === id)!
    setSecili((s) => {
      const var_ = s.includes(id)
      duyur(`${p.ad} ${var_ ? 'sepetten çıkarıldı' : 'sepete eklendi'}`)
      return var_ ? s.filter((x) => x !== id) : [...s, id]
    })
    setVerildi('')
  }
  const gonder = (e: FormEvent) => {
    e.preventDefault()
    const h: typeof hata = {}
    if (ad.trim().length < 3) h.ad = 'Adınızı yazın (en az 3 harf).'
    if (!EPOSTA.test(eposta)) h.eposta = 'Geçerli bir e-posta adresi yazın.'
    setHata(h)
    if (h.ad || h.eposta) {
      duyur('Form eksik: ' + [h.ad, h.eposta].filter(Boolean).join(' '))
      requestAnimationFrame(() => document.querySelector<HTMLElement>('[data-siparis] [aria-invalid="true"]')?.focus())
      return
    }
    setVerildi(`${ad.trim()}, ${secili.length} parça ayırdık. Atölyeden teslim: ${tl(toplam)}.`)
    duyur('Sipariş alındı')
    setSecili([])
  }
  return (
    <Section
      id="atolye"
      no="08"
      madde="Madde 10 · Kullanım alanı · Seramik atölyesi"
      duzen={3}
      title={
        <>
          Her parça <span className="vurgu">bir kez</span>
        </>
      }
      lead="Atölyenin ürün listesi kare kare dizilmez: parçalar boşlukta farklı yerlere, farklı boylarda konur. Aynı parçadan ikincisi yapılmadığı için adet yoktur; bir parça ya vardır ya yoktur."
    >
      <WabiContainer role="list" data-parcalar="">
        {PARCALAR.map((p, i) => {
          const on = secili.includes(p.id)
          return (
            <Yer key={p.id} b={[2, 7, 4, 9, 2, 6][i]} s={[4, 3, 3, 3, 4, 4][i]} ind={p.kaydir / 2} ust={[0, 3, 1, 2, 0, 4][i]} role="listitem" data-parca={p.id} className="mt-[clamp(48px,6vw,96px)]">
              <Belir gecikme={i * 120}>
                <div className="flex items-end" style={{ minHeight: 250 }}>
                  <Seramik tur={p.tur} sir={p.sir} tohum={p.tohum} boy={Math.round(p.boy * 1.25)} etiket={`${p.ad}, ${p.olcu}`} />
                </div>
                <p className="kicker mt-6">
                  <span className="rakam text-[15px] tracking-[0.1em]">No. {p.no}</span> · {p.olcu}
                </p>
                <h3 className="baslik mt-2 text-[clamp(24px,2.3vw,32px)]">{p.ad}</h3>
                <p className="mt-1 text-[15px] text-soluk">{p.not}</p>
                <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <span className="rakam text-[22px]">{tl(p.fiyat)}</span>
                  <WabiButton boy="k" ton={on ? 'mat' : 'cizgi'} aria-pressed={on} onClick={() => degistir(p.id)} aria-label={`${p.ad}: ${on ? 'sepetten çıkar' : 'sepete ekle'}`} ikon={<Ikon ad={on ? 'tik' : 'arti'} boyut={14} />}>
                    {on ? 'Ayrıldı' : 'Ayır'}
                  </WabiButton>
                </div>
              </Belir>
            </Yer>
          )
        })}
      </WabiContainer>

      <WabiContainer className="mt-[calc(var(--uzay)*1.5)]">
        <Yer b={7} s={5} ind={4} ust={0} data-siparis="">
          <ImperfectCard tohum={23}>
            <p className="kicker">Sipariş</p>
            <p className="baslik mt-3 text-[clamp(28px,2.8vw,40px)]">
              <span data-sepet-adet={secili.length}>{secili.length}</span> parça ·{' '}
              <span className="rakam" data-sepet-toplam={toplam}>
                {tl(toplam)}
              </span>
            </p>
            {secili.length ? (
              <ul className="m-0 mt-4 list-none p-0 text-[15.5px] text-soluk">
                {secili.map((id) => (
                  <li key={id}>{PARCALAR.find((p) => p.id === id)?.ad}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-[15.5px] text-soluk">Henüz bir parça ayırmadınız.</p>
            )}
            <form className="mt-8 grid grid-cols-1 gap-6" onSubmit={gonder} noValidate>
              <Alan label="Ad soyad" hata={hata.ad}>
                {(p) => <input className="alan" {...p} value={ad} onChange={(e) => setAd(e.target.value)} autoComplete="name" />}
              </Alan>
              <Alan label="E-posta" hata={hata.eposta} ipucu="Yalnız sipariş bilgisi için.">
                {(p) => <input className="alan" type="email" {...p} value={eposta} onChange={(e) => setEposta(e.target.value)} autoComplete="email" />}
              </Alan>
              <div>
                <WabiButton type="submit" ton="mat" disabled={!secili.length} data-siparis-ver="">
                  Siparişi tamamla
                </WabiButton>
              </div>
            </form>
            {verildi ? (
              <p className="mt-6 flex items-start gap-3 text-[16.5px]" role="status" data-siparis-tamam="">
                <Ikon ad="tik" boyut={18} className="mt-1.5 shrink-0" />
                {verildi}
              </p>
            ) : null}
          </ImperfectCard>
        </Yer>
        <Yer b={2} s={4} ind={0} ust={2} className="mt-[clamp(0px,10vw,160px)]">
          <Kurs />
        </Yer>
      </WabiContainer>
    </Section>
  )
}

function Kurs() {
  const { duyur } = useWabi()
  const [kurs, setKurs] = useState(KURSLAR[0].id)
  const [tarih, setTarih] = useState(TARIHLER[1])
  const [kisi, setKisi] = useState(1)
  const [ad, setAd] = useState('')
  const [hata, setHata] = useState('')
  const [tamam, setTamam] = useState('')
  const k = KURSLAR.find((x) => x.id === kurs)!
  return (
    <div data-kurs="">
      <p className="kicker">Kurs</p>
      <h3 className="baslik mt-3 text-[clamp(28px,2.8vw,40px)]">Çarkın başına otur</h3>
      <form
        className="mt-8 grid grid-cols-1 gap-6"
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          if (ad.trim().length < 3) {
            setHata('Adınızı yazın (en az 3 harf).')
            setTamam('')
            duyur('Ad eksik')
            return
          }
          setHata('')
          setTamam(`${ad.trim()}, ${kisi} kişilik yerinizi ${tarih} için ayırdık.`)
          duyur('Yer ayrıldı')
        }}
      >
        <Alan label="Kurs">
          {(p) => (
            <select className="alan" {...p} value={kurs} onChange={(e) => setKurs(e.target.value)}>
              {KURSLAR.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.ad} · {x.sure}
                </option>
              ))}
            </select>
          )}
        </Alan>
        <Alan label="Tarih">
          {(p) => (
            <select className="alan" {...p} value={tarih} onChange={(e) => setTarih(e.target.value)}>
              {TARIHLER.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          )}
        </Alan>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          <span className="etiket">Kişi</span>
          <Adet label="Kişi sayısı" value={kisi} onChange={setKisi} min={1} max={4} />
        </div>
        <Alan label="Ad soyad" hata={hata}>
          {(p) => <input className="alan" {...p} value={ad} onChange={(e) => setAd(e.target.value)} autoComplete="name" />}
        </Alan>
        <p className="rakam text-[24px]" data-kurs-toplam={k.fiyat * kisi}>
          {tl(k.fiyat * kisi)}
        </p>
        <div>
          <WabiButton type="submit" data-kurs-ayir="">
            Yerimi ayır
          </WabiButton>
        </div>
      </form>
      {tamam ? (
        <p className="mt-6 flex items-start gap-3 text-[16.5px]" role="status" data-kurs-tamam="">
          <Ikon ad="tik" boyut={18} className="mt-1.5 shrink-0" />
          {tamam}
        </p>
      ) : null}
    </div>
  )
}

/* ───────────────────────── Uygulama 2 · Zen merkezi ───────────────────────── */

const SURELER = [
  { id: '30', ad: '30 sn', sn: 30 },
  { id: '180', ad: '3 dk', sn: 180 },
  { id: '300', ad: '5 dk', sn: 300 },
  { id: '600', ad: '10 dk', sn: 600 },
]
const mmss = (sn: number) => `${Math.floor(sn / 60)}:${String(Math.floor(sn % 60)).padStart(2, '0')}`

export function Zen() {
  const { k, hareket, duyur } = useWabi()
  const [sureId, setSureId] = useState('180')
  const [gecen, setGecen] = useState(0)
  const [durum, setDurum] = useState<'hazir' | 'calisiyor' | 'duraklatildi' | 'bitti'>('hazir')
  const baslangic = useRef(0)
  const birikim = useRef(0)
  const toplam = SURELER.find((s) => s.id === sureId)!.sn
  const yol = useMemo(() => elDairesi(96, 5, k), [k])
  useEffect(() => {
    if (durum !== 'calisiyor') return
    const t = window.setInterval(() => {
      const g = birikim.current + (performance.now() - baslangic.current) / 1000
      if (g >= toplam) {
        window.clearInterval(t)
        setGecen(toplam)
        setDurum('bitti')
        duyur('Sessizlik bitti')
      } else setGecen(g)
    }, 250)
    return () => window.clearInterval(t)
  }, [durum, toplam, duyur])
  const baslat = () => {
    if (durum === 'bitti') {
      birikim.current = 0
      setGecen(0)
    }
    baslangic.current = performance.now()
    setDurum('calisiyor')
    if (durum === 'hazir' || durum === 'bitti') duyur(`Sessizlik başladı, ${SURELER.find((s) => s.id === sureId)!.ad}`)
  }
  const duraklat = () => {
    birikim.current += (performance.now() - baslangic.current) / 1000
    setDurum('duraklatildi')
  }
  const sifirla = () => {
    birikim.current = 0
    setGecen(0)
    setDurum('hazir')
  }
  const p = Math.min(1, gecen / toplam)
  // cümle: hareket açıksa çok yavaş değişir (12 sn), kapalıysa yalnız düğmeyle
  const [ci, setCi] = useState(0)
  const [gorunur, setGorunur] = useState(true)
  useEffect(() => {
    if (!hareket) return
    let t2 = 0
    const t = window.setInterval(() => {
      setGorunur(false)
      t2 = window.setTimeout(() => {
        setCi((c) => (c + 1) % CUMLELER.length)
        setGorunur(true)
      }, 2700)
    }, 12000)
    return () => {
      window.clearInterval(t)
      window.clearTimeout(t2)
    }
  }, [hareket])
  const [ayirtilan, setAyirtilan] = useState<string[]>([])
  return (
    <Section
      id="zen"
      no="09"
      madde="Madde 10 · Kullanım alanı · Zen merkezi"
      duzen={0}
      title={
        <>
          Yalnızca <span className="vurgu">otur</span>
        </>
      }
      lead="Meditasyon ve zen merkezi arayüzünde geri sayım bağırmaz. Çember, kalan süre boyunca elle çizilir gibi yavaşça kapanır; rakam küçüktür ve bir kenara çekilmiştir."
    >
      <WabiContainer>
        <Yer b={2} s={5} ind={0} data-zen-sayac={durum}>
          <div className="relative mx-auto grid aspect-square w-full max-w-[420px] place-items-center">
            <svg viewBox="-112 -112 224 224" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true" focusable="false">
              <path d={yol} className="cizgi-yol" style={{ opacity: 0.35 }} />
              <path d={yol} pathLength={1} fill="none" style={{ stroke: 'var(--mat)', strokeWidth: 2.6, strokeLinecap: 'round', strokeDasharray: 1, strokeDashoffset: 1 - p, transition: 'stroke-dashoffset 1.2s linear' }} data-zen-yol={p.toFixed(3)} />
            </svg>
            <div className="relative text-center">
              <p className="baslik text-[clamp(30px,4vw,48px)]" data-zen-metin="">
                {durum === 'hazir' ? 'Otur.' : durum === 'bitti' ? 'Bitti.' : durum === 'duraklatildi' ? 'Bekle.' : 'Sadece otur.'}
              </p>
              <p className="rakam mt-3 text-[17px] text-soluk" data-zen-kalan={Math.ceil(toplam - gecen)}>
                {mmss(Math.max(0, toplam - gecen))}
              </p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {durum === 'calisiyor' ? (
              <WabiButton ton="mat" onClick={duraklat} ikon={<Ikon ad="duraklat" boyut={16} />} data-zen-dugme="duraklat">
                Duraklat
              </WabiButton>
            ) : (
              <WabiButton ton="mat" onClick={baslat} ikon={<Ikon ad="oynat" boyut={16} />} data-zen-dugme="baslat">
                {durum === 'duraklatildi' ? 'Devam' : durum === 'bitti' ? 'Yeniden' : 'Başla'}
              </WabiButton>
            )}
            <WabiButton onClick={sifirla} disabled={durum === 'hazir'} data-zen-dugme="sifirla">
              Sıfırla
            </WabiButton>
          </div>
          <div className="mt-8" role="progressbar" aria-label="Sessizlik ilerlemesi" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(p * 100)} aria-valuetext={`${mmss(gecen)} / ${mmss(toplam)}`}>
            <Secim<string>
              legend="Süre"
              name="zen-sure"
              value={sureId}
              onChange={(v) => {
                setSureId(v)
                sifirla()
              }}
              options={SURELER.map((s) => ({ id: s.id, ad: s.ad }))}
            />
          </div>
        </Yer>
        <Yer b={9} s={4} ind={12} ust={5} className="mt-[clamp(0px,9vw,140px)]">
          <p className="kicker">Günün cümlesi</p>
          <p className="baslik mt-5 min-h-[3.4em] text-[clamp(28px,3vw,44px)] italic" style={{ opacity: gorunur ? 1 : 0, transition: 'opacity 2600ms ease' }} data-cumle={ci}>
            {CUMLELER[ci]}
          </p>
          <div className="mt-6">
            <WabiButton
              ton="metin"
              boy="k"
              onClick={() => {
                setCi((c) => (c + 1) % CUMLELER.length)
                setGorunur(true)
              }}
              ikon={<Ikon ad="ok" boyut={14} />}
              data-cumle-sonraki=""
            >
              Sonraki
            </WabiButton>
          </div>
        </Yer>
        <Yer b={3} s={8} ind={4} ust={3} className="mt-[clamp(48px,8vw,128px)]">
          <div className="overflow-x-auto" role="region" aria-label="Haftalık program" tabIndex={0}>
            <table className="tablo w-full min-w-[620px] border-collapse text-[16px]" data-program="">
              <caption>Haftalık program</caption>
              <thead>
                <tr>
                  {['Gün', 'Saat', 'Oturum', 'Süre', 'Yer'].map((b) => (
                    <th key={b} scope="col" className="etiket">
                      {b}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PROGRAM.map((r) => {
                  const on = ayirtilan.includes(r.gun)
                  return (
                    <tr key={r.gun}>
                      <th scope="row" className="font-normal">
                        {r.gun}
                      </th>
                      <td className="rakam text-[18px]">{r.saat}</td>
                      <td>{r.ad}</td>
                      <td className="tabular-nums">{r.sure} dk</td>
                      <td>
                        {r.yer ? (
                          <WabiButton
                            boy="k"
                            ton={on ? 'mat' : 'cizgi'}
                            aria-pressed={on}
                            aria-label={`${r.gun} ${r.ad}: ${on ? 'yeri bırak' : 'yer ayır'}`}
                            onClick={() => {
                              setAyirtilan((s) => (on ? s.filter((x) => x !== r.gun) : [...s, r.gun]))
                              duyur(on ? 'Yer bırakıldı' : 'Yer ayrıldı')
                            }}
                            ikon={<Ikon ad={on ? 'tik' : 'arti'} boyut={14} />}
                          >
                            {on ? 'Ayrıldı' : `${r.yer} yer`}
                          </WabiButton>
                        ) : (
                          <span className="inline-flex items-center gap-2 text-soluk">
                            <Ikon ad="eksi" boyut={14} /> Dolu
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Yer>
      </WabiContainer>
    </Section>
  )
}

/* ───────────────────────── Uygulama 3 · Mimarlık ofisi ───────────────────────── */

function PlanCizim({ id }: { id: string }) {
  const { k } = useWabi()
  const pr = PROJELER.find((p) => p.id === id)!
  const cizimler = useMemo(
    () =>
      pr.plan.odalar.map(([x, y, w, h, ad], i) => ({
        x,
        y,
        w,
        h,
        ad,
        d: elCerceve(w, h, 30 + i * 7 + pr.yil, k * 0.8, 2),
      })),
    [pr, k],
  )
  return (
    <svg viewBox="0 0 200 150" className="w-full overflow-visible" role="img" aria-label={`${pr.ad} planı, ${pr.alan} metrekare`} data-plan={pr.id}>
      {cizimler.map((o) => (
        <g key={o.ad} transform={`translate(${o.x} ${o.y})`}>
          <path d={o.d} className="cizgi-yol" style={{ strokeWidth: 1.2 }} />
          <text x={o.w / 2} y={o.h / 2 + 3} textAnchor="middle" fontSize="7.5" fontStyle="italic" style={{ fill: 'var(--soluk)', fontFamily: 'var(--font-baslik)', letterSpacing: '0.06em' }}>
            {o.ad}
          </text>
        </g>
      ))}
      {pr.plan.kapilar.map(([x1, y1, x2, y2], i) => (
        <path key={i} d={elCizgisi(x1, y1, x2, y2, 9 + i, 0.4, 20)} style={{ stroke: 'var(--zemin)', strokeWidth: 3.4, fill: 'none' }} />
      ))}
      <path d={elCizgisi(14, 140, 186, 140, 77, k, 40)} className="cizgi-yol" style={{ opacity: 0.6 }} />
      <text x="100" y="148" textAnchor="middle" fontSize="6" style={{ fill: 'var(--soluk)', fontFamily: 'var(--font-metin)', letterSpacing: '0.2em' }}>
        1 : 100
      </text>
    </svg>
  )
}

export function Mimari() {
  const [id, setId] = useState(PROJELER[0].id)
  const p = PROJELER.find((x) => x.id === id)!
  return (
    <Section
      id="mimari"
      no="10"
      madde="Madde 10 · Kullanım alanı · Mimarlık ofisi"
      duzen={1}
      title={
        <>
          Bir plan, bir <span className="vurgu">cümle</span>
        </>
      }
      lead="Minimalist bir mimarlık ofisinin sitesinde proje listesi bir dizindir: ad, yer, yıl. Seçilen proje ekranı tek bir çizimle doldurur; çizimin çevresindeki boşluk projenin kendisi kadar önemlidir."
    >
      <WabiContainer>
        <Yer b={2} s={4} ind={0} ust={0}>
          <ol className="m-0 list-none p-0" data-projeler="">
            {PROJELER.map((x, i) => {
              const on = x.id === id
              return (
                <li key={x.id} className="kayik" style={{ ['--ind' as string]: [0, 10, 4][i] } as CSSProperties}>
                  <button type="button" aria-pressed={on} onClick={() => setId(x.id)} data-proje={x.id} className={cx('block w-full border-0 border-t border-cizgi/60 bg-transparent py-7 text-left', on ? 'text-metin' : 'text-soluk hover:text-metin')} style={{ transition: 'color 1200ms' }}>
                    <span className="rakam text-[15px] tracking-[0.12em]">{String(i + 1).padStart(2, '0')}</span>
                    <span className={cx('baslik mt-1 flex items-center gap-3 text-[clamp(28px,2.8vw,42px)]', on && 'italic')}>
                      {x.ad}
                      {on ? <Ikon ad="nokta" boyut={20} /> : null}
                    </span>
                    <span className="mt-1 block text-[14.5px]">
                      {x.yer} · {x.yil} · {x.alan} m²
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
        </Yer>
        <Yer b={7} s={5} ind={6} ust={3} className="mt-[clamp(0px,8vw,120px)]">
          <Belir key={id}>
            <PlanCizim id={id} />
            <p className="baslik mt-6 max-w-[30ch] text-[clamp(22px,2.2vw,30px)] italic" data-proje-not="">
              {p.not}
            </p>
            <dl className="m-0 mt-8 grid grid-cols-3 gap-6">
              {(
                [
                  ['Yer', p.yer],
                  ['Yıl', String(p.yil)],
                  ['Alan', `${p.alan} m²`],
                ] as const
              ).map(([a, b]) => (
                <div key={a}>
                  <dt className="kicker">{a}</dt>
                  <dd className="rakam m-0 mt-1 text-[20px]">{b}</dd>
                </div>
              ))}
            </dl>
          </Belir>
        </Yer>
      </WabiContainer>
    </Section>
  )
}

/* ───────────────────────── Uygulama 4 · Bağımsız yayın ───────────────────────── */

export function Yayin() {
  const { duyur } = useWabi()
  const [boy, setBoy] = useState(19)
  const [dipnot, setDipnot] = useState(false)
  const [eposta, setEposta] = useState('')
  const [hata, setHata] = useState('')
  const [tamam, setTamam] = useState(false)
  const yazi = useRef<HTMLElement>(null)
  const [ilerleme, setIlerleme] = useState(0)
  useEffect(() => {
    const oku = () => {
      const el = yazi.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const p = (window.innerHeight * 0.4 - r.top) / r.height
      setIlerleme(Math.max(0, Math.min(1, p)))
    }
    oku()
    window.addEventListener('scroll', oku, { passive: true })
    window.addEventListener('resize', oku)
    return () => {
      window.removeEventListener('scroll', oku)
      window.removeEventListener('resize', oku)
    }
  }, [])
  return (
    <Section
      id="yayin"
      no="11"
      madde="Madde 10 · Kullanım alanı · Bağımsız yayın"
      duzen={2}
      title={
        <>
          Okurun <span className="vurgu">kenarı</span>
        </>
      }
      lead="Bağımsız felsefe ve sanat yayınında yazı, sayfanın bir yanına yaslanır; diğer yanı okurun kendisine bırakılır. Kenar notu ancak istenirse açılır, okuma ilerlemesi tek bir ince çizgidir."
    >
      <WabiContainer>
        <Yer b={4} s={5} ind={0} ust={0}>
          <article ref={yazi} className="relative" data-deneme="" style={{ ['--yazi-boy' as string]: `${boy}px` } as CSSProperties}>
            <div className="mb-10 flex flex-wrap items-center justify-between gap-4" role="group" aria-label="Okuma ayarları">
              <p className="kicker">Kenar · Sayı 04 · {DENEME.okuma}</p>
              <div className="flex items-center gap-2">
                <WabiButton boy="k" onClick={() => setBoy((b) => Math.max(17, b - 1))} aria-label="Yazıyı küçült" disabled={boy <= 17} style={{ minWidth: 46, padding: 0 }}>
                  A−
                </WabiButton>
                <WabiButton boy="k" onClick={() => setBoy((b) => Math.min(24, b + 1))} aria-label="Yazıyı büyüt" disabled={boy >= 24} style={{ minWidth: 46, padding: 0 }}>
                  A+
                </WabiButton>
              </div>
            </div>
            <div className="h-px w-full bg-cizgi/40" role="progressbar" aria-label="Okuma ilerlemesi" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(ilerleme * 100)} data-okuma={Math.round(ilerleme * 100)}>
              <div className="h-px bg-metin" style={{ width: `${ilerleme * 100}%`, transition: 'width 1200ms ease' }} />
            </div>
            <h3 className="baslik mt-10 text-[clamp(38px,4.6vw,66px)]">{DENEME.baslik}</h3>
            <p className="mt-4 text-[15px] text-soluk italic">{DENEME.yazar}</p>
            <div className="mt-10 grid grid-cols-1 gap-[1.6em]" style={{ fontSize: 'var(--yazi-boy)', lineHeight: 1.95 }} data-metin-boy={boy}>
              {DENEME.paragraflar.map((t, i) => (
                <p key={i} className="max-w-[36em] font-baslik font-normal" style={{ fontSize: '1.16em', lineHeight: 1.7 }}>
                  {t}
                  {i === 0 ? (
                    <button
                      type="button"
                      aria-expanded={dipnot}
                      aria-controls="dipnot"
                      onClick={() => setDipnot((d) => !d)}
                      className="ml-1 inline-flex min-h-[46px] min-w-[46px] items-start justify-center border-0 bg-transparent align-baseline text-[0.7em] underline decoration-kontrol underline-offset-4"
                      aria-label="Dipnotu göster"
                    >
                      1
                    </button>
                  ) : null}
                </p>
              ))}
            </div>
          </article>
        </Yer>
        <Yer b={10} s={3} ind={8} ust={3} className="mt-[clamp(0px,6vw,80px)]">
          <div id="dipnot" hidden={!dipnot} data-dipnot={dipnot ? 'acik' : 'kapali'}>
            <p className="kicker">Kenar notu 1</p>
            <p className="mt-3 text-[15.5px] text-soluk">{DENEME.dipnot}</p>
          </div>
          {!dipnot ? <p className="text-[14.5px] text-soluk italic">Kenar boş bırakıldı. Notu açmak için metindeki 1’e dokunun.</p> : null}
        </Yer>
        <Yer b={2} s={3} ind={0} ust={2} className="mt-[clamp(40px,7vw,120px)]">
          <p className="kicker">Sayılar</p>
          <ol className="m-0 mt-5 list-none p-0" data-sayilar="">
            {SAYILAR.map((s, i) => (
              <li key={s.no} className="kayik border-t border-cizgi/50 py-5" style={{ ['--ind' as string]: [0, 8, 3, 12][i] } as CSSProperties}>
                <span className="rakam text-[14px] tracking-[0.12em] text-soluk">
                  {s.no} · {s.yil}
                </span>
                <span className="baslik mt-1 block text-[26px]">{s.ad}</span>
                <span className="block text-[14.5px] text-soluk">{s.konu}</span>
              </li>
            ))}
          </ol>
        </Yer>
        <Yer b={7} s={4} ind={6} ust={2} className="mt-[clamp(40px,7vw,120px)]">
          <p className="kicker">Sonraki sayı</p>
          <form
            className="mt-5 grid grid-cols-1 gap-5"
            noValidate
            onSubmit={(e) => {
              e.preventDefault()
              if (!EPOSTA.test(eposta)) {
                setHata('Geçerli bir e-posta adresi yazın.')
                setTamam(false)
                duyur('E-posta geçersiz')
                return
              }
              setHata('')
              setTamam(true)
              duyur('Kayıt alındı')
            }}
            data-abone=""
          >
            <Alan label="E-posta" hata={hata}>
              {(p) => <input className="alan" type="email" {...p} value={eposta} onChange={(e) => setEposta(e.target.value)} autoComplete="email" />}
            </Alan>
            <div>
              <WabiButton type="submit">Haber ver</WabiButton>
            </div>
          </form>
          {tamam ? (
            <p className="mt-5 flex items-center gap-3 text-[16px]" role="status" data-abone-tamam="">
              <Enso boyut={28} tohum={3} kalin={5} /> Kayıt alındı. Yılda dört kez yazarız.
            </p>
          ) : null}
        </Yer>
      </WabiContainer>
      <div className="mx-auto mt-[calc(var(--uzay)*1.4)] w-full max-w-[calc(1360px+2*var(--kenar))] px-[var(--kenar)]">
        <Bolucu tohum={13} />
      </div>
    </Section>
  )
}
