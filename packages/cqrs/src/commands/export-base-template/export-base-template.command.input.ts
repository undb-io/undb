import { baseIdSchema } from '@undb/core'
import * as z from 'zod'

export const exportBaseTemplateCommandInput = z.object({
  baseId: baseIdSchema,
})

export type IExportBaseTemplateInput = z.infer<typeof exportBaseTemplateCommandInput>
