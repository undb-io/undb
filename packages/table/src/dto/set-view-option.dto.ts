import { z } from "@undb/zod"
import { viewId } from "../modules"
import { viewOption } from "../modules/views/view/view-option.vo"
import { tableId } from "../table-id.vo"

export const setViewOptionDTO = z.object({
  tableId: tableId,
  viewId: viewId.optional(),
  option: viewOption,
})

export type ISetViewOptionDTO = z.infer<typeof setViewOptionDTO>
