import { z } from 'zod'
import { virsualizationIdSchema } from './virsualization-id.vo.js'
import { virsualizationNameSchema } from './virsualization-name.vo.js'

export const virsualizationTypeSchema = z.enum(['number'])

export const virsualizationSchema = z.object({
  id: virsualizationIdSchema,
  name: virsualizationNameSchema,
  type: virsualizationTypeSchema,
})

export const baseCreateVirsualizationSchema = z.object({
  id: virsualizationIdSchema.optional(),
  name: virsualizationNameSchema,
  type: virsualizationTypeSchema,
})

export type IBaseCreateVirsualizationSchema = z.infer<typeof baseCreateVirsualizationSchema>

export const baseUpdateVirsualizationSchema = z.object({
  id: virsualizationIdSchema,
  type: virsualizationTypeSchema,
  name: virsualizationNameSchema.optional(),
})
