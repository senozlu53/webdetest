// Sohbet rehberi: sayfanın menüsü yok, her madde bir soruyla açılır.
// Yanıt metni kelime kelime akar; ardından (varsa) etkileşimli bir örnek (widget) belirir.

export type WidgetId = 'anatomi' | 'palet' | 'balon' | 'kutu' | 'modlar' | 'kod' | 'hareket' | 'klavye' | 'erisim' | 'dosya'

export type Topic = {
  id: string
  chip: string
  /** Kullanıcı balonuna yazılan soru */
  soru: string
  match: RegExp
  dusunce: string[]
  text: string
  widget?: WidgetId
  widgetTitle?: string
  sonraki: string[]
}

export const TOPICS: Topic[] = [
  {
    id: 'stil',
    chip: 'Bu stil nedir?',
    soru: 'Conversational UI nedir, bu sayfa nasıl çalışıyor?',
    match: /nedir|ne demek|stil|nasıl çalış|conversational|sohbet ara/i,
    dusunce: ['Soruyu anlıyorum', 'Madde 1–3 ve 10: kategori, karakteristik', 'Ekran anatomisini hazırlıyorum'],
    text: `**Conversational UI** geleneksel gezinmeyi kaldırır: menü, sekme ve form yerine bir mesaj akışı ve altta sabit bir komut kutusu vardır. Kullanıcı ne istediğini yazar, arayüz yanıt olarak gelir.

Bu sayfanın da menüsü yok. Maddelere aşağıdaki öneri çipleriyle ya da yazarak ulaşırsınız; akış kronolojiktir, en yeni mesaj en alttadır.`,
    widget: 'anatomi',
    widgetTitle: 'ekran anatomisi',
    sonraki: ['renk', 'balon', 'kutu'],
  },
  {
    id: 'renk',
    chip: 'Renk ve yazı',
    soru: 'Renk sistemi ve tipografi nasıl?',
    match: /renk|palet|marka|yazı|yazi|font|tipograf|satır aralığı|line/i,
    dusunce: ['Madde 4: ikili renk sistemi', 'Madde 5: gövde yazısı', 'Kontrastları kontrol ediyorum'],
    text: `İki konuşmacı iki renkle ayrılır: **sizin balonunuz marka rengi**, benimki nötr gri. Zemin düz ve pürüzsüz; doku yok, göz yalnız metne odaklanır.

Gövde yazısı **Inter 16px, 1,6 satır aralığı**: uzun yanıtlarda satırlar birbirine yapışmaz. Aşağıdan marka rengini değiştirebilirsiniz; bütün sohbet anında güncellenir.`,
    widget: 'palet',
    widgetTitle: 'palet ve yazı',
    sonraki: ['balon', 'erisim', 'kod'],
  },
  {
    id: 'balon',
    chip: 'Mesaj balonları',
    soru: 'Mesaj balonlarının köşeleri neden sivri?',
    match: /balon|bubble|köşe|kose|kuyruk|radius|sivri/i,
    dusunce: ['Madde 6: şekil dili', 'Madde 13: yarıçap tokenları', 'Gruplama kuralını gösteriyorum'],
    text: `Balonun konuşmacıya bakan alt köşesi **sivri (0px)** bırakılır: siz sağdasınız, sizin balonunuzun sağ alt köşesi sivri; ben soldayım, benimkinin sol alt köşesi.

Art arda gelen mesajlarda yalnız **son balon** sivri köşeyi taşır, öncekiler o tarafta hafifçe yuvarlanır. Böylece bir grup tek bir konuşma turu gibi okunur. Biçimi aşağıdan değiştirin: sivri köşe, kuyruk ya da tam yuvarlak.`,
    widget: 'balon',
    widgetTitle: 'balon biçimi',
    sonraki: ['kutu', 'kod', 'hareket'],
  },
  {
    id: 'kutu',
    chip: 'Komut kutusu',
    soru: 'Komut kutusunda neler var?',
    match: /komut kutusu|prompt|kutu|ataç|atac|dosya ek|mikrofon|ses|gönder|gonder|ikon/i,
    dusunce: ['Madde 7, 9, 11: AI Prompt Box', 'Ekleri ve sesi anlatıyorum'],
    text: `Ekranın en büyük girdisi aşağıdaki **komut kutusu**. Metin yazdıkça büyür; Enter gönderir, Shift+Enter yeni satır açar.

- **Ataç:** en fazla 5 dosya, her biri 10 MB. Sürükleyip bırakabilir ya da yapıştırabilirsiniz; dosyalar tarayıcıdan çıkmaz.
- **Mikrofon:** konuşmanız metne çevrilir, göndermeden önce düzenleyebilirsiniz.
- **Ayarlar:** görünüm, tema, marka rengi, balon biçimi ve hareket.

Kutu ekranın altına sabittir ve derin bir yukarı gölgeyle akışın üstünde durur.`,
    widget: 'kutu',
    widgetTitle: 'kutu anatomisi',
    sonraki: ['alan', 'klavye', 'erisim'],
  },
  {
    id: 'alan',
    chip: 'Kullanım alanları',
    soru: 'Bu arayüz nerelerde kullanılır?',
    match: /kullanım alan|kullanim alan|nerede|destek|kenar çubu|kenar cubu|sidebar|widget|tam ekran|görünüm|gorunum/i,
    dusunce: ['Madde 10: kullanım alanları', 'Aynı bileşeni üç kapta gösteriyorum'],
    text: `Aynı sohbet bileşeni üç kapta çalışır: **tam ekran** yapay zekâ sohbeti, bir sayfanın yanında **kenar çubuğu asistanı** ve köşede açılan **müşteri destek botu**.

Aşağıdan geçiş yapın; sohbet geçmişi kaybolmaz, yalnız kap değişir.`,
    widget: 'modlar',
    widgetTitle: 'üç görünüm',
    sonraki: ['kod', 'klavye', 'stil'],
  },
  {
    id: 'kod',
    chip: 'Figma ve kod',
    soru: 'Figma ve React tarafında nasıl kuruluyor?',
    match: /figma|react|kod|tailwind|token|auto layout|flex|css|bileşen|bilesen/i,
    dusunce: ['Madde 12–15: yapı ve tokenlar', 'Ters akışı açıklıyorum'],
    text: `Figma'da akış **dikey Auto Layout**, komut çubuğu ise en altta **sabit konumlu** bir katman. Kodda mesaj listesi \`flex-col-reverse\` bir kaydırma alanında durur: tarayıcı en alttan başlar, yeni mesaj gelince görünüm en sonda kalır. Siz yukarı kaydırdıysanız yerinizi korur ve "son mesaja in" düğmesi belirir.

Bileşenler: \`<AIChat>\`, \`<AIMessage>\`, \`<AIPromptBox>\`, \`<AIVoiceInput>\`.`,
    widget: 'kod',
    widgetTitle: 'yapı, token ve kod',
    sonraki: ['hareket', 'klavye', 'erisim'],
  },
  {
    id: 'hareket',
    chip: 'Hareket',
    soru: 'Mesajlar nasıl hareket ediyor?',
    match: /hareket|animasyon|motion|düşün|dusun|akış|akis|slide/i,
    dusunce: ['Madde 16: hareket dili', 'Düşünme adımlarını açıklıyorum'],
    text: `Yeni mesaj **alttan yukarı** kayarak belirir. Yanıttan önce bu **düşünme göstergesi** adımları sırayla işaretler; bitince tek satıra katlanır, isterseniz yeniden açarsınız. Yanıt kelime kelime akar.

Hareketi kapatırsanız ya da sisteminizde "hareketi azalt" açıksa yanıt tek seferde gelir.`,
    widget: 'hareket',
    widgetTitle: 'hareket denemesi',
    sonraki: ['klavye', 'erisim', 'balon'],
  },
  {
    id: 'klavye',
    chip: 'Mobil klavye',
    soru: 'Mobilde klavye açılınca komut kutusu ne oluyor?',
    match: /mobil|klavye|telefon|viewport|dvh|vh|responsive/i,
    dusunce: ['Madde 17: görünür alan yüksekliği', 'Klavye açılışını canlandırıyorum'],
    text: `Mobilde klavye açılınca görünür alan küçülür ama \`100vh\` küçülmez: kutu klavyenin arkasında kalır. Bu sayfa yüksekliği **VisualViewport** ile ölçer ve \`interactive-widget=resizes-content\` ister; kutu her zaman klavyenin hemen üstünde durur.

Aşağıda iki telefonu karşılaştırın.`,
    widget: 'klavye',
    widgetTitle: 'klavye simülasyonu',
    sonraki: ['erisim', 'kutu', 'alan'],
  },
  {
    id: 'erisim',
    chip: 'Erişilebilirlik',
    soru: 'Ekran okuyucu yeni mesajı nasıl duyuyor?',
    match: /erişil|erisil|ekran okuyucu|aria|live|görme|gorme|kontrast|a11y/i,
    dusunce: ['Madde 18: aria-live bölgeleri', 'Duyuru günlüğünü açıyorum'],
    text: `Yeni mesaj geldiğinde görmeyen kullanıcı da haberdar olmalı. Akan yanıt kelime kelime okunmaz; yanıt bitince **tek bir aria-live duyurusu** yapılır ("Asistan: …"). Düşünme başladığında ve dosya eklendiğinde de kısa bir duyuru gider; hatalar hemen (assertive) okunur.

Aşağıda bu oturumda yapılan duyuruların günlüğü var.`,
    widget: 'erisim',
    widgetTitle: 'duyuru günlüğü',
    sonraki: ['renk', 'klavye', 'stil'],
  },
]

export const topic = (id: string) => TOPICS.find((t) => t.id === id)!

export const WELCOME = `Merhaba! Ben **Stil 014'ün rehberiyim**. Bu sayfada menü yok; her şey bu sohbette.

Bir konu seçin, bir soru yazın ya da bir dosya ekleyin.`

export function route(text: string): Topic | null {
  const t = text.trim()
  const exact = TOPICS.find((x) => x.soru === t || x.chip === t)
  if (exact) return exact
  return TOPICS.find((x) => x.match.test(t)) ?? null
}

export const FALLBACK = (q: string) => `"${q.length > 60 ? q.slice(0, 60) + '…' : q}" hakkında bir örneğim yok; bu tanıtım yalnız Stil 014'ün maddelerini bilir. Şunlardan birini deneyin ya da bir dosya ekleyin, içeriğine bakayım.`
