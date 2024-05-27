import { BaseEvent } from "@undb/domain"
import { z } from "@undb/zod"
import { tableId } from "../../../table-id.vo"
import type { TableDo } from "../../../table.do"
import { RecordDO, recordId, recordValues } from "../record"

export const RECORD_CREATED_EVENT = "record.created" as const

export const recordCreatedEvent = z.object({
  id: recordId,
  tableId: tableId,
  values: recordValues,
})

export type IRecordCreatedEvent = z.infer<typeof recordCreatedEvent>

export class RecordCreatedEvent extends BaseEvent<IRecordCreatedEvent, typeof RECORD_CREATED_EVENT> {
  name = RECORD_CREATED_EVENT

  constructor(table: TableDo, record: RecordDO) {
    super(
      {
        id: record.id.value,
        tableId: table.id.value,
        values: record.values.toJSON(),
      },
      undefined,
    )
  }
}
