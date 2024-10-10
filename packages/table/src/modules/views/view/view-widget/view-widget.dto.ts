import { z } from "@undb/zod"
import { widgetDTO } from "../../../widgets/widget.vo"
import { viewId } from "../view-id.vo"

export const createViewWidgetDTO = z.object({
  viewId: viewId,
  widget: widgetDTO,
})

export type ICreateViewWidgetDTO = z.infer<typeof createViewWidgetDTO>
