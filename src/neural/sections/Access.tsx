import { SettingsPanel } from '../components/Header'
import { Kbd, Panel, Section } from '../components/ui'

const K: [string, string, string, string, string][] = [
  ['Metin', '#EDEDF3', '#1E1E29', '14,15', 'AAA'],
  ['İkincil metin', '#A3A3B8', '#1E1E29', '6,67', 'AA'],
  ['Soluk metin (etiket)', '#8B8BA1', '#1E1E29', '4,95', 'AA'],
  ['Birincil düğme metni', '#0A0A0A', 'Gradient/Brand', 'en az 7,27', 'AAA'],
  ['İşlemde (sarı)', '#FACC15', '#1E1E29', '10,77', 'AAA'],
  ['Tamam (yeşil)', '#4ADE80', '#1E1E29', '9,47', 'AAA'],
  ['Hata (kırmızı)', '#F87171', '#1E1E29', '5,96', 'AA'],
  ['Bağlantı (mavi)', '#60A5FA', '#1E1E29', '6,49', 'AA'],
  ['Odak halkası', '#C7D2FE', '#0A0A0A', '13,27', 'grafik'],
  ['Seri: eğitim', '#3B82F6', '#111118', '5,11', 'grafik'],
  ['Seri: doğrulama', '#E0569A', '#111118', '5,34', 'grafik'],
  ['Seri: öğrenme oranı', '#8B5CF6', '#111118', '4,44', 'grafik'],
  ['Boştaki düğüm', '#71717A', '#111118', '3,89', 'grafik'],
  ['Kalite, en düşük adım', '#6366F1', '#111118', '4,21', 'grafik'],
]

const SHOW: [string, string][] = [
  ['Kahraman ağı', 'Çıktı düğmeleri ve olasılık yüzdeleri; ağ çizimi ekran okuyucudan gizli.'],
  ['Ajan zaman çizelgesi', 'Durum her adımda yazılı; etkin adım aria-current="step"; işlem günlüğü ve canlı duyurular.'],
  ['Kayıp ve öğrenme oranı', 'Ok tuşlarıyla okunan ipucu, doğrudan etiketler ve tablo görünümü.'],
  ['İşlemci ağacı', 'GPU tablosu; sıcaklık uyarısı ikon ve metinle.'],
  ['Veri haritası', 'Küme listesi, seçili örnek paneli ve incelenecek örnekler tablosu.'],
  ['Toz, ızgara, bulanıklık', 'Süs. Ekran okuyucudan gizli; Sade efekt ya da yüksek kontrastta kalkar.'],
]

export function Access() {
  return (
    <Section id="erisim" eyebrow="Madde 17 · 18 · Erişilebilirlik ve varyantlar" title="Gösteri parlak, veri net" lead="Stil yalnız koyu modda tasarlandı; açık tema yok, sayfa color-scheme: dark bildirir. Asıl ölçüt, görsel gösterinin arkasındaki verinin ve düğmelerin kontrast testinden geçmesi.">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <Panel title="Kontrast testi">
          <div className="scroll-x" tabIndex={0} role="region" aria-label="Kontrast tablosu, yatay kaydırılabilir">
            <table className="w-full min-w-[520px] text-left text-[14px]">
              <caption className="sr-only">Metin ve grafik renklerinin en kötü yüzeydeki kontrastı</caption>
              <thead className="label">
                <tr className="border-b border-line">
                  {['Rol', 'Renk', 'Yüzey', 'Oran', 'Sonuç'].map((h) => (
                    <th key={h} scope="col" className="py-2 pr-3 font-normal">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {K.map(([rol, c, y, o, r]) => (
                  <tr key={rol} className="border-b border-line last:border-0">
                    <th scope="row" className="py-1.5 pr-3 font-normal">
                      {rol}
                    </th>
                    <td className="py-1.5 pr-3">
                      <span className="flex items-center gap-2 font-mono text-[12px] mono-tight">
                        <span className="size-3 rounded-full border border-line-strong" style={{ background: c }} aria-hidden="true" />
                        {c}
                      </span>
                    </td>
                    <td className="py-1.5 pr-3 font-mono text-[12px] text-muted mono-tight">{y}</td>
                    <td className="py-1.5 pr-3 font-mono text-[12px] tabular-nums mono-tight">{o}:1</td>
                    <td className="py-1.5 text-muted">{r === 'grafik' ? 'Grafik, en az 3:1' : r}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[13px] text-muted">Metin satırları AA için en az 4,5:1, grafik öğeleri en az 3:1. Grafik renkleri renk körlüğü benzetimiyle de denendi (eğitim ve doğrulama arası ΔE 14,4); doğrulama serisi ayrıca kesik çizgi ve işaretçi taşır.</p>
        </Panel>

        <div className="grid min-w-0 content-start gap-4">
          <Panel title="Varyantlar">
            <SettingsPanel prefix="v-" />
            <p className="mt-4 text-[13px] text-muted">Yüksek kontrast: çizgiler ve ikincil metin açılır, parıltı ve bulanıklık kalkar. Sistemde zorunlu renkler açıksa gradyan metin düz metne döner.</p>
          </Panel>
          <Panel title="Klavye">
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-[14px]">
              <dt>
                <Kbd>Tab</Kbd>
              </dt>
              <dd className="text-muted">Her denetim, grafik ve harita sırayla odaklanır.</dd>
              <dt className="flex items-start gap-1">
                <Kbd>Sol</Kbd>
                <Kbd>Sağ</Kbd>
              </dt>
              <dd className="text-muted">Grafikte nokta nokta gezin; Shift ile 25 nokta.</dd>
              <dt className="flex items-start gap-1">
                <Kbd>+</Kbd>
                <Kbd>−</Kbd>
                <Kbd>0</Kbd>
              </dt>
              <dd className="text-muted">Haritada yakınlaştır, uzaklaştır, sığdır; oklar kaydırır.</dd>
              <dt className="flex items-start gap-1">
                <Kbd>Yukarı</Kbd>
                <Kbd>Aşağı</Kbd>
                <Kbd>Enter</Kbd>
              </dt>
              <dd className="text-muted">Model seçicide gezin ve seçin; Esc kapatır.</dd>
            </dl>
          </Panel>
        </div>
      </div>

      <Panel title="Gösterinin arkasındaki veri" className="mt-4">
        <ul className="grid gap-x-6 gap-y-3 md:grid-cols-2">
          {SHOW.map(([a, b]) => (
            <li key={a} className="flex gap-3 text-[14px]">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-violet" aria-hidden="true" />
              <span>
                <span className="text-ink">{a}:</span> <span className="text-muted">{b}</span>
              </span>
            </li>
          ))}
        </ul>
      </Panel>
    </Section>
  )
}
