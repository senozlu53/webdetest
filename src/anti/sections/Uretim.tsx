import { useEffect, useRef, useState } from 'react'
import { Bolum } from '../components/Bolum'
import { useAyar } from '../lib/ayar'
import { say, type Sayim } from '../lib/erisim'
import tokenSatiri from '../../../tokens/anti.tokens.json?raw'
import bozukCss from '../anti.css?raw'

const KATMANLAR: [string, string, string, string, string, string][] = [
  ['Başlık “SİNYAL KAYBI”', 'Metin', '−50', '16', '%17 ekran', 'yok'],
  ['Alt başlık', 'Metin', '0', 'başlığın içinde (−0,8em)', 'doğal', 'yok'],
  ['Kayan yazı', 'Çerçeve', '0', 'akışta', '%100', 'yok'],
  ['Etkinlik tablosu', 'Çerçeve', '0', 'akışta', '%140', 'yok'],
  ['Bülten kutusu', 'Çerçeve', '%41', '−4,2em (grid’in üstüne)', '17em', 'yok'],
]

/** Madde 12 · 13: Auto Layout yok, bileşenler grid dışında; tokenlar tek satır */
export function Figma() {
  const { duyur } = useAyar()
  const [yazildi, setYazildi] = useState(false)
  const [kopya, setKopya] = useState('')
  const satir = useRef<HTMLElement>(null)
  const kopyala = async () => {
    try {
      await navigator.clipboard.writeText(tokenSatiri.trim())
      setKopya('Kopyalandı.')
      duyur('Token satırı kopyalandı')
    } catch {
      // Pano kapalıysa satırı seçili bırak: Ctrl+C yeter
      const el = satir.current
      if (el) {
        const r = document.createRange()
        r.selectNodeContents(el)
        const s = window.getSelection()
        s?.removeAllRanges()
        s?.addRange(r)
      }
      setKopya('Pano kapalı; satır seçildi, Ctrl+C ile kopyalayın.')
    }
  }
  return (
    <Bolum id="figma" baslik="Madde 12 · 13: Figma">
      <p>Auto Layout kullanılmaz. Her katman mutlak konumdadır ve kısıtı yoktur; bileşenler bilerek grid dışına yerleştirilir.</p>
      <table border={1} cellPadding={4}>
        <caption>Figma dosyasındaki katmanlar</caption>
        <thead>
          <tr>
            <th scope="col">Katman</th>
            <th scope="col">Tür</th>
            <th scope="col">X</th>
            <th scope="col">Y</th>
            <th scope="col">Genişlik</th>
            <th scope="col">Auto Layout</th>
          </tr>
        </thead>
        <tbody>
          {KATMANLAR.map(([ad, tur, x, y, g, al]) => (
            <tr key={ad}>
              <th scope="row">{ad}</th>
              <td>{tur}</td>
              <td>{x}</td>
              <td>{y}</td>
              <td>{g}</td>
              <td>{al}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Grid dışı</h3>
      <p>12 sütunlu bir grid çizildi ve kullanılmadı. Bülten kutusu onun üstüne, iki sütunun arasına düşer:</p>
      <table border={1} width="100%" aria-hidden="true">
        <tbody>
          <tr>
            {Array.from({ length: 12 }, (_, i) => (
              <td key={i} align="center" height={60}>
                {i + 1}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <form
        id="grid-disi"
        aria-labelledby="bulten-b"
        onSubmit={(e) => {
          e.preventDefault()
          setYazildi(true)
          duyur('Bültene yazıldınız (tanıtım)')
        }}
      >
        <h4 id="bulten-b">Bülten</h4>
        <p>
          <label>
            E-posta: <input type="email" name="eposta" required autoComplete="email" size={16} />
          </label>{' '}
          <input type="submit" value="Yaz" />
        </p>
        {yazildi ? <p>Yazıldın. (Tanıtım: hiçbir yere gitmedi.)</p> : null}
      </form>
      <h3 id="tokenlar">Madde 13: Tek satırlık tokenlar</h3>
      <p>
        Token dosyası tek satır. İçinde yalnız HTML 3.2'nin <code>&lt;body&gt;</code> renk öznitelikleri var: <code>bgcolor</code>, <code>text</code>, <code>link</code>, <code>vlink</code>, <code>alink</code>. Satır kırılmaz; ekrandan taşar.
      </p>
      <pre>
        <code ref={satir}>{tokenSatiri.trim()}</code>
      </pre>
      <p>
        <button type="button" onClick={kopyala}>
          Satırı kopyala
        </button>{' '}
        <output>{kopya}</output>
      </p>
      <p>
        Aynı beş renk bu sayfanın <code>&lt;body&gt;</code> etiketinde öznitelik olarak da durur. CSS kapalıyken bile linkler <code>#0000FF</code>, ziyaret edilenler <code>#800080</code> olur.
      </p>
    </Bolum>
  )
}

const ORNEK = `function Defter() {
  const { kayitlar, ekle } = useDefter()
  return (
    <section aria-labelledby="defter-b">
      <h2 id="defter-b">Ziyaretçi defteri</h2>
      <form onSubmit={ekle}>
        <p><label>Ad: <input name="ad" required /></label></p>
        <p><label>Mesaj:<br /><textarea name="mesaj" required /></label></p>
        <p><input type="submit" value="Deftere yaz" /></p>
      </form>
      <table border={1}>
        <caption>Kayıtlar</caption>
        …
      </table>
    </section>
  )
}`

/** Madde 14: React, yalnız anlamlı HTML etiketleriyle */
export function ReactBolum() {
  const [s, setS] = useState<Sayim | null>(null)
  useEffect(() => {
    const id = requestAnimationFrame(() => setS(say()))
    return () => cancelAnimationFrame(id)
  }, [])
  return (
    <Bolum id="react" baslik="Madde 14: React, ama yalnız HTML etiketleri">
      <p>
        Bileşenler yalnız anlamlı HTML döndürür: başlık, paragraf, liste, tablo, form. <code>className</code> yok, <code>style</code> yok, arayüz kütüphanesi yok, CSS-in-JS yok. Tek <code>&lt;div&gt;</code> React'in bağlandığı kök.
      </p>
      <pre>
        <code>{ORNEK}</code>
      </pre>
      <h3>Canlı sayım</h3>
      <table border={1} cellPadding={4}>
        <caption>Bu sayfanın DOM'u, şu an</caption>
        <tbody>
          <tr>
            <th scope="row">
              <code>class</code> özniteliği olan öğe
            </th>
            <td>{s?.sinif ?? '…'}</td>
          </tr>
          <tr>
            <th scope="row">
              <code>style</code> özniteliği olan öğe
            </th>
            <td>{s?.stil ?? '…'}</td>
          </tr>
          <tr>
            <th scope="row">
              <code>&lt;div&gt;</code> sayısı
            </th>
            <td>{s ? `${s.div} (React kökü)` : '…'}</td>
          </tr>
          <tr>
            <th scope="row">Kullanılan etiket türü</th>
            <td>{s?.etiket.length ?? '…'}</td>
          </tr>
        </tbody>
      </table>
      <details>
        <summary>Etiketler ve sayıları</summary>
        <p>{s ? s.etiket.map(([t, n]) => `${t} (${n})`).join(', ') : '…'}</p>
      </details>
      <p>
        <button type="button" onClick={() => setS(say())}>
          Yeniden say
        </button>
      </p>
    </Bolum>
  )
}

/** Madde 15: kasten bozuk CSS; kaynağı sayfada, yazıldığı gibi */
export function Css() {
  const satirSayisi = bozukCss.trimEnd().split('\n').length
  return (
    <Bolum id="css" baslik="Madde 15: Kasten bozuk CSS">
      <p>Stil dosyası derleyiciden geçmeden, yazıldığı gibi sayfaya girer. İçindeki kasıtlı hatalar:</p>
      <dl>
        <dt>
          <code>margin-left: -50px; overflow: visible;</code>
        </dt>
        <dd>En üstteki başlık sol kenardan dışarı taşar; ilk harfler kesik kalır.</dd>
        <dt>
          <code>&lt;table width="140%"&gt;</code>
        </dt>
        <dd>CSS bile değil, HTML özniteliği. Etkinlik tablosu ekranın sağından taşar; CSS kapalıyken de.</dd>
        <dt>
          <code>left: 19px</code> (her üçüncü satırda)
        </dt>
        <dd>Satırlar kayar, sütunlar hizasını kaybeder.</dd>
        <dt>
          <code>margin-top: -.8em</code>
        </dt>
        <dd>Alt başlık başlığın üstüne biner.</dd>
        <dt>
          <code>colour: red;</code> <code>display: flexbox;</code> <code>float: centre;</code> <code>margin-left: -50px px;</code>
        </dt>
        <dd>Geçersiz. Tarayıcı bunları sessizce atlar; sayfa çökmez.</dd>
        <dt>
          <code>z-index: 9999;</code>
        </dt>
        <dd>Geçerli ama etkisiz: öğenin <code>position</code> değeri yok.</dd>
        <dt>
          <code>!important</code> savaşı
        </dt>
        <dd>
          Aynı kural iki kez <code>!important</code> ile yazılır; son yazan kazanır. Sayfanın altındaki adres bu yüzden eğik.
        </dd>
      </dl>
      <p>Medya sorgusu: 0. Sınıf seçicisi: 0. Kurallar yalnız etiket, kimlik ve öznitelik seçer.</p>
      <details open>
        <summary>
          <code>anti.css</code> ({satirSayisi} satır)
        </summary>
        <pre>
          <code>{bozukCss}</code>
        </pre>
      </details>
    </Bolum>
  )
}
