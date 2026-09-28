import { useMemo, useState } from 'react'
import { cx } from '../../shared/cx'
import { useMemphis } from '../lib/store'
import { kontrast, oran } from '../lib/contrast'
import { PHI, ALTIN_ACI, sarmal, uretec } from '../lib/rastgele'
import type { Sekil as SekilTur, Ton } from '../lib/data'
import { MemphisCard } from '../components/MemphisCard'
import { PopButton } from '../components/PopButton'
import { DOLGU, Sekil } from '../components/Shapes'
import { UiIkon } from '../components/Icons'
import { Aralik, Anahtar, Section } from '../components/ui'

const RENKLER: { ton: Ton; ad: string; token: string; hex: string; rol: string }[] = [
  { ton: 'sari', ad: 'Hardal Sarısı', token: 'Color/MemphisYellow', hex: '#FFD166', rol: 'Ana dolgu, düğme, vurgu bloğu' },
  { ton: 'camgobegi', ad: 'Cam Göbeği', token: 'Color/MemphisTeal', hex: '#06D6A0', rol: 'İkincil dolgu, başarı, seçim' },
  { ton: 'pembe', ad: 'Sakız Pembesi', token: 'Color/MemphisPink', hex: '#EF476F', rol: 'Çağrı, etkinlik, dikkat' },
  { ton: 'lacivert', ad: 'Siyah', token: 'Color/MemphisInk', hex: '#073B4C', rol: 'Kontur, gölge, bütün metin' },
]
const ZEMINLER: [string, string][] = [
  ['Beyaz', '#FFFFFF'],
  ['Hardal', '#FFD166'],
  ['Cam göbeği', '#06D6A0'],
  ['Pembe', '#EF476F'],
  ['Lacivert', '#073B4C'],
]
const YAZILAR: [string, string][] = [
  ['Lacivert', '#073B4C'],
  ['Saf siyah', '#000000'],
  ['Beyaz', '#FFFFFF'],
]

/** Madde 4 · 18: dört renk ve her zemin için hangi yazı rengi */
export function Palet() {
  return (
    <Section id="palet" madde="Madde 4 · Renk paleti" title="Dört renk," vurgu="bir kural" ton="sari" lead="Hardal, cam göbeği, sakız pembesi ve neredeyse siyah bir lacivert. Renkler yüzeyleri doldurur; yazı her zemin için en yüksek kontrastlı çifti alır. Pembe tek istisna: lacivert orada yetmez, saf siyah kullanılır.">
      <ul className="m-0 grid list-none grid-cols-1 gap-8 p-0 sm:grid-cols-2 lg:grid-cols-4">
        {RENKLER.map((r) => (
          <MemphisCard as="li" key={r.ton} kimlik={`renk-${r.ton}`} ton={r.ton} className="rounded-[18px] p-5">
            <p className="dev text-[clamp(22px,2.4vw,30px)] max-lg:text-[30px]">{r.ad}</p>
            <p className="mt-2 font-mono text-[15px] font-bold">{r.hex}</p>
            <p className="mt-3 font-bold">{r.rol}</p>
            <p className="mt-3 inline-block rounded-full border-[3px] border-current px-3 py-0.5 font-mono text-[12.5px]">{r.token}</p>
          </MemphisCard>
        ))}
      </ul>
      <div className="relative mt-12 overflow-x-auto rounded-[18px] border-[4px] border-ink shadow-[8px_8px_0_var(--shadow)]" tabIndex={0} role="region" aria-label="Kontrast tablosu, yatay kayar">
        <table className="w-full min-w-[620px] border-collapse bg-paper" data-kontrast-tablo="">
          <caption className="border-b-[4px] border-ink p-4 text-left">
            <span className="dev text-[26px]">Hangi zeminde hangi yazı?</span>
            <span className="mt-1 block text-[15px] text-muted">WCAG oranı. Kalın çerçeveli hücre o zeminde kullanılan yazı rengi.</span>
          </caption>
          <thead>
            <tr>
              <th scope="col" className="p-3 text-left">
                Zemin
              </th>
              {YAZILAR.map(([a]) => (
                <th key={a} scope="col" className="p-3 text-left">
                  {a} yazı
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ZEMINLER.map(([z, zh]) => {
              const oranlar = YAZILAR.map(([, y]) => kontrast(y, zh))
              // Kullanılan: lacivert 4,5'i geçiyorsa lacivert; geçmiyorsa en yüksek
              const sec = oranlar[0] >= 4.5 ? 0 : oranlar.indexOf(Math.max(...oranlar))
              return (
                <tr key={z} className="border-t-[3px] border-ink">
                  <th scope="row" className="p-3 text-left">
                    <span className="inline-flex items-center gap-2">
                      <span className="size-6 rounded-full border-[3px] border-ink" style={{ background: zh }} aria-hidden="true" />
                      {z}
                    </span>
                  </th>
                  {YAZILAR.map(([a, y], i) => {
                    const k = oranlar[i]
                    return (
                      <td key={a} className="p-2">
                        <span className={cx('flex items-center justify-between gap-2 rounded-[10px] px-3 py-2 font-bold', i === sec ? 'border-[4px] border-ink' : 'border-[3px] border-transparent')} style={{ background: zh, color: y }}>
                          <span className="tabular-nums">{oran(k)}</span>
                          <span className="flex items-center gap-1 text-[13px]">
                            {k >= 4.5 ? <UiIkon ad="tik" boyut={16} /> : <UiIkon ad="kapat" boyut={16} />}
                            {k >= 7 ? 'AAA' : k >= 4.5 ? 'AA' : 'Yetmez'}
                            {i === sec ? <span className="sr-only">, kullanılan</span> : null}
                          </span>
                        </span>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Section>
  )
}

/** Madde 5: dev, siyah, kalın başlık; altın oranlı boy ölçeği */
export function Tipografi() {
  const [agirlik, setAgirlik] = useState(800)
  const olcek = [0, 1, 2, 3, 4].map((n) => Math.round(18 * PHI ** n))
  return (
    <Section id="yazi" madde="Madde 5 · Tipografi" title="Kalın. Siyah." vurgu="Dev." ton="pembe" sekil="kare" lead="Başlıklar Syne ExtraBold: geniş, köşeli, biraz tuhaf. Gövde Epilogue: sakin ve okunur. Boylar altın oranla büyür: her basamak bir öncekinin 1,618 katı.">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.618fr_1fr]">
        <MemphisCard kimlik="yazi-1" ton="beyaz" aci={1.5} oyuncak={false} className="min-w-0 rounded-[18px] p-6 md:p-8">
          <p className="kicker text-muted">Başlık · Syne {agirlik}</p>
          <p className="mt-3 font-display text-[clamp(56px,9vw,120px)] leading-[0.85] tracking-[-0.04em] break-words" style={{ fontWeight: agirlik }}>
            Şişli Ğ İzmir
          </p>
          <p className="mt-6 font-display text-[28px] leading-tight" style={{ fontWeight: agirlik }}>
            Pijamalı hasta yağız şoföre çabucak güvendi.
          </p>
          <div className="mt-6 max-w-[360px]">
            <Aralik label="Ağırlık" value={agirlik} min={400} max={800} step={100} onChange={setAgirlik} format={(v) => `${v}${v === 800 ? ' · ExtraBold' : ''}`} />
          </div>
        </MemphisCard>
        <MemphisCard kimlik="yazi-2" ton="camgobegi" aci={2.5} oyuncak={false} className="min-w-0 self-start rounded-[4px] p-6">
          <p className="kicker">Gövde · Epilogue 400–800</p>
          <p className="mt-3 text-[19px] leading-relaxed">Uzun metin renkli blok üstünde bile düz zeminde durur; noktalı desen metnin arkasına girmez. Satır 60 karakter civarında kalır.</p>
          <p className="mt-4 text-[15px]">
            <span className="font-extrabold">Neden bu ikisi?</span> İkisi de ğ, ş, ı, İ taşıyan değişken yazı tipleri; ₺ ve ok glifleri yok, bu yüzden tutarlar "TL" ile yazılır, oklar çizimdir.
          </p>
        </MemphisCard>
      </div>
      <ol className="m-0 mt-12 grid list-none gap-4 p-0" aria-label="Altın oranlı boy ölçeği">
        {olcek.map((px, i) => (
          <li key={px} className="flex min-w-0 items-baseline gap-5 border-b-[3px] border-dashed border-ink pb-3">
            <span className="w-40 shrink-0 font-mono text-[14px] whitespace-nowrap tabular-nums max-sm:w-28 max-sm:whitespace-normal">
              {px}px · {i}. basamak
            </span>
            <span className="dev min-w-0 truncate" style={{ fontSize: `min(${px}px, 16vw)` }}>
              Konfeti
            </span>
          </li>
        ))}
      </ol>
    </Section>
  )
}

const TURLER: SekilTur[] = ['daire', 'ucgen', 'zikzak', 'silindir', 'kare', 'dalga', 'yarim', 'arti']
const TONLAR: Ton[] = ['sari', 'camgobegi', 'pembe']
export const SEKIL_AD: Record<SekilTur, string> = { daire: 'Daire', ucgen: 'Üçgen', zikzak: 'Zikzak', silindir: 'Silindir', kare: 'Kare', dalga: 'Dalga', yarim: 'Yarım daire', arti: 'Artı' }

/** Madde 6: kaos gibi görünen ama altın açıyla dağılan kompozisyon */
export function SekilDili() {
  const s = useMemphis()
  const [adet, setAdet] = useState(13)
  const [izgara, setIzgara] = useState(true)
  const W = 610
  const H = Math.round(W / PHI) // 377
  const parcalar = useMemo(() => {
    const r = uretec(s.tohum)
    const bas = r() * 360
    return sarmal(adet, H * 0.55, bas).map((p, i) => ({
      ...p,
      x: W / 2 + p.x * PHI * 0.95,
      y: H / 2 + p.y,
      tur: TURLER[(i * 3 + Math.floor(r() * 8)) % TURLER.length],
      ton: TONLAR[(i + Math.floor(r() * 3)) % 3],
      // Boylar altın oran dizisinden: 26, 42, 68
      boy: [26, 42, 68][Math.floor(r() * 3)] * (i === 0 ? PHI : 1),
      aci: Math.round((r() - 0.5) * 60),
    }))
  }, [adet, s.tohum, H])
  // Altın dikdörtgen bölmeleri: her adımda kare kesilir, kalan dikdörtgen yine 1 : 1,618
  const kareler = useMemo(() => {
    const l: { x: number; y: number; w: number }[] = []
    let x = 0,
      y = 0,
      w = W,
      h = H
    for (let i = 0; i < 7; i++) {
      const k = Math.min(w, h)
      const yon = i % 4
      if (yon === 0) {
        l.push({ x, y, w: k })
        x += k
        w -= k
      } else if (yon === 1) {
        l.push({ x, y, w: k })
        y += k
        h -= k
      } else if (yon === 2) {
        l.push({ x: x + w - k, y, w: k })
        w -= k
      } else {
        l.push({ x, y: y + h - k, w: k })
        h -= k
      }
    }
    return l
  }, [H])
  return (
    <Section id="sekil" madde="Madde 6 · Şekil dili" title="Kaos gibi," vurgu="ölçülü" ton="camgobegi" sekil="ucgen" lead="Şekiller rastgele atılmış gibi durur ama her biri bir öncekinden 137,5° döner (altın açı) ve merkezden karekökle uzaklaşır: ayçiçeği tohumlarının dizilişi. Tuval 1 : 1,618, şekil boyları 26 · 42 · 68.">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.618fr_1fr]">
        <div className="min-w-0 overflow-hidden rounded-[18px] border-[4px] border-ink bg-paper shadow-[8px_8px_0_var(--shadow)]">
          <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label={`${adet} şekilli kompozisyon, altın açıyla dağıtılmış`} data-kompozisyon="">
            {izgara ? (
              <g aria-hidden="true">
                {kareler.map((k, i) => (
                  <rect key={i} x={k.x} y={k.y} width={k.w} height={k.w} fill="none" stroke="var(--t-pink)" strokeWidth={2} strokeDasharray="6 5" />
                ))}
              </g>
            ) : null}
            {parcalar.map((p) => (
              <foreignObject key={p.i} x={p.x - p.boy / 2} y={p.y - p.boy / 2} width={p.boy} height={p.boy} overflow="visible">
                <Sekil tur={p.tur} ton={p.ton} boyut={p.boy} golge style={{ rotate: `${p.aci}deg` }} />
              </foreignObject>
            ))}
          </svg>
        </div>
        <MemphisCard kimlik="sekil-kontrol" ton="beyaz" aci={1.5} oyuncak={false} className="grid min-w-0 grid-cols-1 content-start gap-6 rounded-[18px] p-6">
          <Aralik label="Şekil sayısı (Fibonacci)" value={[5, 8, 13, 21, 34].indexOf(adet)} min={0} max={4} onChange={(v) => setAdet([5, 8, 13, 21, 34][v])} format={() => String(adet)} />
          <Anahtar label="Altın dikdörtgen ızgarası" hint="Kesikli pembe kareler: her biri bir öncekinden 1,618 kat küçük." checked={izgara} onChange={setIzgara} />
          <PopButton ton="sari" onClick={s.karistir} ikon={<UiIkon ad="karistir" />} konfeti>
            Karıştır
          </PopButton>
          <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-mono text-[14px]">
            <dt>Altın oran</dt>
            <dd className="m-0">{PHI.toFixed(4).replace('.', ',')}</dd>
            <dt>Altın açı</dt>
            <dd className="m-0">{ALTIN_ACI.toFixed(2).replace('.', ',')}°</dd>
            <dt>Tohum</dt>
            <dd className="m-0" data-tohum="">
              {s.tohum}
            </dd>
          </dl>
          <div className="flex flex-wrap items-end gap-3" aria-label="Primitifler" role="group">
            {TURLER.map((t, i) => (
              <Sekil key={t} tur={t} ton={TONLAR[i % 3]} boyut={36} title={SEKIL_AD[t]} />
            ))}
          </div>
        </MemphisCard>
      </div>
    </Section>
  )
}

/** Madde 7: katı ve keskin gölge */
export function Golge() {
  const [k, setK] = useState(8)
  const [renk, setRenk] = useState<Ton | 'lacivert'>('lacivert')
  const renkler: (Ton | 'lacivert')[] = ['lacivert', 'pembe', 'camgobegi', 'sari']
  const c = renk === 'lacivert' ? 'var(--shadow)' : DOLGU[renk as Ton]
  return (
    <Section id="golge" madde="Madde 7 · Z-ekseni ve gölge" title="Gölge de" vurgu="bir blok" ton="pembe" sekil="silindir" lead="Bulanıklık sıfır, yayılma sıfır. Gölge nesnenin kopyasıdır, sağ alta kayar; lacivert ya da renkli olur. Katmanlar üst üste bindikçe gölgeler de merdiven gibi dizilir.">
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
        <div className="grid min-w-0 grid-cols-1 gap-8">
          <div className="grid min-h-[220px] place-items-center rounded-[18px] border-[4px] border-dashed border-ink p-8">
            <div className="rounded-[18px] border-[4px] border-ink bg-yellow px-8 py-6 text-center" style={{ boxShadow: `${k}px ${k}px 0 0 ${c}` }} data-golge-ornek="">
              <p className="dev text-[36px]">{k}px</p>
              <p className="font-mono text-[14px] font-bold">
                {k}px {k}px 0 0
              </p>
            </div>
          </div>
          <Aralik label="Kayma" value={k} min={0} max={16} onChange={setK} format={(v) => `${v}px`} />
          <div className="flex flex-wrap gap-2" role="group" aria-label="Gölge rengi">
            {renkler.map((r) => (
              <button key={r} type="button" aria-pressed={renk === r} onClick={() => setRenk(r)} className={cx('inline-flex min-h-11 items-center gap-2 rounded-full border-[3px] border-ink bg-paper px-4 font-bold', renk === r && 'shadow-[3px_3px_0_var(--shadow)]')}>
                <span className="size-5 rounded-full border-[3px] border-ink" style={{ background: r === 'lacivert' ? 'var(--ink)' : DOLGU[r as Ton] }} aria-hidden="true" />
                {r === 'lacivert' ? 'Lacivert' : r === 'pembe' ? 'Pembe' : r === 'camgobegi' ? 'Cam göbeği' : 'Hardal'}
                {renk === r ? <UiIkon ad="tik" boyut={16} /> : null}
              </button>
            ))}
          </div>
        </div>
        <ul className="m-0 grid list-none grid-cols-1 gap-10 p-0 sm:grid-cols-2">
          <li className="rounded-[18px] border-[4px] border-ink bg-paper p-5 shadow-[6px_6px_0_var(--pink),12px_12px_0_var(--ink)]">
            <p className="dev text-[22px]">Çift gölge</p>
            <p className="mt-2 text-[15px]">Pembe, sonra lacivert: iki katman, sıfır bulanıklık.</p>
          </li>
          <li className="rounded-full border-[4px] border-ink bg-teal p-5 text-center shadow-[-8px_8px_0_var(--ink)]">
            <p className="dev text-[22px]">Sola düşen</p>
            <p className="mt-2 text-[15px]">Yön değişebilir, bulanıklık değişmez.</p>
          </li>
          <li className="rounded-[4px] border-[4px] border-ink bg-paper p-5 shadow-[0_10px_0_var(--yellow)]">
            <p className="dev text-[22px]">Dikey</p>
            <p className="mt-2 text-[15px]">Hap düğmelerin basma hissi buradan gelir.</p>
          </li>
          <li className="rounded-[18px] border-[4px] border-dashed border-t-pink bg-paper p-5 shadow-[0_12px_28px_rgb(0_0_0/0.25)]" aria-describedby="yasak-not">
            <p className="dev text-[22px] text-t-pink">Yasak</p>
            <p id="yasak-not" className="mt-2 text-[15px]">
              Bulanık, yarı saydam gölge bu stilde kullanılmaz.
            </p>
          </li>
        </ul>
      </div>
    </Section>
  )
}
