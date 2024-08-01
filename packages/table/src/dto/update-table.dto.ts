import { z } from "@undb/zod"
import { tableId } from "../table-id.vo"
import { tableName } from "../table-name.vo"

export const updateTableDTO = z.object({
  id: tableId,
  name: tableName,
})

export type IUpdateTableDTO = z.infer<typeof updateTableDTO>
