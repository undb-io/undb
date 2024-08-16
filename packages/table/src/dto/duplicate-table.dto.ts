import { z } from "@undb/zod"
import { tableId } from "../table-id.vo"

export const duplicateTableDTO = z.object({
  tableId,
})

export type IDuplicateTableDTO = z.infer<typeof duplicateTableDTO>
