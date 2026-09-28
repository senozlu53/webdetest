import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Bolum } from '../components/Bolum'
import { useAyar } from '../lib/ayar'
import { say } from '../lib/erisim'
import { IKONLAR, SEHIRLER } from '../lib/veri'

/** Formu, sunucusu olsaydı alacağı biçimde yazar */
function urlKodla(form: HTMLFormElement) {
  const s = new URLSearchParams()
  for (const [k, v] of new FormData(form)) s.append(k, typeof v === 'string' ? v : v.name)
  return s.toString()
}

/** Madde 6 · 11: tarayıcının kendi form elemanları, hiçbirine dokunulmadan */
export function Form() {
  const { duyur } = useAyar()
  const [cikti, setCikti] = useState('')
  const pencere = useRef<HTMLDialogElement>(null)
  const gonder = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setCikti(urlKodla(e.currentTarget))
    duyur('Form gönderildi; sunucunun alacağı satır formun altında')
  }
  return (
    <Bolum id="form" baslik="Madde 6 · 11: Yalnız native form elemanları">
      <p>Şekil dili tarayıcının çizdiği kutulardır. Köşeyi, kenarı ve rengi işletim sistemi belirler; aynı form Windows'ta, macOS'ta ve telefonda başka görünür.</p>
      <form aria-labelledby="katalog-b" onSubmit={gonder} onReset={() => setCikti('')}>
        <h3 id="katalog-b">Bütün elemanlar</h3>
        <fieldset>
          <legend>Metin</legend>
          <p>
            <label>
              Takma ad: <input type="text" name="ad" defaultValue="Parazit" />
            </label>
          </p>
          <p>
            <label>
              E-posta: <input type="email" name="eposta" placeholder="ad@ornek.example" autoComplete="email" />
            </label>
          </p>
          <p>
            <label>
              Arama: <input type="search" name="ara" />
            </label>
          </p>
          <p>
            <label>
              Kaç kaset: <input type="number" name="sayi" defaultValue={3} min={0} max={9} />
            </label>
          </p>
          <p>
            <label>
              Tarih: <input type="date" name="tarih" defaultValue="2026-10-03" />
            </label>{' '}
            <label>
              Saat: <input type="time" name="saat" defaultValue="23:00" />
            </label>
          </p>
          <p>
            <label>
              Renk: <input type="color" name="renk" defaultValue="#0000ff" />
            </label>{' '}
            <label>
              Ses (0–11): <input type="range" name="ses" min={0} max={11} defaultValue={11} />
            </label>
          </p>
          <p>
            <label>
              Dosya: <input type="file" name="dosya" />
            </label>
          </p>
          <p>
            <label>
              Mesaj:
              <br />
              <textarea name="mesaj" rows={3} cols={40} defaultValue="merhaba dünya" />
            </label>
          </p>
        </fieldset>
        <fieldset>
          <legend>Seçim: stilsiz radyo, varsayılan select</legend>
          <fieldset>
            <legend>Biçim</legend>
            <label>
              <input type="radio" name="bicim" value="kaset" defaultChecked /> kaset
            </label>{' '}
            <label>
              <input type="radio" name="bicim" value="cd-r" /> CD-R
            </label>{' '}
            <label>
              <input type="radio" name="bicim" value="plak" /> plak
            </label>
          </fieldset>
          <p>
            <label>
              <input type="checkbox" name="bulten" value="evet" defaultChecked /> Bültene yaz
            </label>
          </p>
          <p>
            <label>
              Şehir:{' '}
              <select name="sehir" defaultValue="İstanbul">
                {SEHIRLER.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
          </p>
          <p>
            <label>
              Türler (Ctrl ile birden çok):
              <br />
              <select name="tur" multiple size={4} defaultValue={['noise', 'drone']}>
                <option value="noise">noise</option>
                <option value="drone">drone</option>
                <option value="lo-fi">lo-fi</option>
                <option value="minimal">minimal techno</option>
                <option value="sessizlik">sessizlik</option>
              </select>
            </label>
          </p>
          <p>
            <label>
              Mekân (öneri listeli): <input list="mekanlar" name="mekan" />
            </label>
            <datalist id="mekanlar">
              <option value="Bodrum 3, Karaköy" />
              <option value="Eski Matbaa, Kadıköy" />
              <option value="Tünel altı depo" />
            </datalist>
          </p>
        </fieldset>
        <fieldset>
          <legend>Durum ve açılır kutular</legend>
          <p>
            <label>
              Yükleme: <progress value={42} max={100}>%42</progress>
            </label>{' '}
            <label>
              Gürültü düzeyi: <meter min={0} max={10} low={3} high={7} optimum={2} value={8}>10 üzerinden 8</meter>
            </label>
          </p>
          <details>
            <summary>Ayrıntılar</summary>
            <p>Tarayıcının kendi açılır kutusu. Üçgeni de tarayıcı çizer.</p>
          </details>
          <p>
            <button type="button" onClick={() => pencere.current?.showModal()}>
              Pencere aç
            </button>
          </p>
        </fieldset>
        <p>
          <input type="submit" value="Gönder" /> <input type="reset" value="Temizle" /> <button type="button">Hiçbir şey yapmayan düğme</button>
        </p>
        {cikti ? (
          <>
            <p>
              Sunucu olsaydı şu satırı alırdı (<code>application/x-www-form-urlencoded</code>):
            </p>
            <pre>
              <samp>{cikti}</samp>
            </pre>
          </>
        ) : null}
      </form>
      <dialog ref={pencere} aria-labelledby="pencere-b">
        <h3 id="pencere-b">Uyarı!</h3>
        <p>Bu tarayıcının kendi pencere kutusu. Esc tuşu ya da düğme kapatır.</p>
        <form method="dialog">
          <button>Tamam</button>
        </form>
      </dialog>
      <h3>Madde 11: Bileşen kalıpları</h3>
      <table border={1} cellPadding={4}>
        <caption>Kalıp, etiket ve stil</caption>
        <thead>
          <tr>
            <th scope="col">Kalıp</th>
            <th scope="col">Etiket</th>
            <th scope="col">Stil</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Stilsiz radyo düğmesi</th>
            <td>
              <code>&lt;input type="radio"&gt;</code>
            </td>
            <td>yok; işletim sistemi çizer</td>
          </tr>
          <tr>
            <th scope="row">Varsayılan select</th>
            <td>
              <code>&lt;select&gt;</code>
            </td>
            <td>yok; açılır liste tarayıcının</td>
          </tr>
          <tr>
            <th scope="row">Hizasız tablo</th>
            <td>
              <code>&lt;table border="1"&gt;</code>
            </td>
            <td>
              her üçüncü satır 19 piksel kayar: <a href="#etkinlikler">etkinlik programı</a>
            </td>
          </tr>
          <tr>
            <th scope="row">Düğme</th>
            <td>
              <code>&lt;input type="submit"&gt;</code>
            </td>
            <td>yok; üstüne gelince imleç artıya döner</td>
          </tr>
        </tbody>
      </table>
    </Bolum>
  )
}

/** Madde 7: gölge yok; tek derinlik öğelerin birbirinin üstüne binmesi */
export function Derinlik() {
  const { css } = useAyar()
  const [golge, setGolge] = useState<number | null>(null)
  useEffect(() => {
    const id = requestAnimationFrame(() => setGolge(say().golge))
    return () => cancelAnimationFrame(id)
  }, [css])
  return (
    <Bolum id="derinlik" baslik="Madde 7: Sıfır derinlik">
      <p>Gölge yok, bulanıklık yok, katman yanılsaması yok. Tek üçüncü boyut, öğelerin birbirinin üstüne binmesi.</p>
      <article id="ust-uste" aria-labelledby="ust-uste-b">
        <h3 id="ust-uste-b">Üç satır, aynı yerde</h3>
        <p>SİNYAL YOK</p>
        <p>YAYIN BİTTİ</p>
        <p>KANALI DEĞİŞTİR</p>
      </article>
      <p>
        Gözle okunmaz. Ekran okuyucu ise belge sırasını izler ve üçünü sırayla okur: “Sinyal yok. Yayın bitti. Kanalı değiştir.” CSS'i <a href="#ayarlar">ayarlardan</a> kapatınca satırlar ayrılır.
      </p>
      <p>
        Gölgesi ya da yuvarlak köşesi olan öğe (form kontrolleri hariç): <output>{golge ?? '…'}</output>
      </p>
    </Bolum>
  )
}

/** Madde 8: dokusuz zemin, ekran yırtığı */
export function Yirtik() {
  const { hareket } = useAyar()
  const [acik, setAcik] = useState(true)
  const metin = (
    <p>
      BAĞLANTI KOPTU
      <br />
      TAŞIYICI YOK
      <br />
      <i lang="en">NO CARRIER</i>
    </p>
  )
  return (
    <Bolum id="yirtik" baslik="Madde 8: Doku yok, yalnız ekran yırtığı">
      <p>
        Zemin tek renk: tarayıcının kendi zemini (<code>Canvas</code>). Degrade, gren, desen, görsel yok. <i lang="en">Glitch brutalism</i> buna ekran yırtığı ekler: görüntünün bir şeridi bir an yana kayar.
      </p>
      <figure id="yirtik-sahne" data-yirtik={acik ? 'acik' : 'kapali'}>
        <blockquote>{metin}</blockquote>
        <blockquote aria-hidden="true">{metin}</blockquote>
        <figcaption>Yırtık, aynı metnin ekran okuyucudan gizlenmiş kopyası; okuyucu metni bir kez duyar. En üstteki başlıkta da aynı yırtık var.</figcaption>
      </figure>
      <p>
        <label>
          <input type="checkbox" checked={acik} onChange={(e) => setAcik(e.target.checked)} /> Bu bölümde yırtığı çalıştır
        </label>
        {hareket ? null : ' (hareket kapalı: yırtık durur)'}
      </p>
    </Bolum>
  )
}

/** Madde 9: ikon yok; klavye karakteri, ASCII ve işletim sisteminin emojisi */
export function Ikon() {
  return (
    <Bolum id="ikon" baslik="Madde 9: İkon yerine klavye, ASCII ve emoji">
      <p>İkon seti yok, SVG yok. İşaretler klavyeden yazılır; emoji işletim sisteminin yazı tipiyle çizilir, yani aynı sayfa her cihazda başka görünür.</p>
      <table border={1} cellPadding={4}>
        <caption>Anlam, ASCII karşılığı ve emoji</caption>
        <thead>
          <tr>
            <th scope="col">Anlam</th>
            <th scope="col">ASCII</th>
            <th scope="col">Emoji</th>
          </tr>
        </thead>
        <tbody>
          {IKONLAR.map(([ad, ascii, emoji]) => (
            <tr key={ad}>
              <th scope="row">{ad}</th>
              <td>
                <kbd>{ascii}</kbd>
              </td>
              <td>{emoji}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        ASCII işaret bir linkin yanında süs olarak durduğunda ekran okuyucudan saklanır; yoksa “sol açılı ayraç” diye okunur. Sayfanın altındaki <a href="#halka">web halkası</a> böyle.
      </p>
      <pre role="img" aria-label="ASCII çizim: üstünde SİNYAL KAYBI yazan bir kaset">{`  ______________________
 |  __________________  |
 | |  SİNYAL KAYBI    | |
 | |   __        __   | |
 | |  /  \\ ~~~~ /  \\  | |
 | |  \\__/      \\__/  | |
 | |__________________| |
 |     ____________     |
 |____/_o________o_\\____|`}</pre>
    </Bolum>
  )
}
