import { z } from "@undb/zod"
import { viewFilterGroup, viewId } from "../modules"
import { tableId } from "../table-id.vo"

export const setViewFilterDTO = z.object({
  tableId: tableId,
  viewId: viewId.optional(),
  filter: viewFilterGroup,
})

export type ISetViewFilterDTO = z.infer<typeof setViewFilterDTO>
