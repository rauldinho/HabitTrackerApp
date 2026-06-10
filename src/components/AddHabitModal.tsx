import { useState } from 'react'
import { HABIT_COLORS } from '../types'

interface Props {
  onAdd: (name: string, color: string) => void
  onClose: () => void
}

export function AddHabitModal({ onAdd, onClose }: Props) {
  const [name, setName] = useState('')
  const [color, setColor] = useState(HABIT_COLORS[3].value) // default: green

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    onAdd(name.trim(), color)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-gray-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl">
        <h2 className="text-white font-bold text-lg mb-4">New habit</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name input */}
          <input
            autoFocus
            type="text"
            placeholder="e.g. Meditate, Exercise, Read…"
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={60}
            className="w-full bg-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
          />

          {/* Color picker */}
          <div>
            <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Color</p>
            <div className="flex gap-2 flex-wrap">
              {HABIT_COLORS.map(c => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`w-8 h-8 rounded-full ${c.value} transition-transform active:scale-90 ${
                    color === c.value ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-800 scale-110' : ''
                  }`}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-700 text-gray-300 rounded-xl py-3 text-sm font-medium hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 bg-white text-gray-900 rounded-xl py-3 text-sm font-bold disabled:opacity-40 hover:bg-gray-100 transition-colors"
            >
              Add habit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
