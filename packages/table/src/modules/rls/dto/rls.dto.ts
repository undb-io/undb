import { z } from "@undb/zod"
import { tableRLSAction } from "../table-rls-action.vo"
import { tableRLSCondition } from "../table-rls-condition.vo"

export const rlsDTO = z.object({
  action: tableRLSAction,
  condition: tableRLSCondition,
})

export type IRLSDTO = z.infer<typeof rlsDTO>

export const rlsGroupDTO = rlsDTO.array()

export type IRLSGroupDTO = z.infer<typeof rlsGroupDTO>
