import { z } from "@undb/zod"
import { GRID_TYPE, type GridView } from "./variants/grid-view.vo"

export type View = GridView
export type ViewType = typeof GRID_TYPE

export const viewType = z.literal(GRID_TYPE)
