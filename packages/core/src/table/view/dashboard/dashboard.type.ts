import { z } from 'zod'
import { createWidgetSchema } from './widget.schema.js'
import { widgetSchema } from './widget.type.js'
import type { Widget } from './widget.vo.js'

export const dashboardSchema = z.object({
  widgets: widgetSchema.array(),
})

export type IDashboardSchema = z.infer<typeof dashboardSchema>

export const createDashboardSchema = z.object({
  widgets: createWidgetSchema.array(),
})
export type ICreateDashboardSchema = z.infer<typeof createDashboardSchema>

export type IDashboard = {
  widgets: Widget[]
}
