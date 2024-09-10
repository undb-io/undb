import { z } from "@undb/zod"
import { GALLERY_TYPE, type GalleryView } from "./variants/gallery-view.vo"
import { GRID_TYPE, type GridView } from "./variants/grid-view.vo"
import { KANBAN_TYPE, type KanbanView } from "./variants/kanban-view.vo"

export type View = GridView | KanbanView | GalleryView
export type ViewType = typeof GRID_TYPE | typeof KANBAN_TYPE | typeof GALLERY_TYPE

export const viewType = z.enum([GRID_TYPE, KANBAN_TYPE, GALLERY_TYPE])

export const viewTypes = [GRID_TYPE, KANBAN_TYPE, GALLERY_TYPE] as const
