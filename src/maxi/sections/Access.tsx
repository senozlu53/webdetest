import { useEffect, useState } from 'react'
import { BADGES } from '../lib/data'
import { useMaxi } from '../lib/store'
import { useMedia } from '../hooks/useMedia'
import { Section } from '../components/ui'
import { SettingsPanel } from '../components/Header'
import { cx } from '../../shared/cx'

const OK: [string, string, string, string][] = [
  ['Mürekkep · krem zemin', '#111014', '#FFF3E3', '17,31'],
  ['Krem · gece zemini', '#FFF7EE', '#0B0A0F', '18,59'],
  ['Mürekkep · limon', '#111014', '#C8FF00', '16,03'],
  ['Mürekkep · pembe', '#111014', '#FF2E93', '5,47'],
  ['Mürekkep · turuncu', '#111014', '#FF6A00', '6,60'],
  ['Krem · elektrik mavi', '#FFF7EE', '#2F3CFF', '6,16'],
  ['Krem · mor', '#FFF7EE', '#8A2BFF', '5,11'],
  ['Pembe · gece zemini', '#FF2E93', '#0B0A0F', '5,70'],
  ['İkincil metin · krem', '#3D3846', '#FFF3E3', '10,35'],
]
const BAD: [string, string, string, string][] = [
  ['Pembe · turuncu', '#FF2E93', '#FF6A00', '1,21'],
  ['Limon · tereyağı', '#C8FF00', '#FFE680', '1,05'],
  ['Mavi · mor', '#2F3CFF', '#8A2BFF', '1,21'],
  ['Kontur yazı · zemin', 'çizgi', 'değişken', '–'],
]

function Pairs({ rows, caption, bad }: { rows: [string, string, string, string][]; caption: string; bad?: boolean }) {
  return (
    <div className="scroll-x rounded-[22px] border-4 border-[#111014] bg-white text-[#111014]" tabIndex={0} role="region" aria-label={`${caption}, yatay kaydırılabilir`}>
      <table className="w-full min-w-[460px] text-left">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b-4 border-[#111014]">
            {['Çift', 'Örnek', 'Oran', 'Kullanım'].map((h) => (
              <th key={h} scope="col" className="kicker px-3 py-2">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([ad, fg, bg, k]) => (
            <tr key={ad} className="border-b-2 border-[#111014]/20 last:border-0">
              <th scope="row" className="px-3 py-2 font-bold">
                {ad}
              </th>
              <td className="px-3 py-2">
                {fg.startsWith('#') ? (
                  <span className="inline-block rounded-lg border-2 border-[#111014] px-2 font-sans font-black uppercase" style={{ color: fg, background: bg }} aria-hidden="true">
                    Aa
                  </span>
                ) : (
                  <span className="font-sans font-black text-transparent uppercase [-webkit-text-stroke:1.5px_#111014]" aria-hidden="true">
                    Aa
                  </span>
                )}
              </td>
              <td className="px-3 py-2 font-mono text-[13px] font-bold">{k === '–' ? k : `${k}:1`}</td>
              <td className={cx('px-3 py-2 text-[14px] font-bold', bad ? 'text-[#b3004f]' : '')}>{bad ? 'yalnız süs, kasıtlı ihlal' : 'okunur metin, AA'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Sayfada görünen (display: none olmayan) öğeleri sayar; ayar değişince bir kare sonra yeniden sayar */
function useVisibleCount(selector: string, key: string) {
  const [n, setN] = useState(0)
  useEffect(() => {
    const id = requestAnimationFrame(() => setN([...document.querySelectorAll(selector)].filter((el) => el.getClientRects().length > 0).length))
    return () => cancelAnimationFrame(id)
  }, [selector, key])
  return n
}

const MAX = 36

/** Madde 18: bilişsel yükü en yüksek stil. Kural yalnız süs katmanında çiğnenir; kaçış yolu her zaman var */
export function Access() {
  const s = useMaxi()
  const desktop = useMedia('(min-width: 768px)')
  const fine = useMedia('(pointer: fine)')
  const calm = s.kaos === 'sakin'
  const badges = desktop && !calm ? BADGES.slice(0, s.vars.rozet).filter((b) => !s.collected.includes(b.id)).length : 0
  const key = `${s.kaos}-${s.motion}-${desktop}`
  const fx = useVisibleCount('.fx', key)
  const holo = useVisibleCount('.holo', key)
  const parts: [string, number][] = [
    ['Uçan rozet', s.motion ? badges : 0],
    ['İmleç takipçisi', s.motion && fine && !calm ? 1 : 0],
    ['3D nesne', s.motion && !calm ? 4 : 0],
    ['Paralaks şekil', s.motion && !calm ? fx : 0],
    ['Holografik folyo', s.motion && !calm ? holo : 0],
    ['Gren titreşimi', s.motion && s.vars.gren > 0 ? 1 : 0],
  ]
  const total = parts.reduce((a, [, n]) => a + n, 0)
  const level = total === 0 ? 'Durgun' : total < 12 ? 'Orta' : total < 22 ? 'Yüksek' : 'Aşırı'
  return (
    <Section
      id="erisim"
      tone="bg-paper text-ink"
      kicker="Madde 18 · Erişilebilirlik ve varyantlar"
      title={
        <>
          En <span className="font-serif italic">gürültülü</span> stil, <span className="font-mono text-[0.6em]">en çok</span> <span className="uppercase [font-stretch:150%]">özen</span>
        </>
      }
      lead="Maksimalizm bilişsel yükü en yüksek stildir ve kontrast kuralları kasıtlı olarak çiğnenebilir. Burada çiğneme yalnız süs katmanında: okunacak her metin ve her düğme AA'yı geçer, bütün hareket tek düğmeyle durur, sakin mod kalabalığı kaldırır."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="rounded-[30px] border-4 border-[#111014] bg-[#111014] p-5 text-[#fff7ee] shadow-[8px_9px_0_var(--orange)] lg:col-span-5">
          <h3 className="font-sans text-[26px] leading-none font-black uppercase [font-stretch:140%]">Bilişsel yük</h3>
          <p className="mt-3 font-serif text-[64px] leading-none font-black italic" data-load={total}>
            <span className="wonk">{total}</span> <span className="inline-block font-mono text-[18px] not-italic">hareketli öğe · {level}</span>
          </p>
          <div className="mt-4 flex gap-1" role="meter" aria-label="Aynı anda hareket eden öğe" aria-valuemin={0} aria-valuemax={MAX} aria-valuenow={Math.min(total, MAX)} aria-valuetext={`${total} öğe, ${level}`}>
            {Array.from({ length: MAX }, (_, i) => (
              <span key={i} className={cx('h-6 flex-1 rounded-sm', i < total ? (i < 11 ? 'bg-lime' : i < 21 ? 'bg-orange' : 'bg-pink') : 'bg-[#fff7ee]/15')} />
            ))}
          </div>
          <ul className="mt-4 grid grid-cols-1 gap-x-4 gap-y-1 font-mono text-[12px] font-bold min-[420px]:grid-cols-2">
            {parts.map(([k, n]) => (
              <li key={k}>
                {k}: {n}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[14px] leading-snug font-semibold text-[#cfc6d9]">Sayaç sayfadaki öğeleri canlı sayar. Eşikler: 0 durgun · 1–11 orta · 12–21 yüksek · 22 ve üstü aşırı. Bu stil bilerek aşırıda durur; kaçış yolu bir tık uzakta.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" onClick={() => s.setKaos('sakin')} disabled={calm} className="min-h-11 rounded-full border-[3px] border-[#fff7ee] bg-lime px-4 font-bold text-[#111014] disabled:opacity-50">
              Sakin moda geç
            </button>
            <button type="button" onClick={() => s.setMotionPref(s.motion ? 'kapali' : 'acik')} className="min-h-11 rounded-full border-[3px] border-[#fff7ee] px-4 font-bold hover:bg-[#fff7ee] hover:text-[#111014]">
              {s.motion ? 'Bütün hareketi durdur' : 'Hareketi başlat'}
            </button>
          </div>
        </div>
        <div className="rounded-[30px] border-4 border-[#111014] bg-butter p-5 text-[#111014] shadow-[8px_9px_0_#111014] lg:col-span-7">
          <h3 className="font-hand text-[40px] leading-none font-bold">Varyantlar</h3>
          <div className="mt-4 [--line:#111014] [--paper:#ffffff] [--ink:#111014]">
            <SettingsPanel prefix="v-" />
          </div>
          <ul className="mt-5 space-y-2 text-[15px] font-semibold">
            <li>Sakin: dönme 0, üst üste binme 0, gren 0; uçan rozet, imleç takipçisi ve süs kalabalığı yok; 3D, paralaks ve folyo durur.</li>
            <li>Hareketi azalt tercihi otomatik olarak bütün hareketi kapatır; başlıktaki düğme her an durdurur.</li>
            <li>Gece: siyah zemin, neon ve krem metin. Kurallar aynı.</li>
          </ul>
        </div>
        <div className="lg:col-span-7">
          <h3 className="mb-3 font-sans text-[24px] leading-none font-black uppercase [font-stretch:140%]">Okunur metin: hepsi AA</h3>
          <Pairs rows={OK} caption="Okunur metin çiftleri" />
        </div>
        <div className="lg:col-span-5">
          <h3 className="mb-3 font-serif text-[28px] leading-none font-black italic">
            <span className="wonk">Süs: bilerek kırık</span>
          </h3>
          <Pairs rows={BAD} caption="Süs çiftleri, kasıtlı ihlal" bad />
          <p className="mt-3 text-[15px] font-semibold">Bu çiftler yalnız aria-hidden süs yazılarda ve çıkartmalarda; bilgi taşımaz.</p>
        </div>
        <div className="rounded-[30px] border-4 border-[#111014] bg-lilac p-5 text-[#111014] shadow-[8px_9px_0_#111014] lg:col-span-12">
          <h3 className="font-sans text-[24px] leading-none font-black uppercase [font-stretch:140%]">Klavye ve ekran okuyucu</h3>
          <ul className="mt-4 grid grid-cols-1 gap-2 font-semibold md:grid-cols-2">
            {[
              'İçeriğe geç ve galeriyi atla bağlantıları var; sonsuz galeri kendi alanında kayar.',
              'Uçan rozetler odak alınca ve fare üstündeyken durur; her biri adı olan bir düğme.',
              'Galeride "daha fazla yükle" düğmesi ve yükleme duyurusu; büyük görünümde sol ve sağ ok tuşları.',
              'Odak halkası iki renkli: koyu iç, limon dış; her zeminde görünür.',
              'Kesik harfli ve karışık fontlu başlıklar ekran okuyucuya düz metin olarak okunur.',
              'Süs şekiller, dev kontur yazılar ve 3D tuval ekran okuyucudan gizli; 3D için metin açıklama var.',
            ].map((t) => (
              <li key={t} className="flex gap-2.5">
                <span className="mt-2 size-2.5 shrink-0 rounded-full bg-[#111014]" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
