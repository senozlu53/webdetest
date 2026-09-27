import type { ReactNode } from 'react'
import { Command } from 'cmdk'
import { Dialog } from 'radix-ui'
import { HoloIcon, type HoloIconName } from './Icons'
import { useHolo } from '../lib/store'
import { fmtGB } from '../lib/data'

export const SECTIONS: ReadonlyArray<{ id: string; label: string; icon: HoloIconName }> = [
  { id: 'ozellikler', label: 'Özellikler', icon: 'katman' },
  { id: 'renk', label: 'Renk, yazı ve ikon', icon: 'atom' },
  { id: 'hat', label: 'Çıkarım hattı', icon: 'akis' },
  { id: 'dizin', label: 'Model dizini', icon: 'depo' },
  { id: 'ag', label: '10GbE ağ ve grafikler', icon: 'ag' },
  { id: 'goruntuleyici', label: '3B görüntüleyici', icon: 'kup' },
  { id: 'hareket', label: 'Hareket ve mobil', icon: 'akis' },
  { id: 'erisilebilirlik', label: 'Erişilebilirlik ve tokenlar', icon: 'onay' },
]

/** Türkçe harfleri ASCII'ye indirger: "ag" yazınca "Ağ" da bulunur */
const ascii = (s: string) =>
  s
    .toLocaleLowerCase('tr-TR')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')

function go(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: document.documentElement.dataset.motion === 'off' ? 'auto' : 'smooth', block: 'start' })
  history.replaceState(null, '', `#${id}`)
  // Odağı bölüm başlığına taşı: klavye kullanıcısı nereye gittiğini bilsin
  const h = el.querySelector<HTMLElement>('h2')
  if (h) {
    h.tabIndex = -1
    h.focus({ preventScroll: true })
  }
}

function Item({ value, keywords, icon, children, meta, onSelect, disabled }: { value: string; keywords?: string[]; icon: HoloIconName; children: ReactNode; meta?: ReactNode; onSelect: () => void; disabled?: boolean }) {
  return (
    <Command.Item
      value={value}
      keywords={[...(keywords ?? []), ascii(value)]}
      onSelect={onSelect}
      disabled={disabled}
      className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-3 text-[15px] text-ink outline-none data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-45 data-[selected=true]:bg-[var(--tint)] data-[selected=true]:shadow-[inset_0_0_0_1px_var(--line),0_0_14px_var(--glow)]"
    >
      <HoloIcon name={icon} size={18} className="text-cyan-text" />
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {meta ? <span className="shrink-0 font-tech text-[12px] text-muted">{meta}</span> : null}
    </Command.Item>
  )
}

const heading = '[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:font-tech [&_[cmdk-group-heading]]:text-[12px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:tracking-[0.16em] [&_[cmdk-group-heading]]:text-muted [&_[cmdk-group-heading]]:uppercase'

/**
 * <CommandCenter> (Madde 11 · 14): ekranı kaplayan arama katmanı. shadcn/ui'nin Command bileşeni gibi
 * cmdk + Radix Dialog üzerine kurulu; görünüm holografik: bulanık tam ekran örtü, yanardöner kenarlı cam panel.
 * Ctrl/⌘ + K ya da "/" ile açılır. Eylemler sayfadaki gerçek durumu değiştirir.
 */
export function CommandCenter() {
  const s = useHolo()
  const close = () => s.setCommandOpen(false)
  const run = (fn: () => void) => () => {
    close()
    // Diyalog kapanıp odak geri döndükten sonra çalış
    window.setTimeout(fn, 60)
  }
  const available = s.models.filter((m) => m.kind !== 'Gömme')

  return (
    <Dialog.Root open={s.commandOpen} onOpenChange={s.setCommandOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="cmd-overlay dot-grid fixed inset-0 z-50 bg-[rgb(var(--bg-rgb)/0.72)] backdrop-blur-md" />
        <Dialog.Content
          className="cmd-panel holo-panel holo-edge fixed top-[8vh] left-1/2 z-50 w-[min(680px,calc(100%-24px))] -translate-x-1/2 rounded-3xl p-0 md:top-[12vh]"
          aria-describedby="komut-aciklama"
        >
          <Dialog.Title className="sr-only">Komut merkezi</Dialog.Title>
          <p id="komut-aciklama" className="sr-only">
            Bölüme git, model etkinleştir ya da eylem çalıştır. Yukarı ve aşağı ok tuşlarıyla gezinin, Enter ile seçin, Escape ile kapatın.
          </p>
          <Command label="Komut merkezi" loop className="flex max-h-[min(560px,76vh)] flex-col">
            <div className="flex items-center gap-3 border-b border-line-soft px-5">
              <HoloIcon name="arama" size={20} className="text-cyan-text" />
              <Command.Input
                autoFocus
                placeholder="Komut, model ya da bölüm arayın…"
                className="h-16 min-w-0 flex-1 bg-transparent text-[18px] font-[300] text-ink caret-[var(--cyan-text)] outline-none placeholder:text-muted"
              />
              <kbd className="kbd">Esc</kbd>
            </div>
            <Command.List className={`thin-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain p-2 ${heading}`}>
              <Command.Empty className="px-4 py-10 text-center text-muted">Eşleşen komut yok. Örnek: "atlas", "ağ", "tema"</Command.Empty>

              <Command.Group heading="Eylemler">
                <Item value="Çıkarımı başlat" keywords={['calistir', 'run', 'llm', 'uret']} icon="oynat" meta={s.models.find((m) => m.id === s.activeId)?.name} onSelect={run(() => {
                  go('hat')
                  s.requestRun()
                })}>
                  Çıkarımı başlat
                </Item>
                <Item value={s.transfer ? 'Ağ aktarımını duraklat' : 'Ağ aktarımını sürdür'} keywords={['10gbe', 'network', 'transfer']} icon="ag" onSelect={run(() => {
                  s.setTransfer(!s.transfer)
                  s.say(s.transfer ? 'Ağ aktarımı duraklatıldı' : 'Ağ aktarımı sürüyor')
                })}>
                  {s.transfer ? 'Ağ aktarımını duraklat' : 'Ağ aktarımını sürdür'}
                </Item>
                <Item value={s.theme === 'dark' ? 'Tema: Laboratuvar (açık)' : 'Tema: Gece (koyu)'} keywords={['theme', 'acik', 'koyu', 'light', 'dark']} icon={s.theme === 'dark' ? 'gunes' : 'ay'} onSelect={run(s.toggleTheme)}>
                  {s.theme === 'dark' ? 'Tema: Laboratuvar (açık)' : 'Tema: Gece (koyu)'}
                </Item>
                <Item value={s.motion === 'acik' ? 'Hareketi durdur' : 'Hareketi başlat'} keywords={['motion', 'animasyon', 'durdur', 'pause']} icon={s.motion === 'acik' ? 'duraklat' : 'oynat'} onSelect={run(() => s.setMotionPref(s.motion === 'acik' ? 'kapali' : 'acik'))}>
                  {s.motion === 'acik' ? 'Hareketi durdur' : 'Hareketi başlat'}
                </Item>
                <Item value="Katman: tekil (opak paneller)" keywords={['layers', 'mobil', 'performans']} icon="katman" meta={s.layersPref === 'tekil' ? 'seçili' : undefined} onSelect={run(() => s.setLayersPref('tekil'))}>
                  Katman: tekil (opak paneller)
                </Item>
                <Item value="Katman: tam (çoklu cam)" keywords={['layers', 'blur', 'cam']} icon="katman" meta={s.layersPref === 'tam' ? 'seçili' : undefined} onSelect={run(() => s.setLayersPref('tam'))}>
                  Katman: tam (çoklu cam)
                </Item>
              </Command.Group>

              <Command.Group heading="Modeli etkinleştir">
                {available.map((m) => (
                  <Item
                    key={m.id}
                    value={`Model ${m.name} ${m.params} ${m.quant}`}
                    keywords={[m.kind, m.id]}
                    icon="model"
                    disabled={m.status === 'indiriliyor'}
                    meta={`${m.quant} · ${fmtGB(m.sizeGB)}${m.status === 'indiriliyor' ? ' · iniyor' : m.id === s.activeId ? ' · etkin' : ''}`}
                    onSelect={run(() => {
                      s.setActive(m.id)
                      s.say(`${m.name} ${m.params} etkin model oldu`)
                      go('hat')
                    })}
                  >
                    {m.name} {m.params}
                  </Item>
                ))}
              </Command.Group>

              <Command.Group heading="Bölüme git">
                {SECTIONS.map((sec) => (
                  <Item key={sec.id} value={`Git ${sec.label}`} icon={sec.icon} onSelect={run(() => go(sec.id))}>
                    {sec.label}
                  </Item>
                ))}
              </Command.Group>
            </Command.List>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line-soft px-5 py-3 font-tech text-[12px] text-muted" aria-hidden="true">
              <span className="flex items-center gap-1.5">
                <kbd className="kbd">↑</kbd>
                <kbd className="kbd">↓</kbd> gezin
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="kbd">Enter</kbd> seç
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="kbd">Esc</kbd> kapat
              </span>
            </div>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
