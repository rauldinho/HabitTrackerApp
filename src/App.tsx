import { useState, useEffect, useRef } from 'react'
import { Plus, ChevronDown, ChevronRight } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useHabits } from './hooks/useHabits'
import { Header } from './components/Header'
import { HabitCard } from './components/HabitCard'
import { HabitFormModal } from './components/HabitFormModal'
import { fireAllDoneConfetti } from './utils/confetti'
import type { Habit, CompletionEntry } from './types'

// ── Dark mode hook ────────────────────────────────────────────
function useDarkMode() {
  const [dark, setDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('habit-dark-mode')
    if (saved !== null) return saved === 'true'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('habit-dark-mode', String(dark))
  }, [dark])
  return { dark, toggle: () => setDark(d => !d) }
}

// ── Sortable card wrapper ─────────────────────────────────────
interface SortableCardProps {
  habit: Habit
  completions: Record<string, CompletionEntry>
  skips: Record<string, {}>
  isTodayDone: boolean
  onToggleToday: () => void
  onToggleDate: (ds: string) => void
  onToggleSkipDate: (ds: string) => void
  onUpdate: (ch: Partial<Pick<Habit, 'name' | 'color' | 'icon' | 'skipsPerWeek'>>) => void
  onDelete: () => void
  onArchive: () => void
}

function SortableCard(props: SortableCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: props.habit.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <HabitCard
        {...props}
        isDragging={isDragging}
        dragHandleProps={{ ...attributes, ...listeners } as React.HTMLAttributes<HTMLDivElement>}
      />
    </div>
  )
}

// ── App ───────────────────────────────────────────────────────
export default function App() {
  const {
    habits, addHabit, updateHabit, deleteHabit, reorderHabits, archiveHabit,
    toggleToday, toggleDate, toggleSkip, isTodayDone, getCompletions, getSkips,
    exportData, importData,
  } = useHabits()

  const { dark, toggle } = useDarkMode()
  const [showAdd, setShowAdd] = useState(false)
  const [showArchived, setShowArchived] = useState(false)

  const active   = habits.filter(h => !h.archived)
  const archived = habits.filter(h => h.archived)

  // Confetti when all habits done
  const prevAllDone = useRef(false)
  const allDone = active.length > 0 && active.every(h => isTodayDone(h.id))
  useEffect(() => {
    if (allDone && !prevAllDone.current) setTimeout(fireAllDoneConfetti, 400)
    prevAllDone.current = allDone
  }, [allDone])

  // DnD sensors — pointer (mouse) + touch for mobile
  // TouchSensor has 200ms delay + 5px tolerance, so a fast horizontal swipe
  // (our swipe-to-complete) cancels it before drag activates.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor,   { activationConstraint: { delay: 200, tolerance: 5 } }),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active: dragActive, over } = event
    if (!over || dragActive.id === over.id) return
    const oldIndex = active.findIndex(h => h.id === dragActive.id)
    const newIndex = active.findIndex(h => h.id === over.id)
    const reordered = arrayMove(active, oldIndex, newIndex)
    reorderHabits(reordered.map(h => h.id))
  }

  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-md mx-auto pb-32">
        <Header
          onExport={exportData}
          onImport={importData}
          darkMode={dark}
          onToggleDark={toggle}
        />

        <main className="px-4 flex flex-col gap-3">
          {active.length === 0 && (
            <div
              className="text-center py-12 border-2 border-dashed border-border bg-card"
              style={{ borderRadius: '15px 255px 15px 225px / 225px 15px 255px 15px' }}
            >
              <p className="text-4xl mb-3">🌱</p>
              <p className="font-heading text-lg font-bold text-ink">No habits yet!</p>
              <p className="font-body text-sm text-ink/50 mt-1">tap + to start your first one</p>
            </div>
          )}

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={active.map(h => h.id)} strategy={verticalListSortingStrategy}>
              {active.map(habit => (
                <SortableCard
                  key={habit.id}
                  habit={habit}
                  completions={getCompletions(habit.id)}
                  skips={getSkips(habit.id)}
                  isTodayDone={isTodayDone(habit.id)}
                  onToggleToday={() => toggleToday(habit.id)}
                  onToggleDate={ds => toggleDate(habit.id, ds)}
                  onToggleSkipDate={ds => toggleSkip(habit.id, ds)}
                  onUpdate={ch => updateHabit(habit.id, ch)}
                  onDelete={() => deleteHabit(habit.id)}
                  onArchive={() => archiveHabit(habit.id)}
                />
              ))}
            </SortableContext>
          </DndContext>

          {archived.length > 0 && (
            <div className="mt-2">
              <button
                onClick={() => setShowArchived(a => !a)}
                className="font-body text-xs text-ink/50 hover:text-ink uppercase tracking-wide transition-colors flex items-center gap-1"
              >
                {showArchived
                  ? <ChevronDown size={12} strokeWidth={2.5} />
                  : <ChevronRight size={12} strokeWidth={2.5} />
                }
                Archived ({archived.length})
              </button>
              {showArchived && (
                <div className="flex flex-col gap-3 mt-3 opacity-60">
                  {archived.map(habit => (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      completions={getCompletions(habit.id)}
                      skips={getSkips(habit.id)}
                      isTodayDone={isTodayDone(habit.id)}
                      onToggleToday={() => toggleToday(habit.id)}
                      onToggleDate={ds => toggleDate(habit.id, ds)}
                      onToggleSkipDate={ds => toggleSkip(habit.id, ds)}
                      onUpdate={ch => updateHabit(habit.id, ch)}
                      onDelete={() => deleteHabit(habit.id)}
                      onArchive={() => archiveHabit(habit.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowAdd(true)}
        className="
          fixed bottom-6 right-5 w-14 h-14
          bg-card text-ink border-2 border-border shadow-hard-lg
          flex items-center justify-center
          hover:bg-ink hover:text-paper hover:border-ink
          hover:shadow-hard hover:-translate-x-0.5 hover:-translate-y-0.5
          active:shadow-none active:translate-x-1 active:translate-y-1
          transition-all duration-100
        "
        style={{ borderRadius: '8px 20px 8px 20px / 20px 8px 20px 8px' }}
        title="Add habit"
      >
        <Plus size={24} strokeWidth={3} />
      </button>

      {showAdd && (
        <HabitFormModal
          title="New habit"
          submitLabel="Add habit"
          onSubmit={addHabit}
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>
  )
}
