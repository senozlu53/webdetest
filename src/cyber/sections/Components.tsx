import { useEffect, useState, type FormEvent } from 'react'
import { LightningIcon } from '@phosphor-icons/react'
import { CyberButton, CyberCard, CyberInput, NeonProgress, SectionHead } from '../components/Cyber'

const VARIANTS = ['primary', 'magenta', 'ghost'] as const
const STATES = ['default', 'glitch', 'hover'] as const

const REACT = `<CyberCard label="Erişim" code="A-02" tone="magenta">
  <CyberInput id="kod" label="Erişim kodu" error={hata} />
  <NeonProgress label="Yükleme" value={72} />
  <CyberButton variant="primary" state="glitch">
    Bağlan
  </CyberButton>
</CyberCard>`

export function Components() {
  const [code, setCode] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [granted, setGranted] = useState(false)
  const [load, setLoad] = useState(0)

  // Yükleme çubuğu sürekli dolar ve başa döner (hareket kapalıysa sabit kalır)
  useEffect(() => {
    if (document.documentElement.dataset.fx === 'kapali') {
      setLoad(64)
      return
    }
    const id = window.setInterval(() => setLoad((v) => (v >= 100 ? 0 : v + 4)), 220)
    return () => window.clearInterval(id)
  }, [])

  function submit(e: FormEvent) {
    e.preventDefault()
    const v = code.trim().toUpperCase()
    if (!v) return setErr('Kod boş. Biçim: XXXX-0000')
    if (!/^[A-Z]{4}-\d{4}$/.test(v)) return setErr('Biçim hatalı. Örnek: NEON-2077')
    if (v !== 'NEON-2077') return setErr('Erişim reddedildi. İpucu: NEON-2077')
    setErr(null)
    setGranted(true)
  }

  return (
    <section id="bilesenler" className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="11 · 12 · 14 · 15"
          label={<span lang="en">Component Patterns</span>}
          title="Kesik kenar, neon çubuk"
          lede="Kartlar kesik köşeli, form alanları hata anında glitch yapar, ilerleme göstergeleri neon bölümlerden oluşur. Etiketler Auto Layout çerçevesinin dışında sekme olarak durur."
        />

        <CyberCard label="Düğme varyantları" code="Default · Glitch · Hover">
          {/* Dar ekranda tablo yerine satır başına bir grup: yatay kaydırma yok */}
          <ul className="flex flex-col gap-5 sm:hidden">
            {VARIANTS.map((v) => (
              <li key={v}>
                <p className="font-mono text-[13px] text-muted">{v}</p>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {STATES.map((st) => (
                    <span key={st} className="flex min-w-0 flex-col gap-1">
                      <CyberButton variant={v} state={st} className="w-full px-2 tracking-[0.1em]">
                        Bağlan
                      </CyberButton>
                      <span className="font-hud text-[11px] text-muted" lang="en">
                        {st === 'default' ? 'Default' : st === 'glitch' ? 'Glitch' : 'Hover'}
                      </span>
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
          <div className="hidden sm:block">
            <table className="w-full border-separate border-spacing-y-3 text-left">
              <thead>
                <tr className="font-display text-[13px] font-bold tracking-[0.18em] text-muted uppercase">
                  <th className="pr-4 font-bold">Tür</th>
                  <th className="pr-4 font-bold" lang="en">Default</th>
                  <th className="pr-4 font-bold" lang="en">Glitch</th>
                  <th className="font-bold" lang="en">Hover</th>
                </tr>
              </thead>
              <tbody>
                {VARIANTS.map((v) => (
                  <tr key={v}>
                    <th className="pr-4 font-mono text-[13px] font-normal text-muted">{v}</th>
                    <td className="pr-4">
                      <CyberButton variant={v}>Bağlan</CyberButton>
                    </td>
                    <td className="pr-4">
                      <CyberButton variant={v} state="glitch">
                        Bağlan
                      </CyberButton>
                    </td>
                    <td>
                      <CyberButton variant={v} state="hover">
                        Bağlan
                      </CyberButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[14px] text-muted">
            Glitch varyantında metin, üzerine gelince ya da klavye odağında renkli dilimlere bölünür. Hover sütunu Figma'daki varyantın durağan önizlemesidir.
          </p>
        </CyberCard>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <CyberCard label="Erişim terminali" code="A-02" tone="magenta">
            {granted ? (
              <div className="flex flex-col gap-4" role="status">
                <p className="font-display text-3xl font-bold text-yesil uppercase">Erişim onaylandı</p>
                <p className="font-mono text-[14px] text-muted">oturum: NX-7741 · yetki: seviye 3</p>
                <CyberButton
                  variant="ghost"
                  onClick={() => {
                    setGranted(false)
                    setCode('')
                  }}
                >
                  Oturumu kapat
                </CyberButton>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="flex flex-col gap-3">
                <CyberInput
                  id="erisim-kodu"
                  label="Erişim kodu"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="XXXX-0000"
                  autoComplete="off"
                  spellCheck={false}
                  error={err}
                  hint="Dört harf, tire, dört rakam."
                />
                <CyberButton type="submit" state="glitch" icon={<LightningIcon size={16} weight="fill" aria-hidden="true" />} className="self-start">
                  Bağlan
                </CyberButton>
              </form>
            )}
          </CyberCard>

          <CyberCard label="İlerleme" code="P-24" tone="yesil">
            <div className="flex flex-col gap-5">
              <NeonProgress label="İndirme" value={load} />
              <NeonProgress label="Bellek" value={58} tone="magenta" />
              <NeonProgress label="Şifre gücü" value={88} tone="yesil" />
              <NeonProgress label="Isı" value={34} tone="mor" />
            </div>
          </CyberCard>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <CyberCard label="Tailwind · Madde 15">
            <p className="text-[15px] text-muted">Tanımdaki satır, olduğu gibi:</p>
            <div className="mt-4 border bg-[#050509] px-4 py-3 font-mono text-[14px] text-[#00F0FF] border-[#FF00A8] drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]">
              &gt; bağlantı kuruldu
            </div>
            <pre className="mt-4 overflow-x-auto border border-line bg-surface-2 p-3 font-mono text-[12px] leading-relaxed whitespace-pre-wrap">
              <code>bg-[#050509] text-[#00F0FF] border-[#FF00A8] drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]</code>
            </pre>
            <p className="mt-3 text-[13px] text-muted">Gündüz varyantında da sabit kalır: bu satır temaya bağlı değildir. Tema uyumlu bileşenler değişkenleri kullanır.</p>
          </CyberCard>
          <CyberCard label="React · Madde 14" tone="mor">
            <p className="text-[15px] text-muted">
              <span className="font-mono text-ink">CyberCard</span>, <span className="font-mono text-ink">CyberButton</span>, <span className="font-mono text-ink">CyberInput</span>,{' '}
              <span className="font-mono text-ink">NeonProgress</span>, <span className="font-mono text-ink">CyberNav</span> ve <span className="font-mono text-ink">CyberHUD</span>. Kesik
              köşe iki sahte öğedir: çerçeve ve dolgu. İçerik kırpılmaz.
            </p>
            <pre className="mt-4 overflow-x-auto border border-line bg-surface-2 p-3 font-mono text-[12.5px] leading-relaxed">
              <code>{REACT}</code>
            </pre>
          </CyberCard>
        </div>
      </div>
    </section>
  )
}
