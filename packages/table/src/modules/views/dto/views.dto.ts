import type { z } from "@undb/zod"
import { viewDTO } from "../view/dto/view.dto"

export const viewsDTO = viewDTO.array()

export type IViewsDTO = z.infer<typeof viewsDTO>
