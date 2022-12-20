import { z } from 'zod'

export const optionNameSchema = z.string().min(1)

export const optionSchema = z.object({
  name: optionNameSchema,
})

export type IOptionSchema = z.infer<typeof optionSchema>

export const createOptionSchema = z.object({
  name: optionNameSchema,
})

export type ICreateOptionSchema = z.infer<typeof createOptionSchema>

export const createOptionsSchema = createOptionSchema.array()

export type ICreateOptionsSchema = z.infer<typeof createOptionsSchema>
