import type { DraggableAttributes, DraggableSyntheticListeners } from '@dnd-kit/core'
import type { CSSProperties } from 'react'

export interface SortableProps {
  setNodeRef?: (node: HTMLElement | null) => void
  setActivatorNodeRef?: (node: HTMLElement | null) => void
  style?: CSSProperties
  attributes?: DraggableAttributes
  listeners?: DraggableSyntheticListeners
}
