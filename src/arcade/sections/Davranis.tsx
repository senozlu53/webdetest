import { useEffect, useState } from 'react'
import { cx } from '../../shared/cx'
import { useArcade } from '../lib/store'
import { kontrast, oran } from '../lib/contrast'
import { ANIM, png, type AnimAd } from '../lib/sprites'
import { ArcadeText } from '../components/ArcadeText'
import { Ayarlar } from '../components/Header'
import { PixelButton } from '../components/PixelButton'
import { PixelContainer } from '../components/PixelContainer'
import { Ikon, SpriteAnim } from '../components/Sprite'
import { Aralik, Kod, Section, Secim } from '../components/ui'

/** Madde 16: kare kare sprite ve yanıp sönen çağrı metni */
export function Hareket() {
  const s = useArcade()
  const [anim, setAnim] = useState<AnimAd>('jeton')
  const [fps, setFps] = useState(8)
  const [oyna, setOyna] = useState(s.hareket)
  const [kare, setKare] = useState(0)
  const [hz, setHz] = useState<'1' | '2'>('1')
  const a = ANIM[anim]
  const n = a.kareler.length
  useEffect(() => {
    if (!oyna) return
    const t = window.setInterval(() => setKare((k) => (k + 1) % n), 1000 / fps)
    return () => window.clearInterval(t)
  }, [oyna, fps, n])
  return (
    <Section id="hareket" madde="Madde 16 · Hareket dili" title="Kare kare" ton="sari" lead="Ara kare (tween) yok, yumuşatma eğrisi yok. Sprite bir kareden ötekine atlar; CSS'te animation-timing-function: steps(n). Tek sürekli hareket, çağrı metninin yanıp sönmesi.">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <PixelContainer ton="sari" className="min-w-0 p-5">
          <Secim<AnimAd> legend="Sprite" name="hr-anim" value={anim} onChange={(v) => { setAnim(v); setKare(0) }} options={(Object.keys(ANIM) as AnimAd[]).map((k) => ({ id: k, ad: ANIM[k].ad.split(' ').slice(-1)[0] }))} />
          <div className="mt-6 flex flex-wrap items-center gap-8">
            <div className="grid size-[calc(var(--u)*56)] shrink-0 place-items-center bg-[#000] shadow-[0_0_0_var(--u)_var(--edge)]">
              <SpriteAnim anim={anim} buyukluk={3} oynat={false} kare={kare} etiket={`${a.ad}, kare ${kare + 1} / ${n}`} />
            </div>
            <ol className="m-0 flex list-none flex-wrap gap-2 p-0" aria-label="Kare şeridi">
              {a.kareler.map((_, i) => (
                <li key={i} className="grid justify-items-center gap-1">
                  <span className={cx('block bg-[#000] p-1', i === kare ? 'shadow-[0_0_0_var(--u)_var(--yellow)]' : 'shadow-[0_0_0_var(--u)_var(--lo-white)]')} aria-current={i === kare ? 'step' : undefined}>
                    <span className="sprite block size-[calc(var(--u)*16)]" style={{ backgroundImage: `url(${png(a.kareler)})`, ['--kare' as string]: n, ['--i' as string]: i }} />
                  </span>
                  <span className="tabnum">{i + 1}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <PixelButton ton={oyna ? 'beyaz' : 'yesil'} onClick={() => setOyna(!oyna)} ikon={<Ikon ad={oyna ? 'dur' : 'oynat'} buyukluk={1} />} data-hr-oyna="">
              {oyna ? 'Durdur' : 'Oynat'}
            </PixelButton>
            <PixelButton ton="camgobegi" onClick={() => setKare((k) => (k + 1) % n)} disabled={oyna} ikon={<Ikon ad="adim" buyukluk={1} />}>
              Kare
            </PixelButton>
          </div>
          <div className="mt-6">
            <Aralik label="Kare hızı" value={fps} min={2} max={12} onChange={setFps} format={(v) => `${v} kare/sn`} />
          </div>
          {!s.hareket ? <p className="mt-4 text-muted">Hareket kapalı: sprite'lar ilk karede durur. Burada Oynat'a basarsanız yalnız bu örnek oynar.</p> : null}
        </PixelContainer>
        <div className="grid min-w-0 content-start gap-8">
          <PixelContainer ton="kirmizi" className="min-w-0 p-5 text-center">
            <ArcadeText as="p" boyut="m" ton="kirmizi" yanip hz={+hz as 1 | 2} lang="en">
              Insert coin
            </ArcadeText>
            <p className="mt-3 font-ps text-s uppercase" data-ton="sari">
              <span className="text-tx">Jeton at</span>
            </p>
            <div className="mt-5 flex justify-center">
              <Secim legend="Yanıp sönme hızı" name="hr-hz" value={hz} onChange={setHz} ton="kirmizi" options={[{ id: '1', ad: '1 Hz' }, { id: '2', ad: '2 Hz' }]} />
            </div>
            <p className="mt-4 text-left text-muted">
              Üst sınır 2 Hz: saniyede üç parlamanın altında kalır. Hareket {s.hareket ? 'açık' : 'kapalı'}
              {s.hareket ? '' : ': metin sabit duruyor'}. Ayarlardan ya da aşağıdaki Erişim bölümünden kapanır.
            </p>
          </PixelContainer>
          <Kod label="Kare kare CSS">{`.sprite[data-oynat] {
  /* 4 kare, 140 ms: ara kare yok */
  animation: kare 560ms steps(4) infinite;
}
.blink { animation: blink 1s steps(1, end) infinite; }
@keyframes blink { 50% { opacity: 0 } }

:root[data-motion='off'] .blink { animation: none; }`}</Kod>
        </div>
      </div>
    </Section>
  )
}

/** Madde 17: tam sayı ölçek */
export function Olcek() {
  const s = useArcade()
  const [w, setW] = useState(() => window.innerWidth)
  useEffect(() => {
    const f = () => setW(document.documentElement.clientWidth)
    f()
    window.addEventListener('resize', f)
    return () => window.removeEventListener('resize', f)
  }, [])
  const SATIR = [
    ['< 768 px', 2, 'Telefon'],
    ['768–1439 px', 3, 'Tablet, dizüstü'],
    ['≥ 1440 px', 4, 'Masaüstü'],
  ] as const
  return (
    <Section id="olcek" madde="Madde 17 · Responsive" title="Tam sayı ölçek" ton="camgobegi" lead="Ekran büyüdükçe arayüz 2x, 3x, 4x büyür; 2,5x yoktur. Yazı boyu, boşluk, kenar, gölge ve sprite aynı birimden (--u) türediği için birlikte ve eşit büyür.">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <PixelContainer ton="camgobegi" className="min-w-0 p-5">
          <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 tabnum text-body-l" data-olcek-oku="">
            <dt className="text-muted">Ölçek</dt>
            <dd className="m-0">
              <span data-ton="camgobegi" className="font-ps text-m text-tx">
                {s.olcek.k}x
              </span>{' '}
              {s.olcekTercih === 'oto' ? '(otomatik)' : '(sabit)'}
            </dd>
            <dt className="text-muted">1 sanal piksel</dt>
            <dd className="m-0">
              {String(Math.round(s.olcek.u * 100) / 100).replace('.', ',')} CSS px · {s.olcek.aygit} aygıt px
            </dd>
            <dt className="text-muted">Piksel oranı</dt>
            <dd className="m-0">{String(s.olcek.dpr).replace('.', ',')}</dd>
            <dt className="text-muted">Görünür genişlik</dt>
            <dd className="m-0">{w} px</dd>
          </dl>
          <div className="mt-6 flex items-end gap-1" aria-hidden="true">
            {Array.from({ length: 8 }, (_, i) => (
              <span key={i} className={cx('block size-[var(--u)]', i % 2 ? 'bg-[var(--t-cyan)]' : 'bg-ink')} />
            ))}
            <span className="ml-3 text-muted">8 sanal piksel</span>
          </div>
          <p className="mt-6 text-muted">Piksel oranı kesirliyse (1,25 · 1,5) --u, en yakın tam aygıt pikseline yuvarlanır. Böylece 3x ölçekte her sanal piksel 4 aygıt pikseli olur, kimi 3 kimi 4 olmaz.</p>
        </PixelContainer>
        <PixelContainer className="min-w-0 p-5">
          <table className="w-full tabnum">
            <caption className="mb-4 text-left">
              <ArcadeText boyut="s">Kırılma noktaları</ArcadeText>
            </caption>
            <thead>
              <tr className="font-ps text-xs uppercase shadow-[0_var(--u)_0_0_var(--edge)]">
                <th scope="col" className="py-2 text-left font-normal">
                  Genişlik
                </th>
                <th scope="col" className="py-2 text-left font-normal">
                  Kat
                </th>
                <th scope="col" className="py-2 text-left font-normal">
                  Gövde
                </th>
              </tr>
            </thead>
            <tbody>
              {SATIR.map(([g, k, ad]) => (
                <tr key={k} className={cx('text-body-l', s.olcek.k === k && 'bg-[var(--cyan)] text-[#000]')} aria-current={s.olcek.k === k ? 'true' : undefined}>
                  <td className="py-2 pl-2">
                    {g} <span className={s.olcek.k === k ? '' : 'text-muted'}>· {ad}</span>
                  </td>
                  <td className="py-2">{k}x</td>
                  <td className="py-2 pr-2">{[20, 24, 28][k - 2]} px</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-6">
            <Secim legend="Ölçeği sabitle" name="ol-sabit" value={s.olcekTercih} onChange={s.setOlcekTercih} ton="camgobegi" options={[{ id: 'oto', ad: 'Oto' }, { id: '2', ad: '2x' }, { id: '3', ad: '3x' }, { id: '4', ad: '4x' }]} />
          </div>
          <p className="mt-4 text-muted">Sabit ölçek de ekrana sığmak zorunda: en az 110 sanal piksel genişlik kalır, 320px'lik telefonda 4x seçilse de 2x çizilir. Oyun tuvali aynı kuralla kutusuna sığan en büyük tam katı seçer; artan yer siyah bant olur.</p>
        </PixelContainer>
      </div>
    </Section>
  )
}

/** Madde 18: yüksek kontrast, yanıp sönme kapatılabilir */
export function Erisim() {
  const s = useArcade()
  const acik = s.theme === 'light'
  const zemin = acik ? '#FFFFFF' : '#000000'
  const CIFT: [string, string, string][] = acik
    ? [
        ['Gövde metni', '#000000', zemin],
        ['İkincil metin', '#3A3A3A', zemin],
        ['Kırmızı yazı', '#C00000', zemin],
        ['Sarı yazı (zeytin)', '#6B6100', zemin],
        ['Yeşil yazı', '#006E00', zemin],
        ['Bağlantı', '#006B6B', zemin],
        ['Sarı düğme', '#000000', '#FFEA00'],
        ['Kırmızı düğme', '#000000', '#FF0000'],
      ]
    : [
        ['Gövde metni', '#FFFFFF', zemin],
        ['İkincil metin', '#BDBDBD', zemin],
        ['Kırmızı yazı', '#FF0000', zemin],
        ['Sarı yazı', '#FFEA00', zemin],
        ['Yeşil yazı', '#00FF00', zemin],
        ['Bağlantı', '#00FFFF', zemin],
        ['Sarı düğme', '#000000', '#FFEA00'],
        ['Kırmızı düğme', '#000000', '#FF0000'],
      ]
  return (
    <Section id="erisim" madde="Madde 18 · Erişilebilirlik" title="Yüksek kontrast, kapanabilir ışık" ton="yesil" lead="Siyah zeminde beyaz 21:1; en zayıf çift kırmızı 5,25:1. Sürekli yanıp sönen ışık, kayan bant ve gren tek düğmeyle kapanır; işletim sisteminde hareket azaltma açıksa kapalı başlar.">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <PixelContainer ton="yesil" basamak={2} className="min-w-0 p-5">
          <ArcadeText as="h3" boyut="s" ton="yesil">
            Ayarlar
          </ArcadeText>
          <div className="mt-5">
            <Ayarlar onek="er-" />
          </div>
        </PixelContainer>
        <PixelContainer className="min-w-0 p-5">
          <table className="w-full tabnum" data-kontrast="">
            <caption className="mb-4 text-left">
              <ArcadeText boyut="s">Kontrast · {acik ? 'Kılavuz' : 'Salon'}</ArcadeText>
            </caption>
            <thead>
              <tr className="font-ps text-xs uppercase shadow-[0_var(--u)_0_0_var(--edge)]">
                <th scope="col" className="py-2 text-left font-normal">
                  Çift
                </th>
                <th scope="col" className="py-2 text-right font-normal">
                  Oran
                </th>
                <th scope="col" className="py-2 text-right font-normal">
                  WCAG
                </th>
              </tr>
            </thead>
            <tbody>
              {CIFT.map(([ad, y, z]) => {
                const k = kontrast(y, z)
                return (
                  <tr key={ad} className="text-body-l">
                    <td className="py-1">
                      <span className="mr-3 inline-grid size-[calc(var(--u)*8)] place-items-center align-middle font-ps text-xs shadow-[0_0_0_1px_var(--lo-white)]" style={{ background: z, color: y }} aria-hidden="true">
                        A
                      </span>
                      {ad}
                    </td>
                    <td className="py-1 text-right">{oran(k)}</td>
                    <td className="py-1 text-right">{k >= 7 ? 'AAA' : k >= 4.5 ? 'AA' : 'Yetersiz'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </PixelContainer>
      </div>
      <ul className="m-0 mt-10 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 xl:grid-cols-3">
        {[
          ['Yanıp sönme', 'En çok 2 Hz, iki kare. Hareket kapalıysa metin sabit ve görünür kalır. Beş saniyeden uzun sürdüğü için durdurma düğmesi zorunlu: Ayarlar.'],
          ['Parlama yok', 'Oyunda can kaybı ekranı beyaza boyamaz; yalnız kahraman sprite\'ı kısa süre görünmez olur (hareket kapalıysa o da olmaz).'],
          ['Renk tek başına değil', 'Can çubuğu sayı ve KRİTİK yazısı taşır, kazanan takımın önünde ok var, nadirlik yazı ve yıldızla söylenir.'],
          ['En küçük yazı 16 px', 'Press Start 2P\'nin özgün 8 px boyu telefonda okunmaz; en küçük boy 16 px. Gövde VT323 20–28 px.'],
          ['Ekran okuyucu', 'CRT katmanı ve süs sprite\'ları gizli. HUD etiketlerinin Türkçe karşılığı var, oyun anlık durumu canlı bölgeden duyurur.'],
          ['Klavye', "Oyun, ad girişi ve piksel editörü klavyeyle çalışır. Odak halkası kesikli: Salon'da camgöbeği, Kılavuz'da mavi; iki piksel dışarıda."],
        ].map(([b, m]) => (
          <PixelContainer as="li" key={b} ton="beyaz" golge={1} className="p-5">
            <ArcadeText as="h3" boyut="xs">
              {b}
            </ArcadeText>
            <p className="mt-3">{m}</p>
          </PixelContainer>
        ))}
      </ul>
    </Section>
  )
}
