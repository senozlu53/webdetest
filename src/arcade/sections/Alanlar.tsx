import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { cx } from '../../shared/cx'
import { useArcade } from '../lib/store'
import { bip } from '../lib/ses'
import { AGAC, ESYALAR, NADIRLIK, TAKIMLAR, type Esya, type Takim, type Ton } from '../lib/data'
import { ArcadeText } from '../components/ArcadeText'
import { HealthBar } from '../components/HealthBar'
import { pad } from '../components/Header'
import { ALFABE, Oyun } from '../components/Oyun'
import { PixelButton } from '../components/PixelButton'
import { PixelContainer } from '../components/PixelContainer'
import { Ikon, Sprite, SpriteAnim } from '../components/Sprite'
import { Rozet, Section } from '../components/ui'

const takim = (id: string) => TAKIMLAR.find((t) => t.id === id)!
const SIRA_TON: Ton[] = ['sari', 'camgobegi', 'kirmizi']
const siraAd = (i: number) => `${i + 1}.`

/** Madde 10 · 11: espor turnuvası. Eleme ağacı ve sıralama tablosu (leaderboard) */
export function Turnuva() {
  const [sirala, setSirala] = useState<{ k: 'puan' | 'g' | 'ad'; ters: boolean }>({ k: 'puan', ters: true })
  const liste = [...TAKIMLAR].sort((a, b) => {
    const f = sirala.k === 'ad' ? a.ad.localeCompare(b.ad, 'tr') : (a[sirala.k] as number) - (b[sirala.k] as number)
    return sirala.ters ? -f : f
  })
  const baslik = (k: 'puan' | 'g' | 'ad', ad: string, sag?: boolean) => (
    <th scope="col" aria-sort={sirala.k === k ? (sirala.ters ? 'descending' : 'ascending') : undefined} className={cx('p-0 font-normal', sag && 'text-right')}>
      <button type="button" onClick={() => setSirala((s) => ({ k, ters: s.k === k ? !s.ters : k !== 'ad' }))} className={cx('inline-flex items-center gap-2 px-3 py-2 font-ps text-xs uppercase', sag && 'flex-row-reverse')}>
        {ad}
        <Ikon ad={sirala.k === k && !sirala.ters ? 'yukari' : 'asagi'} buyukluk={1} className={sirala.k === k ? '' : 'invisible'} />
      </button>
    </th>
  )
  const macSatir = (id: string, sk: number, kazandi: boolean | null) => {
    const t = takim(id)
    return (
      <div className={cx('flex items-center justify-between gap-3 px-3 py-1', kazandi && 'font-bold')} data-kazanan={kazandi ? '' : undefined}>
        <span className="flex min-w-0 items-center gap-2">
          <Ikon ad="sag" buyukluk={1} className={kazandi ? 'text-[var(--t-green)]' : 'invisible'} />
          <span data-ton={t.ton} className={cx('shrink-0 font-ps text-xs', kazandi ? 'text-tx' : 'text-muted')}>
            {t.kisa}
          </span>
          <span className={cx('truncate', kazandi === false && 'text-muted')}>{t.ad}</span>
        </span>
        <span className="tabnum">{sk}</span>
      </div>
    )
  }
  return (
    <Section id="turnuva" madde="Madde 10 · Espor turnuvası" title="Jeton Kupası" ton="kirmizi" lead="Sekiz takım, beş maçlık seriler. Kazanan tarafı hem ok işareti hem kalın yazı gösterir; renk tek başına bilgi taşımaz. Final devam ediyor.">
      <div className="overflow-x-auto pb-4" tabIndex={0} role="region" aria-label="Eleme ağacı, yatay kayar">
        <ol className="m-0 grid min-w-[calc(var(--u)*300)] list-none grid-cols-3 gap-8 p-0">
          {AGAC.map((tur, ti) => (
            <li key={tur.tur} className="grid content-around gap-6">
              <ArcadeText as="h3" boyut="xs" className="text-muted">
                {tur.tur}
              </ArcadeText>
              {tur.maclar.map((m, mi) => {
                const bitti = m.sa === 3 || m.sb === 3
                return (
                  <PixelContainer key={mi} ton={ti === 2 ? 'sari' : 'beyaz'} golge={ti === 2 ? 3 : 1} className="py-2" role="group" aria-label={`${tur.tur} ${mi + 1}: ${takim(m.a).ad} ${m.sa}, ${takim(m.b).ad} ${m.sb}${bitti ? '' : ', sürüyor'}`}>
                    {macSatir(m.a, m.sa, bitti ? m.sa > m.sb : null)}
                    {macSatir(m.b, m.sb, bitti ? m.sb > m.sa : null)}
                    {!bitti ? (
                      <p className="px-3 pt-1 font-ps text-xs uppercase" data-ton="kirmizi">
                        <span className="blink inline-flex items-center gap-2 text-tx">
                          <span className="inline-block size-[calc(var(--u)*3)] bg-current" aria-hidden="true" />
                          Canlı
                        </span>{' '}
                        <span className="text-muted">· 3. harita</span>
                      </p>
                    ) : null}
                  </PixelContainer>
                )
              })}
            </li>
          ))}
        </ol>
      </div>

      <PixelContainer basamak={2} className="mt-10 min-w-0 p-4 md:p-6">
        <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Sıralama tablosu, yatay kayar">
          <table className="w-full min-w-[calc(var(--u)*150)] tabnum">
            <caption className="mb-4 text-left">
              <ArcadeText boyut="s" ton="sari">
                Sıralama
              </ArcadeText>
              <span className="mt-1 block text-muted">Grup aşaması, 8 maç. Sütun başlığıyla sıralanır.</span>
            </caption>
            <thead>
              <tr className="shadow-[0_var(--u)_0_0_var(--edge)]">
                <th scope="col" className="px-3 py-2 text-left font-ps text-xs font-normal uppercase">
                  #
                </th>
                {baslik('ad', 'Takım')}
                {baslik('g', 'G', true)}
                <th scope="col" className="px-3 py-2 text-right font-ps text-xs font-normal uppercase">
                  M
                </th>
                {baslik('puan', 'Puan', true)}
              </tr>
            </thead>
            <tbody>
              {liste.map((t: Takim) => {
                const i = [...TAKIMLAR].sort((a, b) => b.puan - a.puan).indexOf(t)
                return (
                  <tr key={t.id} className="text-body-l">
                    <td className="px-3 py-2">
                      <span data-ton={SIRA_TON[i]} className={cx('font-ps text-xs', i < 3 ? 'text-tx' : 'text-muted')}>
                        {siraAd(i)}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span data-ton={t.ton} className="mr-3 font-ps text-xs text-tx">
                        {t.kisa}
                      </span>
                      {t.ad} <span className="text-muted max-sm:hidden">· {t.sehir}</span>
                    </td>
                    <td className="px-3 py-2 text-right">{t.g}</td>
                    <td className="px-3 py-2 text-right">{t.m}</td>
                    <td className="px-3 py-2 text-right">{pad(t.puan, 5)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </PixelContainer>
    </Section>
  )
}

/** Arcade usulü ad girişi: üç harf, yukarı/aşağı ile harf değişir. Klavyeden doğrudan harf de yazılır */
function AdGir({ onKaydet }: { onKaydet: (ad: string) => void }) {
  const [h, setH] = useState([0, 0, 0])
  const refs = useRef<(HTMLSpanElement | null)[]>([])
  useEffect(() => refs.current[0]?.focus(), [])
  const degis = (i: number, d: number) => setH((l) => l.map((v, j) => (j === i ? (v + d + ALFABE.length) % ALFABE.length : v)))
  const tus = (i: number) => (e: KeyboardEvent) => {
    const harf = e.key.toLocaleUpperCase('tr')
    if (e.key === 'ArrowUp') degis(i, 1)
    else if (e.key === 'ArrowDown') degis(i, -1)
    else if (e.key === 'ArrowRight') refs.current[Math.min(2, i + 1)]?.focus()
    else if (e.key === 'ArrowLeft') refs.current[Math.max(0, i - 1)]?.focus()
    else if (e.key === 'Enter') onKaydet(h.map((x) => ALFABE[x]).join(''))
    else if (ALFABE.includes(harf) && e.key.length === 1) {
      setH((l) => l.map((v, j) => (j === i ? ALFABE.indexOf(harf) : v)))
      refs.current[Math.min(2, i + 1)]?.focus()
    } else return
    e.preventDefault()
  }
  return (
    <PixelContainer ton="sari" golge={3} className="p-5" role="group" aria-labelledby="adgir-b" data-adgir="">
      <ArcadeText as="p" id="adgir-b" boyut="s" ton="sari">
        Adını gir
      </ArcadeText>
      <p className="mt-2 text-muted">Yukarı/aşağı ok harfi değiştirir, sağ/sol ok kutu değiştirir; harf yazmak da olur. Enter kaydeder.</p>
      <div className="mt-5 flex flex-wrap items-end gap-6">
        <div className="flex gap-4">
          {h.map((v, i) => (
            <div key={i} className="grid justify-items-center gap-2">
              <button type="button" tabIndex={-1} aria-hidden="true" className="p-1" onClick={() => degis(i, 1)}>
                <Ikon ad="yukari" />
              </button>
              <span ref={(el) => void (refs.current[i] = el)} role="spinbutton" tabIndex={0} aria-label={`${i + 1}. harf`} aria-valuenow={v} aria-valuemin={0} aria-valuemax={ALFABE.length - 1} aria-valuetext={ALFABE[v]} onKeyDown={tus(i)} className="px grid size-[calc(var(--u)*20)] place-items-center font-ps text-m" data-golge="0">
                {ALFABE[v]}
              </span>
              <button type="button" tabIndex={-1} aria-hidden="true" className="p-1" onClick={() => degis(i, -1)}>
                <Ikon ad="asagi" />
              </button>
            </div>
          ))}
        </div>
        <PixelButton ton="yesil" onClick={() => onKaydet(h.map((x) => ALFABE[x]).join(''))} data-adgir-kaydet="">
          Kaydet
        </PixelButton>
      </div>
    </PixelContainer>
  )
}

/** Madde 11: yüksek skor tablosu ve oynanabilir oyun */
export function OyunBolum() {
  const s = useArcade()
  const [bekleyen, setBekleyen] = useState<{ puan: number; bolum: number } | null>(null)
  const bitti = useCallback((puan: number, bolum: number) => {
    if (puan > 0) setBekleyen({ puan, bolum })
  }, [])
  return (
    <Section id="oyun" madde="Madde 10 · 11 · Oyun ve yüksek skor" title="Jeton Avcısı" ton="yesil" lead="Jetonları topla, kafataslarından kaç. Tuval 160×144 piksel ve kutuya sığan en büyük tam sayı katla büyür. Skor tabloya üç harfle girer, tablo bu tarayıcıda saklanır.">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <PixelContainer basamak={2} golge={3} className="min-w-0 p-4 md:p-5">
          <Oyun onBitti={bitti} />
        </PixelContainer>
        <div className="grid min-w-0 content-start gap-8">
          {bekleyen ? (
            <AdGir
              onKaydet={(ad) => {
                const sira = s.skorEkle({ ad, puan: bekleyen.puan, bolum: bekleyen.bolum })
                s.duyur(sira ? `${ad} ${bekleyen.puan} puanla tabloda ${sira}. sırada` : `${ad} ${bekleyen.puan} puan: tabloya giremedi`)
                setBekleyen(null)
              }}
            />
          ) : null}
          <PixelContainer ton="sari" className="min-w-0 p-4 md:p-5">
            <table className="w-full tabnum" data-skor-tablo="">
              <caption className="mb-4 text-left">
                <ArcadeText boyut="s" ton="sari" lang="en">
                  High score
                </ArcadeText>
                <span className="sr-only"> · Yüksek skorlar</span>
              </caption>
              <thead>
                <tr className="font-ps text-xs uppercase shadow-[0_var(--u)_0_0_var(--edge)]">
                  <th scope="col" className="py-2 pr-2 text-left font-normal">
                    Sıra
                  </th>
                  <th scope="col" className="px-2 py-2 text-left font-normal">
                    Ad
                  </th>
                  <th scope="col" className="px-2 py-2 text-right font-normal">
                    Skor
                  </th>
                  <th scope="col" className="py-2 pl-2 text-right font-normal">
                    Böl.
                  </th>
                </tr>
              </thead>
              <tbody>
                {s.skorlar.map((x, i) => (
                  <tr key={`${x.ad}-${x.puan}-${i}`} data-ton={SIRA_TON[i]} className={cx('text-body-l', x.yeni && 'bg-[var(--yellow)] text-[#000]')} data-yeni={x.yeni ? '' : undefined}>
                    <td className="py-1 pr-2">
                      <span className={cx('font-ps text-xs', !x.yeni && i < 3 && 'text-tx')}>{siraAd(i)}</span>
                    </td>
                    <td className="px-2 py-1 font-ps text-xs">
                      {x.ad}
                      {x.yeni ? (
                        <span className="blink ml-2 inline-flex align-middle">
                          <Ikon ad="sol" buyukluk={1} />
                          <span className="sr-only">yeni</span>
                        </span>
                      ) : null}
                    </td>
                    <td className="px-2 py-1 text-right">{pad(x.puan)}</td>
                    <td className="py-1 pl-2 text-right">{x.bolum}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </PixelContainer>
        </div>
      </div>
    </Section>
  )
}

/** Madde 10 · 11: RPG karakter ekranı. Can, mana ve deneyim çubukları; envanter ızgarası */
export function Rpg() {
  const s = useArcade()
  const [can, setCan] = useState(72)
  const [mana, setMana] = useState(40)
  const [xp, setXp] = useState(65)
  const [seviye, setSeviye] = useState(7)
  const [iksir, setIksir] = useState(3)
  const [sec, setSec] = useState<Esya>(ESYALAR[1])
  const [gunluk, setGunluk] = useState<string[]>(['Zindanın dördüncü katı. Bir balçık yaklaşıyor.'])
  const maxCan = 90 + seviye * 10
  const yaz = (t: string) => setGunluk((g) => [t, ...g].slice(0, 4))
  const hasar = () => {
    const h = 14 + ((can * 7) % 11)
    const yeni = Math.max(0, can - h)
    setCan(yeni)
    yaz(yeni ? `Balçık vurdu: −${h} can.` : 'Bayıldın. Köy tapınağında uyanacaksın.')
    if (s.ses) bip('vur')
  }
  const ic = () => {
    if (!iksir || can >= maxCan) return
    setIksir(iksir - 1)
    setCan(Math.min(maxCan, can + 30))
    yaz('Can iksiri: +30 can.')
    if (s.ses) bip('al')
  }
  const buyu = () => {
    if (mana < 15) return yaz('Mana yetmiyor.')
    setMana(mana - 15)
    const x = xp + 20
    if (x >= 100) {
      setSeviye(seviye + 1)
      setXp(x - 100)
      setCan(maxCan + 10)
      yaz(`Ateş topu! Balçık eridi. Seviye ${seviye + 1}!`)
      if (s.ses) bip('seviye')
    } else {
      setXp(x)
      yaz('Ateş topu: −15 mana, +20 deneyim.')
    }
  }
  const dinlen = () => {
    setMana(Math.min(60, mana + 20))
    yaz('Kamp ateşinde dinlendin: +20 mana.')
  }
  const STAT: [string, string, number][] = [
    ['Güç', 'GÜÇ', 14],
    ['Çeviklik', 'ÇEV', 9],
    ['Zekâ', 'ZEK', 17],
    ['Savunma', 'SAV', 11],
  ]
  return (
    <Section id="rpg" madde="Madde 10 · 11 · RPG arayüzü" title="Karakter ekranı" ton="eflatun" lead="Oyuncu sağlık çubuğu formun yerini alır: can, mana ve deneyim aynı segmentli bileşen. Can yarının altına inince sarı, çeyreğin altına inince kırmızı olur ve KRİTİK yazısı çıkar.">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <PixelContainer ton="eflatun" basamak={2} className="min-w-0 p-5">
          <div className="flex flex-wrap items-center gap-6">
            <div className="grid size-[calc(var(--u)*56)] shrink-0 place-items-center bg-[#000] shadow-[0_0_0_var(--u)_var(--edge)]">
              <SpriteAnim anim="kahraman" buyukluk={3} oynat={s.hareket} etiket="Şövalye Ayşe, yürüyor" />
            </div>
            <div className="min-w-0">
              <ArcadeText as="h3" boyut="m" ton="eflatun">
                Ayşe
              </ArcadeText>
              <p className="mt-2 text-body-l">
                Şövalye · <span className="tabnum">Sv {seviye}</span>
              </p>
              <p className="text-muted">İksir ×{iksir}</p>
            </div>
          </div>
          <div className="mt-6 grid gap-5">
            <HealthBar etiket="Can" deger={can} max={maxCan} tur="can" bolum={20} yukseklik={7} />
            <HealthBar etiket="Mana" deger={mana} max={60} tur="mana" bolum={12} />
            <HealthBar etiket="Deneyim" deger={xp} max={100} tur="xp" bolum={20} yukseklik={4} />
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <PixelButton ton="kirmizi" onClick={hasar} disabled={!can} data-rpg-hasar="">
              Hasar al
            </PixelButton>
            <PixelButton ton="yesil" onClick={ic} disabled={!iksir || can >= maxCan}>
              İksir iç
            </PixelButton>
            <PixelButton ton="camgobegi" onClick={buyu} disabled={!can}>
              Büyü
            </PixelButton>
            <PixelButton ton="beyaz" onClick={dinlen}>
              Dinlen
            </PixelButton>
          </div>
          <ol role="log" aria-live="polite" aria-label="Savaş günlüğü" className="m-0 mt-6 grid list-none gap-1 p-0">
            {gunluk.map((g, i) => (
              <li key={`${g}-${i}`} className={i ? 'text-muted' : ''}>
                <span aria-hidden="true">{i ? '  ' : '> '}</span>
                {g}
              </li>
            ))}
          </ol>
        </PixelContainer>
        <div className="grid min-w-0 content-start gap-8">
          <PixelContainer className="min-w-0 p-5">
            <ArcadeText as="h3" boyut="s">
              Nitelikler
            </ArcadeText>
            <dl className="m-0 mt-4 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3">
              {STAT.map(([ad, kisa, v]) => (
                <div key={kisa} className="contents">
                  <dt className="font-ps text-xs">
                    <abbr title={ad} className="no-underline">
                      {kisa}
                    </abbr>
                  </dt>
                  <dd className="m-0 flex gap-[var(--u)]" aria-hidden="true">
                    {Array.from({ length: 20 }, (_, i) => (
                      <i key={i} className="block h-[calc(var(--u)*4)] flex-1" style={{ background: i < v ? 'var(--t-magenta)' : 'var(--off)' }} />
                    ))}
                  </dd>
                  <dd className="m-0 tabnum">
                    <span className="sr-only">{ad} </span>
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
          </PixelContainer>
          <PixelContainer className="min-w-0 p-5">
            <ArcadeText as="h3" boyut="s">
              Envanter
            </ArcadeText>
            <ul className="m-0 mt-4 grid list-none grid-cols-4 gap-2 p-0" aria-label="Eşyalar">
              {ESYALAR.map((e) => (
                <li key={e.id}>
                  <button type="button" aria-pressed={sec.id === e.id} onClick={() => setSec(e)} aria-label={`${e.ad}, ${NADIRLIK[e.nadirlik].ad}`} className={cx('grid aspect-square w-full place-items-center bg-[#000]', sec.id === e.id ? 'shadow-[0_0_0_var(--u)_var(--yellow)]' : 'shadow-[0_0_0_var(--u)_var(--lo-white)]')}>
                    <Sprite ad={e.sprite} buyukluk={2} />
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-5 min-h-[calc(var(--u)*30)]" aria-live="polite">
              <p className="flex flex-wrap items-center gap-3">
                <ArcadeText boyut="xs" ton={NADIRLIK[sec.nadirlik].ton}>
                  {sec.ad}
                </ArcadeText>
                <Rozet ton={NADIRLIK[sec.nadirlik].ton}>{NADIRLIK[sec.nadirlik].ad}</Rozet>
              </p>
              <p className="mt-2">{sec.aciklama}</p>
              {sec.guc ? <p className="mt-1 tabnum text-muted">{sec.guc}</p> : null}
            </div>
          </PixelContainer>
        </div>
      </div>
    </Section>
  )
}

/** Madde 10: Web3 envanteri. Zincir üstü eşya kartları; sandık açılırken can çubuğu yükleyici olur */
export function Envanter() {
  const s = useArcade()
  const [sahip, setSahip] = useState<Esya[]>(ESYALAR.slice(4, 7))
  const [yuzde, setYuzde] = useState<number | null>(null)
  const sira = useRef(0)
  const zaman = useRef(0)
  useEffect(() => () => window.clearInterval(zaman.current), [])
  const ac = () => {
    if (yuzde !== null) return
    setYuzde(0)
    s.duyur('Sandık açılıyor')
    let p = 0
    zaman.current = window.setInterval(() => {
      p += 10
      setYuzde(p)
      if (p >= 100) {
        window.clearInterval(zaman.current)
        const e = ESYALAR[[0, 5, 1, 6, 7, 2, 4, 3][sira.current++ % 8]]
        setSahip((l) => [{ ...e, id: `${e.id}-${Date.now()}` }, ...l].slice(0, 8))
        setYuzde(null)
        s.duyur(`Sandıktan ${e.ad} çıktı: ${NADIRLIK[e.nadirlik].ad}`)
        if (s.ses) bip('seviye')
      }
    }, 120)
  }
  return (
    <Section id="envanter" madde="Madde 10 · Web3 arayüzü" title="Zincir envanteri" ton="camgobegi" lead="Oyun eşyaları kimlik numarasıyla listelenir. Nadirlik hem renk hem yazı hem yıldız sayısıyla söylenir. Bu bir tanıtım: cüzdan ve zincir yok, kimlikler uydurma.">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <PixelContainer ton="sari" basamak={2} golge={3} className="min-w-0 p-5">
          <div className="grid justify-items-center gap-5 text-center">
            <div className="grid place-items-center bg-[#000] p-4 shadow-[0_0_0_var(--u)_var(--edge)]">
              <Sprite ad={yuzde === null ? 'sandik' : 'sandikAcik'} buyukluk={4} alt={yuzde === null ? 'Kapalı sandık' : 'Açılan sandık'} />
            </div>
            <PixelButton ton="sari" boy="b" onClick={ac} disabled={yuzde !== null} data-sandik="">
              Sandık aç
            </PixelButton>
            <HealthBar className="w-full" etiket="Sandık açılıyor" tur="yukleme" deger={yuzde ?? 0} max={100} bolum={10} yukseklik={8} />
            <p className="text-muted">Yükleyici gerçek bir ilerleme çubuğu (role="progressbar"): 10 segment, her 120 ms'de bir dolar; ara kare yok.</p>
          </div>
        </PixelContainer>
        <ul className="m-0 grid min-w-0 list-none grid-cols-1 content-start gap-6 p-0 sm:grid-cols-2" aria-label="Sahip olunan eşyalar" data-envanter="">
          {sahip.map((e) => {
            const n = NADIRLIK[e.nadirlik]
            return (
              <PixelContainer as="li" key={e.id} ton={n.ton} golge={n.yildiz >= 3 ? 3 : 1} className="flex min-w-0 items-center gap-4 p-4">
                <span className="grid shrink-0 place-items-center bg-[#000] p-2">
                  <Sprite ad={e.sprite} buyukluk={2} />
                </span>
                <span className="grid min-w-0 gap-1">
                  <span className="truncate text-body-l">{e.ad}</span>
                  <span className="flex flex-wrap items-center gap-2">
                    <span data-ton={n.ton} className="font-ps text-xs text-tx uppercase">
                      {n.ad}
                    </span>
                    <span aria-label={`${n.yildiz} yıldız`} data-ton={n.ton} className="flex gap-[var(--u)] text-tx">
                      {Array.from({ length: n.yildiz }, (_, i) => (
                        <Ikon key={i} ad="yildiz" buyukluk={1} />
                      ))}
                    </span>
                  </span>
                  <span className="tabnum text-muted">
                    <abbr title="belirteç kimliği" className="no-underline">
                      ID
                    </abbr>{' '}
                    {e.belirtec}
                  </span>
                </span>
              </PixelContainer>
            )
          })}
        </ul>
      </div>
    </Section>
  )
}
