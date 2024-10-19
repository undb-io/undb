import { BaseEvent } from "@undb/domain"
import { z } from "@undb/zod"
import { fieldDTO } from "../modules"
import { tableId } from "../table-id.vo"

const EVT_FIELD_DELETED = "table.field.deleted" as const

export const fieldDeletedEventPayload = z.object({
  tableId: tableId,
  field: fieldDTO,
})

export type IFieldDeletedEventPayload = z.infer<typeof fieldDeletedEventPayload>

export class FieldDeletedEvent extends BaseEvent<IFieldDeletedEventPayload, typeof EVT_FIELD_DELETED> {
  name = EVT_FIELD_DELETED

  constructor(
    public readonly payload: IFieldDeletedEventPayload,
    spaceId: string,
  ) {
    super(payload, undefined, spaceId)
  }
}
