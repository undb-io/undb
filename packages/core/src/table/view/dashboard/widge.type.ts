import { z } from 'zod'
import type { ChartVisualization, NumberVisualization } from '../../visualization/index.js'
import { visualizationSchema } from '../../visualization/index.js'
import { layoutSchema } from './layout.type.js'
import type { LayoutVO } from './layout.vo.js'
import type { WidgeID } from './widge-id.vo.js'
import { widgeIdSchema } from './widge-id.vo.js'

export const widgeSchema = z.object({
  id: widgeIdSchema,
  layout: layoutSchema,
  visualization: visualizationSchema.optional(),
})

export type IWidgeSchema = z.infer<typeof widgeSchema>

export type IWidge = {
  id: WidgeID
  layout: LayoutVO
  visualization?: NumberVisualization | ChartVisualization
}
