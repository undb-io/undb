import { BaseEvent } from "@undb/domain"
import { z } from "@undb/zod"
import { formDTO } from "../modules"
import { tableId } from "../table-id.vo"

const EVT_SET_TABLE_VIEW = "table.form.set" as const

export const setTableFormEventPayload = z.object({
  tableId: tableId,
  previous: formDTO.nullable(),
  form: formDTO.nullable(),
})

export type ISetTableFormEventPayload = z.infer<typeof setTableFormEventPayload>

export class SetTableFormEvent extends BaseEvent<ISetTableFormEventPayload, typeof EVT_SET_TABLE_VIEW> {
  name = EVT_SET_TABLE_VIEW

  constructor(
    public readonly payload: ISetTableFormEventPayload,
    spaceId: string,
  ) {
    super(payload, undefined, spaceId)
  }
}
