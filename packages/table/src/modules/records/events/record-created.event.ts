import { BaseEvent } from "@undb/domain"
import { z } from "@undb/zod"
import { tableId } from "../../../table-id.vo"
import type { TableDo } from "../../../table.do"
import { readableRecordDTO, RecordDO, recordDTO, recordId } from "../record"
import { getTableMeta } from "./record-event.service"
import { recordEventTableMeta } from "./record-events-meta"

export const RECORD_CREATED_EVENT = "record.created" as const

export const recordCreatedEvent = z.object({
  id: recordId,
  tableId: tableId,
  record: readableRecordDTO,
})

export const recordCreatedMeta = z.object({
  table: recordEventTableMeta,
  record: recordDTO,
})

export type IRecordCreatedMeta = z.infer<typeof recordCreatedMeta>

export type IRecordCreatedEvent = z.infer<typeof recordCreatedEvent>

export class RecordCreatedEvent extends BaseEvent<
  IRecordCreatedEvent,
  typeof RECORD_CREATED_EVENT,
  IRecordCreatedMeta
> {
  name = RECORD_CREATED_EVENT

  static create(table: TableDo, record: RecordDO) {
    return new this(
      {
        id: record.id.value,
        tableId: table.id.value,
        record: record.toReadable(table),
      },
      {
        table: getTableMeta(table),
        record: record.toJSON(),
      },
      table.spaceId,
    )
  }

  enrich(table: TableDo, record: RecordDO): RecordCreatedEvent {
    return new RecordCreatedEvent(
      {
        id: record.id.value,
        tableId: table.id.value,
        record: record.toReadable(table),
      },
      {
        table: getTableMeta(table),
        record: record.toJSON(),
      },
      this.spaceId,
    )
  }
}
