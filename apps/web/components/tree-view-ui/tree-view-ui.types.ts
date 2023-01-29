import type { UniqueIdentifier } from '@dnd-kit/core'
import type { MutableRefObject } from 'react'

export type SensorContext = MutableRefObject<{
  items: FlattenedSortableRecord[]
  offset: number
}>

interface TreeItem {
  id: UniqueIdentifier
  children: TreeItem[]
  collapsed?: boolean
}

export type SortableRecordItem = { id: UniqueIdentifier; children: TreeItem[]; collapsed?: boolean }
export type SortableRecordItems = SortableRecordItem[]

export interface FlattenedSortableRecord extends SortableRecordItem {
  parentId: UniqueIdentifier | null
  depth: number
  index: number
}
