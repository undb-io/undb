import { z } from 'zod'
import { virsualizationIdSchema } from './virsualization-id.vo.js'
import { virsualizationNameSchema } from './virsualization-name.vo.js'

export const virsualizationTypeSchema = z.enum(['number', 'chart'])

export const baseVirsualizationSchema = z.object({
  id: virsualizationIdSchema,
  name: virsualizationNameSchema,
})

export const baseCreateVirsualizationSchema = z.object({
  id: virsualizationIdSchema.optional(),
  name: virsualizationNameSchema,
})

export type IBaseCreateVirsualizationSchema = z.infer<typeof baseCreateVirsualizationSchema>

export const baseUpdateVirsualizationSchema = z.object({
  id: virsualizationIdSchema,
  name: virsualizationNameSchema.optional(),
})
