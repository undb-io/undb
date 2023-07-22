import { queryAudit } from '@undb/integrations'
import * as z from 'zod'

export const getRecordAuditsQueryOutput = z.object({
  audits: queryAudit.array(),
})
