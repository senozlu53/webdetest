import { useRef, useState, type DragEvent, type KeyboardEvent } from 'react'
import { NADIRLIK, TIP_AD, type Esya } from '../lib/data'
import { useOyun } from '../lib/oyun'
import { useFantasy } from '../lib/store'
import { Ikon } from './Ikon'
import { Panel } from './Suslu'
import { Buton } from './ui'

/**
 * <InventoryGrid>: ızgara envanter. Yuva sayısı sabit, sütun sayısı kapsayıcıya göre kendiliğinden azalır (yuva boyu ≥ 44 px).
 * Klavye: ok tuşları, Home, End; Enter bir eşyayı "taşıma" moduna alır, ikinci Enter bırakır (yer değiştirir); Esc iptal.
 * Fare: sürükle-bırak. Seçili yuva `aria-selected`.
 */
export function InventoryGrid({ yuvalar, secili, onSec, onTasi, etiket = 'Envanter' }: { yuvalar: (Esya | null)[]; secili: number | null; onSec: (i: number) => void; onTasi: (a: number, b: number) => void; etiket?: string }) {
  const { duyur } = useFantasy()
  const liste = useRef<HTMLUListElement>(null)
  const [tasinan, setTasinan] = useState<number | null>(null)
  const [surukle, setSurukle] = useState<number | null>(null)
  const [uzerinde, setUzerinde] = useState<number | null>(null)
  const odak = secili ?? 0

  const sutunSay = () => Math.max(1, liste.current ? getComputedStyle(liste.current).gridTemplateColumns.split(' ').length : 6)
  const git = (i: number) => {
    const n = yuvalar.length
    const h = Math.max(0, Math.min(n - 1, i))
    onSec(h)
    liste.current?.querySelector<HTMLElement>(`[data-yuva="${h}"]`)?.focus()
  }
  const tus = (e: KeyboardEvent, i: number) => {
    const s = sutunSay()
    if (e.key === 'ArrowRight') git(i + 1)
    else if (e.key === 'ArrowLeft') git(i - 1)
    else if (e.key === 'ArrowDown') git(i + s)
    else if (e.key === 'ArrowUp') git(i - s)
    else if (e.key === 'Home') git(0)
    else if (e.key === 'End') git(yuvalar.length - 1)
    else if (e.key === 'Enter' || e.key === ' ') {
      if (tasinan === null) {
        if (yuvalar[i]) {
          setTasinan(i)
          duyur(`${yuvalar[i]!.ad} alındı. Ok tuşlarıyla yuva seçin, Enter ile bırakın.`)
        } else onSec(i)
      } else {
        onTasi(tasinan, i)
        setTasinan(null)
      }
    } else if (e.key === 'Escape') {
      if (tasinan !== null) {
        setTasinan(null)
        duyur('Taşıma iptal edildi')
      }
      return
    } else return
    e.preventDefault()
  }
  const birak = (e: DragEvent, i: number) => {
    e.preventDefault()
    if (surukle !== null) onTasi(surukle, i)
    setSurukle(null)
    setUzerinde(null)
  }
  return (
    <ul ref={liste} role="listbox" aria-label={`${etiket}, ${yuvalar.length} yuva`} aria-orientation="horizontal" className="envanter" data-envanter="" data-tasima={tasinan !== null ? tasinan : undefined}>
      {yuvalar.map((e, i) => {
        const ad = e ? `Yuva ${i + 1}: ${e.ad}, ${NADIRLIK[e.nadirlik].ad}, ${e.adet} adet` : `Yuva ${i + 1}: boş`
        return (
          <li
            key={i}
            role="option"
            aria-selected={secili === i}
            aria-label={ad + (tasinan === i ? ', taşınıyor' : '')}
            tabIndex={odak === i ? 0 : -1}
            data-yuva={i}
            data-dolu={e ? '' : undefined}
            data-nadirlik={e?.nadirlik}
            data-tasinan={tasinan === i ? '' : undefined}
            data-uzerinde={uzerinde === i && surukle !== null && surukle !== i ? '' : undefined}
            className="slot"
            draggable={!!e}
            onClick={() => {
              if (tasinan !== null) {
                onTasi(tasinan, i)
                setTasinan(null)
              } else onSec(i)
            }}
            onKeyDown={(ev) => tus(ev, i)}
            onDragStart={(ev) => {
              setSurukle(i)
              onSec(i)
              ev.dataTransfer.effectAllowed = 'move'
              ev.dataTransfer.setData('text/plain', String(i))
            }}
            onDragOver={(ev) => {
              ev.preventDefault()
              setUzerinde(i)
            }}
            onDragLeave={() => setUzerinde(null)}
            onDrop={(ev) => birak(ev, i)}
            onDragEnd={() => {
              setSurukle(null)
              setUzerinde(null)
            }}
          >
            {e ? (
              <>
                <Ikon ad={e.ikon} boy="72%" className="slot-ikon" />
                {e.adet > 1 ? <span className="slot-adet rakam">{e.adet}</span> : null}
              </>
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}

/** Seçili eşyanın künyesi: ad (nadirlik renginde), istatistikler, Kullan / Sat / Bırak */
export function EsyaKunye({ i, esya }: { i: number | null; esya: Esya | null }) {
  const { kullan, birak, sat } = useOyun()
  if (!esya || i === null) {
    return (
      <Panel yuzey="parsomen" suslu={false} className="p-5" data-kunye="">
        <p className="t-etiket t-soluk">Künye</p>
        <p className="mt-2 text-[1.125rem]">Bir yuva seçin.</p>
      </Panel>
    )
  }
  const n = NADIRLIK[esya.nadirlik]
  return (
    <Panel yuzey="parsomen" suslu={false} className="p-5" data-kunye={esya.id} aria-live="polite">
      <div className="flex items-start gap-4">
        <span className="slot-buyuk" data-nadirlik={esya.nadirlik}>
          <Ikon ad={esya.ikon} boy={56} />
        </span>
        <div className="min-w-0">
          <p className="t-etiket t-soluk">
            {TIP_AD[esya.tip]} ·{' '}
            <span data-nadirlik-ad={esya.nadirlik} className="nadirlik-yazi" style={{ ['--nr' as string]: n.renk }}>
              <span className="nadirlik-nokta" aria-hidden="true" />
              {n.ad}
            </span>
          </p>
          <h4 className="t-h3 mt-1 break-words" data-kunye-ad="">
            {esya.ad}
          </h4>
        </div>
      </div>
      <p className="mt-3 text-[1.0625rem]">{esya.aciklama}</p>
      <ul className="mt-3 grid gap-1" data-kunye-istatistik="">
        {esya.istatistik.map((s) => (
          <li key={s} className="t-alt">
            <span className="stat-elmas" aria-hidden="true" />
            {s}
          </li>
        ))}
      </ul>
      <p className="rakam t-alt mt-3">
        {esya.adet} adet · değer {esya.deger.toLocaleString('tr-TR')} altın
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {esya.etki ? (
          <Buton ton="altin" onClick={() => kullan(i)} data-kullan="">
            Kullan
          </Buton>
        ) : null}
        <Buton onClick={() => sat(i)} data-sat="">
          Sat
        </Buton>
        <Buton ton="yalin" onClick={() => birak(i)} data-birak="">
          Bırak
        </Buton>
      </div>
    </Panel>
  )
}
