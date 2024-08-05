import { BaseEvent } from "@undb/domain"
import { z } from "@undb/zod"
import { tableId } from "../../../table-id.vo"
import type { TableDo } from "../../../table.do"
import { RecordDO, readableRecordDTO, recordDTO, recordId, type IReadableRecordDTO } from "../record"
import { getTableMeta } from "./record-event.service"
import { recordEventTableMeta } from "./record-events-meta"

export const RECORD_UPDATED_EVENT = "record.updated" as const

export const recordUpdatedEvent = z.object({
  id: recordId,
  tableId: tableId,
  previous: readableRecordDTO,
  record: readableRecordDTO,
})

export const recordUpdatedMeta = z.object({
  table: recordEventTableMeta,
  record: recordDTO,
})

export type IRecordUpdatedMeta = z.infer<typeof recordUpdatedMeta>

export type IRecordUpdatedEvent = z.infer<typeof recordUpdatedEvent>

export class RecordUpdatedEvent extends BaseEvent<
  IRecordUpdatedEvent,
  typeof RECORD_UPDATED_EVENT,
  IRecordUpdatedMeta
> {
  name = RECORD_UPDATED_EVENT

  static create(table: TableDo, previous: IReadableRecordDTO, record: IReadableRecordDTO, recordDo: RecordDO) {
    return new this(
      {
        id: recordDo.id.value,
        tableId: table.id.value,
        previous,
        record,
      },
      {
        table: getTableMeta(table),
        record: recordDo.toJSON(),
      },
      table.spaceId,
    )
  }

  enrich(table: TableDo, record: RecordDO): RecordUpdatedEvent {
    const fieldNames = Object.keys(this.payload.record.values)
    const fields = fieldNames.map((name) => table.schema.getFieldByName(name).unwrap())
    const fieldIds = fields.map((field) => field.id.value)

    return new RecordUpdatedEvent(
      {
        id: this.payload.id,
        tableId: table.id.value,
        previous: this.payload.previous,
        record: record.toReadable(table, new Set(fieldIds)),
      },
      {
        table: getTableMeta(table, fields),
        record: { ...record.toJSON(), id: this.payload.id },
      },
      this.spaceId,
    )
  }
}
