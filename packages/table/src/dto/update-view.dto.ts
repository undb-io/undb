import { z } from "@undb/zod"
import {
  updateCalendarViewDTO,
  updateGalleryViewDTO,
  updateGridViewDTO,
  updateKanbanViewDTO,
  updateListViewDTO,
} from "../modules"

export const updateViewDTO = z.discriminatedUnion("type", [
  updateGridViewDTO,
  updateKanbanViewDTO,
  updateGalleryViewDTO,
  updateListViewDTO,
  updateCalendarViewDTO,
])

export type IUpdateViewDTO = z.infer<typeof updateViewDTO>
