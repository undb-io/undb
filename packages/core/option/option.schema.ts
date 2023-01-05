import { z } from 'zod'

export const optionNameSchema = z.string().min(1)

export const optionIdSchema = z.string().min(1)

export const optionColorOrder = [
  'dark',
  'gray',
  'red',
  'pink',
  'grape',
  'violet',
  'indigo',
  'blue',
  'cyan',
  'teal',
  'green',
  'lime',
  'yellow',
  'orange',
] as const

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
  id: optionIdSchema,
  name: optionNameSchema,
  color: optionColor,
})

export const optionsSchema = optionSchema.array()

export type IOptionSchema = z.infer<typeof optionSchema>
export type IOptionColor = z.infer<typeof optionColor>

export const createOptionColorSchema = optionColor.partial()
export type ICreateOptionColorSchema = z.infer<typeof createOptionColorSchema>

export const createOptionSchema = z.object({
  id: optionIdSchema.optional(),
  name: optionNameSchema,
  optionColor: createOptionColorSchema.optional(),
})

export type ICreateOptionSchema = z.infer<typeof createOptionSchema>

export const createOptionsSchema = createOptionSchema.array()

export type ICreateOptionsSchema = z.infer<typeof createOptionsSchema>
