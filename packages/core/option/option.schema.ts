import { z } from 'zod'

export const optionNameSchema = z.string().min(1)

export const optionSchema = z.object({
  name: optionNameSchema,
})

export type IOptionSchema = z.infer<typeof optionSchema>
