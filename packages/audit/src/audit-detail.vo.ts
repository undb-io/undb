import { ValueObject } from "@undb/domain"
import { readableRecordDTO } from "@undb/table"
import { z } from "zod"

export const recordUpdatedAuditDetail = z.object({
  previous: readableRecordDTO,
  record: readableRecordDTO,
})

export type IRecordUpdatedAuditDetail = z.infer<typeof recordUpdatedAuditDetail>

export const recordDeletedAuditDetail = z.object({
  name: z.string(),
})

export type IRecordDeletedAuditDetail = z.infer<typeof recordDeletedAuditDetail>

export const auditDetail = z.record(z.any()).nullable().or(recordUpdatedAuditDetail).or(recordDeletedAuditDetail)

export type IAuditDetail = z.infer<typeof auditDetail>

export class AuditDetail extends ValueObject<IAuditDetail> {
  public get value() {
    return this.props
  }
}
