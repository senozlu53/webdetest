import { useState } from 'react'
import { useBrut } from '../../lib/store'
import { SolidButton } from '../../components/SolidButton'
import { Tag } from '../../components/Tag'
import { IconMinus, IconPlus, IconStar } from '../../components/Icons'
import { num } from '../../lib/data'
import { cx } from '../../../shared/cx'

const SUPPLY = 5000

/** Web3 tanıtımı: topluluk rozeti basma kartı. Cüzdan ve zincir yok; her şey tarayıcıda, kurgu */
export function Web3() {
  const { toast, announce } = useBrut()
  const [minted, setMinted] = useState(3412)
  const [qty, setQty] = useState(1)
  const [wallet, setWallet] = useState(false)
  const left = SUPPLY - minted
  const blocks = 20
  const filled = Math.round((minted / SUPPLY) * blocks)
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center">
      <div className="relative mx-auto grid aspect-square w-full max-w-[380px] place-items-center rounded-full border-[3px] border-line fill-blue brut-shadow-lg" aria-hidden="true">
        <IconStar className="size-[62%] -rotate-12 text-black" fill="#fff000" strokeWidth={1.2} />
        <span className="absolute bottom-[18%] rotate-[-4deg] border-[3px] border-black bg-white px-3 py-1 font-display text-[22px] font-black text-black uppercase [font-stretch:125%]">#016</span>
      </div>
      <div className="rounded-brut border-[3px] border-line bg-surface p-5 brut-shadow">
        <div className="flex flex-wrap items-center gap-2">
          <Tag fill="green" size="s">
            Basım açık
          </Tag>
          <Tag fill="surface" size="s">
            Tanıtım · zincir yok
          </Tag>
        </div>
        <h3 className="mt-3 font-display text-[clamp(30px,4vw,48px)] leading-[0.9] font-black uppercase [font-stretch:120%]">Brüt Rozet</h3>
        <p className="mt-2 font-medium text-muted">Topluluk üyelik rozeti. Kişi başı en fazla 5.</p>
        <div className="mt-5">
          <p className="flex justify-between font-bold">
            <span>Basılan</span>
            <span className="font-display font-black">
              {num(minted)} / {num(SUPPLY)}
            </span>
          </p>
          <div className="mt-2 flex gap-1" role="progressbar" aria-label="Basılan rozet" aria-valuemin={0} aria-valuemax={SUPPLY} aria-valuenow={minted} aria-valuetext={`${num(minted)} / ${num(SUPPLY)}`}>
            {Array.from({ length: blocks }, (_, i) => (
              <span key={i} className={cx('h-6 flex-1 border-[3px] border-line', i < filled ? 'fill-yellow' : 'bg-bg')} />
            ))}
          </div>
          <p className="mt-1.5 text-[14px] font-bold text-muted">{num(left)} kaldı</p>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center" role="group" aria-label="Adet">
            <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} className="grid size-12 place-items-center border-[3px] border-line bg-surface disabled:opacity-40" aria-label="Azalt">
              <IconMinus size={18} strokeWidth={3} />
            </button>
            <output className="grid h-12 w-14 place-items-center border-y-[3px] border-line font-display text-[22px] font-black" aria-live="polite">
              {qty}
            </output>
            <button type="button" onClick={() => setQty((q) => Math.min(5, q + 1))} disabled={qty >= 5} className="grid size-12 place-items-center border-[3px] border-line bg-surface disabled:opacity-40" aria-label="Artır">
              <IconPlus size={18} strokeWidth={3} />
            </button>
          </div>
          {wallet ? (
            <SolidButton
              fill="yellow"
              onClick={() => {
                setMinted((m) => Math.min(SUPPLY, m + qty))
                toast(`${qty} rozet basıldı (tanıtım)`, 'green')
              }}
            >
              {qty} rozet bas
            </SolidButton>
          ) : (
            <SolidButton
              fill="ink"
              onClick={() => {
                setWallet(true)
                announce('Tanıtım cüzdanı bağlandı')
              }}
            >
              Cüzdanı bağla
            </SolidButton>
          )}
        </div>
        {wallet ? (
          <p className="mt-4 flex flex-wrap items-center gap-2 font-mono text-[13px] font-bold">
            <span className="inline-block size-3 border-[3px] border-line fill-green" aria-hidden="true" /> Bağlı: 0x7a3c…f21c (tanıtım)
            <button type="button" onClick={() => setWallet(false)} className="underline decoration-[3px] underline-offset-4">
              Ayır
            </button>
          </p>
        ) : null}
      </div>
    </div>
  )
}
