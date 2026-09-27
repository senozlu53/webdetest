import { useId, useState, type FormEvent } from 'react'
import { PlusIcon, XIcon } from '@phosphor-icons/react'
import { IsoBlock, IsoGround, IsoScene, IsoShadow } from '../components/IsoScene'
import { Button, Panel, SectionHead } from '../components/ui'
import { depth, type Box } from '../lib/iso'
import type { Hue } from '../lib/palette'
import { useProjection } from '../lib/projection'

const TIERS: ReadonlyArray<{ id: Hue; label: string }> = [
  { id: 'blue', label: 'Web' },
  { id: 'emerald', label: 'API' },
  { id: 'amber', label: 'Kuyruk' },
  { id: 'violet', label: 'Veri' },
]

type Node = { name: string; hue: Hue }

const SLOTS: Array<[number, number]> = [
  [0.4, 0.4],
  [1.9, 0.4],
  [3.4, 0.4],
  [0.4, 1.9],
  [1.9, 1.9],
  [3.4, 1.9],
  [0.4, 3.4],
  [1.9, 3.4],
  [3.4, 3.4],
]

const ROWS: ReadonlyArray<[string, string, string]> = [
  ['Metin · zemin', '17,06', '17,19'],
  ['İkincil metin · zemin', '7,24', '7,34'],
  ['Vurgu · zemin', '6,41', '7,41'],
  ['Form kenarı · yüzey (3:1)', '4,76', '3,73'],
  ['Üst yüz etiketi · mürekkep', '6,56+', '6,56+'],
  ['Sağ yüz etiketi · beyaz', '5,02+', '5,02+'],
]

export function Access() {
  const { tilt } = useProjection()
  const [nodes, setNodes] = useState<Node[]>([
    { name: 'web-1', hue: 'blue' },
    { name: 'api-1', hue: 'emerald' },
    { name: 'db-1', hue: 'violet' },
  ])
  const [name, setName] = useState('')
  const [tier, setTier] = useState<Hue>('blue')
  const [error, setError] = useState<string | null>(null)
  const nameId = useId()
  const tierId = useId()
  const errId = useId()

  function add(e: FormEvent) {
    e.preventDefault()
    const n = name.trim()
    if (!n) return setError('Bir ad yazın.')
    if (nodes.some((x) => x.name === n)) return setError('Bu ad zaten var.')
    if (nodes.length >= SLOTS.length) return setError('Plaka dolu: en fazla 9 sunucu.')
    setNodes((ns) => [...ns, { name: n, hue: tier }])
    setName('')
    setError(null)
  }

  const boxes = nodes
    .map((n, i) => ({ n, i, box: { x: SLOTS[i][0], y: SLOTS[i][1], w: 1.1, d: 1.1, h: 0.6 + ((n.name.length * 7) % 5) * 0.25 } as Box }))
    .sort((a, b) => depth(a.box) - depth(b.box))

  return (
    <section id="erisilebilirlik" className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="18"
          label="Erişilebilirlik ve varyantlar"
          title="İllüstrasyon izometrik, arayüz düz"
          lede="Eğilmiş bir alana yazmak, eğik bir düğmeyi hedeflemek zordur; ekran büyüteci ve imleç düz çalışır. İzometri yalnızca illüstrasyon, arka plan ve veri görselinde kalır."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <Panel className="flex flex-col gap-4 p-6">
            <p className="flex items-center gap-2 font-semibold">
              <span className="grid size-6 place-items-center rounded-full bg-[#BE123C] text-white">
                <XIcon size={14} weight="bold" aria-hidden="true" />
              </span>
              Yapmayın: izometrik form
            </p>
            {/* Yalnızca görsel örnek: etkileşime kapalı */}
            <div className="grid min-h-56 place-items-center overflow-hidden rounded-md border border-line bg-bg" aria-hidden="true" inert>
              <div style={{ transform: `rotateX(${tilt}deg) rotateZ(-45deg)` }} className="flex w-56 flex-col gap-2 rounded-md border border-line bg-surface p-3 shadow-[8px_8px_0_var(--shadow)]">
                <span className="text-[13px] font-semibold">Sunucu adı</span>
                <span className="field flex items-center text-[14px] text-muted">web-4</span>
                <span className="inline-flex min-h-10 items-center justify-center rounded-md bg-accent text-[14px] font-semibold text-bg">Ekle</span>
              </div>
            </div>
            <p className="text-[15px] text-muted">Metin yamuk okunur, tıklama alanı eşkenar dörtgene döner, odak halkası eğilir. Büyüteç ve imleç düz ekrana göre çalışır.</p>
          </Panel>

          <Panel className="flex flex-col gap-4 p-6">
            <p className="flex items-center gap-2 font-semibold">
              <span className="grid size-6 place-items-center rounded-full bg-[#047857] text-white">
                <PlusIcon size={14} weight="bold" aria-hidden="true" />
              </span>
              Yapın: düz form, izometrik görsel
            </p>
            <form onSubmit={add} className="flex flex-wrap items-end gap-3" noValidate>
              <div className="flex min-w-40 flex-1 flex-col gap-1">
                <label htmlFor={nameId} className="text-[14px] font-semibold">
                  Sunucu adı
                </label>
                <input
                  id={nameId}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="field"
                  placeholder="örn. web-4"
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? errId : undefined}
                  autoComplete="off"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor={tierId} className="text-[14px] font-semibold">
                  Katman
                </label>
                <select id={tierId} value={tier} onChange={(e) => setTier(e.target.value as Hue)} className="field">
                  {TIERS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <Button type="submit" variant="primary" icon={<PlusIcon size={16} weight="bold" aria-hidden="true" />}>
                Ekle
              </Button>
            </form>
            <p id={errId} role="alert" className="min-h-6 text-[14px] font-semibold" style={{ color: 'var(--st-crit)' }}>
              {error}
            </p>
            <div className="mx-auto w-full max-w-[380px]">
              <IsoScene unit={40} extent={[5, 5, 2]} pad={8} label={`Plakada ${nodes.length} sunucu: ${nodes.map((n) => n.name).join(', ')}.`}>
                {(P) => (
                  <>
                    <IsoBlock P={P} box={{ x: 0, y: 0, w: 5, d: 5, h: 0.001 }} hue="slate" build={false} />
                    <IsoGround P={P} size={[5, 5]} step={0.5} stroke="var(--grid-line)" />
                    {boxes.map(({ n, box }) => (
                      <IsoShadow key={`s-${n.name}`} P={P} box={box} build={false} length={0.45} />
                    ))}
                    {boxes.map(({ n, i, box }) => (
                      <IsoBlock key={n.name} P={P} box={box} hue={n.hue} i={0} build={i >= 3 ? 'down' : false} topLabel={n.name.slice(0, 6)} />
                    ))}
                  </>
                )}
              </IsoScene>
            </div>
            <p aria-live="polite" className="sr-only">
              {nodes.length} sunucu: {nodes.map((n) => n.name).join(', ')}
            </p>
          </Panel>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <Panel className="overflow-hidden">
            <table className="w-full text-left text-[14px]">
              <caption className="px-5 pt-4 pb-2 text-left text-lg font-bold">Kontrast</caption>
              <thead className="text-muted">
                <tr>
                  <th className="px-5 py-2 font-semibold">Çift</th>
                  <th className="px-5 py-2 text-right font-semibold">Açık</th>
                  <th className="px-5 py-2 text-right font-semibold">Koyu</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map(([p, l, d]) => (
                  <tr key={p} className="border-t border-line">
                    <td className="px-5 py-2.5">{p}</td>
                    <td className="px-5 py-2.5 text-right font-mono font-semibold whitespace-nowrap">{l}:1</td>
                    <td className="px-5 py-2.5 text-right font-mono font-semibold whitespace-nowrap">{d}:1</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
          <Panel className="p-5">
            <h3 className="text-lg font-bold">Kurallar</h3>
            <ul className="mt-3 flex flex-col gap-3 text-[15px]">
              <li>
                <strong className="font-semibold">Form öğeleri düz:</strong> <span className="text-muted">giriş, seçim ve düğmeler hiçbir zaman dönüşüm almaz; hedefler en az 44px.</span>
              </li>
              <li>
                <strong className="font-semibold">Görsel = özet + tablo:</strong>{' '}
                <span className="text-muted">her izometrik sahnenin kısa bir açıklaması, veri taşıyanların düz bir tablosu var; renk tek başına anlam taşımaz.</span>
              </li>
              <li>
                <strong className="font-semibold">Yüzde kısa etiket:</strong> <span className="text-muted">yalnızca üst ve sağ yüzde, kurala uygun renkle.</span>
              </li>
              <li>
                <strong className="font-semibold">Hareket:</strong> <span className="text-muted">hareketi azalt açıksa bloklar yerinde gelir, sütunlar hazır çizilir.</span>
              </li>
              <li>
                <strong className="font-semibold">Koyu tema:</strong>{' '}
                <span className="text-muted">zemin gece mavisi, ızgara sönük; blok tonları aynı kalır, çünkü derinlik tonlar arası farktan gelir.</span>
              </li>
            </ul>
          </Panel>
        </div>
      </div>
    </section>
  )
}
