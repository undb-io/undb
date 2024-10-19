import type { FieldCreatedEvent } from "./field-created.event"
import type { FieldDeletedEvent } from "./field-deleted.event"
import type { FieldUpdatedEvent } from "./field-updated.event"
import type { SetTableFormEvent } from "./set-table-form.event"
import type { SetViewAggregateEvent } from "./set-view-aggregate.event"
import type { SetViewColorEvent } from "./set-view-color.event"
import type { SetViewFieldsEvent } from "./set-view-fields.event"
import type { SetViewFilterEvent } from "./set-view-filter.event"
import type { SetViewOptionEvent } from "./set-view-option.event"
import type { SetViewSortEvent } from "./set-view-sort.event"
import type { TableCreatedEvent } from "./table-created.event"
import type { TableDeletedEvent } from "./table-deleted.event"
import type { ViewCreatedEvent } from "./view-created.event"
import type { ViewDeletedEvent } from "./view-deleted.event"
import type { ViewUpdatedEvent } from "./view-updated.event"

export * from "./field-created.event"
export * from "./field-deleted.event"
export * from "./field-updated.event"
export * from "./set-table-form.event"
export * from "./set-table-rls.event"
export * from "./set-view-aggregate.event"
export * from "./set-view-color.event"
export * from "./set-view-fields.event"
export * from "./set-view-filter.event"
export * from "./set-view-option.event"
export * from "./set-view-sort.event"
export * from "./table-created.event"
export * from "./table-deleted.event"
export * from "./view-created.event"
export * from "./view-deleted.event"
export * from "./view-updated.event"

export type ITableEvents =
  | SetViewFilterEvent
  | SetViewColorEvent
  | TableCreatedEvent
  | SetViewSortEvent
  | SetViewOptionEvent
  | SetViewFieldsEvent
  | SetViewAggregateEvent
  | FieldCreatedEvent
  | SetTableFormEvent
  | FieldUpdatedEvent
  | FieldDeletedEvent
  | ViewCreatedEvent
  | ViewUpdatedEvent
  | ViewDeletedEvent
  | TableDeletedEvent
