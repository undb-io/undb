import { z } from "@undb/zod"
import { tableRLS } from "../modules"
import { tableId } from "../table-id.vo"

export const setTableRLSDTO = z.object({
  tableId: tableId,
  rls: tableRLS.nullable(),
})

export type ISetTableRLSDTO = z.infer<typeof setTableRLSDTO>
