import { motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Dev } from '../components/Harfler'
import { Ayarlar } from '../components/Header'
import { Aralik, Bolum, Buton, KENAR } from '../components/ui'
import { HAREKET_TABLOSU } from '../lib/data'
import { useKayma } from '../lib/kayma'
import { HAREKET_KAYDI, useKinetic } from '../lib/store'

/* ───────────────────────── Madde 16 · Hareket dili ───────────────────────── */

function Sahne({ duyar }: { duyar: number }) {
  const { yumusak } = useKayma()
  const { hareket, tam } = useKinetic()
  const kap = useRef<HTMLDivElement>(null)
  const { scrollYProgress: p } = useScroll({ target: kap, offset: ['start start', 'end end'] })
  const olcek = useTransform(p, [0, 1], [0.62, 1.04])
  const x1 = useTransform(p, [0, 0.5, 1], ['-14%', '14%', '-14%'])
  const x2 = useTransform(p, [0, 0.5, 1], ['12%', '-12%', '12%'])
  const aralik = useTransform(p, [0, 1], ['-0.06em', '0.1em'])
  const egim = useTransform(yumusak, (v) => Math.max(-16, Math.min(16, (-v / 3000) * 14 * duyar)))
  const sk = useTransform(egim, (v) => `${v}deg`)
  const yazi = useRef<HTMLDivElement>(null)
  const aktif = hareket && tam
  useMotionValueEvent(p, 'change', (v) => {
    const y = yazi.current
    if (!y) return
    const yuzde = Math.round(Math.max(0, Math.min(1, v)) * 100)
    y.dataset.ilerleme = String(yuzde)
    y.dataset.yonSahne = v < 0.5 ? 'saga' : 'sola'
    y.textContent = `%${yuzde} · ölçek ${(0.62 + 0.42 * v).toFixed(2).replace('.', ',')} · ${v < 0.5 ? 'satır 1 sağa' : 'satır 1 sola'}`
  })
  return (
    <div ref={kap} style={{ height: hareket ? '230vh' : 'auto' }} data-sahne-kap="" data-pin={hareket ? 'evet' : 'hayir'}>
      <div className={hareket ? 'sticky top-[132px] flex h-[calc(100svh-150px)] min-h-[380px] flex-col justify-between overflow-x-clip py-4' : 'flex flex-col gap-10 py-4'} data-sahne="">
        <motion.div style={aktif ? { scale: olcek, x: x1, skewX: sk, transformOrigin: '50% 50%' } : undefined} className="origin-center" data-sahne-satir="1">
          <Dev metin="Kaydır" boy="clamp(48px, 20vw, 300px)" uz={9} ad="sahne-1" />
        </motion.div>
        <motion.div style={aktif ? { x: x2, letterSpacing: aralik, skewX: sk } : undefined} className="origin-center" data-sahne-satir="2">
          <Dev metin="Hızlan" boy="clamp(48px, 20vw, 300px)" uz={9} className="kontur" ad="sahne-2" />
        </motion.div>
        <p className="rakam text-[15px] text-soluk" ref={yazi} data-ilerleme="0" data-yon-sahne="saga" aria-hidden={hareket ? 'true' : undefined}>
          {hareket ? '%0 · ölçek 0,62 · satır 1 sağa' : 'Hareket durdu: kaydırma satırları değiştirmez.'}
        </p>
      </div>
    </div>
  )
}

export function Hareket() {
  const [duyar, setDuyar] = useState(1)
  const { hareket, tam } = useKinetic()
  return (
    <Bolum
      id="hareket"
      no="12"
      madde="Madde 16 · Hareket dili"
      baslik="Kaydırma hızı = metin"
      vurgulu={[2]}
      lead="Hareket süs değildir; kaydırma hızıyla doğrudan eşlenir. Hızlandıkça satırlar eğilir ve esner, kaydırma ilerledikçe zıt yönlere gider, orta noktada yön değiştirir. Aşağıdaki sahne sayfaya yapışır: kaydırın."
    >
      <div className={`${KENAR} grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-12`}>
        <div className="lg:col-span-12">
          <Sahne duyar={duyar} />
        </div>
        <div className="grid content-start gap-6 lg:col-span-4">
          <Aralik id="hareket-duyar" label="Hız duyarlılığı" value={duyar} min={0} max={2} step={0.25} onChange={setDuyar} format={(v) => `×${v.toFixed(2).replace('.', ',')}`} />
          <p className="text-[15px] text-soluk" data-hareket-durum={hareket ? (tam ? 'tam' : 'hafif') : 'kapali'}>
            Şu an: <b className="text-metin">{hareket ? (tam ? 'tam şiddet' : 'hafif şiddet') : 'durdu'}</b>. {tam ? 'Eğim ve esneme açık.' : 'Eğim, esneme ve 3B kapalı.'}
          </p>
        </div>
        <div className="overflow-x-auto lg:col-span-8" role="region" aria-label="Hareket değerleri" tabIndex={0}>
          <table className="tablo w-full min-w-[620px] border-collapse text-[15px]" data-hareket-tablo="">
            <caption className="kicker">Kaydırma ve zaman eşlemeleri</caption>
            <thead>
              <tr>
                {['Girdi → çıktı', 'Değer', 'Aralık', 'Eğri'].map((b) => (
                  <th key={b} scope="col">
                    {b}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HAREKET_TABLOSU.map(([a, b, c, d]) => (
                <tr key={a}>
                  <th scope="row">{a}</th>
                  <td className="font-mono text-[13px]">{b}</td>
                  <td>{c}</td>
                  <td>{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Bolum>
  )
}

/* ───────────────────────── Madde 17 · Mobil ───────────────────────── */

export function Mobil() {
  const [genislik, setGenislik] = useState(360)
  const kutu = useRef<HTMLDivElement>(null)
  const [olc, setOlc] = useState({ kutu: 0, boy: 0, kelime: 0, sigmayan: false, sabitKelime: 0, sabitTasma: false })
  useEffect(() => {
    const t = window.setTimeout(() => {
      const k = kutu.current
      if (!k) return
      const kw = k.clientWidth
      const ilk = k.querySelector<HTMLElement>('[data-fit] .dev-boy')
      const sabit = k.querySelector<HTMLElement>('[data-sabit]')
      const genis = (el: HTMLElement | null) => (el ? Math.max(...Array.from(el.querySelectorAll<HTMLElement>('.kw')).map((w) => w.getBoundingClientRect().width)) : 0)
      const kel = genis(ilk)
      const sk = genis(sabit)
      setOlc({ kutu: kw, boy: ilk ? Math.round(parseFloat(getComputedStyle(ilk).fontSize)) : 0, kelime: Math.round(kel), sigmayan: kel > kw + 1, sabitKelime: Math.round(sk), sabitTasma: sk > kw + 1 })
    }, 250)
    return () => window.clearTimeout(t)
  }, [genislik])
  return (
    <Bolum
      id="mobil"
      no="13"
      madde="Madde 17 · Responsive kurallar"
      baslik="Sığmayan sığar"
      vurgulu={[1]}
      lead="Dev harf ekrandan taşmaz: yazı boyu clamp() ile sınırlanır ve kapsayıcı genişliğine göre en uzun kelimeye sığdırılır. Genişliği daraltın; solda sabit vw boyu taşar, sağda sığdırılmış boy küçülür."
    >
      <div className={`${KENAR} grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-12`}>
        <div className="grid content-start gap-6 lg:col-span-4">
          <Aralik id="mob-genislik" label="Kapsayıcı genişliği" value={genislik} min={280} max={1100} step={10} onChange={setGenislik} format={(v) => `${v} px`} />
          <div className="text-[16px]" aria-live="polite" data-mobil-durum={`${olc.sigmayan ? 'tasiyor' : 'sigiyor'}/${olc.boy}`}>
            <p>
              Kutu: <b className="rakam">{olc.kutu}</b> px · yazı boyu: <b className="rakam">{olc.boy}</b> px
            </p>
            <p className="mt-1">
              En uzun kelime: <b className="rakam">{olc.kelime}</b> px · <b>{olc.sigmayan ? 'taşıyor' : 'sığıyor'}</b>
            </p>
            <p className="mt-1 text-soluk">
              Sabit vw boyu: <b className="rakam text-metin">{olc.sabitKelime}</b> px · <b className="text-metin">{olc.sabitTasma ? 'taşıyor' : 'sığıyor'}</b>
            </p>
          </div>
        </div>
        <div className="overflow-x-auto lg:col-span-8">
          <div ref={kutu} className="border-2 border-metin p-3" style={{ width: `min(${genislik}px, 100%)` }} data-mobil-kutu={genislik}>
            <p className="kicker mb-2">Sığdırılmış · clamp() + kapsayıcı birimi</p>
            <div data-fit="" className="overflow-x-clip">
              <Dev metin="Kinetic" boy="clamp(2.5rem, 14vw, 13rem)" ad="mobil-fit" />
            </div>
            <p className="kicker mt-6 mb-2 text-soluk">Sabit · yalnızca 14vw</p>
            <div className="overflow-x-clip" data-sabit-kap="">
              <span className="dev block" style={{ fontSize: '14vw' }} data-sabit="">
                <span className="kw">Kinetic</span>
              </span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto lg:col-span-12" role="region" aria-label="Kırılma kuralları" tabIndex={0}>
          <table className="tablo w-full min-w-[560px] border-collapse text-[15px]" data-mobil-tablo="">
            <caption className="kicker">Kurallar</caption>
            <thead>
              <tr>
                {['Genişlik', 'Yazı boyu', 'Şerit ve sahne', 'Bölüm boşluğu'].map((b) => (
                  <th key={b} scope="col">
                    {b}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['≥ 1024 px', 'clamp(…, 14–15vw, 220–260px)', 'tam hareket', '160–200 px'],
                ['600–1023 px', 'en uzun kelimeye sığdırılır', 'tam hareket', '~13vw'],
                ['< 600 px', 'sığdırılır, alt sınır 38–48 px', 'şerit yavaşlamaz, 3B sahne küçülür', '≥ 88 px'],
              ].map(([a, b, c, d]) => (
                <tr key={a}>
                  <th scope="row">{a}</th>
                  <td className="font-mono text-[13px]">{b}</td>
                  <td>{c}</td>
                  <td>{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Bolum>
  )
}

/* ───────────────────────── Madde 18 · Erişim ───────────────────────── */

const KURALLAR = [
  ['Durdur', 'Başlıktaki “Durdur” düğmesi her sayfada ve ilk odak sırasındadır. Hareketi tek tıkla kapatır; sayfa okunur, durağan metne döner.'],
  ['Sisteme uy', 'İşletim sistemi hareketi azaltıyorsa sayfa açılışta kapalı başlar. Kullanıcı isterse ayardan tekrar açar.'],
  ['Hafif şiddet', 'Eğim, esneme, 3B katman ve imleç etkisi kapanır; yalnız yavaş şerit ve küçük bir dalga kalır.'],
  ['Yanıp sönme yok', 'Saniyede üçten fazla değişen alan yok. En hızlı tempoda söz değişimi 0,67 sn’dir.'],
  ['Ekran okuyucu', 'Bölünmüş harfler gizlidir; her başlık metnini bir kez, bütün olarak okutur. Şeritte metin yalnız bir kez okunur.'],
  ['Klavye', 'Bütün denetimler odaklanır; odak halkası 3 piksel, vurgu renginde, 3 piksel boşluklu.'],
  ['Hedef boyutu', 'Düğme, çip ve alan en az 48 piksel.'],
] as const

export function Erisim() {
  const { hareket, tam, hizCarpan } = useKinetic()
  const [say, setSay] = useState({ bilesen: 0, css: 0 })
  useEffect(() => {
    const oku = () => setSay({ bilesen: HAREKET_KAYDI.size, css: document.getAnimations().filter((a) => a.playState === 'running').length })
    oku()
    const id = window.setInterval(oku, 400)
    return () => window.clearInterval(id)
  }, [hareket])
  return (
    <Bolum
      id="erisim"
      no="14"
      madde="Madde 18 · Erişilebilirlik ve varyantlar"
      baslik="Durdur düğmesi"
      vurgulu={[0]}
      lead="Sürekli hareket eden metin, hareket duyarlılığı olan kullanıcıları zorlayabilir. Bu yüzden hareket her zaman kapatılabilir: başlıktaki Durdur düğmesi, sistem tercihi ve şiddet ayarı aynı anda çalışır."
    >
      <div className={`${KENAR} grid grid-cols-1 gap-x-8 gap-y-14 lg:grid-cols-12`}>
        <div className="lg:col-span-5" data-erisim-ayarlar="">
          <h3 className="dev text-[clamp(22px,7vw,28px)]">Varyantlar</h3>
          <div className="mt-6">
            <Ayarlar onek="er-" />
          </div>
        </div>
        <div className="lg:col-span-7">
          <div className="border-2 border-metin p-6" data-hareket-butce={say.bilesen} data-css-anim={say.css}>
            <p className="kicker">Hareket bütçesi · canlı</p>
            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <p className="dev text-[clamp(44px,6vw,84px)] tabular-nums" data-say="bilesen">
                  {hareket ? say.bilesen : 0}
                </p>
                <p className="kicker">Çalışan bileşen</p>
              </div>
              <div>
                <p className="dev text-[clamp(44px,6vw,84px)] tabular-nums" data-say="css">
                  {say.css}
                </p>
                <p className="kicker">CSS animasyonu</p>
              </div>
              <div>
                <p className="dev text-[clamp(44px,6vw,84px)] tabular-nums text-vurgu-yazi" data-say="carpan">
                  {hareket ? `×${hizCarpan}` : '0'}
                </p>
                <p className="kicker">Hız çarpanı</p>
              </div>
            </div>
            <p className="mt-5 text-[15px] text-soluk" data-erisim-durum={hareket ? (tam ? 'tam' : 'hafif') : 'kapali'}>
              {hareket ? (tam ? 'Hareket tam şiddette çalışıyor.' : 'Hareket hafif şiddette çalışıyor.') : 'Hareket durduruldu: hiçbir bileşen döngüde değil.'}
            </p>
            <div className="mt-4">
              <Buton ton={hareket ? 'vurgu' : 'cizgi'} onClick={() => document.querySelector<HTMLButtonElement>('[data-durdur]')?.click()} data-erisim-durdur="">
                {hareket ? 'Hareketi durdur' : 'Hareketi başlat'}
              </Buton>
            </div>
          </div>
          <ul className="mt-8" data-kurallar="">
            {KURALLAR.map(([a, b]) => (
              <li key={a} className="grid grid-cols-1 gap-x-6 gap-y-1 border-t border-hat py-4 sm:grid-cols-[10rem_1fr]">
                <span className="dev text-[18px]">{a}</span>
                <span className="text-[16.5px] text-soluk">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Bolum>
  )
}
