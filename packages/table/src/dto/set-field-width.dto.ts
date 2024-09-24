import { z } from "@undb/zod"
import { viewId } from "../modules"
import { fieldId } from "../modules/schema/fields/field-id.vo"
import { tableId } from "../table-id.vo"

export const setFieldWidthDTO = z.object({
  tableId: tableId,
  viewId: viewId.optional(),
  field: fieldId,
  width: z.number().positive(),
})

export type ISetFieldWidthDTO = z.infer<typeof setFieldWidthDTO>
