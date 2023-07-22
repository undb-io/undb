import { collaboratorProfile } from '@undb/core'
import { z } from 'zod'
import { auditIdSchema } from './audit-id.vo.js'
import { auditTarget } from './audit-target.vo.js'

export const queryAudit = z.object({
  id: auditIdSchema,
  op: z.string(),
  operator: collaboratorProfile,
  target: auditTarget,
  timestamp: z.date(),
})
