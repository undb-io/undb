import { z } from "@undb/zod"
import { viewId } from "../modules"
import { viewColorGroup } from "../modules/views/view/view-color"
import { tableId } from "../table-id.vo"

export const setViewColorDTO = z.object({
  tableId: tableId,
  viewId: viewId.optional(),
  color: viewColorGroup,
})

export type ISetViewColorDTO = z.infer<typeof setViewColorDTO>
