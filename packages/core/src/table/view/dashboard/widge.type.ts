import { z } from 'zod'
import type { VirsualizationVO } from '../virsualization/index.js'
import { virsualizationSchema } from '../virsualization/index.js'
import { layoutSchema } from './layout.type.js'
import type { LayoutVO } from './layout.vo.js'
import type { WidgeID } from './widge-id.vo.js'
import { widgeIdSchema } from './widge-id.vo.js'

export const widgeSchema = z.object({
  id: widgeIdSchema,
  layout: layoutSchema,
  virsualization: virsualizationSchema,
})

export type IWidgeSchema = z.infer<typeof widgeSchema>

export type IWidge = {
  id: WidgeID
  layout: LayoutVO
  virsualization: VirsualizationVO
}
