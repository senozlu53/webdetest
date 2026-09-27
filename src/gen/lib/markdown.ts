// Akış dostu küçük Markdown ayrıştırıcı: yarım gelen metni de (kapanmamış kod bloğu, yarım tablo satırı,
// eşi gelmemiş ** işareti) bozulmadan ayrıştırır. Çıktı semantik HTML'e çevrilecek bir AST'dir (Madde 18).

export type Inline =
  | { t: 'text'; s: string }
  | { t: 'b'; c: Inline[] }
  | { t: 'i'; c: Inline[] }
  | { t: 'code'; s: string }
  | { t: 'cite'; n: number }
  | { t: 'a'; href: string; c: Inline[] }

export type Block =
  | { t: 'h'; level: number; c: Inline[] }
  | { t: 'p'; c: Inline[] }
  | { t: 'ul' | 'ol'; items: Inline[][] }
  | { t: 'code'; lang: string; text: string; open: boolean }
  | { t: 'table'; head: Inline[][]; align: ('left' | 'right' | 'center')[]; rows: Inline[][][] }
  | { t: 'quote'; c: Inline[] }

/** Satır içi: **kalın**, *italik*, `kod`, [n] atıf, [metin](url). Eşi olmayan işaret metin olarak kalır (sondaysa atılır). */
export function inline(src: string, streaming = false): Inline[] {
  const out: Inline[] = []
  let buf = ''
  const flush = () => {
    if (buf) out.push({ t: 'text', s: buf })
    buf = ''
  }
  let i = 0
  while (i < src.length) {
    const rest = src.slice(i)
    let m: RegExpMatchArray | null
    if (rest.startsWith('**')) {
      const end = src.indexOf('**', i + 2)
      if (end > i + 2) {
        flush()
        out.push({ t: 'b', c: inline(src.slice(i + 2, end)) })
        i = end + 2
        continue
      }
      if (streaming) {
        // Akışta kapanış henüz gelmedi: içeriği kalın göster, işaretleri gizle
        flush()
        out.push({ t: 'b', c: inline(src.slice(i + 2), true) })
        break
      }
    } else if (rest[0] === '*' && rest[1] !== ' ') {
      const end = src.indexOf('*', i + 1)
      if (end > i + 1) {
        flush()
        out.push({ t: 'i', c: inline(src.slice(i + 1, end)) })
        i = end + 1
        continue
      }
    } else if (rest[0] === '`') {
      const end = src.indexOf('`', i + 1)
      if (end > i) {
        flush()
        out.push({ t: 'code', s: src.slice(i + 1, end) })
        i = end + 1
        continue
      }
      if (streaming) {
        flush()
        out.push({ t: 'code', s: src.slice(i + 1) })
        break
      }
    } else if ((m = rest.match(/^\[(\d{1,2})\]/))) {
      flush()
      out.push({ t: 'cite', n: +m[1] })
      i += m[0].length
      continue
    } else if ((m = rest.match(/^\[([^\]]+)\]\(([^)\s]+)\)/))) {
      flush()
      out.push({ t: 'a', href: m[2], c: inline(m[1]) })
      i += m[0].length
      continue
    }
    buf += src[i]
    i++
  }
  flush()
  return out
}

const cells = (line: string) =>
  line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => c.trim())

/** Blok düzeyi. `streaming` true ise son satır yarım sayılır: yarım tablo satırı gösterilmez, açık kod bloğu açık kalır. */
export function parse(md: string, streaming = false): Block[] {
  const lines = md.split('\n')
  const blocks: Block[] = []
  let i = 0
  const lastLine = lines.length - 1
  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim()) {
      i++
      continue
    }
    const fence = line.match(/^```(\w*)/)
    if (fence) {
      const body: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) body.push(lines[i++])
      const open = i >= lines.length
      blocks.push({ t: 'code', lang: fence[1] || 'metin', text: body.join('\n'), open })
      i++
      continue
    }
    const h = line.match(/^(#{1,4})\s+(.*)$/)
    if (h) {
      blocks.push({ t: 'h', level: h[1].length, c: inline(h[2], streaming && i === lastLine) })
      i++
      continue
    }
    if (line.startsWith('>')) {
      const body: string[] = []
      while (i < lines.length && lines[i].startsWith('>')) body.push(lines[i++].replace(/^>\s?/, ''))
      blocks.push({ t: 'quote', c: inline(body.join(' '), streaming && i > lastLine) })
      continue
    }
    if (/^\s*\|/.test(line)) {
      const rows: string[] = []
      while (i < lines.length && /^\s*\|/.test(lines[i])) {
        // Akışta son satır henüz bitmemiş olabilir
        if (!(streaming && i === lastLine)) rows.push(lines[i])
        i++
      }
      if (rows.length) {
        const head = cells(rows[0])
        const sep = rows[1] && /^[\s|:-]+$/.test(rows[1]) ? cells(rows[1]) : null
        const align = head.map((_, k) => {
          const s = sep?.[k] ?? ''
          return s.startsWith(':') && s.endsWith(':') ? 'center' : s.endsWith(':') ? 'right' : 'left'
        }) as ('left' | 'right' | 'center')[]
        const body = rows.slice(sep ? 2 : 1).map((r) => cells(r).map((c) => inline(c)))
        blocks.push({ t: 'table', head: head.map((c) => inline(c)), align, rows: body })
      }
      continue
    }
    const ul = line.match(/^[-*]\s+(.*)$/)
    const ol = line.match(/^\d+\.\s+(.*)$/)
    if (ul || ol) {
      const kind = ul ? 'ul' : 'ol'
      const items: Inline[][] = []
      while (i < lines.length) {
        const m = kind === 'ul' ? lines[i].match(/^[-*]\s+(.*)$/) : lines[i].match(/^\d+\.\s+(.*)$/)
        if (!m) break
        items.push(inline(m[1], streaming && i === lastLine))
        i++
      }
      blocks.push({ t: kind, items })
      continue
    }
    // Paragraf: boş satıra ya da başka bir blok başlangıcına kadar
    const body: string[] = []
    while (i < lines.length && lines[i].trim() && !/^(```|#{1,4}\s|>|\s*\||[-*]\s|\d+\.\s)/.test(lines[i])) body.push(lines[i++])
    blocks.push({ t: 'p', c: inline(body.join('\n'), streaming && i > lastLine) })
  }
  return blocks
}

/** Kelime kelime akış için parçalama: kelime + ardından gelen boşluk bir token */
export function tokens(md: string) {
  return md.match(/\S+\s*|\s+/g) ?? []
}
