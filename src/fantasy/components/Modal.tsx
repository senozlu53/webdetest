import { Dialog } from 'radix-ui'
import { useRef, type ReactNode } from 'react'
import { useOyun } from '../lib/oyun'
import { useYaldiz } from '../lib/yaldiz'
import { Ikon } from './Ikon'
import { Koseler } from './Suslu'
import { Buton } from './ui'

/**
 * <FantasyModal>: parşömen açılış efektli iletişim kutusu (Madde 11 · 16). Üst ve alt ruloların arasında parşömen ortadan dışarı doğru açılır;
 * kapanırken tersine kapanır. Odak tuzağı, Esc ve dış tıklama Radix Dialog'dan gelir. Hareket kapalıyken anında açılır.
 */
export function FantasyModal({ acik, onAcikDegisti, baslik, aciklama, children }: { acik: boolean; onAcikDegisti: (a: boolean) => void; baslik: string; aciklama: string; children: ReactNode }) {
  // Dialog.Trigger kullanılmadığı için kapanınca odağı açan öğeye kendimiz döndürürüz
  const onceki = useRef<HTMLElement | null>(null)
  return (
    <Dialog.Root open={acik} onOpenChange={onAcikDegisti}>
      <Dialog.Portal>
        <Dialog.Overlay className="modal-perde" data-sessiz="" />
        <Dialog.Content
          className="rulo"
          data-rulo=""
          data-sessiz=""
          onOpenAutoFocus={() => {
            onceki.current = document.activeElement as HTMLElement | null
          }}
          onCloseAutoFocus={(e) => {
            e.preventDefault()
            onceki.current?.focus()
          }}
        >
          <div className="rulo-mil" aria-hidden="true" />
          <div className="rulo-govde panel" data-yuzey="parsomen" data-suslu="">
            <Koseler />
            <Dialog.Title className="t-h2 pr-10">{baslik}</Dialog.Title>
            <Dialog.Description className="mt-2 text-[1.0625rem]">{aciklama}</Dialog.Description>
            {children}
            <Dialog.Close asChild>
              <button type="button" className="rulo-kapat" aria-label="Pencereyi kapat" data-modal-kapat="">
                <span aria-hidden="true">×</span>
              </button>
            </Dialog.Close>
          </div>
          <div className="rulo-mil" aria-hidden="true" />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

/** Sayfadaki tek görev penceresi: Hero, Bileşenler ve Hareket bölümlerinden açılır */
export function GorevModal() {
  const { gorevAcik, setGorevAcik, altinEkle, xpEkle, k } = useOyun()
  const { patlat } = useYaldiz()
  return (
    <FantasyModal acik={gorevAcik} onAcikDegisti={setGorevAcik} baslik="Kadim Çağrı" aciklama="Görev parşömeni: Kül Krallığı'nın sınırından haber var.">
      <div data-gorev="" className="mt-4">
        <p className="text-[1.125rem]">Sınırdaki gözcü kulesinden üç gündür ışık gelmiyor. Krallığın yaşlı bekçisi, senden vadiye inip kulenin durumuna bakmanı istiyor. Yolda ejderha izleri görebilirsin; dikkatli ol.</p>
        <ul className="mt-4 grid gap-2" data-gorev-odul="">
          <li className="flex items-center gap-3">
            <Ikon ad="altin" boy={32} /> <span className="rakam">50 altın</span>
          </li>
          <li className="flex items-center gap-3">
            <Ikon ad="iksir-kan" boy={32} /> <span className="rakam">1 Kan İksiri</span>
          </li>
          <li className="flex items-center gap-3">
            <Ikon ad="mucevher" boy={32} /> <span className="rakam">10 deneyim</span>
          </li>
        </ul>
        <p className="t-alt mt-3">Şu an {k.altin.toLocaleString('tr-TR')} altının var.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Buton
            ton="altin"
            data-gorev-kabul=""
            onClick={(e) => {
              altinEkle(50)
              xpEkle(10)
              const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
              patlat(r.left + r.width / 2, r.top + r.height / 2, 34)
              setGorevAcik(false)
            }}
          >
            Görevi kabul et
          </Buton>
          <Buton ton="yalin" data-gorev-reddet="" onClick={() => setGorevAcik(false)}>
            Şimdi değil
          </Buton>
        </div>
      </div>
    </FantasyModal>
  )
}
