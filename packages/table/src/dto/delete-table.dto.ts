import { z } from "@undb/zod"
import { tableId } from "../table-id.vo"

export const deleteTableDTO = z.object({
  tableId,
})

export type IDeleteTableDTO = z.infer<typeof deleteTableDTO>
