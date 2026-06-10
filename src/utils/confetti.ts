import confetti from 'canvas-confetti'

export const STREAK_MILESTONES = [3, 7, 14, 21, 30, 60, 100]

export function isMilestone(streak: number): boolean {
  return STREAK_MILESTONES.includes(streak)
}

export function fireStreakConfetti(streak: number) {
  if (!isMilestone(streak)) return

  const isLegendary = streak >= 30

  if (isLegendary) {
    // Big burst for 30+ day milestones
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#ff4d4d', '#facc15', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'],
    })
    setTimeout(() => {
      confetti({ particleCount: 80, angle: 60, spread: 55, origin: { x: 0 } })
      confetti({ particleCount: 80, angle: 120, spread: 55, origin: { x: 1 } })
    }, 200)
  } else {
    // Modest burst for early milestones
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#ff4d4d', '#facc15', '#22c55e', '#3b82f6'],
    })
  }
}

export function fireAllDoneConfetti() {
  // Gentle shower for completing all habits today
  confetti({
    particleCount: 40,
    spread: 50,
    origin: { y: 0.7 },
    gravity: 0.8,
    colors: ['#ff4d4d', '#facc15', '#22c55e', '#3b82f6'],
    scalar: 0.9,
  })
}
