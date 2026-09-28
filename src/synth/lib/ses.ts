/**
 * Madde 10: müzik prodüksiyonu. Küçük bir WebAudio synth: iki testere dişi osilatör (detune), alçak geçiren filtre,
 * zarf, yankı (delay). Arpej adımları 16'lık notalarla çalar; osiloskop için AnalyserNode.
 * Ses yalnız kullanıcı Çal'a basınca başlar.
 */
export interface SynthAyar {
  tempo: number
  kesim: number
  rezonans: number
  detune: number
  yanki: boolean
  dalga: OscillatorType
  adimlar: boolean[]
  notalar: number[]
}

export const NOTA_AD = ['La3', 'Do4', 'Mi4', 'Sol4', 'La4', 'Mi4', 'Re4', 'Do4']
// La minör arpej (Hz): A3 C4 E4 G4 A4 E4 D4 C4
export const NOTA_HZ = [220, 261.63, 329.63, 392, 440, 329.63, 293.66, 261.63]

export class Synth {
  ctx: AudioContext
  analiz: AnalyserNode
  private cikis: GainNode
  private filtre: BiquadFilterNode
  private gecikme: DelayNode
  private geriBesleme: GainNode
  private yankiKazanc: GainNode
  private zaman = 0
  private adim = 0
  private t = 0
  ayar: SynthAyar
  onAdim?: (i: number) => void

  constructor(ayar: SynthAyar) {
    this.ayar = ayar
    this.ctx = new AudioContext()
    this.cikis = this.ctx.createGain()
    this.cikis.gain.value = 0.18
    this.filtre = this.ctx.createBiquadFilter()
    this.filtre.type = 'lowpass'
    this.gecikme = this.ctx.createDelay(1)
    this.geriBesleme = this.ctx.createGain()
    this.yankiKazanc = this.ctx.createGain()
    this.analiz = this.ctx.createAnalyser()
    this.analiz.fftSize = 1024
    this.filtre.connect(this.cikis)
    this.filtre.connect(this.gecikme)
    this.gecikme.connect(this.geriBesleme).connect(this.gecikme)
    this.gecikme.connect(this.yankiKazanc).connect(this.cikis)
    this.cikis.connect(this.analiz).connect(this.ctx.destination)
    this.guncelle(ayar)
  }

  guncelle(a: SynthAyar) {
    this.ayar = a
    const n = this.ctx.currentTime
    this.filtre.frequency.setTargetAtTime(a.kesim, n, 0.02)
    this.filtre.Q.setTargetAtTime(a.rezonans, n, 0.02)
    this.gecikme.delayTime.setTargetAtTime((60 / a.tempo) * 0.75, n, 0.05)
    this.geriBesleme.gain.setTargetAtTime(a.yanki ? 0.38 : 0, n, 0.05)
    this.yankiKazanc.gain.setTargetAtTime(a.yanki ? 0.45 : 0, n, 0.05)
  }

  private nota(hz: number, bas: number, sure: number) {
    const g = this.ctx.createGain()
    g.gain.setValueAtTime(0, bas)
    g.gain.linearRampToValueAtTime(0.5, bas + 0.008)
    g.gain.exponentialRampToValueAtTime(0.001, bas + sure)
    g.connect(this.filtre)
    for (const d of [-this.ayar.detune, this.ayar.detune]) {
      const o = this.ctx.createOscillator()
      o.type = this.ayar.dalga
      o.frequency.value = hz
      o.detune.value = d
      o.connect(g)
      o.start(bas)
      o.stop(bas + sure + 0.02)
    }
  }

  baslat() {
    void this.ctx.resume()
    this.zaman = this.ctx.currentTime + 0.05
    this.adim = 0
    const planla = () => {
      const on6 = 60 / this.ayar.tempo / 2
      while (this.zaman < this.ctx.currentTime + 0.12) {
        const i = this.adim % 8
        if (this.ayar.adimlar[i]) this.nota(this.ayar.notalar[i], this.zaman, on6 * 0.9)
        const gecikme = Math.max(0, (this.zaman - this.ctx.currentTime) * 1000)
        window.setTimeout(() => this.onAdim?.(i), gecikme)
        this.zaman += on6
        this.adim++
      }
    }
    planla()
    this.t = window.setInterval(planla, 25)
  }

  durdur() {
    window.clearInterval(this.t)
    this.onAdim?.(-1)
  }

  kapat() {
    this.durdur()
    void this.ctx.close()
  }
}
