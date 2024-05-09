import { ValueObject } from '@undb/domain'
import { z } from 'zod'

export const mutateStringFieldValueSchema = z.union([
  z.string().optional(),
  z.object({
    type: z.literal('set'),
    value: z.string(),
  }),
  z.object({
    type: z.literal('append'),
    value: z.string(),
  }),
  z.object({
    type: z.literal('prepend'),
    value: z.string(),
  }),
])

export type IMutateStringFieldValueSchema = z.infer<typeof mutateStringFieldValueSchema>

export class StringFieldValue extends ValueObject<string> {
  constructor(value: string) {
    super({ value })
  }
}
