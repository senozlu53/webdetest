import type { SahneAd } from '../components/Baykus'
import type { Pigment, SimgeAd } from './simge'

/** Bilge Baykuş ve Kayıp Yıldız (kurgu): dört sayfalık masal */
export interface MasalSayfa {
  baslik: string
  metin: string
  sahne: SahneAd
}
export const MASAL: MasalSayfa[] = [
  { baslik: 'Orman uyanırken', metin: 'Bir varmış, bir yokmuş; ormanın en yaşlı ağacında Bilge adında bir baykuş yaşarmış. Sabah ışığı yaprakların arasından süzülür, o da ince bir sesle ilk kuşlara günaydın dermiş.', sahne: 'orman' },
  { baslik: 'Nehrin şarkısı', metin: 'Bir gün nehir sessiz kalmış. Bilge kanatlarını açmış, suyun ardına düşmüş; taşların arasında saklanan minik bir yıldızın sesini duymuş.', sahne: 'nehir' },
  { baslik: 'Akşam kızıllığı', metin: 'Gün batarken gökyüzü gül rengine dönmüş. Yıldız, "beni geri götürür müsün?" diye fısıldamış. Bilge gülümsemiş, çünkü yolu en iyi karanlıkta bilirmiş.', sahne: 'aksam' },
  { baslik: 'Gece masalı', metin: 'Gece lacivert bir örtü gibi inmiş. Bilge, yıldızı göğe bırakmış ve tepede yeni bir ışık yanmış. O günden sonra çocuklar uyumadan önce baykuşa el sallarmış.', sahne: 'gece' },
]

/** Sükûnet (kurgu): zihin sağlığı uygulaması */
export interface Ruh {
  id: string
  ad: string
  renk: Pigment
  mesaj: string
}
export const RUHLAR: Ruh[] = [
  { id: 'dingin', ad: 'Dingin', renk: 'ultramarin', mesaj: 'Göl gibi durgunsun. Bu sakinliği bir dakika daha tut, sonra günün ilk küçük işine geç.' },
  { id: 'umutlu', ad: 'Umutlu', renk: 'yesil', mesaj: 'Filiz veren bir dal gibisin. Umudu yazıya dök: bugün ne yeşermeyi bekliyor?' },
  { id: 'huzunlu', ad: 'Hüzünlü', renk: 'gul', mesaj: 'Hüzün de bir renk, boyaya karışır. Kendine bir bardak su ve yumuşak bir cümle ver.' },
  { id: 'yorgun', ad: 'Yorgun', renk: 'ocre', mesaj: 'Yorgunluk, bedenin "biraz dur" deme biçimi. Beş dakika nefes almak bugünkü işin tamamı olabilir.' },
  { id: 'kaygili', ad: 'Kaygılı', renk: 'murekkep', mesaj: 'Kaygı bulut gibi geçer. Şimdi ayaklarının yere bastığını ve nefesinin ritmini hisset.' },
]

/** Kır Sofrası (kurgu): organik gıda markası */
export interface Urun {
  id: string
  ad: string
  not: string
  fiyat: number
  simge: SimgeAd
  renk: Pigment
  mevsim: 'yaz' | 'kis' | 'her'
}
export const URUNLER: Urun[] = [
  { id: 'elma', ad: 'Amasya elması', not: 'ağaçta olgunlaştı, mumsuz', fiyat: 48, simge: 'elma', renk: 'gul', mevsim: 'kis' },
  { id: 'havuc', ad: 'Bahçe havucu', not: 'toprağı hâlâ üstünde, tatlı', fiyat: 32, simge: 'havuc', renk: 'ocre', mevsim: 'yaz' },
  { id: 'ekmek', ad: 'Ekşi mayalı ekmek', not: '24 saat mayalanır, taş fırın', fiyat: 55, simge: 'ekmek', renk: 'ocre', mevsim: 'her' },
  { id: 'bal', ad: 'Çiçek balı', not: 'süzme, yaylada, kışlık', fiyat: 210, simge: 'bal', renk: 'ocre', mevsim: 'kis' },
  { id: 'zeytin', ad: 'Ayvalık zeytini', not: 'salamura, ilk hasat', fiyat: 120, simge: 'zeytin', renk: 'yesil', mevsim: 'kis' },
  { id: 'nane', ad: 'Taze nane demeti', not: 'sabah toplandı, öğlen sofrada', fiyat: 18, simge: 'yaprak', renk: 'yesil', mevsim: 'yaz' },
]

export const MAKALE = {
  baslik: 'Sessizliğin rengi',
  ustyazi: 'Denemeler',
  yazar: 'Defne Aksoy',
  tarih: '3 Ekim',
  sure: '5 dk okuma',
  paragraflar: [
    'Sabah pencereyi açtığımda ilk gördüğüm şey, kapı eşiğine düşmüş bir yaprak oldu. Yeşil değildi, sarı da değil; ikisinin arasında, henüz karar vermemiş bir renkti. Suluboyada en zor şey de budur: rengi seçmek değil, ona ne kadar su katacağını bilmek.',
    'Bir zamanlar her şeyi net çizgilerle anlatmaya çalışırdım. Sonra fark ettim ki bazı duygular kenarsızdır. Hüzün kâğıda değdiğinde önce yayılır, sonra kenarında birikir, en sonunda kurur ve bir iz bırakır. Okumak da böyledir: cümle bittikten sonra bile sayfada bir leke kalır.',
    'Bu yüzden yazıyı düz bir zemine koydum. Renk çevrede, kelime ortada. Kâğıdın tanesi metnin arkasından görünmüyor, boya da harflerin üstüne binmiyor. Göz dinlenince akış kendiliğinden geliyor.',
  ],
  alinti: 'Rengi seçmek kolay; ona ne kadar su katacağını bilmek zor olan.',
  dipnot: 'Suluboyada "backrun", nemli bir bölgeye sonradan eklenen suyun pigmenti dışa itmesiyle oluşan çiçek biçimli lekedir.',
}
