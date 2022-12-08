import { z } from 'zod'
import { createTableCommandInput } from './commands'
import { querySchemaSchema } from './field'
import type { IQueryTable } from './table.type'
import { createViewInput_internal, queryView } from './view'

export const createTableInput_internal = createTableCommandInput.merge(
  z.object({ defaultView: createViewInput_internal.optional() }),
)

export type ICreateTableInput_internal = z.infer<typeof createTableInput_internal>

export const queryTable: z.ZodType<IQueryTable> = z.object({
  id: z.string(),
  name: z.string(),
  schema: querySchemaSchema,
  defaultView: queryView,
})
