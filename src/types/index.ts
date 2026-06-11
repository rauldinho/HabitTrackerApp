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

// failures[habitId][dateStr] = {} — explicitly marked as failed
export type FailuresMap = Record<string, Record<string, {}>>

export interface AppData {
  habits: Habit[]
  completions: CompletionsMap
  skips: SkipsMap
  failures: FailuresMap
}

export const HABIT_COLORS = [
  { label: 'Orange',  value: 'bg-orange-500',  ring: 'ring-orange-400',  text: 'text-orange-400'  },
  { label: 'Amber',   value: 'bg-amber-500',   ring: 'ring-amber-400',   text: 'text-amber-400'   },
  { label: 'Yellow',  value: 'bg-yellow-400',  ring: 'ring-yellow-300',  text: 'text-yellow-400'  },
  { label: 'Lime',    value: 'bg-lime-500',    ring: 'ring-lime-400',    text: 'text-lime-400'    },
  { label: 'Green',   value: 'bg-green-500',   ring: 'ring-green-400',   text: 'text-green-400'   },
  { label: 'Emerald', value: 'bg-emerald-500', ring: 'ring-emerald-400', text: 'text-emerald-400' },
  { label: 'Teal',    value: 'bg-teal-500',    ring: 'ring-teal-400',    text: 'text-teal-400'    },
  { label: 'Cyan',    value: 'bg-cyan-500',    ring: 'ring-cyan-400',    text: 'text-cyan-400'    },
  { label: 'Sky',     value: 'bg-sky-500',     ring: 'ring-sky-400',     text: 'text-sky-400'     },
  { label: 'Blue',    value: 'bg-blue-500',    ring: 'ring-blue-400',    text: 'text-blue-400'    },
  { label: 'Indigo',  value: 'bg-indigo-500',  ring: 'ring-indigo-400',  text: 'text-indigo-400'  },
  { label: 'Violet',  value: 'bg-violet-500',  ring: 'ring-violet-400',  text: 'text-violet-400'  },
  { label: 'Purple',  value: 'bg-purple-500',  ring: 'ring-purple-400',  text: 'text-purple-400'  },
  { label: 'Fuchsia', value: 'bg-fuchsia-500', ring: 'ring-fuchsia-400', text: 'text-fuchsia-400' },
  { label: 'Pink',    value: 'bg-pink-500',    ring: 'ring-pink-400',    text: 'text-pink-400'    },
  { label: 'Rose',    value: 'bg-rose-500',    ring: 'ring-rose-400',    text: 'text-rose-400'    },
]

// Icon keys now reference lucide-react icon names (see HabitIcon.tsx)
// Old emoji strings are still supported as fallback in HabitIcon renderer
