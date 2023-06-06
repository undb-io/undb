/* eslint-disable @typescript-eslint/no-unused-vars */
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
  parentFieldQueryValue,
  ratingFieldQueryValue,
  referenceFieldQueryValue,
  stringFieldQueryValue,
  sumFieldQueryValue,
  treeFieldQueryValue,
  updatedAtFieldQueryValue,
} from '@undb/core'
import { COMPONENT_OPTION, COMPONENT_USER } from 'src/constants'
import { z, type ZodType } from 'zod'

export const openAPIOptionSchema = z.object({
  id: optionIdSchema,
  name: optionNameSchema,
})

export const openApiUserScheam = z
  .object({
    id: z.string(),
  })
  .merge(collaboratorProfile)

export const createOpenAPIRecordValueSchema = (): globalThis.Record<IFieldType, ZodType> => ({
  string: stringFieldQueryValue,
  number: numberFieldQueryValue,
  id: idFieldQueryValue,
  'created-at': createdAtFieldQueryValue,
  'updated-at': updatedAtFieldQueryValue,
  'auto-increment': autoIncrementQueryValue,
  color: colorFieldQueryValue,
  email: emailFieldQueryValue,
  date: dateFieldQueryValue,
  select: openAPIOptionSchema.openapi(COMPONENT_OPTION),
  'multi-select': openAPIOptionSchema.openapi(COMPONENT_OPTION).array(),
  bool: boolFieldQueryValue,
  'date-range': dateRangeFieldQueryValue,
  reference: referenceFieldQueryValue,
  tree: treeFieldQueryValue,
  parent: parentFieldQueryValue,
  rating: ratingFieldQueryValue,
  currency: currencyFieldQueryValue,
  count: countFieldQueryValue,
  lookup: lookupFieldQueryValue,
  sum: sumFieldQueryValue,
  average: averageFieldQueryValue,
  attachment: attachmentFieldQueryValue,
  collaborator: openApiUserScheam.openapi(COMPONENT_USER).array(),
  'created-by': openApiUserScheam.openapi(COMPONENT_USER),
  'updated-by': openApiUserScheam.openapi(COMPONENT_USER),
})
