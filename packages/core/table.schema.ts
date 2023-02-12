import { z } from 'zod'
import { createTableCommandInput } from './commands/index.js'
import { querySchemaSchema } from './field/index.js'
import { tableNameSchema } from './value-objects/index.js'
import { createViewInput_internal, queryViews } from './view/index.js'

const createViewsSchema = z.array(createViewInput_internal).optional()
export type ICreateViewsSchema = z.infer<typeof createViewsSchema>

export const createTableInput_internal = createTableCommandInput.merge(z.object({ views: createViewsSchema }))

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
