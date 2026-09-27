import { Pane, Typewriter } from '../components/ui'
import { PROJELER, YAZILAR } from '../lib/data'
import { dots, pad } from '../lib/ascii'
import { useInViewOnce } from '../hooks/useInViewOnce'

/** Yazılımcı kişisel sitesi (Madde 10): tüm sayfa bir kabuk oturumu gibi okunur */
export function Personal() {
  const [ref, gordu] = useInViewOnce<HTMLDivElement>()
  return (
    <Pane id="kisisel" no="08" title="kişisel site" lede="Yazılımcı kişisel sitesi için aynı dil: hakkımda metni, proje dizini ve yazı listesi komut çıktısı olarak. Kişi ve içerik kurgusaldır.">
      <div ref={ref} className="max-w-[88ch] border border-line px-2 py-[1lh]">
        <p className="ascii">
          <span className="text-dim">deniz@lab:~$ </span>
          {gordu ? <Typewriter text="whoami" cps={14} className="text-hi" /> : null}
        </p>
        <h3 className="mt-[0.5lh] text-hi">Deniz Aral · sistem mühendisi</h3>
        <p className="max-w-[72ch]">Depolama, ağ ve gözlemlenebilirlik üzerine çalışıyorum. Burada kıyaslama betikleri, VMD ile RAID notları ve metin tabanlı arayüz denemeleri var.</p>

        <p className="ascii mt-[1lh]">
          <span className="text-dim">deniz@lab:~$ </span>
          <span className="text-hi">ls -la ~/projeler</span>
        </p>
        <div className="scroll-x" role="region" aria-label="Projeler" tabIndex={0}>
          <table className="ascii border-collapse">
            <caption className="sr-only">Projeler dizini</caption>
            <thead className="sr-only">
              <tr>
                <th>izinler</th>
                <th>boyut</th>
                <th>tarih</th>
                <th>ad</th>
                <th>açıklama</th>
              </tr>
            </thead>
            <tbody>
              {PROJELER.map((p) => (
                <tr key={p.ad}>
                  <td className="p-0 pr-1 text-dim">{p.izin}</td>
                  <td className="p-0 pr-1 text-right">{pad(p.boyut, 5, 'right')}</td>
                  <td className="p-0 pr-1 text-dim">{p.tarih}</td>
                  <td className={p.ad.endsWith('/') ? 'p-0 pr-2 font-bold text-hi' : 'p-0 pr-2 text-hi'}>{p.ad}</td>
                  <td className="p-0 text-dim"># {p.aciklama}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="ascii mt-[1lh]">
          <span className="text-dim">deniz@lab:~$ </span>
          <span className="text-hi">cat yazilar.log</span>
        </p>
        <ul className="scroll-x" aria-label="Yazılar">
          {YAZILAR.map((y) => (
            <li key={y.baslik} className="ascii">
              <span className="text-dim">{y.tarih}</span> {dots(y.baslik, y.sure, 60)}
            </li>
          ))}
        </ul>

        <p className="ascii mt-[1lh]">
          <span className="text-dim">deniz@lab:~$ </span>
          <span className="text-hi">cat iletisim</span>
        </p>
        <p className="flex flex-wrap gap-x-2">
          <a href="https://github.com/senozlu53/webdetest" className="font-bold underline underline-offset-4 hover:bg-sel-bg hover:text-sel-fg">
            [kaynak kod]
          </a>
          <span className="text-dim">[e-posta] [cv.pdf] örnektir</span>
        </p>
        <p className="ascii mt-[1lh]">
          <span className="text-dim">deniz@lab:~$ </span>
          <span className="cursor" aria-hidden="true" />
        </p>
      </div>
    </Pane>
  )
}
