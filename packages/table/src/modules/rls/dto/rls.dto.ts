import { z } from "@undb/zod"
import { tableRLSAction } from "../table-rls-action.vo"
import { tableRLSCondition } from "../table-rls-condition.vo"

export const rlsDTO = z
  .object({
    action: tableRLSAction,
    conditon: tableRLSCondition,
  })
  .array()

export type IRlsDTO = typeof rlsDTO
