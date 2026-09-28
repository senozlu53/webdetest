/** 8-bit ses: kare dalga, adım adım frekans (kayma yok). Yalnız kullanıcı açarsa ve bir tıklamadan sonra çalar */
let ctx: AudioContext | null = null

const NOTALAR: Record<string, [number, number][]> = {
  jeton: [
    [988, 0.06],
    [1319, 0.18],
  ],
  al: [[1568, 0.05]],
  vur: [
    [220, 0.06],
    [110, 0.12],
  ],
  bitti: [
    [523, 0.12],
    [392, 0.12],
    [330, 0.12],
    [262, 0.3],
  ],
  seviye: [
    [523, 0.08],
    [659, 0.08],
    [784, 0.08],
    [1047, 0.2],
  ],
}

export function bip(ad: keyof typeof NOTALAR) {
  try {
    ctx ??= new AudioContext()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'square'
    g.gain.value = 0.05
    o.connect(g).connect(ctx.destination)
    let t = ctx.currentTime
    for (const [f, s] of NOTALAR[ad]) {
      o.frequency.setValueAtTime(f, t)
      t += s
    }
    g.gain.setValueAtTime(0, t)
    o.start()
    o.stop(t + 0.02)
  } catch {
    /* ses yok: sessiz devam */
  }
}
