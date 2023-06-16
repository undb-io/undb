import type { IFieldType } from '@undb/core'
import { recordReadableValueSchemaMap } from '@undb/core'
import { type ZodType } from 'zod'

export const createOpenAPIRecordValueSchema = (): globalThis.Record<IFieldType, ZodType> => {
  const result = {} as globalThis.Record<IFieldType, ZodType>

  for (const [key, schema] of Object.entries(recordReadableValueSchemaMap)) {
    result[key as IFieldType] = schema.openapi({ description: key })
  }

  return result
}
