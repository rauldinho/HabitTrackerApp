import { useRef, useState } from 'react'

interface Options {
  onSwipeRight: () => void
  /** Horizontal distance (px) required to trigger the action. Default: 60 */
  threshold?: number
}

/**
 * Returns touch event handlers and a live `dragX` offset (0…threshold*1.3)
 * for animating the card following the user's finger.
 *
 * Works alongside @dnd-kit's TouchSensor (delay: 200ms) because a swipe
 * moves >5px quickly, automatically cancelling the drag sensor before it
 * activates — so the two gestures don't conflict.
 */
export function useSwipeGesture({ onSwipeRight, threshold = 60 }: Options) {
  const startX   = useRef(0)
  const startY   = useRef(0)
  const active   = useRef(false)
  const handled  = useRef(false)
  const dragXRef = useRef(0)

  const [dragX, setDragX] = useState(0)

  function onTouchStart(e: React.TouchEvent) {
    startX.current  = e.touches[0].clientX
    startY.current  = e.touches[0].clientY
    active.current  = true
    handled.current = false
  }

  function onTouchMove(e: React.TouchEvent) {
    if (!active.current) return
    const dx = e.touches[0].clientX - startX.current
    const dy = e.touches[0].clientY - startY.current

    // If gesture is more vertical than horizontal, cancel swipe
    if (Math.abs(dy) > Math.abs(dx) * 0.8) {
      active.current = false
      setDragX(0)
      dragXRef.current = 0
      return
    }

    // Only track rightward movement
    if (dx > 0) {
      e.preventDefault() // prevent scroll while swiping
      const clamped = Math.min(dx, threshold * 1.3)
      setDragX(clamped)
      dragXRef.current = clamped
    }
  }

  function onTouchEnd() {
    if (active.current && dragXRef.current >= threshold && !handled.current) {
      handled.current = true
      onSwipeRight()
    }
    active.current = false
    setDragX(0)
    dragXRef.current = 0
  }

  return {
    /** Current horizontal drag offset — apply as translateX for visual feedback */
    dragX,
    handlers: { onTouchStart, onTouchMove, onTouchEnd },
  }
}
