import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { Btn, Check, Kbd, Pane, Progress, Radios } from '../components/ui'
import { AsciiTable } from '../components/AsciiTable'
import { DISKLER, RAID, kapasite, type Raid } from '../lib/data'
import { hareketKapali, useTerm } from '../lib/store'
import { cx } from '../../shared/cx'

type Sekme = 'ana' | 'depolama' | 'onyukleme' | 'cikis'
const SEKMELER: ReadonlyArray<{ id: Sekme; ad: string }> = [
  { id: 'ana', ad: 'Ana' },
  { id: 'depolama', ad: 'Depolama' },
  { id: 'onyukleme', ad: 'Önyükleme' },
  { id: 'cikis', ad: 'Kaydet ve çık' },
]
type Birim = { ad: string; seviye: Raid; diskler: string[]; tb: number }

const YARDIM: Record<string, string> = {
  vmd: 'Intel VMD, NVMe diskleri işlemcinin kök portlarında toplar ve RAID birimi kurmayı sağlar. Kapatılırsa diskler tek tek görünür.',
  disk: 'Birime katılacak diskleri seçin. Boyutu farklı diskler en küçüğüne göre kullanılır.',
  raid: 'RAID seviyesi kapasiteyi ve kaç disk kaybının tolere edileceğini belirler.',
  ad: 'Birim adı en fazla 16 karakter: küçük harf, rakam ve tire.',
  olustur: 'Seçili disklerle yeni RAID birimi oluşturur. Disklerdeki veriler silinir.',
  sirala: 'Önyükleme sırasını + ve - ile değiştirin. İlk sıradaki aygıttan açılır.',
  kaydet: 'Değişiklikleri NVRAM\'e yazar ve sistemi yeniden başlatır (F10).',
  varsayilan: 'Seçilmemiş öğe. Bir ayara gelince açıklaması burada görünür.',
}

/**
 * BIOS / VMD depolama yapılandırma paneli (Madde 10): sekmeler ok tuşlarıyla, F10 kaydeder.
 * Sağdaki "öğe yardımı" odaklanan ayarı açıklar.
 */
export function Bios() {
  const s = useTerm()
  const [sekme, setSekme] = useState<Sekme>('depolama')
  const [vmd, setVmd] = useState(true)
  const [secili, setSecili] = useState<string[]>(['nvme0', 'nvme1'])
  const [raid, setRaid] = useState<Raid>('RAID-1')
  const [ad, setAd] = useState('sistem')
  const [birimler, setBirimler] = useState<Birim[]>([])
  const [hata, setHata] = useState<string | null>(null)
  const [yardim, setYardim] = useState('varsayilan')
  const [sira, setSira] = useState(['RAID birimi', 'ağ (PXE, 10GbE)', 'USB bellek', 'UEFI kabuğu'])
  const [kirli, setKirli] = useState(false)
  const [kayit, setKayit] = useState<number | null>(null)
  const [secBirim, setSecBirim] = useState<string | undefined>()
  const tabsRef = useRef<HTMLDivElement>(null)
  const idp = useId()

  const kullanilan = birimler.flatMap((b) => b.diskler)
  const bos = DISKLER.filter((d) => !kullanilan.includes(d.id))
  const tbs = DISKLER.filter((d) => secili.includes(d.id)).map((d) => d.tb)
  const kap = kapasite(raid, tbs)
  const r = RAID.find((x) => x.id === raid)!
  const degis = <T,>(fn: (v: T) => void) => (v: T) => {
    fn(v)
    setKirli(true)
  }

  const olustur = () => {
    if (!vmd) return setHata('[!] VMD kapalıyken RAID birimi kurulamaz.')
    if (secili.length < r.min) return setHata(`[!] ${raid} en az ${r.min} disk ister (seçili: ${secili.length}).`)
    if (r.cift && secili.length % 2) return setHata(`[!] ${raid} çift sayıda disk ister.`)
    if (!/^[a-z0-9-]{1,16}$/.test(ad)) return setHata('[!] Birim adı: 1–16 karakter, küçük harf, rakam, tire.')
    if (birimler.some((b) => b.ad === ad)) return setHata(`[!] "${ad}" adında bir birim zaten var.`)
    setHata(null)
    setBirimler((b) => [...b, { ad, seviye: raid, diskler: secili, tb: kap }])
    setSecili([])
    setKirli(true)
    s.soyle(`${ad} birimi oluşturuldu: ${raid}, ${kap} TB`)
  }

  const kaydet = () => {
    if (kayit !== null) return
    setSekme('cikis')
    setKayit(0)
    const adim = hareketKapali() ? 30 : 90
    for (let k = 1; k <= 20; k++) window.setTimeout(() => setKayit(k * 5), k * adim)
    window.setTimeout(() => {
      setKirli(false)
      s.log('bilgi', 'bios', `VMD ${vmd ? 'etkin' : 'kapalı'} · ${birimler.length} RAID birimi · önyükleme: ${sira[0]}`)
      s.soyle('Ayarlar kaydedildi, sistem yeniden başlatıldı')
    }, 21 * adim)
    window.setTimeout(() => setKayit(null), 21 * adim + 2400)
  }

  // F10: panel içindeyken kaydet
  const onPanelKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'F10') {
      e.preventDefault()
      kaydet()
    }
  }
  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const i = SEKMELER.findIndex((t) => t.id === sekme)
    let n = -1
    if (e.key === 'ArrowRight') n = (i + 1) % SEKMELER.length
    else if (e.key === 'ArrowLeft') n = (i - 1 + SEKMELER.length) % SEKMELER.length
    else if (e.key === 'Home') n = 0
    else if (e.key === 'End') n = SEKMELER.length - 1
    if (n < 0) return
    e.preventDefault()
    setSekme(SEKMELER[n].id)
    tabsRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[n]?.focus()
  }
  useEffect(() => {
    if (!vmd) setSecili([])
  }, [vmd])

  const f = (k: string) => ({ onFocus: () => setYardim(k), onMouseEnter: () => setYardim(k) })

  return (
    <Pane id="bios" no="06" title="bios / vmd" lede="Depolama yapılandırma paneli: VMD denetleyicisi, NVMe diskler ve RAID birimleri. Sekmeler ok tuşlarıyla değişir, panelin içindeyken F10 kaydeder. Diskler kurgusaldır.">
      <div onKeyDown={onPanelKey} className="border border-fg">
        <div className="inv flex flex-wrap justify-between gap-x-2 px-1">
          <span className="font-bold">WEBDETEST SETUP UTILITY v0.12</span>
          <span>{kirli ? '[*] kaydedilmemiş değişiklik' : 'kayıtlı'}</span>
        </div>
        <div ref={tabsRef} role="tablist" aria-label="BIOS sekmeleri" className="flex flex-wrap gap-x-1 border-b border-line px-1">
          {SEKMELER.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`${idp}-t-${t.id}`}
              aria-selected={sekme === t.id}
              aria-controls={`${idp}-p`}
              tabIndex={sekme === t.id ? 0 : -1}
              onClick={() => setSekme(t.id)}
              onKeyDown={onTabKey}
              className={cx('cursor-pointer px-1 whitespace-pre', sekme === t.id ? 'inv font-bold' : 'hover:underline')}
            >
              {t.ad}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_32ch]">
          <div id={`${idp}-p`} role="tabpanel" aria-labelledby={`${idp}-t-${sekme}`} className="min-w-0 px-2 py-[1lh]">
            {sekme === 'ana' ? (
              <dl className="ascii scroll-x" tabIndex={0}>
                {[
                  ['BIOS sürümü', 'v0.12 (2026-09-01)'],
                  ['İşlemci', '16 çekirdek @ 5,4 GHz'],
                  ['Bellek', '64 GB DDR5-6000 (2 kanal)'],
                  ['VMD', vmd ? 'Etkin' : 'Devre dışı'],
                  ['RAID birimleri', String(birimler.length)],
                  ['Sistem saati', new Date().toLocaleString('tr-TR')],
                ].map(([k, v]) => (
                  <div key={k} className="flex">
                    <dt className="w-18 shrink-0 text-dim">{k}</dt>
                    <dd className="text-hi">{v}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {sekme === 'depolama' ? (
              <div className="flex flex-col gap-y-[1lh]">
                <div className="flex flex-wrap items-center gap-x-2" {...f('vmd')}>
                  <span id={`${idp}-vmd`} className="w-18 shrink-0 text-dim">
                    VMD denetleyicisi
                  </span>
                  <Btn aria-labelledby={`${idp}-vmd ${idp}-vmdv`} aria-pressed={vmd} onClick={() => degis(setVmd)(!vmd)}>
                    <span id={`${idp}-vmdv`}>{vmd ? 'Etkin' : 'Devre dışı'}</span>
                  </Btn>
                </div>
                <fieldset {...f('disk')} disabled={!vmd}>
                  <legend className="text-dim">Kök portlarındaki NVMe diskler</legend>
                  <ul>
                    {DISKLER.map((d) => {
                      const dolu = kullanilan.includes(d.id)
                      return (
                        <li key={d.id} className="ascii scroll-x">
                          <Check
                            checked={secili.includes(d.id)}
                            disabled={!vmd || dolu}
                            onChange={(v) => setSecili((x) => (v ? [...x, d.id] : x.filter((y) => y !== d.id)))}
                          >
                            {`${d.id}  ${d.model}  ${d.tb} TB  ${d.port}${dolu ? '  (birimde)' : ''}`}
                          </Check>
                        </li>
                      )
                    })}
                  </ul>
                </fieldset>
                <div {...f('raid')}>
                  <Radios legend="RAID seviyesi" name={`${idp}-raid`} row value={raid} options={RAID.map((x) => ({ id: x.id, ad: x.id }))} onChange={setRaid} />
                  <p className="pl-4 text-dim">{r.aciklama}</p>
                </div>
                <label className="flex flex-wrap items-center gap-x-2" {...f('ad')}>
                  <span className="w-18 shrink-0 text-dim">Birim adı</span>
                  <span className="flex border border-line px-1 focus-within:border-fg">
                    <span aria-hidden="true">[</span>
                    <input value={ad} onChange={(e) => setAd(e.target.value)} maxLength={16} className="w-16 bg-transparent text-hi caret-[var(--fg)] outline-none" aria-describedby={`${idp}-hata`} aria-invalid={!!hata} />
                    <span aria-hidden="true">]</span>
                  </span>
                </label>
                <p className="ascii scroll-x" tabIndex={0}>
                  <span className="text-dim">Kapasite: </span>
                  <span className="text-hi">{kap} TB</span>
                  <span className="text-dim"> · diskler: </span>
                  {secili.length ? secili.join(', ') : '-'}
                  <span className="text-dim"> · boş disk: </span>
                  {bos.length}
                </p>
                <div className="flex flex-wrap items-center gap-x-2" {...f('olustur')}>
                  <Btn inv prefix="+" onClick={olustur}>
                    RAID birimi oluştur
                  </Btn>
                  <p id={`${idp}-hata`} role="alert" className="text-em">
                    {hata}
                  </p>
                </div>
                <div>
                  <p className="text-dim"># RAID birimleri</p>
                  <AsciiTable
                    caption="RAID birimleri"
                    rows={birimler}
                    getId={(b) => b.ad}
                    selectedId={secBirim}
                    onSelect={(id) => setSecBirim(id === secBirim ? undefined : id)}
                    empty="birim yok"
                    columns={[
                      { key: 'ad', label: 'ad', get: (b) => b.ad },
                      { key: 'seviye', label: 'seviye', get: (b) => b.seviye },
                      { key: 'diskler', label: 'diskler', get: (b) => b.diskler.join(',') },
                      { key: 'tb', label: 'kapasite', get: (b) => `${b.tb} TB`, align: 'right' },
                      { key: 'd', label: 'durum', get: () => 'normal' },
                    ]}
                  />
                  {secBirim ? (
                    <Btn
                      prefix="-"
                      className="mt-[0.5lh]"
                      onClick={() => {
                        setBirimler((b) => b.filter((x) => x.ad !== secBirim))
                        s.soyle(`${secBirim} birimi silindi`)
                        setSecBirim(undefined)
                        setKirli(true)
                      }}
                    >
                      seçili birimi sil: {secBirim}
                    </Btn>
                  ) : null}
                </div>
              </div>
            ) : null}

            {sekme === 'onyukleme' ? (
              <ol {...f('sirala')} className="flex flex-col">
                {sira.map((x, i) => (
                  <li key={x} className="flex flex-wrap items-center gap-x-2">
                    <span className={cx('w-24 whitespace-pre', i === 0 && 'text-hi')}>{`${i + 1}. ${i === 0 ? '[>] ' : '    '}${x}`}</span>
                    <Btn disabled={i === 0} aria-label={`${x} yukarı`} onClick={() => degis(setSira)(sira.map((y, k) => (k === i - 1 ? x : k === i ? sira[i - 1] : y)))}>
                      +
                    </Btn>
                    <Btn disabled={i === sira.length - 1} aria-label={`${x} aşağı`} onClick={() => degis(setSira)(sira.map((y, k) => (k === i + 1 ? x : k === i ? sira[i + 1] : y)))}>
                      -
                    </Btn>
                  </li>
                ))}
              </ol>
            ) : null}

            {sekme === 'cikis' ? (
              <div className="flex flex-col items-start gap-y-[0.5lh]" {...f('kaydet')}>
                <Btn inv prefix=">" onClick={kaydet} disabled={kayit !== null}>
                  değişiklikleri kaydet ve yeniden başlat (F10)
                </Btn>
                <Btn
                  prefix="x"
                  disabled={kayit !== null}
                  onClick={() => {
                    setVmd(true)
                    setBirimler([])
                    setSecili(['nvme0', 'nvme1'])
                    setKirli(false)
                    s.soyle('Varsayılanlar yüklendi')
                  }}
                >
                  varsayılanları yükle
                </Btn>
                {kayit !== null ? (
                  <div className="mt-[0.5lh]" role="status">
                    <Progress value={kayit} label="NVRAM'e yazılıyor" width={24} />
                    <p className="ascii">{kayit < 100 ? "[>] NVRAM'e yazılıyor..." : '[ OK ] kaydedildi · yeniden başlatılıyor'}</p>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          <aside className="border-t border-line px-2 py-[1lh] lg:border-t-0 lg:border-l" aria-label="Öğe yardımı">
            <p className="font-bold text-hi">Öğe yardımı</p>
            <p className="mt-[0.5lh] text-dim">
              {YARDIM[yardim]}
            </p>
          </aside>
        </div>
        <p className="ascii scroll-x border-t border-line px-1 text-dim" tabIndex={0} aria-label="Tuşlar">
          <Kbd keys={['Sol']} />/<Kbd keys={['Sağ']} /> sekme · <Kbd keys={['Tab']} /> öğe · <Kbd keys={['Boşluk']} /> değiştir · <Kbd keys={['F10']} /> kaydet
        </p>
      </div>
    </Pane>
  )
}
