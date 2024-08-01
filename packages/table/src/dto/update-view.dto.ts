import { z } from "@undb/zod"
import { viewId, viewName } from "../modules"
import { tableId } from "../table-id.vo"

export const updateViewDTO = z.object({
  tableId,
  viewId: viewId.optional(),
  name: viewName,
})

export type IUpdateViewDTO = z.infer<typeof updateViewDTO>
