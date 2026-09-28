import { useEffect, useState } from 'react'
import { Bolum } from '../components/Bolum'
import { Kayan } from '../components/Kayan'
import { useAyar } from '../lib/ayar'
import { iskelet, say, type Iskelet, type Sayim } from '../lib/erisim'

type Yon = 'left' | 'right' | 'up' | 'down'
type Davranis = 'scroll' | 'alternate' | 'slide'

const YONLER: [Yon, string][] = [
  ['left', 'sola'],
  ['right', 'sağa'],
  ['up', 'yukarı'],
  ['down', 'aşağı'],
]

/** Madde 16: <marquee> ve kaba hover */
export function Hareket() {
  const { hareket } = useAyar()
  const [yon, setYon] = useState<Yon>('left')
  const [dav, setDav] = useState<Davranis>('scroll')
  const [hiz, setHiz] = useState(6)
  const [metin, setMetin] = useState('SAYFAMA HOŞ GELDİNİZ!!!')
  return (
    <Bolum id="hareket" baslik="Madde 16: Kayan yazı ve kaba hover">
      <p>
        Doksanların hareketi: <code>&lt;marquee&gt;</code> ve fare üstüne gelince zıplayan linkler. Yumuşak geçiş yok, <i lang="en">easing</i> yok.
      </p>
      <form aria-labelledby="kurucu-b" onSubmit={(e) => e.preventDefault()}>
        <h3 id="kurucu-b">Kayan yazı kurucu</h3>
        <fieldset>
          <legend>Yön</legend>
          {YONLER.map(([id, ad]) => (
            <label key={id}>
              <input type="radio" name="yon" value={id} checked={yon === id} onChange={() => setYon(id)} /> {ad}{' '}
            </label>
          ))}
        </fieldset>
        <p>
          <label>
            Davranış:{' '}
            <select value={dav} onChange={(e) => setDav(e.target.value as Davranis)}>
              <option value="scroll">scroll: durmadan kay</option>
              <option value="alternate">alternate: git gel</option>
              <option value="slide">slide: kay ve dur</option>
            </select>
          </label>{' '}
          <label>
            Hız:{' '}
            <select value={hiz} onChange={(e) => setHiz(+e.target.value)}>
              <option value={2}>2 (yavaş)</option>
              <option value={6}>6 (varsayılan)</option>
              <option value={20}>20 (çok hızlı)</option>
            </select>
          </label>
        </p>
        <p>
          <label>
            Metin: <input type="text" value={metin} maxLength={60} onChange={(e) => setMetin(e.target.value)} />
          </label>
        </p>
      </form>
      <Kayan key={`${yon}-${dav}-${hiz}`} direction={yon} behavior={dav} scrollamount={hiz}>
        {metin || ' '}
      </Kayan>
      <p>
        <code>{`<marquee direction="${yon}" behavior="${dav}" scrollamount="${hiz}">`}</code>
        {hareket ? null : ' (hareket kapalı: düz paragraf)'}
      </p>
      <h3>Kaba hover</h3>
      <p>
        Bu linklerin üstüne gelin: <a href="#renk">sarı zemin</a>, <a href="#yazi">kalın yazı</a>, <a href="#css">üst ve alt çizgi</a>. Yazı genişler, satır kayar. Düğmelerin üstünde imleç artıya döner; başlıklardaki “YENİ!” saniyede bir yanıp söner.
      </p>
      <p>
        Hepsi <a href="#ayarlar">ayarlardaki</a> tek kutuyla durur. İşletim sisteminde “hareketi azalt” açıksa sayfa hareketsiz açılır. Kayan yazılar durunca düz paragrafa döner, çünkü durdurulmuş bir marquee yazıyı kutunun dışında bırakabilir.
      </p>
    </Bolum>
  )
}

/** Madde 17: tarayıcının doğal akışı; tasarımcı karışmaz */
export function Akis() {
  // clientWidth: telefonda sayfa taşınca innerWidth taşan genişliği döndürür; görünen alan bu
  const [w, setW] = useState(() => document.documentElement.clientWidth)
  useEffect(() => {
    const f = () => setW(document.documentElement.clientWidth)
    window.addEventListener('resize', f)
    return () => window.removeEventListener('resize', f)
  }, [])
  return (
    <Bolum id="akis" baslik="Madde 17: Tarayıcının doğal akışı">
      <p>Duyarlı tasarım kuralı yok. Metin pencereye göre kendiliğinden kırılır; tasarımcı araya girmez.</p>
      <p>
        Şu anki pencere genişliği: <output>{w}</output> piksel.
      </p>
      <ul>
        <li>
          Medya sorgusu yok. <code>viewport</code> etiketi yalnız telefon sayfayı küçültüp göstermesin diye var.
        </li>
        <li>Satır uzunluğu sınırlanmaz; geniş ekranda satırlar ekran boyu uzar.</li>
        <li>
          %140 genişliğindeki tablo ve uzun <code>pre</code> satırları sayfayı yana kaydırır. WCAG 1.4.10 veri tablolarını ve kodu bu kuraldan ayrı tutar.
        </li>
        <li>Negatif kenar boşluklu başlık her genişlikte biraz kesik kalır.</li>
        <li>Form elemanları telefonda işletim sisteminin seçicilerini açar: tarih, saat, renk, select.</li>
      </ul>
    </Bolum>
  )
}

/** Madde 18: görsel kaos, düzgün okuma. İskelet ve denetim DOM'dan canlı çıkarılır */
export function Erisim() {
  const { css, hareket } = useAyar()
  const [isk, setIsk] = useState<Iskelet[]>([])
  const [s, setS] = useState<Sayim | null>(null)
  const yenile = () => {
    setIsk(iskelet())
    setS(say())
  }
  useEffect(() => {
    const id = requestAnimationFrame(yenile)
    return () => cancelAnimationFrame(id)
  }, [])
  return (
    <Bolum id="erisim" baslik="Madde 18: Görsel kaos, düzgün okuma">
      <p>
        Ekran okuyucu görüntüyü değil belgeyi okur. Bu sayfanın belgesi temiz: her bölümün başlığı, her tablonun açıklaması ve başlık hücreleri, her form alanının etiketi var. CSS ne kadar bozuk olursa olsun okuma sırası belge sırasıdır.
      </p>
      <h3>Ekran okuyucunun gördüğü iskelet</h3>
      <p>
        Yer imleri ve başlıklar, belge sırasıyla. <button type="button" onClick={yenile}>İskeleti yeniden çıkar</button>
      </p>
      <details open>
        <summary>{isk.length} öğe</summary>
        <ol>
          {isk.map((x, i) => (
            <li key={i}>
              {x.tur}
              {x.metin ? `: ${x.metin}` : ''}
            </li>
          ))}
        </ol>
      </details>
      <h3>Denetim</h3>
      <table border={1} cellPadding={4}>
        <caption>Canlı denetim sonuçları</caption>
        <thead>
          <tr>
            <th scope="col">Denetim</th>
            <th scope="col">Sonuç</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Etiketsiz form alanı</th>
            <td>{s ? `${s.etiketsiz} / ${s.alan}` : '…'}</td>
          </tr>
          <tr>
            <th scope="row">Açıklaması olmayan tablo (ekran okuyucudan gizliler hariç)</th>
            <td>{s ? `${s.basliksizTablo} / ${s.tablo}` : '…'}</td>
          </tr>
          <tr>
            <th scope="row">Başlık düzeyi atlaması</th>
            <td>{s ? s.atlama : '…'}</td>
          </tr>
          <tr>
            <th scope="row">Görsel (alternatif metin gerektiren)</th>
            <td>{s ? s.gorsel : '…'}</td>
          </tr>
          <tr>
            <th scope="row">Link</th>
            <td>{s ? s.link : '…'}</td>
          </tr>
          <tr>
            <th scope="row">Belge dili</th>
            <td>
              <code>{document.documentElement.lang}</code>
            </td>
          </tr>
          <tr>
            <th scope="row">Bozuk CSS</th>
            <td>{css ? 'açık' : 'kapalı'}</td>
          </tr>
          <tr>
            <th scope="row">Hareket</th>
            <td>{hareket ? 'açık (durdurulabilir)' : 'kapalı'}</td>
          </tr>
        </tbody>
      </table>
      <h3>Varyantlar</h3>
      <ul>
        <li>
          <strong>CSS kapalı:</strong> <a href="#ayarlar">ayarlardan</a> bozuk CSS kapatılınca sayfa tarayıcının saf akışına döner. Binen yazılar ayrılır, başlıklar sola yaslanır.
        </li>
        <li>
          <strong>Hareket kapalı:</strong> kayan yazılar düz paragraf olur, yanıp sönme ve yırtık durur.
        </li>
        <li>
          <strong>Renk düzeni:</strong> tarayıcıya bırakılır. Koyu düzende zemini ve yazıyı tarayıcı seçer.
        </li>
        <li>
          <strong>Okuyucu modu:</strong> tarayıcının okuyucu modu sayfayı olduğu gibi anlar, çünkü içerik zaten anlamlı etiketlerde.
        </li>
        <li>
          <strong>Odak halkası:</strong> tarayıcının kendi halkası; hiç dokunulmadı.
        </li>
      </ul>
      <p>
        Dürüst not: gözle okuyan için bazı yerler bilerek okunmaz (üst üste binen satırlar, kesik başlık). Bunların hepsi belgede düz metin olarak durur; CSS kapatılınca görünür, ekran okuyucu her zaman okur.
      </p>
    </Bolum>
  )
}
