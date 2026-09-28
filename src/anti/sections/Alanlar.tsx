import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Bolum } from '../components/Bolum'
import { Kayan } from '../components/Kayan'
import { useAyar } from '../lib/ayar'
import { BEDENLER, DIZELER, ETKINLIKLER, FIILLER, KUMAS_RENKLERI, URUNLER, YAYINLAR, tl } from '../lib/veri'

/** Madde 10 · 11: yeraltı müzik sahnesi. Ekrandan taşan, hizasız ama yapısı sağlam tablo */
export function Sahne() {
  const { duyur } = useAyar()
  const [liste, setListe] = useState<string[]>([])
  const hizala: ('left' | 'center' | 'right')[] = ['right', 'left', 'center', 'left', 'center', 'right', 'left']
  return (
    <Bolum
      id="sahne"
      baslik={
        <>
          Madde 10: Yeraltı müzik sahnesi <strong>YENİ!</strong>
        </>
      }
    >
      <p>SİNYAL KAYBI 1997'den beri bodrumlarda gürültü çalar, kaset basar ve bu sayfayı hiç düzeltmez.</p>
      <h3>Güz 2026 programı</h3>
      <table id="etkinlikler" border={1} cellPadding={6} width="140%">
        <caption>Tablo ekranın sağından taşar ve her üçüncü satır kayar; bilerek. Yapısı sağlam: açıklaması ve başlık hücreleri var.</caption>
        <thead>
          <tr>
            <th scope="col">Tarih</th>
            <th scope="col">Gün</th>
            <th scope="col">Mekân</th>
            <th scope="col">Sahne</th>
            <th scope="col">Kapı</th>
            <th scope="col">Giriş</th>
            <th scope="col">Not</th>
            <th scope="col">Liste</th>
          </tr>
        </thead>
        <tbody>
          {ETKINLIKLER.map((e, i) => (
            <tr key={e.id}>
              <th scope="row" align={hizala[i % 7]}>
                {e.tarih}
              </th>
              <td align={hizala[(i + 1) % 7]}>{e.gun}</td>
              <td align={hizala[(i + 2) % 7]}>{e.mekan}</td>
              <td>{e.sahne}</td>
              <td align="center" valign="bottom">
                {e.kapi}
              </td>
              <td align="right">{e.giris}</td>
              <td align={hizala[(i + 4) % 7]}>{e.not}</td>
              <td>
                <label>
                  <input
                    type="checkbox"
                    checked={liste.includes(e.id)}
                    onChange={(ev) => {
                      const next = ev.target.checked ? [...liste, e.id] : liste.filter((x) => x !== e.id)
                      setListe(next)
                      duyur(ev.target.checked ? `${e.tarih} listeye yazıldı` : `${e.tarih} listeden çıktı`)
                    }}
                    aria-label={`listeye yaz: ${e.tarih}, ${e.sahne}`}
                  />{' '}
                  listeye yaz
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        Listede: <output>{liste.length} gece</output>
      </p>
      <h3>Yayınlar</h3>
      <ul>
        {YAYINLAR.map((y) => (
          <li key={y.kod}>
            <details>
              <summary>
                <code>{y.kod}</code> · {y.sanatci}: <cite>{y.ad}</cite> ({y.bicim}, {y.yil})
              </summary>
              <ol>
                {y.parcalar.map(([ad, sure]) => (
                  <li key={ad}>
                    {ad} <small>({sure})</small>
                  </li>
                ))}
              </ol>
            </details>
          </li>
        ))}
      </ul>
      <h3>Şimdi çalıyor</h3>
      <Kayan behavior="alternate" scrollamount={4}>
        ~*~ Boş Sinyal: Meşgul Tonu (3:48) ~*~
      </Kayan>
    </Bolum>
  )
}

const SATIR = 32
const kutu = (s: string) => `| ${s.padEnd(SATIR - 4)} |`
const cizgi = `+${'-'.repeat(SATIR - 2)}+`
const iki = (a: string, b: string) => kutu(a + b.padStart(SATIR - 4 - a.length))

/** Madde 10: bağımsız moda markası. Sipariş formu tarayıcının kendi elemanları */
export function Sokuk() {
  const { duyur } = useAyar()
  const [urun, setUrun] = useState(URUNLER[0].id)
  const [adet, setAdet] = useState(1)
  const [hediye, setHediye] = useState(false)
  const [fis, setFis] = useState('')
  const u = URUNLER.find((x) => x.id === urun)!
  const toplam = u.fiyat * adet + (hediye ? 50 : 0)
  const gonder = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const renk = KUMAS_RENKLERI.find(([id]) => id === f.get('renk'))?.[1].split(' ')[0] ?? ''
    const satirlar = [cizgi, kutu('SÖKÜK · SİPARİŞ FİŞİ'), cizgi, kutu(u.ad), kutu(`Beden: ${f.get('beden')} · Renk: ${renk}`), iki(`Adet: ${adet}`, tl(u.fiyat * adet))]
    if (hediye) satirlar.push(iki('Hediye paketi', '50 TL'))
    satirlar.push(cizgi, iki('TOPLAM', tl(toplam)), cizgi, 'tanıtım: sipariş gönderilmedi')
    setFis(satirlar.join('\n'))
    duyur(`Sipariş fişi hazır: ${u.ad}, toplam ${tl(toplam)}. Tanıtım, gönderilmedi.`)
  }
  return (
    <Bolum id="sokuk" baslik="Madde 10: Bağımsız moda markası SÖKÜK">
      <p>SÖKÜK dikişi dışarıda, etiketi ters diker. Web sitesi de öyle: sipariş formu tarayıcının kendi elemanlarından, fiş düz metin.</p>
      <pre role="img" aria-label="ASCII çizim: dikişleri dışarıda bir tişört">{`    _.-~~~~~~-._
   / |x x x x x| \\
  /__|         |__\\
     |  SÖKÜK  |
     |  00     |
     |x_x_x_x_x|`}</pre>
      <form
        aria-labelledby="siparis-b"
        onSubmit={gonder}
        onReset={() => {
          setUrun(URUNLER[0].id)
          setAdet(1)
          setHediye(false)
          setFis('')
        }}
      >
        <h3 id="siparis-b">Koleksiyon 00 siparişi</h3>
        <p>
          <label>
            Ürün:{' '}
            <select name="urun" value={urun} onChange={(e) => setUrun(e.target.value)}>
              {URUNLER.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.ad} · {tl(x.fiyat)}
                </option>
              ))}
            </select>
          </label>
        </p>
        <fieldset>
          <legend>Beden</legend>
          {BEDENLER.map((b, i) => (
            <label key={b}>
              <input type="radio" name="beden" value={b} required={i === 0} /> {b}{' '}
            </label>
          ))}
        </fieldset>
        <p>
          <label>
            Renk:{' '}
            <select name="renk" defaultValue="siyah">
              {KUMAS_RENKLERI.map(([id, ad]) => (
                <option key={id} value={id}>
                  {ad}
                </option>
              ))}
            </select>
          </label>
        </p>
        <p>
          <label>
            Adet: <input type="number" name="adet" min={1} max={5} required value={adet} onChange={(e) => setAdet(Math.max(1, Math.min(5, Number(e.target.value) || 1)))} />
          </label>
        </p>
        <p>
          <label>
            <input type="checkbox" name="hediye" checked={hediye} onChange={(e) => setHediye(e.target.checked)} /> Hediye paketi (+50 TL, gazete kâğıdına sarılır)
          </label>
        </p>
        <p>
          <label>
            E-posta: <input type="email" name="eposta" required autoComplete="email" />
          </label>
        </p>
        <p>
          <label>
            Not (en çok 140 harf):
            <br />
            <textarea name="not" maxLength={140} rows={3} cols={40} />
          </label>
        </p>
        <p>
          Toplam: <output>{tl(toplam)}</output>
        </p>
        <p>
          <input type="submit" value="Sipariş ver" /> <input type="reset" value="Temizle" />
        </p>
      </form>
      {fis ? (
        <pre>
          <samp>{fis}</samp>
        </pre>
      ) : null}
    </Bolum>
  )
}

/** Tohumlu karıştırma: aynı düzey her seferinde aynı gürültüyü üretir */
function parazit(n: number, tohum: number) {
  const k = '#%&*|~/\\=+'
  let s = ''
  for (let i = 0; i < n; i++) s += k[(tohum * 31 + i * 17 + ((i * i) % 7)) % k.length]
  return s
}

/** Madde 10: konsept web sanatı. Form elemanlarıyla yazılan şiir, bitmeyen yükleme, basılmaması gereken düğme */
export function Sanat() {
  const { hareket } = useAyar()
  const [secili, setSecili] = useState<string[]>(DIZELER.slice(0, 3))
  const [fiil, setFiil] = useState(FIILLER[0])
  const [gurultu, setGurultu] = useState(3)
  const [yuk, setYuk] = useState(0)
  const [basma, setBasma] = useState(0)
  const dizeler = useMemo(() => DIZELER.filter((d) => secili.includes(d)), [secili])
  useEffect(() => {
    if (!hareket) return
    const t = window.setInterval(() => setYuk((v) => (v >= 99 ? 99 : v + 1)), 90)
    return () => window.clearInterval(t)
  }, [hareket])
  const deger = hareket ? yuk : 99
  return (
    <Bolum id="sanat" baslik="Madde 10: Konsept web sanatı">
      <h3>form.şiir</h3>
      <form aria-labelledby="siir-b" onSubmit={(e) => e.preventDefault()}>
        <fieldset>
          <legend id="siir-b">Dizeler</legend>
          {DIZELER.map((d) => (
            <p key={d}>
              <label>
                <input type="checkbox" checked={secili.includes(d)} onChange={(e) => setSecili(e.target.checked ? [...secili, d] : secili.filter((x) => x !== d))} /> {d}
              </label>
            </p>
          ))}
        </fieldset>
        <p>
          <label>
            Son dize:{' '}
            <select value={fiil} onChange={(e) => setFiil(e.target.value)}>
              {FIILLER.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </label>{' '}
          <label>
            Parazit: <input type="range" min={0} max={10} value={gurultu} onChange={(e) => setGurultu(+e.target.value)} />
          </label>
        </p>
      </form>
      <pre>
        <samp>
          {dizeler.map((d, i) => (
            <span key={d}>
              {d}
              {'\n'}
              {gurultu ? <span aria-hidden="true">{parazit(gurultu * 3, i + gurultu)}</span> : null}
              {gurultu ? '\n' : null}
            </span>
          ))}
          {`ve ekran ${fiil}.`}
        </samp>
      </pre>
      <h3>yükleniyor.html</h3>
      <p>
        <label>
          Yükleniyor:{' '}
          <progress max={100} value={deger}>
            %{deger}
          </progress>
        </label>{' '}
        <output>%{deger}</output>{' '}
        <button type="button" onClick={() => setYuk(0)}>
          Baştan yükle
        </button>
      </p>
      <p>Yüzde 99'da durur ve hep orada kalır.</p>
      <h3>basma.html</h3>
      <p>
        <button type="button" onClick={() => setBasma((n) => n + 1)}>
          Bu düğmeye basma
        </button>{' '}
        <output>{basma ? `Bastın (${basma}). Hiçbir şey olmadı.` : ''}</output>
      </p>
    </Bolum>
  )
}
