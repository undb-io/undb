import type { SetViewColorEvent } from "./set-view-color.event"
import type { SetViewFilterEvent } from "./set-view-filter.event"
import type { TableCreatedEvent } from "./table-created.event"

export * from "./set-view-filter.event"
export * from "./set-view-color.event"
export * from "./table-created.event"

export type ITableEvents = SetViewFilterEvent | SetViewColorEvent | TableCreatedEvent
