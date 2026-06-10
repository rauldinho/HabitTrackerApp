import { useState } from 'react'
import {
  ChevronDown, ChevronUp, MoreHorizontal, Check, Circle,
  GripVertical, Pencil, Archive, ArchiveRestore, Trash2, Minus,
} from 'lucide-react'
import { Habit, CompletionEntry } from '../types'
import { CalendarGrid } from './CalendarGrid'
import { WeekBar } from './WeekBar'
import { HabitFormModal } from './HabitFormModal'
import { HabitIcon } from './HabitIcon'
import { StreakBadge } from './StreakBadge'
import { calcStreaks, calcCompletionRate } from '../utils/streakUtils'
import { fireStreakConfetti, isMilestone } from '../utils/confetti'
import { useSwipeGesture } from '../hooks/useSwipeGesture'
import { todayStr, getWeekDays } from '../utils/dateUtils'

interface Props {
  habit: Habit
  completions: Record<string, CompletionEntry>
  skips: Record<string, {}>
  isTodayDone: boolean
  onToggleToday: () => void
  onToggleDate: (dateStr: string) => void
  onToggleSkipDate: (dateStr: string) => void
  onUpdate: (ch: Partial<Pick<Habit, 'name' | 'color' | 'icon' | 'skipsPerWeek'>>) => void
  onDelete: () => void
  onArchive: () => void
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>
  isDragging?: boolean
}

/** Map bg class → hex for icon tile background */
function bgHex(bg: string): string {
  const m: Record<string, string> = {
    'bg-red-500':'#ef4444','bg-orange-500':'#f97316','bg-yellow-400':'#facc15',
    'bg-green-500':'#22c55e','bg-teal-500':'#14b8a6','bg-blue-500':'#3b82f6',
    'bg-violet-500':'#8b5cf6','bg-pink-500':'#ec4899',
  }
  return m[bg] ?? '#6b7280'
}

export function HabitCard({
  habit, completions, skips, isTodayDone,
  onToggleToday, onToggleDate, onToggleSkipDate,
  onUpdate, onDelete, onArchive,
  dragHandleProps, isDragging,
}: Props) {
  const [expanded, setExpanded] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showEdit, setShowEdit] = useState(false)

  const today = new Date()
  const todayDs = todayStr()
  const { current, longest } = calcStreaks(completions, habit.createdAt, skips)
  const { weekly, monthly } = calcCompletionRate(completions, habit.createdAt, skips)
  const hex = bgHex(habit.color)

  // Skip state for today
  const isTodaySkipped = todayDs in skips
  const weekDays = getWeekDays(todayDs)
  const weekSkipsUsed = weekDays.filter(d => d in skips).length
  const canSkipToday = habit.skipsPerWeek > 0 && (isTodaySkipped || weekSkipsUsed < habit.skipsPerWeek)
  const skipsLeft = habit.skipsPerWeek - weekSkipsUsed

  // Swipe-to-complete gesture
  const { dragX, handlers: swipeHandlers } = useSwipeGesture({
    onSwipeRight: onToggleToday,
    threshold: 60,
  })

  function handleToggleToday() {
    if (!isTodayDone) {
      const nextStreak = current + 1
      if (isMilestone(nextStreak)) {
        setTimeout(() => fireStreakConfetti(nextStreak), 300)
      }
    }
    onToggleToday()
  }

  function handleSkipToday() {
    onToggleSkipDate(todayDs)
  }

  return (
    <>
      <div
        {...swipeHandlers}
        className={`bg-card border-2 border-border p-4 relative overflow-visible transition-shadow ${isDragging ? 'shadow-hard-lg opacity-80 rotate-1' : 'shadow-hard'}`}
        style={{
          borderRadius: '12px 180px 12px 12px / 12px 12px 180px 12px',
          transform: dragX > 0 ? `translateX(${dragX}px)` : undefined,
          transition: dragX === 0 ? 'transform 200ms ease-out, box-shadow 150ms' : 'box-shadow 150ms',
        }}
      >
        {/* Swipe hint — green flash behind card when dragging right */}
        {dragX > 30 && (
          <div
            className="absolute inset-0 pointer-events-none rounded-sm z-0"
            style={{
              backgroundColor: isTodayDone ? '#ef4444' : '#22c55e',
              opacity: Math.min((dragX - 30) / 30, 0.15),
            }}
          />
        )}

        {/* Top section: icon + name */}
        <div className="flex items-center gap-3 relative z-10">
          {/* Drag handle */}
          <div
            {...dragHandleProps}
            className="text-ink/30 hover:text-ink/70 cursor-grab active:cursor-grabbing touch-none flex-shrink-0 transition-colors"
            title="Drag to reorder"
          >
            <GripVertical size={16} strokeWidth={2} />
          </div>

          {/* Icon tile */}
          <div
            className="w-10 h-10 border-2 border-border flex items-center justify-center text-white flex-shrink-0 shadow-hard-sm"
            style={{
              backgroundColor: hex,
              borderRadius: '8px 4px 8px 4px / 4px 8px 4px 8px',
            }}
          >
            <HabitIcon name={habit.icon} size={18} />
          </div>

          {/* Name + badge — full remaining width */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <p className="font-heading font-bold text-ink text-base leading-tight line-clamp-2">
              {habit.name}
            </p>
            {current >= 3 && <StreakBadge streak={current} />}
          </div>
        </div>

        {/* Action buttons row */}
        <div className="flex items-center gap-2 mt-3 justify-end relative z-10">
          {/* Skip button — only shown if skipsPerWeek > 0 */}
          {habit.skipsPerWeek > 0 && (
            <button
              onClick={handleSkipToday}
              disabled={!canSkipToday && !isTodaySkipped}
              title={
                isTodaySkipped
                  ? 'Un-skip today'
                  : canSkipToday
                    ? `Skip today (${skipsLeft} left this week)`
                    : 'No skips left this week'
              }
              className="w-9 h-9 border-2 border-border flex items-center justify-center flex-shrink-0 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                backgroundColor: isTodaySkipped ? 'var(--color-muted)' : 'var(--color-card)',
                borderRadius: '10px',
                boxShadow: '2px 2px 0px 0px var(--color-border)',
                color: 'var(--color-ink)',
              }}
            >
              <Minus size={14} strokeWidth={2.5} />
            </button>
          )}

          {/* Check button */}
          <button
            onClick={handleToggleToday}
            disabled={isTodaySkipped}
            className="w-9 h-9 border-2 flex items-center justify-center flex-shrink-0 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              backgroundColor: isTodayDone ? hex : 'var(--color-card)',
              borderColor: isTodayDone ? hex : 'var(--color-border)',
              color: isTodayDone ? '#fff' : 'var(--color-ink)',
              borderRadius: '10px',
              boxShadow: isTodayDone ? `2px 2px 0px 0px ${hex}80` : '2px 2px 0px 0px var(--color-border)',
              opacity: isTodayDone ? 1 : 0.55,
            }}
            title={isTodaySkipped ? 'Day skipped' : isTodayDone ? 'Unmark today' : 'Mark done today'}
          >
            <Check size={16} strokeWidth={3} />
          </button>

          {/* Expand */}
          <button
            onClick={() => setExpanded(e => !e)}
            className="w-9 h-9 border-2 border-border bg-card text-ink/60 flex items-center justify-center flex-shrink-0 hover:bg-ink hover:text-paper hover:border-ink hover:-translate-x-0.5 hover:-translate-y-0.5 active:scale-90 transition-all duration-100"
            style={{ borderRadius: '10px', boxShadow: '2px 2px 0px 0px var(--color-border)' }}
          >
            {expanded
              ? <ChevronUp size={14} strokeWidth={2.5} />
              : <ChevronDown size={14} strokeWidth={2.5} />
            }
          </button>

          {/* Menu */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setShowMenu(m => !m)}
              className="w-9 h-9 border-2 border-border bg-card text-ink/60 flex items-center justify-center hover:bg-ink hover:text-paper hover:border-ink hover:-translate-x-0.5 hover:-translate-y-0.5 active:scale-90 transition-all duration-100"
              style={{ borderRadius: '10px', boxShadow: '2px 2px 0px 0px var(--color-border)' }}
            >
              <MoreHorizontal size={14} strokeWidth={2.5} />
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div
                  className="absolute right-0 top-10 border-2 border-border shadow-hard-lg z-50 min-w-[160px] overflow-hidden"
                  style={{
                    borderRadius: '4px 30px 4px 4px / 4px 4px 30px 4px',
                    backgroundColor: 'var(--color-paper)',
                    isolation: 'isolate',
                  }}
                >
                {[
                  {
                    icon: <Pencil size={14} strokeWidth={2.5} />,
                    label: 'Edit',
                    action: () => { setShowEdit(true); setShowMenu(false) },
                    red: false,
                  },
                  {
                    icon: habit.archived
                      ? <ArchiveRestore size={14} strokeWidth={2.5} />
                      : <Archive size={14} strokeWidth={2.5} />,
                    label: habit.archived ? 'Unarchive' : 'Archive',
                    action: () => { onArchive(); setShowMenu(false) },
                    red: false,
                  },
                  {
                    icon: <Trash2 size={14} strokeWidth={2.5} />,
                    label: 'Delete',
                    action: () => { if (confirm(`Delete "${habit.name}"?`)) onDelete(); setShowMenu(false) },
                    red: true,
                  },
                ].map(item => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className={`w-full flex items-center gap-3 px-4 py-3 font-body text-sm border-b border-border/30 last:border-0 hover:bg-muted transition-colors ${item.red ? 'text-accent' : 'text-ink'}`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* 14-day bar */}
        <WeekBar completions={completions} skips={skips} habitColor={habit.color} createdAt={habit.createdAt} />

        {/* Stats */}
        <div className="flex gap-2 mt-3">
          {[
            { label: 'Streak',  value: `${current}d`,  accent: current > 0 },
            { label: 'Best',    value: `${longest}d`,  accent: false },
            { label: '7-day',   value: `${weekly}%`,   accent: false },
            { label: '30-day',  value: `${monthly}%`,  accent: false },
          ].map(s => (
            <div
              key={s.label}
              className="flex-1 border border-border bg-paper py-1.5 text-center"
              style={{ borderRadius: '4px 12px 4px 12px / 12px 4px 12px 4px' }}
            >
              <div className={`font-heading font-bold text-sm ${s.accent ? 'text-accent' : 'text-ink'}`}>
                {s.value}
              </div>
              <div className="font-body text-[9px] text-ink/50 uppercase tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Skip info row */}
        {habit.skipsPerWeek > 0 && (
          <div className="mt-2 flex items-center justify-end gap-1">
            <span className="font-body text-[10px] text-ink/40">
              {isTodaySkipped
                ? 'today skipped'
                : weekSkipsUsed === 0
                  ? `${habit.skipsPerWeek} skip${habit.skipsPerWeek > 1 ? 's' : ''} available this week`
                  : weekSkipsUsed >= habit.skipsPerWeek
                    ? 'no skips left this week'
                    : `${skipsLeft} skip${skipsLeft > 1 ? 's' : ''} left this week`
              }
            </span>
          </div>
        )}

        {/* Calendar */}
        {expanded && (
          <CalendarGrid
            year={today.getFullYear()}
            month={today.getMonth()}
            completions={completions}
            skips={skips}
            habitColor={habit.color}
            createdAt={habit.createdAt}
            onToggleDate={onToggleDate}
          />
        )}
      </div>

      {showEdit && (
        <HabitFormModal
          title="Edit habit"
          submitLabel="Save changes"
          initial={{ name: habit.name, color: habit.color, icon: habit.icon, skipsPerWeek: habit.skipsPerWeek }}
          onSubmit={(name, color, icon, skipsPerWeek) => onUpdate({ name, color, icon, skipsPerWeek })}
          onClose={() => setShowEdit(false)}
        />
      )}
    </>
  )
}
