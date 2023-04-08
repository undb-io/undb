import type { UniqueIdentifier } from '@dnd-kit/core'
import type { RecordAllValues } from '@undb/core'
import type { MutableRefObject } from 'react'

export type SensorContext = MutableRefObject<{
  items: FlattenedSortableRecord[]
  offset: number
}>

export type SortableRecordItem = {
  id: UniqueIdentifier
  children: SortableRecordItem[]
  values: RecordAllValues
  collapsed?: boolean
}
export type SortableRecordItems = SortableRecordItem[]

export interface FlattenedSortableRecord extends SortableRecordItem {
  parentId: UniqueIdentifier | null
  depth: number
  index: number
}
