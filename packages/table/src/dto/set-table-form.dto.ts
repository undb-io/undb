import { z } from "@undb/zod"
import { viewId } from "../modules"
import { viewSort } from "../modules/views/view/view-sort"
import { tableId } from "../table-id.vo"

export const setViewSortDTO = z.object({
  tableId: tableId,
  viewId: viewId.optional(),
  sort: viewSort,
})

export type ISetViewSortDTO = z.infer<typeof setViewSortDTO>
