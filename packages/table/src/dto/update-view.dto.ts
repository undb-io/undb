import { z } from "@undb/zod"
import {
  updateCalendarViewDTO,
  updateGalleryViewDTO,
  updateGridViewDTO,
  updateKanbanViewDTO,
  updateListViewDTO,
  updatePivotViewDTO,
} from "../modules"

export const updateViewDTO = z.discriminatedUnion("type", [
  updateGridViewDTO,
  updateKanbanViewDTO,
  updateGalleryViewDTO,
  updateListViewDTO,
  updateCalendarViewDTO,
  updatePivotViewDTO,
])

export type IUpdateViewDTO = z.infer<typeof updateViewDTO>
