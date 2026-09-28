import { useEffect, useRef, useState } from 'react'
import { useBrut } from '../../lib/store'
import { SolidButton } from '../../components/SolidButton'
import { Tag } from '../../components/Tag'
import { Chips } from '../../components/ui'
import { IconCopy, IconEye, IconEyeOff, IconRocket, IconTerminal } from '../../components/Icons'
import { cx } from '../../../shared/cx'

const STAGES = ['Derle', 'Test', 'Yükle'] as const
const BLOCKS = 10
type Key = { id: string; ad: string; key: string; etkin: boolean }

/** Geliştirici aracı: dağıtım paneli. İlerleme blok blok dolar (Madde 16: yumuşak değil, adım adım) */
function Deploy() {
  const { announce, toast } = useBrut()
  const [branch, setBranch] = useState<'main' | 'dev'>('main')
  const [prog, setProg] = useState<number[]>([0, 0, 0])
  const [run, setRun] = useState<'hazir' | 'calisiyor' | 'yayinda'>('hazir')
  const [log, setLog] = useState<string[]>([])
  const t = useRef(0)
  useEffect(() => () => window.clearInterval(t.current), [])
  const start = () => {
    setRun('calisiyor')
    setProg([0, 0, 0])
    setLog([`$ brut deploy --branch ${branch}`])
    announce(`Yayın başladı: ${branch}`)
    let i = 0
    t.current = window.setInterval(() => {
      i++
      const stage = Math.floor((i - 1) / BLOCKS)
      if (stage >= STAGES.length) {
        window.clearInterval(t.current)
        setRun('yayinda')
        setLog((l) => [...l, '[ok] yayında: https://brut-api.ornek.dev'])
        toast('Yayında: brut-api', 'green')
        return
      }
      const n = ((i - 1) % BLOCKS) + 1
      setProg((p) => p.map((v, k) => (k === stage ? n : v)))
      if (n === BLOCKS) {
        setLog((l) => [...l, `[ok] ${STAGES[stage].toLocaleLowerCase('tr')} ${[1.8, 4.2, 0.9][stage].toString().replace('.', ',')} sn`])
        announce(`${STAGES[stage]} tamam`)
      }
    }, 90)
  }
  return (
    <div className="rounded-brut border-[3px] border-line bg-surface p-5 brut-shadow">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 font-display text-[24px] font-black uppercase [font-stretch:115%]">
          <IconTerminal size={24} /> brut-api
        </h3>
        <Tag fill={run === 'yayinda' ? 'green' : run === 'calisiyor' ? 'yellow' : 'surface'} size="s">
          {run === 'yayinda' ? 'Yayında' : run === 'calisiyor' ? 'Çalışıyor' : 'Hazır'}
        </Tag>
      </div>
      <div className="mt-4">
        <Chips legend="Dal" name="dal" value={branch} onChange={setBranch} options={[{ id: 'main', ad: 'main' }, { id: 'dev', ad: 'dev' }]} fill="blue" />
      </div>
      <ol className="mt-5 space-y-3" aria-label="Aşamalar">
        {STAGES.map((s, k) => (
          <li key={s} className="grid grid-cols-[64px_minmax(0,1fr)_48px] items-center gap-3">
            <span className="font-bold">{s}</span>
            <span className="flex gap-1" role="progressbar" aria-label={s} aria-valuemin={0} aria-valuemax={100} aria-valuenow={prog[k] * 10}>
              {Array.from({ length: BLOCKS }, (_, b) => (
                <span key={b} className={cx('h-5 flex-1 border-[3px] border-line', b < prog[k] ? 'fill-green' : 'bg-bg')} />
              ))}
            </span>
            <span className="text-right font-mono text-[13px] font-bold">%{prog[k] * 10}</span>
          </li>
        ))}
      </ol>
      <pre className="scroll-x mt-5 min-h-[112px] rounded-brut border-[3px] border-line fill-ink p-3 font-mono text-[12px] leading-relaxed" tabIndex={0} aria-label="Dağıtım günlüğü">
        <code>{log.join('\n') || '$ _'}</code>
      </pre>
      <SolidButton className="mt-5" fill="green" icon={<IconRocket size={20} />} onClick={start} disabled={run === 'calisiyor'}>
        {run === 'yayinda' ? 'Yeniden yayınla' : 'Yayınla'}
      </SolidButton>
    </div>
  )
}

function Keys() {
  const { toast, announce } = useBrut()
  const [keys, setKeys] = useState<Key[]>([
    { id: 'k1', ad: 'Üretim', key: 'sk_brut_live_8f2a91c04e7b4f2a', etkin: true },
    { id: 'k2', ad: 'Test', key: 'sk_brut_test_31d0aa9e62c85b17', etkin: true },
    { id: 'k3', ad: 'Eski CI', key: 'sk_brut_live_0b77e4d2f19a33c6', etkin: false },
  ])
  const [shown, setShown] = useState<string | null>(null)
  const mask = (k: string) => `${k.slice(0, 13)}••••${k.slice(-4)}`
  return (
    <div className="rounded-brut border-[3px] border-line fill-pink p-5 brut-shadow">
      <h3 className="font-display text-[24px] font-black uppercase [font-stretch:115%]">API anahtarları</h3>
      <div className="scroll-x mt-4 rounded-brut border-[3px] border-black bg-white text-black" role="region" tabIndex={0} aria-label="API anahtarları tablosu, yatay kaydırılabilir">
        <table className="w-full min-w-[520px] text-left">
          <caption className="sr-only">Anahtarlar, durumları ve eylemler</caption>
          <thead>
            <tr className="border-b-[3px] border-black">
              {['Ad', 'Anahtar', 'Durum', 'Eylem'].map((h) => (
                <th key={h} scope="col" className="px-3 py-2 text-[13px] font-bold uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {keys.map((k) => (
              <tr key={k.id} className="border-b-[3px] border-black last:border-0">
                <th scope="row" className="px-3 py-2 font-bold">
                  {k.ad}
                </th>
                <td className="px-3 py-2 font-mono text-[13px]">{shown === k.id ? k.key : mask(k.key)}</td>
                <td className="px-3 py-2">
                  <span className={cx('inline-block border-[3px] border-black px-2 text-[13px] font-bold', k.etkin ? 'bg-[#00c16a]' : 'bg-[#ff4d3d]')}>{k.etkin ? 'Etkin' : 'İptal'}</span>
                </td>
                <td className="px-3 py-2">
                  <span className="flex gap-1.5">
                    <button type="button" onClick={() => setShown(shown === k.id ? null : k.id)} className="grid size-9 place-items-center border-[3px] border-black bg-white" aria-label={`${k.ad} anahtarını ${shown === k.id ? 'gizle' : 'göster'}`} aria-pressed={shown === k.id}>
                      {shown === k.id ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(k.key)
                          toast(`${k.ad} anahtarı kopyalandı`, 'yellow')
                        } catch {
                          announce('Kopyalanamadı', 'assertive')
                        }
                      }}
                      className="grid size-9 place-items-center border-[3px] border-black bg-white"
                      aria-label={`${k.ad} anahtarını kopyala`}
                    >
                      <IconCopy size={16} />
                    </button>
                    {k.etkin ? (
                      <button
                        type="button"
                        onClick={() => {
                          setKeys((ks) => ks.map((x) => (x.id === k.id ? { ...x, etkin: false } : x)))
                          toast(`${k.ad} anahtarı iptal edildi`, 'red')
                        }}
                        className="border-[3px] border-black bg-white px-2 text-[13px] font-bold"
                      >
                        İptal et
                      </button>
                    ) : null}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function Dev() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Deploy />
      <Keys />
    </div>
  )
}
