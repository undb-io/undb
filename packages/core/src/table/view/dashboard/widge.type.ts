import { z } from 'zod'
import type { VirsualizationVO } from '../virsualization/index.js'
import { layoutSchema } from './layout.type.js'
import type { LayoutVO } from './layout.vo.js'

export const widgeSchema = z.object({
  layout: layoutSchema,
})

export type IWidgeSchema = z.infer<typeof widgeSchema>

export type IWidge = {
  layout: LayoutVO
  virtualization: VirsualizationVO
}
