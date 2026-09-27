/** Shape/PolygonMask varyantları (Madde 12 · 13 · 15). Noktalar %5'lik ızgaraya kilitlidir. */
export type Pt = [number, number]
export const MASKS: Record<string, { name: string; points: Pt[] }> = {
  kristal: { name: 'Kristal', points: [[50, 0], [100, 30], [80, 100], [20, 100], [0, 30]] },
  kalkan: { name: 'Kalkan', points: [[0, 0], [100, 0], [100, 60], [50, 100], [0, 60]] },
  kirik: { name: 'Kırık', points: [[0, 10], [40, 0], [100, 15], [90, 100], [25, 90], [5, 70]] },
  ok: { name: 'Ok', points: [[0, 15], [70, 15], [70, 0], [100, 50], [70, 100], [70, 85], [0, 85]] },
  bayrak: { name: 'Bayrak', points: [[0, 0], [100, 0], [85, 50], [100, 100], [0, 100]] },
}
export const toPolygon = (pts: Pt[]) => `polygon(${pts.map(([x, y]) => `${x}% ${y}%`).join(', ')})`
export const snap = (v: number, step = 5) => Math.min(100, Math.max(0, Math.round(v / step) * step))

/** Origami ikonları: her üçgenin gölge sırası (0 aydınlık, 1 orta, 2 karanlık); görünüm kutusu 48 × 48 */
export type Fold = [string, 0 | 1 | 2]
export const ORIGAMI: Record<string, { name: string; folds: Fold[] }> = {
  ucak: {
    name: 'Kağıt uçak',
    folds: [
      ['4,22 44,6 20,28', 0],
      ['20,28 44,6 26,40', 1],
      ['20,28 26,40 17,34', 2],
    ],
  },
  kristal: {
    name: 'Kristal',
    folds: [
      ['18,8 30,8 24,18', 0],
      ['10,18 18,8 24,18', 1],
      ['24,18 30,8 38,18', 0],
      ['10,18 24,18 24,42', 1],
      ['24,18 38,18 24,42', 2],
    ],
  },
  dag: {
    name: 'Dağ',
    folds: [
      ['4,40 20,12 18,40', 0],
      ['18,40 20,12 29,40', 2],
      ['24,40 32,20 33,40', 1],
      ['33,40 32,20 44,40', 2],
      ['16,19 20,12 21,21', 0],
    ],
  },
  tilki: {
    name: 'Tilki',
    folds: [
      ['8,8 18,18 10,24', 1],
      ['40,8 30,18 38,24', 2],
      ['10,24 18,18 24,22', 0],
      ['24,22 30,18 38,24', 1],
      ['10,24 24,22 24,40', 0],
      ['24,22 38,24 24,40', 2],
      ['21,36 27,36 24,41', 2],
    ],
  },
  yaprak: {
    name: 'Yaprak',
    folds: [
      ['24,4 8,24 24,24', 0],
      ['8,24 24,44 24,24', 1],
      ['24,4 24,24 40,20', 1],
      ['24,24 24,44 40,20', 2],
    ],
  },
  kalp: {
    name: 'Kalp',
    folds: [
      ['6,16 15,7 24,14', 0],
      ['6,16 24,14 24,42', 1],
      ['24,14 33,7 42,16', 1],
      ['24,14 42,16 24,42', 2],
    ],
  },
}
