import { useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { SolidButton, type Fill, type Press, type Size } from '../components/SolidButton'
import { BrutalistCard, type CardFill } from '../components/BrutalistCard'
import { Tag } from '../components/Tag'
import { Marquee, type Speed } from '../components/Marquee'
import { Check, Chips, Field, Section, Switch } from '../components/ui'
import { IconArrow, IconBolt, IconHeart, IconSmile, IconX } from '../components/Icons'
import { useBrut, type Tone } from '../lib/store'
import { cx } from '../../shared/cx'

const FILLS: { id: Fill; ad: string }[] = [
  { id: 'yellow', ad: 'Sarı' },
  { id: 'red', ad: 'Kırmızı' },
  { id: 'blue', ad: 'Mavi' },
  { id: 'green', ad: 'Yeşil' },
  { id: 'pink', ad: 'Pembe' },
  { id: 'white', ad: 'Beyaz' },
]

function ButtonLab() {
  const [fill, setFill] = useState<Fill>('yellow')
  const [size, setSize] = useState<Size>('l')
  const [press, setPress] = useState<Press>('yarim')
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const { announce } = useBrut()
  const cls = `border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)]\n${press === 'yarim' ? 'hover:translate-x-[2px] hover:translate-y-[2px]\nhover:shadow-[4px_4px_0px_rgba(0,0,0,1)]' : 'hover:translate-x-[6px] hover:translate-y-[6px]\nhover:shadow-none'}\nactive:translate-x-[6px] active:translate-y-[6px] active:shadow-none`
  return (
    <BrutalistCard className="md:col-span-7">
      <h3 className="headline" lang="en">
        SolidButton
      </h3>
      <p className="mt-2 max-w-[52ch] font-medium text-muted">Üstüne gelince gölge küçülür ve buton iner; basınca gölge tamamen kaybolur, buton gölgenin yerine çöker.</p>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="space-y-4">
          <Chips<Fill> legend="Renk" name="btn-renk" value={fill} onChange={setFill} options={FILLS} />
          <Chips<Size> legend="Boyut" name="btn-boyut" value={size} onChange={setSize} options={[{ id: 's', ad: 'S' }, { id: 'm', ad: 'M' }, { id: 'l', ad: 'L' }]} fill="blue" />
          <Chips<Press> legend="Üstüne gelince" name="btn-bas" value={press} onChange={setPress} options={[{ id: 'yarim', ad: 'Yarım iniş' }, { id: 'tam', ad: 'Tam çöküş' }]} fill="green" />
        </div>
        <div className="flex min-w-0 flex-col items-start gap-5">
          <div className="grid min-h-[132px] w-full place-items-center rounded-brut border-[3px] border-dashed border-line p-5">
            <SolidButton
              fill={fill}
              size={size}
              press={press}
              loading={loading}
              icon={<IconBolt size={size === 'l' ? 22 : 18} />}
              onClick={() => {
                setCount((c) => c + 1)
                announce(`Basıldı: ${count + 1}`)
              }}
            >
              Bas bana
            </SolidButton>
          </div>
          <p className="font-display text-[22px] font-black uppercase [font-stretch:110%]" aria-hidden="true">
            Basıldı: {count}
          </p>
          <div className="flex flex-wrap gap-3">
            <SolidButton size="s" fill="white" disabled>
              Pasif
            </SolidButton>
            <SolidButton size="s" fill="white" onClick={() => setLoading((v) => !v)} aria-pressed={loading}>
              {loading ? 'Yüklemeyi bitir' : 'Yükleniyor yap'}
            </SolidButton>
          </div>
        </div>
      </div>
      <pre className="scroll-x mt-6 rounded-brut border-[3px] border-line fill-ink p-3 font-mono text-[12px] leading-relaxed" tabIndex={0} aria-label="Butonun sınıfları">
        <code>{cls}</code>
      </pre>
    </BrutalistCard>
  )
}

function Cards() {
  const [fill, setFill] = useState<CardFill>('surface')
  const [fav, setFav] = useState(false)
  return (
    <BrutalistCard fill="pink" className="md:col-span-5 md:mt-12">
      <h3 className="headline" lang="en">
        BrutalistCard
      </h3>
      <div className="mt-4">
        <Chips<CardFill>
          legend="Dolgu"
          name="kart-dolgu"
          value={fill}
          onChange={setFill}
          fill="yellow"
          options={[
            { id: 'surface', ad: 'Beyaz' },
            { id: 'yellow', ad: 'Sarı' },
            { id: 'blue', ad: 'Mavi' },
            { id: 'green', ad: 'Yeşil' },
          ]}
        />
      </div>
      <div className="mt-6 grid gap-6">
        <BrutalistCard fill={fill} interactive as="article">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Tag size="s" fill="ink">
                Yeni
              </Tag>
              <h4 className="mt-3 font-display text-[26px] leading-none font-black uppercase [font-stretch:115%]">Sert Kapşonlu</h4>
              <p className="mt-2 font-medium">Üstüne gelin: kart 3px yukarı seker, gölge 9px olur.</p>
            </div>
            <button type="button" aria-pressed={fav} aria-label="Favorilere ekle" onClick={() => setFav((v) => !v)} className={cx('grid size-11 shrink-0 place-items-center rounded-brut border-[3px] border-line brut-shadow-sm snap press', fav ? 'fill-red' : 'bg-surface text-ink')}>
              <IconHeart size={20} fill={fav ? 'currentColor' : 'none'} />
            </button>
          </div>
        </BrutalistCard>
        <div className="rounded-[18px] border-[3px] border-line bg-surface p-5 brut-shadow">
          <p className="flex items-center gap-2 font-bold">
            <IconSmile size={22} /> Yuvarlak köşe de olur
          </p>
          <p className="mt-1 text-[15px] font-medium text-muted">18px köşe, aynı çizgi ve aynı sert gölge.</p>
        </div>
      </div>
    </BrutalistCard>
  )
}

function TagLab() {
  const { announce } = useBrut()
  const [tags, setTags] = useState(['react', 'tailwind', 'figma'])
  const [v, setV] = useState('')
  const input = useRef<HTMLInputElement>(null)
  const add = () => {
    const t = v.trim().replace(/,$/, '').toLocaleLowerCase('tr')
    if (!t) return
    if (tags.includes(t)) return announce(`${t} zaten var`, 'assertive')
    if (tags.length >= 8) return announce('En fazla 8 etiket', 'assertive')
    setTags((x) => [...x, t])
    setV('')
    announce(`${t} eklendi`)
  }
  const remove = (t: string) => {
    setTags((x) => x.filter((y) => y !== t))
    announce(`${t} kaldırıldı`)
    input.current?.focus()
  }
  const key = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      add()
    } else if (e.key === 'Backspace' && !v && tags.length) remove(tags[tags.length - 1])
  }
  const fills = ['yellow', 'blue', 'green', 'pink', 'red'] as const
  return (
    <BrutalistCard fill="surface" className="md:col-span-5">
      <h3 className="headline">Etiketler</h3>
      <div className="mt-5 flex flex-wrap items-center gap-3" aria-hidden="true">
        <Tag size="l" fill="yellow" tilt={-3}>
          Satışta
        </Tag>
        <Tag size="l" fill="red" tilt={2}>
          %50
        </Tag>
        <Tag fill="blue">Beta</Tag>
        <Tag fill="green">Yayında</Tag>
        <Tag fill="ink">v2.0</Tag>
      </div>
      <div className="mt-7">
        <label htmlFor="etiket-gir" className="mb-1.5 block font-bold">
          Etiket ekle
        </label>
        <div className="flex min-h-14 flex-wrap items-center gap-2 rounded-brut border-[3px] border-line bg-surface p-2 focus-within:shadow-[3px_3px_0_0_var(--shadow)]">
          <ul className="contents" aria-label="Etiketler">
            {tags.map((t, i) => (
              <li key={t} className={cx('inline-flex items-center gap-1 rounded-brut border-[3px] border-line py-0.5 pr-1 pl-2.5 font-bold', `fill-${fills[i % fills.length]}`)}>
                {t}
                <button type="button" onClick={() => remove(t)} className="grid size-6 place-items-center" aria-label={`${t} etiketini kaldır`}>
                  <IconX size={14} strokeWidth={3} />
                </button>
              </li>
            ))}
          </ul>
          <input id="etiket-gir" ref={input} value={v} onChange={(e) => setV(e.target.value)} onKeyDown={key} placeholder={tags.length >= 8 ? 'Dolu' : 'yaz, Enter'} className="min-w-[8ch] flex-1 bg-transparent px-1 font-medium outline-none placeholder:text-muted" aria-describedby="etiket-ipucu" />
        </div>
        <p id="etiket-ipucu" className="mt-1.5 text-[14px] text-muted">
          Enter ya da virgül ekler, boşken Backspace sonuncuyu siler. En fazla 8.
        </p>
      </div>
    </BrutalistCard>
  )
}

function MarqueeLab() {
  const [speed, setSpeed] = useState<Speed>('normal')
  const [rev, setRev] = useState(false)
  const [fill, setFill] = useState<'green' | 'blue' | 'red'>('green')
  return (
    <BrutalistCard fill="yellow" className="md:col-span-7 md:-mt-8 md:self-start">
      <h3 className="headline" lang="en">
        Marquee
      </h3>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <Chips<Speed> legend="Hız" name="mq-hiz" value={speed} onChange={setSpeed} options={[{ id: 'yavas', ad: 'Yavaş' }, { id: 'normal', ad: 'Normal' }, { id: 'hizli', ad: 'Hızlı' }]} fill="pink" />
        <Chips legend="Yön" name="mq-yon" value={rev ? 'sag' : 'sol'} onChange={(v) => setRev(v === 'sag')} options={[{ id: 'sol', ad: 'Sola' }, { id: 'sag', ad: 'Sağa' }]} fill="pink" />
        <Chips<'green' | 'blue' | 'red'> legend="Renk" name="mq-renk" value={fill} onChange={setFill} options={[{ id: 'green', ad: 'Yeşil' }, { id: 'blue', ad: 'Mavi' }, { id: 'red', ad: 'Kırmızı' }]} fill="pink" />
      </div>
      <div className="-mx-5 -mr-7 mt-6 overflow-x-clip">
        <Marquee label="Örnek şerit" items={['Yeni sezon', 'Ücretsiz kargo', '48 saatte kapında', 'İade yok, pişmanlık yok']} speed={speed} reverse={rev} fill={fill} />
      </div>
      <p className="mt-4 font-medium">Hız px/sn olarak sabit: {speed === 'yavas' ? 50 : speed === 'normal' ? 110 : 220}. Üstüne gelince ya da odakta durur.</p>
    </BrutalistCard>
  )
}

function FormLab() {
  const { toast } = useBrut()
  const [mail, setMail] = useState('')
  const [err, setErr] = useState<string | undefined>()
  const [kvkk, setKvkk] = useState(false)
  const [bulten, setBulten] = useState(true)
  const [plan, setPlan] = useState<'aylik' | 'yillik'>('yillik')
  const [adet, setAdet] = useState(3)
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail)) {
      setErr('Geçerli bir e-posta yazın')
      ;(e.currentTarget as HTMLFormElement).querySelector('input')?.focus()
      return
    }
    if (!kvkk) {
      setErr(undefined)
      toast('Önce koşulları onaylayın', 'red')
      return
    }
    setErr(undefined)
    toast(`Kayıt tamam: ${mail}`, 'green')
  }
  return (
    <BrutalistCard className="md:col-span-7">
      <h3 className="headline">Form</h3>
      <form className="mt-6 grid gap-6 lg:grid-cols-2" onSubmit={submit} noValidate>
        <div className="space-y-5">
          <Field label="E-posta" type="email" autoComplete="email" placeholder="sen@ornek.com" value={mail} onChange={(e) => setMail(e.target.value)} error={err} hint="Bültende haftada bir e-posta." />
          <div>
            <label htmlFor="adet" className="mb-1.5 flex justify-between font-bold">
              <span>Adet</span>
              <span className="font-display font-black">{adet}</span>
            </label>
            <input id="adet" type="range" min={1} max={10} value={adet} onChange={(e) => setAdet(+e.target.value)} className="h-3 w-full cursor-pointer appearance-none rounded-brut border-[3px] border-line bg-surface accent-[var(--ink)] [&::-webkit-slider-thumb]:size-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-brut [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-[var(--line)] [&::-webkit-slider-thumb]:bg-[var(--yellow)]" />
          </div>
          <div>
            <label htmlFor="sehir" className="mb-1.5 block font-bold">
              Şehir
            </label>
            <select id="sehir" className="field snap w-full cursor-pointer">
              <option>İstanbul</option>
              <option>Ankara</option>
              <option>İzmir</option>
              <option>Diyarbakır</option>
            </select>
          </div>
        </div>
        <div className="space-y-5">
          <Chips legend="Plan" name="plan" value={plan} onChange={setPlan} options={[{ id: 'aylik', ad: 'Aylık' }, { id: 'yillik', ad: 'Yıllık · %20' }]} />
          <Switch label="Bülten" hint="Kapatabilirsiniz." checked={bulten} onChange={setBulten} />
          <Check label="Koşulları okudum" checked={kvkk} onChange={setKvkk} />
          <SolidButton type="submit" fill="green" icon={<IconArrow size={20} strokeWidth={3} />}>
            Kayıt ol
          </SolidButton>
        </div>
      </form>
    </BrutalistCard>
  )
}

function ToastLab() {
  const { toast } = useBrut()
  const list: [Tone, string, string][] = [
    ['yellow', 'Bilgi', 'Kopyalandı'],
    ['green', 'Başarı', 'Kaydedildi'],
    ['red', 'Hata', 'Bağlantı koptu'],
    ['blue', 'Not', 'Yeni sürüm var'],
  ]
  return (
    <BrutalistCard fill="blue" className="md:col-span-5 md:mt-10 md:self-start">
      <h3 className="headline">Bildirim</h3>
      <p className="mt-2 font-medium">Sol altta damga gibi belirir (3 karelik sekme), 3,2 sn kalır, ekran okuyucuya da duyurulur.</p>
      <div className="mt-6 grid grid-cols-2 gap-3">
        {list.map(([t, ad, msg]) => (
          <SolidButton key={t} size="s" fill={t === 'blue' ? 'white' : t} onClick={() => toast(msg, t)}>
            {ad}
          </SolidButton>
        ))}
      </div>
    </BrutalistCard>
  )
}

export function Components() {
  return (
    <Section id="bilesenler" n="11" kicker="Madde 11 · 14 · Bileşenler" title="Bas, çök, kay" lead="<SolidButton>, <BrutalistCard>, <Marquee> ve büyük etiketler. Hepsi aynı üç kuralı paylaşır: kalın çerçeve, sert gölge, düz renk.">
      <div className="grid gap-8 md:grid-cols-12 md:gap-10">
        <ButtonLab />
        <Cards />
        <TagLab />
        <MarqueeLab />
        <FormLab />
        <ToastLab />
      </div>
    </Section>
  )
}
