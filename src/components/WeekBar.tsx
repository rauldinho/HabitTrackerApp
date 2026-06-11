import { CompletionEntry } from '../types'
import { formatDateStr, isPast } from '../utils/dateUtils'

interface Props {
  completions: Record<string, CompletionEntry>
  skips?: Record<string, {}>
  failures?: Record<string, {}>
  habitColor: string
  createdAt: string
}

/** Returns the raw hex for a habit's bg color class for use as inline style */
function colorHex(bg: string): { done: string; missed: string } {
  const map: Record<string, { done: string; missed: string }> = {
    'bg-orange-500':  { done: '#f97316', missed: '#fdba74' },
    'bg-amber-500':   { done: '#f59e0b', missed: '#fcd34d' },
    'bg-yellow-400':  { done: '#facc15', missed: '#fde68a' },
    'bg-lime-500':    { done: '#84cc16', missed: '#bef264' },
    'bg-green-500':   { done: '#22c55e', missed: '#86efac' },
    'bg-emerald-500': { done: '#10b981', missed: '#6ee7b7' },
    'bg-teal-500':    { done: '#14b8a6', missed: '#5eead4' },
    'bg-cyan-500':    { done: '#06b6d4', missed: '#67e8f9' },
    'bg-sky-500':     { done: '#0ea5e9', missed: '#7dd3fc' },
    'bg-blue-500':    { done: '#3b82f6', missed: '#93c5fd' },
    'bg-indigo-500':  { done: '#6366f1', missed: '#a5b4fc' },
    'bg-violet-500':  { done: '#8b5cf6', missed: '#c4b5fd' },
    'bg-purple-500':  { done: '#a855f7', missed: '#d8b4fe' },
    'bg-fuchsia-500': { done: '#d946ef', missed: '#f0abfc' },
    'bg-pink-500':    { done: '#ec4899', missed: '#f9a8d4' },
    'bg-rose-500':    { done: '#f43f5e', missed: '#fda4af' },
  }
  return map[bg] ?? { done: '#6b7280', missed: '#d1d5db' }
}

export function WeekBar({ completions, skips = {}, failures = {}, habitColor, createdAt }: Props) {
  const days: { dateStr: string; label: string; isToday: boolean }[] = []
  const now = new Date()
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    days.push({
      dateStr: formatDateStr(d),
      label: d.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 1),
      isToday: i === 0,
    })
  }

  const { done: doneColor, missed: missedColor } = colorHex(habitColor)

  return (
    <div className="mt-3 flex gap-1">
      {days.map(({ dateStr, label, isToday }) => {
        const done    = dateStr in completions
        const skipped = dateStr in skips
        const failed  = dateStr in failures
        const past    = isPast(dateStr)
        const beforeCreation = dateStr < createdAt
        const missed  = !done && !skipped && !failed && past && !beforeCreation

        let bg: string
        let opacity = '1'
        let title = dateStr

        // Explicit states (done/failed/skipped) always take priority over beforeCreation
        if (done) {
          bg = doneColor
          title = `${dateStr} ✓`
        } else if (failed) {
          bg = '#ef4444'
          opacity = '0.85'
          title = `${dateStr} ✕ failed`
        } else if (skipped) {
          bg = 'var(--color-muted)'
          opacity = '0.7'
          title = `${dateStr} — skipped`
        } else if (beforeCreation) {
          bg = 'var(--color-muted)'
          opacity = '0.3'
        } else if (missed) {
          bg = missedColor
          opacity = '0.5'
        } else if (isToday) {
          bg = 'var(--color-muted)'
        } else {
          bg = 'var(--color-muted)'
          opacity = '0.4'
        }

        return (
          <div key={dateStr} className="flex flex-col items-center gap-1 flex-1">
            <div
              className="w-full border border-border relative overflow-hidden"
              style={{
                aspectRatio: '1',
                backgroundColor: bg,
                opacity,
                borderRadius: isToday ? '4px 10px 4px 10px / 10px 4px 10px 4px' : '3px 8px 3px 8px / 8px 3px 8px 3px',
                boxShadow: done ? '1px 1px 0px 0px var(--color-border)' : 'none',
              }}
              title={title}
            >
              {/* Diagonal stripes for skipped days */}
              {skipped && (
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'repeating-linear-gradient(135deg, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 3.5px)',
                  }}
                />
              )}
            </div>
            <span
              className="font-body leading-none"
              style={{
                fontSize: 9,
                color: isToday ? 'var(--color-accent)' : 'var(--color-ink)',
                opacity: isToday ? 1 : 0.45,
                fontWeight: isToday ? 700 : 400,
              }}
            >
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
