import { z } from "@undb/zod"
import { updateGridViewDTO, updateKanbanViewDTO } from "../modules"

export const updateViewDTO = z.discriminatedUnion("type", [updateGridViewDTO, updateKanbanViewDTO])

export type IUpdateViewDTO = z.infer<typeof updateViewDTO>
