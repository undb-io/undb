import { z } from "@undb/zod"
import { updateGalleryViewDTO,updateGridViewDTO,updateKanbanViewDTO } from "../modules"

export const updateViewDTO = z.discriminatedUnion("type", [updateGridViewDTO, updateKanbanViewDTO, updateGalleryViewDTO])

export type IUpdateViewDTO = z.infer<typeof updateViewDTO>
