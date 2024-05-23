import type { SetViewAggregatesEvent } from "./set-view-aggregates.event"
import type { SetViewColorEvent } from "./set-view-color.event"
import type { SetViewFilterEvent } from "./set-view-filter.event"
import type { SetViewSortEvent } from "./set-view-sort.event"
import type { TableCreatedEvent } from "./table-created.event"

export * from "./set-table-rls.event"
export * from "./set-view-aggregates.event"
export * from "./set-view-color.event"
export * from "./set-view-filter.event"
export * from "./set-view-sort.event"
export * from "./table-created.event"

export type ITableEvents =
  | SetViewFilterEvent
  | SetViewColorEvent
  | TableCreatedEvent
  | SetViewSortEvent
  | SetViewAggregatesEvent
