import { templateSchema } from '@undb/template'
import * as z from 'zod'

export const importTemplateCommandInput = z.object({
  template: templateSchema,
  includeRecords: z.boolean().optional(),
})
export type IImportTemplateInput = z.infer<typeof importTemplateCommandInput>
