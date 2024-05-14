import type { z } from "zod"
import { gridViewDTO } from "../variants/grid-view.vo"

export const viewDTO = gridViewDTO

export type IViewDTO = z.infer<typeof viewDTO>
