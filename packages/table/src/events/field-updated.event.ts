import { BaseEvent } from "@undb/domain"
import { z } from "@undb/zod"
import { fieldDTO } from "../modules"
import { tableId } from "../table-id.vo"

const EVT_FIELD_UPDATED = "table.field.updated" as const

export const fieldUpdatedEventPayload = z.object({
  tableId: tableId,
  previous: fieldDTO,
  field: fieldDTO,
})

export type IFieldUpdatedEventPayload = z.infer<typeof fieldUpdatedEventPayload>

export class FieldUpdatedEvent extends BaseEvent<IFieldUpdatedEventPayload, typeof EVT_FIELD_UPDATED> {
  name = EVT_FIELD_UPDATED

  constructor(
    public readonly payload: IFieldUpdatedEventPayload,
    spaceId: string,
  ) {
    super(payload, undefined, spaceId)
  }
}
