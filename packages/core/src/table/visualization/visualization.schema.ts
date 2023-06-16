import { z } from 'zod'
import { visualizationIdSchema } from './visualization-id.vo.js'
import { visualizationNameSchema } from './visualization-name.vo.js'

export const visualizationTypeSchema = z.enum(['number', 'chart'])

export const baseVisualizationSchema = z.object({
  id: visualizationIdSchema,
  name: visualizationNameSchema,
})

export const baseCreateVisualizationSchema = z.object({
  id: visualizationIdSchema.optional(),
  name: visualizationNameSchema,
})

export type IBaseCreateVisualizationSchema = z.infer<typeof baseCreateVisualizationSchema>

export const baseUpdateVisualizationSchema = z.object({
  id: visualizationIdSchema,
  name: visualizationNameSchema.optional(),
})
