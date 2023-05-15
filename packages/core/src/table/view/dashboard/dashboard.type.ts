import { z } from 'zod'
import { createWidgeSchema } from './widge.schema.js'
import { widgeSchema } from './widge.type.js'
import type { Widge } from './widge.vo.js'

export const dashboardSchema = z.object({
  widges: widgeSchema.array(),
})

export type IDashboardSchema = z.infer<typeof dashboardSchema>

export const createDashboardSchema = z.object({
  widges: createWidgeSchema.array(),
})
export type ICreateDashboardSchema = z.infer<typeof createDashboardSchema>

export type IDashboard = {
  widges: Widge[]
}
