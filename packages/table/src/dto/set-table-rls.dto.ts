import { z } from "@undb/zod"
import { rlsGroupDTO } from "../modules"
import { tableId } from "../table-id.vo"

export const setTableRLSDTO = z.object({
  tableId: tableId,
  rls: rlsGroupDTO.nullable(),
})

export type ISetTableRLSDTO = z.infer<typeof setTableRLSDTO>
