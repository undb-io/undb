import { z } from 'zod'
import { createVirsualizationSchema } from '../virsualization/virsualization.schema.js'
import { createLayoutSchema } from './layout.schema.js'
import { widgeIdSchema } from './widge-id.vo.js'

export const createWidgeSchema = z.object({
  id: widgeIdSchema.optional(),
  layout: createLayoutSchema,
  virtualization: createVirsualizationSchema,
})

export type ICreateWidgeSchema = z.infer<typeof createWidgeSchema>
