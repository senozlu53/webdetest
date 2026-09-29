import { useCallback, useRef, useState, type MouseEvent } from 'react'
import { useWash } from '../lib/store'
import { MASAL } from '../lib/data'
import { Sahne } from '../components/Baykus'
import { Reveal } from '../components/Reveal'
import { WashButton } from '../components/Firca'
import { Ikon } from '../components/Ikon'
import { FircaAralik, Secim, Section } from '../components/ui'

function Sayfa({ i }: { i: number }) {
  const p = MASAL[i]
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_1.05fr]" data-masal-sayfa={i}>
      <div className="sayfa order-2 flex flex-col justify-center px-6 py-8 md:order-1 md:px-10 md:py-12" data-metin="">
        <p className="kicker">
          Sayfa {i + 1} / {MASAL.length}
        </p>
        <h3 className="mt-2 text-[clamp(34px,4.4vw,52px)] font-medium italic">{p.baslik}</h3>
        <p className={`mt-4 max-w-[46ch] text-[19px] leading-[1.8] ${i === 0 ? 'basharf' : ''}`}>{p.metin}</p>
      </div>
      <div className="relative order-1 min-h-[240px] overflow-hidden border border-[var(--cizgi)] md:order-2 md:min-h-[360px] md:border-l-0" style={{ borderRadius: '3px 14px 12px 4px / 4px 12px 14px 3px' }}>
        <Sahne ad={p.sahne} className="absolute inset-0" />
      </div>
    </div>
  )
}

/** Madde 11 · 16: sayfa geçişi. Yeni sayfa, tıklanan noktadan sıvı gibi yayılan maskeyle açılır */
export function Masal() {
  const { duyur, hareket } = useWash()
  const [sayfa, setSayfa] = useState(0)
  const [hedef, setHedef] = useState<number | null>(null)
  const [acik, setAcik] = useState(false)
  const [sure, setSure] = useState(2.6)
  const [kaynak, setKaynak] = useState<[number, number]>([0.5, 0.5])
  const kutu = useRef<HTMLDivElement>(null)
  const bitti = useCallback(() => {
    setHedef((h) => {
      if (h != null) setSayfa(h)
      return null
    })
    setAcik(false)
  }, [])
  const git = (i: number, e?: MouseEvent) => {
    if (i === sayfa || hedef != null) return
    const r = kutu.current?.getBoundingClientRect()
    if (r && e && e.clientX) setKaynak([Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)), Math.max(0, Math.min(1, (e.clientY - r.top) / r.height))])
    else setKaynak([i > sayfa ? 0.9 : 0.1, 0.5])
    duyur(`Sayfa ${i + 1}: ${MASAL[i].baslik}`)
    if (!hareket) {
      setSayfa(i)
      return
    }
    setHedef(i)
    requestAnimationFrame(() => requestAnimationFrame(() => setAcik(true)))
  }
  return (
    <Section
      id="masal"
      madde="Madde 11 · 16 · Sayfa geçişi"
      title="Bilge Baykuş ve Kayıp Yıldız"
      renk="ultramarin"
      lead="Dört sayfalık bir masal. Sayfayı çevirmek yerine yeni sayfa, tıkladığın noktadan boya gibi yayılır; kenarı dalgalıdır, ortada yavaşça oturur. Açılış süresi ayarlanabilir, hareket kapalıysa sayfa doğrudan değişir."
    >
      <div ref={kutu} className="relative grid [&>*]:col-start-1 [&>*]:row-start-1" data-masal="" data-masal-durum={hedef != null ? 'geciyor' : 'durgun'} data-sayfa={sayfa}>
        <Sayfa i={sayfa} />
        {hedef != null ? (
          <Reveal acik={acik} kaynak={kaynak} sure={sure} onBitti={bitti} className="z-[2]">
            <Sayfa i={hedef} />
          </Reveal>
        ) : null}
      </div>
      <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
          <WashButton renk="ultramarin" boy="k" disabled={sayfa === 0 || hedef != null} onClick={(e) => git(sayfa - 1, e)} ikon={<Ikon ad="yaprak" boyut={22} className="-scale-x-100" />}>
            Önceki sayfa
          </WashButton>
          <WashButton renk="yesil" boy="k" disabled={sayfa === MASAL.length - 1 || hedef != null} onClick={(e) => git(sayfa + 1, e)} ikon={<Ikon ad="yaprak" boyut={22} />}>
            Sonraki sayfa
          </WashButton>
        </div>
        <Secim<string> legend="Sayfaya git" name="masal-sayfa" value={String(hedef ?? sayfa)} onChange={(v) => git(+v)} options={MASAL.map((_, i) => ({ id: String(i), ad: `${i + 1}`, renk: ['var(--yesil)', 'var(--ultramarin)', 'var(--gul)', 'var(--ocre)'][i] }))} />
        <div className="w-full max-w-[320px]">
          <FircaAralik label="Açılış süresi" value={sure} min={0.8} max={5} step={0.2} onChange={setSure} format={(v) => `${v.toFixed(1).replace('.', ',')} sn`} renk="var(--ultramarin)" />
        </div>
      </div>
    </Section>
  )
}
