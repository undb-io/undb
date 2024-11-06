import { z } from "@undb/zod"
import { CALENDAR_TYPE, type CalendarView } from "./variants/calendar-view.vo"
import { GALLERY_TYPE, type GalleryView } from "./variants/gallery-view.vo"
import { GRID_TYPE, type GridView } from "./variants/grid-view.vo"
import { KANBAN_TYPE, type KanbanView } from "./variants/kanban-view.vo"
import { LIST_TYPE, type ListView } from "./variants/list-view.vo"

export type View = GridView | KanbanView | GalleryView | ListView | CalendarView
export type ViewType =
  | typeof GRID_TYPE
  | typeof KANBAN_TYPE
  | typeof GALLERY_TYPE
  | typeof LIST_TYPE
  | typeof CALENDAR_TYPE

export const viewType = z.enum([GRID_TYPE, KANBAN_TYPE, GALLERY_TYPE, LIST_TYPE, CALENDAR_TYPE])

export const viewTypes = [GRID_TYPE, KANBAN_TYPE, GALLERY_TYPE, LIST_TYPE, CALENDAR_TYPE] as const
