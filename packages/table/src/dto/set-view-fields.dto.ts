import { z } from "@undb/zod"
import { viewId } from "../modules"
import { viewFields } from "../modules/views/view/view-fields"
import { tableId } from "../table-id.vo"

export const setViewFieldsDTO = z.object({
  tableId: tableId,
  viewId: viewId.optional(),
  fields: viewFields,
})

export type ISetViewFieldsDTO = z.infer<typeof setViewFieldsDTO>
