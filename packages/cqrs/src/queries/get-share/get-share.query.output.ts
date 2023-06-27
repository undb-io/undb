import { queryShare } from '@undb/integrations'
import * as z from 'zod'

export const getShareQueryOutput = z.object({
  share: queryShare.nullable(),
})
