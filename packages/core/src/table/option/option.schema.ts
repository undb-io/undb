import { z } from 'zod'
import { colors } from '../../common/color.js'

export const optionNameSchema = z.string().trim().min(1)

export const optionIdSchema = z.string().min(1)

export const optionColorOrder = colors

export const optionColorName = z.enum(optionColorOrder)

export type IOptionColorName = z.infer<typeof optionColorName>

export const optionColorShade = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
  z.literal(7),
  z.literal(8),
  z.literal(9),
])

export type IOptionColorShade = z.infer<typeof optionColorShade>

export const optionColor = z.object({
  name: optionColorName,
  shade: optionColorShade,
})

export const optionSchema = z.object({
  key: optionIdSchema,
  name: optionNameSchema,
  color: optionColor,
})

export const optionsSchema = optionSchema.array()

export type IOptionSchema = z.infer<typeof optionSchema>
export type IOptionColor = z.infer<typeof optionColor>

export const createOptionColorSchema = optionColor.partial().strict()
export type ICreateOptionColorSchema = z.infer<typeof createOptionColorSchema>

export const mutateOptionSchema = z.object({
  key: optionIdSchema.optional(),
  name: optionNameSchema,
  color: createOptionColorSchema.optional(),
})

export type IMutateOptionSchema = z.infer<typeof mutateOptionSchema>

export const createOptionSchema = mutateOptionSchema
  .merge(
    z.object({
      key: optionIdSchema.optional(),
      name: optionNameSchema,
    }),
  )
  .strict()

export type ICreateOptionSchema = z.infer<typeof createOptionSchema>

export const createOptionsSchema = createOptionSchema.array()

export type ICreateOptionsSchema = z.infer<typeof createOptionsSchema>

export const updateOptionSchema = mutateOptionSchema

export type IUpdateOptionSchema = z.infer<typeof updateOptionSchema>

export const readableOptionSchema = z.object({
  id: optionIdSchema,
  name: optionNameSchema,
})
