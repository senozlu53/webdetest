import { useState, type FormEvent } from 'react'
import { useAyar } from '../lib/ayar'
import { okuJSON, yaz } from '../lib/depo'
import { ORNEK_KAYITLAR, SEHIRLER, type Kayit } from '../lib/veri'

const bugun = () => new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })

/** Doksanların ziyaretçi defteri. Kayıtlar yalnız bu tarayıcıda saklanır */
export function Defter() {
  const { duyur } = useAyar()
  const [kayitlar, setKayitlar] = useState<Kayit[]>(() => okuJSON<Kayit[]>('anti-defter', []))
  const kaydet = (k: Kayit[]) => {
    setKayitlar(k)
    yaz('anti-defter', JSON.stringify(k))
  }
  const ekle = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const k: Kayit = { id: `k${Date.now()}`, ad: String(f.get('ad')).trim(), sehir: String(f.get('sehir')), mesaj: String(f.get('mesaj')).trim(), tarih: bugun() }
    kaydet([k, ...kayitlar])
    e.currentTarget.reset()
    duyur(`Deftere yazıldı: ${k.ad}`)
  }
  const hepsi = [...kayitlar, ...ORNEK_KAYITLAR]
  return (
    <section id="defter" aria-labelledby="defter-b">
      <h2 id="defter-b">
        Ziyaretçi defteri <strong>YENİ!</strong>
      </h2>
      <p>Buraya kadar geldiyseniz bir şey yazın. Kayıtlar yalnız bu tarayıcıda saklanır; kimseye gitmez.</p>
      <form aria-labelledby="defter-form-b" onSubmit={ekle}>
        <h3 id="defter-form-b">Deftere yaz</h3>
        <p>
          <label>
            Ad ya da takma ad: <input type="text" name="ad" required maxLength={32} autoComplete="nickname" />
          </label>
        </p>
        <p>
          <label>
            Nereden:{' '}
            <select name="sehir" defaultValue="İstanbul">
              {SEHIRLER.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
        </p>
        <p>
          <label>
            Mesaj:
            <br />
            <textarea name="mesaj" required maxLength={280} rows={4} cols={40} />
          </label>
        </p>
        <p>
          <input type="submit" value="Deftere yaz" /> <input type="reset" value="Temizle" />
        </p>
      </form>
      <table border={1} cellPadding={5}>
        <caption>
          {hepsi.length} kayıt, yeniden eskiye. Son üçü örnek kayıttır.
        </caption>
        <thead>
          <tr>
            <th scope="col">Tarih</th>
            <th scope="col">Kim</th>
            <th scope="col">Nereden</th>
            <th scope="col">Mesaj</th>
            <th scope="col">
              <abbr title="İşlem">İşl.</abbr>
            </th>
          </tr>
        </thead>
        <tbody>
          {hepsi.map((k) => (
            <tr key={k.id}>
              <td>{k.tarih}</td>
              <th scope="row">{k.ad}</th>
              <td>{k.sehir}</td>
              <td>{k.mesaj}</td>
              <td>
                {k.ornek ? (
                  <small>örnek</small>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      kaydet(kayitlar.filter((x) => x.id !== k.id))
                      duyur(`Kayıt silindi: ${k.ad}`)
                    }}
                    aria-label={`sil: ${k.ad}, ${k.tarih}`}
                  >
                    sil
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
