import { objectify } from "radash"
import type { TableDo } from "../../../table.do"
import type { RecordDO } from "../record/record.do"
import type { IRecordTableMeta } from "./record-events-meta"

export function enrichRecord(table: TableDo, record: RecordDO, data: RecordDO): RecordDO {
  const events = record.domainEvents.map((event) => event.enrich(table, data))

  record.domainEvents = events

  return record
}

export function getTableMeta(table: TableDo, fields = table.schema.fields): IRecordTableMeta {
  return {
    name: table.name.value,
    fields: objectify(
      fields,
      (field) => field.name.value,
      (field) => ({
        id: field.id.value,
        type: field.type,
      }),
    ),
  }
}
