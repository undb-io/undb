import { z } from 'zod'
import { virsualizationNameSchema } from './virsualization-name.vo.js'
import { virsualizationIdSchema, virsualizationTypeSchema } from './virsualization.type.js'

export const createVirsualizationSchema = z.object({
  id: virsualizationIdSchema.optional(),
  name: virsualizationNameSchema,
  type: virsualizationTypeSchema,
})

export type ICreateVirsualizationSchema = z.infer<typeof createVirsualizationSchema>

export const updateVirsualizationSchema = z.object({
  id: virsualizationIdSchema,
  name: virsualizationNameSchema.optional(),
})

export type IUpdateVirsualizationSchema = z.infer<typeof updateVirsualizationSchema>
