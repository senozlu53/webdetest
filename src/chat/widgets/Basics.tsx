import { useState } from 'react'
import { useChat } from '../lib/store'
import { BRANDS, BUBBLES, Seg } from '../components/Settings'
import { IconClip, IconMic, IconSend, IconSettings, IconSpark } from '../components/Icons'
import { cx } from '../../shared/cx'

function Num({ n }: { n: number }) {
  return (
    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-ink text-[11px] font-semibold text-chat" aria-hidden="true">
      {n}
    </span>
  )
}
function Pin({ n }: { n: number }) {
  return (
    <span className="absolute -top-2.5 -right-2 grid size-5 place-items-center rounded-full bg-ink text-[11px] font-semibold text-chat" aria-hidden="true">
      {n}
    </span>
  )
}

/** Madde 2 · 3: ekran anatomisi, sayısal etiketli şema */
export function Anatomi() {
  return (
    <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="relative flex h-[300px] flex-col overflow-hidden rounded-xl border border-line bg-chat" aria-hidden="true">
        <div className="flex h-8 items-center gap-2 border-b border-line px-3">
          <span className="h-2 w-16 rounded-full bg-line-strong" />
          <span className="ml-auto"><Num n={4} /></span>
        </div>
        <div className="relative flex flex-1 flex-col justify-end gap-2 px-3 pb-24">
          <span className="absolute top-2 left-2"><Num n={1} /></span>
          <span className="h-6 w-2/3 rounded-[12px] rounded-bl-none bg-bubble-a" />
          <span className="h-6 w-1/2 self-end rounded-[12px] rounded-br-none bg-brand" />
          <span className="h-10 w-3/4 rounded-[12px] rounded-bl-none bg-bubble-a" />
        </div>
        <div className="absolute inset-x-2 bottom-2 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <Num n={2} />
            <span className="h-5 w-16 rounded-full border border-line bg-surface" />
            <span className="h-5 w-12 rounded-full border border-line bg-surface" />
          </div>
          <div className="prompt-box flex h-12 items-center gap-2 !rounded-2xl px-2">
            <Num n={3} />
            <span className="h-2 flex-1 rounded-full bg-line" />
            <span className="size-6 rounded-full bg-brand" />
          </div>
        </div>
      </div>
      <ol className="flex flex-col gap-2.5 text-[15px]">
        {[
          ['Sohbet akışı', 'Kronolojik; en yeni mesaj en altta, ekranın çoğu akışa ayrılır.'],
          ['Öneri çipleri', 'Her yanıttan sonra değişir; kullanıcıyı sonraki adıma yönlendirir.'],
          ['Komut kutusu', 'Ekranın altına sabit, en büyük girdi alanı: metin, ses, dosya.'],
          ['Menü yok', 'Üst çubukta yalnız başlık ve yeni sohbet; gezinme sohbetin içinde.'],
        ].map(([k, v], i) => (
          <li key={k} className="flex gap-2.5">
            <Num n={i + 1} />
            <span>
              <span className="font-semibold">{k}</span>
              <span className="block text-[14px] text-muted">{v}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}

/** Madde 4 · 5 · 8: ikili renk, marka rengi seçimi, satır aralığı karşılaştırması */
export function Palet() {
  const s = useChat()
  const b = BRANDS.find((x) => x.id === s.brand)!
  const [lh, setLh] = useState<'16' | '13'>('16')
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-2 sm:grid-cols-3">
        {[
          { ad: 'Kullanıcı balonu', alt: `${b.ad} ${b.hex} · beyaz metin ${b.k}:1`, cls: 'bg-brand text-on-brand' },
          { ad: 'Asistan balonu', alt: s.theme === 'dark' ? '#24262B · metin 12,92:1' : '#F2F3F5 · metin 15,37:1', cls: 'bg-bubble-a text-ink' },
          { ad: 'Color/ChatBackground', alt: s.theme === 'dark' ? '#141517' : '#FFFFFF', cls: 'bg-chat text-ink border border-line' },
        ].map((c) => (
          <div key={c.ad} className={cx('rounded-xl px-3 py-3', c.cls)}>
            <p className="text-[14px] font-semibold">{c.ad}</p>
            <p className="text-[12px] opacity-85">{c.alt}</p>
          </div>
        ))}
      </div>
      <Seg legend="Marka rengi: bütün sohbet anında değişir" name="w-marka" value={s.brand} options={BRANDS.map((x) => ({ id: x.id, ad: x.ad, swatch: x.hex }))} onChange={s.setBrand} small />
      <div>
        <Seg legend="Satır aralığı (Inter 16px)" name="w-lh" value={lh} options={[{ id: '16', ad: '1,6 · kullanılan' }, { id: '13', ad: '1,3 · sıkışık' }]} onChange={setLh} small />
        <p className="mt-2 rounded-xl bg-sunken px-3 py-2.5 text-[16px]" style={{ lineHeight: lh === '16' ? 1.6 : 1.3 }}>
          Uzun bir yanıtı okurken göz satır sonundan bir sonraki satırın başına atlar. Satırlar birbirine yakınsa göz yanlış satıra kayar; 1,6 aralık bu atlamayı kolaylaştırır ve paragraf yorulmadan okunur.
        </p>
      </div>
      <p className="text-[13px] text-muted">Madde 8: yüzeyler düz ve pürüzsüz. Gölge yalnız komut kutusunda ve bu örnek kartlarında hafifçe var.</p>
    </div>
  )
}

/** Madde 6 · 13: balon biçimi ve gruplama */
export function Balon() {
  const s = useChat()
  return (
    <div className="flex flex-col gap-4">
      <Seg legend="Balon biçimi: bütün sohbete uygulanır" name="w-balon" value={s.bubble} options={BUBBLES} onChange={s.setBubble} small />
      <div className="flex flex-col gap-1 rounded-xl bg-chat p-3 ring-1 ring-line" aria-label="Gruplama örneği" role="img">
        <div className="bubble bubble-user max-w-[75%] self-end" data-pos="first">Bir sorum var.</div>
        <div className="bubble bubble-user max-w-[75%] self-end" data-pos="mid">Balonlar neden farklı?</div>
        <div className="bubble bubble-user mr-2 max-w-[75%] self-end" data-pos="last">Son balon sivri köşeli.</div>
        <div className="bubble bubble-asst mt-3 ml-2 max-w-[75%] self-start" data-pos="first">
          Çünkü bir grup tek bir tur gibi okunmalı.
        </div>
        <div className="bubble bubble-asst ml-2 max-w-[75%] self-start" data-pos="last">
          Sivri köşe konuşmacıyı gösterir.
        </div>
      </div>
      <dl className="grid gap-x-4 gap-y-1 text-[13px] sm:grid-cols-2">
        {[
          ['Radius/BubbleUser', s.bubble === 'yuvarlak' ? '18 18 18 18' : '18 18 0 18'],
          ['Radius/BubbleAssistant', s.bubble === 'yuvarlak' ? '18 18 18 18' : '18 18 18 0'],
          ['Radius/BubbleGrouped', 'konuşmacı tarafı 6'],
          ['Kuyruk', s.bubble === 'kuyruk' ? '10 × 12 üçgen, son balonda' : 'yok'],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between gap-3 border-b border-line py-1">
            <dt className="font-mono text-[12px]">{k}</dt>
            <dd className="text-muted">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

/** Madde 7 · 9 · 11: komut kutusu anatomisi */
export function Kutu() {
  const [golge, setGolge] = useState(true)
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl bg-sunken px-3 pt-10 pb-4" aria-hidden="true">
        <div className={cx('rounded-3xl border border-line bg-surface', golge && 'shadow-[var(--prompt-shadow)]')}>
          <div className="flex gap-2 px-3 pt-3">
            <span className="relative flex items-center gap-2 rounded-xl border border-line bg-sunken px-2 py-1 text-[12px]">
              <span className="size-7 rounded-md bg-brand-soft" />
              rapor.csv
              <Pin n={1} />
            </span>
          </div>
          <p className="px-4 pt-3 pb-3 text-[15px] text-muted">
            <span className="relative pr-3">
              Bu tabloyu özetler misin?
              <Pin n={2} />
            </span>
          </p>
          <div className="flex items-center gap-3 px-3 pb-2.5">
            <span className="relative grid size-9 place-items-center text-muted">
              <IconClip size={18} />
              <Pin n={3} />
            </span>
            <span className="relative grid size-9 place-items-center text-muted">
              <IconSettings size={18} />
              <Pin n={4} />
            </span>
            <span className="flex-1" />
            <span className="relative grid size-9 place-items-center text-muted">
              <IconMic size={18} />
              <Pin n={5} />
            </span>
            <span className="relative grid size-9 place-items-center rounded-full bg-brand text-on-brand">
              <IconSend size={18} />
              <Pin n={6} />
            </span>
          </div>
        </div>
      </div>
      <ol className="grid gap-x-4 gap-y-1 text-[14px] sm:grid-cols-2">
        {['Ek çipleri: önizleme, tür, boyut, kaldır', 'Metin alanı: içerikle büyür, en çok ekranın %40’ı', 'Ataç: 5 dosya, her biri 10 MB', 'Ayarlar: görünüm, tema, renk, balon, hareket', 'Mikrofon: <AIVoiceInput>, düzenlenebilir metin', 'Gönder; üretim sürerken durdur'].map((t, i) => (
          <li key={t} className="flex gap-2">
            <span className="w-4 shrink-0 font-semibold tabular-nums">{i + 1}</span>
            <span className="text-muted">{t}</span>
          </li>
        ))}
      </ol>
      <label className="flex items-center gap-2 text-[14px]">
        <input type="checkbox" checked={golge} onChange={(e) => setGolge(e.target.checked)} className="size-4 accent-[var(--brand)]" />
        Yukarı gölge: <code className="font-mono text-[12.5px]">0 -10px 40px rgba(0,0,0,0.05)</code>
      </label>
      <p className="flex items-center gap-2 text-[13px] text-muted">
        <IconSpark size={14} className="text-brand-ink" /> Gerçeği aşağıda: bir dosyayı sohbetin üstüne sürükleyin ya da mikrofona basın.
      </p>
    </div>
  )
}
