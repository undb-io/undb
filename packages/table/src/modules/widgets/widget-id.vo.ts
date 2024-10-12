import { IdFactory } from "@undb/domain"
import { z } from "@undb/zod"

const prefix = "wid"
const size = 6

export const widgetId = z.string().startsWith(prefix).or(z.string())
export type IWidgetId = z.infer<typeof widgetId>

export const WidgetIdVo = IdFactory(prefix, size, widgetId)

export type WidgetId = InstanceType<typeof WidgetIdVo>
