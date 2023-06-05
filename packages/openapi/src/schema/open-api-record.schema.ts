import type { Table } from '@undb/core'
import type { ZodRawShape } from 'zod'
import { z } from 'zod'
import { createOpenAPIRecordValueSchema } from './record-value.schema'

export const createOpenAPIRecordSchema = (table: Table) => {
  const openAPIRecordValueSchema = createOpenAPIRecordValueSchema()
  const fields = table.schema.fields

  const shape: ZodRawShape = {}

  for (const field of fields) {
    shape[field.name.value] = openAPIRecordValueSchema[field.type]
  }

  return z.object(shape)
}
