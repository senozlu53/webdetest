import type { ComponentType, ReactNode } from 'react'
import {
  BellIcon,
  CheckCircleIcon,
  GearIcon,
  HouseIcon,
  PaletteIcon,
  ReceiptIcon,
  UserPlusIcon,
  WarningCircleIcon,
  type IconProps,
} from '@phosphor-icons/react'
import tokens from '../../../tokens/corporate.tokens.json'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Checkbox } from '../ui/checkbox'
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '../ui/form'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { cn } from '../lib/utils'

const SCALES = tokens.Color.Scale
const SEMANTIC = tokens.Color.Semantic
type ScaleName = keyof typeof SCALES

/** Kullanımda olan skala adımları: hangi token hangi adımı kullanıyor */
const USED: Partial<Record<string, string>> = {
  'Slate-50': 'Zemin',
  'Slate-200': 'Kenar',
  'Slate-500': 'Input',
  'Slate-600': 'İkincil',
  'Slate-900': 'Metin',
  'Blue-600': 'Marka',
  'Blue-800': 'Eylem',
  'Green-800': 'Başarı',
  'Red-800': 'Hata',
}

const SECTIONS = [
  { id: 'ds-renk', label: 'Renk skalaları' },
  { id: 'ds-semantik', label: 'Semantik tokenlar' },
  { id: 'ds-tipografi', label: 'Tipografi' },
  { id: 'ds-sekil', label: 'Şekil ve gölge' },
  { id: 'ds-ikon', label: 'İkonografi' },
  { id: 'ds-durum', label: 'Bileşen durumları' },
  { id: 'ds-hareket', label: 'Hareket' },
  { id: 'ds-erisim', label: 'Erişilebilirlik' },
  { id: 'ds-kod', label: 'Kod' },
] as const

function Section({ id, item, title, description, children }: { id: string; item: string; title: string; description: ReactNode; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-24">
      <div className="mb-4 flex flex-col gap-1">
        <p className="text-xs font-semibold text-muted-foreground tabular-nums">Madde {item}</p>
        <h2 id={`${id}-h`} className="text-xl font-semibold tracking-tight" tabIndex={-1}>
          {title}
        </h2>
        <p className="max-w-[72ch] text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  )
}

const TYPE_SCALE = [
  { cls: 'text-3xl font-semibold tracking-tight', size: '30 / 36', use: 'Sayfa başlığı, KPI değeri' },
  { cls: 'text-2xl font-semibold tracking-tight', size: '24 / 32', use: 'Bölüm başlığı' },
  { cls: 'text-xl font-semibold', size: '20 / 28', use: 'Kart grubu başlığı' },
  { cls: 'text-base font-semibold', size: '16 / 24', use: 'Kart başlığı' },
  { cls: 'text-sm', size: '14 / 21', use: 'Gövde, tablo, form' },
  { cls: 'text-xs font-semibold text-muted-foreground', size: '12 / 18', use: 'Tablo başlığı, rozet' },
] as const

const SHADOWS = [
  { cls: 'shadow-sm', name: 'Shadow/Sm', use: 'Durağan kart' },
  { cls: 'shadow-md', name: 'Shadow/Md', use: 'Hover, açılır menü' },
  { cls: 'shadow-lg', name: 'Shadow/Lg', use: 'Modal, çekmece' },
] as const

const ICON_PAIRS: ReadonlyArray<{ Icon: ComponentType<IconProps>; label: string }> = [
  { Icon: HouseIcon, label: 'Genel bakış' },
  { Icon: ReceiptIcon, label: 'Faturalar' },
  { Icon: UserPlusIcon, label: 'Müşteri ekle' },
  { Icon: PaletteIcon, label: 'Tasarım' },
  { Icon: BellIcon, label: 'Bildirim' },
  { Icon: GearIcon, label: 'Ayarlar' },
]

const AAA = [
  { sc: '1.4.6', name: 'Gelişmiş kontrast', text: 'Metin 7:1, büyük metin 4,5:1. En düşük metin oranı 7,13:1.' },
  { sc: '1.4.11', name: 'Metin dışı kontrast', text: 'Input kenarı, odak çerçevesi ve grafik işaretleri 3:1 üstünde.' },
  { sc: '2.4.13', name: 'Odak görünümü', text: '2px mavi çerçeve, 2px boşlukla; her etkileşimli öğede.' },
  { sc: '2.5.5', name: 'Hedef boyutu', text: 'Düğme, input, menü öğesi, sayfalama ve satır işlemleri en az 44 × 44px.' },
  { sc: '1.4.8', name: 'Görsel sunum', text: 'Satır aralığı 1,5; metin sola dayalı; satır uzunluğu 80 karakterin altında.' },
  { sc: '3.3.6', name: 'Hata önleme', text: 'Müşteri formu kaydetmeden önce özet ve onay adımı gösterir.' },
  { sc: '2.3.3', name: 'Etkileşim animasyonu', text: 'Hareket azaltma açıkken tüm geçişler 1ms.' },
  { sc: '1.4.1', name: 'Rengin kullanımı', text: 'Durumlar ikon + etiketle; grafik lejantı ve tablo görünümü var.' },
] as const

const TAILWIND_SPEC = 'bg-white border border-slate-200 text-slate-900 rounded-md shadow-sm'
const TAILWIND_SEMANTIC = 'bg-card border border-border text-card-foreground rounded-md shadow-sm'
const SHADCN_SNIPPET = `<SidebarProvider>
  <Sidebar label="Ana menü">…</Sidebar>
  <FormItem state="error" message="10 rakam girin.">
    <FormLabel required>Vergi numarası</FormLabel>
    <FormControl><Input /></FormControl>
    <FormMessage />
  </FormItem>
  <DataTable columns={columns} data={invoices} />
</SidebarProvider>`

export function DesignSystem() {
  return (
    <div className="flex flex-col gap-10">
      <Card>
        <CardContent className="flex flex-col gap-4 p-6 md:p-8">
          <div className="flex flex-wrap gap-2">
            <Badge variant="info">Stil 003</Badge>
            <Badge variant="outline" lang="en">
              Flat 2.0 · Enterprise UI
            </Badge>
            <Badge variant="success">
              <CheckCircleIcon weight="fill" aria-hidden="true" />
              WCAG AAA hedefi
            </Badge>
          </div>
          <p className="max-w-[72ch] text-base">
            İş yazılımları ve büyük veri kümeleri için güven veren, erişilebilir, tamamen işleve odaklı kurumsal standart.
            Bu uygulamanın her ekranı aynı tokenlarla dizildi: 5 renk skalası, 14 semantik değişken, 3 yarıçap, 3 gölge ve
            150ms'lik tek bir hareket süresi.
          </p>
          <dl className="grid gap-4 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-muted-foreground">Kategori</dt>
              <dd className="font-medium">Modern / Minimal / Clean</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Kullanım alanı (Madde 10)</dt>
              <dd className="font-medium">SaaS, B2B panel, FinTech, ERP, kurumsal web</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Altyapı (Madde 14)</dt>
              <dd className="font-medium">shadcn/ui · Radix · TanStack Table · Phosphor</dd>
            </div>
          </dl>
          <nav aria-label="Bu sayfada" className="flex flex-wrap gap-1 border-t pt-4">
            {SECTIONS.map((s) => (
              <Button
                key={s.id}
                variant="ghost"
                onClick={() => {
                  const el = document.getElementById(s.id)
                  el?.scrollIntoView({ block: 'start' })
                  document.getElementById(`${s.id}-h`)?.focus({ preventScroll: true })
                }}
              >
                {s.label}
              </Button>
            ))}
          </nav>
        </CardContent>
      </Card>

      <Section id="ds-renk" item="4 · 13" title="Renk skalaları" description="Tailwind Slate, Blue, Green, Amber ve Red; 50'den 950'ye tam skala. Etiketli adımlar semantik tokenların kaynağıdır.">
        <Card>
          <CardContent className="flex flex-col gap-6">
            {(Object.keys(SCALES) as ScaleName[]).map((name) => (
              <div key={name} className="grid gap-2 lg:grid-cols-[88px_1fr] lg:items-start">
                <p className="text-sm font-semibold lg:pt-3" lang="en">
                  {name}
                </p>
                <ul className="grid grid-cols-6 gap-2 sm:grid-cols-11">
                  {Object.entries(SCALES[name]).map(([step, token]) => {
                    const used = USED[`${name}-${step}`]
                    return (
                      <li key={step} className="flex min-w-0 flex-col gap-1">
                        <span className="h-10 rounded-md border" style={{ background: token.$value }} aria-hidden="true" />
                        <span className="text-xs font-medium tabular-nums">{step}</span>
                        <span className="truncate text-xs text-muted-foreground tabular-nums">{token.$value}</span>
                        {used ? <span className="text-xs font-semibold text-link">{used}</span> : null}
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      </Section>

      <Section
        id="ds-semantik"
        item="13 · 18"
        title="Semantik tokenlar"
        description="Bileşenler skala adımına değil semantik değişkene bağlanır; koyu mod aynı adla başka adıma geçer. Kontrast, tokenın kullanıldığı zemine göre ölçüldü."
      >
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <caption className="sr-only">Semantik renk tokenları, açık ve koyu mod değerleri ve kontrast oranları</caption>
              <thead className="bg-background">
                <tr className="border-b">
                  {['Figma değişkeni', 'Tailwind', 'Açık', 'Koyu', 'Kontrast (açık / koyu)'].map((h) => (
                    <th key={h} scope="col" className="h-11 px-4 text-left text-xs font-semibold text-muted-foreground">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(SEMANTIC).map(([path, t]) => {
                  const lc = 'contrast' in t.light ? (t.light.contrast as number) : null
                  const dc = 'contrast' in t.dark ? (t.dark.contrast as number) : null
                  const need = t.kind === 'text' || t.kind === 'fill' ? 7 : 3
                  return (
                    <tr key={path} className="border-b last:border-0">
                      <th scope="row" className="px-4 py-2.5 text-left font-medium">
                        <span lang="en">{path}</span>
                        <span className="block text-xs font-normal text-muted-foreground">{t.$description}</span>
                      </th>
                      <td className="px-4 py-2.5">
                        <code className="text-xs">{t.tailwind}</code>
                      </td>
                      {[t.light.$value, t.dark.$value].map((hex, i) => (
                        <td key={i} className="px-4 py-2.5">
                          <span className="flex items-center gap-2 tabular-nums">
                            <span className="size-5 shrink-0 rounded-sm border" style={{ background: hex }} aria-hidden="true" />
                            {hex}
                          </span>
                        </td>
                      ))}
                      <td className="px-4 py-2.5 tabular-nums">
                        {lc === null ? (
                          <span className="text-muted-foreground">Yüzey / dekoratif</span>
                        ) : (
                          <span className="flex items-center gap-2">
                            {lc.toFixed(2).replace('.', ',')} / {dc?.toFixed(2).replace('.', ',')}
                            <Badge variant={lc >= need && (dc ?? 0) >= need ? 'success' : 'danger'}>
                              {need === 7 ? 'AAA · 7:1' : '3:1'}
                            </Badge>
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
        <p className="mt-3 max-w-[80ch] text-sm text-muted-foreground">
          Tanımdaki birincil renk #2563EB beyazda 5,17:1 verir; AA'yı geçer, AAA'yı geçmez. Bu yüzden marka rengi metin
          taşımayan yerlerde (odak, grafik, aktif gösterge, onay kutusu) kalır; metin taşıyan birincil düğme ve bağlantılar
          Blue 800 kullanır.
        </p>
      </Section>

      <Section id="ds-tipografi" item="5" title="Tipografi" description="Inter, yoksa sistemin arayüz fontu: SF Pro, Segoe UI, Roboto. Üç ağırlık: 400, 500, 600. Tablolarda sabit genişlikli rakamlar.">
        <Card>
          <CardContent className="flex flex-col divide-y">
            {TYPE_SCALE.map((t) => (
              <div key={t.cls} className="grid gap-1 py-3 first:pt-0 last:pb-0 sm:grid-cols-[120px_1fr_200px] sm:items-baseline sm:gap-4">
                <span className="text-xs text-muted-foreground tabular-nums">{t.size} px</span>
                <span className={t.cls}>Açık alacak 4,2 Mn ₺</span>
                <span className="text-sm text-muted-foreground">{t.use}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </Section>

      <Section id="ds-sekil" item="6 · 7 · 8" title="Şekil, gölge ve yüzey" description="Yarıçap 4, 6 ve 8px. Gölge yalnızca etkileşimi ve üst üste binen katmanı gösterir. Doku, degrade ve bulanıklık kullanılmaz.">
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Yarıçap</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4">
              {Object.entries(tokens.Radius).map(([name, r]) => (
                <div key={name} className="flex flex-col gap-2">
                  <span className="h-16 border-2 border-brand bg-(--badge-info-bg)" style={{ borderRadius: r.$value }} aria-hidden="true" />
                  <span className="text-sm font-medium">
                    {r.tailwind} · {r.$value}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Gölge hiyerarşisi</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4">
              {SHADOWS.map((s) => (
                <div key={s.cls} className="flex flex-col gap-2">
                  <span className={cn('h-16 rounded-md border bg-card', s.cls)} aria-hidden="true" />
                  <span className="text-sm font-medium" lang="en">
                    {s.name}
                  </span>
                  <span className="text-xs text-muted-foreground">{s.use}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section id="ds-ikon" item="9" title="İkonografi" description="Phosphor. Pasif durumda çizgi (regular), aktif durumda dolu (fill). Boyut 20px menüde, 18px düğmede, 14px rozette.">
        <Card>
          <CardContent>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {ICON_PAIRS.map(({ Icon, label }) => (
                <li key={label} className="flex flex-col gap-3 rounded-md border p-4">
                  <span className="flex items-center gap-4">
                    <Icon size={24} aria-hidden="true" />
                    <Icon size={24} weight="fill" className="text-brand" aria-hidden="true" />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-sm font-medium">{label}</span>
                    <span className="text-xs text-muted-foreground">Pasif · Aktif</span>
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </Section>

      <Section
        id="ds-durum"
        item="11 · 12"
        title="Bileşen durumları"
        description="Figma'daki Component Set'ler her durumu önceden tanımlar. Aşağıdakiler canlı bileşenlerdir; odak durumu klavyeyle (Tab) görülür."
      >
        <div className="grid gap-4 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Metin alanı</CardTitle>
              <CardDescription>Default · Focus · Error · Disabled · Success</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2">
              <FormItem>
                <FormLabel>Default</FormLabel>
                <FormControl>
                  <Input placeholder="Ticari ünvan" />
                </FormControl>
              </FormItem>
              <FormItem hasDescription>
                <FormLabel>Focus</FormLabel>
                <FormControl>
                  <Input defaultValue="Anadolu Lojistik" className="border-ring outline-2 outline-offset-0 outline-ring" />
                </FormControl>
                <FormDescription>Odak: 2px Blue 600</FormDescription>
              </FormItem>
              <FormItem state="error" message="Vergi numarası 10 rakamdan oluşmalı.">
                <FormLabel>Error</FormLabel>
                <FormControl>
                  <Input defaultValue="12345" className="tabular-nums" />
                </FormControl>
                <FormMessage />
              </FormItem>
              <FormItem>
                <FormLabel>Disabled</FormLabel>
                <FormControl>
                  <Input defaultValue="TRY" disabled />
                </FormControl>
              </FormItem>
              <FormItem state="success" message="Biçim geçerli." className="sm:col-span-2">
                <FormLabel>Success</FormLabel>
                <FormControl>
                  <Input defaultValue="4830129573" className="tabular-nums" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Düğme</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Button>Kaydet</Button>
                <Button variant="secondary">Taslak</Button>
                <Button variant="outline">Dışa aktar</Button>
                <Button variant="ghost">Vazgeç</Button>
                <Button variant="destructive">Sil</Button>
                <Button variant="link">Ayrıntı</Button>
                <Button disabled>Devre dışı</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Onay kutusu ve rozet</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Seçili değil', props: { checked: false } },
                    { label: 'Seçili', props: { checked: true } },
                    { label: 'Kısmi', props: { checked: 'indeterminate' as const } },
                    { label: 'Devre dışı', props: { checked: false, disabled: true } },
                  ].map((c) => (
                    <label key={c.label} className="flex h-11 cursor-pointer items-center gap-2 rounded-md px-2 text-sm hover:bg-accent">
                      <Checkbox {...c.props} />
                      {c.label}
                    </label>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="success">
                    <CheckCircleIcon weight="fill" aria-hidden="true" />
                    Ödendi
                  </Badge>
                  <Badge variant="info">Açık</Badge>
                  <Badge variant="warning">Vadesi yaklaşıyor</Badge>
                  <Badge variant="danger">
                    <WarningCircleIcon weight="fill" aria-hidden="true" />
                    Gecikmiş
                  </Badge>
                  <Badge variant="neutral">İptal</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      <Section
        id="ds-hareket"
        item="16"
        title="Hareket"
        description="150ms, ease-out. Açılır katmanlar 150ms'de gelir, 100ms'de gider. Sayfa açılışında animasyon yok; kullanıcı hiçbir geçişi beklemez."
      >
        <Card>
          <CardContent className="flex flex-wrap items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Menüyü aç</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>150ms · ease-out</DropdownMenuLabel>
                <DropdownMenuItem>Dışa aktar</DropdownMenuItem>
                <DropdownMenuItem>Paylaş</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">Sil</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-sm">
              <dt className="text-muted-foreground">Süre</dt>
              <dd className="tabular-nums">{tokens.Motion.Duration.$value} · çıkış {tokens.Motion.DurationExit.$value}</dd>
              <dt className="text-muted-foreground">Eğri</dt>
              <dd className="tabular-nums">cubic-bezier({tokens.Motion.Easing.$value.join(', ')})</dd>
            </dl>
          </CardContent>
        </Card>
      </Section>

      <Section
        id="ds-erisim"
        item="17 · 18"
        title="Duyarlı yapı ve erişilebilirlik"
        description="768px altında veri tablosu liste kartlarına, 1024px altında kenar menüsü alt gezinmeye ve çekmeceye dönüşür. Pencereyi daraltarak deneyin."
      >
        <Card>
          <CardContent>
            <ul className="grid gap-x-8 gap-y-4 md:grid-cols-2">
              {AAA.map((a) => (
                <li key={a.sc} className="flex gap-3">
                  <CheckCircleIcon size={20} weight="fill" className="mt-0.5 shrink-0 text-success-text" aria-hidden="true" />
                  <span className="flex flex-col">
                    <span className="font-medium">
                      <span className="tabular-nums">{a.sc}</span> · {a.name}
                    </span>
                    <span className="text-sm text-muted-foreground">{a.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </Section>

      <Section id="ds-kod" item="14 · 15" title="Kod" description="Tanımdaki Tailwind dizisi sabit Slate adımlarını kullanır; uygulamada aynı sınıf semantik tokenlarla yazılır, böylece koyu modda kendiliğinden değişir.">
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Tailwind</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-xs font-semibold text-muted-foreground">Tanımdaki hali</p>
              <pre className="overflow-x-auto rounded-md border bg-background p-4 text-xs leading-relaxed">
                <code>{TAILWIND_SPEC}</code>
              </pre>
              <p className="text-xs font-semibold text-muted-foreground">Semantik tokenlarla</p>
              <pre className="overflow-x-auto rounded-md border bg-background p-4 text-xs leading-relaxed">
                <code>{TAILWIND_SEMANTIC}</code>
              </pre>
              <div className="rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-900 shadow-sm">
                Tanımdaki sınıflarla çizilmiş kart: koyu modda da beyaz kalır.
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>shadcn/ui</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="overflow-x-auto rounded-md border bg-background p-4 text-xs leading-relaxed">
                <code>{SHADCN_SNIPPET}</code>
              </pre>
            </CardContent>
          </Card>
        </div>
      </Section>
    </div>
  )
}
