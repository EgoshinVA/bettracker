import { clsx as clsxBase, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsxBase(inputs)
}
