import { useChat } from '../lib/store'

const STILLER = [
  ['001', 'Swiss Style'],
  ['002', 'Soft Minimalism'],
  ['003', 'Corporate Modern'],
  ['004', 'Glassmorphism'],
  ['005', 'Neumorphism'],
  ['006', 'Ambient UI'],
  ['007', 'Claymorphism'],
  ['008', 'Isometric 3D'],
  ['009', 'Low Poly'],
  ['010', 'Cyberpunk'],
  ['011', 'Holographic'],
  ['012', 'Terminal / Hacker UI'],
  ['013', 'Generative UI'],
] as const

/** Kenar çubuğu ve destek balonu görünümleri için "ev sahibi" sayfa: asistan bu sayfanın yanında ya da köşesinde durur */
export function HostPage() {
  const s = useChat()
  return (
    <main id="icerik" className="min-w-0 px-4 py-10 md:px-10">
      <div className="mx-auto max-w-3xl">
        <p className="text-[13px] font-medium text-muted">webdetest · stil kataloğu</p>
        <h1 className="mt-2 text-[32px] leading-tight font-semibold tracking-tight md:text-[40px]">Web tasarım stilleri</h1>
        <p className="mt-3 max-w-[60ch] text-[17px] text-muted">
          Bu sayfa, Stil 014'ün {s.mode === 'kenar' ? 'kenar çubuğu' : 'destek balonu'} görünümü için bir ev sahibi. Asistan {s.mode === 'kenar' ? 'sağda, sayfayla yan yana' : 'sağ alt köşede'} duruyor; sohbet geçmişi görünümler arasında korunur.
        </p>
        <button type="button" onClick={() => s.setMode('tam')} className="mt-5 rounded-full bg-brand px-4 py-2 text-[15px] font-medium text-on-brand hover:opacity-90">
          Tam ekran sohbete dön
        </button>
        <h2 className="mt-10 text-[20px] font-semibold">Katalog</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {STILLER.map(([n, ad]) => (
            <li key={n}>
              <a href={`../${n}/`} className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-ink no-underline hover:border-line-strong">
                <span className="font-mono text-[13px] text-muted">{n}</span>
                <span className="font-medium" lang="en">
                  {ad}
                </span>
              </a>
            </li>
          ))}
          <li className="flex items-center gap-3 rounded-xl border border-brand bg-brand-soft px-4 py-3">
            <span className="font-mono text-[13px] text-muted">014</span>
            <span className="font-medium" lang="en">
              Conversational UI
            </span>
            <span className="ml-auto text-[13px] text-brand-ink">bu sayfa</span>
          </li>
        </ul>
        <p className="mt-8 text-[14px] text-muted">
          <a href="../../" className="text-brand-ink underline underline-offset-2">
            Tüm stiller
          </a>{' '}
          ·{' '}
          <a href="../013/" className="text-brand-ink underline underline-offset-2">
            Stil 013
          </a>
        </p>
      </div>
    </main>
  )
}
