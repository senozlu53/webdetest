import { useEffect, useRef, useState } from 'react'
import { cx } from '../../shared/cx'
import { useKawaii } from '../lib/store'
import { RENK, RUH_AD, type MaskotRenk, type Ruh } from '../lib/maskot'
import { CloudCard } from '../components/CloudCard'
import { KawaiiButton } from '../components/KawaiiButton'
import { KawaiiProgress } from '../components/KawaiiProgress'
import { LottieMascot } from '../components/LottieMascot'
import { Ikon, type IkonAd } from '../components/Icons'
import { Secim, Section } from '../components/ui'

const CIFTLER: { ikon: IkonAd; ad: string }[] = [
  { ikon: 'elma', ad: 'elma' },
  { ikon: 'yildiz', ad: 'yıldız' },
  { ikon: 'kalp', ad: 'kalp' },
  { ikon: 'top', ad: 'top' },
  { ikon: 'cicek', ad: 'çiçek' },
  { ikon: 'damla', ad: 'damla' },
]
/** Tohumlu karıştırma: her "yeniden karıştır" aynı sırayı üretir, testler öngörülebilir */
function karistir(tohum: number) {
  const l = [...CIFTLER, ...CIFTLER].map((c, i) => ({ ...c, id: i }))
  let s = tohum * 9301 + 49297
  for (let i = l.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280
    const j = Math.floor((s / 233280) * (i + 1))
    ;[l[i], l[j]] = [l[j], l[i]]
  }
  return l
}

/** Madde 10: sevimli oyun. Kartlar dönünce jöle gibi esner */
export function Hafiza() {
  const { duyur } = useKawaii()
  const [tohum, setTohum] = useState(1)
  const [kartlar, setKartlar] = useState(() => karistir(1))
  const [acik, setAcik] = useState<number[]>([])
  const [bulunan, setBulunan] = useState<string[]>([])
  const [hamle, setHamle] = useState(0)
  const kilit = useRef(false)
  const bitti = bulunan.length === CIFTLER.length
  const cevir = (k: number) => {
    if (kilit.current || acik.includes(k) || bulunan.includes(kartlar[k].ikon)) return
    const yeni = [...acik, k]
    setAcik(yeni)
    if (yeni.length === 2) {
      setHamle((h) => h + 1)
      const [a, b] = yeni.map((x) => kartlar[x])
      if (a.ikon === b.ikon) {
        const son = [...bulunan, a.ikon]
        setBulunan(son)
        setAcik([])
        duyur(son.length === CIFTLER.length ? `Hepsini buldun! ${hamle + 1} hamle.` : `Eşleşti: iki ${a.ad}.`)
      } else {
        kilit.current = true
        duyur(`${a.ad} ve ${b.ad}, eşleşmedi. Kartlar kapanıyor.`)
        window.setTimeout(() => {
          setAcik([])
          kilit.current = false
        }, 900)
      }
    } else duyur(`${kartlar[k].ad}`)
  }
  const yeniden = () => {
    const t = tohum + 1
    setTohum(t)
    setKartlar(karistir(t))
    setAcik([])
    setBulunan([])
    setHamle(0)
    kilit.current = false
  }
  return (
    <Section id="hafiza" madde="Madde 10 · Sevimli oyun" title="Hafıza bulutları" lead="Altı çift gülen ikon. Kart döndüğünde yüzü görünür; eşleşen çift nane rengine döner ve yerinde hafifçe zıplar.">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
        <ul className="m-0 grid min-w-0 list-none grid-cols-3 gap-3 p-0 sm:grid-cols-4 sm:gap-4" aria-label="Hafıza kartları" data-hafiza="">
          {kartlar.map((c, k) => {
            const gorunur = acik.includes(k) || bulunan.includes(c.ikon)
            const eslesti = bulunan.includes(c.ikon)
            return (
              <li key={c.id} className="kart-sahne">
                <button type="button" onClick={() => cevir(k)} className={cx('kart', gorunur && 'acik', eslesti && 'eslesti')} aria-label={`Kart ${k + 1}, ${gorunur ? c.ad : 'kapalı'}${eslesti ? ', eşleşti' : ''}`} aria-disabled={eslesti || undefined} data-kart={k}>
                  <span className="kart-arka" aria-hidden="true">
                    <Ikon ad="bulut" boyut={46} yuz={false} />
                  </span>
                  <span className="kart-on" aria-hidden="true">
                    <Ikon ad={c.ikon} boyut={54} ruh={eslesti ? 'mutlu' : 'mutlu'} />
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
        <div className="grid min-w-0 grid-cols-1 content-start gap-6">
          <CloudCard renk={bitti ? 'mint' : 'paper'} className="px-6 pt-8 pb-6" maskot={<LottieMascot ruh={bitti ? 'heyecanli' : 'saskin'} renk="peach" boyut={84} />}>
            <p className="font-display text-[26px] font-extrabold">{bitti ? 'Hepsini buldun!' : 'Çiftleri bul'}</p>
            <p className="mt-1 text-[16px] tabular-nums" data-hamle={hamle}>
              {hamle} hamle
            </p>
            <KawaiiProgress className="mt-4" etiket="Bulunan çift" deger={bulunan.length} max={CIFTLER.length} maskot={false} renk="mint" birim={(d, m) => `${d} / ${m}`} />
          </CloudCard>
          <KawaiiButton renk="salmon" onClick={yeniden} ikon={<Ikon ad="yenile" boyut={24} />}>
            Yeniden karıştır
          </KawaiiButton>
        </div>
      </div>
    </Section>
  )
}

type Stat = { tok: number; mutlu: number; enerji: number }
const sinirla = (v: number) => Math.max(0, Math.min(100, v))

/** Madde 10: evcil hayvan bakımı. Pofuduk'un ruh hali göstergelerden türer */
export function Pofuduk() {
  const { duyur, hareket } = useKawaii()
  const [st, setSt] = useState<Stat>({ tok: 55, mutlu: 70, enerji: 60 })
  const [renk, setRenk] = useState<MaskotRenk>('mint')
  const [uyku, setUyku] = useState(false)
  const [eylem, setEylem] = useState('')
  useEffect(() => {
    if (!hareket) return
    // Zaman geçtikçe çok yavaş acıkır; hareket kapalıyken göstergeler donar
    const t = window.setInterval(
      () =>
        setSt((s) => ({
          tok: sinirla(s.tok - 1),
          mutlu: sinirla(s.mutlu - 1),
          enerji: s.enerji,
        })),
      8000,
    )
    return () => window.clearInterval(t)
  }, [hareket])
  useEffect(() => {
    if (!uyku) return
    const t = window.setTimeout(() => setUyku(false), 2600)
    return () => window.clearTimeout(t)
  }, [uyku])
  const ruh: Ruh = uyku ? 'uykulu' : st.tok < 25 || st.mutlu < 25 ? 'uzgun' : st.enerji < 30 ? 'uykulu' : st.tok > 75 && st.mutlu > 75 ? 'heyecanli' : 'mutlu'
  const yap = (ad: string, f: (s: Stat) => Stat, mesaj: string) => {
    setSt((s) => f(s))
    setEylem(ad)
    duyur(mesaj)
  }
  return (
    <Section id="pofuduk" madde="Madde 10 · Evcil hayvan bakımı" title="Pofuduk'a bak" lead="Sanal dostun ruh hali üç göstergeden hesaplanır: tokluk ve mutluluk düşerse üzülür, enerji azalırsa uykusu gelir, ikisi de dolunca heyecanlanır. Bakım hiç acil değil; göstergeler çok yavaş iner.">
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_1.2fr]">
        <CloudCard renk="peach" className="grid min-w-0 justify-items-center gap-3 px-6 pt-8 pb-7 text-center" data-pofuduk={ruh}>
          <LottieMascot ruh={ruh} renk={renk} boyut={200} etiket={`Pofuduk, ${RUH_AD[ruh].toLocaleLowerCase('tr')}`} />
          <p className="font-display text-[30px] font-extrabold">Pofuduk</p>
          <p className="rounded-bubble bg-paper px-4 py-1 font-extrabold" aria-live="polite" data-ruh={ruh}>
            {RUH_AD[ruh]}
            {eylem ? <span className="font-bold text-muted"> · {eylem}</span> : null}
          </p>
          <Secim legend="Tüy rengi" name="pof-renk" value={renk} onChange={setRenk} options={(['mint', 'peach', 'salmon', 'rose', 'paper'] as MaskotRenk[]).map((r) => ({ id: r, ad: RENK[r].ad }))} />
        </CloudCard>
        <div className="kabarcik grid min-w-0 grid-cols-1 content-start gap-6 p-6">
          <KawaiiProgress etiket="Tokluk" deger={st.tok} renk="peach" maskot={false} />
          <KawaiiProgress etiket="Mutluluk" deger={st.mutlu} renk="salmon" maskot={false} />
          <KawaiiProgress etiket="Enerji" deger={st.enerji} renk="mint" maskot={false} />
          <div className="flex flex-wrap gap-3">
            <KawaiiButton ikon={<Ikon ad="mama" boyut={30} />} onClick={() => yap('mama yedi', (s) => ({ ...s, tok: sinirla(s.tok + 25) }), 'Pofuduk mamasını yedi. Tokluk arttı.')}>
              Besle
            </KawaiiButton>
            <KawaiiButton
              renk="mint"
              ikon={<Ikon ad="top" boyut={30} />}
              onClick={() =>
                yap(
                  'top oynadı',
                  (s) => ({
                    ...s,
                    mutlu: sinirla(s.mutlu + 25),
                    enerji: sinirla(s.enerji - 10),
                  }),
                  'Top oynadınız. Mutluluk arttı, enerji biraz azaldı.',
                )
              }
            >
              Oyna
            </KawaiiButton>
            <KawaiiButton
              renk="rose"
              ikon={<Ikon ad="ay" boyut={30} ruh="uykulu" />}
              onClick={() => {
                setUyku(true)
                yap('kestiriyor', (s) => ({ ...s, enerji: sinirla(s.enerji + 40) }), 'Pofuduk kısa bir uyku çekti. Enerji doldu.')
              }}
            >
              Uyut
            </KawaiiButton>
          </div>
        </div>
      </div>
    </Section>
  )
}
