import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** shadcn/ui yardımcı fonksiyonu: koşullu sınıflar + Tailwind çakışma çözümü. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
