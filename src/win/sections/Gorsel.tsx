import { useEffect, useMemo, useState } from 'react'
import { cx } from '../../shared/cx'
import { useWin, type Duvar } from '../lib/store'
import { IKONLAR, PALET, PALET_AD, dikdortgenler, type IkonAd } from '../lib/pixel'
import { duvarCiz, sonRenkSayisi } from '../lib/duvar'
import { Win95Window } from '../components/Win95Window'
import { Pixel } from '../components/Pixel'
import { DUVARLAR, Monitor } from '../components/Apps'
import { Button, GroupBox } from '../components/ui'

/** Düğmenin sol üst köşesi, piksel piksel: 2px beyaz, 2px gri, arası yüz rengi */
function KoseBuyutec() {
  const W = 14
  const H = 9
  const px: string[][] = Array.from({ length: H }, (_, y) =>
    Array.from({ length: W }, (_, x) => {
      if (y < 2 && x < W - 2) return '#FFFFFF'
      if (x < 2 && y < H) return '#FFFFFF'
      if (x >= W - 2 || y >= H) return '#808080'
      return '#C0C0C0'
    }),
  )
  // Sağ kenar gri, alt satır yok (kesit)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="field h-auto w-full max-w-[20rem]" shapeRendering="crispEdges" role="img" aria-label="Büyütülmüş düğme kenarı: üst ve sol 2 piksel beyaz, sağ 2 piksel gri, iç yüz #C0C0C0">
      {px.flatMap((row, y) => row.map((c, x) => <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={c} stroke="#00000022" strokeWidth={0.04} />))}
    </svg>
  )
}

/** Madde 6 · 7: kare köşe, gölge yok, kabartma yalnız kenar rengiyle */
export function Kabartma() {
  const [sayim, setSayim] = useState<{ yuvarlak: number; golge: number } | null>(null)
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const hepsi = [...document.querySelectorAll<HTMLElement>('body *')]
      setSayim({
        yuvarlak: hepsi.filter((e) => parseFloat(getComputedStyle(e).borderTopLeftRadius) > 0).length,
        golge: hepsi.filter((e) => getComputedStyle(e).boxShadow !== 'none' || getComputedStyle(e).textShadow !== 'none').length,
      })
    })
    return () => cancelAnimationFrame(id)
  }, [])
  return (
    <Win95Window id="kabartma" baslik="Şekil ve Kabartma (Madde 6 · 7)" ikon="pencere">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <GroupBox legend="Dört yüzey">
          <ul className="grid grid-cols-2 gap-3 pt-1">
            <li>
              <span className="grid h-12 place-items-center border-2 border-transparent bg-face">Düz</span>
              <p className="mt-1 text-[0.8125rem] text-muted">Kenar yok: yüzey kaybolur.</p>
            </li>
            <li>
              <span className="outset grid h-12 place-items-center">Çıkıntı</span>
              <p className="mt-1 text-[0.8125rem] text-muted">Üst-sol beyaz, alt-sağ gri.</p>
            </li>
            <li>
              <span className="field grid h-12 place-items-center">Çukur</span>
              <p className="mt-1 text-[0.8125rem] text-muted">Renkler yer değiştirir: alan, liste.</p>
            </li>
            <li>
              <span className="btn grid h-12 w-full place-items-center" data-basili="1">
                Basılı
              </span>
              <p className="mt-1 text-[0.8125rem] text-muted">Düğme çöker, yazı 1px kayar.</p>
            </li>
          </ul>
        </GroupBox>
        <GroupBox legend="Kenar, piksel piksel">
          <KoseBuyutec />
          <p className="mt-2 text-[0.8125rem]">Işık hep sol üstten gelir. Gölge, bulanıklık, degrade yok: derinlik iki kenar renginden ibaret.</p>
        </GroupBox>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button>Bas bana</Button>
        <Button varsayilan>Varsayılan</Button>
        <Button disabled>Pasif</Button>
        <span className="ml-2 text-[0.8125rem]">Basılı tutun: kenarlar anında yer değiştirir.</span>
      </div>
      <p className="panel mt-4 px-2 py-1 text-[0.8125rem]" data-sayim="">
        Sayfada yuvarlak köşeli öğe: <b>{sayim?.yuvarlak ?? '…'}</b> · gölgeli öğe: <b>{sayim?.golge ?? '…'}</b>
      </p>
    </Win95Window>
  )
}

/** 4×4 Bayer eşik matrisi */
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]

/** Madde 8: dither ve 16 renkli duvar kağıtları */
export function Doku() {
  const w = useWin()
  const gece = w.theme === 'dark'
  const [karsi, setKarsi] = useState<{ duz: string; ditherli: string; n1: number; n2: number } | null>(null)
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const duz = duvarCiz(gece, 160, 100, false)
      const n1 = sonRenkSayisi
      const ditherli = duvarCiz(gece, 160, 100, true)
      const n2 = sonRenkSayisi
      setKarsi({ duz, ditherli, n1, n2 })
    })
    return () => cancelAnimationFrame(id)
  }, [gece])
  return (
    <Win95Window id="doku" baslik="Doku ve Dither (Madde 8)" ikon="goruntu">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <GroupBox legend="Masaüstü duvar kağıdı">
          <Monitor duvar={w.duvar} />
          <div className="mt-3 grid gap-1">
            {DUVARLAR.map((d) => (
              <label key={d.id} className="inline-flex items-center gap-1.5">
                <input type="radio" className="r95" name="duvar-doku" checked={w.duvar === d.id} onChange={() => w.setDuvar(d.id as Duvar)} />
                {d.ad}
              </label>
            ))}
          </div>
          <p className="mt-2 text-[0.8125rem] text-muted">Seçim hemen masaüstüne uygulanır.</p>
        </GroupBox>
        <GroupBox legend="Dither: iki renkten üçüncüsü">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <div className="inset size-16" data-duvar-ornek="dama" aria-hidden="true" />
              <p className="mt-1 text-[0.75rem]">turkuaz + lacivert</p>
            </div>
            <div>
              <svg viewBox="0 0 4 4" className="inset size-16" shapeRendering="crispEdges" aria-hidden="true">
                {[0, 1, 2, 3].flatMap((y) => [0, 1, 2, 3].map((x) => <rect key={`${x}${y}`} x={x} y={y} width={1} height={1} fill={(x + y) % 2 ? '#000080' : '#008080'} />))}
              </svg>
              <p className="mt-1 text-[0.75rem]">16 kat büyük</p>
            </div>
            <table className="text-[0.75rem] tabular-nums" aria-label="4 × 4 Bayer eşik matrisi">
              <tbody>
                {[0, 1, 2, 3].map((r) => (
                  <tr key={r}>
                    {BAYER.slice(r * 4, r * 4 + 4).map((v) => (
                      <td key={v} className="panel w-6 text-center">
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[0.8125rem]">Göz yan yana iki pikseli karıştırır. Sıralı dither eşiği her pikselde Bayer matrisinden alır: bantlaşma yerine düzenli bir doku.</p>
        </GroupBox>
      </div>
      <GroupBox legend="Aynı gökyüzü, 16 renk" className="mt-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <figure className="m-0">
            {karsi ? <img src={karsi.duz} alt="" className="inset block h-auto w-full [image-rendering:pixelated]" /> : <div className="inset aspect-[8/5]" />}
            <figcaption className="mt-1 text-[0.8125rem]">Dither yok: renk bantları ({karsi?.n1 ?? '…'} renk)</figcaption>
          </figure>
          <figure className="m-0">
            {karsi ? <img src={karsi.ditherli} alt="" className="inset block h-auto w-full [image-rendering:pixelated]" /> : <div className="inset aspect-[8/5]" />}
            <figcaption className="mt-1 text-[0.8125rem]" data-dither-renk={karsi?.n2}>
              Bayer dither: geçişler yumuşar ({karsi?.n2 ?? '…'} renk, 16'nın altında)
            </figcaption>
          </figure>
        </div>
      </GroupBox>
    </Win95Window>
  )
}

const IKON_AD: Record<IkonAd, string> = {
  bilgisayar: 'Bilgisayar',
  goruntu: 'Görüntü',
  klasor: 'Klasör',
  belge: 'Belge',
  disket: 'Disket',
  cop: 'Geri dönüşüm',
  not: 'Not defteri',
  oyun: 'Oyun',
  mayin: 'Mayın',
  bayrak: 'Bayrak',
  uyari: 'Uyarı',
  bilgi: 'Bilgi',
  soru: 'Soru',
  hata: 'Hata',
  kumsaati: 'Kum saati',
  ag: 'Ağ',
  pencere: 'Pencere',
  ampul: 'İpucu',
  gulen: 'Gülen yüz',
  uzgun: 'Üzgün yüz',
  havali: 'Havalı yüz',
}

/** Madde 9: 16×16 piksel ikonlar, 32×32 görünüm ve piksel büyüteç */
export function Ikonlar() {
  const [sec, setSec] = useState<IkonAd>('bilgisayar')
  const adlar = Object.keys(IKONLAR) as IkonAd[]
  const kullanilan = useMemo(() => [...new Set(IKONLAR[sec].join('').replace(/\./g, ''))], [sec])
  const dolu = useMemo(() => IKONLAR[sec].join('').replace(/\./g, '').length, [sec])
  return (
    <Win95Window id="ikonlar" baslik="Piksel İkonlar (Madde 9)" ikon="klasor">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div>
          <p className="mb-2">16 × 16 piksel çizim, yanında 32 × 32 (aynı çizim, iki kat). Birine tıklayın, büyüteçte açılsın.</p>
          <ul className="field k95 grid max-h-[22rem] grid-cols-2 gap-1 overflow-auto p-1 sm:grid-cols-3" aria-label="İkonlar">
            {adlar.map((a) => (
              <li key={a}>
                <button type="button" aria-pressed={sec === a} onClick={() => setSec(a)} className={cx('flex w-full items-center gap-2 px-1.5 py-1 text-left', sec === a && 'secili')} data-ikon-sec={a}>
                  <Pixel ad={a} />
                  <Pixel ad={a} boyut={2} />
                  <span className="min-w-0 truncate text-[0.8125rem]">{IKON_AD[a]}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <GroupBox legend={`Büyüteç: ${IKON_AD[sec]}`}>
          <svg viewBox="0 0 16 16" className="field block h-auto w-full" shapeRendering="crispEdges" role="img" aria-label={`${IKON_AD[sec]} ikonu, 16 × 16 piksel, 12 kat büyütülmüş`} data-buyutec={sec}>
            <rect width="16" height="16" fill="#FFFFFF" />
            {dikdortgenler(IKONLAR[sec]).map((d, i) => (
              <rect key={i} x={d.x} y={d.y} width={d.w} height={1} fill={d.renk} />
            ))}
            {Array.from({ length: 17 }, (_, i) => (
              <g key={i} stroke="#00000026" strokeWidth={0.04}>
                <line x1={i} y1={0} x2={i} y2={16} />
                <line x1={0} y1={i} x2={16} y2={i} />
              </g>
            ))}
          </svg>
          <p className="mt-2 text-[0.8125rem]">
            {dolu} dolu piksel, {kullanilan.length} renk:
          </p>
          <ul className="mt-1 flex flex-wrap gap-1.5 text-[0.75rem]">
            {kullanilan.map((k) => (
              <li key={k} className="inline-flex items-center gap-1">
                <span className="inset size-3.5" style={{ background: PALET[k] }} aria-hidden="true" />
                {PALET_AD[k]}
              </li>
            ))}
          </ul>
        </GroupBox>
      </div>
    </Win95Window>
  )
}
