import { BrutalistCard } from '../components/BrutalistCard'
import { Kbd, Section } from '../components/ui'
import { SettingsPanel } from '../components/Header'

const LIGHT: [string, string, string][] = [
  ['Siyah metin · kirli beyaz', '#000 / #F4F4F0', '19,05'],
  ['Siyah metin · sarı', '#000 / #FFD500', '14,77'],
  ['Siyah metin · beyaz kart', '#000 / #FFFFFF', '21,00'],
  ['İkincil metin · kirli beyaz', '#3A3A3A / #F4F4F0', '10,32'],
  ['Siyah metin · yeşil', '#000 / #00C16A', '8,84'],
  ['Siyah metin · kırmızı', '#000 / #FF4D3D', '6,38'],
  ['Siyah metin · mavi', '#000 / #3D7BFF', '5,48'],
]
const DARK: [string, string, string][] = [
  ['Beyaz metin · siyah', '#FFF / #000', '21,00'],
  ['İkincil metin · kart', '#C8C8C8 / #121212', '11,01'],
  ['Siyah metin · neon sarı', '#000 / #FFF000', '17,72'],
  ['Siyah metin · neon yeşil', '#000 / #39FF14', '15,49'],
  ['Siyah metin · neon pembe', '#000 / #FF3EA5', '6,48'],
  ['Siyah metin · neon kırmızı', '#000 / #FF3860', '5,99'],
]

function Table({ rows, caption }: { rows: [string, string, string][]; caption: string }) {
  return (
    <div className="scroll-x rounded-brut border-[3px] border-line" tabIndex={0} role="region" aria-label={`${caption}, yatay kaydırılabilir`}>
      <table className="w-full min-w-[420px] text-left">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b-[3px] border-line">
            {['Çift', 'Renkler', 'Oran'].map((h) => (
              <th key={h} scope="col" className="px-3 py-2 text-[13px] font-bold uppercase">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([a, b, c]) => (
            <tr key={a} className="border-b-[3px] border-line last:border-0">
              <th scope="row" className="px-3 py-2 font-bold">
                {a}
              </th>
              <td className="px-3 py-2 font-mono text-[13px]">{b}</td>
              <td className="px-3 py-2 font-display font-black">{c}:1</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Access() {
  return (
    <Section id="erisim" n="18" kicker="Madde 18 · Erişilebilirlik ve varyantlar" title="Sert ama okunur" lead="Kontrast zaten stilin kendisi: en düşük metin çifti 5,48:1. Koyu varyant siyah zemin, kalın beyaz çerçeve ve neon dolgu kullanır; neonların üstünde metin yine siyahtır.">
      <div className="grid gap-8 lg:grid-cols-12">
        <BrutalistCard className="lg:col-span-7">
          <h3 className="headline">Açık tema</h3>
          <div className="mt-5">
            <Table rows={LIGHT} caption="Açık temada kontrast" />
          </div>
          <h3 className="headline mt-8">Koyu tema</h3>
          <div className="mt-5">
            <Table rows={DARK} caption="Koyu temada kontrast" />
          </div>
        </BrutalistCard>
        <div className="grid content-start gap-8 lg:col-span-5">
          <BrutalistCard fill="yellow">
            <h3 className="headline">Varyantlar</h3>
            <div className="mt-5">
              <SettingsPanel prefix="v-" />
            </div>
          </BrutalistCard>
          <BrutalistCard fill="blue">
            <h3 className="headline">Klavye ve odak</h3>
            <ul className="mt-4 space-y-2.5 font-medium">
              <li>
                Odak halkası 3px kesik çizgi, 4px dışarıda: her zeminde 19:1 ve üstü.
              </li>
              <li>
                <Kbd>Sol</Kbd> <Kbd>Sağ</Kbd> sekmeler arasında gezer.
              </li>
              <li>
                Etiket alanında <Kbd>Enter</Kbd> ekler, boşken <Kbd>Backspace</Kbd> siler.
              </li>
              <li>Şeritler fareyle üstüne gelince ya da odakta durur; her şeridin durdurma düğmesi var.</li>
            </ul>
          </BrutalistCard>
        </div>
        <BrutalistCard fill="green" className="lg:col-span-12">
          <h3 className="headline">Renk tek başına bilgi taşımaz</h3>
          <ul className="mt-4 grid gap-3 font-medium md:grid-cols-2">
            {[
              'Hatalar kırmızı kutu, uyarı ikonu ve metinle; alan aria-invalid ile işaretli.',
              'Durum rozetleri yazılı: Yayında, Çalışıyor, İptal.',
              'Seçili çip hem dolu hem gölgesiz hem de onay işaretli.',
              'Kayan şeritlerin metni ekran okuyucuya bir kez okunur, kopyalar gizli.',
              'Bildirimler ve sepet değişiklikleri canlı bölgeden duyurulur.',
              'Hareket kapalıyken (ya da hareketi azalt tercihinde) şerit, damga ve sekme durur.',
            ].map((t) => (
              <li key={t} className="flex gap-2.5">
                <span className="mt-2 size-3 shrink-0 border-[3px] border-black bg-black" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
        </BrutalistCard>
      </div>
    </Section>
  )
}
