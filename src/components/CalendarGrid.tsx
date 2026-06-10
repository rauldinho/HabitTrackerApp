import { getDaysInMonth, getFirstWeekday, isToday, isFuture } from '../utils/dateUtils'
import { CompletionEntry } from '../types'

function colorHex(bg: string): { done: string; missed: string } {
  const map: Record<string, { done: string; missed: string }> = {
    'bg-red-500':    { done: '#ef4444', missed: '#fca5a5' },
    'bg-orange-500': { done: '#f97316', missed: '#fdba74' },
    'bg-yellow-400': { done: '#facc15', missed: '#fde68a' },
    'bg-green-500':  { done: '#22c55e', missed: '#86efac' },
    'bg-teal-500':   { done: '#14b8a6', missed: '#5eead4' },
    'bg-blue-500':   { done: '#3b82f6', missed: '#93c5fd' },
    'bg-violet-500': { done: '#8b5cf6', missed: '#c4b5fd' },
    'bg-pink-500':   { done: '#ec4899', missed: '#f9a8d4' },
  }
  return map[bg] ?? { done: '#6b7280', missed: '#d1d5db' }
}

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

interface Props {
  year: number
  month: number
  completions: Record<string, CompletionEntry>
  skips?: Record<string, {}>
  failures?: Record<string, {}>
  habitColor: string
  createdAt: string
  /** Cycles: none → done → failed → none. Also un-skips a skipped day. */
  onCycleDate?: (dateStr: string) => void
}

export function CalendarGrid({
  year, month, completions, skips = {}, failures = {}, habitColor, createdAt, onCycleDate,
}: Props) {
  const days = getDaysInMonth(year, month)
  const firstWeekday = getFirstWeekday(year, month)
  const { done: doneColor, missed: missedColor } = colorHex(habitColor)

  return (
    <div className="mt-4 border-2 border-border wobbly-sm shadow-hard-sm p-3 bg-card">
      <p className="font-heading text-sm font-bold text-ink mb-2">
        {MONTH_NAMES[month]} {year}
      </p>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((w, i) => (
          <div key={i} className="text-center font-body text-[10px] text-ink/50 font-semibold">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstWeekday }).map((_, i) => <div key={`e-${i}`} />)}

        {days.map(dateStr => {
          const done    = dateStr in completions
          const skipped = dateStr in skips
          const failed  = dateStr in failures
          const today   = isToday(dateStr)
          const future  = isFuture(dateStr)
          const beforeCreation = dateStr < createdAt
          const missed  = !done && !skipped && !failed && !today && !future && !beforeCreation
          const dayNum  = parseInt(dateStr.split('-')[2], 10)
          const canToggle = !future && !!onCycleDate

          let bg          = 'transparent'
          let textColor   = 'var(--color-ink)'
          // Explicit states override the beforeCreation fade — only fade truly unmarked past-creation days
          let opacity     = future || (beforeCreation && !done && !failed && !skipped) ? '0.25' : '1'
          let borderStyle = '1px dashed var(--color-border)'
          let shadow      = 'none'

          if (done) {
            bg          = doneColor
            borderStyle = `2px solid var(--color-border)`
            shadow      = '2px 2px 0px 0px var(--color-border)'
            textColor   = '#fff'
          } else if (failed) {
            bg          = '#ef4444'
            borderStyle = `2px solid #b91c1c`
            shadow      = '2px 2px 0px 0px #b91c1c'
            textColor   = '#fff'
            opacity     = '0.85'
          } else if (skipped) {
            bg          = 'var(--color-muted)'
            borderStyle = `1px solid var(--color-border)`
            opacity     = '0.75'
          } else if (missed) {
            bg          = missedColor
            opacity     = '0.5'
            borderStyle = `1px solid var(--color-border)`
          } else if (today) {
            borderStyle = `2px solid var(--color-accent)`
            textColor   = 'var(--color-accent)'
          }

          return (
            <button
              key={dateStr}
              disabled={!canToggle}
              onClick={() => canToggle && onCycleDate!(dateStr)}
              title={
                skipped ? `${dateStr} — skipped` :
                failed  ? `${dateStr} — failed`  :
                done    ? `${dateStr} — done`     : dateStr
              }
              className="font-body text-xs font-semibold h-8 w-full flex items-center justify-center transition-all active:scale-90 disabled:cursor-default relative overflow-hidden"
              style={{
                backgroundColor: bg,
                color: textColor,
                opacity,
                border: borderStyle,
                boxShadow: shadow,
                borderRadius: today
                  ? '8px 4px 8px 4px / 4px 8px 4px 8px'
                  : '3px 8px 3px 8px / 8px 3px 8px 3px',
              }}
            >
              {skipped && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'repeating-linear-gradient(135deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)',
                  }}
                />
              )}
              <span className="relative z-10">
                {skipped ? '—' : failed ? '✕' : dayNum}
              </span>
            </button>
          )
        })}
      </div>

      <div className="flex items-center justify-between mt-2">
        <p className="font-body text-[10px] text-ink/40">tap to cycle: done → failed → clear</p>
        <div className="flex gap-2">
          {Object.keys(skips).some(d => d.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)) && (
            <p className="font-body text-[10px] text-ink/40">― = skipped</p>
          )}
          {Object.keys(failures).some(d => d.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)) && (
            <p className="font-body text-[10px] text-ink/40">✕ = failed</p>
          )}
        </div>
      </div>
    </div>
  )
}
