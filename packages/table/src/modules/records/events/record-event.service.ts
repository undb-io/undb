import type { TableDo } from "../../../table.do"
import type { RecordDO } from "../record/record.do"

export function enrichRecord(table: TableDo, record: RecordDO, data: RecordDO): RecordDO {
  const events = record.domainEvents.map((event) => event.enrich(table, data))

  record.domainEvents = events

  return record
}
