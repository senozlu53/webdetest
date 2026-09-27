import { useState } from 'react'
import { useChat, type MotionPref, type Speed } from '../lib/store'
import { Seg } from '../components/Settings'
import { AIThinking } from '../components/AIMessage'
import { Block } from './Build'
import { cx } from '../../shared/cx'

const ORNEK = ['Merhaba!', 'Yeni mesaj alttan gelir.', 'Önceki mesajlar yukarı kayar.', 'Hareket 320 ms sürer.']

/** Madde 16: alttan yukarı beliren mesaj, düşünme göstergesi, hız */
export function Hareket() {
  const s = useChat()
  const [list, setList] = useState<{ id: number; t: string; user: boolean }[]>([{ id: 0, t: 'Bir mesaj ekleyin.', user: false }])
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <div className="flex h-44 flex-col justify-end gap-1 overflow-hidden rounded-xl bg-chat p-3 ring-1 ring-line" aria-hidden="true">
            {list.slice(-4).map((m) => (
              <div key={m.id} className={cx('bubble slide-up max-w-[85%] text-[14px]', m.user ? 'bubble-user self-end' : 'bubble-asst self-start')} data-pos="solo">
                {m.t}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setList((l) => [...l, { id: l.length, t: ORNEK[l.length % ORNEK.length], user: l.length % 2 === 1 }])}
            className="mt-2 rounded-lg border border-line px-3 py-1.5 text-[14px] hover:bg-sunken"
          >
            Örnek mesaj ekle
          </button>
        </div>
        <div className="rounded-xl bg-sunken p-3">
          <p className="mb-1 text-[13px] text-muted">AI Thinking Indicator · çalışırken</p>
          <AIThinking steps={['Soruyu anlıyorum', 'İlgili maddeyi seçiyorum', 'Örnek hazırlıyorum']} done={1} finished={false} />
          <p className="mt-3 mb-1 text-[13px] text-muted">bittikten sonra (tıklayın)</p>
          <AIThinking steps={['Soruyu anlıyorum', 'İlgili maddeyi seçiyorum', 'Örnek hazırlıyorum']} done={3} finished ms={1260} />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Seg<MotionPref> legend={`Hareket · şu an ${s.motion === 'acik' ? 'açık' : 'kapalı'}`} name="w-hareket" value={s.motionPref} options={[{ id: 'oto', ad: 'Otomatik' }, { id: 'acik', ad: 'Açık' }, { id: 'kapali', ad: 'Kapalı' }]} onChange={s.setMotionPref} small />
        <Seg<Speed> legend="Yanıt akış hızı" name="w-hiz" value={s.speed} options={[{ id: 'yavas', ad: 'Yavaş' }, { id: 'normal', ad: 'Normal' }, { id: 'hizli', ad: 'Hızlı' }]} onChange={s.setSpeed} small />
      </div>
    </div>
  )
}

/** Telefon: klavye açılınca kutu nereye gider? */
function Phone({ managed, open }: { managed: boolean; open: boolean }) {
  const kb = 42
  return (
    <figure className="flex flex-col items-center gap-2">
      <div className="relative h-[300px] w-[150px] overflow-hidden rounded-[22px] border-4 border-ink/80 bg-chat" aria-hidden="true">
        <div className="absolute inset-x-0 top-0 flex flex-col transition-[height] duration-300" style={{ height: managed && open ? `${100 - kb}%` : '100%' }}>
          <div className="h-5 border-b border-line" />
          <div className="flex flex-1 flex-col justify-end gap-1 px-2 pb-1">
            <span className="h-3 w-3/4 rounded-full bg-bubble-a" />
            <span className="h-3 w-1/2 self-end rounded-full bg-brand" />
          </div>
          <div className={cx('mx-1.5 mb-1.5 flex h-7 items-center gap-1 rounded-full border px-1.5', !managed && open ? 'border-dashed border-err bg-chat' : 'border-line bg-surface shadow-[var(--prompt-shadow)]')}>
            <span className="h-1.5 flex-1 rounded-full bg-line" />
            <span className="size-4 rounded-full bg-brand" />
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 grid grid-cols-10 content-start gap-0.5 bg-sunken p-1 transition-transform duration-300" style={{ height: `${kb}%`, transform: open ? 'translateY(0)' : 'translateY(100%)' }}>
          {Array.from({ length: 30 }, (_, i) => (
            <span key={i} className="h-4 rounded-[3px] bg-surface ring-1 ring-line" />
          ))}
        </div>
      </div>
      <figcaption className="max-w-[170px] text-center text-[13px]">
        <span className="font-semibold">{managed ? 'VisualViewport' : '100vh'}</span>
        <span className={cx('block', managed ? 'text-ok' : open ? 'text-err' : 'text-muted')}>{managed ? (open ? 'kutu klavyenin üstünde' : 'görünür alan = ekran') : open ? 'kutu klavyenin arkasında' : 'klavye kapalı: sorun yok'}</span>
      </figcaption>
    </figure>
  )
}

const HOOK = `// Görünür alan yüksekliği: klavye açılınca küçülür
const vv = window.visualViewport
const uygula = () => {
  root.style.setProperty('--app-h', vv.height + 'px')
  root.style.setProperty('--app-top', vv.offsetTop + 'px')
}
vv.addEventListener('resize', uygula)
vv.addEventListener('scroll', uygula)

/* CSS: tam ekran sohbet */
.app { position: fixed; top: var(--app-top, 0);
       height: var(--app-h, 100dvh); }

<!-- HTML: içerik klavyeye göre yeniden boyutlansın -->
<meta name="viewport" content="…, interactive-widget=resizes-content">`

/** Madde 17 */
export function Klavye() {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap justify-center gap-6">
        <Phone managed={false} open={open} />
        <Phone managed open={open} />
      </div>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-pressed={open} className="self-center rounded-lg bg-brand px-4 py-2 text-[14px] font-medium text-on-brand hover:opacity-90">
        {open ? 'Klavyeyi kapat' : 'Klavyeyi aç'}
      </button>
      <p className="text-[13px] text-muted" aria-live="polite">
        {open ? 'Klavye açık: soldaki telefonda komut kutusu klavyenin arkasında kaldı; sağdakinde görünür alanla birlikte yukarı çıktı.' : 'Klavye kapalıyken iki telefon aynı görünür.'}
      </p>
      <Block label="Bu sayfada kullanılan yöntem" code={HOOK} />
    </div>
  )
}

const KONTRAST: [string, string, string][] = [
  ['Metin · asistan balonu', '15,37', '12,92'],
  ['İkincil metin', '5,70', '6,05'],
  ['Beyaz · kullanıcı balonu (mavi)', '5,17', '5,17'],
  ['Beyaz · mor / yeşil / mercan', '5,70 · 5,48 · 5,18', 'aynı'],
  ['Bağlantı ve vurgu metni', 'en az 4,78', 'en az 5,56'],
]

/** Madde 18: aria-live duyuruları */
export function Erisim() {
  const s = useChat()
  const son = s.announcements.slice(-8).reverse()
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="mb-1.5 text-[13px] font-medium">Bu oturumda ekran okuyucuya yapılan duyurular</p>
        <ol className="scroll-y flex max-h-56 flex-col divide-y divide-line rounded-xl border border-line text-[13px]">
          {son.length ? (
            son.map((a) => (
              <li key={a.id} className="flex gap-3 px-3 py-1.5">
                <span className="shrink-0 font-mono text-[12px] text-muted tabular-nums">{a.t}</span>
                <span className={cx('h-5 shrink-0 self-start rounded px-1.5 text-[11px] leading-5 font-medium', a.politeness === 'assertive' ? 'bg-err/15 text-err' : 'bg-sunken text-muted')}>{a.politeness}</span>
                <span className="min-w-0 break-words">{a.text.length > 160 ? a.text.slice(0, 160) + '…' : a.text}</span>
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-muted">Henüz duyuru yok.</li>
          )}
        </ol>
        <p className="mt-1.5 text-[12px] text-muted">Yeni bir soru sorun: "Asistan düşünüyor" ve yanıtın tamamı buraya da düşer.</p>
      </div>
      <ul className="flex flex-col gap-1.5 text-[14px]">
        {[
          'İki gizli bölge: polite (yanıt, düşünme, dosya) ve assertive (hata). Akan metin kelime kelime okunmaz.',
          'Mesajlar sıralı liste; her mesajın gizli bir "Siz" ya da "Asistan" başlığı var, başlıklarla gezinilebilir.',
          'Akan balon aria-busy ile işaretlenir; düşünme adımları metinle yazılır ("bitti", "etkin").',
          'Enter gönderir, Shift+Enter yeni satır, Escape yanıtı ya da ses kaydını durdurur.',
          'Görsel ekler dosya adını alt metin olarak taşır; ek çiplerinin kaldır düğmeleri dosya adıyla okunur.',
        ].map((t) => (
          <li key={t} className="flex gap-2">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
            {t}
          </li>
        ))}
      </ul>
      <div className="scroll-x" role="region" tabIndex={0} aria-label="Kontrast tablosu">
        <table className="w-full min-w-[420px] border-collapse text-[13px]">
          <caption className="sr-only">Kontrast oranları</caption>
          <thead>
            <tr className="text-left text-muted">
              <th scope="col" className="border-b border-line py-1 pr-3 font-medium">Çift</th>
              <th scope="col" className="border-b border-line py-1 pr-3 text-right font-medium">Açık</th>
              <th scope="col" className="border-b border-line py-1 text-right font-medium">Koyu</th>
            </tr>
          </thead>
          <tbody>
            {KONTRAST.map(([k, a, b]) => (
              <tr key={k} className="border-b border-line last:border-0">
                <th scope="row" className="py-1 pr-3 text-left font-normal">{k}</th>
                <td className="py-1 pr-3 text-right tabular-nums">{a}</td>
                <td className="py-1 text-right tabular-nums">{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
