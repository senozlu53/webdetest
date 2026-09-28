import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react'
import { cx } from '../../shared/cx'
import { OLCEK, useWin, type Duvar, type Olcek, type Yazi } from '../lib/store'
import { BELGELER, COP_BASLANGIC, OYUNLAR } from '../lib/data'
import type { Theme } from '../../shared/useTheme'
import { AppWindow } from './Win95Window'
import { Pixel } from './Pixel'
import { Button, Check, Progress, Select, Tabs } from './ui'

/* ───────────────────────── Bilgisayarım ───────────────────────── */
function useEkran() {
  const oku = () => ({
    w: document.documentElement.clientWidth,
    h: window.innerHeight,
    kok: parseFloat(getComputedStyle(document.documentElement).fontSize),
    dpr: window.devicePixelRatio,
  })
  const [e, setE] = useState(oku)
  useEffect(() => {
    const f = () => setE(oku())
    window.addEventListener('resize', f)
    const mo = new MutationObserver(f)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-olcek'] })
    return () => {
      window.removeEventListener('resize', f)
      mo.disconnect()
    }
  }, [])
  return e
}

export function Bilgisayarim() {
  const w = useWin()
  const e = useEkran()
  const satir = (a: string, b: string) => (
    <tr>
      <th scope="row" className="py-0.5 pr-4 text-left font-normal text-muted">
        {a}
      </th>
      <td className="py-0.5">{b}</td>
    </tr>
  )
  return (
    <AppWindow pid="bilgisayar" baslik="Sistem Özellikleri" ikon="bilgisayar" genislik="26rem">
      <Tabs
        etiket="Sistem Özellikleri"
        sekmeler={[
          {
            id: 'genel',
            ad: 'Genel',
            icerik: (
              <div className="flex gap-4">
                <Pixel ad="bilgisayar" boyut={4} />
                <table className="text-[0.8125rem]">
                  <caption className="sr-only">Sistem</caption>
                  <tbody>
                    {satir('Sistem', 'Pencere 95 (kurgu)')}
                    {satir('İşlemci', '133 MHz')}
                    {satir('Bellek', '16,0 MB RAM')}
                    {satir('Ekran', `${e.w} × ${e.h} piksel`)}
                    {satir('Kök yazı boyu', `${e.kok} px (${OLCEK[w.olcek].ad})`)}
                    {satir('Piksel oranı', String(e.dpr))}
                    {satir('Renk düzeni', w.theme === 'dark' ? 'Yüksek Kontrast Siyah' : 'Windows Standart')}
                  </tbody>
                </table>
              </div>
            ),
          },
          {
            id: 'aygit',
            ad: 'Aygıtlar',
            icerik: (
              <ul className="space-y-3">
                {(
                  [
                    ['disket', '3½ disket (A:)', 1.2, 1.44, 'MB'],
                    ['bilgisayar', 'Sabit disk (C:)', 812, 1024, 'MB'],
                    ['belge', 'CD-ROM (D:)', 640, 650, 'MB'],
                  ] as const
                ).map(([ik, ad, dolu, top, bir]) => (
                  <li key={ad} className="flex items-center gap-3">
                    <Pixel ad={ik} boyut={2} />
                    <div className="min-w-0 flex-1">
                      <p>{ad}</p>
                      <Progress deger={(dolu / top) * 100} etiket={`${ad} doluluk`} bloklar={16} />
                      <p className="text-[0.75rem] text-muted">
                        {String(dolu).replace('.', ',')} / {String(top).replace('.', ',')} {bir} dolu
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ),
          },
        ]}
      />
      <div className="mt-3 flex justify-end">
        <Button varsayilan onClick={() => w.kapat('bilgisayar')}>
          Tamam
        </Button>
      </div>
    </AppWindow>
  )
}

/* ───────────────────────── Belgelerim ───────────────────────── */
export function Belgelerim() {
  const w = useWin()
  const [klasor, setKlasor] = useState<'kok' | 'oyunlar'>('kok')
  const [secili, setSecili] = useState<string | null>(null)
  const satirlar = useMemo(
    () =>
      klasor === 'kok'
        ? BELGELER
        : [{ ad: '..', tur: 'Üst klasör', boyut: '', tarih: '', ikon: 'klasor' as const }, ...OYUNLAR.map((o) => ({ ad: o.dosya, tur: `${o.tur} oyunu`, boyut: o.boyut, tarih: String(o.yil), ikon: 'oyun' as const }))],
    [klasor],
  )
  const ac = (ad: string) => {
    if (ad === 'Oyunlar') {
      setKlasor('oyunlar')
      setSecili(null)
      w.duyur('Oyunlar klasörü açıldı')
      return
    }
    if (ad === '..') {
      setKlasor('kok')
      setSecili(null)
      w.duyur('Belgelerim')
      return
    }
    const oyun = OYUNLAR.find((o) => o.dosya === ad)
    if (oyun || ad === 'DISKET.EXE') {
      const o = oyun ?? OYUNLAR[0]
      void w.sor({ baslik: o.dosya, ikon: 'oyun', mesaj: <p>{`${o.ad} · ${o.tur} · ${o.durum}. ${o.aciklama}`}</p>, butonlar: [{ ad: 'Tamam', deger: 'tamam', varsayilan: true }] })
      return
    }
    if (ad === 'YEDEK.DSK') {
      void w.sor({ baslik: 'A: sürücüsüne erişilemiyor', ikon: 'hata', mesaj: <p>Aygıt hazır değil. Disketi takıp yeniden deneyin.</p>, butonlar: [{ ad: 'Yeniden dene', deger: 'yeniden', varsayilan: true }, { ad: 'İptal', deger: 'iptal' }] })
      return
    }
    void w.sor({ baslik: ad, ikon: 'bilgi', mesaj: <p>{ad === 'OZGECMIS.DOC' ? 'Piksel Kulübe · kurucu, oyun tasarımcısı. 1996\'dan beri piksel çiziyor.' : 'Basın bülteni: Disket Avcısı 1.0 çıktı. Sistem gereksinimi: 4 MB bellek.'}</p>, butonlar: [{ ad: 'Tamam', deger: 'tamam', varsayilan: true }] })
  }
  return (
    <AppWindow pid="belgeler" baslik={klasor === 'kok' ? 'Belgelerim' : 'Belgelerim\\Oyunlar'} ikon="klasor" genislik="32rem" govde="p-0.5" durum={[`${satirlar.length} nesne`, secili ?? '']}>
      <div className="field k95 max-h-[18rem] overflow-auto">
        <table className="w-full min-w-[26rem] text-left text-[0.8125rem]">
          <caption className="sr-only">Dosyalar: Enter ya da çift tık açar</caption>
          <thead>
            <tr>
              {['Ad', 'Boyut', 'Tür', 'Değiştirilme'].map((h) => (
                <th key={h} scope="col" className="outset sticky top-0 px-1.5 py-0.5 font-normal">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {satirlar.map((s) => (
              <tr key={s.ad} onClick={() => setSecili(s.ad)} onDoubleClick={() => ac(s.ad)}>
                <td className="px-1.5 py-0.5">
                  <button
                    type="button"
                    className={cx('inline-flex items-center gap-1.5 px-0.5', secili === s.ad && 'secili')}
                    onFocus={() => setSecili(s.ad)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        ac(s.ad)
                      }
                    }}
                    onDoubleClick={() => ac(s.ad)}
                    data-dosya={s.ad}
                  >
                    <Pixel ad={s.ikon} />
                    {s.ad}
                  </button>
                </td>
                <td className="px-1.5 py-0.5 text-right tabular-nums">{s.boyut}</td>
                <td className="px-1.5 py-0.5">{s.tur}</td>
                <td className="px-1.5 py-0.5 tabular-nums">{s.tarih}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppWindow>
  )
}

/* ───────────────────────── Mayın Tarlası ───────────────────────── */
interface Hucre {
  m: boolean
  a: boolean
  b: boolean
  n: number
}
const N = 9
const MAYIN = 10
const RENK = ['', '#0000FF', '#008000', '#FF0000', '#000080', '#800000', '#008080', '#000000', '#808080']
const bos = (): Hucre[] => Array.from({ length: N * N }, () => ({ m: false, a: false, b: false, n: 0 }))
const komsu = (i: number) => {
  const r = Math.floor(i / N)
  const c = i % N
  const o: number[] = []
  for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) if ((dr || dc) && r + dr >= 0 && r + dr < N && c + dc >= 0 && c + dc < N) o.push((r + dr) * N + c + dc)
  return o
}

export function MayinTarlasi() {
  const w = useWin()
  const [h, setH] = useState<Hucre[]>(bos)
  const [durum, setDurum] = useState<'hazir' | 'oyun' | 'kayip' | 'kazanc'>('hazir')
  const [sure, setSure] = useState(0)
  const [bayrakKipi, setBayrakKipi] = useState(false)
  const [odak, setOdak] = useState(0)
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  useEffect(() => {
    if (durum !== 'oyun') return
    const id = window.setInterval(() => setSure((s) => Math.min(999, s + 1)), 1000)
    return () => window.clearInterval(id)
  }, [durum])
  const yeni = () => {
    setH(bos())
    setDurum('hazir')
    setSure(0)
    w.duyur('Yeni oyun')
  }
  const kalan = MAYIN - h.filter((x) => x.b).length
  const ac = (i: number) => {
    if (durum === 'kayip' || durum === 'kazanc') return
    let g = h.map((x) => ({ ...x }))
    if (g[i].b || g[i].a) return
    if (durum === 'hazir') {
      // İlk tık güvenli: mayınlar tıklanan hücre ve komşuları dışına dağılır
      const yasak = new Set([i, ...komsu(i)])
      const adaylar = g.map((_, k) => k).filter((k) => !yasak.has(k))
      for (let k = 0; k < MAYIN; k++) {
        const j = Math.floor(Math.random() * adaylar.length)
        g[adaylar[j]].m = true
        adaylar.splice(j, 1)
      }
      g = g.map((x, k) => ({ ...x, n: komsu(k).filter((q) => g[q].m).length }))
      setDurum('oyun')
    }
    if (g[i].m) {
      g = g.map((x) => (x.m ? { ...x, a: true } : x))
      setH(g)
      setDurum('kayip')
      w.duyur('Mayına bastınız. Oyun bitti.')
      return
    }
    const yigin = [i]
    while (yigin.length) {
      const k = yigin.pop()!
      if (g[k].a || g[k].b) continue
      g[k].a = true
      if (g[k].n === 0) yigin.push(...komsu(k).filter((q) => !g[q].a && !g[q].m))
    }
    setH(g)
    if (g.every((x) => x.m || x.a)) {
      setH(g.map((x) => (x.m ? { ...x, b: true } : x)))
      setDurum('kazanc')
      w.duyur(`Kazandınız! Süre ${sure} saniye.`)
    }
  }
  const bayrak = (i: number) => {
    if (durum === 'kayip' || durum === 'kazanc' || h[i].a) return
    setH(h.map((x, k) => (k === i ? { ...x, b: !x.b } : x)))
  }
  const tus = (e: KeyboardEvent, i: number) => {
    const r = Math.floor(i / N)
    const c = i % N
    const git = (k: number) => {
      e.preventDefault()
      setOdak(k)
      refs.current[k]?.focus()
    }
    if (e.key === 'ArrowRight' && c < N - 1) git(i + 1)
    else if (e.key === 'ArrowLeft' && c > 0) git(i - 1)
    else if (e.key === 'ArrowDown' && r < N - 1) git(i + N)
    else if (e.key === 'ArrowUp' && r > 0) git(i - N)
    else if (e.key === 'f' || e.key === 'F') {
      e.preventDefault()
      bayrak(i)
    }
  }
  const yuz = durum === 'kayip' ? 'uzgun' : durum === 'kazanc' ? 'havali' : 'gulen'
  const lcd = (n: number) => String(Math.max(-99, n)).padStart(3, '0')
  const etiket = (x: Hucre, i: number) => {
    const yer = `${Math.floor(i / N) + 1}. satır, ${(i % N) + 1}. sütun`
    if (x.a && x.m) return `${yer}: mayın`
    if (x.a) return `${yer}: ${x.n ? `${x.n} komşu mayın` : 'boş'}`
    return `${yer}: ${x.b ? 'bayraklı' : 'kapalı'}`
  }
  return (
    <AppWindow pid="mayin" baslik="Mayın Tarlası" ikon="mayin" genislik="18rem" govde="p-1.5">
      <div className="outset p-1.5">
        <div className="inset mb-1.5 flex items-center justify-between p-1">
          <output className="bg-black px-1 font-mono text-[1.25rem] leading-none font-bold text-[#FF0000] tabular-nums" aria-label={`Kalan mayın: ${kalan}`} data-kalan={kalan}>
            {lcd(kalan)}
          </output>
          <button type="button" className="btn ikonlu min-h-0 p-0.5" onClick={yeni} aria-label="Yeni oyun" data-yuz={yuz}>
            <Pixel ad={yuz} boyut={1.5} />
          </button>
          <output className="bg-black px-1 font-mono text-[1.25rem] leading-none font-bold text-[#FF0000] tabular-nums" aria-label={`Süre: ${sure} saniye`}>
            {lcd(sure)}
          </output>
        </div>
        <div className="inset grid w-fit grid-cols-9" role="grid" aria-label="Mayın tarlası, 9 × 9, 10 mayın. Oklar gezer, Enter açar, F bayrak koyar." data-durum={durum}>
          {Array.from({ length: N }, (_, r) => (
            <div key={r} role="row" className="contents">
              {h.slice(r * N, r * N + N).map((x, c) => {
                const i = r * N + c
                return (
                  <span key={i} role="gridcell" className="contents">
                    <button
                      ref={(el) => {
                        refs.current[i] = el
                      }}
                      type="button"
                      tabIndex={i === odak ? 0 : -1}
                      aria-label={etiket(x, i)}
                      onFocus={() => setOdak(i)}
                      onClick={() => (bayrakKipi ? bayrak(i) : ac(i))}
                      onContextMenu={(e: MouseEvent) => {
                        e.preventDefault()
                        bayrak(i)
                      }}
                      onKeyDown={(e) => tus(e, i)}
                      className={cx('grid size-[1.5rem] place-items-center p-0 text-[0.875rem] leading-none font-bold', x.a ? 'border border-t-sh border-r-transparent border-b-transparent border-l-sh bg-face' : 'outset', x.a && x.m && 'bg-[#FF0000]')}
                      style={x.a && !x.m && x.n ? { color: RENK[x.n] } : undefined}
                      data-hucre={x.a ? (x.m ? 'mayin' : String(x.n)) : x.b ? 'bayrak' : 'kapali'}
                    >
                      {x.a ? x.m ? <Pixel ad="mayin" /> : x.n || '' : x.b ? <Pixel ad="bayrak" /> : ''}
                    </button>
                  </span>
                )
              })}
            </div>
          ))}
        </div>
        <p className="mt-1.5">
          <Check label="Bayrak kipi (dokunmatik için)" checked={bayrakKipi} onChange={setBayrakKipi} />
        </p>
      </div>
    </AppWindow>
  )
}

/* ───────────────────────── Not Defteri ───────────────────────── */
export function NotDefteri() {
  const w = useWin()
  const [metin, setMetin] = useState(() => {
    try {
      return localStorage.getItem('win-not') ?? 'Yapılacaklar:\r\n- Disket Avcısı 1.1 yamasını yükle\r\n- Kum Saati bölüm 12\r\n- Kampanya kuponlarını gönder'
    } catch {
      return ''
    }
  })
  const [kayitli, setKayitli] = useState(true)
  const [kaydir, setKaydir] = useState(true)
  const alan = useRef<HTMLTextAreaElement>(null)
  const kaydet = useCallback(async () => {
    await w.bekle(500)
    try {
      localStorage.setItem('win-not', metin)
    } catch {
      /* depolama kapalı */
    }
    setKayitli(true)
    w.duyur('Not kaydedildi')
  }, [metin, w])
  const satir = metin.split(/\r?\n/).length
  return (
    <AppWindow pid="not" baslik={`${kayitli ? '' : '*'}NOTLAR.TXT - Not Defteri`} ikon="not" genislik="30rem" govde="p-0.5" durum={[kayitli ? 'Kaydedildi' : 'Değişiklikler kaydedilmedi', `${satir} satır · ${metin.length} karakter`]}>
      <div className="mb-0.5 flex flex-wrap items-center gap-1 p-0.5">
        <Button className="min-w-0" onClick={() => void kaydet()} disabled={kayitli}>
          Kaydet
        </Button>
        <Button
          className="min-w-0"
          onClick={async () => {
            const c = await w.sor({ baslik: 'Not Defteri', ikon: 'uyari', mesaj: <p>Metin silinsin mi? Bu işlem geri alınamaz.</p>, butonlar: [{ ad: 'Evet', deger: 'evet' }, { ad: 'Hayır', deger: 'hayir', varsayilan: true }] })
            if (c === 'evet') {
              setMetin('')
              setKayitli(false)
              alan.current?.focus()
            }
          }}
        >
          Yeni
        </Button>
        <span className="ml-1">
          <Check label="Sözcük kaydır" checked={kaydir} onChange={setKaydir} />
        </span>
      </div>
      <label htmlFor="not-alani" className="sr-only">
        Not metni
      </label>
      <textarea
        id="not-alani"
        ref={alan}
        value={metin}
        onChange={(e) => {
          setMetin(e.target.value)
          setKayitli(false)
        }}
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
            e.preventDefault()
            void kaydet()
          }
        }}
        wrap={kaydir ? 'soft' : 'off'}
        spellCheck={false}
        className="field k95 block h-[14rem] w-full resize-none p-1 font-mono text-[0.875rem]"
      />
    </AppWindow>
  )
}

/* ───────────────────────── Geri Dönüşüm Kutusu ───────────────────────── */
export function GeriDonusum() {
  const w = useWin()
  const [liste, setListe] = useState(COP_BASLANGIC)
  const [secili, setSecili] = useState<string | null>(null)
  const sec = liste.find((x) => x.id === secili)
  return (
    <AppWindow pid="cop" baslik="Geri Dönüşüm Kutusu" ikon="cop" genislik="28rem" govde="p-1" durum={[`${liste.length} nesne`]}>
      <div className="mb-1 flex flex-wrap gap-1">
        <Button
          className="min-w-0"
          disabled={!sec}
          onClick={() => {
            if (!sec) return
            setListe((l) => l.filter((x) => x.id !== sec.id))
            setSecili(null)
            w.duyur(`${sec.ad} geri yüklendi: ${sec.yer}`)
          }}
        >
          Geri yükle
        </Button>
        <Button
          className="min-w-0"
          disabled={!liste.length}
          onClick={async () => {
            const c = await w.sor({ baslik: 'Dosya silmeyi onayla', ikon: 'uyari', mesaj: <p>{`Bu ${liste.length} öğeyi silmek istediğinizden emin misiniz?`}</p>, butonlar: [{ ad: 'Evet', deger: 'evet', varsayilan: true }, { ad: 'Hayır', deger: 'hayir' }] })
            if (c !== 'evet') return
            await w.bekle(700)
            setListe([])
            setSecili(null)
            w.duyur('Geri dönüşüm kutusu boşaltıldı')
          }}
        >
          Kutuyu boşalt
        </Button>
      </div>
      <div className="field k95 overflow-auto">
        {liste.length ? (
          <ul className="p-1" aria-label="Silinen öğeler">
            {liste.map((x) => (
              <li key={x.id}>
                <button type="button" aria-pressed={secili === x.id} className={cx('flex w-full items-center gap-2 px-1 py-0.5 text-left', secili === x.id && 'secili')} onClick={() => setSecili(x.id)} data-cop={x.ad}>
                  <Pixel ad="belge" />
                  <span className="min-w-0 flex-1 truncate">{x.ad}</span>
                  <span className="text-[0.75rem]">{x.yer}</span>
                  <span className="w-14 text-right text-[0.75rem] tabular-nums">{x.boyut}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-3">Geri dönüşüm kutusu boş.</p>
        )}
      </div>
    </AppWindow>
  )
}

/* ───────────────────────── Görüntü Özellikleri ───────────────────────── */
export const DUVARLAR: { id: Duvar; ad: string }[] = [
  { id: 'turkuaz', ad: '(Yok) · düz turkuaz' },
  { id: 'dama', ad: 'Dither: turkuaz + lacivert' },
  { id: 'tugla', ad: 'Desen: tuğla (1 bit)' },
  { id: 'bulut', ad: 'Bulutlar (16 renk)' },
]

/** Masaüstü önizlemesi: piksel monitör çerçevesi içinde seçilen duvar kağıdı */
export function Monitor({ duvar }: { duvar: Duvar }) {
  return (
    <div className="mx-auto w-[11rem]" aria-hidden="true">
      <div className="outset p-2">
        <div className="inset aspect-[4/3] w-full" data-duvar-ornek={duvar} />
      </div>
      <div className="mx-auto h-2 w-10 bg-sh" />
      <div className="outset mx-auto h-2 w-20" />
    </div>
  )
}

export function GoruntuOzellikleri() {
  const w = useWin()
  const [taslak, setTaslak] = useState<{ duvar: Duvar; mode: Theme | 'system'; olcek: Olcek; yazi: Yazi }>({ duvar: w.duvar, mode: w.mode, olcek: w.olcek, yazi: w.yazi })
  const [sekme, setSekme] = useState('arka')
  const acik = w.pencereler.goruntu.acik
  useEffect(() => {
    if (acik) setTaslak({ duvar: w.duvar, mode: w.mode, olcek: w.olcek, yazi: w.yazi })
    // Yalnız açılışta mevcut ayarları taslağa al
  }, [acik])
  const degisti = taslak.duvar !== w.duvar || taslak.mode !== w.mode || taslak.olcek !== w.olcek || taslak.yazi !== w.yazi
  const uygula = async () => {
    await w.bekle(400)
    w.setDuvar(taslak.duvar)
    w.setMode(taslak.mode)
    w.setOlcek(taslak.olcek)
    w.setYazi(taslak.yazi)
    w.duyur('Görüntü ayarları uygulandı')
  }
  return (
    <AppWindow pid="goruntu" baslik="Görüntü Özellikleri" ikon="goruntu" genislik="27rem">
      <Tabs
        etiket="Görüntü Özellikleri"
        secili={sekme}
        onSec={setSekme}
        sekmeler={[
          {
            id: 'arka',
            ad: 'Arka plan',
            icerik: (
              <div className="grid gap-3">
                <Monitor duvar={taslak.duvar} />
                <fieldset className="groove m-0 px-2 pb-2">
                  <legend className="px-1">Duvar kağıdı</legend>
                  <div className="field k95 max-h-[7rem] overflow-auto">
                    {DUVARLAR.map((d) => (
                      <label key={d.id} className={cx('flex items-center gap-1.5 px-1 py-0.5', taslak.duvar === d.id && 'secili')}>
                        <input type="radio" className="r95" name="duvar-taslak" checked={taslak.duvar === d.id} onChange={() => setTaslak((t) => ({ ...t, duvar: d.id }))} />
                        {d.ad}
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>
            ),
          },
          {
            id: 'gorunum',
            ad: 'Görünüm',
            icerik: (
              <div className="grid gap-3">
                <Select
                  label="Renk düzeni:"
                  value={taslak.mode}
                  onChange={(v) => setTaslak((t) => ({ ...t, mode: v }))}
                  options={[
                    { id: 'light', ad: 'Windows Standart' },
                    { id: 'dark', ad: 'Yüksek Kontrast Siyah' },
                    { id: 'system', ad: 'Sisteme göre' },
                  ]}
                />
                <Select label="Yazı boyutu:" value={taslak.olcek} onChange={(v) => setTaslak((t) => ({ ...t, olcek: v }))} options={(Object.keys(OLCEK) as Olcek[]).map((k) => ({ id: k, ad: `${OLCEK[k].ad} (%${OLCEK[k].yuzde})` }))} />
                <Select
                  label="Arayüz yazı tipi:"
                  value={taslak.yazi}
                  onChange={(v) => setTaslak((t) => ({ ...t, yazi: v }))}
                  options={[
                    { id: 'sistem', ad: 'Sistem (Tahoma / MS Sans Serif)' },
                    { id: 'piksel', ad: 'Piksel (kenar yumuşatmasız)' },
                  ]}
                />
              </div>
            ),
          },
          {
            id: 'ayar',
            ad: 'Ayarlar',
            icerik: (
              <ul className="list-disc space-y-1 pl-5">
                <li>Renk paleti: 16 renk (4 bit) duvar kağıtları ve ikonlar.</li>
                <li>Ölçek: bütün ölçüler rem; %{OLCEK[taslak.olcek].yuzde} seçili.</li>
                <li>Hareket: yok. Pencereler ve menüler anında açılır.</li>
              </ul>
            ),
          },
        ]}
      />
      <div className="mt-3 flex flex-wrap justify-end gap-1.5">
        <Button
          varsayilan
          onClick={async () => {
            await uygula()
            w.kapat('goruntu')
          }}
        >
          Tamam
        </Button>
        <Button onClick={() => w.kapat('goruntu')}>İptal</Button>
        <Button disabled={!degisti} onClick={() => void uygula()}>
          Uygula
        </Button>
      </div>
    </AppWindow>
  )
}
