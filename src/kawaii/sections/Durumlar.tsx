import { useEffect, useId, useState, type FormEvent } from 'react'
import { cx } from '../../shared/cx'
import { useKawaii } from '../lib/store'
import { CloudCard } from '../components/CloudCard'
import { KawaiiButton } from '../components/KawaiiButton'
import { KawaiiProgress } from '../components/KawaiiProgress'
import { LottieMascot } from '../components/LottieMascot'
import { Mascot } from '../components/Mascot'
import { Ikon } from '../components/Icons'
import { KSlider, Secim, Section } from '../components/ui'

/** Madde 11: hata durumlarında bile korkutmayan üzgün maskot */
export function Hatalar() {
  const { duyur } = useKawaii()
  const [baglanti, setBaglanti] = useState<'koptu' | 'deniyor' | 'tamam'>('koptu')
  const [ad, setAd] = useState('')
  const [hata, setHata] = useState('')
  const [selam, setSelam] = useState('')
  const hid = useId()
  useEffect(() => {
    if (baglanti !== 'deniyor') return
    const t = window.setTimeout(() => {
      setBaglanti('tamam')
      duyur('Bağlandık! Dersler yeniden hazır.')
    }, 1400)
    return () => window.clearTimeout(t)
  }, [baglanti, duyur])
  const gonder = (e: FormEvent) => {
    e.preventDefault()
    const t = ad.trim()
    if (t.length < 3) {
      setHata(t ? 'Adın en az 3 harf olsun. Mesela: Ada, Can, Ela.' : 'Adını yazmayı unuttun. Mochi seni nasıl çağırsın?')
      setSelam('')
      document.getElementById(`${hid}-ad`)?.focus()
      return
    }
    setHata('')
    setSelam(`Merhaba ${t}! Hoş geldin.`)
  }
  return (
    <Section id="hatalar" madde="Madde 11 · Hata durumları" title="Üzgün ama sakin" lead="Hata ekranında kırmızı, ünlem, alarm dili yok. Maskot üzülür, ne olduğunu çocuk diliyle söyler ve tek bir yumuşak çıkış yolu gösterir. Metin yine koyu kahverengi, zemin pastel.">
      <ul className="m-0 grid list-none grid-cols-1 gap-x-6 gap-y-14 p-0 pt-8 md:grid-cols-2 lg:grid-cols-3">
        <CloudCard as="li" renk="mint" className="grid content-start justify-items-center gap-3 px-6 pt-10 pb-8 text-center" data-baglanti={baglanti}>
          <LottieMascot ruh={baglanti === 'tamam' ? 'heyecanli' : baglanti === 'deniyor' ? 'saskin' : 'uzgun'} renk="paper" boyut={140} etiket={baglanti === 'tamam' ? 'Sevinen maskot' : 'Üzgün maskot'} />
          <h3 className="text-[28px]">{baglanti === 'tamam' ? 'Bağlandık!' : 'İnternet uyuyakaldı'}</h3>
          <p className="text-[16px]" aria-live="polite">
            {baglanti === 'koptu' ? 'Ağ bağlantısı yok gibi. Kaldığın yer kayıtlı, hiçbir şey kaybolmadı.' : baglanti === 'deniyor' ? 'Uyandırmaya çalışıyoruz…' : 'Dersler yeniden hazır.'}
          </p>
          {baglanti === 'deniyor' ? (
            <span className="noktalar mt-2" role="status" aria-label="Yeniden bağlanılıyor">
              <i />
              <i />
              <i />
            </span>
          ) : (
            <KawaiiButton renk="paper" className="mt-2" onClick={() => setBaglanti(baglanti === 'tamam' ? 'koptu' : 'deniyor')} ikon={<Ikon ad="yenile" boyut={24} />}>
              {baglanti === 'tamam' ? 'Hatayı yeniden göster' : 'Tekrar dene'}
            </KawaiiButton>
          )}
        </CloudCard>
        <CloudCard as="li" renk="peach" className="grid content-start justify-items-center gap-3 px-6 pt-10 pb-8 text-center">
          <Mascot ruh="saskin" renk="salmon" boyut={140} etiket="Şaşkın maskot" />
          <p className="font-display text-[56px] leading-none font-extrabold" aria-hidden="true">
            4<span className="inline-block translate-y-1">0</span>4
          </p>
          <h3 className="text-[28px]">Bu sayfa saklambaç oynuyor</h3>
          <p className="text-[16px]">Aradığın sayfayı bulamadık. Belki adı değişti, belki de çok iyi saklandı.</p>
          <KawaiiButton renk="mint" className="mt-2" onClick={() => document.getElementById('ust')?.scrollIntoView()} ikon={<Ikon ad="yukari" boyut={24} />}>
            Başa dön
          </KawaiiButton>
        </CloudCard>
        <CloudCard as="li" renk="rose" className="grid content-start justify-items-center gap-3 px-6 pt-10 pb-8 text-center">
          <Mascot ruh="uykulu" renk="paper" boyut={140} etiket="Uykulu maskot" />
          <h3 className="text-[28px]">Rozet kutun boş</h3>
          <p className="text-[16px]">Henüz rozet yok. İlk dersini bitirince ilk rozet buraya konacak.</p>
          <KawaiiButton renk="paper" className="mt-2" onClick={() => document.getElementById('dil')?.scrollIntoView()} lottie="yildiz">
            İlk derse git
          </KawaiiButton>
        </CloudCard>
      </ul>
      <div className="mt-12 grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.2fr_1fr]">
        <form className="kabarcik grid min-w-0 grid-cols-1 content-start gap-4 p-6 md:p-8" onSubmit={gonder} noValidate data-form="">
          <label htmlFor={`${hid}-ad`} className="font-display text-[24px] font-extrabold">
            Adın ne?
          </label>
          <input
            id={`${hid}-ad`}
            value={ad}
            onChange={(e) => setAd(e.target.value)}
            autoComplete="given-name"
            aria-invalid={hata ? true : undefined}
            aria-describedby={hata ? `${hid}-hata` : undefined}
            className={cx('block min-h-14 w-full rounded-bubble px-5 text-[18px] font-bold text-brown outline-offset-4', hata ? 'border-[3px] border-salmon-d bg-[#fff1ee]' : 'border-[3px] border-[#f1dcd2] bg-cream')}
          />
          {hata ? (
            <p id={`${hid}-hata`} className="flex items-start gap-3 rounded-[24px] bg-peach px-4 py-3 text-[16px] font-bold" data-form-hata="">
              <Ikon ad="bulut" ruh="uzgun" boyut={34} />
              <span className="min-w-0">{hata}</span>
            </p>
          ) : null}
          {selam ? (
            <p className="flex items-center gap-3 rounded-[24px] bg-mint px-4 py-3 text-[16px] font-bold" role="status" data-form-selam="">
              <Ikon ad="kalp" boyut={34} /> {selam}
            </p>
          ) : null}
          <KawaiiButton type="submit" className="justify-self-start">
            Tanışalım
          </KawaiiButton>
        </form>
        <div className="grid min-w-0 grid-cols-1 content-start gap-4">
          <p className="kicker text-muted">Hata metni rehberi</p>
          <ul className="m-0 grid list-none gap-3 p-0 text-[16px]">
            {[
              ['Suçlama yok', '"Yanlış girdin" değil, "Adını yazmayı unuttun".'],
              ['Çözüm söyle', 'Her hata bir örnek ya da tek düğmelik çıkış yolu verir.'],
              ['Renk tek başına değil', 'Şeftali zemin + üzgün bulut ikonu + metin + aria-invalid.'],
              ['Odak geri döner', 'Gönderimde hata varsa odak alana taşınır, mesaj alana bağlıdır.'],
            ].map(([a, b]) => (
              <li key={a} className="flex items-start gap-3 rounded-[24px] bg-paper p-4">
                <Ikon ad="onay" boyut={26} className="mt-0.5" />
                <span className="min-w-0">
                  <b className="font-extrabold">{a}.</b> {b}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}

/** Madde 11: eğlenceli ve kalın ilerleme bileşenleri */
export function Ilerleme() {
  const [deger, setDeger] = useState(60)
  const [renk, setRenk] = useState<'mint' | 'peach' | 'salmon' | 'rose'>('mint')
  const adim = Math.round((deger / 100) * 5)
  const R = 52
  const C = 2 * Math.PI * R
  return (
    <Section id="ilerleme" madde="Madde 11 · İlerleme" title="Kalın şeker çubuğu" lead="30px kalınlıkta hap ray, içinde eğik şeker şeritleri akar; uçta küçük maskot ilerlemeyi sırtında taşır. Boşken uyur, dolunca sevinir. Değer her zaman yazıyla da görünür.">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="kabarcik grid min-w-0 grid-cols-1 content-start gap-8 p-6 md:p-8">
          <KawaiiProgress etiket="Haftalık hedef" deger={deger} renk={renk} />
          <div>
            <p className="flex items-baseline justify-between text-[16px] font-extrabold">
              <span>Adım göstergesi</span>
              <span className="tabular-nums">{adim} / 5</span>
            </p>
            <ol className="m-0 mt-3 flex list-none items-center gap-2 p-0" aria-label={`Beş adımdan ${adim} tamam`}>
              {[0, 1, 2, 3, 4].map((i) => (
                <li key={i} className={cx('grid h-12 flex-1 place-items-center rounded-bubble transition-colors duration-300', i < adim ? 'shadow-[var(--sh-mint)]' : 'bg-[#f3e3da]')} style={i < adim ? { background: `var(--${renk})` } : undefined}>
                  {i < adim ? <Ikon ad="onay" boyut={24} /> : <span className="text-[15px] font-extrabold text-muted">{i + 1}</span>}
                </li>
              ))}
            </ol>
          </div>
          <KSlider label="İlerleme" value={deger} min={0} max={100} onChange={setDeger} format={(v) => `%${v}`} renk={renk} />
          <Secim
            legend="Çubuk rengi"
            name="ilerleme-renk"
            value={renk}
            onChange={setRenk}
            options={[
              { id: 'mint', ad: 'Nane' },
              { id: 'peach', ad: 'Bebek pembesi' },
              { id: 'salmon', ad: 'Şeftali' },
              { id: 'rose', ad: 'Lavanta' },
            ]}
          />
        </div>
        <div className="kabarcik grid min-w-0 justify-items-center gap-4 p-6 text-center">
          <p className="font-display text-[24px] font-extrabold">Halka</p>
          <div className="relative size-[200px]">
            <svg viewBox="0 0 140 140" className="size-full -rotate-90" role="progressbar" aria-label="Halka ilerleme" aria-valuemin={0} aria-valuemax={100} aria-valuenow={deger} aria-valuetext={`%${deger}`}>
              <circle cx="70" cy="70" r={R} fill="none" stroke="#f3e3da" strokeWidth="18" />
              <circle cx="70" cy="70" r={R} fill="none" stroke={`var(--${renk})`} strokeWidth="18" strokeLinecap="round" strokeDasharray={`${(C * deger) / 100} ${C}`} className="transition-[stroke-dasharray] duration-700 ease-[var(--jel)]" />
            </svg>
            <div className="absolute inset-0 grid place-items-center">{deger >= 100 ? <LottieMascot ruh="heyecanli" renk="peach" boyut={104} /> : <Mascot ruh={deger === 0 ? 'uykulu' : 'mutlu'} renk="peach" boyut={96} />}</div>
          </div>
          <p className="font-display text-[32px] leading-none font-extrabold tabular-nums">%{deger}</p>
          <p className="text-[15px] text-muted">Uçlar yuvarlak (stroke-linecap: round), ray 18 birim kalın.</p>
        </div>
      </div>
    </Section>
  )
}
