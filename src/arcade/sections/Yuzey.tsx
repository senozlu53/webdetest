import { useEffect, useRef, useState } from 'react'
import { useArcade } from '../lib/store'
import { zit } from '../lib/contrast'
import { PALET, SPRITE, SPRITE_AD, renkSayisi, type PaletKod, type SpriteAd } from '../lib/sprites'
import { cx } from '../../shared/cx'
import { ArcadeText } from '../components/ArcadeText'
import { PixelContainer } from '../components/PixelContainer'
import { Sprite } from '../components/Sprite'
import { Anahtar, Kod, Section } from '../components/ui'

/** 8×8 "A" (Press Start 2P'ye benzer) büyüteç için */
const HARF = ['..####..', '.##..##.', '##....##', '##....##', '########', '##....##', '##....##', '........']
const RENK: [number, number, number][] = [
  [255, 234, 0],
  [0, 255, 0],
  [255, 0, 0],
]

/** Madde 8: tarama çizgisi, fosfor maskesi, renk sapması. Büyüteç: tek bir harfin tüpte nasıl göründüğü */
export function Doku() {
  const s = useArcade()
  const ref = useRef<HTMLCanvasElement>(null)
  const [tarama, setTarama] = useState(true)
  const [maske, setMaske] = useState(true)
  const [sapma, setSapma] = useState(true)
  const [renk, setRenk] = useState(0)
  useEffect(() => {
    const cv = ref.current
    const ctx = cv?.getContext('2d')
    if (!cv || !ctx) return
    const P = 12
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, cv.width, cv.height)
    const [R, G, B] = RENK[renk]
    const dolu = (x: number, y: number) => x >= 0 && x < 8 && y >= 0 && y < 8 && HARF[y][x] === '#'
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 12; x++) {
        const hx = x - 2
        const hy = y - 1
        // Renk sapması: kırmızı ışın bir piksel sola, mavi-yeşil bir piksel sağa kayar
        const r = (sapma ? dolu(hx + 1, hy) : dolu(hx, hy)) ? R : 0
        const g = dolu(hx, hy) ? G : 0
        const b = (sapma ? dolu(hx - 1, hy) : dolu(hx, hy)) ? B || 90 : 0
        const px = x * P
        const py = y * P
        if (maske) {
          // Aperture grille: her piksel üç dikey fosfor şeridi
          ctx.fillStyle = `rgb(${r},0,0)`
          ctx.fillRect(px, py, 4, P)
          ctx.fillStyle = `rgb(0,${g},0)`
          ctx.fillRect(px + 4, py, 4, P)
          ctx.fillStyle = `rgb(0,0,${b})`
          ctx.fillRect(px + 8, py, 4, P)
        } else {
          ctx.fillStyle = `rgb(${r},${g},${b})`
          ctx.fillRect(px, py, P, P)
        }
        if (tarama) {
          ctx.fillStyle = '#000'
          ctx.fillRect(px, py + P - 4, P, 4)
        }
      }
    }
  }, [tarama, maske, sapma, renk])
  return (
    <Section id="doku" madde="Madde 8 · Doku ve yüzey" title="Tüpün dokusu" ton="camgobegi" lead="Sayfanın üstünde üç katman durur: yatay tarama çizgileri, yukarıdan aşağı yavaşça kayan yenileme bandı ve kare kare değişen gren. Büyüteç tek bir harfi tüpün içinden gösterir.">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <PixelContainer ton="camgobegi" className="min-w-0 p-5">
          <ArcadeText as="h3" boyut="s" ton="camgobegi">
            Büyüteç · 12x
          </ArcadeText>
          <canvas ref={ref} width={144} height={120} className="mt-5 block aspect-[144/120] w-full max-w-[calc(var(--u)*144)] bg-[#000]" role="img" aria-label={`Büyütülmüş A harfi: tarama çizgisi ${tarama ? 'açık' : 'kapalı'}, fosfor maskesi ${maske ? 'açık' : 'kapalı'}, renk sapması ${sapma ? 'açık' : 'kapalı'}`} />
          <div className="mt-5 flex flex-wrap gap-3" role="group" aria-label="Harf rengi">
            {['Sarı', 'Yeşil', 'Kırmızı'].map((ad, i) => (
              <button key={ad} type="button" className="pbtn" data-boy="k" data-ton={(['sari', 'yesil', 'kirmizi'] as const)[i]} aria-pressed={renk === i} onClick={() => setRenk(i)}>
                {ad}
              </button>
            ))}
          </div>
        </PixelContainer>
        <PixelContainer className="min-w-0 p-5">
          <div className="grid gap-6">
            <Anahtar label="Tarama çizgisi" hint="Her satırın altı karanlık: elektron ışını satır satır çizer." checked={tarama} onChange={setTarama} />
            <Anahtar label="Fosfor maskesi" hint="Her piksel kırmızı, yeşil, mavi üç şerit. Uzaktan tek renk görünür." checked={maske} onChange={setMaske} />
            <Anahtar label="Renk sapması" hint="Kırmızı ışın sola, mavi ışın sağa kayık: harfin iki yanında renkli saçak." checked={sapma} onChange={setSapma} />
            <hr className="m-0 h-[var(--u)] border-0 bg-[var(--lo-white)]" />
            <Anahtar label="Sayfadaki CRT katmanı" hint={s.theme === 'light' ? 'Kılavuz temasında katman yok: kâğıtta tarama çizgisi olmaz.' : 'Bütün sayfaya uygulanır; okumayı zorlarsa kapatın.'} checked={s.crt} onChange={s.setCrt} />
          </div>
        </PixelContainer>
      </div>
      <div className="mt-8">
        <Kod label="Effects/CRTScanline CSS">{`/* Effects/CRTScanline: her sanal pikselin son satırı %34 siyah */
.crt::before {
  background: repeating-linear-gradient(to bottom,
    transparent 0, transparent calc(var(--u) - 1px),
    rgb(0 0 0 / .34) calc(var(--u) - 1px), rgb(0 0 0 / .34) var(--u));
}
/* Noise Layer: 4 karelik gren şeridi, steps(4) ile kare kare */
.crt > i { background-image: var(--gren); animation: gren .4s steps(4) infinite; }
/* Saydamlık yalnız bu katmanda; yüzey ve gölge opak */`}</Kod>
      </div>
    </Section>
  )
}

const SIRA: SpriteAd[] = ['kalp', 'kilic', 'kalkan', 'iksir', 'mana', 'anahtar', 'mucevher', 'kafatasi', 'yildiz', 'sandik', 'kupa', 'kol', 'jeton1', 'kahramanA', 'balcikA']

/** Madde 9: 16×16 sprite sayfası. Seçilen sprite ızgarayla büyür, veri biçimi yanında */
export function Ikonlar() {
  const [sec, setSec] = useState<SpriteAd>('kupa')
  const [izgara, setIzgara] = useState(true)
  const satir = SPRITE[sec]
  return (
    <Section id="ikon" madde="Madde 9 · İkonografi" title="Sprite sayfası" ton="sari" lead="Her ikon 16×16 piksellik bir sprite. Çizim metin olarak saklanır: her harf paletteki bir renk, nokta saydam. Tarayıcı 1x PNG'ye basar ve en yakın komşu ile büyütür.">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <PixelContainer className="min-w-0 p-5">
          <ul className="m-0 grid list-none grid-cols-3 gap-3 p-0 sm:grid-cols-5" aria-label="Sprite'lar">
            {SIRA.map((ad) => (
              <li key={ad} className="min-w-0">
                <button type="button" aria-pressed={sec === ad} onClick={() => setSec(ad)} className={cx('grid w-full justify-items-center gap-1 p-2', sec === ad ? 'px [--e:var(--yellow)]' : 'm-[var(--u)]')} data-golge="0">
                  <Sprite ad={ad} buyukluk={2} />
                  <span className="max-w-full truncate text-body">{SPRITE_AD[ad]}</span>
                </button>
              </li>
            ))}
          </ul>
        </PixelContainer>
        <PixelContainer ton="sari" className="min-w-0 p-5">
          <div className="flex flex-wrap items-start gap-6">
            <div className="relative shrink-0 dama" aria-hidden="true">
              <Sprite ad={sec} buyukluk={4} className="block" />
              {izgara ? <span className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right, var(--lo-white) 1px, transparent 1px), linear-gradient(to bottom, var(--lo-white) 1px, transparent 1px)', backgroundSize: 'calc(var(--u) * 4) calc(var(--u) * 4)' }} /> : null}
            </div>
            <div className="min-w-[min(calc(var(--u)*80),100%)] flex-1">
              <ArcadeText as="h3" boyut="s" ton="sari">
                {SPRITE_AD[sec]}
              </ArcadeText>
              <dl className="m-0 mt-3 grid grid-cols-[auto_1fr] gap-x-4 tabnum">
                <dt className="text-muted">Boyut</dt>
                <dd className="m-0">16 × 16</dd>
                <dt className="text-muted">Renk</dt>
                <dd className="m-0">{renkSayisi(sec)} / 16</dd>
                <dt className="text-muted">Şu an</dt>
                <dd className="m-0">4x · her piksel 4 sanal piksel</dd>
              </dl>
              <div className="mt-4">
                <Anahtar label="Piksel ızgarası" checked={izgara} onChange={setIzgara} />
              </div>
            </div>
          </div>
          <pre className="kod mt-5 overflow-x-auto p-0 leading-[1]" tabIndex={0} aria-label={`${SPRITE_AD[sec]} sprite verisi, 16 satır`}>
            {satir.map((r, y) => (
              <span key={y} className="block">
                {[...r].map((ch, x) => (
                  <span key={x} className="inline-block w-[1ch] text-center" style={ch === '.' ? { color: 'var(--muted)' } : { background: PALET[ch as PaletKod], color: zit(PALET[ch as PaletKod]) }}>
                    {ch}
                  </span>
                ))}
              </span>
            ))}
          </pre>
        </PixelContainer>
      </div>
    </Section>
  )
}
