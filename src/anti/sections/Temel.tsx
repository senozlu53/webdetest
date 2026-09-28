import { Bolum } from '../components/Bolum'
import { GUVENLI, RENKLER, kupte } from '../lib/veri'
import { eski } from '../lib/eski'

/** Madde 1 · 2 · 3 */
export function Nedir() {
  return (
    <Bolum id="nedir" baslik="Madde 1–3: Anti-Design nedir?">
      <dl>
        <dt>Stil adı</dt>
        <dd>
          <i lang="en">Anti-Design</i> / <i lang="en">Deconstructed Design</i>
        </dd>
        <dt>Kategori</dt>
        <dd>
          <i lang="en">Brutalism / Experimental</i>
        </dd>
        <dt>Neye karşı</dt>
        <dd>“İyi tasarımın” kurallarına: grid, hizalama, tutarlı boşluk, marka rengi, özel yazı tipi, gölge, yuvarlak köşe.</dd>
      </dl>
      <h3>Madde 2: Görsel referans</h3>
      <p>Web'in ilk yıllarındaki çirkinlik. Bu sayfada hepsi var:</p>
      <ul>
        <li>Biçimlendirilmemiş HTML: gövde metni tarayıcının varsayılanı, 16 piksel Times.</li>
        <li>
          Mavi, altı çizili linkler: <a href="#renk">#0000FF</a>. Tıkladıklarınız mora döner.
        </li>
        <li>
          Ekranın dışına taşan bozuk tablo: <a href="#etkinlikler">etkinlik programı</a>.
        </li>
        <li>
          Üst üste binmiş okunaksız yazılar: <a href="#derinlik">Madde 7</a> ve en üstteki başlık.
        </li>
      </ul>
      <h3>Madde 3: Karakteristikler</h3>
      <dl>
        <dt>Kasıtlı çirkinlik</dt>
        <dd>Güzel görünmek bir seçenek değil. Renkler çarpışır, yazılar birbirine girer.</dd>
        <dt>UX standartlarının yıkılması</dt>
        <dd>Hizalama yok, hiyerarşi kaba. Menü numaralı bir liste, düğmeler işletim sisteminin gri kutuları.</dd>
        <dt>“Bozuk” görünüm</dt>
        <dd>Başlık sol kenardan, tablo sağ kenardan taşar. CSS dosyasında bilerek geçersiz satırlar var.</dd>
        <dt>Görsel rahatsızlık</dt>
        <dd>Kayan yazılar, yanıp sönen işaretler, ekran yırtığı. Hepsi tek kutuyla durur.</dd>
      </dl>
      <figure>
        <blockquote>
          <p>Güzel sayfa ne düşüneceğinizi söyler. Çirkin sayfa sizi kendi başınıza bırakır.</p>
        </blockquote>
        <figcaption>SİNYAL KAYBI manifestosu, 1997 (kurgu)</figcaption>
      </figure>
      <p>
        Tek kural bozulmaz: HTML'in anlamı. Başlık başlıktır, liste listedir, tablo tablodur. Bu yüzden sayfa gözle kaos, ekran okuyucu için düzenlidir (<a href="#erisim">Madde 18</a>).
      </p>
    </Bolum>
  )
}

/** Madde 4 */
export function Renk() {
  return (
    <Bolum id="renk" baslik="Madde 4: Web güvenli renkler">
      <p>256 renkli monitör çağında her ekranda aynı görünen 216 renk vardı: kırmızı, yeşil ve mavinin her biri için yalnız 00, 33, 66, 99, CC ve FF. Bu sayfa onlarla ve HTML 4'ün 16 adlı rengiyle yetinir.</p>
      <table border={1} cellPadding={4}>
        <caption>HTML 4'ün 16 adlı rengi. Kontrast oranları WCAG 2.x hesabıyla.</caption>
        <thead>
          <tr>
            <th scope="col">Örnek</th>
            <th scope="col">Ad</th>
            <th scope="col">Hex</th>
            <th scope="col">216'lık küpte mi?</th>
            <th scope="col">Bu sayfadaki rolü</th>
            <th scope="col">Beyaz zeminde</th>
            <th scope="col">Siyah zeminde</th>
          </tr>
        </thead>
        <tbody>
          {RENKLER.map((r) => (
            <tr key={r.ad}>
              <td {...eski({ bgcolor: r.hex })}>&nbsp;&nbsp;&nbsp;&nbsp;</td>
              <th scope="row">
                <code>{r.ad}</code>
              </th>
              <td>
                <code>{r.hex}</code>
              </td>
              <td>{kupte(r.hex) ? 'evet' : 'hayır'}</td>
              <td>{r.rol}</td>
              <td>{r.beyaz}:1</td>
              <td>{r.siyah}:1</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        Ziyaret edilmiş link moru <code>#800080</code> bir HTML 4 rengidir ama 216'lık küpte yoktur (80 bir basamak değil). Kırmızı yazı beyaz zeminde 4,00:1 kalır; bu yüzden yalnız büyük yazıda ve çizgide kullanılır.
      </p>
      <p>
        Koyu düzende zemini ve yazıyı tarayıcı seçer (<code>Canvas</code>, <code>CanvasText</code>). Linkler <code>#9999FF</code>, ziyaret edilenler <code>#CC99CC</code>, kırmızı <code>#FF3333</code> olur: üçü de web güvenli, koyu zeminde en az 4,7:1.
      </p>
      <h3>216 renk</h3>
      <p>Aşağıdaki tablo yalnız göz için: her hücre bir renk, üstüne gelince kodu görünür. Ekran okuyucu bu tabloyu atlar.</p>
      <table border={0} cellSpacing={1} cellPadding={0} aria-hidden="true">
        <tbody>
          {GUVENLI.map((r) => (
            <tr key={r}>
              {GUVENLI.flatMap((g) => GUVENLI.map((b) => `#${r}${g}${b}`)).map((hex) => (
                <td key={hex} width={16} height={16} title={hex} {...eski({ bgcolor: hex })} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Bolum>
  )
}

/** Madde 5 */
export function Yazi() {
  const ornek = 'Sinyal kaybı: ĞÜŞİÖÇ ğüşıöç 0123456789'
  return (
    <Bolum id="yazi" baslik="Madde 5: Yalnız tarayıcının yazı tipleri">
      <p>Web yazı tipi yok, indirme yok. Tarayıcının elindeki üç aile yeter:</p>
      <table border={1} cellPadding={6}>
        <caption>Üç aile ve bu sayfadaki yerleri</caption>
        <thead>
          <tr>
            <th scope="col">Aile</th>
            <th scope="col">Genel ad</th>
            <th scope="col">Nerede</th>
            <th scope="col">Örnek</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Times New Roman</th>
            <td>
              <code>serif</code>
            </td>
            <td>gövde metni; tarayıcının varsayılanı</td>
            <td>{ornek}</td>
          </tr>
          <tr>
            <th scope="row">Arial</th>
            <td>
              <code>sans-serif</code>
            </td>
            <td>bölüm başlıkları, en üstteki alt başlık</td>
            <td>{ornek}</td>
          </tr>
          <tr>
            <th scope="row">Courier</th>
            <td>
              <code>monospace</code>
            </td>
            <td>
              <code>code</code>, <code>pre</code>, <code>kbd</code>, <code>samp</code>, kayan yazı
            </td>
            <td>{ornek}</td>
          </tr>
        </tbody>
      </table>
      <p>Cihazda bu adlar yoksa tarayıcı en yakın serif, sans ya da mono yazı tipini kullanır (Linux'ta çoğunlukla Liberation ailesi). Tasarımcı buna karışmaz.</p>
      <h3>Varsayılan boyutlar</h3>
      <dl>
        <dt>
          <code>&lt;h1&gt;</code>
        </dt>
        <dd>2em. Bu sayfada bozuk: ekran genişliğinin %17'si, sol kenardan taşar.</dd>
        <dt>
          <code>&lt;h2&gt;</code> ve <code>&lt;h3&gt;</code>
        </dt>
        <dd>1,5em ve 1,17em, kalın.</dd>
        <dt>Gövde</dt>
        <dd>16 piksel, satır aralığı tarayıcının.</dd>
        <dt>
          <code>&lt;small&gt;</code> ve <code>&lt;code&gt;</code>
        </dt>
        <dd>
          <small>Bir boy küçük</small> ve <code>13 piksel mono</code>.
        </dd>
      </dl>
    </Bolum>
  )
}
