import { z } from "@undb/zod"
import { rlsDTO } from "../modules"
import { tableId } from "../table-id.vo"

export const setTableRLSDTO = z.object({
  tableId: tableId,
  rls: rlsDTO.nullable(),
})

export type ISetTableRLSDTO = z.infer<typeof setTableRLSDTO>
