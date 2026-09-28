import { useState } from 'react'
import { Ikon, Kaomoji, YUZLU, type IkonAd } from '../components/Icons'
import { KSlider, KSwitch, Kod, Secim, Section } from '../components/ui'

const KATMAN = [
  { id: 'taban', ad: 'Taban renk', css: 'background: #FFD3B6' },
  {
    id: 'isik',
    ad: 'Üst ışık gradyanı',
    css: 'linear-gradient(180deg, #FFE9DB, #FFD3B6 55%)',
  },
  {
    id: 'parlak',
    ad: 'İç parıltı çizgisi',
    css: 'inset 0 3px 0 rgb(255 255 255 / .7)',
  },
  { id: 'kalinlik', ad: 'Alt kalınlık', css: '0 6px 0 #F2AD85' },
  {
    id: 'golge',
    ad: 'Renkli yumuşak gölge',
    css: '0 8px 16px rgba(255,170,165,.4)',
  },
] as const

/** Madde 8: pürüzsüz, oyuncak ve şekerleme yüzeyi */
export function Doku() {
  const [acik, setAcik] = useState<Record<string, boolean>>({
    taban: true,
    isik: true,
    parlak: true,
    kalinlik: true,
    golge: true,
  })
  const golgeler = [acik.parlak && 'inset 0 3px 0 rgb(255 255 255 / 0.7)', acik.kalinlik && '0 6px 0 #F2AD85', acik.golge && '0 8px 16px rgba(255,170,165,0.4)'].filter(Boolean).join(', ')
  const zemin = acik.isik ? 'linear-gradient(180deg, #FFE9DB 0%, #FFD3B6 55%)' : acik.taban ? '#FFD3B6' : 'transparent'
  return (
    <Section id="doku" madde="Madde 8 · Doku ve yüzey" title="Hatmi, jelibon, şeker" lead="Yüzeyde gren, doku ya da gürültü yok: pürüzsüz ve oyuncak gibi. Hatmi düğme beş katmandan yapılır; katmanları tek tek kapatıp neyin 'şekerleme' hissini verdiğini gör.">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div className="kabarcik grid min-h-[280px] min-w-0 place-items-center p-8">
          <span
            className="inline-flex min-h-[76px] items-center gap-3 rounded-bubble px-12 font-display text-[26px] font-extrabold"
            style={{
              background: zemin,
              boxShadow: golgeler || 'none',
              border: acik.taban || acik.isik ? undefined : '3px dashed #c9aea3',
            }}
            data-hatmi=""
          >
            <Ikon ad="kalp" boyut={36} /> Hatmi
          </span>
        </div>
        <div className="kabarcik grid min-w-0 grid-cols-1 content-start gap-4 p-6">
          <ul className="m-0 grid list-none gap-3 p-0" aria-label="Hatmi düğmenin katmanları">
            {KATMAN.map((k) => (
              <li key={k.id}>
                <KSwitch label={k.ad} hint={<code className="text-[13px] break-all">{k.css}</code>} checked={acik[k.id]} onChange={(v) => setAcik((a) => ({ ...a, [k.id]: v }))} />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <ul className="m-0 mt-10 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            ad: 'Jelibon',
            not: 'Parlak, yarı saydam ışık lekesi',
            stil: {
              background: 'radial-gradient(40% 30% at 32% 26%, rgb(255 255 255 / .85), transparent 70%), linear-gradient(160deg, #FFC2BE, #FFAAA5 60%, #F4918B)',
              boxShadow: '0 12px 22px rgb(233 130 124 / .4)',
            },
          },
          {
            ad: 'Hatmi',
            not: 'Mat, yumuşak üst ışık',
            stil: {
              background: 'linear-gradient(180deg, #FFFFFF, #FFF1E8 60%, #FFE3D2)',
              boxShadow: '0 12px 22px rgb(255 170 165 / .3), inset 0 -6px 12px rgb(255 211 182 / .6)',
            },
          },
          {
            ad: 'Şeker çubuğu',
            not: 'Eğik şerit, hep aynı açı',
            stil: {
              background: 'repeating-linear-gradient(-45deg, #FFFFFF 0 14px, #A8E6CF 14px 28px)',
              boxShadow: '0 12px 22px rgb(76 175 136 / .35)',
            },
          },
          {
            ad: 'Pamuk şeker',
            not: 'Kabarık, iç içe yumuşak halkalar',
            stil: {
              background: 'radial-gradient(circle at 30% 35%, #FFE3EC 0 22%, transparent 23%), radial-gradient(circle at 68% 40%, #F6D6E6 0 26%, transparent 27%), radial-gradient(circle at 48% 68%, #FFE8DA 0 28%, transparent 29%), #FBE0E4',
              boxShadow: '0 12px 22px rgb(180 120 120 / .3)',
            },
          },
        ].map((d, i) => (
          <li key={d.ad} className="grid justify-items-center gap-3 text-center">
            <span
              className="block size-32 jole-hover"
              style={{
                ...d.stil,
                borderRadius: ['50%', '46% 54% 50% 50% / 55% 50% 50% 45%', '9999px', '52% 48% 56% 44% / 48% 56% 44% 52%'][i],
              }}
              aria-hidden="true"
            />
            <span className="font-display text-[22px] font-extrabold">{d.ad}</span>
            <span className="text-[15px] text-muted">{d.not}</span>
          </li>
        ))}
      </ul>
    </Section>
  )
}

const ADLAR: Record<IkonAd, string> = {
  yildiz: 'Yıldız',
  kalp: 'Kalp',
  bulut: 'Bulut',
  damla: 'Damla',
  cicek: 'Çiçek',
  elma: 'Elma',
  kitap: 'Kitap',
  kemik: 'Kemik',
  top: 'Top',
  ay: 'Ay',
  ates: 'Seri',
  ampul: 'İpucu',
  mama: 'Mama',
  kilit: 'Kilit',
  ayar: 'Ayarlar',
  kapat: 'Kapat',
  onay: 'Onay',
  ok: 'İleri',
  yukari: 'Yukarı',
  ses: 'Ses',
  yenile: 'Yenile',
}

/** Madde 9: kalın çizgi, içinde gülen yüz */
export function Ikonlar() {
  const [yuz, setYuz] = useState(true)
  const [ruh, setRuh] = useState<'mutlu' | 'uzgun' | 'uykulu'>('mutlu')
  const [boyut, setBoyut] = useState(56)
  return (
    <Section
      id="ikonlar"
      madde="Madde 9 · İkonografi"
      title="Her ikonun bir yüzü var"
      lead={
        <>
          48 birimlik ızgara, 3,5 birim kahverengi çizgi, yuvarlak uç ve birleşim. Nesne ikonları içinde iki nokta göz ve küçük bir gülüş <Kaomoji /> taşır; arayüz ikonları (kapat, onay, ok) yüzsüz ve sadedir ki anlam karışmasın.
        </>
      }
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <ul className="m-0 grid min-w-0 list-none grid-cols-[repeat(auto-fill,minmax(112px,1fr))] gap-4 p-0" data-ikon-izgara="">
          {YUZLU.map((a) => (
            <li key={a} className="kabarcik grid justify-items-center gap-2 px-2 py-4 text-center">
              <span className="grid h-[72px] place-items-center">
                <Ikon ad={a} boyut={boyut} yuz={yuz} ruh={ruh} className="jole-hover" />
              </span>
              <span className="text-[15px] font-extrabold">{ADLAR[a]}</span>
            </li>
          ))}
        </ul>
        <div className="kabarcik grid min-w-0 grid-cols-1 content-start gap-5 p-6">
          <KSwitch label="Yüzler" checked={yuz} onChange={setYuz} />
          <Secim
            legend="İfade"
            name="ikon-ruh"
            value={ruh}
            onChange={setRuh}
            options={[
              { id: 'mutlu', ad: 'Mutlu' },
              { id: 'uzgun', ad: 'Üzgün' },
              { id: 'uykulu', ad: 'Uykulu' },
            ]}
          />
          <KSlider label="Boyut" value={boyut} min={32} max={72} step={4} onChange={setBoyut} format={(v) => `${v}px`} renk="mint" />
          <div>
            <p className="kicker text-muted">Arayüz ikonları</p>
            <ul className="m-0 mt-3 flex list-none flex-wrap gap-3 p-0">
              {(['ayar', 'kapat', 'onay', 'ok', 'yukari', 'ses', 'yenile'] as IkonAd[]).map((a) => (
                <li key={a} className="grid size-14 place-items-center rounded-full bg-cream" title={ADLAR[a]}>
                  <Ikon ad={a} boyut={30} etiket={ADLAR[a]} />
                </li>
              ))}
            </ul>
          </div>
          <Kod label="İkon kullanımı">{`<Ikon ad="elma" ruh="${ruh}"${yuz ? '' : ' yuz={false}'} boyut={${boyut}} />`}</Kod>
        </div>
      </div>
    </Section>
  )
}
