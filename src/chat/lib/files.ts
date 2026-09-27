// Dosya ekleri tarayıcıdan çıkmaz: analiz yerelde yapılır (boyut, tür, görsel ölçüsü, metin satırları, CSV/JSON yapısı).

export type Attachment = { id: string; file: File; url?: string }

export const MAX_FILES = 5
export const MAX_BYTES = 10 * 1024 * 1024

export function fmtSize(n: number) {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toLocaleString('tr-TR', { maximumFractionDigits: 1 })} KB`
  return `${(n / 1024 / 1024).toLocaleString('tr-TR', { maximumFractionDigits: 1 })} MB`
}

const TEXT_EXT = /\.(txt|md|csv|tsv|json|js|jsx|ts|tsx|css|html|xml|yml|yaml|log|py|go|rs|java|c|h|sh|sql|ini|toml)$/i
export const isImage = (f: File) => f.type.startsWith('image/')
export const isText = (f: File) => f.type.startsWith('text/') || f.type === 'application/json' || TEXT_EXT.test(f.name)

export function kind(f: File): 'gorsel' | 'metin' | 'pdf' | 'ses' | 'video' | 'arsiv' | 'diger' {
  if (isImage(f)) return 'gorsel'
  if (isText(f)) return 'metin'
  if (f.type === 'application/pdf' || /\.pdf$/i.test(f.name)) return 'pdf'
  if (f.type.startsWith('audio/')) return 'ses'
  if (f.type.startsWith('video/')) return 'video'
  if (/\.(zip|tar|gz|rar|7z)$/i.test(f.name)) return 'arsiv'
  return 'diger'
}
export const KIND_LABEL: Record<ReturnType<typeof kind>, string> = {
  gorsel: 'görsel',
  metin: 'metin',
  pdf: 'PDF',
  ses: 'ses',
  video: 'video',
  arsiv: 'arşiv',
  diger: 'dosya',
}

/** Eklenecek dosyaları doğrular; kabul edilenler ve reddedilenler için Türkçe gerekçe döner */
export function validate(current: number, files: File[]) {
  const ok: File[] = []
  const errors: string[] = []
  for (const f of files) {
    if (current + ok.length >= MAX_FILES) {
      errors.push(`${f.name}: en fazla ${MAX_FILES} dosya eklenebilir`)
      continue
    }
    if (f.size > MAX_BYTES) {
      errors.push(`${f.name}: ${fmtSize(f.size)}, sınır ${fmtSize(MAX_BYTES)}`)
      continue
    }
    if (f.size === 0) {
      errors.push(`${f.name}: boş dosya`)
      continue
    }
    ok.push(f)
  }
  return { ok, errors }
}

export type Analysis = {
  name: string
  size: number
  kind: ReturnType<typeof kind>
  url?: string
  facts: [string, string][]
  preview?: string
  lang?: string
}

function imageSize(url: string) {
  return new Promise<{ w: number; h: number } | null>((res) => {
    const img = new Image()
    img.onload = () => res({ w: img.naturalWidth, h: img.naturalHeight })
    img.onerror = () => res(null)
    img.src = url
  })
}

export async function analyze(a: Attachment): Promise<Analysis> {
  const f = a.file
  const k = kind(f)
  const out: Analysis = { name: f.name, size: f.size, kind: k, url: a.url, facts: [['Tür', f.type || KIND_LABEL[k]], ['Boyut', fmtSize(f.size)]] }
  if (k === 'gorsel' && a.url) {
    const s = await imageSize(a.url)
    if (s) {
      out.facts.push(['Ölçü', `${s.w} × ${s.h} px`])
      out.facts.push(['Oran', s.w >= s.h ? (s.w / s.h).toFixed(2).replace('.', ',') + ' : 1 (yatay)' : '1 : ' + (s.h / s.w).toFixed(2).replace('.', ',') + ' (dikey)'])
    }
  } else if (k === 'metin' && f.size <= 1024 * 1024) {
    const text = await f.text()
    const lines = text.split(/\r?\n/)
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    out.facts.push(['Satır', lines.length.toLocaleString('tr-TR')])
    out.facts.push(['Kelime', words.toLocaleString('tr-TR')])
    const ext = f.name.split('.').pop()?.toLowerCase() ?? ''
    if (ext === 'csv' || ext === 'tsv') {
      const sep = ext === 'tsv' ? '\t' : lines[0]?.includes(';') ? ';' : ','
      const rows = lines.filter((l) => l.trim())
      out.facts.push(['Tablo', `${Math.max(0, rows.length - 1)} satır × ${rows[0]?.split(sep).length ?? 0} sütun`])
      out.facts.push(['Başlık', rows[0]?.split(sep).slice(0, 6).join(', ') ?? '-'])
    } else if (ext === 'json' || f.type === 'application/json') {
      try {
        const j = JSON.parse(text)
        out.facts.push(['Yapı', Array.isArray(j) ? `dizi, ${j.length} öğe` : `nesne, ${Object.keys(j).length} anahtar`])
        if (!Array.isArray(j) && j && typeof j === 'object') out.facts.push(['Anahtarlar', Object.keys(j).slice(0, 6).join(', ')])
      } catch {
        out.facts.push(['Yapı', 'geçersiz JSON'])
      }
    }
    out.preview = lines.slice(0, 6).join('\n').slice(0, 600)
    out.lang = ext || 'metin'
  } else if (k === 'metin') {
    out.facts.push(['Not', '1 MB üstü metin okunmadı'])
  }
  return out
}
