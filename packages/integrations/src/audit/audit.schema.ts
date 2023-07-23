import { collaboratorProfile, userIdSchema } from '@undb/core'
import { z } from 'zod'
import { auditDetail } from './audit-detail.vo.js'
import { auditIdSchema } from './audit-id.vo.js'
import { auditTarget } from './audit-target.vo.js'

export const queryAudit = z.object({
  id: auditIdSchema,
  op: z.string(),
  operator: collaboratorProfile.merge(z.object({ userId: userIdSchema })),
  target: auditTarget,
  timestamp: z.string(),
  detail: auditDetail,
})
