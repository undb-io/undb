import { z } from 'zod'
import { createFieldValueSchema } from '../field'
import { fieldNameSchema } from '../field/value-objects/field-name.vo'

export const mutateRecordValueSchema = z
  .array(
    z.object({
      name: fieldNameSchema,
      value: createFieldValueSchema,
    }),
  )
  .min(1)
export type IMutateRecordValueSchema = z.infer<typeof mutateRecordValueSchema>
