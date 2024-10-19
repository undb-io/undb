import { BaseEvent } from "@undb/domain"
import { z } from "@undb/zod"
import { fieldDTO, formsDTO, viewsDTO } from "../modules"
import { tableId } from "../table-id.vo"

const EVT_FIELD_CREATED = "table.field.created" as const

export const fieldCreatedEventPayload = z.object({
  tableId: tableId,
  field: fieldDTO,
  views: viewsDTO.optional(),
  forms: formsDTO.optional(),
})

export type IFieldCreatedEventPayload = z.infer<typeof fieldCreatedEventPayload>

export class FieldCreatedEvent extends BaseEvent<IFieldCreatedEventPayload, typeof EVT_FIELD_CREATED> {
  name = EVT_FIELD_CREATED

  constructor(
    public readonly payload: IFieldCreatedEventPayload,
    spaceId: string,
  ) {
    super(payload, undefined, spaceId)
  }
}
