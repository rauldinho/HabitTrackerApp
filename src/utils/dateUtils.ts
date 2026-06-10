/**
 * Returns today's date as YYYY-MM-DD in local time.
 */
export function todayStr(): string {
  const d = new Date()
  return formatDateStr(d)
}

/**
 * Formats a Date to YYYY-MM-DD in local time.
 */
export function formatDateStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * Returns a Date from a YYYY-MM-DD string (local time, midnight).
 */
export function parseDateStr(s: string): Date {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/**
 * Returns all days in the given month as YYYY-MM-DD strings.
 */
export function getDaysInMonth(year: number, month: number): string[] {
  const days: string[] = []
  const d = new Date(year, month, 1)
  while (d.getMonth() === month) {
    days.push(formatDateStr(d))
    d.setDate(d.getDate() + 1)
  }
  return days
}

/**
 * Returns the weekday index (0=Sun) of the first day of the month.
 */
export function getFirstWeekday(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

/**
 * True if dateStr is strictly before today.
 */
export function isPast(dateStr: string): boolean {
  return dateStr < todayStr()
}

/**
 * True if dateStr is strictly after today.
 */
export function isFuture(dateStr: string): boolean {
  return dateStr > todayStr()
}

/**
 * True if dateStr is today.
 */
export function isToday(dateStr: string): boolean {
  return dateStr === todayStr()
}

/**
 * Returns the Monday (start of ISO week) of the week containing dateStr, as YYYY-MM-DD.
 */
export function getWeekStart(dateStr: string): string {
  const d = parseDateStr(dateStr)
  const day = d.getDay() // 0=Sun, 1=Mon…
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1))
  return formatDateStr(d)
}

/**
 * Returns all 7 days of the ISO week containing dateStr, as YYYY-MM-DD strings.
 */
export function getWeekDays(dateStr: string): string[] {
  const monday = parseDateStr(getWeekStart(dateStr))
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return formatDateStr(d)
  })
}
