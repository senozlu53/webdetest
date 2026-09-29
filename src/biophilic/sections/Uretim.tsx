import { useRef, useState, useEffect } from 'react'
import { cx } from '../../shared/cx'
import { FIGMA_ETIKETLER, FIGMA_KOLEKSIYONLAR, PROPLAR, TAILWIND_ORNEK } from '../lib/data'
import { oran } from '../lib/contrast'
import { DOKU_ALFA, useBiophilic } from '../lib/store'
import { MODLAR, MOD_SIRA, palet as hesapPalet, type ModAd } from '../lib/zaman'
import { ZamanSahnesi } from '../components/Ambient'
import { BiophilicCard, BioButton, BreathProgress, BreatheTimer, NEFES_DESENLERI } from '../components/Biophilic'
import { Ikon } from '../components/Ikon'
import { Aralik, Belir, Kod, Secim, Section } from '../components/ui'

/* ───────────────────────── Madde 11 · 14 · Bileşenler ───────────────────────── */

const MOD_KART: Record<ModAd, { kicker: string; baslik: string; metin: string }> = {
  sabah: { kicker: 'Sabah ışığı', baslik: 'Güne yavaş başla', metin: 'Serin gökyüzü, sarı parıltı. Cam açık, yazı koyu yeşil.' },
  ogle: { kicker: 'Öğle göğü', baslik: 'Odak zamanı', metin: 'Gökyüzü mavisi tam parlaklıkta; panel beyaza yakın.' },
  aksam: { kicker: 'Akşam parıltısı', baslik: 'Işığı kıs', metin: 'Turuncu ufuk; cam koyulaşır ve yazı açık renge döner.' },
  gece: { kicker: 'Gece sakinliği', baslik: 'Uykuya hazır', metin: 'Derin yeşil-mavi zemin; ay parıltısı, düşük kontrastlı gürültü yok.' },
}

export function Bilesenler() {
  const c = useBiophilic()
  const [ilerleme, setIlerleme] = useState(96)
  const dk = c.doku === 'yok' ? 0 : DOKU_ALFA
  return (
    <Section
      id="bilesenler"
      ikon="yaprak"
      madde="Madde 11 · 14 · Bileşen kalıpları"
      title={
        <>
          Dinamik tema kartları, <span className="vurgu">nefes</span> çubukları
        </>
      }
      lead="Aynı kart dört farklı modda yan yana. Kart bileşeni yalnızca değişkenleri okur; hangi saatte olduğunu bilmez, bu yüzden bir kapsayıcıya farklı bir saat verildiğinde de doğru görünür."
    >
      <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 xl:grid-cols-4" data-dinamik-kartlar="">
        {MOD_SIRA.map((m, i) => {
          const md = MODLAR[m]
          const p = hesapPalet(md.saat, { hedef: c.hedef, doku: dk })
          return (
            <Belir key={m} as="li" gecikme={i * 90} className="flex">
              <ZamanSahnesi saat={md.saat} className="w-full border border-[var(--cam-kenar)]" icKlas="relative z-10 p-4 pt-20" data-dinamik-kutu={m}>
                <BiophilicCard dinamik mod={m} baslik={MOD_KART[m].baslik} nefes={m === 'gece'} data-dinamik-kart={m}>
                  <p className="text-[15.5px] text-soluk">{MOD_KART[m].metin}</p>
                  <p className="mt-3 font-mono text-[12.5px] text-soluk">
                    cam %{Math.round(p.cam.alfa * 100)} · yazı {oran(p.cam.oran)}
                  </p>
                </BiophilicCard>
              </ZamanSahnesi>
            </Belir>
          )
        })}
      </ul>

      <div className="mt-[var(--aralik)] grid grid-cols-1 gap-x-10 gap-y-8 lg:grid-cols-12">
        <div className="cam min-w-0 p-6 sm:p-9 lg:col-span-6" data-ilerleme-demo="">
          <h3 className="baslik text-[26px]">Nefes çubuğu</h3>
          <p className="mt-2 text-[16px] text-soluk">İlerleme çubuğu, nefes ritminde hafifçe kalınlaşıp incelir; ucundaki güneş parıltısı da aynı ritimle büyür. Değer, metin olarak da her zaman görünür.</p>
          <div className="nefesle mt-7" style={{ ['--nefes-sure' as string]: '8s' } as React.CSSProperties}>
            <BreathProgress deger={ilerleme} toplam={180} etiket="Oturum" />
          </div>
          <div className="mt-6 max-w-[360px]">
            <Aralik label="İlerleme" value={ilerleme} min={0} max={180} step={6} onChange={setIlerleme} format={(v) => `${v} sn`} />
          </div>
        </div>
        <div className="cam min-w-0 p-6 sm:p-9 lg:col-span-6" data-timer-demo="">
          <h3 className="baslik text-[26px]">Nefes sayacı</h3>
          <p className="mt-2 text-[16px] text-soluk">
            <code className="font-mono text-[14px]">&lt;BreatheTimer&gt;</code> bir desen ve süre alır; halkalar deseni izler.
          </p>
          <div className="mt-6">
            <BreatheTimer desen={NEFES_DESENLERI[1]} sureDk={1} />
          </div>
        </div>
      </div>

      <div className="cam mt-[var(--aralik)] overflow-x-auto p-6 sm:p-9" role="region" aria-label="Bileşen özellikleri" tabIndex={0}>
        <table className="tablo w-full min-w-[720px] border-collapse text-[15.5px]" data-proplar="">
          <caption>Bileşen özellikleri</caption>
          <thead>
            <tr>
              {['Bileşen', 'Özellik', 'Tip', 'Varsayılan', 'Ne yapar'].map((b) => (
                <th key={b} scope="col" className="etiket">
                  {b}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PROPLAR.map((p) => (
              <tr key={p.bilesen + p.ad}>
                <th scope="row" className="font-mono text-[13.5px] font-medium">
                  {p.bilesen}
                </th>
                <td className="font-mono text-[13.5px]">{p.ad}</td>
                <td className="font-mono text-[13px]">{p.tip}</td>
                <td className="font-mono text-[13px]">{p.varsayilan}</td>
                <td>{p.aciklama}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-8 max-w-[720px]">
        <Kod label="Bileşen kullanımı" sar={false}>{`<DynamicAmbientBackground />              {/* sayfaya sabit ortam */}\n\n<BiophilicCard dinamik nefes ikon="uyku" kicker="Bu gece" baslik="7 sa 24 dk">\n  ...\n</BiophilicCard>\n\n<BreatheTimer desen={NEFES_DESENLERI[2]} sureDk={3} />`}</Kod>
      </div>
    </Section>
  )
}

/* ───────────────────────── Madde 12 · 13 · Figma ───────────────────────── */

export function Figma() {
  const c = useBiophilic()
  const [mod, setMod] = useState<ModAd>('ogle')
  const dk = c.doku === 'yok' ? 0 : DOKU_ALFA
  const paletler = Object.fromEntries(MOD_SIRA.map((m) => [m, hesapPalet(MODLAR[m].saat, { hedef: c.hedef, doku: dk })])) as Record<ModAd, ReturnType<typeof hesapPalet>>
  const satirlar: { ad: string; deger: (m: ModAd) => string; renk: boolean }[] = [
    { ad: 'Theme/Sky/Top', deger: (m) => MODLAR[m].gok[0], renk: true },
    { ad: 'Theme/Sky/Mid', deger: (m) => MODLAR[m].gok[1], renk: true },
    { ad: 'Theme/Sky/Low', deger: (m) => MODLAR[m].gok[2], renk: true },
    { ad: 'Theme/Sun', deger: (m) => MODLAR[m].isik, renk: true },
    { ad: 'Theme/Leaf/Far', deger: (m) => MODLAR[m].yaprak[0], renk: true },
    { ad: 'Theme/Leaf/Near', deger: (m) => MODLAR[m].yaprak[2], renk: true },
    { ad: 'Theme/Water', deger: (m) => MODLAR[m].su, renk: true },
    { ad: 'Glass/Tint', deger: (m) => paletler[m].cam.tint, renk: true },
    { ad: 'Glass/Alpha', deger: (m) => `${Math.round(paletler[m].cam.alfa * 100)}%`, renk: false },
    { ad: 'Text/Primary', deger: (m) => paletler[m].cam.metin, renk: true },
    { ad: 'Text/Muted', deger: (m) => paletler[m].cam.soluk, renk: true },
  ]
  return (
    <Section
      id="figma"
      ikon="ayar"
      madde="Madde 12 · 13 · Figma mimarisi ve tokenlar"
      title={
        <>
          <span lang="en">Variables</span> ve{' '}
          <span className="vurgu" lang="en">
            Modes
          </span>{' '}
          ile gün döngüsü
        </>
      }
      lead="Dinamik tema, Figma’da tek bir koleksiyonun dört moduyla kurulur: Sabah, Öğle, Akşam ve uyku uygulamaları için Gece. Bileşenler değişkenlere bağlanır, modu bir çerçeve değiştirir; prototipte zaman gecikmesiyle mod değişimi günün akışını gösterir."
    >
      <div className="grid grid-cols-1 items-start gap-x-10 gap-y-8 lg:grid-cols-12">
        <div className="cam min-w-0 p-6 sm:p-9 lg:col-span-8" data-figma-panel="">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="baslik text-[26px]">
              <span lang="en">Theme</span> koleksiyonu
            </h3>
            <Secim<ModAd> legend="Mod" gizli name="fg-mod" value={mod} onChange={setMod} options={MOD_SIRA.map((m) => ({ id: m, ad: MODLAR[m].ad }))} />
          </div>
          <div className="mt-6 overflow-x-auto" role="region" aria-label="Değişken tablosu" tabIndex={0}>
            <table className="tablo w-full min-w-[640px] border-collapse text-[15px]" data-figma-tablo="">
              <thead>
                <tr>
                  <th scope="col" className="etiket">
                    Değişken
                  </th>
                  {MOD_SIRA.map((m) => (
                    <th key={m} scope="col" className={cx('etiket', mod === m && 'underline decoration-2 underline-offset-8')} aria-current={mod === m ? 'true' : undefined}>
                      {MODLAR[m].ad}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {satirlar.map((s) => (
                  <tr key={s.ad}>
                    <th scope="row" className="font-mono text-[13px] font-medium">
                      {s.ad}
                    </th>
                    {MOD_SIRA.map((m) => (
                      <td key={m} className={cx('font-mono text-[12.5px]', mod === m && 'font-bold')}>
                        <span className="flex items-center gap-2">
                          {s.renk ? <span className="size-5 shrink-0 rounded-full border border-[var(--kontrol)]" style={{ background: s.deger(m) }} aria-hidden="true" /> : null}
                          {s.deger(m)}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="grid min-w-0 grid-cols-1 content-start gap-6 lg:col-span-4">
          <ZamanSahnesi saat={MODLAR[mod].saat} className="border border-[var(--cam-kenar)]" icKlas="relative z-10 p-4 pt-24" data-figma-onizleme={mod}>
            <BiophilicCard dinamik mod={mod} baslik="Prototip önizleme">
              <p className="text-[15px] text-soluk">
                <span className="font-mono text-[13px]">{MODLAR[mod].token}</span>
              </p>
            </BiophilicCard>
          </ZamanSahnesi>
          <div className="cam p-6">
            <p className="kicker">Prototip</p>
            <p className="mt-2 text-[15.5px] text-soluk">
              <span lang="en">After delay 1000 ms → Set variable mode: Theme = Akşam → Smart animate</span>
            </p>
          </div>
        </div>
      </div>

      <div className="cam mt-[var(--aralik)] p-6 sm:p-9">
        <h3 className="baslik text-[clamp(26px,2.8vw,36px)]">Koleksiyonlar</h3>
        <ul className="m-0 mt-6 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2 xl:grid-cols-3" data-koleksiyonlar="">
          {FIGMA_KOLEKSIYONLAR.map((k) => (
            <li key={k.ad} className="cam-ic p-5">
              <p className="font-mono text-[14px] font-semibold">{k.ad}</p>
              <p className="kicker mt-1 !text-[11.5px]">{k.mod}</p>
              <p className="mt-2 text-[15px] text-soluk">{k.not}</p>
            </li>
          ))}
        </ul>

        <h3 className="baslik mt-12 text-[clamp(26px,2.8vw,36px)]">Tokenlar</h3>
        <dl className="m-0 mt-6 grid grid-cols-1 gap-3 md:grid-cols-2" data-tokenlar="">
          {FIGMA_ETIKETLER.map((t) => (
            <div key={t.ad} className="cam-ic flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-5 py-3">
              <dt className="font-mono text-[14px] font-semibold">{t.ad}</dt>
              <dd className="m-0 text-[14.5px] text-soluk">{t.deger}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  )
}

/* ───────────────────────── Madde 15 · CSS / Tailwind ───────────────────────── */

const MOD_METIN: Record<string, string> = { ogle: 'text-emerald-900', sabah: 'text-emerald-900', aksam: 'text-slate-900', gece: 'text-white' }

export function Css() {
  const [v, setV] = useState('ogle')
  const kutu = useRef<HTMLDivElement>(null)
  const [olc, setOlc] = useState({ sure: '', ozellik: '' })
  const secili = TAILWIND_ORNEK.varyant.find((x) => x.id === v)!
  useEffect(() => {
    const el = kutu.current
    if (!el) return
    const cs = getComputedStyle(el)
    setOlc({ sure: cs.transitionDuration, ozellik: cs.transitionProperty })
  }, [v])
  return (
    <Section
      id="css"
      ikon="ayar"
      madde="Madde 15 · CSS / Tailwind yapısı"
      title={
        <>
          Bir saniyede <span className="vurgu">yumuşak</span> geçiş
        </>
      }
      lead={
        <>
          Tailwind’de dinamik tema tek satırdır: <span className="font-mono text-[0.9em]">transition-colors duration-1000 ease-in-out</span> ve gradyan renkleri. Aşağıdaki kutu tam bu sınıflarla çalışır; modu değiştirdiğinizde yalnız gradyan sınıfları değişir.
        </>
      }
    >
      <div className="grid grid-cols-1 items-start gap-x-10 gap-y-8 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-7">
          <div ref={kutu} className={cx(TAILWIND_ORNEK.sinif.split(' ').slice(0, 3).join(' '), secili.sinif, MOD_METIN[v], 'min-h-[300px] rounded-[2.4rem] border border-[rgb(255_255_255/.7)] p-7 sm:p-10')} data-tailwind-kutu={v} style={{ boxShadow: 'var(--golge-2)' }}>
            <p className="font-baslik text-[13px] font-semibold tracking-[0.16em] uppercase">Tailwind · {secili.id}</p>
            <p className="mt-4 font-baslik text-[clamp(30px,4vw,48px)] leading-[1.08] font-light">Gökyüzü rengini yavaşça değiştirir.</p>
            <p className="mt-5 max-w-[46ch] text-[17px]">Bu kutu, spesifikasyondaki sınıfların birebir aynısıyla çizilir. Arka plan gradyanı 1000 ms’de, ease-in-out eğrisiyle geçer.</p>
          </div>
          <div className="cam mt-6 p-5 sm:p-6">
            <Secim<string> legend="Mod" name="css-mod" value={v} onChange={setV} options={TAILWIND_ORNEK.varyant.map((x) => ({ id: x.id, ad: x.ad }))} />
            <p className="mt-4 font-mono text-[13px] text-soluk" data-tailwind-olcum={`${olc.sure}|${olc.ozellik}`}>
              transition-duration {olc.sure} · property {olc.ozellik.split(',').length} adet
            </p>
            <div className="mt-4">
              <BioButton ton="cam" boy="k" onClick={() => setV('ogle')} ikon={<Ikon ad="yenile" boyut={18} />}>
                Öğleye dön
              </BioButton>
            </div>
          </div>
        </div>
        <div className="min-w-0 lg:col-span-5">
          <div className="cam p-6 sm:p-8">
            <h3 className="baslik text-[24px]">Sınıf → CSS</h3>
            <table className="tablo mt-3 w-full border-collapse text-[14.5px]" data-sinif-tablo="">
              <tbody>
                {[
                  ['transition-colors', 'renk, arka plan ve gradyan durakları geçer'],
                  ['duration-1000', 'transition-duration: 1000ms'],
                  ['ease-in-out', 'cubic-bezier(0.4, 0, 0.2, 1)'],
                  ['bg-gradient-to-br', 'sağ alt köşeye doğru gradyan'],
                  ['from-emerald-50', 'gradyan başlangıcı #ecfdf5'],
                  ['to-teal-100', 'gradyan bitişi #ccfbf1'],
                ].map(([a, b]) => (
                  <tr key={a}>
                    <th scope="row" className="font-mono text-[13px] font-medium">
                      {a}
                    </th>
                    <td className="text-soluk">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="cam mt-[var(--aralik)] grid grid-cols-1 gap-x-10 gap-y-8 p-6 sm:p-9 lg:grid-cols-2">
        <div className="min-w-0">
          <p className="kicker mb-2">Tailwind</p>
          <Kod label="Tailwind sınıfları" sar>{`<div class="${TAILWIND_ORNEK.sinif}">\n  ...\n</div>`}</Kod>
          <p className="kicker mt-6 mb-2">Kayıtlı özellikler</p>
          <Kod label="@property kaydı" sar={false}>{`@property --zg-1 {\n  syntax: '<color>';\n  inherits: true;\n  initial-value: #87ceeb;\n}\n\n:root {\n  transition: --zg-1 1000ms ease-in-out,\n              --cam-a 1000ms ease-in-out;\n}`}</Kod>
        </div>
        <div className="min-w-0">
          <p className="kicker mb-2">Cam panel</p>
          <Kod
            label="Cam panel CSS"
            sar={false}
          >{`.cam {\n  background: color-mix(in srgb,\n    var(--cam-tint) calc(var(--cam-a) * 100%),\n    transparent);\n  backdrop-filter: blur(20px) saturate(1.3);\n  border-radius: 63% 37% 54% 46% / 55% 48% 52% 45%;\n  box-shadow: var(--golge-x) 16px 44px -14px\n    rgb(8 52 40 / .2);\n}`}</Kod>
          <p className="kicker mt-6 mb-2">Saati yazan tek satır</p>
          <Kod label="Değişkenleri yazma" sar={false}>{`const p = palet(saat, { hedef: 4.5 })\nObject.entries(degiskenler(p)).forEach(([k, v]) =>\n  document.documentElement.style.setProperty(k, v))`}</Kod>
        </div>
      </div>
    </Section>
  )
}
