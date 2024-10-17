import { z } from "@undb/zod"
import { updateGalleryViewDTO, updateGridViewDTO, updateKanbanViewDTO, updateListViewDTO } from "../modules"

export const updateViewDTO = z.discriminatedUnion("type", [
  updateGridViewDTO,
  updateKanbanViewDTO,
  updateGalleryViewDTO,
  updateListViewDTO,
])

export type IUpdateViewDTO = z.infer<typeof updateViewDTO>
