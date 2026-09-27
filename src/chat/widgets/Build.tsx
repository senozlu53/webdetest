import { useChat, type Mode } from '../lib/store'
import { MODES } from '../components/Settings'
import { cx } from '../../shared/cx'

function Mini({ mode }: { mode: Mode }) {
  const bubbles = (
    <>
      <span className="h-2 w-3/4 rounded-full bg-bubble-a" />
      <span className="h-2 w-1/2 self-end rounded-full bg-brand" />
      <span className="h-2 w-2/3 rounded-full bg-bubble-a" />
    </>
  )
  const box = <span className="mt-auto h-3 rounded-full border border-line bg-surface shadow-[var(--prompt-shadow)]" />
  return (
    <div className="relative h-24 overflow-hidden rounded-lg border border-line bg-sunken" aria-hidden="true">
      {mode === 'tam' ? (
        <div className="mx-auto flex h-full w-3/5 flex-col gap-1.5 py-2">
          {bubbles}
          {box}
        </div>
      ) : mode === 'kenar' ? (
        <div className="flex h-full">
          <div className="flex flex-1 flex-col gap-1.5 p-2">
            <span className="h-2 w-1/2 rounded-full bg-line-strong" />
            <span className="h-8 rounded bg-line" />
            <span className="h-8 rounded bg-line" />
          </div>
          <div className="flex w-2/5 flex-col gap-1.5 border-l border-line bg-chat p-1.5">
            {bubbles}
            {box}
          </div>
        </div>
      ) : (
        <div className="h-full p-2">
          <span className="block h-2 w-1/2 rounded-full bg-line-strong" />
          <span className="mt-1.5 block h-8 rounded bg-line" />
          <div className="absolute right-2 bottom-2 flex h-16 w-2/5 flex-col gap-1 rounded-md border border-line bg-chat p-1.5 shadow-md">
            <span className="h-1.5 w-3/4 rounded-full bg-bubble-a" />
            <span className="h-1.5 w-1/2 self-end rounded-full bg-brand" />
            {box}
          </div>
        </div>
      )}
    </div>
  )
}

/** Madde 10: aynı sohbet üç kapta */
export function Modlar() {
  const s = useChat()
  const alt: Record<Mode, string> = {
    tam: 'Yapay zekâ sohbeti: akış ortada, sayfa sohbetin kendisi.',
    kenar: 'Belge ya da ürün sayfasının yanında asistan. Dar ekranda açılır pencereye döner.',
    destek: 'Köşede açılan müşteri destek botu; sayfa arkada kalır.',
  }
  return (
    <ul className="grid gap-3 sm:grid-cols-3">
      {MODES.map((m) => {
        const cur = s.mode === m.id
        return (
          <li key={m.id} className={cx('flex flex-col gap-2 rounded-xl border p-2.5', cur ? 'border-brand bg-brand-soft' : 'border-line')}>
            <Mini mode={m.id} />
            <p className="text-[14px] font-semibold">{m.ad}</p>
            <p className="flex-1 text-[13px] text-muted">{alt[m.id]}</p>
            <button type="button" onClick={() => s.setMode(m.id)} disabled={cur} aria-pressed={cur} className="rounded-lg border border-line bg-surface px-3 py-1.5 text-[14px] hover:bg-sunken disabled:cursor-default disabled:border-transparent disabled:bg-transparent disabled:font-medium disabled:text-brand-ink">
              {cur ? 'Şu an bu görünüm' : 'Bu görünüme geç'}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

const TREE = `AIChat                  Auto Layout dikey · fill × fill
|- Başlık               Auto Layout yatay · fill × hug
|- Akış (kaydırma)      Auto Layout dikey · fill × fill
|  '- Mesaj × n         Auto Layout dikey · hug
|     |- Düşünce        hug
|     |- Balon          hug · max 85%
|     '- Örnek kart     fill · max 680
'- Komut çubuğu         Fixed (alta sabit) · fill × hug
   |- Öneri çipleri     Auto Layout yatay · kaydırılır
   '- AIPromptBox       Auto Layout dikey · fill × hug`

const TAILWIND = `<!-- Akış: tarayıcı en alttan başlar, yeni mesajda en sonda kalır -->
<div class="flex flex-col-reverse overflow-y-auto">
  <ol class="flex flex-col">…mesajlar…</ol>
</div>

<!-- Balonlar: metin akışı bozulmasın -->
<div class="whitespace-pre-wrap rounded-[18px] rounded-br-none bg-brand text-white">…</div>

<!-- Komut kutusu: alta sabit, derin yukarı gölge -->
<form class="rounded-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">…</form>`

const REACT = `<AIChat header={<Baslik />}>
  <AIMessage role="assistant" status="streaming" />
  <AIPromptBox onSend={gonder} maxFiles={5}>
    <AIVoiceInput lang="tr-TR" onDone={ekle} />
  </AIPromptBox>
</AIChat>`

export function Block({ label, code }: { label: string; code: string }) {
  return (
    <figure className="overflow-hidden rounded-xl border border-line">
      <figcaption className="border-b border-line bg-sunken px-3 py-1 text-[12px] text-muted">{label}</figcaption>
      <pre className="scroll-x px-3 py-2.5 font-mono text-[12.5px] leading-relaxed" tabIndex={0} aria-label={label}>
        <code>{code}</code>
      </pre>
    </figure>
  )
}

/** Madde 12–15 */
export function Kod() {
  return (
    <div className="flex flex-col gap-3">
      <Block label="Figma: katman yapısı (Madde 12)" code={TREE} />
      <dl className="grid gap-x-4 gap-y-1 text-[13px] sm:grid-cols-2">
        {[
          ['Radius/BubbleUser', '18 18 0 18'],
          ['Radius/BubbleAssistant', '18 18 18 0'],
          ['Color/ChatBackground', '#FFFFFF · koyu #141517'],
          ['Color/BubbleUser', 'marka · #2563EB'],
          ['Color/BubbleAssistant', '#F2F3F5 · koyu #24262B'],
          ['Shadow/PromptBox', '0 −10 40 · %5'],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between gap-3 border-b border-line py-1">
            <dt className="font-mono text-[12px]">{k}</dt>
            <dd className="text-muted">{v}</dd>
          </div>
        ))}
      </dl>
      <Block label="Tailwind (Madde 15)" code={TAILWIND} />
      <Block label="React (Madde 14)" code={REACT} />
    </div>
  )
}
