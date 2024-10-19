import { BaseEvent } from "@undb/domain"
import { z } from "@undb/zod"
import { viewId } from "../modules"
import { viewFields } from "../modules/views/view/view-fields"
import { tableId } from "../table-id.vo"

const EVT_SET_VIEW_FIELDS = "table.view.fields.set" as const

export const setViewFieldsEventPayload = z.object({
  tableId: tableId,
  viewId: viewId,
  previous: viewFields.nullable(),
  fields: viewFields.nullable(),
})

export type ISetViewFieldsEventPayload = z.infer<typeof setViewFieldsEventPayload>

export class SetViewFieldsEvent extends BaseEvent<ISetViewFieldsEventPayload, typeof EVT_SET_VIEW_FIELDS> {
  name = EVT_SET_VIEW_FIELDS

  constructor(
    public readonly payload: ISetViewFieldsEventPayload,
    spaceId: string,
  ) {
    super(payload, undefined, spaceId)
  }
}
