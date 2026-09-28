import { useState } from 'react'
import { cx } from '../../shared/cx'
import { useKawaii } from '../lib/store'
import { CloudCard } from '../components/CloudCard'
import { KawaiiButton } from '../components/KawaiiButton'
import { KawaiiProgress } from '../components/KawaiiProgress'
import { LottieMascot } from '../components/LottieMascot'
import { Mascot } from '../components/Mascot'
import { MascotTooltip } from '../components/MascotTooltip'
import { Ikon, type IkonAd } from '../components/Icons'
import { Section } from '../components/ui'

const SAYILAR = [3, 5, 4, 7, 6]
const SECENEK = (n: number, tur: number) => {
  const l = [n - 1, n, n + 1]
  // Doğru cevap her turda başka yerde dursun
  const k = tur % 3
  return [...l.slice(k), ...l.slice(0, k)]
}
const SAYI_AD = ['sıfır', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz']

/** Madde 10: çocuklar için sayma oyunu */
export function SayiBahcesi() {
  const { duyur } = useKawaii()
  const [tur, setTur] = useState(0)
  const [durum, setDurum] = useState<'soru' | 'dogru' | 'yanlis'>('soru')
  const [yildiz, setYildiz] = useState(0)
  const bitti = tur >= SAYILAR.length
  const n = SAYILAR[Math.min(tur, SAYILAR.length - 1)]
  const sec = (x: number) => {
    if (x === n) {
      setDurum('dogru')
      setYildiz((y) => y + 1)
      duyur(`Doğru! ${n} elma. Bir yıldız kazandın.`)
    } else {
      setDurum('yanlis')
      duyur(`Hmm, ${x} değil. Elmaların üstünde numaralar belirdi, birlikte sayalım.`)
    }
  }
  const sonraki = () => {
    setTur((t) => t + 1)
    setDurum('soru')
  }
  const bastan = () => {
    setTur(0)
    setYildiz(0)
    setDurum('soru')
  }
  return (
    <Section id="sayi" madde="Madde 10 · Eğitim platformu" title="Sayı Bahçesi" lead="5 yaş için sayma oyunu. Yanlış cevap cezalandırılmaz: maskot biraz üzülür, elmaların üstünde numaralar belirir ve çocuk yeniden dener.">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr]">
        <CloudCard renk="mint" className="min-w-0 px-5 pt-8 pb-7 md:px-8" data-sayi-oyun="">
          <KawaiiProgress etiket="Tur" deger={Math.min(tur + (durum === 'dogru' ? 1 : 0), SAYILAR.length)} max={SAYILAR.length} renk="peach" maskotRenk="paper" birim={(d, m) => `${d} / ${m}`} />
          {bitti ? (
            <div className="mt-8 grid justify-items-center gap-4 text-center">
              <LottieMascot ruh="heyecanli" renk="peach" boyut={150} etiket="Heyecanlı maskot" />
              <p className="font-display text-[30px] font-extrabold">Bahçe tamam!</p>
              <p className="text-[18px]">{yildiz} yıldız topladın.</p>
              <KawaiiButton onClick={bastan} ikon={<Ikon ad="yenile" boyut={24} />}>
                Yeniden oyna
              </KawaiiButton>
            </div>
          ) : (
            <>
              <p className="mt-6 font-display text-[28px] font-extrabold" id="sayi-soru">
                Ağaçta kaç elma var?
              </p>
              <ul className="m-0 mt-4 flex min-h-[132px] list-none flex-wrap items-center justify-center gap-3 rounded-[32px] bg-paper/70 p-4" aria-label={`${n} elma`} data-elmalar={n}>
                {Array.from({ length: n }, (_, i) => (
                  <li key={`${tur}-${i}`} className="relative" data-giris="1" style={{ ['--gecik' as string]: `${i * 70}ms` }}>
                    <Ikon ad="elma" boyut={54} />
                    {durum === 'yanlis' ? (
                      <span className="absolute -top-2 -right-2 grid size-7 place-items-center rounded-full bg-peach text-[15px] font-black shadow-[var(--sh-peach)]" aria-hidden="true">
                        {i + 1}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap justify-center gap-4" role="group" aria-labelledby="sayi-soru">
                {SECENEK(n, tur).map((x) => (
                  <KawaiiButton key={x} boy="b" renk="paper" className="!min-w-24 tabular-nums" disabled={durum === 'dogru'} onClick={() => sec(x)} aria-label={`${x}, ${SAYI_AD[x]}`}>
                    {x}
                  </KawaiiButton>
                ))}
              </div>
            </>
          )}
        </CloudCard>
        <div className="grid min-w-0 grid-cols-1 content-start gap-6">
          <div className="kabarcik flex items-center gap-4 p-5" aria-live="polite" data-sayi-geri="">
            {durum === 'dogru' ? <LottieMascot ruh="heyecanli" renk="peach" boyut={96} /> : <Mascot ruh={durum === 'yanlis' ? 'uzgun' : 'mutlu'} renk="peach" boyut={96} />}
            <div className="min-w-0">
              <p className="font-display text-[24px] font-extrabold">{bitti ? 'Harikasın!' : durum === 'dogru' ? `Evet, ${SAYI_AD[n]}!` : durum === 'yanlis' ? 'Az kaldı!' : 'Birlikte sayalım'}</p>
              <p className="text-[16px] text-muted">{durum === 'yanlis' ? 'Numaralara bakıp bir daha dene. Acele yok.' : durum === 'dogru' ? 'Bir yıldız senin.' : 'Parmağınla elmaları tek tek say.'}</p>
            </div>
          </div>
          {durum === 'dogru' && !bitti ? (
            <KawaiiButton renk="mint" boy="b" onClick={sonraki} ikon={<Ikon ad="ok" boyut={26} />} data-sonraki="">
              Sonraki ağaç
            </KawaiiButton>
          ) : null}
          <p className="flex items-center gap-3 rounded-bubble bg-paper px-5 py-3 font-extrabold">
            <Ikon ad="yildiz" boyut={34} />
            <span className="tabular-nums" data-yildiz={yildiz}>
              {yildiz} yıldız
            </span>
          </p>
        </div>
      </div>
    </Section>
  )
}

const SORULAR: { tr: string; ikon: IkonAd; dogru: string }[] = [
  { tr: 'elma', ikon: 'elma', dogru: 'apple' },
  { tr: 'yıldız', ikon: 'yildiz', dogru: 'star' },
  { tr: 'top', ikon: 'top', dogru: 'ball' },
  { tr: 'ay', ikon: 'ay', dogru: 'moon' },
  { tr: 'kalp', ikon: 'kalp', dogru: 'heart' },
]
const KAR = [
  ['apple', 'star', 'ball', 'moon'],
  ['ball', 'moon', 'star', 'apple'],
  ['moon', 'apple', 'heart', 'ball'],
  ['star', 'moon', 'ball', 'heart'],
  ['heart', 'apple', 'star', 'ball'],
]
const IKON_EN: Record<string, IkonAd> = {
  apple: 'elma',
  ball: 'top',
  star: 'yildiz',
  moon: 'ay',
  heart: 'kalp',
}

/** Madde 10 · 11: Duolingo tarzı dil dersi. Can, seri, kalın ilerleme ve sakin geri bildirim */
export function DilDersi() {
  const { duyur } = useKawaii()
  const [i, setI] = useState(0)
  const [secim, setSecim] = useState<string | null>(null)
  const [kontrol, setKontrol] = useState<'yok' | 'dogru' | 'yanlis'>('yok')
  const [can, setCan] = useState(5)
  const [seri, setSeri] = useState(0)
  const [ipucu, setIpucu] = useState(false)
  const bitti = i >= SORULAR.length
  const s = SORULAR[Math.min(i, SORULAR.length - 1)]
  const kontrolEt = () => {
    if (!secim) return
    if (secim === s.dogru) {
      setKontrol('dogru')
      setSeri((x) => x + 1)
      duyur(`Doğru! ${s.tr}: ${s.dogru}.`)
    } else {
      setKontrol('yanlis')
      setSeri(0)
      setCan((c) => Math.max(0, c - 1))
      duyur(`Olmadı. Doğrusu ${s.dogru}. Bir can gitti, ${can - 1} can kaldı.`)
    }
  }
  const devam = () => {
    setI((x) => x + 1)
    setSecim(null)
    setKontrol('yok')
  }
  const sifirla = () => {
    setI(0)
    setSecim(null)
    setKontrol('yok')
    setCan(5)
    setSeri(0)
  }
  const canYok = can === 0 && kontrol === 'yok'
  return (
    <Section id="dil" madde="Madde 10 · 11 · Dil öğrenme" title="Minik İngilizce" lead="Duolingo tarzı ders: kelimeyi seç, kontrol et. Yanlışta kırmızı alarm yok; alt şerit yumuşak şeftaliye döner, maskot üzülür ve doğrusunu nazikçe söyler.">
      <div className="kabarcik mx-auto max-w-[760px] overflow-hidden" data-dil-ders="">
        <div className="flex flex-wrap items-center gap-4 px-5 pt-5 md:px-8">
          <KawaiiButton renk="paper" boy="k" className="!size-12 !min-h-12 !p-0" onClick={sifirla} aria-label="Dersi baştan başlat">
            <Ikon ad="yenile" boyut={24} />
          </KawaiiButton>
          <KawaiiProgress className="min-w-0 flex-1 basis-[180px]" etiket="Ders" deger={i + (kontrol === 'dogru' ? 1 : 0)} max={SORULAR.length} maskot={false} birim={(d, m) => `${Math.min(d, m)} / ${m}`} />
          <div className="flex shrink-0 items-center gap-4">
            <p className="flex items-center gap-1.5 font-extrabold tabular-nums" aria-label={`${can} can`} data-can={can}>
              <Ikon ad="kalp" boyut={32} ruh={can ? 'mutlu' : 'uzgun'} /> {can}
            </p>
            <p className="flex items-center gap-1.5 font-extrabold tabular-nums" aria-label={`${seri} doğru seri`}>
              <Ikon ad="ates" boyut={32} /> {seri}
            </p>
          </div>
        </div>
        {bitti || canYok ? (
          <div className="grid justify-items-center gap-4 px-5 py-10 text-center" data-dil-son="">
            <LottieMascot ruh={canYok ? 'uykulu' : 'heyecanli'} renk="salmon" boyut={150} etiket={canYok ? 'Uykulu maskot' : 'Heyecanlı maskot'} />
            <p className="font-display text-[32px] font-extrabold">{canYok ? 'Canların dinleniyor' : 'Ders bitti!'}</p>
            <p className="max-w-[40ch] text-[18px]">{canYok ? 'Mochi de biraz uyuyacak. Canlar yarın sabah dolar; istersen şimdi baştan deneyebilirsin.' : `${SORULAR.length} kelime öğrendin. Yarın görüşürüz!`}</p>
            <KawaiiButton onClick={sifirla} lottie="kalp">
              {canYok ? 'Canları doldur' : 'Bir daha'}
            </KawaiiButton>
          </div>
        ) : (
          <>
            <div className="px-5 pt-8 pb-6 md:px-8">
              <div className="flex items-center gap-4">
                <MascotTooltip icerik={<>İpucu: resme bak! "{s.tr}" kelimesinin resmi seçeneklerde de var.</>} ruh="mutlu" renk="mint" acik={ipucu} onAcik={setIpucu}>
                  <button type="button" className="shrink-0 rounded-full" aria-label="Mochi'den ipucu" onClick={() => setIpucu((v) => !v)} data-ipucu-tetik="">
                    <Mascot ruh="mutlu" renk="salmon" boyut={84} />
                  </button>
                </MascotTooltip>
                <p className="kabarcik relative px-5 py-3 font-display text-[24px] font-extrabold" id="dil-soru">
                  "<span>{s.tr}</span>" İngilizcede hangisi?
                </p>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4" role="radiogroup" aria-labelledby="dil-soru">
                {KAR[i].map((en) => {
                  const on = secim === en
                  const dogruBu = kontrol !== 'yok' && en === s.dogru
                  const yanlisBu = kontrol === 'yanlis' && on
                  return (
                    <button
                      key={en}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      disabled={kontrol !== 'yok'}
                      onClick={() => setSecim(en)}
                      className={cx(
                        'grid min-h-[120px] justify-items-center gap-2 rounded-[32px] border-[3px] p-4 font-display text-[22px] font-extrabold transition-[scale,background-color] duration-300 ease-[var(--jel)] disabled:cursor-default',
                        on && kontrol === 'yok' ? 'scale-[1.03] border-mint-d bg-mint shadow-[var(--sh-mint)]' : dogruBu ? 'border-mint-d bg-mint' : yanlisBu ? 'border-salmon-d bg-peach' : 'border-[#f1dcd2] bg-paper hover:bg-cream',
                      )}
                      data-kelime={en}
                    >
                      <Ikon ad={IKON_EN[en]} boyut={48} ruh={yanlisBu ? 'uzgun' : 'mutlu'} />
                      <span lang="en">{en}</span>
                      {dogruBu ? <span className="sr-only">, doğru cevap</span> : yanlisBu ? <span className="sr-only">, senin seçimin, yanlış</span> : null}
                    </button>
                  )
                })}
              </div>
            </div>
            <div className={cx('flex flex-wrap items-center gap-4 px-5 py-5 transition-colors duration-300 md:px-8', kontrol === 'dogru' ? 'bg-mint' : kontrol === 'yanlis' ? 'bg-peach' : 'bg-cream')} data-dil-serit={kontrol}>
              {kontrol !== 'yok' ? (
                <div className="flex min-w-0 flex-1 basis-[220px] items-center gap-3">
                  <Mascot ruh={kontrol === 'dogru' ? 'heyecanli' : 'uzgun'} renk="paper" boyut={64} />
                  <div className="min-w-0">
                    <p className="font-display text-[22px] font-extrabold">{kontrol === 'dogru' ? 'Süpersin!' : 'Olmadı, sorun değil'}</p>
                    <p className="text-[16px]">
                      {s.tr} = <b lang="en">{s.dogru}</b>
                    </p>
                  </div>
                </div>
              ) : (
                <p className="min-w-0 flex-1 basis-[160px] text-[16px] text-muted">Bir kart seç, sonra kontrol et.</p>
              )}
              {kontrol === 'yok' ? (
                <KawaiiButton renk="mint" boy="b" disabled={!secim} onClick={kontrolEt}>
                  Kontrol et
                </KawaiiButton>
              ) : (
                <KawaiiButton renk={kontrol === 'dogru' ? 'paper' : 'salmon'} boy="b" onClick={devam} ikon={<Ikon ad="ok" boyut={26} />}>
                  Devam
                </KawaiiButton>
              )}
            </div>
          </>
        )}
      </div>
    </Section>
  )
}
