import { useState } from 'react'
import { cx } from '../../shared/cx'
import { useSynth } from '../lib/store'
import { kontrast, oran } from '../lib/contrast'
import { WireframeGrid } from '../components/WireframeGrid'
import { RetroCard } from '../components/RetroCard'
import { NeonButton } from '../components/NeonButton'
import { Ayarlar } from '../components/Header'
import { Ikon } from '../components/Icons'
import { NeonSlider, NeonSwitch, Section } from '../components/ui'

// Titreme keyframe'leriyle aynı zaman çizelgesi (5,2 sn): sönmeler %19,5 · %22 · %63
const TITREME = [
  [0, 1],
  [18, 1],
  [19.5, 0.45],
  [21, 1],
  [22, 0.75],
  [23, 1],
  [62, 1],
  [63, 0.45],
  [64.5, 1],
  [100, 1],
]

/** Madde 16: sonsuz akan ızgara ve titreyen neon başlık */
export function Hareket() {
  const s = useSynth()
  const [hiz, setHiz] = useState(0.9)
  const [titre, setTitre] = useState(true)
  const yol = TITREME.map(([t, o], i) => `${i ? 'L' : 'M'}${t * 4} ${60 - o * 50}`).join(' ')
  return (
    <Section id="hareket" madde="Madde 16 · Hareket dili" title="Hep" script="ileri" lead="Zemin ızgarası hiç durmadan izleyiciye doğru akar: arka plan bir hücre kayınca başa döner, dikiş görünmez. Başlıklar arızalı neon tabela gibi ara ara söner; sönmeler düzensiz ve saniyede ikiyi geçmez.">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="min-w-0 overflow-hidden rounded-[10px] border-2 border-line">
          <WireframeGrid className="h-[260px]" hiz={hiz} hucre={50} gunes={false} daglar={false} palmiye={false} ufuk={30} renk="cyan" />
        </div>
        <RetroCard className="grid min-w-0 grid-cols-1 content-start gap-5 p-6">
          <NeonSlider label="Bir hücre" value={hiz} min={0.3} max={3} step={0.1} onChange={setHiz} format={(v) => `${v.toFixed(1).replace('.', ',')} sn`} />
          <p className="text-[14px] text-muted">
            <code className="text-cyan">background-position</code> 0'dan hücre boyuna gider, <code className="text-cyan">linear infinite</code> ile tekrar eder. Hareket {s.hareket ? 'açık' : 'kapalı: ızgara durur'}.
          </p>
        </RetroCard>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="grid min-h-[200px] place-items-center rounded-[10px] border-2 border-line bg-[#0d0418] p-6">
          <p className={cx('neon-t text-center text-[clamp(40px,7vw,72px)] leading-none text-pink', titre && 'titre')} style={{ fontFamily: 'var(--font-neon)' }} data-titre-ornek="">
            MOTEL
          </p>
        </div>
        <RetroCard className="grid min-w-0 grid-cols-1 content-start gap-5 p-6">
          <NeonSwitch label="Titreme" checked={titre} onChange={setTitre} />
          <svg viewBox="0 0 400 70" className="block h-auto w-full rounded-[6px] bg-[#0d0418]" role="img" aria-label="Titreme zaman çizelgesi: 5,2 saniyede üç sönme, en yakın ikisi 0,13 saniye arayla">
            <path d={yol} fill="none" stroke="#ff00ff" strokeWidth="2.5" />
            {[0, 1, 2, 3, 4, 5].map((sn) => (
              <g key={sn}>
                <line x1={(sn / 5.2) * 400} x2={(sn / 5.2) * 400} y1={62} y2={70} stroke="#c7b4e8" />
                <text x={(sn / 5.2) * 400 + 3} y={69} fill="#c7b4e8" fontSize="9" fontFamily="var(--font-mono)">
                  {sn}s
                </text>
              </g>
            ))}
          </svg>
          <p className="text-[14px] text-muted">Parlaklık hiç sıfıra inmez (en az %45); WCAG 2.3.1'in saniyede üç parlama sınırının altında. Hareket kapalıysa tabela sabit yanar.</p>
        </RetroCard>
      </div>
    </Section>
  )
}

/** Madde 17: ızgara ve ufuk yalnız giriş alanında; aşağısı düz karanlık neon arayüz */
export function Mobil() {
  const Ekran = ({ genis }: { genis: boolean }) => (
    <div className={cx('overflow-hidden rounded-[14px] border-2 border-line bg-night', genis ? 'w-full' : 'mx-auto w-[210px]')} aria-hidden="true">
      <WireframeGrid className={genis ? 'h-[170px]' : 'h-[150px]'} hucre={genis ? 28 : 22} ufuk={genis ? 55 : 50} palmiye={false} daglar={genis} perspektif={140} />
      <div className="grid gap-2 p-3">
        <span className="block h-3 w-2/3 rounded-sm bg-pink/80" />
        <span className="block h-2 w-full rounded-sm bg-line" />
        <span className="block h-2 w-5/6 rounded-sm bg-line" />
        <div className={cx('mt-2 grid gap-2', genis ? 'grid-cols-3' : 'grid-cols-1')}>
          {[0, 1, 2].map((i) => (
            <span key={i} className="block h-10 rounded-[4px] border border-cyan" />
          ))}
        </div>
      </div>
    </div>
  )
  return (
    <Section id="mobil" madde="Madde 17 · Responsive" title="Ufuk" script="yalnız üstte" lead="Izgara ve ufuk çizgisi telefonda ekranın yarısını yer; bu yüzden yalnız giriş alanında durur. Telefonda daha kısa ve palmiyesiz; aşağıdaki bütün bölümler saf karanlık zeminde neon çerçeveli arayüzdür.">
      <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-[1.6fr_1fr]">
        <figure className="m-0">
          <Ekran genis />
          <figcaption className="mt-3 text-[14px] text-muted">Masaüstü: giriş 820px'e kadar, dağlar ve palmiye var.</figcaption>
        </figure>
        <figure className="m-0">
          <Ekran genis={false} />
          <figcaption className="mt-3 text-center text-[14px] text-muted">Telefon: giriş 640px, palmiye yok, kartlar tek sütun.</figcaption>
        </figure>
      </div>
    </Section>
  )
}

const CIFT: [string, string, string][] = [
  ['Gövde metni', '#F3E9FF', '#1A0B2E'],
  ['İkincil metin', '#C7B4E8', '#1A0B2E'],
  ['Neon pembe yazı', '#FF00FF', '#1A0B2E'],
  ['Cyan yazı', '#00FFFF', '#1A0B2E'],
  ['Turuncu yazı', '#FF8C00', '#1A0B2E'],
  ['Pembe düğme (dolu)', '#1A0B2E', '#FF00FF'],
  ['Kartta pembe', '#FF00FF', '#241042'],
]

/** Madde 18: yalnız karanlık; ince neon yazı yok */
export function Erisim() {
  return (
    <Section id="erisim" madde="Madde 18 · Erişilebilirlik" title="Yalnız" script="gece" lead="Synthwave'in ışığı karanlığa muhtaç: açık tema yok. Neon ince harfte dağılır; arayüzde yazı en az Medium (500), bileşenlerde Bold (700). Parlama azaltılabilir, VHS bozulmaları ve titreme kapatılabilir.">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.3fr]">
        <RetroCard className="min-w-0 p-6">
          <p className="chrome text-[32px]">Varyantlar</p>
          <div className="mt-5">
            <Ayarlar onek="er-" />
          </div>
        </RetroCard>
        <div className="grid min-w-0 grid-cols-1 content-start gap-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2" aria-hidden="true">
            <div className="rounded-[8px] border-2 border-dashed border-orange bg-[#0d0418] p-4">
              <p className="neon-t text-[22px] text-pink" style={{ fontWeight: 200 }}>
                Parça seç
              </p>
              <p className="mt-2 flex items-center gap-2 text-[13px] text-orange">
                <Ikon ad="kapat" boyut={16} /> 200: hale harfi yutar
              </p>
            </div>
            <div className="rounded-[8px] border-2 border-cyan bg-[#0d0418] p-4">
              <p className="neon-t text-[22px] text-pink" style={{ fontWeight: 700 }}>
                Parça seç
              </p>
              <p className="mt-2 flex items-center gap-2 text-[13px] text-cyan">
                <Ikon ad="yildiz" boyut={16} /> 700: hale harfi sarar
              </p>
            </div>
          </div>
          <div className="overflow-x-auto rounded-[8px] border-2 border-line" tabIndex={0} role="region" aria-label="Kontrast tablosu">
            <table className="w-full min-w-[420px] border-collapse bg-night-2 text-[14px]" data-kontrast="">
              <caption className="border-b-2 border-line p-3 text-left font-bold">Kontrast · WCAG</caption>
              <tbody>
                {CIFT.map(([a, y, z]) => {
                  const k = kontrast(y, z)
                  return (
                    <tr key={a} className="border-b border-line">
                      <th scope="row" className="p-2.5 text-left font-bold">
                        <span className="mr-3 inline-grid size-7 place-items-center rounded-[4px] align-middle font-bold" style={{ background: z, color: y, border: '1px solid #5b3a8c' }} aria-hidden="true">
                          A
                        </span>
                        {a}
                      </th>
                      <td className="p-2.5 text-right tabular-nums">{oran(k)}</td>
                      <td className="p-2.5 text-right font-bold">{k >= 7 ? 'AAA' : k >= 4.5 ? 'AA' : 'Yetmez'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <NeonButton renk="cyan" onClick={() => document.getElementById('ust')?.scrollIntoView()} ikon={<Ikon ad="geri" boyut={18} />}>
            Başa dön
          </NeonButton>
        </div>
      </div>
    </Section>
  )
}
