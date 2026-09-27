import type { ReactNode } from 'react'
import { Box, Check, Pane } from '../components/ui'
import { AsciiTable } from '../components/AsciiTable'
import { useTerm } from '../lib/store'

function Man({ h, children }: { h: string; children: ReactNode }) {
  return (
    <div className="mt-[1lh] first:mt-0">
      <h3 className="text-hi uppercase">{h}</h3>
      <div className="pl-4">{children}</div>
    </div>
  )
}

export const ASCII_IKON: ReadonlyArray<{ k: string; anlam: string; ornek: string }> = [
  { k: '[>]', anlam: 'çalıştır, seçili', ornek: '[>] başlat' },
  { k: '[x]', anlam: 'kapat, işaretli', ornek: '[x] takip et' },
  { k: '[ ]', anlam: 'işaretsiz', ornek: '[ ] ayıklama' },
  { k: '[+]', anlam: 'ekle, başladı', ornek: '[+] web-02' },
  { k: '[-]', anlam: 'kaldır, durdu', ornek: '[-] is-01' },
  { k: '[!]', anlam: 'uyarı', ornek: '[!] 3 disk' },
  { k: '[?]', anlam: 'yardım', ornek: '[?] yok' },
  { k: '[*]', anlam: 'etkin seçenek', ornek: 'yeşil [*]' },
  { k: '(*)', anlam: 'radyo: seçili', ornek: '(*) RAID-10' },
  { k: '[=]', anlam: 'menü', ornek: '[=]' },
  { k: '^ v', anlam: 'artan/azalan', ornek: 'CPU v' },
  { k: '#', anlam: 'başlık, kök', ornek: '# eylem' },
]

/** Madde 3 · 6 · 7 · 8 · 9 · 12: man sayfası düzeninde karakteristikler */
export function Traits() {
  const s = useTerm()
  return (
    <Pane id="ozellikler" no="03" title="özellikler" lede="man terminal-ui(7). Beş kural: sıfır dekorasyon, mutlak fonksiyon, komut satırı, saf veri yoğunluğu ve monospace hâkimiyeti.">
      <div className="grid gap-x-4 gap-y-[2lh] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <article className="min-w-0">
          <Man h="ad">
            <p>terminal-ui: tasarımı aradan çıkaran, veriyi doğrudan gösteren arayüz dili</p>
          </Man>
          <Man h="özet">
            <p className="ascii scroll-x">
              arayüz <span className="text-em">[--tema</span> yeşil|kehribar|beyaz|solarized<span className="text-em">]</span> <span className="text-em">[--crt]</span> <span className="text-em">[--izgara]</span>
            </p>
          </Man>
          <Man h="karakteristik">
            <ul>
              {[
                ['sıfır dekorasyon', 'Degrade, gölge, köşe yuvarlama, görsel yok. Ayrım çizgi, boşluk ve ters video ile yapılır.'],
                ['mutlak fonksiyon', 'Her karakter bir bilgi taşır. Düğme bile köşeli parantez içinde bir kelimedir.'],
                ['komut satırı', 'Her eylemin bir komutu var: Ctrl/⌘ + K ile palet, kabukta yazarak.'],
                ['saf veri yoğunluğu', 'Tablolar sıkı, sayılar sabit genişlikte ve sağa hizalı; boş alan yok.'],
                ['monospace hâkimiyeti', 'Tek bir yazı ailesi, tek bir boyut. Hiyerarşiyi kalınlık, büyük harf ve renk kurar.'],
              ].map(([k, v]) => (
                <li key={k} className="mt-[0.5lh] first:mt-0">
                  <span className="text-ok" aria-hidden="true">
                    [+]{' '}
                  </span>
                  <span className="font-bold text-hi">{k}</span>
                  <p className="pl-4 text-dim">{v}</p>
                </li>
              ))}
            </ul>
          </Man>
          <Man h="şekil ve derinlik">
            <p>
              <span className="text-hi">border-radius: 0</span>, <span className="text-hi">box-shadow: none</span>, <span className="text-hi">text-shadow: none</span>. Katman yoktur; odak ve seçim ters video ile gösterilir.
            </p>
          </Man>
          <Man h="doku">
            <p>Katı renkler. CRT ekran yanığı isteğe bağlıdır: tarama çizgileri ve sabit arayüzün soluk izi. Parlama eklemez.</p>
            <p className="mt-[0.5lh]">
              <Check checked={s.crt} onChange={s.setCrt}>
                crt efekti: tarama çizgisi ve ekran yanığı
              </Check>
            </p>
          </Man>
        </article>

        <div className="flex min-w-0 flex-col gap-y-[2lh]">
          <Box title="şekil: 0px · gölge: yok" right="madde 6 · 7">
            <div className="flex flex-wrap items-end gap-2">
              <div className="grid h-[4lh] w-12 place-items-center border border-fg">kutu</div>
              <div className="inv grid h-[4lh] w-12 place-items-center">ters</div>
              <div className="grid h-[4lh] w-12 place-items-center border border-dashed border-line text-dim">boş</div>
            </div>
            <p className="mt-[0.5lh] text-dim">Üç yüzey türü: çerçeveli, ters video, kesik çizgili (boş alan). Başka yok.</p>
          </Box>

          <Box title="ikonografi: ascii" right="madde 9">
            <AsciiTable
              caption="ASCII işaretleri ve anlamları"
              rows={ASCII_IKON as { k: string; anlam: string; ornek: string }[]}
              getId={(r) => r.k}
              columns={[
                { key: 'k', label: 'işaret', get: (r) => r.k },
                { key: 'anlam', label: 'anlam', get: (r) => r.anlam },
                { key: 'ornek', label: 'örnek', get: (r) => r.ornek },
              ]}
            />
          </Box>

          <Box title="tipografik ızgara" right="madde 12">
            <p>Figma'da bileşen yerine metin ızgarası: Auto Layout aralıkları karakter hücresinin katlarıdır. Burada da öyle: yatay adım 1ch, dikey adım 1lh; Tailwind'de p-4 dört karakterdir.</p>
            <pre className="ascii mt-[0.5lh] text-dim" aria-hidden="true">
              {'+--1ch--+\n|   A   |  1lh\n+-------+'}
            </pre>
            <p className="mt-[0.5lh]">
              <Check checked={s.izgara} onChange={s.setIzgara}>
                ızgarayı sayfanın üstüne çiz (1ch × 1lh)
              </Check>
            </p>
          </Box>
        </div>
      </div>
    </Pane>
  )
}
