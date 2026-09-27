import { useEffect, useState } from 'react'
import { Box, Btn, Pane, Progress, Radios, ScrollX, Typewriter } from '../components/ui'
import { hareketKapali, useTerm, type HareketPref } from '../lib/store'
import { useInViewOnce } from '../hooks/useInViewOnce'

const METIN = 'bağlanılıyor: 10.0.0.12:22\nanahtar doğrulandı (ed25519)\nhoş geldiniz, deniz. son giriş: bugün 09:14'

function useAdim(calis: boolean, tur: number, adim = 5, ms = 160) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!calis) return
    if (hareketKapali()) {
      setV(100)
      return
    }
    setV(0)
    const t = window.setInterval(() => setV((x) => (x >= 100 ? 100 : x + adim)), ms)
    return () => window.clearInterval(t)
  }, [calis, tur, adim, ms])
  return v
}

/** Madde 16 · 17 */
export function Motion() {
  const s = useTerm()
  const [ref, gordu] = useInViewOnce<HTMLDivElement>()
  const [tur, setTur] = useState(0)
  const a = useAdim(gordu, tur, 5, 150)
  const b = useAdim(gordu, tur, 10, 380)
  const c = useAdim(gordu, tur, 25, 700)
  const yeniden = () => setTur((t) => t + 1)

  return (
    <Pane id="hareket" no="09" title="hareket ve mobil" lede="Üç hareket: daktilo, kesik kesik dolan çubuk ve yanıp sönen imleç. Hiçbiri yumuşak geçiş kullanmaz; her şey adım adım. Mobilde metin kırılmaz, taşan satırlar yatayda kaydırılır.">
      <div ref={ref} className="grid gap-x-4 gap-y-[2lh] lg:grid-cols-3">
        <Box title="daktilo" right="38 kr/sn">
          <pre className="ascii min-h-[3lh]">{gordu ? <Typewriter key={tur} text={METIN} cps={38} /> : null}</pre>
          <Btn prefix=">" className="mt-[0.5lh]" onClick={yeniden}>
            yeniden yaz
          </Btn>
        </Box>
        <Box title="adımlı çubuk" right="%5 · %10 · %25">
          <Progress value={a} label="İndirme, yüzde 5 adımla" width={20} />
          <Progress value={b} label="Derleme, yüzde 10 adımla" width={20} />
          <Progress value={c} label="Dağıtım, yüzde 25 adımla" width={20} />
          <p className="ascii mt-[0.5lh]">
            <span className="spin" aria-hidden="true" /> {a < 100 ? 'çalışıyor' : 'bitti'}
          </p>
          <Btn prefix=">" className="mt-[0.5lh]" onClick={yeniden}>
            yeniden başlat
          </Btn>
        </Box>
        <Box title="imleç" right="1 Hz">
          <p className="ascii">
            blok     <span className="cursor" aria-hidden="true" />
          </p>
          <p className="ascii">
            alt çizgi <span className="cursor-line" aria-hidden="true" />
          </p>
          <p className="ascii">
            çubuk    <span className="cursor-bar" aria-hidden="true" />
          </p>
          <p className="mt-[0.5lh] text-dim">Saniyede bir yanıp söner (saniyede 3'ün çok altında). Hareket kapalıyken sabit durur.</p>
        </Box>
      </div>

      <div className="mt-[2lh] grid gap-x-4 gap-y-[2lh] lg:grid-cols-2">
        <Box title="hareket tercihi">
          <Radios<HareketPref>
            legend="Hareket"
            hideLegend
            name="hareket"
            row
            value={s.hareketPref}
            options={[
              { id: 'oto', ad: 'otomatik' },
              { id: 'acik', ad: 'açık' },
              { id: 'kapali', ad: 'kapalı' },
            ]}
            onChange={s.setHareketPref}
          />
          <p className="mt-[0.5lh]">
            şu an: <span className="text-hi">{s.hareket === 'acik' ? 'açık' : 'kapalı'}</span>
            <span className="text-dim">{s.hareketPref === 'oto' ? ' · sistemin "hareketi azalt" tercihini izler' : ' · elle seçildi'}</span>
          </p>
          <p className="mt-[0.5lh] text-dim">Kapalıyken: daktilo metni hemen yazar, imleç sabit, döndürücü durur, çubuklar doğrudan sonuca gider. Canlı veri güncellemesi sürer; sunucu ızgarasında ayrıca durdurulabilir.</p>
        </Box>
        <Box title="mobil: yatay kaydırma" right="madde 17">
          <p>Dar ekranda metin kırılırsa sütunlar kayar ve tablo bozulur. Bunun yerine her geniş blok kendi kaydırma alanında durur: odaklanabilir, adı ekran okuyucuya söylenir.</p>
          <ScrollX label="Geniş örnek satır" className="mt-[0.5lh] border border-dashed border-line">
            <pre className="ascii px-1">
              {'PID   KULLANICI  %CPU  %BEL  KOMUT\n'}
              {'4121  postgres   63,2  84,1  postgres: checkpointer process --max-wal-size=16GB --shared-buffers=16GB\n'}
              {'4388  www-data   34,0   9,6  nginx: worker process (conn=1024 keepalive=65s upstream=api-01,api-02)'}
            </pre>
          </ScrollX>
          <p className="mt-[0.5lh] text-dim">14px yazıda 390px ekrana yaklaşık 43 karakter sığar; masaüstü 120 karakterlik satırdır.</p>
        </Box>
      </div>
    </Pane>
  )
}
