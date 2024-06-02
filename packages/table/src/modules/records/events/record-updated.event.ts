import { BaseEvent } from "@undb/domain"
import { z } from "@undb/zod"
import { tableId } from "../../../table-id.vo"
import type { TableDo } from "../../../table.do"
import { RecordDO, RecordValuesVO, recordDTO, recordId, recordValues } from "../record"

export const RECORD_UPDATED_EVENT = "record.updated" as const

export const recordUpdatedEvent = z.object({
  id: recordId,
  tableId: tableId,
  previousValues: recordValues,
  values: recordValues,
})

export const recordUpdatedMeta = z.object({
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

  static create(table: TableDo, previousValues: RecordValuesVO, values: RecordValuesVO, record: RecordDO) {
    return new this(
      {
        id: record.id.value,
        tableId: table.id.value,
        previousValues: previousValues.toJSON(),
        values: values.toJSON(),
      },
      {
        record: record.toJSON(),
      },
    )
  }
}
