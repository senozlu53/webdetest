import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { usePaper } from '../lib/store'
import { BOLUMLER, URUNLER } from '../lib/data'
import { Kesik } from '../components/Kesik'
import { Katman, PaperButton, PaperCard } from '../components/Paper'
import { goster } from '../components/Diorama'
import { Secim } from '../components/Oyuk'
import { Section } from '../components/ui'

const SEMA = ['var(--pembe)', 'var(--gokyuzu)', 'var(--leylak)', 'var(--turkuaz)']
const N = BOLUMLER.length

/** Madde 10 · 16: hikâye anlatımı (scrollytelling). Kaydırdıkça her kâğıt katmanı farklı hızda kayar, bölüm değişir */
export function Hikaye() {
  const { hareket, derinlik, duyur } = usePaper()
  const [bolum, setBolum] = useState(0)
  const iz = useRef<HTMLDivElement>(null)
  const sahne = useRef<HTMLDivElement>(null)
  const sticky = useRef<HTMLDivElement>(null)
  const son = useRef(0)
  const ust = 92

  useEffect(() => {
    const s = sahne.current
    if (!s) return
    if (!hareket) {
      s.style.setProperty('--dp', String(bolum / (N - 1)))
      return
    }
    let raf = 0
    const hesap = () => {
      raf = 0
      const t = iz.current
      const st = sticky.current
      if (!t || !st) return
      const r = t.getBoundingClientRect()
      const yol = r.height - st.offsetHeight
      const p = Math.max(0, Math.min(1, (ust - r.top) / yol))
      s.style.setProperty('--dp', p.toFixed(4))
      const b = Math.min(N - 1, Math.floor(p * N))
      if (b !== son.current) {
        son.current = b
        setBolum(b)
      }
    }
    const f = () => {
      if (!raf) raf = requestAnimationFrame(hesap)
    }
    hesap()
    window.addEventListener('scroll', f, { passive: true })
    window.addEventListener('resize', f)
    return () => {
      window.removeEventListener('scroll', f)
      window.removeEventListener('resize', f)
      if (raf) cancelAnimationFrame(raf)
    }
    // bolum yalnız hareket kapalıyken --dp'yi sürer
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hareket, hareket ? 0 : bolum])

  const git = (i: number) => {
    duyur(`Bölüm ${i + 1}: ${BOLUMLER[i].baslik}`)
    if (!hareket) {
      setBolum(i)
      return
    }
    const t = iz.current
    const st = sticky.current
    if (!t || !st) return
    const yol = t.offsetHeight - st.offsetHeight
    const y = t.getBoundingClientRect().top + window.scrollY + ((i + 0.5) / N) * yol - ust
    window.scrollTo({ top: y, behavior: 'auto' })
  }
  const b = BOLUMLER[bolum]
  return (
    <Section
      id="hikaye"
      madde="Madde 10 · 16 · Hikâye anlatımı"
      renk="var(--pembe)"
      title="Minik Ayı ve Kayıp Nehir"
      lead="Bir çocuk kitabının scrollytelling sürümü. Sayfayı kaydırdıkça güneş yükselir, dağlar ve tepeler farklı hızlarda kayar, nehir soldan sağa dolar, ayı yürür. Kaydırmak istemeyenler için altta bölüm düğmeleri var; hareket kapalıysa sahne bölüm başına durur."
    >
      <div ref={iz} className="relative" style={{ height: hareket ? '300vh' : 'auto' }} data-hikaye-iz="">
        <div ref={sticky} className="grid gap-5" style={{ position: hareket ? 'sticky' : 'static', top: ust }}>
          <PaperCard nivel={5} renk={SEMA[bolum]} tohum={14} r={30} dalga={5} adim={150} yuzClass="relative overflow-hidden" yuzStyle={{ transition: 'background-color 700ms' }} data-hikaye-sahne={bolum}>
            <div ref={sahne} className="relative h-[min(50vh,460px)] min-h-[340px] overflow-hidden">
              <div className="absolute z-[1]" style={{ left: 'calc(4% + (92% - 110px) * var(--dp, 0))', top: 'calc(38% - var(--dp, 0) * 28%)' }} data-gunes="">
                <Kesik ad="gunes" boyut={110} nivel={3} className="yuz" />
              </div>
              {goster(derinlik, 2) ? <Katman z={2} nivel={2} renk="var(--leylak)" sekil="dag" tohum={4} ust={20} ax={-70} tasma={140} taban={0.36} genlik={0.3} n={4} /> : null}
              {goster(derinlik, 2) ? <Katman z={3} nivel={3} renk="var(--turkuaz)" sekil="dag" tohum={9} ust={32} ax={-150} tasma={260} taban={0.4} genlik={0.26} n={5} /> : null}
              {goster(derinlik, 3) ? <Katman z={4} nivel={3} renk="var(--yaprak)" sekil="dalga" tohum={6} ust={50} ax={-260} tasma={420} taban={0.22} genlik={0.16} n={5} /> : null}
              <div className="absolute inset-x-0 z-[5]" style={{ bottom: '17%', height: '19%', clipPath: 'inset(-30px calc((1 - var(--dp, 0)) * 100%) -30px 0)' }} data-nehir="">
                <PaperCard nivel={2} renk="var(--gokyuzu)" tohum={33} sekil="dalga" taban={0.3} genlik={0.3} n={7} className="absolute inset-0" />
              </div>
              <div className="absolute z-[6]" style={{ left: 'calc(63% + 0px)', bottom: '20%', opacity: 'clamp(0, calc(1 - (var(--dp, 0) - 0.55) * 5), 1)' } as CSSProperties} aria-hidden="true">
                <div className="flex gap-1">
                  <Kesik ad="kutu" boyut={34} nivel={1} />
                  <Kesik ad="kutu" boyut={28} nivel={1} className="mt-3" />
                  <Kesik ad="kutu" boyut={36} nivel={1} />
                </div>
              </div>
              <div className="absolute z-[6]" style={{ left: '72%', bottom: '25%', opacity: 'clamp(0, calc((var(--dp, 0) - 0.78) * 6), 1)' } as CSSProperties} aria-hidden="true">
                <Kesik ad="balik" boyut={44} nivel={1} className="-rotate-6" />
              </div>
              <div className="absolute z-[8]" style={{ left: 'calc(2% + (96% - 92px) * var(--dp, 0))', bottom: '16%' }} data-ayi="">
                <Kesik ad="ayi" boyut={92} nivel={4} className="yuz" />
              </div>
              {goster(derinlik, 1) ? (
                <Katman
                  z={10}
                  nivel={4}
                  renk="var(--kraft-d)"
                  sekil="dalga"
                  tohum={12}
                  ust={80}
                  taban={0.2}
                  genlik={0.14}
                  n={6}
                  delikler={[
                    { x: 0.14, y: 0.6, r: 16 },
                    { x: 0.62, y: 0.7, r: 12 },
                    { x: 0.9, y: 0.55, r: 18 },
                  ]}
                />
              ) : null}
            </div>
          </PaperCard>
          <PaperCard nivel={3} duz tohum={51} r={22} dalga={3} yuzClass="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center md:p-6">
            <div aria-live="polite" data-hikaye-metin="">
              <p className="etiket">
                Bölüm {bolum + 1} / {N}
              </p>
              <h3 className="mt-1 text-[38px]">{b.baslik}</h3>
              <p className="mt-2 max-w-[56ch] text-[17px]">{b.metin}</p>
            </div>
            <Secim<string> legend="Bölüm" name="hikaye-bolum" value={String(bolum)} onChange={(v) => git(+v)} options={BOLUMLER.map((_, i) => ({ id: String(i), ad: `${i + 1}`, renk: SEMA[i] }))} />
          </PaperCard>
        </div>
      </div>
    </Section>
  )
}

/** Madde 10: eko markalı dükkân */
export function Dukkan() {
  const { duyur } = usePaper()
  const [grup, setGrup] = useState<'hepsi' | 'ofis' | 'ev' | 'bahce'>('hepsi')
  const [sepet, setSepet] = useState<Record<string, number>>({ kalem: 2 })
  const liste = URUNLER.filter((u) => grup === 'hepsi' || u.grup === grup)
  const satir = URUNLER.filter((u) => (sepet[u.id] ?? 0) > 0)
  const toplam = satir.reduce((t, u) => t + sepet[u.id] * u.fiyat, 0)
  const tasarruf = satir.reduce((t, u) => t + sepet[u.id] * u.tasarruf, 0)
  const say = satir.reduce((t, u) => t + sepet[u.id], 0)
  const ekle = (id: string, ad: string, f: number) =>
    setSepet((s) => {
      const y = Math.max(0, Math.min(9, (s[id] ?? 0) + f))
      duyur(`${ad}: sepette ${y} adet`)
      return { ...s, [id]: y }
    })
  const tl = (n: number) => `${n} TL`
  const kg = (n: number) => `${n.toFixed(1).replace('.', ',')} kg`
  return (
    <Section id="dukkan" madde="Madde 10 · Çevre dostu marka" renk="var(--yaprak)" title="Kâğıt Orman dükkânı" lead="Geri dönüşümlü kırtasiye ve kitaplar. Her ürünün yanında satın almanın ne kadar karbon (CO2) tasarrufu sağladığı yazar. Ürünler ve rakamlar kurgudur.">
      <div className="mb-8">
        <Secim<'hepsi' | 'ofis' | 'ev' | 'bahce'>
          legend="Grup"
          name="dukkan-grup"
          value={grup}
          onChange={setGrup}
          options={[
            { id: 'hepsi', ad: 'Hepsi' },
            { id: 'ofis', ad: 'Ofis', renk: 'var(--gokyuzu)' },
            { id: 'ev', ad: 'Ev', renk: 'var(--pembe)' },
            { id: 'bahce', ad: 'Bahçe', renk: 'var(--yaprak)' },
          ]}
        />
      </div>
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.6fr_1fr]">
        <ul className="m-0 grid min-w-0 list-none grid-cols-1 gap-x-8 gap-y-10 p-0 sm:grid-cols-2" data-urunler={liste.length}>
          {liste.map((u, i) => (
            <PaperCard as="li" key={u.id} nivel={3} duz tohum={120 + i * 7} r={20} dalga={3} adim={100} yuzClass="grid content-start gap-3 p-5" data-urun={u.id}>
              <PaperCard nivel={1} renk={u.renk} tohum={130 + i} r={16} dalga={3} yuzClass="grid h-[130px] place-items-center">
                <Kesik ad={u.simge} boyut={84} nivel={3} />
              </PaperCard>
              <h3 className="text-[27px]">{u.ad}</h3>
              <p className="text-[15px] font-medium text-soluk">{u.not}</p>
              <p className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-baslik text-[26px] whitespace-nowrap tabular-nums">{tl(u.fiyat)}</span>
                <span className="etiket rounded-md bg-bej px-2 py-1">−{kg(u.tasarruf)} CO2</span>
              </p>
              <PaperButton renk={u.renk} boy="k" onClick={() => ekle(u.id, u.ad, 1)} aria-label={`${u.ad} sepete ekle`} ikon={<Kesik ad="arti" boyut={22} nivel={1} halo={false} renk="var(--murekkep)" />}>
                Sepete ekle
              </PaperButton>
            </PaperCard>
          ))}
        </ul>
        <PaperCard nivel={4} duz tohum={150} r={22} dalga={3} className="lg:sticky lg:top-28" yuzClass="grid gap-4 p-6" data-sepet="">
          <div className="flex items-center gap-3">
            <Kesik ad="sepet" boyut={44} nivel={1} />
            <h3 className="text-[34px]">Sepet</h3>
          </div>
          {satir.length ? (
            <ul className="m-0 grid list-none gap-2 p-0" aria-label="Sepet satırları" aria-live="polite">
              {satir.map((u) => (
                <li key={u.id} className="grid grid-cols-[1fr_auto] items-center gap-2 border-b-2 border-bej pb-2">
                  <div className="min-w-0">
                    <p className="font-extrabold">{u.ad}</p>
                    <p className="font-mono text-[14px] tabular-nums">
                      {sepet[u.id]} × {tl(u.fiyat)} = {tl(sepet[u.id] * u.fiyat)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <PaperButton renk="var(--bej)" boy="i" aria-label={`${u.ad} azalt`} onClick={() => ekle(u.id, u.ad, -1)} tohum={3}>
                      <Kesik ad="eksi" boyut={22} nivel={1} halo={false} renk="var(--murekkep)" />
                    </PaperButton>
                    <PaperButton renk="var(--bej)" boy="i" aria-label={`${u.ad} artır`} onClick={() => ekle(u.id, u.ad, 1)} tohum={4}>
                      <Kesik ad="arti" boyut={22} nivel={1} halo={false} renk="var(--murekkep)" />
                    </PaperButton>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[16px] font-medium text-soluk">Sepet boş. Bir ürün seç.</p>
          )}
          <p className="flex items-baseline justify-between gap-3 border-t-2 border-murekkep pt-3">
            <span className="font-baslik text-[28px]">Toplam</span>
            <span className="font-mono text-[22px] font-extrabold tabular-nums" data-toplam={toplam}>
              {tl(toplam)}
            </span>
          </p>
          <p className="flex items-center gap-2 rounded-xl bg-yaprak px-3 py-2 text-[16px] font-bold" data-tasarruf={tasarruf.toFixed(1)}>
            <Kesik ad="yaprak" boyut={26} nivel={1} halo={false} renk="var(--krem)" />
            {kg(tasarruf)} CO2 tasarruf
          </p>
          <PaperButton renk="var(--gunes)" boy="b" disabled={say === 0} onClick={() => duyur(`Sipariş alındı: ${say} ürün, ${tl(toplam)}. ${kg(tasarruf)} CO2 tasarruf edildi.`)}>
            Siparişi tamamla
          </PaperButton>
        </PaperCard>
      </div>
    </Section>
  )
}
