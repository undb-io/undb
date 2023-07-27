import { baseSchemaEventSchema, recordReadableSchema } from '@undb/core'
import { ValueObject } from '@undb/domain'
import { z } from 'zod'

export const recordUpdatedAuditDetail = z.object({
  previousSchema: baseSchemaEventSchema.nullable(),
  previousRecord: recordReadableSchema,
  schema: baseSchemaEventSchema,
  record: recordReadableSchema,
})

export type IRecordUpdatedAuditDetail = z.infer<typeof recordUpdatedAuditDetail>

export const recordDeletedAuditDetail = z.object({
  name: z.string(),
})

export type IRecordDeletedAuditDetail = z.infer<typeof recordDeletedAuditDetail>

export const recordRestoredAuditDetail = z.object({
  name: z.string(),
})

export type IRecordRestoredAuditDetail = z.infer<typeof recordRestoredAuditDetail>

export const auditDetail = z
  .record(z.any())
  .nullable()
  .or(recordUpdatedAuditDetail)
  .or(recordDeletedAuditDetail)
  .or(recordRestoredAuditDetail)

export type IAuditDetail = z.infer<typeof auditDetail>

export class AuditDetail extends ValueObject<IAuditDetail> {
  public get value() {
    return this.props
  }
}
