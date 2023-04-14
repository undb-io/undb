import type { Table } from '../table.js'
import { createFieldSchema, updateFieldSchema } from './field.type.js'

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
      if (checker.name && table.schema.fieldsNames.includes(checker.name)) {
        return false
      }
      return true
    },
    { message: 'A field with this name already exists.', path: ['name'] },
  )
}
