/** Madde 10: Gen-Z e-ticaret tanıtımı. Ürünler kurgudur. */
export type Cat = 'giyim' | 'aksesuar'
export type Shape = 'kapsonlu' | 'corap' | 'sapka' | 'tisort' | 'canta' | 'gozluk'
export interface Product {
  id: string
  ad: string
  cat: Cat
  fiyat: number
  eski?: number
  renk: 'yellow' | 'red' | 'blue' | 'green' | 'pink'
  shape: Shape
  etiket?: string
}
export const PRODUCTS: Product[] = [
  { id: 'kapsonlu', ad: 'Sert Kapşonlu', cat: 'giyim', fiyat: 1299, renk: 'yellow', shape: 'kapsonlu', etiket: 'Yeni' },
  { id: 'corap', ad: 'Kalın Çorap ×3', cat: 'aksesuar', fiyat: 199, eski: 249, renk: 'pink', shape: 'corap', etiket: '%20' },
  { id: 'sapka', ad: 'Kontur Şapka', cat: 'aksesuar', fiyat: 399, renk: 'blue', shape: 'sapka' },
  { id: 'tisort', ad: 'Ham Tişört', cat: 'giyim', fiyat: 549, renk: 'green', shape: 'tisort', etiket: 'Çok satan' },
  { id: 'canta', ad: 'Blok Çanta', cat: 'aksesuar', fiyat: 719, eski: 899, renk: 'red', shape: 'canta', etiket: '%20' },
  { id: 'gozluk', ad: 'Ofset Gözlük', cat: 'aksesuar', fiyat: 699, renk: 'yellow', shape: 'gozluk' },
]
export const product = (id: string) => PRODUCTS.find((p) => p.id === id)!

const nf = new Intl.NumberFormat('tr-TR')
/** ₺ işareti Archivo'nun Latin Genişletilmiş alt kümesinde; fiyatlar bu yüzden display yazıyla */
export const tl = (n: number) => `₺${nf.format(n)}`
export const num = (n: number, d = 0) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: d, maximumFractionDigits: d }).format(n)
