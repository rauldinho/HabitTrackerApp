import { useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { AppData, Habit, CompletionsMap, SkipsMap } from '../types'
import { todayStr, getWeekDays } from '../utils/dateUtils'

const STORAGE_KEY = 'habit-tracker-v1'

function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as AppData
      // Migrate: add missing fields to existing habits
      parsed.habits = parsed.habits.map(h => ({
        ...h,
        icon: h.icon ?? 'Target',
        skipsPerWeek: (h as Habit).skipsPerWeek ?? 1,
      }))
      // Migrate: ensure skips map exists
      if (!parsed.skips) parsed.skips = {}
      return parsed
    }
  } catch {
    // corrupted — start fresh
  }
  return { habits: [], completions: {}, skips: {} }
}

function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function useHabits() {
  const [data, setData] = useState<AppData>(loadData)

  const persist = useCallback((next: AppData) => {
    setData(next)
    saveData(next)
  }, [])

  // ── Habits ──────────────────────────────────────────────

  const addHabit = useCallback(
    (name: string, color: string, icon: string, skipsPerWeek: 0 | 1 | 2 = 1) => {
      const habit: Habit = {
        id: uuidv4(),
        name: name.trim(),
        color,
        icon,
        createdAt: todayStr(),
        archived: false,
        skipsPerWeek,
      }
      persist({
        ...data,
        habits: [...data.habits, habit],
        completions: { ...data.completions, [habit.id]: {} },
        skips: { ...(data.skips ?? {}), [habit.id]: {} },
      })
    },
    [data, persist],
  )

  const updateHabit = useCallback(
    (id: string, changes: Partial<Pick<Habit, 'name' | 'color' | 'icon' | 'skipsPerWeek'>>) => {
      persist({
        ...data,
        habits: data.habits.map(h => (h.id === id ? { ...h, ...changes } : h)),
      })
    },
    [data, persist],
  )

  const deleteHabit = useCallback(
    (id: string) => {
      const { [id]: _c, ...restCompletions } = data.completions
      const { [id]: _s, ...restSkips } = (data.skips ?? {})
      persist({
        ...data,
        habits: data.habits.filter(h => h.id !== id),
        completions: restCompletions,
        skips: restSkips,
      })
    },
    [data, persist],
  )

  const reorderHabits = useCallback(
    (orderedIds: string[]) => {
      const map = new Map(data.habits.map(h => [h.id, h]))
      const reordered = orderedIds.map(id => map.get(id)!).filter(Boolean)
      const inSet = new Set(orderedIds)
      const rest = data.habits.filter(h => !inSet.has(h.id))
      persist({ ...data, habits: [...reordered, ...rest] })
    },
    [data, persist],
  )

  const archiveHabit = useCallback(
    (id: string) => {
      persist({
        ...data,
        habits: data.habits.map(h =>
          h.id === id ? { ...h, archived: !h.archived } : h,
        ),
      })
    },
    [data, persist],
  )

  // ── Completions ──────────────────────────────────────────

  const toggleToday = useCallback(
    (habitId: string) => {
      const today = todayStr()
      const habitCompletions = { ...(data.completions[habitId] ?? {}) }
      if (today in habitCompletions) {
        delete habitCompletions[today]
        persist({
          ...data,
          completions: { ...data.completions, [habitId]: habitCompletions },
        })
      } else {
        // Mark done — also remove any skip for today
        habitCompletions[today] = {}
        const habitSkips = { ...(data.skips?.[habitId] ?? {}) }
        delete habitSkips[today]
        persist({
          ...data,
          completions: { ...data.completions, [habitId]: habitCompletions },
          skips: { ...(data.skips ?? {}), [habitId]: habitSkips },
        })
      }
    },
    [data, persist],
  )

  const toggleDate = useCallback(
    (habitId: string, dateStr: string) => {
      const habitCompletions = { ...(data.completions[habitId] ?? {}) }
      if (dateStr in habitCompletions) {
        delete habitCompletions[dateStr]
        persist({
          ...data,
          completions: { ...data.completions, [habitId]: habitCompletions },
        })
      } else {
        habitCompletions[dateStr] = {}
        // Remove skip for this date when marking done
        const habitSkips = { ...(data.skips?.[habitId] ?? {}) }
        delete habitSkips[dateStr]
        persist({
          ...data,
          completions: { ...data.completions, [habitId]: habitCompletions },
          skips: { ...(data.skips ?? {}), [habitId]: habitSkips },
        })
      }
    },
    [data, persist],
  )

  const isTodayDone = useCallback(
    (habitId: string): boolean => {
      return todayStr() in (data.completions[habitId] ?? {})
    },
    [data],
  )

  const getCompletions = useCallback(
    (habitId: string): Record<string, { note?: string }> => {
      return data.completions[habitId] ?? {}
    },
    [data],
  )

  // ── Skips ────────────────────────────────────────────────

  /**
   * Toggle a skip for `dateStr`. If adding a skip, removes any completion for that day.
   */
  const toggleSkip = useCallback(
    (habitId: string, dateStr: string) => {
      const habitSkips = { ...(data.skips?.[habitId] ?? {}) }
      if (dateStr in habitSkips) {
        // Remove skip
        delete habitSkips[dateStr]
        persist({
          ...data,
          skips: { ...(data.skips ?? {}), [habitId]: habitSkips },
        })
      } else {
        // Add skip — also remove completion for this day
        habitSkips[dateStr] = {}
        const habitCompletions = { ...(data.completions[habitId] ?? {}) }
        delete habitCompletions[dateStr]
        persist({
          ...data,
          completions: { ...data.completions, [habitId]: habitCompletions },
          skips: { ...(data.skips ?? {}), [habitId]: habitSkips },
        })
      }
    },
    [data, persist],
  )

  const getSkips = useCallback(
    (habitId: string): Record<string, {}> => {
      return data.skips?.[habitId] ?? {}
    },
    [data],
  )

  /**
   * Returns { used, total } skip slots for the ISO week containing `dateStr`.
   */
  const getWeekSkipInfo = useCallback(
    (habitId: string, dateStr: string): { used: number; total: 0 | 1 | 2 } => {
      const habit = data.habits.find(h => h.id === habitId)
      if (!habit) return { used: 0, total: 0 }
      const habitSkips = data.skips?.[habitId] ?? {}
      const used = getWeekDays(dateStr).filter(d => d in habitSkips).length
      return { used, total: habit.skipsPerWeek }
    },
    [data],
  )

  /**
   * True if a skip can be applied to `dateStr`
   * (already skipped → allow un-skip; under weekly limit → allow new skip).
   */
  const canSkipDate = useCallback(
    (habitId: string, dateStr: string): boolean => {
      const habit = data.habits.find(h => h.id === habitId)
      if (!habit || habit.skipsPerWeek === 0) return false
      const habitSkips = data.skips?.[habitId] ?? {}
      if (dateStr in habitSkips) return true // un-skip always allowed
      const used = getWeekDays(dateStr).filter(d => d in habitSkips).length
      return used < habit.skipsPerWeek
    },
    [data],
  )

  // ── Export / Import ──────────────────────────────────────

  const exportData = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `habits-${todayStr()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [data])

  const importData = useCallback(
    (file: File) => {
      const reader = new FileReader()
      reader.onload = e => {
        try {
          const imported = JSON.parse(e.target?.result as string) as AppData
          if (imported.habits && imported.completions) {
            if (!imported.skips) imported.skips = {}
            persist(imported)
          }
        } catch {
          alert('Invalid file. Please select a valid habits JSON export.')
        }
      }
      reader.readAsText(file)
    },
    [persist],
  )

  return {
    habits: data.habits,
    completions: data.completions as CompletionsMap,
    skips: data.skips as SkipsMap,
    addHabit,
    updateHabit,
    deleteHabit,
    reorderHabits,
    archiveHabit,
    toggleToday,
    toggleDate,
    toggleSkip,
    isTodayDone,
    getCompletions,
    getSkips,
    getWeekSkipInfo,
    canSkipDate,
    exportData,
    importData,
  }
}
