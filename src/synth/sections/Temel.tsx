import { useState } from 'react'
import { cx } from '../../shared/cx'
import { kontrast, oran } from '../lib/contrast'
import { RetroCard } from '../components/RetroCard'
import { Ikon } from '../components/Icons'
import { Kod, NeonSlider, NeonSwitch, Section } from '../components/ui'

const RENKLER = [
  { ad: 'Gece Moru', token: 'Color/SynthPurple', hex: '#1A0B2E', rol: 'Zemin. Siyah değil: ışık mora vurur' },
  { ad: 'Neon Pembe', token: 'Color/NeonPink', hex: '#FF00FF', rol: 'Ana neon, ızgara, çağrı' },
  { ad: 'Cyan', token: 'Color/NeonCyan', hex: '#00FFFF', rol: 'İkinci neon, bağlantı, odak' },
  { ad: 'Gün Batımı', token: 'Color/SunsetOrange', hex: '#FF8C00', rol: 'Güneş, krom yansıma, uyarı' },
]

/** Madde 4: gece moru zemin ve üç neon */
export function Palet() {
  return (
    <Section id="palet" madde="Madde 4 · Renk paleti" title="Gece ve" script="üç neon" lead="Zemin saf siyah değil, gece moru: neonun ışığı mora vurur. Üstünde üç doygun renk. Neon dolgunun üstündeki yazı gece moru; beyaz yazı pembede 3,14:1, cyan'da 1,25:1 kalırdı.">
      <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-4">
        {RENKLER.map((r, i) => (
          <RetroCard as="li" key={r.hex} kose={false} className="overflow-hidden">
            <div className="h-28" style={{ background: r.hex, boxShadow: i ? `inset 0 -2px 0 #0d0418, 0 0 var(--g3) ${r.hex}` : 'inset 0 0 0 2px #5b3a8c' }} aria-hidden="true" />
            <div className="p-5">
              <p className="chrome text-[30px]">{r.ad}</p>
              <p className="mt-2 font-bold tabular-nums">{r.hex}</p>
              <p className="mt-2 text-[14px] text-muted">{r.rol}</p>
              <p className="mt-3 text-[13px] font-bold tracking-wide text-cyan">{r.token}</p>
              {i ? (
                <dl className="m-0 mt-3 grid grid-cols-[1fr_auto] gap-x-3 text-[14px] tabular-nums">
                  <dt className="text-muted">Gecede yazı</dt>
                  <dd className="m-0">{oran(kontrast(r.hex, '#1A0B2E'))}</dd>
                  <dt className="text-muted">Üstünde gece</dt>
                  <dd className="m-0">{oran(kontrast('#1A0B2E', r.hex))}</dd>
                </dl>
              ) : null}
            </div>
          </RetroCard>
        ))}
      </ul>
    </Section>
  )
}

/** Madde 5 · 18: fırça scripti, krom serif, neon tabela; gövde mono ve en az Medium */
export function Tipografi() {
  const [agirlik, setAgirlik] = useState(300)
  return (
    <Section id="yazi" madde="Madde 5 · Tipografi" title="Krom ve" script="fırça" lead="Başlık iki katman: Abril Fatface krom serif ve üstüne eğik Yellowtail fırça scripti. Tabelalar Monoton, gövde Chivo Mono. Neon yazı ince olunca dağılır; arayüzde ağırlık en az 500, bileşenlerde 700.">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <RetroCard className="min-w-0 p-6 md:p-8">
          <p className="kicker text-muted">Typography/ChromeHeader</p>
          <p className="mt-4 leading-none">
            <span className="chrome block text-[clamp(56px,8vw,104px)]">Şişli Ğ</span>
            <span className="script -mt-3 ml-10 block -rotate-6 text-[clamp(48px,6vw,80px)]">Gece yağmuru</span>
          </p>
          <p className="neon-c mt-8 text-[clamp(28px,4vw,44px)] leading-tight text-cyan" style={{ fontFamily: "var(--font-neon)" }}>
            AÇIK
          </p>
          <p className="mt-2 text-[14px] text-muted">Monoton: çift çizgili tabela harfleri. Yalnız kısa kelimelerde.</p>
        </RetroCard>
        <RetroCard className="min-w-0 p-6 md:p-8">
          <p className="kicker text-muted">Gövde · Chivo Mono · Madde 18</p>
          <p className="mt-4 text-[18px] leading-relaxed text-pink neon-t" style={{ fontWeight: agirlik }} data-agirlik-ornek="">
            Pijamalı hasta yağız şoföre çabucak güvendi. 0123456789
          </p>
          <div className="mt-5">
            <NeonSlider label="Ağırlık" value={agirlik} min={100} max={800} step={100} onChange={setAgirlik} format={(v) => `${v}${v < 500 ? ' · arayüzde yasak' : v >= 700 ? ' · bileşen' : ' · gövde'}`} />
          </div>
          <p className={cx('mt-4 flex items-start gap-2 text-[15px]', agirlik < 500 ? 'text-orange' : 'text-cyan')} aria-live="polite">
            <Ikon ad={agirlik < 500 ? 'kapat' : 'yildiz'} boyut={20} className="mt-0.5" />
            {agirlik < 500 ? 'İnce harfin çevresindeki hale harfin kendisinden kalın: kenarlar eriyip okunmaz olur.' : 'Harf gövdesi haleden kalın: parlama yazıyı sarar, silmez.'}
          </p>
          <ul className="m-0 mt-6 grid list-none gap-1 p-0 text-[15px]">
            {[
              [500, 'Gövde metni'],
              [700, 'Düğme, etiket, kaydırıcı'],
              [800, 'Sayaç, fiyat'],
            ].map(([w, a]) => (
              <li key={w} className="flex justify-between gap-3 border-b border-line py-1" style={{ fontWeight: w }}>
                <span>{a}</span>
                <span className="tabular-nums text-cyan">{w}</span>
              </li>
            ))}
          </ul>
        </RetroCard>
      </div>
    </Section>
  )
}

/** Madde 6: üçgenler, dilimli güneş, keskin ufuk */
export function Sekil() {
  const [dilim, setDilim] = useState(7)
  const [ufuk, setUfuk] = useState(62)
  const kesik = (() => {
    let y = 100 - (100 - 40) * 0.95
    const d: string[] = []
    for (let i = 0; i < dilim && y < 100; i++) {
      y += (60 / dilim) * (1 - i / (dilim * 1.6))
      const b = 1.2 + i * (8 / dilim)
      d.push(`M0 ${y.toFixed(1)}h200v${b.toFixed(1)}h-200z`)
      y += b
    }
    return d.join('')
  })()
  return (
    <Section id="sekil" madde="Madde 6 · Şekil dili" title="Üçgen, güneş," script="ufuk" lead="Güneş yarım daire: üstü dolu, altı aşağı indikçe genişleyen boşluklarla kesik. Dağlar sivri üçgen, ufuk tek keskin çizgi. Yuvarlak köşe yalnız düğme ve kartta, sahnede yok.">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
        <RetroCard kose={false} className="min-w-0 overflow-hidden">
          <svg viewBox="0 0 400 220" className="block h-auto w-full" role="img" aria-label={`${dilim} kesikli güneş, ufuk yüzde ${ufuk}`}>
            <defs>
              <linearGradient id="sk-gok" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#0d0418" />
                <stop offset="1" stopColor="#3a0f5c" />
              </linearGradient>
              <linearGradient id="sk-g" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#ffe08a" />
                <stop offset=".5" stopColor="#ff8c00" />
                <stop offset="1" stopColor="#ff00ff" />
              </linearGradient>
              <mask id="sk-m">
                <rect width="200" height="100" fill="#fff" />
                <path d={kesik} fill="#000" />
              </mask>
            </defs>
            <rect width="400" height={(220 * ufuk) / 100} fill="url(#sk-gok)" />
            <svg x="110" y={(220 * ufuk) / 100 - 90} width="180" height="90" viewBox="0 0 200 100">
              <circle cx="100" cy="100" r="96" fill="url(#sk-g)" mask="url(#sk-m)" />
            </svg>
            <path d={`M0 ${(220 * ufuk) / 100} L50 ${(220 * ufuk) / 100 - 40} L85 ${(220 * ufuk) / 100 - 18} L130 ${(220 * ufuk) / 100 - 62} L175 ${(220 * ufuk) / 100} M230 ${(220 * ufuk) / 100} L290 ${(220 * ufuk) / 100 - 55} L320 ${(220 * ufuk) / 100 - 30} L360 ${(220 * ufuk) / 100 - 70} L400 ${(220 * ufuk) / 100 - 20}`} fill="none" stroke="#00ffff" strokeWidth="2" strokeLinejoin="miter" />
            <line x1="0" x2="400" y1={(220 * ufuk) / 100} y2={(220 * ufuk) / 100} stroke="#ff00ff" strokeWidth="2.5" />
            {Array.from({ length: 13 }, (_, i) => (
              <line key={i} x1="200" y1={(220 * ufuk) / 100} x2={200 + (i - 6) * 80} y2="220" stroke="#ff00ff" strokeWidth="1.2" />
            ))}
            {[0.08, 0.2, 0.38, 0.62, 0.92].map((t) => (
              <line key={t} x1="0" x2="400" y1={(220 * ufuk) / 100 + (220 - (220 * ufuk) / 100) * t} y2={(220 * ufuk) / 100 + (220 - (220 * ufuk) / 100) * t} stroke="#ff00ff" strokeWidth="1.2" />
            ))}
          </svg>
        </RetroCard>
        <RetroCard className="grid min-w-0 grid-cols-1 content-start gap-6 p-6">
          <NeonSlider label="Güneş kesiği" value={dilim} min={3} max={10} onChange={setDilim} format={(v) => `${v} şerit`} />
          <NeonSlider label="Ufuk" value={ufuk} min={45} max={75} onChange={setUfuk} format={(v) => `%${v}`} />
          <div className="flex flex-wrap items-end gap-4" aria-hidden="true">
            <svg width="54" height="48" viewBox="0 0 54 48">
              <path d="M27 3 L51 45 H3 Z" fill="none" stroke="#ff00ff" strokeWidth="2.5" style={{ filter: 'drop-shadow(0 0 var(--g2) #ff00ff)' }} />
            </svg>
            <svg width="54" height="48" viewBox="0 0 54 48">
              <path d="M27 3 L51 45 H3 Z M27 3 L27 45 M15 24 H39" fill="none" stroke="#00ffff" strokeWidth="2" style={{ filter: 'drop-shadow(0 0 var(--g2) #00ffff)' }} />
            </svg>
            <svg width="84" height="48" viewBox="0 0 84 48">
              <path d="M0 40 H84" stroke="#ff8c00" strokeWidth="3" style={{ filter: 'drop-shadow(0 0 var(--g2) #ff8c00)' }} />
            </svg>
          </div>
          <p className="text-[14px] text-muted">Güneşin kesikleri bir maskeyle açılır: SVG'de beyaz dikdörtgen üstüne siyah şeritler. Aynı maske Figma'da "Mask" katmanıdır.</p>
        </RetroCard>
      </div>
    </Section>
  )
}

/** Madde 7: dış hale ve krom iç gölge */
export function Golge() {
  const [dis, setDis] = useState(true)
  const [ic, setIc] = useState(true)
  return (
    <Section id="golge" madde="Madde 7 · Z-ekseni ve gölge" title="Işık dışa," script="hacim içe" lead="Neon nesneler dışarı ışık saçar: bulanık, renkli dış gölge. Krom yazı ise içeriden oyulmuş gibi: üst kenarda ince beyaz, alt kenarda koyu iç gölge. İkisi ayrı ayrı kapatılabilir.">
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="grid min-h-[260px] place-items-center rounded-[10px] border-2 border-line bg-[#0d0418] p-8">
          <p className="chrome text-center text-[clamp(56px,9vw,112px)]" style={{ filter: dis ? undefined : 'none', textShadow: ic ? undefined : 'none' }} data-golge-ornek="">
            Krom
          </p>
        </div>
        <RetroCard className="grid min-w-0 grid-cols-1 content-start gap-6 p-6">
          <NeonSwitch label="Dış hale (drop-shadow)" hint="filter: drop-shadow(0 0 4px #FF00FF) drop-shadow(0 0 12px #FF00FF)" checked={dis} onChange={setDis} />
          <NeonSwitch label="İç gölge (krom hacmi)" hint="Arka plan yazıya kırpılır; text-shadow onun üstünde kalır ve harfin içinde görünür." checked={ic} onChange={setIc} />
          <Kod label="Krom CSS">{`.chrome {
  background: linear-gradient(180deg,
    #fff 0%, #d9e4ff 22%, #8aa0d8 46%,
    #2a1650 50%, #6b2f7f 54%,   /* ufuk */
    #ff8c00 72%, #ffe08a 100%);
  background-clip: text; color: transparent;
  text-shadow: 0 1px 0 #fff8, 0 -2px 1px #1a0b2e8c;
  filter: drop-shadow(0 0 4px #f0f) drop-shadow(0 0 12px #f0f9);
}`}</Kod>
        </RetroCard>
      </div>
    </Section>
  )
}
