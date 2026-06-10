export interface Habit {
  id: string
  name: string
  color: string
  icon: string        // lucide icon name (emoji strings supported as legacy fallback)
  createdAt: string   // YYYY-MM-DD local time
  archived: boolean
  skipsPerWeek: 0 | 1 | 2  // how many skip-days allowed per week; 0 = feature off
}

export interface CompletionEntry {
  note?: string
}

// completions[habitId][dateStr] = CompletionEntry
export type CompletionsMap = Record<string, Record<string, CompletionEntry>>

// skips[habitId][dateStr] = {} — skipped days (don't break streak, don't count as done)
export type SkipsMap = Record<string, Record<string, {}>>

export interface AppData {
  habits: Habit[]
  completions: CompletionsMap
  skips: SkipsMap
}

export const HABIT_COLORS = [
  { label: 'Red',    value: 'bg-red-500',    ring: 'ring-red-400',    text: 'text-red-400'    },
  { label: 'Orange', value: 'bg-orange-500', ring: 'ring-orange-400', text: 'text-orange-400' },
  { label: 'Yellow', value: 'bg-yellow-400', ring: 'ring-yellow-300', text: 'text-yellow-400' },
  { label: 'Green',  value: 'bg-green-500',  ring: 'ring-green-400',  text: 'text-green-400'  },
  { label: 'Teal',   value: 'bg-teal-500',   ring: 'ring-teal-400',   text: 'text-teal-400'   },
  { label: 'Blue',   value: 'bg-blue-500',   ring: 'ring-blue-400',   text: 'text-blue-400'   },
  { label: 'Violet', value: 'bg-violet-500', ring: 'ring-violet-400', text: 'text-violet-400' },
  { label: 'Pink',   value: 'bg-pink-500',   ring: 'ring-pink-400',   text: 'text-pink-400'   },
]

// Icon keys now reference lucide-react icon names (see HabitIcon.tsx)
// Old emoji strings are still supported as fallback in HabitIcon renderer
