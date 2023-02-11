import * as z from 'zod'
import { baseFieldQuerySchema, createBaseFieldsSchema } from './field.base'
import { FIELD_TYPE_KEY } from './field.constant'
import { RatingField } from './rating-field'

export const ratingTypeSchema = z.literal('rating')
export type RatingFieldType = z.infer<typeof ratingTypeSchema>
const ratingTypeObjectSchema = z.object({ [FIELD_TYPE_KEY]: ratingTypeSchema })

export const createRatingFieldSchema = createBaseFieldsSchema.merge(ratingTypeObjectSchema)
export type ICreateRatingFieldInput = z.infer<typeof createRatingFieldSchema>

export const ratingFieldQuerySchema = baseFieldQuerySchema.merge(ratingTypeObjectSchema)

export const ratingFieldValue = z.number().nonnegative().int().nullable()
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
