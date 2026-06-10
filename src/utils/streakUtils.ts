import { CompletionEntry } from '../types'
import { todayStr, parseDateStr, formatDateStr } from './dateUtils'

/**
 * Calculates current streak and longest streak for a habit.
 *
 * Rules:
 * - Today not yet marked does NOT break the streak (it's still today).
 * - Skip days are "transparent" — they don't count toward streak length,
 *   but they also don't break it.
 * - Only past days that were neither completed nor skipped count as "missed".
 */
export function calcStreaks(
  completions: Record<string, CompletionEntry>,
  createdAt: string,
  skips?: Record<string, {}>,
): { current: number; longest: number } {
  const today = todayStr()
  const todayDone = today in completions

  // ── Current streak: walk backward from today ────────────────
  // Note: we intentionally do NOT stop at createdAt — the user may have
  // retroactively marked days before creation as done, and those should count.
  let current = 0
  const cursor = new Date(parseDateStr(today))
  if (!todayDone) {
    cursor.setDate(cursor.getDate() - 1)
  }
  while (true) {
    const ds = formatDateStr(cursor)
    if (ds in completions) {
      current++
    } else if (skips && ds in skips) {
      // transparent skip — pass through without breaking or counting
    } else if (ds >= createdAt) {
      break // genuine miss on an active day
    } else {
      break // before habit creation with no completion — stop gracefully
    }
    cursor.setDate(cursor.getDate() - 1)
  }

  // ── Longest streak: walk forward from earliest completion or createdAt ─
  // Start from whichever is earlier: createdAt or the earliest retroactive completion.
  const allDates = Object.keys(completions)
  const earliestCompletion = allDates.length > 0 ? allDates.reduce((a, b) => a < b ? a : b) : createdAt
  const startDate = earliestCompletion < createdAt ? earliestCompletion : createdAt

  let longest = 0
  let run = 0
  const walker = new Date(parseDateStr(startDate))
  const end = parseDateStr(today)
  while (walker <= end) {
    const ds = formatDateStr(walker)
    if (ds in completions) {
      run++
      longest = Math.max(longest, run)
    } else if (skips && ds in skips) {
      // transparent skip
    } else if (ds < today && ds >= startDate) {
      run = 0 // missed
    }
    walker.setDate(walker.getDate() + 1)
  }
  longest = Math.max(longest, run)

  return { current, longest }
}

/**
 * Returns completion % for a given window of days (excluding skipped days from totals).
 * Only counts days from habit creation up to (and including) yesterday.
 * Today is excluded (not yet missed).
 */
export function calcCompletionRate(
  completions: Record<string, CompletionEntry>,
  createdAt: string,
  skips?: Record<string, {}>,
): { weekly: number; monthly: number } {
  const today = todayStr()

  function rate(daysBack: number): number {
    let total = 0
    let done = 0
    const cursor = new Date(parseDateStr(today))
    cursor.setDate(cursor.getDate() - 1) // start from yesterday
    for (let i = 0; i < daysBack; i++) {
      const ds = formatDateStr(cursor)
      if (ds < createdAt) break
      if (skips && ds in skips) {
        // skipped days are neutral — excluded from both numerator and denominator
        cursor.setDate(cursor.getDate() - 1)
        continue
      }
      total++
      if (ds in completions) done++
      cursor.setDate(cursor.getDate() - 1)
    }
    return total === 0 ? 0 : Math.round((done / total) * 100)
  }

  return { weekly: rate(7), monthly: rate(30) }
}
