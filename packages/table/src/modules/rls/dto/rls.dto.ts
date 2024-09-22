import { z } from "@undb/zod"
import { tableRLSAction } from "../table-rls-action.vo"
import { tableRLSCondition } from "../table-rls-condition.vo"
import { rlsId } from "../table-rls-id.vo"
import { tableRLSSubject } from "../table-rls-subject.vo"

export const rlsName = z.string().min(2)

export const rlsDTO = z.object({
  id: rlsId,
  name: rlsName,
  enabled: z.boolean(),
  action: tableRLSAction,
  allow: z.boolean(),
  subject: tableRLSSubject,
  condition: tableRLSCondition.optional(),
  updateCondition: tableRLSCondition.optional(),
})

export type IRLSDTO = z.infer<typeof rlsDTO>

export const rlsGroupDTO = rlsDTO.array()

export type IRLSGroupDTO = z.infer<typeof rlsGroupDTO>
