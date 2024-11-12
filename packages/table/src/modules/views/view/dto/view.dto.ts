import { z } from "@undb/zod"
import { calendarViewDTO } from "../variants/calendar-view.vo"
import { galleryViewDTO } from "../variants/gallery-view.vo"
import { gridViewDTO } from "../variants/grid-view.vo"
import { kanbanViewDTO } from "../variants/kanban-view.vo"
import { listViewDTO } from "../variants/list-view.vo"
import { pivotViewDTO } from "../variants/pivot-view.vo"

export const viewDTO = z.discriminatedUnion("type", [
  gridViewDTO,
  kanbanViewDTO,
  galleryViewDTO,
  listViewDTO,
  calendarViewDTO,
  pivotViewDTO,
])

export type IViewDTO = z.infer<typeof viewDTO>
