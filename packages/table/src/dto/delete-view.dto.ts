import { z } from "@undb/zod"
import { viewId } from "../modules"
import { tableId } from "../table-id.vo"

export const deleteViewDTO = z.object({
  tableId,
  viewId: viewId.optional(),
})

export type IDeleteViewDTO = z.infer<typeof deleteViewDTO>
