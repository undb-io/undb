import { z } from 'zod'
import { widgeSchema } from './widge.type.js'
import type { Widge } from './widge.vo.js'

export const dashboardSchema = z.object({
  widges: widgeSchema.array(),
})

export type IDashboardSchema = z.infer<typeof dashboardSchema>

export type IDashboard = {
  widges: Widge[]
}
