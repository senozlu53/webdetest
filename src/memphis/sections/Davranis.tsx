import { useMemo, useState } from 'react'
import { cx } from '../../shared/cx'
import { useMemphis, type Cvd } from '../lib/store'
import { yay } from '../lib/yay'
import { ISLER } from '../lib/data'
import { Ayarlar, CVD_AD } from '../components/Header'
import { MemphisCard } from '../components/MemphisCard'
import { PopButton } from '../components/PopButton'
import { Sekil } from '../components/Shapes'
import { UiIkon } from '../components/Icons'
import { Aralik, Kod, Section } from '../components/ui'

/** Madde 16: yay (spring) eğrisi, CSS linear() ile */
export function Hareket() {
  const s = useMemphis()
  const [sertlik, setSertlik] = useState(500)
  const [sonum, setSonum] = useState(16)
  const [sagda, setSagda] = useState(false)
  const e = useMemo(() => yay(sertlik, sonum), [sertlik, sonum])
  const W = 300
  const H = 150
  const yol = e.noktalar.map((v, i) => `${i ? 'L' : 'M'}${(i / (e.noktalar.length - 1)) * W} ${H - 20 - v * (H - 60)}`).join(' ')
  return (
    <Section id="hareket" madde="Madde 16 · Hareket dili" title="Esnek," vurgu="yaylı" ton="camgobegi" sekil="dalga" lead="Her şey yayla hareket eder: hedefini biraz geçer, geri döner, durur. Eğri sönümlü yay denkleminden örneklenir ve CSS linear() easing'ine yazılır; tarayıcı yayı JavaScript'siz oynatır.">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.618fr]">
        <MemphisCard kimlik="yay-kontrol" ton="beyaz" aci={1} oyuncak={false} className="grid min-w-0 grid-cols-1 content-start gap-5 rounded-[18px] p-6">
          <Aralik label="Sertlik (k)" value={sertlik} min={100} max={900} step={20} onChange={setSertlik} />
          <Aralik label="Sönüm (c)" value={sonum} min={6} max={40} onChange={setSonum} />
          <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-mono text-[14px]" data-yay="">
            <dt className="font-bold">Süre</dt>
            <dd className="m-0">{e.sure} ms</dd>
            <dt className="font-bold">Aşım</dt>
            <dd className="m-0">%{e.asim}</dd>
            <dt className="font-bold">Sönüm oranı</dt>
            <dd className="m-0">{e.sonumOrani.toFixed(2).replace('.', ',')}</dd>
          </dl>
          <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full rounded-[12px] border-[3px] border-ink bg-yellow-50" role="img" aria-label={`Yay eğrisi: %${e.asim} aşım, ${e.sure} milisaniye`}>
            <line x1={0} x2={W} y1={H - 20 - (H - 60)} y2={H - 20 - (H - 60)} stroke="var(--ink)" strokeWidth={2} strokeDasharray="5 5" />
            <path d={yol} fill="none" stroke="var(--ink)" strokeWidth={9} strokeLinejoin="round" strokeLinecap="round" />
            <path d={yol} fill="none" stroke="var(--pink)" strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" />
          </svg>
        </MemphisCard>
        <div className="grid min-w-0 grid-cols-1 content-start gap-8">
          <div className="relative h-[120px] overflow-hidden rounded-[18px] border-[4px] border-ink bg-teal-50 [container-type:inline-size]" data-yay-pist="">
            <div className="absolute top-[24px] left-4" style={{ translate: sagda ? 'calc(100cqw - 100px) 0' : '0 0', transition: s.hareket ? `translate ${e.sure}ms ${e.css}` : 'none' }} data-top="">
              <Sekil tur="daire" ton="pembe" boyut={64} golge />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <PopButton ton="pembe" onClick={() => setSagda(!sagda)} ikon={<UiIkon ad={sagda ? 'geri' : 'ok'} />} data-yay-oynat="">
              {sagda ? 'Geri gönder' : 'Topu gönder'}
            </PopButton>
            <button type="button" className="rounded-[18px] border-[4px] border-ink bg-yellow px-6 py-3 font-extrabold shadow-[5px_5px_0_var(--shadow)] hover:scale-110" style={{ transition: s.hareket ? `scale ${e.sure}ms ${e.css}` : 'none' }}>
              Üstüme gel
            </button>
          </div>
          <Kod label="Yay CSS">{`transition: translate ${e.sure}ms ${e.css.length > 90 ? e.css.slice(0, 86) + ' …)' : e.css};`}</Kod>
          <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2">
            {[
              ['Üstüne gel', 'Düğme ve kartlar yayla %3–7 büyür'],
              ['Bas', 'Gölgeye iner, %6 ezilir, 90 ms'],
              ['Kıpır', 'Şekiller üstüne gelince sağa sola sallanır'],
              ['Konfeti', 'Önemli düğmeler tıklama noktasından saçar'],
            ].map(([a, b]) => (
              <li key={a} className="kipir rounded-[16px] border-[3px] border-ink bg-paper p-3">
                <span className="font-extrabold">{a}:</span> {b}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}

/** Madde 17: düzensiz yerleşim dar kapta dikey yığına döner, kartların eğikliği kalır */
export function Mobil() {
  const [gen, setGen] = useState(900)
  return (
    <Section id="mobil" madde="Madde 17 · Responsive" title="Dağınık masa," vurgu="düzgün yığın" ton="sari" sekil="silindir" lead="Kapsayıcı sorgusu (container query) kutunun kendi genişliğine bakar: 640 pikselin altında kartlar üst üste binmeyi bırakır ve alt alta dizilir. Eğiklik, köşe biçimi ve gölge aynen kalır; yazı hiçbir şeyin altında kalmaz.">
      <Aralik label="Kutu genişliği" value={gen} min={300} max={1100} step={20} onChange={setGen} format={(v) => `${v}px${v < 640 ? ' · yığın' : ' · dağınık'}`} />
      <div className="mt-8 max-w-full overflow-hidden rounded-[18px] border-[4px] border-dashed border-ink bg-yellow-50 p-6" style={{ width: gen }} data-mobil-kap="">
        <div className="@container">
          <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 @min-[640px]:grid-cols-3 @min-[640px]:gap-0">
            {ISLER.slice(0, 3).map((is, i) => (
              <MemphisCard as="li" key={is.id} kimlik={`mob-${is.id}`} ton={is.ton} aci={4} className={cx('relative p-5', i === 0 ? 'rounded-[18px] @min-[640px]:mt-6' : i === 1 ? 'rounded-full text-center @min-[640px]:-ml-3 @min-[640px]:py-10' : 'rounded-[4px_40px_4px_40px] @min-[640px]:-ml-3 @min-[640px]:mt-12')} style={{ zIndex: i + 1 }}>
                <p className="dev text-[26px]">{is.ad}</p>
                <p className="mt-1 font-bold">{is.musteri}</p>
              </MemphisCard>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}

const CVDLER: Cvd[] = ['yok', 'protan', 'deutan', 'tritan', 'akromat']

/** Madde 18: kontrast, renk körlüğü, tek tema */
export function Erisim() {
  const s = useMemphis()
  return (
    <Section id="erisim" madde="Madde 18 · Erişilebilirlik" title="Renk cümbüşü," vurgu="net metin" ton="pembe" sekil="arti" lead="Bu kadar renk renk körü kullanıcıyı zorlayabilir. Bu yüzden metin hep lacivert-beyaz, lacivert-sarı ya da pembe üstünde siyah; renk kodlu her şeyin yanında adı yazar ve istenirse desen de taşır.">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.618fr]">
        <MemphisCard kimlik="erisim-ayar" ton="beyaz" aci={1.5} oyuncak={false} className="min-w-0 rounded-[18px] p-6">
          <p className="dev text-[28px]">Varyantlar</p>
          <div className="mt-5">
            <Ayarlar onek="er-" />
          </div>
        </MemphisCard>
        <div className="grid min-w-0 grid-cols-1 content-start gap-8">
          <div>
            <p className="dev text-[28px]">Renk körlüğü önizlemesi</p>
            <p className="mt-2 max-w-[60ch] text-[16px]">Aynı palet beş görme tipiyle (Machado 2009 matrisleri). Döteranda pembe ile hardal, protanda pembe ile lacivert yaklaşır: renkler ayırt edilmese de yazılar ve şekiller ayrıdır.</p>
          </div>
          <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 xl:grid-cols-3" data-cvd-onizleme="">
            {CVDLER.map((c) => (
              <li key={c} className={cx('rounded-[16px] border-[3px] border-ink bg-paper p-3', s.cvd === c && 'shadow-[4px_4px_0_var(--shadow)]')}>
                <p className="font-extrabold">
                  {CVD_AD[c]}
                  {s.cvd === c ? ' · sayfa şu an bu' : ''}
                </p>
                <div className="mt-2 flex items-center gap-2" style={c === 'yok' ? undefined : { filter: `url(#cvd-${c})` }} aria-hidden="true">
                  <Sekil tur="daire" ton="sari" boyut={40} />
                  <Sekil tur="ucgen" ton="pembe" boyut={40} />
                  <Sekil tur="kare" ton="camgobegi" boyut={40} />
                  <span className="grid size-10 place-items-center rounded-full border-[3px] border-ink bg-ink text-[13px] font-extrabold text-paper">Aa</span>
                </div>
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-[18px] border-[4px] border-ink bg-ink p-5 text-paper">
              <p className="font-extrabold">Neden gece teması yok?</p>
              <div className="mt-4 flex gap-3" aria-hidden="true">
                <span className="rounded-[10px] border-[4px] border-ink bg-ink px-3 py-2 font-bold text-paper shadow-[5px_5px_0_var(--ink)]">Kart</span>
                <span className="rounded-full border-[4px] border-ink bg-yellow px-3 py-2 font-bold text-ink">Düğme</span>
              </div>
              <p className="mt-4 text-[15px]">Koyu zeminde kalın lacivert kontur ve katı gölge kaybolur; stilin iskeleti gider. Memphis yalnız açık temada yaşar (Madde 18).</p>
            </div>
            <ul className="m-0 grid list-none gap-2 rounded-[18px] border-[4px] border-ink bg-paper p-5 text-[15px]">
              <li>
                <span className="font-extrabold">Metin:</span> beyazda 12,08:1, hardalda 8,38:1, pembede saf siyah 5,80:1.
              </li>
              <li>
                <span className="font-extrabold">Desen:</span> noktalar hiçbir zaman yazının arkasına girmez.
              </li>
              <li>
                <span className="font-extrabold">Hareket:</span> sistemde azaltma açıksa yay, süzülme ve konfeti kapalı başlar.
              </li>
              <li>
                <span className="font-extrabold">Odak:</span> 4 piksel siyah çerçeve, 4 piksel dışarıda.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Section>
  )
}
