import { z } from 'zod'
import { baseIdSchema } from '../base/value-objects/base-id.vo.js'
import { querySchemaSchema } from './field/index.js'
import { createFormsSchema, queryForms } from './form/form.schema.js'
import type { Table } from './table.js'
import {
  createTableSchemaSchema,
  tableIdSchema,
  tableNameSchema,
  updateTableSchemaSchema,
} from './value-objects/index.js'
import { tableEmojiSchema } from './value-objects/table-emoji.vo.js'
import { createViewInput_internal, queryViews, viewsOrderSchema } from './view/index.js'

export const createViewsSchema = z.array(createViewInput_internal).optional()
export type ICreateViewsSchema = z.infer<typeof createViewsSchema>

export const createTableInput = z.object({
  id: tableIdSchema.optional(),
  name: tableNameSchema,
  emoji: tableEmojiSchema.optional(),
  baseId: baseIdSchema.optional(),
  schema: createTableSchemaSchema,
})

export type ICreateTableInput = z.infer<typeof createTableInput>

export const createTableInput_internal = createTableInput.merge(
  z.object({
    views: createViewsSchema.optional(),
    viewsOrder: viewsOrderSchema.optional(),
    forms: createFormsSchema.optional(),
  }),
)

export type ICreateTableInput_internal = z.infer<typeof createTableInput_internal>

export const queryTable = z.object({
  id: z.string(),
  name: z.string(),
  baseId: baseIdSchema.optional(),
  emoji: tableEmojiSchema.optional(),
  schema: querySchemaSchema,
  views: queryViews,
  viewsOrder: viewsOrderSchema.optional(),
  forms: queryForms.optional(),
})

export const updateTableSchema = z
  .object({
    name: tableNameSchema,
    emoji: tableEmojiSchema.optional(),
    schema: updateTableSchemaSchema,
  })
  .partial()

export const createUpdateTableSchema = (table: Table) => {
  return z
    .object({
      name: tableNameSchema.default(table.name.value),
      emoji: tableEmojiSchema.default(table.emoji.unpack() ?? null),
      schema: updateTableSchemaSchema.default(table.schema.fields.map((field) => field.json as any)),
    })
    .partial()
}

export type IUpdateTableSchema = z.infer<typeof updateTableSchema>
