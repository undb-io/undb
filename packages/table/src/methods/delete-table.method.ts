import { TableDeletedEvent } from "../events/table-deleted.event"
import type { TableDo } from "../table.do"

export function deleteTable(this: TableDo): void {
  this.addDomainEvent(new TableDeletedEvent({ table: this.toJSON() }, this.spaceId))
}
