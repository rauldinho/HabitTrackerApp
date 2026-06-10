interface Props { streak: number }

interface Level {
  min: number; emoji: string; label: string; bg: string; text: string
}

const LEVELS: Level[] = [
  { min: 100, emoji: '👑', label: '100+ days', bg: 'bg-yellow-100 dark:bg-yellow-900/40', text: 'text-yellow-700 dark:text-yellow-300' },
  { min: 60,  emoji: '🏆', label: '60+ days',  bg: 'bg-yellow-100 dark:bg-yellow-900/40', text: 'text-yellow-700 dark:text-yellow-300' },
  { min: 30,  emoji: '💎', label: '30+ days',  bg: 'bg-cyan-100  dark:bg-cyan-900/40',    text: 'text-cyan-700  dark:text-cyan-300'   },
  { min: 21,  emoji: '⚡', label: '21+ days',  bg: 'bg-violet-100 dark:bg-violet-900/40', text: 'text-violet-700 dark:text-violet-300'},
  { min: 14,  emoji: '🌟', label: '14+ days',  bg: 'bg-orange-100 dark:bg-orange-900/40', text: 'text-orange-700 dark:text-orange-300'},
  { min: 7,   emoji: '🔥', label: '7+ days',   bg: 'bg-red-100   dark:bg-red-900/40',     text: 'text-red-700   dark:text-red-300'   },
  { min: 5,   emoji: '⚡', label: '5+ days',   bg: 'bg-yellow-100 dark:bg-yellow-900/40', text: 'text-yellow-700 dark:text-yellow-300'},
  { min: 3,   emoji: '🌱', label: '3+ days',   bg: 'bg-green-100  dark:bg-green-900/40',  text: 'text-green-700  dark:text-green-300' },
]

export function StreakBadge({ streak }: Props) {
  if (streak < 3) return null
  const level = LEVELS.find(l => streak >= l.min) ?? LEVELS[LEVELS.length - 1]
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 border border-border wobbly-pill font-body text-[11px] font-semibold ${level.bg} ${level.text}`}
      title={`${streak} day streak`}
    >
      {level.emoji} {streak}d streak
    </span>
  )
}
