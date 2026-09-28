import { useState } from 'react'
import { cx } from '../../shared/cx'
import { useKawaii } from '../lib/store'
import { kontrast, oran } from '../lib/contrast'
import { CloudCard } from '../components/CloudCard'
import { KawaiiButton } from '../components/KawaiiButton'
import { Mascot } from '../components/Mascot'
import { Ikon } from '../components/Icons'
import { KSlider, KSwitch, Kod, Secim, Section } from '../components/ui'

const PALET = [
  {
    ad: 'Nane Yeşili',
    hex: '#A8E6CF',
    token: 'Color/PastelMint',
    metin: '#5D4037',
    rol: 'Başarı, ilerleme, seçili durum',
  },
  {
    ad: 'Bebek Pembesi',
    hex: '#FFD3B6',
    token: 'Color/PastelPeach',
    metin: '#5D4037',
    rol: 'Ana düğme, maskot gövdesi',
  },
  {
    ad: 'Şeftali',
    hex: '#FFAAA5',
    token: 'Color/PastelSalmon',
    metin: '#5D4037',
    rol: 'Can, kalp, sıcak vurgu',
  },
  {
    ad: 'Lavanta',
    hex: '#D4A5A5',
    token: 'Color/PastelRose',
    metin: '#2E3A59',
    rol: 'Sakin ikincil yüzey, uyku',
  },
]
const METIN = [
  { ad: 'Koyu Kahverengi', hex: '#5D4037', rol: 'Bütün metinler, çizgiler' },
  {
    ad: 'Lacivert',
    hex: '#2E3A59',
    rol: 'Lavanta üstünde metin, odak halkası',
  },
  { ad: 'Krem', hex: '#FFF8F3', rol: 'Sayfa zemini' },
]

// Organik damla silüetleri: sekiz değerli border-radius
const DAMLA = ['58% 42% 55% 45% / 52% 48% 52% 48%', '46% 54% 42% 58% / 58% 44% 56% 42%', '52% 48% 60% 40% / 44% 56% 46% 54%', '44% 56% 48% 52% / 55% 45% 58% 42%']

/** Madde 4: dört pastel, sert siyah yok */
export function Palet() {
  const { duyur } = useKawaii()
  const kopyala = (hex: string) => {
    navigator.clipboard?.writeText(hex).then(
      () => duyur(`${hex} kopyalandı`),
      () => duyur(`Kopyalanamadı, değer: ${hex}`),
    )
  }
  return (
    <Section id="palet" madde="Madde 4 · Renk paleti" title="Şekerlik kavanozu" lead="Dört pastel yüzey, iki koyu metin rengi. Siyah (#000) hiçbir yerde yok: metin koyu kahverengi. Lavanta üstünde kahverengi 4,31:1 ile AA sınırının altında kaldığı için orada lacivert kullanılır.">
      <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-4">
        {PALET.map((p, i) => {
          const k = kontrast(p.metin, p.hex)
          const kk = kontrast('#5D4037', p.hex)
          return (
            <li key={p.hex} className="kabarcik grid grid-cols-1 content-start gap-4 p-5">
              <button
                type="button"
                onClick={() => kopyala(p.hex)}
                className="jole-hover mx-auto grid aspect-square w-full max-w-[200px] place-items-center font-display text-[22px] font-extrabold"
                style={{
                  background: p.hex,
                  color: p.metin,
                  borderRadius: DAMLA[i],
                  boxShadow: `0 12px 22px ${p.hex}aa`,
                }}
                aria-label={`${p.ad} ${p.hex}, kopyala`}
                data-renk-ornek={p.hex}
              >
                <span aria-hidden="true">{p.hex}</span>
              </button>
              <div>
                <p className="font-display text-[24px] font-extrabold">{p.ad}</p>
                <p className="text-[14px] text-muted">{p.token}</p>
                <p className="mt-2 text-[16px]">{p.rol}</p>
              </div>
              <p className="flex items-center justify-between gap-2 rounded-[18px] bg-cream px-3 py-2 text-[15px]">
                <span>{p.metin === '#5D4037' ? 'Kahverengi metin' : 'Lacivert metin'}</span>
                <span className="font-extrabold tabular-nums">{oran(k)}</span>
              </p>
              {p.metin !== '#5D4037' ? (
                <p className="-mt-2 flex items-center gap-2 text-[14px] text-muted" data-lavanta-not="">
                  <Ikon ad="ampul" boyut={22} /> Kahverengiyle {oran(kk)}: AA'ya yetmez.
                </p>
              ) : null}
            </li>
          )
        })}
      </ul>
      <ul className="m-0 mt-8 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-3">
        {METIN.map((m) => (
          <li key={m.hex} className="flex items-center gap-4 rounded-bubble bg-paper py-2 pr-5 pl-2 [border:var(--line)_solid_var(--brown)]">
            <span
              className="size-14 shrink-0 rounded-full"
              style={{
                background: m.hex,
                boxShadow: m.hex === '#FFF8F3' ? 'inset 0 0 0 2px #ecd9cf' : undefined,
              }}
              aria-hidden="true"
            />
            <span className="min-w-0">
              <span className="block font-extrabold">
                {m.ad} <span className="text-[14px] text-muted tabular-nums">{m.hex}</span>
              </span>
              <span className="block text-[14px] text-muted">{m.rol}</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-6 max-w-[70ch] text-[15px] text-muted">Adlar tanımdaki gibi korunur. Tondan bakınca #FFD3B6 şeftaliye, #FFAAA5 somon pembesine, #D4A5A5 tozlu güle daha yakındır; token adları bu yüzden tona göre (PastelPeach, PastelSalmon, PastelRose). Renge dokunursan değeri kopyalar.</p>
    </Section>
  )
}

/** Madde 5: kalın, yuvarlak, hafif el yazısı hissi */
export function Tipografi() {
  const [agirlik, setAgirlik] = useState(800)
  const [ornek, setOrnek] = useState('Şirin ördek İğde dalında güldü!')
  return (
    <Section id="yazi" madde="Madde 5 · Tipografi" title="Yuvarlak harfler" lead="Başlıklar Grandstander: çocuk el yazısından doğmuş, uçları yuvarlak, kalın bir sans. Gövde Nunito: bütün uçları yuvarlatılmış, okuma boyunda sakin. İkisi de ğ, ş, ı, İ, ç, ö, ü içerir.">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
        <CloudCard className="min-w-0 px-6 pt-8 pb-8 md:px-10">
          <p className="kicker text-muted">Grandstander · {agirlik}</p>
          <p className="mt-3 font-display text-[clamp(40px,6vw,72px)] leading-[1.05] [overflow-wrap:anywhere]" style={{ fontWeight: agirlik }} data-yazi-ornek="">
            {ornek || ' '}
          </p>
          <p className="kicker mt-8 text-muted">Nunito · 600, 18px</p>
          <p className="mt-2 max-w-[52ch] text-[18px]">Gövde metni 18 piksel ve SemiBold (600). İnce harf pastel zeminde soluklaşır; kalın ve yuvarlak harf hem sevimli hem okunaklı kalır.</p>
          <p className="kicker mt-6 text-muted">Nunito · 900</p>
          <p className="mt-2 text-[22px] font-black">Bugün 3 yeni kelime öğrendin!</p>
        </CloudCard>
        <div className="kabarcik grid min-w-0 grid-cols-1 content-start gap-6 p-6">
          <KSlider label="Başlık ağırlığı" value={agirlik} min={400} max={900} step={100} onChange={setAgirlik} renk="peach" />
          <div>
            <label htmlFor="yazi-ornek" className="font-extrabold">
              Kendi cümlen
            </label>
            <input id="yazi-ornek" value={ornek} onChange={(e) => setOrnek(e.target.value)} maxLength={48} className="mt-2 block min-h-14 w-full rounded-bubble bg-cream px-5 text-[18px] font-bold text-brown shadow-[inset_0_3px_6px_rgb(93_64_55/0.12)] [border:var(--line)_solid_var(--brown)]" />
          </div>
          <table className="w-full border-collapse text-[15px]">
            <caption className="kicker pb-2 text-left text-muted">Ölçek</caption>
            <tbody>
              {[
                ['Başlık 1', 'Grandstander 800', '52–112px'],
                ['Başlık 2', 'Grandstander 800', '38–68px'],
                ['Düğme', 'Grandstander 800', '16–23px'],
                ['Gövde', 'Nunito 600', '18px'],
                ['Not', 'Nunito 600', '15px'],
              ].map(([a, b, c]) => (
                <tr key={a} className="border-b-2 border-cream">
                  <th scope="row" className="py-2 text-left font-extrabold">
                    {a}
                  </th>
                  <td className="py-2">{b}</td>
                  <td className="py-2 text-right tabular-nums">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[14px] text-muted">Sniglet ve Mochiy Pop One'da ğ, ş ve İ yok; Baloo 2 Stil 007'de kullanıldı. "‿", "♥" ve "★" bu fontlarda olmadığı için yüzler, kalpler ve yıldızlar çizimdir.</p>
        </div>
      </div>
    </Section>
  )
}

/** Madde 6: yalnız köşeler değil, bileşenin kendisi yuvarlak */
export function Sekil() {
  const [yaricap, setYaricap] = useState(100)
  const [damla, setDamla] = useState(0)
  const r = yaricap >= 100 ? '9999px' : `${(yaricap / 100) * 34}px`
  return (
    <Section id="sekil" madde="Madde 6 · Şekil dili" title="Damla, bulut, hap" lead="Kusursuz yuvarlaklık: düğme hap, kart bulut, avatar damla. Sekiz değerli border-radius ile her damla biraz farklı, elle yoğrulmuş gibi.">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="kabarcik grid min-w-0 grid-cols-1 content-start gap-5 p-6">
          <p className="font-display text-[24px] font-extrabold">Hap</p>
          <div className="grid min-h-[120px] place-items-center rounded-[24px] bg-cream p-4">
            <span className="inline-flex min-h-14 items-center bg-peach px-8 font-display text-[19px] font-extrabold shadow-[var(--sh-salmon)]" style={{ borderRadius: r }} data-hap-ornek="">
              Devam et
            </span>
          </div>
          <KSlider label="Köşe yarıçapı" value={yaricap} min={0} max={100} step={5} onChange={setYaricap} format={(v) => (v >= 100 ? '%100 · hap' : `${Math.round((v / 100) * 34)}px`)} renk="peach" />
          <p className="text-[15px] text-muted">{yaricap >= 100 ? 'Radius/Bubble: 9999px. Yükseklik ne olursa olsun uçlar tam yarım daire.' : 'Köşe kaldıkça düğme kutuya, kutu da resmî bir forma döner.'}</p>
        </div>
        <div className="kabarcik grid min-w-0 grid-cols-1 content-start gap-5 p-6">
          <p className="font-display text-[24px] font-extrabold">Damla</p>
          <div className="grid min-h-[196px] place-items-center rounded-[24px] bg-cream p-4">
            <div className="grid size-36 place-items-center bg-mint shadow-[var(--sh-mint)] transition-[border-radius] duration-700 ease-[var(--jel)]" style={{ borderRadius: DAMLA[damla % DAMLA.length] }} data-damla-ornek="">
              <Mascot ruh="mutlu" renk="paper" boyut={84} />
            </div>
          </div>
          <KawaiiButton renk="mint" boy="k" onClick={() => setDamla((d) => d + 1)} ikon={<Ikon ad="yenile" boyut={22} />}>
            Yeni damla
          </KawaiiButton>
          <Kod label="Damla border-radius" className="whitespace-pre-wrap">{`border-radius: ${DAMLA[damla % DAMLA.length]};`}</Kod>
        </div>
        <CloudCard renk="peach" className="grid min-w-0 grid-cols-1 content-start gap-4 px-6 pt-8 pb-7">
          <p className="font-display text-[24px] font-extrabold">Bulut</p>
          <p className="text-[16px]">Gövde 40px yarıçaplı bir kutu; üst kenarda üç daire (::before, ::after ve boş bir span) taşar. Gölge drop-shadow olduğu için tepelerle birlikte tek bulut gibi düşer.</p>
          <Kod label="Bulut yapısı" sar={false}>{`.bulut { border-radius: 40px;
  filter: drop-shadow(0 10px 14px
          rgb(255 160 110 / .4)); }
.bulut::before, ::after, .puf {
  border-radius: 50%; top: -34px; }`}</Kod>
        </CloudCard>
      </div>
    </Section>
  )
}

/** Madde 7: renkli, bulanık, dağınık dış gölge */
export function Golge() {
  const [gri, setGri] = useState(false)
  const [bulanik, setBulanik] = useState(16)
  const [y, setY] = useState(8)
  const [renk, setRenk] = useState<'peach' | 'mint' | 'salmon' | 'rose'>('peach')
  const RGB: Record<string, string> = {
    peach: '255 170 165',
    mint: '76 175 136',
    salmon: '233 130 124',
    rose: '180 120 120',
  }
  const golge = `0 ${y}px ${bulanik}px rgb(${gri ? '0 0 0' : RGB[renk]} / ${gri ? 0.35 : 0.45})`
  return (
    <Section id="golge" madde="Madde 7 · Z-ekseni ve gölge" title="Pembe düğme, pembe gölge" lead="Gölge nesnenin renginden doğar: pembe düğmenin gölgesi gri değil koyu pembe, nane kartın gölgesi koyu nane. Bulanıklık büyük, ofset küçük; nesne yere değil havaya yakın durur.">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="kabarcik grid min-h-[300px] min-w-0 grid-cols-1 place-items-center gap-6 p-8 sm:grid-cols-2">
          <div className="grid justify-items-center gap-3">
            <span className="grid size-32 place-items-center rounded-full" style={{ background: `var(--${renk})`, boxShadow: golge }} data-golge-ornek="">
              <Mascot ruh={gri ? 'uzgun' : 'mutlu'} renk="paper" boyut={72} />
            </span>
            <span className="text-[15px] font-bold">{gri ? 'Gri gölge: kirli, ağır' : 'Renkli gölge: parlak, hafif'}</span>
          </div>
          <div className="grid justify-items-center gap-3">
            <span
              className="grid size-32 place-items-center rounded-full"
              style={{
                background: `var(--${renk})`,
                boxShadow: '4px 4px 0 #000',
              }}
              aria-hidden="true"
            >
              <Ikon ad="kapat" boyut={40} />
            </span>
            <span className="text-[15px] font-bold">Sert siyah gölge: asla</span>
          </div>
        </div>
        <div className="kabarcik grid min-w-0 grid-cols-1 content-start gap-5 p-6">
          <Secim
            legend="Nesne rengi"
            name="golge-renk"
            value={renk}
            onChange={setRenk}
            options={[
              { id: 'peach', ad: 'Bebek pembesi' },
              { id: 'mint', ad: 'Nane' },
              { id: 'salmon', ad: 'Şeftali' },
              { id: 'rose', ad: 'Lavanta' },
            ]}
          />
          <KSlider label="Bulanıklık" value={bulanik} min={0} max={40} onChange={setBulanik} format={(v) => `${v}px`} renk={renk} />
          <KSlider label="Dikey ofset" value={y} min={0} max={20} onChange={setY} format={(v) => `${v}px`} renk={renk} />
          <KSwitch label="Gri gölgeyle karşılaştır" checked={gri} onChange={setGri} />
          <Kod label="Gölge CSS">{`box-shadow: ${golge};`}</Kod>
        </div>
      </div>
      <ul className={cx('m-0 mt-8 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4')}>
        {[
          ['Shadow/ColoredSoft', '0 8px 16px', 'rgba(255,170,165,.4)'],
          ['Shadow/Mint', '0 8px 16px', 'rgba(76,175,136,.35)'],
          ['Shadow/Peach', '0 8px 16px', 'rgba(255,160,110,.4)'],
          ['Shadow/Rose', '0 8px 16px', 'rgba(180,120,120,.38)'],
        ].map(([a, b, c]) => (
          <li key={a} className="rounded-[28px] bg-paper p-4 text-[15px]" style={{ boxShadow: `${b} ${c}` }}>
            <span className="block font-extrabold">{a}</span>
            <span className="block text-muted tabular-nums">
              {b} {c}
            </span>
          </li>
        ))}
      </ul>
    </Section>
  )
}
