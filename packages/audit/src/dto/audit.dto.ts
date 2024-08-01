import { RECORD_CREATED_EVENT, RECORD_DELETED_EVENT, RECORD_UPDATED_EVENT, recordId, tableId } from "@undb/table"
import { z } from "@undb/zod"
import { recordDeletedAuditDetail, recordUpdatedAuditDetail } from "../audit-detail.vo"
import { auditIdSchema } from "../audit-id.vo"

const baseAuditDTO = z.object({
  id: auditIdSchema,

  tableId,
  recordId,

  operatorId: z.string(),
  timestamp: z.string(),
  meta: z.any(),
})

const recordCreatedAudit = baseAuditDTO.merge(
  z.object({
    op: z.literal(RECORD_CREATED_EVENT),
    detail: z.null(),
  }),
)

const recordUpdatedAudit = baseAuditDTO.merge(
  z.object({
    op: z.literal(RECORD_UPDATED_EVENT),
    detail: recordUpdatedAuditDetail,
  }),
)

export type IRecordUpdatedAudit = z.infer<typeof recordUpdatedAudit>

const recordDeletedAudit = baseAuditDTO.merge(
  z.object({
    op: z.literal(RECORD_DELETED_EVENT),
    detail: recordDeletedAuditDetail,
  }),
)

export const auditDTO = z.discriminatedUnion("op", [recordCreatedAudit, recordUpdatedAudit, recordDeletedAudit])

export type IAuditDTO = z.infer<typeof auditDTO>
