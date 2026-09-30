import type { IkonAd } from './data'
import type { YuzeyAd } from '../components/GothicCard'

export interface Oyun {
  id: string
  ad: string
  tur: 'Hayatta kalma' | 'Bulmaca' | 'Keşif'
  yil: number
  durum: 'Yakında' | 'Yayında'
  ozet: string
  sure: string
  platform: string
  yuzey: YuzeyAd
  ikon: IkonAd
  boyut: number
}

/** Kurgusal stüdyo: Kuzgun Kapısı Atölyesi. Oyun adları ve künyeler gerçek değildir. */
export const OYUNLAR: Oyun[] = [
  {
    id: 'agit',
    ad: 'Ağıt Manastırı',
    tur: 'Hayatta kalma',
    yil: 2026,
    durum: 'Yakında',
    ozet: 'Terk edilmiş bir manastırda mumla ilerle; ışık söndüğünde onlar seni bulur.',
    sure: '12 saat',
    platform: 'PC · Konsol',
    yuzey: 'tas',
    ikon: 'kilit',
    boyut: 640,
  },
  {
    id: 'kul',
    ad: 'Küllerin Kapısı',
    tur: 'Bulmaca',
    yil: 2024,
    durum: 'Yayında',
    ozet: 'Yanmış bir katedralin mühürlü kapılarını sırayla açan bir bulmaca ve korku oyunu.',
    sure: '8 saat',
    platform: 'PC',
    yuzey: 'demir',
    ikon: 'anahtar',
    boyut: 410,
  },
  {
    id: 'sol',
    ad: 'Solgun Çan',
    tur: 'Keşif',
    yil: 2022,
    durum: 'Yayında',
    ozet: 'Sisli bir vadide çanı çalan yalnız bir kuzgunu izle; her çınlama bir anıyı açar.',
    sure: '5 saat',
    platform: 'PC · Mobil',
    yuzey: 'kadife',
    ikon: 'can',
    boyut: 220,
  },
]

export const KITAPLAR = [
  {
    id: 'avlu',
    ad: 'Avlunun Çanı',
    yazar: 'E. Valcourt',
    bolum: 'Birinci bölüm',
    sayfa: 212,
  },
  {
    id: 'mahzen',
    ad: 'Mahzenin Kapısı',
    yazar: 'E. Valcourt',
    bolum: 'İkinci bölüm',
    sayfa: 187,
  },
  {
    id: 'kuzgun',
    ad: 'Kuzgunun Yemini',
    yazar: 'S. Hartmann',
    bolum: 'Üçüncü bölüm',
    sayfa: 264,
  },
] as const

export const OKUMA_METNI: { baslik: string; paragraflar: string[] }[] = [
  {
    baslik: 'Birinci bölüm · Avlunun çanı',
    paragraflar: [
      'Manastırın demir kapısı, ay doğmadan önce üçüncü kez gıcırdadı. Rahip Emeric fenerini yükseltti; ışık, duvardaki sarmaşığın altında yıllardır kurumuş bir lekeyi buldu ve hemen geri çekildi.',
      '“Buraya kimse gelmedi,” dedi kendi kendine, ama sesi kendisine bile inandırıcı gelmedi.',
      'Avlunun ortasındaki kuyunun başında bir zincir sarkıyordu. Paslıydı; her halkası bir dua kadar ağır, bir yemin kadar soğuktu. Emeric zinciri çekti. Aşağıdan, çok aşağıdan, bir çan yanıt verdi.',
      'Sesi duyan kuzgunlar aynı anda havalandı. Kanat sesleri bir an avluyu doldurdu, sonra sis her şeyi yuttu. Emeric elindeki mumu iki avucunun arasına aldı. Alev titredi, küçüldü, sonra bir nefes gibi toparlandı.',
      '“Işık,” diye mırıldandı, “bu gece yalnız ışık koruyacak beni.”',
    ],
  },
  {
    baslik: 'İkinci bölüm · Mahzenin kapısı',
    paragraflar: [
      'Merdivenler kilisenin altına iniyordu. Her basamakta taş biraz daha nemliydi, hava biraz daha ağırdı. Duvarlardaki mühürler, mumun ışığında bir an kıpırdadı gibi oldu.',
      'En alttaki kapının üzerinde sivri bir kemer, kemerin altında kuru kan renginde bir haç vardı. Kilit yoktu; yalnız kapıyı tutan üç zincir, ve zincirlerin ucunda, sallanan, boş bir kafes.',
      'Emeric elini kapıya dayadı. Ahşap, sanki içeriden biri aynı yere elini dayamış gibi sıcaktı.',
      '“Açma,” dedi bir ses, ve ses ne kadar yakından geldiyse o kadar uzaktan gelmiş gibiydi. “Açma; daha sabah olmadı.”',
    ],
  },
]

export interface GunlukKaydi {
  tarih: string
  baslik: string
  metin: string
  ikon: IkonAd
}
export const GUNLUK: GunlukKaydi[] = [
  {
    tarih: '24 Eylül 2026',
    baslik: 'Mum sistemi yeniden yazıldı',
    metin: 'Alev artık rüzgârdan etkileniyor; koridorda taşırken titriyor, kapı açılınca küçülüyor.',
    ikon: 'mum',
  },
  {
    tarih: '12 Eylül 2026',
    baslik: 'Mahzen haritası tamamlandı',
    metin: 'Üç katlı mahzen, yedi mühürlü kapı ve tek bir çıkış. Yol bulma ipuçları duvar oymalarında.',
    ikon: 'kemer',
  },
  {
    tarih: '29 Ağustos 2026',
    baslik: 'Kuzgun ses tasarımı',
    metin: 'Kanat sesleri artık yalnızca yaklaşırken duyuluyor; uzaktaki kuzgunlar sessiz.',
    ikon: 'kuzgun',
  },
  {
    tarih: '15 Ağustos 2026',
    baslik: 'Kilit bulmacalarının ilk testi',
    metin: 'On iki oyuncu, dört bulmaca; en çok takılan yer zincir kapısı oldu, ipuçları sadeleştirildi.',
    ikon: 'anahtar',
  },
  {
    tarih: '01 Ağustos 2026',
    baslik: 'Kapalı beta davetleri',
    metin: 'Yüz kişilik ilk dalga yarın başlıyor; geri bildirim formu oyunun içinde, kayıt odasında.',
    ikon: 'kitap',
  },
]
