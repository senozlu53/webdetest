import { useEffect, useRef, useState } from 'react'
import { cx } from '../../shared/cx'
import { RENK, RUH_AD, type MaskotRenk, type Ruh } from '../lib/maskot'
import { CloudCard, type BulutRenk } from '../components/CloudCard'
import { KawaiiButton, type BtnRenk } from '../components/KawaiiButton'
import { LottieMascot } from '../components/LottieMascot'
import { Mascot, maskotEtiket } from '../components/Mascot'
import { MascotTooltip } from '../components/MascotTooltip'
import { Ikon } from '../components/Icons'
import { KSlider, KSwitch, Kod, Secim, Section } from '../components/ui'

const RUHLAR: Ruh[] = ['mutlu', 'heyecanli', 'saskin', 'uykulu', 'uzgun']
const RENKLER: MaskotRenk[] = ['peach', 'mint', 'salmon', 'rose', 'paper']

/** Madde 14: Lottie destekli <KawaiiButton>, <CloudCard>, <MascotTooltip> */
export function Bilesenler() {
  const [ruh, setRuh] = useState<Ruh>('mutlu')
  const [renk, setRenk] = useState<MaskotRenk>('peach')
  const [hiz, setHiz] = useState(1)
  const [oynat, setOynat] = useState(true)
  const [kart, setKart] = useState<BulutRenk>('mint')
  const [maskotlu, setMaskotlu] = useState(true)
  return (
    <Section
      id="bilesenler"
      madde="Madde 14 · React"
      title="Üç bileşen, bir maskot"
      lead="Animasyon için Lottie seçildi (lottie-web, 'light' SVG oynatıcı; eval gerektirmez). Rive'ın .riv dosyası ve WASM çalışma zamanı yerine Lottie JSON'u kodda üretilir: maskotun çizimi SVG bileşeniyle aynı yollardan gelir, renk ve ruh hâli parametredir."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="kabarcik grid min-w-0 justify-items-center gap-3 p-6">
          <div className="grid w-full place-items-center rounded-[32px] bg-cream py-4">
            <LottieMascot ruh={ruh} renk={renk} boyut={220} hiz={hiz} oynat={oynat} etiket={maskotEtiket(ruh, renk)} />
          </div>
          <Kod label="LottieMascot JSX" className="w-full">{`<LottieMascot ruh="${ruh}" renk="${renk}" hiz={${hiz}}${oynat ? '' : ' oynat={false}'} />`}</Kod>
        </div>
        <div className="kabarcik grid min-w-0 grid-cols-1 content-start gap-5 p-6">
          <Secim legend="Ruh hâli" name="lot-ruh" value={ruh} onChange={setRuh} options={RUHLAR.map((r) => ({ id: r, ad: RUH_AD[r] }))} />
          <Secim legend="Renk" name="lot-renk" value={renk} onChange={setRenk} options={RENKLER.map((r) => ({ id: r, ad: RENK[r].ad }))} />
          <KSlider label="Oynatma hızı" value={hiz} min={0.25} max={2} step={0.25} onChange={setHiz} format={(v) => `${v.toString().replace('.', ',')}×`} renk="peach" />
          <KSwitch label="Oynat" hint="Hareket ya da maskot animasyonu kapalıysa ilk kare durağan çizilir." checked={oynat} onChange={setOynat} />
        </div>
      </div>

      <h3 className="mt-16 text-[34px]">{'<KawaiiButton>'}</h3>
      <p className="mt-2 max-w-[60ch] text-[16px] text-muted">Beş renk, üç boy. Kalp ve yıldız ikonları Lottie: üstüne gelince, odaklanınca ve basınca bir kez atar. Basınca düğme 4px iner ve yassılır.</p>
      <div className="mt-6 flex flex-wrap items-center gap-5" data-dugmeler="">
        {(['peach', 'mint', 'salmon', 'rose', 'paper'] as BtnRenk[]).map((r, i) => (
          <KawaiiButton key={r} renk={r} lottie={i % 2 ? 'kalp' : 'yildiz'}>
            {RENK[r].ad}
          </KawaiiButton>
        ))}
        <KawaiiButton boy="k">Küçük · 48</KawaiiButton>
        <KawaiiButton boy="b" renk="mint">
          Büyük · 68
        </KawaiiButton>
        <KawaiiButton disabled>Pasif</KawaiiButton>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="min-w-0">
          <h3 className="text-[34px]">{'<CloudCard>'}</h3>
          <div className="mt-6 grid grid-cols-1 gap-5">
            <Secim legend="Bulut rengi" name="kart-renk" value={kart} onChange={setKart} options={(['paper', 'mint', 'peach', 'salmon', 'rose'] as BulutRenk[]).map((r) => ({ id: r, ad: RENK[r].ad }))} />
            <KSwitch label="Maskot yuvası" checked={maskotlu} onChange={setMaskotlu} />
          </div>
          <CloudCard renk={kart} className="mt-12 px-6 pt-9 pb-7" maskot={maskotlu ? <LottieMascot ruh="mutlu" renk={kart === 'peach' ? 'mint' : 'peach'} boyut={92} /> : undefined} data-kart-ornek={kart}>
            <p className="kicker">Ders 4 · Hayvanlar</p>
            <p className="mt-2 font-display text-[28px] font-extrabold">Kedi, köpek, tavşan</p>
            <p className="mt-2 text-[16px]">12 yeni kelime · 8 dakika</p>
            <KawaiiButton className="mt-5" renk={kart === 'paper' ? 'peach' : 'paper'} boy="k">
              Başla
            </KawaiiButton>
          </CloudCard>
        </div>
        <div className="min-w-0">
          <h3 className="text-[34px]">{'<MascotTooltip>'}</h3>
          <p className="mt-2 text-[16px] text-muted">Üstüne gel ya da Tab ile odaklan. Esc kapatır. Metin tetikleyiciye aria-describedby ile bağlanır.</p>
          <div className="mt-8 flex flex-wrap gap-5" data-ipuclari="">
            <MascotTooltip icerik="Kelimeyi sesli dinle" renk="mint">
              <KawaiiButton renk="mint" className="!size-16 !p-0" aria-label="Dinle">
                <Ikon ad="ses" boyut={32} />
              </KawaiiButton>
            </MascotTooltip>
            <MascotTooltip icerik="Bir ipucu harca: ilk harf açılır" ruh="heyecanli" renk="peach">
              <KawaiiButton className="!size-16 !p-0" aria-label="İpucu">
                <Ikon ad="ampul" boyut={34} />
              </KawaiiButton>
            </MascotTooltip>
            <MascotTooltip icerik="Bu ders kilitli: önce 3. dersi bitir" ruh="uzgun" renk="rose" taraf="bottom">
              <KawaiiButton renk="rose" className="!size-16 !p-0" aria-label="Kilitli ders">
                <Ikon ad="kilit" boyut={32} />
              </KawaiiButton>
            </MascotTooltip>
          </div>
          <Kod label="MascotTooltip JSX" className="mt-8" sar={false}>{`<MascotTooltip icerik="Kelimeyi sesli dinle" renk="mint">
  <KawaiiButton renk="mint" aria-label="Dinle">
    <Ikon ad="ses" />
  </KawaiiButton>
</MascotTooltip>`}</Kod>
        </div>
      </div>
    </Section>
  )
}

/** Madde 12 · 13: %100 köşe, maskot instance varyantları, tokenlar */
export function Figma() {
  const [sec, setSec] = useState<[Ruh, MaskotRenk]>(['mutlu', 'mint'])
  const [yukseklik, setYukseklik] = useState(56)
  return (
    <Section
      id="figma"
      madde="Madde 12 · 13 · Figma"
      title="Hap ve instance"
      lead="Figma'da köşe yarıçapı her zaman %100 (Radius/Bubble = 9999): bileşen ne kadar uzarsa uzasın uçları yarım daire kalır. Maskot tek bir bileşen setidir; düğme, kart ve ipucunun içine instance olarak konur ve Ruh × Renk özellikleriyle değişir."
    >
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.3fr_1fr]">
        <div className="kabarcik min-w-0 p-5 md:p-6">
          <p className="kicker text-muted">Maskot · 5 ruh × 5 renk = 25 varyant</p>
          <div className="mt-4 overflow-x-auto" role="region" aria-label="Maskot varyant tablosu" tabIndex={0}>
            <table className="w-full min-w-[480px] border-separate border-spacing-1.5">
              <thead>
                <tr>
                  <td />
                  {RENKLER.map((r) => (
                    <th key={r} scope="col" className="text-[13px] font-extrabold">
                      {RENK[r].ad}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RUHLAR.map((ruh) => (
                  <tr key={ruh}>
                    <th scope="row" className="pr-2 text-left text-[13px] font-extrabold">
                      {RUH_AD[ruh]}
                    </th>
                    {RENKLER.map((r) => {
                      const on = sec[0] === ruh && sec[1] === r
                      return (
                        <td key={r} className="p-0">
                          <button type="button" onClick={() => setSec([ruh, r])} aria-pressed={on} aria-label={maskotEtiket(ruh, r)} className={cx('grid w-full place-items-center rounded-[20px] p-1.5 transition-colors', on ? 'bg-mint shadow-[var(--sh-mint)]' : 'bg-cream hover:bg-peach/50')}>
                            <Mascot ruh={ruh} renk={r} boyut={56} />
                          </button>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="grid min-w-0 grid-cols-1 content-start gap-6">
          <div className="kabarcik grid grid-cols-1 gap-3 p-5" data-instance="">
            <p className="kicker text-muted">Instance özellikleri</p>
            <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[16px]">
              <dt className="font-extrabold">Bileşen</dt>
              <dd className="m-0">Maskot</dd>
              <dt className="font-extrabold">Ruh</dt>
              <dd className="m-0">{RUH_AD[sec[0]]}</dd>
              <dt className="font-extrabold">Renk</dt>
              <dd className="m-0">
                {RENK[sec[1]].ad} · {RENK[sec[1]].dolgu}
              </dd>
            </dl>
            <p className="kicker mt-2 text-muted">Yuvalarda</p>
            <div className="flex flex-wrap items-center gap-4">
              <KawaiiButton renk={sec[1] === 'peach' ? 'mint' : 'peach'} ikon={<Mascot ruh={sec[0]} renk={sec[1]} boyut={36} />} className="!pl-4">
                Düğmede
              </KawaiiButton>
              <span className="kipucu !max-w-none">
                <Mascot ruh={sec[0]} renk={sec[1]} boyut={40} />
                İpucunda
              </span>
            </div>
          </div>
          <div className="kabarcik grid grid-cols-1 gap-4 p-5">
            <p className="kicker text-muted">Radius/Bubble</p>
            <div className="grid min-h-[110px] place-items-center rounded-[24px] bg-cream p-3">
              <span
                className="inline-flex items-center rounded-bubble bg-peach px-8 font-display font-extrabold shadow-[var(--sh-salmon)]"
                style={{
                  height: yukseklik,
                  fontSize: Math.max(15, yukseklik / 3),
                }}
                data-bubble-ornek=""
              >
                Hap
              </span>
            </div>
            <KSlider label="Yükseklik" value={yukseklik} min={32} max={96} step={8} onChange={setYukseklik} format={(v) => `${v}px → köşe ${v / 2}px`} renk="peach" />
          </div>
        </div>
      </div>
      <Kod label="Figma tokenları, W3C DTCG" className="mt-8" sar={false}>{`{
  "Radius": { "Bubble":      { "$type": "dimension", "$value": "9999px" } },
  "Color":  { "PastelMint":  { "$type": "color",     "$value": "#A8E6CF" } },
  "Shadow": { "ColoredSoft": { "$type": "shadow",    "$value": {
      "color": "#FFAAA566", "offsetX": "0", "offsetY": "8px", "blur": "16px", "spread": "0" } } }
}`}</Kod>
    </Section>
  )
}

/** Madde 15: tanımdaki Tailwind satırı, birebir */
export function Css() {
  const ref = useRef<HTMLSpanElement>(null)
  const [olcum, setOlcum] = useState<[string, string][]>([])
  useEffect(() => {
    const e = ref.current
    if (!e) return
    const c = getComputedStyle(e)
    setOlcum([
      ['background-color', c.backgroundColor],
      ['color', c.color],
      ['border-radius', /e\+/.test(c.borderRadius) ? `${c.borderRadius} (calc(infinity * 1px): tam hap)` : c.borderRadius],
      // Tailwind'in boş halka katmanlarını (0 0 0 0 saydam) ayıkla, yalnız gerçek gölge kalsın
      [
        'box-shadow',
        c.boxShadow
          .split(/,(?![^(]*\))/)
          .map((x) => x.trim())
          .filter((x) => !/^rgba\(0, 0, 0, 0\) 0px 0px 0px 0px$/.test(x))
          .join(', '),
      ],
    ])
  }, [])
  return (
    <Section id="css" madde="Madde 15 · CSS / Tailwind" title="Tek satır şeker" lead="Tanımdaki sınıflar olduğu gibi: bebek pembesi zemin, koyu kahverengi yazı, tam yuvarlak köşe ve şeftali tonunda yumuşak gölge. Aşağıdaki değerler tarayıcının hesapladığı gerçek değerler.">
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
        <div className="kabarcik grid min-h-[220px] place-items-center p-6">
          <span ref={ref} className="bg-[#FFD3B6] text-[#5D4037] rounded-full shadow-[0_8px_16px_rgba(255,170,165,0.4)] inline-flex min-h-16 items-center gap-3 px-10 font-display text-[24px] font-extrabold" data-madde15="">
            <Ikon ad="kalp" boyut={34} /> Sevimli
          </span>
        </div>
        <div className="grid min-w-0 grid-cols-1 gap-5">
          <Kod label="Madde 15 sınıfları" sar={false}>{`<span class="bg-[#FFD3B6] text-[#5D4037]
             rounded-full
             shadow-[0_8px_16px_rgba(255,170,165,0.4)]">
  Sevimli
</span>`}</Kod>
          <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 rounded-[28px] bg-paper p-5 font-mono text-[13px]" data-olcum="">
            {olcum.map(([a, b]) => (
              <div key={a} className="contents">
                <dt className="font-bold">{a}</dt>
                <dd className="m-0 break-all">{b}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  )
}
