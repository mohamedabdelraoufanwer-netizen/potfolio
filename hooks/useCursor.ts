'use client'

import { useStore } from '@/store/useStore'
import type { CursorState } from '@/types'

export function useCursor() {
  const setCursorState = useStore((s) => s.setCursorState)

  const cursorHandlers = (state: CursorState) => ({
    onMouseEnter: () => setCursorState(state),
    onMouseLeave: () => setCursorState('default'),
  })

  return {
    cursorHandlers,
    onDefault: () => setCursorState('default'),
    onView: () => setCursorState('view'),
    onDrag: () => setCursorState('drag'),
    onOpen: () => setCursorState('open'),
    onLink: () => setCursorState('link'),
    onHidden: () => setCursorState('hidden'),
  }
}
