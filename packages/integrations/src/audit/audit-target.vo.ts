import { recordIdSchema } from '@undb/core'
import { ValueObject } from '@undb/domain'
import { z } from 'zod'

const auditTargetRecord = z.object({
  id: recordIdSchema,
  type: z.literal('record'),
})

export const auditTarget = auditTargetRecord

export type IAuditTarget = z.infer<typeof auditTarget>

export class AuditTarget extends ValueObject<IAuditTarget> {
  public get id() {
    return this.props.id
  }

  public get type() {
    return this.props.type
  }
}
