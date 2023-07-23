import { ValueObject } from '@undb/domain'
import { z } from 'zod'

export const auditDetail = z.record(z.any()).nullable()

export class AuditDetail extends ValueObject<z.infer<typeof auditDetail>> {}
