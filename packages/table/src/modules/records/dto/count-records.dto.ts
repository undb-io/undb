import { z } from "@undb/zod"
import { tableId } from "../../../table-id.vo"
import { viewFilterGroup, viewId } from "../../views"

export const countRecordsDTO = z.object({
  tableId: tableId,
  viewId: viewId.optional(),
  q: z.string().optional(),
  filters: viewFilterGroup.optional(),
})

export type ICountRecordsDTO = z.infer<typeof countRecordsDTO>
