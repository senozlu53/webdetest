import { useEffect, useRef, useState, type RefObject } from 'react'
import { cx } from '../../shared/cx'
import { Dev } from '../components/Harfler'
import { ImlecBaslik } from '../components/ImlecBaslik'
import { KineticHeader } from '../components/KineticHeader'
import { MarqueeText } from '../components/MarqueeText'
import { Alan, Anahtar, Aralik, Bolum, KENAR, Kod, Secim } from '../components/ui'
import { FIGMA_DURUMLARI, HIZ_TOKENLARI, PROPLAR, TAILWIND_SINIF } from '../lib/data'
import { HIZ_CARPAN, HIZ_PX, useKinetic, type HizAd } from '../lib/store'

/** Şeridin gerçek hızını ölçer: iz elemanının çevirisini iki örnek arasında karşılaştırır (px/sn) */
function useHizOlcum(ref: RefObject<HTMLElement | null>) {
  const [v, setV] = useState(0)
  useEffect(() => {
    let onceki: { x: number; t: number } | null = null
    const id = window.setInterval(() => {
      const iz = ref.current?.querySelector<HTMLElement>('[data-mq-iz]')
      if (!iz) {
        setV(0)
        onceki = null
        return
      }
      const x = new DOMMatrixReadOnly(getComputedStyle(iz).transform).m41
      const t = performance.now()
      const u = iz.firstElementChild?.getBoundingClientRect().width ?? 1
      if (onceki) {
        let dx = Math.abs(x - onceki.x)
        if (dx > u / 2) dx = u - dx
        setV(Math.round(dx / ((t - onceki.t) / 1000)))
      }
      onceki = { x, t }
    }, 700)
    return () => window.clearInterval(id)
  }, [ref])
  return v
}

/* ───────────────────────── Madde 11 · 14 · Bileşenler ───────────────────────── */

export function Bilesenler() {
  const [hiz, setHiz] = useState<number>(HIZ_PX.normal)
  const [yon, setYon] = useState<'1' | '-1'>('1')
  const [tepki, setTepki] = useState(true)
  const [dur, setDur] = useState(true)
  const [yazi, setYazi] = useState('AKIŞ')
  const kap = useRef<HTMLDivElement>(null)
  const olcum = useHizOlcum(kap)
  const { hareket, hizCarpan, tam } = useKinetic()
  const temiz = yazi.trim().toUpperCase().slice(0, 12) || 'AKIŞ'
  const beklenen = Math.round(hiz * hizCarpan * (tam ? 1 : 0.5))
  return (
    <Bolum
      id="bilesenler"
      no="09"
      madde="Madde 11 · 14 · Bileşen kalıpları ve React"
      baslik="Şerit, imleç, başlık"
      vurgulu={[2]}
      lead={
        <>
          Üç bileşen yeter: sonsuz akan <b>&lt;MarqueeText&gt;</b>, imleci izleyen <b>&lt;ImlecBaslik&gt;</b> ve kaydırmayla eğilen <b>&lt;KineticHeader&gt;</b>. Kaydırma hızı bir kez ölçülür (<span lang="en">Framer Motion</span>) ve hepsine dağıtılır.
        </>
      }
    >
      <div className={`${KENAR} grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-12`}>
        <div className="lg:col-span-12" data-mq-lab="">
          <p className="kicker">&lt;MarqueeText&gt;</p>
          <div ref={kap} className="-mx-[var(--kenar)] mt-4 border-y-2 border-metin" data-mq-demo="">
            <MarqueeText metin="KAYAN YAZI" hiz={hiz} yon={yon === '1' ? 1 : -1} tepki={tepki} durHover={dur} ayirac="/" className="dev py-4 text-[clamp(56px,11vw,170px)]" ad="lab-serit" />
          </div>
          <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-3">
            <Aralik id="mq-hiz" label="Taban hız" value={hiz} min={20} max={400} step={10} onChange={setHiz} format={(v) => `${v} px/sn`} />
            <Secim<'1' | '-1'>
              legend="Yön"
              name="mq-yon"
              value={yon}
              onChange={setYon}
              options={[
                { id: '1', ad: 'Sola' },
                { id: '-1', ad: 'Sağa' },
              ]}
            />
            <div className="grid gap-2">
              <Anahtar label="Kaydırmaya tepki" hint="Hızlanır; yukarı kaydırınca ters döner" checked={tepki} onChange={setTepki} />
              <Anahtar label="Üzerinde dur" hint="İmleç ya da odak gelince durur" checked={dur} onChange={setDur} />
            </div>
          </div>
          <p className="mt-6 text-[15px] text-soluk" data-mq-olcum={olcum} data-mq-beklenen={beklenen}>
            Ölçülen hız: <b className="rakam text-metin">{hareket ? olcum : 0}</b> px/sn · beklenen (taban × hız çarpanı): <b className="rakam text-metin">{hareket ? beklenen : 0}</b> px/sn{hareket ? '' : ' · hareket durduğu için şerit akmıyor'}
          </p>
        </div>

        <div className="lg:col-span-12">
          <p className="kicker">&lt;ImlecBaslik&gt;</p>
          <div className="mt-4 border-2 border-metin" data-imlec-demo="">
            <ImlecBaslik metin="TAKİP" alt="İmleci gezdirin ya da parmağınızı sürükleyin" boy="clamp(56px, 16vw, 250px)" yukseklik="clamp(300px, 46vw, 520px)" />
          </div>
        </div>

        <div className="lg:col-span-7">
          <p className="kicker">&lt;KineticHeader&gt;</p>
          <div className="mt-4 overflow-x-clip border-2 border-metin p-5" data-kh-demo="">
            <KineticHeader
              as="div"
              satirlar={[
                { metin: temiz, efekt: ['dalga'] },
                { metin: temiz, kontur: true, efekt: ['imlec'] },
              ]}
            />
          </div>
        </div>
        <div className="grid content-start gap-4 lg:col-span-5">
          <Alan label="Başlık metni (12 harfe kadar)" ipucu="Yazdığınız metin iki satır olarak dev başlığa dönüşür.">
            {(p) => <input className="alan" {...p} value={yazi} maxLength={12} onChange={(e) => setYazi(e.target.value)} autoComplete="off" data-kh-girdi="" />}
          </Alan>
        </div>

        <div className="overflow-x-auto lg:col-span-12" role="region" aria-label="Bileşen özellikleri" tabIndex={0}>
          <table className="tablo w-full min-w-[760px] border-collapse text-[15px]" data-proplar="">
            <caption className="kicker">Bileşen özellikleri</caption>
            <thead>
              <tr>
                {['Bileşen', 'Özellik', 'Tip', 'Varsayılan', 'Ne yapar'].map((b) => (
                  <th key={b} scope="col">
                    {b}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PROPLAR.map((p) => (
                <tr key={p.bilesen + p.ad}>
                  <th scope="row" className="font-mono !text-[13px]">
                    {p.bilesen}
                  </th>
                  <td className="font-mono text-[13px]">{p.ad}</td>
                  <td className="font-mono text-[12.5px]">{p.tip}</td>
                  <td className="font-mono text-[12.5px]">{p.varsayilan}</td>
                  <td>{p.aciklama}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="lg:col-span-12">
          <p className="kicker mb-3">Kullanım (Framer Motion)</p>
          <Kod
            label="Bileşen kullanımı"
            dar
          >{`import { useScroll, useVelocity, useSpring, useTransform, motion } from 'motion/react'\n\nconst { scrollY } = useScroll()\nconst hiz = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })\nconst skewX = useTransform(hiz, [-3000, 0, 3000], [14, 0, -14])   // hız → eğim\n\n<motion.h1 style={{ skewX }}><KineticHeader satirlar={[{ metin: 'Hareket', efekt: ['dalga', 'imlec'] }]} /></motion.h1>\n<MarqueeText metin="Kaydır" hiz={240} yon={-1} tepki />\n<ImlecBaslik metin="Takip" alt="İmleci gezdirin" />`}</Kod>
        </div>
      </div>
    </Bolum>
  )
}

/* ───────────────────────── Madde 12 · 13 · Figma ───────────────────────── */

type Durum = (typeof FIGMA_DURUMLARI)[number]['id']

function FigmaOrnek({ durum, hiz, boy = 'clamp(52px, 12vw, 170px)' }: { durum: Durum; hiz: HizAd; boy?: string }) {
  const { hareket } = useKinetic()
  const hz = HIZ_PX[hiz] / HIZ_PX.normal
  return (
    <div data-figma-durum={durum} data-figma-hiz={hiz} style={{ ['--hz' as string]: hz }}>
      <Dev metin="AKIŞ" boy={boy} efekt={durum === 'animating' ? ['dalga'] : []} className={cx(durum === 'hover' && 'pose-hover vurgu')} ad={`figma-${durum}`} />
      {durum === 'animating' && !hareket ? <p className="etiket mt-2 text-soluk">hareket durdu · son kare</p> : null}
    </div>
  )
}

export function Figma() {
  const [durum, setDurum] = useState<Durum>('animating')
  const [hiz, setHiz] = useState<HizAd>('normal')
  const [tk, setTk] = useState({ aile: '', agirlik: '', boy: '', satir: '', aralik: '', harf: '' })
  const olcumNormal = useRef<HTMLDivElement>(null)
  const olcumYavas = useRef<HTMLDivElement>(null)
  const olcumHizli = useRef<HTMLDivElement>(null)
  const refs: Record<HizAd, RefObject<HTMLDivElement | null>> = { yavas: olcumYavas, normal: olcumNormal, hizli: olcumHizli }
  const oY = useHizOlcum(olcumYavas)
  const oN = useHizOlcum(olcumNormal)
  const oH = useHizOlcum(olcumHizli)
  const olc: Record<HizAd, number> = { yavas: oY, normal: oN, hizli: oH }
  const { hareket, hizCarpan, tam } = useKinetic()
  useEffect(() => {
    const el = document.querySelector<HTMLElement>('[data-figma-onizleme] .dev-boy')
    if (!el) return
    const oku = () => {
      const cs = getComputedStyle(el)
      setTk({
        aile: cs.fontFamily.split(',')[0].replace(/"/g, ''),
        agirlik: cs.fontWeight,
        boy: `${Math.round(parseFloat(cs.fontSize))}px`,
        satir: (parseFloat(cs.lineHeight) / parseFloat(cs.fontSize)).toFixed(2),
        aralik: `${(parseFloat(cs.letterSpacing) / parseFloat(cs.fontSize)).toFixed(3)}em`,
        harf: cs.textTransform,
      })
    }
    const t = window.setTimeout(oku, 500)
    window.addEventListener('resize', oku)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('resize', oku)
    }
  }, [])
  return (
    <Bolum
      id="figma"
      no="10"
      madde="Madde 12 · 13 · Figma mimarisi ve tokenlar"
      baslik="Üç durum, tek set"
      vurgulu={[1, 2]}
      lead={
        <>
          <span lang="en">Component Set</span> içinde <b>State</b> özelliği üç varyanta bölünür: <b>Static</b>, <b>Animating</b>, <b>Hover</b>. Hız ise ayrı bir özelliktir ve <span lang="en">Animation/TextSpeed*</span> tokenlarına bağlıdır. Soldaki panelden varyantı seçin.
        </>
      }
    >
      <div className={`${KENAR} grid grid-cols-1 gap-x-8 gap-y-14 lg:grid-cols-12`}>
        <div className="grid content-start gap-7 lg:col-span-4" data-figma-panel="">
          <div>
            <p className="kicker">Bileşen seti</p>
            <p className="dev mt-1 text-[24px]" lang="en">
              Kinetic/Text
            </p>
          </div>
          <Secim<Durum> legend="State" name="figma-durum" value={durum} onChange={setDurum} options={FIGMA_DURUMLARI.map((d) => ({ id: d.id, ad: d.ad }))} />
          <Secim<HizAd>
            legend="Speed"
            name="figma-hiz"
            value={hiz}
            onChange={setHiz}
            options={[
              { id: 'yavas', ad: 'Slow' },
              { id: 'normal', ad: 'Normal' },
              { id: 'hizli', ad: 'Fast' },
            ]}
          />
          <p className="text-[15px] text-soluk" data-figma-not="">
            {FIGMA_DURUMLARI.find((d) => d.id === durum)!.not}
          </p>
        </div>
        <div className="lg:col-span-8">
          <div className="overflow-x-clip border-2 border-metin p-6" data-figma-onizleme={durum}>
            <FigmaOrnek durum={durum} hiz={hiz} />
          </div>
        </div>

        <div className="lg:col-span-12">
          <p className="kicker">Tuval · bütün varyantlar</p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3" data-figma-tuval="">
            {FIGMA_DURUMLARI.map((d) => (
              <div key={d.id} className={cx('overflow-x-clip border p-4', d.id === durum ? 'border-2 border-vurgu-yazi' : 'border-kontrol')}>
                <p className="etiket mb-3 text-soluk" lang="en">
                  State={d.ad}
                </p>
                <FigmaOrnek durum={d.id} hiz={hiz} boy="clamp(40px, 8vw, 96px)" />
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto lg:col-span-7" role="region" aria-label="Tipografi tokenı" tabIndex={0}>
          <table className="tablo w-full min-w-[520px] border-collapse text-[15px]" data-token-tablo="" data-token-olcum={`${tk.aile}|${tk.agirlik}|${tk.satir}|${tk.aralik}|${tk.harf}`}>
            <caption className="kicker">Typography/KineticDisplay · hesaplanan değerler</caption>
            <tbody>
              {(
                [
                  ['font-family', tk.aile],
                  ['font-weight', tk.agirlik],
                  ['font-size', `${tk.boy} (clamp ile sığdırılır)`],
                  ['line-height', tk.satir],
                  ['letter-spacing', tk.aralik],
                  ['text-transform', tk.harf],
                ] as const
              ).map(([a, b]) => (
                <tr key={a}>
                  <th scope="row" className="font-mono !text-[13px]">
                    {a}
                  </th>
                  <td className="font-mono text-[14px]">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="lg:col-span-5">
          <p className="kicker">Animation/TextSpeed*</p>
          <ul className="mt-3" data-hiz-tokenlari="">
            {HIZ_TOKENLARI.map((t) => (
              <li key={t.id} className="border-t border-hat py-4" data-hiz-token={t.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-mono text-[13px]">{t.ad}</span>
                  <span className="rakam text-[18px]">{t.px} px/sn</span>
                </div>
                <div ref={refs[t.id]} className="mt-1">
                  <MarqueeText metin="AKIŞ AKIŞ AKIŞ" hiz={t.px} tepki={false} durHover={false} ayirac="/" className="dev py-1 text-[28px]" ad={`token-${t.id}`} />
                </div>
                <p className="mt-1 text-[13.5px] text-soluk" data-hiz-olcum={t.id} data-olculen={olc[t.id]}>
                  Ölçülen: <b className="rakam text-metin">{hareket ? olc[t.id] : 0}</b> px/sn · beklenen {hareket ? Math.round(t.px * hizCarpan * (tam ? 1 : 0.5)) : 0}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[14px] text-soluk">
            Çarpan: {HIZ_CARPAN.yavas} · {HIZ_CARPAN.normal} · {HIZ_CARPAN.hizli}. Ayarlardaki “Metin hızı” bütün şeritleri bu çarpanla ölçekler.
          </p>
        </div>
      </div>
    </Bolum>
  )
}

/* ───────────────────────── Madde 15 · CSS / Tailwind ───────────────────────── */

export function Css() {
  const kutu = useRef<HTMLDivElement>(null)
  const [olc, setOlc] = useState({ agirlik: '', aralik: '', harf: '', ozellik: '', sure: '' })
  const [uzerinde, setUzerinde] = useState(false)
  useEffect(() => {
    const el = kutu.current
    if (!el) return
    const cs = getComputedStyle(el)
    setOlc({ agirlik: cs.fontWeight, aralik: `${(parseFloat(cs.letterSpacing) / parseFloat(cs.fontSize)).toFixed(2)}em`, harf: cs.textTransform, ozellik: cs.transitionProperty.split(',')[0].trim(), sure: cs.transitionDuration })
  }, [])
  return (
    <Bolum
      id="css"
      no="11"
      madde="Madde 15 · CSS / Tailwind yapısı"
      baslik="Dört sınıf, bir hareket"
      vurgulu={[2, 3]}
      lead={
        <>
          Bütün görünümün özü tek satırdır: <span className="font-mono text-[0.86em]">{TAILWIND_SINIF}</span>. Ağırlık 800, sıkı harf aralığı, büyük harf ve 300 ms’lik dönüşüm geçişi. Aşağıdaki kelime tam bu sınıflarla çizilir; üzerine gelince ölçeklenir ve yatar.
        </>
      }
    >
      <div className={`${KENAR} grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-12`}>
        <div className="border-2 border-metin p-[clamp(20px,4vw,48px)] lg:col-span-7" onPointerEnter={() => setUzerinde(true)} onPointerLeave={() => setUzerinde(false)}>
          <div
            ref={kutu}
            className="text-[clamp(30px,5vw,76px)] leading-[0.9] font-extrabold tracking-tighter uppercase transition-transform duration-300 hover:-skew-x-6 hover:scale-105"
            lang="en"
            style={{ fontFamily: 'var(--font-baslik)' }}
            data-tailwind-kutu=""
            data-uzerinde={uzerinde ? 'evet' : 'hayir'}
          >
            Kinetic
          </div>
          <p className="mt-6 text-[15px] text-soluk">
            Yazı ailesi ayrıca <span className="font-mono">font-baslik</span> ile verilir. Fareyi kelimenin üstüne getirin.
          </p>
        </div>
        <dl className="grid grid-cols-1 content-start gap-5 text-[15.5px] lg:col-span-5" data-tailwind-olcum={`${olc.agirlik}|${olc.aralik}|${olc.harf}|${olc.ozellik}|${olc.sure}`}>
          {(
            [
              ['font-weight', olc.agirlik],
              ['letter-spacing', olc.aralik],
              ['text-transform', olc.harf],
              ['transition-property', olc.ozellik],
              ['transition-duration', olc.sure],
            ] as const
          ).map(([a, b]) => (
            <div key={a} className="border-t border-hat pt-3">
              <dt className="kicker">{a}</dt>
              <dd className="m-0 mt-1 font-mono text-[14px]">{b}</dd>
            </div>
          ))}
        </dl>
        <div className="lg:col-span-12">
          <table className="tablo w-full border-collapse text-[15px]" data-sinif-tablo="">
            <caption className="kicker">Sınıf → CSS</caption>
            <tbody>
              {[
                ['font-extrabold', 'font-weight: 800'],
                ['tracking-tighter', 'letter-spacing: -0.05em'],
                ['uppercase', 'text-transform: uppercase'],
                ['transition-transform', 'transition-property: transform, translate, scale, rotate'],
                ['duration-300', 'transition-duration: 300ms'],
              ].map(([a, b]) => (
                <tr key={a}>
                  <th scope="row" className="font-mono !text-[13px]">
                    {a}
                  </th>
                  <td className="text-soluk">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Bolum>
  )
}
