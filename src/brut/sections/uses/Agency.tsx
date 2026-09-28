import { useState, type FormEvent } from 'react'
import { useBrut } from '../../lib/store'
import { SolidButton } from '../../components/SolidButton'
import { Chips, Field } from '../../components/ui'
import { IconArrowUpRight, IconMinus, IconPlus } from '../../components/Icons'
import { cx } from '../../../shared/cx'

const WORKS = [
  { n: '01', ad: 'Kırmızı Fabrika', tur: 'Marka kimliği', yil: 2025, renk: 'fill-red', blok: ['fill-red', 'fill-yellow', 'bg-surface'], metin: 'Bir tekstil atölyesi için sert, tek renkli kimlik: logo, etiket sistemi ve 3px kontur ikon seti.' },
  { n: '02', ad: 'Mavi Terminal', tur: 'Ürün arayüzü', yil: 2025, renk: 'fill-blue', blok: ['fill-blue', 'fill-ink', 'fill-green'], metin: 'Geliştiriciler için dağıtım paneli; her durum rozet, her eylem kalın buton.' },
  { n: '03', ad: 'Yeşil Pazar', tur: 'E-ticaret', yil: 2024, renk: 'fill-green', blok: ['fill-green', 'fill-pink', 'fill-yellow'], metin: 'Gen-Z için ikinci el mağaza: kayan fiyat şeritleri ve çıkartma gibi etiketler.' },
  { n: '04', ad: 'Pembe Fanzin', tur: 'Editoryal site', yil: 2024, renk: 'fill-pink', blok: ['fill-pink', 'bg-surface', 'fill-blue'], metin: 'Haftalık dijital fanzin; 180px başlıklar, mobilde 48px.' },
]

export function Agency() {
  const { toast } = useBrut()
  const [open, setOpen] = useState<string | null>('01')
  const [ad, setAd] = useState('')
  const [mail, setMail] = useState('')
  const [butce, setButce] = useState<'k' | 'o' | 'b'>('o')
  const [errs, setErrs] = useState<{ ad?: string; mail?: string }>({})
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const n: typeof errs = {}
    if (ad.trim().length < 2) n.ad = 'Adınızı yazın'
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail)) n.mail = 'Geçerli bir e-posta yazın'
    setErrs(n)
    if (n.ad || n.mail) {
      e.currentTarget.querySelector<HTMLInputElement>('[aria-invalid="true"]')?.focus()
      return
    }
    toast(`Teşekkürler ${ad.trim()}, 24 saat içinde yazıyoruz`, 'green')
  }
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <ul className="border-t-[3px] border-line">
        {WORKS.map((w) => {
          const on = open === w.n
          return (
            <li key={w.n} className="border-b-[3px] border-line">
              <h3>
                <button type="button" aria-expanded={on} aria-controls={`is-${w.n}`} onClick={() => setOpen(on ? null : w.n)} className={cx('snap group flex w-full items-center gap-4 px-2 py-4 text-left', on ? w.renk : 'hover:translate-x-2')}>
                  <span className="font-display text-[clamp(28px,4vw,52px)] leading-none font-black [font-stretch:125%]">{w.n}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-[clamp(20px,2.6vw,34px)] leading-none font-black uppercase [font-stretch:110%]">{w.ad}</span>
                    <span className="mt-1 block font-bold">
                      {w.tur} · {w.yil}
                    </span>
                  </span>
                  <span className="grid size-11 shrink-0 place-items-center rounded-brut border-[3px] border-line bg-surface text-ink">{on ? <IconMinus size={18} /> : <IconPlus size={18} />}</span>
                </button>
              </h3>
              <div id={`is-${w.n}`} hidden={!on} className="px-2 pb-6">
                <div className="grid grid-cols-3 gap-3" aria-hidden="true">
                  {w.blok.map((b, i) => (
                    <span key={i} className={cx('h-24 rounded-brut border-[3px] border-line', b, i === 1 && 'translate-y-3')} />
                  ))}
                </div>
                <p className="mt-6 max-w-[52ch] font-medium">{w.metin}</p>
                <a href="#kullanim" className="mt-3 inline-flex items-center gap-1 font-bold underline decoration-[3px] underline-offset-4">
                  Vakayı oku <IconArrowUpRight size={18} />
                </a>
              </div>
            </li>
          )
        })}
      </ul>
      <form onSubmit={submit} noValidate className="h-fit rounded-brut border-[3px] border-line fill-yellow p-5 brut-shadow-lg" aria-labelledby="teklif">
        <h3 id="teklif" className="font-display text-[34px] leading-[0.9] font-black uppercase [font-stretch:120%]">
          Birlikte bir şey kıralım
        </h3>
        <div className="mt-6 space-y-5 text-black">
          <Field label="Ad" autoComplete="name" value={ad} onChange={(e) => setAd(e.target.value)} error={errs.ad} />
          <Field label="E-posta" type="email" autoComplete="email" value={mail} onChange={(e) => setMail(e.target.value)} error={errs.mail} />
          <Chips legend="Bütçe" name="butce" value={butce} onChange={setButce} fill="pink" options={[{ id: 'k', ad: 'Küçük' }, { id: 'o', ad: 'Orta' }, { id: 'b', ad: 'Büyük' }]} />
          <SolidButton type="submit" fill="ink">
            Gönder
          </SolidButton>
        </div>
      </form>
    </div>
  )
}
