import { z } from 'zod'
import { createTableCommandInput } from './commands'
import { querySchemaSchema } from './field'
import { tableNameSchema } from './value-objects'
import { createViewInput_internal, queryViews } from './view'

export const createTableInput_internal = createTableCommandInput.merge(
  z.object({ views: z.array(createViewInput_internal).optional() }),
)

export type ICreateTableInput_internal = z.infer<typeof createTableInput_internal>

export const queryTable = z.object({
  id: z.string(),
  name: z.string(),
  schema: querySchemaSchema,
  views: queryViews,
})

export const editTableSchema = z
  .object({
    name: tableNameSchema,
  })
  .partial()

export type IEditTableSchema = z.infer<typeof editTableSchema>
