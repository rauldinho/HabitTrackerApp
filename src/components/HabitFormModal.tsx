import { useState } from 'react'
import { X } from 'lucide-react'
import { HABIT_COLORS, Habit } from '../types'
import { HabitIcon, HABIT_ICON_LIST } from './HabitIcon'

interface Props {
  initial?: Pick<Habit, 'name' | 'color' | 'icon' | 'skipsPerWeek'>
  title: string
  submitLabel: string
  onSubmit: (name: string, color: string, icon: string, skipsPerWeek: 0 | 1 | 2) => void
  onClose: () => void
}

const SKIP_OPTIONS: { value: 0 | 1 | 2; label: string; sub: string }[] = [
  { value: 0, label: 'Off',       sub: 'no skips' },
  { value: 1, label: '1 / week',  sub: 'one skip day' },
  { value: 2, label: '2 / week',  sub: 'two skip days' },
]

export function HabitFormModal({ initial, title, submitLabel, onSubmit, onClose }: Props) {
  const [name, setName]               = useState(initial?.name         ?? '')
  const [color, setColor]             = useState(initial?.color        ?? HABIT_COLORS[3].value)
  const [icon, setIcon]               = useState(initial?.icon         ?? 'Target')
  const [skipsPerWeek, setSkipsPerWeek] = useState<0 | 1 | 2>(initial?.skipsPerWeek ?? 1)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit(name.trim(), color, icon, skipsPerWeek)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-ink/75 backdrop-blur-md flex items-end sm:items-center justify-center z-50 p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="border-2 border-border shadow-hard-lg w-full max-w-sm p-5"
        style={{ borderRadius: '12px 180px 12px 12px / 12px 12px 180px 12px', backgroundColor: 'var(--color-paper)' }}
      >
        {/* Title bar */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-xl font-bold text-ink" style={{ transform: 'rotate(-1deg)' }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-ink border-2 border-border bg-card wobbly-sm shadow-hard-sm hover:bg-ink hover:text-paper hover:border-ink hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all duration-100"
          >
            <X size={14} strokeWidth={3} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name */}
          <div>
            <label className="font-body text-xs text-ink/60 uppercase tracking-wide block mb-1">
              Habit name
            </label>
            <input
              autoFocus
              type="text"
              placeholder="e.g. Meditate, Exercise, Read…"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={60}
              className="
                w-full bg-card text-ink font-body text-base
                border-2 border-border px-4 py-2.5
                focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary
                placeholder:text-ink/30
              "
              style={{ borderRadius: '8px 20px 8px 20px / 20px 8px 20px 8px' }}
            />
          </div>

          {/* Icon picker */}
          <div>
            <label className="font-body text-xs text-ink/60 uppercase tracking-wide block mb-2">
              Icon
            </label>
            <div className="grid grid-cols-7 gap-1.5 max-h-36 overflow-y-auto pr-0.5">
              {HABIT_ICON_LIST.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setIcon(key)}
                  title={label}
                  className="
                    flex items-center justify-center h-9
                    border-2 border-border bg-card text-ink
                    transition-all active:scale-90
                  "
                  style={{
                    borderRadius: icon === key
                      ? '4px 12px 4px 12px / 12px 4px 12px 4px'
                      : '3px 8px 3px 8px / 8px 3px 8px 3px',
                    backgroundColor: icon === key ? 'var(--color-accent)' : undefined,
                    color: icon === key ? '#fff' : undefined,
                    boxShadow: icon === key ? '2px 2px 0px 0px var(--color-border)' : 'none',
                  }}
                >
                  <HabitIcon name={key} size={16} />
                </button>
              ))}
            </div>
          </div>

          {/* Color picker */}
          <div>
            <label className="font-body text-xs text-ink/60 uppercase tracking-wide block mb-2">
              Color
            </label>
            <div className="flex gap-2 flex-wrap">
              {HABIT_COLORS.map(c => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  title={c.label}
                  className={`w-8 h-8 border-2 border-border transition-all active:scale-90 ${c.value}`}
                  style={{
                    borderRadius: color === c.value
                      ? '4px 12px 4px 12px / 12px 4px 12px 4px'
                      : '50%',
                    boxShadow: color === c.value ? '3px 3px 0px 0px var(--color-border)' : 'none',
                    transform: color === c.value ? 'scale(1.15) rotate(3deg)' : 'none',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Skip days */}
          <div>
            <label className="font-body text-xs text-ink/60 uppercase tracking-wide block mb-2">
              Skip days <span className="normal-case opacity-70">(preserve streak)</span>
            </label>
            <div className="flex gap-2">
              {SKIP_OPTIONS.map(opt => {
                const selected = skipsPerWeek === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSkipsPerWeek(opt.value)}
                    className="flex-1 py-2 font-body text-sm border-2 border-border transition-all active:scale-95"
                    style={{
                      borderRadius: '6px 14px 6px 14px / 14px 6px 14px 6px',
                      backgroundColor: selected ? 'var(--color-accent)' : 'var(--color-card)',
                      color: selected ? '#fff' : 'var(--color-ink)',
                      boxShadow: selected ? '2px 2px 0px 0px var(--color-border)' : 'none',
                      fontWeight: selected ? 700 : 400,
                    }}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
            {skipsPerWeek > 0 && (
              <p className="font-body text-[10px] text-ink/40 mt-1.5">
                Tap the ― button on a habit to use a skip day — streak stays alive.
              </p>
            )}
          </div>

          {/* Preview */}
          <div
            className="flex items-center gap-3 bg-card border-2 border-border px-4 py-2.5"
            style={{ borderRadius: '8px 20px 8px 8px / 8px 8px 20px 8px' }}
          >
            <div
              className={`w-9 h-9 border-2 border-border flex items-center justify-center text-white flex-shrink-0 ${color}`}
              style={{ borderRadius: '8px 4px 8px 4px / 4px 8px 4px 8px' }}
            >
              <HabitIcon name={icon} size={18} />
            </div>
            <span className="font-body text-ink text-sm truncate">
              {name || <span className="opacity-30">Habit name…</span>}
            </span>
            {skipsPerWeek > 0 && (
              <span className="ml-auto font-body text-[10px] text-ink/40 flex-shrink-0">
                {skipsPerWeek}× skip/wk
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="
                flex-1 font-body font-semibold text-sm py-3
                bg-card text-ink border-2 border-border wobbly-btn shadow-hard-sm
                hover:shadow-hard hover:-translate-x-0.5 hover:-translate-y-0.5
                active:shadow-none active:translate-x-0.5 active:translate-y-0.5
                transition-all duration-100
              "
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="
                flex-1 font-body font-bold text-sm py-3
                bg-ink text-paper border-2 border-border wobbly-btn shadow-hard-sm
                hover:shadow-hard hover:-translate-x-0.5 hover:-translate-y-0.5
                active:shadow-none active:translate-x-0.5 active:translate-y-0.5
                disabled:opacity-40
                transition-all duration-100
              "
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
