import type { SetViewFilterEvent } from "./set-view-filter.event"
import type { TableCreatedEvent } from "./table-created.event"

export * from "./set-view-filter.event"
export * from "./table-created.event"

export type ITableEvents = SetViewFilterEvent | TableCreatedEvent
