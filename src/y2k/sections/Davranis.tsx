import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { useY2K } from '../lib/store'
import { kontrast, oran, zit } from '../lib/contrast'
import { Y2KCard } from '../components/Y2KCard'
import { ChromeButton } from '../components/ChromeButton'
import { Badge } from '../components/Badge'
import { CD, Starburst } from '../components/Shapes'
import { IconWindow, TribalRing, TribalStar, TribalWing } from '../components/Icons'
import { Ayarlar } from '../components/Header'
import { Chips, Range, Section } from '../components/ui'

const v = (o: Record<string, string>) => o as CSSProperties

const FIRTINA: [string, string, 'chrome' | 'candy' | 'icy' | 'grape'][] = [
  ['Yeni mesaj', 'Elmas size bir buz kalp gönderdi.', 'candy'],
  ['Güncelleme hazır', 'Milenyum FM Oynatıcı 2.0 indirildi. Şimdi yeniden başlatılsın mı?', 'chrome'],
  ['Uyarı', 'Sistem saati 01.01.1900 gösteriyor. Endişelenmeyin, 2000 sorunu yok.', 'icy'],
  ['Arkadaşlık isteği', 'krom_kalp_2001 sizi eklemek istiyor.', 'grape'],
  ['Kazandınız!', 'Bir adet sanal evcil hayvan. Onu beslemeyi unutmayın.', 'candy'],
]

/** Madde 16: kendi etrafında dönen vektörler, hızlı açılıp kapanan pencereler */
export function Motion() {
  const { motion, ac, hepsiniKapat, popups } = useY2K()
  const [sure, setSure] = useState(8)
  const firtina = () => FIRTINA.forEach(([b, m, t], i) => window.setTimeout(() => ac({ baslik: b, metin: m, ton: t }), motion ? i * 90 : 0))
  return (
    <Section id="hareket" kicker="Madde 16 · Hareket dili" title="Dönen yıldızlar, fırlayan pencereler" lead="Vektörler kendi etrafında döner; pencereler 140 milisaniyede açılır, 90 milisaniyede kapanır. Hareket kapalıyken dönme durur, pencereler animasyonsuz gelir.">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Y2KCard labelledBy="donen-b">
          <h3 id="donen-b" className="display text-[20px]">
            Dönen vektörler
          </h3>
          <div className="mt-5 flex flex-wrap items-center justify-around gap-6" aria-hidden="true" data-donen="">
            <TribalStar size={96} className="spin text-[#ff66cc]" style={v({ '--spin': `${sure}s` })} />
            <TribalRing size={96} className="spin text-[#2e0854] dark:text-[#a5f2f3]" style={v({ '--spin': `${sure * 1.5}s`, animationDirection: 'reverse' })} />
            <CD size={96} className="spin" style={v({ '--spin': `${sure / 2}s` })} />
            <Starburst size={96} ton="icy" className="spin" style={v({ '--spin': `${sure * 2}s` })} />
            <TribalWing size={96} className="spin text-[#2e0854] dark:text-[#e0e5ec]" style={v({ '--spin': `${sure * 0.8}s` })} />
          </div>
          <div className="mt-6">
            <Range label="Bir tur" value={sure} min={2} max={20} onChange={setSure} format={(x) => `${x} sn`} />
          </div>
          <p className="mt-3 text-[14px] text-muted">Durum: {motion ? 'dönüyor' : 'hareket kapalı, duruyor'}.</p>
        </Y2KCard>
        <Y2KCard labelledBy="pencere-b">
          <h3 id="pencere-b" className="display text-[20px]">
            Pop-up pencereler
          </h3>
          <p className="mt-3">2000'lerin masaüstü: bir tıkla beş pencere, her biri öncekinin üstüne. Esc en üsttekini, aşağıdaki düğme hepsini kapatır.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <ChromeButton ton="candy" ikon={<IconWindow size={16} />} onClick={firtina}>
              Pencere yağmuru
            </ChromeButton>
            <ChromeButton onClick={() => ac({ baslik: 'Tek pencere', metin: 'Açılış 140ms, kapanış 90ms. Odak bu düğmede; Tamam ya da Esc kapatır.', ton: 'icy', odak: true })}>Tek pencere</ChromeButton>
            <ChromeButton ton="grape" disabled={!popups.length} onClick={hepsiniKapat}>
              Hepsini kapat
            </ChromeButton>
          </div>
          <p className="mt-4 text-[14px] text-muted">Açık pencere: {popups.length}</p>
        </Y2KCard>
      </div>
      <Y2KCard className="mt-6" labelledBy="zaman-b">
        <h3 id="zaman-b" className="display text-[20px]">
          Zamanlama
        </h3>
        <ul className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2 text-[15px] sm:grid-cols-2">
          <li>Pencere açılışı: 140ms, yaylı (fazla büyüyüp oturur)</li>
          <li>Pencere kapanışı: 90ms, içe doğru</li>
          <li>CD ve kabile vektörleri: sürekli, doğrusal dönüş</li>
          <li>Kayan şerit: sabit hız, px/sn</li>
          <li>Ekolayzır: 0,5–0,9 sn, git gel</li>
          <li>Parıltılar: 1,8 sn yanıp söner</li>
        </ul>
      </Y2KCard>
    </Section>
  )
}

/** Madde 17: krom çerçeve mobilde daralır, içerik yer kazanır. Kapsayıcı sorgusu ile canlı örnek */
export function Responsive() {
  const [w, setW] = useState(390)
  const kutu = useRef<HTMLDivElement>(null)
  const [alan, setAlan] = useState(1100)
  useLayoutEffect(() => {
    const el = kutu.current
    if (!el) return
    const ro = new ResizeObserver(() => setAlan(Math.floor(el.clientWidth)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const zoom = Math.min(1, alan / w)
  const cb = w < 768 ? 3 : 5
  return (
    <Section id="mobil" kicker="Madde 17 · Duyarlı kurallar" title="Dar ekranda ince krom" lead="Krom çerçeve masaüstünde 5, telefonda 3 piksel. Kazanılan 4 piksel metne gider; balon köşeleri ve parlamalar aynı kalır.">
      <Y2KCard>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0 flex-1">
            <Range id="cerceve" label="Çerçeve genişliği" value={w} min={320} max={1100} step={10} onChange={setW} format={(x) => `${x}px`} />
          </div>
          <Chips
            legend="Hazır"
            hideLegend
            name="hazir-genislik"
            value={String(w)}
            onChange={(x) => setW(+x)}
            options={[
              { id: '360', ad: '360' },
              { id: '390', ad: '390' },
              { id: '768', ad: '768' },
              { id: '1100', ad: '1100' },
            ]}
          />
        </div>
        <p className="mt-3 font-semibold" aria-live="polite">
          Krom çerçeve: {cb}px · içerik genişliği: {w - 2 * cb - 32}px
        </p>
        <div ref={kutu} className="mt-4">
          <div className="overflow-hidden rounded-[24px] border border-[#2b3445]/50" style={{ width: w, zoom, background: 'var(--page)' }} aria-hidden="true" data-cerceve={cb}>
            <div className="p-4">
              <div className="rounded-[32px] border-solid p-4" style={{ borderWidth: cb, borderColor: 'transparent', background: 'linear-gradient(var(--surface), var(--surface)) padding-box, linear-gradient(135deg, #ffffff 0%, #b0c4de 30%, #778899 52%, #f5f8fc 64%, #8a99ae 100%) border-box' }}>
                <p className="kicker text-muted">Sakız mağazası</p>
                <p className="display mt-1 text-[22px]">Kelebek toka seti</p>
                <p className="mt-1 text-[15px]">190 ₺ · Yeni</p>
                <span className="candy mt-3 inline-flex min-h-10 items-center rounded-full border border-[#2b3445]/55 px-4 font-logo text-[11px] uppercase">Sepete ekle</span>
              </div>
            </div>
          </div>
        </div>
      </Y2KCard>
      <ul className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
        {[
          ['Çerçeve', 'Krom sınır 5px → 3px (768px altında). Balon köşeleri 36px kalır.'],
          ['Gezinme', 'Kapsül menü iki satıra iner; bölüm bağlantıları yatay kayar.'],
          ['Dokunma', 'Düğmeler en az 40px; çal düğmesi 64px.'],
        ].map(([b, t]) => (
          <Y2KCard as="li" key={b}>
            <h3 className="display text-[18px]">{b}</h3>
            <p className="mt-2 text-[15px]">{t}</p>
          </Y2KCard>
        ))}
      </ul>
    </Section>
  )
}

const HAZIR: [string, string][] = [
  ['#e0e5ec', 'Krom'],
  ['#778899', 'Krom koyu'],
  ['#a5f2f3', 'Buz'],
  ['#ff66cc', 'Sakız'],
  ['#2e0854', 'Mor'],
  ['#12052b', 'Gece'],
]

/** Madde 18: metin rengi zeminin tam zıttı */
export function Access() {
  const [bg, setBg] = useState('#778899')
  const renk = zit(bg)
  return (
    <Section id="erisim" kicker="Madde 18 · Erişilebilirlik ve varyantlar" title="Yansıma ne olursa olsun, metin siyah" lead="Metalik yansıma okunabilirliği düşürür; bu yüzden metin rengi zeminin tam zıttı seçilir. Parlak zeminde saf siyah, koyu morda saf beyaz; aradaki gri tonlar metinde yok.">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Y2KCard className="lg:col-span-7" labelledBy="zit-b">
          <h3 id="zit-b" className="display text-[20px]">
            Zıt renk seçici
          </h3>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-3 font-semibold">
              Zemin: <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-11 w-16 cursor-pointer rounded-full border border-[#2b3445]/55 bg-transparent" />
            </label>
            <div className="flex flex-wrap gap-2">
              {HAZIR.map(([h, ad]) => (
                <button key={h} type="button" onClick={() => setBg(h)} aria-pressed={bg === h} className="min-h-10 rounded-full border border-[#2b3445]/55 px-3 text-[13px] font-semibold" style={{ background: h, color: zit(h) }}>
                  {ad}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-5 grid min-h-32 place-items-center rounded-[28px] border border-[#2b3445]/55 p-6 text-center" style={{ background: `linear-gradient(180deg, rgb(255 255 255 / 0.35) 0%, transparent 50%), ${bg}`, color: renk }} data-zit={renk}>
            <p className="font-logo text-[clamp(18px,3vw,28px)] uppercase">Metin: {renk === '#000000' ? 'saf siyah' : 'saf beyaz'}</p>
            <p className="mt-1 text-[15px] font-semibold">
              {bg.toUpperCase()} üstünde {oran(kontrast(renk, bg))} · diğer seçenek {oran(kontrast(renk === '#000000' ? '#ffffff' : '#000000', bg))}
            </p>
          </div>
        </Y2KCard>
        <Y2KCard className="lg:col-span-5" labelledBy="varyant-b">
          <h3 id="varyant-b" className="display text-[20px]">
            Varyantlar
          </h3>
          <div className="mt-4">
            <Ayarlar onek="v-" />
          </div>
          <ul className="mt-5 space-y-2 text-[15px]">
            <li>Sade yüzey: parlama ve yansımalar kalkar, kenarlar siyah; sıvı metal ve ışık filtresi durur.</li>
            <li>Gece: koyu mor zemin, beyaz metin; krom yüzeylerde metin yine siyah.</li>
            <li>Hareketi azalt tercihi dönmeyi, süzülmeyi ve pencere animasyonlarını kapatır.</li>
          </ul>
        </Y2KCard>
      </div>
      <Y2KCard className="mt-6" labelledBy="kural-b">
        <h3 id="kural-b" className="display text-[20px]">
          Kurallar
        </h3>
        <ul className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2 text-[15px] md:grid-cols-2">
          <li>Metin hiçbir zaman krom yazının içinde küçük boyda durmaz; krom logo yalnız süs, adı ekran okuyucuya düz metinle verilir.</li>
          <li>Yansıma katmanları metni aydınlatır, karartmaz: en koyu nokta #778899 ve siyah metin orada 5,77:1.</li>
          <li>Odak halkası 3px, açıkta koyu mor, gecede buz mavisi; zeminle en az 12:1.</li>
          <li>Pencereler Esc ile kapanır; kullanıcı açtığında odak pencereye geçer, kapanınca geri döner.</li>
          <li>Kayan şeritler üstüne gelince, odakta ve kendi düğmesiyle durur.</li>
          <li>“Brat” yazı yalnız büyük boyda; bulanıklık 0,35 piksel.</li>
        </ul>
        <div className="mt-5 flex flex-wrap gap-2">
          <Badge ton="icy">WCAG 2.2 AA</Badge>
          <Badge ton="chrome">Klavye</Badge>
          <Badge ton="candy">Ekran okuyucu</Badge>
        </div>
      </Y2KCard>
    </Section>
  )
}
