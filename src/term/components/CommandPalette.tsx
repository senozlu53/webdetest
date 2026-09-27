import type { ReactNode } from 'react'
import { Command } from 'cmdk'
import { Dialog } from 'radix-ui'
import { TEMALAR, YAZILAR_, useTerm } from '../lib/store'
import { Kbd } from './ui'

export const BOLUMLER: ReadonlyArray<{ id: string; ad: string; kisa: string }> = [
  { id: 'ozellikler', ad: 'özellikler', kisa: 'özellik' },
  { id: 'renk', ad: 'renk ve yazı', kisa: 'renk' },
  { id: 'kiyas', ad: 'kıyaslama', kisa: 'kıyas' },
  { id: 'bios', ad: 'bios / vmd', kisa: 'bios' },
  { id: 'sunucu', ad: 'sunucu konsolu', kisa: 'sunucu' },
  { id: 'kisisel', ad: 'kişisel site', kisa: 'kişisel' },
  { id: 'hareket', ad: 'hareket ve mobil', kisa: 'hareket' },
  { id: 'erisilebilirlik', ad: 'erişilebilirlik', kisa: 'erişim' },
]

const ascii = (s: string) =>
  s.toLocaleLowerCase('tr-TR').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')

export function git(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ block: 'start' })
  history.replaceState(null, '', `#${id}`)
  const h = el.querySelector<HTMLElement>('h2')
  if (h) {
    h.tabIndex = -1
    h.focus({ preventScroll: true })
  }
}

function Item({ value, children, meta, onSelect, keywords }: { value: string; children: ReactNode; meta?: string; onSelect: () => void; keywords?: string[] }) {
  return (
    <Command.Item
      value={value}
      keywords={[ascii(value), ...(keywords ?? [])]}
      onSelect={onSelect}
      className="group flex cursor-pointer gap-1 px-1 whitespace-pre outline-none data-[selected=true]:bg-sel-bg data-[selected=true]:text-sel-fg"
    >
      <span aria-hidden="true" className="font-bold">
        <span className="group-data-[selected=true]:hidden">{'    '}</span>
        <span className="hidden group-data-[selected=true]:inline">{'[>] '}</span>
      </span>
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {meta ? <span className="shrink-0 opacity-80">{meta}</span> : null}
    </Command.Item>
  )
}

const heading = '[&_[cmdk-group-heading]]:px-1 [&_[cmdk-group-heading]]:pt-[1lh] [&_[cmdk-group-heading]]:text-dim [&_[cmdk-group-heading]]:before:content-["#_"]'

/**
 * Komut paleti (Madde 11): Ctrl/⌘ + K. cmdk + Radix Dialog; görünüm tamamen metin:
 * "> " istemi, seçili satır ters video ve "[>]" işaretli. Eylemler sayfanın durumunu gerçekten değiştirir.
 */
export function CommandPalette() {
  const s = useTerm()
  const run = (fn: () => void) => () => {
    s.setPalet(false)
    window.setTimeout(fn, 40)
  }
  const aciklar = s.sunucular.filter((x) => x.durum !== 'kapali')
  const kapalilar = s.sunucular.filter((x) => x.durum === 'kapali')
  return (
    <Dialog.Root open={s.palet} onOpenChange={s.setPalet}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-bg/80" />
        <Dialog.Content aria-describedby="palet-aciklama" className="fixed top-[2lh] left-1/2 z-50 w-[min(76ch,calc(100%-2ch))] -translate-x-1/2 border border-fg bg-bg font-mono text-fg">
          <Dialog.Title className="sr-only">Komut paleti</Dialog.Title>
          <p id="palet-aciklama" className="sr-only">
            Komut yazın. Yukarı ve aşağı ok gezinir, Enter çalıştırır, Escape kapatır.
          </p>
          <Command label="Komut paleti" loop className="flex max-h-[min(24lh,80vh)] flex-col">
            <div className="flex items-center border-b border-line px-1">
              <span aria-hidden="true" className="font-bold whitespace-pre text-em">
                {'> '}
              </span>
              <Command.Input autoFocus placeholder="komut yazın… (tema, kıyas, restart web-02)" className="min-h-[2lh] min-w-0 flex-1 bg-transparent text-hi caret-[var(--fg)] outline-none placeholder:text-dim" />
              <Kbd keys={['Esc']} />
            </div>
            <Command.List className={`scroll-y min-h-0 flex-1 overscroll-contain pb-[0.5lh] ${heading}`}>
              <Command.Empty className="px-1 py-[1lh] text-dim">[?] eşleşme yok. deneyin: "tema", "kiyas", "restart"</Command.Empty>
              <Command.Group heading="eylemler">
                <Item value="kıyaslamayı başlat" keywords={['benchmark', 'run']} meta="6 test" onSelect={run(() => {
                  git('kiyas')
                  s.kiyasla()
                })}>
                  kıyaslamayı başlat
                </Item>
                <Item value={`crt efekti ${s.crt ? 'kapat' : 'aç'}`} keywords={['ekran yanigi', 'scanline']} onSelect={run(() => s.setCrt(!s.crt))}>
                  crt efekti: {s.crt ? 'kapat' : 'aç'}
                </Item>
                <Item value={`hareket ${s.hareket === 'acik' ? 'durdur' : 'başlat'}`} keywords={['motion', 'imlec', 'animasyon']} onSelect={run(() => s.setHareketPref(s.hareket === 'acik' ? 'kapali' : 'acik'))}>
                  hareket: {s.hareket === 'acik' ? 'durdur' : 'başlat'}
                </Item>
                <Item value={`bağlaçlar ${s.bag ? 'kapat' : 'aç'}`} keywords={['ligature', 'ligatur']} onSelect={run(() => s.setBag(!s.bag))}>
                  bağlaçlar (ligature): {s.bag ? 'kapat' : 'aç'}
                </Item>
                <Item value={`ızgara ${s.izgara ? 'gizle' : 'göster'}`} keywords={['grid', 'figma']} onSelect={run(() => s.setIzgara(!s.izgara))}>
                  karakter ızgarası: {s.izgara ? 'gizle' : 'göster'}
                </Item>
                <Item value="günlüğü temizle" keywords={['log', 'clear']} onSelect={run(s.temizle)}>
                  günlüğü temizle
                </Item>
              </Command.Group>
              <Command.Group heading="tema">
                {TEMALAR.map((t) => (
                  <Item key={t.id} value={`tema ${t.ad}`} keywords={['theme', 'renk']} meta={s.tema === t.id ? '[*]' : undefined} onSelect={run(() => s.setTema(t.id))}>
                    tema: {t.ad}
                  </Item>
                ))}
              </Command.Group>
              <Command.Group heading="yazı tipi">
                {YAZILAR_.map((y) => (
                  <Item key={y.id} value={`yazı ${y.ad}`} keywords={['font']} meta={s.yazi === y.id ? '[*]' : undefined} onSelect={run(() => s.setYazi(y.id))}>
                    yazı: {y.ad}
                  </Item>
                ))}
              </Command.Group>
              <Command.Group heading="sunucu">
                {aciklar.map((x) => (
                  <Item key={`r-${x.host}`} value={`restart ${x.host}`} keywords={['yeniden baslat']} meta={x.rol} onSelect={run(() => s.soyle(s.sunucuKomut('restart', x.host)))}>
                    restart {x.host}
                  </Item>
                ))}
                {kapalilar.map((x) => (
                  <Item key={`s-${x.host}`} value={`start ${x.host}`} keywords={['baslat']} meta={x.rol} onSelect={run(() => s.soyle(s.sunucuKomut('start', x.host)))}>
                    start {x.host}
                  </Item>
                ))}
              </Command.Group>
              <Command.Group heading="git">
                {BOLUMLER.map((b) => (
                  <Item key={b.id} value={`git ${b.ad}`} keywords={['cd']} meta={`#${b.id}`} onSelect={run(() => git(b.id))}>
                    cd ~/{b.ad}
                  </Item>
                ))}
              </Command.Group>
            </Command.List>
            <p className="flex flex-wrap gap-x-2 border-t border-line px-1 text-dim" aria-hidden="true">
              <span>
                <Kbd keys={['↑']} /> <Kbd keys={['↓']} /> gezin
              </span>
              <span>
                <Kbd keys={['Enter']} /> çalıştır
              </span>
              <span>
                <Kbd keys={['Esc']} /> kapat
              </span>
            </p>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
