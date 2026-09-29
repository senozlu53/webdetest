import { useMemo, useState } from 'react'
import { cx } from '../../shared/cx'
import { egrilik, kamci, kontur, konturYol, sivri, type Nk } from '../lib/bitki'
import { karis, kontrast, oran } from '../lib/contrast'
import { DOKU_AD, RENKLER, TEMA_RENK } from '../lib/data'
import { BOTANIK_SIMGELERI, ISLEV_SIMGELERI, SIMGE_AD } from '../lib/simge'
import { useNouveau, type Doku } from '../lib/store'
import { DokuOrnek } from '../components/DokuKatmani'
import { Ikon } from '../components/Ikon'
import { BotanikKart, Cerceve, DalgaGorsel, NouveauButton, SadePanel } from '../components/Nouveau'
import { Aralik, Belir, Kod, Section } from '../components/ui'
import { useSize } from '../components/hooks'

/* ───────────────────────── Madde 4 · Palet ───────────────────────── */

const hex2 = (n: number) => n.toFixed(1).replace('.', ',')

export function Palet() {
  const { tema } = useNouveau()
  const t = TEMA_RENK[tema]
  const satirlar: [string, string, string, string, number][] = [
    ['Mürekkep', t.metin, t.panel, 'Gövde metni', 4.5],
    ['Soluk mürekkep', t.soluk, t.panel, 'İkincil metin', 4.5],
    ['Zeytin (yazı)', t.zeytin, t.panel, 'Vurgu, bağlantı', 4.5],
    ['Altın (yazı)', t.altin, t.panel, 'Üst yazı (kicker)', 4.5],
    ['Gül (yazı)', t.gul, t.panel, 'Hata, uyarı', 4.5],
    ['Mürekkep', t.metin, t.zemin, 'Sayfa zemini üstünde', 4.5],
    ['NouveauSage', '#6B8E23', t.panel, 'Yalnız çizgi, dolgu (≥3:1)', 3],
    ['Antik Altın', '#C5A059', t.panel, 'Yalnız süs, bilgi taşımaz', 3],
  ]
  return (
    <Section
      id="palet"
      ikon="yaprak"
      madde="Madde 4 · 13 · Renk"
      title="Zeytin, altın, gül ve gece"
      lead="Dört tanım rengi süs içindir: sarmaşık, çerçeve çizgisi, taç yaprak. Küçük yazıya yetecek kadar koyu olmadıkları için her birinin yazı sürümü ayrıca tanımlı. Renk kontrastı canlı hesaplanır; tema değiştikçe tablo da değişir."
    >
      <ul className="m-0 grid list-none grid-cols-2 gap-x-5 gap-y-8 p-0 sm:gap-x-8 sm:gap-y-10 lg:grid-cols-4" data-renkler="">
        {RENKLER.map((r, i) => (
          <Belir as="li" key={r.token} gecikme={i * 90} className={cx(i % 2 ? 'lg:mt-10' : '')}>
            <div className="yum-organik aspect-[5/4] w-full" style={{ background: r.hex }} data-swatch={r.hex} role="img" aria-label={`${r.ad} ${r.hex}`} />
            <SadePanel className="-mt-3" ic="p-4 sm:p-5">
              <p className="baslik-k text-[clamp(18px,2.2vw,23px)]">{r.ad}</p>
              <p className="rakam text-[clamp(18px,2vw,22px)]">{r.hex}</p>
              <p className="font-mono text-[12.5px] break-all text-soluk">{r.token}</p>
              <p className="mt-2 text-[16px] text-soluk">{r.rol}</p>
              <p className="mt-2 flex items-center gap-2 text-[15.5px]">
                <span className="size-4 shrink-0 rounded-[0_100%_0_100%]" style={{ background: r.yazi }} aria-hidden="true" />
                <span>
                  {r.yaziAd} <span className="font-mono text-[12.5px]">{r.yazi}</span>
                </span>
              </p>
            </SadePanel>
          </Belir>
        ))}
      </ul>

      <SadePanel className="mt-[var(--aralik)]" ic="sm:p-8">
        <div className="overflow-x-auto" role="region" aria-label="Kontrast tablosu" tabIndex={0}>
          <table className="tablo w-full min-w-[640px] border-collapse text-[17px]" data-kontrast-tablo="">
            <caption>Kontrast · {{ parsomen: 'Parşömen', zeytin: 'Zeytin', gece: 'Gece' }[tema]} teması</caption>
            <thead>
              <tr>
                {['Renk', 'Zemin', 'Oran', 'Kullanım', 'Sonuç'].map((b) => (
                  <th key={b} scope="col" className="etiket">
                    {b}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {satirlar.map(([ad, fg, bg, kullanim, hedef]) => {
                const k = kontrast(fg, bg)
                const gecti = k >= hedef
                return (
                  <tr key={ad + bg + kullanim} data-kontrast-satir={ad}>
                    <th scope="row" className="font-medium">
                      <span className="mr-2 inline-block size-3.5 rounded-[0_100%_0_100%] align-middle" style={{ background: fg }} aria-hidden="true" />
                      {ad}
                    </th>
                    <td className="font-mono text-[13px]">{bg.toUpperCase()}</td>
                    <td className="rakam" data-oran={k.toFixed(2)}>
                      {oran(k)}
                    </td>
                    <td className="text-soluk">{kullanim}</td>
                    <td>
                      <span className="font-bold">{gecti ? '✓ ' : '✕ '}</span>
                      {hedef === 3 ? (gecti ? 'Çizgi için yeterli' : 'Yalnız süs') : k >= 7 ? 'AAA' : gecti ? 'AA' : 'Yetersiz'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-6 max-w-[70ch] text-[16.5px] text-soluk">Antik Altın parşömen üstünde yaklaşık 2:1 verir; bu yüzden çerçeve çizgisi bilgi taşımaz, yalnız süstür. Seçim, hata ve odak durumları renge ek olarak biçim ve yazıyla da verilir.</p>
      </SadePanel>
    </Section>
  )
}

/* ───────────────────────── Madde 5 · Yazı ───────────────────────── */

export function Yazi() {
  const [metin, setMetin] = useState('Sarmaşığın kıvrımı')
  const [boy, setBoy] = useState(56)
  return (
    <Section
      id="yazi"
      ikon="dal"
      madde="Madde 5 · Yazı tipi"
      title="Kıvrımlı serif, el yazısı sarmaşığı"
      lead="Windsor, De Vinne ve Cheri ticari ya da lisanslı fontlardır; sayfa aynı ruhu açık lisanslı üç yüzle kurar. Başlıkta Metamorphous, vurgu ve rakamlarda Sansita Swashed, gövdede Alegreya: harflerin ucu bitkisel biçimde kıvrılır, gövde metni yine de rahat okunur."
    >
      <div className="grid grid-cols-1 gap-x-10 gap-y-10 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-8">
          <BotanikKart tohum={17} kicker="Typography/ArtisticSerif">
            <label htmlFor="yz-metin" className="etiket">
              Kendi metnin
            </label>
            <div className="alan-kap mt-1">
              <input id="yz-metin" className="alan" value={metin} maxLength={40} onChange={(e) => setMetin(e.target.value)} autoComplete="off" />
            </div>
            <p className="baslik mt-8 leading-[1.05]" style={{ fontSize: `min(${boy}px, 11vw)` }} data-ornek="baslik">
              {metin || '…'}
            </p>
            <p
              className="sus-yazi mt-3 text-zeytin"
              style={{
                fontSize: `min(${Math.round(boy * 0.6)}px, 8vw)`,
                lineHeight: 1.1,
              }}
              data-ornek="sus"
            >
              {metin || '…'}
            </p>
            <p
              className="mt-3"
              style={{
                fontSize: `${Math.max(19, Math.round(boy * 0.34))}px`,
                lineHeight: 1.3,
              }}
              data-ornek="metin"
            >
              {metin || '…'} · Öğrenci çağı, ığdır şehri, ĞÖŞÜ İÇ, 12.400 ₺
            </p>
            <div className="mt-6 max-w-[380px]">
              <Aralik label="Boy" value={boy} min={28} max={96} step={2} onChange={setBoy} format={(v) => `${v}px`} />
            </div>
          </BotanikKart>
        </div>
        <ul className="m-0 grid grid-cols-1 min-w-0 list-none content-start gap-8 p-0 lg:col-span-4">
          {[
            ['Metamorphous', 'font-baslik', 'Başlık · 400', 'Harf uçları kıvrık, gövde ağır: Windsor ve De Vinne’nin yerine. u harfi v’ye benzediği için 26 px altında kullanılmaz; ₺ ve rakam Alegreya’dan tamamlanır.'],
            ['Sansita Swashed', 'font-sus', 'Vurgu · 300–900', 'Sallantılı el yazısı formu: rakamlar, düğme yazısı, kapitel ve alıntı.'],
            ['Alegreya', 'font-metin', 'Gövde · 400–900', 'Kaligrafik tempo, geniş Türkçe kapsam; küçük boyda bile rahat.'],
          ].map(([ad, sinif, rol, ac]) => (
            <li key={ad}>
              <SadePanel ic="p-5">
                <p className="kicker">{rol}</p>
                <p className={cx(sinif, 'mt-1 text-[clamp(22px,2.6vw,34px)] leading-[1.1] [overflow-wrap:anywhere]')}>{ad}</p>
                <p className={cx(sinif, 'mt-2 text-[19px]')}>Aa Bb Çç Ğğ İi Iı Öö Şş Üü 0123456789 ₺</p>
                <p className="mt-2 text-[16px] text-soluk">{ac}</p>
              </SadePanel>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-[var(--aralik)] grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-12">
        <div className="min-w-0 md:col-span-7">
          <SadePanel ic="sm:p-9">
            <p className="kicker">Ölçek</p>
            <div className="mt-2 grid grid-cols-1 gap-1">
              {[
                ['Başlık 1', 'font-baslik text-[clamp(30px,4vw,52px)]', 'Zambağın gölgesi'],
                ['Başlık 2', 'font-baslik text-[clamp(26px,2.8vw,36px)]', 'Kıvrımlı sokak'],
                ['Başlık 3', 'font-baslik text-[26px]', 'Nilüfer havuzu'],
                ['Vurgu', 'font-sus text-[28px] text-zeytin', 'Yeni koleksiyon'],
                ['Gövde', 'text-[19px]', 'Sarmaşık, duvara tırmandığı yerde bile yolunu kendisi seçer.'],
                ['Etiket', 'kicker', 'Salon 2 · Su'],
              ].map(([ad, sinif, orn]) => (
                <div key={ad} className="grid grid-cols-[92px_1fr] items-baseline gap-x-4 py-1.5">
                  <span className="font-mono text-[12.5px] text-soluk">{ad}</span>
                  <span className={sinif}>{orn}</span>
                </div>
              ))}
            </div>
          </SadePanel>
        </div>
        <div className="min-w-0 md:col-span-5">
          <SadePanel ic="sm:p-8">
            <blockquote className="m-0">
              <p className="font-sus text-[clamp(24px,2.6vw,32px)] leading-[1.25] text-zeytin">“Doğada tek bir düz çizgi bile yok; çizgiyi sarmaşık öğretir.”</p>
              <footer className="mt-4 text-[16px] text-soluk">— Süsen Müzesi, giriş duvarı</footer>
            </blockquote>
          </SadePanel>
          <Kod label="Yazı tipi tokenları" className="mt-6" sar={false}>{`Typography/ArtisticSerif
  family  Metamorphous, Alegreya
  weight  400 · line-height 1.14
Typography/Accent
  family  Sansita Swashed · 500–600
Typography/Body
  family  Alegreya · 19px / 1.62`}</Kod>
        </div>
      </div>
    </Section>
  )
}

/* ───────────────────────── Madde 6 · Şekil ───────────────────────── */

export function Sekil() {
  const [genlik, setGenlik] = useState(8)
  const [boyu, setBoyu] = useState(140)
  const [asim, setAsim] = useState(0.7)
  const [us, setUs] = useState(4.2)
  const [tohum, setTohum] = useState(4)
  const [kutu, { w, h }] = useSize<HTMLDivElement>()
  const g = useMemo(() => {
    if (w < 40 || h < 40) return null
    const k = kontur(w, h, {
      tohum,
      genlik,
      dalgaBoyu: boyu,
      asimetri: asim,
      us,
      pay: 10,
    })
    return { yol: konturYol(k), olcum: egrilik(k) }
  }, [w, h, tohum, genlik, boyu, asim, us])

  // kamçı atölyesi
  const [donus, setDonus] = useState(1.3)
  const [dalga, setDalga] = useState(0.7)
  const [kalin, setKalin] = useState(11)
  const [ustel, setUstel] = useState(2.4)
  const { egriler, kutuVB } = useMemo(() => {
    const dizi: [Nk[], number][] = [
      [kamci(0, 0, 250, -0.55, { donus, dalga, us: ustel, yon: -1, n: 64 }), 1],
      [
        kamci(70, 20, 200, -0.2, {
          donus: donus * 0.85,
          dalga,
          us: ustel,
          yon: 1,
          n: 64,
        }),
        0.78,
      ],
      [
        kamci(30, 40, 150, -0.75, {
          donus: donus * 0.7,
          dalga,
          us: ustel,
          yon: -1,
          n: 64,
        }),
        0.56,
      ],
    ]
    const tum = dizi.flatMap(([p]) => p)
    const xs = tum.map((q) => q[0])
    const ys = tum.map((q) => q[1])
    const pad = kalin + 6
    const x0 = Math.min(...xs) - pad
    const y0 = Math.min(...ys) - pad
    const w = Math.max(...xs) - Math.min(...xs) + pad * 2
    const h = Math.max(...ys) - Math.min(...ys) + pad * 2
    const en = Math.max(w, h * (4 / 3))
    return {
      egriler: dizi.map(([p, k]) => sivri(p, kalin * k, 0.6, 0.85)),
      kutuVB: `${x0 - (en - w) / 2} ${y0 - (en * 0.75 - h) / 2} ${en} ${en * 0.75}`,
    }
  }, [donus, dalga, kalin, ustel])

  return (
    <Section
      id="sekil"
      ikon="girdap"
      madde="Madde 6 · 3 · Şekil dili"
      title="Ne düz, ne dik"
      lead="Her kenar dalgalıdır: dış çerçeve bir süper elips üzerine bindirilen üç dalga toplamıdır, hiçbir yerde düz parça ya da dik köşe kalmaz. Aşağıda kontur ve kamçı kıvrımını kendiniz kurabilirsiniz; en sıkı dönüş ve en uzun düz parça canlı ölçülür."
    >
      <div className="grid grid-cols-1 gap-x-10 gap-y-10 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-7">
          <div ref={kutu} className="relative aspect-[16/11] w-full" data-kontur-alani="">
            {g ? (
              <svg className="absolute inset-0 overflow-visible" width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Ayarlanabilir dalgalı kontur">
                <path d={g.yol} fill="var(--panel)" stroke="var(--nv-gold)" strokeWidth="2.2" data-kontur-yolu="" />
              </svg>
            ) : null}
          </div>
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3" aria-live="polite" data-kontur-olcum="">
            <p>
              <span className="kicker block">En sıkı yarıçap</span>
              <span className="rakam text-[28px]" data-min-r={g ? g.olcum.minYaricap.toFixed(1) : ''}>
                {g ? hex2(g.olcum.minYaricap) : '—'} px
              </span>
            </p>
            <p>
              <span className="kicker block">En uzun düz parça</span>
              <span className="rakam text-[28px]" data-duz={g ? g.olcum.duzParca.toFixed(1) : ''}>
                {g ? hex2(g.olcum.duzParca) : '—'} px
              </span>
            </p>
            <p>
              <span className="kicker block">Dik köşe</span>
              <span className="rakam text-[28px]">0</span>
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 min-w-0 content-start gap-5 lg:col-span-5">
          <SadePanel ic="p-6 sm:p-7">
            <div className="grid grid-cols-1 gap-4">
              <Aralik label="Genlik" value={genlik} min={0} max={18} step={1} onChange={setGenlik} format={(v) => `${v}px`} />
              <Aralik label="Dalga boyu" value={boyu} min={60} max={280} step={10} onChange={setBoyu} format={(v) => `${v}px`} />
              <Aralik label="Asimetri" value={asim} min={0} max={1} step={0.05} onChange={setAsim} format={(v) => v.toFixed(2).replace('.', ',')} />
              <Aralik label="Kare eğilimi" value={us} min={2} max={6} step={0.2} onChange={setUs} format={(v) => v.toFixed(1).replace('.', ',')} />
              <NouveauButton boy="k" onClick={() => setTohum((n) => (n % 30) + 1)} ikon={<Ikon ad="girdap" boyut={18} />} data-yeni-tohum="">
                Yeni kontur
              </NouveauButton>
            </div>
          </SadePanel>
          <Kod label="Border/OrganicCurve" sar={false}>{`Border/OrganicCurve
  genlik      ${genlik}px
  dalgaBoyu   ${boyu}px
  asimetri    ${asim.toFixed(2)}
  ust         ${us.toFixed(1)}   (2 = elips)
  tohum       ${tohum}`}</Kod>
        </div>
      </div>

      <div className="mt-[var(--aralik)] grid grid-cols-1 gap-x-10 gap-y-10 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-7">
          <SadePanel ic="p-4 sm:p-6">
            <svg viewBox={kutuVB} className="h-auto w-full" role="img" aria-label="Kamçı kıvrımları" data-kamci-svg="">
              {egriler.map((d, i) => (
                <path key={i} d={d} fill={['var(--nv-gece)', 'var(--nv-sage)', 'var(--nv-gold)'][i]} />
              ))}
            </svg>
          </SadePanel>
        </div>
        <div className="grid grid-cols-1 min-w-0 content-start gap-6 lg:col-span-5">
          <SadePanel ic="p-6 sm:p-7">
            <div className="grid grid-cols-1 gap-4">
              <Aralik label="Dönüş" value={donus} min={0.4} max={2.2} step={0.1} onChange={setDonus} format={(v) => `${v.toFixed(1).replace('.', ',')} tur`} />
              <Aralik label="S dalgası" value={dalga} min={0} max={1.6} step={0.1} onChange={setDalga} format={(v) => v.toFixed(1).replace('.', ',')} />
              <Aralik label="Kalınlık" value={kalin} min={4} max={22} step={1} onChange={setKalin} format={(v) => `${v}px`} />
              <Aralik label="Sıkılaşma" value={ustel} min={1.2} max={3.6} step={0.1} onChange={setUstel} format={(v) => v.toFixed(1).replace('.', ',')} />
            </div>
          </SadePanel>
          <SadePanel ic="p-6 sm:p-7">
            <p className="kicker">Karşılaştırma</p>
            <ul className="m-0 mt-3 grid grid-cols-1 list-none gap-3 p-0 text-[17px]" data-sekil-karsi="">
              <li className="flex items-baseline justify-between gap-4">
                <span>Dik kart (0 px)</span>
                <span className="font-mono text-[13px]">düz parça = kenar boyu</span>
              </li>
              <li className="flex items-baseline justify-between gap-4">
                <span>Yuvarlak köşe (16 px)</span>
                <span className="font-mono text-[13px]">kenar − 32 px</span>
              </li>
              <li className="flex items-baseline justify-between gap-4 font-bold">
                <span>Organik kontur</span>
                <span className="font-mono text-[13px]">{g ? hex2(g.olcum.duzParca) : '—'} px</span>
              </li>
            </ul>
          </SadePanel>
        </div>
      </div>
    </Section>
  )
}

/* ───────────────────────── Madde 7 · Derinlik ───────────────────────── */

export function Derinlik() {
  const [katman, setKatman] = useState(2)
  const [ayr, setAyr] = useState(14)
  const [egim, setEgim] = useState(1.6)
  return (
    <Section
      id="derinlik"
      ikon="nilufer"
      madde="Madde 7 · Z ekseni"
      title="Gölge yok, üst üste biniş var"
      lead="Derinlik, kutu gölgesiyle değil çerçevelerin birbirinin üstüne binmesiyle kurulur: arkadaki çerçeve biraz kayar, biraz eğilir ve rengi bir ton kayar. Katman sayısını, kaymayı ve eğimi ayarlayın."
    >
      <div className="grid grid-cols-1 gap-x-10 gap-y-10 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-8" data-derinlik-sahne="">
          <Cerceve tohum={9} katman={katman} ayrisma={ayr} egim={egim} className="w-full" genlik={6} dalgaBoyu={170}>
            <div className="grid grid-cols-1 items-center gap-x-8 gap-y-6 sm:grid-cols-12">
              <div className="min-w-0 sm:col-span-7">
                <p className="kicker">Katman sayısı · {katman + 1}</p>
                <h3 className="baslik mt-2 text-[clamp(26px,3vw,40px)]">Öndeki panel her zaman sade</h3>
                <p className="mt-3 text-[18px]">Arkadaki katmanlar yalnız renk ve kontur taşır. Metin yalnızca en öndeki düz panelde durur.</p>
              </div>
              <div className="min-w-0 sm:col-span-5">
                <DalgaGorsel sahne="zambak" oran="1 / 1" tohum={5} sus="yalin" className="mx-auto w-full max-w-[240px]" />
              </div>
            </div>
          </Cerceve>
        </div>
        <div className="grid grid-cols-1 min-w-0 content-start gap-5 lg:col-span-4">
          <SadePanel ic="p-6 sm:p-7">
            <div className="grid grid-cols-1 gap-4">
              <Aralik label="Arka katman" value={katman} min={0} max={3} step={1} onChange={setKatman} format={(v) => String(v)} />
              <Aralik label="Kayma" value={ayr} min={4} max={30} step={2} onChange={setAyr} format={(v) => `${v}px`} />
              <Aralik label="Eğim" value={egim} min={0} max={4} step={0.2} onChange={setEgim} format={(v) => `${v.toFixed(1).replace('.', ',')}°`} />
            </div>
          </SadePanel>
          <SadePanel ic="p-6 sm:p-7">
            <p className="kicker">Sıralama (önden arkaya)</p>
            <ol className="m-0 mt-3 grid grid-cols-1 list-none gap-1.5 p-0 text-[17px]" data-z-sirasi="">
              <li>1 · Sarmaşık ve çiçek (en üst)</li>
              <li>2 · Düz metin paneli</li>
              <li>3 · Altın kontur ve iç sage çizgi</li>
              {Array.from({ length: katman }, (_, i) => (
                <li key={i}>
                  {4 + i} · Arka çerçeve {i + 1} ({['gül', 'zeytin', 'altın'][i % 3]} tonu)
                </li>
              ))}
            </ol>
          </SadePanel>
        </div>
      </div>
    </Section>
  )
}

/* ───────────────────────── Madde 8 · Doku ───────────────────────── */

export function DokuBolumu() {
  const { doku, setDoku, tema, duyur } = useNouveau()
  const t = TEMA_RENK[tema]
  const zeminUstu = karis(t.zemin, t.dokRenk, t.dokA)
  const enKotu = kontrast(t.soluk, zeminUstu)
  const turler = ['parsomen', 'cicek', 'duvar'] as const
  return (
    <Section
      id="doku"
      ikon="tomurcuk"
      madde="Madde 8 · Doku ve yüzey"
      title="Parşömen, preslenmiş çiçek, duvar kâğıdı"
      lead="Sayfa zemini üç dokudan biri olabilir; hepsi düşük yoğunlukta ve içeriğin arkasında sabit durur. Metin dokunun üstüne değil, düz panelin içine yazılır. Yoğunluk arttıkça okunabilirlik nasıl etkilenir, aşağıda ölçülür."
    >
      <ul className="m-0 grid list-none grid-cols-1 gap-x-8 gap-y-8 p-0 md:grid-cols-3" data-doku-liste="">
        {turler.map((d, i) => (
          <Belir as="li" key={d} gecikme={i * 100}>
            <div
              className={cx('relative aspect-[4/3] overflow-hidden', d === 'parsomen' ? 'rounded-[40px_12px_40px_12px]' : d === 'cicek' ? 'rounded-[12px_40px_12px_40px]' : 'rounded-[40px_40px_12px_12px]')}
              style={{
                background: 'var(--zemin)',
                border: '1px solid var(--cizgi)',
              }}
              data-doku-ornek={d}
            >
              <DokuOrnek tur={d} />
              <div className="absolute inset-x-5 bottom-5">
                <SadePanel ic="px-4 py-3">
                  <p className="text-[16px]">Metin, dokunun üstünde değil düz panelde.</p>
                </SadePanel>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="baslik-k text-[24px]">{DOKU_AD[d]}</p>
              <NouveauButton
                boy="k"
                varyant={doku === d ? 'dolu' : 'cizgi'}
                aria-pressed={doku === d}
                onClick={() => {
                  setDoku(d as Doku)
                  duyur(`${DOKU_AD[d]} dokusu uygulandı`)
                }}
                data-doku-uygula={d}
              >
                {doku === d ? 'Uygulandı' : 'Uygula'}
              </NouveauButton>
            </div>
          </Belir>
        ))}
      </ul>

      <div className="mt-[var(--aralik)] grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-12">
        <div className="min-w-0 md:col-span-7">
          <SadePanel ic="sm:p-8">
            <p className="kicker">Okunabilirlik (Madde 18)</p>
            <p className="mt-2 text-[18px]">En koyu doku noktasında bile soluk metin şu oranı korur:</p>
            <p className="rakam mt-2 text-[40px]" data-doku-kontrast={enKotu.toFixed(2)}>
              {oran(enKotu)}
            </p>
            <p className="mt-1 text-[16px] text-soluk">
              {enKotu >= 4.5 ? '✓ AA sınırının üstünde' : '✕ AA sınırının altında'} · zemin {t.zemin.toUpperCase()} üstüne doku %{Math.round(t.dokA * 100)} {t.dokRenk.toUpperCase()}
            </p>
          </SadePanel>
        </div>
        <div className="min-w-0 md:col-span-5">
          <Kod label="Doku değişkenleri" sar={false}>{`--dok-renk  ${t.dokRenk}
--dok-a     ${t.dokA}
mask-image  var(--m-parsomen)
            /* alfa gürültüsü + kenar solması */`}</Kod>
        </div>
      </div>
    </Section>
  )
}

/* ───────────────────────── Madde 9 · İkonlar ───────────────────────── */

export function Ikonlar() {
  const [boyut, setBoyut] = useState(40)
  const [kalinlik, setKalinlik] = useState(1.6)
  return (
    <Section
      id="ikonlar"
      ikon="egrelti"
      madde="Madde 9 · İkonografi"
      title="Yaprak, çiçek, kıvrım"
      lead="Her ikon 32 birimlik kutuda elle kurgulanmış eğrilerden oluşur: ok bir sarmaşık ucudur, kapat iki çapraz saptır, beğen iki yapraktır. Yumuşak dolgu yalnız yaprak ve taç yapraklarda var; çizgi kalınlığı ölçekle değişmez."
    >
      <div className="mb-8 grid max-w-[640px] grid-cols-1 gap-x-10 gap-y-2 sm:grid-cols-2">
        <Aralik label="Boyut" value={boyut} min={20} max={72} step={2} onChange={setBoyut} format={(v) => `${v}px`} />
        <Aralik label="Çizgi" value={kalinlik} min={1} max={3} step={0.2} onChange={setKalinlik} format={(v) => v.toFixed(1).replace('.', ',')} />
      </div>
      {[
        ['İşlev ikonları', ISLEV_SIMGELERI],
        ['Botanik illüstrasyonlar', BOTANIK_SIMGELERI],
      ].map(([ad, liste]) => (
        <div key={ad as string} className="mb-10 last:mb-0">
          <h3 className="baslik mb-5 text-[clamp(26px,2.4vw,30px)]">{ad as string}</h3>
          <ul className="m-0 grid list-none grid-cols-2 gap-x-5 gap-y-5 p-0 sm:grid-cols-4 lg:grid-cols-6" data-ikon-liste={ad as string}>
            {(liste as typeof ISLEV_SIMGELERI).map((s) => (
              <li key={s}>
                <SadePanel ic="flex flex-col items-center gap-3 px-3 py-5 text-center">
                  <span className="grid place-items-center text-metin" style={{ minHeight: 72 }}>
                    <Ikon ad={s} boyut={boyut} kalin={kalinlik} etiket={SIMGE_AD[s]} />
                  </span>
                  <span className="font-mono text-[12.5px] text-soluk">{s}</span>
                </SadePanel>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </Section>
  )
}
