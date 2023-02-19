import * as z from 'zod'
import { baseFieldQuerySchema, createBaseFieldsSchema, updateBaseFieldSchema } from './field-base.schema'
import { FIELD_TYPE_KEY } from './field.constant.js'
import { RatingField } from './rating-field.js'

export const RATING_MAX = 10
export const RATING_MAX_DEFAULT = 5

export const ratingTypeSchema = z.literal('rating')
export type RatingFieldType = z.infer<typeof ratingTypeSchema>
const ratingTypeObjectSchema = z.object({ [FIELD_TYPE_KEY]: ratingTypeSchema })

export const createRatingFieldSchema = createBaseFieldsSchema
  .merge(ratingTypeObjectSchema)
  .merge(z.object({ max: z.number().positive().max(RATING_MAX).int().optional() }))

export type ICreateRatingFieldInput = z.infer<typeof createRatingFieldSchema>

export const updateRatingFieldSchema = updateBaseFieldSchema.merge(ratingTypeObjectSchema)
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
