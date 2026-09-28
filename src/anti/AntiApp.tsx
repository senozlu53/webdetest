import { AyarProvider, useAyar } from './lib/ayar'
import { ZIYARET } from './lib/sayac'
import { Kayan } from './components/Kayan'
import { Nedir, Renk, Yazi } from './sections/Temel'
import { Derinlik, Form, Ikon, Yirtik } from './sections/Bilesen'
import { Sahne, Sanat, Sokuk } from './sections/Alanlar'
import { Css, Figma, ReactBolum } from './sections/Uretim'
import { Akis, Erisim, Hareket } from './sections/Davranis'
import { Defter } from './sections/Defter'

const ICINDEKILER: [string, string][] = [
  ['#nedir', 'Stil adı ve kategori'],
  ['#nedir', 'Görsel referans'],
  ['#nedir', 'Karakteristikler'],
  ['#renk', 'Renk paleti: web güvenli renkler'],
  ['#yazi', 'Tipografi: Times, Arial, Courier'],
  ['#form', 'Şekil dili: native form elemanları'],
  ['#derinlik', 'Z ekseni ve gölge'],
  ['#yirtik', 'Doku ve yüzey: ekran yırtığı'],
  ['#ikon', 'İkonografi: ASCII ve emoji'],
  ['#sahne', 'Kullanım alanları: sahne, moda, web sanatı'],
  ['#form', 'Bileşen kalıpları'],
  ['#figma', 'Figma mimarisi'],
  ['#tokenlar', 'Figma tokenları: tek satır'],
  ['#react', 'React: yalnız HTML etiketleri'],
  ['#css', 'CSS: kasten bozuk'],
  ['#hareket', 'Hareket: marquee ve kaba hover'],
  ['#akis', 'Duyarlılık: doğal akış'],
  ['#erisim', 'Erişilebilirlik ve varyantlar'],
]

function Ayarlar() {
  const { css, setCss, hareket, setHareket, mode, setMode, duyuru } = useAyar()
  return (
    <form id="ayarlar" aria-labelledby="ayarlar-b" onSubmit={(e) => e.preventDefault()}>
      <h2 id="ayarlar-b">Görünüm ayarları</h2>
      <p>
        <label>
          <input type="checkbox" checked={css} onChange={(e) => setCss(e.target.checked)} /> Bozuk CSS açık
        </label>{' '}
        (kapatınca sayfa saf HTML olarak akar; okunmayan yerler okunur)
      </p>
      <p>
        <label>
          Renk düzeni:{' '}
          <select value={mode} onChange={(e) => setMode(e.target.value as typeof mode)} disabled={!css}>
            <option value="system">tarayıcıya bırak</option>
            <option value="light">açık</option>
            <option value="dark">koyu</option>
          </select>
        </label>
        {css ? null : ' (CSS kapalıyken tarayıcının açık varsayılanı)'}
      </p>
      <p>
        <label>
          <input type="checkbox" checked={hareket} onChange={(e) => setHareket(e.target.checked)} /> Hareket: kayan yazı, yanıp sönme, ekran yırtığı
        </label>
      </p>
      <p>
        Durum satırı: <output>{duyuru || 'hazır'}</output>
      </p>
    </form>
  )
}

function Sayfa() {
  return (
    <>
      <header>
        <p>
          <a href="#icerik">İçeriğe atla</a> | <a href="../../">Stil kataloğu</a> |{' '}
          <a href="../017/">
            <span aria-hidden="true">&lt;&lt; </span>Stil 017
          </a>
        </p>
        <h1 id="ust" data-metin="SİNYAL KAYBI">
          SİNYAL KAYBI
        </h1>
        <p>yeraltı ses kolektifi · bağımsız plak etiketi · web sanatı</p>
        <Kayan>*** 24 EKİM: BODRUM 3'TE KASET TAKASI *** YENİ PLAK SK-042 “ZİYARET EDİLDİ” ÇIKTI *** SÖKÜK KOLEKSİYON 00 SATIŞTA *** ZİYARETÇİ DEFTERİNE YAZMAYI UNUTMA ***</Kayan>
        <p>
          Stil 018 · <i lang="en">Anti-Design / Deconstructed Design</i> (<i lang="en">Brutalism / Experimental</i>). Bu sayfa bilerek çirkin: tarayıcının varsayılanları, mavi linkler, taşan tablolar, üst üste binen yazılar. Altındaki HTML ise temiz; ekran okuyucu her şeyi sırasıyla okur.
        </p>
        <p>
          🚧 Yapım aşamasında (1997'den beri). En iyi <cite>Netscape Navigator 3.0</cite> ile 800 × 600 çözünürlükte görüntülenir. Ziyaretçi sayacı: <samp>{ZIYARET}</samp>
        </p>
      </header>
      <hr />
      <nav aria-labelledby="icindekiler-b">
        <h2 id="icindekiler-b">İçindekiler: 18 madde</h2>
        <ol>
          {ICINDEKILER.map(([href, ad]) => (
            <li key={ad}>
              <a href={href}>{ad}</a>
            </li>
          ))}
        </ol>
      </nav>
      <Ayarlar />
      <hr />
      <main id="icerik" tabIndex={-1}>
        <Nedir />
        <Renk />
        <Yazi />
        <Form />
        <Derinlik />
        <Yirtik />
        <Ikon />
        <Sahne />
        <Sokuk />
        <Sanat />
        <Figma />
        <ReactBolum />
        <Css />
        <Hareket />
        <Akis />
        <Erisim />
        <Defter />
      </main>
      <footer>
        <hr />
        <p id="halka">
          Web halkası: [{' '}
          <a href="../017/">
            <span aria-hidden="true">&lt;&lt; </span>Stil 017
          </a>{' '}
          | <a href="../../">Katalog</a> | Stil 019 (henüz yok) ]
        </p>
        <address>Son güncelleme: 28.09.2026 · Web ustası: webmaster@sinyalkaybi.example</address>
        <p>
          <small>(c) 1997–2026 SİNYAL KAYBI. Kolektif, etkinlikler, marka ve kayıtlar kurgudur.</small>
        </p>
        <p>
          <a href="#ust">
            <span aria-hidden="true">^^ </span>Başa dön
          </a>
        </p>
      </footer>
    </>
  )
}

export default function AntiApp() {
  return (
    <AyarProvider>
      <Sayfa />
    </AyarProvider>
  )
}
