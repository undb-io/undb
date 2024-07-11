import { z } from "@undb/zod"
import { tableId } from "../../../table-id.vo"
import { viewFilterGroup } from "../../views"

export const countRecordsDTO = z.object({
  tableId: tableId,
  q: z.string().optional(),
  filters: viewFilterGroup.optional(),
})

export type ICountRecordsDTO = z.infer<typeof countRecordsDTO>
