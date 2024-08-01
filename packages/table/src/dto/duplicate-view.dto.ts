import { z } from "@undb/zod"
import { viewId, viewName } from "../modules"
import { tableId } from "../table-id.vo"

export const duplicateViewDTO = z.object({
  tableId,
  viewId: viewId.optional(),
  name: viewName,
})

export type IDuplicateViewDTO = z.infer<typeof duplicateViewDTO>
