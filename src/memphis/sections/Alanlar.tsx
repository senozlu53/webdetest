import { useRef, useState, type KeyboardEvent } from 'react'
import { cx } from '../../shared/cx'
import { useMemphis } from '../lib/store'
import { BILETLER, CARK, ISLER, PROGRAM, SAHNELER, SORULAR, type Sekil as SekilTur, type Ton } from '../lib/data'
import { MemphisCard } from '../components/MemphisCard'
import { PopButton } from '../components/PopButton'
import { konfetiPatlat } from '../components/KonfetiKatmani'
import { DOLGU, Sekil } from '../components/Shapes'
import { Ikon, UiIkon } from '../components/Icons'
import { Hap, Section, Secim } from '../components/ui'

const TL = (n: number) => `${n.toLocaleString('tr-TR')} TL`
const YAZI: Record<Ton, string> = { sari: '', camgobegi: '', pembe: 'on-pink', beyaz: '', lacivert: 'text-paper' }

/** Madde 10 · 11: yaratıcı ajans. Üst üste binen asimetrik kart ızgarası */
export function Ajans() {
  const [tur, setTur] = useState('Hepsi')
  const [sec, setSec] = useState(ISLER[0].id)
  const turler = ['Hepsi', ...new Set(ISLER.map((i) => i.tur))]
  const liste = ISLER.filter((i) => tur === 'Hepsi' || i.tur === tur)
  const secili = ISLER.find((i) => i.id === sec) ?? ISLER[0]
  // Masaüstü yerleşimi: kartlar 6 sütunlu ızgarada farklı genişlik ve yükseklikte, birbirinin üstüne taşar
  const YER = ['lg:col-span-3 lg:mt-0', 'lg:col-span-3 lg:mt-14 lg:-ml-3', 'lg:col-span-2 lg:-mt-4', 'lg:col-span-2 lg:mt-8 lg:-ml-3', 'lg:col-span-2 lg:mt-1 lg:-ml-3']
  return (
    <Section id="ajans" madde="Madde 10 · 11 · Yaratıcı ajans" title="Konfeti" vurgu="Kolektif" ton="pembe" sekil="zikzak" lead="Küçük bir tasarım stüdyosunun iş listesi. Kartlar eğik, boyları farklı, kenarları birbirinin üstüne biner; üstüne gelince yayla düzelip öne çıkar. Telefonda alt alta dizilir, eğiklikleri kalır.">
      <Secim legend="İş türü" name="ajans-tur" value={tur} onChange={setTur} ton="pembe" options={turler.map((t) => ({ id: t, ad: t }))} />
      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1.618fr_1fr]">
        <ul className="m-0 grid list-none grid-cols-1 gap-8 p-0 sm:grid-cols-2 lg:grid-cols-6 lg:gap-x-0 lg:gap-y-2" data-ajans="">
          {liste.map((is, i) => (
            <MemphisCard as="li" key={is.id} kimlik={`is-${is.id}`} ton={is.ton} aci={5} className={cx('relative rounded-[20px] p-6 hover:z-20 focus-within:z-20', YER[ISLER.indexOf(is)], sec === is.id && 'outline-[4px] outline-offset-4 outline-ink outline-dashed')} style={{ zIndex: i + 1 }}>
              <div className="flex items-start justify-between gap-3">
                <Sekil tur={is.sekil} ton={is.ton === 'sari' ? 'pembe' : is.ton === 'pembe' ? 'sari' : is.ton === 'camgobegi' ? 'sari' : 'camgobegi'} boyut={64} golge />
                <span className="font-mono text-[14px] font-bold">{is.yil}</span>
              </div>
              <h3 className="mt-4 text-[28px]">
                <button type="button" onClick={() => setSec(is.id)} aria-pressed={sec === is.id} className="text-left after:absolute after:inset-0 after:content-['']">
                  {is.ad}
                </button>
              </h3>
              <p className="mt-2 font-bold">{is.musteri}</p>
              <Hap ton="beyaz" className="mt-3">
                {is.tur}
              </Hap>
            </MemphisCard>
          ))}
        </ul>
        <MemphisCard as="aside" kimlik="ajans-detay" ton="beyaz" aci={1.5} oyuncak={false} className="min-w-0 self-start rounded-[4px_40px_4px_40px] p-6" aria-live="polite">
          <p className="kicker text-muted">Seçili iş</p>
          <p className="dev mt-2 text-[40px]">{secili.ad}</p>
          <p className="mt-3 text-[17px]">
            {secili.musteri} için {secili.yil} yılında hazırlandı. Kimlik tek bir primitiften büyüdü: {secili.sekil === 'daire' ? 'daire' : secili.sekil === 'ucgen' ? 'üçgen' : secili.sekil === 'zikzak' ? 'zikzak' : secili.sekil === 'dalga' ? 'dalga' : 'silindir'}. Renkler paletin dördünden ikisi, kontur hep 4 piksel.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Ikon ad="kalem" etiket="Tasarım" />
            <Ikon ad="kamera" etiket="Fotoğraf" />
            <Ikon ad="kupa" etiket="Ödül" />
          </div>
        </MemphisCard>
      </div>
    </Section>
  )
}

const GUNLER = [
  ['cuma', 'Cuma', '12 Eylül'],
  ['cumartesi', 'Cumartesi', '13 Eylül'],
  ['pazar', 'Pazar', '14 Eylül'],
] as const

/** Madde 10 · 11: festival sitesi. Gün sekmeleri, sahne rengi + deseni, hap biçimli bilet seçimi */
export function Festival() {
  const s = useMemphis()
  const [gun, setGun] = useState<(typeof GUNLER)[number][0]>('cuma')
  const [sahne, setSahne] = useState('hepsi')
  const [fav, setFav] = useState<string[]>([])
  const [bilet, setBilet] = useState('hafta')
  const [adet, setAdet] = useState(2)
  const sekmeler = useRef<(HTMLButtonElement | null)[]>([])
  const b = BILETLER.find((x) => x.id === bilet)!
  const liste = PROGRAM.filter((p) => p.gun === gun && (sahne === 'hepsi' || p.sahne === sahne))
  const sekmeTus = (i: number) => (e: KeyboardEvent) => {
    const n = e.key === 'ArrowRight' ? (i + 1) % 3 : e.key === 'ArrowLeft' ? (i + 2) % 3 : e.key === 'Home' ? 0 : e.key === 'End' ? 2 : -1
    if (n < 0) return
    e.preventDefault()
    setGun(GUNLER[n][0])
    sekmeler.current[n]?.focus()
  }
  return (
    <Section id="festival" madde="Madde 10 · Festival" title="Zikzak" vurgu="Festivali" ton="sari" sekil="dalga" lead="Üç gün, üç sahne, on bir konser. Sahneler renk kodludur ama rengin yanında hep adı yazar; desen modunda her sahnenin kendi deseni de olur. Festival, sanatçılar ve fiyatlar kurgudur.">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.618fr_1fr]">
        <div className="min-w-0">
          <div role="tablist" aria-label="Festival günleri" className="flex flex-wrap gap-3">
            {GUNLER.map(([id, ad, tarih], i) => (
              <button key={id} ref={(el) => void (sekmeler.current[i] = el)} role="tab" id={`gun-${id}`} aria-selected={gun === id} aria-controls="gun-panel" tabIndex={gun === id ? 0 : -1} onKeyDown={sekmeTus(i)} onClick={() => setGun(id)} className={cx('rounded-full border-[4px] border-ink px-5 py-2 text-left font-extrabold', gun === id ? 'bg-ink text-paper shadow-[4px_4px_0_var(--pink)]' : 'bg-paper')}>
                {ad} <span className="block text-[13px] font-bold">{tarih}</span>
              </button>
            ))}
          </div>
          <div className="mt-6">
            <Secim legend="Sahne" name="fes-sahne" value={sahne} onChange={setSahne} ton="camgobegi" options={[{ id: 'hepsi', ad: 'Hepsi' }, ...SAHNELER.map((x) => ({ id: x.id, ad: x.ad }))]} />
          </div>
          <div role="tabpanel" id="gun-panel" aria-labelledby={`gun-${gun}`} tabIndex={0} className="mt-6">
            <ol className="m-0 grid list-none gap-4 p-0" data-program="">
              {liste.map((p) => {
                const sh = SAHNELER.find((x) => x.id === p.sahne)!
                const f = fav.includes(p.sanatci)
                return (
                  <li key={p.sanatci} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-[16px] border-[4px] border-ink bg-paper p-3 shadow-[5px_5px_0_var(--shadow)] sm:p-4">
                    <span className="dev text-[26px] tabular-nums">{p.saat}</span>
                    <span className="min-w-0">
                      <span className="block truncate text-[20px] font-extrabold">{p.sanatci}</span>
                      <span className="mt-1 flex flex-wrap items-center gap-2 text-[15px]">
                        <span data-kod={sh.id} className={cx('inline-flex items-center rounded-full border-[3px] border-ink px-2.5 py-0.5 font-bold', sh.ton === 'pembe' ? 'on-pink' : sh.ton === 'sari' ? 'bg-yellow' : 'bg-teal')}>
                          <span className="etiket">{sh.ad}</span>
                        </span>
                        {p.tur}
                      </span>
                    </span>
                    <button
                      type="button"
                      aria-pressed={f}
                      aria-label={`${p.sanatci} favorilere ${f ? 'eklendi' : 'ekle'}`}
                      onClick={() => {
                        setFav((l) => (f ? l.filter((x) => x !== p.sanatci) : [...l, p.sanatci]))
                        s.duyur(f ? `${p.sanatci} favorilerden çıktı` : `${p.sanatci} favorilere eklendi`)
                      }}
                      className={cx('kipir grid size-12 place-items-center rounded-full border-[3px] border-ink', f ? 'bg-yellow' : 'bg-paper')}
                    >
                      <svg viewBox="0 0 48 48" width={28} height={28} aria-hidden="true">
                        <path d="M24 5 L29 18 L43 18 L32 27 L36 41 L24 33 L12 41 L16 27 L5 18 L19 18 Z" fill={f ? 'var(--pink)' : 'var(--paper)'} stroke="var(--ink)" strokeWidth={4} strokeLinejoin="round" />
                      </svg>
                    </button>
                  </li>
                )
              })}
              {!liste.length ? <li className="rounded-[16px] border-[4px] border-dashed border-ink p-4 font-bold">Bu sahnede o gün konser yok.</li> : null}
            </ol>
          </div>
        </div>
        <MemphisCard as="form" kimlik="bilet" ton="sari" aci={2} oyuncak={false} className="min-w-0 self-start rounded-[26px] p-6" onSubmit={(e) => e.preventDefault()} aria-labelledby="bilet-b">
          <div className="flex items-center gap-3">
            <Ikon ad="bilet" boyut={44} />
            <h3 id="bilet-b" className="text-[34px]">
              Bilet
            </h3>
          </div>
          <fieldset className="mt-5 grid gap-3 border-0 p-0">
            <legend className="kicker mb-2">Tür</legend>
            {BILETLER.map((x) => (
              <label key={x.id} className={cx('flex cursor-pointer items-center justify-between gap-3 rounded-full border-[4px] border-ink px-5 py-3 has-[:focus-visible]:outline-4 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-[var(--focus)]', bilet === x.id ? 'bg-paper shadow-[4px_4px_0_var(--shadow)]' : 'bg-yellow-50')}>
                <input type="radio" name="bilet" className="sr-only" checked={bilet === x.id} onChange={() => setBilet(x.id)} />
                <span className="flex items-center gap-2">
                  <span className={cx('grid size-6 place-items-center rounded-full border-[3px] border-ink', bilet === x.id ? 'bg-pink' : 'bg-paper')} aria-hidden="true">
                    {bilet === x.id ? <span className="size-2 rounded-full bg-ink" /> : null}
                  </span>
                  <span>
                    <span className="block font-extrabold">{x.ad}</span>
                    <span className="block text-[14px]">{x.not}</span>
                  </span>
                </span>
                <span className="font-extrabold tabular-nums">{TL(x.fiyat)}</span>
              </label>
            ))}
          </fieldset>
          <div className="mt-5 flex items-center justify-between gap-4">
            <span className="kicker" id="adet-b">
              Adet
            </span>
            <div className="flex items-center gap-3" role="group" aria-labelledby="adet-b">
              <button type="button" onClick={() => setAdet(Math.max(1, adet - 1))} disabled={adet <= 1} aria-label="Bir azalt" className="grid size-11 place-items-center rounded-full border-[3px] border-ink bg-paper disabled:border-dashed">
                <UiIkon ad="eksi" />
              </button>
              <output className="dev w-8 text-center text-[30px] tabular-nums" aria-live="polite" data-adet="">
                {adet}
              </output>
              <button type="button" onClick={() => setAdet(Math.min(8, adet + 1))} disabled={adet >= 8} aria-label="Bir artır" className="grid size-11 place-items-center rounded-full border-[3px] border-ink bg-paper disabled:border-dashed">
                <UiIkon ad="arti" />
              </button>
            </div>
          </div>
          <p className="mt-5 flex items-baseline justify-between border-t-[4px] border-ink pt-4">
            <span className="font-bold">Toplam</span>
            <span className="dev text-[36px] tabular-nums" data-toplam="">
              {TL(b.fiyat * adet)}
            </span>
          </p>
          <PopButton type="submit" ton="pembe" boy="b" konfeti className="mt-5 w-full" onClick={() => s.duyur(`${adet} ${b.ad} bilet sepete eklendi, toplam ${TL(b.fiyat * adet)}`)}>
            Sepete ekle
          </PopButton>
        </MemphisCard>
      </div>
    </Section>
  )
}

const SIK: { harf: string; sekil: SekilTur; ton: Ton }[] = [
  { harf: 'A', sekil: 'daire', ton: 'sari' },
  { harf: 'B', sekil: 'ucgen', ton: 'pembe' },
  { harf: 'C', sekil: 'kare', ton: 'camgobegi' },
  { harf: 'D', sekil: 'arti', ton: 'beyaz' },
]

/** Madde 10: eğitim teknolojisi. Şekil Okulu: her şık harf + şekil + renk (renk tek başına değil) */
export function Okul() {
  const s = useMemphis()
  const [i, setI] = useState(0)
  const [cevap, setCevap] = useState<number | null>(null)
  const [puan, setPuan] = useState(0)
  const bitti = i >= SORULAR.length
  const q = SORULAR[Math.min(i, SORULAR.length - 1)]
  const sonraki = useRef<HTMLButtonElement>(null)
  const sec = (k: number, e: { clientX: number; clientY: number; currentTarget: HTMLElement }) => {
    if (cevap !== null) return
    setCevap(k)
    const dogru = k === q.dogru
    if (dogru) {
      setPuan(puan + 1)
      const r = e.currentTarget.getBoundingClientRect()
      konfetiPatlat(e.clientX || r.left + r.width / 2, e.clientY || r.top + r.height / 2)
    }
    s.duyur(dogru ? `Doğru! ${q.aciklama}` : `Olmadı. Doğru cevap ${SIK[q.dogru].harf}: ${q.secenek[q.dogru]}. ${q.aciklama}`)
    window.setTimeout(() => sonraki.current?.focus(), 30)
  }
  return (
    <Section id="okul" madde="Madde 10 · Eğitim teknolojisi" title="Şekil" vurgu="Okulu" ton="camgobegi" sekil="kare" lead="Beş soruluk geometri yarışması. Şıklar büyük hap düğmeler; her birinde harf, şekil ve renk birlikte durur, böylece renk körü bir öğrenci de 'pembe olan' yerine 'B, üçgen' der.">
      <MemphisCard kimlik="okul" ton="beyaz" aci={1} oyuncak={false} className="mx-auto max-w-[880px] rounded-[26px] p-5 md:p-8" data-okul="">
        <div className="flex items-center justify-between gap-4">
          <ol className="m-0 flex list-none gap-2 p-0" aria-label={`İlerleme: ${Math.min(i + 1, SORULAR.length)} / ${SORULAR.length}`}>
            {SORULAR.map((_, k) => (
              <li key={k} className={cx('h-4 w-8 rounded-full border-[3px] border-ink sm:w-12', k < i ? 'bg-teal' : k === i && !bitti ? 'bg-yellow' : 'bg-paper')} aria-hidden="true" />
            ))}
          </ol>
          <span className="font-extrabold tabular-nums" data-puan="">
            Puan {puan}
          </span>
        </div>
        {bitti ? (
          <div className="mt-8 grid justify-items-center gap-5 text-center">
            <Ikon ad="kupa" boyut={96} />
            <p className="dev text-[48px]">
              {puan} / {SORULAR.length}
            </p>
            <p className="text-[19px]">{puan === SORULAR.length ? 'Hepsi doğru. Sottsass gurur duyardı.' : puan >= 3 ? 'Güzel! Bir tur daha?' : 'Şekiller seni bekliyor. Tekrar dene.'}</p>
            <PopButton
              ton="camgobegi"
              boy="b"
              onClick={() => {
                setI(0)
                setPuan(0)
                setCevap(null)
              }}
            >
              Baştan başla
            </PopButton>
          </div>
        ) : (
          <>
            <p className="kicker mt-8 text-muted">
              Soru {i + 1} / {SORULAR.length}
            </p>
            <h3 className="mt-2 text-[clamp(26px,3.6vw,40px)] leading-[1.05]" id="soru">
              {q.soru}
            </h3>
            <ul className="m-0 mt-7 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2" aria-labelledby="soru">
              {q.secenek.map((sec_, k) => {
                const sk = SIK[k]
                const durum = cevap === null ? '' : k === q.dogru ? 'dogru' : k === cevap ? 'yanlis' : 'soluk'
                return (
                  <li key={k}>
                    <button
                      type="button"
                      onClick={(e) => sec(k, e)}
                      aria-disabled={cevap !== null}
                      className={cx('flex w-full items-center gap-4 rounded-full border-[4px] border-ink py-2 pr-5 pl-2 text-left text-[20px] font-extrabold shadow-[5px_5px_0_var(--shadow)]', sk.ton === 'pembe' ? 'on-pink' : sk.ton === 'sari' ? 'bg-yellow' : sk.ton === 'camgobegi' ? 'bg-teal' : 'bg-paper', durum === 'soluk' && '!bg-paper border-dashed shadow-none', durum === 'dogru' && 'outline-[5px] outline-offset-4 outline-ink', durum === 'yanlis' && 'line-through decoration-[4px]')}
                      data-sik={k}
                    >
                      <span className="grid size-12 shrink-0 place-items-center rounded-full border-[3px] border-ink bg-paper">
                        <Sekil tur={sk.sekil} ton={sk.ton === 'beyaz' ? 'camgobegi' : sk.ton} boyut={30} kontur />
                      </span>
                      <span className="w-6 shrink-0">{sk.harf}</span>
                      <span>{sec_}</span>
                      {durum === 'dogru' ? <UiIkon ad="tik" className="ml-auto" /> : durum === 'yanlis' ? <UiIkon ad="kapat" className="ml-auto" /> : null}
                    </button>
                  </li>
                )
              })}
            </ul>
            {cevap !== null ? (
              <div className={cx('mt-7 flex flex-wrap items-center justify-between gap-4 rounded-[18px] border-[4px] border-ink p-4', cevap === q.dogru ? 'bg-teal-50' : 'bg-pink-50')} data-geri-bildirim={cevap === q.dogru ? 'dogru' : 'yanlis'}>
                <p className="max-w-[52ch]">
                  <span className="font-extrabold">{cevap === q.dogru ? 'Doğru! ' : `Olmadı: doğru cevap ${SIK[q.dogru].harf}. `}</span>
                  {q.aciklama}
                </p>
                <PopButton
                  ref={sonraki}
                  ton="lacivert"
                  onClick={() => {
                    setI(i + 1)
                    setCevap(null)
                  }}
                  ikon={<UiIkon ad="ok" />}
                  className="flex-row-reverse"
                >
                  {i + 1 < SORULAR.length ? 'Sonraki' : 'Sonuç'}
                </PopButton>
              </div>
            ) : null}
          </>
        )}
      </MemphisCard>
    </Section>
  )
}

/** Madde 10 · 16: eğlence platformu. Parti çarkı yaylanarak durur */
export function Cark() {
  const s = useMemphis()
  const [aci, setAci] = useState(0)
  const [donuyor, setDonuyor] = useState(false)
  const [sonuc, setSonuc] = useState<number | null>(null)
  const n = CARK.length
  const dilim = 360 / n
  const hedef = useRef(0)
  const R = 150
  const cevir = () => {
    if (donuyor) return
    const k = Math.floor(Math.random() * n)
    hedef.current = k
    // Dilim k göstergenin (üst) altına gelsin: dilim merkezi = k·dilim + dilim/2
    const tur = 360 * (4 + Math.floor(Math.random() * 3))
    const yeni = aci - (aci % 360) + tur + (360 - (k * dilim + dilim / 2))
    setSonuc(null)
    setAci(yeni)
    if (!s.hareket) {
      setSonuc(k)
      s.duyur(`Çark durdu: ${CARK[k].metin}`)
    } else setDonuyor(true)
  }
  const dur = () => {
    if (!donuyor) return
    setDonuyor(false)
    setSonuc(hedef.current)
    s.duyur(`Çark durdu: ${CARK[hedef.current].metin}`)
  }
  const yol = (i: number) => {
    const a0 = ((i * dilim - 90) * Math.PI) / 180
    const a1 = (((i + 1) * dilim - 90) * Math.PI) / 180
    return `M0 0 L${R * Math.cos(a0)} ${R * Math.sin(a0)} A${R} ${R} 0 0 1 ${R * Math.cos(a1)} ${R * Math.sin(a1)} Z`
  }
  return (
    <Section id="cark" madde="Madde 10 · 16 · Eğlence platformu" title="Konfeti" vurgu="Kutusu" ton="pembe" sekil="arti" lead="Parti oyunu çarkı. Döner, yavaşlar, hedefi biraz geçip geri yaylanır. Hareket kapalıysa çark dönmeden sonuca geçer.">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1.618fr]">
        <div className="relative mx-auto aspect-square w-full max-w-[380px]">
          <svg viewBox="-170 -175 340 350" className="block size-full" role="img" aria-label={`Parti çarkı, ${n} dilim${sonuc !== null ? `, sonuç: ${CARK[sonuc].metin}` : ''}`}>
            <circle r={R + 10} cx={6} cy={8} fill="var(--shadow)" />
            <g style={{ rotate: `${aci}deg`, transition: s.hareket ? 'rotate 3.2s cubic-bezier(.15,.85,.25,1.06)' : 'none' }} onTransitionEnd={dur} data-cark="">
              <circle r={R + 10} fill="var(--paper)" stroke="var(--ink)" strokeWidth={5} />
              {CARK.map((c, i) => {
                const orta = i * dilim + dilim / 2 - 90
                return (
                  <g key={i}>
                    <path d={yol(i)} fill={DOLGU[c.ton]} stroke="var(--ink)" strokeWidth={4} strokeLinejoin="round" />
                    <text transform={`rotate(${orta}) translate(${R * 0.58} 0) ${orta > 90 && orta < 270 ? 'rotate(180)' : ''}`} textAnchor="middle" dominantBaseline="middle" fontSize={13.5} fontWeight={800} fill={c.ton === 'pembe' ? '#000000' : 'var(--ink)'} fontFamily="var(--font-sans)">
                      {c.metin}
                    </text>
                  </g>
                )
              })}
              <circle r={22} fill="var(--yellow)" stroke="var(--ink)" strokeWidth={5} />
            </g>
            <path d="M-16 -172 L16 -172 L0 -142 Z" fill="var(--pink)" stroke="var(--ink)" strokeWidth={4} strokeLinejoin="round" />
          </svg>
        </div>
        <div className="grid grid-cols-1 justify-items-start gap-6">
          <PopButton ton="sari" boy="b" onClick={cevir} disabled={donuyor} ikon={<UiIkon ad="karistir" />} data-cevir="">
            {donuyor ? 'Dönüyor…' : 'Çarkı çevir'}
          </PopButton>
          <MemphisCard kimlik="cark-sonuc" ton={sonuc === null ? 'beyaz' : CARK[sonuc].ton === 'beyaz' ? 'camgobegi' : CARK[sonuc].ton} aci={3} className={cx('min-h-[150px] w-full max-w-[520px] rounded-[26px] p-6', sonuc !== null && YAZI[CARK[sonuc].ton])} aria-live="polite" data-sonuc="">
            <p className="kicker">Sıradaki görev</p>
            <p className="dev mt-3 text-[clamp(34px,5vw,56px)]">{sonuc === null ? (donuyor ? '…' : 'Çevir!') : CARK[sonuc].metin}</p>
          </MemphisCard>
        </div>
      </div>
    </Section>
  )
}
