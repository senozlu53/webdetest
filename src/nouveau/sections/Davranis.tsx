import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { cx } from '../../shared/cx'
import { SUS_AYAR, damarAt, yaprakAt, sarmasikAt, kamci, sivri, type SusSeviye } from '../lib/bitki'
import { karis, kontrast, oran } from '../lib/contrast'
import { TEMA_RENK } from '../lib/data'
import { useNouveau } from '../lib/store'
import { DokuOrnek } from '../components/DokuKatmani'
import { Ayarlar } from '../components/Header'
import { Ikon } from '../components/Ikon'
import { BotanikKart, Cerceve, NouveauButton, PAY, SadePanel } from '../components/Nouveau'
import { Aralik, DalgaHat, Kod, Section, Secim } from '../components/ui'

/* ───────────────────────── Madde 16 · Hareket ───────────────────────── */

function Salinim({ gen, sure }: { gen: number; sure: number }) {
  const yapraklar = useMemo(
    () =>
      [
        [70, 190, -1.9, 96, 26],
        [120, 150, -0.2, 84, 22],
        [82, 122, -2.1, 78, 20],
        [136, 88, -0.35, 70, 18],
        [98, 60, -1.95, 62, 16],
      ] as const,
    [],
  )
  return (
    <svg
      viewBox="0 0 240 240"
      className="mx-auto h-auto w-full max-w-[320px]"
      role="img"
      aria-label="Rüzgârda sallanan yapraklar"
      style={
        {
          ['--salin-gen' as string]: gen,
          ['--salin-sure' as string]: `${sure}s`,
        } as CSSProperties
      }
      data-salinim=""
    >
      <g className="sus" data-goruldu="">
        <path d="M100 232C96 190 108 150 96 108C88 82 100 60 110 34" fill="none" stroke="var(--nv-sage)" strokeWidth="3.2" strokeLinecap="round" />
        {yapraklar.map(([x, y, a, b, e], i) => (
          <g
            key={i}
            className="sus-salin"
            style={{
              ['--d' as string]: `${i * 0.5}s`,
              transformOrigin: `${x}px ${y}px`,
            }}
          >
            <path d={i % 2 ? sarmasikAt(x, y, a, b * 1.1) : yaprakAt(x, y, a, b, e)} fill={['var(--nv-sage)', 'var(--nv-yaprak-a)', 'var(--nv-gold)'][i % 3]} fillOpacity=".92" stroke="var(--nv-gece)" strokeWidth=".6" strokeOpacity=".55" />
            <path d={damarAt(x, y, a, b)} fill="none" stroke="var(--nv-gece)" strokeWidth=".7" strokeOpacity=".5" />
          </g>
        ))}
        <g className="sus-salin" style={{ ['--d' as string]: '0.2s', transformOrigin: '110px 34px' }}>
          <path
            d={sivri(
              kamci(110, 34, 56, -1.3, {
                donus: 1.1,
                dalga: 0.5,
                us: 2.2,
                yon: 1,
                n: 36,
              }),
              3.4,
              0.5,
              0.9,
            )}
            fill="var(--nv-gold)"
          />
        </g>
      </g>
    </svg>
  )
}

export function Hareket() {
  const { hareket, hareketTercih } = useNouveau()
  const [hiz, setHiz] = useState(1)
  const [n, setN] = useState(0)
  const [gen, setGen] = useState(3.5)
  const [sure, setSure] = useState(7)
  return (
    <Section
      id="hareket"
      ikon="sarmasik"
      madde="Madde 16 · Hareket dili"
      title="Büyüyen, sallanan, akan"
      lead="Bitkiler ansızın belirmez, büyür: sarmaşık gövdesi çizilir, yapraklar uçtan açılır, kıvrımlar en son sarılır. Sonra yaprak yavaşça sallanır. Hız ve genlik ayarlanabilir; hareket kapalıyken her şey baştan görünür."
    >
      <div className="grid grid-cols-1 items-start gap-x-10 gap-y-10 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-7" data-hareket-sahne="">
          <div style={{ ['--hiz' as string]: hiz } as CSSProperties}>
            <BotanikKart key={n} tohum={21} kicker="Büyüme" baslik="Sarmaşık kendini çizer" className="w-full" data-buyume="">
              <p className="text-[18px]">Gövde çizgisi 3,2 sn’de uzar; yapraklar sırayla, hafif taşarak açılır.</p>
            </BotanikKart>
          </div>
        </div>
        <div className="grid grid-cols-1 min-w-0 content-start gap-6 lg:col-span-5">
          <SadePanel ic="p-6 sm:p-7">
            <div className="grid grid-cols-1 gap-4">
              <Aralik label="Büyüme süresi çarpanı" value={hiz} min={0.4} max={3} step={0.2} onChange={setHiz} format={(v) => `×${v.toFixed(1).replace('.', ',')}`} />
              <NouveauButton boy="k" onClick={() => setN((x) => x + 1)} ikon={<Ikon ad="girdap" boyut={18} />} data-oynat="">
                Yeniden oynat
              </NouveauButton>
              <DalgaHat />
              <p className="text-[17px]" data-hareket-durum="">
                Hareket <b>{hareket ? 'açık' : 'kapalı'}</b> <span className="text-soluk">({hareketTercih === 'oto' ? 'sistem tercihi' : 'ayardan'})</span>
              </p>
            </div>
          </SadePanel>
        </div>
      </div>

      <div className="mt-[var(--aralik)] grid grid-cols-1 items-center gap-x-10 gap-y-8 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-5">
          <SadePanel ic="p-5">
            <Salinim gen={gen} sure={sure} />
          </SadePanel>
        </div>
        <div className="grid grid-cols-1 min-w-0 gap-5 lg:col-span-6 lg:col-start-7">
          <h3 className="font-mono text-[clamp(20px,2.4vw,26px)] font-semibold">Salınım</h3>
          <Aralik label="Genlik" value={gen} min={0} max={9} step={0.5} onChange={setGen} format={(v) => `±${v.toFixed(1).replace('.', ',')}°`} />
          <Aralik label="Süre" value={sure} min={2} max={14} step={1} onChange={setSure} format={(v) => `${v} sn`} />
          <SadePanel ic="p-4 sm:p-5">
            <p className="max-w-[54ch] text-[17px] text-soluk">Her yaprak kendi kökünden döner ve farklı gecikmeyle başlar; hepsi aynı anda sallansaydı bitki değil saat sarkacı gibi görünürdü.</p>
          </SadePanel>
        </div>
      </div>

      <SadePanel className="mt-[var(--aralik)]" ic="p-6 sm:p-8">
        <div className="overflow-x-auto" role="region" aria-label="Hareket değerleri" tabIndex={0}>
          <table className="tablo w-full min-w-[620px] border-collapse text-[17px]" data-hareket-tablo="">
            <caption>Hareket değerleri</caption>
            <tbody>
              {[
                ['Sarmaşık gövdesi', '3,2 sn', 'cubic-bezier(.45, .05, .25, 1)', 'stroke-dashoffset 1 → 0'],
                ['Yaprak açılışı', '1,6 sn', 'cubic-bezier(.2, 1.1, .3, 1)', 'scale 0 → 1, köke göre, hafif taşar'],
                ['Salınım', '7 sn', 'ease-in-out, alternate', '±3,5° her yaprağın kendi kökünde'],
                ['Bölüm belirişi', '1,4 sn', 'cubic-bezier(.22, .61, .36, 1)', 'opaklık + 14 px yükseliş'],
                ['Düğme özsuyu', '0,85 sn', 'cubic-bezier(.3, .7, .2, 1)', 'dalgalı kenarlı dolgu alttan yükselir'],
                ['Alan alt çizgisi', '3,2 sn', 'doğrusal, döngü', 'odaktayken dalga kayar'],
              ].map(([a, b, c, d]) => (
                <tr key={a}>
                  <th scope="row" className="font-medium">
                    {a}
                  </th>
                  <td className="tabular-nums">{b}</td>
                  <td className="font-mono text-[13.5px]">{c}</td>
                  <td>{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SadePanel>
      <SadePanel className="mt-6 max-w-[64ch]" ic="p-4 sm:p-5">
        <p className="text-[16.5px] text-soluk">Hareket kapalıyken (ya da sistem hareketi azaltıyorsa) sarmaşık, yapraklar ve kıvrımlar ilk andan görünür; geçiş ve salınım yoktur.</p>
      </SadePanel>
    </Section>
  )
}

/* ───────────────────────── Madde 17 · Mobil ───────────────────────── */

const seviyeGenislik = (w: number): SusSeviye => (w >= 768 ? 'tam' : 'sade')

export function Mobil() {
  const [genislik, setGenislik] = useState(1100)
  const [elle, setElle] = useState<'oto' | SusSeviye>('oto')
  const seviye = elle === 'oto' ? seviyeGenislik(genislik) : elle
  const kutu = useRef<HTMLDivElement>(null)
  const [say, setSay] = useState({ yaprak: 0, kivrim: 0, cicek: 0 })
  useEffect(() => {
    const t = window.setTimeout(() => {
      const el = kutu.current
      if (!el) return
      const y = el.querySelectorAll('[data-tur="yaprak"]').length
      const k = el.querySelectorAll('[data-tur="kivrim"]').length
      const c = el.querySelectorAll('[data-tur="cicek"]').length
      setSay({ yaprak: y, kivrim: k, cicek: c })
    }, 250)
    return () => window.clearTimeout(t)
  }, [genislik, seviye])
  return (
    <Section
      id="mobil"
      ikon="dal"
      madde="Madde 17 · Responsive kurallar"
      title="Kıvrımlar kalır, süs azalır"
      lead="Karmaşık çerçeve küçük ekranda ekranı boğmasın diye sadeleşir: 768 px altında yaprak sayısı, kıvrım ve çiçek azalır, ölçek yüzde 82’ye iner; ama kontur yine dalgalıdır. Genişliği değiştirerek geçişi izleyin."
    >
      <div className="grid grid-cols-1 gap-x-10 gap-y-6 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-4">
          <SadePanel ic="p-6 sm:p-7">
            <div className="grid grid-cols-1 gap-5">
              <Aralik label="Ekran genişliği" value={genislik} min={300} max={1200} step={10} onChange={setGenislik} format={(v) => `${v}px`} />
              <Secim<'oto' | SusSeviye>
                legend="Süs seviyesi"
                name="mb-sus"
                value={elle}
                onChange={setElle}
                options={[
                  { id: 'oto', ad: 'Oto' },
                  { id: 'tam', ad: 'Tam' },
                  { id: 'sade', ad: 'Sade' },
                  { id: 'yalin', ad: 'Yalın' },
                ]}
              />
              <DalgaHat />
              <p className="text-[17px]" aria-live="polite" data-mobil-durum={seviye}>
                Çözülen seviye: <b>{{ tam: 'tam', sade: 'sade', yalin: 'yalın' }[seviye]}</b>
                <br />
                <span className="text-soluk" data-mobil-say={`${say.yaprak}/${say.kivrim}/${say.cicek}`}>
                  {say.yaprak} yaprak · {say.kivrim} kıvrım · {say.cicek} çiçek
                </span>
              </p>
            </div>
          </SadePanel>
        </div>
        <div className="min-w-0 lg:col-span-8">
          <div className="overflow-x-auto pb-2">
            <div ref={kutu} className="mx-auto" style={{ width: `min(${genislik}px, 100%)` }} data-mobil-kutu={genislik}>
              <Cerceve tohum={14} sus={seviye} katman={seviye === 'tam' ? 1 : 0} ayrisma={10} className="w-full">
                <p className="kicker">Süsen Müzesi</p>
                <h3 className="baslik mt-2 text-[clamp(26px,2.8vw,34px)]">Kıvrımın yüzyılı</h3>
                <p className="mt-2 text-[17.5px]">Salı–Pazar 10.00–18.00. Metin her genişlikte aynı düz panelde kalır.</p>
              </Cerceve>
            </div>
          </div>
        </div>
      </div>

      <SadePanel className="mt-[var(--aralik)]" ic="p-6 sm:p-8">
        <div className="overflow-x-auto" role="region" aria-label="Süs seviyeleri" tabIndex={0}>
          <table className="tablo w-full min-w-[640px] border-collapse text-[17px]" data-mobil-tablo="">
            <caption>Süs seviyeleri</caption>
            <thead>
              <tr>
                {['Seviye', 'Ne zaman', 'Kenar payı', 'Yaprak aralığı', 'Kıvrım', 'Çiçek', 'Ölçek'].map((b) => (
                  <th key={b} scope="col" className="etiket">
                    {b}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(['tam', 'sade', 'yalin'] as const).map((s) => (
                <tr key={s} data-seviye={s}>
                  <th scope="row" className="font-medium">
                    {{ tam: 'Tam', sade: 'Sade', yalin: 'Yalın' }[s]}
                  </th>
                  <td>
                    {
                      {
                        tam: '≥ 768 px',
                        sade: '< 768 px',
                        yalin: 'elle / az hareket',
                      }[s]
                    }
                  </td>
                  <td className="tabular-nums">{PAY[s]} px</td>
                  <td className="tabular-nums">{SUS_AYAR[s].aralik ? `${SUS_AYAR[s].aralik} px` : '—'}</td>
                  <td className="tabular-nums">{SUS_AYAR[s].kivrim}</td>
                  <td className="tabular-nums">{SUS_AYAR[s].cicek}</td>
                  <td className="tabular-nums">{s === 'tam' ? '100%' : s === 'sade' ? '82%' : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SadePanel>
      <Kod label="Süs seviyesi çözümü" className="mt-8" sar={false}>{`const sus = tercih === 'oto'
  ? (matchMedia('(max-width: 767px)').matches ? 'sade' : 'tam')
  : tercih   // 'tam' | 'sade' | 'yalin'`}</Kod>
    </Section>
  )
}

/* ───────────────────────── Madde 18 · Erişim ───────────────────────── */

export function Erisim() {
  const { tema } = useNouveau()
  const t = TEMA_RENK[tema]
  const [yog, setYog] = useState(60)
  const zemin = karis(t.zemin, t.dokRenk, yog / 100)
  const kMetin = kontrast(t.metin, zemin)
  const kSoluk = kontrast(t.soluk, zemin)
  const kPanel = kontrast(t.metin, t.panel)
  const kPanelSoluk = kontrast(t.soluk, t.panel)
  return (
    <Section
      id="erisim"
      ikon="tomurcuk"
      madde="Madde 18 · Erişilebilirlik ve varyantlar"
      title="Süs yoğun, metin sade"
      lead="Dekoratif hatların yoğunluğu okumayı zorlaştırabilir; bu yüzden metin bloğu hiçbir zaman süsün üstüne yazılmaz, her zaman düz ve dokusuz bir panelin içinde durur. Süs yoğunluğunu artırın: soldaki oran düşer, sağdaki sabit kalır."
    >
      <div className="mb-8 max-w-[420px]">
        <Aralik label="Süs yoğunluğu" value={yog} min={0} max={100} step={5} onChange={setYog} format={(v) => `%${v}`} />
      </div>
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2" data-erisim-demo="">
        <div className="min-w-0">
          <p className="kicker mb-2">✕ Süsün üstüne yazı</p>
          <div className="relative overflow-hidden rounded-[36px_10px_36px_10px] p-6 sm:p-8" style={{ background: zemin }} data-panelsiz="">
            <div className="absolute inset-0" style={{ opacity: yog / 100 }} aria-hidden="true">
              <DokuOrnek tur="duvar" />
            </div>
            <div className="relative">
              <p className="baslik text-[26px]">Müze saatleri</p>
              <p className="mt-2 text-[18px]">Salı–Pazar 10.00–18.00. Pazartesi kapalı.</p>
              <p className="mt-2 text-[16px] text-soluk">Son giriş 17.30.</p>
            </div>
          </div>
          <SadePanel className="mt-3" ic="px-4 py-2.5">
            <p className="text-[17px]" data-panelsiz-oran={kMetin.toFixed(2)}>
              Mürekkep {oran(kMetin)} · soluk {oran(kSoluk)} {kSoluk >= 4.5 ? '✓' : '✕ AA altı'}
            </p>
          </SadePanel>
        </div>
        <div className="min-w-0">
          <p className="kicker mb-2">✓ Düz panelde yazı</p>
          <div className="relative overflow-hidden rounded-[10px_36px_10px_36px] p-4 sm:p-6" style={{ background: zemin }} data-panelli="">
            <div className="absolute inset-0" style={{ opacity: yog / 100 }} aria-hidden="true">
              <DokuOrnek tur="duvar" />
            </div>
            <SadePanel className="relative" ic="p-5 sm:p-6">
              <p className="baslik text-[26px]">Müze saatleri</p>
              <p className="mt-2 text-[18px]">Salı–Pazar 10.00–18.00. Pazartesi kapalı.</p>
              <p className="mt-2 text-[16px] text-soluk">Son giriş 17.30.</p>
            </SadePanel>
          </div>
          <SadePanel className="mt-3" ic="px-4 py-2.5">
            <p className="text-[17px]" data-panelli-oran={kPanel.toFixed(2)}>
              Mürekkep {oran(kPanel)} · soluk {oran(kPanelSoluk)} ✓
            </p>
          </SadePanel>
        </div>
      </div>

      <div className="mt-[var(--aralik)] grid grid-cols-1 gap-x-10 gap-y-10 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-5">
          <SadePanel ic="p-6 sm:p-8">
            <h3 className="baslik text-[26px]">Varyantlar</h3>
            <div className="mt-5" data-erisim-ayarlar="">
              <Ayarlar onek="er-" />
            </div>
          </SadePanel>
        </div>
        <div className="min-w-0 lg:col-span-7">
          <SadePanel ic="p-6 sm:p-8">
            <h3 className="baslik text-[26px]">Kontrol listesi</h3>
            <ul className="m-0 mt-4 grid grid-cols-1 list-none gap-3 p-0 text-[17.5px]" data-erisim-liste="">
              {[
                ['Metin panelde', 'Gövde ve ikincil metin her zaman düz, dokusuz panelde.'],
                ['Kontrast', 'Yazı renkleri koyulaştırılmış sürümlerle en az 4,5:1; yüksek kontrast varyantı 7:1’in üstüne çıkar.'],
                ['Renk tek başına değil', 'Seçili öğe yaprak işareti ve kalın yazıyla, hata simge ve yazıyla belirtilir.'],
                ['Klavye', 'Bütün kontroller odaklanabilir; odak halkası 2 px ve dört yönde 4 px boşluklu.'],
                ['Hedef boyutu', 'Dokunma alanları en az 44 px.'],
                ['Ekran okuyucu', 'Süs SVG’leri gizli (aria-hidden); değişen durumlar aria-live ile duyurulur.'],
                ['Hareket', 'Sistem “hareketi azalt” dediğinde büyüme ve salınım kapanır, içerik baştan görünür.'],
                ['Süs seviyesi', 'Yalın seviyede sarmaşık tamamen kalkar, yalnız dalgalı kontur kalır.'],
              ].map(([a, b]) => (
                <li key={a} className="flex gap-3">
                  <Ikon ad="ok" boyut={22} className="mt-1 text-zeytin" />
                  <span>
                    <b>{a}.</b> <span className="text-soluk">{b}</span>
                  </span>
                </li>
              ))}
            </ul>
          </SadePanel>
        </div>
      </div>
      <div className={cx('mt-10 max-w-[640px]')}>
        <Kod label="Erişilebilir panel" sar={false}>{`<SadePanel>
  <p>Metin burada, dokusuz ve süssüz.</p>
</SadePanel>
/* .sade-panel { background: var(--panel); border-radius: 34px 10px 34px 10px } */`}</Kod>
      </div>
    </Section>
  )
}
