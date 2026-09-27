import { useRef, useState, type FormEvent } from 'react'
import { ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon, CheckIcon, PencilSimpleIcon, WarningCircleIcon } from '@phosphor-icons/react'
import { Card, CardContent, CardFooter } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { NativeSelect } from '../ui/native-select'
import { Checkbox } from '../ui/checkbox'
import { RadioCard, RadioGroup } from '../ui/radio-group'
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '../ui/form'
import { cn } from '../lib/utils'

const STEPS = ['Firma', 'İletişim', 'Ödeme koşulları', 'Onay'] as const

const SECTORS = ['Enerji', 'Gıda', 'İnşaat', 'Lojistik', 'Makine', 'Sağlık', 'Teknoloji', 'Tekstil', 'Turizm'] as const

const TERMS = [
  { value: '15', title: '15 gün', description: 'Küçük ve sık siparişler' },
  { value: '30', title: '30 gün', description: 'Standart ticari vade' },
  { value: '45', title: '45 gün', description: 'Kurumsal alıcılar' },
  { value: '60', title: '60 gün', description: 'Proje bazlı sözleşmeler' },
] as const

type Values = {
  title: string
  taxNo: string
  sector: string
  contact: string
  email: string
  phone: string
  terms: string
  eInvoice: boolean
  confirm: boolean
}

type Field = keyof Values
type Errors = Partial<Record<Field, string>>

const INITIAL: Values = {
  title: '',
  taxNo: '',
  sector: '',
  contact: '',
  email: '',
  phone: '',
  terms: '30',
  eInvoice: true,
  confirm: false,
}

const FIELDS_BY_STEP: Field[][] = [['title', 'taxNo', 'sector'], ['contact', 'email', 'phone'], ['terms'], ['confirm']]

function validate(values: Values, fields: Field[]): Errors {
  const e: Errors = {}
  for (const f of fields) {
    const v = values[f]
    if (f === 'title' && String(v).trim().length < 3) e.title = 'Ticari ünvanı en az 3 karakter olarak girin.'
    if (f === 'taxNo' && !/^\d{10}$/.test(String(v))) e.taxNo = 'Vergi numarası 10 rakamdan oluşmalı. Boşluk ve harf kullanmayın.'
    if (f === 'sector' && !v) e.sector = 'Listeden bir sektör seçin.'
    if (f === 'contact' && String(v).trim().length < 2) e.contact = 'Yetkili kişinin adını girin.'
    if (f === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v))) e.email = 'E-posta adresini ad@alan.com biçiminde girin.'
    if (f === 'phone' && v && !/^[+\d\s()-]{10,}$/.test(String(v))) e.phone = 'Telefonu alan koduyla birlikte girin, örneğin 0212 555 01 23.'
    if (f === 'confirm' && !v) e.confirm = 'Kaydetmeden önce bilgileri kontrol ettiğinizi onaylayın.'
  }
  return e
}

const LABELS: Record<Field, string> = {
  title: 'Ticari ünvan',
  taxNo: 'Vergi numarası',
  sector: 'Sektör',
  contact: 'Yetkili kişi',
  email: 'E-posta',
  phone: 'Telefon',
  terms: 'Ödeme vadesi',
  eInvoice: 'e-Fatura',
  confirm: 'Onay',
}

export function CustomerWizard() {
  const [step, setStep] = useState(0)
  const [values, setValues] = useState<Values>(INITIAL)
  const [errors, setErrors] = useState<Errors>({})
  const [done, setDone] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const summaryRef = useRef<HTMLDivElement>(null)

  const set = <K extends Field>(key: K, value: Values[K]) => {
    setValues((v) => ({ ...v, [key]: value }))
    // Hata düzeltildiği anda kaybolur; yeni hata yalnızca "İleri" ile gösterilir
    if (errors[key]) setErrors((e) => ({ ...e, [key]: validate({ ...values, [key]: value }, [key])[key] }))
  }

  function next(event: FormEvent) {
    event.preventDefault()
    const found = validate(values, FIELDS_BY_STEP[step])
    setErrors(found)
    if (Object.keys(found).length) {
      requestAnimationFrame(() => summaryRef.current?.focus())
      return
    }
    if (step === STEPS.length - 1) {
      setDone(true)
      return
    }
    setStep((s) => s + 1)
    requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('h2')?.focus())
  }

  function goTo(target: number) {
    setErrors({})
    setStep(target)
    requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('h2')?.focus())
  }

  const errorList = Object.entries(errors).filter(([, msg]) => msg) as [Field, string][]
  const taxOk = values.taxNo.length === 10 && !errors.taxNo && /^\d{10}$/.test(values.taxNo)

  if (done) {
    return (
      <Card className="mx-auto max-w-3xl">
        <CardContent className="flex flex-col items-start gap-4 p-8">
          <CheckCircleIcon size={40} weight="fill" className="text-success-text" aria-hidden="true" />
          <h2 className="text-xl font-semibold" tabIndex={-1}>
            {values.title} kaydedildi
          </h2>
          <p className="max-w-[60ch] text-muted-foreground">
            Bu bir örnek akış; veri hiçbir yere gönderilmedi. Gerçek uygulamada müşteri kartı oluşturulur ve ilk fatura bu
            vadeyle ({values.terms} gün) kesilir.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setValues(INITIAL)
              setStep(0)
              setDone(false)
            }}
          >
            Yeni müşteri ekle
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mx-auto max-w-3xl">
      {/* Adım göstergesi */}
      <div className="border-b px-5 py-4 md:px-8">
        <p className="text-sm text-muted-foreground md:hidden">
          Adım {step + 1} / {STEPS.length} · {STEPS[step]}
        </p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted md:hidden" aria-hidden="true">
          <div className="h-full rounded-full bg-brand transition-[width] duration-150" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>
        <ol className="hidden items-center gap-2 md:flex" aria-label="Adımlar">
          {STEPS.map((label, i) => {
            const state = i < step ? 'done' : i === step ? 'current' : 'upcoming'
            return (
              <li key={label} className="flex flex-1 items-center gap-2" aria-current={state === 'current' ? 'step' : undefined}>
                <span
                  className={cn(
                    'grid size-7 shrink-0 place-items-center rounded-full border text-xs font-semibold tabular-nums',
                    state === 'done' && 'border-brand bg-brand text-white',
                    state === 'current' && 'border-2 border-brand text-foreground',
                    state === 'upcoming' && 'border-input text-muted-foreground',
                  )}
                >
                  {state === 'done' ? <CheckIcon size={14} weight="bold" aria-hidden="true" /> : i + 1}
                </span>
                <span className={cn('text-sm whitespace-nowrap', state === 'upcoming' ? 'text-muted-foreground' : 'font-medium')}>
                  {label}
                  {state === 'done' ? <span className="sr-only"> (tamamlandı)</span> : null}
                </span>
                {i < STEPS.length - 1 ? <span aria-hidden="true" className={cn('h-px flex-1', i < step ? 'bg-brand' : 'bg-border')} /> : null}
              </li>
            )
          })}
        </ol>
      </div>

      <form ref={formRef} onSubmit={next} noValidate>
        <CardContent className="flex flex-col gap-6 p-5 md:p-8">
          <h2 className="text-lg font-semibold outline-none" tabIndex={-1}>
            {STEPS[step]}
          </h2>

          {errorList.length ? (
            <div
              ref={summaryRef}
              tabIndex={-1}
              role="alert"
              className="rounded-md border-2 border-error-border bg-(--badge-danger-bg) p-4 text-(--badge-danger-fg)"
            >
              <p className="flex items-center gap-2 font-semibold">
                <WarningCircleIcon size={20} weight="fill" aria-hidden="true" />
                {errorList.length} alanı düzeltin
              </p>
              <ul className="mt-2 list-disc pl-10 text-sm">
                {errorList.map(([field, msg]) => (
                  <li key={field}>
                    <a
                      href={`#alan-${field}`}
                      className="underline underline-offset-2"
                      onClick={(e) => {
                        e.preventDefault()
                        formRef.current?.querySelector<HTMLElement>(`[data-field="${field}"]`)?.focus()
                      }}
                    >
                      {LABELS[field]}: {msg}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {step === 0 ? (
            <div className="grid gap-5 md:grid-cols-2">
              <FormItem className="md:col-span-2" state={errors.title ? 'error' : 'default'} message={errors.title}>
                <FormLabel required>Ticari ünvan</FormLabel>
                <FormControl>
                  <Input data-field="title" autoComplete="organization" value={values.title} onChange={(e) => set('title', e.target.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
              <FormItem
                state={errors.taxNo ? 'error' : taxOk ? 'success' : 'default'}
                message={errors.taxNo ?? (taxOk ? 'Biçim geçerli.' : undefined)}
                hasDescription
              >
                <FormLabel required>Vergi numarası</FormLabel>
                <FormControl>
                  <Input
                    data-field="taxNo"
                    inputMode="numeric"
                    maxLength={10}
                    className="tabular-nums"
                    value={values.taxNo}
                    onChange={(e) => set('taxNo', e.target.value.replace(/\s/g, ''))}
                  />
                </FormControl>
                <FormDescription>10 haneli vergi kimlik numarası</FormDescription>
                <FormMessage />
              </FormItem>
              <FormItem state={errors.sector ? 'error' : 'default'} message={errors.sector}>
                <FormLabel required>Sektör</FormLabel>
                <FormControl>
                  <NativeSelect data-field="sector" value={values.sector} onChange={(e) => set('sector', e.target.value)}>
                    <option value="">Seçin</option>
                    {SECTORS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </NativeSelect>
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="grid gap-5 md:grid-cols-2">
              <FormItem className="md:col-span-2" state={errors.contact ? 'error' : 'default'} message={errors.contact}>
                <FormLabel required>Yetkili kişi</FormLabel>
                <FormControl>
                  <Input data-field="contact" autoComplete="name" value={values.contact} onChange={(e) => set('contact', e.target.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
              <FormItem state={errors.email ? 'error' : 'default'} message={errors.email} hasDescription>
                <FormLabel required>E-posta</FormLabel>
                <FormControl>
                  <Input data-field="email" type="email" autoComplete="email" value={values.email} onChange={(e) => set('email', e.target.value)} />
                </FormControl>
                <FormDescription>Faturalar bu adrese gönderilir.</FormDescription>
                <FormMessage />
              </FormItem>
              <FormItem state={errors.phone ? 'error' : 'default'} message={errors.phone} hasDescription>
                <FormLabel>Telefon</FormLabel>
                <FormControl>
                  <Input data-field="phone" type="tel" autoComplete="tel" value={values.phone} onChange={(e) => set('phone', e.target.value)} />
                </FormControl>
                <FormDescription>İsteğe bağlı</FormDescription>
                <FormMessage />
              </FormItem>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="flex flex-col gap-6">
              <fieldset className="flex flex-col gap-3">
                <legend className="mb-3 text-sm font-medium">Ödeme vadesi</legend>
                <RadioGroup value={values.terms} onValueChange={(v) => set('terms', v)} className="sm:grid-cols-2" aria-label="Ödeme vadesi">
                  {TERMS.map((t) => (
                    <RadioCard key={t.value} value={t.value} title={t.title} description={t.description} />
                  ))}
                </RadioGroup>
              </fieldset>
              <label className="flex min-h-11 cursor-pointer items-start gap-3 rounded-md border border-input p-4">
                <Checkbox className="mt-0.5" checked={values.eInvoice} onCheckedChange={(v) => set('eInvoice', v === true)} />
                <span className="flex flex-col">
                  <span className="font-medium">e-Fatura mükellefi</span>
                  <span className="text-sm text-muted-foreground">Faturalar GİB üzerinden e-Fatura olarak kesilir.</span>
                </span>
              </label>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="flex flex-col gap-5">
              <p className="text-muted-foreground">Kaydetmeden önce bilgileri kontrol edin. Her bölümü buradan düzenleyebilirsiniz.</p>
              {[
                { title: 'Firma', stepIndex: 0, rows: [['Ticari ünvan', values.title], ['Vergi numarası', values.taxNo], ['Sektör', values.sector]] },
                { title: 'İletişim', stepIndex: 1, rows: [['Yetkili kişi', values.contact], ['E-posta', values.email], ['Telefon', values.phone || '—']] },
                {
                  title: 'Ödeme koşulları',
                  stepIndex: 2,
                  rows: [['Vade', `${values.terms} gün`], ['e-Fatura', values.eInvoice ? 'Evet' : 'Hayır']],
                },
              ].map((section) => (
                <section key={section.title} className="rounded-md border">
                  <div className="flex items-center justify-between gap-3 border-b bg-background px-4 py-1">
                    <h3 className="font-semibold">{section.title}</h3>
                    <Button variant="link" onClick={() => goTo(section.stepIndex)} className="px-2">
                      <PencilSimpleIcon size={16} aria-hidden="true" />
                      Düzenle<span className="sr-only">: {section.title}</span>
                    </Button>
                  </div>
                  <dl className="grid gap-x-6 gap-y-2 p-4 text-sm sm:grid-cols-[160px_1fr]">
                    {section.rows.map(([k, v]) => (
                      <div key={k} className="contents">
                        <dt className="text-muted-foreground">{k}</dt>
                        <dd className="font-medium break-words">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ))}
              <FormItem state={errors.confirm ? 'error' : 'default'} message={errors.confirm}>
                <label className="flex min-h-11 cursor-pointer items-center gap-3">
                  <FormControl>
                    <Checkbox data-field="confirm" checked={values.confirm} onCheckedChange={(v) => set('confirm', v === true)} />
                  </FormControl>
                  <span className="text-sm font-medium">Bilgilerin doğru olduğunu kontrol ettim.</span>
                </label>
                <FormMessage />
              </FormItem>
            </div>
          ) : null}
        </CardContent>

        <CardFooter className="justify-between px-5 md:px-8">
          <Button variant="outline" onClick={() => goTo(step - 1)} disabled={step === 0}>
            <ArrowLeftIcon size={18} aria-hidden="true" />
            Geri
          </Button>
          <Button type="submit">
            {step === STEPS.length - 1 ? 'Müşteriyi kaydet' : 'İleri'}
            {step === STEPS.length - 1 ? null : <ArrowRightIcon size={18} aria-hidden="true" />}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
