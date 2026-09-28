import { useState } from 'react'
import { PRODUCTS, product, tl, type Product } from '../../lib/data'
import { useBrut } from '../../lib/store'
import { SolidButton } from '../../components/SolidButton'
import { Tag } from '../../components/Tag'
import { Chips } from '../../components/ui'
import { IconCart, IconMinus, IconPlus } from '../../components/Icons'
import { ProductArt } from './ProductArt'
import { cx } from '../../../shared/cx'

type Filter = 'tum' | 'giyim' | 'aksesuar' | 'indirim'
const KARGO_ESIK = 1000
const KARGO = 49

function Card({ p }: { p: Product }) {
  const { addToCart, toast } = useBrut()
  return (
    <li className="flex min-w-0 flex-col rounded-brut border-[3px] border-line bg-surface brut-shadow snap lift">
      <div className={cx('relative h-40 border-b-[3px] border-line p-4', `fill-${p.renk}`)}>
        <ProductArt shape={p.shape} />
        {p.etiket ? (
          <Tag size="s" fill={p.eski ? 'red' : 'ink'} tilt={-4} className="absolute top-3 left-3">
            {p.etiket}
          </Tag>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-[22px] leading-none font-black uppercase [font-stretch:110%]">{p.ad}</h3>
        <p className="mt-2 flex items-baseline gap-2 font-display font-black">
          <span className="text-[26px]">{tl(p.fiyat)}</span>
          {p.eski ? (
            <span className="text-[18px] text-muted line-through decoration-2">
              <span className="sr-only">Eski fiyat: </span>
              {tl(p.eski)}
            </span>
          ) : null}
        </p>
        <SolidButton
          size="s"
          fill="yellow"
          className="mt-4 self-start"
          icon={<IconCart size={18} />}
          onClick={() => {
            addToCart(p.id)
            toast(`Sepete eklendi: ${p.ad}`, 'green')
          }}
        >
          Sepete ekle
        </SolidButton>
      </div>
    </li>
  )
}

export function Shop() {
  const { cart, setQty, toast, cartCount } = useBrut()
  const [f, setF] = useState<Filter>('tum')
  const list = PRODUCTS.filter((p) => f === 'tum' || (f === 'indirim' ? !!p.eski : p.cat === f))
  const lines = Object.entries(cart).map(([id, q]) => ({ p: product(id), q }))
  const ara = lines.reduce((a, l) => a + l.p.fiyat * l.q, 0)
  const kargo = ara === 0 || ara >= KARGO_ESIK ? 0 : KARGO
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="min-w-0">
        <Chips<Filter>
          legend="Süzgeç"
          name="magaza-suzgec"
          value={f}
          onChange={setF}
          options={[
            { id: 'tum', ad: 'Tümü' },
            { id: 'giyim', ad: 'Giyim' },
            { id: 'aksesuar', ad: 'Aksesuar' },
            { id: 'indirim', ad: 'İndirimde' },
          ]}
        />
        <ul className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3" aria-label={`Ürünler: ${list.length}`}>
          {list.map((p) => (
            <Card key={p.id} p={p} />
          ))}
        </ul>
      </div>
      <aside aria-labelledby="sepet-baslik" className="h-fit rounded-brut border-[3px] border-line fill-yellow p-5 brut-shadow-lg lg:sticky lg:top-28">
        <h3 id="sepet-baslik" className="flex items-center justify-between font-display text-[28px] leading-none font-black uppercase [font-stretch:120%]">
          Sepet <span className="rounded-brut border-[3px] border-black bg-white px-2 text-[18px] text-black">{cartCount}</span>
        </h3>
        {lines.length === 0 ? (
          <p className="mt-4 font-bold">Boş. Bir şey ekleyin, sayaç sekecek.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {lines.map(({ p, q }) => (
              <li key={p.id} className="flex items-center gap-3 rounded-brut border-[3px] border-black bg-white p-2 text-black">
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-bold">{p.ad}</span>
                  <span className="font-display text-[15px] font-black">{tl(p.fiyat * q)}</span>
                </span>
                <span className="flex items-center gap-1">
                  <button type="button" onClick={() => setQty(p.id, q - 1)} className="grid size-8 place-items-center border-[3px] border-black bg-white" aria-label={`${p.ad}: bir azalt`}>
                    <IconMinus size={14} strokeWidth={3} />
                  </button>
                  <span className="w-6 text-center font-display font-black" aria-label={`${q} adet`}>
                    {q}
                  </span>
                  <button type="button" onClick={() => setQty(p.id, q + 1)} className="grid size-8 place-items-center border-[3px] border-black bg-white" aria-label={`${p.ad}: bir artır`}>
                    <IconPlus size={14} strokeWidth={3} />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
        <dl className="mt-5 space-y-1 border-t-[3px] border-black pt-3 font-bold">
          <div className="flex justify-between">
            <dt>Ara toplam</dt>
            <dd className="font-display font-black">{tl(ara)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Kargo</dt>
            <dd className="font-display font-black">{kargo ? tl(kargo) : ara ? 'Ücretsiz' : '–'}</dd>
          </div>
          <div className="flex justify-between text-[22px]">
            <dt>Toplam</dt>
            <dd className="font-display font-black">{tl(ara + kargo)}</dd>
          </div>
        </dl>
        {ara > 0 && ara < KARGO_ESIK ? <p className="mt-2 text-[14px] font-bold">Kargonun bedava olmasına {tl(KARGO_ESIK - ara)} kaldı.</p> : null}
        <SolidButton fill="ink" className="mt-5 w-full" disabled={!lines.length} onClick={() => toast('Tanıtım: ödeme adımı yok', 'blue')}>
          Ödemeye geç
        </SolidButton>
      </aside>
    </div>
  )
}
