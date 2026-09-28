/** Kurgu içerik: NEON-84 synth, Gece Salonu oyunları, Kaset galerisi, Deniz Neon'un portfolyosu */
export const OYUNLAR: { id: string; ad: string; tur: string; yil: number; oyuncu: number; puan: number; renk: 'pink' | 'cyan' | 'orange'; tohum: number }[] = [
  { id: 'outrun', ad: 'Otoyol 84', tur: 'Yarış', yil: 1984, oyuncu: 1240, puan: 4.8, renk: 'pink', tohum: 84 },
  { id: 'lazer', ad: 'Lazer Körfezi', tur: 'Nişancı', yil: 1986, oyuncu: 860, puan: 4.5, renk: 'cyan', tohum: 12 },
  { id: 'tetris', ad: 'Neon Bloklar', tur: 'Bulmaca', yil: 1985, oyuncu: 2310, puan: 4.9, renk: 'orange', tohum: 7 },
  { id: 'ninja', ad: 'Gece Ninjası', tur: 'Platform', yil: 1987, oyuncu: 540, puan: 4.2, renk: 'pink', tohum: 303 },
  { id: 'uzay', ad: 'Galaksi 2099', tur: 'Nişancı', yil: 1988, oyuncu: 1790, puan: 4.6, renk: 'cyan', tohum: 2099 },
  { id: 'dans', ad: 'Disko Işın', tur: 'Ritim', yil: 1983, oyuncu: 980, puan: 4.4, renk: 'orange', tohum: 55 },
]

export const ESERLER = [
  { id: 1, ad: 'Son Otoyol', sanatci: 'Deniz Neon', tohum: 1984, fiyat: 42 },
  { id: 2, ad: 'Miami Gecesi', sanatci: 'Selin Krom', tohum: 7777, fiyat: 36 },
  { id: 3, ad: 'Kaset Güneşi', sanatci: 'Deniz Neon', tohum: 311, fiyat: 58 },
  { id: 4, ad: 'Palmiye Sinyali', sanatci: 'Kaan VHS', tohum: 2048, fiyat: 27 },
  { id: 5, ad: 'Lazer Ufku', sanatci: 'Selin Krom', tohum: 909, fiyat: 64 },
  { id: 6, ad: 'Mor Saat', sanatci: 'Kaan VHS', tohum: 4242, fiyat: 31 },
]

export const KASETLER = [
  { id: 'a', ad: 'Neon Mahalle', tur: 'Marka kimliği', yil: 2025, sure: '03:12', renk: 'pink' as const, aciklama: 'Bir gece kulübü zinciri için neon tabela sistemi: sekiz tabela, tek kontur kalınlığı, iki renk.' },
  { id: 'b', ad: 'Kaset Kutusu', tur: 'Albüm kapağı', yil: 2024, sure: '04:45', renk: 'cyan' as const, aciklama: 'Synthwave derlemesi için krom logo ve tel kafes manzara; VHS kutusu ve dijital kapak aynı çizimden.' },
  { id: 'c', ad: 'Gün Batımı OS', tur: 'Arayüz', yil: 2024, sure: '02:58', renk: 'orange' as const, aciklama: 'Müzik prodüksiyon eklentisi için arayüz: neon düğmeler, ızgaralı arka plan, osiloskop.' },
  { id: 'd', ad: 'Lazer Afişi', tur: 'Afiş', yil: 2023, sure: '05:20', renk: 'pink' as const, aciklama: 'Açık hava sineması için dört afiş; her birinde başka bir güneş ve aynı ufuk çizgisi.' },
]
