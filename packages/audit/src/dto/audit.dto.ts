import { recordId, tableId } from "@undb/table"
import { z } from "@undb/zod"
import { auditDetail } from "../audit-detail.vo"
import { auditIdSchema } from "../audit-id.vo"

export const auditDTO = z.object({
  id: auditIdSchema,

  tableId,
  recordId,

  op: z.string(),
  operatorId: z.string(),
  timestamp: z.string(),
  detail: auditDetail,
})

export type IAuditDTO = z.infer<typeof auditDTO>
