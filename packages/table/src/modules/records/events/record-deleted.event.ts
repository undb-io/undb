import { BaseEvent } from "@undb/domain"
import { z } from "@undb/zod"
import { tableId } from "../../../table-id.vo"
import type { TableDo } from "../../../table.do"
import { RecordDO, recordDTO, recordId } from "../record"

export const RECORD_DELETED_EVENT = "record.deleted" as const

export const recordDeletedEvent = z.object({
  tableId: tableId,
  id: recordId,
})

export const recordDeletedMeta = z.object({
  record: recordDTO,
})

export type IRecordDeletedMeta = z.infer<typeof recordDeletedMeta>

export type IRecordDeletedEvent = z.infer<typeof recordDeletedEvent>

export class RecordDeletedEvent extends BaseEvent<
  IRecordDeletedEvent,
  typeof RECORD_DELETED_EVENT,
  IRecordDeletedMeta
> {
  name = RECORD_DELETED_EVENT

  static create(table: TableDo, record: RecordDO) {
    return new this(
      {
        id: record.id.value,
        tableId: table.id.value,
      },
      {
        record: record.toJSON(),
      },
    )
  }

  enrich(table: TableDo, record: RecordDO): RecordDeletedEvent {
    throw new Error("Method not implemented.")
  }
}
