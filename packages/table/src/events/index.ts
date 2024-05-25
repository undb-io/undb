import type { FieldCreatedEvent } from "./field-created.event"
import type { SetViewAggregateEvent } from "./set-view-aggregate.event"
import type { SetViewColorEvent } from "./set-view-color.event"
import type { SetViewFilterEvent } from "./set-view-filter.event"
import type { SetViewSortEvent } from "./set-view-sort.event"
import type { TableCreatedEvent } from "./table-created.event"

export * from "./field-created.event"
export * from "./set-table-rls.event"
export * from "./set-view-aggregate.event"
export * from "./set-view-color.event"
export * from "./set-view-filter.event"
export * from "./set-view-sort.event"
export * from "./table-created.event"

export type ITableEvents =
  | SetViewFilterEvent
  | SetViewColorEvent
  | TableCreatedEvent
  | SetViewSortEvent
  | SetViewAggregateEvent
  | FieldCreatedEvent
