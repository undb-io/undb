import type { IFieldType } from '@undb/core'
import {
  attachmentFieldQueryValue,
  autoIncrementQueryValue,
  averageFieldQueryValue,
  boolFieldQueryValue,
  collaboratorProfile,
  colorFieldQueryValue,
  countFieldQueryValue,
  createdAtFieldQueryValue,
  currencyFieldQueryValue,
  dateFieldQueryValue,
  dateRangeFieldQueryValue,
  emailFieldQueryValue,
  idFieldQueryValue,
  lookupFieldQueryValue,
  numberFieldQueryValue,
  optionIdSchema,
  optionNameSchema,
  ratingFieldQueryValue,
  recordIdSchema,
  stringFieldQueryValue,
  sumFieldQueryValue,
  updatedAtFieldQueryValue,
} from '@undb/core'
import { COMPONENT_OPTION, COMPONENT_REFERENCE_ITEM, COMPONENT_USER } from 'src/constants'
import { z, type ZodType } from 'zod'

export const openAPIOptionSchema = z.object({
  id: optionIdSchema,
  name: optionNameSchema,
})

export const openApiUserSchema = z
  .object({
    id: z.string(),
  })
  .merge(collaboratorProfile)

export const openApiReferenceSchema = z.object({
  id: recordIdSchema,
  value: z.any().array(),
})

export const createOpenAPIRecordValueSchema = (): globalThis.Record<IFieldType, ZodType> => ({
  string: stringFieldQueryValue.openapi({ description: 'string' }),
  number: numberFieldQueryValue.openapi({ description: 'number' }),
  id: idFieldQueryValue.openapi({ description: 'id' }),
  'created-at': createdAtFieldQueryValue.openapi({ description: 'created-at' }),
  'updated-at': updatedAtFieldQueryValue.openapi({ description: 'updated-at' }),
  'auto-increment': autoIncrementQueryValue.openapi({ description: 'auto-increment' }),
  color: colorFieldQueryValue.openapi({ description: 'color' }),
  email: emailFieldQueryValue.openapi({ description: 'email' }),
  // jsonFieldQueryValue not valid for openapi
  json: z
    .record(z.any())
    .or(z.array(z.any()))
    .or(z.string())
    .or(z.null())
    .or(z.number())
    .openapi({ description: 'json' }),
  date: dateFieldQueryValue.openapi({ description: 'date' }),
  select: openAPIOptionSchema.openapi(COMPONENT_OPTION, { description: 'select' }),
  'multi-select': openAPIOptionSchema.openapi(COMPONENT_OPTION, { description: 'multi-select' }).array(),
  bool: boolFieldQueryValue.openapi({ description: 'boole' }),
  'date-range': dateRangeFieldQueryValue.openapi({ description: 'date-range' }),
  reference: openApiReferenceSchema.openapi(COMPONENT_REFERENCE_ITEM, { description: 'reference' }).array(),
  tree: openApiReferenceSchema.openapi(COMPONENT_REFERENCE_ITEM, { description: 'tree' }).array(),
  parent: openApiReferenceSchema.openapi(COMPONENT_REFERENCE_ITEM, { description: 'parent' }).nullable(),
  rating: ratingFieldQueryValue.openapi({ description: 'rating' }),
  currency: currencyFieldQueryValue.openapi({ description: 'currency' }),
  count: countFieldQueryValue.openapi({ description: 'count' }),
  lookup: lookupFieldQueryValue.openapi({ description: 'lookup' }),
  sum: sumFieldQueryValue.openapi({ description: 'sum' }),
  average: averageFieldQueryValue.openapi({ description: 'average' }),
  attachment: attachmentFieldQueryValue.openapi({ description: 'attachment' }),
  collaborator: openApiUserSchema.openapi(COMPONENT_USER, { description: 'collaborator' }).array(),
  'created-by': openApiUserSchema.openapi(COMPONENT_USER, { description: 'created-by' }),
  'updated-by': openApiUserSchema.openapi(COMPONENT_USER, { description: 'updated-by' }),
})
