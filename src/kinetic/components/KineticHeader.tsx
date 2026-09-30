import { motion, useScroll, useTransform } from 'motion/react'
import { useRef, type ElementType } from 'react'
import { cx } from '../../shared/cx'
import { useKayma } from '../lib/kayma'
import { useKinetic } from '../lib/store'
import { Dev, type Efekt } from './Harfler'

export interface SatirTanim {
  metin: string
  efekt?: Efekt[]
  /** yalnız çizgi (dolgusuz) */
  kontur?: boolean
  /** vurgu rengi */
  vurgu?: boolean
  boy?: string
}

function Satir({ s, ters, ilerleme, uz }: { s: SatirTanim; ters: boolean; uz: number; ilerleme: ReturnType<typeof useScroll>['scrollYProgress'] }) {
  const { yumusak } = useKayma()
  const { hareket, tam } = useKinetic()
  const d = ters ? -1 : 1
  const x = useTransform(ilerleme, [0, 1], ['0%', `${d * -16}%`])
  const skewX = useTransform(yumusak, [-3000, 0, 3000], [14 * d, 0, -14 * d])
  const scaleX = useTransform(yumusak, [-3000, 0, 3000], [1.12, 1, 1.12])
  const aktif = hareket && tam
  return (
    <motion.span className="block" style={aktif ? { x, skewX, scaleX, transformOrigin: '0% 50%' } : undefined} data-satir={ters ? 'ters' : 'duz'}>
      <Dev metin={s.metin} efekt={s.efekt} uz={uz} boy={s.boy ?? 'clamp(48px, 15vw, 260px)'} className={cx(s.kontur && 'kontur', s.vurgu && 'vurgu')} ad="baslik" />
    </motion.span>
  )
}

/**
 * <KineticHeader>: dev başlık. Satırlar kaydırma hızıyla eğilir ve esner, kaydırma ilerledikçe zıt yönlere kayar;
 * harfler dalgalanır ve imlece yaklaştıkça ağırlaşır. Hareket kapalıyken satırlar durağan ve tam okunur.
 */
export function KineticHeader({ satirlar, as: Tag = 'h1', className }: { satirlar: SatirTanim[]; as?: ElementType; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const T = Tag as 'h1'
  // bütün satırlar aynı boyda: en uzun kelime kapsayıcıya sığar
  const uz = Math.max(...satirlar.flatMap((s) => s.metin.split(' ').map((k) => [...k].length)))
  return (
    <T ref={ref} className={cx('m-0 block', className)} data-kinetic-header="">
      {satirlar.map((s, i) => (
        <span key={i} className="block">
          <Satir s={s} ters={i % 2 === 1} ilerleme={scrollYProgress} uz={uz} />
          {i < satirlar.length - 1 ? ' ' : null}
        </span>
      ))}
    </T>
  )
}
