import { z } from "@undb/zod"
import { widgetId } from "../../../widgets/widget-id.vo"
import { widgetDTO } from "../../../widgets/widget.vo"
import { viewId } from "../view-id.vo"

export const createViewWidgetDTO = z.object({
  viewId: viewId,
  widget: widgetDTO,
})

export type ICreateViewWidgetDTO = z.infer<typeof createViewWidgetDTO>

export const updateViewWidgetDTO = z.object({
  viewId: viewId,
  widget: widgetDTO,
})

export type IUpdateViewWidgetDTO = z.infer<typeof updateViewWidgetDTO>

export const deleteViewWidgetDTO = z.object({
  id: widgetId,
  viewId: viewId,
})

export type IDeleteViewWidgetDTO = z.infer<typeof deleteViewWidgetDTO>

export const duplicateViewWidgetDTO = z.object({
  viewId: viewId,
  widgetId: widgetId,
})

export type IDuplicateViewWidgetDTO = z.infer<typeof duplicateViewWidgetDTO>
