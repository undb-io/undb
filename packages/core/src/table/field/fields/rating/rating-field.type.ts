import * as z from 'zod'
import { baseFieldQuerySchema, createBaseFieldSchema, updateBaseFieldSchema } from '../../field-base.schema.js'
import { FIELD_TYPE_KEY } from '../../field.constants.js'
import type { IBaseField } from '../../field.type.js'
import { RatingField } from './rating-field.js'

export const RATING_MAX = 10
export const RATING_MAX_DEFAULT = 5

const ratingMaxSchema = z.number().positive().max(RATING_MAX).int().optional()

export const ratingTypeSchema = z.literal('rating')
export type RatingFieldType = z.infer<typeof ratingTypeSchema>
const ratingTypeObjectSchema = z.object({ [FIELD_TYPE_KEY]: ratingTypeSchema })

export const createRatingFieldSchema = createBaseFieldSchema
  .merge(ratingTypeObjectSchema)
  .merge(z.object({ max: ratingMaxSchema }))

export type ICreateRatingFieldInput = z.infer<typeof createRatingFieldSchema>

export const updateRatingFieldSchema = updateBaseFieldSchema
  .merge(ratingTypeObjectSchema)
  .merge(z.object({ max: ratingMaxSchema }).partial())

export type IUpdateRatingFieldInput = z.infer<typeof updateRatingFieldSchema>

export const ratingFieldQuerySchema = baseFieldQuerySchema
  .merge(ratingTypeObjectSchema)
  .merge(z.object({ max: z.number().positive().max(RATING_MAX).int() }))
export type IRatingFieldQuerySchema = z.infer<typeof ratingFieldQuerySchema>

export const ratingFieldValue = z.number().nonnegative().nullable()
export type IRatingFieldValue = z.infer<typeof ratingFieldValue>

export const createRatingFieldValue = ratingFieldValue
export type ICreateRatingFieldValue = z.infer<typeof createRatingFieldValue>

export const ratingFieldQueryValue = ratingFieldValue
export type IRatingFieldQueryValue = z.infer<typeof ratingFieldQueryValue>

export const createRatingFieldValue_internal = z
  .object({ value: createRatingFieldValue })
  .merge(ratingTypeObjectSchema)
  .merge(z.object({ field: z.instanceof(RatingField) }))
export type ICreateRatingFieldValue_internal = z.infer<typeof createRatingFieldValue_internal>

export const ratingReadableValueSchema = ratingFieldQueryValue

export type IRatingField = IBaseField & { max?: number }
