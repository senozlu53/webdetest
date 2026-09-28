import type { Parca } from './data'

/**
 * Madde 10: müzik platformu için küçük bir WebAudio sentezleyici. Kare dalga arpej + sinüs vuruş.
 * Ses yalnız kullanıcı "çal"a basınca başlar; hiçbir dosya indirilmez.
 */
export class Synth {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private timer = 0
  private step = 0
  private next = 0
  private parca: Parca | null = null
  private vol = 0.5

  get hazir() {
    return typeof window !== 'undefined' && 'AudioContext' in window
  }

  baslat(p: Parca) {
    if (!this.hazir) return
    if (!this.ctx) {
      this.ctx = new AudioContext()
      this.master = this.ctx.createGain()
      this.master.connect(this.ctx.destination)
    }
    void this.ctx.resume()
    this.parca = p
    this.setVol(this.vol)
    this.step = 0
    this.next = this.ctx.currentTime + 0.05
    window.clearInterval(this.timer)
    this.timer = window.setInterval(() => this.planla(), 25)
  }

  durdur() {
    window.clearInterval(this.timer)
    this.timer = 0
    void this.ctx?.suspend()
  }

  setVol(v: number) {
    this.vol = v
    if (this.master && this.ctx) this.master.gain.setTargetAtTime(v * 0.14, this.ctx.currentTime, 0.02)
  }

  private planla() {
    const ctx = this.ctx
    const p = this.parca
    if (!ctx || !p || !this.master) return
    const adim = 60 / p.bpm / 2
    while (this.next < ctx.currentTime + 0.12) {
      const n = p.notalar[this.step % p.notalar.length]
      this.nota(220 * 2 ** (n / 12), this.next, adim * 0.9, 'square', 0.35)
      if (this.step % 4 === 0) this.nota(55, this.next, 0.18, 'sine', 1)
      this.next += adim
      this.step++
    }
  }

  private nota(f: number, t: number, d: number, tip: OscillatorType, g: number) {
    const ctx = this.ctx!
    const o = ctx.createOscillator()
    const e = ctx.createGain()
    o.type = tip
    o.frequency.setValueAtTime(f, t)
    if (tip === 'sine') o.frequency.exponentialRampToValueAtTime(30, t + d)
    e.gain.setValueAtTime(0.0001, t)
    e.gain.exponentialRampToValueAtTime(g, t + 0.01)
    e.gain.exponentialRampToValueAtTime(0.0001, t + d)
    o.connect(e).connect(this.master!)
    o.start(t)
    o.stop(t + d + 0.02)
  }
}
