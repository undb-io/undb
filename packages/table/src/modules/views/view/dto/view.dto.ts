import { z } from "@undb/zod"
import { galleryViewDTO } from "../variants/gallery-view.vo"
import { gridViewDTO } from "../variants/grid-view.vo"
import { kanbanViewDTO } from "../variants/kanban-view.vo"

export const viewDTO = z.discriminatedUnion("type", [gridViewDTO, kanbanViewDTO, galleryViewDTO])

export type IViewDTO = z.infer<typeof viewDTO>
