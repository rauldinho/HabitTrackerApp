import { Upload, Download, Moon, Sun } from 'lucide-react'

interface Props {
  onExport: () => void
  onImport: (file: File) => void
  darkMode: boolean
  onToggleDark: () => void
}

export function Header({ onExport, onImport, darkMode, onToggleDark }: Props) {
  function handleImportClick() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = () => {
      const file = input.files?.[0]
      if (file) onImport(file)
    }
    input.click()
  }

  const today = new Date()
  const dateLabel = today.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <header className="px-4 pt-10 pb-6">
      {/* Top row: logo left, actions right */}
      <div className="flex items-start justify-between">
        {/* Brand mark */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-10 h-10 bg-ink flex items-center justify-center flex-shrink-0 shadow-hard-sm"
            style={{ borderRadius: '10px 4px 10px 4px / 4px 10px 4px 10px' }}
          >
            <span style={{ fontSize: 20, lineHeight: 1 }}>✦</span>
          </div>
          <div>
            <h1
              className="font-heading text-2xl font-bold text-ink leading-none"
              style={{ transform: 'rotate(-0.8deg)', display: 'inline-block' }}
            >
              Habit Tracker
            </h1>
            <p className="font-body text-xs text-ink/50 mt-0.5 tracking-wide">{dateLabel}</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 items-center pt-0.5">
          <HeaderBtn onClick={onToggleDark} label={darkMode ? 'Light mode' : 'Dark mode'}>
            {darkMode ? <Sun size={15} strokeWidth={2.5} /> : <Moon size={15} strokeWidth={2.5} />}
          </HeaderBtn>
          <HeaderBtn onClick={handleImportClick} label="Import data">
            <Upload size={15} strokeWidth={2.5} />
          </HeaderBtn>
          <HeaderBtn onClick={onExport} label="Export data">
            <Download size={15} strokeWidth={2.5} />
          </HeaderBtn>
        </div>
      </div>

      {/* Decorative rule */}
      <div
        className="mt-5 border-t-2 border-border/30"
        style={{ borderStyle: 'dashed' }}
      />
    </header>
  )
}

function HeaderBtn({
  onClick,
  label,
  children,
}: {
  onClick: () => void
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className="
        w-9 h-9 flex items-center justify-center
        bg-card text-ink border-2 border-border
        wobbly-sm shadow-hard-sm
        hover:bg-ink hover:text-paper hover:border-ink
        hover:shadow-hard hover:translate-x-[-1px] hover:translate-y-[-1px]
        active:shadow-none active:translate-x-[2px] active:translate-y-[2px]
        transition-all duration-100
      "
    >
      {children}
    </button>
  )
}
