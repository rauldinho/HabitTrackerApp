# Habit Tracker

A minimal, handcrafted habit tracking web app built with React + Vite. Designed for daily use on mobile and desktop, installable as a PWA.

![Habit Tracker](public/favicon.svg)

## Features

- **Track daily habits** — mark each day as done, skipped, or failed
- **Streak tracking** — current and best streak, including retroactive edits
- **14-day progress bar** — visual overview of recent activity per habit
- **Monthly calendar** — tap any past or future date to cycle its state: done → failed → clear
- **Skip days** — configure up to 2 allowed skips per week without breaking your streak
- **Drag to reorder** — reorder habits via drag and drop
- **Minimize cards** — collapse habits to a compact view for a cleaner list
- **Dark mode** — toggle between light and dark themes
- **PWA** — installable on Android and iOS (Add to Home Screen), runs offline
- **Export / Import** — backup and restore your data as JSON

## Tech Stack

- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) — build tool
- [Tailwind CSS](https://tailwindcss.com/) — utility-first styling
- [@dnd-kit](https://dndkit.com/) — drag and drop
- [Lucide React](https://lucide.dev/) — icons
- [canvas-confetti](https://github.com/catdad/canvas-confetti) — streak milestone celebrations
- Local Storage — all data is stored in the browser, no backend required

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Data

All habit data is stored in the browser's `localStorage` under the key `habit-tracker-v1`. No account or server needed. Use the **Export** button in the header to back up your data as a JSON file, and **Import** to restore it.

## PWA Installation

1. Open the app in **Chrome on Android** or **Safari on iOS**
2. Android: tap ⋮ → **Add to Home screen**
3. iOS: tap Share → **Add to Home Screen**

The app will open full-screen with no browser UI.

## License

MIT
