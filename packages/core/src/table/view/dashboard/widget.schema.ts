import { z } from 'zod'
import { createVisualizationSchema } from '../../visualization/visualization.type.js'
import { createLayoutSchema } from './layout.schema.js'
import { layoutSchema } from './layout.type.js'
import { widgetIdSchema } from './widget-id.vo.js'

export const createWidgetSchema = z.object({
  id: widgetIdSchema.optional(),
  layout: createLayoutSchema,
  visualization: createVisualizationSchema.optional(),
})

export type ICreateWidgetSchema = z.infer<typeof createWidgetSchema>

export const relayoutWidgetSchema = z.object({
  id: widgetIdSchema,
  layout: layoutSchema,
})

export type IRelayoutWidgetSchema = z.infer<typeof relayoutWidgetSchema>
