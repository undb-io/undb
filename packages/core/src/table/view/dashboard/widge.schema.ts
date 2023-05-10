import { z } from 'zod'
import { createVirsualizationSchema } from '../../virsualization/virsualization.schema.js'
import { createLayoutSchema } from './layout.schema.js'
import { layoutSchema } from './layout.type.js'
import { widgeIdSchema } from './widge-id.vo.js'

export const createWidgeSchema = z.object({
  id: widgeIdSchema.optional(),
  layout: createLayoutSchema,
  virsualization: createVirsualizationSchema.optional(),
})

export type ICreateWidgeSchema = z.infer<typeof createWidgeSchema>

export const relayoutWidgeSchema = z.object({
  id: widgeIdSchema,
  layout: layoutSchema,
})

export type IRelayoutWidgeSchema = z.infer<typeof relayoutWidgeSchema>
