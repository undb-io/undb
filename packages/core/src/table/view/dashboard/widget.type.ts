import { z } from 'zod'
import type { ChartVisualization, NumberVisualization } from '../../visualization/index.js'
import { visualizationSchema } from '../../visualization/index.js'
import { layoutSchema } from './layout.type.js'
import type { LayoutVO } from './layout.vo.js'
import type { WidgetID } from './widget-id.vo.js'
import { widgetIdSchema } from './widget-id.vo.js'

export const widgetSchema = z.object({
  id: widgetIdSchema,
  layout: layoutSchema,
  visualization: visualizationSchema.optional(),
})

export type IWidgetSchema = z.infer<typeof widgetSchema>

export type IWidget = {
  id: WidgetID
  layout: LayoutVO
  visualization?: NumberVisualization | ChartVisualization
}
