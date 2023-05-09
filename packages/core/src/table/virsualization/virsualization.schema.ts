import { z } from 'zod'
import { virsualizationIdSchema, virsualizationTypeSchema } from './virsualization.type.js'

export const createVirsualizationSchema = z.object({
  id: virsualizationIdSchema.optional(),
  type: virsualizationTypeSchema,
})

export type ICreateVirsualizationSchema = z.infer<typeof createVirsualizationSchema>
