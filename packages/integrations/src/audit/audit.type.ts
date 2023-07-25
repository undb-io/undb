import type { z } from 'zod'
import type { queryAudit } from './audit.schema.js'

export type IQueryAudit = z.infer<typeof queryAudit>
