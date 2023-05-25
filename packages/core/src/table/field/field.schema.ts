import { z } from 'zod'
import type { Table } from '../table.js'
import { createFieldSchema, updateFieldSchema } from './field.type.js'
import { fieldIdSchema } from './value-objects/field-id.schema.js'

export const createCreateFieldSchema = (table: Table) => {
  return createFieldSchema.refine(
    (checker) => {
      if (table.schema.fieldsNames.includes(checker.name)) {
        return false
      }
      return true
    },
    { message: 'A field with this name already exists.', path: ['name'] },
  )
}

export const createUpdateFieldSchema = (table: Table) => {
  return updateFieldSchema.refine(
    (checker) => {
      if (
        checker.name &&
        table.schema.fields
          .filter((f) => f.id.value !== checker.id)
          .map((f) => f.name.value)
          .includes(checker.name)
      ) {
        return false
      }
      return true
    },
    { message: 'A field with this name already exists.', path: ['name'] },
  )
}

export const duplicateFieldSchema = z.object({
  id: fieldIdSchema,
  includesValues: z.boolean().optional(),
})

export type IDuplicatedFieldSchema = z.infer<typeof duplicateFieldSchema>
